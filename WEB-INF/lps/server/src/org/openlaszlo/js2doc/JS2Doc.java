/* *****************************************************************************
 * JS2Doc.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2006-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.js2doc;

import java.io.*;
import java.util.*;
import java.util.logging.*;
import java.util.regex.*;
import org.openlaszlo.js2doc.JS2DocUtils.InternalError;
import org.openlaszlo.sc.Compiler;
import org.openlaszlo.sc.parser.*;
import org.openlaszlo.utils.FileUtils;
import org.w3c.dom.*;

/**
  * 
  *
  */
public class JS2Doc {

    static private Logger logger = Logger.getLogger("org.openlaszlo.js2doc");
    
    static public class DocumentationError extends RuntimeException {
        /** Constructs an instance.
         * @param message a string
         */
        public DocumentationError(String message) {
            super("js2doc Error " + message);
        }
    }

    private static class Visitor {

        String baseDirectory;
        String relativeBase;
        String libraryID;
        String unitID;
        String objectID;
        ConditionalState currentState;
        
        Set runtimeOptions;
        Map runtimeAliases;
        List buildOptions;
        
        // TODO [jgrandy 12/3/2006] turn into parameter
        static private String unitCommentMarker = "copyright";
        
        public Visitor (String baseDirectory,
                        String relativeBase,
                        String libraryID,
                        Set runtimeOptions,
                        Map runtimeAliases,
                        List buildOptions) {
                        
            this.baseDirectory = baseDirectory;
            this.relativeBase = relativeBase;
            this.libraryID = libraryID;
            this.unitID = null;
            this.objectID = null;
            this.runtimeOptions = new HashSet(runtimeOptions);
            this.runtimeAliases = new HashMap(runtimeAliases);
            this.buildOptions = new ArrayList(buildOptions);
            this.currentState = new ConditionalState(ConditionalState.trueValue, this.runtimeOptions, this.buildOptions);
        }
        
        public Visitor (Visitor previous) {
            this(previous.baseDirectory, previous.relativeBase, previous.libraryID, previous.runtimeOptions, previous.runtimeAliases, previous.buildOptions);
        }
        
        public void setConditionalState(ConditionalState startingState) {
            if (startingState == null)
                this.currentState = new ConditionalState(ConditionalState.trueValue, this.runtimeOptions, this.buildOptions);
            else
                this.currentState = new ConditionalState(startingState);
        }
        
        public void visitToplevelStatement(SimpleNode parseNode, org.w3c.dom.Element docNode) {
            //logger.fine(parseNode.getClass().getName());
            if (parseNode instanceof ASTProgram ||
                parseNode instanceof ASTStatement ||
                parseNode instanceof ASTDirectiveBlock) {
                SimpleNode[] children = parseNode.getChildren();
                for (int i = 0; i < children.length; i++) {
                    this.visitToplevelStatement(children[i], docNode);
                }
            } else if (parseNode instanceof ASTVariableStatement) {
                visitVariableStatement(parseNode, docNode);
            } else if (parseNode instanceof ASTAssignmentExpression) {
                visitTopLevelAssignmentExpression(parseNode, docNode);
            } else if (parseNode instanceof ASTFunctionDeclaration) {
                visitFunctionDeclaration(parseNode, docNode);
            } else if (parseNode instanceof ASTClassDefinition) {
                visitClassDeclaration(parseNode, docNode, null);
            } else if (parseNode instanceof ASTIfDirective) {
                visitTopLevelIfDirective(parseNode, docNode);
            } else if (parseNode instanceof ASTIncludeDirective) {
                visitIncludeDirective(parseNode, docNode, true);
            } else if (parseNode instanceof ASTCallExpression) {
                visitCallExpression(parseNode, docNode);
            } else if (parseNode instanceof ASTModifiedDefinition) {
                visitModifiedDefinition(parseNode, docNode);
            } else if (parseNode instanceof ASTPragmaDirective) {
                // do nothing
            } else {
                logger.warning("Unhandled toplevel statement type " + parseNode.getClass().getName());
            }
        }
        
        public void visitUnit(SimpleNode parseNode, org.w3c.dom.Element docNode, String unitPath) {
            String oldUnitID = this.unitID;
            try {
                org.w3c.dom.Element unitNode = docNode.getOwnerDocument().createElement("unit");
                docNode.appendChild(unitNode);
    
                String comment = parseNode.getComment();
                if (comment != null) {
                    Comment parsedComment = Comment.extractFirstJS2DocFromCommentSequence(comment);
                    if (parsedComment != null && parsedComment.hasField(unitCommentMarker))
                        this.processComment(unitNode, parsedComment);
                }
                
                // no need to use java.io.File.separatorChar here, since the separator
                // will appear unix-style (as '/') in the source code
                String relativePath = this.relativeBase + '/' + unitPath;
                // relativeBase may (erroneously) start with a '/', or may be the empty
                // string, so cover both cases here to ensure we have a truly relative
                // path.
                if (relativePath.charAt(0) == '/')
                    relativePath = relativePath.substring(1);
                
                unitNode.setAttribute("path", relativePath);
                //unitNode.setAttribute("path", unitPath);

                // no need to use java.io.File.separatorChar here, since the separator
                // will appear unix-style (as '/') in the source code
                this.unitID = unitPath.replace('/', '.').replace(' ', '_');
                if (this.libraryID != null)
                    this.unitID = this.libraryID + "." + this.unitID;
                unitNode.setAttribute("id", this.unitID);
                
                //System.out.println("visiting '" + this.unitID + "' from '" + oldUnitID + "'");
                
                if (oldUnitID != null)
                    unitNode.setAttribute("unitid", oldUnitID);
    
                describeConditionalState(unitNode);

                // *don't* nest -- we're building a flat list            
                this.visitToplevelStatement(parseNode, docNode);
            } finally {
                this.unitID = oldUnitID;
            }
        }
        
        protected void visitVariableStatement(SimpleNode parseNode, org.w3c.dom.Element docNode) {
            VariableDeclarationsInfo decls = collectVariableDeclarations(parseNode);
            SimpleNode[] vars = decls.variables;
            for (int i = 0; i < vars.length; i++) {
                this.visitVariableDeclaration(vars[i], docNode, decls.commonComment);
            }
        }
        
        class VariableDeclarationsInfo {
            String commonComment;
            SimpleNode[] variables;
        }
        
        protected VariableDeclarationsInfo collectVariableDeclarations(SimpleNode parseNode)
        {
            VariableDeclarationsInfo decls = new VariableDeclarationsInfo();
            
            SimpleNode[] children = parseNode.getChildren();
            checkChildrenLowerBounds(parseNode, 1, 1, "collectVariableDeclarations");

            SimpleNode child = children[0];
            decls.commonComment = parseNode.getComment();
            if (child instanceof ASTVariableDeclaration) {
                decls.variables = children;
            } else if (child instanceof ASTStatementList) {
                // children of StatementList are VariableDeclarations
                decls.variables = child.getChildren();
            } else {
                throw new InternalError("Unexpected node type in collectVariableDeclarations" + parseNode.getClass().getName(), parseNode);
            }
            return decls;
        }
        
        private void processObjectLiteral(ASTObjectLiteral objectLiteralNode, org.w3c.dom.Element objectNode) {
            SimpleNode[] children = objectLiteralNode.getChildren();
    
            int i = 0;
            while (i < children.length) {
                SimpleNode idNode = children[i++];
                SimpleNode valueNode = children[i++];
                
                String ivarName;
                if (idNode instanceof ASTIdentifier) {
                    ivarName = ((ASTIdentifier) idNode).getName();
                    
                    PropertyReference propRef = new PropertyReference(objectNode, ivarName, this.currentState);
        
                    String comment = objectLiteralNode.getComment();
                    if (comment == null)
                        comment = idNode.getComment();
                    if (comment == null)
                        comment = valueNode.getComment();
    
                    propRef.redefineProperty(comment);
                    
                    if (propRef.hasProperty())
                        propRef.redefineValue(valueNode);
                    else
                        logger.warning("couldn't redefine object ivar value b/c ivar name couldn't be resolved");
                }
            }
        }
        
        protected void visitVariableDeclaration(SimpleNode parseNode, org.w3c.dom.Element docNode, String commonComment) {
            
            SimpleNode[] children = parseNode.getChildren();
            // child 1 is the variable name, child 2 is the (optional) initial value
            checkChildrenLowerBounds(parseNode, 1, 2, "visitVariableDeclaration");
            
            ASTIdentifier nameNode = (ASTIdentifier) children[0];
            String propertyName = nameNode.getName();
            
            PropertyReference propRef = new PropertyReference(docNode, propertyName, this.currentState);
            
            String comment = parseNode.getComment();
            if (comment == null) {
                comment = commonComment;
            } else if (commonComment != null) {
                logger.warning("Conflict between comments associated with property declaration and property statement; choosing comment closer to declaration");
            }

            org.w3c.dom.Element property = propRef.redefineProperty(comment);

            if (this.unitID != null)
                property.setAttribute("unitid", unitID);
            
            if (children.length == 2) {
                if (propRef.hasProperty()) {
                    SimpleNode valueNode = children[1];
                    propRef.redefineValue(valueNode);
                    
                    if (valueNode instanceof ASTObjectLiteral) {
                        this.processObjectLiteral((ASTObjectLiteral) valueNode, propRef.getValue());
                    }
                    
                } else
                    logger.warning("tried to redefine variable decl but variable was not found");
            }
        }

        protected boolean isClassName(org.w3c.dom.Element docNode, String nm) {
            org.w3c.dom.Element root = docNode;
            while (root.getParentNode() != null && !"js2doc".equals(root.getNodeName())) {
                root = (org.w3c.dom.Element)root.getParentNode();
            }
            org.w3c.dom.Element prop = JS2DocUtils.findFirstChildElementWithAttribute(root, "property", "name", nm);
            if (prop == null) {
                return false;
            }
            org.w3c.dom.Node cl = JS2DocUtils.firstChildNodeWithName(prop, "class");
            return (cl != null);
        }

        /**
         * Determine if we should process an assignment statement.
         */
        protected boolean shouldProcessSimpleAssignment(org.w3c.dom.Element docNode,
                                                        SimpleNode lhs,
                                                        SimpleNode op,
                                                        SimpleNode rhs) {

            if (((ASTOperator)op).getOperator() != ParserConstants.ASSIGN) {
                return false;
            }

            // TODO [dda 2008/05/15] workaround for LPP-5995.  When
            // static variable has been already defined and is now
            // being assigned, the doc attached to the assigment
            // (which is typically *nothing*) is clobbering all the
            // doc attached to the static variable declaration.  We
            // recognize and avoid this situation here by preventing
            // the doc for the assignment from being processed.  But
            // the real solution to this has to do with getting the
            // property reference for the lhs of the assignment to
            // resolve properly to the existing static class element.
            //
            if (lhs instanceof ASTPropertyIdentifierReference &&
                lhs.size() == 2) {
                SimpleNode l = lhs.getChildren()[0];
                if (l instanceof ASTIdentifier &&
                    isClassName(docNode, ((ASTIdentifier)l).getName())) {
                    return false;
                }
            }
            return true;
        }

        protected void visitTopLevelAssignmentExpression(SimpleNode parseNode, org.w3c.dom.Element docNode) {
            // child 1 is the lhs, child 2 is the assignment operator, child 3 is the rhs
            checkChildrenLowerBounds(parseNode, 3, 3, "visitTopLevelAssignmentExpression");
            SimpleNode[] children = parseNode.getChildren();
            
            SimpleNode lhs = children[0],
                        op = children[1],
                       rhs = children[2];
            
            if (shouldProcessSimpleAssignment(docNode, lhs, op, rhs)) {

                try {
                    PropertyReference propRef = this.resolveBinding(docNode, lhs, this.currentState);
                    
                    if (propRef.isValid()) {
                        org.w3c.dom.Element property = propRef.redefineProperty(parseNode.getComment());
                        if (this.unitID != null)
                            property.setAttribute("unitid", unitID);
                        
                        if (propRef.hasProperty()) {
                            propRef.redefineValue(rhs);

                            if (rhs instanceof ASTObjectLiteral) {
                                this.processObjectLiteral((ASTObjectLiteral) rhs, propRef.getValue());
                            }
                            
                        } else
                            logger.warning("tried to redefine property but couldn't resolve property reference");
                    } else {
                        logger.fine("unresolved assignment target");
                    }
                } catch (JS2DocUtils.InternalError e) {
                    logger.warning("error while processing toplevel assignment expression (rhs)");
                }
            }
        }
        
        protected void visitFunctionDeclaration(SimpleNode parseNode, org.w3c.dom.Element docNode) {
            SimpleNode[] children = parseNode.getChildren();
            // child 1 is the function name, child 2 is the parameter list, child 3 is the function body
            checkChildrenLowerBounds(parseNode, 3, 3, "visitFunctionDeclaration");
            
            ASTIdentifier nameNode = (ASTIdentifier) children[0];
            String fnName = nameNode.getName();

            PropertyReference propRef = new PropertyReference(docNode, fnName, this.currentState);

            org.w3c.dom.Element property = propRef.redefineProperty(parseNode.getComment());

            if (this.unitID != null)
                property.setAttribute("unitid", unitID);
            
            if (propRef.hasProperty())
                propRef.redefineValue(parseNode);
            else
                logger.warning("tried to redefine function but couldn't resolve function name");
        }
        
        protected void visitClassDeclaration(SimpleNode parseNode, org.w3c.dom.Element docNode, ASTModifiedDefinition moddef) {
            SimpleNode[] children = parseNode.getChildren();
            checkChildrenLowerBounds(parseNode, 2, 0, "visitClassDefinition");
            
            ASTIdentifier nameNode = (ASTIdentifier) children[1];
            String className = nameNode.getName();

            SimpleNode parseNodeForDoc = (moddef != null) ? moddef : parseNode;

            PropertyReference propRef = new PropertyReference(docNode, className, this.currentState);

            org.w3c.dom.Element property = propRef.redefineProperty(parseNodeForDoc.getComment());

            if (this.unitID != null)
                property.setAttribute("unitid", unitID);
            
            org.w3c.dom.Element classNode = propRef.redefineValue(parseNode);
            
            if (classNode == null)
                throw new InternalError("null element returned from PropertyReference.redefineValue", parseNode);
                
            if (children.length > 4) {
                String oldObjectID = this.objectID;
                ConditionalState oldState = this.currentState;
                try {
                    this.objectID = property.getAttribute("id");
                    
                    this.currentState = new ConditionalState(ConditionalState.trueValue, this.runtimeOptions, this.buildOptions);
                    
                    final int n = children.length;
                    for (int i=4; i<n; i++) {
                        SimpleNode decl = children[i];
                        this.visitClassStatement(decl, classNode, null);
                    }
                } finally {
                    this.objectID = oldObjectID;
                    this.currentState = oldState;
                }
            }
        }
        
        protected void visitClassStatement(SimpleNode parseNode, org.w3c.dom.Element docNode, ASTModifiedDefinition moddef) {
            if (parseNode instanceof ASTStatement ||
                parseNode instanceof ASTClassDirectiveBlock) {
                SimpleNode[] children = parseNode.getChildren();
                for (int i = 0; i < children.length; i++) {
                    this.visitClassStatement(children[i], docNode, null);
                }
            } else if (parseNode instanceof ASTVariableStatement) {
                visitFieldStatement(parseNode, docNode, moddef, null);
            } else if (parseNode instanceof ASTFunctionDeclaration) {
                visitMethodDeclaration(parseNode, docNode, moddef, null);
            } else if (parseNode instanceof ASTCallExpression) {
                visitCallExpression(parseNode, docNode);
            } else if (parseNode instanceof ASTAssignmentExpression) {
                visitClassAssignmentExpression(parseNode, docNode);
            } else if (parseNode instanceof ASTClassIfDirective) {
                visitClassIfDirective(parseNode, docNode);
            } else if (parseNode instanceof ASTIncludeDirective) {
                visitIncludeDirective(parseNode, docNode, false);
            } else if (parseNode instanceof ASTModifiedDefinition) {
                visitModifiedDefinition(parseNode, docNode);
            } else if (parseNode instanceof ASTPragmaDirective) {
                // do nothing
            } else {
                logger.warning("Unhandled class statement type " + parseNode.getClass().getName());
            }
        }
        
        protected void visitFieldStatement(SimpleNode parseNode, org.w3c.dom.Element docNode, ASTModifiedDefinition moddef, String commonComment) {
            VariableDeclarationsInfo decls = collectVariableDeclarations(parseNode);
            String comment = (decls.commonComment != null) ? decls.commonComment : commonComment;
            SimpleNode[] vars = decls.variables;
            for (int i = 0; i < vars.length; i++) {
                this.visitFieldDeclaration(vars[i], docNode, comment, moddef.isStatic());
            }
        }
        
        protected org.w3c.dom.Element ensurePrototypeNode(org.w3c.dom.Element docNode)
        {
            PropertyReference propRef = new PropertyReference(docNode, "prototype", null);
            propRef.ensureProperty();
            return propRef.getValue();
        }
        
        protected org.w3c.dom.Element ensureIVarsNode(org.w3c.dom.Element docNode)
        {
            PropertyReference propRef = new PropertyReference(docNode, "__ivars__", null);
            propRef.ensureProperty();
            return propRef.getValue();
        }
        
        protected void visitFieldDeclaration(SimpleNode parseNode, org.w3c.dom.Element docNode, String commonComment, boolean isStatic) {
            SimpleNode[] children = parseNode.getChildren();
            checkChildrenLowerBounds(parseNode, 1, 2, "visitFieldDeclaration");
            
            ASTIdentifier nameNode = (ASTIdentifier) children[0];
            String fieldName = nameNode.getName();

            org.w3c.dom.Element targetNode = docNode;

            if (isStatic == false)
                targetNode = this.ensureIVarsNode(docNode);
   
            if (targetNode != null) {
                PropertyReference propRef = new PropertyReference(targetNode, fieldName, this.currentState);
    
                String comment = parseNode.getComment();
                if (comment == null) {
                    comment = commonComment;
                } else if (commonComment != null) {
                    logger.warning("Conflict between comments associated with property declaration and property statement; choosing comment closer to declaration");
                }

                propRef.redefineProperty(comment);
                
                if (children.length > 1) {
                    if (propRef.hasProperty())
                        propRef.redefineValue(children[1]);
                    else
                        logger.warning("couldn't redefine field value b/c field name couldn't be resolved");
                }
            }
        }
        
        protected void visitMethodDeclaration(SimpleNode parseNode, org.w3c.dom.Element docNode, ASTModifiedDefinition moddef, String comment) {
            SimpleNode[] children = parseNode.getChildren();
            checkChildrenLowerBounds(parseNode, 3, 3, "visitMethodDeclaration");
            
            ASTIdentifier nameNode = (ASTIdentifier) children[0];
            String fieldName = nameNode.getName();

            org.w3c.dom.Element targetNode = docNode;

            if (moddef.isStatic() == false)
                targetNode = this.ensurePrototypeNode(docNode);

            if (targetNode != null) {
                PropertyReference propRef = new PropertyReference(targetNode, fieldName, this.currentState);
    
                String nearComment = parseNode.getComment();
                if (nearComment == null)
                    nearComment = comment;
                    
                propRef.redefineProperty(nearComment);
                
                if (propRef.hasProperty())
                    propRef.redefineValue(parseNode);
                else
                    logger.warning("couldn't resolve method name");
            }
        }
        
        protected void visitModifiedDefinition(SimpleNode parseNode, org.w3c.dom.Element docNode) {
            SimpleNode[] children = parseNode.getChildren();
            checkChildrenLowerBounds(parseNode, 1, 1, "visitModifiedDefinition");

            String comment = parseNode.getComment();
            ASTModifiedDefinition moddef = (ASTModifiedDefinition)parseNode;
            
            SimpleNode child = children[0];
            if (child instanceof ASTVariableStatement)
                this.visitFieldStatement(child, docNode, moddef, comment);
            else if (child instanceof ASTFunctionDeclaration)
                this.visitMethodDeclaration(child, docNode, moddef, comment);
            else if (child instanceof ASTClassDefinition)
                this.visitClassDeclaration(child, docNode, moddef);
            else
                throw new InternalError("Unexpected node type " + parseNode.getClass().getName(), parseNode);
        }
        
        protected void visitClassAssignmentExpression(SimpleNode parseNode, org.w3c.dom.Element docNode) {
            SimpleNode[] children = parseNode.getChildren();
            checkChildrenLowerBounds(parseNode, 3, 3, "visitClassAssignmentExpression");

            // JS2DocUtils.debugPrintNode(parseNode);
            
            SimpleNode lhs = children[0];
            SimpleNode op = children[1];
            SimpleNode rhs = children[2];

            if (shouldProcessSimpleAssignment(docNode, lhs, op, rhs)) {
                PropertyReference propRef = this.resolveBinding(docNode, lhs, this.currentState);
                propRef.redefineProperty(parseNode.getComment());
                if (propRef.hasProperty())
                    propRef.redefineValue(rhs);
                else {
                    logger.fine("couldn't resolve class assignment target");
                }
            }
        }

        protected void visitIncludeDirective(SimpleNode parseNode, org.w3c.dom.Element docNode, boolean isTopLevel) {
            SimpleNode[] children = parseNode.getChildren();
            checkChildrenLowerBounds(parseNode, 1, 1, "visitIncludeDirective");

            ASTLiteral path = (ASTLiteral) children[0];
            
            if (this.baseDirectory == null)
                throw new InternalError("include directive encountered without having file base", parseNode);
            
            // ?? error checking?
            
            String sourcePath = (String) path.getValue();
            File sourceFile = new File(baseDirectory + File.separator + sourcePath);
                
            try {
                org.openlaszlo.sc.Compiler.Parser p = new org.openlaszlo.sc.Compiler.Parser();
                SimpleNode parseRoot = p.parse(FileUtils.readFileString(sourceFile));

                // TODO [jgrandy 11/24/06] process first comment into unit's <doc> element
                //  -- in particular, objectID won't be propagated
                
                Visitor visitor = new Visitor(this);
                visitor.setConditionalState(this.currentState);
                visitor.unitID = this.unitID;
                visitor.visitUnit(parseRoot, docNode, sourcePath);
                
            } catch (IOException e) {
                throw new DocumentationError("Could not read included file " + sourceFile);
            }
        }

        protected void visitEventValue(SimpleNode parseNode, org.w3c.dom.Element docNode) {
            docNode.setAttribute("type", "LzEvent");
            docNode.setAttribute("value", "LzNullEvent");
        }
        
        protected void visitEventDeclaration(SimpleNode parseNode, org.w3c.dom.Element docNode) {
            SimpleNode[] children = parseNode.getChildren();
            SimpleNode argList = children[1];
            SimpleNode[] args = argList.getChildren();
            checkChildrenLowerBounds(parseNode, 2, 2, "visitEventDeclaration argList");
            
            SimpleNode eventOwnerNode = args[0];
            PropertyReference propRef = this.resolveBinding(docNode, eventOwnerNode, this.currentState);
            
            if (propRef.hasProperty()) {
                logger.fine("found referent " + propRef.getProperty().getTagName());
                
                org.w3c.dom.Element propValue = propRef.getValue();

                if (propValue != null) {                
                    SimpleNode secondArg = args[1];
                    if (! (secondArg instanceof ASTLiteral))
                        throw new InternalError("Expected literal second argument to DeclareEvent", parseNode);
                    
                    String eventName = (String) ((ASTLiteral) secondArg).getValue();
    
                    propRef = new PropertyReference(propValue, eventName, this.currentState);
                    propRef.redefineProperty(parseNode.getComment());

                    this.visitEventValue(parseNode, propRef.getProperty());
                }
            } else {
                logger.warning("Dangling referent in DeclareEvent");
            }
        }
        
        protected void visitCallExpression(SimpleNode parseNode, org.w3c.dom.Element docNode) {
            SimpleNode[] children = parseNode.getChildren();
            checkChildrenLowerBounds(parseNode, 2, 2, "visitCallExpression");
            
            SimpleNode functionName = children[0];
            if (functionName instanceof ASTIdentifier) {
    
                String nameString = ((ASTIdentifier) functionName).getName();
                
                if (nameString.equals("DeclareEvent"))
                    visitEventDeclaration(parseNode, docNode);
            }
        }

        protected void visitIfDirective(SimpleNode parseNode, org.w3c.dom.Element docNode, boolean isTopLevel) {
            SimpleNode[] children = parseNode.getChildren();
            
            checkChildrenLowerBounds(parseNode, 2, 3, "visitIfDirective");

            // children[0] is conditional
            // children[1] is first directive block
            // children[2] is optional second directive block
            // "if (x) {} else if (y) {}" is handled recursively: the second
            // directive block will contain a new if directive.

            //JS2DocUtils.debugPrintNode(parseNode);
            //System.out.println("\n");
            
            SimpleNode conditional = children[0];
            SimpleNode trueDirective = children[1];
            SimpleNode falseDirective = ((children.length > 2) ? children[2] : null);
            
            ConditionalState previousState = this.currentState;
            
            ConditionalState directiveCondState = visitDirectiveConditional(conditional, docNode);
            if (directiveCondState == null)
                throw new InternalError("ConditionalState returned is null", parseNode);

            ConditionalState positiveState = previousState.and(directiveCondState);

            logger.fine("previousState before lhs of if statement: " + previousState.toString());
            logger.finer("directiveCondState for lhs of if statement: " + directiveCondState.toString());
            logger.finer("positiveState for lhs of if statement: " + positiveState.toString());

            if (positiveState.inferredValue != ConditionalState.falseValue) {
                try {            
                    this.currentState = positiveState;
                
                    if (isTopLevel)
                        this.visitToplevelStatement(trueDirective, docNode);
                    else
                        this.visitClassStatement(trueDirective, docNode, null);
                } finally {
                    this.currentState = previousState;
                }
            }
                
            if (falseDirective != null) {

                ConditionalState negativeState = previousState.and(directiveCondState.not());
                logger.finer("negativeState for rhs of if statement: " + negativeState.toString());
                
                if (negativeState.inferredValue == ConditionalState.falseValue) {
                    logger.fine("Branch of if statement is not reachable");
                } else {
                    SimpleNode[] condChildren = falseDirective.getChildren();

                    try {
                        this.currentState = negativeState;
                        for (int i = 0; i < condChildren.length; i++) {
                            SimpleNode condChild = condChildren[i];
                            if (isTopLevel)
                                this.visitToplevelStatement(condChild, docNode);
                            else
                                this.visitClassStatement(condChild, docNode, null);
                        }
                    } finally {
                        this.currentState = previousState;
                    }
                }
            }
        }
        
        protected void visitTopLevelIfDirective(SimpleNode parseNode, org.w3c.dom.Element docNode) {
            visitIfDirective(parseNode, docNode, true);
        }
        
        protected void visitClassIfDirective(SimpleNode parseNode, org.w3c.dom.Element docNode) {
            visitIfDirective(parseNode, docNode, false);
        }
        
        protected ConditionalState visitDirectiveConditional(SimpleNode conditional, org.w3c.dom.Element docNode) {

            ConditionalState condState = new ConditionalState(ConditionalState.falseValue, this.runtimeOptions, this.buildOptions);
            
            if (conditional == null)
                throw new InternalError("Null conditional in DirectiveConditional", conditional);

            if (conditional instanceof ASTLiteral) {
                Object value = ((ASTLiteral) conditional).getValue();
                if (value instanceof Boolean) {
                    boolean bval = ((Boolean) value).booleanValue();
                    condState.inferredValue = (bval == true) ? ConditionalState.trueValue : ConditionalState.falseValue;
                    condState.trueCases.clear();
                    if (condState.inferredValue == ConditionalState.trueValue) {
                        condState.trueCases.addAll(condState.falseCases);
                        condState.falseCases.clear();
                    }
                } else {
                     logger.warning("Conditional: Unknown literal type " + conditional.getClass().getName());
               }
            } else if (conditional instanceof ASTIdentifier) {
                String value = ((ASTIdentifier) conditional).getName();
                if (value.startsWith("$")) {
                    String token = value.substring(1);
                    if (this.runtimeOptions.contains(token) || this.buildOptions.contains(token)) {
                        condState.trueCases.clear();
                        condState.addTrueCase(token);
                    } else if (this.runtimeAliases.containsKey(token)) {
                        condState = new ConditionalState((ConditionalState) this.runtimeAliases.get(token));
                    } else {
                     logger.warning("Conditional: Unmatched '$' identifier " + value);
                    }
                } else {
                    // warning: unmatched conditional
                     logger.warning("Conditional: Unmatched identifier " + value);
                }
            } else if (conditional instanceof ASTOrExpressionSequence) {
                SimpleNode[] orChildren = conditional.getChildren();
                if (orChildren.length != 2) 
                    throw new InternalError("Unexpected number of child nodes in ASTOrExpressionSequence", conditional);
                ConditionalState op1State = visitDirectiveConditional(orChildren[0], docNode);
                ConditionalState op2State = visitDirectiveConditional(orChildren[1], docNode);
                condState = op1State.or(op2State);

            } else if (conditional instanceof ASTAndExpressionSequence) {
                SimpleNode[] andChildren = conditional.getChildren();
                if (andChildren.length != 2) 
                    throw new InternalError("Unexpected number of child nodes in ASTAndExpressionSequence", conditional);
                ConditionalState op1State = visitDirectiveConditional(andChildren[0], docNode);
                ConditionalState op2State = visitDirectiveConditional(andChildren[1], docNode);
                
                // punt if we have a combination of two indeterminate values, since we don't know
                // how to represent "a && b" using the ConditionalState class
                if (op1State.inferredValue == ConditionalState.indeterminateValue &&
                    op2State.inferredValue == ConditionalState.indeterminateValue) {
                    condState = new ConditionalState(ConditionalState.trueValue, this.runtimeOptions, this.buildOptions);
                } else {
                    condState = op1State.and(op2State);
                }
            } else if (conditional instanceof ASTUnaryExpression) {
                SimpleNode[] opChildren = conditional.getChildren();
                if (opChildren.length != 2) 
                    throw new InternalError("Unexpected number of child nodes in ASTUnaryExpression", conditional);

                SimpleNode operator = opChildren[0];
                SimpleNode operand = opChildren[1];
                
                if (! (operator instanceof ASTOperator))
                    throw new InternalError("Expected operator inside ASTUnaryExpression", conditional);
                if (((ASTOperator) operator).getOperator() == ParserConstants.BANG) {
                    ConditionalState opState = visitDirectiveConditional(operand, docNode);
                    condState = opState.not();
                } else {
                    logger.warning("Unhandled unary operator" + ((ASTOperator) operator).getOperator());
                }
            
            } else {
                logger.fine("Unhandled conditional type" + conditional.getClass().getName());
                // warning: unmatched conditional
            }
            
            return condState;
        }
        
        private void describeConditionalState(org.w3c.dom.Element docNode) {
            JS2DocUtils.describeConditionalState(this.currentState, docNode);
        }
        
        private void checkChildrenLowerBounds(SimpleNode node, int min, int expectedMax, String methodName) {
            JS2DocUtils.checkChildrenLowerBounds(node, min, expectedMax, methodName);
        }

        protected PropertyReference resolveBinding(org.w3c.dom.Element owner, SimpleNode lvalDesc, ConditionalState state) {
            return new PropertyReference(owner, lvalDesc, state);
        }
        
        protected void processComment(org.w3c.dom.Element node, Comment parsedComment) {
            
            if (! parsedComment.isEmpty()) {
                parsedComment.appendAsXML(node);
                
            }
        }
    }
    
    static public Document toXML(String inputString, 
                                 File sourceFile, String sourceRoot, String libraryID,
                                 Set runtimeOptions, List runtimeAliases, List buildOptions) {
        org.openlaszlo.sc.Compiler.Parser p = new org.openlaszlo.sc.Compiler.Parser();
        SimpleNode parseRoot = p.parse(inputString);
        
        org.w3c.dom.Document doc = null;
        
        Map runtimeAliasesMap = new HashMap();
        final int n = runtimeAliases.size();
        for (int i=0; i<n; i++) {
            String[] e = (String[]) runtimeAliases.get(i);
            if (e.length == 0)
                throw new InternalError("invalid runtime alias", parseRoot);
            ConditionalState aliasState = new ConditionalState(ConditionalState.falseValue, runtimeOptions, buildOptions);
            for (int j=1; j<e.length; j++) {
                aliasState.addTrueCase(e[j]);
            }
            runtimeAliasesMap.put(e[0], aliasState);
        }
        
        javax.xml.parsers.DocumentBuilderFactory factory = 
            javax.xml.parsers.DocumentBuilderFactory.newInstance();
        
        try {
            doc = factory.newDocumentBuilder().newDocument();
            
            Element docRoot = doc.createElement("js2doc");
            doc.appendChild(docRoot);
        
            if (runtimeOptions != null)
                docRoot.setAttribute("runtimeoptions", JS2DocUtils.optionsToString(runtimeOptions));
            if (buildOptions != null)
                docRoot.setAttribute("buildoptions",JS2DocUtils.optionsToString(buildOptions));
                
            if (sourceFile != null) {
                String baseDirectory = sourceFile.getParent();
                if (baseDirectory == null)
                    throw new InternalError("couldn't get base directory for source file", parseRoot);
                if (sourceRoot == null)
                    throw new InternalError("source root is null", parseRoot);
                    
                String relativeBase = FileUtils.relativePath(baseDirectory, sourceRoot);

                Visitor visitor = new Visitor(baseDirectory, relativeBase, libraryID, runtimeOptions, runtimeAliasesMap, buildOptions);
                
                visitor.visitUnit(parseRoot, docRoot, sourceFile.getName());
            } else {
                Visitor visitor = new Visitor(null, null, null, runtimeOptions, runtimeAliasesMap, buildOptions);
                visitor.visitToplevelStatement(parseRoot, docRoot);
            }
            
            ReprocessComments.reprocess(docRoot, true);
            
            doc.normalizeDocument();
            
        } catch (javax.xml.parsers.ParserConfigurationException e) {
            doc = null;
            e.printStackTrace();
        } catch (InternalError e) {
            doc = null;
            if (e.node != null) JS2DocUtils.debugPrintNode(e.node);
            e.printStackTrace();
        }

        return doc;
    }

}
