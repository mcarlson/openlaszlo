/**
  * LzInputTextSprite.js
  *
  * @copyright Copyright 2007 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic DHTML
  * @author Max Carlson &lt;max@openlaszlo.org&gt;
  */

var LzInputTextSprite = function(owner) {
    if (owner == null) return;
    this.__LZdiv = document.createElement('div');
    this.__LZdiv.className = 'lzdiv';
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

    this.__createInputText();
    //Debug.debug('new LzInputTextSprite', this.__LZdiv, this.owner);
}

LzInputTextSprite.prototype = new LzTextSprite(null);

// Should reflect CSS defaults in LzSprite.js
LzInputTextSprite.prototype.____hpadding = 2;
LzInputTextSprite.prototype.____wpadding = 2;

LzInputTextSprite.prototype.__createInputText = function(t) {
    if (this.__LzInputDiv) return;
    //Debug.write('Multiline', this, this.multiline, this.owner.multiline);
    if (this.owner && this.owner.password) {
        this.__LzInputDiv = document.createElement('input');
        Lz.__setAttr(this.__LzInputDiv, 'type', 'password');
    } else if (this.owner && this.owner.multiline) {
        this.__LzInputDiv = document.createElement('textarea');
    } else {    
        this.__LzInputDiv = document.createElement('input');
        Lz.__setAttr(this.__LzInputDiv, 'type', 'text');
    }
    if (this.quirks.firefox_autocomplete_bug) {
        Lz.__setAttr(this.__LzInputDiv, 'autocomplete', 'off');
    }
    this.__LzInputDiv.owner = this;
    if (this.quirks.emulate_flash_font_metrics) {
        if (this.owner && this.owner.multiline) {
            this.__LzInputDiv.className = 'lzswfinputtextmultiline';
        } else {
            this.____hpadding = 1;
            this.__LzInputDiv.className = 'lzswfinputtext';
        }    
    } else {    
        this.__LzInputDiv.className = 'lzinputtext';
    }    
    if (this.owner) {
        Lz.__setAttr(this.__LzInputDiv, 'name', this.owner.name);
    }
    if (t == null) t = '';
    Lz.__setAttr(this.__LzInputDiv, 'value', t);
    if (this.quirks.fix_clickable) {
        if (this.quirks.fix_ie_clickable) {
            this.__LZinputclickdiv = document.createElement('img');
            this.__LZinputclickdiv.src = LzSprite.prototype.blankimage;
        } else {
            this.__LZinputclickdiv = document.createElement('div');
        }
        this.__LZinputclickdiv.className = 'lzclickdiv';
        this.__LZinputclickdiv.owner = this;
        this.__LZinputclickdiv.onmouseover = function () {
            if (this.owner.selectable != true) return;
            LzInputTextSprite.prototype.__setglobalclickable(false);
            this.owner.__show();
        }
        this.__LZclickdiv.appendChild(this.__LZinputclickdiv);
    }    
    this.__LZdiv.appendChild(this.__LzInputDiv);
    //Debug.write(this.__LzInputDiv.style);
    this.__setTextEvents(true);
}

LzInputTextSprite.prototype.__show = function() {
    if (this.__shown == true || this.disabled == true) return;
    this.__hideIfNotFocused();
    LzInputTextSprite.prototype.__lastshown = this;
    this.__shown = true;
    // bring to front of click divs
    this.__LzInputDiv = this.__LZdiv.removeChild(this.__LzInputDiv);

    if (this.quirks['inputtext_parents_cannot_contain_clip']) {
        var sprites = this.__findParents('clip');
        var l = sprites.length;
        if (l > 1) {
            if (this._shownclipvals == null) {
                //if ($debug) Debug.warn('IE may not show the contents of inputtexts whose intermediate parents have clipping on.  The following parents have clip set:', sprites);
                // store old values
                this._shownclipvals = [];
                this._shownclippedsprites = sprites;
                for (var n = 0; n < l; n++) {
                    var v = sprites[n];
                    this._shownclipvals[n] = v.__LZclickdiv.style.clip;
                    v.__LZclickdiv.style.clip = 'rect(auto auto auto auto)';
                }
            }
        }
    }
    if (this.quirks.fix_ie_clickable) {
        this.__LZclickdiv.appendChild(this.__LzInputDiv);
        this.__setglobalclickable(false);
    } else {
        this.__LZinputclickdiv.appendChild(this.__LzInputDiv);
    }
    //Debug.write('show');
    // turn on selection in IE
    document.onselectstart = null;
}

LzInputTextSprite.prototype.__hideIfNotFocused = function(eventname, target) {
    if (LzInputTextSprite.prototype.__lastshown == null) return;
    if (LzSprite.prototype.quirks.fix_ie_clickable && eventname == 'onmousemove') {
        // track mouse position for inputtext when global clickable is false
        if (LzInputTextSprite.prototype.__globalclickable == false && LzInputTextSprite.prototype.__focusedSprite && target) {
            if (target.owner != LzInputTextSprite.prototype.__focusedSprite) {
                LzInputTextSprite.prototype.__setglobalclickable(true);
            } else {
                LzInputTextSprite.prototype.__setglobalclickable(false);
            }
        }
    } else {
        if (eventname != null && LzInputTextSprite.prototype.__globalclickable == true) {
            LzInputTextSprite.prototype.__setglobalclickable(false);
        }
        if (LzInputTextSprite.prototype.__focusedSprite != LzInputTextSprite.prototype.__lastshown) {
            LzInputTextSprite.prototype.__lastshown.__hide();
        }
    }

}
LzInputTextSprite.prototype.__setglobalclickable = function(c) {
    if (! LzSprite.prototype.quirks.fix_ie_clickable) return;
    if (c != LzInputTextSprite.prototype.__globalclickable) {
        LzInputTextSprite.prototype.__globalclickable = c;
        LzInputTextSprite.prototype.__setCSSClassProperty('.lzclickdiv', 'display', c ? '' : 'none');
    }
}

LzInputTextSprite.prototype.__hide = function() {
    if (this.__shown != true || this.disabled == true) return;
    LzInputTextSprite.prototype.__lastshown = null;
    this.__shown = false;
    if (this.quirks['inputtext_parents_cannot_contain_clip']) {
        if (this._shownclipvals != null) {
            // restore old values
            for (var n = 0; n < this._shownclipvals.length; n++) {
                var v = this._shownclippedsprites[n];
                v.__LZclickdiv.style.clip = this._shownclipvals[n];
            }
            this._shownclipvals = null;
            this._shownclippedsprites = null;
        }
    }
    // send to __LZdiv
    if (this.quirks.fix_ie_clickable) {
        // [TODO ptw 1-18-2007] rather than twiddling the style or style sheet you could just have a rule like (assuming you used multiple classes): 
        // .lzdiv + .lzclick { display: none; }
        // and make the click be displayed or not by whether it is before or after the (input) div? 
        // [max 1-18-2007] IE requires different nesting rules for inputtext.  Also, if there are _any_ clickable divs behind the inputtext they'll grab clicks.  This is the reason I temporarily hide all clickable divs when the inputtext is selected -  and the reason the inputtext can't be a child of the clickable view.

        this.__setglobalclickable(true);
        this.__LzInputDiv = this.__LZclickdiv.removeChild(this.__LzInputDiv);
    } else {
        this.__LzInputDiv = this.__LZinputclickdiv.removeChild(this.__LzInputDiv);
    }
    this.__LZdiv.appendChild(this.__LzInputDiv);
    //Debug.write('hide');
    // turn off selection in IE
    document.onselectstart = LzTextSprite.prototype.__cancelhandler;
}

LzInputTextSprite.prototype.gotBlur = function() {
    if (LzInputTextSprite.prototype.__focusedSprite != this) return;
    //Debug.write('blur', this.uid, LzKeyboardKernel.__cancelKeys);
    this.deselect();
}

LzInputTextSprite.prototype.gotFocus = function() {
    if (LzInputTextSprite.prototype.__focusedSprite == this) return;
    //Debug.write('focus', this.uid, LzKeyboardKernel.__cancelKeys);
    this.select();
}

LzInputTextSprite.prototype.setText = function(t) {
    if (t == null) return;
    this.text = t;
    this.__createInputText(t);
    this.__LzInputDiv.value = t;
}

LzInputTextSprite.prototype.__setTextEvents = function(c) {
    //Debug.info('__setTextEvents', c);
    if (c) {
        this.__LzInputDiv.onblur = function (e) { this.owner.__textEvent(e, 'onblur') }
        this.__LzInputDiv.onmousedown = function (e) { this.owner.__textEvent(e, 'onmousedown') }
        this.__LzInputDiv.onmouseout = function (e) { this.owner.__textEvent(e, 'onmouseout') }
        this.__LzInputDiv.onfocus = function (e) { this.owner.__textEvent(e, 'onfocus') }
        this.__LzInputDiv.onclick = function (e) { this.owner.__textEvent(e, 'onclick') }
        this.__LzInputDiv.onkeyup = function (e) { this.owner.__textEvent(e, 'onkeyup') }
        this.__LzInputDiv.onkeydown = function (e) { this.owner.__textEvent(e, 'onkeydown') }
        this.__LzInputDiv.onselect = function (e) { this.owner.__textEvent(e, 'onselect') }
        this.__LzInputDiv.onchange = function (e) { this.owner.__textEvent(e, 'onchange') }
    } else {
        this.__LzInputDiv.onblur = null;
        this.__LzInputDiv.onmousedown = null;
        this.__LzInputDiv.onfocus = null;
        this.__LzInputDiv.onclick = null;
        this.__LzInputDiv.onkeyup = null;
        this.__LzInputDiv.onkeydown = null;
        this.__LzInputDiv.onselect = null;
        this.__LzInputDiv.onchange = null;
    }
}

LzInputTextSprite.prototype.__textEvent = function ( e, eventname ){
    if (this.destroyed == true) return;
    var keycode = e ? e.keyCode : event.keyCode;
    if (eventname == 'onfocus' || eventname == 'onmousedown') {
        if (eventname == 'onfocus') {
            LzInputTextSprite.prototype.__setglobalclickable(false);
        }
        LzInputTextSprite.prototype.__focusedSprite = this;         
        this.__show();
        if (eventname == 'onfocus' && this._cancelfocus) {
            this._cancelfocus = false;
            return;
        }
        if (window['LzKeyboardKernel']) LzKeyboardKernel.__cancelKeys = false;
    } else if (eventname == 'onblur') {
        if (window['LzKeyboardKernel']) LzKeyboardKernel.__cancelKeys = true;
        if (LzInputTextSprite.prototype.__focusedSprite == this) {
            LzInputTextSprite.prototype.__focusedSprite = null;         
        }    
        this.__hide();
        if (this._cancelblur) {
            this._cancelblur = false;
            return;
        }
    } else if (eventname == 'onmouseout') {
        this.__setglobalclickable(true);
    }

    //Debug.info('__textEvent', eventname, keycode);
    if (this.owner) {
        // Generate the event. onkeyup/onkeydown sent by LzKeys.js
        if (eventname == 'onkeydown' || eventname == 'onkeyup') {
            var v = this.__LzInputDiv.value;
            if (v != this.text) {
                this.text = v;
                this.owner.inputtextevent('onchange', v);
            }
        }
        else {
            this.owner.inputtextevent(eventname, keycode);
        }
    }
}

LzInputTextSprite.prototype.setEnabled = function ( val ){
    this.disabled = ! val;
    this.__LzInputDiv.disabled = this.disabled;    
}

LzInputTextSprite.prototype.setMaxLength = function ( val ){
    if (val == null) return;
    this.__LzInputDiv.maxLength = val;    
}

LzInputTextSprite.prototype.select = function (start, end){
    this._cancelblur = true;
    this.__show();
    this.__LzInputDiv.focus();
    LzInputTextSprite.__lastfocus = this;
    setTimeout('LzInputTextSprite.__lastfocus.__LzInputDiv.select()', 50);
    //this.__LzInputDiv.select();
    if (window['LzKeyboardKernel']) LzKeyboardKernel.__cancelKeys = false;
    //Debug.write('select', this.uid, LzKeyboardKernel.__cancelKeys);
}

LzInputTextSprite.prototype.setSelection = LzInputTextSprite.prototype.select;

LzInputTextSprite.prototype.deselect = function (){
    this._cancelfocus = true;
    this.__hide();
    if (this.__LzInputDiv && this.__LzInputDiv.blur) this.__LzInputDiv.blur();
    if (window['LzKeyboardKernel']) LzKeyboardKernel.__cancelKeys = true;
    //Debug.write('deselect', this.uid, LzKeyboardKernel.__cancelKeys);
}    

// Should reflect CSS defaults in LzSprite.js
LzInputTextSprite.prototype.__fontStyle = 'normal';
LzInputTextSprite.prototype.__fontWeight = 'normal';
LzInputTextSprite.prototype.__fontSize = '11px';
LzInputTextSprite.prototype.__fontFamily = 'Verdana,Vera,sans-serif';

LzInputTextSprite.prototype.__setFontSize = LzTextSprite.prototype.setFontSize;
LzInputTextSprite.prototype.setFontSize = function (fsize) {
    this.__setFontSize(fsize);
    if (this.__fontSize != this._fontSize) { 
        this.__fontSize = this._fontSize;
        this.__LzInputDiv.style.fontSize = this._fontSize;
    }    
}

LzInputTextSprite.prototype.__setFontStyle = LzTextSprite.prototype.setFontStyle;
LzInputTextSprite.prototype.setFontStyle = function (fstyle) {
    this.__setFontStyle(fstyle);
    if (this.__fontStyle != this._fontStyle) {  
        this.__fontStyle = this._fontStyle;
        this.__LzInputDiv.style.fontStyle = this._fontStyle;
    }    
    if (this.__fontWeight != this._fontWeight) {  
        this.__fontWeight = this._fontWeight;
        this.__LzInputDiv.style.fontWeight = this._fontWeight;
    }    
}

LzInputTextSprite.prototype.__setFontName = LzTextSprite.prototype.setFontName;
LzInputTextSprite.prototype.setFontName = function (fname) {
    this.__setFontName(fname);
    if (this.__fontFamily != this._fontFamily) {  
        this.__fontFamily = this._fontFamily;
        this.__LzInputDiv.style.fontFamily = this._fontFamily;
    }    
}

LzInputTextSprite.prototype.setWidth = function (w) {
    if (w == null || w < 0 || isNaN(w) || this.width == w) return;
    // call LzSprite.setWidth();
    var nw = this.__setWidth(w - this.____wpadding);
    if (this.quirks.fix_clickable && nw != null) {
        this.__LZclickdiv.style.width = nw;
        this.__LZinputclickdiv.style.width = nw;
    }   
}

LzInputTextSprite.prototype.setHeight = function (h) {
    if (h == null || h < 0 || isNaN(h) || this.height == h) return;
    // call LzSprite.setHeight();
    var nh = this.__setHeight(h);
    if (this.quirks.fix_clickable && nh != null) {
        this.__LZclickdiv.style.height = nh;
        this.__LZinputclickdiv.style.height = nh;
        if (this.multiline && this.quirks.set_height_for_multiline_inputtext) {
            h = this.CSSDimension(h - (this.____hpadding * 2));
            if (h != this._multilineheight) {
                this._multilineheight = h;
                this.__LzInputDiv.style.height = h
            }
        }
    }   
}   

// Must match LzSprite implementation
LzInputTextSprite.prototype.setColor = function (c) {
    if (this.color == c) return;
    this.color = c;
    this.__LzInputDiv.style.color = LzUtils.color.inttohex(c);
}

LzInputTextSprite.prototype.getText = function () {
    return this.__LzInputDiv.value;
}

LzInputTextSprite.prototype.getTextfieldHeight = function () {
    if (this.fieldHeight != null) return this.fieldHeight
    if (this.text == null || this.text == '') {
        // measure test string
        var testheight = true;
        this.text="YgjyZT;:";
    }
    
    if (this.multiline) {
        var oldheight = false;
        if (this.height) {
            oldheight = this.__LzInputDiv.style.height;
            this.__LzInputDiv.style.height = 'auto';
        }
        var h = this.__LzInputDiv.scrollHeight;
        if (h == 0 || h == null) {
            h = this.getTextSize(this.text).height;
        } else {
            if (this.quirks['safari_textarea_subtract_scrollbar_height']) h += 24;
            this.fieldHeight = h;
        }
        //Debug.info('LzInputTextSprite.getTextfieldHeight', h, this.height, this.owner, this.__LzInputDiv);
        if (this.height) {
            this.__LzInputDiv.style.height = oldheight;
        }
    } else {
        var h = this.getTextSize(this.text).height;
        if (h != 0) {
            this.fieldHeight = h;
        }
    }
    // NOTE: [2006-09-30 ptw] Don't cache 0 as a value for non-empty text.  It breaks
    // multi-line text for some reason -- I suspect because we ask for
    // the height too early...
//     Debug.debug('getTextfieldHeight: %s', h);
    if (this.quirks.emulate_flash_font_metrics) {
        h += 4;
    }    
    if (testheight) this.text = '';
    return h;
}

LzInputTextSprite.prototype.getTextHeight = function () {
    var h = this.getTextfieldHeight();
    if (this.quirks.emulate_flash_font_metrics) {
        h -= 4;
    }    
    return h;
}
