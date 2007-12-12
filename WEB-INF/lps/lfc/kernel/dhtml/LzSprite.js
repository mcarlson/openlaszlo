/**
  * LzSprite.js
  *
  * @copyright Copyright 2007 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic DHTML
  * @author Max Carlson &lt;max@openlaszlo.org&gt;
  */

var LzSprite = function(owner, isroot) {
    if (owner == null) return;
    if (isroot) {
        this.isroot = true;
        LzSprite.__rootSprite = this;
        var div = document.createElement('div');
        div.className = 'lzcanvasdiv';

        // grab values stored by Lz.dhtmlEmbed()
        var p = Lz.__propcache;
        var root = p.appenddiv;

        if (p.bgcolor) {
            div.style.backgroundColor = p.bgcolor; 
            this.bgcolor = p.bgcolor; 
        }
        if (p.width) {
            root.style.width = p.width; 
            div.style.width = p.width; 
            var w = p.width.indexOf('%') != -1 ? p.width : parseInt(p.width);
            this._w = w;
            this.width = w;
        }
        if (p.height) {
            root.style.height = p.height; 
            div.style.height = p.height; 
            var h = p.height.indexOf('%') != -1 ? p.height : parseInt(p.height);
            this._h = h;
            this.height = h;
        }
        if (p.id) {
            this._id = p.id;
        }
        if (this.quirks.canvas_div_cannot_be_clipped  == false && p.width && p.width.indexOf('%') == -1 && p.height && p.height.indexOf('%') == -1 ) {
            div.style.clip = 'rect(0px ' + this._w + ' ' + this._h + ' 0px)';
            div.style.overflow = 'hidden';
        }
        root.appendChild(div);
        this.__LZdiv = div;

        if (this.quirks.fix_clickable) {
            var cdiv = document.createElement('div');
            cdiv.className = 'lzcanvasclickdiv';
            root.appendChild(cdiv);
            this.__LZclickdiv = cdiv;
        }
    } else {
        this.__LZdiv = document.createElement('div');
        this.__LZdiv.className = 'lzdiv';
        if (this.quirks.fix_clickable) {
            this.__LZclickdiv = document.createElement('div');
            this.__LZclickdiv.className = 'lzdiv';
        }
    }
    this.__LZdiv.owner = this;
    if (this.quirks.fix_clickable) {
        this.__LZclickdiv.owner = this;
    }

    this.owner = owner;
    this.uid = LzSprite.prototype.uid++;
    if (this.quirks.ie_leak_prevention) {
        this.__sprites[this.uid] = this;
    }
    //Debug.debug('new LzSprite', this.__LZdiv, this.owner);
}

/**
  * @access private
  */
LzSprite.prototype.__defaultStyles = {
    lzdiv: {
        position: 'absolute'
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
    // LzTextSprite.js and LzInputTextSprite.js defaults should reflect these
    lztext: {
        fontFamily: 'Verdana,Vera,sans-serif',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '11px',
        whiteSpace: 'normal',
        position: 'absolute'
    },
    lzswftext: {
        fontFamily: 'Verdana,Vera,sans-serif',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '11px',
        whiteSpace: 'normal',
        position: 'absolute',
        paddingTop: '2px',
        paddingLeft: '2px'
    },
    lzinputtext: {
        fontFamily: 'Verdana,Vera,sans-serif',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '11px',
        width: '100%',
        height: '100%',
        borderWidth: 0,
        backgroundColor: 'transparent'
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
        marginTop: '1px',
        marginLeft: '2px'
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
        marginTop: '2px',
        marginLeft: '2px'
    },
    writeCSS: function() {
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
LzSprite.prototype.__defaultStyles['#lzcontextmenu a'] = {
   color: '#000',
   display: 'block',
   textDecoration: 'none'
};
LzSprite.prototype.__defaultStyles['#lzcontextmenu a:hover'] = {
   color: '#FFF',
   backgroundColor: '#333'
};
LzSprite.prototype.__defaultStyles['#lzcontextmenu'] = {
    position: 'absolute',
    zIndex: 10000000,
    backgroundColor: '#CCC',
    border: '1px outset #999',
    padding: '4px',
    fontFamily: 'Verdana,Vera,sans-serif',
    fontSize: '13px',
    margin: '2px',
    color: '#999'
};

LzSprite.prototype.uid = 0;

LzSprite.prototype.quirks = {
    fix_clickable: true
    ,fix_ie_background_height: false
    ,fix_ie_clickable: false
    ,ie_alpha_image_loader: false
    ,ie_leak_prevention: false
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
    ,minimize_opacity_changes: false
    ,set_height_for_multiline_inputtext: false
    ,ie_opacity: false
    ,text_measurement_use_insertadjacenthtml: false
}

LzSprite.prototype.capabilities = {
    rotation: false
    // Scale canvas to percentage values
    ,scalecanvastopercentage: true
    ,readcanvassizefromsprite: true
    ,opacity: true
    ,colortransform: false
    ,audio: false
    ,accessibility: false
    ,htmlinputtext: false
    ,advancedfonts: false
}

LzSprite.prototype.__updateQuirks = function(){
    if (window['Lz'] && Lz.__BrowserDetect) {
        Lz.__BrowserDetect.init();
        if (this.quirks['inner_html_strips_newlines'] == true) {
            LzSprite.prototype.inner_html_strips_newlines_re = RegExp('$', 'mg');
        }

        // Divs intercept clicks if physically placed on top of an element
        // that's not a parent. See LPP-2680.
        // off for now
        //this.quirks['fix_clickable'] = true;
        if (Lz.__BrowserDetect.isIE) {
            if (Lz.__BrowserDetect.version < 7) {
                // Provide IE PNG/opacity support
                this.quirks['ie_alpha_image_loader'] = true;
            } else {
                this.quirks['invisible_parent_image_sizing_fix'] = true;
            }

            this.quirks['ie_opacity'] = true;

            // IE DOM leak prevention
            this.quirks['ie_leak_prevention'] = true;

            // Use images to force click tree to work in IE
            this.quirks['fix_ie_clickable'] = true;

            // workaround for IE refusing to respect divs with small heights when
            // no image is attached
            this.quirks['fix_ie_background_height'] = true;

            // workaround for IE not supporting &apos; in innerHTML
            this.quirks['inner_html_no_entity_apos'] = true;

            // workaround for IE not supporting clip in divs containing inputtext
            this.quirks['inputtext_parents_cannot_contain_clip'] = true;

            // flag for components (basefocusview for now) to minimize opacity changes
            this.quirks['minimize_opacity_changes'] = true;

            // multiline inputtext height must be set directly - height: 100% does not work.  See LPP-4119
            this.quirks['set_height_for_multiline_inputtext'] = true;

            // text size measurement uses insertAdjacentHTML()
            this.quirks['text_measurement_use_insertadjacenthtml'] = true;
        } else if (Lz.__BrowserDetect.isSafari) {
            // Fix bug in where if any parent of an image is hidden the size is 0
            // TODO: Tucker claims this is fixed in the latest version of webkit
            this.quirks['invisible_parent_image_sizing_fix'] = true;

            // Remap alt/option key also sends control since control-click shows context menu (see LPP-2584 - Lzpix: problem with multi-selecting images in Safari 2.0.4, dhtml)
            this.quirks['alt_key_sends_control'] = true;

            // Safari scrollHeight needs to subtract scrollbar height
            this.quirks['safari_textarea_subtract_scrollbar_height'] = true;

            // Safari doesn't like clipped or placed input text fields.
            this.quirks['safari_avoid_clip_position_input_text'] = true;
            // Safari won't show canvas tags whose parent is display: none
            this.quirks['safari_visibility_instead_of_display'] = true;
            this.quirks['absolute_position_accounts_for_offset'] = true;
            this.quirks['canvas_div_cannot_be_clipped'] = true;
            if (Lz.__BrowserDetect.version > 523.10) {
                this.capabilities['rotation'] = true;
            }
        } else if (Lz.__BrowserDetect.isOpera) {
            // Fix bug in where if any parent of an image is hidden the size is 0
            this.quirks['invisible_parent_image_sizing_fix'] = true;
            this.quirks['no_cursor_colresize'] = true;
            this.quirks['absolute_position_accounts_for_offset'] = true;
            this.quirks['canvas_div_cannot_be_clipped'] = true;
        } else if (Lz.__BrowserDetect.isFirefox && Lz.__BrowserDetect.version < 2) {
                // see http://groups.google.ca/group/netscape.public.mozilla.dom/browse_thread/thread/821271ca11a1bdbf/46c87b49c026246f?lnk=st&q=+focus+nsIAutoCompletePopup+selectedIndex&rnum=1
                this.quirks['firefox_autocomplete_bug'] = true;
            }
        }

    if (this.quirks['safari_avoid_clip_position_input_text']) {
        LzSprite.prototype.__defaultStyles.lzswfinputtext.marginTop = '-2px';
        LzSprite.prototype.__defaultStyles.lzswfinputtext.marginLeft = '-2px';
        LzSprite.prototype.__defaultStyles.lzswfinputtextmultiline.marginTop = '-2px';
        LzSprite.prototype.__defaultStyles.lzswfinputtextmultiline.marginLeft = '-2px';
    }

    if (this.quirks['css_hide_canvas_during_init']) {
        if (this.quirks['safari_visibility_instead_of_display']) {
            LzSprite.prototype.__defaultStyles.lzcanvasdiv.visibility = 'hidden';
        } else {
            LzSprite.prototype.__defaultStyles.lzcanvasdiv.display = 'none';
        }
        LzSprite.prototype.__defaultStyles.lzcanvasclickdiv.display = 'none';
    }

    if (this.quirks['hand_pointer_for_clickable']) {
        LzSprite.prototype.__defaultStyles.lzclickdiv.cursor = 'pointer';
    }
}
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
LzSprite.prototype.blankimage = lzOptions.ServerRoot + '/lps/includes/blank.gif';
LzSprite.prototype.resource = null;
LzSprite.prototype.source = null;
LzSprite.prototype.visible = null;
LzSprite.prototype.text = null;
LzSprite.prototype.clip = null;
LzSprite.prototype.stretches = null;
LzSprite.prototype.resourceWidth = null;
LzSprite.prototype.resourceHeight = null;
LzSprite.prototype.cursor = null;

LzSprite.prototype.init = function(v) {
    //Debug.write('init', this.visible, this.owner.getUID());
    this.setVisible(v);
    if (this.isroot) {
        if (this.quirks['safari_visibility_instead_of_display']) {
            this.__LZdiv.style.visibility = 'visible';
        }
        if (this._id) {
            Lz[this._id]._ready(this.owner);
        }
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
        this.__LZclickdiv.appendChild( sprite.__LZclickdiv );
    }

    sprite.__setZ(++this.__topZ);
}

LzSprite.prototype.setResource = function ( r ){
    if (this.resource == r) return;
    if ( r.indexOf('http:') == 0 || r.indexOf('https:') == 0){
        this.skiponload = false;
        this.setSource( r );
        this.resource = r;
        return;
    }

    this.resource = r;

    // look up resource name in LzResourceLibrary
    // LzResourceLibrary is in the format:
    // LzResourceLibrary.lzscrollbar_xthumbleft_rsc={ptype:"ar"||"sr",frames:["lps/components/lz/resources/scrollbar/scrollthumb_x_lft.png"],width:1.0,height:12.0}

    var res = LzResourceLibrary[r];
    if (! res) {
        if ($debug) {
            Debug.warn('Could not find resource', r);
        }
        return;
    }
    var urls = res.frames;

    //this.owner.onimload.sendEvent({width: res.width, height: res.height});
    this.resourceWidth = res.width;
    this.resourceHeight = res.height;
    this.skiponload = true;

    //Update the view's totalframes
    this.owner.setTotalFrames (urls.length);

    // It could be a multi-frame resource. Take first frame.
    var url = urls[0];
    if (url) {
        this.baseurl = '';
        if (res.ptype) {
            if (res.ptype == 'sr') {
                this.baseurl = lzOptions.ServerRoot + '/';
            }
            //Debug.write('ptype', res.ptype, this.baseurl);
        }

        this.frames = urls;
        this.__preloadFrames();
        this.setSource(url, true);
    } else {
        this.setSource(r, true);
    }
    //Debug.info('setResource ', r, this.frames)
}

LzSprite.prototype.CSSDimension = function (value, units) {
    return Math.floor(value) + (units ? units : 'px');
}

LzSprite.prototype.loading = false;
LzSprite.prototype.setSource = function (url, indirect){
    if (indirect != true){
        this.skiponload = false;
    }

    //Debug.info('setSource ' + url)
    this.loading = true;
    this.source = url;
    if (! this.__ImgPool) {
        this.__ImgPool = new LzPool(LzSprite.prototype.__getImage, LzSprite.prototype.__gotImage, LzSprite.prototype.__destroyImage, this);
    }
    var im = this.__ImgPool.get(url);

    if (this.__LZimg) {
        this.__LZdiv.replaceChild(im, this.__LZimg);
        this.__LZimg = im;
    } else {
        this.__LZimg = im;
        this.__LZdiv.appendChild(this.__LZimg);
    }
    if (this.stretches) this.__updateStretches();
    if (this.clickable) this.setClickable(true);

    if (this.quirks.ie_alpha_image_loader) {
        this.__updateIEAlpha(im);
    }
}

/**
  * @access private
  */
if (LzSprite.prototype.quirks.ie_alpha_image_loader) {
/**
  * @access private
  */
    LzSprite.prototype.__updateIEAlpha = function(who) {
        if (who._hasax == true) return;
        //who._hasax = true;
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
            w = (this.width == null) ? '100%' : this.width;
        if (h == null)
            h = (this.height == null) ? '100%' : this.height;

        if (w == null || h == null) return;
        who.style.width = w;
        who.style.height = h;
    }
}

LzSprite.prototype.setFontName = function ( val ,prop ){
    this.fontname = val;
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
                this.__LZclick.src = LzSprite.prototype.blankimage;
            } else {
                this.__LZclick = document.createElement('div');
            }
            this.__LZclick.owner = this;
            this.__LZclick.className = 'lzclickdiv';
            this.__LZclick.style.width = this.__LZdiv.style.width;
            this.__LZclick.style.height = this.__LZdiv.style.height;
            if (this.quirks.fix_clickable) {
                this.__LZclickdiv.appendChild(this.__LZclick);
            } else {
                this.__LZdiv.appendChild(this.__LZclick);
            }
        }
        //Debug.info('clickable', this.__LZclick, c, this.__LZclick.style.width, this.__LZclick.style.height);
        this.__setClickable(c, this.__LZclick);
        if (this.quirks.fix_clickable) {
            if (this.quirks.fix_ie_clickable) {
                //note: views with resources (__LZimg!) cannot have subviews (SWF-policy)
                this.__LZclickdiv.style.display = c && this.visible ? '' : 'none';
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
                    this.__LZclick.src = LzSprite.prototype.blankimage;
                } else {
                    this.__LZclick = document.createElement('div');
                }
                this.__LZclick.owner = this;
                this.__LZclick.className = 'lzclickdiv';
                this.__LZclick.style.width = this.__LZdiv.style.width;
                this.__LZclick.style.height = this.__LZdiv.style.height;
                //this.__LZclick.style.backgroundColor = '#ff00ff';
                //this.__LZclick.style.opacity = .2;
                this.__LZclickdiv.appendChild(this.__LZclick);
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
LzSprite.prototype.__setClickable = function(c, who) {
    if (who._clickable == c) return;
    who._clickable = c;
    if (c) {
        var f = LzSprite.prototype.__clickDispatcher;
        // must capture the owner in a closure... this is bad for IE 6
        who.onclick = f;
        who.onmouseover = f;
        who.onmouseout = f;
        // Prevent context menus in Firefox 1.5 - see LPP-2678
        who.onmousedown = f;
        who.onmouseup = f;
        if (this.quirks.fix_ie_clickable) {
            who.ondrag = f;
        }
    } else {
        who.onclick = null;
        who.onmouseover = null;
        who.onmouseout = null;
        who.onmousedown = null;
        who.onmouseup = null;
        if (this.quirks.fix_ie_clickable) {
            who.ondrag = null;
        }
    }
}

/**
  * @access private
  * dispatches click events
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
LzSprite.prototype.__mouseEvent = function ( e ){
    if (LzKeyboardKernel && LzKeyboardKernel['__keyboardEvent']) LzKeyboardKernel.__keyboardEvent(e);
    var skipevent = false;
    var eventname = 'on' + e.type;
    if (window['LzInputTextSprite'] && eventname == 'onmouseover' && LzInputTextSprite.prototype.__lastshown != null) LzInputTextSprite.prototype.__hideIfNotFocused();
    if (eventname == 'onmousedown') {
        // cancel mousedown event bubbling...
        e.cancelBubble = true;
        this.__mousedown = true;
        if (window['LzMouseKernel']) LzMouseKernel.__lastMouseDown = this;
    } else if (eventname == 'onmouseup') {
        e.cancelBubble = false;
        if (window['LzMouseKernel'] && LzMouseKernel.__lastMouseDown == this) {
            this.__mousedown = false;
            LzMouseKernel.__lastMouseDown = null;
        } else {
            skipevent = true;
        }
    }

    //Debug.write('__mouseEvent', eventname, this.owner);
    if (skipevent == false && this.owner.mouseevent && LzModeManager && LzModeManager['handleMouseButton']) {
        LzModeManager.handleMouseButton(this.owner, eventname);

        if (this.__mousedown) {
            if (eventname == 'onmouseover') {
                LzModeManager.handleMouseButton(this.owner, 'onmousedragin');
            } else if (eventname == 'onmouseout') {
                LzModeManager.handleMouseButton(this.owner, 'onmousedragout');
            }
        }
    }
}

// called by LzMouseKernel when mouse goes up on another sprite
/**
  * @access private
  */
LzSprite.prototype.__globalmouseup = function ( e ){
    if (this.__mousedown) {
        this.__mouseEvent(e);
        this.__mouseEvent({type: 'mouseupoutside'});
    }
}

LzSprite.prototype.setX = function ( x ){
    if (x == null || x == this.x || isNaN(x)) return;
    this.__poscachedirty = true;
    this.x = x;
    x = this.CSSDimension(x);
    if (this._x != x) {
        this._x = x;
        this.__LZdiv.style.left = x;
        if (this.quirks.fix_clickable) {
            this.__LZclickdiv.style.left = x;
        }
    }
}

LzSprite.prototype.setWidth = function ( w ){
    if (w == null || w < 0 || isNaN(w) || this.width == w) return;

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
    if (y == null || y == this.y || isNaN(y)) return;
    this.__poscachedirty = true;
    this.y = y;
    y = this.CSSDimension(y);
    if (this._y != y) {
        this._y = y;
        this.__LZdiv.style.top = y;
        if (this.quirks.fix_clickable) {
            this.__LZclickdiv.style.top = y;
        }
    }
}

LzSprite.prototype.setHeight = function ( h ){
    if (h == null || h < 0 || isNaN(h) || this.height == h) return;

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

/**
  * @access private
  */
LzSprite.prototype.__LZsetClickRegion = function ( cr ){
//STUB
    if ($debug) {
        Debug.warn('click regions are not currently implemented in dhtml.');
    }
}

LzSprite.prototype.setVisible = function ( v ){
    if (this.visible == v) return;
    //Debug.info('setVisible', v, this.owner.getUID());
    this.visible = v;
    this.__LZdiv.style.display = v ? 'block' : 'none';
    if (this.quirks.fix_clickable) {
        if (this.quirks.fix_ie_clickable && this.__LZclick) {
            this.__LZclick.style.display = v && this.clickable ? '' : 'none';
        }
        this.__LZclickdiv.style.display = v ? 'block' : 'none';
    }
}

LzSprite.prototype.setColor = function ( c ){
    if (this.color == c) return;
    this.color = c;
    this.__LZdiv.style.color = LzUtils.color.inttohex(c);
}

LzSprite.prototype.setBGColor = function ( c ){
    if (this.bgcolor == c) return;
    this.bgcolor = c;
    this.__LZdiv.style.backgroundColor = c == null ? 'transparent' : LzUtils.color.inttohex(c);
    if (this.quirks.fix_ie_background_height) {
        if (this.height != null && this.height < 2) {
            this.setSource(LzSprite.prototype.blankimage, true);
        } else if (! this._fontSize) {
            this.__LZdiv.style.fontSize = '0px';
        }
    }
    //Debug.info('setBGColor ' + c);
}

LzSprite.prototype.setOpacity = function ( o ){
    if (this.opacity == o || o < 0) return;
    //Debug.info('setOpacity', o);
    this.opacity = o;
    o = parseInt(o * 100) / 100;
    if (o != this._opacity) { 
        this._opacity = o;
        if (o == 0) {
            this.__LZdiv.style.display = 'none';
            this._opacitywas0 = true;
        } else if (this._opacitywas0) {
            this._opacitywas0 = false;
            this.__LZdiv.style.display = 'block';
        }

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
    if (isNaN(f * 1) == false) {
        //Debug.info('play ' + f + ', ' + this.frame);
        this.__setFrame(f);
    }
    if (this.playing == true) return;

    if (this.frames && this.frames.length > 1) {
        this.playing = true;
        this.owner.resourceevent('play', null, true);
        LzIdleKernel.addCallback(this, '__incrementFrame');
    }
}

LzSprite.prototype.stop = function(f) {
    if (this.playing == true) {
        this.playing = false;
        this.owner.resourceevent('stop', null, true);
        LzIdleKernel.removeCallback(this, '__incrementFrame');
    }

    if (isNaN(f * 1) == false) {
        //Debug.info('stop ' + f + ', ' + this.frame);
        this.__setFrame(f);
    }
}

/**
  * @access private
  */
LzSprite.prototype.__incrementFrame = function() {
    this.frame++;
    if (this.frames && this.frame > this.frames.length) {
        //Debug.info(this.frame + ', ' + this.resource.length);
        this.frame = 1;
    }
    this.__updateFrame();
}

/**
  * @access private
  */
LzSprite.prototype.__updateFrame = function(force) {
    if (this.playing || force) {
        var url = this.frames[this.frame - 1];
        //Debug.info('__updateFrame', this.frame, url, this.owner);
        this.setSource(url, true);
    }
    this.owner.resourceevent('frame', this.frame);
    if (this.frames.length == this.frame)
        this.owner.resourceevent('lastframe', null, true);
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
        var im = this.__ImgPool.get(src, true);
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
    var sprite = this;
    if (sprite[prop] != null) out.push(sprite);
    do {
        sprite = sprite.__parent;
        if (! sprite) return out;
        if (sprite[prop] != null) out.push(sprite);
        //alert(sprite);
    } while (sprite != LzSprite.__rootSprite)
    return out;
}

/**
  * @access private
  */
LzSprite.prototype.__imgonload = function(i) {
    if (this.loading != true) return;
    if (this.__imgtimoutid != null) clearTimeout(this.__imgtimoutid);
    this.__imgtimoutid = null;
    this.loading = false;
    this.resourceWidth = i.width;
    this.resourceHeight = i.height;
    if (LzSprite.prototype.quirks.invisible_parent_image_sizing_fix && this.resourceWidth == 0) {
        // This or any parent divs who aren't visible measure 0x0
        // Make this and all parents visible, measure them, then restore their
        // state
        var sprites = this.__findParents('visible');
        //Debug.info('LzSprite.onload', i, i.width, i.height, sprites);
        if (sprites.length > 0) {
            var vals = [];
            var l = sprites.length;
            for (var n = 0; n < l; n++) {
                var v = sprites[n];
                vals[n] = v.__LZdiv.style.display;
                v.__LZdiv.style.display = 'block';
            }
            this.resourceWidth = i.width;
            this.resourceHeight = i.height;
            for (var n = 0; n < l; n++) {
                var v = sprites[n];
                v.__LZdiv.style.display = vals[n];
            }
        }
    }
    //TODO: Tear down filtered image and set to new size?

    if (this.stretches) this.__updateStretches();
    i.__lastcondition = '__imgonload';
    this.owner.resourceload({width: this.resourceWidth, height: this.resourceHeight, resource: this.resource, skiponload: this.skiponload});
}

/**
  * @access private
  */
LzSprite.prototype.__imgonerror = function(i) {
    if (this.loading != true) return;
    if (this.__LZimg) this.__LZimg.__lastcondition = '__imgonerror';
    if (this.__imgtimoutid != null) clearTimeout(this.__imgtimoutid);
    this.__imgtimoutid = null;
    this.loading = false;
    this.resourceWidth = 1;
    this.resourceHeight = 1;
    if (this.stretches) this.__updateStretches();
    this.owner.resourceloaderror({resource: this.resource});
}

/**
  * @access private
  */
LzSprite.prototype.__imgontimeout = function(i) {
    if (this.loading != true) return;
    if (this.__LZimg) this.__LZimg.__lastcondition = '__imgontimeout';
    this.__imgtimoutid = null;
    this.loading = false;
    this.resourceWidth = 1;
    this.resourceHeight = 1;
    if (this.stretches) this.__updateStretches();
    this.owner.resourceloadtimeout({resource: this.resource});
}

// These three methods are called by the image pool
/**
  * @access private
  */
LzSprite.prototype.__destroyImage = function (url, img) {
    if (img && img.owner) {
        if (img.owner.__imgtimoutid != null) {
            clearTimeout(img.owner.__imgtimoutid);
            img.owner.__imgtimoutid = null;
        }
        LzUtils.callback.remove(img.owner);
    }
    if (LzSprite.prototype.quirks.ie_alpha_image_loader && img.sizer) {
        if (img.sizer.tId) clearTimeout(img.sizer.tId);
        LzSprite.prototype.__discardElement(img.sizer);
        img.sizer.onerror = null;
        img.sizer.onload = null;
        img.sizer.onloadforeal = null;
        img.sizer = null;
    } else if (img) {
        img.onerror = null;
        img.onload = null
        LzSprite.prototype.__discardElement(img);
    }
    img = null;
    if (LzSprite.prototype.quirks.preload_images_only_once) {
        LzSprite.prototype.__preloadurls[url] = null;
    }
}

/**
  * @access private
  */
LzSprite.prototype.__gotImage = function(url, obj) {
    //Debug.info('got', url, this.owner.resourceWidth, this.owner.resourceHeight);
    // this is calling the sprite
    this.owner[obj.__lastcondition]({width: this.owner.resourceWidth, height: this.owner.resourceHeight});
}

/**
  * @access private
  */
LzSprite.prototype.__getImage = function(url, skiploader) {
    if (this.owner.baseurl) url = this.owner.baseurl + url;
    //Debug.info('__getImage ', url, skiploader, im)
    //var ispng = url.substr(url.length - 4, url.length) == '.png';
    if (LzSprite.prototype.quirks.ie_alpha_image_loader) {
        var im = document.createElement('div');
        im.style.overflow = 'hidden';
        //Debug.info('filter', im.style.filter, "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + url + "')");

        if (this.owner && skiploader + '' != 'true') {
            //Debug.info('sizer', skiploader, skiploader != true);
            im.owner = this.owner;
            if (! im.sizer) {
                im.sizer = document.createElement('img');
            }
            im.sizer.onload = function() {
                // This resolves all sorts of timing-related image loading bugs
                im.sizer.tId = setTimeout(this.onloadforeal, 1);
            }
            im.sizer.onerror = function() {
                im.owner.__imgonerror(im.sizer);
            }
            im.sizer.onloadforeal = function() {
                im.owner.__imgonload(im.sizer);
            }
            var callback = LzUtils.callback.getcallbackstr(this.owner, '__imgontimeout');
            this.owner.__imgtimoutid = setTimeout(callback, canvas.medialoadtimeout);
            im.sizer.src = url;
        }
        if (this.owner.stretches) {
            im.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + url + "',sizingMethod='scale')";
        } else {
            im.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + url + "')";
        }
    } else {
        var im = document.createElement('img');
        im.className = 'lzdiv';
        if (this.owner && skiploader  + '' != 'true') {
            //Debug.info('sizer', skiploader == true, skiploader != true, skiploader);
            im.owner = this.owner;
            im.onload = LzUtils.callback.getcallbackfunc(this.owner, '__imgonload', [im]);
            im.onerror = LzUtils.callback.getcallbackfunc(this.owner, '__imgonerror', [im]);
            var callback = LzUtils.callback.getcallbackstr(this.owner, '__imgontimeout');
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
    if (this.isroot && this.capabilities.canvas_div_cannot_be_clipped == true) return;
    if (this.clip && this.width != null && this.width >= 0 && this.height != null && this.height >= 0) {
        var s = 'rect(0px ' + this._w + ' ' + this._h + ' 0px)';
        this.__LZdiv.style.clip = s
        if (this.quirks.fix_clickable) {
            this.__LZclickdiv.style.clip = s
        }
    } else if (this.__LZdiv.style.clip) {
        this.__LZdiv.style.clip = 'rect(auto auto auto auto)';
        if (this.quirks.fix_clickable) {
            this.__LZclickdiv.style.clip = 'rect(auto auto auto auto)';
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
    if (this.stretches == s) return;
    //Debug.info('setStretches', s);
    this.stretches = s;
    this.__updateStretches();
}

/**
  * @access private
  */
LzSprite.prototype.__updateStretches = function() {
    if ( this.loading ) return;
    if (this.__LZimg) {
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
    }
}

LzSprite.prototype.predestroy = function() {
}

LzSprite.prototype.destroy = function() {
    if (this.__LZdeleted == true) return;
    // To keep delegates from resurrecting us.  See LzDelegate#execute
    this.__LZdeleted = true;

    // Remove from parent if the parent is not going to be GC-ed
    if (! this.__parent.__LZdeleted) {
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
        this.__LZdiv.onselectstart = null;
        this.__setClickable(false, this.__LZdiv);
        this.__discardElement(this.__LZdiv);
    }
    if (this.__LZinputclickdiv) {
        this.__LZinputclickdiv.onmousedown = null;
        this.__discardElement(this.__LZinputclickdiv);
    }
    if (this.__LZclickdiv) {
        this.__discardElement(this.__LZclickdiv);
    }
    if (this.__LZtextdiv) {
        this.__discardElement(this.__LZtextdiv);
    }
    if (this.__LZcanvas) {
        this.__discardElement(this.__LZcanvas);
    }
    this.__ImgPool = null;
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
        return {x: LzMouseKernel.__x - p.x, y: LzMouseKernel.__y - p.y}
    } else {
        var m = LzSprite.__rootSprite.getMouse()
        return {x: m.x - p.x, y: m.y - p.y}
    }
}

/**
  * @access private
  */
LzSprite.prototype.__poscache = null;
/**
  * @access private
  */
LzSprite.prototype.__poscachedirty = true;
/**
  * @access private
  */
LzSprite.prototype.__getPos = function() {
    // check if any this sprite or any parents are dirty 
    var dirty = false;
    var p = this;
    while (p != this.__rootSprite) {
        if (p.__poscachedirty) {
            dirty = p;
            break;
        }
        p = p.__parent;
    }
    if (dirty == false && this.__poscache) return this.__poscache;

    // compute position
    var el = this.__LZdiv;
    var parent = null;
    var pos = {};
    var box;

    if (Lz.__BrowserDetect.isIE) { // IE
        box = el.getBoundingClientRect();
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        return {x: box.left + scrollLeft, y: box.top + scrollTop};
    } else if (document.getBoxObjectFor) { // gecko
        box = document.getBoxObjectFor(el);
        pos = {x: box.x, y: box.y};
    } else { // safari/opera
        pos = {x: el.offsetLeft, y: el.offsetTop};
        parent = el.offsetParent;
        if (parent != el) {
            while (parent) {
                pos.x += parent.offsetLeft;
                pos.y += parent.offsetTop;
                parent = parent.offsetParent;
            }
        }

        // opera & (safari absolute) incorrectly account for body offsetTop
        if ( this.quirks.absolute_position_accounts_for_offset && this.hasOwnProperty('getStyle') && this.getStyle(el, 'position') == 'absolute' ) {
            pos.y -= document.body.offsetTop;
        }
    }

    if (el.parentNode) {
        parent = el.parentNode;
    } else {
        parent = null;
    }

    while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') {
        pos.x -= parent.scrollLeft;
        pos.y -= parent.scrollTop;

        if (parent.parentNode) {
            parent = parent.parentNode;
        } else {
            parent = null;
        }
    }

    // set this and parents' __poscachedirty to false
    var p = this;
    while (p && p != this.__rootSprite) {
        if (p.__parent) p.__poscachedirty = false;
        p = p.__parent;
    }
    this.__poscache = pos;
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
        this.__LZclickdiv.style.zIndex = z;
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
LzSprite.prototype.__setFrame = function (f){
    if (! this.frames || this.frame == f) return;
    if (f < 1) {
        f = 1;
    } else if (f > this.frames.length) {
        f = this.frames.length;
    }
    //Debug.info('LzSprite.__setFrame', f);
    this.frame = f;
    this.__updateFrame(true);
}

/**
  * @access private
  */
LzSprite.prototype.__discardElement = function (element) {
    if (LzSprite.prototype.quirks.ie_leak_prevention) {
        // Used instead of node.removeChild to eliminate 'pseudo-leaks' in IE - see http://outofhanwell.com/ieleak/index.php?title=Fixing_Leaks
        //alert('__discardElement' + element);
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
    } else {
        if (element.parentNode) element.parentNode.removeChild(element);
    }
}

LzSprite.prototype.getZ = function () {
    return this.__z;
}

LzSprite.prototype.updateResourceSize = function () {
    this.owner.resourceload({width: this.resourceWidth, height: this.resourceHeight, resource: this.resource, skiponload: true});
}

LzSprite.prototype.unload = function () {
    this.resource = null;
    if (this.__ImgPool) {
        this.__ImgPool.destroy();
        this.__ImgPool = null;
    }
    if (this.__LZimg) this.__discardElement(this.__LZimg);
    this.__LZimg = null;
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
    LzMouseKernel.__defaultcontextmenu = cmenu;
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
        var obj = LzTextSprite.prototype._sizedomcache;
        var f = LzSprite.prototype.__discardElement;
        for (var i in obj) {
            f(obj[i]);
        }
        LzTextSprite.prototype._sizedomcache = {};

        var obj = LzSprite.prototype.__sprites;
        for (var i in obj) {
            obj[i].destroy();
            obj[i] = null;
        }
        LzSprite.prototype.__sprites = {};
    }
    Lz.attachEventHandler(window, 'beforeunload', window, '__cleanUpForIE');
}
