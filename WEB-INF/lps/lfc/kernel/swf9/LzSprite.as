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

public class LzSprite extends Sprite {

      #passthrough (toplevel:true) {  

  import flash.display.*;
  import flash.events.*;
  import mx.controls.Button;
  import flash.net.URLRequest;  
}#

#passthrough  {  

      public var owner:* = null;

      public var bgColor:* = null;

      public var lzwidth:* = 0;
      public var lzheight:* = 0;

      public var opacity:Number = 1;
      public var playing:Boolean = false;
      public var clickable:Boolean = false;
      public var clickbutton:SimpleButton = null;
      public var clickregion:Shape = null;
      public var masksprite:Sprite = null;
      public var frame:int = 1;
      public var frames:int = 1;
      public var resource:String = null;
      public var source:String = null;
      public var clip:Boolean = false;
      public var stretches:String = null;
      public var resourcewidth:Number = 0;
      public var resourceheight:Number = 0;
      public var isroot:Boolean = false;

      public var resourceLoaded:Boolean = false;
      public var resourceURL:String = null;

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


      public static var capabilities:* = {
      rotation: true
      // Avoid scaling canvas to percentage values - SWF already scales the viewport size, so take window size literally to avoid scaling twice
      ,scalecanvastopercentage: false
      // the canvas already knows its size
      ,readcanvassizefromsprite: false
      ,opacity: true
      ,colortransform: true
      ,audio: true
      ,accessibility: true
      ,htmlinputtext: true
      ,advancedfonts: true
      }

      public function LzSprite (newowner = null, isroot = null, args = null) {
          // owner:*, isroot:Boolean
          this.owner = newowner;
          if (owner == null) return;
          if (isroot) {
              this.isroot = true;
          }
      }

      public function init (v:Boolean = true):void {
          this.setVisible(v);
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
          if (this.bgColor != null){
              this.graphics.clear();
              this.graphics.beginFill(this.bgColor);
              this.graphics.drawRect(0, 0, this.lzwidth, this.lzheight);
              this.graphics.endFill();
          }
      }


      var skiponload = false;
      var resourceWidth;
      var resourceHeight;
      var baseurl;
      function  __preloadFrames () { }

      /** setResource( String:resource )
          o Displays a compiled-in resource (by name)
          o Calls setSource to load media if resource is an URL
          o Uses the resourceload callback method when the resource finishes loading 
      */
public function setResource (r:String):void {
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

    // TODO [hqm 2008-01] How do we deal with multiframe embedded resources??
    if ('assetclass' in res) {
        var assetclass = res['assetclass'];
        var asset:DisplayObject = new assetclass();
        addChild(asset);
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


      public var imgLoader:Loader;
      private var IMGDEPTH:int = 0;

      /** setSource( String:url )
          o Loads and displays media from the specified url
          o Uses the resourceload callback method when the resource finishes loading 
      */
      public function setSource (url:String, cache = null, headers = null):void {
          this.resourceURL = url;
          imgLoader = new Loader();
          this.addChildAt(imgLoader, IMGDEPTH);
          var info:LoaderInfo = imgLoader.contentLoaderInfo;
          info.addEventListener(Event.INIT,       loaderInitHandler);
          info.addEventListener(IOErrorEvent.IO_ERROR,       loaderEventHandler);
          imgLoader.load(new URLRequest(url));
      }


      public function loaderInitHandler(event:Event):void {
          // These progress event listeners can only be installed after the init event
          // has been received. You get an error if you try to add them before this.
          var loader:Loader = Loader(event.target.loader);
          var info:LoaderInfo = LoaderInfo(loader.contentLoaderInfo);
          info.addEventListener(ProgressEvent.PROGRESS,      loaderEventHandler);
          info.addEventListener(Event.OPEN,                  loaderEventHandler);
          info.addEventListener(Event.UNLOAD,                loaderEventHandler); 
          info.addEventListener(Event.COMPLETE,              loaderEventHandler);
          info.addEventListener(HTTPStatusEvent.HTTP_STATUS, loaderEventHandler);


          // trace(event);
      }



      public function loaderEventHandler(event:Event):void {
      var loader:Loader = Loader(event.target.loader);
      var info:LoaderInfo = LoaderInfo(loader.contentLoaderInfo);
          if (event.type == Event.COMPLETE) {
              this.resourceLoaded = true;
              // Apply stretch if needed, now that we know the asset dimensions.
              this.applyStretchResource();
              if (this.owner != null) {
                  this.owner.resourceload({
                      width:  loader.width,
                              height: loader.height,
                              sprite: this,
                              resource: this.resourceURL,
                              // When would we want skiponload to be true??
                              skiponload: false});
              }
          } else if (event.type == IOErrorEvent.IO_ERROR) {
              // TODO [hqm 2007-12] is this the right event type? Should we be looking
              // at HTTP_STATUS event error codes also?
                  this.resourcewidth = 0;
                  this.resourceheight = 0;
                  if (this.owner != null) {
                      this.owner.resourceloaderror( event );
                  }
          }
      }
      
      //// Mouse event trampoline
      public function attachMouseEvents(dobj:DisplayObject) {
          dobj.addEventListener(MouseEvent.CLICK, handleMouse_CLICK, false);
          dobj.addEventListener(MouseEvent.DOUBLE_CLICK, handleMouse_DOUBLE_CLICK, false);
          dobj.addEventListener(MouseEvent.MOUSE_DOWN, handleMouse_MOUSE_DOWN, false);
          dobj.addEventListener(MouseEvent.MOUSE_UP, handleMouse_MOUSE_UP, false);
          dobj.addEventListener(MouseEvent.MOUSE_OVER, handleMouse_MOUSE_OVER, false);
          dobj.addEventListener(MouseEvent.MOUSE_OUT, handleMouse_MOUSE_OUT, false);
      }

      public function removeMouseEvents(dobj:DisplayObject) {
          dobj.removeEventListener(MouseEvent.CLICK, handleMouse_CLICK, false);
          dobj.removeEventListener(MouseEvent.DOUBLE_CLICK, handleMouse_DOUBLE_CLICK, false);
          dobj.removeEventListener(MouseEvent.MOUSE_DOWN, handleMouse_MOUSE_DOWN, false);
          dobj.removeEventListener(MouseEvent.MOUSE_UP, handleMouse_MOUSE_UP, false);
          dobj.removeEventListener(MouseEvent.MOUSE_OVER, handleMouse_MOUSE_OVER, false);
          dobj.removeEventListener(MouseEvent.MOUSE_OUT, handleMouse_MOUSE_OUT, false);
      }


      public function handleMouse_CLICK (event:MouseEvent) {
          LzModeManager.handleMouseEvent( owner, 'onclick');
          event.stopPropagation();
      }

      public function handleMouse_DOUBLE_CLICK (event:MouseEvent) {
          LzModeManager.handleMouseEvent( owner, 'ondblclick');
          event.stopPropagation();
      }

      public function handleMouse_MOUSE_DOWN (event:MouseEvent) {
          LzModeManager.handleMouseEvent( owner, 'onmousedown');
          event.stopPropagation();
      }

      public function handleMouse_MOUSE_UP (event:MouseEvent) {
          LzModeManager.handleMouseEvent( owner, 'onmouseup');
          event.stopPropagation();
      }

      public function handleMouse_MOUSE_OVER (event:MouseEvent) {
          LzModeManager.handleMouseEvent( owner, 'onmouseover');
          event.stopPropagation();
      }

      public function handleMouse_MOUSE_OUT (event:MouseEvent) {
          LzModeManager.handleMouseEvent( owner, 'onmouseout');
          event.stopPropagation();
      }



      /** setClickable( Boolean:clickable )
          o If true, sets the sprite to be clickable and receive mouse events
            through the mouseevent callback method
          o If false, sets the sprite to be unclickable and not receive mouse events 
      */
      public function setClickable( c:Boolean ):void {
          if (this.clickable == c) return;
          this.clickable = c;
          attachMouseEvents(this);
          var cb:SimpleButton = this.clickbutton;
          //trace('sprite setClickable' , c, 'cb',cb);
          if (this.clickable) {
              // TODO [hqm 2008-01] The Flash Sprite docs 
              // explain how to add a sprite to the tab order using tabEnabled property. 
              this.buttonMode = true;
              if (cb == null) {
                  this.clickbutton = cb = new SimpleButton();
                  addChild(cb);
              }
              cb.useHandCursor = true;
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
              this.buttonMode = false;
              removeMouseEvents(this);
              if (cb) {
                  removeMouseEvents(cb);
                  removeChild(cb);
              }

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
          //trace('..sprite setWidth', v);
          this.lzwidth = v;
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
          //trace('..sprite setHeight', v);
          this.lzheight = v;
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
          trace('LzSprite.setColor not yet implemented');
      }

      public function getColor  (){
          trace('LzSprite.getColor not yet implemented');
      }



      /** setBGColor( String/Number:color )
          o Sets the background color of the sprite
          o Can be a number (0xff00ff):void or a string ('#ff00ff'):void 
      */
      public function setBGColor( c:* ):void {
          if (this.bgColor == c) return;
          this.bgColor = c;
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
      public function play( framenumber:int ):void {
      }


      /** stop( Number:framenumber )
          o Stops a multiframe resource at the specified framenumber
          o Stops at the current frame if framenumber is null 
      */
      public function stop( framenumber:int ):void {
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
          o Causes the sprite to stretch its resource along axes, either 'width' 'height' or 'both' so the resource is the same size as the sprite along those axes.
          o If axes is not 'width', 'height' or 'both', the resource is sized to its natural/default size, rather than the sprite's size 
      */
      public function stretchResource( xory:String ):void {
          //trace("stretchResource imgLoader="+imgLoader);
          if ( xory == null || xory == "x" || xory=="width" || xory=="both" ){
              this._setrescwidth = true;
          }

          if ( xory == null || xory == "y"|| xory=="height" || xory=="both" ){
              this._setrescheight = true;
                    }          
          this.applyStretchResource();
      }

      public function applyStretchResource():void {
          if (this.resourceLoaded) {
              if (this._setrescwidth) {
                  this.resourcewidth = imgLoader.width;
                  this.scaleX =  this.lzwidth / this.resourcewidth;
              } else {
                  this.scaleX = 1.0;
              }
              if (this._setrescheight) {
                  this.resourceheight = imgLoader.height;
                  this.scaleY =  this.lzheight / this.resourceheight;
              } else {
                  this.scaleY = 1.0;
              }
          }
      }


      /** destroy( Boolean:recursive )
          o Causes the sprite to destroy itself
          o if recursive is true, the sprite destroys all its children as well 
      */
      public function destroy( ):void {
	//PBR
	if (parent)
          parent.removeChild(this);
      }


      /** getMouse( String:xory )
          o Returns the mouse position for this sprite, for either 'x' or 'y' 
      */
      public function getMouse( xory:String ):Number {
          return (xory == "x" ) ? this.mouseX : this.mouseY;
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
          o Sends this sprite to the back of its siblings 
      */
      public function sendToBack():void {
          if (!this.isroot) {
              parent.setChildIndex(this, 0);
          }
      }

      /** setStyleObject( Object:style )
          o Sets the style object of the sprite 
      */
      public function setStyleObject( style:Object ):void {
          // NYI
      }


      /** getStyleObject()
          o Gets the style object of the sprite 
      */
      public function getStyleObject():Object {
          // NYI
          return null;
      }

      public function unload() {
          trace('LzSprite.unload not yet implemented');
      }

      public function setAccessible(accessible:*) {
          trace('LzSprite.setAccessible not yet implemented');
      }


      public function mouseDown(event:MouseEvent):void {
          trace("mouse down on "+event.target);
          event.target.startDrag();
      }

      public function getMCRef () {
          trace("LzSprite.getMCRef not implemented in this runtime");
      }


  }#
  }



