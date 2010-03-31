/* -*- mode: JavaScript; c-basic-offset: 4; -*- */


/**
  * LzSprite.js
  *
  * @copyright Copyright 2007-2010 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic DHTML
  * @author Max Carlson &lt;max@openlaszlo.org&gt;
  */

{
#pragma "warnUndefinedReferences=false"

var LzSprite = function(owner, isroot) {
    if (owner == null) return;
    this.constructor = arguments.callee;
    this.owner = owner;
    this.uid = LzSprite.prototype.uid++;
    this.aadescriptionDiv = null;
    this.__csscache = {};
    var quirks = this.quirks;

    if (isroot) {
        this.isroot = true;
        LzSprite.__rootSprite = this;
        var div = document.createElement('div');
        div.className = 'lzcanvasdiv';

        quirks['scrollbar_width'] = LzSprite._getScrollbarWidth();

        if (quirks.ie6_improve_memory_performance) {
            try { document.execCommand("BackgroundImageCache", false, true); } catch(err) {}
        }

        // grab values stored by lz.embed.dhtml()
        var p = lz.embed.__propcache;
        var rootcontainer = LzSprite.__rootSpriteContainer = p.appenddiv;

        // appcontainer is the root container for lzcanvascontextdiv, lzcanvasdiv and lzcanvasclickdiv 
        var appcontainer = rootcontainer;

        // Ensure we do not hang out of the container div
        rootcontainer.style.margin = 0;
        rootcontainer.style.padding = 0;
        rootcontainer.style.border = "0 none";
        rootcontainer.style.overflow = "hidden";

        if (quirks['container_divs_require_overflow']) {
            // create a container div that has overflow: hidden and a physical pixel size that lives inside the app container div. 
            // append lzcanvascontextdiv, lzcanvasdiv and lzcanvasclickdiv to the overflowdiv
            // See LPP-8402
            appcontainer = document.createElement('div');
            appcontainer.className = 'lzappoverflow';
            rootcontainer.appendChild(appcontainer);
            appcontainer.owner = this;

            // so the height and width can be set later
            LzSprite.__rootSpriteOverflowContainer = appcontainer;
        }

        if (quirks.fix_contextmenu) {
            var cxdiv = document.createElement('div');
            cxdiv.className = 'lzcanvascontextdiv';
            cxdiv.id = 'lzcanvascontextdiv';
            appcontainer.appendChild(cxdiv);
            cxdiv.owner = this;
            this.__LZcontextcontainerdiv = cxdiv;
        }

        if (p.bgcolor) {
            div.style.backgroundColor = p.bgcolor; 
            this.bgcolor = p.bgcolor; 
        }
        if (p.id) {
            this._id = p.id;
        }
        if (p.url) {
            //also see LzBrowserKernel.getLoadURL()
            this._url = p.url;
        }

        // Store a reference to this app's options hash
        var options = p.options;
        if (options) {
            this.options = options;
        }
        // concatenate the serverroot
        LzSprite.blankimage = options.serverroot + LzSprite.blankimage;

        // process master sprites
        if (quirks.use_css_sprites && options.usemastersprite) {
            quirks.use_css_master_sprite = options.usemastersprite;
            var mastersprite = LzResourceLibrary && LzResourceLibrary.__allcss && LzResourceLibrary.__allcss.path;
            if (mastersprite) {
                LzSprite.__masterspriteurl = mastersprite;
                //precache
                var masterspriteimg = new Image();
                masterspriteimg.src = mastersprite;
                if ($debug) {
                    masterspriteimg.onerror = function() {
                        Debug.warn('Error loading master sprite:', mastersprite);
                    }
                }
            }
        }

        /* Install the styles, now that quirks have been accounted for */
        LzSprite.__defaultStyles.writeCSS(quirks.write_css_with_createstylesheet);

        appcontainer.appendChild(div);
        this.__LZdiv = div;

        if (quirks.fix_clickable) {
            var cdiv = document.createElement('div');
            cdiv.className = 'lzcanvasclickdiv';
            cdiv.id = 'lzcanvasclickdiv';
            appcontainer.appendChild(cdiv);
            this.__LZclickcontainerdiv = cdiv;
        }

        if (quirks['css_hide_canvas_during_init']) {
            var cssname = 'display';
            var cssval = 'none';
            if (quirks['safari_visibility_instead_of_display']) {
                cssname = 'visibility';
                cssval = 'hidden';
            }
            this.__LZdiv.style[cssname] = cssval;
            if (quirks['fix_clickable']) this.__LZclickcontainerdiv.style[cssname] = cssval;
            if (quirks['fix_contextmenu']) this.__LZcontextcontainerdiv.style[cssname] = cssval;
        }

        if (quirks.activate_on_mouseover) {
            // Mouse detection for activation/deactivation of keyboard/mouse events
            div.mouseisover = false;
            div.onmouseover = function(e) {
                if (LzSprite.quirks.keyboardlistentotop_in_frame) {
                    if (LzSprite.__rootSprite.options.cancelkeyboardcontrol != true) {
                        LzSprite.quirks.keyboardlistentotop = true;
                        LzKeyboardKernel.setKeyboardControl(true);
                    }
                }
                if (LzSprite.quirks.focus_on_mouseover) {
                    if (LzSprite.prototype.getSelectedText() == "") {
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
                var quirks = LzSprite.quirks;
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
                    var wasClickable = LzMouseKernel.__globalClickable;
                    if (quirks.fix_ie_clickable) {
                        LzMouseKernel.setGlobalClickable(true);
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
                    // NOTE: [2008-08-17 ptw] (LPP-8375) Forward the
                    // event to the associated view (if any), if it
                    // would have gotten it without the quirk
                    // clickability diddling
                    if (quirks.fix_clickable && (! wasClickable) && LzMouseKernel.__globalClickable) {
                        // IE calls `target` `srcElement`
                        var target = e['target'] ? e.target : e['srcElement'];
                        // Was there a target?
                        if (target) {
                            var owner = target['owner'];
                            // In the kernel, a div's owner is
                            // typically the sprite, and the sprite's
                            // owner is the view.  The <html> element,
                            // though creates its own <iframe> and
                            // sets itself as the owner, hence this
                            // little two-step
                            if (owner is LzSprite) {
                                owner = owner['owner'];
                            }
                            // Was the target associated with a <view>?
                            if (owner is LzView) {
                                LzMouseKernel.__sendEvent('onmouseout', owner);
                            }
                        }
                    }
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
            if (LzSprite.quirks.keyboardlistentotop_in_frame) {
                // listen for window focus events if we're in an iframe
                window.onfocus = function(e) {
                    if (LzSprite.__rootSprite.options.cancelkeyboardcontrol != true) {
                        div.onmouseover();
                    }
                }
            }

            // Store a reference to the div that handles mouse activation
            LzSprite.__mouseActivationDiv = div;
        }

        // create container for text size cache
        var textsizecache = document.createElement('div');
        lz.embed.__setAttr(textsizecache, 'id', 'lzTextSizeCache');
        document.body.appendChild(textsizecache);
    } else {
        this.__LZdiv = document.createElement('div');
        this.__LZdiv.className = 'lzdiv';
        if (quirks.fix_clickable) {
            this.__LZclickcontainerdiv = document.createElement('div');
            this.__LZclickcontainerdiv.className = 'lzdiv';
        }
    }

    this.__LZdiv.owner = this;
    if (quirks.fix_clickable) {
        this.__LZclickcontainerdiv.owner = this;
    }

    if (quirks.ie_leak_prevention) {
        this.__sprites[this.uid] = this;
    }
    //Debug.debug('new LzSprite', this.__LZdiv, this.owner);
}

/* Debug-only annotation */
if ($debug) {
    /** @access private */
    LzSprite.prototype._dbg_typename = 'LzSprite';
    /** @access private */
    LzSprite.prototype._dbg_name = function () {
        // Tip 'o the pin to
        // http://www.quirksmode.org/js/findpos.html
        var div = this.__LZdiv;
        var d = div;
        var x = 0, y = 0;
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
 * Static sprite property:  Template of default CSS styles that will
 * be written to DOM once the quirks are evaluated and adjusted
 *
 * @access private
 */
LzSprite.__defaultStyles = {
    lzdiv: {
        position: 'absolute'
        ,borderStyle: 'solid'
        ,borderWidth: '0px'
    },
    lzclickdiv: {
        position: 'absolute'
        ,borderStyle: 'solid'
        ,borderColor: 'transparent'
        ,borderWidth: '0px'
    },
    lzcanvasdiv: {
        position: 'absolute'
    },
    lzcanvasclickdiv: {
        zIndex: 100000,
        position: 'absolute'
    },
    lzcanvascontextdiv: {
        position: 'absolute'
    },
    lzappoverflow: {
        position: 'absolute',
        overflow: 'hidden'
    },
    // This container implements the swf 'gutter'
    // we only use overflow: hidden for fixed-size text divs and inputtexts
    lztextcontainer: {
        position: 'absolute',
        // To create swf textfield 'gutter'
        paddingTop: '2px',
        paddingRight: '2px',
        paddingBottom: '2px',
        paddingLeft: '2px',
        // By default our text is not selectable, so we don't want an
        // 'auto' cursor
        cursor: 'default'
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
        // To match swf font metrics
        lineHeight: '1.2em',
        textAlign: 'left',
        textIndent: '0px',
        letterSpacing: '0px',
        textDecoration: 'none',
        // CSS3 browsers, for swf compatibilty
        wordWrap: 'break-word',
        MsWordBreak: 'break-all'
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
        letterSpacing: '0px',
        textDecoration: 'none',
        // CSS3 browsers, for swf compatibilty
        wordWrap: 'break-word',
        MsWordBreak: 'break-all',
        outline: 'none',
        resize: 'none'
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
        letterSpacing: '0px',
        textDecoration: 'none',
        // CSS3 browsers, for swf compatibilty
        wordWrap: 'break-word',
        MsWordBreak: 'break-all',
        outline: 'none',
        resize: 'none'
    },
    lztextlink: {
        cursor: 'pointer'
    },
    lzaccessibilitydiv: {
       display: 'none'
    },
    lzcontext: {
        position: 'absolute'
        ,borderStyle: 'solid'
        ,borderColor: 'transparent'
        ,borderWidth: '0px'
    },
    lzimg: {
        position: 'absolute',
        backgroundRepeat: 'no-repeat'
    },
    lzgraphicscanvas: {
        position: 'absolute'
    },
    // Blarg.  Why do we have these in here?
    writeCSS: function(isIE) {
        var rules = [];
        var css = '';
        for (var classname in this) {
            if (classname == 'writeCSS' ||
                classname == 'hyphenate' ||
                classname == '__replace' ||
                classname == '__re') continue;
            css += classname.indexOf('#') == -1 ? '.' : '';
            css += classname + '{';
            for (var n in this[classname]) {
                var v = this[classname][n];
                css += this.hyphenate(n) + ':' + v + ';';
            }
            css += '}';
        }
        css += LzFontManager.generateCSS();
        if (isIE) {
            if (!document.styleSheets['lzstyles']) {
                var ss = document.createStyleSheet();
                ss.owningElement.id = 'lzstyles';
                ss.cssText = css;
            }
        } else {
            var o = document.createElement('style');
            lz.embed.__setAttr(o, 'type', 'text/css');
            o.appendChild( document.createTextNode( css ) );
            var heads = document.getElementsByTagName("head");
            heads[0].appendChild(o);
        }
    },
    __re: new RegExp('[A-Z]', 'g'),
    hyphenate: function(n) {
        return n.replace(this.__re, this.__replace);
    },
    __replace: function(found) {
        return '-' + found.toLowerCase();
    }
}

/** A hash mapping style names to browser-specific versions - see __updateQuirks
    @access private */
LzSprite.__styleNames = {borderRadius: 'borderRadius', userSelect: 'userSelect', transformOrigin: 'transformOrigin', transform: 'transform', boxShadow: 'boxShadow'};

/** @access private */
LzSprite.prototype.uid = 0;

/**
 * Static sprite property:  Quirks that compensate for browser
 * peculiarities.  Quirks will be copied to the sprite prototype once
 * they are computed by __updateQuirks, for easy access from sprites
 *
 * @access private
 */
LzSprite.quirks = {
    // Creates a separate tree of divs for handling mouse events.
    fix_clickable: true
    ,fix_ie_background_height: false
    ,fix_ie_clickable: false
    ,ie_alpha_image_loader: false
    ,ie_leak_prevention: false
    ,prevent_selection: false
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
//    ,fix_inputtext_with_parent_resource: false // no longer needed
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
    //,dom_breaks_focus: false // no longer needed
    ,inputtext_anonymous_div: false
    ,clipped_scrollbar_causes_display_turd: false
    ,hasmetakey: true
    ,textgrabsinputtextfocus: false
    ,input_highlight_bug: false
    ,autoscroll_textarea: false
    ,fix_contextmenu: true
    ,size_blank_to_zero: true
    ,has_dom2_mouseevents: false
    ,container_divs_require_overflow: false
    ,fix_ie_css_syntax: false
    ,match_swf_letter_spacing: false
    ,use_css_master_sprite: false
    ,write_css_with_createstylesheet: false
    ,inputtext_use_background_image: false
    ,show_img_before_changing_size: false
    ,use_filter_for_dropshadow: false
    ,keyboardlistentotop_in_frame: false
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
    ,allowfullscreen: false
    ,setid: true
    ,globalfocustrap: false
    ,'2dcanvas': true
    ,dropshadows: false
    ,cornerradius: false
    ,rgba: false
    ,css2boxmodel: true
    ,medialoading: true
    ,backgroundrepeat: true
}

/**
 * Static function executed once at load time to initialize quirks for
 * the browser we are loaded into
 *
 * @access private
 */
LzSprite.__updateQuirks = function () {
    var quirks = LzSprite.quirks;
    var capabilities = LzSprite.prototype.capabilities;
    var defaultStyles = LzSprite.__defaultStyles;

    if (window['lz'] && lz.embed && lz.embed.browser) {
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
                quirks['prevent_selection'] = true;
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
            // Turning this off fixes LPP-8257
            //quirks['inputtext_parents_cannot_contain_clip'] = true;

            // flag for components (basefocusview for now) to minimize opacity changes
            capabilities['minimize_opacity_changes'] = true;

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
            //quirks['fix_inputtext_with_parent_resource'] = true;
            // IE already includes margins for inputtexts
            quirks['inputtext_size_includes_margin'] = true;
            // LPP-7229 - IE 'helpfully' scrolls focused/blurred divs into view
            quirks['focus_on_mouseover'] = false;
            // required for text-align / text-indent to work
            quirks['textstyle_on_textdiv'] = true;
            // CSS sprites conflict with ie_alpha_image_loader...
            quirks['use_css_sprites'] = ! quirks['ie_alpha_image_loader'];
            // IE needs help focusing when an lztext is in the same area - LPP-8219
            quirks['textgrabsinputtextfocus'] = true;
            // IE document.elementFromPoint() returns scrollbar div
            quirks['ie_elementfrompoint'] = true;
            quirks['fix_ie_css_syntax'] = true;
            // IE doesn't like using DOM operations with the dev console - see LPP-
            quirks['write_css_with_createstylesheet'] = true;
            // IE meta key processing interferes with control-kep processing - see LPP-8702
            quirks['hasmetakey'] = false;
            // IE inputtexts must have a background image to be selectable - see LPP-8696
            quirks['inputtext_use_background_image'] = true;
            // LPP-6009. Setting width/height doesn't always stick in IE7/dhtml 
            // I found that changing the display first fixes this.
            quirks['show_img_before_changing_size'] = true;
            // LPP-8399 - use directx filters for dropshadows
            quirks['use_filter_for_dropshadow'] = true;
            capabilities['dropshadows'] = true;
            // Force hasLayout for lzTextSizeCache in IE
            defaultStyles['#lzTextSizeCache'] = {zoom: 1};
        } else if (browser.isSafari || browser.isChrome) {
            LzSprite.__styleNames.borderRadius = 'WebkitBorderRadius';
            LzSprite.__styleNames.boxShadow = 'WebkitBoxShadow';
            LzSprite.__styleNames.userSelect = 'WebkitUserSelect';
            LzSprite.__styleNames.transform = 'WebkitTransform';
            LzSprite.__styleNames.transformOrigin = 'WebkitTransformOrigin';
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

            // Safari 3.0.4 supports these
            if (browser.version > 523.10) {
                capabilities['rotation'] = true;
                capabilities['dropshadows'] = true;
                capabilities['cornerradius'] = true;
                capabilities['rgba'] = true;
            }

            // Safari has got a special event for pasting
            quirks['safari_paste_event'] = true;
            // Safari does not send onkeypress for function keys
            quirks['keypress_function_keys'] = false;

            // Safari 3.x does not send global key events to apps embedded in an iframe
            // no longer true for 3.0.4 - see LPP-8355
            if (browser.version < 523.15) {
                quirks['keyboardlistentotop'] = true;
            }
            // Safari 4 needs help to get keyboard events when loaded in a frame - see LPP-8707.  Using a separate quirk to avoid perturbing the old fix
            if (window.top !== window) {
                quirks['keyboardlistentotop_in_frame'] = true;
            }
            
            // If Webkit starting with 530.19.2 or Safari 530.19, 3d transforms supported
            if (browser.version >= 530.19) {
                capabilities["threedtransform"] = true;
            }

            // turn off mouseover activation for iphone
            if (browser.isIphone) {
                //quirks['activate_on_mouseover'] = false;
                //quirks['listen_for_mouseover_out'] = false;
                quirks['canvas_div_cannot_be_clipped'] = true;
            }
            
            // required as of 3.2.1 to get test/lztest/lztest-textheight.lzx to show multiline inputtext properly
            quirks['inputtext_strips_newlines'] = true;
            quirks['prevent_selection'] = true;
            // See LPP-8402
            quirks['container_divs_require_overflow'] = true;
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
            LzSprite.__styleNames.borderRadius = 'MozBorderRadius';
            LzSprite.__styleNames.boxShadow = 'MozBoxShadow';
            LzSprite.__styleNames.userSelect = 'MozUserSelect';
            // https://developer.mozilla.org/en/CSS/-moz-transform
            LzSprite.__styleNames.transform = 'MozTransform';
            LzSprite.__styleNames.transformOrigin = 'MozTransformOrigin';

            // DOM operations on blurring element break focus (LPP-7786)
            // https://bugzilla.mozilla.org/show_bug.cgi?id=481468
            //quirks['dom_breaks_focus'] = true;
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
                defaultStyles.lzswftext.lineHeight = '119%';
                defaultStyles.lzswfinputtext.lineHeight = '119%';
                defaultStyles.lzswfinputtextmultiline.lineHeight = '119%';
            } else if (browser.version < 4) {
                // Firefox 3.0 does not need padding added onto field height measurements
                if (browser.subversion < 6) {
                    // no longer needed as of 3.0.6 (or maybe earlier...)
                    quirks['text_height_includes_padding'] = true;
                }
                if (browser.version < 3.5) {
                    // See LPP-8402
                    quirks['container_divs_require_overflow'] = true;
                }
            }
            quirks['autoscroll_textarea'] = true;
            if (browser.version >= 3.5) {
                capabilities['rotation'] = true;
            }
            
            if (browser.version >= 3.1) {
                capabilities['dropshadows'] = true;
                capabilities['cornerradius'] = true;
                capabilities['rgba'] = true;
            }
        }

        if (browser.OS == 'Mac') {
            // see LPP-8210
            quirks['detectstuckkeys'] = true;
            // Remap alt/option key also sends control since control-click shows context menu (see LPP-2584 - Lzpix: problem with multi-selecting images in Safari 2.0.4, dhtml)
            quirks['alt_key_sends_control'] = true;
            quirks['match_swf_letter_spacing'] = true;
        }

        // Adjust styles for quirks
        if (quirks['hand_pointer_for_clickable']) {
            defaultStyles.lzclickdiv.cursor = 'pointer';
        }

        if (quirks['inner_html_strips_newlines'] == true) {
            LzSprite.prototype.inner_html_strips_newlines_re = RegExp('$', 'mg');
        }
        
        // Turn off image selection - see LPP-8311
        defaultStyles.lzimg[LzSprite.__styleNames.userSelect] = 'none';

        if (capabilities.rotation) {
            // Rotation's origin in CSS is width/2 and height/2 as default
            defaultStyles.lzdiv[LzSprite.__styleNames.transformOrigin] = '0 0';
        }

        // See LPP-8696
        if (quirks['inputtext_use_background_image']) {
            defaultStyles.lzinputtext['background'] = defaultStyles.lzswfinputtext['background'] = defaultStyles.lzswfinputtextmultiline['background'] = 'url(' + LzSprite.blankimage + ')';
        }

        LzSprite.prototype.br_to_newline_re = RegExp('<br/>', 'mg');

        if (lz.BrowserUtils.hasFeature('mouseevents', '2.0')) {
            quirks['has_dom2_mouseevents'] = true;
        }

        if (quirks['match_swf_letter_spacing']) {
            defaultStyles.lzswftext.letterSpacing = defaultStyles.lzswfinputtext.letterSpacing = defaultStyles.lzswfinputtextmultiline.letterSpacing = '0.025em';
        }
    }
    // Make quirks available as a sprite property
    LzSprite.prototype.quirks = quirks;
};

/* Calculates width of browser scrollbar */
LzSprite._getScrollbarWidth = function () {
    // Create an offscreen div
   var div = document.createElement('div');
   div.style.width = "50px";
   div.style.height = "50px";
   div.style.overflow = "hidden";
   div.style.position = "absolute";
   div.style.top = "-200px";
   div.style.left = "-200px";

   var div2 = document.createElement('div')
   div2.style.height = '100px';
   div.appendChild(div2);

   var body = document.body;
   body.appendChild(div);
   // Compute width
   var w1 = div.clientWidth;
   // Turn on overflowY = scroll
   div.style.overflowY = 'scroll';
   // Compute new width with scrollbar visible
   var w2 = div.clientWidth;
   LzSprite.prototype.__discardElement(div);
   // return the difference
   return (w1 - w2);
}


/* Update the quirks on load */
LzSprite.__updateQuirks();

/**
 * The canvas fills the root container.  To resize the canvas, we
 * resize the root container.
 *
 * @access private
 */
LzSprite.setRootX = function (v) {
    var rootcontainer = LzSprite.__rootSpriteContainer;
    rootcontainer.style.position = 'absolute';
    rootcontainer.style.left = LzSprite.prototype.CSSDimension(v);
    // Simulate a resize event so canvas sprite size gets updated
    LzScreenKernel.__resizeEvent();
}

/**
 * The canvas fills the root container.  To resize the canvas, we
 * resize the root container.
 *
 * @access private
 */
LzSprite.setRootWidth = function (v) {
    LzSprite.__rootSpriteContainer.style.width = LzSprite.prototype.CSSDimension(v);
    // Simulate a resize event so canvas sprite size gets updated
    LzScreenKernel.__resizeEvent();
}

/**
 * The canvas fills the root container.  To resize the canvas, we
 * resize the root container.
 *
 * @access private
 */
LzSprite.setRootY = function (v) {
    var rootcontainer = LzSprite.__rootSpriteContainer;
    rootcontainer.style.position = 'absolute';
    rootcontainer.style.top = LzSprite.prototype.CSSDimension(v);
    // Simulate a resize event so canvas sprite size gets updated
    LzScreenKernel.__resizeEvent();
}

/**
 * The canvas fills the root container.  To resize the canvas, we
 * resize the root container.
 *
 * @access private
 */
LzSprite.setRootHeight = function (v) {
    LzSprite.__rootSpriteContainer.style.height = LzSprite.prototype.CSSDimension(v);
    // Simulate a resize event so canvas sprite size gets updated
    LzScreenKernel.__resizeEvent();
}

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
LzSprite.blankimage = 'lps/includes/blank.gif';
LzSprite.prototype.resource = null;
LzSprite.prototype.source = null;
LzSprite.prototype.visible = null;
LzSprite.prototype.text = null;
LzSprite.prototype.clip = null;
LzSprite.prototype.stretches = null;
LzSprite.prototype.resourceWidth = null;
LzSprite.prototype.resourceHeight = null;
LzSprite.prototype.cursor = null;
/** Set to a value that won't match the cache but is still a sensible default
  * @access private
  */
LzSprite.prototype._w = '0pt';
/** Set to a value that won't match the cache but is still a sensible default
  * @access private
  */
LzSprite.prototype._h = '0pt';
/**
  * @access private
  */
LzSprite.prototype.__LZcontext = null;

/**
  * @access protected
  */
LzSprite.prototype.initted = false;

/** Must be called when the sprite should show itself, usually after the 
  * owner is done initializing 
  */
LzSprite.prototype.init = function(v) {
    //Debug.write('init', this.visible, this.owner.getUID());
    this.setVisible(v);
    if (this.isroot) {
        if (this.quirks['css_hide_canvas_during_init']) {
            var cssname = 'display';
            if (this.quirks['safari_visibility_instead_of_display']) {
                cssname = 'visibility';
            }
            this.__LZdiv.style[cssname] = '';
            if (this.quirks['fix_clickable']) this.__LZclickcontainerdiv.style[cssname] = '';
            if (this.quirks['fix_contextmenu']) this.__LZcontextcontainerdiv.style[cssname] = '';
        }

        // Register the canvas for callbacks
        if (this._id) {
            lz.embed[this._id]._ready(this.owner);
        }
    }
    this.initted = true;
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

/**
  * @access private
  */
if ($debug) {
    LzSprite.__warnonce = {};
}

LzSprite.prototype.addChildSprite = function(sprite) {
    if (sprite.__parent != null) return;
    //Debug.info('appendChild', sprite.__LZdiv);
    if ($debug) {
        if (this.stretches != null && LzSprite.__warnonce.stretches != true) {
            Debug.warn("Due to limitations in the DHTML runtime, stretches will only apply to the view %w, and doesn't affect child views.", this.owner);
            LzSprite.__warnonce.stretches = true;
        }
        if (this.color != null && LzSprite.__warnonce.colorcascade != true) {
            Debug.warn("Due to limitations in the DHTML runtime, color will only apply to the view %w, and doesn't affect child views.", this.owner);
            LzSprite.__warnonce.colorcascade = true;
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
        if (this.quirks.use_css_sprites) {
            if (this.quirks.use_css_master_sprite && res.spriteoffset != null) {
                this.__csssprite = LzSprite.__masterspriteurl;
                this.__cssspriteoffset = res.spriteoffset;
            } else if (res.sprite) {
                this.__csssprite = this.getBaseUrl(res) + res.sprite;
                this.__cssspriteoffset = 0;
            }
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
    return LzSprite.__rootSprite.options[resource.ptype == 'sr' ? 'serverroot' : 'approot']
}

/**
 * Handy alias
 * @access private
 */
LzSprite.prototype.CSSDimension = LzKernelUtils.CSSDimension;

LzSprite.prototype.loading = false;
LzSprite.prototype.setSource = function (url, usecache){
    if (url == null || url == 'null') {
        this.unload();
        return;
    }
    if (this.quirks.size_blank_to_zero) {
        if (this.__sizedtozero && url != null) {
            this.__restoreSize();
        }
    }
    if (usecache == 'reset') {
        usecache = false;
    } else if (usecache != true){
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

    
    if (this.backgroundrepeat) {
        this.__createIMG();
        this.__setBGImage(url);
        this.__updateBackgroundRepeat();
        this.owner.resourceload({width: this.resourceWidth, height: this.resourceHeight, resource: this.resource, skiponload: this.skiponload});
        return;
    } else if (this.stretches == null && this.__csssprite) {
        this.__createIMG();
        this.__updateStretches();
        this.__setBGImage(this.__csssprite);
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
    // Set to allow clipping, when backgroundImage/__csssprite is used
    if (this.cornerradius != null) {
        im.style[LzSprite.__styleNames.borderRadius] = this.cornerradius;
    }
}

LzSprite.prototype.__setBGImage = function (url){
    if (this.__LZimg) {
        var bgurl = url ? "url('" + url + "')" : null;
        this.__bgimage = this.__LZimg.style.backgroundImage = bgurl
    }
    if (bgurl != null) {
        var y = -this.__cssspriteoffset || 0; 
        this.__LZimg.style.backgroundPosition = '0px ' + y + 'px';
    }
}

LzSprite.prototype.__createIMG = function (){
    if (! this.__LZimg) {
        var im = document.createElement('img');
        im.className = 'lzdiv';
        im.owner = this;
        im.src = LzSprite.blankimage;
        this.__bindImage(im);
    }
}

/**
  * @access private
  */
if (LzSprite.quirks.ie_alpha_image_loader) {
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
                this.__LZclick.src = LzSprite.blankimage;
            } else {
                this.__LZclick = document.createElement('div');
            }
            this.__LZclick.owner = this;
            this.__LZclick.className = 'lzclickdiv';
            this.applyCSS('width', this._w, '__LZclick');
            this.applyCSS('height', this._h, '__LZclick');
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
                var clickstyle = c && this.visible ? '' : 'none'
                this.applyCSS('display', clickstyle, '__LZclickcontainerdiv');
                this.applyCSS('display', clickstyle, '__LZclick');
            } else {
                this.applyCSS('display', c ? '' : 'none', '__LZclick');
            }
        }
    } else {
        if (this.quirks.fix_clickable) {
            if (! this.__LZclick) {
                if (this.quirks.fix_ie_clickable) {
                    this.__LZclick = document.createElement('img');
                    this.__LZclick.src = LzSprite.blankimage;
                } else {
                    this.__LZclick = document.createElement('div');
                }
                this.__LZclick.owner = this;
                this.__LZclick.className = 'lzclickdiv';
                this.applyCSS('width', this._w, '__LZclick');
                this.applyCSS('height', this._h, '__LZclick');
                //this.__LZclick.style.backgroundColor = '#ff00ff';
                //this.__LZclick.style.opacity = .2;
                this.__LZclickcontainerdiv.appendChild(this.__LZclick);
            }
            this.__setClickable(c, this.__LZclick);
            if (this.quirks.fix_ie_clickable) {
                this.applyCSS('display', c && this.visible ? '' : 'none', '__LZclick');
            } else {
                this.applyCSS('display', c ? '' : 'none', '__LZclick');
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
        div.onmouseover = f;
        div.onmouseout = f;
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

    // Skip context menu events. They should be handled by LzMouseKernel
    if (e.button == 2) return false;

    this.owner.__mouseEvent(e);
    return false;
}

/**
  * @access private
  * tracks whether the mouse is currently down on this sprite for onmouseupoutside events
  */
LzSprite.prototype.__mouseisdown = false;

/**
  * Processes mouse events and forwards into the view system
  * @access private
  */
LzSprite.prototype.__mouseEvent = function(e , artificial){
    if (artificial) {
        var eventname = e;
        e = {};
    } else {
        var eventname = 'on' + e.type;
        // send option/shift/ctrl key events
        if (LzKeyboardKernel && LzKeyboardKernel['__updateControlKeys']) {
            LzKeyboardKernel.__updateControlKeys(e);

            if (LzKeyboardKernel.__cancelKeys) {
                  e.cancelBubble = true;
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

    // Update coordinates
    LzMouseKernel.__sendMouseMove(e);

    if (eventname == 'onmousemove') {
        // already sent by __sendMouseMove
        return;   
    } else if (eventname == 'onmousedown') {
        // track which sprite the mouse went down on
        this.__mouseisdown = true;
        LzMouseKernel.__lastMouseDown = this;
        // blur any focused inputtexts - see LPP-8475
        var focusedsprite = LzInputTextSprite.prototype.__focusedSprite;
        if (focusedsprite && focusedsprite != this) {
            focusedsprite.deselect();
        }
    } else if (eventname == 'onmouseup') {
        // allow bubbling to LzMouseKernel so LzSprite__globalmouseup() can find out about onmouseupoutside
        e.cancelBubble = false;

        // Skip onmouseup if mouse button didn't go down on this sprite
        if (LzMouseKernel.__lastMouseDown !== this) {
            return;
        } else {
            // the mouse went up on this sprite
            if (this.quirks.ie_mouse_events) {
                // Must be done for onmouseupoutside to work
                if (this.__isMouseOver()) {
                    this.__mouseisdown = false;
                }
            } else {
                this.__mouseisdown = false;
            }
            if (this.__mouseisdown == false) {
                LzMouseKernel.__lastMouseDown = null;
            }
        }
    } else if (eventname == 'onmouseupoutside') {
        this.__mouseisdown = false;
    } else if (eventname == 'onmouseover') {
        LzMouseKernel.__lastMouseOver = this;

        if (this.quirks.activate_on_mouseover) {
            var activationdiv = LzSprite.__mouseActivationDiv;
            if (! activationdiv.mouseisover) {
                // enable keyboard/mouse events
                activationdiv.onmouseover();
            }
        }
    }

    //Debug.write('__mouseEvent', eventname, this.owner);
    if (this.owner.mouseevent) {
        // handle onmouseover/out/dragin/dragout events differently if the mouse button is currently down
        if (LzMouseKernel.__lastMouseDown) {
            if (eventname == 'onmouseover' || eventname == 'onmouseout') {
                var sendevents = false;
                if (this.quirks.ie_mouse_events) {
                    // send events if the mouse is over this sprite
                    var over = this.__isMouseOver();
                    if ((over && eventname == 'onmouseover') || (! over && eventname == 'onmouseout')) {
                        sendevents = true;
                    }
                } else {
                    // send events if the mouse went down on this sprite
                    if (LzMouseKernel.__lastMouseDown === this) {
                        sendevents = true;
                    }
                }

                // stored so we can send onmouseover after the mouse button goes up - see LPP-8445
                if (eventname == 'onmouseover') {
                    LzMouseKernel.__lastMouseOver = this;
                } else if (sendevents && LzMouseKernel.__lastMouseOver === this) {
                    LzMouseKernel.__lastMouseOver = null;
                }

                if (sendevents) {
                    LzMouseKernel.__sendEvent(eventname, this.owner);
                    var dragname = eventname == 'onmouseover' ? 'onmousedragin' : 'onmousedragout';
                    LzMouseKernel.__sendEvent(dragname, this.owner);
                }
                return;
            }
        }

        if (this.quirks.fix_clickable && (! LzMouseKernel.__globalClickable)) {
            // NOTE: [2008-08-17 ptw] (LPP-8375) When the mouse goes
            // over an html clickdiv, globalClickable gets disabled,
            // which generates a mouseout -- we want to ignore that.
            // Simlutaneously, the mouse enters the associated iframe,
            // which will forward a mouseover to us, but we already
            // got one, so, we want to ignore that too.  The global
            // mouseout handler will synthesize a mouseout event for
            // the html sprite when the mouse leaves the iframe and
            // re-enables the clickdiv.
            // NOTE: [2010-01-11 max] (LPP-8308) This change was preventing
            // inputtexts from getting onmouseover events, so test to 
            // be sure the mouse event isn't from an inputtext-generated
            // event.
            if (lz['html'] && this.owner && (this.owner is lz.html) && ((eventname == 'onmouseout') || (eventname == 'onmouseover'))) {
                //Debug.error('skipping', eventname);
                return;
            }
        }

        // Send the event
        LzMouseKernel.__sendEvent(eventname, this.owner);
    }
}

LzSprite.prototype.__isMouseOver = function ( e ){
    var p = this.getMouse();
    // Note pixels are 0-based, so width and height are exclusive limits
    var visible = this.__findParents('visible', false);
    if (visible.length) return false;
    return p.x >= 0 && p.y >= 0 && p.x < this.width && p.y < this.height;
}

/**
  * Called by LzMouseKernel when mouse goes up on another sprite
  * @access private
  */
LzSprite.prototype.__globalmouseup = function ( e ){
    if (this.__mouseisdown) {
        // the onmouseup event was already sent in IE
        if (! this.quirks.ie_mouse_events) {
            this.__mouseEvent(e);
        }
        // send artificial onmouseupoutside event
        this.__mouseEvent('onmouseupoutside', true);
    }
    LzMouseKernel.__lastMouseDown = null;

    //Debug.info('__globalmouseup', LzMouseKernel.__lastMouseOver, e);
    if (LzMouseKernel.__lastMouseOver) {
        // send artificial onmouseover event - see LPP-8445
        LzMouseKernel.__lastMouseOver.__mouseEvent('onmouseover', true);
        LzMouseKernel.__lastMouseOver = null;
    }
}

LzSprite.prototype.xoffset = 0;
LzSprite.prototype._xoffset = 0;
LzSprite.prototype.setX = function ( x ){
    if (x == null || (x == this.x && this._xoffset == this.xoffset)) return;
    this.__poscacheid = -1;
    this._xoffset = this.xoffset;
    this.x = x;
    x = this.CSSDimension(x + this.xoffset);
    if (this._x != x) {
        this._x = x;
        this.__LZdiv.style.left = x;
        if (this.quirks.fix_clickable) {
            this.__LZclickcontainerdiv.style.left = x;
        }
        if (this.quirks.fix_contextmenu && this.__LZcontextcontainerdiv) {
            this.__LZcontextcontainerdiv.style.left = x;
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
        var size = w;
        var quirks = this.quirks;
        // set size to zero if we don't have either of these
        if (quirks.size_blank_to_zero) {
            if (this.bgcolor == null && this.source == null && ! this.clip && ! (this instanceof LzTextSprite) && ! this.shadow && ! this.borderwidth) {
                this.__sizedtozero = true;
                size = '0px';
            }
        }
        this.applyCSS('width', size);
        if (this.clip) this.__updateClip();
        if (this.stretches) this.__updateStretches();
        if (this.backgroundrepeat) this.__updateBackgroundRepeat();
        if (this.__LZclick) this.applyCSS('width', w, '__LZclick');
        if (this.__LZcontext) this.applyCSS('width', w, '__LZcontext');
        if (this.__LZcanvas) this.__resizecanvas();
        if (this.isroot && quirks.container_divs_require_overflow) {
            LzSprite.__rootSpriteOverflowContainer.style.width = w;
        }
        return w;
    }
}

LzSprite.prototype.yoffset = 0;
LzSprite.prototype._yoffset = 0;
LzSprite.prototype.setY = function ( y ){
    //Debug.info('setY', y);
    if (y == null || (y == this.y && this._yoffset == this.yoffset)) return;
    this.__poscacheid = -1;
    this.y = y;
    this._yoffset = this.yoffset;
    y = this.CSSDimension(y + this.yoffset);
    if (this._y != y) {
        this._y = y;
        this.__LZdiv.style.top = y;
        if (this.quirks.fix_clickable) {
            this.__LZclickcontainerdiv.style.top = y;
        }
        if (this.quirks.fix_contextmenu && this.__LZcontextcontainerdiv) {
            this.__LZcontextcontainerdiv.style.top = y;
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
        var size = h;
        var quirks = this.quirks;
        // set size to zero if we don't have either of these
        if (quirks.size_blank_to_zero) {
            if (this.bgcolor == null && this.source == null && ! this.clip && ! (this instanceof LzTextSprite) && ! this.shadow && ! this.borderwidth) {
                this.__sizedtozero = true;
                size = '0px';
            }
        }
        this.applyCSS('height', size);
        if (this.clip) this.__updateClip();
        if (this.stretches) this.__updateStretches();
        if (this.backgroundrepeat) this.__updateBackgroundRepeat();
        if (this.__LZclick) this.applyCSS('height', h, '__LZclick');
        if (this.__LZcontext) this.applyCSS('height', h, '__LZcontext');
        if (this.__LZcanvas) this.__resizecanvas();
        if (this.isroot && quirks.container_divs_require_overflow) {
            LzSprite.__rootSpriteOverflowContainer.style.height = h;
        }
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
    if (this.visible === v) return;
    //Debug.info('setVisible', v, this.owner.getUID());
    this.visible = v;
    this.applyCSS('display', (v && this.opacity != 0) ? '' : 'none');
    if (this.quirks.fix_clickable) {
        if (this.quirks.fix_ie_clickable && this.__LZclick) {
            this.applyCSS('display', v && this.clickable ? '' : 'none', '__LZclick');
        }
        var vis = v ? '' : 'none';
        this.applyCSS('display', vis, '__LZclickcontainerdiv');
        if (this.quirks.fix_contextmenu && this.__LZcontextcontainerdiv) {
            this.applyCSS('display', vis, '__LZcontextcontainerdiv');
        }
    }
}

LzSprite.prototype.setColor = function ( c ){
    if (this.color === c) return;
    this.color = c;
    this.__LZdiv.style.color = LzColorUtils.inttohex(c);
}

LzSprite.prototype.setBGColor = function ( c ){
    if (c != null && ! this.capabilities.rgba) {
        c = Math.floor(c);
    }
    if (this.bgcolor == c) return;
    this.bgcolor = c;
    if (this.quirks.size_blank_to_zero) {
        if (this.__sizedtozero && c != null) {
            this.__restoreSize();
        }
    }
    this.__LZdiv.style.backgroundColor = c == null ? 'transparent' : LzColorUtils.torgb(c);
    if (this.quirks.fix_ie_background_height) {
        if (this.height != null && this.height < 2) {
            this.setSource(LzSprite.blankimage, true);
        } else if (! this._fontSize) {
            this.__LZdiv.style.fontSize = '0px';
        }
    }
    //Debug.info('setBGColor ' + c);
}

LzSprite.prototype.__restoreSize = function() {
    if (this.__sizedtozero) {
        // restore size of div
        this.__sizedtozero = false;
        this.applyCSS('width', this._w);
        this.applyCSS('height', this._h);
    }
}

// IE-only, used to manage multiple DX filters, e.g. shadow and opacity
LzSprite.prototype.__filters = null;
LzSprite.prototype.setFilter = function(name, value) {
    if (this.__filters == null) {
        this.__filters = {};
    }
    this.__filters[name] = value;

    var filterstr = '';
    for (var i in this.__filters) {
        filterstr += this.__filters[i];
    }
    return filterstr;
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
        this.applyCSS('display', (this.visible && o != 0) ? '' : 'none');

        if (this.quirks.ie_opacity) {
            this.__LZdiv.style.filter = this.setFilter('opacity', o == 1 ? '' : "alpha(opacity=" + parseInt(o * 100) + ")" );
        } else {
            this.__LZdiv.style.opacity = o == 1 ? '' : o;
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

if (LzSprite.quirks.preload_images_only_once) {
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

/** Find parent sprites with a set value - nearest parents are first in the array
  * @access private
  */
LzSprite.prototype.__findParents = function(prop, value) {
    var parents = [];
    var root = LzSprite.__rootSprite;
    var sprite = this;
    while (sprite && sprite !== root) {
        if (sprite[prop] == value) parents.push(sprite);
        sprite = sprite.__parent;
    }
    return parents;
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
    
    // Tell the view about the load event.
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
    var sprites = this.__findParents('visible', false);
    //Debug.info('LzSprite.onload', i, i.width, i.height, sprites);
    var l = sprites.length;
    // show all parents
    for (var n = 0; n < l; n++) {
        sprites[n].__LZdiv.style.display = '';
    }

    // call passed-in method with optional args
    var args = Array.prototype.slice.call(arguments, 1);
    var result = method.apply(this, args);

    // restore original display values from CSS cache
    for (var n = 0; n < l; n++) {
        var sprite = sprites[n];
        sprite.__LZdiv.style.display = sprite.__csscache.__LZdivdisplay;
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
    if (LzSprite.quirks.preload_images_only_once) {
        LzSprite.prototype.__preloadurls[url] = null;
    }
}

/**
  * @access private
  * Clears events registered on an image
  */
LzSprite.prototype.__clearImageEvents = function (img) {
    if (! img || img.__cleared) return;
    if (LzSprite.quirks.ie_alpha_image_loader) {
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
        if (LzSprite.quirks.ie_alpha_image_loader) {
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
    if (LzSprite.quirks.ie_alpha_image_loader) {
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
            this.owner.__imgtimoutid = setTimeout(callback, LzSprite.medialoadtimeout);
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
        im.className = 'lzimg';
        // show again in onload
        if (! skiploader) im.style.display = 'none'
        if (this.owner && skiploader != true) {
            //Debug.info('sizer', skiploader == true, skiploader != true, skiploader);
            im.owner = this.owner;
            im.onload = lz.BrowserUtils.getcallbackfunc(this.owner, '__imgonload', [im]);
            im.onerror = lz.BrowserUtils.getcallbackfunc(this.owner, '__imgonerror', [im]);
            var callback = lz.BrowserUtils.getcallbackfunc(this.owner, '__imgontimeout', [im]);
            this.owner.__imgtimoutid = setTimeout(callback, LzSprite.medialoadtimeout);

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
    if (this.quirks.size_blank_to_zero) {
        if (this.__sizedtozero && c) {
            this.__restoreSize();
        }
    }
    this.__updateClip();
}

/**
  * @access private
  */
LzSprite.prototype.__updateClip = function() {
    var quirks = this.quirks;
    if (this.isroot && this.quirks.canvas_div_cannot_be_clipped) return;
    if (this.clip && this.width != null && this.width >= 0 && this.height != null && this.height >= 0) {
        var s = 'rect(0px ' + this._w + ' ' + this._h + ' 0px)';
        this.__LZdiv.style.clip = s
    } else if (this.__LZdiv.style.clip) {
        var s = quirks.fix_ie_css_syntax ? 'rect(auto auto auto auto)' : '';
        this.__LZdiv.style.clip = s;
    } else {
        // return so we don't set the containers
        return;
    }

    if (quirks.fix_clickable) {
        this.__LZclickcontainerdiv.style.clip = s;
    }
    if (quirks.fix_contextmenu && this.__LZcontextcontainerdiv) {
        this.__LZcontextcontainerdiv.style.clip = s;
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
    var quirks = this.quirks;
    if (quirks.ie_alpha_image_loader) return;
    var img = this.__LZimg;
    if (img) {
        if (quirks.show_img_before_changing_size) {
            var imgstyle = img.style;
            var olddisplay = imgstyle.display;
            imgstyle.display = 'none';
        }
        if (this.stretches == 'both') {
            img.width = this.width;
            img.height = this.height;
        } else if (this.stretches == 'height') {
            img.width = this.resourceWidth;
            img.height = this.height;
        } else if (this.stretches == 'width') {
            img.width = this.width;
            img.height = this.resourceHeight;
        } else {
            img.width = this.resourceWidth;
            img.height = this.resourceHeight;
        }
        if (quirks.show_img_before_changing_size) {
            imgstyle.display = olddisplay;
        }
    }

}

LzSprite.prototype.predestroy = function() {
}

LzSprite.prototype.destroy = function( parentvalid = true ) {
    if (this.__LZdeleted == true) return;
    // To keep delegates from resurrecting us.  See LzDelegate#execute
    this.__LZdeleted = true;

    if (parentvalid) {
      // Remove from parent if the parent is not going to be GC-ed
      if (this.__parent) {
        var pc = this.__parent.__children;
        for (var i = pc.length - 1; i >= 0; i--) {
          if (pc[i] === this) {
            pc.splice(i, 1);
            break;
          }
        }
      }
    }

    // images are big...
    if (this.__ImgPool) this.__ImgPool.destroy();
    if (this.__LZimg) this.__discardElement(this.__LZimg);

    // skip discards if the parent isn't valid
    this.__skipdiscards = parentvalid != true;

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
    if (this.__LZcontextcontainerdiv) {
        this.__discardElement(this.__LZcontextcontainerdiv);
    }
    if (this.__LZcontext) {
        this.__discardElement(this.__LZcontext);
    }
    if (this.__LZtextdiv) {
        this.__discardElement(this.__LZtextdiv);
    }
    if (this.__LZcanvas) {
        if (this.quirks.ie_leak_prevention) {
            // http://blogs.msdn.com/gpde/pages/javascript-memory-leak-detector.aspx complains about these properties
            this.__LZcanvas.owner = null;
            this.__LZcanvas.getContext = null;
        }
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
    return {x: LzMouseKernel.__x - p.x, y: LzMouseKernel.__y - p.y};
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
    if (! LzSprite.__rootSprite.initted) {
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
    this.__LZclick.style.cursor = LzSprite.__defaultStyles.hyphenate(c);
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

LzSprite.prototype.getDisplayObject = function ( ){
    return this.__LZdiv;
}

// A reference to the html 5 canvas object
LzSprite.prototype.__LZcanvas = null;

LzSprite.prototype.getContext = function (){
    if (this.__LZcanvas && this.__LZcanvas.getContext) {
        return this.__LZcanvas.getContext("2d");
    }

    var canvas = document.createElement('canvas');
    canvas.owner = this;
    // do we need to do this?
    //canvas.setAttribute('id', canvasuid);

    this.__LZcanvas = canvas;
    canvas.className = 'lzgraphicscanvas';
    // make sure we're behind any children
    if (this.__LZdiv.firstChild) {
        this.__LZdiv.insertBefore(canvas, this.__LZdiv.firstChild);
    } else {
        this.__LZdiv.appendChild(canvas);
    }
    lz.embed.__setAttr(canvas, 'width', this.width);
    lz.embed.__setAttr(canvas, 'height', this.height);
    
    // update the cornerradius of the canvas object, to allow clipping
    if (this.cornerradius != null) {
        canvas.style[LzSprite.__styleNames.borderRadius] = this.cornerradius;
    }

    if (lz.embed.browser.isIE) {
        // IE can take a while to init
        this.__maxTries = 10;
        this.__initcanvasie();
    } else {
        return canvas.getContext("2d");
    }
  }
  
// Set the callback for canvas initialization
LzSprite.prototype.setContextCallback = function (callbackscope, callbackname){
    this.__canvascallbackscope = callbackscope;
    this.__canvascallbackname = callbackname;
}


LzSprite.prototype.bringToFront = function() {
    if (! this.__parent) {
        if ($debug) {
            Debug.warn('bringToFront with no parent');
        }
        return;
    }

    var c = this.__parent.__children;
    if (c.length < 2) return;
    c.sort(LzSprite.prototype.__zCompare);

    this.sendInFrontOf(c[c.length - 1]);
}

/**
  * @access private
  */
LzSprite.prototype.__setZ = function(z) {
    this.__LZdiv.style.zIndex = z;
    var quirks = this.quirks;
    if (quirks.fix_clickable) {
        this.__LZclickcontainerdiv.style.zIndex = z;
    }
    if (quirks.fix_contextmenu && this.__LZcontextcontainerdiv) {
        this.__LZcontextcontainerdiv.style.zIndex = z;
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
    if (! behindSprite || behindSprite === this) return;
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
    if (! frontSprite || frontSprite === this) return;
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

    var url = this.frames[this.frame - 1];
    if (this.backgroundrepeat) {
        this.__setBGImage(url);
        this.__updateBackgroundRepeat();
    } else if (this.stretches == null && this.__csssprite) {
        // use x axis for now...
        if (! this.__bgimage) {
            this.__createIMG();
            this.__setBGImage(this.__csssprite);
        }
        var x = (this.frame - 1) * (- this.resourceWidth);
        var y = -this.__cssspriteoffset || 0; 
        this.__LZimg.style.backgroundPosition = x + 'px ' + y + 'px';
        //Debug.write('frame', f, x, y, this.__LZdiv.style.backgroundPosition)
    } else {
        // from __updateFrame()    
        this.setSource(url, true);
    }
    if (skipevent) return;
    this.owner.resourceevent('frame', this.frame);
    if (this.frames.length == this.frame)
        this.owner.resourceevent('lastframe', null, true);
}

/** Overridden when LzSprite.quirks.ie_leak_prevention == true
  * @access private
  */
LzSprite.prototype.__discardElement = function (element) {
    if (this.__skipdiscards) return;
    if (element.parentNode) element.parentNode.removeChild(element);
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
    if (! this.quirks.fix_contextmenu || this.__LZcontext) return;
    // build up context menu tree lazily

    // find parents with __LZcontextcontainerdiv == null
    var sprites = this.__findParents('__LZcontextcontainerdiv', null);
    //console.log('found sprites', sprites, 'for', this);

    // create containers root first
    for (var i = sprites.length - 1; i >= 0; i--) {
        var sprite = sprites[i];
        //console.log('found sprite', sprite);
        // the parent must have a container div
        var parentcontainer = sprite.__parent.__LZcontextcontainerdiv;
        // create contextmenu container
        var cxdiv = document.createElement('div');
        cxdiv.className = 'lzdiv';
        parentcontainer.appendChild(cxdiv);

        this.__copystyles(sprite.__LZdiv, cxdiv);
        // set id, if we have one...
        if (sprite._id && !cxdiv.id) {
            cxdiv.id = 'context' + sprite._id;
        }
        cxdiv.owner = sprite;
        sprite.__LZcontextcontainerdiv = cxdiv;
    }
    // create contextmenu div
    var cxdiv = document.createElement('div');
    cxdiv.className = 'lzcontext';
    this.__LZcontextcontainerdiv.appendChild(cxdiv);
    this.__LZcontext = cxdiv;
    this.applyCSS('width', this._w, '__LZcontext');
    this.applyCSS('height', this._h, '__LZcontext');
    cxdiv.owner = this;
}

/**
  * Copies relevant styles from one div to another, e.g. a container div
  * @access private
  */
LzSprite.prototype.__copystyles = function(from, to) {
    to.style.left = from.style.left;
    to.style.top = from.style.top;
    to.style.display = from.style.display;
    to.style.clip = from.style.clip;
    to.style.zIndex = from.style.zIndex;
}

/**
* LzView.getContextMenu
* Return the current context menu
*/
LzSprite.prototype.getContextMenu = function() {
    return this.__contextmenu;
}

LzSprite.prototype.setRotation = function(r) {    
    var browser = lz.embed.browser;
    if (browser.isSafari || browser.isFirefox) {
        this.__LZdiv.style[LzSprite.__styleNames.transform] = 'rotate(' + r + 'deg)';
    }
}

LzSprite.prototype.backgroundrepeat = null;
LzSprite.prototype.tilex = false;
LzSprite.prototype.tiley = false;
LzSprite.prototype.setBackgroundRepeat = function(backgroundrepeat) {
    if (this.backgroundrepeat == backgroundrepeat) return;
    var x = false;
    var y = false;
    if (backgroundrepeat == 'repeat') {
        x = y = true;
    } else if (backgroundrepeat == 'repeat-x') {
        x = true;
    } else if (backgroundrepeat == 'repeat-y') {
        y = true;
    }
    this.tilex = x;
    this.tiley = y;
    this.backgroundrepeat = backgroundrepeat;
    if (! this.__LZimg) this.__createIMG();
    this.__updateBackgroundRepeat();
    if (backgroundrepeat) {
        this.__setBGImage(this.source);
        this.__LZimg.src = LzSprite.blankimage;
    } else {
        if (this.__bgimage) this.__setBGImage(null);
        // reset to default 
        backgroundrepeat = '';
        this.skiponload = true;
        this.setSource(this.source, 'reset');
    }
    this.__LZdiv.style.backgroundRepeat = backgroundrepeat;
}

LzSprite.prototype.__updateBackgroundRepeat = function() {
    if (this.__LZimg) {
        this.__LZimg.style.backgroundRepeat = this.backgroundrepeat;
        this.__LZimg.style.backgroundPosition = '0px 0px';
        this.__LZimg.width = this.backgroundrepeat ? this.width : this.resourceWidth;
        this.__LZimg.height = this.backgroundrepeat ? this.height : this.resourceHeight;
    }
}

if (LzSprite.quirks.ie_leak_prevention) {
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

    // Overridden 'specially ie_leak_prevention
    LzSprite.prototype.__discardElement = function (element) {
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
    }
}

// Get any selected text
LzSprite.prototype.getSelectedText = function () {
    if (window.getSelection) { // FF/Safari/Opera/Chrome
        return window.getSelection().toString();
    } else if (document.selection) { // IE7
        return document.selection.createRange().text.toString();
    } else if (document.getSelection) { // others
        return document.getSelection();
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
        // annotate divs with sprite IDs, but don't override existing IDs!
        if (!this.__LZdiv.id) this.__LZdiv.id = 'sprite_' + this.uid;
        // Safari reader only speaks labels which have a 'for' attribute
        lz.embed.__setAttr(aadiv, 'for', this.__LZdiv.id);
        this.__LZdiv.appendChild(aadiv);
    }
    aadiv.innerHTML = s;
}


/** Turns accessibility on/off if accessible == true and a screen reader is active 
  * @param Boolean accessible
  */
LzSprite.prototype.setAccessible = function(accessible) {
    // TODO [hqm 2009-06] also need to check LzBrowserKernel.isAAActive() when it is working
    LzSprite.__rootSprite.accessible = accessible;
}

    
/**
 * @access private
 * A cache of accessibility properties
 */
LzSprite.prototype._accProps = null;
    
    
/**
* Activate/inactivate children for accessibility
* @param Boolean s: If true, activate the current view and all of its children
*/
LzSprite.prototype.setAAActive = function( s ){
    this.__LzAccessibilityActive = s;
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
  * Set the main sprite's div focus() so a screen reader will read it.
  */
LzSprite.prototype.aafocus = function( ){
    try {
        if  (this.__LZdiv != null) {
            this.__LZdiv.blur();
            this.__LZdiv.focus();
        }
    } catch (e) {
    }
}

/**
 * Set accessibility tab order
 * @param number s: The tab order index for this view.  Must be a unique number.
 */
LzSprite.prototype.setAATabIndex = function( s ){
    // Not yet implemented
}

/**
  * See view.sendAAEvent()
  */
LzSprite.prototype.sendAAEvent = function(childID, eventType, nonHTML){
    try {
        if  (this.__LZdiv != null) {
            this.__LZdiv.focus();
        }
    } catch (e) {
    }
}

LzSprite.prototype.setID = function(id){
    if (!this._id) this._id = id;
    if (!this.__LZdiv.id) this.__LZdiv.id = this._dbg_typename + id;
    if (!this.__LZclickcontainerdiv.id) this.__LZclickcontainerdiv.id = 'click' + id;
    if (this.__LZcontextcontainerdiv && ! this.__LZcontextcontainerdiv.id) this.__LZcontextcontainerdiv.id = this.__LZcontextcontainerdiv.id = 'context' + id;
}

LzSprite.prototype.__resizecanvas = function() {
    if (this.width > 0 && this.height > 0) {
        if (this.__LZcanvas) {
            lz.embed.__setAttr(this.__LZcanvas, 'width', this.width);
            lz.embed.__setAttr(this.__LZcanvas, 'height', this.height);
            // resize, which will clear the canvas
            this.__docanvascallback();
        }
        if (this.__LZcanvas && this['_canvashidden']) {
            this._canvashidden = false;
            this.applyCSS('display', '', '__LZcanvas');
        }
    } else if (this.__LZcanvas && this['_canvashidden'] != true) {
        this._canvashidden = true;
        this.applyCSS('display', 'none', '__LZcanvas');
    }
}

LzSprite.prototype.__docanvascallback = function() {
    var callback = this.__canvascallbackscope[this.__canvascallbackname];
    if (callback) {
        callback.call(this.__canvascallbackscope, this.__LZcanvas.getContext("2d"));
    }
}

// IE can take a while to init...
LzSprite.prototype.__initcanvasie = function() {
    // IE can take a while to start up.
    if (this.__canvasTId) clearTimeout(this.__canvasTId);
    try {
        if (this.__LZcanvas && this.__LZcanvas.parentNode != null) {
            this.__LZcanvas = G_vmlCanvasManager.initElement(this.__LZcanvas);
            this.__docanvascallback();
            return;
        }
    } catch (e) {
    }
    if (--this.__maxTries > 0) {
        var callback = lz.BrowserUtils.getcallbackstr(this, '__initcanvasie');
        this.__canvasTId = setTimeout(callback, 50);
    }
}

// Shared by LzSprite and LzTextSprite
LzSprite.prototype.__getShadowCSS = function(shadowcolor, shadowdistance, shadowangle, shadowblurradius) {
    if (shadowcolor == null || (shadowdistance == 0 && shadowblurradius == 0)) {
        return '';
    }
    if (this.capabilities.minimize_opacity_changes) {
        shadowdistance = Math.round(shadowdistance);
        shadowblurradius = Math.round(shadowblurradius);
        shadowangle = Math.round(shadowangle);
    }

    if (this.quirks.use_filter_for_dropshadow) {
        // Use glow filter
        if (shadowdistance == 0) {
            // update x and y offsets to compensate for glow
            this.xoffset = this.yoffset = -shadowblurradius;
            this.applyCSS('left', this.x + this.xoffset);
            this.applyCSS('top', this.y + this.yoffset);
            if (shadowblurradius > 0) {
                var hexcolor = LzColorUtils.inttohex(shadowcolor);
                return "progid:DXImageTransform.Microsoft.Glow(Color='" + hexcolor + "',Strength=" + shadowblurradius + ")";
            }
        } else {
            // to match Flash
            shadowangle += 90;
            var hexcolor = LzColorUtils.inttohex(shadowcolor);
            return "progid:DXImageTransform.Microsoft.Shadow(Color='" + hexcolor + "',Direction=" + shadowangle + ",Strength=" + shadowdistance + ")";
        }
    } else {
        // CSS3 doesn't use angle, but x/y offset. So we need to
        // translate from angle and distance to x and y offset for CSS3.
        // Math.cos and Math.cos are based on radians, not degrees
        var radians = shadowangle * Math.PI/180;
        var xoffset = this.CSSDimension(Math.cos(radians) * shadowdistance);
        var yoffset = this.CSSDimension(Math.sin(radians) * shadowdistance);
        // convert to rgb(x,x,x);
        var rgbcolor = LzColorUtils.torgb(shadowcolor);
        return rgbcolor + " " + xoffset + " " + yoffset + " " + this.CSSDimension(shadowblurradius);
    }
}

LzSprite.prototype.shadow = null;
LzSprite.prototype.updateShadow = function(shadowcolor, shadowdistance, shadowangle, shadowblurradius) {
    var newshadow = this.__getShadowCSS(shadowcolor, shadowdistance, shadowangle, shadowblurradius);
    if (newshadow === this.shadow) return;
    this.shadow = newshadow;

    if (this.quirks.use_filter_for_dropshadow) {
        this.__LZdiv.style.filter = this.setFilter('shadow', newshadow);
    } else {
        var cssname = LzSprite.__styleNames.boxShadow;
        // use the canvas div where available
        if (this.__LZcanvas) {
            // clear out any old shadow style
            this.__LZdiv.style[cssname] = '';
            this.__LZcanvas.style[cssname] = newshadow;
        } else {
            this.__LZdiv.style[cssname] = newshadow;
        }
    }

    if (this.quirks.size_blank_to_zero) {
        if (this.__sizedtozero) {
            this.__restoreSize();
        }
    }
}

LzSprite.prototype.cornerradius = null;
LzSprite.prototype.setCornerRadius = function(radius) {
    var radius = radius > 0 ? this.CSSDimension(radius) : '';
    this.cornerradius = radius;
    var stylename = LzSprite.__styleNames.borderRadius;
    this.__LZdiv.style[stylename] = radius;
    if (this.__LZclick) {
        this.__LZclick.style[stylename] = radius;
    }
    if (this.__LZcontext) {
        this.__LZcontext.style[stylename] = radius;
    }
    if (this.__LZcanvas) {
        this.__LZcanvas.style[stylename] = radius;
    }
    if (this.__LZimg) {
        this.__LZimg.style[stylename] = radius;
    }
}

// A hash of CSS values, stored with the key divname + stylename, e.g.
// this.__csscache.__LZdivheight === '550px';
LzSprite.prototype.__csscache;
LzSprite.prototype.setCSS = function(name, value, isdimension) {
    if (isdimension) value = this.CSSDimension(value);
    //Debug.warn('setCSS', name, value);
    var callback = this['set_' + name];
    if (callback) {
        callback.call(this, value);
    } else {
        this.applyCSS(name, value);
        if (this.quirks.fix_clickable) {
            this.applyCSS(name, value, '__LZclickcontainerdiv');
        }
        if (this.quirks.fix_contextmenu && this.__LZcontextcontainerdiv) {
            this.applyCSS(name, value, '__LZcontextcontainerdiv');
        }
    }
}

//LzSprite.prototype.csshit = {count: 0};
//LzSprite.prototype.cssmiss = {count: 0};

// Applies a style value to a div.
// TODO: consider batching misses and setting all at once
LzSprite.prototype.applyCSS = function(name, value, divname) {
    if (! divname) divname = '__LZdiv';

    var key = divname + name;
    var cache = this.__csscache;
    if (cache[key] === value) {
//        var csshit = LzSprite.prototype.csshit;
//        if (csshit[key] == null) {
//            csshit[key] = 0;
//        } else {
//            csshit[key]++;
//        }
//        csshit.count++;
        return;
    }

//    var cssmiss = LzSprite.prototype.cssmiss;
//    if (cssmiss[key] == null) {
//        cssmiss[key] = 0;
//    } else {
//        cssmiss[key]++;
//    }
//    cssmiss.count++;
    
    // Look the div up by name, then get its style object
    var styleobject = this[divname].style;
    // update cache and div style object
    cache[key] = styleobject[name] = value;
}

LzSprite.prototype.set_borderColor = function(color) {
    if (color == null) color = '';
    this.__LZdiv.style.borderColor = color;
}

LzSprite.prototype.borderwidth = 0;
LzSprite.prototype.set_borderWidth = function(width) {
    if (this.borderwidth === width) return;
    this.borderwidth = width;
    if (this.quirks.size_blank_to_zero) {
        if (this.__sizedtozero && width != null) {
            this.__restoreSize();
        }
    }
    if (width == 0) {
        width = '';
    }
    this.__LZdiv.style.borderWidth = width;
    // make sure these match the size of the __LZdiv to catch clicks
    if (this.__LZclick) {
        this.__LZclick.style.borderWidth = width;
    }
    if (this.__LZcontext) {
        this.__LZcontext.style.borderWidth = width;
    }
    // Don't apply to __LZcanvas or the __LZimg because they're contained by 
    // __LZdiv
}

LzSprite.medialoadtimeout = 30000;
LzSprite.setMediaLoadTimeout = function(ms){
    LzSprite.medialoadtimeout = ms;
}

LzSprite.setMediaErrorTimeout = function(ms){
    // not needed since we reliably get load errors for images
}

// End pragma
}
