/* -*- mode: Java; c-basic-offset: 2; -*- */

/***
 * Assembler.java
 *
 * Description: The assembler translates an assembly instruction into
 * a sequence of bytes.
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
import org.openlaszlo.sc.Emitter;

// Assembly is relatively straightforward except for the PUSH
// instruction, and label resolution.
//
// During the assembly of PUSH, strings in the constant pool are
// replaced by constant-pool references.
//
// Note that the assembler, not the code generator, is responsible for
// recognizing which string arguments to a PUSH instruction can refer
// to the constant pool.
//
// Label targets are are entered in a table mapping label names to
// offsets.  Instructions that contain label sources are processed as
// follows: a backwards reference is replaced by a byte offset, while a
// forward-reference is entered in a table mapping a label name to a
// list of offsets whence the label is referenced.  When a label is
// encountered, the forward-reference table is used to backpatch
// forward references.

public class Assembler implements Emitter {
  Hashtable labels;
  ByteBuffer bytes;
  private static byte[] backingStore;
  Hashtable constants;

   // relative indicates a normal relative reference if relative is
   // false, this reference is part of label arithmetic, that is, a
   // difference of two labels:
   //    (label2 - label1)
   // this produces two references, one with positive=true and one
   // with positive=false.
  public static class LabelReference {
    int patchloc;
    boolean relative;
    boolean positive;
  }

  public static class Label {
    Object name;
    int location;
    List references;

    // Java sucks
    protected int MIN_OFFSET() {return -1<<15;};
    protected int MAX_OFFSET() {return (1<<15)-1;};


    public Label(Object name) {
      this.name = name;
      this.location = -1;
      this.references = new ArrayList();
    }

    public boolean isResolved() {
      return location != -1;
    }

    public void setLocation(ByteBuffer bytes) {
      assert (! isResolved()) : "Label.setLocation() called on resolved label";
      assert bytes.order() == ByteOrder.LITTLE_ENDIAN;
      location = bytes.position();
      // Backpatch forward jumps
      for (Iterator i =  references.iterator(); i.hasNext(); ) {
        LabelReference lr = (LabelReference)i.next();
        int patchloc = lr.patchloc;
        int offset = location - (patchloc + 2);
        if (!lr.relative) {
          // If we are doing label arithmetic, we store the relative
          // offset of the first label we encounter, when the second
          // label is encountered it will subtract its offset.  When
          // the instruction is first written, it will write 0 offsets
          // at the patchloc.  So, the test for curval == 0 is saying
          // "is this the first label we have encountered for this
          // location?"  And if so, it will not do any arithmetic, it
          // will simply write the offset of that label into the
          // patchloc.
          // FIXME [2007-12-14 ptw] (LPP-5262) This will fail if the
          // blocks in the try are maximal
          // Fetch unsigned:
          int curval = bytes.getShort(patchloc) & MAX_OFFSET();
          if (curval == 0) {
            ;
          } else if (lr.positive) {
            offset = offset - curval;
          } else {
            offset = curval - offset;
          }
        }

        if (offset < MIN_OFFSET() || offset > MAX_OFFSET()) {
          throw new CompilerException((this instanceof Block?"Block":"Label") + " " +
                                      name + ": jump offset " + offset + " too large");
        }
        bytes.putShort(patchloc, (short)offset);
      }
      references = null;
    }

    public short computeOffset(ByteBuffer bytes) {
      assert (isResolved()) : "Label.computeOffset() called on unresolved label";
      assert bytes.order() == ByteOrder.LITTLE_ENDIAN;
      int offset = location - bytes.position();
      if (offset < MIN_OFFSET() || offset > MAX_OFFSET()) {
        throw new CompilerException((this instanceof Block?"Block":"Label") + " " +
                                    name + ": jump offset " + offset + " too large");
      }
      return (short) offset;
    }

    public void addReference(int patchloc) {
      addReference(patchloc, true, true);
    }

    public void addReference(int patchloc, boolean relative, boolean positive) {
      assert (! isResolved()) : "adding reference to resolved label";
      LabelReference lr = new LabelReference();
      lr.patchloc = patchloc;
      lr.relative = relative;
      lr.positive = positive;
      references.add(lr);
    }

    public String toString() {
      return name.toString();
    }
  }

  public static class Block extends Label {
    protected int MIN_OFFSET() {return 0;};
    protected int MAX_OFFSET() {return (1<<16)-1;};

    public Block(Object name) {
      super(name);
    }
  }


  private synchronized byte[] getBacking() {
    byte[] b = backingStore;
    backingStore = null;
    return b;
  }

  private synchronized void setBacking(byte[] b) {
    backingStore = b;
  }

  public Assembler() {
    this.labels = new Hashtable(); // {String -> Label}
    // Try to reuse the backing buffer
    byte[] bs = getBacking();
    if (bs != null) {
      this.bytes = ByteBuffer.wrap(bs);
      bytes.order(ByteOrder.LITTLE_ENDIAN);
    } else {
      // Room to not grow immediately.  See emit.
      this.bytes = ByteBuffer.allocate((1<<14) + (1<<16));
      bytes.order(ByteOrder.LITTLE_ENDIAN);
    }
    this.constants = new Hashtable(); // {String -> int}
  }

  public byte[] assemble(List instrs) {
    for (Iterator i = instrs.iterator(); i.hasNext(); ) {
      emit((Instruction)i.next());
    }
    List unresolvedLabels = new ArrayList();
    // One wonders why this couldn't be an Iterator
    for (Enumeration i = labels.elements(); i.hasMoreElements(); ) {
      Label label = (Label)i.nextElement();
      if (! label.isResolved()) {
        unresolvedLabels.add(label);
      }
    }
    //System.out.println("assembled: " + bytes.toString());
    assert (unresolvedLabels.size() == 0) : "unresolved labels: " + unresolvedLabels;
    // TODO [2004-03-04 ptw] be more efficient than this!
    byte[] result = new byte[bytes.position()];
    bytes.flip();
    bytes.get(result);
    // Save the backing buffer
    setBacking(bytes.array());
    return result;
  }

  public Label getLabel(Object name, boolean signed) {
    if (! labels.containsKey(name)) {
      if (signed) {
        labels.put(name, new Label(name));
      } else {
        labels.put(name, new Block(name));
      }
    }
    return (Label)labels.get(name);
  }

  public void resolveTarget(TargetInstruction target, Label[] labels) {
    if (labels.length > 1) {

      // Multiple labels indicate that we are doing label arithmetic,
      // each pair is a difference of values, used to compute the
      // size of a code block.  This is needed for the try instruction.
      // At the moment, we only implement this for forward references,
      // which solves the only case we care about with the try instruction.

      assert labels.length % 2 == 0 : "multiple target labels must be in pairs";

      // Emit the instruction and then get the list of addresses
      // to backpatch.

      int origloc = bytes.position();
      target.writeBytes(bytes, constants);

      for (int i=0; i<labels.length; i+=2) {
        Label labelpos = labels[i];
        Label labelneg = labels[i+1];

        assert (labelpos.location == -1 && labelneg.location == -1) :
          "target arithmetic using backward refs not implemented";

        int targetoff = target.targetOffset(i/2);
        int patchloc = (targetoff < 0 ? bytes.position() : origloc) + targetoff;

        labelpos.addReference(patchloc, false, true);  // add absolute pos value
        labelneg.addReference(patchloc, false, false); // add absolute neg value
      }
    } else if (labels[0].location == -1) {
      // Target location isn't yet available.  Use a null
      // offset, and add the address to be patched to this
      // label's list of backpatch locations.
      int origloc = bytes.position();
      target.writeBytes(bytes, constants);

      int targetoff = target.targetOffset(0);
      int patchloc = (targetoff < 0 ? bytes.position() : origloc) + targetoff;
      labels[0].addReference(patchloc);
    } else {
      // Target computation requires that we write the instruction first!
      target.targetOffset = 0;
      target.writeBytes(bytes, constants);
      short offset = labels[0].computeOffset(bytes);
      assert bytes.order() == ByteOrder.LITTLE_ENDIAN;
      bytes.putShort(bytes.position() - 2, offset);
    }
  }

  public void emit(Instruction instr) {
    // Verify there is room for a maximal instruction (1<<16)
    if (! (bytes.remaining() > 1<<16)) {
      // TODO [2004-03-11 ptw] Spool to file above a certain size
      ByteBuffer newBytes = ByteBuffer.allocate(bytes.capacity() * 2);
      newBytes.order(ByteOrder.LITTLE_ENDIAN);
      ByteBuffer oldBytes = bytes;
      bytes.flip();
      newBytes.put(bytes);
      bytes = newBytes;
      //System.out.println("Grow buffer: " + oldBytes + " => " + newBytes);
    }
    if (instr instanceof ConcreteInstruction && ((ConcreteInstruction)instr).op == Actions.CONSTANTS) {
      // Initialize the constant map
      this.constants = new Hashtable();
      for (ListIterator i = ((ConcreteInstruction)instr).args.listIterator(); i.hasNext(); ) {
        int index = i.nextIndex();
        constants.put(i.next(), new Integer(index));
      }
      // Fall through to the general case
    }
    if (instr instanceof LABELInstruction) {
      Object name = ((LABELInstruction)instr).name;
      Label label = getLabel(name, true);
      assert (! label.isResolved()) : "duplicate label" + label;
      // Get the current location, and save it for backjumps
      label.setLocation(bytes);
    } else if (instr instanceof TargetInstruction) {
      TargetInstruction target = (TargetInstruction)instr;
      Object targetval = target.getTarget();
      Label[] labels;
      if (targetval instanceof Object[]) {
        Object[] vals = (Object[])targetval;
        labels = new Label[vals.length];
        for (int i=0; i<vals.length; i++)
          labels[i] = getLabel(vals[i], instr instanceof BranchInstruction);
      }
      else {
        labels = new Label[1];
        labels[0] = getLabel(targetval, instr instanceof BranchInstruction);
      }
      resolveTarget(target, labels);
    } else {
      instr.writeBytes(bytes, constants);
    }
  }
}
