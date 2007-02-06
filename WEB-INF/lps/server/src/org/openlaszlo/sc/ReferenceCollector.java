/* -*- mode: Java; c-basic-offset: 2; -*- */

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.sc;
import java.util.*;
import org.openlaszlo.sc.parser.SimpleNode;
import org.openlaszlo.sc.parser.*;

public class ReferenceCollector {
  static public boolean DebugConstraints = false;
  // The LFC guarantees that these won't change.
  static Set immutableProperties = new HashSet();
  static {
    immutableProperties.add("parent");
    immutableProperties.add("immediateParent");
    immutableProperties.add("classroot");
    immutableProperties.add("canvas");
  }

  boolean computeMetaReferences = false;
  Set references;
  Set functions;
  Set metareferences;
  Set metafunctions;
  String depth = "";

  public ReferenceCollector() {
    this(false);
  }

  public ReferenceCollector(boolean computeMetaReferences) {
    this.computeMetaReferences = computeMetaReferences;
    // Linked used for determinism in binary
    this.references = new LinkedHashSet();
    this.functions = new LinkedHashSet();
    if (computeMetaReferences) {
      this.metareferences = new LinkedHashSet();
      this.metafunctions = new LinkedHashSet();
    }
  }

  // Convert a list of PropertyReference's to an ArrayLiteral of
  // alternating reference/property
  private SimpleNode rsubst(Set r) {
    List l = new ArrayList();
    Set added = new HashSet();
    Compiler.ParseTreePrinter ptp = new Compiler.ParseTreePrinter();
    for (Iterator i = r.iterator(); i.hasNext(); ) {
      SimpleNode n = (SimpleNode)i.next();
      String s = ptp.visit(n);
      // Eliminate redundant constraints
      if (! added.contains(s)) {
        added.add(s);
        l.add(n.get(0));
        l.add(new ASTLiteral(((ASTIdentifier)n.get(1)).getName()));
      }
    }
    SimpleNode s = new ASTArrayLiteral(0);
    s.setChildren((SimpleNode[])l.toArray(new SimpleNode[0]));
    return s;
  }

  // f(args...) -> f["dependencies"](undefined, args...)
  // a.f(args...) -> f["dependencies"](a, args...)
  private SimpleNode fsubst(SimpleNode node) {
    SimpleNode fn = node.get(0);
    SimpleNode callee;
    if (fn instanceof ASTPropertyIdentifierReference) {
      callee = fn.get(0);
    } else {
      callee  = new ASTUnaryExpression(0);
      ASTOperator voidOp = new ASTOperator(0);
      voidOp.setOperator(ParserConstants.VOID);
      callee.set(0, voidOp);
      callee.set(1, new ASTLiteral(0));
    }
    // the function uses #pragma "warnUndefinedReferences=false"
    // to avoid warnings for non-existent dependencies
    Map map = new HashMap();
    map.put("_1", fn);
    map.put("_2", callee);
    map.put("_3", new Compiler.Splice(node.get(1).getChildren()));
    // TODO: [2006-01-03 ptw] Do we really need a new Parser each time?
    return (new Compiler.Parser()).substitute("_1.hasOwnProperty('dependencies') ? _1.dependencies(this, _2, _3) : []", map);
  }

  // Concatenate references array with any results from dependeny
  // functions
  private SimpleNode build(Set references, Set functions) {
    SimpleNode a = rsubst(references);
    Map map = new HashMap();
    Set added = new HashSet();
    Compiler.ParseTreePrinter ptp = new Compiler.ParseTreePrinter();
    for (Iterator i = functions.iterator(); i.hasNext(); ) {
      SimpleNode n = (SimpleNode)i.next();
      String s = ptp.visit(n);
      // Eliminate redundant constraints
      if (! added.contains(s)) {
        added.add(s);
        SimpleNode b = fsubst(n);

        map.put("_1", a);
        map.put("_2", b);
        // TODO: [2006-01-03 ptw] Do we really need a new Parser each time?
        a = (new Compiler.Parser()).substitute("_1.concat(_2)", map);
      }
    }
    return a;
  }

  public SimpleNode computeReferences(String name) {
    // Sanitize the name
    name = name.replace('#', '_').replace(' ', '_').replace('/', '_').replace('.', '_');
    SimpleNode d = build(references, functions);
    if (computeMetaReferences) {
      for (Iterator i = metareferences.iterator(); i.hasNext(); ) {
        SimpleNode r = (SimpleNode)i.next();
        if (r instanceof ASTPropertyIdentifierReference &&
            r.get(1) instanceof ASTIdentifier &&
            immutableProperties.contains(((ASTIdentifier)r.get(1)).getName())) {
          metareferences.remove(r);
        }
      }
      SimpleNode md = build(metareferences, metafunctions);
      // store metadependencies as a property of deps
      Map map = new HashMap();
      map.put("_1", d);
      map.put("_2", md);
      // TODO: [2006-01-03 ptw] Do we really need a new Parser each time?
      return (new Compiler.Parser()).substitute(
        // TODO: [2003-06-19 ptw] (krank) Have to use sanitized
        // name here, so that substitute does not try to name
        // the function "x"
        // Note: Since substitute does not enforce macro
        // hygiene, arguments.callee.d is used as a temp var
        // (rather than declaring a var) so as not to shadow
        // any free references in the dependencies expression
        "function " + name + "_dependencies () {\n#pragma \"warnUndefinedReferences=false\"\nwith (this) { arguments.callee.d = _1; arguments.callee.d.metadependencies = _2; return arguments.callee.d;}}", 
        map);
    } else {
      Map map = new HashMap();
      map.put("_1", d);
      // TODO: [2006-01-03 ptw] Do we really need a new Parser each time?
      return (new Compiler.Parser()).substitute(
        // TODO: [2003-06-19 ptw] (krank) Have to use sanitized
        // name here, so that substitute does not try to name
        // the function "x"
        "function " + name + "_dependencies () {\n#pragma \"warnUndefinedReferences=false\"\nwith (this) return _1;}", 
        map);
    }
  }

  public void visit(SimpleNode node) {
    visitInternal(node, references, functions);
  }

  // Imagine how easy this would be to write with generic functions!
  private void visitInternal(SimpleNode node, Set references, Set functions) {
    if (DebugConstraints) {
      System.out.println(depth + node);
    }
    try {
      if (DebugConstraints) {
        depth = depth + "    ";
      }
      if (node instanceof ASTFunctionDeclaration ||
          node instanceof ASTFunctionExpression) {
        // Don't traverse inside nested functions
        ;
      } else if (node instanceof ASTIdentifier) {
        SimpleNode p = new ASTPropertyIdentifierReference(0);
        SimpleNode[] c = {new ASTThisReference(0), node};
        p.setChildren(c);
        references.add(p);
      } else if (node instanceof ASTPropertyIdentifierReference) {
        SimpleNode base = node.get(0);
        if (computeMetaReferences) {
          // Visit the base for meta-dependencies
          visitInternal(base, metareferences, metafunctions);
        }
        // If the base is a function, collect its dependency function
        if (base instanceof ASTCallExpression) {
          functions.add(base);
        }
        references.add(node);
      } else if (node instanceof ASTCallExpression) {
        // Optimization: ignore setAttribute(...),
        // since it's used in every constraint expression
        // and doesn't have a dependency function (and if
        // it did, it would always return null).
        SimpleNode base = node.get(0);
        if (base instanceof ASTPropertyIdentifierReference &&
            base.get(0) instanceof ASTThisReference &&
            base.get(1) instanceof ASTIdentifier &&
            "setAttribute".equals(((ASTIdentifier)base.get(1)).getName())) {
          ;
        } else {
          if (computeMetaReferences) {
            // Visit the function for meta-dependencies
            visitInternal(base, metareferences, metafunctions);
          }
          // Collect the function's dependency function
          functions.add(node);
        }
        // Visit the arguments.
        visitInternal(node.get(1), references, functions);
      } else {
        for (int i = 0, len = node.size(); i < len; i++) {
          visitInternal(node.get(i), references, functions);
        }
      }
    }
    finally {
      if (DebugConstraints) {
        depth = depth.substring(0, depth.length() - 4);
        System.out.println(depth + "references: " + references);
        System.out.println(depth + "functions: " + functions);
        if (computeMetaReferences) {
          System.out.println(depth + "metareferences: " + metareferences);
          System.out.println(depth + "metafunctions: " + metafunctions);
        }
      }
    }
  }
}

