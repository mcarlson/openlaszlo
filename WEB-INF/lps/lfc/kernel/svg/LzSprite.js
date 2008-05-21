/**
  * LzSprite.js
  *
  * @copyright Copyright 2007-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic SVG
  */

var LzSprite = function(owner, isroot) {
    if (owner == null) return;

    this.owner = owner;

    var group;
    if (isroot) {
        group = document.getElementById("_canvasrect");
    } else {
        var svg_ns = "http://www.w3.org/2000/svg";
        group = document.createElementNS(svg_ns, "g");
        group.setAttribute('transform', 'translate(0,0)');
        var rect = document.createElementNS(svg_ns, "rect");
        rect.setAttribute("fill", "none");
        this.__LZrect = rect;
        group.appendChild(rect);
    }

    this.__LZgroup = group;

    this.__LZgroup.owner = this;

    this.playDel = new LzDelegate( this , "incrementFrame" );

    this.mouseupdel = new LzDelegate(this, 'globalmouseup');
}

LzSprite.prototype.__LZrect = null;
LzSprite.prototype.__LZimg = null;
LzSprite.prototype.__LZclick = null;
LzSprite.prototype.rotation = 0;
LzSprite.prototype.x = 0;
LzSprite.prototype.y = 0;
LzSprite.prototype.opacity = null;
LzSprite.prototype.width = null;
LzSprite.prototype.height = null;
LzSprite.prototype.playing = false;
LzSprite.prototype.clickable = false;
LzSprite.prototype.frame = 1;
LzSprite.prototype.frames = null;
LzSprite.prototype.resource = null;
LzSprite.prototype.source = null;
LzSprite.prototype.visible = null;
LzSprite.prototype.text = null;
LzSprite.prototype.clip = null;
LzSprite.prototype.stretches = null;
LzSprite.prototype.resourceWidth = null;
LzSprite.prototype.resourceHeight = null;


LzSprite.prototype.setAccessible = function(accessible) { }

LzSprite.prototype.init = function(v) {
    //Debug.write('init', this.visible, this.owner.getUID());
    this.setVisible(v);
}

LzSprite.prototype.__topZ = 1;
LzSprite.prototype.__parent = null;
LzSprite.prototype.__children = null;

LzSprite.prototype.addChildSprite = function(sprite) {
    //Debug.info('appendChild', sprite.__LZrect);
    /*
      alert('addSubview widths parent: ' +  this.owner.name + ":"+this.__LZgroup.getAttribute('width') +
          " <-- " + sprite.owner.name +":"+sprite.__LZgroup.getAttribute('width'));
    */
    this.__LZgroup.appendChild( sprite.__LZgroup );
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
        this.frames = urls;
        //        this.preloadFrames();
        this.setSource(url);
    } else {
        this.setSource(r);
    }
    //Debug.info('setResource ', r, this.frames)
}

LzSprite.prototype.CSSDimension = function (value, units) {
    return Math.floor(value) + (units ? units : 'px');
}

LzSprite.prototype.loading = false;

// <image width="50" height="63"
// xlink:href="images/filters-conv-01-f.includeimage.png"
// x="10" y="30" filter="url(#convolve2)" />
LzSprite.prototype.setSource = function (url){
    //Debug.info('setSource ' + url)
    this.loading = true;
    this.source = url;

    var svg_ns = "http://www.w3.org/2000/svg";
    var xlink_ns = "http://www.w3.org/1999/xlink";
    var im = document.createElementNS(svg_ns, "image");
    im.setAttribute('transform', 'translate(0,0)');
    im.setAttributeNS(xlink_ns, 'href', url);

    if (this.__LZimg) {
        this.__LZrect.replaceChild(im, this.__LZimg);
        this.__LZimg = im;
    } else {
        this.__LZimg = im;
        this.__LZgroup.appendChild(this.__LZimg);
    }

    if (this.clickable) this.setClickable(true);
}


LzSprite.prototype.setClickable = function(c) {
    if (this.clickable == c) return;
    this.clickable = c;
    var rect = this.__LZrect;
    if (c) {
        var __this__ = this;
        this.clickhandler = function (e) {__this__.__mouseEvent(e, 'onclick');}
        rect.addEventListener("click", this.clickhandler, false);
        this.onmouseoverhandler = function (e) { __this__.__mouseEvent(e, 'onmouseover');}
        rect.addEventListener("mouseover", this.onmouseoverhandler, false);
        this.onmouseouthandler = function (e) { __this__.__mouseEvent(e, 'onmouseout');}
        rect.addEventListener("mouseout", this.onmouseouthandler, false);
        this.onmousedownhandler = function (e) { __this__.__mouseEvent(e, 'onmousedown');}
        rect.addEventListener("mousedown", this.onmousedownhandler, false);
        this.onmouseuphandler = function (e) { __this__.__mouseEvent(e, 'onmouseup');}
        rect.addEventListener("mouseup", this.onmouseuphandler, false);

        // [todo hqm 2006-11] Need to add explicit keyup and keydown dispatch here??

    } else {
        rect.removeEventListener("click", this.clickhandler, false);
        this.clickhandler = null;
        rect.removeEventListener("mouseover", this.onmouseoverhandler, false);
        this.onmouseoverhandler = null;
        rect.removeEventListener("mouseout", this.onmouseouthandler, false);
        this.onmouseouthandler = null;
        rect.removeEventListener("mousedown", this.onmousedownhandler, false);
        this.onmousedownhandler = null;
        rect.removeEventListener("mouseup", this.onmouseuphandler, false);
        this.onmouseuphandler = null;
    }
}

LzSprite.prototype.__mouseEvent = function ( e, eventname ){   
    if (LzKeyboardKernel) LzKeyboardKernel.__keyboardEvent(e, eventname);
    var skipevent = false;
    if (eventname == 'onmousedown') {
        // cancel mousedown event bubbling...
        //e.bubbles = false;
        this.__mousedown = true;
        LzMouseKernel.__lastMouseDown = this;
    } else if (eventname == 'onmouseup') {
        //e.bubbles = true;
        if (LzMouseKernel.__lastMouseDown == this) {
            this.__mousedown = false;
            LzMouseKernel.__lastMouseDown = null;
        } else {
            skipevent = true;
        }
    }
    if (skipevent == false && this.owner.mouseevent) lz.ModeManager.handleMouseButton(this.owner, eventname); 
}

// called by LzMouseKernel when mouse goes up on another sprite
LzSprite.prototype.__globalmouseup = function ( e ){
    if (this.__mousedown) {
        this.__mouseEvent(e);
    }
}

LzSprite.prototype.setRotation = function ( r ){
    if (r == null || r == this.r) return;
    this.rotation = r;
    //if (isNaN(r)) return;
    var trn = 'translate('+this.x+','+this.y+') rotate('+this.rotation+')';
     this.__LZgroup.setAttribute('transform', trn);
}

LzSprite.prototype.setX = function ( x ){
    if (x == null || x == this.x) return;
    this.x = x;
    var trn = 'translate('+this.x+','+this.y+') rotate('+this.rotation+')';
     this.__LZgroup.setAttribute('transform', trn);
}


LzSprite.prototype.setY = function ( y ){
    if (y == null || y == this.y) return;
    this.y = y;
    var trn = 'translate('+this.x+','+this.y+') rotate('+this.rotation+')';
     this.__LZgroup.setAttribute('transform', trn);
}

LzSprite.prototype.setWidth = function ( w ){
    if (w == null || w < 0) return;
    /*    if (w.toString().indexOf('%') > -1) {
        var i = w.indexOf('%');
        var p = w.substr(0, i) / 100;
        w = (p * document.body.clientWidth) - 30;
        //Debug.info('perc width', this.width, p, w)
    }
    */
    if (this.width == w) return;
    //Debug.info('setWidth', w);
    this.width = w;
    this.__LZrect.setAttribute('width', w );
    if (this.clip) this.updateClip();
    if (this.stretches) this.updateStretches();
}


LzSprite.prototype.setHeight = function ( h ){
    if (h == null || h < 0) return;
    /*    if (h.toString().indexOf('%') > -1) {
        var i = h.indexOf('%');
        var p = h.substr(0, i) / 100;
        h = (p * document.body.clientHeight) - 30;
        //Debug.info('perc width', this.height, p, h)
        }*/

    if (this.height == h) return;
    this.height = h;
    //Debug.info('setHeight', h, this.height, this.owner);
    this.__LZrect.setAttribute('height', h);
    if (this.clip) this.updateClip();
    if (this.stretches) this.updateStretches();
}



LzSprite.prototype.setMaxLength = function ( v ){
//STUB
}

LzSprite.prototype.setPattern = function ( v ){
//STUB
}

LzSprite.prototype.__LZsetClickRegion = function ( cr ){
//STUB
}

LzSprite.prototype.__LZsetXOffset = function ( xoff ){
//STUB
}

LzSprite.prototype.__LZsetYOffset = function ( yoff ){
//STUB
}

LzSprite.prototype.setVisible = function ( v ){
    //Debug.info('setVisible', v);
    if (this.visible == v) return;
    this.visible = v;
    this.__LZgroup.setAttribute('display', v ? '' : 'none');
}

LzSprite.prototype.setColor = function ( c ){
    if (this.color == c) return;
    this.color = c;
    this.__LZrect.setAttribute("fill", this.getColor(c));
}

//STUB FUNCTION
LzSprite.prototype.setColorTransform = function ( o ){
}


LzSprite.prototype.setBGColor = function ( c ){
    if (this.bgcolor == c) return;
    this.bgcolor = c;
    this.__LZrect.setAttribute("fill", this.getColor(c));
    //Debug.info('setBGColor ' + c);
}

LzSprite.prototype.getColor = function ( c ){
    if (c == null) return 'none';
    if (c == "") return 'none';
    if (typeof c == 'string') {
        c = c * 1;
    }

    if (typeof c == 'number') {
        // convert from decimal to hex
        var hD="0123456789ABCDEF";
        var hex = hD.substr(c&15,1);
        while(c>15) {c>>=4;hex=hD.substr(c&15,1)+hex;}
        var pad = 6 - hex.length;
        while (pad > 0) {
            hex = '0' + hex;
            pad--;
        }
        c = '#' + hex;
    }
    return c;
}

LzSprite.prototype.setOpacity = function ( o ){
    if (this.opacity == o) return;
    //Debug.info('setOpacity', o);
    this.opacity = o;
    this.__LZgroup.setAttribute('fill-opacity', o);
}

LzSprite.prototype.play = function(f) {
    if (isNaN(f * 1) == false) {
        //Debug.info('play ' + f + ', ' + this.frame);
        this.__setFrame(f);
    }
    if (this.playing == true) return;

    if (this.frames && this.frames.length > 1) {
        this.playing = true;
        LzIdleKernel.addCallback(this, '__incrementFrame');
    }
}

LzSprite.prototype.stop = function(f) {
    if (this.playing == true) {
        this.playing = false;
        LzIdleKernel.removeCallback(this, '__incrementFrame');
    }

    if (isNaN(f * 1) == false) {
        //Debug.info('stop ' + f + ', ' + this.frame);
        this.__setFrame(f);
    }
}

LzSprite.prototype.__incrementFrame = function() {
    this.frame++;
    if (this.frames && this.frame > this.frames.length) {
        //Debug.info(this.frame + ', ' + this.resource.length);
        this.frame = 1;
    }
    this.__updateFrame();
}

LzSprite.prototype.__updateFrame = function(force) {
    if (this.playing || force) {
        var url = this.frames[this.frame - 1];
        //Debug.info('__updateFrame', this.frame, url);
        this.setSource(url);
    }
    if (this.owner.frame != this.frame - 1) this.owner.__spriteAttribute('frame', this.frame);
}

LzSprite.prototype.preloadFrames = function() {

}

/**
  * @access private
  */
LzSprite.prototype.__findParents = function ( prop ){
    var o = [];
    var v = this.owner;
    if (v[ prop ] != null ) o.push(v.sprite);
    do {
        var lastv = v;
        var v = v.searchParents(prop);
        if (v) o.push(v.sprite);
        //alert(v);
    } while (v != LzSprite.__rootSprite.owner)    
    return o;
}    

LzSprite.prototype.__gotImage = function(url) {
    //Debug.info('got', url, this.owner.resourceWidth, this.owner.resourceHeight);
    // this is calling the sprite
    this.owner.__imgonload({width: this.owner.resourceWidth, height: this.owner.resourceHeight});
}

LzSprite.prototype.setClip = function(c) {
    if (this.clip == c) return;
    //Debug.info('setClip', c);
    this.clip = c;
    this.updateClip();
}

LzSprite.prototype.updateClip = function() {
    /* NYI
    if (this.clip && this.width && this.height) {
        //Debug.info('setClip', 'group(0px ' + this.width + 'px ' + this.height + 'px 0px)');
        this.__LZgroup.style.clip = 'group(0px ' + this.width + 'px ' + this.height + 'px 0px)';
    } else if (this.__LZgroup.style.clip) {
        this.__LZgroup.style.clip = '';
    }
    */
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

LzSprite.prototype.destroy = function() {
}

LzSprite.prototype.getMouse = function(xy) {
    // TODO: don't base these metrics on the mouse position
    //Debug.debug('LzSprite.getMouse', this.owner.classname, LzSprite.__rootSprite.getMouse('x'), LzSprite.__rootSprite.getMouse('y'));
    var p = this.__getPos();
    if (this.isroot) {
        if (xy == 'x') {
            return LzMouseKernel.__x - p.x;
        } else {
            return LzMouseKernel.__y - p.y;
        }
    } else {
        if (xy == 'x') {
            return LzSprite.__rootSprite.getMouse('x') - p.x;
        } else {
            return LzSprite.__rootSprite.getMouse('y') - p.y;
        }
    }
}

LzSprite.prototype.__getPos = function() {
    var el = this.__LZdiv;
    var parent = null;
    var pos = {};
    var box;

    if (el.getBoundingClientRect) { // IE
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
        var ua = navigator.userAgent.toLowerCase();
        if ( ua.indexOf('opera') != -1
            || ( ua.indexOf('safari') != -1 && this.hasOwnProperty('getStyle') && this.getStyle(el, 'position') == 'absolute' )) {
            pos.y -= document.body.offsetTop;
        }
    }

    if (el.parentNode) { 
        parent = el.parentNode; 
    } else { 
        parent = null; 
    }

    while (parent && parent.tagName != 'svg') {
        pos.x -= parent.getAttribute('x');
        pos.y -= parent.getAttribute('y');

        if (parent.parentNode) { 
            parent = parent.parentNode; 
        } else { 
            parent = null; 
        }
    }
    return pos;
}

LzSprite.prototype.getWidth = function() {
    return this.width;
}

LzSprite.prototype.getHeight = function() {
    return this.height;
}

LzSprite.prototype.getAttributeRelative = function(n, v) {
    //Debug.debug('getAttributeRelative', this, n, v);
    var vp = v.sprite.getPos();
    var tp = this.getPos();
    if (n == 'x') {
        //return vp.x;
        return tp.x - vp.x + v.x;
    } else if (n == 'y') {
        //return vp.y;
        return tp.y - vp.y + v.y;
    }
}


/**
  * Shows or hides the hand cursor for this view.
  * @param Boolean s: true shows the hand cursor for this view, false hides 
  * it
  */
LzSprite.prototype.setShowHandCursor = function ( s ){
    //TODO: implement 
}

LzSprite.prototype.getMCRef = function ( ){
    //TODO: implement 
    return this.__LZgroup;
}

LzSprite.prototype.bringToFront = function() {
    // compiler bug: invalid assignment left-hand side
    //this.__LZgroup.style.z-index = 100;

    this.oldZindex = this.__LZgroup.style['z-index'];
    this.oldZindex2 = this.__LZgroup.style['zIndex'];
    this.__LZgroup.style['z-index'] = 10000;
    // Firefox 1.5 seems to prefer this for some reason
    this.__LZgroup.style['zIndex'] = 10001;
    //Debug.info('bringToFront', this.oldZindex, this.oldZindex2, this);
}

LzSprite.prototype.sendToBack = function() {
    this.__LZgroup.style['z-index'] = this.oldZindex;
    this.__LZgroup.style['zIndex'] = this.oldZindex2;
    //Debug.info('sendToBack', this.oldZindex);
}


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
    if (this.stretches) this.__updateStretches();
}

LzSprite.prototype.getVolume = function () {
    if ($debug) {
        Debug.warn('LzSprite.getVolume not implemented in dhtml');
    }    
}
LzSprite.prototype.setVolume = function (v) {
    if ($debug) {
        Debug.warn('LzSprite.setVolume not implemented in dhtml');
    }    
}
LzSprite.prototype.getPan = function () {
    if ($debug) {
        Debug.warn('LzSprite.getPan not implemented in dhtml');
    }    
}
LzSprite.prototype.setPan = function (p) {
    if ($debug) {
        Debug.warn('LzSprite.setPan not implemented in dhtml');
    }    
}

