/**
  * LzTextSprite.js
  *
  * @copyright Copyright 2007-2009 Laszlo Systems, Inc.  All Rights Reserved.
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

    this.__LZdiv = document.createElement('div');
    this.__LZdiv.className = 'lztextcontainer';
    this.scrolldiv = this.__LZtextdiv = document.createElement('div');
    this.scrolldiv.owner = this;
    this.scrolldiv.className = 'lztext';
    this.__LZdiv.appendChild(this.scrolldiv);
    if (this.quirks.emulate_flash_font_metrics) {
        this.scrolldiv.className = 'lzswftext';
    }    
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
    this.initted = true;
}

// Should reflect CSS defaults in LzSprite.js
LzTextSprite.prototype._fontStyle = 'normal';
LzTextSprite.prototype._fontWeight = 'normal';
LzTextSprite.prototype._fontSize = '11px';
LzTextSprite.prototype._fontFamily = 'Verdana,Vera,sans-serif';
LzTextSprite.prototype._whiteSpace = 'normal';
LzTextSprite.prototype._textAlign = 'left';
LzTextSprite.prototype._textIndent = '0px';
LzTextSprite.prototype.__LZtextIndent = 0;
LzTextSprite.prototype._letterSpacing = '0px';
LzTextSprite.prototype._textDecoration = 'none';
LzTextSprite.prototype.__wpadding = 4;
LzTextSprite.prototype.__hpadding = 4;
LzTextSprite.prototype.__sizecacheupperbound = 1000;
LzTextSprite.prototype.selectable = true;
LzTextSprite.prototype.text = '';
LzTextSprite.prototype.resize = true;
LzTextSprite.prototype.restrict = null;

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

    if (fweight != this._fontWeight) {
        this._fontWeight = fweight;
        this.scrolldiv.style.fontWeight = fweight;
        this.__updatefieldsize();
    }

    if (fstyle != this._fontStyle) {
        this._fontStyle = fstyle;
        this.scrolldiv.style.fontStyle = fstyle;
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

LzTextSprite.prototype.setTextColor = LzSprite.prototype.setColor;

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
  var scrolldiv = this.scrolldiv;
  var sdc = scrolldiv.className;
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
      scrolldiv.style.overflow = 'scroll';
      ht += this.quirks.scrollbar_width;
      wt += this.quirks.scrollbar_width;
    } else {
      this.scrolling = false;
      scrolldiv.style.overflow = '';
    }
    var hp = cdim(ht);
    var wp = cdim(wt);
    if (on) {
        scrolldiv.style.clip = ('rect(0 ' + wp + ' ' + hp + ' 0)');
    } else if (scrolldiv.style.clip) {
        scrolldiv.style.clip = this.quirks['fix_ie_css_syntax'] ? 'rect(auto auto auto auto)' : '';
    }
    scrolldiv.style.height = hp;
    scrolldiv.style.width = wp;
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

LzTextSprite.prototype.initted = false;
LzTextSprite.prototype.__loadedfonts = {counter: 0};
LzTextSprite.prototype.__loadedfontscallback = {};
LzTextSprite.prototype.__isExternalFontLoaded = function (url){
  var font = LzFontManager.getFont(this._fontFamily, this._fontStyle, this._fontWeight);
  if (! font || ! this.initted) return true;
  var url = LzFontManager.getURL(font);
  var loadingstatus = this.__loadedfonts[url];
  if (loadingstatus == 2) {
    // done loading
    return true;
  } else if (loadingstatus == 1) {
    var lfc = this.__loadedfontscallback;
    lfc[this.uid] = this;
    // already loading the font
    return false;
  }
  // loading
  this.__loadedfonts[url] = 1;
  this.__loadedfonts.counter++;

  // set up loader to call back and re-measure when the font has loaded
  var style = 'font-family:' + this._fontFamily + ';font-style:' + this._fontStyle + ';font-weight:' + this._fontWeight + ';width:auto;height:auto;';
  var mdiv = this.__createMeasureDiv('lzswftext', style, 'Yq_gy"9;ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789-=abcdefghijklmnopqrstuvwxyz');
  mdiv.style.display = 'inline';
  var width = mdiv.clientWidth;
  var height = mdiv.clientHeight;
  mdiv.style.display = 'none';
  this.__measurefontdiv(mdiv, width, height, url);
}

LzTextSprite.prototype.__measurefontdiv = function(mdiv, width, height, url){
  mdiv.style.display = 'inline';
  var newwidth = mdiv.clientWidth;
  var newheight = mdiv.clientHeight;
  mdiv.style.display = 'none';
  if (newwidth == width && newheight == height) {
    // Give the browser layout engine a chance to recompute the layout, by
    // calling back from the browser's timer queue. (FFOX needs this, not sure about other browsers)
    var cstr = lz.BrowserUtils.getcallbackfunc(this, '__measurefontdiv', [mdiv, width, height, url]);
    setTimeout(cstr, 0);
  } else {
    //Debug.warn('comparing', width, newwidth, height, newheight, mdiv);
    this.__loadedfonts.counter--;
    this.__loadedfonts[url] = 2;

    if (this.__loadedfonts.counter == 0) {
      var loadedfontscallback = this.__loadedfontscallback;
      this.__clearMeasureCache();

      for (var i in loadedfontscallback) {
        var sprite = loadedfontscallback[i];
        sprite._cachevalue = sprite._cacheStyleKey = sprite._cacheTextKey = null;
        sprite.setWidth(sprite.getTextWidth());
        sprite.setHeight(sprite.getTextHeight());
        sprite.__updatefieldsize();
        //Debug.warn('callback', sprite.uid);
      }
      delete loadedfontscallback[i];
    }
  }
}

// This uses a timer callback to actually call the routines which measure text,
// so that the browser has a chance to re-layout the div if something changed.
LzTextSprite.prototype.__updatefieldsize = function ( ){
  if (! this.__isExternalFontLoaded()) return;
  var cstr = lz.BrowserUtils.getcallbackfunc(this, '__updatefieldsizeCallback', []);
  setTimeout(cstr, 0);
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
    if (this.resize && this.multiline == false) {
        this.setWidth(this.getTextWidth());
    }
}

LzTextSprite.prototype.setMultiline = function(m) {
    m = m == true;
    if (this.multiline == m) return;
    this.multiline = m;
    if (m) {
        // TODO: [2006-10-02 ptw] Use 'pre-line' when supported and
        // remove the pre/normal hack in setText.
        if (this._whiteSpace != 'normal') {
            this._whiteSpace = 'normal';
            this.scrolldiv.style.whiteSpace = 'normal';
        }
        this.scrolldiv.style.overflow = 'hidden';
    } else {
        if (this._whiteSpace != 'nowrap') {
            this._whiteSpace = 'nowrap';
            this.scrolldiv.style.whiteSpace = 'nowrap';
        }
        this.scrolldiv.style.overflow = '';
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
LzTextSprite.prototype.getTextWidth = function () {
  //Debug.write('LzTextSprite.getTextWidth', this.text, this._textsizecache[this.text]);
  //if (this.text == '') return 0;
  var width;
  ////
  // NOTE: Quick cache check, inlined from getTextDimension
  ////
  var scrolldiv = this.scrolldiv;
  var className = scrolldiv.className;
  var style = scrolldiv.style.cssText;
  var styleKey = className + "/" + style;
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
  // Line height does _not_ include padding
  ////
  // NOTE: Quick cache check, inlined from getTextDimension
  ////
  var scrolldiv = this.scrolldiv;
  var className = scrolldiv.className;
  var style = scrolldiv.style.cssText;
  var styleKey = className + "/" + style;
  var cv = this._cachevalue;
  if ((this._cacheStyleKey == styleKey) &&
      // lineheight does not depend on the contents
      ('lineheight' in cv)) {
    var lineheight = cv.lineheight;
  } else {
    var lineheight = this.getTextDimension('lineheight');
  }
  return lineheight;
}

// TODO [2009-02-27 ptw] (LPP-7832) Deprecate getTextHeight
LzTextSprite.prototype.getTextHeight = LzTextSprite.prototype.getLineHeight;


LzTextSprite.prototype.getTextfieldHeight = function () {
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
      var scrolldiv = this.scrolldiv;
      var className = scrolldiv.className;
      var style = scrolldiv.style.cssText;
      var styleKey = className + "/" + style;
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
  var className = scrolldiv.className;
  var style = scrolldiv.style.cssText;
  var styleKey = className + "/" + style;
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
  style = ("overflow: visible; width: " + width + "; height: auto; " +
           ((sds.fontSize) ? ("font-size: " + sds.fontSize + "; ") : "") +
           ((sds.fontWeight) ? ("font-weight: " + sds.fontWeight + "; ") : "") +
           ((sds.fontStyle) ? ("font-style: " + sds.fontStyle + "; ") : "") +
           ((sds.fontFamily) ? ("font-family: " + sds.fontFamily + "; ") : "") +
           ((sds.lineHeight) ? ("line-height: " + sds.lineHeight + "; ") : "") +
           ((sds.letterSpacing) ? ("letter-spacing: " + sds.letterSpacing + "; ") : "") +
           ((sds.whiteSpace) ? ("white-space: " + sds.whiteSpace + "; ") : ""));
  // Full key always includes style and text, even the sample text
  // used to measure line height
  var cacheFullKey = className + "/" + style + "{" + string + "}";
  var ltsp = LzTextSprite.prototype;
  var _sizecache = ltsp._sizecache;
  var cv = this._cachevalue = _sizecache[cacheFullKey];
  if (cv && (dimension in cv)) {
    return cv[dimension];
  }
  // Otherwise, compute from scratch
  var root = document.getElementById('lzTextSizeCache');
  if ((_sizecache.counter > 0) && ((_sizecache.counter % this.__sizecacheupperbound) == 0)) {
    this.__clearMeasureCache();
    cv = null;
  }
  if (! cv) {
    cv = this._cachevalue = _sizecache[cacheFullKey] = {};
  }
  // TODO: [2009-03-29 ptw] Should we use the scrolldiv.tagName so we
  // get the actual node type for measurment?  But if we do, we have
  // to conditionalize setting the text into the node (because there
  // seems to be no generic method for setting the content of nodes?)
  var mdivKey = className + "/" + style + 'div';
  var mdiv = _sizecache[mdivKey];
  if (mdiv) {
    // reuse existing div
    this.__setTextContent(mdiv, scrolldiv.tagName, string);
    //console.log('reused', mdivKey, string);
  } else {
    var mdiv = this.__createMeasureDiv(className, style, string);
    // store measurement div to reuse later...
    _sizecache[mdivKey] = mdiv;
  }
  mdiv.style.display = 'inline';
  // NOTE: clientHeight for both height and lineheight
  cv[dimension] = (dimension == 'width') ? mdiv.clientWidth : mdiv.clientHeight;
  mdiv.style.display = 'none';
//   Debug.debug("%w %w %d", this, cacheFullKey, lineHeight);
  return cv[dimension];
}

LzTextSprite.prototype.__clearMeasureCache = function() {
  var root = document.getElementById('lzTextSizeCache');
  LzTextSprite.prototype._sizecache = {counter: 0}
  if (LzSprite.quirks.ie_leak_prevention) {
    LzTextSprite.prototype.__cleanupdivs();
  }
  if (root) { root.innerHTML = ''; }
}

LzTextSprite.prototype.__createMeasureDiv = function(className, style, string) {
  var root = document.getElementById('lzTextSizeCache');
  var tagname = 'div';
  var ltsp = LzTextSprite.prototype;
  var _sizecache = ltsp._sizecache;
  if (this.quirks['text_measurement_use_insertadjacenthtml']) {
    var html = '<' + tagname + ' id="testSpan' + _sizecache.counter + '"';
    html += ' class="' + className + '"';
    html += ' style="' + style + '">';
    html += string;
    html += '</' + tagname + '>';
    root.insertAdjacentHTML('beforeEnd', html);
    var mdiv = document.all['testSpan' + _sizecache.counter];
    if (this.quirks.ie_leak_prevention) {
      ltsp.__divstocleanup.push(mdiv);
    }
  } else {
    var mdiv = document.createElement(tagname)
    // NOTE: [2009-03-25 ptw] setAttribute needs the real attribute
    // name, i.e., `class` not `classname`!
    lz.embed.__setAttr(mdiv, 'class', className);
    lz.embed.__setAttr(mdiv, 'style', style);
    this.__setTextContent(mdiv, this.scrolldiv.tagName, string);
    root.appendChild(mdiv);
  } 
  _sizecache.counter++;
  return mdiv;
}

LzTextSprite.prototype.__setTextContent = function(mdiv, tagname, string) {
  // NOTE: [2009-03-29 ptw] For now, DHTML does not support HTML in
  // input text, so we must measure accordingly
  switch (tagname) {
    case 'DIV':
      mdiv.innerHTML = string;
      break;
    case 'INPUT': case 'TEXTAREA':
      // IE only supports innerText, FF only supports textContent.
      if (this.quirks['text_content_use_inner_text']) {
        mdiv.innerText = string;
      } else {
        mdiv.textContent = string;
      }
      break;
    default:
      if ($debug) {
        Debug.error("Unknown tagname: %w", tagname);
      }
  }
}

LzTextSprite.prototype.setSelectable = function (s) {
    this.selectable = s;
    //Debug.write('setSelectable', s, this.__LZdiv.style);
    var browser = lz.embed.browser;

    if (s) {
        this.__LZdiv.style['cursor'] = 'auto';
        if (browser.isIE) {
            this.__LZdiv.onselectstart = null;
        } else if (browser.isFirefox) {
            this.__LZdiv.style['MozUserSelect'] = 'text';
        } else if (browser.isSafari) {
            this.__LZdiv.style['WebkitUserSelect'] = 'text';
        } else {
            this.__LZdiv.style['UserSelect'] = 'text';
        }
    } else {
        this.__LZdiv.style['cursor'] = '';
        if (browser.isIE) {
            this.__LZdiv.onselectstart = LzTextSprite.prototype.__cancelhandler;
        } else if (browser.isFirefox) {
            this.__LZdiv.style['MozUserSelect'] = 'none';
        } else if (browser.isSafari) {
            this.__LZdiv.style['WebkitUserSelect'] = 'none';
        } else {
            this.__LZdiv.style['UserSelect'] = 'none';
        }
    }
}

LzTextSprite.prototype.__cancelhandler = function () {
    return false;
}    

LzTextSprite.prototype.setResize = function (r){
    this.resize = r == true;
    this.scrolldiv.style.overflow = this.resize ? '' : 'hidden';
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
      scrolldiv.style.overflow = 'hidden';
      scrolldiv.style.paddingRight = scrolldiv.style.paddingBottom = this.quirks.scrollbar_width;
    }
  }
  LzSprite.prototype.setX.call(this, x);
  if (scrolling) {
    if (turd) {
      scrolldiv.style.overflow = 'scroll';
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
      scrolldiv.style.overflow = 'hidden';
      scrolldiv.style.paddingRight = scrolldiv.style.paddingBottom = this.quirks.scrollbar_width;
    }
  }
  LzSprite.prototype.setY.call(this, y);
  if (scrolling) {
    if (turd) {
      scrolldiv.style.overflow = 'scroll';
      scrolldiv.style.paddingRight = scrolldiv.style.paddingBottom = '0';
    }
    scrolldiv.scrollLeft = oldLeft;
    scrolldiv.scrollTop = oldTop;
  }
}

LzTextSprite.prototype.setWidth = function (w, force){
    if (w == null || w < 0 || isNaN(w)) return;
    // Call the super method (to set width of container)
    var nw = LzSprite.prototype.setWidth.call(this, w);
    // Calculate the width of the scrolldiv
    var wt = (w >= this.__wpadding ? w - this.__wpadding : 0);
    // Calculate a clip mask to hide the scrollbar
    var scrolldiv = this.scrolldiv;
    var style = scrolldiv.style;
    var cdim = this.CSSDimension;
    var wp = cdim(wt);
    var h = this.height;
    // initial value for 'height' is null
    var hp = cdim(h != null ? h : 0);
    // The scrollbar invades the width, so push the scrollbar out of
    // the way
    if (this.scrolling) {
      wt += this.quirks.scrollbar_width;
    }
    // need to substract (negative) text-indent from width (but not from clip!),
    // because we've added a left-padding in setTextAlign()
    var wtInd = (this.__LZtextIndent < 0 ? -1*this.__LZtextIndent : 0);
    if (wt >= wtInd) { wt -= wtInd; }
    wp = cdim(wt);
    if (style.width != wp) {
      // Debug.debug('%w.style.width = %s', this.scrolldiv, this.CSSDimension(wt));
      scrolldiv.style.width = wp;
      // Hide the scrollbar
      if (this.scrolling) {
          scrolldiv.style.clip = ('rect(0 ' + wp + ' ' + hp + ' 0)');
      }
      this.__updatefieldsize();
    }
    return nw;
}

LzTextSprite.prototype.setHeight = function (h) {
    if (h == null || h < 0 || isNaN(h)) return;
    // Call the super method
    var nh = LzSprite.prototype.setHeight.call(this, h);
    // Calculate the height of the scrolldiv
    var ht = h; // (h >= this.__hpadding ? h - this.__hpadding : 0);
    // Calculate a clip mask to hide the scrollbar
    var scrolldiv = this.scrolldiv;
    var sdc = scrolldiv.className;
    var style = scrolldiv.style;
    var cdim = this.CSSDimension;
    var w = this.width;
    // initial value for 'width' is null
    var wp = cdim(w != null ? w : 0);
    var hp = cdim(ht);
    // The scrollbar invades the height, so push the scrollbars out of
    // the way.
    // 
    // Input text is CSS class 'lzswfinputtextmultiline', and always
    // has scrollbars enabled, so check for that CSS class.
    if (this.scrolling || sdc == 'lzswfinputtextmultiline') {
      ht += this.quirks.scrollbar_width;
    }
    hp = cdim(ht);
    if (style.height != hp) {
      // Debug.debug('%w.style.height = %s', this.scrolldiv, cdim(ht));
      scrolldiv.style.height = cdim(ht);
      // Hide the scrollbar
      if (this.scrolling) {
          scrolldiv.style.clip = ('rect(0 ' + wp + ' ' + hp + ' 0)');
      }
      this.__updatefieldsize();
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
            // reset width
            this.setWidth(this.width, true);
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

    this.scrolldiv.style.textShadow = cssString;

    this.shadow = cssString;
    this.scrolldiv.style.overflow = '';
}

}
