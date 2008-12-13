/**
  * LzInputTextSprite.js
  *
  * @copyright Copyright 2007-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic DHTML
  * @author Max Carlson &lt;max@openlaszlo.org&gt;
  */

var LzInputTextSprite = function(owner) {
    if (owner == null) return;
    this.owner = owner;
    this.uid = LzSprite.prototype.uid++;
    this.__LZdiv = document.createElement('div');
    this.__LZdiv.className = 'lzdiv';
    this.__LZdiv.owner = this;
    if (this.quirks.fix_clickable) {
        this.__LZclickdiv = document.createElement('div');
        this.__LZclickdiv.className = 'lzdiv';
        this.__LZclickdiv.owner = this;
    }    
    if ($debug) {
        // annotate divs with sprite IDs
        this.__LZdiv.id = 'inputtextsprite_' + this.uid;
        this.__LZclickdiv.id = 'click_' + this.__LZdiv.id;
    }
    if (this.quirks.ie_leak_prevention) {
        this.__sprites[this.uid] = this;
    }

    this.__createInputText();
    //Debug.debug('new LzInputTextSprite', this.__LZdiv, this.owner);
}

LzInputTextSprite.prototype = new LzTextSprite(null);

// Should reflect CSS defaults in LzSprite.js
LzInputTextSprite.prototype.____hpadding = 2;
LzInputTextSprite.prototype.____wpadding = 4;
LzInputTextSprite.prototype.____crregexp = new RegExp('\\r\\n', 'g');

LzInputTextSprite.prototype.__createInputText = function(t) {
    if (this.__LzInputDiv) return;
    //Debug.write('Multiline', this, this.multiline, this.owner.multiline);
    if (this.owner && this.owner.password) {
        this.__LzInputDiv = document.createElement('input');
        lz.embed.__setAttr(this.__LzInputDiv, 'type', 'password');
    } else if (this.owner && this.owner.multiline) {
        this.__LzInputDiv = document.createElement('textarea');
    } else {    
        this.__LzInputDiv = document.createElement('input');
        lz.embed.__setAttr(this.__LzInputDiv, 'type', 'text');
    }
    if (this.quirks.firefox_autocomplete_bug) {
        lz.embed.__setAttr(this.__LzInputDiv, 'autocomplete', 'off');
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
        lz.embed.__setAttr(this.__LzInputDiv, 'name', this.owner.name);
    }
    if (t == null) t = '';
    lz.embed.__setAttr(this.__LzInputDiv, 'value', t);
    if (this.quirks.fix_clickable) {
        if (this.quirks.fix_ie_clickable) {
            this.__LZinputclickdiv = document.createElement('img');
            this.__LZinputclickdiv.src = lz.embed.options.resourceroot + LzSprite.prototype.blankimage;
        } else {
            this.__LZinputclickdiv = document.createElement('div');
        }
        this.__LZinputclickdiv.className = 'lzclickdiv';
        this.__LZinputclickdiv.owner = this;
        // keep LzSprite.destroy() in sync to prevent leaks
        if (this.quirks.ie_mouse_events) {
            this.__LZinputclickdiv.onmouseenter = this.__handlemouse; 
            //can't get this to work - see LPP-5435. 
            // this.__LZinputclickdiv.onmousedown = this.__handlemouse; 
        } else {
            this.__LZinputclickdiv.onmouseover = this.__handlemouse; 
        }
        this.__LZclickdiv.appendChild(this.__LZinputclickdiv);
    }    
    this.__LZdiv.appendChild(this.__LzInputDiv);

    if (this.quirks['inputtext_size_includes_margin']) {
        this.____hpadding = 0;
    }

    //Debug.write(this.__LzInputDiv.style);
    this.__setTextEvents(true);
}

// called from the scope of __LZinputclickdiv
LzInputTextSprite.prototype.__handlemouse = function(e) {
    if (this.owner.selectable != true) return;
    LzInputTextSprite.prototype.__setglobalclickable(false);
    if (this.owner.__fix_inputtext_with_parent_resource) {
        //if (!e) e = window.event;
        //Debug.warn(e.type);
        if (! this.__shown) {
            this.owner.setClickable(true);
            //this.owner.__show();
            this.owner.select();
        }
    } else {
        this.owner.__show();
    }
}

LzInputTextSprite.prototype.init = function(v) {
    this.setVisible(v);
    if (this.quirks['fix_inputtext_with_parent_resource']) {
        var sprites = this.__findParents('clickable');
        var l = sprites.length;
        if (l) {
            for (var n = 0; n < l; n++) {
                var v = sprites[n];
                if (v.resource != null) {
                    /*
                    if ($debug) {
                        Debug.warn('inputtext %w can not have a clickable parent with a resource %w', this.owner, v.owner);
                    }
                    */
                    this.setClickable(true);
                    // set flag for use later
                    this.__fix_inputtext_with_parent_resource = true;
                    /* focusing to this doesn't help :(
                    this.__dummyinputtext = document.createElement('input');
                    this.__dummyinputtext.className = 'lzswfinputtext';
                    lz.embed.__setAttr(this.__dummyinputtext, 'type', 'text');
                    this.__LZdiv.appendChild(this.__dummyinputtext);
                    this.__dummyinputtext.style.display = 'none';
                    */
                }
            }
        }
    }
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
    //Debug.warn('__show', this.owner);
    // turn on text selection in IE
    // can't use lz.embed.attachEventHandler because we need to cancel events selectively
    document.onselectstart = null;
}

LzInputTextSprite.prototype.__hideIfNotFocused = function(eventname, target) {
    if (LzInputTextSprite.prototype.__lastshown == null) return;
    if (LzSprite.prototype.quirks.fix_ie_clickable) {
        if (eventname == 'onmousemove') {
            // track mouse position for inputtext when global clickable is false
            if (LzInputTextSprite.prototype.__globalclickable == false && LzInputTextSprite.prototype.__focusedSprite && target) {
                if (target.owner != LzInputTextSprite.prototype.__focusedSprite) {
                    LzInputTextSprite.prototype.__setglobalclickable(true);
                } else {
                    LzInputTextSprite.prototype.__setglobalclickable(false);
                }
            }
            return;
        } else if (eventname != null && LzInputTextSprite.prototype.__globalclickable == true) {
            LzInputTextSprite.prototype.__setglobalclickable(false);
        }
    }
    if (LzInputTextSprite.prototype.__focusedSprite != LzInputTextSprite.prototype.__lastshown) {
        LzInputTextSprite.prototype.__lastshown.__hide();
    }

}
LzInputTextSprite.prototype.__setglobalclickable = function(c) {
    if (! LzSprite.prototype.quirks.fix_ie_clickable) return;
    if (c != LzInputTextSprite.prototype.__globalclickable) {
        LzInputTextSprite.prototype.__globalclickable = c;
        LzInputTextSprite.prototype.__setCSSClassProperty('.lzclickdiv', 'display', c ? '' : 'none');
    }
}

LzInputTextSprite.prototype.__hide = function(ignore) {
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
    //Debug.warn('__hide', this.owner);
    if (this.__fix_inputtext_with_parent_resource) {
        //Debug.write('forcing blur', this.__LzInputDiv);
        // important to allow mouseenter event in __handlemouse
        this.setClickable(false);
        //good.sprite.gotFocus();
        /* none of these seem to allow mousedown events, so we show onmouseenter
        this.__setglobalclickable(false);
        this.__setglobalclickable(true);
        this.__dummyinputtext.style.display = '';
        this.__dummyinputtext.focus();
        this.__dummyinputtext.blur();
        this.__dummyinputtext.style.display = 'none';
        LzInputTextSprite.prototype.__focusedSprite == null;
        LzInputTextSprite.prototype.__lastshown == null;
        this.__shown = false;
        */
    }
    // turn off text selection in IE
    // can't use lz.embed.attachEventHandler because we need to cancel events selectively
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
    if (t.indexOf('<br/>') != -1) {
        t = t.replace(this.br_to_newline_re, '\r') 
        //Debug.write('new text %w', t)
    }
    this.text = t;
    this.__createInputText(t);
    this.__LzInputDiv.value = t;
    this.fieldHeight = null;
}

LzInputTextSprite.prototype.__setTextEvents = function(c) {
    //Debug.info('__setTextEvents', c);
    var div = this.__LzInputDiv;
    var f = c ? this.__textEvent : null;
    div.onblur = f;
    div.onmousedown = f;
    if (this.quirks.ie_mouse_events) {
        div.onmouseleave = f;
    } else {
        div.onmouseout = f;
    }
    div.onfocus = f;
    div.onclick = f;
    div.onkeyup = f;
    div.onkeydown = f;
    div.onkeypress = f;
    div.onchange = f;
    if (this.quirks.ie_paste_event || this.quirks.safari_paste_event) {
        div.onpaste = c ? function (e) { this.owner.__pasteHandlerEx(e) } : null;
    }
}

LzInputTextSprite.prototype.__pasteHandlerEx = function (evt) {
    if (this.multiline && this.owner.maxlength > 0) {
        evt = evt ? evt : window.event;
        
        if (this.quirks.safari_paste_event) {
            var clipboardTxt = evt.clipboardData.getData("text/plain");
        } else {
            var clipboardTxt = window.clipboardData.getData("TEXT");
            clipboardTxt = clipboardTxt.replace(this.____crregexp, '\n');
        }
        
        if (this.quirks.text_ie_carriagereturn) {
            var len = this.__LzInputDiv.value.replace(this.____crregexp, '\n').length;
        } else {
            var len = this.__LzInputDiv.value.length;
        }
        
        var selsize = this.getSelectionSize();
        if (selsize < 0) selsize = 0;//[TODO anba 2008-01-06] remove after LPP-5330
        var max = this.owner.maxlength + selsize;
        var stopPaste = false;
        
        var maxchars = max - len;
        if (maxchars > 0) {
            var txt = clipboardTxt;
            var txtLen = txt.length;
            
            if (txtLen > maxchars) {
                txt = txt.substring(0, maxchars);
                stopPaste = true;
            }
        } else {
            var txt = "";
            stopPaste = true;
        }
        
        if (stopPaste) {
            evt.returnValue = false;
            if (evt.preventDefault) {
                evt.preventDefault();
            }
            
            if (txt.length > 0) {
                if (this.quirks.safari_paste_event) {
                    var val = this.__LzInputDiv.value;
                    var selpos = this.getSelectionPosition();
                    
                    //update value
                    this.__LzInputDiv.value = val.substring(0, selpos) + txt + val.substring(selpos + selsize);
                    
                    //fix selection
                    this.__LzInputDiv.setSelectionRange(selpos + txt.length, selpos + txt.length);
                } else {
                    var range = document.selection.createRange();
                    //this updates value and ensures right selection
                    range.text = txt;
                }
            }
        }
    }
}

LzInputTextSprite.prototype.__pasteHandler = function () {
    var selpos = this.getSelectionPosition();
    var selsize = this.getSelectionSize();
    var val = this.__LzInputDiv.value;
    var that = this;
    
    // use 1ms timeout to defer execution, so that UI can update its state
    setTimeout(function() {
        var newval = that.__LzInputDiv.value;
        var newlen = newval.length;
        var max = that.owner.maxlength;
        
        if (newlen > max) {
            var len = val.length;
            var maxchars = max + selsize - len;
            
            //this was pasted
            var newc = newval.substr(selpos, newlen - len + selsize);
            //but we can only take at max that many chars
            newc = newc.substring(0, maxchars);
            
            //update value
            that.__LzInputDiv.value = val.substring(0, selpos) + newc + val.substring(selpos + selsize);
            
            //fix selection
            //note: we're in Firefox/Opera, so we can savely call "setSelectionRange"
            that.__LzInputDiv.setSelectionRange(selpos + newc.length, selpos + newc.length);
        }
    }, 1);
}

// Called from the scope of the div - use owner property
LzInputTextSprite.prototype.__textEvent = function ( evt ){
    if (! evt) evt = window.event;
    var sprite = this.owner;
    var view = this.owner.owner;
    if (sprite.__LZdeleted == true) return;
    if (sprite.__skipevent) {
        sprite.__skipevent = false;
        return;
    }
    var eventname = 'on' + evt.type;
    if (sprite.quirks.ie_mouse_events && eventname == 'onmouseleave') {
        eventname = 'onmouseout';
    }
    if (sprite.__shown != true) {
        // this only happens when tabbing in from outside the app
        if (eventname == 'onfocus') {
            sprite.__skipevent = true;
            //sprite.select()
            sprite.__show();
            sprite.__LzInputDiv.blur();
            LzInputTextSprite.__lastfocus = sprite;
            LzKeyboardKernel.setKeyboardControl(true);
        }
        return; 
    } else if (sprite.__shown == false) {
        return;
    }
    if (eventname == 'onfocus' || eventname == 'onmousedown') {
        if (eventname == 'onfocus') {
            LzInputTextSprite.prototype.__setglobalclickable(false);
        }
        LzInputTextSprite.prototype.__focusedSprite = sprite;
        sprite.__show();
        if (eventname == 'onfocus' && sprite._cancelfocus) {
            sprite._cancelfocus = false;
            return;
        }
        if (window['LzKeyboardKernel']) LzKeyboardKernel.__cancelKeys = false;
    } else if (eventname == 'onblur') {
        if (window['LzKeyboardKernel']) LzKeyboardKernel.__cancelKeys = true;
        if (LzInputTextSprite.prototype.__focusedSprite === sprite) {
            LzInputTextSprite.prototype.__focusedSprite = null;         
        }    
        if (sprite.__fix_inputtext_with_parent_resource && sprite.__isMouseOver()) {
            //Debug.write('undo blur')
            sprite.select();
            return;
        }
        sprite.__hide();
        if (sprite._cancelblur) {
            sprite._cancelblur = false;
            return;
        }
    } else if (eventname == 'onmouseout') {
        sprite.__setglobalclickable(true);
    }

    if (eventname == 'onkeypress') {
        if (sprite.multiline && view.maxlength > 0) {
            var charcode = sprite.quirks.text_event_charcode ? evt.charCode : evt.keyCode;            
            //Debug.write("charCode = %s, keyCode = %s, ctrlKey = %s, altKey = %s, shiftKey = %s", charcode, keycode, evt.ctrlKey, evt.altKey, evt.shiftKey);

            if (!(evt.ctrlKey || evt.altKey) && (charcode || keycode == 13) && keycode != 8) {
                var selsize = sprite.getSelectionSize();
                //[TODO anba 2008-01-06] use selsize==0 when LPP-5330 is fixed
                if (selsize <= 0) {
                    if (sprite.quirks.text_ie_carriagereturn) {
                        var val = sprite.__LzInputDiv.value.replace(sprite.____crregexp, '\n');
                    } else {
                        var val = sprite.__LzInputDiv.value;
                    }

                    var len = val.length, max = view.maxlength;
                    if (len >= max) {
                        evt.returnValue = false;
                        if (evt.preventDefault) {
                            evt.preventDefault();
                        }
                    }
                }
            } else {
                /* IE and Safari do not send 'onkeypress' for function-keys, */
                /* but Firefox and Opera! */
                if (sprite.quirks.keypress_function_keys) {
                    if (evt.ctrlKey && !evt.altKey && !evt.shiftKey) {
                        var c = String.fromCharCode(charcode);
                        /* 'v' for Firefox and 'V' for Opera */
                        if (c == 'v' || c == 'V') {
                            //pasting per ctrl + v
                            //[TODO anba 2008-01-06] how to detect paste per context-menu?
                            //[TODO anba 2008-10-06] (LPP-5406) Firefox3 added context-menu events
                            var len = sprite.__LzInputDiv.value.length, max = view.maxlength;
                            if (len < max || sprite.getSelectionSize() > 0) {
                                sprite.__pasteHandler();
                            } else {
                                evt.returnValue = false;
                                if (evt.preventDefault) {
                                    evt.preventDefault();
                                }
                            }
                        }
                    }
                }
            }
        }
        // don't forward 'onkeypress' to inputtextevent()
        return;
    }

    //Debug.info('__textEvent', eventname, keycode);
    if (view) {
        // Generate the event. onkeyup/onkeydown sent by lz.Keys.js
        if (eventname == 'onkeydown' || eventname == 'onkeyup') {
            var v = sprite.__LzInputDiv.value;
            if (v != sprite.text) {
                sprite.text = v;
                view.inputtextevent('onchange', v);
            }
        } else {
            if (eventname == 'onmousedown') {
                view.inputtextevent(eventname);
                // also send an artifial 'onfocus' event
                eventname = 'onfocus';
            }
            view.inputtextevent(eventname);
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

LzInputTextSprite.prototype.select = function (){
    this._cancelblur = true;
    this.__show();
    // Setting focus can generate an error in IE7/dhtml (LPP-6142)
    try {
        this.__LzInputDiv.focus();
    } catch (err) {}
    LzInputTextSprite.__lastfocus = this;
    setTimeout('LzInputTextSprite.__lastfocus.__LzInputDiv.select()', 50);
    //this.__LzInputDiv.select();
    if (window['LzKeyboardKernel']) LzKeyboardKernel.__cancelKeys = false;
    //Debug.write('select', this.uid, LzKeyboardKernel.__cancelKeys);
}

LzInputTextSprite.prototype.setSelection = function (start, end=null){
    if (end == null) { end = start; }
    this._cancelblur = true;
    this.__show();
    LzInputTextSprite.__lastfocus = this;

    if (this.quirks['text_selection_use_range']) {
        var range = this.__LzInputDiv.createTextRange(); 

        // look for leading \r\n
        var val = this.__LzInputDiv.value;

        if (start > end){
            var st = start;
            start = end;
            end = st;
        }

        if(this.multiline) { 
            var offset = 0;
            // account for leading \r\n
            var startcounter = 0;
            while (offset < start) {
                offset = val.indexOf('\r\n', offset + 2); 
                if (offset == -1) break;
                startcounter++;
            }
            var midcounter = 0;
            while (offset < end) {
                offset = val.indexOf('\r\n', offset + 2); 
                if (offset == -1) break;
                midcounter++;
            }
            var endcounter = 0;
            while (offset < val.length) {
                offset = val.indexOf('\r\n', offset + 2); 
                if (offset == -1) break;
                endcounter++;
            }

            var tl = range.text.length;
            var st = start;
            var ed = end - val.length + startcounter + midcounter + endcounter + 1;

            //if (endcounter) endcounter += startcounter;
            //alert (startcounter + ', ' + midcounter + ', ' + endcounter + ', ' + st + ', ' + ed);
        } else {
            var st = start;
            var ed = end - range.text.length;
        }

        range.moveStart("character", st);
        range.moveEnd("character", ed);
        range.select();
        //this.__LzInputDiv.range = range;
        //setTimeout('LzInputTextSprite.__lastfocus.__LzInputDiv.range.select()', 50);
        //this.__LzInputDiv.focus(); 
    } else {
        this.__LzInputDiv.setSelectionRange(start, end);
    }     
    this.__LzInputDiv.focus();

    if (window['LzKeyboardKernel']) LzKeyboardKernel.__cancelKeys = false;
}

LzInputTextSprite.prototype.getSelectionPosition = function (){
    if (! this.__shown || this.disabled == true) return -1;
    if (this.quirks['text_selection_use_range']) {
        if (this.multiline) {
            var p = this._getTextareaSelection();
        } else {
            var p = this._getTextSelection();
        }

        if (p) {
            return p.start;
        } else {
            return -1;
        }
    } else {
        return this.__LzInputDiv.selectionStart;
    }
}

LzInputTextSprite.prototype.getSelectionSize = function (){
    if (! this.__shown || this.disabled == true) return -1;
    if (this.quirks['text_selection_use_range']) {
        if (this.multiline) {
            var p = this._getTextareaSelection();
        } else {
            var p = this._getTextSelection();
        }
        if (p) {
            return p.end - p.start;
        } else {
            return -1;
        }
    } else {
        return this.__LzInputDiv.selectionEnd - this.__LzInputDiv.selectionStart;
    }
}

if (LzSprite.prototype.quirks['text_selection_use_range']) {
LzInputTextSprite.prototype._getTextSelection = function (){
    this.__LzInputDiv.focus();

    var range = document.selection.createRange();
    var bookmark = range.getBookmark();

    var originalContents = contents = this.__LzInputDiv.value;
    do {
        var marker = "~~~" + Math.random() + "~~~";
    } while (contents.indexOf(marker) != -1)

    var parent = range.parentElement();
    if (parent == null || ! (parent.type == "text" || parent.type == "textarea")) {
        return;
    }
    range.text = marker + range.text + marker;
    contents = this.__LzInputDiv.value;

    var result = {};
    result.start = contents.indexOf(marker);
    contents = contents.replace(marker, "");
    result.end = contents.indexOf(marker);

    this.__LzInputDiv.value = originalContents;
    range.moveToBookmark(bookmark);
    range.select();

    return result;
}

LzInputTextSprite.prototype._getTextareaSelection = function (){
    var textarea = this.__LzInputDiv; 
    var selection_range = document.selection.createRange().duplicate();

    if (selection_range.parentElement() == textarea) {    // Check that the selection is actually in our textarea
    // Create three ranges, one containing all the text before the selection,
    // one containing all the text in the selection (this already exists), and one containing all
    // the text after the selection.
    var before_range = document.body.createTextRange();
    before_range.moveToElementText(textarea);                    // Selects all the text
    before_range.setEndPoint("EndToStart", selection_range);     // Moves the end where we need it

    var after_range = document.body.createTextRange();
    after_range.moveToElementText(textarea);                     // Selects all the text
    after_range.setEndPoint("StartToEnd", selection_range);      // Moves the start where we need it

    var before_finished = false, selection_finished = false, after_finished = false;
    var before_text, untrimmed_before_text, selection_text, untrimmed_selection_text, after_text, untrimmed_after_text;

    // Load the text values we need to compare
    before_text = untrimmed_before_text = before_range.text;
    selection_text = untrimmed_selection_text = selection_range.text;
    after_text = untrimmed_after_text = after_range.text;

    // Check each range for trimmed newlines by shrinking the range by 1 character and seeing
    // if the text property has changed.  If it has not changed then we know that IE has trimmed
    // a \r\n from the end.
    do {
    if (!before_finished) {
        if (before_range.compareEndPoints("StartToEnd", before_range) == 0) {
            before_finished = true;
        } else {
            before_range.moveEnd("character", -1)
            if (before_range.text == before_text) {
                untrimmed_before_text += "\r\n";
            } else {
                before_finished = true;
            }
        }
    }
    if (!selection_finished) {
        if (selection_range.compareEndPoints("StartToEnd", selection_range) == 0) {
            selection_finished = true;
        } else {
            selection_range.moveEnd("character", -1)
            if (selection_range.text == selection_text) {
                untrimmed_selection_text += "\r\n";
            } else {
                selection_finished = true;
            }
        }
    }
    if (!after_finished) {
        if (after_range.compareEndPoints("StartToEnd", after_range) == 0) {
            after_finished = true;
        } else {
            after_range.moveEnd("character", -1)
            if (after_range.text == after_text) {
                untrimmed_after_text += "\r\n";
            } else {
                after_finished = true;
            }
        }
    }

    } while ((!before_finished || !selection_finished || !after_finished));

    // Untrimmed success test to make sure our results match what is actually in the textarea
    // This can be removed once you're confident it's working correctly
    var untrimmed_text = untrimmed_before_text + untrimmed_selection_text + untrimmed_after_text;
    var untrimmed_successful = false;
    if (textarea.value == untrimmed_text) {
    untrimmed_successful = true;
    }
    // ** END Untrimmed success test

    var startPoint = untrimmed_before_text.length;
    var endPoint = startPoint + untrimmed_selection_text.length;
    var selected_text = untrimmed_selection_text;

    //alert("Start Index: " + startPoint + "\nEnd Index: " + endPoint + "\nSelected Text\n'" + selected_text + "'");

    // account for leading \r\n
    var val = this.__LzInputDiv.value;
    var offset = 0;
    var startcounter = 0;
    while (offset < startPoint) {
        offset = val.indexOf('\r\n', offset + 2); 
        if (offset == -1) break;
        startcounter++;
    }
    var midcounter = 0;
    while (offset < endPoint) {
        offset = val.indexOf('\r\n', offset + 2); 
        if (offset == -1) break;
        midcounter++;
    }
    var endcounter = 0;
    while (offset < val.length) {
        offset = val.indexOf('\r\n', offset + 2); 
        if (offset == -1) break;
        endcounter++;
    }

    startPoint -= startcounter;
    endPoint -= (midcounter + startcounter);

    //Debug.write(startcounter + ', ' + midcounter + ', ' + endcounter + ', ' + startPoint + ', ' + endPoint);
    return {start: startPoint, end: endPoint};
    }
}
}

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
    this.__LzInputDiv.style.color = LzColorUtils.inttohex(c);
}

LzInputTextSprite.prototype.getText = function () {
    if (this.multiline && this.quirks.text_ie_carriagereturn) {
        return this.__LzInputDiv.value.replace(this.____crregexp, '\n');
    } else {
        return this.__LzInputDiv.value;
    }
}

LzInputTextSprite.prototype.getTextfieldHeight = function () {
    if (this._styledirty != true && this.fieldHeight != null) return this.fieldHeight
    if (this.text == '') {
        this.fieldHeight = this.getTextSize(null).height;
//       Debug.debug('getTextfieldHeight: 0');
        return this.fieldHeight;
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
            if (h > 0 && this.quirks.emulate_flash_font_metrics) {
                h += this.__hpadding;
            }
        } else {
            if (this.quirks['safari_textarea_subtract_scrollbar_height']) h += 24;
            if (h == 2) h = this.getTextSize(this.text).height;
            if (h > 0 && this.quirks.emulate_flash_font_metrics) {
                h += this.__hpadding;
            }
            this.fieldHeight = h;
        }
        //Debug.info('LzInputTextSprite.getTextfieldHeight', h, this.height, this.owner, this.__LzInputDiv);
        if (this.height) {
            this.__LzInputDiv.style.height = oldheight;
        }
    } else {
        var h = this.getTextSize(null).height;
        if (h != 0) {
            this.fieldHeight = h;
        }
    }
    // NOTE: [2006-09-30 ptw] Don't cache 0 as a value for non-empty text.  It breaks
    // multi-line text for some reason -- I suspect because we ask for
    // the height too early...
//     Debug.debug('getTextfieldHeight: %s', h);
    return h;
}

/**
 * If a mouse event occurs in an input text field, find the focused view
 */
LzInputTextSprite.findSelection = function ( ){
    if (LzInputTextSprite.__focusedSprite 
        && LzInputTextSprite.__focusedSprite.owner) {
        return LzInputTextSprite.__focusedSprite.owner;
    }
}

// prevent text selection in IE
// can't use lz.embed.attachEventHandler because we need to cancel events
document.onselectstart = LzTextSprite.prototype.__cancelhandler;
document.ondrag =  LzTextSprite.prototype.__cancelhandler;
