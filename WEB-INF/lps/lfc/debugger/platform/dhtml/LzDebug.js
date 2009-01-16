/* -*- mode: JavaScript; c-basic-offset: 2; -*- */

/**
 ** Platform-specific implementation of debug I/O
 **/

class LzDHTMLDebugConsole extends LzBootstrapDebugConsole {
  /** The HTML debug window
   * @access private
   */
  var DebugWindow = null;

  function LzDHTMLDebugConsole () {
    super();
    // But not in Rhino
    if (navigator.platform == 'rhino') {
      this.DebugWindow = true;
      return;
    }

    // The application and debugger are sibling iframes in the
    // dhtml embedding.
    try {
      this.DebugWindow = window.parent.frames['LaszloDebugger'];
    } catch (e) {
    }

  };

  function createDebugIframe() {
    if (! this.DebugWindow) {
      debugurl = lz.embed.options.resourceroot + 'lps/includes/laszlo-debugger.html'
      var iframe = document.createElement('iframe');
      lz.embed.__setAttr(iframe, 'id', 'LaszloDebugger')
      lz.embed.__setAttr(iframe, 'name', 'LaszloDebugger')
      lz.embed.__setAttr(iframe, 'src', debugurl)
      lz.embed.__setAttr(iframe, 'width', '100%')
      lz.embed.__setAttr(iframe, 'height', '200')
      var y = canvas.height - 200;
      lz.embed.__setAttr(iframe, 'style', 'position:absolute;z-index:10000000;top:' + y + 'px;')
      canvas.sprite.__LZdiv.appendChild(iframe);
      this.DebugWindow = window.frames['LaszloDebugger'];
    }
  }

  /**
   * @access private
   */
  override function addHTMLText (str) {
    if (! this.DebugWindow) this.createDebugIframe();
    var dw = this.DebugWindow;
    var dwd = dw.document;
    var span = dwd.createElement('span');
    var dwdb = dwd.body;
    // IE does not display \n in white-space: pre, so we translate...
    span.innerHTML = '<span class="OUTPUT">' + str.split('\n').join('<br />') + '</span>';
    console.log('addHTMLText',dwdb, str, span);
    dwdb.appendChild(span);
    // Scroll to end
    dw.scrollTo(0, dwdb.scrollHeight);
  };

  /**
   * Clear the console
   */
  override function clear () {
    var dw = this.DebugWindow;
    dw.document.body.innerHTML = '';
  };

  /**
   * @access private
   */
  override function addText (msg) {
    var str;
    try {
      if (msg && msg['toHTML'] is Function) {
        str = msg.toHTML();
      } else {
        str = String(msg).toHTML();
      }
    } catch (e) {
      str = '' + msg;
    };
    try {
      this.addHTMLText(str);
    } catch (e) {
      try {
        // Rhino?
        if (print.length > 0) {
          print(str);
          return;
        }
      } catch (e) {};
    }
  };

  /**
   * Echo to the console in the debugger font
   *
   * @param String str: what to echo
   * @param Boolean newLine: whether to echo a trailing newline,
   * default true
   *
   * @access private
   */
  override function echo (str:String, newLine:Boolean=true) {
    this.addHTMLText('<span class="DEBUG">' + str + '</span>' + (newLine?'\n':''));
  }

  /**
   * Evaluate an expression
   *
   * This is part of the console protocol because it may require using
   * the console link to compile the expression to be evaluated, which
   * is then loaded and executed.  The result is then displayed by
   * calling back to the debugger `displayResult` method
   *
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
  }


  /**
   * @access private
   */
  override function makeObjectLink (rep, id:Number, attrs=null) {
    var type = (attrs && attrs['type']) ? attrs.type : 'INSPECT';
    if (id != null) {
      var obj = Debug.ObjectForID(id);
      var tip = Debug.formatToString("Inspect %0.32#w", obj).toString().toHTML();
      // This ends up being inserted into the debugger output iframe.
      // We look up $modules in the parent it shares with the app.
      return '<span class="' + type + '" title="' + tip + '" onclick="javascript:window.parent.$modules.lz.Debug.displayObj(' + id + ')">' + rep +"</span>";
    }
    return rep;
  };
};

/**
 ** Platform-specific DebugService
 **/

class LzDHTMLDebugService extends LzDebugService {
  /**
   * Preserve any state created in the base service
   *
   * @access private
   */
  function LzDHTMLDebugService(base:LzDebugService) {
    super(base);
    var copy = {backtraceStack: true, uncaughtBacktraceStack: true, sourceWarningHistory: true, logger: true, console: true};
    for (var k in copy) {
      this[k] = base[k];
    }

    // Make the real console.  In DHTML we can do this in the
    // constructor, rather than in makeDebugWindow, because the
    // console is implemented as an HTML iframe that exists before the
    // app is loaded
    this.attachDebugConsole(new LzDHTMLDebugConsole());
  }

  /**
   * @access private
   * Instantiates an instance of the user Debugger window
   * Called last thing by the compiler when the app is completely loaded.
   */
  function makeDebugWindow () {
    for (var n in __ES3Globals) {
      var p = __ES3Globals[n];
      try {
        if (! Debug.functionName(p)) {
          p._dbg_name = n;
        }
      }
      catch (e) {
        //        Debug.debug("Can't name %w", name);
      }
    }
  };

  /**
   ** Platform-specific extensions to presentation and inspection
   **/

  /**
   * Adds handling of DOM nodes to describer for DHTML
   *
   * @access private
   */
  override function __StringDescription (thing:*, pretty:Boolean, limit:Number, unique:Boolean):Object {
    try {
      if ((!!window.HTMLElement ? thing instanceof HTMLElement : typeof(thing) == 'object' && !thing.constructor) &&
          (! isNaN(Number(thing['nodeType'])))) {
        // test for HTMLElement if avaliable, second expression helps to filter IE-HTMLElements
        // NOTE: IE does not provide a HTMLElement-class, but we know their HTMLElements return 'object' for typeof,
        // but as they're no proper JS-Objects (no 'constructor' property), we use this info as a hint.

        // tip o' the pin to osteele.com for the notation format
        function nodeToString(node) {
          var tn = node.nodeName || '';
          var path = tn.toLowerCase();
          if (node.nodeType == 1) { //Node.ELEMENT_NODE
            var id = node.id;
            var cn = node.className;
            if (id) {
              path += '#' + id;
            } else if (cn) {
              var more = cn.indexOf(' ');
              if (more == -1) { more = cn.length; }
              path += '.' + cn.substring(0, more);
            }
          }
          var parent = node.parentNode;
          if (parent) {
            var index, count = 0;
            for (var sibling = parent.firstChild; sibling; sibling = sibling.nextSibling) {
              if (tn == sibling.nodeName) {
                count++;
                if (index) break;
              }
              if (node === sibling) { index = count; }
            }
            if (count > 1) {
              path += '[' + index + ']';
            }
            try {
              return nodeToString(parent) + '/' + path;
            } catch (e) {
              return '\u2026/' + path;
            }
          }
          return path;
        };
        return {pretty: pretty, description: nodeToString(thing)};
      }
    } catch (e) {}
    return super.__StringDescription(thing, pretty, limit, unique);
  };

  /**
   * @access private
   *
   * @devnote TODO: [2008-09-23 ptw] (LPP-7034) Remove public
   * declaration after 7034 is resolved
   */
  public override function functionName (fn, mustBeUnique) {
    if (fn is Function) {
      // JS1 constructors are Function
      if (fn.hasOwnProperty('tagname')) {
        var n = fn.tagname;
        if ((! mustBeUnique) || (fn === lz[n])) {
          return '<' + n + '>';
        } else {
          return null;
        }
      }
      if (fn.hasOwnProperty('classname')) {
        var n = fn.classname;
        if ((! mustBeUnique) || (fn === eval(n))) {
          return n;
        } else {
          return null;
        }
      }
    }
    return super.functionName(fn, mustBeUnique);
  };


  /**
   * Adds unenumerable object properties for DHMTL runtime
   *
   * @access private
   */
  override function objectOwnProperties (obj:*, names:Array=null, indices:Array=null, limit:Number=Infinity, nonEnumerable:Boolean=false) {

    var hasProto = obj && obj['hasOwnProperty'];
    if (names && nonEnumerable && hasProto) {
      // Unenumerable properties of ECMA objects
      // TODO: [2006-04-11 ptw] enumerate Global/Number/Math/Regexp
      // object properties
      for (var p in {callee: true, length: true, constructor: true, prototype: true}) {
        try {
          if (obj.hasOwnProperty(p)) {
            names.push(p);
          }
        } catch (e) {};
      }
    }

    if (hasProto && indices) {
      // Function.arguments is not a proper Array in JS1
      try {
        if (obj.hasOwnProperty('callee')) {
          for (var i = 0, len = obj.length; i < len; ++i) {
            indices.push(i);
            if (--limit == 0) { return; }
          }
        }
      } catch (e) {};
    }

    super.objectOwnProperties(obj, names, indices, limit, nonEnumerable);
  }

  /**
   ** Platform-specific features
   **/

  /**
   * @access private
   */
  function enableInspectMouseHandlers (div,enable) {
    if (enable) {
      div.prev_onclick =  div.onclick;
      div.style.prev_border = div.style.border;
      div.style.prev_margin = div.style.margin;
      div.style.border = "1px solid red";
      div.style.margin = "-1px";
      div.onclick = function (e) { Debug.write('view = ', this.owner.owner); }
    } else {
      div.onclick =  div.prev_onclick;
      div.style.border = div.style.prev_border;
      div.style.margin = div.style.prev_margin;
      delete div.prev_onclick;
      delete div.prev_margin;
      delete div.prev_border;
    }
  };

  /**
   * Display outlines of all view sprite bounding boxes, clicking
   * on a view will print the view and parent chain to the debugger.
   * 
   * @param Boolean enable : enable or disable outlines
   * @access public
   */
  function showDivs (enable) {
    if (enable == null) enable = true;
    Debug._showDivs(canvas,enable);
  };

  /**
   * @access private
   */
  function _showDivs (view,enable) {
    var k = view.sprite;
    if (k != null) {
      var div = k.__LZdiv;
      if (div != null) {
        this.enableInspectMouseHandlers(div,enable);
      }
    }
    for (var i = 0; i < view.subviews.length; i++) {
      var cv = view.subviews[i];
      Debug._showDivs(cv,enable);
    }
  };
};

/**
 * The Debug singleton is created in compiler/LzBootstrapDebugService so
 * a primitive debugger is available during bootstrapping.  It is
 * replaced here with the more capable debugger
 *
 * @access private
 */
var Debug = new LzDHTMLDebugService(Debug);
/**
  * TODO: [2006-04-20 ptw] Remove when compiler no longer references
  * @access private
  */
var __LzDebug = Debug;


//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************
