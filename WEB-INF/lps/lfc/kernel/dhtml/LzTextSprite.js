/**
  * LzTextSprite.js
  *
  * @copyright Copyright 2007 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic DHTML
  * @author Max Carlson &lt;max@openlaszlo.org&gt;
  */

var LzTextSprite = function(owner) {
    if (owner == null) return;
    this.__LZdiv = document.createElement('div');
    this.__LZdiv.className = 'lzdiv';
    this.__LZtextdiv = document.createElement('div');
    this.__LZtextdiv.className = 'lzdiv';
    this.__LZdiv.appendChild(this.__LZtextdiv);  
    if (this.quirks.emulate_flash_font_metrics) {
        this.__LZdiv.className = 'lzswftext';
    } else {    
        this.__LZdiv.className = 'lztext';
    }    
    this.__LZdiv.owner = this;
    if (this.quirks.fix_clickable) {
        this.__LZclickdiv = document.createElement('div');
        this.__LZclickdiv.className = 'lzdiv';
        this.__LZclickdiv.owner = this;
    }    
    this.owner = owner;
    this.uid = LzSprite.prototype.uid++;
    if (this.quirks.ie_leak_prevention) {
        this.__sprites[this.uid] = this;
    }
    //Debug.debug('new LzTextSprite', this.__LZdiv, this.owner);
}

LzTextSprite.prototype = new LzSprite(null);

LzTextSprite.prototype.__initTextProperties = function (args) {
    this.setFontName(args.font);
    this.setFontStyle(args.fontstyle);
    this.setFontSize(args.fontsize);
    this.text = args.text;
}

// Should reflect CSS defaults in LzSprite.js
LzTextSprite.prototype._fontStyle = 'normal';
LzTextSprite.prototype._fontWeight = 'normal';
LzTextSprite.prototype._fontSize = '11px';
LzTextSprite.prototype._fontFamily = 'Verdana,Vera,sans-serif';
LzTextSprite.prototype._whiteSpace = 'normal';
LzTextSprite.prototype.__wpadding = 4;
LzTextSprite.prototype.__hpadding = 4;
LzTextSprite.prototype.__sizecacheupperbound = 1000;
LzTextSprite.prototype.selectable = true;

LzTextSprite.prototype.setFontSize = function (fsize) {
    if (fsize == null || fsize < 0) return;
    // In standard-compliance mode, all dimensions must have units
    fsize = this.CSSDimension(fsize);
    if (this._fontSize != fsize) {
        this._fontSize = fsize;
        this.__LZdiv.style.fontSize = fsize;
        this._styledirty = true;
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
    }

    if (fstyle != this._fontStyle) {
        this._fontStyle = fstyle;
        this.__LZdiv.style.fontStyle = fstyle;
        this._styledirty = true;
    }
}

LzTextSprite.prototype.setFontName = function (fname) {
    if (fname != this._fontFamily) {
        this._fontFamily = fname;
        this.__LZdiv.style.fontFamily = fname;
        this._styledirty = true;
    }
}

LzTextSprite.prototype.setTextColor = LzSprite.prototype.setColor;

LzTextSprite.prototype.setText = function(t, force) {
    if (t == 'null') t = '';
    if (force != true && this.text == t) return;
    //Debug.write('LzTextSprite.setText', t);

    this.text = t;

    // For SWF compatibility, we preserve newlines in text.  We'd
    // like to use pre-line, but that appears not to work for any
    // browser.  As a compromise, if the content contains newlines, we
    // use 'pre'  The alternative would be `t.replace(RegExp('$',
    // 'mg'), '<br />')`.
    // TODO: [2006-10-02 ptw] Use 'pre-line' when supported.
    // [max 1-23-2007] Actually, t.replace(...) gives the desired behavior...
    if (this.multiline && t && (t.indexOf("\n") >= 0)) {
        if (this.quirks['inner_html_strips_newlines']) {
            t = t.replace(this.inner_html_strips_newlines_re, '<br />');
        }
    } else {
        if (this._whiteSpace != 'normal') {
            this._whiteSpace = 'normal';
            this.__LZdiv.style.whiteSpace = 'normal';
            this._styledirty = true;
        }    
    }
    if (t && this.quirks['inner_html_no_entity_apos']) {
      t = t.replace(RegExp('&apos;', 'mg'), '&#39;');
    }
    this.__LZtextdiv.innerHTML = t;
    this.fieldHeight = null;
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
    // To update height
    this.setText(this.text, true);
}

LzTextSprite.prototype.setPattern = function ( val ){
    // LPP-2550
    if ($debug) {
        Debug.warn('setPattern not yet implemented for dhtml');
    }
}

LzTextSprite.prototype.getTextWidth = function () {
  //Debug.write('LzTextSprite.getTextWidth', this.text, this._textsizecache[this.text]);
  if (this.text == null || this.text == '') return 0;
  return this.getTextSize(this.text, this.resize).width;
}

LzTextSprite.prototype.getTextHeight = function () {
    // [TODO: calculate true height of text]
  //Debug.write('LzTextSprite.getTextHeight', this.text, this.__LZdiv, this.getHeight());
    if (this.__LZdiv) {
        return this.getHeight();
    } else {
        return 0
    }    
}

LzTextSprite.prototype.getTextfieldHeight = function () {
    if (this._styledirty != true && this.fieldHeight != null) return this.fieldHeight
    if (this.text == null || this.text == '') {
        this.fieldHeight = this.getTextSize('Yq_gy').height;
//       Debug.debug('getTextfieldHeight: 0');
        return this.fieldHeight;
    }
    
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
            if (h == 2) h = this.getTextSize(this.text).height;
            if (h > 0 && this.quirks.emulate_flash_font_metrics) {
                h += this.__hpadding;
            }    
            this.fieldHeight = h;
        }
        //Debug.info('LzTextSprite.getTextfieldHeight', h, this.height, this.owner);
        if (this.height) {
            this.__LZdiv.style.height = oldheight;
        }
    } else {
        var h = this.getTextSize('Yq_gy').height;
        if (h != 0) {
            this.fieldHeight = h;
        }
    // NOTE: [2006-09-30 ptw] Don't cache 0 as a value for non-empty text.  It breaks
    // multi-line text for some reason -- I suspect because we ask for
    // the height too early...
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
    if (this._styledirty != true) {
        var style = this._stylecache;
    } else {
        var style = 'position: absolute';
        style += ';visibility: hidden';
        style += ';font-size: ' + this._fontSize;
        style += ';font-style: ' + this._fontStyle;
        style += ';font-weight: ' + this._fontWeight;
        style += ';font-family: ' + this._fontFamily;

        if (this.multiline && ignorewidth != true) {
            if (this.width) style += ';width: ' + this.width + 'px';
        }
        if (this.quirks['text_measurement_use_insertadjacenthtml']) {
            if (this.__LzInputDiv != null) {
                style += ';white-space: pre';
            } else {
                style += ';white-space: ' + this._whiteSpace;
            }
        } else {
            if (this.__LzInputDiv != null) {
                style += ';white-space: pre';
            } else {
                style += ';white-space: ' + this._whiteSpace;
            }
        }

        this._stylecache = style;
        this._styledirty = false;
    }

    if (this._sizecache.counter > this.__sizecacheupperbound) this._sizecache = {counter: 0};
    if (this._sizecache[style] == null) this._sizecache[style] = {};

    var root = document.getElementById('lzTextSizeCache');

    if (! root) {
        root = document.createElement('div');
        Lz.__setAttr(root, 'id', 'lzTextSizeCache');
        Lz.__setAttr(root, 'style', 'top: 4000px;');
        document.body.appendChild(root);
    }

    var _textsizecache = this._sizecache[style];
    if (! _textsizecache[string]) {
        var size = {};

        if (this.quirks['text_measurement_use_insertadjacenthtml']) {
            if (this.multiline && string && this.quirks['inner_html_strips_newlines']) {
                string = string.replace(this.inner_html_strips_newlines_re, '<br />');
            }
            var tagname = 'span';
            var mdiv = _textsizecache[tagname];
            if (mdiv == null) {
                var html = '<' + tagname + ' id="testSpan' + this._sizecache.counter + '"';
                html += ' style="' + style + '">';
                html += string;
                html += '</' + tagname + '>';
                root.insertAdjacentHTML('beforeEnd', html);

                mdiv = document.all['testSpan' + this._sizecache.counter];
                _textsizecache[tagname] = mdiv;
            }
        } else {
            if (this.__LzInputDiv == null) {
                if (this.multiline && string && this.quirks['inner_html_strips_newlines']) {
                    string = string.replace(this.inner_html_strips_newlines_re, '<br />');
                }
            }
            var tagname = this.multiline ? 'div' : 'span';
            var mdiv = _textsizecache[tagname];
            if (mdiv == null) {
                mdiv = document.createElement(tagname);
                Lz.__setAttr(mdiv, 'style', style);
                root.appendChild(mdiv);
                _textsizecache[tagname] = mdiv;
            }
        } 
        if (this.quirks.ie_leak_prevention) {
            LzTextSprite.prototype._sizedomcache[tagname + style] = mdiv;
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
        this._sizecache.counter++;
    }
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

LzTextSprite.prototype.setSelection = function ( start , end ){
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

LzTextSprite.prototype.__setWidth = LzSprite.prototype.setWidth;
LzTextSprite.prototype.setWidth = function (w){
    if (w == null || w < 0 || isNaN(w) || this.width == w) return;
    var wp = this.CSSDimension(w >= this.__wpadding ? w - this.__wpadding : 0);
    this.__LZtextdiv.style.width = wp;
    this.__LZtextdiv.style.clip = 'rect(0px ' + wp + ' ' + this.CSSDimension(this.height >= this.__hpadding ? this.height - this.__hpadding : 0) + ' 0px)';
    this.__setWidth(w);
    this._styledirty = true;
}

LzTextSprite.prototype.__setHeight = LzSprite.prototype.setHeight;
LzTextSprite.prototype.setHeight = function (h){
    if (h == null || h < 0 || isNaN(h) || this.height == h) return;
    var hp = this.CSSDimension(h >= this.__hpadding ? h - this.__hpadding : 0);
    this.__LZtextdiv.style.height = hp;
    this.__LZtextdiv.style.clip = 'rect(0px ' + this.CSSDimension(this.width >= this.__wpadding ? this.width - this.__wpadding : 0) + ' ' + hp + ' 0px)';
    this.__setHeight(h);
    if (this.multiline) this._styledirty = true;
}
