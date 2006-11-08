//
// Code for _root.lzpreloader frame 0 when there's a <splash> tag
// This is compiled into lzpreloader.lzx which is attached to the lzpreloader
// movieclip in SWFFile.java addPreloaderFrame()
//

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

// Debugging tips :
// I put in a little debug code that will enables putting simple debug calls
// in the code.  To see the output when the debugger is up, type:
//          _root.lzpreloader.trace()
// It would be nice, for it to automatically output this info to the debugger
// when it starts up, but I think this file isn't compiled the same way as the
// LFC, since the $debug didn't seem to work.  For now, you can just uncomment
// the debug code below. [Sarah Allen 04-28-05]
// Added text field where debug info is shown so it can be seen with debug=true
// [sallen 06-06-2005]

/*
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

// called by compiler (first thing) like:
// _root.lzpreloader.create({attrs: {}, name: "splash", children:
//   [{attrs: {x: 100, name: "logo", synctoload: true, resourcename:
//   logo, src: "logo.swf", y: 100}, name: "preloadresource"}]});
function create (iobj) {
  this.iobj = iobj
}

// Called by heartbeat to actually build the splash once the Stage has
// non-zero size (to work around ActiveX control bug that initializes
// the Stage to 0x0).
function init () {
  var iobj = this.iobj;
  delete this.iobj;
  this.name = iobj.name;
  this.hideafterinit = iobj.attrs.hideafterinit;
  var viewprops = {x: true, y: true, width: true, height: true};
  for (var i = 0; i < iobj.children.length; i++) {
    var c = iobj.children[i].attrs;
    var n = (c.name == null) ? ("child" + i) : c.name;
    this.attachMovie(n, n, i + 1);
    var mc = this[n];
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

this.createEmptyMovieClip("_heartbeat", 1000);
this._heartbeat.onEnterFrame = function() {
    this._parent.heartbeat();
}

// called by enterframe of the splash clip
function heartbeat (p) {
  //this.mydebug('stage size ' + Stage.width + 'x' + Stage.height );
  if (this.iobj &&
        (Stage.width > 100 && Stage.height > 100)) {
        // some browsers will pass 100% as 100 (or whatever %) for first
        // couple of heartbeats, ideally we would pass % from compiler
        // so we could ignore fewer cases and allow splash in small canvas
        // [sallen/max 6-05]
    this.init();
    mc.gotoAndStop(0);
  } else {
    var percload = _root.getBytesLoaded() / _root.getBytesTotal();

    for (var i = 0; i < this.synctoloads.length; i++) {
        var mc = this.synctoloads[i];
        var p = Math.floor(mc.lastframe * percload);
        mc.gotoAndStop(p);
    } 
    //this.mydebug('percent done='+p);
  }
}

// called by the compiler (as the last instruction in the executable),
// this causes the transition from loading animation to construction
// animation.
function done() {
  //this.mydebug('done');
  _root.lzpreloader._heartbeat.removeMovieClip();
  delete this.heartbeat;

  if (this.iobj) this.init();
  for (var i = 0; i < this.synctoloads.length; i++) {
    var mc = this.synctoloads[i];
    mc.gotoAndStop(mc.lastframe);
    //this.mydebug('lastframe='+mc.lastframe);
  }
  var vis = (this.hideafterinit != true) ? true : false;

  var svd = _root.canvas.__LZsvdepth;
  _root.canvas.__LZsvdepth = 0;
  var v = new _root.LzView(_root.canvas, {name:this.name, visible:vis,
                                          options: {ignorelayout:true}});
  v.setMovieClip(this);
  _root.canvas.__LZsvdepth = svd;

  this._visible = vis;

  for (var i = 0; i < this.protoviews.length; i++) {
    var mc = this.protoviews[i];
    var ratio = mc.lastframe / mc._totalframes;
    var nv = new _root.LzView(v, {name: mc.name, x: mc._x, y: mc._y,
                                  width: mc._width, height: mc._height,
                                  totalframes: mc._totalframes, ratio: ratio,
                                  options: {ignorelayout: true}});
    // If ratio is less than one, animate the remaining way using percentcreated
    if (ratio < 1) {
      nv.noteCreated = function (p) {
        this.stop(Math.floor(this.totalframes * (this.ratio + (1-this.ratio)*p)));
      };
      var del = new _root.LzDelegate(nv, 'noteCreated', _root.canvas, 'onpercentcreated');
    }
    nv.setMovieClip(mc);
    mc._visible = true;
  }

}

