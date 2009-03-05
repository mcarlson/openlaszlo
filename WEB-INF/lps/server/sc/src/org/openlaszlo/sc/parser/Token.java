/* ****************************************************************************
 * Token.java
 * Modified the generated Token class to add the source filename
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2009 Laszlo Systems, Inc.  All Rights Reserved.                   *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.sc.parser;

/**
 * Describes the input token stream.
 */

public class Token {

  /**
   * An integer that describes the kind of this token.  This numbering
   * system is determined by JavaCCParser, and a table of these numbers is
   * stored in the file ...Constants.java.
   */
  public int kind;

  /**
   * beginLine and beginColumn describe the position of the first character
   * of this token; endLine and endColumn describe the position of the
   * last character of this token.
   */
  public int beginLine, beginColumn, endLine, endColumn;

  /**
   * The source file name.
   */
  public String pathname;

  /**
   * The current source file name, reset whenever the source changes
   */
  private static String currentPathname;

  /**
   * The string image of the token.
   */
  public String image;

  /**
   * A reference to the next regular (non-special) token from the input
   * stream.  If this is the last token from the input stream, or if the
   * token manager has not read tokens beyond this one, this field is
   * set to null.  This is true only if this token is also a regular
   * token.  Otherwise, see below for a description of the contents of
   * this field.
   */
  public Token next;

  /**
   * This field is used to access special tokens that occur prior to this
   * token, but after the immediately preceding regular (non-special) token.
   * If there are no such special tokens, this field is set to null.
   * When there are more than one such special token, this field refers
   * to the last of these special tokens, which in turn refers to the next
   * previous special token through its specialToken field, and so on
   * until the first special token (whose specialToken field is null).
   * The next fields of special tokens refer to other special tokens that
   * immediately follow it (without an intervening regular token).  If there
   * is no such token, this field is null.
   */
  public Token specialToken;

  /**
   * Returns the image.
   */
  public final String toString()
  {
     return image;
  }

  /**
   * Returns a new Token object, by default. However, if you want, you
   * can create and return subclass objects based on the value of ofKind.
   * Simply add the cases to the switch for all those special cases.
   * For example, if you have a subclass of Token called IDToken that
   * you want to create if ofKind is ID, simlpy add something like :
   *
   *    case MyParserConstants.ID : return new IDToken();
   *
   * to the following switch statement. Then you can cast matchedToken
   * variable to the appropriate type and use it in your lexical actions.
   */
  public static final Token newToken(int ofKind)
  {
     Token result;
     switch(ofKind)
     {
       default : result = new Token();
     }
     result.pathname = currentPathname;
     return result;
  }

  /**
   * Set the current pathname.
   */
  public static void setCurrentPathname(String path) {
     currentPathname = path;
  }
}
