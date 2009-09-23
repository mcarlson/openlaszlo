/* -*- mode: JavaScript; c-basic-offset: 2; -*- */

/*
 * Bridge to forward console API calls to the GUI debugger window view
 *
 * @copyright Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.
 *            Use is subject to license terms.

 */

class LzDebuggerWindowConsoleBridge extends LzDebugConsole {

  var DebugWindow;

  function LzDebuggerWindowConsoleBridge (view) {
    super();
    this.DebugWindow = view;
  }

  /** @access private */
  var __reNewline = RegExp('&#xa;|&#xA;|&#10;|\\n', 'g');

  /**
   * @access private
   */
  override function addHTMLText (str) {
    this.DebugWindow.addHTMLText(str.replace(this.__reNewline, '<br />'));
  }

  /**
   * @access private
   */
  override function clear () {
    this.DebugWindow.clearWindow();
  };

  /**
   * @access private
   */
  override function ensureVisible () {
    this.DebugWindow.ensureVisible();
  };

  /**
   * @access private
   */
  override function echo (str, newLine:Boolean=true) {
    // This color should be a debugger constant -- maybe there should
    // be LzEcho extends LzSourceMessage
    this.addHTMLText('<span style="color: #00cc00">' + str + '</span>' + (newLine?'\n':''));
  }

  /**
   * @access private
   */
  override function makeObjectLink (rep:String, id, attrs=null):String {
    var color = (attrs && attrs['color']) ? attrs.color : '#0000ff';
    var decoration = (attrs && attrs['type']) ? 'none' : 'underline';
    if (id != null) {
      var obj = Debug.ObjectForID(id);
      var tip = Debug.formatToString("Inspect %0.32#w", obj).toString().toHTML();
      // This ends up being inserted into the debugger output div.
      // `$modules.lz` should be visible as a global there
      return '<span style="cursor: pointer; text-decoration: ' + decoration + '; color: ' + color + '" title="' + tip + '" onclick="javascript:$modules.lz.Debug.displayObj(' + id + ')">' + rep +"</span>";
    }
    return rep;
  };


  /**
   * @access private
   */
  override function doEval (expr:String) {
#pragma "warnUndefinedReferences=false"
    try {
      with (Debug.environment) {
        // Evaluate as expression first
        var value = window.eval('(' + expr + ')');
      }
      Debug.displayResult(value);
    }
    catch (e) {
      if (! (e is SyntaxError)) {
        Debug.error("%s", e);
        return;
      }

      // Not an expression, see if it is a statement
      try {
        with (Debug.environment) {
          var value = window.eval(expr);
        }
        Debug.displayResult(value);
      }
      catch (e) {
        Debug.error("%s", e);
      }
    }
  };
}
