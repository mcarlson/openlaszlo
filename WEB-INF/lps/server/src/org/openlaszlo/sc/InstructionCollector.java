/* -*- mode: Java; c-basic-offset: 2; -*- */

/***
 * InstructionCollector.java
 *
 * Description: Instruction buffer for the assembler
 *
 * Assembly consists of two passes, one to create the constant
 * pool, and another to assemble the instructions to byte sequences.
 * The InstructionBuffer holds instructions between these passes.
 *
 * The InstructionBuffer will be replaced by a FlowAnalyzer, which will
 * perform basic-block analysis.  That's the main justification for
 * keeping this class here, instead of adding a wrapper around
 * Assembler the way peep-hole optimization is done.
 *
 * During the first pass (as instructions are collected), the buffer
 * scans the instruction sequence for string arguments to PUSH
 * instructions.  It computes an occurrence count for each string, and
 * sorts the list of strings that occurred more than once by occurrence
 * count.  The first 64K of these are placed in the constant pool.
 * (The sort assures that PUSH can use one-byte indices for the most
 * frequently-referenced strings.)
 *
 * During the second pass, each instruction is passed to the assembler,
 * and the resulting bytecodes are appended to an accumulated bytecode
 * sequence.
 */

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.sc;
import java.io.*;
import java.nio.*;
import java.util.*;
import org.openlaszlo.sc.Instructions.*;

public class InstructionCollector extends ArrayList {
  public int nextLabel;
  public ConstantCollector constantCollector;
  public boolean constantsGenerated;

  public InstructionCollector(boolean disableConstantPool, boolean sortConstantPool) {
    super();
    this.nextLabel = 0;
    if (! disableConstantPool) {
      this.constantCollector = sortConstantPool ? new SortedConstantCollector() : new ConstantCollector();
    } else {
      this.constantCollector = null;
    }
    this.constantsGenerated = false;
  }

  public void emit(Instruction instr) {
    // Update the constant pool.
    if (constantCollector != null && instr instanceof PUSHInstruction) {
      PUSHInstruction push = (PUSHInstruction)instr;
      for (Iterator i = push.args.iterator(); i.hasNext(); ) {
        Object next = i.next();
        if (next instanceof String) {
          constantCollector.add(next);
        }
      }
    }
    super.add(instr);
  }

  public void push(Object value) {
    emit(Instructions.PUSH.make(value));
  }

  public void push(int value) {
    push(new Integer(value));
  }

  public void push(boolean value) {
    push(Boolean.valueOf(value));
  }

  public void generateConstants() {
    // Only okay to call this once.
    assert (! constantsGenerated);
    ConstantCollector pool = constantCollector;
    // TODO: [2003-07-15 ptw] (krank) turn off the constant pool
    // for simplicity for now, but someday eliminate that
    if (pool != null  && (! pool.isEmpty())) {
      // TODO: [2003-03-06 ptw] Make CONSTANTS its own class?
      super.add(0, Instructions.CONSTANTS.make(pool.getConstants()));
      constantsGenerated = true;
    }
  }

  // Rename labels uniquely
  private Object uniqueLabel(Map labels, Object label)
  {
    Object newLabel = labels.get(label);
    if (newLabel == null) {
      newLabel = newLabel();
      labels.put(label, newLabel);
    }
    return newLabel;
  }

  public void appendInstructions(List instrsList) {
    // TODO [2003-03-06 ptw] Why not relabel all instructions? (I.e.,
    // move this to emit)
    Map labels = new HashMap();
    Instruction[] instrs = (Instruction[])instrsList.toArray(new Instruction[0]);
    for (int i = 0; i < instrs.length; i++) {
      Instruction instr = instrs[i];
      if (instr instanceof LABELInstruction) {

        Object newLabel = uniqueLabel(labels, ((LABELInstruction)instr).name);
        instr = Instructions.LABEL.make(newLabel);
      } else if (instr instanceof TargetInstruction) {
        TargetInstruction target = (TargetInstruction)instr;
        Object newLabel = uniqueLabel(labels, target.getTarget());
        instr = target.replaceTarget(newLabel);
      }
      emit(instr);
    }
  }

  public List getInstructions(boolean generateConstants) {
    if (! constantsGenerated && generateConstants) {
      generateConstants();
    }
    return this;
  }

  public String newLabel() {
    return "L" + nextLabel++;
  }

  public String newLabel(String prefix) {
    return prefix + "$" + nextLabel++;
  }

  public static class ConstantCollector extends ArrayList {
    public Object[] getConstants() {
      return toArray();
    }
  }


  // Long way to go for a closure
  public static class ConstantSorter implements Comparator {
    public int compare(Object o1, Object o2) {
      Map.Entry me1 = (Map.Entry)o1;
      int n1 = ((Integer)me1.getValue()).intValue();
      Map.Entry me2 = (Map.Entry)o2;
      int n2 = ((Integer)me2.getValue()).intValue();
      // Sort larger to the front (higher usage)
      // Longer string wins in a tie
      if (n1 == n2) {
        int l1 = ((String)me1.getKey()).length();
        int l2 = ((String)me2.getKey()).length();
        return l2 - l1;
      } else {
        return n2 - n1;
      }
    }

    public boolean equals (Object other) {
      // Too specific?  Do we care?
      return this == other;
    }
  }

  // There is probably some idiom for singletons that I don't know
  private static ConstantSorter sorter = new ConstantSorter();

  // This is kind of like a sorted set, but delays the sorting until
  // you ask for values from the set, and has a special limit on the
  // number of values that can be in the set.
  public static class SortedConstantCollector extends ConstantCollector {
    public Map usageCount;
    public boolean updated;
    public boolean frozen;

    SortedConstantCollector() {
      super();
      usageCount = new HashMap();
      updated = false;
      frozen = false;
    }

    public void add(int index, Object value) {
      assert (! frozen) : "Add after constant pool frozen";
      updated = false;
      if (usageCount.containsKey(value)) {
        int n = ((Integer)usageCount.get(value)).intValue();
        usageCount.put(value, new Integer(n + 1));
      } else {
        usageCount.put(value, new Integer(1));
      }
    }

    public boolean add(Object value) {
      add(size(), value);
      return true;
    }

    public boolean addAll(int index, Collection c) {
      for (Iterator i = c.iterator(); i.hasNext(); index++) {
        add(index, i.next());
      }
      return true;
    }

    public boolean addAll(Collection c) {
      return addAll(size(), c);
    }

    public void clear() {
      assert (! frozen) : "Clear after constant pool frozen";
      updated = false;
      usageCount.clear();
      super.clear();
    }

    public boolean contains(Object value) {
      // Should this return if value was ever added, or if value will
      // be in the permitted subset?
      return usageCount.containsKey(value);
    }

    public int indexOf(Object value) {
      update();
      return super.indexOf(value);
    }

    public boolean isEmpty() {
      return usageCount.size() == 0;
    }

    public int lastIndexOf(Object value) {
      update();
      return super.lastIndexOf(value);
    }

    private Object removeInternal(int index) {
      assert (! frozen) : "removeInternal after constant pool frozen";
      updated = false;
      Object value = super.remove(index);
      usageCount.remove(value);
      return value;
    }

    public Object remove(int index) {
      update();
      return removeInternal(index);
    }

    protected void removeRange(int fromIndex, int toIndex) {
      update();
      for (int i = fromIndex; i < toIndex; i++) {
        removeInternal(i);
      }
    }

    public Object set(int index, Object value) {
      update();
      remove(index);
      add(value);
      return value;
    }

    public Object[] toArray() {
      update();
      return super.toArray();
    }

    public Object[] toArray(Object[] array) {
      update();
      return super.toArray(array);
    }

    public String toString() {
      update();
      return super.toString();
    }

    private void update() {
      if (! updated) {
        assert (! frozen) : "update after constant pool frozen";
        super.clear();
        ArrayList sorted = new ArrayList();
        for (Iterator i = usageCount.entrySet().iterator(); i.hasNext(); ) {
          sorted.add(i.next());
        }
        Collections.sort(sorted, sorter);
        // Total size of an action must be < 65535, opcode + length
        // field is 3 bytes, also must account for encoding of strings
        int room = 65535 - 3;
        String encoding = "UTF-8";
        String runtime = Instructions.getRuntime();
        try {
          for (Iterator i = sorted.iterator(); i.hasNext(); ) {
            String symbol = (String)((Map.Entry)i.next()).getKey();
            room -= (symbol.getBytes(encoding).length + 1);
            if (room <= 0) break;
            super.add(symbol);
          }
        } catch (UnsupportedEncodingException e) {
          assert false : "this can't happen";
        }
        updated = true;
      }
    }

    public Object[] getConstants() {
      Object [] constants = toArray();
      frozen = true;
      return constants;
    }
  }
}
