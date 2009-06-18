/* -*- mode: JavaScript; c-basic-offset: 4; -*- */


/**
  * LzSprite.js
  *
  * @copyright Copyright 2007-2009 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic DHTML
  * @author Max Carlson &lt;max@openlaszlo.org&gt;
  */

var LzSprite = function(owner, isroot) {
    if (owner == null) return;
    this.constructor = arguments.callee;
    this.owner = owner;
    this.uid = LzSprite.prototype.uid++;
    this.aadescriptionDiv = null;

    if (isroot) {
        this.isroot = true;
        this.__initdone = false;
        LzSprite.__rootSprite = this;
        var div = document.createElement('div');
        div.className = 'lzcanvasdiv';

        if (this.quirks.ie6_improve_memory_performance) {
            try { document.execCommand("BackgroundImageCache", false, true); } catch(err) {}
        }

        // grab values stored by lz.embed.dhtml()
        var p = lz.embed.__propcache;
        var root = p.appenddiv;

        if (p.bgcolor) {
            div.style.backgroundColor = p.bgcolor; 
            this.bgcolor = p.bgcolor; 
        }
        var width = p.width;
        if (width) {
            root.style.width = width; 
            div.style.width = width; 
            var widthispercentage = width.indexOf('%') != -1;
            if (widthispercentage) {
                this._w = this.width = width;
            }
            else {
                this.width = parseInt(width);
                this._w = this.CSSDimension(this.width);
            }
        }
        var height = p.height;
        if (height) {
            root.style.height = height; 
            div.style.height = height; 
            var heightispercentage = height.indexOf('%') != -1;
            if (heightispercentage) {
                this._h = this.height = height;
            }
            else {
                this.height = parseInt(height);
                this._h = this.CSSDimension(this.height);
            }
        }
        if (p.id) {
            this._id = p.id;
        }
        if (p.url) {
            //also see LzBrowserKernel.getLoadURL()
            this._url = p.url;
        }
        if (p.cancelkeyboardcontrol) {
            lz.embed.options.cancelkeyboardcontrol = p.cancelkeyboardcontrol;
        }
        // Needed by debugger which has an embedded LFC.
        if (p.serverroot) {
            lz.embed.options.serverroot = p.serverroot;
        }

        lz.embed.options.approot = (typeof(p.approot) == "string") ? p.approot : '';

        if (! this.quirks.canvas_div_cannot_be_clipped && width && ! widthispercentage && height && ! heightispercentage) {
            div.style.clip = 'rect(0px ' + this._w + ' ' + this._h + ' 0px)';
            div.style.overflow = 'hidden';
        }
        root.appendChild(div);
        this.__LZdiv = div;

        if (this.quirks.fix_clickable) {
            var cdiv = document.createElement('div');
            cdiv.className = 'lzcanvasclickdiv';
            cdiv.id = 'lzcanvasclickdiv';
            root.appendChild(cdiv);
            this.__LZclickcontainerdiv = cdiv;
        }

        if (this.quirks.activate_on_mouseover) {
            // Mouse detection for activation/deactivation of keyboard/mouse events
            div.mouseisover = false;
            div.onmouseover = function(e) {
                if (LzSprite.prototype.quirks.focus_on_mouseover) {
                    if (LzSprite.prototype.getSelectedText() != "") {
                        div.focus();
                    }
                }
                if (LzInputTextSprite.prototype.__focusedSprite == null) LzKeyboardKernel.setKeyboardControl(true);
                LzMouseKernel.setMouseControl(true);
                this.mouseisover = true;
                //console.log('onmouseover', e, this.mouseisover);
            }
            div.onmouseout = function(e) {
                if (! e) {
                    e = window.event;
                    var el = e.toElement;
                } else {
                    var el = e.relatedTarget;
                }
                var quirks = LzSprite.prototype.quirks;
                if (quirks.inputtext_anonymous_div) {
                    try {
                        // Only try to access parentNode to workaround a Firefox bug,
                        // where relatedTarget may point to an anonymous div of an
                        // input-element (in which case accessing parentNode throws
                        // a security exception). (LPP-7796)
                        el && el.parentNode;
                    } catch (e) {
                        return;
                    }
                }
                var mousein = false;
                if (el) {
                    var cm = LzContextMenuKernel.lzcontextmenu;
                    if (el.owner && el.className.indexOf('lz') == 0) {
                        // lzdiv, lzclickdiv, etc.
                        mousein = true;
                    } else if (cm && (el === cm || el.parentNode === cm)) {
                        // context-menu resp. context-menu item
                        mousein = true;
                    }
                }
                if (mousein) {
                    if (quirks.fix_ie_clickable) {
                        LzInputTextSprite.prototype.__setglobalclickable(true);
                    }
                    if (quirks.focus_on_mouseover) {
                        if (LzInputTextSprite.prototype.__lastshown == null) {
                            if (LzSprite.prototype.getSelectedText() == "") {
                                div.focus();
                            }
                        }
                    }
                    LzKeyboardKernel.setKeyboardControl(true);
                    LzMouseKernel.setMouseControl(true);
                    LzMouseKernel.__resetMouse();
                    this.mouseisover = true;
                } else {
                    if (quirks.focus_on_mouseover) {
                        if (LzInputTextSprite.prototype.__lastshown == null) {
                            if (LzSprite.prototype.getSelectedText() == "") {
                                div.blur();
                            }
                        }
                    }
                    LzKeyboardKernel.setKeyboardControl(false);
                    LzMouseKernel.setMouseControl(false);
                    this.mouseisover = false;
                }
                //Debug.write('onmouseout', this.mouseisover, el.className, e);
            }
        }

    } else {
        this.__LZdiv = document.createElement('div');
        this.__LZdiv.className = 'lzdiv';
        if (this.quirks.fix_clickable) {
            this.__LZclickcontainerdiv = document.createElement('div');
            this.__LZclickcontainerdiv.className = 'lzdiv';
        }
    }

    if ($debug) {
        // annotate divs with sprite IDs, but don't override existing IDs!
        if (!this.__LZdiv.id) this.__LZdiv.id = 'sprite_' + this.uid;
        if (!this.__LZclickcontainerdiv.id) this.__LZclickcontainerdiv.id = 'click_' + this.__LZdiv.id;
    }
    this.__LZdiv.owner = this;
    if (this.quirks.fix_clickable) {
        this.__LZclickcontainerdiv.owner = this;
    }

    if (this.quirks.ie_leak_prevention) {
        this.__sprites[this.uid] = this;
    }
    //Debug.debug('new LzSprite', this.__LZdiv, this.owner);
}

    if ($debug) {
        /** @access private */
        LzSprite.prototype._dbg_typename = 'LzSprite';
        /** @access private */
        LzSprite.prototype._dbg_name = function () {
            // Tip 'o the pin to
            // http://www.quirksmode.org/js/findpos.html
            var d = div = this.__LZdiv;
            var x = y = 0;
            if (d.offsetParent) {
                do {
                    x += d.offsetLeft;
                    y += d.offsetTop;
                } while (d = d.offsetParent);
            }
            return Debug.formatToString("%w/@sprite [%s x %s]*[1 0 %s, 0 1 %s, 0 0 1]",
                                        this.owner.sprite === this ? this.owner : '(orphan)',
                                        div.offsetWidth || 0, div.offsetHeight || 0,
                                        x || 0,
                                        y || 0);
        };
    }


/**
  * @access private
  */
LzSprite.prototype.__defaultStyles = {
    lzdiv: {
        position: 'absolute'
        ,backgroundRepeat: 'no-repeat'
    },
    lzclickdiv: {
        position: 'absolute'
    },
    lzinputclickdiv: {
        position: 'absolute'
    },
    lzcanvasdiv: {
        position: 'absolute'
    },
    lzcanvasclickdiv: {
        zIndex: 100000,
        position: 'absolute'
    },
    // This container implements the swf 'gutter'
    lztextcontainer: {
        position: 'absolute',
        overflow: 'hidden',
        // To create swf textfield 'gutter'
        paddingTop: '2px',
        paddingRight: '2px',
        paddingBottom: '2px',
        paddingLeft: '2px'
    },
    // TODO [hqm 2009-04] This is a duplicate of lztextcontainer
    // above, but without overflow='hidden', as a fix for
    // LPP-8007. Question, why did we need overflow='hidden' in
    // lztextcontainer in the first place?  would it be safe to just
    // remove it there, and not have to have this parallel
    // lztextcontainer style?
    lztextcontainer_click: {
        position: 'absolute',
        // To create swf textfield 'gutter'
        paddingTop: '2px',
        paddingRight: '2px',
        paddingBottom: '2px',
        paddingLeft: '2px'
    },
    lzinputtextcontainer: {
        position: 'absolute',
        overflow: 'hidden',
        // To create swf textfield 'gutter' and position input element correctly
        paddingTop: '0px',
        paddingRight: '3px',
        paddingBottom: '4px',
        paddingLeft: '1px'
    },
    // TODO [hqm 2009-04] This is a duplicate of lzinputtextcontainer (see above)
    lzinputtextcontainer_click: {
        position: 'absolute',
        paddingTop: '0px',
        paddingRight: '3px',
        paddingBottom: '4px',
        paddingLeft: '1px'
    },
    lzinputtextmultilinecontainer: {
        position: 'absolute',
        overflow: 'hidden',
        // To create swf textfield 'gutter' and position input element correctly
        paddingTop: '1px',
        paddingRight: '3px',
        paddingBottom: '3px',
        paddingLeft: '1px'
    },
    // TODO [hqm 2009-04] This is a duplicate of lzinputtextmultilinecontainer (see above)
    lzinputtextmultilinecontainer_click: {
        position: 'absolute',
        paddingTop: '1px',
        paddingRight: '3px',
        paddingBottom: '3px',
        paddingLeft: '1px'
    },
    lztext: {
        fontFamily: 'Verdana,Vera,sans-serif',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '11px',
        whiteSpace: 'normal',
        position: 'absolute',
        // When scrollevents are on, this will be overridden
        overflow: 'hidden',
        textAlign: 'left',
        textIndent: '0px',
        letterSpacing: '0px',
        textDecoration: 'none'
    },
    lzswftext: {
        fontFamily: 'Verdana,Vera,sans-serif',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '11px',
        whiteSpace: 'normal',
        position: 'absolute',
        // When scrollevents are on, this will be overridden
        overflow: 'hidden',
        // To match swf font metrics
        lineHeight: '1.2em',
        textAlign: 'left',
        textIndent: '0px',
        // To match swf font metrics
        letterSpacing: '0.025em',
        textDecoration: 'none'
    },
    lzinputtext: {
        fontFamily: 'Verdana,Vera,sans-serif',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '11px',
        width: '100%',
        height: '100%',
        borderWidth: 0,
        backgroundColor: 'transparent',
        position: 'absolute',
        // There is no scrolling of input elements
        textAlign: 'left',
        textIndent: '0px',
        letterSpacing: '0px',
        textDecoration: 'none'
    },
    lzswfinputtext: {
        fontFamily: 'Verdana,Vera,sans-serif',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '11px',
        width: '100%',
        height: '100%',
        borderWidth: 0,
        backgroundColor: 'transparent',
        position: 'absolute',
        // There is no scrolling of input elements
        // To match swf font metrics
        lineHeight: '1.2em',
        textAlign: 'left',
        textIndent: '0px',
        // To match swf font metrics
        letterSpacing: '0.025em',
        textDecoration: 'none'
    },
    lzswfinputtextmultiline: {
        fontFamily: 'Verdana,Vera,sans-serif',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '11px',
        width: '100%',
        height: '100%',
        borderWidth: 0,
        backgroundColor: 'transparent',
        position: 'absolute',
        // When scrollevents are on, this will be overridden
        overflow: 'hidden',
        // To match swf font metrics
        lineHeight: '1.2em',
        textAlign: 'left',
        textIndent: '0px',
        // To match swf font metrics
        letterSpacing: '0.025em',
        textDecoration: 'none'
    },
    lztextlink: {
        cursor: 'pointer'
    },
    lzaccessibilitydiv: {
       display: 'none'
    },
    writeCSS: function() {
        var rules = [];
        var css = '';
        for (var classname in this) {
            if (classname == 'writeCSS' || 
                classname == 'hyphenate' || 
                classname == '__re') continue;
            css += classname.indexOf('#') == -1 ? '.' : '';
            css += classname + '{';
            for (var n in this[classname]) {
                var v = this[classname][n];
                css += this.hyphenate(n) + ':' + v + ';';
            }
            css += '}';
        }
        document.write('<style type="text/css">' + css + '</style>');
    },
    __re: new RegExp("[A-Z]"),
    hyphenate: function(n) {
        var i = n.search(this.__re);
        if (i != -1) {
            var c = n.substring(i, i + 1);
            n = n.substring(0, i) + '-' + c.toLowerCase() + n.substring(i + 1, n.length);
        }
        return n;
    }
}
LzSprite.prototype.__defaultStyles['#lzcontextmenu div.separator'] = {
    "border-top": '1px solid #808080',
    "border-left": 'none',
    "border-right": 'none',
    "border-bottom": '1px solid #d4d0c8',
    "margin": '7px 0px'
};

LzSprite.prototype.__defaultStyles['#lzcontextmenu a'] = {
   color: '#000',
   display: 'block',
   textDecoration: 'none',
   cursor: 'default'
};
LzSprite.prototype.__defaultStyles['#lzcontextmenu a:hover'] = {
   color: '#FFF',
   backgroundColor: '#333'
};
LzSprite.prototype.__defaultStyles['#lzcontextmenu a.disabled'] = {
   color: '#999 !important'
};

LzSprite.prototype.__defaultStyles['#lzcontextmenu'] = {
    position: 'absolute',
    zIndex: 10000000,
    backgroundColor: '#CCC',
    border: '1px outset #999',
    padding: '4px',
    fontFamily: 'Verdana,Vera,sans-serif',
    fontSize: '13px',
    'float': 'left',
    margin: '2px',
    minWidth: '100px'
};

LzSprite.prototype.uid = 0;

LzSprite.prototype.quirks = {
    // Creates a separate tree of divs for handling mouse events.
    fix_clickable: true
    ,fix_ie_background_height: false
    ,fix_ie_clickable: false
    ,ie_alpha_image_loader: false
    ,ie_leak_prevention: false
    ,ie_prevent_selection: false
    ,ie_elementfrompoint: false
    ,invisible_parent_image_sizing_fix: false
    ,emulate_flash_font_metrics: true
    // change \n to <br/>
    ,inner_html_strips_newlines: true
    ,inner_html_no_entity_apos: false
    ,css_hide_canvas_during_init: true
    ,firefox_autocomplete_bug: false
    ,hand_pointer_for_clickable: true
    ,alt_key_sends_control: false
    ,safari_textarea_subtract_scrollbar_height: false
    ,safari_avoid_clip_position_input_text: false
    ,no_cursor_colresize: false
    ,safari_visibility_instead_of_display: false
    ,preload_images_only_once: false
    ,absolute_position_accounts_for_offset: false
    ,canvas_div_cannot_be_clipped: false
    ,inputtext_parents_cannot_contain_clip: false
    ,set_height_for_multiline_inputtext: false
    ,ie_opacity: false
    ,text_measurement_use_insertadjacenthtml: false
    ,text_content_use_inner_text: false
    ,text_selection_use_range: false
    ,document_size_use_offsetheight: false
    ,text_ie_carriagereturn: false
    ,ie_paste_event: false
    ,safari_paste_event: false
    ,text_event_charcode: true
    ,keypress_function_keys: true
    ,ie_timer_closure: false
    ,keyboardlistentotop: false
    ,document_size_compute_correct_height: false
    ,ie_mouse_events: false
    ,fix_inputtext_with_parent_resource: false
    ,activate_on_mouseover: true
    ,ie6_improve_memory_performance: false
    ,text_height_includes_padding: false
    ,inputtext_size_includes_margin: false
    ,listen_for_mouseover_out: true
    ,focus_on_mouseover: true
    ,textstyle_on_textdiv: false
    ,textdeco_on_textdiv: false
    ,use_css_sprites: true
    ,preload_images: true
    ,scrollbar_width: 15
    ,inputtext_strips_newlines: false
    ,swf8_contextmenu: true
    ,dom_breaks_focus: false
    ,inputtext_anonymous_div: false
    ,clipped_scrollbar_causes_display_turd: false
    ,detectstuckkeys: false
    ,textgrabsinputtextfocus: false
    ,input_highlight_bug: false

}

LzSprite.prototype.capabilities = {
    rotation: false
    // Scale canvas to percentage values
    ,scalecanvastopercentage: false
    ,readcanvassizefromsprite: true
    ,opacity: true
    ,colortransform: false
    ,audio: false
    ,accessibility: true
    ,htmlinputtext: false
    ,advancedfonts: false
    ,bitmapcaching: false
    ,persistence: false
    ,clickmasking: false
    ,minimize_opacity_changes: false
    ,history: true
    ,runtimemenus: false
    ,setclipboard: false
    ,proxypolicy: false
    ,linescrolling: false
    ,disableglobalfocustrap: true
}

LzSprite.prototype.__updateQuirks = function () {
    if (window['lz'] && lz.embed && lz.embed.browser) {
        var quirks = this.quirks;
        var browser = lz.embed.browser;

        // Divs intercept clicks if physically placed on top of an element
        // that's not a parent. See LPP-2680.
        // off for now
        //quirks['fix_clickable'] = true;
        if (browser.isIE) {
            if (browser.version < 7) {
                // Provide IE PNG/opacity support
                quirks['ie_alpha_image_loader'] = true;
                // IE 6 reports incorrect clientHeight for embedded iframes with scrollbars
                quirks['document_size_compute_correct_height'] = true;
                // prevent duplicate image loads - see http://support.microsoft.com/?scid=kb;en-us;823727&spid=2073&sid=global and http://misterpixel.blogspot.com/2006/09/forensic-analysis-of-ie6.html
                quirks['ie6_improve_memory_performance'] = true;
            } else {
                quirks['ie_prevent_selection'] = true;
                quirks['invisible_parent_image_sizing_fix'] = true;
                if (browser.osversion >= 6) {
                    // IE7 on Vista (osversion=6) needs the alpha image loader
                    // (Fixes LPP-3352 and others)
                    // Does Windows7 behave like Vista?
                    quirks['ie_alpha_image_loader'] = true;
                }

            }

            quirks['ie_opacity'] = true;

            // IE needs closure around setTimeout, setInterval in LzTimeKernel
            quirks['ie_timer_closure'] = true;

            // IE DOM leak prevention
            quirks['ie_leak_prevention'] = true;

            // Use images to force click tree to work in IE
            quirks['fix_ie_clickable'] = true;

            // workaround for IE refusing to respect divs with small heights when
            // no image is attached
            quirks['fix_ie_background_height'] = true;

            // workaround for IE not supporting &apos; in innerHTML
            quirks['inner_html_no_entity_apos'] = true;

            // workaround for IE not supporting clip in divs containing inputtext
            quirks['inputtext_parents_cannot_contain_clip'] = true;

            // flag for components (basefocusview for now) to minimize opacity changes
            this.capabilities['minimize_opacity_changes'] = true;

            // multiline inputtext height must be set directly - height: 100% does not work.  See LPP-4119
            quirks['set_height_for_multiline_inputtext'] = true;

            // text size measurement uses insertAdjacentHTML()
            quirks['text_measurement_use_insertadjacenthtml'] = true;
            quirks['text_content_use_inner_text'] = true;
            quirks['text_selection_use_range'] = true;
            
            // IE uses "\r\n" for newlines, which gives different text-lengths compared to SWF and
            // to other browsers
            quirks['text_ie_carriagereturn'] = true;
            // IE has got a special event for pasting
            quirks['ie_paste_event'] = true;
            // IE does not send onkeypress for function keys
            quirks['keypress_function_keys'] = false;
            // IE does not use charCode for onkeypress
            quirks['text_event_charcode'] = false;
            // IE requires special handling of mouse events see LPP-6027, LPP-6141
            quirks['ie_mouse_events'] = true; 
            // workaround for IE not supporting clickable resources in views containing inputtext - see LPP-5435
            quirks['fix_inputtext_with_parent_resource'] = true;
            // IE already includes margins for inputtexts
            quirks['inputtext_size_includes_margin'] = true;
            // LPP-7229 - IE 'helpfully' scrolls focused/blurred divs into view
            quirks['focus_on_mouseover'] = false;
            // required for text-align / text-indent to work
            quirks['textstyle_on_textdiv'] = true;
            // IE scrollbar is 16px
            quirks['scrollbar_width'] = 16;
            // CSS sprites conflict with ie_alpha_image_loader...
            quirks['use_css_sprites'] = ! quirks['ie_alpha_image_loader'];
            // IE needs help focusing when an lztext is in the same area - LPP-8219
            quirks['textgrabsinputtextfocus'] = true;
            // IE document.elementFromPoint() returns scrollbar div
            quirks['ie_elementfrompoint'] = true;
        } else if (browser.isSafari) {
            // Remap alt/option key also sends control since control-click shows context menu (see LPP-2584 - Lzpix: problem with multi-selecting images in Safari 2.0.4, dhtml)
            quirks['alt_key_sends_control'] = true;

            // Safari doesn't like clipped or placed input text fields.
            if (browser.version < 525.71) {
                // seems good in Safari 3.2.1
                quirks['safari_avoid_clip_position_input_text'] = true;
            }
            // Safari won't show canvas tags whose parent is display: none
            quirks['safari_visibility_instead_of_display'] = true;
            quirks['absolute_position_accounts_for_offset'] = true;
            if (browser.version < 525.18) {
                //Seems to work fine in Safari 3.1.1 
                quirks['canvas_div_cannot_be_clipped'] = true;
                // Fix bug in where if any parent of an image is hidden the size is 0
                quirks['invisible_parent_image_sizing_fix'] = true;
                // Safari scrollHeight needs to subtract scrollbar height
                quirks['safari_textarea_subtract_scrollbar_height'] = true;
            }
            quirks['document_size_use_offsetheight'] = true;
            if (browser.version > 523.10) {
                this.capabilities['rotation'] = true;
            }


            // Safari has got a special event for pasting
            quirks['safari_paste_event'] = true;
            // Safari does not send onkeypress for function keys
            quirks['keypress_function_keys'] = false;
            // Safari 3.x does not send global key events to apps embedded in an iframe
            quirks['keyboardlistentotop'] = true;

            // turn off mouseover activation for iphone
            if (browser.isIphone) {
                //quirks['activate_on_mouseover'] = false;
                //quirks['listen_for_mouseover_out'] = false;
                quirks['canvas_div_cannot_be_clipped'] = true;
            }
            
            // required as of 3.2.1 to get test/lztest/lztest-textheight.lzx to show multiline inputtext properly
            quirks['inputtext_strips_newlines'] = true;
        } else if (browser.isOpera) {
            // Fix bug in where if any parent of an image is hidden the size is 0
            quirks['invisible_parent_image_sizing_fix'] = true;
            quirks['no_cursor_colresize'] = true;
            quirks['absolute_position_accounts_for_offset'] = true;
            quirks['canvas_div_cannot_be_clipped'] = true;
            quirks['document_size_use_offsetheight'] = true;
            // Opera does not use charCode for onkeypress
            quirks['text_event_charcode'] = false;
            quirks['textdeco_on_textdiv'] = true;
            // Opera uses "\r\n" for newlines, which gives different text-lengths
            // compared to SWF and to other browsers
            quirks['text_ie_carriagereturn'] = true;
        } else if (browser.isFirefox) {
            // DOM operations on blurring element break focus (LPP-7786)
            // https://bugzilla.mozilla.org/show_bug.cgi?id=481468
            quirks['dom_breaks_focus'] = true;
            // anonymous div bug on input-elements (LPP-7796)
            // see https://bugzilla.mozilla.org/show_bug.cgi?id=208427
            quirks['inputtext_anonymous_div'] = true;
            //  Display artifacts in DHTML/Windows/FF when dragging
            // scrollable text (LPP-8000)
            // see https://bugzilla.mozilla.org/show_bug.cgi?id421866
            // - unvisible fixed elements with overflow:auto or
            // overflow:scroll flicker when scrolling
            if (browser.OS == 'Windows') {
                quirks['clipped_scrollbar_causes_display_turd'] = true;
                // LPP-8121 inputtext selection highlight color depends on underlying div bgcolor
                quirks['input_highlight_bug'] = true;
            }
            if (browser.version < 2) {
                // see http://groups.google.ca/group/netscape.public.mozilla.dom/browse_thread/thread/821271ca11a1bdbf/46c87b49c026246f?lnk=st&q=+focus+nsIAutoCompletePopup+selectedIndex&rnum=1
                quirks['firefox_autocomplete_bug'] = true;
            } else if (browser.version < 3) {
                // Firefox 2.0.14 doesn't work with the correct line height of 120%
                LzSprite.prototype.__defaultStyles.lzswftext.lineHeight = '119%';
                LzSprite.prototype.__defaultStyles.lzswfinputtext.lineHeight = '119%';
                LzSprite.prototype.__defaultStyles.lzswfinputtextmultiline.lineHeight = '119%';
            } else if (browser.version < 4) {
                // Firefox 3.0 does not need padding added onto field height measurements
                if (browser.subversion < 6) {
                    // no longer needed as of 3.0.6 (or maybe earlier...)
                    quirks['text_height_includes_padding'] = true;
                }
            }
        }

        if (browser.OS == 'Mac') {
            // see LPP-8210
            quirks['detectstuckkeys'] = true;
        }

        // Adjust styles for quirks
        var defaultStyles = LzSprite.prototype.__defaultStyles;
        var tc = defaultStyles.lztextcontainer;
        var itc = defaultStyles.lzinputtextcontainer;
        var itmc = defaultStyles.lzinputtextmultilinecontainer;
        if (quirks['safari_avoid_clip_position_input_text']) {
            // TODO: [2009-02-25 ptw] This is what was here, but
            // perhaps is unneeded in the new scheme where the
            // container has the padding, not the input text itself.
// Commenting out for now
//             itc.paddingTop = itc.PaddingRight = itc.paddingBottom = itc.paddingLeft = '-1px';
//             itmc.paddingTop = itmc.paddingBottom = '2px';
//             itmc.paddingRight = itmc.paddingLeft = '0px';
        }
        if (this.quirks['text_height_includes_padding']) {
            // TODO: [2009-02-14 ptw] This is what was there, but it
            // makes no sense to me.  It this quirk is about text
            // height, why is it only fiddling with input text?
            // TODO: [2009-02-16 ptw] Is this really right anyways?  I
            // think this was to compensate for the fact that when you
            // measured the div, it included the padding; but now that
            // we are putting the padding in the enclosing div, that
            // should not be a problem, right?
// Commenting out for now
//             itc.paddingTop = itc.paddingBottom = '0px';
//             itmc.paddingTop = itmc.paddingBottom = '0px';
        }

        if (quirks['css_hide_canvas_during_init']) {
            if (quirks['safari_visibility_instead_of_display']) {
                defaultStyles.lzcanvasdiv.visibility = 'hidden';
            } else {
                defaultStyles.lzcanvasdiv.display = 'none';
            }
            defaultStyles.lzcanvasclickdiv.display = 'none';
        }

        if (quirks['hand_pointer_for_clickable']) {
            defaultStyles.lzclickdiv.cursor = 'pointer';
        }

        if (quirks['inner_html_strips_newlines'] == true) {
            LzSprite.prototype.inner_html_strips_newlines_re = RegExp('$', 'mg');
        }

        LzSprite.prototype.br_to_newline_re = RegExp('<br/>', 'mg');
    }
};

LzSprite.prototype.__updateQuirks();
LzSprite.prototype.__defaultStyles.writeCSS();

/**
  * @access private
  */
LzSprite.prototype.__LZdiv = null;
/**
  * @access private
  */
LzSprite.prototype.__LZimg = null;
/**
  * @access private
  */
LzSprite.prototype.__LZclick = null;
LzSprite.prototype.x = null;
LzSprite.prototype.y = null;
LzSprite.prototype.opacity = null;
LzSprite.prototype.width = null;
LzSprite.prototype.height = null;
LzSprite.prototype.playing = false;
LzSprite.prototype.clickable = false;
LzSprite.prototype.frame = 1;
LzSprite.prototype.frames = null;
LzSprite.prototype.blankimage = 'lps/includes/blank.gif';
LzSprite.prototype.resource = null;
LzSprite.prototype.source = null;
LzSprite.prototype.visible = null;
LzSprite.prototype.text = null;
LzSprite.prototype.clip = null;
LzSprite.prototype.stretches = null;
LzSprite.prototype.resourceWidth = null;
LzSprite.prototype.resourceHeight = null;
LzSprite.prototype.cursor = null;

/** Must be called when the sprite should show itself, usually after the 
  * owner is done initializing 
  */
LzSprite.prototype.init = function(v) {
    //Debug.write('init', this.visible, this.owner.getUID());
    this.setVisible(v);
    if (this.isroot) {
        if (this.quirks['safari_visibility_instead_of_display']) {
            this.__LZdiv.style.visibility = 'visible';
        }
        // Register the canvas for callbacks
        if (this._id) {
            lz.embed[this._id]._ready(this.owner);
        }
        this.__initdone = true;
    }
}

/**
  * @access private
  */
LzSprite.prototype.__topZ = 1;
/**
  * @access private
  */
LzSprite.prototype.__parent = null;
/**
  * @access private
  */
LzSprite.prototype.__children = null;

LzSprite.prototype.addChildSprite = function(sprite) {
    if (sprite.__parent != null) return;
    //Debug.info('appendChild', sprite.__LZdiv);
    if ($debug) {
        if (this.stretches != null && this.__warnstretches != true) {
            Debug.warn("Due to limitations in the DHTML runtime, stretches will only apply to resources in this view, and doesn't affect child views.");
            this.__warnstretches = true;
        }
        if (this.color != null && this.__warncolorcascade != true) {
            Debug.warn("Due to limitations in the DHTML runtime, color will only apply to resources in this view, and doesn't affect child views.");
            this.__warncolorcascade = true;
        }
    }

    sprite.__parent = this;
    if (this.__children) {
        this.__children.push(sprite);
    } else {
        this.__children = [sprite];
    }

    this.__LZdiv.appendChild( sprite.__LZdiv );
    if (this.quirks.fix_clickable) {
        this.__LZclickcontainerdiv.appendChild( sprite.__LZclickcontainerdiv );
    }

    sprite.__setZ(++this.__topZ);
}

LzSprite.prototype.setResource = function ( r ){
    if (this.resource == r) return;
    this.resource = r;
    if ( r.indexOf('http:') == 0 || r.indexOf('https:') == 0){
        this.skiponload = false;
        this.setSource( r );
        return;
    }

    var res = LzResourceLibrary[r];
    if (res) {
        this.resourceWidth = res.width;
        this.resourceHeight = res.height;
        if (this.quirks.use_css_sprites && res.sprite) {
            var baseurl = this.getBaseUrl(res);
            this.__csssprite = baseurl + res.sprite;
        } else {
            this.__csssprite = null;
            if (this.__bgimage) this.__setBGImage(null);
        }
    }

    var urls = this.getResourceUrls(r);
    this.owner.resourceevent('totalframes', urls.length);
    this.frames = urls;

    if (this.quirks.preload_images && ! (this.stretches == null && this.__csssprite)) {
        this.__preloadFrames();
    }

    this.skiponload = true;
    this.setSource(urls[0], true);
    // multiframe resources should play until told otherwise
    //if (urls.length > 1) this.play();
}

// @devnote also used in lz.drawview.getImage()
LzSprite.prototype.getResourceUrls = function (resourcename) {
    var urls = [];
    // look up resource name in LzResourceLibrary
    // LzResourceLibrary is in the format:
    // LzResourceLibrary.lzscrollbar_xthumbleft_rsc={ptype:"ar"||"sr",frames:["lps/components/lz/resources/scrollbar/scrollthumb_x_lft.png"],width:1,height:12,sprite:"lps/components/lz/resources/scrollbar/scrollthumb_x_lft.sprite.png"}
    var res = LzResourceLibrary[resourcename];
    if (! res) {
        if ($debug) {
            Debug.warn('Could not find resource named %#s', resourcename);
        }
        return urls;
    }

    var baseurl = this.getBaseUrl(res);
    for (var i = 0; i < res.frames.length; i++) {
        urls[i] = baseurl + res.frames[i];
    }
    return urls;
}

LzSprite.prototype.getBaseUrl = function (resource) {
    if (resource.ptype == 'sr') {
        return lz.embed.options.serverroot;
    } else {
        return lz.embed.options.approot;
    }
}

LzSprite.prototype.CSSDimension = function (value, units) {
    // Coerce +/- infinity, NaN.  For compatibility with swf runtimes,
    // NaN is treated as 0.  For compatibility with DHTML runtimes,
    // Infinity is treated as the largest possible integer value (as
    // implied by the bit operators).
    var result = value;
    if (isNaN(value)) {
        result = 0;
    } else if (value === Infinity) {
        result = (~0>>>1);
    } else if (value === -Infinity) {
        result = ~(~0>>>1);
    }
    if ($debug) {
        if (value !== result) {
            Debug.warn("%w: coerced %w to %w", arguments.callee, value, result);
        }
    }

    return Math.round(result) + (units ? units : 'px');
}

LzSprite.prototype.loading = false;
LzSprite.prototype.setSource = function (url, usecache){
    if (url == null || url == 'null') {
        this.unload();
        return;
    }
    if (usecache != true){
        // called by a user
        this.skiponload = false;
        this.resource = url;
        if (this.playing) this.stop();
        this.__updateLoadStatus(0);
        this.__csssprite = null;
        if (this.__bgimage) this.__setBGImage(null);
    }
    if (usecache == 'memorycache') {
        // use the memory cache - explictly turned on by the user
        usecache = true;
    }

    //cancel current load
    if (this.loading) {
        if (this.__ImgPool && this.source) {
            this.__ImgPool.flush(this.source);
        }
        this.__destroyImage(null, this.__LZimg);
        this.__LZimg = null;
    }

    //Debug.info('setSource ' + url)
    this.source = url;

    
    if (this.stretches == null && this.__csssprite) {
        if (! this.__LZimg) {
            var im = document.createElement('img');
            im.className = 'lzdiv';
            im.owner = this;
            im.src = lz.embed.options.serverroot + LzSprite.prototype.blankimage;
            this.__bindImage(im);
        }
        this.__updateStretches();
        var imgurl = this.__csssprite ? this.__csssprite : url;
        this.__setBGImage(imgurl);
        //Debug.info('setSource ' + this.__LZdiv.style.backgroundImage, url);
        this.owner.resourceload({width: this.resourceWidth, height: this.resourceHeight, resource: this.resource, skiponload: this.skiponload});
        return;
    }

    if (! this.quirks.preload_images) {
        this.owner.resourceload({width: this.resourceWidth, height: this.resourceHeight, resource: this.resource, skiponload: this.skiponload});
    }

    this.loading = true;
    if (! this.__ImgPool) {
        this.__ImgPool = new LzPool(LzSprite.prototype.__getImage, LzSprite.prototype.__gotImage, LzSprite.prototype.__destroyImage, this);
    }
    var im = this.__ImgPool.get(url, usecache != true);
    this.__bindImage(im);

    if (this.loading) {
        //FIXME: [20080203 anba] if this is a single-frame resource, "loading" won't be updated,
        //also see fixme in setResource(..)
        
        //update stretches for IE6, actually only necessary for single-frame resources, 
        //because multi-frame resources get preloaded+stretched beforehand, 
        //but do we ever get a single-frame resource? see fixme in setResource(..)
        if (this.skiponload && this.quirks.ie_alpha_image_loader) this.__updateIEAlpha(im);
    } else {
        //this was a cache-hit
        if (this.quirks.ie_alpha_image_loader) {
            //always update stretches for IE6
            this.__updateIEAlpha(im);
        } else if (this.stretches) {
            this.__updateStretches();
        }
    }
    //FIXME: [20080126 anba] this is a no-op, why was it added here?
    if (this.clickable) this.setClickable(true);
}

LzSprite.prototype.__bindImage = function (im){
    if (this.__LZimg && this.__LZimg.owner) {
        //Debug.write('replaceChild', im.owner, this.__LZimg.owner);
        this.__LZdiv.replaceChild(im, this.__LZimg);
        this.__LZimg = im;
    } else {
        this.__LZimg = im;
        this.__LZdiv.appendChild(this.__LZimg);
    }
}

LzSprite.prototype.__setBGImage = function (url){
    var bgurl = url ? "url('" + url + "')" : null;
    this.__bgimage = this.__LZimg.style.backgroundImage = bgurl
}

/**
  * @access private
  */
if (LzSprite.prototype.quirks.ie_alpha_image_loader) {
/**
  * @access private
  */
    LzSprite.prototype.__updateIEAlpha = function(who) {
        var w = this.resourceWidth;
        var h = this.resourceHeight;
        if (this.stretches == 'both') {
            w = '100%';
            h = '100%';
        } else if (this.stretches == 'width') {
            w = '100%';
        } else if (this.stretches == 'height') {
            h = '100%';
        }

        //IE6 needs a width and a height
        if (w == null)
            w = (this.width == null) ? '100%' : this.CSSDimension(this.width);
        if (h == null)
            h = (this.height == null) ? '100%' : this.CSSDimension(this.height);

        who.style.width = w;
        who.style.height = h;
    }
}

LzSprite.prototype.setClickable = function(c) {
    c = c == true;
    if (this.clickable == c) return;
    //Debug.info('setClickable', c);
    if (this.__LZimg != null) {
        if (this.__LZdiv._clickable) {
            this.__setClickable(false, this.__LZdiv);
        }
        if (! this.__LZclick) {
            if (this.quirks.fix_ie_clickable) {
                this.__LZclick = document.createElement('img');
                this.__LZclick.src = lz.embed.options.serverroot + LzSprite.prototype.blankimage;
            } else {
                this.__LZclick = document.createElement('div');
            }
            this.__LZclick.owner = this;
            this.__LZclick.className = 'lzclickdiv';
            this.__LZclick.style.width = this.__LZdiv.style.width;
            this.__LZclick.style.height = this.__LZdiv.style.height;
            if (this.quirks.fix_clickable) {
                this.__LZclickcontainerdiv.appendChild(this.__LZclick);
            } else {
                this.__LZdiv.appendChild(this.__LZclick);
            }
        }
        //Debug.info('clickable', this.__LZclick, c, this.__LZclick.style.width, this.__LZclick.style.height);
        this.__setClickable(c, this.__LZclick);
        if (this.quirks.fix_clickable) {
            if (this.quirks.fix_ie_clickable) {
                //note: views with resources (__LZimg!) cannot have subviews (SWF-policy)
                this.__LZclickcontainerdiv.style.display = c && this.visible ? '' : 'none';
                this.__LZclick.style.display = c && this.visible ? '' : 'none';
            } else {
                this.__LZclick.style.display = c ? 'block' : 'none';
            }
        }
    } else {
        if (this.quirks.fix_clickable) {
            if (! this.__LZclick) {
                if (this.quirks.fix_ie_clickable) {
                    this.__LZclick = document.createElement('img');
                    this.__LZclick.src = lz.embed.options.serverroot + LzSprite.prototype.blankimage;
                } else {
                    this.__LZclick = document.createElement('div');
                }
                this.__LZclick.owner = this;
                this.__LZclick.className = 'lzclickdiv';
                this.__LZclick.style.width = this.__LZdiv.style.width;
                this.__LZclick.style.height = this.__LZdiv.style.height;
                //this.__LZclick.style.backgroundColor = '#ff00ff';
                //this.__LZclick.style.opacity = .2;
                this.__LZclickcontainerdiv.appendChild(this.__LZclick);
            }
            this.__setClickable(c, this.__LZclick);
            if (this.quirks.fix_ie_clickable) {
                this.__LZclick.style.display = c && this.visible ? '' : 'none';
            } else {
                this.__LZclick.style.display = c ? 'block' : 'none';
            }
        } else {
            this.__setClickable(c, this.__LZdiv);
        }
    }
    this.clickable = c;
}

/**
  * @access private
  */
LzSprite.prototype.__setClickable = function(c, div) {
    if (div._clickable == c) return;
    div._clickable = c;
    var f = c ? LzSprite.prototype.__clickDispatcher : null;
    div.onclick = f;
    // Prevent context menus in Firefox 1.5 - see LPP-2678
    div.onmousedown = f;
    div.onmouseup = f;
    div.onmousemove = f;
    if (this.quirks.ie_mouse_events) {
        div.ondrag = f;
        div.ondblclick = f;
        div.onmouseenter = f;
        div.onmouseleave = f;
    } else if (this.quirks.listen_for_mouseover_out) {
        div.onmouseover = f;
        div.onmouseout = f;
    }
}

/**
  * @access private
  * dispatches click events, called from the scope of the click div
  */
LzSprite.prototype.__clickDispatcher = function(e) {
    // capture events in IE
    if (!e) e = window.event;
    this.owner.__mouseEvent(e);
    return false;
}

/**
  * @access private
  */
LzSprite.prototype.__mouseEvent = function ( e , artificial){
    if (artificial) {
        var eventname = e;
        e = {};
    } else {
        var eventname = 'on' + e.type;
        // send option/shift/ctrl key events
        if (LzKeyboardKernel && LzKeyboardKernel['__updateControlKeys']) {
            LzKeyboardKernel.__updateControlKeys(e);

            // FIXME: [20090602 anba] this prevents text selection, see LPP-8200
            if (LzKeyboardKernel.__cancelKeys && e.keyCode == 0) {
                e.cancelBubble = true;
                e.returnValue = false;
            }
        }
    }

    if (this.quirks.ie_mouse_events) {
        // rename ie-specific events to be compatible
        if (eventname == 'onmouseenter') {
            eventname = 'onmouseover';
        } else if (eventname == 'onmouseleave') {
            eventname = 'onmouseout';
        } else if (eventname == 'ondblclick') {
            // Send artificial events to mimic other browsers
            this.__mouseEvent('onmousedown', true);
            this.__mouseEvent('onmouseup', true);
            this.__mouseEvent('onclick', true);
            return;
        } else if (eventname == 'ondrag') {
            // ignore these
            return;
        }
    }

    LzMouseKernel.__sendMouseMove(e);

    if (e.button == 2 && eventname != 'oncontextmenu') return;
    if (eventname == 'onmousemove') {
        return;   
    } else if (eventname == 'onmousedown') {
        // cancel mousedown event bubbling...
        e.cancelBubble = true;
        this.__mouseisdown = true;
        LzMouseKernel.__lastMouseDown = this;

    } else if (eventname == 'onmouseup') {
        e.cancelBubble = false;
        // only send the event if this is same sprite the mouse button went down on
        if (LzMouseKernel.__lastMouseDown === this) {
            LzMouseKernel.__lastMouseDown = null;
            if (this.quirks.ie_mouse_events) {
                // Must be done for onmouseupoutside to work
                if (this.__isMouseOver()) {
                    this.__mouseisdown = false;
                }
            } else {
                this.__mouseisdown = false;
            }
        } else {
            // skip sending the event
            return;
        }
    } else if (eventname == 'onmouseupoutside') {
        this.__mouseisdown = false;
    } else if (eventname == 'onmouseover') {
        if (this.quirks.activate_on_mouseover) {
            var rootdiv = LzSprite.__rootSprite.__LZdiv;
            if (! rootdiv.mouseisover) {
                // enable keyboard/mouse events
                rootdiv.onmouseover();
            }
        }
        var lzinputproto = window['LzInputTextSprite'] && LzInputTextSprite.prototype;
        if (lzinputproto && lzinputproto.__lastshown != null) {
            lzinputproto.__hideIfNotFocused();
        }
    }

    //Debug.write('__mouseEvent', eventname, this.owner);
    if (this.owner.mouseevent) {
        // send dragin/out events if the mouse is currently down
        if (LzMouseKernel.__lastMouseDown) {
            if (eventname == 'onmouseover' || eventname == 'onmouseout') {
                if (this.quirks.ie_mouse_events) {
                    // only send mouseover/out events if the mouse is over this sprite
                    if (this.__isMouseOver()) {
                        LzMouseKernel.__sendEvent(eventname, this.owner);
                    }
                } else {
                    // only send mouseover/out if the mouse went down on this sprite
                    if (LzMouseKernel.__lastMouseDown === this) {
                        LzMouseKernel.__sendEvent(eventname, this.owner);
                    }
                }
                var dragname = eventname == 'onmouseover' ? 'onmousedragin' : 'onmousedragout';
                LzMouseKernel.__sendEvent(dragname, this.owner);
                return;
            }
        }

        LzMouseKernel.__sendEvent(eventname, this.owner);
    }
}

LzSprite.prototype.__isMouseOver = function ( e ){
    var p = this.getMouse();
    return p.x >= 0 && p.y >= 0 && p.x <= this.width && p.y <= this.height;
}

/**
  * Called by LzMouseKernel when mouse goes up on another sprite
  * @access private
  */
LzSprite.prototype.__globalmouseup = function ( e ){
    if (this.__mouseisdown) {
        // the event is already sent in IE
        if (! this.quirks.ie_mouse_events) {
            this.__mouseEvent(e);
        }
        this.__mouseEvent('onmouseupoutside', true);
    }
    LzMouseKernel.__lastMouseDown = null;
}

LzSprite.prototype.setX = function ( x ){
    if (x == null || x == this.x) return;
    this.__poscacheid = -1;
    this.x = x;
    x = this.CSSDimension(x);
    if (this._x != x) {
        this._x = x;
        this.__LZdiv.style.left = x;
        if (this.quirks.fix_clickable) {
            this.__LZclickcontainerdiv.style.left = x;
        }
    }
}

LzSprite.prototype.setWidth = function ( w ){
    if (w == null || w < 0 || this.width == w) return;

    //Debug.info('setWidth', w);
    this.width = w;
    w = this.CSSDimension(w);
    if (this._w != w) {
        this._w = w;
        this.__LZdiv.style.width = w;
        if (this.clip) this.__updateClip();
        if (this.stretches) this.__updateStretches();
        if (this.__LZclick) this.__LZclick.style.width = w;
        return w;
    }
}

LzSprite.prototype.setY = function ( y ){
    //Debug.info('setY', y);
    if (y == null || y == this.y) return;
    this.__poscacheid = -1;
    this.y = y;
    y = this.CSSDimension(y);
    if (this._y != y) {
        this._y = y;
        this.__LZdiv.style.top = y;
        if (this.quirks.fix_clickable) {
            this.__LZclickcontainerdiv.style.top = y;
        }
    }
}

LzSprite.prototype.setHeight = function ( h ){
    if (h == null || h < 0 || this.height == h) return;

    this.height = h;
    //Debug.info('setHeight', h, this.height, this.owner);
    h = this.CSSDimension(h);
    if (this._h != h) {
        this._h = h;
        this.__LZdiv.style.height = h; 
        if (this.clip) this.__updateClip();
        if (this.stretches) this.__updateStretches();
        if (this.__LZclick) this.__LZclick.style.height = h;
        return h;
    }
}

/**
  * @access private
  */
LzSprite.prototype.setMaxLength = function ( v ){
    //overridden by LzInputTextSprite
}

/**
  * @access private
  */
LzSprite.prototype.setPattern = function ( v ){
    //overridden by LzTextSprite
}

LzSprite.prototype.setVisible = function ( v ){
    if (this.visible == v) return;
    //Debug.info('setVisible', v, this.owner.getUID());
    this.visible = v;
    this.__LZdiv.style.display = (v && this.opacity != 0) ? 'block' : 'none';
    if (this.quirks.fix_clickable) {
        if (this.quirks.fix_ie_clickable && this.__LZclick) {
            this.__LZclick.style.display = v && this.clickable ? '' : 'none';
        }
        this.__LZclickcontainerdiv.style.display = v ? 'block' : 'none';
    }
}

LzSprite.prototype.setColor = function ( c ){
    if (this.color == c) return;
    this.color = c;
    this.__LZdiv.style.color = LzColorUtils.inttohex(c);
}

LzSprite.prototype.setBGColor = function ( c ){
    if (this.bgcolor == c) return;
    this.bgcolor = c;
    this.__LZdiv.style.backgroundColor = c == null ? 'transparent' : LzColorUtils.inttohex(c);
    if (this.quirks.fix_ie_background_height) {
        if (this.height != null && this.height < 2) {
            this.setSource(lz.embed.options.serverroot + LzSprite.prototype.blankimage, true);
        } else if (! this._fontSize) {
            this.__LZdiv.style.fontSize = '0px';
        }
    }
    //Debug.info('setBGColor ' + c);
}

LzSprite.prototype.setOpacity = function ( o ){
    if (this.opacity == o || o < 0) return;
    this.opacity = o;
    // factor used to compute percentage
    var factor = 100;
    if (this.capabilities.minimize_opacity_changes) {
        factor = 10;
    }
    o = parseInt(o * factor) / factor;
    if (o != this._opacity) { 
        //Debug.info('setOpacity', o);
        this._opacity = o;
        this.__LZdiv.style.display = (this.visible && o != 0) ? 'block' : 'none';

        if (this.quirks.ie_opacity) {
            if (o == 1) {
                this.__LZdiv.style.filter = "";
            } else {
                this.__LZdiv.style.filter = "alpha(opacity=" + parseInt(o * 100) + ")";
            }
        } else {
            if (o == 1) {
                this.__LZdiv.style.opacity = "";
            } else {
                this.__LZdiv.style.opacity = o;
            }
        }
    }
}

LzSprite.prototype.play = function(f) {
    if (! this.frames || this.frames.length < 2) return;
    f = parseInt(f);
    if (! isNaN(f)) {
        //Debug.info('play ' + f + ', ' + this.frame);
        this.__setFrame(f);
    }
    if (this.playing == true) return;
    this.playing = true;
    this.owner.resourceevent('play', null, true);
    LzIdleKernel.addCallback(this, '__incrementFrame');
}

LzSprite.prototype.stop = function(f) {
    if (! this.frames || this.frames.length < 2) return;
    if (this.playing == true) {
        this.playing = false;
        this.owner.resourceevent('stop', null, true);
        LzIdleKernel.removeCallback(this, '__incrementFrame');
    }
    f = parseInt(f);
    if (! isNaN(f)) {
        //Debug.info('stop ' + f + ', ' + this.frame);
        this.__setFrame(f);
    }
}

/**
  * @access private
  */
LzSprite.prototype.__incrementFrame = function() {
    // Wrap around to the first frame
    var newframe = this.frame + 1 > this.frames.length ? 1 : this.frame + 1;
    this.__setFrame(newframe);
}

if (LzSprite.prototype.quirks.preload_images_only_once) {
    LzSprite.prototype.__preloadurls = {};
}
/**
  * @access private
  */
LzSprite.prototype.__preloadFrames = function() {
    if (! this.__ImgPool) {
        this.__ImgPool = new LzPool(LzSprite.prototype.__getImage, LzSprite.prototype.__gotImage, LzSprite.prototype.__destroyImage, this);
    }
    var l = this.frames.length;
    for (var i = 0; i < l; i++) {
        var src = this.frames[i];
        //Debug.info('preload', src, i != 0);
        if (this.quirks.preload_images_only_once) {
            if (i > 0 && LzSprite.prototype.__preloadurls[src]) {
                continue;
            }
            LzSprite.prototype.__preloadurls[src] = true;
        }
        var im = this.__ImgPool.get(src, false, true);
        if (this.quirks.ie_alpha_image_loader) {
            this.__updateIEAlpha(im);
        }
    }
}

/**
  * @access private
  */
LzSprite.prototype.__findParents = function ( prop ){
    var out = [];
    var root = LzSprite.__rootSprite;
    for (var sprite = this; sprite; sprite = sprite.__parent) {
        if (sprite[prop] != null) out.push(sprite);
        if (sprite === root) break;
    }
    return out;
}

/**
  * @access private
  */
LzSprite.prototype.__imgonload = function(i, cacheHit) {
    if (this.loading != true) return;
    if (this.__imgtimoutid != null) {
        clearTimeout(this.__imgtimoutid);
        this.__imgtimoutid = null;
    }
    this.loading = false;
    // show image div
    if (! cacheHit) {
        if (this.quirks.ie_alpha_image_loader) {
            i._parent.style.display = '';
        } else {
            i.style.display = '';
        }
    }

    this.resourceWidth = (cacheHit && i['__LZreswidth']) ? i.__LZreswidth : i.width;
    this.resourceHeight = (cacheHit && i['__LZresheight']) ? i.__LZresheight : i.height;
    
    if (!cacheHit) {
        if (this.quirks.invisible_parent_image_sizing_fix && this.resourceWidth == 0) {
            // This or any parent divs who aren't visible measure 0x0
            // Make this and all parents visible, measure them, then restore their
            // state
            var f = function(i) {
                this.resourceWidth = i.width;
                this.resourceHeight = i.height;
            }
            this.__processHiddenParents(f, i);
        }
        //TODO: Tear down filtered image and set to new size?
    
        if (this.quirks.ie_alpha_image_loader) {
            i._parent.__lastcondition = '__imgonload';
        } else {
            i.__lastcondition = '__imgonload';
            i.__LZreswidth = this.resourceWidth;
            i.__LZresheight = this.resourceHeight;
        }
    
        //don't update stretches if this was a cache-hit, because __LZimg still points to the prev img
        if (this.quirks.ie_alpha_image_loader) {
            this.__updateIEAlpha(this.__LZimg);
        } else if (this.stretches) {
            this.__updateStretches();
        }
    }
    
    this.owner.resourceload({width: this.resourceWidth, height: this.resourceHeight, resource: this.resource, skiponload: this.skiponload});
    if (this.skiponload != true){
        // for user-loaded media
        this.__updateLoadStatus(1);
    }
    if (this.quirks.ie_alpha_image_loader) {
        this.__clearImageEvents(this.__LZimg);
    } else {
        this.__clearImageEvents(i);
    }
}

/**
  * Shows all hidden parent sprites, calls the method provided (with optional 
  * additional args), then restores their previous visibility state.
  * 
  * @param Function method: The method to be called after showing parents
  * @return Object: The return value for 'method' if there is one.
  * @access private
  */
LzSprite.prototype.__processHiddenParents = function(method) {
    var sprites = this.__findParents('visible');
    //Debug.info('LzSprite.onload', i, i.width, i.height, sprites);
    var vals = [];
    var l = sprites.length;
    // show parents, caching original values
    for (var n = 0; n < l; n++) {
        var v = sprites[n];
        vals[n] = v.__LZdiv.style.display;
        v.__LZdiv.style.display = 'block';
    }

    // call passed-in method with optional args
    var args = Array.prototype.slice.call(arguments, 1);
    var result = method.apply(this, args);

    // restore original values
    for (var n = 0; n < l; n++) {
        var v = sprites[n];
        v.__LZdiv.style.display = vals[n];
    }
    return result;
}

/**
  * @access private
  */
LzSprite.prototype.__imgonerror = function(i, cacheHit) {
    if (this.loading != true) return;
    if (this.__imgtimoutid != null) {
        clearTimeout(this.__imgtimoutid);
        this.__imgtimoutid = null;
    }
    this.loading = false;
    this.resourceWidth = 1;
    this.resourceHeight = 1;
    
    if (!cacheHit) {
        if (this.quirks.ie_alpha_image_loader) {
            i._parent.__lastcondition = '__imgonerror';
        } else {
            i.__lastcondition = '__imgonerror';
        }
    
        //don't update stretches if this was a cache-hit, because __LZimg still points to the prev img
        if (this.quirks.ie_alpha_image_loader) {
            this.__updateIEAlpha(this.__LZimg);
        } else if (this.stretches) {
            this.__updateStretches();
        }
    }
    
    this.owner.resourceloaderror();
    if (this.skiponload != true){
        // for user-loaded media
        this.__updateLoadStatus(0);
    }
    if (this.quirks.ie_alpha_image_loader) {
        this.__clearImageEvents(this.__LZimg);
    } else {
        this.__clearImageEvents(i);
    }
}

/**
  * @access private
  */
LzSprite.prototype.__imgontimeout = function(i, cacheHit) {
    if (this.loading != true) return;
    this.__imgtimoutid = null;
    this.loading = false;
    this.resourceWidth = 1;
    this.resourceHeight = 1;
    
    if (!cacheHit) {
        if (this.quirks.ie_alpha_image_loader) {
            i._parent.__lastcondition = '__imgontimeout';
        } else {
            i.__lastcondition = '__imgontimeout';
        }
    
        //don't update stretches if this was a cache-hit, because __LZimg still points to the prev img
        if (this.quirks.ie_alpha_image_loader) {
            this.__updateIEAlpha(this.__LZimg);
        } else if (this.stretches) {
            this.__updateStretches();
        }
    }
    
    this.owner.resourceloadtimeout();
    if (this.skiponload != true){
        // for user-loaded media
        this.__updateLoadStatus(0);
    }
    if (this.quirks.ie_alpha_image_loader) {
        this.__clearImageEvents(this.__LZimg);
    } else {
        this.__clearImageEvents(i);
    }
}

/**
  * @access private
  */
LzSprite.prototype.__updateLoadStatus = function(val) {
    this.owner.resourceevent('loadratio', val);
    this.owner.resourceevent('framesloadratio', val);
}

/*
 * @devnote: These three methods are called by the image pool.
 * So "this" refers to an LzPool instance and not to this LzSprite.
 * To get the actual sprite use "this.owner".
 */
 
/**
  * @access private
  */
LzSprite.prototype.__destroyImage = function (url, img) {
    if (img) {
        if (img.owner) {
            var owner = img.owner;//= the sprite
            if (owner.__imgtimoutid != null) {
                clearTimeout(owner.__imgtimoutid);
                owner.__imgtimoutid = null;
            }
            //@devnote: remember, this will remove all callback-functions for this sprite!
            lz.BrowserUtils.removecallback(owner);
        }
        LzSprite.prototype.__clearImageEvents(img);
        LzSprite.prototype.__discardElement(img);
    }
    if (LzSprite.prototype.quirks.preload_images_only_once) {
        LzSprite.prototype.__preloadurls[url] = null;
    }
}

/**
  * @access private
  * Clears events registered on an image
  */
LzSprite.prototype.__clearImageEvents = function (img) {
    if (! img || img.__cleared) return;
    if (LzSprite.prototype.quirks.ie_alpha_image_loader) {
        var sizer = img.sizer;
        if (sizer) {
            //Debug.write('__clearImageEvents'+ sizer.src);
            if (sizer.tId) clearTimeout(sizer.tId);
            sizer.onerror = null;
            sizer.onload = null;
            sizer.onloadforeal = null;
            sizer._parent = null;
            // create dummy object with image properties
            var dummyimg = {width: sizer.width, height: sizer.height, src: sizer.src}
            LzSprite.prototype.__discardElement(sizer);
            img.sizer = dummyimg;
        }
    } else {
        img.onerror = null;
        img.onload = null
    }
    img.__cleared = true;
}

/**
  * @access private
  */
LzSprite.prototype.__gotImage = function(url, obj, skiploader) {
    //Debug.info('got', url, this.owner.resourceWidth, this.owner.resourceHeight);
    // this is calling the sprite
    if (this.owner.skiponload || skiploader == true) {
        //loading a resource (non-http)
        this.owner[obj.__lastcondition]({width: this.owner.resourceWidth, height: this.owner.resourceHeight}, true);
    } else {
        if (LzSprite.prototype.quirks.ie_alpha_image_loader) {
            this.owner[obj.__lastcondition](obj.sizer, true);
        } else {
            this.owner[obj.__lastcondition](obj, true);
        }
    }
}

/**
  * @access private
  */
LzSprite.prototype.__getImage = function(url, skiploader) {
    if (LzSprite.prototype.quirks.ie_alpha_image_loader) {
        var im = document.createElement('div');
        //im.className = 'lzdiv';//FIXME: LPP-5422
        im.style.overflow = 'hidden';

        if (this.owner && skiploader != true) {
            //Debug.info('sizer', skiploader, skiploader != true);
            im.owner = this.owner;
            if (! im.sizer) {
                im.sizer = document.createElement('img');
                im.sizer._parent = im;
            }
            im.sizer.onload = function() {
                // This resolves all sorts of timing-related image loading bugs
                im.sizer.tId = setTimeout(this.onloadforeal, 1);
            }
            im.sizer.onloadforeal = lz.BrowserUtils.getcallbackfunc(this.owner, '__imgonload', [im.sizer]);
            im.sizer.onerror = lz.BrowserUtils.getcallbackfunc(this.owner, '__imgonerror', [im.sizer]);
            var callback = lz.BrowserUtils.getcallbackfunc(this.owner, '__imgontimeout', [im.sizer]);
            this.owner.__imgtimoutid = setTimeout(callback, canvas.medialoadtimeout);
            im.sizer.src = url;
        }
        // show again in onload
        if (! skiploader) im.style.display = 'none'
        if (this.owner.stretches) {
            im.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + url + "',sizingMethod='scale')";
        } else {
            im.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + url + "')";
        }
    } else {
        var im = document.createElement('img');
        im.className = 'lzdiv';
        // show again in onload
        if (! skiploader) im.style.display = 'none'
        if (this.owner && skiploader != true) {
            //Debug.info('sizer', skiploader == true, skiploader != true, skiploader);
            im.owner = this.owner;
            im.onload = lz.BrowserUtils.getcallbackfunc(this.owner, '__imgonload', [im]);
            im.onerror = lz.BrowserUtils.getcallbackfunc(this.owner, '__imgonerror', [im]);
            var callback = lz.BrowserUtils.getcallbackfunc(this.owner, '__imgontimeout', [im]);
            this.owner.__imgtimoutid = setTimeout(callback, canvas.medialoadtimeout);

        }
        im.src = url;
    }
    if (im) im.__lastcondition = '__imgonload';
    return im;
}

LzSprite.prototype.setClip = function(c) {
    if (this.clip == c) return;
    //Debug.info('setClip', c);
    this.clip = c;
    this.__updateClip();
}

/**
  * @access private
  */
LzSprite.prototype.__updateClip = function() {
    if (this.isroot && this.quirks.canvas_div_cannot_be_clipped) return;
    if (this.clip && this.width != null && this.width >= 0 && this.height != null && this.height >= 0) {
        var s = 'rect(0px ' + this._w + ' ' + this._h + ' 0px)';
        this.__LZdiv.style.clip = s
        if (this.quirks.fix_clickable) {
            this.__LZclickcontainerdiv.style.clip = s
        }
    } else if (this.__LZdiv.style.clip) {
        this.__LZdiv.style.clip = 'rect(auto auto auto auto)';
        if (this.quirks.fix_clickable) {
            this.__LZclickcontainerdiv.style.clip = 'rect(auto auto auto auto)';
        }
    }
}

/**
  * Sets the view so that it stretches its resource in the given axis so that
  * the resource is the same size as the view. The has the effect of distorting
  * the coordinate system for all children of this view, so use this method
  * with care.
  * 
  * @param String s: Set the resource to stretch only in the given axis ("width" or
  * "height").  Otherwise set the resource to stretch in both axes ("both") or 
  * none (any other value).
  */
LzSprite.prototype.stretchResource = function(s) {
    s = (s != "none" ? s : null);//convert "none" to null
    if (this.stretches == s) return;
    this.stretches = s;
    if (! (s == null && this.__csssprite) && this.__bgimage) {
        if (this.quirks.preload_images) this.__preloadFrames();
        // clear out the bgimage
        this.__setBGImage(null);
        // set up default image/imagepool
        this.__setFrame(this.frame, true);
    }
    //TODO: update 'sizingMethod' for IE6
    this.__updateStretches();
}

/**
  * @access private
  */
LzSprite.prototype.__updateStretches = function() {
    if ( this.loading ) return;
    if (this.quirks.ie_alpha_image_loader) return;
    if (this.__LZimg) {
        // LPP-6009. Setting width/height doesn't always stick in IE7/dhtml 
        // I found that changing the display first fixes this.
        var dsp = this.__LZimg.style.display;
        this.__LZimg.style.display = 'none';
        if (this.stretches == 'both') {
            this.__LZimg.width = this.width;
            this.__LZimg.height = this.height;
        } else if (this.stretches == 'height') {
            this.__LZimg.width = this.resourceWidth;
            this.__LZimg.height = this.height;
        } else if (this.stretches == 'width') {
            this.__LZimg.width = this.width;
            this.__LZimg.height = this.resourceHeight;
        } else {
            this.__LZimg.width = this.resourceWidth;
            this.__LZimg.height = this.resourceHeight;
        }

        this.__LZimg.style.display = dsp;
    }

}

LzSprite.prototype.predestroy = function() {
}

LzSprite.prototype.destroy = function() {
    if (this.__LZdeleted == true) return;
    // To keep delegates from resurrecting us.  See LzDelegate#execute
    this.__LZdeleted = true;

    // Remove from parent if the parent is not going to be GC-ed
    if ((this.__parent) && (! this.__parent.__LZdeleted)) {
      var pc = this.__parent.__children;
      for (var i = pc.length - 1; i >= 0; i--) {
        if (pc[i] === this) {
          pc.splice(i, 1);
          break;
        }
      }
    }

    if (this.__ImgPool) this.__ImgPool.destroy();
    if (this.__LZimg) this.__discardElement(this.__LZimg);
    if (this.__LZclick) {
        this.__setClickable(false, this.__LZclick);
        this.__discardElement(this.__LZclick);
    }
    if (this.__LzInputDiv) {
        this.__setTextEvents(false);
        this.__discardElement(this.__LzInputDiv);
    }
    if (this.__LZdiv) {
        if (this.isroot) {
            if (this.quirks.activate_on_mouseover) {
                this.__LZdiv.onmouseover = null;
                this.__LZdiv.onmouseout = null;
            }
        }
        this.__LZdiv.onselectstart = null;
        this.__setClickable(false, this.__LZdiv);
        this.__discardElement(this.__LZdiv);
    }
    if (this.__LZinputclickdiv) {
        // keep LzInputTextSprite.__createInputText() in sync to prevent leaks
        if (this.quirks.ie_mouse_events) {
            this.__LZinputclickdiv.onmouseenter = null; 
        } else {
            this.__LZinputclickdiv.onmouseover = null; 
        }
        this.__discardElement(this.__LZinputclickdiv);
    }
    if (this.__LZclickcontainerdiv) {
        this.__discardElement(this.__LZclickcontainerdiv);
    }
    if (this.__LZtextdiv) {
        this.__discardElement(this.__LZtextdiv);
    }
    if (this.__LZcanvas) {
        this.__discardElement(this.__LZcanvas);
    }
    this.__ImgPool = null;

    if (this.quirks.ie_leak_prevention) {
        delete this.__sprites[this.uid];
    }
    if (this.isroot) {
        lz.BrowserUtils.scopes = null;
    }
}

/**
  * This method returns the position of the mouse relative to this sprite.
  * 
  * @return Object: The x and y position of the mouse relative to this sprite.
  */
LzSprite.prototype.getMouse = function() {
    // TODO: don't base these metrics on the mouse position
    //Debug.debug('LzSprite.getMouse', this.owner.classname, LzSprite.__rootSprite.getMouse('x'), LzSprite.__rootSprite.getMouse('y'));
    var p = this.__getPos();
    if (this.isroot) {
        return {x: LzMouseKernel.__x - p.x, y: LzMouseKernel.__y - p.y};
    } else {
        var m = LzSprite.__rootSprite.getMouse();
        return {x: m.x - p.x, y: m.y - p.y};
    }
}

/**
  * @access private
  */
LzSprite.prototype.__poscache = null;
/**
  * @access private
  */
LzSprite.prototype.__poscacheid = 0;
/**
  * @access private
  */
LzSprite.__poscachecnt = 0;
/**
  * @access private
  */
LzSprite.prototype.__getPos = function() {
    // Handle LPP-4357
    if (! LzSprite.__rootSprite.__initdone) {
        return lz.embed.getAbsolutePosition(this.__LZdiv);
    }

    // check if any this sprite or any parents are dirty 
    var dirty = false;
    var attached = true;
    var root = LzSprite.__rootSprite;
    var pp, ppmax;
    for (var p = this; p !== root; p = pp) {
        pp = p.__parent;
        if (pp) {
            if (p.__poscacheid < pp.__poscacheid) {
                // cache is too old or invalid
                dirty = true;
                ppmax = pp;
            }
        } else {
            // not yet attached to the DOM
            attached = false;
            break;
        }
    }

    if (dirty && attached) {
        var next = ++LzSprite.__poscachecnt;
        for (var p = this; p !== ppmax; p = p.__parent) {
            // invalidate all bad caches
            p.__poscache = null;
            p.__poscacheid = next;
        }
    }

    var pos = this.__poscache;
    if (! pos) {
        // compute position, temporarily showing hidden parents so they can be measured
        pos = this.__processHiddenParents(lz.embed.getAbsolutePosition, this.__LZdiv);
        if (attached) {
            // only cache position if the sprite is attached to the DOM (LPP-4357)
            this.__poscache = pos;
        }
    }
    return pos;
}

LzSprite.prototype.getWidth = function() {
    var w = this.__LZdiv.clientWidth;
    //Debug.info('LzSprite.getWidth', w, this.width, this.owner);
    return w == 0 ? this.width : w;
}

LzSprite.prototype.getHeight = function() {
    var h = this.__LZdiv.clientHeight;
    //Debug.info('LzSprite.getHeight', h, this.height, this.owner);
    return h == 0 ? this.height : h;
}

/**
  * Sets the cursor to the specified cursor ID.  
  * @param String c: cursor ID to use, or '' for default.  See 
  * http://www.quirksmode.org/css/cursor.html for valid IDs 
  * Note that the name should be camelcased, e.g. colResize for the style 
  * col-resize.
  */
LzSprite.prototype.setCursor = function ( c ){
    if (this.quirks.no_cursor_colresize) {
        return;
    }
    if (c == this.cursor) return;
    if (this.clickable != true) this.setClickable(true);
    this.cursor = c;
    //Debug.write('setting cursor to', c, 'on', this.__LZclick.style); 
    var c = LzSprite.prototype.__defaultStyles.hyphenate(c);
    this.__LZclick.style.cursor = c;
}

/**
  * Shows or hides the hand cursor for this view.
  * @param Boolean s: true shows the hand cursor for this view, false hides
  * it
  */
LzSprite.prototype.setShowHandCursor = function ( s ){
    if (s == true) {
        this.setCursor('pointer');
    } else {
        this.setCursor('default');
    }
}

LzSprite.prototype.getMCRef = function ( ){
    //TODO: implement
    return this.__LZdiv;
}

LzSprite.prototype.getContext = function ( ){
    //TODO: move from drawview
    return this.getMCRef();
}

LzSprite.prototype.bringToFront = function() {
    if (! this.__parent) {
        if ($debug) {
            Debug.warn('bringToFront with no parent');
        }
        return;
    }
    if (this.__parent.__children.length < 2) return;

    this.__setZ( ++this.__parent.__topZ );
}

/**
  * @access private
  */
LzSprite.prototype.__setZ = function(z) {
    this.__LZdiv.style.zIndex = z;
    if (this.quirks.fix_clickable) {
        this.__LZclickcontainerdiv.style.zIndex = z;
    }
    this.__z = z;
}

/**
  * @access private
  */
LzSprite.prototype.__zCompare = function(a, b) {
   if (a.__z < b.__z)
      return -1
   if (a.__z > b.__z)
      return 1
   return 0
}

LzSprite.prototype.sendToBack = function() {
    if (! this.__parent) {
        if ($debug) {
            Debug.warn('sendToBack with no parent');
        }
        return;
    }

    var c = this.__parent.__children;
    if (c.length < 2) return;
    c.sort(LzSprite.prototype.__zCompare);

    this.sendBehind(c[0]);
}

LzSprite.prototype.sendBehind = function ( behindSprite ){
    if (! behindSprite) return;
    if (! this.__parent) {
        if ($debug) {
            Debug.warn('sendBehind with no parent');
        }
        return;
    }

    var c = this.__parent.__children;
    if (c.length < 2) return;
    c.sort(LzSprite.prototype.__zCompare);

    var behindZ = false
    for (var i = 0; i < c.length; i++) {
        var s = c[i];
        if (s == behindSprite) behindZ = behindSprite.__z;
        if (behindZ != false) {
            // bump up everyone including behindSprite
            s.__setZ( ++s.__z );
        }
    }
    // insert where behindSprite used to be
    this.__setZ(behindZ);
}

LzSprite.prototype.sendInFrontOf = function ( frontSprite ){
    if (! frontSprite) return;
    if (! this.__parent) {
        if ($debug) {
            Debug.warn('sendInFrontOf with no parent');
        }
        return;
    }

    var c = this.__parent.__children;
    if (c.length < 2) return;
    c.sort(LzSprite.prototype.__zCompare);

    var frontZ = false
    for (var i = 0; i < c.length; i++) {
        var s = c[i];
        if (frontZ != false) {
            // bump up everyone after frontSprite
            s.__setZ( ++s.__z );
        }
        if (s == frontSprite) frontZ = frontSprite.__z + 1;
    }
    // insert after frontSprite
    this.__setZ(frontZ);
}


/**
  * @access private
  */
LzSprite.prototype.__setFrame = function (f, force){
    if (f < 1) {
        f = 1;
    } else if (f > this.frames.length) {
        f = this.frames.length;
    } 

    var skipevent = false;
    if (force) {
        skipevent = f == this.frame;
    } else if (f == this.frame) {
        return;
    }
    //Debug.info('LzSprite.__setFrame', f);
    this.frame = f;

    if (this.stretches == null && this.__csssprite) {
        // use x axis for now...
        if (! this.__bgimage) {
            this.__LZimg.src = lz.embed.options.resourceroot + LzSprite.prototype.blankimage;
            this.__setBGImage(this.__csssprite);
        }
        var x = (this.frame - 1) * (- this.resourceWidth);
        var y = 0;
        this.__LZimg.style.backgroundPosition = x + 'px ' + y + 'px';
        //Debug.write('frame', f, x, this.__LZdiv.style.backgroundPosition)
    } else {
        // from __updateFrame()    
        var url = this.frames[this.frame - 1];
        this.setSource(url, true);
    }
    if (skipevent) return;
    this.owner.resourceevent('frame', this.frame);
    if (this.frames.length == this.frame)
        this.owner.resourceevent('lastframe', null, true);
}

/**
  * @access private
  */
LzSprite.prototype.__discardElement = function (element) {
    if (LzSprite.prototype.quirks.ie_leak_prevention) {
        // Used instead of node.removeChild to eliminate 'pseudo-leaks' in IE - see http://outofhanwell.com/ieleak/index.php?title=Fixing_Leaks
        //alert('__discardElement' + element.nodeType);
        if (! element || ! element.nodeType) return;
        if( ( element.nodeType >= 1 ) && ( element.nodeType < 13 ) )  {
            // ensures element is valid node 
            if (element.owner) element.owner = null;
            var garbageBin = document.getElementById('__LZIELeakGarbageBin');
            if (!garbageBin) {
                garbageBin = document.createElement('DIV');
                garbageBin.id = '__LZIELeakGarbageBin';
                garbageBin.style.display = 'none';
                document.body.appendChild(garbageBin);
            }

            // move the element to the garbage bin
            garbageBin.appendChild(element);
            garbageBin.innerHTML = '';
            //garbageBin.outerHTML = '';
        }
    } else {
        if (element.parentNode) element.parentNode.removeChild(element);
    }
}

/**
  * Get the current z order of the sprite
  * @return Integer: A number representing z orderin
  */
LzSprite.prototype.getZ = function () {
    return this.__z;
}

LzSprite.prototype.updateResourceSize = function () {
    this.owner.resourceload({width: this.resourceWidth, height: this.resourceHeight, resource: this.resource, skiponload: true});
}

LzSprite.prototype.unload = function () {
    this.resource = null;
    this.source = null;
    this.resourceWidth = null;
    this.resourceHeight = null;
    if (this.__ImgPool) {
        this.__ImgPool.destroy();
        this.__ImgPool = null;
    }
    if (this.__LZimg) {
        this.__destroyImage(null, this.__LZimg);
        this.__LZimg = null;
    }
    this.__updateLoadStatus(0);
}

/**
  * @access private
  */
LzSprite.prototype.__setCSSClassProperty = function(classname, name, value) {
    var rulename = document.all ? 'rules' : 'cssRules';
    var sheets = document.styleSheets;
    var sl = sheets.length - 1;
    for (var i = sl; i >= 0; i--) {
        var rules = sheets[i][rulename];
        var rl = rules.length - 1;
        for (var j = rl; j >= 0; j--) {
            if (rules[j].selectorText == classname) {
                rules[j].style[name] = value;
            }
        }
    }
}

/**
  * LzView.setDefaultContextMenu
  * Install default menu items for the right-mouse-button 
  * @param LzContextMenu cmenu: LzContextMenu to install on this view
  */
LzSprite.prototype.setDefaultContextMenu = function( cmenu ){
    LzSprite.__rootSprite.__contextmenu = cmenu;
}

/**
  * LzView.setContextMenu
  * Install menu items for the right-mouse-button 
  * @param LzContextMenu cmenu: LzContextMenu to install on this view
  */
LzSprite.prototype.setContextMenu = function( cmenu ){
    this.__contextmenu = cmenu;
}

/**
  * LzView.getContextMenu
  * Return the current context menu
  */
LzSprite.prototype.getContextMenu = function() {
    return this.__contextmenu;
}

LzSprite.prototype.setRotation = function(r) {
    this.__LZdiv.style['-webkit-transform'] = 'rotate(' + r + 'deg)';
}

if (LzSprite.prototype.quirks.ie_leak_prevention) {
    LzSprite.prototype.__sprites = {};

    // Make sure all references to code inside DIVs are cleaned up to prevent leaks in IE
    function __cleanUpForIE() {
        LzTextSprite.prototype.__cleanupdivs();
        LzTextSprite.prototype._sizecache = {};

        var obj = LzSprite.prototype.__sprites;
        for (var i in obj) {
            obj[i].destroy();
            obj[i] = null;
        }
        LzSprite.prototype.__sprites = {};
    }
    lz.embed.attachEventHandler(window, 'beforeunload', window, '__cleanUpForIE');
}

// Get any selected text
LzSprite.prototype.getSelectedText = function () {
    var txt = '';
    if (window.getSelection) { // FF/Safari/Opera/Chrome
        return window.getSelection().toString();
    } else if (document.selection) { // IE7
        return document.selection.createRange().text.toString();
    } else if (document.getSelection) { // others
        return document.getSelection();
    } else {
        return null;
    }
}

/**
  * Set accessibility description
  * @param string s: Sets the accessibility name for this view
  */
LzSprite.prototype.setAADescription = function( s ) {
    var aadiv = this.aadescriptionDiv;
    if (aadiv == null) {
        // If not already created, create a <label> element, nested in
        // a <div style='display:none'> to make it invisible
        this.aadescriptionDiv = aadiv = document.createElement('LABEL');
        aadiv.className = 'lzaccessibilitydiv';
        // Safari reader only speaks labels which have a 'for' attribute
        aadiv.setAttribute('for', this.__LZdiv.id);
        this.__LZdiv.appendChild(aadiv);
    }
    aadiv.innerHTML = s;
}


/** Turns accessibility on/off if accessible == true and a screen reader is active 
  * @param Boolean accessible
  */
LzSprite.prototype.setAccessible = function(accessible) {
    // Not yet implemented
}


/**
 * Activate/inactivate children for accessibility
 * @param Boolean s: If true, activate the current view and all of its children
 */
LzSprite.prototype.setAAActive = function( s ){
    // Not yet implemented
}

/**
  * Set accessibility silencing/unsilencing
  * @param string s: If true, this view is made silent to the screen reader.  
  * If false, it is active to the screen reader.
  */
LzSprite.prototype.setAASilent = function( s ){
    // Not yet implemented
}


/**
  * Set accessibility name
  * @param string s: Sets the accessibility name for this view
  */
LzSprite.prototype.setAAName = function( s ){
    // Not yet implemented
}


/**
 * Set accessibility tab order
 * @param number s: The tab order index for this view.  Must be a unique number.
 */
LzSprite.prototype.setAATabIndex = function( s ){
    // Not yet implemented
}
