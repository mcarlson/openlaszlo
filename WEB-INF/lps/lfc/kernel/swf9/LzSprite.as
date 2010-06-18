/**
  * LzSprite.as
  *
  * @copyright Copyright 2007-2010 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic swf9
  * @author Henry Minsky &lt;hminsky@laszlosystems.com&gt;
  */

public class LzSprite extends Sprite {

#passthrough (toplevel:true) {
  import flash.display.AVM1Movie;
  import flash.display.Bitmap;
  import flash.display.BitmapData;
  import flash.display.DisplayObject;
  import flash.display.DisplayObjectContainer;
  import flash.display.Graphics;
  import flash.display.InteractiveObject;
  import flash.display.Loader;
  import flash.display.LoaderInfo;
  import flash.display.MovieClip;
  import flash.display.SimpleButton;
  import flash.display.Sprite;
  import flash.display.SWFVersion;
  import flash.errors.IOError;
  import flash.events.Event;
  import flash.events.ErrorEvent;
  import flash.events.IOErrorEvent;
  import flash.events.MouseEvent;
  import flash.events.ProgressEvent;
  import flash.events.SecurityErrorEvent;
  import flash.geom.ColorTransform;
  import flash.geom.Rectangle;
  import flash.geom.Matrix;
  import flash.media.Sound;
  import flash.media.SoundChannel;
  import flash.media.SoundMixer;
  import flash.media.SoundTransform;
  import flash.media.SoundLoaderContext;
  import flash.media.ID3Info;
  import flash.net.URLRequest;
  import flash.system.LoaderContext;
  import flash.text.TextField;
  import flash.ui.ContextMenu;
  import flash.filters.DropShadowFilter;
}#

#passthrough  {

    public var owner:* = null;

    public var bgcolor:* = null;

    public var lzwidth:Number = 0;
    public var lzheight:Number = 0;

    public var opacity:Number = 1;
    public var playing:Boolean = false;
    public var clickable:Boolean = false;
    public var clickbutton:SimpleButton = null;
    public var clickregion:Sprite = null;
    public var clickregionwidth:Number;
    public var clickregionheight:Number;
    public var masksprite:Sprite = null;
    public var resource:String = null;
    public var clip:Boolean = false;
    public var resourcewidth:Number = 0;
    public var resourceheight:Number = 0;
    public var isroot:Boolean = false;
    public static var rootSprite:LzSprite = null;

    // Used for workaround for contextmenu bug; use as a null hitArea for sprites that
    // we don't want to get mouse events.
    public static var emptySprite:Sprite = new Sprite();

    // If null, the handcursor visibility is set to the value of LzMouseKernel.showhandcursor
    // whenevent a mouseover event happens.
    public var showhandcursor:* = null;

    public var fontsize:Number = 11;
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

    // NOTE: [2009-02-01 ptw] This may look like it should be a static
    // var, but LFC code expects capabilities to be a
    // property of the sprite, so we copy it to an instance var
    static var capabilities:* = {
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
    ,history: true
    ,runtimemenus: true
    ,setclipboard: true
    ,proxypolicy: true
    ,linescrolling: true
    ,allowfullscreen: true
    ,setid: false
    ,globalfocustrap: false
    ,'2dcanvas': true
    ,dropshadows: true
    ,cornerradius: true
    ,css2boxmodel: true
    ,medialoading: true
    ,backgroundrepeat: true
    ,clickregion: true
    };
    var capabilities = LzSprite.capabilities;

    static var id:String;

    static var medialoadtimeout:Number = 30000;
    static var mediaerrortimeout:Number = 4500;

    public function LzSprite (newowner:LzView = null, isroot:Object = null) {
        // owner:*, isroot:Boolean
        this.owner = newowner;
        if (owner == null) return;
        if (isroot) {
            this.isroot = true;
            LzSprite.rootSprite = this;
            this.mouseEnabled = true;// @devnote: see LPP-6980
            id = LFCApplication.stage.loaderInfo.parameters['id'];
        } else {
            this.mouseEnabled = true;
            this.hitArea = LzSprite.emptySprite;
        }
    }

    /**
     * The canvas fills the root container.  To resize the canvas, we
     * resize the root container.
     *
     * @access private
     */
    public static function setRootX (v) {
        DojoExternalInterface.call('lz.embed.__swfSetAppAppendDivStyle', null, id, 'position', 'absolute')
        DojoExternalInterface.call('lz.embed.__swfSetAppAppendDivStyle', null, id, 'left', LzKernelUtils.CSSDimension(v))
    }

    /**
     * The canvas fills the root container.  To resize the canvas, we
     * resize the root container.
     *
     * @access private
     */
    public static function setRootWidth (v) {
        DojoExternalInterface.call('lz.embed.__swfSetAppAppendDivStyle', null, id, 'width', LzKernelUtils.CSSDimension(v))
    }

    /**
     * The canvas fills the root container.  To resize the canvas, we
     * resize the root container.
     *
     * @access private
     */
    public static function setRootY (v) {
        DojoExternalInterface.call('lz.embed.__swfSetAppAppendDivStyle', null, id, 'position', 'absolute')
        DojoExternalInterface.call('lz.embed.__swfSetAppAppendDivStyle', null, id, 'top', LzKernelUtils.CSSDimension(v))
    }

    /**
     * The canvas fills the root container.  To resize the canvas, we
     * resize the root container.
     *
     * @access private
     */
    public static function setRootHeight (v) {
        DojoExternalInterface.call('lz.embed.__swfSetAppAppendDivStyle', null, id, 'height', LzKernelUtils.CSSDimension(v))
    }

    /**
     * @access private
     */
    public var initted = false;
    public function init (v:Boolean = true):void {
        if (this.mask) {
            this.drawMask();
        }
        this.setVisible(v);

        if (this.isroot) {
            // The canvas should be as big as the stage
            this.setWidth(LFCApplication.stage.stageWidth);
            this.setHeight(LFCApplication.stage.stageHeight);

            if (DojoExternalInterface.available) {
                // Expose your methods
                DojoExternalInterface.addCallback("getCanvasAttribute", lz.History, lz.History.getCanvasAttribute);
                DojoExternalInterface.addCallback("setCanvasAttribute", lz.History, lz.History.setCanvasAttribute);
                DojoExternalInterface.addCallback("callMethod", lz.History, lz.History.callMethod);
                DojoExternalInterface.addCallback("receiveHistory", lz.History, lz.History.receiveHistory);
                
                // Tell JavaScript that you are ready to have method calls
                DojoExternalInterface.loaded();
            }
        }
        this.initted = true;
    }

    /**  addChildSprite(Sprite:sprite)
        o Adds a child sprite to this sprite's display hierarchy 
    */
    public function addChildSprite(sprite:LzSprite):void {
        addChild(sprite);
        //trace('addChildSprite ', sprite, 'added to ' ,this.owner);
    }


    public function predestroy() :void {
    }

    // Holds onto backgroundrepeat bitmap when needed
    private var __repeatbitmap:BitmapData = null;
    public function drawBackground():void {
        var context = this.graphics;
        context.clear();
        // ensures context menus work with compiled resources by covering them with a 
        // clickable bitmap in the display list - see LPP-8815
        if (this.__bgcolorhidden && this.clickable != true && this.__isinternalresource) {
            if (this.__bgsprite == null) {
                this.__bgsprite = new Sprite()
                this.addChild(this.__bgsprite);
            }
            context = this.__bgsprite.graphics;
            context.clear();
        } else if (this.__bgsprite != null) {
            this.removeChild(this.__bgsprite);
            this.__bgsprite = null;
        }

        var alpha:Number = this.__bgcolorhidden ? 0 : 1;
        if (this.__repeatbitmap) this.__repeatbitmap.dispose();
        if (this.backgroundrepeat && this.resourcewidth && this.resourceheight) {
            var bmp = copyBitmap(this, this.resourcewidth, this.resourceheight);
            if (bmp) {
                context.beginBitmapFill(bmp);
                var height = this.repeaty ? this.lzheight : this.resourceheight;
                var width = this.repeatx ? this.lzwidth : this.resourcewidth;
                LzKernelUtils.rect(context, 0 - this.padding, 0 - this.padding, width + (this.padding * 2), height + (this.padding * 2), this.cornerradius);
                context.endFill();
                // disposing here messes with the fill - store to dispose later
                this.__repeatbitmap = bmp;
            }
        }
        if (this.borderWidth) {
            var colorobj = LzColorUtils.inttocolorobj(borderColor);
            context.beginFill(colorobj.color, alpha);
            this.drawBorder(context);
            context.endFill();
        }
        if (bgcolor != null) {
            context.beginFill(this.bgcolor, alpha);
            this.drawBackgroundFill(context);
            context.endFill();
        }
    }

    public function drawMask():void {
        if (this.masksprite) {
            var context = this.masksprite.graphics;
            context.clear();
            context.beginFill(0xffffff);
            this.drawBorder(context);
            this.drawBackgroundFill(context);
            context.endFill();
        }
    }

    private function drawBorder(context:Graphics):void {
        var offset = this.padding + this.borderWidth;
        LzKernelUtils.rect(context, 0 - offset, 0 - offset, this.lzwidth + (offset * 2), this.lzheight + (offset * 2), this.cornerradius);
    }

    private function drawBackgroundFill(context:Graphics):void {
        LzKernelUtils.rect(context, 0 - this.padding, 0 - this.padding, this.lzwidth + (this.padding * 2), this.lzheight + (this.padding * 2), this.cornerradius);
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

            this.resourcewidth = Math.round(res.width);
            this.resourceheight = Math.round(res.height);
            this.totalframes = res.frames.length;
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
            this.startSoundPlay()

            // send events, but skip onload
            this.sendResourceLoad(true);
        } else if ($debug) {
            Debug.warn('Unhandled asset in setResource %w: %w', LzAsset.getAssetType(r), r);
        }
    }


    public var imgLoader:Loader;
    public var loaderMC:MovieClip;
    private const IMGDEPTH:int = 0;
    private static const MIME_SWF:String = "application/x-shockwave-flash";

    /** setSource( String:url )
        o Loads and displays media from the specified url
        o Uses the resourceload callback method when the resource finishes loading 
    */
    public function setSource (url:String, cache:String = null, headers:String = null, filetype:String = null) :void {
        if (url == null || url == 'null') {
            return;
        }
        var loadurl:String = getLoadURL(url, cache, headers);
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
                this.attachLoaderEvents(imgLoader.contentLoaderInfo);
            } else {
                //TODO [20080911 anba] cancel current load?
                // imgLoader.close();
            }
            this.__isinternalresource = false;
            this.resource = url;
            var res:Loader = this.imgLoader;
            if (res) {
                res.scaleX = res.scaleY = 1.0;
            }

            imgLoader.load(new URLRequest(loadurl), LzSprite.loaderContext);
        }
    }

    private function getLoadURL (url:String, cache:String, headers:String) :String {
        var loadurl:String = url;
        var proxied:* = this.owner.__LZcheckProxyPolicy( url );
        if (proxied) {
            var proxyurl:String = this.owner.getProxyURL(url);
            var params:Object = {serverproxyargs: {},
                                 timeout: LzSprite.medialoadtimeout,
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
        return loadurl;
    }

    private function getFileType (url:String, filetype:String) :String {
        if (filetype != null) {
            return filetype.toLowerCase();
        } else {
            var si:int = url.lastIndexOf(".");
            return si != -1 ? url.substring(si + 1).toLowerCase() : null;
        }
    }

    private function attachLoaderEvents (info:LoaderInfo) :void {
        info.addEventListener(ProgressEvent.PROGRESS, loaderEventHandler);
        info.addEventListener(Event.OPEN, loaderEventHandler);
        // info.addEventListener(Event.UNLOAD, loaderEventHandler);
        // info.addEventListener(Event.INIT, loaderEventHandler);
        info.addEventListener(Event.COMPLETE, loaderEventHandler);
        info.addEventListener(SecurityErrorEvent.SECURITY_ERROR, loaderEventHandler);
        info.addEventListener(IOErrorEvent.IO_ERROR, loaderEventHandler);
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
                try {
                    // accessing LoaderInfo.content may throw security exceptions
                    var content:DisplayObject = info.content;
                    if (content is AVM1Movie) {
                        // no playback control
                    } else if (content is MovieClip) {
                        // store a reference for playback control
                        this.loaderMC = MovieClip(content);  
                        this.totalframes = this.loaderMC.totalFrames;
                        this.loaderMC.addEventListener(Event.ENTER_FRAME, updateFrames);
                        this.owner.resourceevent('play', null, true);
                        this.playing = this.owner.playing = true;
                    } else if (content is Bitmap) {
                        (content as Bitmap).smoothing = true;
                    }
                } catch (error:SecurityError) {
                    // ignore for now
                }

                try {
                    var res:DisplayObject = this.resourceContainer;
                    var scaleX:Number = res.scaleX;
                    var scaleY:Number = res.scaleY;
                    res.scaleX = 1.0;
                    res.scaleY = 1.0;
                    this.resourcewidth = this.resourceContainer.width;
                    this.resourceheight = this.resourceContainer.height;
                    res.scaleX = scaleX;
                    res.scaleY = scaleY;
                } catch (error:Error) {
                    // TODO [20090203 anba] install default values?
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
                    // IOErrorEvent/SecurityErrorEvent -> ErrorEvent
                    this.owner.resourceloaderror( (event as ErrorEvent).text );
                }
            } else if (event.type == ProgressEvent.PROGRESS) {
                var ev:ProgressEvent = event as ProgressEvent;
                var lr:Number = ev.bytesLoaded / ev.bytesTotal;
                if (! isNaN(lr)) {
                    this.owner.resourceevent('loadratio', lr);
                }

                if (LzSprite.quirks.loaderinfoavailable) {
                    // look for frame properties where available
                    try {
                        // accessing LoaderInfo.content may throw security 
                        // exceptions
                        var info:LoaderInfo = event.target as LoaderInfo;
                        var content:DisplayObject = info.content;
                        if (content is MovieClip) {
                            var loaderMC = MovieClip(content);
                            if (loaderMC) {
                                var total = loaderMC.totalFrames;
                                if (this.totalframes != total) {
                                    // this calls a setter to send the 
                                    // resourceevent
                                    this.totalframes = total;
                                }
                                this.owner.resourceevent('framesloadratio', loaderMC.framesLoaded / total);
                            }
                        }
                    } catch (error:SecurityError) {
                        // ignore for now
                    }
                }
            } else if (event.type == Event.OPEN) {
                this.owner.resourceevent('loadratio', 0);
            } else if (event.type == Event.UNLOAD) {
            }
        } catch (error:Error) {
            if ($debug) Debug.warn("loaderEventHandler(%w): %w", event, error);
        }
        this.drawBackground();
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

        this.soundLoading = true;
        this.sound.load(new URLRequest(url), LzSprite.soundLoaderContext);

        // TODO: add condition on this
        this.startSoundPlay();
    }

    /** 
      * Stop current playback and unload sound
      */
    private function unloadSound () :void {
        if (this.playing) {
            // stop playing
            this.stopSoundPlay();
        }
        if (this.sound) {
            if (this.soundLoading) {
                // stop streaming sound
                try {
                    this.sound.close();
                } catch (e:IOError) {
                    // ignore for now
                }
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
    private function startSoundPlay (frame:Number = 0, isFrame:Boolean = true) :void {
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
    private function stopSoundPlay () :Number {
        var frame:Number = Math.floor(this.soundChannel.position * 0.001 * MP3_FPS);

        this.playing = this.owner.playing = false;
        this.removeEventListener(Event.ENTER_FRAME, soundFrameHandler);
        this.soundChannel.stop();
        this.soundChannel = null;

        return frame;
    }

    /** 
      * Update sound play status
      */
    private function updateSoundPlay (play:Boolean, framenumber:*, rel:Boolean) :void {
        var fr:Number;
        if (this.playing) {
            // stop previous playback
            fr = this.stopSoundPlay();
        } else {
            // TODO: this.frame is initialized with 1, which
            // means we currently skip 33ms at the beginning
            fr = this.frame;
        }

        if (framenumber != null) {
            framenumber += rel ? fr : 0;
        } else if (play) {
            // start at the beginning again if we're already at the end,
            // but only if the music is going to be started (play=true)
            framenumber = fr >= this.totalframes ? 0 : fr;
        } else {
            framenumber = fr;
        }

        if (play) {
            this.startSoundPlay(framenumber);
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
                this.owner.resourceevent('framesloadratio', 0);
            } else if (event.type == Event.COMPLETE) {
                this.soundLoading = false;
                this.owner.resourceevent('loadratio', 1);
                this.owner.resourceevent('framesloadratio', 1);
                this.totalframes = Math.floor(this.getTotalTime() * MP3_FPS);

                // send events, including onload
                this.sendResourceLoad();
            } else if (event.type == ProgressEvent.PROGRESS) {
                var ev:ProgressEvent = event as ProgressEvent;
                var lr:Number = ev.bytesLoaded / ev.bytesTotal;
                if (! isNaN(lr)) {
                    this.owner.resourceevent('loadratio', lr);
                    // emulate framesloadratio behavior from swf8
                    this.owner.resourceevent('framesloadratio', lr);
                }
            } else if (event.type == IOErrorEvent.IO_ERROR) {
                this.soundLoading = false;
                this.owner.resourceevent('loadratio', 0);
                this.owner.resourceevent('framesloadratio', 0);
                this.owner.resourceloaderror( (event as IOErrorEvent).text );
            }
        } catch (error:Error) {
            if ($debug) Debug.warn("soundLoadHandler(%w): %w", event.type, error);
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
            this.stopSoundPlay();
            this.frame = this.totalframes;

            // SoundChannel.position does not stop exactly at Sound.length, 
            // there are a few ms difference between both values. 
            // So instead of comparing 'frame' == 'totalframes', 
            // we'll send the 'lastframe'-event when playback stopped.
            this.owner.resourceevent('lastframe', null, true);
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
        LzMouseKernel.handleMouseEvent( owner, 'ondblclick');
        event.stopPropagation();
    }

    // To avoid an artifact in SWF10, if we want to turn off the
    // handCursor on buttons, we have to set the flag before we are
    // inside of an onmouseover event handler. This maps over the
    // app display list setting the handcursor flag on all
    // clickbuttons to a global value.  Call this from
    // LzMouseKernel when global hand cursor is enabled/disabled.
    public function setGlobalHandCursor (val:Boolean ):void {
        for (var i:int = 0; i < numChildren; i++) {
            var child:DisplayObject = getChildAt(i);
            if (child is SimpleButton) {
                var cs:SimpleButton = child as SimpleButton;
                if (val == true) {
                    var psprite:LzSprite = (cs.parent as LzSprite);
                    cs.useHandCursor = (psprite.showhandcursor == null) ?
                        LzMouseKernel.showhandcursor : psprite.showhandcursor;
                } else {
                    cs.useHandCursor = false;
                }
            } 
            if (child is LzSprite) {
                (child as LzSprite).setGlobalHandCursor(val);
            }
        }
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
                LzMouseKernel.handleMouseEvent(mouseOverSprite.owner, 'onmouseover');
            }
        }
        LzMouseKernel.__lastMouseDown = null;
    }

    public function __mouseEvent( e:MouseEvent ) :void {
          var skipevent:Boolean = false;
          var stopevent:Boolean = true;
          var eventname:String = 'on' + e.type.toLowerCase();

          if (eventname == 'onmousedown') {
              LzMouseKernel.__lastMouseDown = this;
              this.__mousedown = true;
          } else if (eventname == 'onmouseup') {
              if (LzMouseKernel.__lastMouseDown === this) {
                  LzMouseKernel.__lastMouseDown = null;
                  this.__mousedown = false;
              } else {
                  skipevent = true;
                  stopevent = false;
              }
          } else if (eventname == 'onmouseupoutside') {
              this.__mousedown = false;
          } else if (eventname == 'onmouseout' || eventname == 'onmouseover') {
              var relObj:InteractiveObject = e.relatedObject;
              if (relObj is TextField && relObj.parent is LzTextSprite) {
                  var lztext:LzTextSprite = LzTextSprite(relObj.parent);
                  if (lztext.forwardsMouse) {
                      var nextMouse:DisplayObject = lztext.getNextMouseObject(e);
                      if (nextMouse === this) {
                          // don't report onmouseover/out events if object didn't change
                          skipevent = true;
                      }
                  }
              }
          }

          // cancel mouse event bubbling...
          if (stopevent) e.stopPropagation();

          //Debug.write('__mouseEvent', eventname, this.owner);
          if (skipevent == true || ! this.owner.mouseevent) return;

          // send dragin/out events if the mouse is currently down
          if (LzMouseKernel.__lastMouseDown &&
              (eventname == 'onmouseover' || eventname == 'onmouseout')) {
                  // only send mouseover/out/dragin/dragout if the mouse went down on this sprite (LPP-6677, LPP-7335)
                  if (LzMouseKernel.__lastMouseDown === this) {
                      LzMouseKernel.handleMouseEvent(this.owner, eventname);

                      var dragname:String = eventname == 'onmouseover' ? 'onmousedragin' : 'onmousedragout';
                      LzMouseKernel.handleMouseEvent(this.owner, dragname);
                  } else {
                      // defer mouse-events until mouse is released (LPP-7300, LPP-7335)
                      if (eventname == 'onmouseover') {
                          LzMouseKernel.__lastMouseDown.__mouseoverInFront = this;
                      } else {
                          LzMouseKernel.__lastMouseDown.__mouseoverInFront = null;
                      }
                  }
          } else {
              LzMouseKernel.handleMouseEvent(this.owner, eventname);
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
        this.updateBackground();
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
            if (! this.clickregion) {
                this.setClickRegion(this.clickresource);
            }
            // for debugging: make button visible
            // cb.overState = cr;
            //
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

    // used to get the 'true' x or y position
    private var _x:Number = 0;
    /** setX( Number:x )
        o Moves the sprite to the specified x coordinate 
    */
    public function setX ( x:Number ):void {
        this._x = x;
        this.x = x + this.margin + this.borderWidth + this.padding;
    }


    private var _y:Number = 0;
    /** setY( Number:y )
        o Moves the sprite to the specified y coordinate 
    */
    public function setY ( y:Number ):void {
        this._y = y;
        this.y = y + this.margin + this.borderWidth + this.padding;
    }


    /** setWidth( Number:width )
        o Sets the sprite to the specified width 
    */
    public function setWidth( v:Number ):void {
        this.lzwidth = v;
        this.applyStretchResource();
        // TODO [hqm 2008-01] We need to add back in the code here to
        // update the clipping mask size, and resource stretching as well, see swf8 kernel
        if (this.clickregion != null) {
            this.clickregion.scaleX = v / this.clickregionwidth;
        }

        // Update the clip region if there is one
        if (this.masksprite) {
            this.drawMask();
        }

        drawBackground();
    }


    /** setHeight( Number:height )
        o Sets the sprite to the specified height 
    */
    public function setHeight( v:Number ):void {
        this.lzheight = v;
        this.applyStretchResource();
        // TODO [hqm 2008-01] We need to add back in the code here to
        // update the clipping mask size, and resource stretching as well, see swf8 kernel
        if (this.clickregion != null) {
            this.clickregion.scaleY = v / this.clickregionheight;
        }

        // Update the clip region if there is one
        if (this.masksprite) {
            this.drawMask();
        }
        drawBackground();
    }

    /** @field Number rotation: The rotation value for the view (in degrees)
        Value may be less than zero or greater than 360.
    */
    public function setRotation ( v:Number ):void {
        this.rotation = v;
    }

    public function setRotationX(val:Number):void {
        this['rotationX'] = val;
    }

    public function setRotationY(val:Number):void {
        this['rotationY'] = val;
    }

    public function setRotationZ(val:Number):void {
        this['rotationZ'] = val;
    }


    /** setVisible( Boolean:visibility )
        o Sets the visibility of the sprite 
    */
    public function setVisible( visibility:Boolean ):void {
        this.visible = visibility;
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
    public function getColorTransform ():Object {
        var ct:ColorTransform = this.transform.colorTransform;
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
    function setColorTransform ( o:* ) :void {
        this.transform.colorTransform = new ColorTransform(o.ra / 100.0,
                                                           o.ga / 100.0,
                                                           o.ba / 100.0,
                                                           o.aa ? o.aa / 100.0: 1.0,
                                                           o.rb,
                                                           o.gb,
                                                           o.bb,
                                                           o.ab ? o.ab : 0);
    }

    /** setBGColor( String/Number:color )
        o Sets the background color of the sprite
        o Can be a number (0xff00ff):void or a string ('#ff00ff'):void 
    */
    public function setBGColor( c:* ):void {
        if (this.bgcolor == c && ! this.__bgcolorhidden) return;
        if (! (c == null && this.isBkgndRequired)) {
            this.__bgcolorhidden = false;
            this.bgcolor = c;
        } else {
            // create an invisible background
            this.__bgcolorhidden = true;
            this.bgcolor = 0xffffff;
        }
        drawBackground();
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
            this.updateSoundPlay(true, framenumber, rel);

            this.owner.resourceevent('play', null, true);
        } else if (this.__isinternalresource) {
            // start playing at the specified frame
            if (framenumber != null) {
                this.__setFrame(framenumber);
            }
            if (this.playing == false && this.totalframes > 1) {
                this.playing = this.owner.playing = true;
                LzIdleKernel.addCallback(this, '__incrementFrame');
            }
            this.owner.resourceevent('play', null, true);
        } else if (this.loaderMC) {
            this.owner.resourceevent('play', null, true);
            this.updateResourcePlay(true, framenumber, rel);
        } else if (this.imgLoader) {
            if ($debug) {
                var info:LoaderInfo = this.imgLoader.contentLoaderInfo;
                if (info.contentType == LzSprite.MIME_SWF && info.swfVersion < SWFVersion.FLASH9) {    
                    Debug.warn("Playback control will not work for the resource %w because it is compiled for Flash %w. Please update or recompile the resource for Flash 9 or greater.", this.resource, info.swfVersion);
                }
            }
        } else {
            if ($debug) {
                Debug.write('unhandled play', framenumber, rel);
            }
        }
    }

    public function __incrementFrame (ignore = null) :void {
        // go to the next frame
        var frame = this.frame + 1;
        if (frame > this.totalframes) {
            // wrap around
            frame = 1;
        }
        this.__setFrame(frame);
    }

    /** stop( Number:framenumber )
        o Stops a multiframe resource at the specified framenumber
        o Stops at the current frame if framenumber is null 
    */
    public function stop (fn:* = null, rel:Boolean = false) :void {
        if (this.isaudio) {
            // audio-resource is attached
            var p:Boolean = this.playing;
            this.updateSoundPlay(false, fn, rel);

            if (p) this.owner.resourceevent('stop', null, true);
        } else if (this.__isinternalresource) {
            if (this.playing == true) {
                this.playing = this.owner.playing = false;
                this.owner.resourceevent('stop', null, true);
                LzIdleKernel.removeCallback(this, '__incrementFrame');
            }
            if (fn != null) {
                this.__setFrame(fn);
            }
        } else if (this.loaderMC) {
            if ( this.playing ) this.owner.resourceevent('stop', null, true);
            this.updateResourcePlay(false, fn, rel);
        } else if (this.imgLoader) {
            if ($debug) {
                var info:LoaderInfo = this.imgLoader.contentLoaderInfo;
                if (info.contentType == LzSprite.MIME_SWF && info.swfVersion < SWFVersion.FLASH9) {
                    Debug.warn("Playback control will not work for the resource. Please update or recompile the resource for Flash 9.", this.resource);
                }
            }
        } else {
            // This shouldn't happen - but it does, on roll over 
            //Debug.write('unhandled stop', fn, rel);
        }
        if (this.backgroundrepeat) this.drawBackground();
    }

    /** Used to update the frame number for internal resources.  Called by stop() and __incrementFrame() */
    private function __setFrame(fn:Number) :void {
        var resinfo:Object = LzResourceLibrary[this.resource];

        // Frames are one based not zero based
        var frames:Array = resinfo.frames;
        var origfn:* = fn;
        if (fn < 1) {
            origfn = fn = 1;
        } else if (fn > frames.length) {
            fn = frames.length;
        }
        var framenumber:int = fn - 1;

        var asset:DisplayObject = this.getAsset(this.resource, framenumber);

        if (asset) {
            var oRect:Rectangle = asset.getBounds( asset );
            if (oRect.width == 0 || oRect.height == 0) {
                // store the frame number passed in to prevent it from being reset
                this.frame = origfn;
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
            this.addChildAt(asset, IMGDEPTH);

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
                    this.loaderMC.gotoAndStop(origfn);
                }
            } else {
                // Set later, to prevent movieclip resources from being forced to frame 1 - see LPP-7534
                this.frame = fn;
            }
        } else {
            if ($debug) {
                Debug.write('Bad resource for %w', this.resource);
            }
        }

        if (this.frame == this.totalframes) {
            this.owner.resourceevent('lastframe', null, true);
        }
    }

    private function getAsset (resource:String, framenumber:Number = 0):DisplayObject {
        var resinfo:Object = LzResourceLibrary[resource];
        // Frames are one based not zero based
        var frames:Array = resinfo.frames;
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
                if (asset is Bitmap) {
                    (asset as Bitmap).smoothing = true;
                }
                asset.scaleX = 1.0;
                asset.scaleY = 1.0;
                this.resourceCache[framenumber] = asset;
            }
            if (asset is InteractiveObject) InteractiveObject(asset).mouseEnabled = false;
            if (asset is DisplayObjectContainer) DisplayObjectContainer(asset).mouseChildren = false;
        }
        return asset;
    }

    private function updateResourcePlay (play:Boolean, framenumber:*, rel:Boolean) :void {
        this.playing = this.owner.playing = play;

        if (framenumber == null) {
            if (play) {
                this.loaderMC.play();
            } else {
                this.loaderMC.stop();
            }
        } else {
            if (rel) framenumber += this.frame;
            if (framenumber > this.totalframes) {
                framenumber = this.totalframes;
            } else if (framenumber < 1) {
                framenumber = 1;
            }
            if (play) {
                this.loaderMC.gotoAndPlay(framenumber);
            } else {
                this.loaderMC.gotoAndStop(framenumber);
            }
        }
    }

    /** Callback resets resources after they have loaded and displayed */
    public function __resetframe(ignore:*=null):void {
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
            addChild(ms);
            this.mask = ms;
            this.masksprite = ms;
            //trace('applyMask [1] ', this.lzwidth, this.lzheight, owner);
        } else {
            if (this.mask == null) {
                addChild(ms);
                this.mask = ms;
            }
        }
        this.drawMask();
    }

    public function removeMask():void {
        if (this.mask != null) {
            this.removeChild(this.masksprite);
            this.mask = null;
            this.masksprite = null;
        }
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
        var res:DisplayObject = this.resourceContainer;

        // Don't try to do anything while an image is loading
        if (res == null) return;

        var scaleX:Number = 1.0;

        if (this.lzwidth != 0 && this._setrescwidth && this.resourcewidth) {
            scaleX = this.lzwidth / this.resourcewidth;
        }

        var scaleY:Number = 1.0;
        if (this.lzheight != 0 && this._setrescheight && this.resourceheight) {
            scaleY = this.lzheight / this.resourceheight;
        }

        res.scaleX = scaleX;
        res.scaleY = scaleY;
        //Debug.write(res, scaleX, scaleY, res.width, res.height);
    }


    /** destroy()
        o Causes the sprite to destroy itself
    */
    public function destroy( parentvalid = true ):void {
        this.unload();
        if (parentvalid && parent) {
            parent.removeChild(this);
        }
        if (this.__repeatbitmap) this.__repeatbitmap.dispose();
        if (this.mask != null) {
            this.removeMask();
        }
    }


    /** getMouse()
        o Returns the mouse position for this sprite as an object with 'x' and 'y' properties
    */
    public function getMouse():Object {
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
            var pos:int = 0;
            // skip all non-LzSprites (clickbutton, resourceContainer, etc.)
            for (; ! (parent.getChildAt(pos) is LzSprite); ++pos) {}
            parent.setChildIndex(this, pos);
        }
    }

    /**
      * Puts this sprite in front of one of its siblings.
      * @param LzSprite v: The sprite this sprite should go in front of.
      * If the passed sprite is null or not a sibling, the method has no effect.
      */
    public function sendInFrontOf (targetSprite:LzSprite) :void {
        if (!this.isroot) {
            try {
                // @devnote "http://help.adobe.com/en_US/AS3LCR/Flash_10.0/flash/display/DisplayObjectContainer.html#setChildIndex()"
                // > If a child is moved to an index LOWER than its current index,
                // > all children in between will INCREASE by 1 for their index reference.
                var myDepth:int = parent.getChildIndex(this);
                var targetDepth:int = parent.getChildIndex(targetSprite);
                parent.setChildIndex(this, myDepth < targetDepth ? targetDepth : targetDepth + 1);
            } catch (e:Error) {
                // if targetSprite isn't a child of the DisplayObjectContainer
            }
        }
    }

    /** sendBehind()
      * Puts this sprite behind one of its siblings.
      * @param LzSprite sprite: The sprite this sprite should go in front of.
      * If the sprite is null or not a sibling, the method has no effect.
    */
    public function sendBehind (targetSprite:LzSprite) :void {
        if (!this.isroot) {
            try {
                // @devnote "http://help.adobe.com/en_US/AS3LCR/Flash_10.0/flash/display/DisplayObjectContainer.html#setChildIndex()"
                // > If a child is moved to an index HIGHER than its current index,
                // > all children in between will DECREASE by 1 for their index reference.
                var myDepth:int = parent.getChildIndex(this);
                var targetDepth:int = parent.getChildIndex(targetSprite);
                parent.setChildIndex(this, myDepth > targetDepth ? targetDepth : targetDepth - 1);
            } catch (e:Error) {
                // if targetSprite isn't a child of the DisplayObjectContainer
            }
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

    public function unload() :void {
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
          if ($swf10) {
              this.imgLoader['unloadAndStop']();
          } else {
              this.imgLoader.unload();
          }
      }
      if (this.resourceContainer != null) {
          this.removeChild(this.resourceContainer);
          this.resourceContainer = null;
      }
      if (this.isaudio) this.unloadSound();
      // clear out cached values
      this.resourcewidth = this.resourceheight = 0;
      this.resource = null;
      this.__isinternalresource = null;
      if (this.loaderMC) {
          this.loaderMC.removeEventListener(Event.ENTER_FRAME, updateFrames);
          this.loaderMC = null;
      }
      this.imgLoader = null;
      this.resourceCache = null;
      this.drawBackground();
    }

    public function setAccessible(accessible:*) :void {
        trace('LzSprite.setAccessible not yet implemented');
    }

    /**
      * Get a reference to the display object
      */
    public function getDisplayObject():LzSprite {
        return this; 
    }

    /**
      * Get a reference to the graphics context
      */
    public function getContext():Graphics {
        return this.graphics; 
    }

    /**
      * Set callback for context update events
      * Unused in swf
      */
    public function setContextCallback(callbackscope, callbackname):void {
    }

    public function setBitmapCache(cache) :void {
        this.cacheAsBitmap = cache;
        this.updateBackground();
    }

    /**
      * Get the current z order of the sprite
      * @return Integer: A number representing z orderin
      */
    public function getZ():int {
         return parent.getChildIndex(this);
    }

    var __contextmenu:LzContextMenu;
    var __bgcolorhidden:Boolean = false;
    var __bgsprite:Sprite = null;

    function get isBkgndRequired () :Boolean {
        // background is required for:
        // - LPP-7842 (SWF9: context-menu not shown for view without bgcolor/content)
        // - LPP-7864 (SWF: cachebitmap interferes with mouse-events)
        // - LPP-7551 (several text-link issues)
        return this.__contextmenu != null || this.clickable;
    }

    function updateBackground () :void {
        if (this.__bgcolorhidden && ! this.isBkgndRequired) {
            // remove invisible background
            this.__bgcolorhidden = false;
            this.bgcolor = null;
            this.drawBackground();
        } else if (this.bgcolor == null && this.isBkgndRequired) {
            // create an invisible background
            this.__bgcolorhidden = true;
            this.bgcolor = 0xffffff;
            this.drawBackground();
        }
    }

    /* LzSprite.setContextMenu
     * Install menu items for the right-mouse-button 
     * @param LzContextMenu lzmenu: LzContextMenu to install on this view
     */
    function setContextMenu (lzmenu:LzContextMenu) :void {
        this.__contextmenu = lzmenu;
        this.updateBackground();
        // FIXME [anba 20090305] LPP-7847 (no context-menu for bitmap resource)
        // "contextMenu" is a swf9 property on flash.display.Sprite
        this.contextMenu = (lzmenu != null ? lzmenu.kernel.__LZcontextMenu() : null);
    }

    function setDefaultContextMenu (lzmenu:LzContextMenu) :void {
        // TODO [hqm 2008-11] In SWF8, we can set the contextMenu
        // property of MovieClip.prototype, which puts the menu on
        // every MovieClip by default. Not sure if there's any way
        // to do that in swf9.
        var cmenu:ContextMenu = (lzmenu != null ? lzmenu.kernel.__LZcontextMenu() : null);
        LzSprite.prototype.contextMenu = cmenu;
        // also show the default menu for the main sprite
        LFCApplication._sprite.contextMenu = cmenu;
    }

    /**
     * LzView.getContextMenu
     * Return the current context menu
     */
    function getContextMenu() :LzContextMenu {
        return this.__contextmenu;
    }


    function sendResourceLoad(skiponload:Boolean = false) :void {
        // skiponload is true for resources/setResource() calls
        if (this.owner != null) {
            this.owner.resourceload({width: this.resourcewidth, height: this.resourceheight, resource: this.resource, skiponload: skiponload});
        }
    }

    var cursorResource:String = null;

    /**
     * CURSOR is a string naming the resource to be used as the mouse pointer
     */
    function setCursor ( cursor:String=null ) :void {
        if (cursor == null) return;
        if (cursor != '') {
            this.cursorResource = cursor;
            // Disable mouseout handler until it's safe from spurious events due
            // to addChild of a swf resource
            addEventListener(MouseEvent.MOUSE_OUT, cursorGotMouseout, true);
            addEventListener(MouseEvent.MOUSE_OVER, cursorGotMouseover, true);
            if (!this.clickable) {
                this.setClickable(true);
            }
        } else {
            LzMouseKernel.restoreCursorLocal();
            removeEventListener(MouseEvent.MOUSE_OVER, cursorGotMouseover, true);
            removeEventListener(MouseEvent.MOUSE_OUT, cursorGotMouseout, true);
            this.cursorResource = null;
        }
    }

    /** @access private */
    function cursorGotMouseover (event:MouseEvent) :void {
        LzMouseKernel.setCursorLocal(this.cursorResource);
    }


    /** @access private */
    function cursorGotMouseout (event:MouseEvent) :void {
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
                this.stopSoundPlay();
            }
            if (doplay) {
                this.startSoundPlay(pos, false);
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
    function setShowHandCursor ( s:* ) :void {
        this.showhandcursor = s;
    }

    function setAAActive(s:*) :void {
        trace('LzSprite.setAAActive not yet implemented');
    }

    function setAAName(s:*) :void {
        trace('LzSprite.setAAName not yet implemented');
    }

    function setAADescription(s:*) :void {
        trace('LzSprite.setAADescription not yet implemented');
    }

    function setAATabIndex(s:*) :void {
        trace('LzSprite.setAATabIndex not yet implemented');
    }

    function setAASilent(s:*) :void {
        trace('LzSprite.setAASilent not yet implemented');
    }

    function updateResourceSize(skipsend:* = null) :void {
      this.setWidth(this._setrescwidth?this.width:this.resourcewidth);
      this.setHeight(this._setrescheight?this.height:this.resourceheight);

      if (! skipsend) this.owner.resourceload({width: this.resourcewidth, height: this.resourceheight, resource: this.resource, skiponload: true});
    }

    private var clickresource;

    // Must be called after setClickable()
    function setClickRegion (resource) :void {
        if (this.clickresource === resource) return;
        clickresource = resource;
        if (resource == null) {
            // draw a clickregion procedurally
            clickregion = new Sprite();
            // draw a 1px by 1px white rectangle
            clickregion.graphics.beginFill(0xffffff);
            clickregion.graphics.drawRect(0, 0, 1, 1);
            clickregion.graphics.endFill();
            // then scale it to fit...
            clickregion.scaleX = this.lzwidth;
            clickregion.scaleY = this.lzheight;
            clickregionwidth = 1;
            clickregionheight = 1;

            this.hitArea = null;
        } else {
            var resinfo:Object = LzResourceLibrary[resource];
            if (! resinfo) {
                if ($debug) {
                    Debug.warn('Could not find clickregion resource', resource);
                }
                return;
            }
            var clicksprite = this.getAsset(resource);
            clickregion = clicksprite;
            clickregionwidth = resinfo.width;
            clickregionheight = resinfo.height;
            clickregion.scaleX = this.lzwidth / clickregionwidth;
            clickregion.scaleY = this.lzheight / clickregionheight;

            this.hitArea = clickregion;
        }
        //Debug.warn('setClickRegion', resource, clickregionwidth, clickregionheight, this.lzwidth, this.lzheight);

        clickbutton.hitTestState = clickregion;    }

    function sendAAEvent(childID:Number, eventType:Number, nonHTML:Boolean = false) {
        trace('LzSprite.sendAAEvent not yet implemented');
    }
    
    function aafocus() {
        trace('LzSprite.aafocus not yet implemented');
    }
    
    function setID(id) {
        trace('LzSprite.setID not yet implemented');
    }

    var shadowfilter = new DropShadowFilter(0, 0, 0, 1, 4, 4, 1, 2, false, false, false);

    function updateShadow(shadowcolor, shadowdistance, shadowangle, shadowblurradius) {
        /* DropShadowFilter attributes
         *  [distance:Number]
         *  [angle:Number]
         *  [color:Number]
         *  [alpha:Number]
         *  [blurX:Number]
         *  [blurY:Number]
         *  [strength:Number]
         *  [quality:Number]
         *  [inner:Boolean]
         *  [knockout:Boolean]
         *  [hideObject:Boolean]) 
         */
  
        var filters = [];
        if (shadowcolor != null) {
            this.shadowfilter.angle = shadowangle;
            this.shadowfilter.distance = shadowdistance;
            var colorobj = LzColorUtils.inttocolorobj(shadowcolor);
            this.shadowfilter.color = colorobj.color;
            this.shadowfilter.alpha = colorobj.alpha != null ? colorobj.alpha : 1;
            this.shadowfilter.blurX = shadowblurradius;
            this.shadowfilter.blurY = shadowblurradius;
            filters = [this.shadowfilter];
        }
        var mc = this.getDisplayObject();
        mc.filters = filters;
    }

    var cornerradius = 0;
    function setCornerRadius(radius) {
        this.cornerradius = radius;
        this.drawBackground();
    }

    var margin = 0;
    var borderWidth = 0;
    var padding = 0;
    var borderColor = null;

    var __csscache = null;
    function setCSS(name, value, isdimension) {
        if (this.__csscache == null) {
            this.__csscache = {};
        } else {
            if (this.__csscache[name] === value) return;
        }
        this.__csscache[name] = value;

        this[name] = value;
        var offset = this.margin + this.borderWidth + this.padding;
        this.x = this._x + offset;
        this.y = this._y + offset;
        //Debug.warn('setCSS', name, value, this._x, this._y, this.margin, this.borderWidth, this.padding, this.x, this.y);
        this.drawBackground();
    }

    static function setMediaLoadTimeout(ms){
        LzSprite.medialoadtimeout = ms;
    }

    static function setMediaErrorTimeout(ms){
        LzSprite.mediaerrortimeout = ms;
    }

    var backgroundrepeat:String = null;
    var repeatx:Boolean = false;
    var repeaty:Boolean = false;
    function setBackgroundRepeat(backgroundrepeat:String) {
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
        this.repeatx = x;
        this.repeaty = y;
        this.backgroundrepeat = backgroundrepeat;
        this.drawBackground();
    }

    private function copyBitmap(from:*, w:Number, h:Number, to:BitmapData = null, m:Matrix = null) {
        var tmp:BitmapData = new flash.display.BitmapData(w, h, true, 0x000000ff);
        tmp.draw(from);

        // If to wasn't supplied, return the bitmap as-is.
        if (! to) {
            return tmp;
        }
        to.draw(tmp, m, null, null, null, true);
        tmp.dispose();
    }

    
    static var quirks = {
        // workaround FF3.6 Mac bug - see LPP-8831
        ignorespuriousmouseevents: false
        ,fixtextselection:false
        // See http://www.actionscript.org/forums/showthread.php3?t=137599
        ,loaderinfoavailable:false
    };

    /** Update browser quirks
    * @access private
    */
    static function __updateQuirks(browser){
        if (browser.isFirefox && browser.OS == 'Mac') {
            LzSprite.quirks.ignorespuriousff36events = browser.version == 3.6 && browser.subversion < 2;
            LzSprite.quirks.fixtextselection = browser.version < 3.5;
        }
        if ($swf10) {
            LzSprite.quirks.loaderinfoavailable = true;
        }
    }

  }#
  
}
