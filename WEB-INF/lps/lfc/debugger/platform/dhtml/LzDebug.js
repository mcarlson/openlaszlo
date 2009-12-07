/* -*- mode: JavaScript; c-basic-offset: 2; -*- */

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

/**
 ** Platform-specific implementation of debug I/O
 **/

class LzDHTMLDebugConsole extends LzBootstrapDebugConsole {
  /** The HTML debug window
   * @access private
   */
  var DebugWindow = null;

  /** @access private */
  var __reNewline = RegExp('&#xa;|&#xA;|&#10;|\\n', 'g');

  function LzDHTMLDebugConsole (iframe) {
    super();
    this.DebugWindow = iframe;
  };

  /**
   * @access private
   */
  override function addHTMLText (str) {
    var dw = this.DebugWindow;
    var dwd = dw.document;
    var span = dwd.createElement('span');
    var dwdb = dwd.body;
    // IE does not display \n in white-space: pre, so we translate...
    span.innerHTML = '<span class="OUTPUT">' + str.replace(this.__reNewline, '<br />') + '</span>';
    //console.log('addHTMLText',dwdb, str, span);
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
    var copy = {backtraceStack: true, uncaughtBacktraceStack: true, logger: true, console: true};
    for (var k in copy) {
      this[k] = base[k];
    }
  };

  /**
   * If the app has a custom wrapper that does not include the
   * debugger frame, create it on the fly.
   *
   * @access private
   */
  function createDebugIframe() {
    var debugurl =  lz.embed.options.serverroot + 'lps/includes/laszlo-debugger.html';
    var form = '<form id="dhtml-debugger-input" onsubmit="$modules.lz.Debug.doEval(document.getElementById(\'LaszloDebuggerInput\').value); return false" action="#">'
    var iframe = '<iframe id="LaszloDebugger" name="LaszloDebugger" src="' + debugurl + '" width="100%" height="200"></iframe>';
    var inputdiv = '<div><input id="LaszloDebuggerInput" style="width:78%;" type="text"/><input type="button" onclick="$modules.lz.Debug.doEval(document.getElementById(\'LaszloDebuggerInput\').value); return false" value="eval"/><input type="button" onclick="$modules.lz.Debug.clear(); return false" value="clear"/><input type="button" onclick="$modules.lz.Debug.bugReport(); return false" value="bug report"/></div></form>';
    var debugdiv = document.createElement('div');
    debugdiv.innerHTML = form + iframe + inputdiv;
    debugdiv.onmouseover = function (e) { 
        if (!e) e = global.window.event;
        e.cancelBubble = true;
        LzKeyboardKernel.setKeyboardControl(false, true); 
        return false;
    }
    var y = canvas.height - 230;
    // firefox likes the style applied this way
    lz.embed.__setAttr(debugdiv, 'style', 'position:absolute;z-index:10000000;top:' + y + 'px;width:100%;');
    canvas.sprite.__LZdiv.appendChild(debugdiv);
    // IE insists the style be applied this way
    var style = debugdiv.style;
    style.position = 'absolute';
    style.top = y;
    style.zIndex = 10000000;
    style.width = '100%';
    return global.window.frames['LaszloDebugger'];
  };

  /**
   * @access private
   * Instantiates an instance of the user Debugger window
   * Called last thing by the compiler when the app is completely loaded.
   */
  function makeDebugWindow () {
    for (var n in __ES3Globals) {
      var p = __ES3Globals[n];
      try {
        if (! (p is Function)) {
          if (! p._dbg_name) {
            p._dbg_name = n;
          }
        } else if (! Debug.functionName(p)) {
          p[Debug.FUNCTION_NAME] = n;
        }
      }
      catch (e) {
        //        Debug.debug("Can't name %w", name);
      }
    }
    // Make the real console.  This is only called if the user code
    // did not actually instantiate a <debug /> tag
    if (global['lzconsoledebug'] == 'true') {
      // Create a DHTML iframe console
      this.attachDebugConsole(new LzDHTMLDebugConsole(this.createDebugIframe()));
    } else {
      // This will attach itself, once it is fully initialized.
      new lz.LzDebugWindow();
    }
//     // If we didn't succeed in attaching the debug console in
//     // construct, try now
//     if ((! (this.console is LzDHTMLDebugConsole)) &&
//         (navigator.platform != 'rhino')) {
//       this.attachDebugConsole(new LzDHTMLDebugConsole(this.createDebugIframe()));
//     }
  };

  /**
   ** Platform-specific extensions to presentation and inspection
   **/
  function hasFeature(feature:String, level:String) {
    return (document.implementation &&
            document.implementation.hasFeature &&
            document.implementation.hasFeature(feature, level));
  }

  /**
   * Adds handling of DOM nodes to describer for DHTML
   *
   * @access private
   */
  override function __StringDescription (thing:*, escape:Boolean, limit:Number, readable:Boolean, depth:Number):Object {
    try {
      // test for HTMLElement if avaliable, second expression helps to filter IE-HTMLElements
      // NOTE: IE does not provide a HTMLElement-class, but we know their HTMLElements return 'object' for typeof,
      // but as they're not proper JS-Objects (no 'constructor' property), we use this info as a hint.
      if ((!!global.window.HTMLElement ? thing instanceof HTMLElement : typeof(thing) == 'object' && !thing.constructor) &&
          (! isNaN(Number(thing['nodeType'])))) {
        // tip o' the pin to osteele.com for the notation format
        function nodeToString(node) {
          var tn = node.nodeName || '';
          var path = tn.toLowerCase();
          // If this is a sprite implementation node, use the sprite's
          // LZX path rather than the DOM path
          var sprite = node.owner;
          var spritedivpath;
          if ((sprite instanceof LzSprite) && (sprite.owner.sprite === sprite)) {
            for (var key in sprite) {
              if (sprite[key] === node) {
                spritedivpath = Debug.formatToString("%w/@sprite/@%s", sprite.owner, key);
              }
            }
          }
          if (node.nodeType == 1) { // Node.ELEMENT_NODE
            var id = node.id;
            var cn = node.className;
            // Sprite div id's are redundant here, they are really for
            // browser debuggers
            if (id && (! spritedivpath)) {
              path += '#' + encodeURIComponent(id);
            } else if (cn) {
              var more = cn.indexOf(' ');
              if (more == -1) { more = cn.length; }
              path += '.' + cn.substring(0, more);
            }
          }
          if (spritedivpath) {
            return spritedivpath + ((path.length > 0) ? ('/' + path) : '');
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
        // If this has local style, add that
        var style = thing.style.cssText;
        if (style != '') { style = '[@style="' + style + '"]'; }
        return {readable: false, description: nodeToString(thing) + style};
      } else if (this.hasFeature('mouseevents', '2.0') && (thing is global['MouseEvent'])) {
        var desc = thing.type;
        if (thing.shiftKey) {
          desc = 'shift-' + desc;
        }
        if (thing.ctrlKey) {
          desc = 'ctrl-' + desc;
        }
        if (thing.metaKey) {
          desc = 'meta-' + desc;
        }
        if (thing.altKey) {
          desc = 'alt-' + desc;
        }
        switch (thing.detail) {
          case 2: desc = 'double-' + desc; break;
          case 3: desc = 'triple-' + desc; break;
        }
        switch (thing.button) {
          case 1: desc += '-middle'; break;
          case 2: desc += '-right'; break;
        }
        return {readable: false, description: desc};
      }
    } catch (e) {}
    return super.__StringDescription(thing, escape, limit, readable, depth);
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
    super.objectOwnProperties(obj, names, indices, limit, nonEnumerable);

    var proto = false;
    try {
      proto = ((obj['constructor'] && (typeof obj.constructor['prototype'] == 'object')) ?
               obj.constructor.prototype : false);
    } catch (e) {};
    if (names && nonEnumerable && proto) {
      // Unenumerable properties of some ECMA objects
      // TODO: [2006-04-11 ptw] enumerate Global/Number/Math/Regexp
      // object properties
      var unenumerated = {callee: true, length: true, constructor: true, prototype: true};

      for (var key in unenumerated) {
        var isown = false;
        try {
          isown = obj.hasOwnProperty(key);
        } catch (e) {};
        if (! isown) {
          var pk;
          try {
            pk = proto[key];
          } catch (e) {};
          isown = (obj[key] !== pk);
        }
        if (isown) {
          for (var i = 0, l = names.length; i < l; i++) {
            if (names[i] == key) {
              isown = false;
              break;
            }
          }
        }
        if (isown) { names.push(key); }
      }
    }
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

if (lz.embed.browser.isIE) {
  Error.prototype.toString = function() { return (this.name +": "+this.message); }
}


