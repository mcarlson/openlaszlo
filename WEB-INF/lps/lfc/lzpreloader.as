/**
  *
  * @copyright Copyright 2001-2010 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @affects lzpreloader
  * @access private
  * @topic LZX
  * @subtopic Services
  */

//
// Code for lzpreloader frame 0 when there's a <splash> tag
// This is compiled into lzpreloader.lzx which is attached to the lzpreloader
// movieclip in SWFFile.java addPreloaderFrame()
//

// Debugging tips :
// I put in a little debug code that will enables putting simple debug calls
// in the code.  To see the output when the debugger is up, type:
//          lzpreloader.trace()
// It would be nice, for it to automatically output this info to the debugger
// when it starts up, but I think this file isn't compiled the same way as the
// LFC, since the $debug didn't seem to work.  For now, you can just uncomment
// the debug code below. [Sarah Allen 04-28-05]
// Added text field where debug info is shown so it can be seen with debug=true
// [sallen 06-06-2005]

// necessary for consistent behavior - in netscape browsers HTML is ignored
Stage.align = ('canvassalign' in global && global.canvassalign != null) ? global.canvassalign : "LT";
Stage.scaleMode = ('canvasscale' in global && global.canvasscale != null) ? global.canvasscale : "noScale";

flash.external.ExternalInterface.call("lz.embed.applications." + id + "._sendPercLoad", 0);
/*
// SWF-specific
_root.createTextField("tfNewfield",1,100,10,150,700);
_root.tfNewfield.text = "Splash Debugger";
_root.tfNewfield.autoSize = true;

   mydebugger = [];
   function mydebug(s) {
        this.mydebugger.push(s);
        _root.tfNewfield.text = _root.tfNewfield.text + '\n' + s;
   }
   function trace() {
        for (var i=0; i< this.mydebugger.length; i++) {
            _root.Debug.write(this.mydebugger[i]);
        }
   }
*/  
  
this.protoviews = [];
this.synctoloads = [];
this._x = 0;
this._y = 0;
this._lastwidth = Stage.width;
this._lastheight = Stage.height;

// called by compiler (first thing) like in 3.x:
// lzpreloader.create({attrs: {}, name: "splash", children:
//   [{attrs: {x: 100, name: "logo", synctoload: true, resourcename:
//   logo, src: "logo.swf", y: 100}, name: "preloadresource"}]});

// in 4.2 it looks like this:
//_root.lzpreloader.create({attrs: {foo: void 0, hideafterinit: false }, children: [{attrs: {name: "foo" , persistent: true , resourcename: "foo" }, "class": $lzc$class_preloadresource}], "class": $lzc$class_splash});

function create (iobj) {
  this.iobj = iobj
}

// Called by heartbeat to actually build the splash once the Stage has
// non-zero size (to work around ActiveX control bug that initializes
// the Stage to 0x0).
function init () {
  if (Stage.width <= 100 || Stage.height <= 100) {
    // sometimes Safari still has heihgt/width 100.  Be sure to hide the splash if this is the case.
    this.hideafterinit = true;
    return;
  }
  var iobj = this.iobj;
  delete this.iobj;
  this.name = iobj.name || 'splash';
  this.hideafterinit = iobj.attrs.hideafterinit;
  var viewprops = {x: true, y: true, width: true, height: true};
  var sr = _root.createEmptyMovieClip("spriteroot", 1000);
  var root = sr.createEmptyMovieClip(this.name, 0);
  this.splashroot = root;
  //this.mydebug('new root' + this.splashroot);
  for (var i = 0; i < iobj.children.length; i++) {
    var c = iobj.children[i].attrs;
    var n = (c.name == null) ? ("child" + i) : c.name;
    root.attachMovie(n, n, i + 1);
    var mc = root[n];
    mc.name = n;
    this.protoviews.push(mc);

//    this.debug(" synctoload" + c.synctoload);
    if (c.synctoload) {
      if (c.lastframe == null) {
        mc.lastframe = mc._totalframes;
      } else {
        //this.mydebug('c.usepercent='+c.usepercent);
        mc.lastframe = c.lastframe * mc._totalframes;
        //this.mydebug('c.lastframe='+c.lastframe+
        //    'mc.lastframe='+mc.lastframe );
      }
//      this.debug(" synctoload" + this.synctoloads);
      this.synctoloads.push(mc);
    }
    for (var p in viewprops) {
      if (c[p] != null) {
        mc["_" + p] = c[p];
      }
    }

    //this.debug(mc._target + " center=" + c.center);
    if (c.center != null) {
      mc._x = Stage.width / 2 - (mc._width / 2);
      mc._y = Stage.height / 2 - (mc._height / 2);
      //this.debug(" Stage.width=" + Stage.width);
      //this.debug(" mc._width=" + mc._width);
      //this.debug(" mc._x=" + mc._x);
    }
  }
}

// TODO: [20091005 anba] I don't think this additional movieclip is necessary,
// because _heartbeat already exists, cf. SWFFile#addPreloaderFrame
this.createEmptyMovieClip("_heartbeat", 1000);
this._heartbeat.onEnterFrame = function() {
    this._parent.heartbeat();
}

// called by enterframe of the splash clip
function heartbeat (p) {
  //this.mydebug('stage size ' + Stage.width + 'x' + Stage.height );
  if (this.iobj && (Stage.width > 100 && Stage.height > 100) &&
        (Stage.width == this._lastwidth && Stage.height == this._lastheight)) {
        // some browsers will pass 100% as 100 (or whatever %) for first
        // couple of heartbeats, ideally we would pass % from compiler
        // so we could ignore fewer cases and allow splash in small canvas
        // [sallen/max 6-05]
    this.init();
    mc.gotoAndStop(0);
  } else {
    // SWF-specific
    var id = _root.id;
    if (id) {
        var percload = Math.floor((_root.getBytesLoaded() / _root.getBytesTotal()) * 100);
        if (percload != this._lastpercload) flash.external.ExternalInterface.call("lz.embed.applications." + id + "._sendPercLoad", percload);
        this._lastpercload = percload;
    }

    for (var i = 0; i < this.synctoloads.length; i++) {
        var mc = this.synctoloads[i];
        var p = Math.floor(mc.lastframe * percload);
        mc.gotoAndStop(p);
    } 
    //this.mydebug('percent done='+p);
  }
  this._lastwidth = Stage.width;
  this._lastheight = Stage.height;
}

// called by the compiler (as the last instruction in the executable),
// this causes the transition from loading animation to construction
// animation.
function done() {
  //this.mydebug('done');
  lzpreloader._heartbeat.onEnterFrame = null;
  // swap depths otherwise removeMovieClip() doesn't work (movieclip's depth
  // must not be negative for removeMovieClip to work, but movieclips created
  // in the authoring tool are assigned negative depth values by default).
  lzpreloader._heartbeat.swapDepths(0);
  lzpreloader._heartbeat.removeMovieClip();
  // well, there are two _heartbeat movieclips, so call removeMovieClip() twice
  // (always remember that movieclip references are 'soft references')
  lzpreloader._heartbeat.removeMovieClip();
  // delete this.heartbeat;

  if (this.iobj) this.init();
  for (var i = 0; i < this.synctoloads.length; i++) {
    var mc = this.synctoloads[i];
    mc.gotoAndStop(mc.lastframe);
    //this.mydebug('lastframe='+mc.lastframe);
  }
  var vis = (this.hideafterinit != true) ? true : false;

  var svd = canvas.sprite.__LZsvdepth;
  canvas.sprite.__LZsvdepth = 0;
  var v = new LzView(canvas, {name:this.name || null, visible:vis,
                              options: {ignorelayout:true}});
  v.sprite.setMovieClip(this.splashroot);
  canvas.sprite.__LZsvdepth = svd;
  //this.mydebug('splashmc='+v);

  for (var i = 0; i < this.protoviews.length; i++) {
    var mc = this.protoviews[i];
    var ratio = mc.lastframe / mc._totalframes;
    var nv = new LzView(v, {name: mc.name || null, x: mc._x, y: mc._y,
                                  width: mc._width, height: mc._height,
                                  totalframes: mc._totalframes, ratio: ratio,
                                  options: {ignorelayout: true}});
    //this.mydebug('new view='+nv);
    // If ratio is less than one, animate the remaining way using percentcreated
    if (ratio < 1) {
      nv.noteCreated = function (p) {
        this.stop(Math.floor(this.totalframes * (this.ratio + (1-this.ratio)*p)));
      };
      var del = new _root.LzDelegate(nv, 'noteCreated', _root.canvas, 'onpercentcreated');
    }
    nv.sprite.setMovieClip(mc);
    mc._visible = true;
  }

}

