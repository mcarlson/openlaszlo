/* -*- mode: Java; c-basic-offset: 2; -*- */

/***
 * Translator interface
 */

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.sc;
import org.openlaszlo.sc.Instructions;
import org.openlaszlo.sc.parser.SimpleNode;
import java.util.*;

public interface Translator extends ASTVisitor {

  public TranslationContext getContext();

  public void setOriginalSource(String source);

  public String preProcess(String source);

  public SimpleNode translate(SimpleNode program);

  public List /*<TranslationUnit>*/ makeTranslationUnits(SimpleNode translatedNode, boolean compress, boolean obfuscate);

  public byte[] postProcess(List /*<TranslationUnit>*/ tr);
}
