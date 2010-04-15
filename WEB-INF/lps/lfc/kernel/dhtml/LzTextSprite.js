/**
  * LzTextSprite.js
  *
  * @copyright Copyright 2007-2010 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic DHTML
  * @author Max Carlson &lt;max@openlaszlo.org&gt;
  */
{
#pragma "warnUndefinedReferences=true"

var LzTextSprite = function(owner) {
    if (owner == null) return;
    this.constructor = arguments.callee;
    this.owner = owner;
    this.uid = LzSprite.prototype.uid++;
    this.__csscache = {};

    this.__LZdiv = document.createElement('div');
    this.__LZdiv.className = 'lztextcontainer';
    this.scrolldiv = this.__LZtextdiv = document.createElement('div');
    this.scrolldivtagname = 'div';
    this.scrolldiv.owner = this;
    if (this.quirks.emulate_flash_font_metrics) {
        this.className = this.scrolldiv.className = 'lzswftext';
    } else {
        this.className = this.scrolldiv.className = 'lztext';
    }
    this.__LZdiv.appendChild(this.scrolldiv);
    this.__LZdiv.owner = this;
    if (this.quirks.fix_clickable) {
        this.__LZclickcontainerdiv = document.createElement('div');
        this.__LZclickcontainerdiv.className = 'lztextcontainer';
        this.__LZclickcontainerdiv.owner = this;
    }    
    if (this.quirks.ie_leak_prevention) {
        this.__sprites[this.uid] = this;
    }
    //Debug.debug('new LzTextSprite', this.__LZdiv, this.owner);
}

LzTextSprite.prototype = new LzSprite(null);

if ($debug) {
/** @access private */
LzTextSprite.prototype._dbg_typename = 'LzTextSprite';
}

LzTextSprite.prototype.__initTextProperties = function (args) {
    this.setFontName(args.font);
    this.setFontStyle(args.fontstyle);
    this.setFontSize(args.fontsize);
    this.setTextColor(args.fgcolor);
}

// Should reflect CSS defaults in LzSprite.js
LzTextSprite.prototype._fontStyle = 'normal';
LzTextSprite.prototype._fontWeight = 'normal';
LzTextSprite.prototype._fontSize = '11px';
LzTextSprite.prototype._fontFamily = 'Verdana,Vera,sans-serif';
LzTextSprite.prototype._whiteSpace = 'normal';
LzTextSprite.prototype._textAlign = 'left';
LzTextSprite.prototype._textIndent = 0;
LzTextSprite.prototype.__LZtextIndent = 0;
LzTextSprite.prototype._letterSpacing = 0;
LzTextSprite.prototype._textDecoration = 'none';
LzTextSprite.prototype.__wpadding = 4;
LzTextSprite.prototype.__hpadding = 4;
LzTextSprite.prototype.__sizecacheupperbound = 1000;
LzTextSprite.prototype.selectable = true;
LzTextSprite.prototype.text = '';
LzTextSprite.prototype.resize = true;
LzTextSprite.prototype.restrict = null;
// holds a reference to the text item being scrolled
LzTextSprite.prototype.scrolldiv = null;
// Store tag name to avoid lookup in DOM when measuring text
LzTextSprite.prototype.scrolldivtagname = null;

LzTextSprite.prototype.setFontSize = function (fsize) {
    if (fsize == null || fsize < 0) return;
    // In standard-compliance mode, all dimensions must have units
    var fp = this.CSSDimension(fsize);
    if (this._fontSize != fp) {
        this._fontSize = fp;
        this.scrolldiv.style.fontSize = fp;
        // You have to set line-height if you set font-size.
        // Otherwise the browser will treat the inherited line-height
        // as a _minimum_
        if (this.quirks['emulate_flash_font_metrics']) {
          var lh = Math.round(fsize * 1.2);
          this.scrolldiv.style.lineHeight = this.CSSDimension(lh);
          this._lineHeight = lh;
        }
        this.__updatefieldsize();
    }
}

LzTextSprite.prototype.setFontStyle = function (fstyle) {
    var fweight;

    if (fstyle == "plain") {
        fweight = "normal";
        fstyle = "normal";
    } else if (fstyle == "bold") {
        fweight = "bold";
        fstyle = "normal";
    } else if (fstyle == "italic") {
        fweight = "normal";
        fstyle = "italic";        
    } else if (fstyle == "bold italic" || fstyle == "bolditalic") {
        fweight = "bold";
        fstyle = "italic";        
    }
    var changed = false;

    if (fweight != this._fontWeight) {
        this._fontWeight = fweight;
        this.scrolldiv.style.fontWeight = fweight;
        changed = true;
    }

    if (fstyle != this._fontStyle) {
        this._fontStyle = fstyle;
        this.scrolldiv.style.fontStyle = fstyle;
        changed = true;
    }
    if (changed) {
        this.__updatefieldsize();
    }
}

LzTextSprite.prototype.setFontName = function (fname) {
    if (fname != this._fontFamily) {
        this._fontFamily = fname;
        this.scrolldiv.style.fontFamily = fname;
        this.__updatefieldsize();
    }
}

LzTextSprite.prototype.setTextColor = function ( c ){
    if (this.textcolor === c) return;
    this.textcolor = c;
    this.__LZdiv.style.color = LzColorUtils.inttohex(c);
}

LzTextSprite.prototype.lineHeight = null;
LzTextSprite.prototype.scrollTop = null;
LzTextSprite.prototype.scrollHeight = null;
LzTextSprite.prototype.scrollLeft = null;
LzTextSprite.prototype.scrollWidth = null;

// This reflects whether the sprite will scroll or not.  For text
// sprites, this only happens if scrollevents are enabled, but for
// inputtext, this happens if the input text is multiline, so that the
// browser will keep the cursor in the visible portion of the sprite.
LzTextSprite.prototype.scrolling = false;
LzTextSprite.prototype.setScrolling = function (on) {
  var sdc = this.className;
  if (sdc == 'lzswftext' || sdc == 'lzswfinputtextmultiline') {
    // See setWidth/setHeight: adjust width/height to push the
    // scroll bars under the clip
    var ht = this.height;
    var wt = this.width;
    var cdim = this.CSSDimension;
    // NOTE [2009-09-21 ptw] (LPP-8246) Multiline input texts must
    // always have scrolling on
    if (on || sdc == 'lzswfinputtextmultiline') {
      this.scrolling = on;
      this.applyCSS('overflow', 'scroll', 'scrolldiv');
      ht += this.quirks.scrollbar_width;
      wt += this.quirks.scrollbar_width;
    } else {
      this.scrolling = false;
      this.applyCSS('overflow', '', 'scrolldiv');
    }
    var scrolldiv = this.scrolldiv;
    var hp = cdim(ht);
    var wp = cdim(wt);
    if (on) {
        scrolldiv.style.clip = ('rect(0 ' + wp + ' ' + hp + ' 0)');
    } else if (scrolldiv.style.clip) {
        scrolldiv.style.clip = this.quirks['fix_ie_css_syntax'] ? 'rect(auto auto auto auto)' : '';
    }
    this.applyCSS('width', wp, 'scrolldiv');
    this.applyCSS('height', hp, 'scrolldiv');
  }
  // Scrolling was requested, and granted!
  return on && this.scrolling;
}

// The sprite copy of this will only be on if the underlying div
// actually is scrollable
LzTextSprite.prototype.scrollevents = false;
LzTextSprite.prototype.setScrollEvents = function (on) {
  this.scrollevents = this.setScrolling(on);
  this.__updatefieldsize();
}

// tracks any timeouts we may have
LzTextSprite.prototype.__updatefieldsizeTID = null;

// This uses a timer callback to actually call the routines which measure 
// scolling text, so the browser has a chance to re-layout the div if something 
// changed.
LzTextSprite.prototype.__updatefieldsize = function (){
  // Load fonts as early as possible
  var loaded = LzFontManager.isFontLoaded(this, this._fontFamily, this._fontStyle, this._fontWeight);
  if (! loaded || ! this.initted) return;
  this.owner._updateSize();
  var cstr = lz.BrowserUtils.getcallbackfunc(this, '__updatefieldsizeCallback', []);
  if (this.__updatefieldsizeTID != null) {
    clearTimeout(this.__updatefieldsizeTID);
  }
  this.__updatefieldsizeTID = setTimeout(cstr, 0);
}

LzTextSprite.prototype.__fontLoaded = function() {
  // clear caches and update size
  this._cachevalue = this._cacheStyleKey = this._cacheTextKey = null;
  this.__updatefieldsize();
}

LzTextSprite.prototype.__updatefieldsizeCallback = function () {
  var lineHeight = this.getLineHeight();
  // Validate lineHeight
  if (this.lineHeight !== lineHeight) {
    this.lineHeight = lineHeight;
    // NOTE [2009-04-08 ptw] We always send lineHeight events, even if
    // scrollevents are not requested.  scrollevent should probably be
    // renamed to spriteevent or something
    this.owner.scrollevent('lineHeight', lineHeight);
  }
  // Measure the total height of the text, including any clipped
  // (scrollable) text
  // Debug.debug('scrollHeight %d, last char %w', scrolldiv.scrollHeight, scrolldiv['value'] && scrolldiv.value.charAt(scrolldiv.value.length - 1));
  if (! this.scrollevents) return;
  this.__updatefieldprop('scrollHeight');
  this.__updatefieldprop('scrollTop');
  this.__updatefieldprop('scrollWidth');
  this.__updatefieldprop('scrollLeft');
}

LzTextSprite.prototype.setMaxLength = function ( val ){
    // TODO: implement
    return;
}

LzTextSprite.prototype.__updatefieldprop = function(name) {
    var val = this.scrolldiv[name];
    // TODO [hqm 2009-11] See LPP-8591. For Firefox, there is some
    // weirdness, whereby the scrollHeight value will *appear* to be
    // unchanged, but when you run a test app, you see the LFC never
    // gets notified of a change in scrollHeight. The workaround is to
    // always update the LFC value, regardless of whether we think it
    // has changed.
    if (this[name] !== val || name == 'scrollHeight') {
        this[name] = val;
        this.owner.scrollevent(name, val);
    }
}

LzTextSprite.prototype.setText = function(t, force) {
    // For SWF compatibility, we preserve newlines in text.  We'd
    // like to use pre-line, but that appears not to work for any
    // browser.  As a compromise, if the content contains newlines, we
    // use 'pre'  The alternative would be `t.replace(RegExp('$',
    // 'mg'), '<br/>')`.
    // TODO: [2006-10-02 ptw] Use 'pre-line' when supported.
    // [max 1-23-2007] Actually, t.replace(...) gives the desired behavior...
    if (this.multiline && t && (t.indexOf("\n") >= 0)) {
        if (this.quirks['inner_html_strips_newlines']) {
            t = t.replace(this.inner_html_strips_newlines_re, '<br/>');
        }
    }
    if (t && this.quirks['inner_html_no_entity_apos']) {
      t = t.replace(RegExp('&apos;', 'mg'), '&#39;');
    }
    if (force != true && this.text == t) return;
    //Debug.write('LzTextSprite.setText', t);

    // NOTE: [2009-03-28 ptw] We have to capture the actual text we
    // are going to set so we can get accurate measurements in
    // getTextDimension
    this.text = t;
    this.scrolldiv.innerHTML = t;
    this.__updatefieldsize();
}

LzTextSprite.prototype.setMultiline = function(m) {
    m = !!m;
    if (this.multiline == m) return;
    this.multiline = m;
    if (m) {
        // TODO: [2006-10-02 ptw] Use 'pre-line' when supported and
        // remove the pre/normal hack in setText.
        if (this._whiteSpace != 'normal') {
            this._whiteSpace = 'normal';
            this.scrolldiv.style.whiteSpace = 'normal';
        }
        this.applyCSS('overflow', 'hidden', 'scrolldiv');
    } else {
        if (this._whiteSpace != 'nowrap') {
            this._whiteSpace = 'nowrap';
            this.scrolldiv.style.whiteSpace = 'nowrap';
        }
        this.applyCSS('overflow', '', 'scrolldiv');
    }
    if (this.quirks['text_height_includes_padding']) {
        this.__hpadding = m ? 3 : 4;
    }
    // To update height
    this.setText(this.text, true);
}

LzTextSprite.prototype.setPattern = function ( val ){
    if (val == null || val == "") {
        this.restrict = null;
    } else if (RegExp("^\\[.*\\]\\*$").test( val )) {
        // remove "*" from end, always allow CR/LF (for flash compatibility)
        this.restrict = RegExp(val.substring(0, val.length - 1) + "|[\\r\\n]", "g");
    } else if ($debug) {
        Debug.warn('LzTextSprite.setPattern argument %w must be of the form "[...]*"', val);
    }
}

/**
  * Calculates the current width of the text held by the text field.
  *
  * @devnot NOTE: [2009-02-27 ptw] Perhaps this API should be
  * obsoleted in favor of the scrolling API?
  */
LzTextSprite.prototype.getTextWidth = function (force) {
  if (! this.initted && ! force) return 0;
  //Debug.write('LzTextSprite.getTextWidth', this.text, this._textsizecache[this.text]);
  //if (this.text == '') return 0;
  var width;
  ////
  // NOTE: Quick cache check, inlined from getTextDimension
  ////
  var styleKey = this.className + "/" + this.scrolldiv.style.cssText;
  var cv = this._cachevalue;
  if ((this._cacheStyleKey == styleKey) &&
      (this._cacheTextKey == this.text) &&
      ('width' in cv)) {
    width = cv.width;
  } else {
    width = this.getTextDimension('width');
  }
  if (width != 0 && this.quirks['emulate_flash_font_metrics']) {
    width += this.__wpadding;
  }
  return width;
}

LzTextSprite.prototype.getLineHeight = function () {
  // If the font size has been set, we already know the line height 
  if (this._lineHeight) return this._lineHeight;
  if (! this.initted) return 0;
  // Line height does _not_ include padding
  ////
  // NOTE: Quick cache check, inlined from getTextDimension
  ////
  var styleKey = this.className + "/" + this.scrolldiv.style.cssText;
  var cv = this._cachevalue;
  if ((this._cacheStyleKey == styleKey) &&
      // lineheight does not depend on the contents
      ('lineheight' in cv)) {
    var lineheight = cv.lineheight;
  } else {
    var lineheight = this.getTextDimension('lineheight');
  }
  this._lineHeight = lineheight;
  return lineheight;
}

LzTextSprite.prototype.getTextfieldHeight = function (force) {
  if (! this.initted && ! force) return 0;
    var fieldHeight = null;
    if (this.multiline && this.text != '') {
      // NOTE: [2009-03-27 ptw] You might think you could use
      // scrollHeight, but that does not get updated if you change the
      // text and ask for it in the same breath (without pausing for
      // the div to be re-laid out).  Note, the actual text in the
      // scrolldiv may not be eq to this.text because of quirks, but
      // that is what we want to measure.
      ////
      // NOTE: Quick cache check, inlined from getTextDimension
      ////
      var styleKey = this.className + "/" + this.scrolldiv.style.cssText;
      var cv = this._cachevalue;
      if ((this._cacheStyleKey == styleKey) &&
          (this._cacheTextKey == this.text) &&
          ('height' in cv)) {
        fieldHeight = cv.height;
      } else {
        fieldHeight = this.getTextDimension('height');
      }
      if (this.quirks['safari_textarea_subtract_scrollbar_height']) { fieldHeight += 24 };
    } else {
      fieldHeight = this.getLineHeight();
    }
    if (this.quirks['emulate_flash_font_metrics']) {
      // NOTE [2009-01-29 ptw] You might think you could just read
      // this from scrolldiv.offsetTop, but it seems that is not ready
      // when we need to know this.
      fieldHeight += this.__hpadding;
      //Debug.debug('%w.fieldHeight = %d', this, fieldHeight);
    }
//     Debug.debug("%w.getTextfieldHeight: %d", this, fieldHeight);
    return fieldHeight;
}

LzTextSprite.prototype._sizecache = {counter: 0}
if (LzSprite.quirks.ie_leak_prevention) {
    LzTextSprite.prototype.__divstocleanup = [];
    LzTextSprite.prototype.__cleanupdivs = function() {
        var obj = LzTextSprite.prototype.__divstocleanup;
        var func = LzSprite.prototype.__discardElement;
        var l = obj.length;
        for (var i = 0; i < l; i++) {
            func( obj[i] ); 
        }
        LzTextSprite.prototype.__divstocleanup = []
    }
}

// key is the div class plus local style
LzTextSprite.prototype._cacheStyleKey = null;
// key is the text that was measured (only for height and width)
LzTextSprite.prototype._cacheTextKey = null;
// height, width, lineheight values corresponding to _cacheStyleKey and _cacheTextKey
LzTextSprite.prototype._cachevalue = null;
// We do all our measurement 'off screen'.  For some reason, this
// seems to work without having to wait for a redisplay.  We are
// careful to clone the actual node that is being used for scrolldiv,
// so we get accurate measurements...
LzTextSprite.prototype.getTextDimension = function (dimension) {
  // For 'lineheight' we measure a standard string, otherwise we are
  // measuring the content of the scrolldiv
  var string = this.text;
  // Ignore the width if we are measuring width, or lineheight
  var width = 'auto';
  switch (dimension) {
    case 'lineheight':
      // no need to measure if we've set the lineHeight directly...
      if (this._lineHeight) {
        return this._lineHeight;
      }
      string = 'Yq_gy"9;';
      break;
    case 'height':
      width = this.CSSDimension(this.width);
      break;
    case 'width':
      if (this.text == '') { return 0; }
      break;
    default:
      if ($debug) {
        Debug.error("Unknown dimension: %w", dimension);
      }
  }
  ////
  // NOTE: Quick check inlined at getTextWidth, getLineHeight,
  // getTextfieldHeight
  ////
  var scrolldiv = this.scrolldiv;
  var className = this.className;
  var styleKey = className + "/" + scrolldiv.style.cssText;
  var cv = this._cachevalue;
  if ((this._cacheStyleKey == styleKey) &&
      // lineheight does not depend on the contents
      ((dimension == 'lineheight') ||
       (this._cacheTextKey == string)) &&
      (dimension in cv)) {
    return cv[dimension];
  }
  // Update quick keys for the result we are about to compute
  this._cacheStyleKey = styleKey;
  // Text key is only for width and height
  if (dimension != 'lineheight') {
    this._cacheTextKey = string;
  }
  // Now create a cache key limited to the styles that can affect the
  // height/width
  // Turn off `overflow: scroll; width: 100%; height:100%` so that does not interfere with measurements
  var sds = scrolldiv.style;
  var style = ("overflow: visible; width: " + width + "; height: auto; " +
           ((sds.fontSize) ? ("font-size: " + sds.fontSize + "; ") : "") +
           ((sds.fontWeight) ? ("font-weight: " + sds.fontWeight + "; ") : "") +
           ((sds.fontStyle) ? ("font-style: " + sds.fontStyle + "; ") : "") +
           ((sds.fontFamily) ? ("font-family: " + sds.fontFamily + "; ") : "") +
           ((sds.lineHeight) ? ("line-height: " + sds.lineHeight + "; ") : "") +
           ((sds.letterSpacing) ? ("letter-spacing: " + sds.letterSpacing + "; ") : "") +
           ((sds.whiteSpace) ? ("white-space: " + sds.whiteSpace + "; ") : ""));
  this._cachevalue = LzFontManager.getSize(dimension, className, style, this.scrolldivtagname, string);
  return this._cachevalue[dimension];
}

LzTextSprite.prototype.setSelectable = function (s) {
    this.selectable = s;
    //Debug.write('setSelectable', s, this.__LZdiv.style);
    var browser = lz.embed.browser;

    this.__LZdiv.style.cursor = s ? 'auto' : '';
    if (browser.isIE) {
        var handler = s ? null : LzTextSprite.prototype.__cancelhandler;
        this.__LZdiv.onselectstart = handler;
    } else {
        var selectstyle = s ? 'text' : 'none'
        if (browser.isFirefox) {
            var stylename = 'MozUserSelect';
        } else if (browser.isSafari) {
            var stylename = 'WebkitUserSelect';
        } else {
            var stylename = 'UserSelect';
        }
        this.__LZdiv.style[stylename] = selectstyle;
    }
}

LzTextSprite.prototype.__cancelhandler = function () {
    return false;
}    

LzTextSprite.prototype.setResize = function (r){
    this.resize = r == true;
    this.applyCSS('overflow', this.resize ? '' : 'hidden', 'scrolldiv');
}

LzTextSprite.prototype.setSelection = function ( start , end=null){
    if (end == null) { end = start; }

    if (this.quirks['text_selection_use_range']) {
        var range = document.body.createTextRange();

        range.moveToElementText(this.scrolldiv);
        if (start > end){
            var st = start;
            start = end;
            end = st;
        }

        var st = start;
        var ed = end - range.text.length;

        range.moveStart("character", st);
        range.moveEnd("character", ed);
        range.select();
    } else {
        var range = document.createRange();

        var offset = 0;

        range.setStart(this.scrolldiv.childNodes[0], start);
        range.setEnd(this.scrolldiv.childNodes[0], end);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }     
}

/** @access private */
LzTextSprite.prototype.__findNodeByOffset = function(offset) {
    var node = this.scrolldiv.childNodes[0];
    var curroffset = 0;
    while (node) {
        if (node.nodeType == 3) {
            offset += node.textContent.length;
        } else if (node.nodeType == 1 && node.nodeName == 'BR') {
            offset += 1;
        }
        if (curroffset >= offset) {
            return node;
        }
        node = node.nextSibling;
    }
}

/** @access private */
LzTextSprite.prototype.__getGlobalRange = function (){
    var browser = lz.embed.browser;
// from http://www.quirksmode.org/dom/range_intro.html
    var userSelection;
    if (this.quirks['text_selection_use_range']) {
        userSelection = document.selection.createRange();
    } else if (window.getSelection) {
        userSelection = window.getSelection();
    }

    try {
        if (userSelection) {
            if (this.quirks['text_selection_use_range']) {
                return userSelection;
            } else if (userSelection.getRangeAt) {
                return userSelection.getRangeAt(0);
            } else { // Safari!
                var range = document.createRange();
                range.setStart(userSelection.anchorNode,userSelection.anchorOffset);
                range.setEnd(userSelection.focusNode,userSelection.focusOffset);
                return range;
            }
        }
    } catch (e) {
    }
}

/** @access private */
LzTextSprite.prototype.__textareaToRange = function (textarea) {
    var bookmark = textarea.getBookmark();
    var contents, originalContents;
    originalContents = contents = this.scrolldiv.innerHTML;

    var owner = this.__getRangeOwner(textarea);

    if (! (owner instanceof LzTextSprite)) {
        return;
    }

    do {
        var marker = "~~~" + Math.random() + "~~~";
    } while (contents.indexOf(marker) != -1)

    textarea.text = marker + textarea.text + marker;
    contents = this.scrolldiv.innerHTML;

    // remove BR tags...
    contents = contents.replace("<BR>", " ");
    var range = {};
    range.startOffset = contents.indexOf(marker);
    contents = contents.replace(marker, "");
    range.endOffset = contents.indexOf(marker);

    this.scrolldiv.innerHTML = originalContents;
    textarea.moveToBookmark(bookmark);
    textarea.select();

    return range;
}

/** @access private */
LzTextSprite.prototype.__getRangeOwner = function (range){
    if (! range) return;
    if (this.quirks['text_selection_use_range']) {
        var range = range.duplicate();
        range.collapse();
        return range.parentElement().owner;
    } else {
        if (range.startContainer.parentNode == range.endContainer.parentNode) return range.startContainer.parentNode.owner;
    }
}

/** @access private */
LzTextSprite.prototype.__getOffset = function (node){
    var offset = 0;
    // walk backwards counting text and br nodes
    while (node = node.previousSibling) {
        if (node.nodeType == 3) {
            offset += node.textContent.length;
        } else if (node.nodeType == 1 && node.nodeName == 'BR') {
            offset += 1;
        }
    }
    return offset;
}

LzTextSprite.prototype.getSelectionPosition = function ( ){
    var range = this.__getGlobalRange();
    if (this.__getRangeOwner(range) === this) {
        if (this.quirks['text_selection_use_range']) {
            range = this.__textareaToRange(range);
            return range.startOffset;
        } else {
            var offset = 0;
            if (this.multiline) {
                offset = this.__getOffset(range.startContainer);
            }
            return range.startOffset + offset;
        }
    } else {
        return -1;
    }
}

LzTextSprite.prototype.getSelectionSize = function ( ){
    var range = this.__getGlobalRange();
    if (this.__getRangeOwner(range) === this) {
        if (this.quirks['text_selection_use_range']) {
            range = this.__textareaToRange(range);
        } else {
            if (this.multiline) {
                var startoffset = this.__getOffset(range.startContainer);
                var endoffset = this.__getOffset(range.endContainer);
                return (range.endOffset + endoffset) - (range.startOffset + startoffset);
            }
        }
        return range.endOffset - range.startOffset;
    } else {
        return -1;
    }
}

LzTextSprite.prototype.getScroll = function ( ){
// TODO: not implemented
    if ($debug) {
        Debug.warn('LzTextSprite.getScroll is not implemented yet.');
    }
}

LzTextSprite.prototype.getMaxScroll = function ( ){
// TODO: not implemented
    if ($debug) {
        Debug.warn('LzTextSprite.getMaxScroll is not implemented yet.');
    }
}

LzTextSprite.prototype.setScroll = function ( ){
// TODO: not implemented
    if ($debug) {
        Debug.warn('LzTextSprite.setScroll is not implemented yet.');
    }
}

LzTextSprite.prototype.setYScroll = function (n){
  this.scrolldiv.scrollTop = this.scrollTop = (- n);
}

LzTextSprite.prototype.setXScroll = function (n){
  this.scrolldiv.scrollLeft = this.scrollLeft = (- n);
}


LzTextSprite.prototype.setX = function (x) {
  var scrolling = (this.scrolling);
  var turd = (scrolling && this.quirks['clipped_scrollbar_causes_display_turd']);
  if (scrolling) {
    var scrolldiv = this.scrolldiv;
    var oldLeft = scrolldiv.scrollLeft;
    var oldTop = scrolldiv.scrollTop;
    if (turd) {
      this.applyCSS('overflow', 'hidden', 'scrolldiv');
      scrolldiv.style.paddingRight = scrolldiv.style.paddingBottom = this.quirks.scrollbar_width;
    }
  }
  LzSprite.prototype.setX.call(this, x);
  if (scrolling) {
    if (turd) {
      this.applyCSS('overflow', 'scroll', 'scrolldiv');
      scrolldiv.style.paddingRight = scrolldiv.style.paddingBottom = '0';
    }
    scrolldiv.scrollLeft = oldLeft;
    scrolldiv.scrollTop = oldTop;
  }
}

LzTextSprite.prototype.setY = function (y) {
  var scrolling = (this.scrolling);
  var turd = (scrolling && this.quirks['clipped_scrollbar_causes_display_turd']);
  if (scrolling) {
    var scrolldiv = this.scrolldiv;
    var oldLeft = scrolldiv.scrollLeft;
    var oldTop = scrolldiv.scrollTop;
    if (turd) {
      this.applyCSS('overflow', 'hidden', 'scrolldiv');
      scrolldiv.style.paddingRight = scrolldiv.style.paddingBottom = this.quirks.scrollbar_width;
    }
  }
  LzSprite.prototype.setY.call(this, y);
  if (scrolling) {
    if (turd) {
      this.applyCSS('overflow', 'scroll', 'scrolldiv');
      scrolldiv.style.paddingRight = scrolldiv.style.paddingBottom = '0';
    }
    scrolldiv.scrollLeft = oldLeft;
    scrolldiv.scrollTop = oldTop;
  }
}

LzTextSprite.prototype.setWidth = function (w){
    if (w == null || w < 0 || isNaN(w)) return;
    // Call the super method (to set width of container)
    var nw = LzSprite.prototype.setWidth.call(this, w);

    // Calculate the width of the scrolldiv
    var scrolldivwidth = (w >= this.__wpadding ? w - this.__wpadding : 0);
    // Calculate a clip mask to hide the scrollbar
    var scrolldiv = this.scrolldiv;
    var cdim = this.CSSDimension;
    // The scrollbar invades the width, so push the scrollbar out of
    // the way
    if (this.scrolling) {
      scrolldivwidth += this.quirks.scrollbar_width;
    }
    // store clip value separately in case of __LZtextIndent 
    var clipwidth = scrolldivwidth;

    // need to substract (negative) text-indent from width (but not from clip!),
    // because we've added a left-padding in setTextAlign()
    var wtInd = (this.__LZtextIndent < 0 ? -1*this.__LZtextIndent : 0);
    if (scrolldivwidth >= wtInd) { 
        scrolldivwidth -= wtInd; 
    }
    var scrolldivcss = cdim(scrolldivwidth);
    if (this.__csscache.scrolldivwidth != scrolldivcss) {
      // Debug.debug('%w.style.width = %s', this.scrolldiv, this.CSSDimension(wt));
      this.applyCSS('width', scrolldivcss, 'scrolldiv');
      // Hide the scrollbar
      if (this.scrolling) {
        // initial value for 'height' is null
        var h = this.height;
        var hp = cdim(h != null ? h : 0);
        var wp = cdim(clipwidth);
        scrolldiv.style.clip = 'rect(0 ' + wp + ' ' + hp + ' 0)';
      }
    }
    return nw;
}

LzTextSprite.prototype.setHeight = function (h) {
    if (h == null || h < 0 || isNaN(h)) return;
    // Call the super method
    var nh = LzSprite.prototype.setHeight.call(this, h);
    // no change
    if (nh == null) return;
    // Calculate the height of the scrolldiv
    var ht = h; // (h >= this.__hpadding ? h - this.__hpadding : 0);
    // Calculate a clip mask to hide the scrollbar
    var scrolldiv = this.scrolldiv;
    var cdim = this.CSSDimension;
    // The scrollbar invades the height, so push the scrollbars out of
    // the way.
    // 
    // Input text is CSS class 'lzswfinputtextmultiline', and always
    // has scrollbars enabled, so check for that CSS class.
    if (this.scrolling || this.classname == 'lzswfinputtextmultiline') {
      ht += this.quirks.scrollbar_width;
    }
    var hp = cdim(ht);
    if (this.__csscache.scrolldivheight != hp) {
      // Debug.debug('%w.style.height = %s', this.scrolldiv, cdim(ht));
      this.applyCSS('height', cdim(ht), 'scrolldiv');
      // Hide the scrollbar
      if (this.scrolling) {
        // initial value for 'width' is null
        var w = this.width;
        var wp = cdim(w != null ? w : 0);
        scrolldiv.style.clip = 'rect(0 ' + wp + ' ' + hp + ' 0)';
      }
    }

    return nh;
}


////////////////////////////////////////////////////////////////
// Hyperlink support
////////////////////////////////////////////////////////////////

LzTextSprite.prototype.enableClickableLinks = function ( enabled) {
}

LzTextSprite.prototype.makeTextLink = function (str, value) {
    LzTextSprite.addLinkID(this);
    var uid = this.uid;
    return "<span class=\"lztextlink\" onclick=\"javascript:$modules.lz.__callTextLink('" + uid+"', '" + value +"')\">" + str +"</span>";
}

// value is encoded as VIEWID:value
$modules.lz.__callTextLink = function (spriteID, val) {
    var sprite = LzTextSprite.linkIDMap[spriteID];
    if (sprite != null) {
        sprite.owner.ontextlink.sendEvent(val);
    }
}

// map from UIDs to views with clickable links.
// allows us to send ontextlink events to the owner view when user clicks on a
// hyperlink in text, via an "actionscript:" routine
LzTextSprite.linkIDMap = [];

LzTextSprite.addLinkID = function (sprite) {
    LzTextSprite.linkIDMap[sprite.uid] = sprite;
}


LzTextSprite.deleteLinkID = function (UID) {
    delete LzTextSprite.linkIDMap[UID];
}

LzTextSprite.prototype.destroy = function(){
    LzTextSprite.deleteLinkID(this.owner.getUID());
    LzSprite.prototype.destroy.call(this);
}

LzTextSprite.prototype.setTextAlign = function (align) {
    if (this._textAlign != align) {
        this._textAlign = align;
        this.scrolldiv.style.textAlign = align;
    }
}

LzTextSprite.prototype.setTextIndent = function (indent) {
    // In standard-compliance mode, all dimensions must have units
    var indentPx = this.CSSDimension(indent);
    if (this._textIndent != indentPx) {
        var negInd = (indent < 0) || (this.__LZtextIndent < 0);
        this._textIndent = indentPx;
        this.__LZtextIndent = indent;
        this.scrolldiv.style.textIndent = indentPx;
        if (negInd) {
            // only add padding for negative indent, but remove minus sign
            this.scrolldiv.style.paddingLeft = (indent >= 0) ? "" : indentPx.substr(1);
            // reset width of scrolldiv for negative indent
            var nw = this.setWidth(this.width);
            // TODO [max 2010-04-14] Do we need to call __updatefieldsize() now?
        }
    }
}

LzTextSprite.prototype.setLetterSpacing = function (spacing) {
    // In standard-compliance mode, all dimensions must have units
    spacing = this.CSSDimension(spacing);
    if (this._letterSpacing != spacing) {
        this._letterSpacing = spacing;
        this.scrolldiv.style.letterSpacing = spacing;
    }
}

LzTextSprite.prototype.setTextDecoration = function (decoration) {
    if (this._textDecoration != decoration) {
        this._textDecoration = decoration;
        this.scrolldiv.style.textDecoration = decoration;
    }
}

LzTextSprite.prototype.getDisplayObject = function ( ){
    return this.scrolldiv;
}

LzTextSprite.prototype.updateShadow = function(shadowcolor, shadowdistance, shadowangle, shadowblurradius) {
    var cssString = this.__getShadowCSS(shadowcolor, shadowdistance, shadowangle, shadowblurradius);

    if (this.quirks.use_filter_for_dropshadow) {
        this.scrolldiv.style.filter = this.setFilter('shadow', cssString);
    } else {
        this.scrolldiv.style.textShadow = cssString;
    }

    this.shadow = cssString;
    this.applyCSS('overflow', '', 'scrolldiv');
}

}
