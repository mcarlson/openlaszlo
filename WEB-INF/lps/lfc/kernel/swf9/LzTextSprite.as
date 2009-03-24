/**
  * LzTextSprite.as
  *
  * @copyright Copyright 2007-2009 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic swf9
  * @author Henry Minsky &lt;hminsky@laszlosystems.com&gt;
  */
public class LzTextSprite extends LzSprite {
    #passthrough (toplevel:true) {
        import flash.display.Bitmap;
        import flash.display.DisplayObject;
        import flash.display.DisplayObjectContainer;
        import flash.display.InteractiveObject;
        import flash.display.SimpleButton;
        import flash.display.Sprite;
        import flash.display.Stage;
        import flash.events.Event;
        import flash.events.MouseEvent;
        import flash.events.TextEvent;
        import flash.geom.Point;
        import flash.net.URLRequest;
        import flash.text.AntiAliasType;
        import flash.text.TextField;
        import flash.text.TextFieldAutoSize;
        import flash.text.TextFormat;
        import flash.text.TextLineMetrics;
        import flash.ui.*;
        import flash.utils.getDefinitionByName;
    }#

        #passthrough  {

        public var textfield:TextField = null;

        public static const PAD_TEXTWIDTH:Number = 4;
        public static const PAD_TEXTHEIGHT:Number = 4;
        public static const DEFAULT_SIZE:Number = 11;

        var font:LzFont = null;

        /**
        * @access private
        */
        public var scroll:Number = 0;
        /**
        * @access private
        */
        public var maxscroll:Number = 0;
        /**
        * @access private
        */
        public var hscroll:Number = 0;
        /**
        * @access private
        */
        public var maxhscroll:Number = 0;
        /**
        * @access private
        */
        public var lineheight:Number = 1;

        public var textcolor:Number = 0;
        public var text:String = "";

        public var resize:Boolean = true;
        public var multiline:Boolean = false;
        public var underline:Boolean = false;

        public var textalign:String = "left";
        public var textindent:Number = 0;
        public var letterspacing:Number = 0;
        public var textdecoration:String = "none";

        public var sizeToHeight:Boolean = false;
        public var password:Boolean = false;
        public var scrollheight:Number = 0;
        public var html:Boolean = true;

        public function LzTextSprite (newowner:LzView = null, args:Object = null) {
            super(newowner,false);
            // owner:*, isroot:Boolean
            var tfield:TextField = this.textfield = createTextField(0,0,400,20);
            tfield.addEventListener(TextEvent.LINK, textLinkHandler);
            tfield.addEventListener(MouseEvent.CLICK, handleTextfieldMouse);
            tfield.addEventListener(MouseEvent.DOUBLE_CLICK, handleTextfieldMouse);
            tfield.addEventListener(MouseEvent.MOUSE_DOWN, handleTextfieldMouse);
            tfield.addEventListener(MouseEvent.MOUSE_UP, handleTextfieldMouse);
            tfield.addEventListener(MouseEvent.MOUSE_OVER, handleTextfieldMouse);
            tfield.addEventListener(MouseEvent.MOUSE_OUT, handleTextfieldMouse);
        }

        private var _ignoreclick:Boolean = false;
        private var _usecursor:Boolean = true;
        private var _lastobject:DisplayObject = null;

        private function handleTextfieldMouse (e:MouseEvent) :void {
            // FIXME: changes to clickable or selectable while cursor
            // is over text may break mouse-events
            var type:String = e.type;
            if (type == MouseEvent.MOUSE_UP && this._ignoreclick) {
                // first MOUSE_UP ...
                e.stopPropagation();
            } else if (type == MouseEvent.CLICK && this._ignoreclick) {
                // ... then CLICK, now clear flag
                // FIXME: click-event may not be dispatched
                // (e.g. if textfield is made invisible after onmousedown)
                this._ignoreclick = false;
                e.stopPropagation();
            } else if (this.clickable) {
                // clickable -> handle mouse-event
                if (type == MouseEvent.DOUBLE_CLICK) {
                    this.handleMouse_DOUBLE_CLICK(e);
                } else {
                    this.__mouseEvent(e);
                }
            } else if (this.textfield.selectable) {
                // ignore mouse-event for swf8 compatibility
                this.__ignoreMouseEvent(e);
            } else {
                // forward mouse-event to next sprite
                this.__forwardMouseEventToSprite(e);
            }

            if (type == MouseEvent.MOUSE_OUT) {
                if (this._usecursor) {
                    // TODO: restore also necessary for other events?
                    LzMouseKernel.restoreCursorLocal();
                    this._usecursor = false;
                }
                // clear _lastobject
                this._lastobject = null;
            }
        }

        private function __ignoreMouseEvent (e:MouseEvent) :void {
            if (e.type != MouseEvent.MOUSE_UP || LzMouseKernel.__lastMouseDown === this) {
                // don't cancel "onmouseup" if another sprite was selected
                e.stopPropagation();
            }
        }

        private function __forwardMouseEventToSprite (e:MouseEvent) :void {
            // find next object, default to last one
            var obj:DisplayObject = this.getNextMouseObject(e) || this._lastobject;
            if (obj != null) {
                this._lastobject = obj;
                if (obj is InteractiveObject) {
                    var type:String = e.type;
                    var forward:Boolean = true;
                    if (type == MouseEvent.MOUSE_OVER || type == MouseEvent.MOUSE_OUT) {
                        // don't report onmouseover/out events if object didn't change
                        var relObj:InteractiveObject = e.relatedObject;
                        if (relObj is TextField && relObj.parent is LzTextSprite) {
                            // not again a textfield!
                            var lztext:LzTextSprite = LzTextSprite(relObj.parent);
                            if (lztext.forwardsMouse) {
                                relObj = lztext.getNextMouseObject(e) as InteractiveObject;
                            }
                        }
                        if (relObj === obj) {
                            forward = false;
                        } else if (relObj is SimpleButton) {
                            var p:DisplayObjectContainer = relObj.parent;
                            if (p is LzSprite && p === obj) {
                                forward = false;
                            }
                        }
                    }

                    // display hand-cursor or custom cursor
                    if (type == MouseEvent.MOUSE_OVER) {
                        var cursor:String = null;
                        if (obj is Sprite) {
                            var sprite:Sprite = Sprite(obj);
                            if (sprite.buttonMode && sprite.useHandCursor) {
                                // need to respect global cursor setting
                                if (! LzMouseKernel.hasGlobalCursor) {
                                    if ($swf10) { cursor = MouseCursor.BUTTON; }
                                }
                            }
                            if (sprite is LzSprite) {
                                var lzsprite:LzSprite = LzSprite(sprite);
                                if (lzsprite.cursorResource != null) {
                                    cursor = lzsprite.cursorResource;
                                }
                            }
                        }
                        if (cursor != null) {
                            this._usecursor = true;
                            LzMouseKernel.setCursorLocal(cursor);
                        }
                    }

                    e.stopPropagation();
                    if (forward) {
                        obj.dispatchEvent(e);
                    }
                } else {
                    // TODO: what else can this be? needs more testing!
                    // Debug.debug("%s: not InteractiveObject = %w (%w)", e.type, obj, this.owner);
                    e.stopPropagation();
                    obj.dispatchEvent(e);
                }
            } else {
                // TODO: when is this possible?
                // Debug.warn("%s: no forwarding possible (%w)", e.type, this.owner);
            }
        }

        private static var __MouseCursor:Object = null;
        private static function get MouseCursor () :Object {
            if (__MouseCursor == null) {
                __MouseCursor = getDefinitionByName('flash.ui.MouseCursor');
            }
            return __MouseCursor;
        }

        function get forwardsMouse () :Boolean {
            return ! (this.clickable || this.textfield.selectable);
        }

        private static const ZERO_POINT:Point = new Point(0, 0);

        function getNextMouseObject (e:MouseEvent) :DisplayObject {
            const FUDGE:int = 1;
            const FUDGE_WIDTH:int = 4; // needs to be 4, flash bug?
            var tfield:TextField = this.textfield;
            var stage:Stage = LFCApplication.stage;
            var x:Number = e.stageX, y:Number = e.stageY;
            if (e.type == MouseEvent.MOUSE_OUT) {
                if (x == -1 && y == -1) {
                    // mouse left the screen, mouse-event values are invalid (-1, -1),
                    // need to use values from stage instead
                    x = stage.mouseX, y = stage.mouseY;
                } else {
                    // we need to determine/approximate the point the cursor
                    // was before it left the textfield
                    var zero:Point = tfield.localToGlobal(ZERO_POINT);
                    x = Math.max(zero.x + FUDGE, Math.min(x, zero.x + tfield.width - FUDGE_WIDTH));
                    y = Math.max(zero.y + FUDGE, Math.min(y, zero.y + tfield.height - FUDGE));
                }
            } else if (e.type == MouseEvent.MOUSE_OVER) {
                // some mouse-over events are sent too early, in which case the mouse-cursor
                // isn't yet over the textfield, therefore need to adjust values
                var zero:Point = tfield.localToGlobal(ZERO_POINT);
                x = Math.max(zero.x + FUDGE, Math.min(x, zero.x + tfield.width - FUDGE_WIDTH));
                y = Math.max(zero.y + FUDGE, Math.min(y, zero.y + tfield.height - FUDGE));
            }

            var tindex:int = -1;
            var objs:Array = stage.getObjectsUnderPoint(new Point(x, y));
            for (var i:int = objs.length - 1; i >= 0; --i) {
                var obj:DisplayObject = objs[i];
                if (obj === tfield) {
                    tindex = i;
                    break;
                }
            }

            if (tindex == -1) {
                // can happen if invisible...
                return null;
            }

            for (var i:int = tindex - 1; i >= 0; --i) {
                var obj:DisplayObject = objs[i];
                if (obj is Bitmap) {
                    // need to use parent for Bitmap
                    obj = obj.parent;
                } else if (obj is TextField && obj.parent is LzTextSprite) {
                    // skip all mouse-forwarding LzTextSprites
                    if (LzTextSprite(obj.parent).forwardsMouse) {
                        continue;
                    }
                }
                if (obj is InteractiveObject) {
                    var iobj:InteractiveObject = InteractiveObject(obj);
                    if (iobj.mouseEnabled) {
                        if (iobj is Sprite) {
                            // need to test hitArea for Sprite
                            var hitarea:Sprite = Sprite(iobj).hitArea;
                            if (hitarea != null) {
                                if (! hitarea.hitTestPoint(x, y)) {
                                    continue;
                                }
                            }
                        }
                        return iobj;
                    }
                } else {
                    // TODO: what else can this be? needs more testing!
                    return obj;
                }
            }

            return null;
        }

        override public function setClickable( c:Boolean ):void {
            if (this.clickable == c) return;
            this.clickable = c;
        }

        public function addScrollEventListener():void {
            this.textfield.addEventListener(Event.SCROLL, __handleScrollEvent);
        }

        var scrollevents = false;
        function setScrollEvents(on) {
            this.scrollevents = on;
        }

        function __handleScrollEvent(e:Event = null) :void {
            if (! this.scrollevents) return;
            if (scroll !== textfield.scrollV) {
                scroll = textfield.scrollV;
                //Debug.info('__handleScrollEvent', 'scrollTop', lineNoToPixel(textfield.scrollV));
                owner.scrollevent('scrollTop', lineNoToPixel(textfield.scrollV));
            }
            if (maxscroll !== textfield.maxScrollV) {
                maxscroll = textfield.maxScrollV;
                //Debug.info('__handleScrollEvent', 'scrollHeight', lineNoToPixel(textfield.maxScrollV));
                owner.scrollevent('scrollHeight', lineNoToPixel(textfield.maxScrollV) + height);
            }
            if (hscroll !== textfield.scrollH) {
                hscroll = textfield.scrollH;
                //Debug.info('__handleScrollEvent', 'scrollLeft', textfield.scrollH);
                owner.scrollevent('scrollLeft', textfield.scrollH);
            }
            if (maxhscroll !== textfield.maxScrollH) {
                maxhscroll = textfield.maxScrollH;
                //Debug.info('__handleScrollEvent', 'scrollWidth', textfield.maxScrollH);
                owner.scrollevent('scrollWidth', textfield.maxScrollH + width);
            }
        }

        public function textLinkHandler(e:TextEvent) :void {
            // ignore the next onclick-event for swf8-compatibility
            // Debug.write("textLinkHandler on %w", this);
            this._ignoreclick = true;
            this.owner.ontextlink.sendEvent(e.text);
        }

        public function makeTextLink(str:String, value:String) :String {
            return '<a href="event:'+value+'">'+str+'</a>';
        }

        override public function setWidth( w:* ):void {
            super.setWidth(w);
            if (w) {
                this.textfield.width = w;
                this.__handleScrollEvent();
            }
        }

        override public function setHeight( h:* ):void {
            super.setHeight(h);
            if (h) {
                this.textfield.height = h;
                this.__handleScrollEvent();
            }
        }

        private function createTextField(nx:Number, ny:Number, w:Number, h:Number):TextField {
            var tfield:TextField = new TextField();
            tfield.antiAliasType = AntiAliasType.ADVANCED;
            tfield.x = nx;
            tfield.y = ny;
            tfield.width = w;
            tfield.height = h;
            tfield.border = false;
            tfield.mouseEnabled = true;
            tfield.tabEnabled = LFCApplication.textfieldTabEnabled;
            //tfield.cacheAsBitmap = true;
            addChild(tfield);
            return tfield;
        }

        public function __initTextProperties (args:Object) :void {
            this.password = args.password  ? true : false;
            var textclip:TextField = this.textfield;
            textclip.displayAsPassword = this.password;

            textclip.selectable = args.selectable;
            textclip.autoSize = TextFieldAutoSize.NONE;

            // TODO [hqm 2008-01] have to figure out how the Flex textfield multiline
            // maps to Laszlo model.
            this.setMultiline( args.multiline );

            //inherited attributes, documented in view
            this.fontname = args.font;
            this.fontsize = args.fontsize;
            this.fontstyle = args.fontstyle;
            textclip.background = false;

            // To compute our width:
            // + if text is multiline:
            //    if no width is supplied, use parent width
            // + if text is single line:
            //    if no width was supplied and there's no constraint, measure the text width:
            //        if empty text content was supplied, use DEFAULT_WIDTH


            //(args.width == null && typeof(args.$refs.width) != "function")

            // To compute our height:
            // + If height is supplied, use it.
            // + if no height supplied:
            //    if  single line, use font line height
            //    else get height from flash textobject.textHeight 
            // 
            // FIXME [2008-11-24 ptw] (LPP-7391) kernel sprites should not be
            // using LzNode args directly
            if (! this.owner.hassetheight) {
                this.sizeToHeight = true;
                if (args.multiline) {
                    textclip.autoSize = TextFieldAutoSize.LEFT;
                }
            } else if (args['height'] != null) {
                // Does setting height of the text object do the right thing in swf9?
                textclip.height = args.height;
            }
            // Default the scrollheight to the visible height.
            this.scrollheight = this.height;

            // TODO [hqm 2008-01] There ought to be only call to
            // __setFormat during instantiation of an lzText. Figure
            // out how to suppress the other calls from setters.
            this.__setFormat();
            this.setText((args['text'] != null) ? String(args.text) : '');

            if (this.sizeToHeight) {
                var h = this.lineheight;
                //TODO [anba 20080602] is this ok for multiline? 
                if (this.multiline) h *= textclip.numLines;
                h += 4;//2*2px gutter, see flash docs for flash.text.TextLineMetrics 
                this.setHeight(h);
            }

            addScrollEventListener();
            __handleScrollEvent();
        }



        public function setBorder ( onroff:Boolean):void {
            this.textfield.border = (onroff == true);
        }

        public function setEmbedFonts ( onroff:Boolean ):void {
            this.textfield.embedFonts = (onroff == true);
        }

        /*
         *  setFontSize( Number:size )
         o Sets the size of the font in pixels 
        */
        public function setFontSize ( fsize:String ):void {
            this.fontsize = fsize;
            this.__setFormat();
            // force recompute of height if needed
            this.setText( this.text );
        }


        public function setFontStyle ( fstyle:String ):void {
            this.fontstyle = fstyle;
            this.__setFormat();
            // force recompute of height if needed
            this.setText( this.text );
        }

        /* setFontName( String:name )
           o Sets the name of the font
           o Can be a comma-separated list of font names 
        */
        public function setFontName ( fname:String , prop:*=null):void{
            this.fontname = fname;
            this.__setFormat();
            // force recompute of height if needed
            this.setText( this.text );
        }

        function setFontInfo () :void {
            this.font = LzFontManager.getFont( this.fontname , this.fontstyle );
            //Debug.write('setFontInfo this.font = ', this.font, 'this.fontname = ', this.fontname, this.fontstyle);
        }

        /**
         * Sets the color of all the text in the field to the given hex color.
         * @param Number c: The color for the text -- from 0x0 (black) to 0xFFFFFF (white)
         */
        public override function setColor ( col:* ):void {
            if (col != null) {
                this.textcolor = col;
                this.__setFormat();
                this.setText( this.text );
            }
        }

        /**
         * Set the html flag on this text view
         */
        function setHTML (htmlp:Boolean) :void {
            // do _not_ reset text, see swf8-kernel
            this.html = htmlp;
        }

        public function appendText( t:String ):void {
            this.text += t;
            if (! this.html) {
                this.textfield.appendText(t);
            } else {
                var df:TextFormat = this.textfield.defaultTextFormat;
                // reset textformat to workaround flash player bug (FP-77)
                this.textfield.defaultTextFormat = df;
                this.textfield.htmlText = this.text;
            }
        }

        public function getText():String {
            return this.text;
        }

        /** setText( String:text )
            o Sets the contents to the specified text
            o Uses the widthchange callback method if multiline is false and text is not resizable
            o Uses the heightchange callback method if multiline is true
        */


        /**
         * setText sets the text of the field to display
         * @param String t: the string to which to set the text
         */
        public function setText ( t:String ):void {
            //this.textfield.cacheAsBitmap = false;
            this.text = t;
            if (this.html) {
                var df:TextFormat = this.textfield.defaultTextFormat;
                // reset textformat to workaround flash player bug (FP-77)
                this.textfield.defaultTextFormat = df;
                this.textfield.htmlText = t;
            } else {
                this.textfield.text = t;
            }

            if (this.resize && (this.multiline == false)) {
                // single line resizable fields adjust their width to match the text
                var w:Number = this.getTextWidth();
                //Debug.write('lztextsprite resize setwidth ', w, this.lzheight );
                if (w != this.lzwidth) {
                    this.setWidth(w);
                }
            }

            //multiline resizable fields adjust their height
            if (this.sizeToHeight) {
                var theight:Number = this.textfield.textHeight;
                if (theight == 0) theight = this.lineheight;
                this.setHeight(theight + LzTextSprite.PAD_TEXTHEIGHT);
            }

            //this.textfield.cacheAsBitmap = true;
        }

        /**
         * Sets the format string for the text field.
         * @access private
         */
        public function __setFormat ():void {
            this.setFontInfo();
            var cfontname:String = LzFontManager.__fontnameCacheMap[this.fontname];
            if (cfontname == null) {
                cfontname = LzFontManager.__findMatchingFont(this.fontname);
                LzFontManager.__fontnameCacheMap[this.fontname] = cfontname;
                //Debug.write("caching fontname", this.fontname, cfontname);
            }
            //            Debug.write("__setFormat this.font=", this.font, 'this.fontname = ',this.fontname,
            //'cfontname=', cfontname);

            var tf:TextFormat = new TextFormat();
            tf.kerning = true;
            tf.size = this.fontsize;
            tf.font = (this.font == null ? cfontname : this.font.name);
            tf.color = this.textcolor;

            // If there is no font found, assume a device font
            this.textfield.embedFonts = (this.font != null);

            tf.bold = (this.fontstyle == "bold" || this.fontstyle =="bolditalic");
            tf.italic = (this.fontstyle == "italic" || this.fontstyle =="bolditalic");
            tf.underline = (this.underline || this.textdecoration == "underline");
            tf.align = this.textalign;
            tf.indent = this.textindent;
            if (this.textindent < 0) {
                tf.leftMargin = this.textindent * -1;
            } else {
                tf.leftMargin = 0;
            }
            tf.letterSpacing = this.letterspacing;

            this.textfield.defaultTextFormat = tf;

            // measure sample text
            var text:String = this.textfield[this.html ? 'htmlText' : 'text'];
            this.textfield.text = "__ypgSAMPLE__";
            var lm:TextLineMetrics = this.textfield.getLineMetrics(0);
            this.textfield[this.html ? 'htmlText' : 'text'] = text;

            var lh:Number = lm.ascent + lm.descent + lm.leading;
            if (lh !== this.lineheight) {
              this.lineheight = lh;
              // Tell the owner the linescale has changed
              this.owner.scrollevent('lineHeight', lh);
            }
        }


        public function setMultiline ( ml:Boolean ):void {
            this.multiline = (ml == true);
            if (this.multiline) {
                this.textfield.multiline = true;
                this.textfield.wordWrap = true;
            } else {
                this.textfield.multiline = false;
                this.textfield.wordWrap = false;
            }
        }

        /**
         * Sets the selectability (with Ibeam cursor) of the text field
         * @param Boolean isSel: true if the text may be selected by the user
         */
        public function setSelectable ( isSel:Boolean ):void {
            this.textfield.selectable = isSel;
        }
      
        public function getTextWidth ( ):Number {
            var tf:TextField = this.textfield;
            var ml:Boolean = tf.multiline;
            var mw:Boolean = tf.wordWrap;
            tf.multiline = false;
            tf.wordWrap = false;
            var twidth:Number = (tf.textWidth == 0) ? 0 : tf.textWidth + LzTextSprite.PAD_TEXTWIDTH;
            tf.multiline = ml;
            tf.wordWrap = mw;
            return twidth;
        }

        // TODO [2009-02-27 ptw] (LPP-7832) Rename to get LineHeight
        public function getTextHeight ( ):Number {
            return this.textfield.textHeight;
        }

        public function getTextfieldHeight ( ) :Number {
            var textclip:TextField = this.textfield;
            var tca:String = textclip.autoSize;
            var tcw:Number = textclip.width;
            var tch:Number = textclip.height;

            // turn on autoSize temporarily
            textclip.autoSize = TextFieldAutoSize.LEFT;
            // measure height and reset to the original values
            var h:Number = textclip.height;

            // Measure test string if the field is empty
            if (h == LzTextSprite.PAD_TEXTHEIGHT) {
                var tcp:Boolean = textclip.wordWrap;
                // Make sure the test text does not wrap!
                textclip.wordWrap = false;
                textclip.htmlText = "__ypgSAMPLE__";
                h = textclip.height;
                textclip.wordWrap = tcp;
                textclip.htmlText = "";
            }

            textclip.autoSize = tca;
            textclip.height = tch;
            textclip.width = tcw;

            return h;
        }


function setHScroll(s:Number) :void {
    this.textfield.scrollH = this.hscroll = s;
}

function setAntiAliasType( aliasType:String ):void {
    var atype:String = (aliasType == 'advanced') ? AntiAliasType.ADVANCED : AntiAliasType.NORMAL;
    this.textfield.antiAliasType = atype;
}

function getAntiAliasType():String {
    return this.textfield.antiAliasType;
}

function setGridFit( gridFit:String ):void{
    this.textfield.gridFitType = gridFit;
}

function getGridFit():String {
    return this.textfield.gridFitType;
}

function setSharpness( sharpness:Number ):void {
    this.textfield.sharpness = sharpness;
}

function getSharpness():Number {
    return this.textfield.sharpness;
}

function setThickness( thickness:Number ):void{
    this.textfield.thickness = thickness;
}

function getThickness():Number {
    return this.textfield.thickness;
}

function setMaxLength(val:Number) {
    // Runtime does not understand Infinity
    if (val == Infinity) { val = null; }
    this.textfield.maxChars = val;
}

function setPattern (val:String) :void {
    if (val == null || val == "") {
        this.textfield.restrict = null;
    } else if (new RegExp("^\\[.*\\]\\*$").test( val )) {
        this.textfield.restrict = val.substring(1, val.length - 2);
    } else if ($debug) {
        Debug.warn('LzTextSprite.setPattern argument %w must be of the form "[...]*"', val);
    }
}

function setSelection(start:Number, end:Number) :void {
    this.textfield.setSelection(start, end);
    this.textfield.alwaysShowSelection = true;
}

function setResize ( val:Boolean ) :void {
    this.resize = val;
}

function setScroll ( h:Number ) :void {
    this.textfield.scrollV = this.scroll = h;
}
function getScroll() :Number {
    return this.textfield.scrollV;
}

function getMaxScroll() :Number {
    return this.textfield.maxScrollV;
}

function getBottomScroll() :Number {
    return this.textfield.bottomScrollV;
}

function lineNoToPixel (n:Number):Number {
  return (n - 1) * lineheight;
}

function pixelToLineNo (n:Number):Number {
  return Math.floor((n / lineheight) + 1);
}

function setYScroll (n:Number) :void {
  this.textfield.scrollV = this.scroll = this.pixelToLineNo((- n));
}

function setXScroll (n:Number) :void {
  this.textfield.scrollH = this.hscroll = (- n);
}

function setWordWrap (wrap:Boolean) :void {
    Debug.warn("LzTextSprite.setWordWrap not yet implemented");
}

function getSelectionPosition() :int {
    return this.textfield.selectionBeginIndex;
}    
function getSelectionSize() :int {
    return this.textfield.selectionEndIndex - this.textfield.selectionBeginIndex;
}    

    function setTextAlign (align:String) :void {
        this.textalign = align;
        this.__setFormat();
        // force recompute of height if needed
        this.setText( this.text );
    }

    function setTextIndent (indent:Number) :void {
        this.textindent = indent;
        this.__setFormat();
        // force recompute of height if needed
        this.setText( this.text );
    }

    function setLetterSpacing (spacing:Number) :void {
        this.letterspacing = spacing;
        this.__setFormat();
        // force recompute of height if needed
        this.setText( this.text );
    }

    function setTextDecoration (decoration:String) :void {
        this.textdecoration = decoration;
        this.__setFormat();
        // note: don't need to recompute height
    }

    }#
}


