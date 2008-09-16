/* -*- mode: JavaScript; c-basic-offset: 2; -*- */

/*
 * Bridge to forward console API calls to the GUI debugger window view
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.

 */

class LzDebuggerWindowConsoleBridge extends LzDebugConsole {

    var window;

    function LzDebuggerWindowConsoleBridge (view) {
      trace('LzDebuggerWindowConsoleBridge', view);
      this.window = view;
    }

    /**
     * Doc'd on interface
     * Bootstrap version
     * @access private
     *
     * @devnote Should probably be called addMessage
     */
    override function addText (msg) {
      trace(' addText', msg);
      this.window.addText(msg);
    }

    /**
     * Doc'd on interface
     * Bootstrap version
     * @access private
     */
    override function clear () {
      trace(' clear' );
      this.window.clearWindow()
    };

    /**
     * Doc'd on interface
     * Bootstrap version
     * @access private
     */
    override function echo (str, newLine:Boolean=true) {
      trace(' echo', str);
      this.window.echo(str, newLine);
    }

    /**
     * Doc'd on interface
     * Bootstrap version
     * @access private
     */
    override function addHTMLText (msg) {
      trace(' addHTMLText', msg);
      this.window.addHTMLText(msg);
    };

    /**
     * Doc'd on interface
     * Bootstrap version
     * @access private
     */
    override function makeObjectLink (rep:String, id, attrs=null):String {
      trace(' makeObjectLink', rep);
      this.window.makeObjectLink(rep,id,attrs);
    }

    /**
     * Doc'd on interface
     * Bootstrap version
     * @access private
     */
    override function doEval (expr:String) {
      trace(' doEval', expr);
      this.window.doEval(expr);
    }
}
