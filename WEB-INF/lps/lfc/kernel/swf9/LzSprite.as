/**
  * LzSprite.as
  *
  * @copyright Copyright 2007, 2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic swf9
  * @author Henry Minsky &lt;hminsky@laszlosystems.com&gt;
  */

dynamic public class LzSprite extends Sprite {

#passthrough (toplevel:true) {
  import flash.display.*;
  import flash.events.*;
  import flash.ui.*;
  import flash.geom.*;
  import flash.utils.*;
  import mx.controls.Button;
  import flash.net.*;
  import flash.utils.*;
  import flash.system.Security;
  import flash.system.SecurityDomain;
  import flash.system.ApplicationDomain;
  import flash.system.LoaderContext;
  import flash.media.Sound;
  import flash.media.SoundChannel;
  import flash.media.SoundMixer;
  import flash.media.SoundTransform;
  import flash.media.SoundLoaderContext;
  import flash.media.ID3Info;

}#

#passthrough  {

      public var owner:* = null;

      public var bgcolor:* = null;

      public var lzwidth:* = 0;
      public var lzheight:* = 0;

      public var opacity:Number = 1;
      public var playing:Boolean = false;
      public var clickable:Boolean = false;
      public var clickbutton:SimpleButton = null;
      public var clickregion:Shape = null;
      public var masksprite:Sprite = null;
      public var frames:int = 1;
      public var resource:String = null;
      public var source:String = null;
      public var clip:Boolean = false;
      public var resourcewidth:Number = 0;
      public var resourceheight:Number = 0;
      public var isroot:Boolean = false;
      public static var rootSprite:LzSprite = null;
      var lastreswidth:Number = 0;
      var lastresheight:Number = 0;
      var skiponload = false;
      var baseurl;

      // Used for workaround for contextmenu bug; use as a null hitArea for sprites that
      // we don't want to get mouse events.
      public static var emptySprite:Sprite = new Sprite();

      // If null, the handcursor visibility is set to the value of LzMouseKernel.showhandcursor
      // whenevent a mouseover event happens.
      public var showhandcursor:* = null;

      public var fontsize:String = "11";
      public var fontstyle:String = "plain";
      public var fontname:String = "Verdana";

      var resourceContainer:DisplayObject = null;
      // Cache for instantiated assets in a multiframe resource set
      var resourceCache:Array = null;

      /* private */ static const loaderContext:LoaderContext = new LoaderContext(true);
      /* private */ static const soundLoaderContext:SoundLoaderContext = new SoundLoaderContext(1000, true);

      /* private */ static const MP3_FPS:Number = 30;
      /* private */ var sound:Sound = null;
      /* private */ var soundChannel:SoundChannel = null;
      /* private */ var soundLoading:Boolean = false;
      
      //@field Boolean _setrescwidth: If true, the view does not set its
      //resource to the width given in a call to
      //<method>setAttribute</method>. By default, views do not scale their
      //resource
      public var _setrescwidth:Boolean = false;

      //@field Boolean _setrescheight: If true, the view does not set its
      //resource to the height given in a call to
      //<method>setAttribute</method>. By default, views do not scale their
      //resource
      public var _setrescheight:Boolean = false;

      private var __mousedown:Boolean = false;
      // null if no resource is loaded, true if it's a compiled resource, and 
      // false if it's loaded from an external URL
      private var __isinternalresource:* = null;

      // flag to track sprite the mouse went over while down to send mouseup event later -  see LPP-7300 and LPP-7335
      private var __mouseoverInFront:LzSprite = null;

      public static var capabilities:* = {
      rotation: true
      // Avoid scaling canvas to percentage values - SWF already scales the viewport size, so take window size literally to avoid scaling twice
      ,scalecanvastopercentage: false
      // the canvas already knows its size
      ,readcanvassizefromsprite: false
      ,opacity: true
      ,advancedfonts: true
      ,colortransform: true
      ,audio: true
      ,accessibility: false
      ,htmlinputtext: true
      ,bitmapcaching: true
      ,persistence: true
      ,clickmasking: false
      // history won't work yet because LzUtils.safeEval() doesn't return values for methods in the global scope - see LPP-7008
      ,history: false
      ,runtimemenus: true
      ,setclipboard: true
      ,proxypolicy: true
      }

      public function LzSprite (newowner = null, isroot = null) {
          // owner:*, isroot:Boolean
          this.owner = newowner;
          if (owner == null) return;
          if (isroot) {
              this.isroot = true;
              LzSprite.rootSprite = this;
              this.mouseEnabled = true;// @devnote: see LPP-6980
          } else {
              this.mouseEnabled = true;
              this.hitArea = LzSprite.emptySprite;
          }
      }

      public function init (v:Boolean = true):void {
          this.setVisible(v);

          if (this.isroot && DojoExternalInterface.available) {
            // Expose your methods
            DojoExternalInterface.addCallback("getCanvasAttribute", lz.History, lz.History.getCanvasAttribute);
            DojoExternalInterface.addCallback("setCanvasAttribute", lz.History, lz.History.setCanvasAttribute);
            DojoExternalInterface.addCallback("callMethod", lz.History, lz.History.callMethod);
            DojoExternalInterface.addCallback("receiveHistory", lz.History, lz.History.receiveHistory);

            // Tell JavaScript that you are ready to have method calls
            DojoExternalInterface.loaded();
          }
      }

      /**  addChildSprite(Sprite:sprite)
          o Adds a child sprite to this sprite's display hierarchy 
      */
      public function addChildSprite(sprite:LzSprite):void {
          addChild(sprite);
          //trace('addChildSprite ', sprite, 'added to ' ,this.owner);
      }


      public function predestroy(){
          this.bringToFront();
      }

      public function draw():void {
          if (this.bgcolor == null){
              this.graphics.clear();
          } else {
              this.graphics.clear();
              this.graphics.beginFill(this.bgcolor);
              this.graphics.drawRect(0, 0, this.lzwidth, this.lzheight);
              this.graphics.endFill();
          }
      }

      private var _frame:int = 1;

      public function set frame (fr:int) :void {
          this._frame = fr;
          if (this.owner) {
              this.owner.resourceevent('frame', fr);
          }
      }

      public function get frame () :int {
          return this._frame;
      }

      private var _totalframes:int = 1;

      public function set totalframes (tfr:int) :void {
          this._totalframes = tfr;
          if (this.owner) {
              this.owner.resourceevent('totalframes', tfr);
          }
      }

      public function get totalframes () :int {
          return this._totalframes;
      }

      /** setResource( String:resource )
          o Displays a compiled-in resource (by name)
          o Calls setSource to load media if resource is an URL
          o Uses the resourceload callback method when the resource finishes loading 
      */
      public function setResource (r:String):void {
          if (this.resource == r) return;
          if (r.indexOf('http:') == 0 || r.indexOf('https:') == 0) {
              this.skiponload = false;
              this.setSource( r );
              return;
          }
          // LzResourceLibrary.lzcheckbox_rsrc =
          //  {frames: [__embed_lzasset_lzcheckbox_rsrc_0,
          //           __embed_lzasset_lzcheckbox_rsrc_1, ....], width: 15, height: 14};

          // or
          // LzResourceLibrary.lzfocusbracket_bottomright_shdw =
          // {ptype: ("sr" || "ar" ),
          //  assetclass: __embed_lzasset_lzfocusbracket_bottomright_shdw,
          // frames: ["lps/components/lz/resources/focus/focus_bot_rt_shdw.png"], width: 9, height: 9};

          var res:Object = LzResourceLibrary[r];
          if (! res) {
              if ($debug) {
                  Debug.warn('Could not find resource', r);
              }
              return;
          }
          
          if (LzAsset.isBitmapAsset(r) 
                || LzAsset.isMovieClipAsset(r) 
                || LzAsset.isMovieClipLoaderAsset(r)) {
              this.resourcewidth = res.width;
              this.resourceheight = res.height;
              this.totalframes = res.frames.length;

              if (imgLoader) {
                  // unload previous http image-resource
                  this.unload();
              } else if (this.isaudio) {
                  // unload previous sound-resource
                  this.unloadSound();
              } else {
                  // clear resource cache
                  this.resourceCache = null;
              }
              
              this.__isinternalresource = true;
              this.resource = r;
              // instantiate resource at frame 1
              this.stop(1);
              // send events, but skip onload
              sendResourceLoad(true);
          } else if (LzAsset.isSoundAsset(r)) {
              // unload previous image-resource and sound-resource
              this.unload();
              this.__isinternalresource = true;
              this.resource = r;
              
              this.sound = new res['assetclass']() as Sound;
              this.totalframes = Math.floor(this.getTotalTime() * MP3_FPS);

              // TODO: add condition on this
              this.startPlay()
              
              // send events, but skip onload
              this.sendResourceLoad(true);
          } else if ($debug) {
              Debug.warn('Unhandled asset: ', LzAsset.getAssetType(r) + " " + r);
          }
      }


      public var imgLoader:Loader;
      public var loaderMC:MovieClip;
      private var IMGDEPTH:int = 0;

      /** setSource( String:url )
          o Loads and displays media from the specified url
          o Uses the resourceload callback method when the resource finishes loading 
      */
      public function setSource (url:String, cache:String = null, headers:String = null, filetype:String = null) :void {
          if (url == null || url == 'null') {
              return;
          }
          var loadurl = url;
          var proxied = this.owner.__LZcheckProxyPolicy( url );
          var proxyurl = this.owner.getProxyURL(url);
          if (proxied) {
              var params:Object = {serverproxyargs: {},
                                   timeout: canvas.medialoadtimeout,
                                   proxyurl: proxyurl,
                                   url: url,
                                   httpmethod: 'GET',
                                   service: 'media'
              };
              if (headers != null) {
                  params.headers = headers;
              }
              if (cache == "none") {
                  params.cache = false;
                  params.ccache = false;
              } else if (cache == "clientonly") {
                  params.cache = false;
                  params.ccache = true;
              } else if (cache == "serveronly") {
                  params.cache = true;
                  params.ccache = false;
              } else {
                  params.cache = true;
                  params.ccache = true;
              }
              loadurl = lz.Browser.makeProxiedURL(params);
          }

          if (getFileType(url, filetype) == "mp3") {
              // unload previous image-resource and sound-resource
              this.unload();
              this.__isinternalresource = false;
              this.resource = url;
              this.loadSound(loadurl);
          } else {
              if (this.isaudio) {
                  // unload previous sound-resource
                  this.unloadSound();
              }
            
              if (! imgLoader) {
                  if (this.resourceContainer) {
                      // unload previous internal image-resource
                      this.unload();
                  }
                  imgLoader = new Loader();
                  imgLoader.mouseEnabled = false;// @devnote: see LPP-7022
                  imgLoader.mouseChildren = false;
                  this.resourceContainer = imgLoader;
                  this.addChildAt(imgLoader, IMGDEPTH);
                  var info:LoaderInfo = imgLoader.contentLoaderInfo;
                  info.addEventListener(Event.INIT, loaderInitHandler);
                  info.addEventListener(IOErrorEvent.IO_ERROR, loaderEventHandler);
              } else {
                  //TODO [20080911 anba] cancel current load?
                  // imgLoader.close();
              }
              this.__isinternalresource = false;
              this.resource = url;
              var res = this.imgLoader;
              if (res) {
                  res.scaleX = res.scaleY = 1.0;
              }

              imgLoader.load(new URLRequest(loadurl), LzSprite.loaderContext);
          }
      }

      
      private function getFileType (url:String, filetype:String = null) :String {
          if (filetype != null) {
              return filetype.toLowerCase();
          } else {
              var si:int = url.lastIndexOf(".");
              return si != -1 ? url.substring(si + 1).toLowerCase() : null;
          }
      }

      public function loaderInitHandler(event:Event):void {
          // These progress event listeners can only be installed after the init event
          // has been received. You get an error if you try to add them before this.
          var loader:Loader = Loader(event.target.loader);
          var info:LoaderInfo = LoaderInfo(loader.contentLoaderInfo);
          info.addEventListener(ProgressEvent.PROGRESS, loaderEventHandler);
          info.addEventListener(Event.OPEN, loaderEventHandler);
          info.addEventListener(Event.UNLOAD, loaderEventHandler); 
          info.addEventListener(Event.COMPLETE, loaderEventHandler);
          info.addEventListener(SecurityErrorEvent.SECURITY_ERROR, loaderEventHandler);
          // @devnote: From the HTTPStatusEvent reference page:
          // > Some Flash Player environments may be unable to detect HTTP status codes; 
          // > a status code of 0 is always reported in these cases.
          // Http status is actually only available for the IE Flash-Plugin. 
          //info.addEventListener(HTTPStatusEvent.HTTP_STATUS, loaderEventHandler);
      }


      public function loaderEventHandler(event:Event):void {
          try {
              //@devnote: accessing the Loader through "event.target.loader" may 
              // throw runtime error #2099 (at least for an IOErrorEvent):
              // > "The loading object is not sufficiently loaded to provide this information."

              //TODO [20080911 anba] set resoucewidth/height to 0 for every event?
              this.resourcewidth = 0;
              this.resourceheight = 0;
              if (event.type == Event.COMPLETE) {
                  if (this.loaderMC) {
                      this.loaderMC.removeEventListener(Event.ENTER_FRAME, updateFrames);
                      this.loaderMC = null;
                  }

                  var info:LoaderInfo = event.target as LoaderInfo;
                  // avoid security exceptions
                  if (info.parentAllowsChild) {
                      if (info.content is AVM1Movie) {
                        if ($debug) {
                              Debug.warn("Playback control will not work for the resource.  Please update or recompile the resource for Flash 9.", this.resource);
                          }
                      } else if (info.content is MovieClip) {
                          // store a reference for playback control
                          this.loaderMC = MovieClip(info.content);  
                          this.totalframes = this.loaderMC.totalFrames;
                          this.loaderMC.addEventListener(Event.ENTER_FRAME, updateFrames);
                          this.owner.resourceevent('play', null, true);
                          this.playing = this.owner.playing = true;
                      }
                  }

                  try {
                      var loader:Loader = Loader(event.target.loader);
                      this.resourcewidth = loader.width;
                      this.resourceheight = loader.height;
                  } catch (e) {
                  }
                  // Apply stretch if needed, now that we know the asset dimensions.
                  this.applyStretchResource();
                  // send events, including onload
                  sendResourceLoad();
                  this.owner.resourceevent('loadratio', 1);
              } else if (event.type == IOErrorEvent.IO_ERROR ||
                         event.type == SecurityErrorEvent.SECURITY_ERROR) {
                  //TODO [20080911 anba] how can "owner" become null here?
                  if (this.owner != null) {
                      // IOErrorEvent/SecurityErrorEvent -> ErrorEvent -> TextEvent
                      this.owner.resourceloaderror( (event as TextEvent).text );
                  }
              } else if (event.type == ProgressEvent.PROGRESS) {
                  var ev:ProgressEvent = event as ProgressEvent;
                  var lr:Number = ev.bytesLoaded / ev.bytesTotal;
                  if (! isNaN(lr)) {
                      this.owner.resourceevent('loadratio', lr);
                  }
              } else if (event.type == Event.OPEN) {
                  this.owner.resourceevent('loadratio', 0);
              } else if (event.type == Event.UNLOAD) {
              }
          } catch (error:Error) {
              if ($debug) Debug.warn(event.type + " " + error);
          }
      }

      /**
        * Handle frame updates for loaded movieclips
        */
      private function updateFrames (event:Event) :void {
          this.frame = this.loaderMC.currentFrame;
          if (this.frame == this.totalframes) {
              this.owner.resourceevent('lastframe', null, true);
          }
      }

      /**
        * <code>true</code> if a sound is attached to this sprite.
        */
      public function get isaudio () :Boolean {
          return this.sound != null;
      }

      /**
        * Load/Stream a sound from an URL.
        */
      private function loadSound (url:String) :void {
          this.sound = new Sound();
          this.sound.addEventListener(Event.OPEN, soundLoadHandler);
          this.sound.addEventListener(Event.COMPLETE, soundLoadHandler);
          this.sound.addEventListener(ProgressEvent.PROGRESS, soundLoadHandler);
          this.sound.addEventListener(IOErrorEvent.IO_ERROR, soundLoadHandler);
          
          this.sound.load(new URLRequest(url), LzSprite.soundLoaderContext);
          
          // TODO: add condition on this
          this.startPlay();
      }
      
      /** 
        * Stop current playback and unload sound
        */
      private function unloadSound () :void {
          if (this.playing) {
              // stop playing
              this.stopPlay();
          }
          if (this.sound) {
              if (this.soundLoading) {
                  // stop streaming sound
                  this.sound.close();
                  this.soundLoading = false;
              }
              this.sound = null;
          }
      }
      
      /** 
        * Start sound playback and tracking
        * @param Number frame: frame/secs to start at playing
        * @param Boolean isFrame: if set to false, treat 'frame' as seconds
        */
      private function startPlay (frame:Number = 0, isFrame:Boolean = true) :void {
          var pos:Number = (isFrame ? (frame / MP3_FPS) : frame) * 1000;
          
          this.playing = this.owner.playing = true;
          this.soundChannel = this.sound.play(pos, 0, this.soundTransform);
          this.addEventListener(Event.ENTER_FRAME, soundFrameHandler);
          this.soundChannel.addEventListener(Event.SOUND_COMPLETE, soundCompleteHandler);
      }
      
      /** 
        * Stop sound playback and tracking
        * @return Number: the current frame when playback was stopped
        */
      private function stopPlay () :Number {
          if (this.soundChannel) {
             var frame:Number = Math.floor(this.soundChannel.position * 0.001 * MP3_FPS);
          } else {
             var frame:Number = this.frame;
          }
          
          this.playing = this.owner.playing = false;
          this.removeEventListener(Event.ENTER_FRAME, soundFrameHandler);
          this.soundChannel.stop();
          this.soundChannel = null;
          
          return frame;
      }
      
      /** 
        * Update sound play status
        */
      private function updatePlay (play:Boolean, framenumber:*, rel:Boolean) :void {
          var fr:Number;
          if (this.playing) {
              // stop previous playback
              fr = this.stopPlay();
          } else {
              // TODO: this.frame is initialized with 1, which
              // means we currently skip 33ms at the beginning
              fr = this.frame;
          }
          
          if (framenumber != null) {
              framenumber += rel ? fr : 0;
          } else {
              // start at the beginning again if we're already at the end.
              framenumber = fr >= this.totalframes ? 0 : fr;
          }
          
          if (play) {
              this.startPlay(framenumber);
          } else {
              this.frame = framenumber;
          }
      }
      
      /** 
        * Progress sound loading
        */
      private function soundLoadHandler (event:Event) :void {
          try {
              if (event.type == Event.OPEN) {
                  this.soundLoading = true;
                  this.owner.resourceevent('loadratio', 0);
              } else if (event.type == Event.COMPLETE) {
                  this.soundLoading = false;
                  this.owner.resourceevent('loadratio', 1);
                  this.totalframes = Math.floor(this.getTotalTime() * MP3_FPS);

                  // send events, including onload
                  this.sendResourceLoad();
              } else if (event.type == ProgressEvent.PROGRESS) {
                  var ev:ProgressEvent = event as ProgressEvent;
                  var lr:Number = ev.bytesLoaded / ev.bytesTotal;
                  if (! isNaN(lr)) {
                      this.owner.resourceevent('loadratio', lr);
                  }
              } else if (event.type == IOErrorEvent.IO_ERROR) {
                  this.soundLoading = false;
                  this.owner.resourceevent('loadratio', 0);
                  this.owner.resourceloaderror( (event as IOErrorEvent).text );
              }
          } catch (error:Error) {
              trace(event.type + " " + error);
          }
      }
      
      /** 
        * Track playback
        */
      private function soundFrameHandler (event:Event) :void {
          // Event.ENTER_FRAME
          this.frame = Math.floor(this.soundChannel.position * 0.001 * MP3_FPS);
          this.totalframes = Math.floor(this.getTotalTime() * MP3_FPS);
      }

      /**
        * Sound complete
        */
      private function soundCompleteHandler (event:Event) :void {
          // Event.SOUND_COMPLETE
          if (this.playing) {
              this.frame = this.totalframes;

              // SoundChannel.position does not stop exactly at Sound.length, 
              // there are a few ms difference between both values. 
              // So instead of comparing 'frame' == 'totalframes', 
              // we'll send the 'lastframe'-event when playback stopped.
              this.owner.resourceevent('lastframe', null, true);
              // needs to be reset again!
              this.frame = this.totalframes;
              this.stopPlay();
          }
      }
      
      //// Mouse event trampoline
      public function attachMouseEvents(dobj:DisplayObject) :void {
          dobj.addEventListener(MouseEvent.CLICK, __mouseEvent, false);
          dobj.addEventListener(MouseEvent.DOUBLE_CLICK, handleMouse_DOUBLE_CLICK, false);
          dobj.addEventListener(MouseEvent.MOUSE_DOWN, __mouseEvent, false);
          dobj.addEventListener(MouseEvent.MOUSE_UP, __mouseEvent, false);
          dobj.addEventListener(MouseEvent.MOUSE_OVER, __mouseEvent, false);
          dobj.addEventListener(MouseEvent.MOUSE_OUT, __mouseEvent, false);
      }

      public function removeMouseEvents(dobj:DisplayObject) :void {
          dobj.removeEventListener(MouseEvent.CLICK, __mouseEvent, false);
          dobj.removeEventListener(MouseEvent.DOUBLE_CLICK, handleMouse_DOUBLE_CLICK, false);
          dobj.removeEventListener(MouseEvent.MOUSE_DOWN, __mouseEvent, false);
          dobj.removeEventListener(MouseEvent.MOUSE_UP, __mouseEvent, false);
          dobj.removeEventListener(MouseEvent.MOUSE_OVER, __mouseEvent, false);
          dobj.removeEventListener(MouseEvent.MOUSE_OUT, __mouseEvent, false);
      }

      public function handleMouse_DOUBLE_CLICK (event:MouseEvent) :void {
          LzMouseKernel.__sendEvent( owner, 'ondblclick');
          event.stopPropagation();
      }

      // called by LzMouseKernel when mouse goes up on another sprite
      public function __globalmouseup( e:MouseEvent ) :void {
          if (this.__mousedown) {
              var mouseOverSprite:LzSprite = null;
              if (this.__mouseoverInFront != null) {
                  mouseOverSprite = this.__mouseoverInFront;
                  this.__mouseoverInFront = null;
              }
              this.__mouseEvent(e);
              this.__mouseEvent(new MouseEvent('mouseupoutside'));
              if (mouseOverSprite != null) {
                  // send after onmouseup(outside) (LPP-7335)
                  LzMouseKernel.__sendEvent(mouseOverSprite.owner, 'onmouseover');
              }
          }
          LzMouseKernel.__lastMouseDown = null;
      }

      public function __mouseEvent( e:MouseEvent ) :void {
            var skipevent = false;
            var eventname = 'on' + e.type.toLowerCase();

            if (eventname == 'onmousedown') {
                // cancel mousedown event bubbling...
                e.stopPropagation();
                this.__mousedown = true;
                LzMouseKernel.__lastMouseDown = this;
            } else if (eventname == 'onmouseup') {
                if (LzMouseKernel.__lastMouseDown === this) {
                    // cancel mousedown event bubbling...
                    LzMouseKernel.__lastMouseDown = null;
                    e.stopPropagation();
                    this.__mousedown = false;
                } else {
                    skipevent = true;
                }
            } else if (eventname == 'onmouseupoutside') {
                this.__mousedown = false;
            } else {
                e.stopPropagation();
            }

            //Debug.write('__mouseEvent', eventname, this.owner);
            if (skipevent == true || ! this.owner.mouseevent) return;

            // send dragin/out events if the mouse is currently down
            if (LzMouseKernel.__lastMouseDown &&
                (eventname == 'onmouseover' || eventname == 'onmouseout')) {
                    // only send mouseover/out if the mouse went down on this sprite - see LPP-6677
                    if (LzMouseKernel.__lastMouseDown === this) {
                        LzMouseKernel.__sendEvent(this.owner, eventname);
                    } else {
                        // check to see if this sprite is in front of the sprite the mouse went down on.  See LPP-7300
                        var relObj:InteractiveObject = e.relatedObject;
                        // relatedObject is the sprite's clickbutton, use parent to access the LzSprite
                        if (eventname == 'onmouseover' && relObj && relObj.parent === LzMouseKernel.__lastMouseDown) {
                            // store reference to self for sending onmouseover event later - see LPP-7335
                            LzMouseKernel.__lastMouseDown.__mouseoverInFront = this;
                        } else {
                            LzMouseKernel.__lastMouseDown.__mouseoverInFront = null;
                        }
                    }

                    var dragname = eventname == 'onmouseover' ? 'onmousedragin' : 'onmousedragout';
                    LzMouseKernel.__sendEvent(this.owner, dragname);
            } else {
                LzMouseKernel.__sendEvent(this.owner, eventname);
            }

            // If this.showhandcursor is null, inherit value from LzMouseKernel.showhandcursor
            if (this.clickable && this.clickbutton) {
                this.clickbutton.useHandCursor = (showhandcursor == null) ? LzMouseKernel.showhandcursor : showhandcursor;
            }

      }

      /** setClickable( Boolean:clickable )
          o If true, sets the sprite to be clickable and receive mouse events
            through the mouseevent callback method
          o If false, sets the sprite to be unclickable and not receive mouse events 
      */
      public function setClickable( c:Boolean ):void {
          if (this.clickable == c) return;
          this.clickable = c;
          this.buttonMode = c;
          this.tabEnabled = false;
          var cb:SimpleButton = this.clickbutton;
          //trace('sprite setClickable' , c, 'cb',cb);
          if (this.clickable) {
              this.hitArea = null;
              attachMouseEvents(this);
              // TODO [hqm 2008-01] The Flash Sprite docs 
              // explain how to add a sprite to the tab order using tabEnabled property. 
              if (cb == null) {
                  this.clickbutton = cb = new SimpleButton();
                  addChildAt(cb, 0);
              }
              cb.useHandCursor = (showhandcursor == null) ? LzMouseKernel.showhandcursor : showhandcursor;
              cb.tabEnabled = false;
              var cr = new Shape();
              this.clickregion = cr;
              cr.graphics.beginFill(0xffffff);
              cr.graphics.drawRect(0, 0, 1, 1);
              cr.graphics.endFill();
              cr.scaleX = this.lzwidth;
              cr.scaleY = this.lzheight;
              // for debugging: make button visible
              // cb.overState = cr;
              //
              cb.hitTestState = cr;
              attachMouseEvents(cb);
          } else {
              removeMouseEvents(this);
              if (cb) {
                  removeChild(cb);
                  removeMouseEvents(cb);
                  this.clickbutton = null;
              }
              this.hitArea = LzSprite.emptySprite;
          }
      }

      public function debugClick(event:Event):void {
          trace("debugClick "+event + " " +event.target);
      }

      /** setX( Number:x )
          o Moves the sprite to the specified x coordinate 
      */
      public function setX ( x:Number ):void {
          this.x = x;
      }


      /** setY( Number:y )
          o Moves the sprite to the specified y coordinate 
      */
      public function setY ( y:Number ):void {
          this.y = y;
      }


      /** setWidth( Number:width )
          o Sets the sprite to the specified width 
      */
      public function setWidth( v:* ):void {
          if (isNaN(v)) return;
          this.lzwidth = v;
          this.applyStretchResource();
          // TODO [hqm 2008-01] We need to add back in the code here to
          // update the clipping mask size, and resource stretching as well, see swf8 kernel
          if (this.clickregion != null) {
              this.clickregion.scaleX = v;
          }

          // Update the clip region if there is one
          if (this.masksprite) {
              //trace('...sprite setting mask w,h', this.lzwidth ,this.lzheight);
              this.masksprite.scaleX = this.lzwidth;
              this.masksprite.scaleY = this.lzheight;
          }

          draw();
      }


      /** setHeight( Number:height )
          o Sets the sprite to the specified height 
      */
      public function setHeight( v:* ):void {
          if (isNaN(v)) return;
          this.lzheight = v;
          this.applyStretchResource();
          // TODO [hqm 2008-01] We need to add back in the code here to
          // update the clipping mask size, and resource stretching as well, see swf8 kernel
          if (this.clickregion != null) {
              this.clickregion.scaleY = v;
          }

          // Update the clip region if there is one
          if (this.masksprite) {
              //trace('...sprite setting mask w,h', this.lzwidth ,this.lzheight);
              this.masksprite.scaleX = this.lzwidth;
              this.masksprite.scaleY = this.lzheight;
          }
          draw();
      }

      /** @field Number rotation: The rotation value for the view (in degrees)
          Value may be less than zero or greater than 360.
      */
      public function setRotation ( v:Number ):void {
          this.rotation = v;
      }

      /** setVisible( Boolean:visibility )
          o Sets the visibility of the sprite 
      */
      public function setVisible( visibility:Boolean ):void {
          this.visible = visibility;
      }


      /** setColor( String/Number:color )
          o Sets the foreground color of the sprite
          o Can be a number (0xff00ff):void or a string ('#ff00ff'):void 
      */
      public function setColor( color:* ):void {
          // Only applicable for text
      }

      /** Returns the foreground color of the sprite. This isn't known so
          0 is returned.
      */
      public function getColor  (){
          // Only applicable for text
          return 0;
      }


      /**
       * Returns an object that represents the color transformation currently applied
       * to the view. The color transform object has the following possible keys
       * 
       * o.ra: percentage alpha for red component (-100 to 100);
       * o.rb: offset for red component (-255 to 255);
       * o.ga: percentage alpha for green component (-100 to 100);
       * o.gb: offset for green component (-255 to 255);
       * o.ba: percentage alpha for blue component (-100 to 100);
       * o.bb: offset for blue component (-255 to 255);
       * o.aa: percentage overall alpha (-100 to 100);
       * o.ab: overall offset (-255 to 255);
       */
      public function getColorTransform ():*{
          var ct = this.transform.colorTransform;
          return {ra: ct.redMultiplier * 100, rb: ct.redOffset,
                  ga: ct.greenMultiplier * 100, gb: ct.greenOffset,
                  ba: ct.blueMultiplier * 100 , bb: ct.blueOffset,
                  aa: ct.alphaMultiplier * 100, ab: ct.alphaOffset};
      }

      /**
       * color transforms everything contained in the view (except the
       * background) by the transformation dictionary given in <param>o</param>.  The dictionary has
       * the following possible keys:
       * 
       * o.ra: percentage alpha for red component (-100 to 100);
       * o.rb: offset for red component (-255 to 255);
       * o.ga: percentage alpha for green component (-100 to 100);
       * o.gb: offset for green component (-255 to 255);
       * o.ba: percentage alpha for blue component (-100 to 100);
       * o.bb: offset for blue component (-255 to 255);
       * o.aa: percentage overall alpha (-100 to 100);
       * o.ab: overall offset (-255 to 255);
       */
      function setColorTransform ( o:* ){
          this.transform.colorTransform = new ColorTransform(o.ra / 100.0,
                                                             o.ga / 100.0,
                                                             o.ba / 100.0,
                                                             o.aa ? o.aa / 100.0: 1.0,
                                                             o.rb,
                                                             o.gb,
                                                             o.bb,
                                                             o.ab ? o.ab : 0);
      }
      


      public function setFontName ( fname:String, prop=null ):void{
          this.fontname = fname;
      }

      /** setBGColor( String/Number:color )
          o Sets the background color of the sprite
          o Can be a number (0xff00ff):void or a string ('#ff00ff'):void 
      */
      public function setBGColor( c:* ):void {
          if (this.bgcolor == c) return;
          this.bgcolor = c;
          draw();
      }


      /** setOpacity( Number:opacity )
          o Sets the opacity of the sprite 
      */
      public function setOpacity( o:Number ):void {
          // TODO [hqm 2008-02] Do we need to do something special for opacity zero? 
          this.opacity = this.alpha = o;
      }


      /** play( Number:framenumber )
          o Plays a multiframe resource starting at the specified framenumber
          o Plays from the current frame if framenumber is null 
      */
      public function play (framenumber:* = null, rel:Boolean = false) :void {
          if (this.isaudio) {
              // audio-resource is attached
              this.updatePlay(true, framenumber, rel);
              
              this.owner.resourceevent('play', null, true);
          } else if (this.__isinternalresource) {
              stop(framenumber, rel);
          } else if (this.loaderMC) {
              this.owner.resourceevent('play', null, true);
              this.playing = this.owner.playing = true;
              if (framenumber == null) {
                  this.loaderMC.play();
              } else {
                  if (rel) framenumber += this.frame;
                  if (framenumber > this.totalframes) {
                      framenumber = this.totalframes;
                  } else if (framenumber < 1) {
                      framenumber = 1;
                  }
                  this.loaderMC.gotoAndPlay(framenumber);
              }
          } else {
              //Debug.write('unhandled play', framenumber, rel);
          }
      }


      /** stop( Number:framenumber )
          o Stops a multiframe resource at the specified framenumber
          o Stops at the current frame if framenumber is null 
      */
      public function stop (fn:* = null, rel:Boolean = false) :void {
          if (this.isaudio) {
              // audio-resource is attached
              var p:Boolean = this.playing;
              this.updatePlay(false, fn, rel);
              
              if (p) this.owner.resourceevent('stop', null, true);
          } else if (this.__isinternalresource) {
              var resinfo:Object = LzResourceLibrary[this.resource];

              // Frames are one based not zero based
              var frames:Array = resinfo.frames;
              if (fn == null || fn < 1) {
                  fn = 1;
              } else if (fn > frames.length) {
                  fn = frames.length;
              }
              this.frame = fn;
              var framenumber:int = fn - 1;

              var assetclass:Class;
              // single frame resources get an entry in LzResourceLibrary which has
              // 'assetclass' pointing to the resource Class object.
              if (resinfo.assetclass is Class) {
                  assetclass = resinfo.assetclass;
              } else {
                  // Multiframe resources have an array of Class objects in frames[]
                  assetclass = frames[framenumber];
              }

              if (assetclass) {
                  if (this.resourceCache == null) {
                      this.resourceCache = [];
                  }
                  var asset:DisplayObject = this.resourceCache[framenumber];
                  if (asset == null) {
                      //Debug.write('CACHE MISS, new ',assetclass);
                      asset = new assetclass();
                      asset.scaleX = 1.0
                      asset.scaleY = 1.0;
                      this.resourceCache[framenumber] = asset;
                  }

                  var oRect:Rectangle = asset.getBounds( asset );
                  if (oRect.width == 0 || oRect.height == 0) {
                      // it can take a while for new resources to show up.  Call back on the next frame, when we have a valid size.
                      LzIdleKernel.addCallback(this, '__resetframe');
                      return;
                  }
                    
                  if (this.resourceContainer != null) {
                      this.removeChild(this.resourceContainer);
                  }

                  if (asset is InteractiveObject) InteractiveObject(asset).mouseEnabled = false;
                  if (asset is DisplayObjectContainer) DisplayObjectContainer(asset).mouseChildren = false;

                  this.resourceContainer = asset;
                  this.addChildAt(asset,IMGDEPTH);

                  this.applyStretchResource();

                  if (asset is MovieClip && this.totalframes == 1) {
                    var loader:Loader = MovieClip(asset).getChildAt(0) as Loader;
                    if (loader.content is AVM1Movie) {
                        //no playback control for AVM1 movies...
                    } else {
                        // treat as a loader...
                        // could they make this any less obvious?
                        // see http://www.bit-101.com/blog/?p=1435 
                        this.__isinternalresource = false;
                        this.loaderMC = MovieClip(loader.content);
                        this.totalframes = this.loaderMC.totalFrames;
                        this.loaderMC.gotoAndStop(fn);
                    }
                  }
              } else {
                  // bad resource?
              }
          } else if (this.loaderMC) {
              if ( this.playing ) this.owner.resourceevent('stop', null, true);
              this.playing = this.owner.playing = false;
              if (fn == null) {
                  this.loaderMC.stop();
              } else {
                  if (rel) fn += this.frame;
                  if (fn > this.totalframes) {
                      fn = this.totalframes;
                  } else if (fn < 1) {
                      fn = 1;
                  }
                  this.loaderMC.gotoAndStop(fn);
              }
          } else {
              // This shouldn't happen - but it does, on roll over 
              //Debug.write('unhandled stop', fn, rel);
          }
      }

      /** Callback resets resources after they have loaded and displayed */
      public function __resetframe(ignore=null):void {
          LzIdleKernel.removeCallback(this, '__resetframe');
          this.stop(this.frame);
      }

      /** setClip( Boolean:clip )kernel/swf9/
          o If true, clips the sprite's children to its width and height
          o If false, does not clip the sprite's children to its width and height 
      */
      public function setClip( clip:Boolean ):void {
          if (clip) {
              applyMask();
          } else {
              removeMask();
          }
      }

      // Create a Flash Sprite to use as the clipping mask.
      public function applyMask():void {
          var ms:Sprite = this.masksprite;
          if (ms == null) {
              ms = new Sprite();
              ms.graphics.clear();
              ms.graphics.beginFill(0xffffff);
              ms.graphics.drawRect(0, 0, 1, 1);
              ms.graphics.endFill();
              ms.scaleX = this.lzwidth;
              ms.scaleY = this.lzheight;
              addChild(ms);
              this.mask = ms;
              this.masksprite = ms;
              //trace('applyMask [1] ', this.lzwidth, this.lzheight, owner);
          } else {
              if (this.mask == null) {
                  addChild(ms);
                  this.mask = ms;
              }
              //trace('applyMask [2] ', this.lzwidth, this.lzheight, owner);
              ms.scaleX = this.lzwidth;
              ms.scaleY = this.lzheight;
          }
      }

      public function removeMask():void {
          this.removeChild(this.masksprite);
          this.mask = null;
      }


      /** stretchResource( String:axes )

          o Causes the sprite to stretch its resource along axes,
          either 'width' 'height' or 'both' so the resource is the
          same size as the sprite along those axes.

          o If axes is not 'width', 'height' or 'both', the resource
          is sized to its natural/default size, rather than the
          sprite's size
      */
      public function stretchResource( xory:String ):void {
          if (xory == "width" || xory == "both") {
              this._setrescwidth = true;
          }

          if (xory == "height" || xory == "both") {
              this._setrescheight = true;
          }
          this.applyStretchResource();
      }

      public function applyStretchResource():void {
          if (this.resourceContainer == null) {
              return;
          }

          var res = this.resourceContainer;

          // Don't try to do anything while an image is loading
          if (res == null) return;

          var scaleX:Number = 1.0;
          if (this.lzwidth && this._setrescwidth && this.resourcewidth) {
              scaleX = this.lzwidth / this.resourcewidth;
          }

          var scaleY:Number = 1.0;
          if (this.lzheight && this._setrescheight && this.resourceheight) {
              scaleY = this.lzheight / this.resourceheight;
          }

          res.scaleX = scaleX;
          res.scaleY = scaleY;
          //Debug.write(res, scaleX, scaleY, res.width, res.height);
      }


      /** destroy()
          o Causes the sprite to destroy itself
      */
      public function destroy( ):void {
          //PBR
          this.unload();
          if (parent) {
              parent.removeChild(this);
          }
      }


      /** getMouse( String:xory )
          o Returns the mouse position for this sprite, for either 'x' or 'y' 
      */
      public function getMouse( xory:String ):Object {
          return {x: Math.round(this.mouseX), y: Math.round(this.mouseY)};
      }

      /** getWidth()
          o Returns the current width of the sprite 
      */
      public function getWidth():Number {
          return this.width;
      }


      /** getHeight()
          o Returns the current height of the sprite 
      */
      public function getHeight ():Number {
          return this.height;
      }


      /** bringToFront()
          o Brings this sprite to the front of its siblings 
      */
      public function bringToFront ():void {
//PBR
          if (!this.isroot && parent) {
              parent.setChildIndex(this, parent.numChildren-1);
          }
      }


      /** sendToBack()
        * Sends this sprite to the back of its siblings 
      */
      public function sendToBack():void {
          if (!this.isroot) {
              parent.setChildIndex(this, 0);
          }
      }

      /**
        * Puts this sprite in front of one of its siblings.
        * @param LzSprite v: The sprite this sprite should go in front of. If the passed sprite is null or not a sibling, the method has no effect.
        */
      public function sendInFrontOf( sprite ){
          if (!this.isroot) {
              var i = parent.getChildIndex(sprite);
              var j = parent.getChildIndex(this);
              if (j < i) parent.setChildIndex(this, i);
          }
      }

      /** sendBehind()
        * Puts this sprite behind one of its siblings.
        * @param LzSprite sprite: The sprite this sprite should go in front of. If the sprite is null or not a sibling, the method has no effect.
      */
      public function sendBehind( sprite ){
          if (!this.isroot) {
              var i = parent.getChildIndex(sprite);
              parent.setChildIndex(this, i);
          }
      }

      /** setStyleObject( Object:style )
          o Sets the style object of the sprite 
      */
      public function setStyleObject( style:Object ):void {
          trace('LzSprite.setStyleObject not yet implemented');
      }

      /** getStyleObject()
          o Gets the style object of the sprite 
      */
      public function getStyleObject():Object {
          trace('LzSprite.getStyleObject not yet implemented');
          return null;
      }

      /** removes all children from a container */
      public function removeChildren(container:DisplayObjectContainer):void {
          while (container.numChildren > 0) {
              container.removeChildAt(0);
          }
      }

      public function unload() {
        if (this.owner != null) {
              this.owner.resourceevent('loadratio', 0);
              this.owner.resourceevent('framesloadratio', 0);
        }
        if (this.imgLoader) {
            try {
                // close the stream
                this.imgLoader.close();
            } catch (error:Error) {
                // throws an error if stream has already finished loading
            }
            // unload any content, call after close()
            // for swf10: this.imgLoader.unloadAndStop();
            this.imgLoader.unload();
        }
        if (this.resourceContainer != null) {
            this.removeChild(this.resourceContainer);
            this.resourceContainer = null;
        }
        if (this.isaudio) this.unloadSound();
        // clear out cached values
        this.lastreswidth = this.lastresheight = this.resourcewidth = this.resourceheight = 0;
        this.resource = null;
        this.__isinternalresource = null;
        if (this.loaderMC) {
            this.loaderMC.removeEventListener(Event.ENTER_FRAME, updateFrames);
            this.loaderMC = null;
        }
        this.imgLoader = null;
        this.resourceCache = null;
      }

      public function setAccessible(accessible:*) {
          trace('LzSprite.setAccessible not yet implemented');
      }

      public function getMCRef () {
          return this; 
      }

      public function getContext () {
          return this.graphics; 
      }

      public function setBitmapCache(cache) {
          this.cacheAsBitmap = cache;
      }

      /**
        * Get the current z order of the sprite
        * @return Integer: A number representing z orderin
        */
      public function getZ():int {
           return parent.getChildIndex(this);
      }

      var __contextmenu;

      /* LzSprite.setContextMenu
       * Install menu items for the right-mouse-button 
       * @param LzContextMenu cmenu: LzContextMenu to install on this view
       */
      function setContextMenu ( lzmenu ){
          if (lzmenu == null) {
              this.__contextmenu = null;
          } else {
              this.__contextmenu = lzmenu;
              var cmenu:ContextMenu = lzmenu.kernel.__LZcontextMenu();

              // TODO [hqm 2008-04] make this do the more complex stuff that swf8 LzSprite does now,
              // where it checks for a resource or bgcolor sprite, in order to make the clickable region
              // match what the user expects.


              // "contextMenu" is a swf9 property on flash.display.Sprite
              this.contextMenu = cmenu;
          }
      }

      function setDefaultContextMenu ( cmenu ){
          // TODO [hqm 2008-11] In SWF8, we can set the contextMenu
          // property of MovieClip.prototype, which puts the menu on
          // every MovieClip by default. Not sure if there's any way
          // to do that in swf9.
          LzSprite.prototype.contextMenu = cmenu.kernel.__LZcontextMenu();
      }

      /**
       * LzView.getContextMenu
       * Return the current context menu
       */
      function getContextMenu() {
          return this.__contextmenu;
      }


      function sendResourceLoad(skiponload = false) {
          // skiponload is true for resources/setResource() calls
          if (this.owner != null) {
              this.owner.resourceload({width: this.resourcewidth, height: this.resourceheight, resource: this.resource, skiponload: skiponload});
          }
      }

      var cursorResource:String = null;

      /**
       * CURSOR is a string naming the resource to be used as the mouse pointer
       */
      function setCursor ( cursor:String=null ){
          if (cursor == null) return;
          if (cursor != '') {
              this.cursorResource = cursor;
              // Disable mouseout handler until it's safe from spurious events due
              // to addChild of a swf resource
              addEventListener(MouseEvent.MOUSE_OUT, cursorGotMouseout, true);
              addEventListener(MouseEvent.MOUSE_OVER, cursorGotMouseover, true);
          } else {
              LzMouseKernel.restoreCursorLocal();
              removeEventListener(MouseEvent.MOUSE_OVER, cursorGotMouseover, true);
              removeEventListener(MouseEvent.MOUSE_OUT, cursorGotMouseout, true);
              this.cursorResource = null;
          }
      }

      /** @access private */
      function cursorGotMouseover (event:MouseEvent) {
          LzMouseKernel.setCursorLocal(this.cursorResource);
      }


      /** @access private */
      function cursorGotMouseout (event:MouseEvent) {
          // If we get a mouseout event, but the cursor is still on
          // top of this sprite, then that assume a "ghost event", due
          // to the addChild() call when cursor resource is being set.
          var str:String = event.target.name;
          LzMouseKernel.restoreCursorLocal();
      }

      function setVolume (v:Number) :void {
          LzAudioKernel.setVolume(v, this);
      }

      function getVolume () :Number {
          return LzAudioKernel.getVolume(this);
      }

      function setPan (p:Number) :void {
          LzAudioKernel.setPan(p, this);
      }

      function getPan () :Number {
          return LzAudioKernel.getPan(this);
      }
      
      /** 
        * @param Number secs: 
        * @param Boolean playing: 
        */
      function seek (secs:Number, doplay:Boolean) :void {
          if (this.isaudio) {
              var pos:Number = this.getCurrentTime() + secs;
              if (pos < 0) pos = 0;
              // don't seek too far
              var total:Number = this.getTotalTime();
              if (pos > total) pos = total;

              if (this.playing) {
                  this.stopPlay();
              }
              if (doplay) {
                  this.startPlay(pos, false);
              } else {
                  this.frame = Math.floor(pos * MP3_FPS);
              }
          }
      }
      
      /** 
        * @return Number: time elapsed (in seconds)
        */
      function getCurrentTime () :Number {
          if (this.isaudio) {
              if (this.playing) {
                  // use SoundChannel if possible, it is more accurate
                  return this.soundChannel.position * 0.001;
              } else {
                  return (this.frame / MP3_FPS);
              }
          } else {
              return 0;
          }
      }
      
      /** 
        * @return Number: length of the current sound (in seconds)
        */
      function getTotalTime () :Number {
          return this.isaudio ? this.sound.length * 0.001 : 0;
      }
      
      /** 
        * @return ID3Info: id3-info of the current sound
        */
      function getID3 () :ID3Info {
          return this.isaudio ? this.sound.id3 : null;
      }

      /**
        *
        */
      function setShowHandCursor ( s:* ){
          this.showhandcursor = s;
      }

      function setAAActive(s) {
          trace('LzSprite.setAAActive not yet implemented');
      }

      function setAAName(s) {
          trace('LzSprite.setAAName not yet implemented');
      }

      function setAADescription(s) {
          trace('LzSprite.setAADescription not yet implemented');
      }

      function setAATabIndex(s) {
          trace('LzSprite.setAATabIndex not yet implemented');
      }

      function setAASilent(s) {
          trace('LzSprite.setAASilent not yet implemented');
      }

      function updateResourceSize(skipsend = null){
        this.setWidth(this._setrescwidth?this.width:this.resourcewidth);
        this.setHeight(this._setrescheight?this.height:this.resourceheight);

        if (! skipsend) this.owner.resourceload({width: this.resourcewidth, height: this.resourceheight, resource: this.resource, skiponload: true});
      }

      function setClickRegion (cr:*) :void {
          trace('LzSprite.setClickRegion not yet implemented');
      }

  }#
  }



