/* -*- mode: Java; c-basic-offset: 2; -*- */

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.sc;
import java.util.*;
import org.openlaszlo.sc.parser.SimpleNode;
import org.openlaszlo.sc.parser.*;
import org.openlaszlo.sc.ASTVisitor;

public class VariableAnalyzer {
  // A ref will cause an auto_reg to be declared
  // compiler magic variables (e.g., $flasm) are always "available"
  static Set AVAILABLE = new HashSet(Instructions.Register.AUTO_REG);
  static {
    AVAILABLE.add("$flasm");
  }

  // _Must_ be in order
  public LinkedHashSet parameters;
  // Kept in order for deterministic code generation
  public LinkedHashSet variables;
  public LinkedHashMap fundefs;
  // Order unimportant for the rest
  public Map used;
  Set innerFree;
  public Set closed;
  public Set free;
  // Contains `.`, `[]`, or `()` expression(s)
  public boolean dereferenced = false;

  boolean ignoreFlasm;
  boolean hasSuper;
  Set locals;

  ASTVisitor visitor;

  public VariableAnalyzer(SimpleNode params, boolean ignoreFlasm, boolean hasSuper, ASTVisitor visitor) {
    // Parameter order is significant
    parameters = new LinkedHashSet();
    for (int i = 0, len = params.size(); i < len; i++) {
      SimpleNode param = params.get(i);
      // might also be an initializer
      // TODO: [2007-12-20 dda] if it is an default parameter initializer,
      // should call visit() on the initializer expression?
      if (param instanceof ASTIdentifier) {
        parameters.add(((ASTIdentifier)param).getName());
      }
    }
    locals = new LinkedHashSet(parameters);
    innerFree = new HashSet();
    fundefs = new LinkedHashMap();
    used = new HashMap();
    this.ignoreFlasm = ignoreFlasm;
    this.visitor = visitor;
  }

  public void incrementUsed(String variable) {
    String var = variable.intern();
    if (used.containsKey(var)) {
      // Gaak!
      used.put(var, new Integer(((Integer)used.get(var)).intValue() + 1));
    } else {
      used.put(var, new Integer(1));
    }
  }

  // Computes parameters, variables, fundefs, used, closed, free
  public void computeReferences() {
    // variables (locals - parameters)
    variables = new LinkedHashSet(locals);
    variables.removeAll(parameters);
    // available (locals + AVAILABLE)
    Set available = new HashSet(locals);
    available.addAll(AVAILABLE);
    // Closing over a variable counts as a use
    for (Iterator i = innerFree.iterator(); i.hasNext(); ) {
      incrementUsed((String)i.next());
    }
    // Calculate actual closed (innerFree & available)
    closed = new HashSet(innerFree);
    closed.retainAll(available);
    // Calculate free references (used - available)
    free = new HashSet(used.keySet());
    free.removeAll(available);
  }

  public void visit(SimpleNode node) {
    SimpleNode[] children;
    // Calculate children for recursive visiting
    if (node instanceof ASTPropertyIdentifierReference) {
      // For `a.b`, only `a` is a reference, not `b`.  (Cf., `a[b]`,
      // where _both_ are references).
      SimpleNode[] c = {node.get(0)};
      children = c;
    } else if (node instanceof ASTIfStatement) {
      children = node.getChildren();
      // Look for $flasm or compile-time conditional
      SimpleNode test = node.get(0);
      if (test instanceof ASTIdentifier) {
        if (ignoreFlasm && ("$flasm".equals(((ASTIdentifier)test).getName()))) {
          SimpleNode[] c = {test};
          children = c;
        } else {
          // Look for compile-time conditionals
          Boolean value = visitor.evaluateCompileTimeConditional(test);
          if (value == null) {
            // default
          } else if (value.booleanValue()) {
            children = node.get(1).getChildren();
          } else if (node.size() > 2) {
            children = node.get(2).getChildren();
          } else {
            SimpleNode[] c = {};
            children = c;
          }
        }
      }
    } else if (node instanceof ASTSuperCallExpression) {
      // For a super call, only the parameters are references
      SimpleNode[] c = {node.get(2)};
      children = c;
    } else {
      children = node.getChildren();
    }
    // Calculate locals, fundefs, and used
    // (ForVar has a VariableDeclaration as a child, so we don"t
    // need to handle it specially, but ForVarIn does not.)
    // catch has a variable declaration as a child
    if (node instanceof ASTVariableDeclaration ||
        node instanceof ASTForVarInStatement ||
        node instanceof ASTCatchClause) {
      String v = ((ASTIdentifier)children[0]).getName();
      // In ECMAscript you can re-declare variables and
      // parameters and not shadow them
      if (! locals.contains(v)) {
        locals.add(v);
      }
    } else if (node instanceof ASTFunctionDeclaration) {
      String v = ((ASTIdentifier)children[0]).getName();
      fundefs.put(v, node);
      if (! locals.contains(v)) {
        locals.add(v);
      }
    } else if (node instanceof ASTThisReference ||
               node instanceof ASTIdentifier) {
      if (node instanceof ASTThisReference) {
        incrementUsed("this");
      } else {
        incrementUsed(((ASTIdentifier)node).getName());
      }
    }
    // Calculate dereferenced
    if ((node instanceof ASTPropertyIdentifierReference) ||
        (node instanceof ASTPropertyValueReference) ||
        (node instanceof ASTCallExpression)) {
      dereferenced = true;
    }
    // For JS1 runtimes, super calls are translated into runtime calls
    // that reference `this` and `arguments`.  Chicken/egg problem --
    // we'd like to translate before analyzing, but translation uses
    // analysis.  We need a separate transformer phase...
    if ((node instanceof ASTSuperCallExpression) &&
         (! hasSuper)) {
      incrementUsed("this");
      incrementUsed("arguments");
    }
    // Now descend into children.  Closures get special treatment.
    if (node instanceof ASTFunctionDeclaration ||
        node instanceof ASTFunctionExpression) {
      SimpleNode params = children[children.length - 2];
      SimpleNode stmts = children[children.length - 1];
      VariableAnalyzer analyzer = new VariableAnalyzer(params, ignoreFlasm, hasSuper, visitor);
      for (int i = 0, len = stmts.size(); i < len; i++) {
        SimpleNode stmt = stmts.get(i);
        analyzer.visit(stmt);
      }
      analyzer.computeReferences();
      for (Iterator i = analyzer.free.iterator(); i.hasNext(); ) {
        String v = (String)i.next();
        if (! innerFree.contains(v)) {
          innerFree.add(v);
        }
      }
    } else if (node instanceof ASTObjectLiteral) {
      // Only the values of an object literal are references, the keys
      // are constants
      for (int i = 1, len = children.length; i < len; i += 2) {
        visit(children[i]);
      }
    } else {
      for (int i = 0, len = children.length; i < len; i++) {
        visit(children[i]);
      }
    }
  }
}
