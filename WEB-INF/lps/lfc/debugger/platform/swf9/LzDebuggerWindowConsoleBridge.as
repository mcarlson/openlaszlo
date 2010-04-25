/* -*- mode: JavaScript; c-basic-offset: 2; -*- */

/*
 * Bridge to forward console API calls to the GUI debugger window view
 *
 * @copyright Copyright 2001-2010 Laszlo Systems, Inc.  All Rights Reserved.
 *            Use is subject to license terms.
 */

class LzDebuggerWindowConsoleBridge extends LzDebugConsole {

    var window;

    function LzDebuggerWindowConsoleBridge (view) {
      super();
      this.window = view;
    }

    /** @access private */
    override function canvasConsoleWindow () {
      return this.window;
    }

    /**
     * Doc'd on interface
     * Bootstrap version
     * @access private
     *
     * @devnote Should probably be called addMessage
     */
    override function addText (msg) {
      this.window.addText(msg);
    }

    /**
     * Doc'd on interface
     * Bootstrap version
     * @access private
     */
    override function clear () {
      this.window.clearWindow()
    };

    /**
     * @access private
     */
    override function ensureVisible () {
      this.window.ensureVisible();
    };

    /**
     * Doc'd on interface
     * Bootstrap version
     * @access private
     */
    override function echo (str, newLine:Boolean=true) {
      this.window.echo(str, newLine);
    }

    /**
     * Doc'd on interface
     * Bootstrap version
     * @access private
     */
    override function addHTMLText (msg) {
      this.window.addHTMLText(msg);
    };

    /**
     * Doc'd on interface
     * Bootstrap version
     * @access private
     */
    override function makeObjectLink (rep:String, id, attrs=null):String {
      return this.window.makeObjectLink(rep,id,attrs);
    }

    /** @access private */
    var evalcount = 0;

    /**
     * Doc'd on interface
     * Bootstrap version
     * @access private
     */
    override function doEval (expr:String) {
      if (this.isSimpleExpr(expr)) {
        var simple = true;
        try {
          var val = this.evalSimpleExpr(expr);
          // If we got no value, maybe the expression was not simple
          if (val === void 0) {
            simple = false;
          }
        } catch (e) {
          // If we get an error, surely the expression must not be simple
          simple = false;
        }
      }
      if (simple) {
        Debug.displayResult(val);
      } else {
        try {
          // remoteEval includes call to displayResult
          this.window.remoteEval(expr, this.evalcount++);
        } catch (e) {
          Debug.error("%s: evaluating %s", e, expr);
        }
      }
    }

}
