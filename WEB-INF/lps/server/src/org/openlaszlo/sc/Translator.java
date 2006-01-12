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

public abstract class Translator {

  public abstract TranslationContext getContext();

  public abstract Compiler.OptionMap getOptions();

  public abstract void setOptions(Map options);

  public abstract void translate(Object program);

  public abstract Object getCollector();

  public abstract void generateConstants();

  public abstract void appendInstructions(Instructions.Instruction[] instrs);

  public abstract List getInstructions(boolean generateConstants);

  public abstract String newLabel(SimpleNode node);

  public abstract void unwindEnumeration(SimpleNode node);

}




