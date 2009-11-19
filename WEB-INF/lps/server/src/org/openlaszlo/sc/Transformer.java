/* -*- mode: Java; c-basic-offset: 2; -*- */

/**
 * Javascript 'Transformer'
 *
 * @author ptw@pobox.com
 * @description: JavaScript -> JavaScript translator
 *
 * Rewites JavaScript with transformations common to all platforms.
 *
 * Initially, all this does is expand includes, walk the AST, process
 * directives and move the class declarations to the front of the
 * program in dependency order.
 *
 * Eventually, we could implement platform-independent source-source
 * transformations and inlining here.
 *
 */

package org.openlaszlo.sc;
import java.io.*;
import java.util.*;

import org.openlaszlo.sc.parser.*;

public class Transformer extends GenericVisitor  {
  Map allDeclarations = new HashMap();

  // Entry point
  public SimpleNode transform (SimpleNode program) {
    SimpleNode[] children = program.getChildren();
    program = visitProgram(program, children);
    // May have been transformed, so refresh
    children = program.getChildren();
    // Resolve sort keys
    for (Iterator i = allDeclarations.values().iterator(); i.hasNext(); ) {
      ((ClassDeclaration)i.next()).resolve();
    }
    // Sort
    TreeSet decls = new TreeSet(allDeclarations.values());
    List defs = new ArrayList();
    // Emit
    for (Iterator i = decls.iterator(); i.hasNext(); ) {
      defs.add(((ClassDeclaration)i.next()).AST);
    }
    defs.addAll(Arrays.asList(children));
    program.setChildren(((SimpleNode [])defs.toArray(children)));
    return program;
  }

  // Support for gathering class declarations
  public class ClassDeclaration implements Comparable {
    String name;
    String supername;
    public SimpleNode AST;
    String sortkey;
    boolean resolved = false;

    public ClassDeclaration (String name, SimpleNode superclasses, SimpleNode AST) {
      String key = this.name = name;
      String sn = null;
      this.AST = AST;
      if (superclasses instanceof ASTIdentifier) {
        sn = ((ASTIdentifier)superclasses).getName();
      } else if (superclasses instanceof ASTArrayLiteral) {
        List classlist = new ArrayList();
        SimpleNode[] supernodes = superclasses.getChildren();
        int last = supernodes.length - 1;
        for (int i = 0; i < last; i++) {
          sn =  ((ASTIdentifier)supernodes[i]).getName();
          key = sn + "." + key;
        }
        sn =  ((ASTIdentifier)supernodes[last]).getName();
      } else {
        assert ((superclasses instanceof ASTLiteral) && ((ASTLiteral)superclasses).getValue() == null) : "Invalid superclasses list";
        resolved = true;
      }
      this.sortkey = key;
      this.supername = sn;
      allDeclarations.put(name, this);
    }

    public void resolve() {
      if (resolved) return;
      ClassDeclaration sup = (ClassDeclaration)allDeclarations.get(supername);
      if (sup != null) {
        if (! sup.resolved) {
          sup.resolve();
        }
        sortkey = sup.sortkey + "." + sortkey;
      }
      resolved = true;
    }

    public int compareTo(Object other) throws ClassCastException {
      ClassDeclaration o = (ClassDeclaration)other;
      if (sortkey.indexOf(o.name) >= 0) {
        // O is in my superclass chain
        return +1;
      } else if (o.sortkey.indexOf(name) >= 0) {
        // I am in O's superclass chain
        return -1;
      } else {
        // Unordered, but not equal!
        return sortkey.compareTo(o.sortkey);
      }
    }
  }

  // NOTE [2009-11-16 ptw] We have to override this because of the
  // stupid way modifiers are handled in the AST.  Why are they not
  // just slots on the node they modify?
  public SimpleNode visitModifiedDefinition(SimpleNode node, SimpleNode[] children) {
    assert children.length == 1;
    SimpleNode child = children[0];
    if (child instanceof ASTClassDefinition) {
      return visitClassDefinition(child, child.getChildren());
    }
    return super.visitModifiedDefinition(node, children);
  }


  // We don't descend into these, just gather them up and reorder them
  public SimpleNode visitClassDefinition(SimpleNode node, SimpleNode[] children) {
    ASTIdentifier classname = (ASTIdentifier)children[1];
    String classnameString = classname.getName();
    SimpleNode superclass = children[2];
    SimpleNode mixins = children[3];
    SimpleNode mixinsandsuper;
    if (mixins instanceof ASTEmptyExpression) {
      if (superclass instanceof ASTEmptyExpression) {
        mixinsandsuper = new ASTLiteral(null);
      } else {
        mixinsandsuper = superclass;
      }
    } else {
      mixinsandsuper = new ASTArrayLiteral(0);
      mixinsandsuper.setChildren(mixins.getChildren());
      if (! (superclass instanceof ASTEmptyExpression)) {
        mixinsandsuper.set(mixinsandsuper.size(), superclass);
      }
    }

    // See visitModifiedDefinition above -- we collude to move the
    // modified definition instead of just the class.
    SimpleNode parent = node.getParent();
    if (parent instanceof ASTModifiedDefinition) {
      node = parent;
    }
    new ClassDeclaration(classnameString, mixinsandsuper, node);
    // We'll visit this in dependency-order Not AST-order
    return new ASTEmptyExpression(0);
  }

  //
  // Process directives
  //

  public Boolean evaluateCompileTimeConditional(SimpleNode node) {
    Object value = null;
    if (node instanceof ASTIdentifier) {
      String name = ((ASTIdentifier)node).getName();
      Map constants = (Map)options.get(Compiler.COMPILE_TIME_CONSTANTS);
      if (constants != null) {
        if (constants.containsKey(name)) {
          value = constants.get(name);
        }
      }
    }
    return (Boolean)value;
  }


  public SimpleNode visitIfDirective (SimpleNode directive, SimpleNode[] children) {
    // NOTE: [2009-10-03 ptw] (LPP-1933) People expect the
    // branches of a compile-time conditional to establish a
    // directive block, but that should work, because the if clauses
    // should be statementLists, which establish blocks
    Boolean value = evaluateCompileTimeConditional(children[0]);
    if (value == null) {
      return visitIfStatement(directive, children);
    } else if (value.booleanValue()) {
      SimpleNode clause = children[1];
      return visitDirective(clause, clause.getChildren());
    } else if (children.length > 2) {
      SimpleNode clause = children[2];
      return visitDirective(clause, clause.getChildren());
    } else {
      return new ASTEmptyExpression(0);
    }
  }
}

/**
 * @copyright Copyright 2009 Laszlo Systems, Inc.  All Rights
 * Reserved.  Use is subject to license terms.
 */

