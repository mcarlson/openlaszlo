/* -*- mode: Java; c-basic-offset: 2; -*- */

/***
 * TranslationUnit.java
 * Author: Don Anderson
 * Description: A collector for the part of the Javascript
 * output that corresponds to a single class definition,
 * and thus as an input file to the third party compiler.
 * Line numbers from the original source file are tracked and
 * related to line numbers in the translation unit so that any compile
 * errors from the third party compiler can be translated back
 * to the original source line numbers.
 */

package org.openlaszlo.sc;

import java.util.*;

public class TranslationUnit
{
  private String name;                  // name of class
  private StringBuffer text = new StringBuffer();
  private SortedMap lnums = new TreeMap();
  private int linenum = 1;
  private int lineOffset = 0;   // size of preamble, that otherwise messes with our line mapping
  private String srcFilename;   // name of associated source file, if applicable
  private boolean isDefault = false; // stuff not within a class goes to default
  private boolean isMain = false;    // designated classes, like LFCApplication
  private Map streams = new HashMap(); // alternate streams, indexed by number
  private int maxInserts = 0;          // bound the number of stream insert replacements
  private boolean isClass = true;

  // When these appear in the contents they will be replaced
  // by the indicated stream whenever contents is retrieved.
  public static final String INSERT_STREAM_MARK = "#insertStream(";
  public static final String INSERT_END_MARK = ")";

  public class SourceFileLine {
    SourceFile sourcefile;
    int line;
    public String toString() {
      return sourcefile.toString() + ": " + line;
    }
  }

  public String getName() {
    return name;
  }

  public TranslationUnit() {
    this(false);
  }

  public TranslationUnit(boolean isDefaultTranslationUnit) {
    this.isDefault = isDefaultTranslationUnit;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getSourceFileName() {
    return srcFilename;
  }

  public void setSourceFileName(String srcname) {
    this.srcFilename = srcname;
  }

  public void setLineOffset(int lineOffset) {
    this.lineOffset = lineOffset;
  }

  /** Get text with any insertions resolved */
  public String getContents() {
    String result = text.toString();
    for (int i=1; i<=maxInserts; i++) {
      String mark = INSERT_STREAM_MARK + i + INSERT_END_MARK;
      int markPos = result.indexOf(mark);
      if (markPos >= 0) {
        String before = result.substring(0, markPos);
        String after = result.substring(markPos + mark.length());
        Object insert = getStreamObject(i);
        String text = "";
        if (insert != null) {
          if (insert instanceof String) {
            text = (String)insert;
          }
          else if (insert instanceof TranslationUnit) {
            text = ((TranslationUnit)insert).getContents();
            insertLnums(countLines(before), countLines(text), ((TranslationUnit)insert).lnums);
          }
          else {
            throw new RuntimeException("TranslationUnit.stream unsupported type" + insert.getClass().getName());
          }
        }
        result = before + text + after;
      }
    }
    return result;
  }

  /** Merge the lnums from another translation unit
   */
  public void insertLnums(int startline, int nlines, SortedMap inserted) {

    // from startline to the end, we must first shift all entries nlines.
    // so we don't overwrite, we must go from the end to the beginning.
    List keys = new ArrayList(lnums.keySet());
    for (ListIterator liter=keys.listIterator(); liter.hasPrevious(); ) {
      Integer key = (Integer)liter.previous();
      int keyval = key.intValue();
      if (keyval < startline) {
        break;
      }
      lnums.put(new Integer(keyval + nlines), lnums.remove(key));
    }

    // now insert the new entries, checking for out of bounds
    for (Iterator iter = inserted.keySet().iterator(); iter.hasNext(); ) {
      Integer key = (Integer)iter.next();
      int keyval = key.intValue();
      if (keyval < 0 || keyval > nlines) {
        throw new IndexOutOfBoundsException("linenumber table entry out of range: " + keyval + " is not in (0, " + nlines + ")");
      }
      lnums.put(new Integer(keyval + startline), inserted.get(key));
    }
  }

  public boolean isDefaultTranslationUnit() {
    return isDefault;
  }

  public boolean isMainTranslationUnit() {
    return isMain;
  }

  public void setMainTranslationUnit(boolean value) {
    isMain = value;
  }

  public boolean isClass() {
    return isClass;
  }

  public void setIsClass(boolean isClass) {
    this.isClass = isClass;
  }

  public void addText(String s) {
    text.append(s);
    linenum += countLines(s);
  }

  public int getTextLineNumber() {
    return linenum;
  }

  public void addInsertStreamMarker(int streamNum) {
    text.append(INSERT_STREAM_MARK + streamNum + INSERT_END_MARK);
    if (streamNum > maxInserts)
      maxInserts = streamNum;
  }

  public void addStreamText(int streamNum, String s) {
    Integer key = new Integer(streamNum);
    String cur = (String)streams.get(key);
    if (cur == null)
      cur = "";
    cur += s;
    streams.put(key, cur);
  }

  public void setStreamObject(int streamNum, Object o) {
    Integer key = new Integer(streamNum);
    Object cur = streams.get(key);
    if (cur != null) {
      throw new RuntimeException("TranslationUnit.setStreamObject value should not already exist");
    }
    streams.put(key, o);
  }

  public Object getStreamObject(int streamNum) {
    Integer key = new Integer(streamNum);
    return streams.get(key);
  }

  public void setInputLineNumber(int inputLinenum, SourceFile srcf) {
    Integer key = new Integer(linenum);
    SourceFileLine cur = (SourceFileLine)lnums.get(key);
    if (cur == null) {
      cur = new SourceFileLine();
      cur.sourcefile = srcf;
      cur.line = inputLinenum;
      lnums.put(key, cur);
    }
    // if the source file changed, we'll just use the first one.
    // otherwise, we want the smallest input line in the mapping.
    else if (cur.sourcefile.equals(srcf) && inputLinenum < cur.line && inputLinenum > 0) {
      cur.line = inputLinenum;
      lnums.put(key, cur);
    }
  }

  public static int countOccurence(String s, char c) {
    int count = 0;
    int pos = s.indexOf(c);
    while (pos >= 0) {
      count++;
      pos = s.indexOf(c, pos+1);
    }
    return count;
  }

  public static int countLines(String s) {
    return countOccurence(s, '\n');
  }

  public String toString() {
    String shortText = text.toString();
    if (shortText.length() > 10) {
      shortText = shortText.substring(0, 10) + "...";
    }
    return "TranslationUnit[" + name + ", line " +
      linenum + "] = \"" + shortText + "\"";
  }

  public void dump() {
    System.out.println("TranslationUnit[" + name + ", line " + linenum + "]");
    System.out.println("  text=" + text);
    System.out.println("  preamble line offset=" + lineOffset);
    System.out.println("  linemap=");
    for (Iterator iter=lnums.keySet().iterator(); iter.hasNext(); ) {
      Object key = iter.next();
      Object val = lnums.get(key);
      System.out.println("    " + key + " => " + val);
    }
  }

  public SourceFileLine originalLineNumber(int num) {
    num -= lineOffset;
    SortedMap nextLineNumber = lnums.tailMap(new Integer(num));
    if (nextLineNumber.size() == 0)
      return null;
    Object key = nextLineNumber.firstKey();
    if (key == null)
      return null;
    return (SourceFileLine)lnums.get(key);
  }
}

/**
 * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights
 * Reserved.  Use is subject to license terms.
 */
