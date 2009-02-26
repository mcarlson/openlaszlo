/**
  * LzInputTextSprite.js
  *
  * @copyright Copyright 2007-2009 Laszlo Systems, Inc.  All Rights Reserved.
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
        this.__LZclickcontainerdiv = document.createElement('div');
        this.__LZclickcontainerdiv.className = 'lzdiv';
        this.__LZclickcontainerdiv.owner = this;
    }    
    if ($debug) {
        // annotate divs with sprite IDs
        this.__LZdiv.id = 'inputtextsprite_' + this.uid;
        this.__LZclickcontainerdiv.id = 'click_' + this.__LZdiv.id;
    }
    if (this.quirks.ie_leak_prevention) {
        this.__sprites[this.uid] = this;
    }

    this.__createInputText();
    //Debug.debug('new LzInputTextSprite', this.__LZdiv, this.owner);
}

LzInputTextSprite.prototype = new LzTextSprite(null);

// Used to compute padding values.  Should reflect CSS defaults in LzSprite.lzswfinputtext/lzswfinputtextmultiline
LzInputTextSprite.prototype.____hpadding = 2;

LzInputTextSprite.prototype.____crregexp = new RegExp('\\r\\n', 'g');

LzInputTextSprite.prototype.__createInputText = function(t) {
    if (this.__LzInputDiv) return;
    //Debug.write('Multiline', this, this.multiline, this.owner.multiline);
    var type = '';
    if (this.owner) {
        if (this.owner.password) {
            type = 'password'
        } else if (this.owner.multiline) {
            type = 'multiline'
        }
    }
    this.__createInputDiv(type);
    if (t == null) t = '';
    lz.embed.__setAttr(this.__LzInputDiv, 'value', t);

    if (this.quirks.fix_clickable) {
        if (this.quirks.fix_ie_clickable) {
            this.__LZinputclickdiv = document.createElement('img');
            this.__LZinputclickdiv.src = lz.embed.options.serverroot + LzSprite.prototype.blankimage;
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
        this.__LZclickcontainerdiv.appendChild(this.__LZinputclickdiv);
    }    
    this.__LZdiv.appendChild(this.__LzInputDiv);

    //Debug.write(this.__LzInputDiv.style);
    this.__setTextEvents(true);
}

LzInputTextSprite.prototype.__createInputDiv = function(type) {
    if (type === 'password') {
        this.__LzInputDiv = document.createElement('input');
        lz.embed.__setAttr(this.__LzInputDiv, 'type', 'password');
    } else if (type === 'multiline') {
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
            // Should reflect CSS defaults in LzSprite.js
            this.____hpadding = 2;
            this.__LzInputDiv.className = 'lzswfinputtextmultiline';
        } else {
            this.____hpadding = 0;
            this.__LzInputDiv.className = 'lzswfinputtext';
        }    
        if (this.quirks['inputtext_size_includes_margin']) {
            this.____hpadding = 0;
        }
    } else {    
        this.__LzInputDiv.className = 'lzinputtext';
    }    
    if (this.owner) {
        lz.embed.__setAttr(this.__LzInputDiv, 'name', this.owner.name);
    }
    this.scrolldiv = this.__LzInputDiv;
    this.scrolldiv.owner = this;
}

LzInputTextSprite.prototype.getTextHeight = function() {
    var h = LzTextSprite.prototype.getTextHeight.call(this);
    var b = h;
    if (this.multiline && this.quirks.emulate_flash_font_metrics) {
        h -= (this.____hpadding * 2);
    }
    //Debug.write('getTextHeight', this.lineHeight, b, h, this.owner);
    return h;
}

LzInputTextSprite.prototype.setMultiline = function(ml) {
    var oldval = this.multiline;
    this.multiline = ml == true;
    if (oldval != null && this.multiline != oldval) {
        // cache original values
        var style = this.__LzInputDiv.style;
        var scrollleft = this.__LzInputDiv.scrollLeft;
        var scrolltop = this.__LzInputDiv.scrollTop;

        // destroy old element
        this.__setTextEvents(false);
        this.__discardElement(this.__LzInputDiv);

        this.__createInputDiv(ml ? 'multiline' : '');

        // must set before appending
        lz.embed.__setAttr(this.__LzInputDiv, 'style', style);
        this.__LZdiv.appendChild(this.__LzInputDiv);
        this.__LzInputDiv.style.overflow = ml ? 'hidden' : 'visible';
        this.__LzInputDiv.scrollLeft = scrollleft;
        this.__LzInputDiv.scrollTop = scrolltop;

        // restore text events
        this.__setTextEvents(true);

        // restore text content
        this.setText(this.text, true);
    }
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
                    this._shownclipvals[n] = v.__LZclickcontainerdiv.style.clip;
                    v.__LZclickcontainerdiv.style.clip = 'rect(auto auto auto auto)';
                }
            }
        }
    }
    if (this.quirks.fix_ie_clickable) {
        this.__LZclickcontainerdiv.appendChild(this.__LzInputDiv);
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
                v.__LZclickcontainerdiv.style.clip = this._shownclipvals[n];
            }
            this._shownclipvals = null;
            this._shownclippedsprites = null;
        }
    }
    // send to __LZdiv
    if (this.quirks.fix_ie_clickable) {
        // [TODO ptw 1-18-2007] rather than twiddling the style or style sheet you could just have a rule
        // like (assuming you used multiple classes): .lzdiv + .lzclick { display: none; }
        // and make the click be displayed or not by whether it is before or after the (input) div? 
        // [max 1-18-2007] IE requires different nesting rules for inputtext.  Also, if there are _any_
        // clickable divs behind the inputtext they'll grab clicks.  This is the reason I temporarily
        // hide all clickable divs when the inputtext is selected -  and the reason the inputtext can't
        // be a child of the clickable view.

        this.__setglobalclickable(true);
        this.__LzInputDiv = this.__LZclickcontainerdiv.removeChild(this.__LzInputDiv);
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
    this.__updatefieldsize();
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
    var checkre = !!(this.restrict);
    var checkml = (this.multiline && this.owner.maxlength > 0);
    if (checkre || checkml) {
        evt = evt ? evt : window.event;

        if (this.quirks.safari_paste_event) {
            var txt = evt.clipboardData.getData("text/plain");
        } else {
            var txt = window.clipboardData.getData("TEXT");
            txt = txt.replace(this.____crregexp, '\n');
        }

        var stopPaste = false;
        var selsize = this.getSelectionSize();
        if (selsize < 0) selsize = 0;//[TODO anba 2008-01-06] remove after LPP-5330

        if (checkre) {
            // remove invalid characters
            var matched = txt.match(this.restrict);
            if (matched == null) {
                var newtxt = "";
            } else {
                var newtxt = matched.join("");
            }
            stopPaste = (newtxt != txt);
            txt = newtxt;
        }

        if (checkml) {
            var max = this.owner.maxlength + selsize;
            if (this.quirks.text_ie_carriagereturn) {
                var len = this.__LzInputDiv.value.replace(this.____crregexp, '\n').length;
            } else {
                var len = this.__LzInputDiv.value.length;
            }
            
            var maxchars = max - len;
            if (maxchars > 0) {
                if (txt.length > maxchars) {
                    txt = txt.substring(0, maxchars);
                    stopPaste = true;
                }
            } else {
                txt = "";
                stopPaste = true;
            }
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
                    selpos += txt.length;
                    this.__LzInputDiv.setSelectionRange(selpos, selpos);
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
        var checkre = !!(that.restrict);
        var checkml = (that.multiline && that.owner.maxlength > 0);
        var newval = that.__LzInputDiv.value;
        var newlen = newval.length;
        var max = that.owner.maxlength;

        if (checkre || (checkml && newlen > max)) {
            var len = val.length;
            // this text was pasted
            var newc = newval.substr(selpos, newlen - len + selsize);

            if (checkre) {
                // remove all invalid characters
                var matched = newc.match(that.restrict);
                newc = matched != null ? matched.join("") : "";
            }

            if (checkml) {
                // we can only take at max that many chars
                var maxchars = max + selsize - len;
                newc = newc.substring(0, maxchars);
            }

            //update value
            that.__LzInputDiv.value = val.substring(0, selpos) + newc + val.substring(selpos + selsize);

            //fix selection
            //note: we're in Firefox/Opera, so we can savely call "setSelectionRange"
            selpos += newc.length;
            that.__LzInputDiv.setSelectionRange(selpos, selpos);
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

    LzMouseKernel.__sendMouseMove(evt);

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
        if (sprite.restrict || (sprite.multiline && view.maxlength > 0)) {
            sprite.__updatefieldsize();
            var keycode = evt.keyCode;
            var charcode = sprite.quirks.text_event_charcode ? evt.charCode : evt.keyCode;
            // only printable characters or carriage return (modifier keys must not be active)
            var validChar = (!(evt.ctrlKey || evt.altKey) && (charcode >= 32 || keycode == 13));
            //Debug.write("charCode = %s, keyCode = %s, ctrlKey = %s, altKey = %s, shiftKey = %s", charcode, keycode, evt.ctrlKey, evt.altKey, evt.shiftKey);

            if (validChar) {
                var prevent = false;
                if (keycode != 13 && sprite.restrict) {
                    // only printable characters
                    prevent = (0 > String.fromCharCode(charcode).search(sprite.restrict));
                }
                if (! prevent) {
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
                            prevent = true;
                        }
                    }
                }
                if (prevent) {
                    evt.returnValue = false;
                    if (evt.preventDefault) {
                        evt.preventDefault();
                    }
                }
            } else {
                // IE and Safari do not send 'onkeypress' for function-keys,
                // but Firefox and Opera!
                if (sprite.quirks.keypress_function_keys) {
                    var ispaste = false;
                    if (evt.ctrlKey && !evt.altKey && !evt.shiftKey) {
                        var c = String.fromCharCode(charcode);
                        // paste by ctrl + v ('v' for Firefox and 'V' for Opera)
                        ispaste = (c == 'v' || c == 'V');
                    } else if (evt.shiftKey && !evt.altKey && !evt.ctrlKey) {
                        // paste by shift + insert (Windows)
                        ispaste = (keycode == 45);
                    }
                    if (ispaste) {
                        //[TODO anba 2008-01-06] how to detect paste per context-menu?
                        //[TODO anba 2008-10-06] (LPP-5406) Firefox3 added context-menu events
                        if (sprite.restrict) {
                            // always call paste-handler if restrict was set
                            sprite.__pasteHandler();
                        } else {
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
    // Runtime does not understand Infinity (Actually Safari and Opera
    // do, but Mozilla does not, probably neither does IE).  The
    // clever ~>>> expression computes MOST_POSITIVE_FIXNUM.
    if (val == Infinity) { val = ~0>>>1; }
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
    var nw = this.__setWidth(w);
    if (this.quirks.fix_clickable && nw != null) {
        this.__LZclickcontainerdiv.style.width = nw;
        this.__LZinputclickdiv.style.width = nw;
    }   
    this.__updatefieldsize();
}

LzInputTextSprite.prototype.setHeight = function (h) {
    if (h == null || h < 0 || isNaN(h) || this.height == h) return;
    // call LzSprite.setHeight();
    var nh = this.__setHeight(h);
    if (this.quirks.fix_clickable && nh != null) {
        this.__LZclickcontainerdiv.style.height = nh;
        this.__LZinputclickdiv.style.height = nh;
        if (this.multiline && this.quirks.set_height_for_multiline_inputtext) {
            h = this.CSSDimension(h - (this.____hpadding * 2));
            if (h != this._multilineheight) {
                this._multilineheight = h;
                this.__LzInputDiv.style.height = h
            }
        }
    }   
    this.__updatefieldsize();
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
    if (this.text == '') {
        return this.getTextSize(null).height;
//       Debug.debug('getTextfieldHeight: 0');
    }

    if (this.multiline) {
        var oldheight = false;
        // force style recompute
        if (this.resize && ! this.quirks['inputtext_strips_newlines']) this._styledirty = true;
        if (this.height) {
            oldheight = this.__LzInputDiv.style.height;
            this.__LzInputDiv.style.height = 'auto';
        }
        var h = this.__LzInputDiv.scrollHeight;
        if (h == 0 || h == null) {
            h = this.getTextSize(this.text, false).height;
            if (h > 0 && this.quirks.emulate_flash_font_metrics) {
                h += this.__hpadding;
            }
        } else {
            if (h > 0 && this.quirks.emulate_flash_font_metrics) {
                h += this.__hpadding;
            }
        }
        if (this.quirks['safari_textarea_subtract_scrollbar_height']) h += 24;
        //Debug.info('LzInputTextSprite.getTextfieldHeight', h, this.height, this.owner, this.__LzInputDiv);
        if (this.height) {
            this.__LzInputDiv.style.height = oldheight;
        }
    } else {
        var h = this.getTextSize(null).height;
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
