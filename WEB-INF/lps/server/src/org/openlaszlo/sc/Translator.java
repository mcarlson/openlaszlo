/* -*- mode: Java; c-basic-offset: 2; -*- */

/***
 * Translator interface
 */

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.sc;
import org.openlaszlo.sc.Instructions;
import org.openlaszlo.sc.parser.SimpleNode;
import java.util.*;

public interface Translator {

  public TranslationContext getContext();

  public Compiler.OptionMap getOptions();

  public void setOptions(Compiler.OptionMap options);

  public void translate(SimpleNode program);

  public InstructionCollector getCollector();

  public String newLabel(SimpleNode node);

  public void unwindEnumeration(SimpleNode node);

  public boolean visitExpression(SimpleNode node);
}




