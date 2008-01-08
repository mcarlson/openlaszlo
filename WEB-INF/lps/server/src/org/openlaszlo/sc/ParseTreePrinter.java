/* -*- mode: Java; c-basic-offset: 2; -*- */

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

/***
 * ParseTreePrinter.java
 * Author: Oliver Steele, P T Withington
 * Description: unparses the AST into Javascript.
 */

package org.openlaszlo.sc;

import java.io.*;
import java.util.*;
import java.util.regex.Pattern;
import java.text.SimpleDateFormat;
import java.text.DecimalFormat;

import org.openlaszlo.server.LPS;
import org.openlaszlo.sc.parser.*;
import org.openlaszlo.sc.Translator;
import org.openlaszlo.sc.Compiler.Ops;
import org.openlaszlo.sc.Compiler.PassThroughNode;

// Values
import org.openlaszlo.sc.Values;

// Instructions
import org.openlaszlo.sc.Instructions;
import org.openlaszlo.sc.Instructions.Instruction;
import org.openlaszlo.sc.InstructionPrinter;

// This class supports the Javascript translator
public class ParseTreePrinter {

  boolean compress;
  String SPACE;
  String NEWLINE;
  String COMMA;
  String COLON;
  String ASSIGN;
  String CONDITIONAL;
  String ALTERNATIVE;
  String OPENPAREN;
  String CLOSEPAREN;
  String SEMI;
  String OPTIONAL_SEMI;
  String OPENCURLY;
  String CLOSECURLY;
  
  public ParseTreePrinter() {
    this(false, false);
  }
  
  public ParseTreePrinter(boolean compress) {
    this(compress, false);
  }

  public ParseTreePrinter(boolean compress, boolean obfuscate) {
    this.compress = compress;
    // Set whitespace
    this.SPACE = compress ? "" : " ";
    this.NEWLINE = obfuscate ? "" : "\n";
    // Set punctuation
    this.COMMA = "," + SPACE;
    this.COLON = ":" + SPACE;
    this.ASSIGN = SPACE + "=" + SPACE;
    this.CONDITIONAL = SPACE + "?" + SPACE;
    this.ALTERNATIVE = SPACE + ":" + SPACE;
    this.OPENPAREN = SPACE + "(";
    this.CLOSEPAREN = ")" + SPACE;
    this.SEMI = ";";
    this.OPTIONAL_SEMI = (compress && "\n".equals(NEWLINE)) ? NEWLINE : SEMI;
  }
  
  public void print(SimpleNode node) {
    print(node, System.out);
  }
  
  public void print(SimpleNode node, OutputStream output) {
    PrintStream where = new PrintStream(output);
    print(node, where);
  }
  
  public void print(SimpleNode node, PrintStream where) {
    where.println(visit(node));
  }
  
  public String delimit(String phrase, boolean force) {
    if (phrase.length() > 0) {
      return ((('(' != phrase.charAt(0)) && force)?" ":SPACE) + phrase;
    }
    return phrase;
  }
  
  public String delimit(String phrase) {
    return delimit(phrase, true);
  }
  
  public String elideSemi(String phrase) {
    if (phrase.endsWith(SEMI)) {
      return phrase.substring(0, phrase.length() - SEMI.length());
    }
    return phrase;
  }

  public String makeBlock(String body) {
    body = elideSemi(body);
    // NEWLINE is for debug/readability, so our code is not _all_ on
    // one line
    return "{" + NEWLINE + elideSemi(body) + (body.endsWith("}") ? "" : NEWLINE) + "}";
  }

  public static String join(String token, String[] strings) {
    StringBuffer sb = new StringBuffer();
    int l = strings.length - 1;
    for (int x = 0; x < l; x++) {
      sb.append(strings[x]);
      sb.append(token);
    }
    if (l >= 0) {
      sb.append(strings[l]);
    }
    return(sb.toString());
  }
  
  public String visit(SimpleNode node) {
    if (node instanceof PassThroughNode) {
      node = ((PassThroughNode)node).realNode;
    }
    
    int size = node.size();
    SimpleNode[] childnodes = node.getChildren();
    String[] children = new String[size];
    for (int i = 0; i < size; i++) {
      SimpleNode n = childnodes[i];
      if (n instanceof PassThroughNode) {
        n = childnodes[i] = ((PassThroughNode)n).realNode;
      }
      children[i] = visit(n) ;
    }
    
    Class nt = node.getClass();
    
    // Are we doing OOP yet?
    if (node instanceof ASTProgram ||
        node instanceof ASTStatementList ||
        node instanceof ASTDirectiveBlock) {
      // Conditional join
      StringBuffer sb = new StringBuffer();
      String sep = "";
      int l = children.length;
      for (int x = 0; x < l; x++) {
        String child = children[x];
        // Elide empty nodes
        if (! "".equals(child)) {
          sb.append(sep);
          sb.append(child);
          if (! child.endsWith(SEMI)) {
            sep = SEMI + (compress ? SPACE : NEWLINE);
          } else {
            sep = (compress ? SPACE : NEWLINE);
          }
        }
      }
      return sb.toString();
    }
    if (node instanceof ASTStatement) {
      assert children.length == 1;
      String child = children[0];
      // Ensure an expression becomes a statement by appending an
      // explicit semicolon
      if ((! "".equals(child)) &&
          (! child.endsWith(SEMI))) {
        return child + SEMI;
      } else {
        return child;
      }
    }
    if (node instanceof ASTAssignmentExpression) {
      return visitAssignmentExpression(node, children);
    }
    if (node instanceof ASTCallExpression) {
      return visitCallExpression(node, children);
    }
    if (node instanceof ASTSuperCallExpression) {
      return visitSuperCallExpression(node, children);
    }
    if (node instanceof ASTConditionalExpression) {
      return visitConditionalExpression(node, children);
    }
    if (node instanceof ASTEmptyExpression) {
      return visitEmptyExpression(node, children);
    }
    if (node instanceof ASTForVarInStatement) {
      return visitForVarInStatement(node, children);
    }
    if (node instanceof ASTForInStatement) {
      return visitForInStatement(node, children);
    }
    if (node instanceof ASTForVarStatement || node instanceof ASTForStatement) {
      return visitForVarStatement(node, children);
    }
    if (node instanceof ASTNewExpression) {
      return visitNewExpression(node, children);
    }
    if (node instanceof ASTIfStatement || node instanceof ASTIfDirective) {
      return visitIfStatement(node, children);
    }
    if (node instanceof ASTPragmaDirective) {
      return visitPragmaDirective(node, children);
    }
    if (node instanceof ASTPostfixExpression) {
      return visitPostfixExpression(node, children);
    }
    if (node instanceof ASTPropertyIdentifierReference) {
      return visitPropertyIdentifierReference(node, children);
    }
    if (node instanceof ASTPropertyValueReference) {
      return visitPropertyValueReference(node, children);
    }
    if (node instanceof ASTReturnStatement) {
      return visitReturnStatement(node, children);
    }
    if (node instanceof ASTThisReference) {
      return visitThisReference(node, children);
    }
    if (node instanceof ASTContinueStatement) {
      return visitContinueStatement(node, children);
    }
    if (node instanceof ASTBreakStatement) {
      return visitBreakStatement(node, children);
    }
    if (node instanceof ASTUnaryExpression) {
      return visitUnaryExpression(node, children);
    }
    if (node instanceof ASTWithStatement) {
      return visitWithStatement(node, children);
    }
    if (node instanceof ASTDoWhileStatement) {
      return visitDoWhileStatement(node, children);
    }
    if (node instanceof ASTWhileStatement) {
      return visitWhileStatement(node, children);
    }
    if (node instanceof ASTSwitchStatement) {
      return visitSwitchStatement(node, children);
    }
    if (node instanceof ASTCaseClause) {
      return visitCaseClause(node, children);
    }
    if (node instanceof ASTDefaultClause) {
      return visitDefaultClause(node, children);
    }
    if (node instanceof ASTArrayLiteral) {
      return visitArrayLiteral(node, children);
    }
    if (node instanceof ASTBinaryExpressionSequence) {
      return visitBinaryExpressionSequence(node, children);
    }
    if (node instanceof ASTExpressionList ||
        node instanceof ASTFunctionCallParameters ||
        node instanceof ASTFormalParameterList) {
      return visitExpressionList(node, children);
    }
    if (node instanceof ASTAndExpressionSequence) {
      return visitAndOrExpressionSequence(true, node, children);
    }
    if (node instanceof ASTOrExpressionSequence) {
      return visitAndOrExpressionSequence(false, node, children);
    }
    if (node instanceof ASTFunctionDeclaration) {
      return visitFunctionDeclaration(node, children);
    }
    if (node instanceof ASTFunctionExpression) {
      return visitFunctionExpression(node, children);
    }
    if (node instanceof ASTIdentifier) {
      return visitIdentifier(node, children);
    }
    if (node instanceof ASTLiteral) {
      return visitLiteral(node, children);
    }
    if (node instanceof ASTObjectLiteral) {
      return visitObjectLiteral(node, children);
    }
    if (node instanceof ASTOperator) {
      return visitOperator(node, children);
    }
    if (node instanceof ASTVariableStatement) {
      return visitVariableStatement(node, children);
    }
    if (node instanceof ASTVariableDeclaration) {
      return visitVariableDeclaration(node, children);
    }
    if (node instanceof ASTVariableDeclarationList) {
      return visitVariableDeclarationList(node, children);
    }
    if (node instanceof ASTTryStatement) {
      return visitTryStatement(node, children);
    }
    if (node instanceof ASTCatchClause) {
      return visitCatchClause(node, children);
    }
    if (node instanceof ASTFinallyClause) {
      return visitFinallyClause(node, children);
    }
    if (node instanceof ASTThrowStatement) {
      return visitThrowStatement(node, children);
    }
    return defaultVisitor(node, children);
  }
  
  public String defaultVisitor(SimpleNode node, String[] children) {
    return "//\u00AB" + node.toString() + "(" + join(COMMA, children) + ")\u00BB";
  }
  
  // Copied (and massaged) from Parser.jjt
  public static String[] OperatorNames = {};
  static {
    ArrayList on = new ArrayList();
    // TODO: [2005-11-17 ptw] Not quite right, but javacc doesn't
    // tell us the range of its Ops
    for (int i = 0; i < 256; i++) { on.add("<" + Integer.toString(i) + ">"); }
    on.set(Ops.LPAREN, "(");
    on.set(Ops.LBRACKET, "[");
    on.set(Ops.DOT, ".");
    on.set(Ops.ASSIGN, "=");
    on.set(Ops.COMMA, ",");
    on.set(Ops.GT, ">");
    on.set(Ops.LT, "<");
    on.set(Ops.BANG, "!");
    on.set(Ops.TILDE, "~");
    on.set(Ops.HOOK, "?");
    on.set(Ops.COLON, ":");
    on.set(Ops.EQ, "==");
    on.set(Ops.LE, "<=");
    on.set(Ops.GE, ">=");
    on.set(Ops.NE, "!=");
    on.set(Ops.SEQ, "===");
    on.set(Ops.SNE, "!==");
    on.set(Ops.SC_OR, "||");
    on.set(Ops.SC_AND, "&&");
    on.set(Ops.INCR, "++");
    on.set(Ops.DECR, "--");
    on.set(Ops.PLUS, "+");
    on.set(Ops.MINUS, "-");
    on.set(Ops.STAR, "*");
    on.set(Ops.SLASH, "/");
    on.set(Ops.BIT_AND, "&");
    on.set(Ops.BIT_OR, "|");
    on.set(Ops.XOR, "^");
    on.set(Ops.REM, "%");
    on.set(Ops.LSHIFT, "<<");
    on.set(Ops.RSIGNEDSHIFT, ">>");
    on.set(Ops.RUNSIGNEDSHIFT, ">>>");
    on.set(Ops.PLUSASSIGN, "+=");
    on.set(Ops.MINUSASSIGN, "-=");
    on.set(Ops.STARASSIGN, "*=");
    on.set(Ops.SLASHASSIGN, "/=");
    on.set(Ops.ANDASSIGN, "&=");
    on.set(Ops.ORASSIGN, "|=");
    on.set(Ops.XORASSIGN, "^=");
    on.set(Ops.REMASSIGN, "%=");
    on.set(Ops.LSHIFTASSIGN, "<<=");
    on.set(Ops.RSIGNEDSHIFTASSIGN, ">>=");
    on.set(Ops.RUNSIGNEDSHIFTASSIGN, ">>>=");
    
    on.set(Ops.IN, "in");
    on.set(Ops.INSTANCEOF, "instanceof");
    on.set(Ops.TYPEOF, "typeof");
    on.set(Ops.DELETE, "delete");
    on.set(Ops.VOID, "void");
    on.set(Ops.NEW, "new");
    
    OperatorNames = (String[])on.toArray(OperatorNames);
  }
  
  public String visitAssignmentExpression(SimpleNode node, String[] children) {
    int thisPrec = prec(((ASTOperator)node.get(1)).getOperator(), false);
    assert children.length == 3;
    children[2] = maybeAddParens(thisPrec, node.get(2), children[2], true);
    return children[0] + SPACE + children[1] + delimit(children [2], false);
  }
  public String visitCallExpression(SimpleNode node, String[] children) {
    int thisPrec = prec(Ops.LPAREN, true);
    children[0] = maybeAddParens(thisPrec, node.get(0), children[0], true);
    return children[0] + "(" + children[1] + ")";
  }
  public String visitSuperCallExpression(SimpleNode node, String[] children) {
    // Same as above
    return "super." + children[0] + ("".equals(children[1])?"":("." + children[1]))  + "(" + children[2] + ")";
  }
  public String visitConditionalExpression(SimpleNode node, String[] children) {
    int thisPrec = prec(Ops.COLON, false);
    for (int i = 0; i < children.length; i++) {
      children[i] = maybeAddParens(thisPrec, node.get(i), children[i]);
    }
    return children[0] + CONDITIONAL + children[1] + ALTERNATIVE + children[2];
  }
  public String visitEmptyExpression(SimpleNode node, String[] children) {
    return "";
  }
  public String visitForVarInStatement(SimpleNode node, String[] children) {
    return "for" + OPENPAREN + "var " + children[0] + " in " + children[2] + CLOSEPAREN + makeBlock(children[3]);
  }
  public String visitForInStatement(SimpleNode node, String[] children) {
    return "for" + OPENPAREN + children[0] + " in " + children[1] + CLOSEPAREN + makeBlock(children[2]);
  }
  public String visitForVarStatement(SimpleNode node, String[] children) {
    // Need explicit semi because init clause may be empty
    return "for" + OPENPAREN + elideSemi(children[0]) + SEMI + children[1] + SEMI + children[2] + CLOSEPAREN + makeBlock(children[3]);
  }
  public String visitIfStatement(SimpleNode node, String[] children) {
    if (children.length == 2) {
      return "if" + OPENPAREN + children[0] + CLOSEPAREN + makeBlock(children[1]);
    } else if (children.length == 3) {
      return "if" + OPENPAREN + children[0] + CLOSEPAREN + makeBlock(children[1]) +
        SPACE + "else" + SPACE + makeBlock(children[2]);
    }
    return defaultVisitor(node, children);
  }
  public String visitNewExpression(SimpleNode node, String[] children) {
    int thisPrec = prec(Ops.NEW, true);
    SimpleNode c = node.get(0);
    children[0] = maybeAddParens(thisPrec, c, children[0]);
    return "new " + children[0] + "(" + children[1] + ")";
  }
  public String visitPragmaDirective(SimpleNode node, String[] children) {
    return "#pragma " + children[0];
  }
  public String visitPostfixExpression(SimpleNode node, String[] children) {
    int op = ((ASTOperator)node.get(1)).getOperator();
    int thisPrec = prec(op, true);
    children[0] = maybeAddParens(thisPrec, node.get(0), children[0]);
    return children[0] + children[1];
  }
  public String visitPropertyIdentifierReference(SimpleNode node, String[] children) {
    // These have prec of 0 even though they don't have ops
    int thisPrec = 0;
    for (int i = 0; i < children.length; i++) {
      children[i] = maybeAddParens(thisPrec, node.get(i), children[i], true);
    }
    return children[0] + "." + children[1];
  }
  public String visitPropertyValueReference(SimpleNode node, String[] children) {
    // These have prec of 0 even though they don't have ops
    int thisPrec = 0;
    children[0] = maybeAddParens(thisPrec, node.get(0), children[0], true);
    return children[0] + "[" + children[1] + "]";
  }
  public String visitReturnStatement(SimpleNode node, String[] children) {
    return "return" + delimit(children[0]);
  }
  public String visitThisReference(SimpleNode node, String[] children) {
    return "this";
  }
  public String visitContinueStatement(SimpleNode node, String[] children) {
    return "continue" + (children.length > 0 ? delimit(children[0]) : "");
  }
  public String visitBreakStatement(SimpleNode node, String[] children) {
    return "break" + (children.length > 0 ? delimit(children[0]) : "");
  }
  public String visitUnaryExpression(SimpleNode node, String[] children) {
    // Prefix and Unary are the same node
    int op = ((ASTOperator)node.get(0)).getOperator();
    boolean letter = java.lang.Character.isLetter(OperatorNames[op].charAt(0));
    int thisPrec = prec(op, true);
    children[1] = maybeAddParens(thisPrec, node.get(1), children[1]);
    return children[0] + (letter ? " " : "") + children[1];
  }
  public String visitWithStatement(SimpleNode node, String[] children) {
    return "with" + OPENPAREN + children[0] + CLOSEPAREN + makeBlock(children[1]);
  }
  public String visitWhileStatement(SimpleNode node, String[] children) {
    return "while" + OPENPAREN + children[0] + CLOSEPAREN + makeBlock(children[1]);
  }
  public String visitDoWhileStatement(SimpleNode node, String[] children) {
    return "do" + makeBlock(children[0]) + SPACE + "while" + OPENPAREN + children[1] + ")";
  }
  
  public String visitDefaultClause(SimpleNode node, String[] children) {
    return "default:" + NEWLINE + (children.length > 0 ? (children[0] + OPTIONAL_SEMI) : "");
  }
  public String visitCaseClause(SimpleNode node, String[] children) {
    return "case" + delimit(children[0]) + ":" + NEWLINE +
      (children.length > 1 ? (children[1] + OPTIONAL_SEMI) : "");
  }
  public String visitSwitchStatement(SimpleNode node, String[] children) {
    String body = "";
    for (int i = 1, len = children.length; i < len; i++) {
      body += children[i];
    }
    return "switch" + OPENPAREN + children[0] + CLOSEPAREN + makeBlock(body);
  }
  
  
  // TODO: [2005-11-15 ptw] Make this a simple lookup table based on
  // the operator
  public int prec(int op, boolean unary) {
    String n = OperatorNames[op];
    String classes[][] = {
      {"(", "[", ".", "new"},
      {"!", "~", "-", "+", "--", "++", "typeof", "void", "delete"},
      {"*", "/", "%"},
      {"+", "-"},
      {"<<", ">>", ">>>"},
      {"<", "<=", ">", ">=", "instanceof", "in", "is", "cast"},
      {"==", "!=", "===", "!=="},
      {"&"}, {"^"}, {"|"}, {"&&"}, {"||"}, {"?", ":"},
      {"=", "*=", "/=", "%=", "+=", "-=", "<<=", ">>=", ">>>=", "&=", "^=", "|="},
      {","}};
    for (int i = (unary ? 0 : 2), il = classes.length; i < il; i++) {
      for (int j = 0, jl = classes[i].length; j <  jl; j++) {
        if (classes[i][j].equals(n)) {
          return -i;
        }
      }
    }
  assert false : "unknown operator: " + n;
    return 1;
  }
  
  public String visitArrayLiteral(SimpleNode node, String[] children) {
    int thisPrec = prec(Ops.COMMA, false);
    for (int i = 0; i < children.length; i++) {
      children[i] = maybeAddParens(thisPrec, node.get(i), children[i], false);
    }
    return "[" + join(COMMA, children) + "]";
  }
  
  public String maybeAddParens(int parentPrec, SimpleNode node, String nodeRep) {
    return maybeAddParens(parentPrec, node, nodeRep, false);
  }
  
  // Set assoc to true if the sub-expression appears in a place
  // where operator associativity implies the parens, e.g. on the
  // left operand of a binary operator that is left-to-right
  // associative.  (It is always safe to leave it false, you will
  // just end up with extra parens where you don't need them, which
  // will impact compression but not correctness.)
  public String maybeAddParens(int parentPrec, SimpleNode node, String nodeRep, boolean assoc) {
    int thisPrec = Integer.MAX_VALUE;
    if (node instanceof ASTBinaryExpressionSequence ||
        node instanceof ASTAssignmentExpression) {
      thisPrec = prec(((ASTOperator)node.get(1)).getOperator(), false);
    } else if (node instanceof ASTUnaryExpression) {
      thisPrec = prec(((ASTOperator)node.get(0)).getOperator(), true);
    } else if (node instanceof ASTPostfixExpression) {
      thisPrec = prec(((ASTOperator)node.get(1)).getOperator(), true);
    } else if (node instanceof ASTAndExpressionSequence) {
      thisPrec = prec(Ops.SC_AND, false);
    } else if (node instanceof ASTOrExpressionSequence) {
      thisPrec = prec(Ops.SC_OR, false);
    } else if (node instanceof ASTConditionalExpression) {
      thisPrec = prec(Ops.COLON, false);
    } else if (node instanceof ASTNewExpression) {
      thisPrec = prec(Ops.NEW, true);
    } else if (node instanceof ASTCallExpression ||
               node instanceof ASTSuperCallExpression) {
      thisPrec = prec(Ops.LPAREN, true);
    } else if (node instanceof ASTPropertyValueReference) {
      thisPrec = prec(Ops.LBRACKET, true);
    } else if (node instanceof ASTPropertyIdentifierReference) {
      thisPrec = prec(Ops.DOT, true);
    } else if (node instanceof ASTExpressionList) {
      thisPrec = prec(Ops.COMMA, false);
    } else if (// Our compiler is broken -- if one of these shows up
               // in an expression, it had to have been in an
               // expression list initially
               node instanceof ASTFunctionExpression ||
               node instanceof ASTFunctionDeclaration) {
      thisPrec = prec(Ops.ASSIGN, false);
    } else if (node instanceof ASTObjectLiteral ||
               node instanceof ASTArrayLiteral ||
               node instanceof ASTIdentifier ||
               node instanceof ASTThisReference ||
               node instanceof ASTLiteral) {
      ;
    } else {
      System.err.println("No prec for " + node + " in " + Compiler.nodeString(node));
      (new CompilerException()).printStackTrace();
    }
    
    if (assoc ? (thisPrec < parentPrec) : (thisPrec <= parentPrec)) {
      nodeRep = "(" + nodeRep + ")";
    }
    return nodeRep;
  }
  
  public String visitAndOrExpressionSequence(boolean isAnd, SimpleNode node, String[] children) {
    int thisPrec = prec(isAnd ? Ops.SC_AND : Ops.SC_OR, false);
    children[0] = maybeAddParens(thisPrec, node.get(0), children[0], true);
    for (int i = 1; i < children.length; i++) {
      children[i] = delimit(maybeAddParens(thisPrec, node.get(i), children[i]), false);
    }
    return join(isAnd ? (SPACE + "&&") : (SPACE + "||"), children);
  }
  
  public String visitExpressionList(SimpleNode node, String[] children) {
    int thisPrec = prec(Ops.COMMA, false);
    for (int i = 0; i < children.length; i++) {
      children[i] = maybeAddParens(thisPrec, node.get(i), children[i]);
    }
    return join(COMMA, children);
  }
  
  public String visitBinaryExpressionSequence(SimpleNode node, String[] children) {
    int thisPrec = prec(((ASTOperator)node.get(1)).getOperator(), false);
    for (int i = 0; i < children.length; i += (i==0?2:1)) {
      children[i] = maybeAddParens(thisPrec, node.get(i), children[i], i == 0);
    }
    
    String op = children[1];
    char opChar = op.charAt(op.length() - 1);
    StringBuffer sb = new StringBuffer();
    boolean required = java.lang.Character.isLetter(op.charAt(0));
    String space = required?" ":SPACE;
    sb.append(children[0]);
    for (int x = 2; x < (children.length); x++) {
      String child = children[x];
      sb.append(space);
      sb.append(op);
      // Disambiguate `a + ++b`, `a++ + b` etc.
      sb.append(delimit(child, required || opChar == child.charAt(0)));
    }
    return(sb.toString());
  }
  
  public String visitFunctionDeclaration(SimpleNode node, String[] children) {
    return doFunctionDeclaration(node, children, true);
  }
  
  public String visitFunctionExpression(SimpleNode node, String[] children) {
    // Elide optional name if compressing, otherwise leave it for debugging
    return doFunctionDeclaration(node, children, this.compress ? false : true);
  }
  
  String doFunctionDeclaration(SimpleNode node, String[] children, boolean useName) {
    String name, args, body;
    if (children.length == 2) {
      name = "";
      args = children[0];
      body = children[1];
    } else if (children.length == 3) {
      name = children[0];
      args = children[1];
      body = children[2];
    } else {
      return defaultVisitor(node, children);
    }
    String loc = "";
    // Add location information if not compressing
    if ((!this.compress) && (node.filename != null) && (node.beginLine != 0)) {
      loc = ("\n/* -*- file: " + Compiler.getLocationString(node) + " -*- */\n" );
    }
    return
      loc + "function" + (useName ? (" " + name) : "") + OPENPAREN + args + CLOSEPAREN + makeBlock(body);
  }

  public String visitIdentifier(SimpleNode node, String[] children) {
    return ((ASTIdentifier)node).getName();
  }
  
  static Double zero = new Double(0);
  
  public String visitLiteral(SimpleNode node, String [] children) {
    Object value = ((ASTLiteral)node).getValue();
    if (value instanceof String) {
      return ScriptCompiler.quote((String)value);
    }
    if (value instanceof Double) {
      // Make integers compact
      Double n = (Double)value;
      long l = n.longValue();
      if ((double)l == n.doubleValue()) {
        if (l == 0 ) {return "0";}
        else {
          String d = Long.toString(l);
          if (compress && l > 0) {
            String h = "0x" + Long.toHexString(l);
            if (h.length() <= d.length()) {
              return h;
            }
          }
          return d;
        }
      }
    }
    return "" + value;
  }
  
  public String visitObjectLiteral(SimpleNode node, String[] children) {
    StringBuffer s = new StringBuffer("{");
    int len = children.length - 1;
    int thisPrec = prec(Ops.COMMA, false);
    for (int i = 0; i < len; i++) {
      if (i % 2 != 0) {
        children[i] = maybeAddParens(thisPrec, node.get(i), children[i], false);
        s.append(children[i]);
        s.append(COMMA);
      } else {
        s.append(children[i]);
        s.append(COLON);
      }
    }
    if (len > 0) {
      children[len] = maybeAddParens(thisPrec, node.get(len), children[len], false);
      s.append(children[len]);
    }
    s.append("}");
    return s.toString();
  }
  
  public String visitOperator(SimpleNode op, String[] children) {
    int operator = ((ASTOperator)op).getOperator();
    return OperatorNames[operator];
  }
  
  public String visitVariableStatement(SimpleNode node, String[] children) {
    assert children.length == 1;
    // Ensure an expression becomes a statement by appending an
    // explicit semicolon
    return "var " + children[0] + SEMI;
  }

  public String visitVariableDeclaration(SimpleNode node, String[] children) {
    if (children.length > 1) {
      int thisPrec = prec(Ops.ASSIGN, false);
      assert children.length == 2;
      children[1] = maybeAddParens(thisPrec, node.get(1), children[1], true);
      return children[0] + ASSIGN + children[1];
    } else {
      return children[0];
    }
  }
  
  public String visitVariableDeclarationList(SimpleNode node, String[] children) {
    return join(COMMA, children);
  }

  public String visitTryStatement(SimpleNode node, String[] children) {
    if (children.length == 2) {
      return "try" + SPACE + makeBlock(children[0]) + NEWLINE + children[1];
    } else if (children.length == 3) {
      return "try" + SPACE + makeBlock(children[0]) + NEWLINE + children[1] + NEWLINE + children[2];
    }
    return defaultVisitor(node, children);
  }
  public String visitCatchClause(SimpleNode node, String[] children) {
    return "catch" + OPENPAREN + children[0] + CLOSEPAREN + makeBlock(children[1]);
  }
  public String visitFinallyClause(SimpleNode node, String[] children) {
    return "finally" + SPACE + makeBlock(children[0]);
  }
  public String visitThrowStatement(SimpleNode node, String[] children) {
    return "throw" + delimit(children[0]);
  }
}
