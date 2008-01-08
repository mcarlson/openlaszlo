/* -*- mode: Java; c-basic-offset: 2; -*- */

/**
 * Common Code for Translation and Code Generation
 *
 * @author steele@osteele.com
 * @author ptw@openlaszlo.org
 * @author dda@ddanderson.com
 * @description: Common baseclass for code generators
 *
 * This class is extended by CodeGenerator, JavascriptGenerator.
 */

//
// AST Visitor
//

package org.openlaszlo.sc;
import java.io.*;
import java.util.*;
import java.nio.ByteBuffer;

import org.openlaszlo.sc.parser.*;
import org.openlaszlo.sc.Instructions;
import org.openlaszlo.sc.Instructions.Instruction;

import org.openlaszlo.cache.PersistentMap;

/**
 * Methods to visit each kind of object in the AST.
 */
public interface ASTVisitor {

  SimpleNode visitArrayLiteral(SimpleNode node, boolean isReferenced, SimpleNode[] children);
  SimpleNode visitAssignmentExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children);
  SimpleNode visitBinaryExpressionSequence(SimpleNode node, boolean isReferenced, SimpleNode[] children);
  SimpleNode visitCallExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children);
  SimpleNode visitConditionalExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children);
  SimpleNode visitDoWhileStatement(SimpleNode node, SimpleNode[] children);
  SimpleNode visitEmptyExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children);
  SimpleNode visitExpression(SimpleNode node);
  SimpleNode visitExpression(SimpleNode node, boolean isReferenced);
  SimpleNode visitExpressionList(SimpleNode node, boolean isReferenced, SimpleNode[] children);
  SimpleNode visitForInStatement(SimpleNode node, SimpleNode[] children);
  SimpleNode visitForStatement(SimpleNode node, SimpleNode[] children);
  SimpleNode visitForVarStatement(SimpleNode node, SimpleNode[] children);
  SimpleNode visitFunctionCallParameters(SimpleNode node, boolean isReferenced, SimpleNode[] children);
  SimpleNode visitFunctionDeclaration(SimpleNode node, SimpleNode[] ast);
  SimpleNode visitFunctionExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children);
  SimpleNode visitIdentifier(SimpleNode node, boolean isReferenced, SimpleNode[] children);
  SimpleNode visitIfStatement(SimpleNode node, SimpleNode[] children);
  SimpleNode visitLiteral(SimpleNode node, boolean isReferenced, SimpleNode[] children);
  SimpleNode visitNewExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children);
  SimpleNode visitObjectLiteral(SimpleNode node, boolean isReferenced, SimpleNode[] children);
  SimpleNode visitPostfixExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children);
  SimpleNode visitPrefixExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children);
  SimpleNode visitProgram(SimpleNode node, SimpleNode[] directives, String cpass);
  SimpleNode visitProgram(SimpleNode node, SimpleNode[] directives, String cpass, boolean top);
  SimpleNode visitPropertyIdentifierReference(SimpleNode node, boolean isReferenced, SimpleNode[] children);
  SimpleNode visitPropertyValueReference(SimpleNode node, boolean isReferenced, SimpleNode[] children);
  SimpleNode visitReturnStatement(SimpleNode node, SimpleNode[] children);
  SimpleNode visitStatement(SimpleNode node, SimpleNode[] children);
  SimpleNode visitSuperCallExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children);
  SimpleNode visitSwitchStatement(SimpleNode node, SimpleNode[] children);
  SimpleNode visitThisReference(SimpleNode node, boolean isReferenced, SimpleNode[] children);
  SimpleNode visitThrowStatement(SimpleNode node, SimpleNode[] children);
  SimpleNode visitTryStatement(SimpleNode node, SimpleNode[] children);
  SimpleNode visitUnaryExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children);
  SimpleNode visitVariableDeclaration(SimpleNode node, SimpleNode[] children);
  SimpleNode visitVariableDeclarationList(SimpleNode node, SimpleNode[] children);
  SimpleNode visitVariableStatement(SimpleNode node, SimpleNode[] children);
  SimpleNode visitWhileStatement(SimpleNode node, SimpleNode[] children);
  SimpleNode visitWithStatement(SimpleNode node, SimpleNode[] children);
}

/**
 * @copyright Copyright 2006-2008 Laszlo Systems, Inc.  All Rights
 * Reserved.  Use is subject to license terms.
 */

