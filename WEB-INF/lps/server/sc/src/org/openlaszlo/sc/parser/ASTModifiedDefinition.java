/**
 * Parser encapsulation of modifiers for classes, functions
 * (private/public/protected/internal/static/final/dynamic/override)
 */

package org.openlaszlo.sc.parser;

public class ASTModifiedDefinition extends SimpleNode {

    public static final String DEFAULT_ACCESS = "<default>";
    public static final String PUBLIC_ACCESS = "public";
    public static final String PROTECTED_ACCESS = "protected";
    public static final String INTERNAL_ACCESS = "internal";
    public static final String PRIVATE_ACCESS = "private";

    private String access = DEFAULT_ACCESS;
    private boolean isStatic = false;
    private boolean isFinal = false;
    private boolean isDynamic = false;
    private boolean isOverride = false;
    private String namespace = null;

    private Token t;

    public ASTModifiedDefinition(int id) {
        super(id);
    }

    public ASTModifiedDefinition(Parser p, int id) {
        super(p, id);
    }

    public static Node jjtCreate(int id) {
        return new ASTModifiedDefinition(id);
    }

    public static Node jjtCreate(Parser p, int id) {
        return new ASTModifiedDefinition(p, id);
    }

    // Token is used for error reporting
    public ASTModifiedDefinition setToken(Token t) {
        this.t = t;
        return this;
    }

    public void setNamespace(String value) {
        if (access != DEFAULT_ACCESS) {
            throw new ParseException(t, "cannot use namespace \"" + value + "\" with visibility \"" + access + "\"");
        }
        if (namespace != null) {
            throw new ParseException(t, "cannot set namespace twice: \"" + namespace + "\" and \"" + value + "\"");
        }
        this.namespace = value;
    }

    public void setAccess(String value) {
        if (access != DEFAULT_ACCESS && value != access) {
            throw new ParseException(t, "access level changed from \"" + access + "\" to \"" + value + "\"");
        }
        if (namespace != null) {
            throw new ParseException(t, "cannot use namespace \"" + namespace + "\" with visibility \"" + value + "\"");
        }
        this.access = value;
    }

    public String getAccess() {
        return this.access;
    }

    public void setStatic(boolean value) {
        isStatic = true;
    }

    public boolean isStatic() {
        return isStatic;
    }

    public void setFinal(boolean value) {
        isFinal = true;
    }

    public boolean isFinal() {
        return isFinal;
    }

    public void setDynamic(boolean value) {
        isDynamic = true;
    }

    public boolean isDynamic() {
        return isDynamic;
    }

    public void setOverride(boolean value) {
        isOverride = true;
    }

    public boolean isOverride() {
        return isOverride;
    }

    private void verifyVariable(SimpleNode subnode) {
        if (isOverride)
            throw new ParseException("cannot use override on variable: " + subnode);
        if (isDynamic)
            throw new ParseException("cannot use dynamic on variable: " + subnode);
    }
    private void verifyFunction(SimpleNode subnode) {
        if (isDynamic)
            throw new ParseException("cannot use dynamic on variable: " + subnode);
    }
    private void verifyClass(SimpleNode subnode) {
        if (isOverride)
            throw new ParseException("cannot use override on class: " + subnode);
    }
    public void verifyTopLevel(SimpleNode subnode) {
        if (subnode instanceof ASTVariableStatement)
            verifyVariable(subnode);
        else if (subnode instanceof ASTFunctionDeclaration)
            verifyFunction(subnode);
        else if (subnode instanceof ASTClassDefinition)
            verifyClass(subnode);
        else
            throw new ParseException("unexpected type at top level: " + subnode);
    }

    public void verifyClassLevel(SimpleNode subnode) {
        if (subnode instanceof ASTVariableStatement)
            verifyVariable(subnode);
        else if (subnode instanceof ASTFunctionDeclaration)
            verifyFunction(subnode);
        else if (subnode instanceof ASTClassDefinition)
            throw new ParseException("inner classes not allowed: " + subnode);
        else
            throw new ParseException("unexpected type at class level: " + subnode);
    }

    public String toJavascriptString() {
        String str = namespace;
        if (namespace == null) {
            if (access == DEFAULT_ACCESS)
                str = "";
            else
                str = access;
        }
        if (isStatic)
            str += " static";
        if (isDynamic)
            str += " dynamic";
        if (isFinal)
            str += " final";
        if (isOverride)
            str += " override";

        // might be a leading blank if no namespace
        if (str.length() > 0 && str.charAt(0) == ' ')
            str = str.substring(1);

        return str;
    }

    public String toString() {
        String str = toJavascriptString();
        // For clarity, mark the namespace as such,
        // it always appears first
        if (namespace != null)
            str = "namespace=" + str;
        return "ModifiedDefinition(" + str + ")";
    }

    /** Accept the visitor */
    /* TODO: [2007-11-27 dda] Needed when VISITOR=true
    public Object jjtAccept(ParserVisitor visitor, Object data) {
        return visitor.visit(this, data);
    }
    */

}

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

