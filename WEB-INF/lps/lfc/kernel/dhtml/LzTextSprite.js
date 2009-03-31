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
    if ($debug) {
        // annotate divs with sprite IDs
        this.__LZdiv.id = 'textsprite_' + this.uid;
        this.__LZclickcontainerdiv.id = 'click_' + this.__LZdiv.id;
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

LzTextSprite.prototype.scrollTop = null;
LzTextSprite.prototype.scrollHeight = null;
LzTextSprite.prototype.scrollLeft = null;
LzTextSprite.prototype.scrollWidth = null;

// The sprite copy of this will only be on if the underlying div
// actually is scrollable
LzTextSprite.prototype.scrollevents = false;
LzTextSprite.prototype.setScrollEvents = function (on) {
  var scrolldiv = this.scrolldiv;
  var sdc = scrolldiv.className;
  if (sdc == 'lzswftext' || sdc == 'lzswfinputtextmultiline') {
    // See setWidth/setHeight: adjust width/height to push the
    // scroll bars under the clip
    var ht = this.height;
    var wt = this.width;
    var cdim = this.CSSDimension;
    if (on) {
      this.scrollevents = true;
      scrolldiv.style.overflow = 'scroll';
      ht += this.quirks.scrollbar_width;
      wt += this.quirks.scrollbar_width;
    } else {
      this.scrollevents = false;
      scrolldiv.style.overflow = 'hidden';
    }
    var hp = cdim(ht);
    var wp = cdim(wt);
    scrolldiv.style.height = hp;
    scrolldiv.style.width = wp;
  }
}

LzTextSprite.prototype.__updatefieldsize = function ( ){
  var lzv = this.owner;
  // Validate lineHeight
  this.__updatelineheight();
  // Measure the total height of the text, including any clipped
  // (scrollable) text
  // Debug.debug('scrollHeight %d, last char %w', scrolldiv.scrollHeight, scrolldiv['value'] && scrolldiv.value.charAt(scrolldiv.value.length - 1));
  if (! this.scrollevents) return;
  this.__updatefieldprop('scrollHeight');
  this.__updatefieldprop('scrollTop');
  this.__updatefieldprop('scrollWidth');
  this.__updatefieldprop('scrollLeft');
}

LzTextSprite.prototype.__updatefieldprop = function(name){
  var val = this.scrolldiv[name];
  if (this[name] !== val) {
    this[name] = val;
    this.owner.scrollevent(name, val);
  }
}

LzTextSprite.prototype.lineHeight = null;

LzTextSprite.prototype.__updatelineheight = function ( ){
  var lzv = this.owner;
  var scrolldiv = this.scrolldiv;
  var lineHeight = this.getTextDimension('lineheight');
  if (this.lineHeight !== lineHeight) {
    this.lineHeight = lineHeight;
    lzv.scrollevent('lineHeight', lineHeight);
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
    } else {
        if (this._whiteSpace != 'nowrap') {
            this._whiteSpace = 'nowrap';
            this.scrolldiv.style.whiteSpace = 'nowrap';
        }
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
  var w = this.getTextDimension('width');
  if (w != 0 && this.quirks['emulate_flash_font_metrics']) {
    w += this.__wpadding;
  }
  return w;
}

// TODO [2009-02-27 ptw] (LPP-7832) Rename to get LineHeight
LzTextSprite.prototype.getTextHeight = function () {
  // Line height does _not_ include padding
  return this.getTextDimension('lineheight');
}

LzTextSprite.prototype.getTextfieldHeight = function () {
    var fieldHeight = null;
    if (this.multiline && this.text != '') {
      // NOTE: [2009-03-27 ptw] You might think you could use
      // scrollHeight, but that does not get updated if you change the
      // text and ask for it in the same breath (without pausing for
      // the div to be re-laid out).  Note, the actual text in the
      // scrolldiv may not be eq to this.text because of quirks, but
      // that is what we want to measure.
      fieldHeight = this.getTextDimension('height');
      if (this.quirks['safari_textarea_subtract_scrollbar_height']) { fieldHeight += 24 };
    } else {
      fieldHeight = this.getTextDimension('lineheight');
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
if (LzSprite.prototype.quirks.ie_leak_prevention) {
    LzTextSprite.prototype._sizedomcache = {}
}

// key is the div class plus local style
LzTextSprite.prototype._cachevalid = null;
// values are height for the test string or widths for specific strings
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
  var scrolldiv = this.scrolldiv;
  var sds = scrolldiv.style;
  switch (dimension) {
    case 'lineheight':
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
        Debug.error("Unknown dimesion: %w", dimension);
      }
  }
  // Quick check
  var className = scrolldiv.className;
  var style = scrolldiv.style.cssText;
  var quickKey = className + "/" + style + "{" + string + "}";
  var cv = this._cachevalue;
  if ((this._cachevalid == quickKey &&
       (dimension in cv))) {
    return cv[dimension];
  }
  // Update quick key
  this._cachevalid = quickKey;
  // Now create a cache key limited to the styles that can affect the
  // height/width
  // Turn off `overflow: scroll; width: 100%; height:100%` so that does not interfere with measurements
  style = ("overflow: visible; width: " + width + "; height: auto; " +
           ((sds.fontSize) ? ("font-size: " + sds.fontSize + "; ") : "") +
           ((sds.fontWeight) ? ("font-weight: " + sds.fontWeight + "; ") : "") +
           ((sds.fontStyle) ? ("font-style: " + sds.fontStyle + "; ") : "") +
           ((sds.fontFamily) ? ("font-family: " + sds.fontFamily + "; ") : "") +
           ((sds.lineHeight) ? ("line-height: " + sds.lineHeight + "; ") : "") +
           ((sds.letterSpacing) ? ("letter-spacing: " + sds.letterSpacing + "; ") : "") +
           ((sds.whiteSpace) ? ("white-space: " + sds.whiteSpace + "; ") : ""));
  var cacheKey = className + "/" + style + "{" + string + "}";
  var ltsp = LzTextSprite.prototype;
  var _sizecache = ltsp._sizecache;
  var cv = this._cachevalue = _sizecache[cacheKey];
  if (cv && (dimension in cv)) {
    return cv[dimension];
  }
  // Otherwise, compute from scratch
  var root = document.getElementById('lzTextSizeCache');
  if ((_sizecache.counter > 0) && ((_sizecache.counter % this.__sizecacheupperbound) == 0)) {
    _sizecache = {counter: 0};
    cv = null;
    if (LzSprite.prototype.quirks.ie_leak_prevention) {
      var obj = ltsp._sizedomcache;
      var f = LzSprite.prototype.__discardElement;
      for (var i in obj) { f( obj[i] ); }
      ltsp._sizedomcache = {}
    }
    if (root) { root.innerHTML = ''; }
  }
  if (! cv) {
    cv = this._cachevalue = _sizecache[cacheKey] = {};
  }
  if (! root) {
    root = document.createElement('div');
    lz.embed.__setAttr(root, 'id', 'lzTextSizeCache');
    lz.embed.__setAttr(root, 'style', 'top: 4000px;');
    document.body.appendChild(root);
  }
  // TODO: [2009-03-29 ptw] Should we use the scrolldiv.tagName so we
  // get the actual node type for measurment?  But if we do, we have
  // to conditionalize setting the text into the node (because there
  // seems to be no generic method for setting the content of nodes?)
  var tagname = 'div';
  if (this.quirks['text_measurement_use_insertadjacenthtml']) {
    var html = '<' + tagname + ' id="testSpan' + ltsp._sizecache.counter + '"';
    html += ' class="' + className + '"';
    html += ' style="' + style + '">';
    html += string;
    html += '</' + tagname + '>';
    root.insertAdjacentHTML('beforeEnd', html);
    var mdiv = document.all['testSpan' + ltsp._sizecache.counter];
  } else {
    var mdiv = document.createElement(tagname)
    // NOTE: [2009-03-25 ptw] setAttribute needs the real attribute
    // name, i.e., `class` not `classname`!
    lz.embed.__setAttr(mdiv, 'class', className);
    lz.embed.__setAttr(mdiv, 'style', style);
    // NOTE: [2009-03-29 ptw] For now, DHTML does not support HTML in
    // input text, so we must measure accordingly
    switch (scrolldiv.tagName) {
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
    root.appendChild(mdiv);
  } 
  if (this.quirks.ie_leak_prevention) {
    ltsp._sizedomcache['lzdiv~~~' + cacheKey] = mdiv;
  }
  // inline to measure width
  mdiv.style.display = 'inline';
  // NOTE: clientHeight for both height and lineheight
  cv[dimension] = (dimension == 'width') ? mdiv.clientWidth : mdiv.clientHeight;
  mdiv.style.display = 'none';
  LzTextSprite.prototype._sizecache.counter++;
//   Debug.debug("%w %w %d", this, cacheKey, lineHeight);
  return cv[dimension];
}

LzTextSprite.prototype.setSelectable = function (s) {
    this.selectable = s;
    //Debug.write('setSelectable', s, this.__LZdiv.style);
    if (s) {
        this.__LZdiv.onselectstart = null;
        this.__LZdiv.style['MozUserSelect'] = 'normal';
        this.__LZdiv.style['KHTMLUserSelect'] = 'normal';
        this.__LZdiv.style['UserSelect'] = 'normal';
    } else {    
        this.__LZdiv.onselectstart = LzTextSprite.prototype.__cancelhandler;
        this.__LZdiv.style['MozUserSelect'] = 'none';
        this.__LZdiv.style['KHTMLUserSelect'] = 'none';
        this.__LZdiv.style['UserSelect'] = 'none';
    }
}

LzTextSprite.prototype.__cancelhandler = function () {
    return false;
}    

LzTextSprite.prototype.setResize = function (r){
    this.resize = r == true;
}

LzTextSprite.prototype.setSelection = function ( start , end=null){
    if (end == null) { end = start; }
// TODO: not implemented
    if ($debug) {
        Debug.warn('LzTextSprite.setSelection is not implemented yet.');
    }
}

LzTextSprite.prototype.getSelectionPosition = function ( ){
// TODO: not implemented
    if ($debug) {
        Debug.warn('LzTextSprite.getSelectionPosition is not implemented yet.');
    }
}

LzTextSprite.prototype.getSelectionSize = function ( ){
// TODO: not implemented
    if ($debug) {
        Debug.warn('LzTextSprite.getSelectionSize is not implemented yet.');
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
  var scrolling = (this.scrollevents);
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
  var scrolling = (this.scrollevents);
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
    var wt = w; // (w >= - this.__wpadding ? w - this.__wpadding : 0);
    // Calculate a clip mask to hide the scrollbar
    var scrolldiv = this.scrolldiv;
    var style = scrolldiv.style;
    var cdim = this.CSSDimension;
    var wp = cdim(wt);
    var hp = cdim(this.height);
    var clip = ('rect(0 ' + wp + ' ' + hp + ' 0)');
    // The scrollbar invades the width, so push the scrollbar out of
    // the way
    if (this.scrollevents) {
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
      scrolldiv.style.clip = clip;
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
    var style = scrolldiv.style;
    var cdim = this.CSSDimension;
    var wp = cdim(this.width);
    var hp = cdim(ht);
    var clip = ('rect(0 ' + wp + ' ' + hp + ' 0)');
    // The scrollbar invades the height, so push the scrollbars out of
    // the way
    // NOTE: [2009-03-29 ptw] There are no scroll bars on input
    // elements
    if (this.scrollevents) {
      ht += this.quirks.scrollbar_width;
    }
    hp = cdim(ht);
    if (style.height != hp) {
      // Debug.debug('%w.style.height = %s', this.scrolldiv, cdim(ht));
      scrolldiv.style.height = cdim(ht);
      // Hide the scrollbar
      scrolldiv.style.clip = clip;
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
    LzTextSprite.addLinkID(this.owner);
    var uid = this.owner.getUID();
    return "<span class=\"lztextlink\" onclick=\"javascript:$modules.lz.__callTextLink('" + uid+"', '" + value +"')\">" + str +"</span>";
}

// value is encoded as VIEWID:value
$modules.lz.__callTextLink = function (viewID, val) {
    var view = LzTextSprite.linkIDMap[viewID];
    if (view != null) {
        view.ontextlink.sendEvent(val);
    }
}

// map from UIDs to views with clickable links.
// allows us to send ontextlink events to the owner view when user clicks on a
// hyperlink in text, via an "actionscript:" routine
LzTextSprite.linkIDMap = [];

LzTextSprite.addLinkID = function (view) {
    LzTextSprite.linkIDMap[view.getUID()] = view;
}


LzTextSprite.deleteLinkID = function (UID) {
    delete LzTextSprite.linkIDMap[UID];
}

// Clean up the link ID table if this view is destroyed
LzTextSprite.prototype._viewdestroy = LzSprite.prototype.destroy;

LzTextSprite.prototype.destroy = function(){
    LzTextSprite.deleteLinkID(this.owner.getUID());
    this._viewdestroy( );
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


}
