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

var LzTextSprite = function(owner) {
    if (owner == null) return;
    this.owner = owner;
    this.uid = LzSprite.prototype.uid++;

    this.__LZdiv = document.createElement('div');
    this.__LZdiv.className = 'lzdiv';
    this.scrolldiv = this.__LZtextdiv = document.createElement('div');
    this.scrolldiv.owner = this;
    this.__LZtextdiv.className = 'lzdiv';
    this.__LZdiv.appendChild(this.__LZtextdiv);  
    if (this.quirks.emulate_flash_font_metrics) {
        this.__LZdiv.className = 'lzswftext';
    } else {    
        this.__LZdiv.className = 'lztext';
    }    
    this.__LZdiv.owner = this;
    if (this.quirks.fix_clickable) {
        this.__LZclickcontainerdiv = document.createElement('div');
        this.__LZclickcontainerdiv.className = 'lzdiv';
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
    fsize = this.CSSDimension(fsize);
    if (this._fontSize != fsize) {
        this._fontSize = fsize;
        this.__LZdiv.style.fontSize = fsize;
        this._styledirty = true;
        this.__updatelineheight();
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
        this.__LZdiv.style.fontWeight = fweight;
        this._styledirty = true;
        this.__updatelineheight();
    }

    if (fstyle != this._fontStyle) {
        this._fontStyle = fstyle;
        this.__LZdiv.style.fontStyle = fstyle;
        this._styledirty = true;
        this.__updatelineheight();
    }
}

LzTextSprite.prototype.setFontName = function (fname) {
    if (fname != this._fontFamily) {
        this._fontFamily = fname;
        this.__LZdiv.style.fontFamily = fname;
        this._styledirty = true;
        this.__updatelineheight();
    }
}

LzTextSprite.prototype.setTextColor = LzSprite.prototype.setColor;

LzTextSprite.prototype.scrollTop;
LzTextSprite.prototype.scrollHeight;
LzTextSprite.prototype.scrollLeft;
LzTextSprite.prototype.scrollWidth;
LzTextSprite.prototype.lineHeight;

LzTextSprite.prototype.__updatefieldsize = function ( ){
  var lzv = this.owner;
  var scrolldiv = this.scrolldiv;

  if (this._styledirty) {
    this.__updatelineheight();
  }
  var scrollHeight = scrolldiv.scrollHeight;
  if (this.scrollHeight !== scrollHeight) {
    this.scrollHeight = scrollHeight;
    lzv.scrollevent('scrollHeight', scrollHeight);
  }
  var scrollTop = scrolldiv.scrollTop;
  if (this.scrollTop !== scrollTop) {
    this.scrollTop = scrollTop;
    lzv.scrollevent('scrollTop', scrollTop);
  }
  var scrollWidth = scrolldiv.scrollWidth;
  if (this.scrollWidth !== scrollWidth) {
    this.scrollWidth = scrollWidth;
    lzv.scrollevent('scrollWidth', scrollWidth);
  }
  var scrollLeft = scrolldiv.scrollLeft;
  if (this.scrollLeft !== scrollLeft) {
    this.scrollLeft = scrollLeft;
    lzv.scrollevent('scrollLeft', scrollLeft);
  }
}

LzTextSprite.prototype.lineHeight;

LzTextSprite.prototype.__updatelineheight = function ( ){
  var lzv = this.owner;
  var scrolldiv = this.scrolldiv;
  var lineHeight = this.getTextHeight();
  if (this.lineHeight !== lineHeight) {
    this.lineHeight = lineHeight;
    lzv.scrollevent('lineHeight', lineHeight);
  }
  if (this.resize) {
      this.setWidth(this.getTextWidth());
  }
}


LzTextSprite.prototype.setText = function(t, force) {
    if (force != true && this.text == t) return;
    //Debug.write('LzTextSprite.setText', t);

    this.text = t;

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
    this.__LZtextdiv.innerHTML = t;
    this.__updatefieldsize();
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
            this.__LZdiv.style.whiteSpace = 'normal';
            this._styledirty = true;
        }
        this.__LZdiv.style.overflow = 'visible';
    } else {
        if (this._whiteSpace != 'nowrap') {
            this._whiteSpace = 'nowrap';
            this.__LZdiv.style.whiteSpace = 'nowrap';
            this._styledirty = true;
        }
        this.__LZdiv.style.overflow = 'hidden';
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

LzTextSprite.prototype.getTextWidth = function () {
  //Debug.write('LzTextSprite.getTextWidth', this.text, this._textsizecache[this.text]);
  if (this.text == '') return 0;
  return this.getTextSize(this.text, this.resize).width;
}

// TODO [2009-02-27 ptw] (LPP-7832) Rename to get LineHeight
LzTextSprite.prototype.getTextHeight = function () {
  var h = this.getTextSize(null).height;
  if (h > 0 && this.quirks.emulate_flash_font_metrics) {
    if (! this.multiline) { 
        h -= this.__hpadding;
    }
  }
  return h;
}

LzTextSprite.prototype.getTextfieldHeight = function () {
    if (this.multiline) {
        var oldheight = false;
        if (this.height) {
            oldheight = this.__LZdiv.style.height;
            this.__LZdiv.style.height = 'auto';
        }
        var h = this.__LZdiv.clientHeight;
        if (h == 0 || h == null) {
            h = this.getTextSize(this.text).height;
            if (h > 0 && this.quirks.emulate_flash_font_metrics) {
                h += this.__hpadding;
            }
        } else {
            // catch text id="b" in test/lztext/lztext-testheight.lzx
            if (h == 2) h = this.getTextSize(this.text).height;
            if (h > 0 && this.quirks.emulate_flash_font_metrics) {
                h += this.__hpadding;
            }
        }
        //Debug.info('LzTextSprite.getTextfieldHeight', h, this.height, this.owner);
        if (this.height) {
            this.__LZdiv.style.height = oldheight;
        }
    } else {
        var h = this.getTextSize(null).height;
    }
//     Debug.debug('getTextfieldHeight: %s', h);
    return h;
}

LzTextSprite.prototype._sizecache = {counter: 0}
if (LzSprite.prototype.quirks.ie_leak_prevention) {
    LzTextSprite.prototype._sizedomcache = {}
}
LzTextSprite.prototype._styledirty = true;
LzTextSprite.prototype.getTextSize = function (string, ignorewidth) {
    // Measure a single line
    if (string == null || string == '') string = 'Yq_gy"9;';
    if (this._styledirty != true) {
        var style = this._stylecache;
    } else {
        var style = 'position: absolute';
        style += ';visibility: hidden';
        style += ';font-size: ' + this._fontSize;
        style += ';font-style: ' + this._fontStyle;
        style += ';font-weight: ' + this._fontWeight;
        style += ';font-family: ' + this._fontFamily;
        style += ';line-height: ' + LzSprite.prototype.__defaultStyles.lzswftext.lineHeight;
        style += ';letter-spacing: ' + this._letterSpacing;
        style += ';text-indent: ' + this._textIndent;
        style += ';text-align: ' + this._textAlign;

        if (this.multiline && ignorewidth != true) {
            var w = this.width;
            if (w) {
                if (this.__LZtextIndent < 0) w += this.__LZtextIndent;
                style += ';width: ' + w + 'px';
            }
        }
        style += ';white-space: ' + this._whiteSpace;

        this._stylecache = style;
        this._styledirty = false;
    }

    //Debug.write('getTextSize', this._stylecache, this.dirty);

    var root = document.getElementById('lzTextSizeCache');

    if (LzTextSprite.prototype._sizecache.counter > 0 && LzTextSprite.prototype._sizecache.counter % LzTextSprite.prototype.__sizecacheupperbound == 0) {
        LzTextSprite.prototype._sizecache = {counter: 0};
        if (LzSprite.prototype.quirks.ie_leak_prevention) {
            var obj = LzTextSprite.prototype._sizedomcache;
            var f = LzSprite.prototype.__discardElement;
            for( var i in obj ) {
                f( obj[i] );
            }
            LzTextSprite.prototype._sizedomcache = {}
        }
        if (root) {
            root.innerHTML = '';
        }
    }
    if (LzTextSprite.prototype._sizecache[style] == null) LzTextSprite.prototype._sizecache[style] = {};

    if (! root) {
        root = document.createElement('div');
        lz.embed.__setAttr(root, 'id', 'lzTextSizeCache');
        lz.embed.__setAttr(root, 'style', 'top: 4000px;');
        document.body.appendChild(root);
    }

    var _textsizecache = LzTextSprite.prototype._sizecache[style];
    if (! _textsizecache[string]) {
        var size = {};

        if (this.quirks['text_measurement_use_insertadjacenthtml']) {
            if (this.multiline && string && this.quirks['inner_html_strips_newlines']) {
                string = string.replace(this.inner_html_strips_newlines_re, '<br/>');
            }
            var tagname = 'span';
            var mdiv = _textsizecache['lzdiv~~~' + tagname];
            if (mdiv == null) {
                var html = '<' + tagname + ' id="testSpan' + LzTextSprite.prototype._sizecache.counter + '"';
                html += ' style="' + style + '">';
                html += string;
                html += '</' + tagname + '>';
                root.insertAdjacentHTML('beforeEnd', html);

                mdiv = document.all['testSpan' + LzTextSprite.prototype._sizecache.counter];
                _textsizecache['lzdiv~~~' + tagname] = mdiv;
            }
        } else {
            if (this.multiline && string) {
                if (this.quirks['inputtext_strips_newlines'] && this.__LzInputDiv) {
                    // safari counts the br and the newline...
                } else {
                    string = string.replace(this.inner_html_strips_newlines_re, '<br/>');
                }
            }
            var tagname = this.multiline ? 'div' : 'span';
            var mdiv = _textsizecache['lzdiv~~~' + tagname];
            if (mdiv == null) {
                mdiv = document.createElement(tagname);
                lz.embed.__setAttr(mdiv, 'style', style);
                root.appendChild(mdiv);
                _textsizecache['lzdiv~~~' + tagname] = mdiv;
            }
        } 
        if (this.quirks.ie_leak_prevention) {
            LzTextSprite.prototype._sizedomcache['lzdiv~~~' + tagname + style] = mdiv;
        }

        mdiv.innerHTML = string;
        mdiv.style.display = 'block';
        size.width = mdiv.offsetWidth;
        size.height = mdiv.offsetHeight;
        mdiv.style.display = 'none';

        if (this.quirks.emulate_flash_font_metrics) {
            // Fix to make equivalent across swf and DHTML
            size.height = Math.floor(size.height * 1.0000002) + (this.multiline ? 0 : this.__hpadding);
            size.width = size.width + (this.multiline ? 0 : this.__wpadding);
            if (this._whiteSpace == 'normal') {
                if (this.multiline) {
                    size.width += this.__wpadding;
                }
            }
        }    
        _textsizecache[string] = size;
        LzTextSprite.prototype._sizecache.counter++;
    }
    //Debug.info('getTextSize', this.owner, _textsizecache[string], string, style);
    return _textsizecache[string];
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

LzTextSprite.prototype.__setWidth = LzSprite.prototype.setWidth;
LzTextSprite.prototype.setWidth = function (w, force){
    if (w == null || w < 0 || isNaN(w) || (this.width == w && !force)) return;
    var wt = (w >= - this.__wpadding ? w - this.__wpadding : 0);
    // need to substract (negative) text-indent from width (but not from clip!),
    // because we've added a left-padding in setTextAlign()
    var wtInd = (this.__LZtextIndent < 0 ? -1*this.__LZtextIndent : 0);
    this.__LZtextdiv.style.width = this.CSSDimension(wt >= wtInd ? wt - wtInd : 0);
    var wp = this.CSSDimension(wt);
    var hp = this.CSSDimension(this.height >= this.__hpadding ? this.height - this.__hpadding : 0);
    this.__LZtextdiv.style.clip = 'rect(0px ' + wp + ' ' + hp + ' 0px)';
    this.__setWidth(w);
    this.__updatefieldsize();
    this._styledirty = true;
}

LzTextSprite.prototype.__setHeight = LzSprite.prototype.setHeight;
LzTextSprite.prototype.setHeight = function (h){
    if (h == null || h < 0 || isNaN(h) || this.height == h) return;
    var wp = this.CSSDimension(this.width >= this.__wpadding ? this.width - this.__wpadding : 0);
    var hp = this.CSSDimension(h >= this.__hpadding ? h - this.__hpadding : 0);
    this.__LZtextdiv.style.height = hp;
    this.__LZtextdiv.style.clip = 'rect(0px ' + wp + ' ' + hp + ' 0px)';
    this.__setHeight(h);
    this.__updatefieldsize();
    if (this.multiline) this._styledirty = true;
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
        if (this.quirks.textstyle_on_textdiv) {
            this.__LZtextdiv.style.textAlign = align;
        } else {
            this.__LZdiv.style.textAlign = align;
        }
        this._styledirty = true;
    }
}

LzTextSprite.prototype.setTextIndent = function (indent) {
    // In standard-compliance mode, all dimensions must have units
    var indentPx = this.CSSDimension(indent);
    if (this._textIndent != indentPx) {
        var negInd = (indent < 0) || (this.__LZtextIndent < 0);
        this._textIndent = indentPx;
        this.__LZtextIndent = indent;
        if (this.quirks.textstyle_on_textdiv) {
            this.__LZtextdiv.style.textIndent = indentPx;
        } else {
            this.__LZdiv.style.textIndent = indentPx;
        }
        this._styledirty = true;
        if (negInd) {
            // only add padding for negative indent, but remove minus sign
            this.__LZtextdiv.style.paddingLeft = (indent >= 0) ? "" : indentPx.substr(1);
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
        this.__LZdiv.style.letterSpacing = spacing;
        this._styledirty = true;
    }
}

LzTextSprite.prototype.setTextDecoration = function (decoration) {
    if (this._textDecoration != decoration) {
        this._textDecoration = decoration;
        if (this.quirks.textdeco_on_textdiv) {
            this.__LZtextdiv.style.textDecoration = decoration;
        } else {
            this.__LZdiv.style.textDecoration = decoration;
        }
        // note: don't need to mark style as dirty here
    }
}
