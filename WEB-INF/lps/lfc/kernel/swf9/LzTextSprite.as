/**
  * LzTextSprite.as
  *
  * @copyright Copyright 2007-2010 Laszlo Systems, Inc.  All Rights Reserved.
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
        import flash.text.StyleSheet;
        import flash.text.TextField;
        import flash.text.TextFieldAutoSize;
        import flash.text.TextFormat;
        import flash.text.TextLineMetrics;
        import flash.text.TextFieldType;
        import flashx.textLayout.formats.Direction;
        import flash.ui.*;
        import flash.utils.getDefinitionByName;

    }#

        #passthrough  {

        // TODO [hqm 2010-07] textfield should really be declared with
        // type TextField, but we need to be able to support setting
        // it to our LzTLFTextField. Is there some common interface
        // declaration we could make that would include both
        // flash.text.TextField and our compatibility class?
        public var textfield:* = null;
        public var textformat:TextFormat = null;

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

        public var direction:String = Direction.LTR;

        public function LzTextSprite (newowner:LzView = null, args:Object = null, useTLF:Boolean=false) {
            super(newowner,false);
            // owner:*, isroot:Boolean
            if (useTLF) {
                textfield = createTLFTextField(0,0,400,20);
            } else {
                textfield = createTextField(0,0,400,20);
            }
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
                if (type == MouseEvent.MOUSE_OVER) {
                    setTextfieldCursor(this);
                }
                // clickable -> handle mouse-event
                if (type == MouseEvent.DOUBLE_CLICK) {
                    this.handleMouse_DOUBLE_CLICK(e);
                } else {
                    this.__mouseEvent(e);
                }
            } else if (textfield.selectable) {
                if (type == MouseEvent.DOUBLE_CLICK) {
                    this.handleMouse_DOUBLE_CLICK(e);
                } else {
                    // ignore mouse-event for swf8 compatibility
                    this.__ignoreMouseEvent(e);
                }
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
            var eventname:String = 'on' + e.type.toLowerCase();
            //Debug.warn('__ignoreMouseEvent', eventname, this.owner);
            LzMouseKernel.handleMouseEvent(this.owner, eventname);
        }

        /** setDirection
         * sets reading order of text, legal values are 'ltr' and 'rtl'
         * @param dir reading order direction
         */
        public function setDirection (dir:String):void {
            if (dir == "ltr") {
                this.direction = Direction.LTR;
            } else if (dir == "rtl") {
                this.direction = Direction.RTL;
            } else {
                Debug.error('setDirection value "', dir, '" unknown, use "ltr" or "rtl"');
            }
            textfield.direction = dir;
        }

        private function setTextfieldCursor (lzsprite:LzSprite) :void {
            var cursor:String = null;
            if (lzsprite.clickable) {
                var usehand:Boolean = (lzsprite.showhandcursor == null) ?
                    LzMouseKernel.showhandcursor : lzsprite.showhandcursor;
                // need to respect global cursor setting
                if (usehand && ! LzMouseKernel.hasGlobalCursor) {
                    if ($swf9) {
                        // This is a workaround for LPP_8710, to make a button cursor in swf9
                        cursor = "__LFCSWF9handcursor";
                    } else {
                        cursor = MouseCursor.BUTTON;
                    }
                }
            }
            if (lzsprite.cursorResource != null) {
                cursor = lzsprite.cursorResource;
            }
            if (cursor != null) {
                this._usecursor = true;
                LzMouseKernel.setCursorLocal(cursor);
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
                        if ((relObj is TextField || relObj is LzTLFTextField) && relObj.parent is LzTextSprite) {
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
                        if (obj is LzSprite) {
                            setTextfieldCursor(LzSprite(obj));
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
            return ! (this.clickable || textfield.selectable);
        }

        private static const ZERO_POINT:Point = new Point(0, 0);

        function getNextMouseObject (e:MouseEvent) :DisplayObject {
            const FUDGE:int = 1;
            const FUDGE_WIDTH:int = 4; // needs to be 4, flash bug?
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
                    var zero:Point = textfield.localToGlobal(ZERO_POINT);
                    x = Math.max(zero.x + FUDGE, Math.min(x, zero.x + textfield.width - FUDGE_WIDTH));
                    y = Math.max(zero.y + FUDGE, Math.min(y, zero.y + textfield.height - FUDGE));
                }
            } else if (e.type == MouseEvent.MOUSE_OVER) {
                // some mouse-over events are sent too early, in which case the mouse-cursor
                // isn't yet over the textfield, therefore need to adjust values
                var zero:Point = textfield.localToGlobal(ZERO_POINT);
                x = Math.max(zero.x + FUDGE, Math.min(x, zero.x + textfield.width - FUDGE_WIDTH));
                y = Math.max(zero.y + FUDGE, Math.min(y, zero.y + textfield.height - FUDGE));
            }

            var tindex:int = -1;
            var objs:Array = stage.getObjectsUnderPoint(new Point(x, y));
            for (var i:int = objs.length - 1; i >= 0; --i) {
                var obj:DisplayObject = objs[i];
                if (obj === textfield) {
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
                } else if ((obj is TextField || obj is LzTLFTextField) && obj.parent is LzTextSprite) {
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
            setShowHandCursor(c);
            this.clickable = c;
            this.updateMouseEnabled();
        }

        public function addScrollEventListener():void {
            textfield.addEventListener(Event.SCROLL, __handleScrollEvent);
        }

        var scrollevents = false;
        function setScrollEvents(on) {
            this.scrollevents = on;
            // If you want to get updated before the next frame renders, need to set renderImmediate=true
            if (textfield is LzTLFTextField) {
                textfield.renderImmediate = true;
            }
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
                owner.scrollevent('scrollHeight', lineNoToPixel(textfield.maxScrollV) + owner.height);
            }
            if (hscroll !== textfield.scrollH) {
                hscroll = textfield.scrollH;
                //Debug.info('__handleScrollEvent', 'scrollLeft', textfield.scrollH);
                owner.scrollevent('scrollLeft', textfield.scrollH);
            }
            if (maxhscroll !== textfield.maxScrollH) {
                maxhscroll = textfield.maxScrollH;
                //Debug.info('__handleScrollEvent', 'scrollWidth', textfield.maxScrollH);
                owner.scrollevent('scrollWidth', textfield.maxScrollH + owner.width);
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

        override public function setWidth( w:Number ):void {
            super.setWidth(w);
            textfield.width = w;
            __handleScrollEvent();
        }

        override public function setHeight( h:Number ):void {
            super.setHeight(h);
            textfield.height = h;
            __handleScrollEvent();
        }

        private function createTextField(nx:Number, ny:Number, w:Number, h:Number):TextField {
            var tfield:TextField = new TextField();
            tfield.antiAliasType = AntiAliasType.ADVANCED;
            tfield.x = nx;
            tfield.y = ny;
            tfield.width = w;
            tfield.height = h;
            tfield.border = false;
            tfield.tabEnabled = LFCApplication.textfieldTabEnabled;
            //tfield.cacheAsBitmap = true;
            addChild(tfield);
            return tfield;
        }


        private function createTLFTextField(nx:Number, ny:Number, w:Number, h:Number):LzTLFTextField {
            var tfield:LzTLFTextField = new LzTLFTextField();
            tfield.width = w;
            tfield.height = h;
            tfield.x = nx;
            tfield.y = ny;
            tfield.border = false;
            tfield.antiAliasType = AntiAliasType.ADVANCED;
            tfield.text = "";
            tfield.tabEnabled = LFCApplication.textfieldTabEnabled;
            addChild(tfield);
            tfield.renderImmediate = true;
            return tfield;
        }



        public function __initTextProperties (args:Object) :void {
            textfield.autoSize = TextFieldAutoSize.NONE;

            //inherited attributes, documented in view
            this.fontname = args.font;
            this.fontsize = args.fontsize;
            this.fontstyle = args.fontstyle;
            this.textcolor = args.fgcolor;
            textfield.background = false;

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
            if (! args.hassetheight) {
                this.sizeToHeight = true;
                if (this.multiline) {
                    textfield.autoSize = TextFieldAutoSize.LEFT;
                }
            } else if (args['height'] != null) {
                // Does setting height of the text object do the right thing in swf9?
                textfield.height = args.height;
            }
            // Default the scrollheight to the visible height.
            this.scrollheight = this.height;

            // TODO [hqm 2008-01] There ought to be only call to
            // __setFormat during instantiation of an lzText. Figure
            // out how to suppress the other calls from setters.
            this.__setFormat();

            if (this.sizeToHeight) {
                var h = this.lineheight;
                //TODO [anba 20080602] is this ok for multiline? 
                if (this.multiline) h *= textfield.numLines;
                h += 4;//2*2px gutter, see flash docs for flash.text.TextLineMetrics 
                this.setHeight(h);
            }

            addScrollEventListener();
            __handleScrollEvent();
        }



        public function setBorder ( onroff:Boolean):void {
            textfield.border = (onroff == true);
        }

        public function setEmbedFonts ( onroff:Boolean ):void {
            textfield.embedFonts = (onroff == true);
        }

        /*
         *  setFontSize( Number:size )
         o Sets the size of the font in pixels 
        */
        public function setFontSize ( fsize:Number ):void {
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
        public function setTextColor ( col:* ):void {
            if (col == null || this.textcolor === col) return;
            this.textcolor = col;
            this.__setFormat();
            this.setText( this.text );
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
                textfield.appendText(t);
            } else if (textfield.styleSheet == null) {
                // reset textformat to workaround flash player bug (FP-77)
                textfield.defaultTextFormat = this.textformat;
                textfield.htmlText = this.text;
            } else {
                // you can't set defaultTextFormat if a style sheet is applied
                textfield.htmlText = this.text;
            }
            __handleScrollEvent();
            if (this.initted) this.owner._updateSize();
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
            this.text = t;

            if (! this.html) {
                textfield.text = t;
            } else if (textfield.styleSheet == null) {
                // reset textformat to workaround flash player bug (FP-77)
                textfield.defaultTextFormat = this.textformat;
                textfield.htmlText = t;
            } else {
                // you can't set defaultTextFormat if a style sheet is applied
                textfield.htmlText = t;
            }

            if (this.resize && (this.multiline == false)) {
                // single line resizable fields adjust their width to match the text
                var w:Number = this.getTextWidth();
                if (w != this.lzwidth) {
                    this.setWidth(w);
                }
            }

            //multiline resizable fields adjust their height
            if (this.sizeToHeight) {
                var theight:Number = textfield.textHeight;
                if (theight == 0) theight = this.lineheight;
                this.setHeight(theight + LzTextSprite.PAD_TEXTHEIGHT);
            }

            __handleScrollEvent();

            if (this.initted) this.owner._updateSize();
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
            this.textformat = tf;
            tf.kerning = true;
            tf.size = this.fontsize;
            tf.font = (this.font == null ? cfontname : this.font.name);
            tf.color = this.textcolor;

            // If there is no font found, assume a device font
            textfield.embedFonts = (this.font != null);

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

            // you can't set defaultTextFormat if a style sheet is applied

            var stylesheet:StyleSheet = textfield.styleSheet;
            textfield.styleSheet = null;
            textfield.defaultTextFormat = tf;

            // measure sample text
            var prevtext:String = this.text;
            // TODO [hqm 2010-07] setting type to plain 'text' for
            // LzTLFTextField has a bug with being unable to read out
            // the line height immediately, so need to use type=html
            // for now.
            if (textfield is LzTLFTextField) {
                textfield.renderImmediate = true;
                textfield.htmlText = "__ypgSAMPLE__";
            } else {
                textfield.text = "__ypgSAMPLE__";
            }

            var lm:TextLineMetrics = textfield.getLineMetrics(0);

            if (textfield is LzTLFTextField) {
                // We've got the text metrics, We can turn off forced
                // rendering now.
                textfield.renderImmediate = false;
            }

            textfield.styleSheet = stylesheet;
            textfield[this.html ? 'htmlText' : 'text'] = prevtext;

            var lh:Number = lm.ascent + lm.descent + lm.leading;
            if (lh !== this.lineheight) {
                this.lineheight = lh;
                // Tell the owner the linescale has changed
                this.owner.scrollevent('lineHeight', lh);
            }

            if (this.initted) this.owner._updateSize();

        }




        public function setMultiline ( ml:Boolean ):void {
            // TODO [hqm 2008-01] have to figure out how the Flex textfield multiline
            // maps to Laszlo model.
            this.multiline = (ml == true);
            if (this.multiline) {
                textfield.multiline = true;
                textfield.wordWrap = true;
            } else {
                textfield.multiline = false;
                textfield.wordWrap = false;
            }
            if (this.initted) this.owner._updateSize();
        }

        /**
         * Sets the selectability (with Ibeam cursor) of the text field
         * @param Boolean isSel: true if the text may be selected by the user
         */
        public function setSelectable ( isSel:Boolean ):void {
            textfield.selectable = isSel;
            this.updateMouseEnabled();
        }
      
        public function getTextWidth (force=null):Number {
            var ml:Boolean = textfield.multiline;
            var mw:Boolean = textfield.wordWrap;
            textfield.multiline = false;
            textfield.wordWrap = false;
            var twidth:Number = (textfield.textWidth == 0) ? 0 : textfield.textWidth + LzTextSprite.PAD_TEXTWIDTH;
            textfield.multiline = ml;
            textfield.wordWrap = mw;
            return twidth;
        }

        public function getLineHeight ( ):Number {
            return textfield.textHeight;
        }

        public function getTextfieldHeight (force=null) :Number {
            var tca:String = textfield.autoSize;
            var tcw:Number = textfield.width;
            var tch:Number = textfield.height;

            // turn on autoSize temporarily
            textfield.autoSize = TextFieldAutoSize.LEFT;
            // measure height and reset to the original values
            var h:Number = textfield.height;

            // Measure test string if the field is empty
            if (h == LzTextSprite.PAD_TEXTHEIGHT) {
                var tcp:Boolean = textfield.wordWrap;
                // Make sure the test text does not wrap!
                textfield.wordWrap = false;
                textfield.htmlText = "__ypgSAMPLE__";
                h = textfield.height;
                textfield.wordWrap = tcp;
                textfield.htmlText = "";
            }

            textfield.autoSize = tca;
            textfield.height = tch;
            textfield.width = tcw;

            return h;
        }


function setHScroll(s:Number) :void {
    textfield.scrollH = this.hscroll = s;
}

function setAntiAliasType( aliasType:String ):void {
    var atype:String = (aliasType == 'advanced') ? AntiAliasType.ADVANCED : AntiAliasType.NORMAL;
    textfield.antiAliasType = atype;
    if (this.initted) this.owner._updateSize();
}

function getAntiAliasType():String {
    return textfield.antiAliasType;
}

function setGridFit( gridFit:String ):void{
    textfield.gridFitType = gridFit;
    if (this.initted) this.owner._updateSize();
}

function getGridFit():String {
    return textfield.gridFitType;
}

function setSharpness( sharpness:Number ):void {
    textfield.sharpness = sharpness;
}

function getSharpness():Number {
    return textfield.sharpness;
}

function setThickness( thickness:Number ):void{
    textfield.thickness = thickness;
}

function getThickness():Number {
    return textfield.thickness;
}

function setMaxLength(val:Number) {
    // Runtime does not understand Infinity
    if (val == Infinity) { val = null; }
    textfield.maxChars = val;
    if (this.initted) this.owner._updateSize();
}

/**
 * @devnote [2010-06-21 ptw] (LPP-9134) The textfield pattern is just
 * the permitted character set description, without the enclosing
 * `[...]*`.  If you think using RegExp to check this condition would
 * be a better idea, see the referenced bug first.
 *
 * @access private
 */
function setPattern (val:String) :void {
    if (val == null || val == "") {
        textfield.restrict = null;
    } else if (val.substring(0,1) == "[" &&
               val.substring(val.length-2, val.length) == "]*") {
        textfield.restrict = val.substring(1, val.length - 2);
    } else if ($debug) {
        Debug.error('LzTextSprite.setPattern argument %w must be of the form "[...]*"', val);
    }
}

function setSelection(start:Number, end:Number) :void {
    textfield.setSelection(start, end);
    textfield.alwaysShowSelection = true;
}

function setResize ( val:Boolean ) :void {
    this.resize = val;
    if (this.initted) this.owner._updateSize();
}

function setScroll ( h:Number ) :void {
    textfield.scrollV = this.scroll = h;
}
function getScroll() :Number {
    return textfield.scrollV;
}

function getMaxScroll() :Number {
    return textfield.maxScrollV;
}

function getBottomScroll() :Number {
    return textfield.bottomScrollV;
}

function lineNoToPixel (n:Number):Number {
  return (n - 1) * lineheight;
}

function pixelToLineNo (n:Number):Number {
  return Math.ceil(n / lineheight) + 1;
}

function setYScroll (n:Number) :void {
  textfield.scrollV = this.scroll = this.pixelToLineNo((- n));
}

function setXScroll (n:Number) :void {
  textfield.scrollH = this.hscroll = (- n);
}

function setWordWrap (wrap:Boolean) :void {
    Debug.warn("LzTextSprite.setWordWrap not yet implemented");
}

function getSelectionPosition() :int {
    return textfield.selectionBeginIndex;
}    
function getSelectionSize() :int {
    return textfield.selectionEndIndex - textfield.selectionBeginIndex;
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

    protected var mouseactive:Boolean = false;
    function activateLinks(active:Boolean) :void {
        if (this.mouseactive == active) return;
        this.mouseactive = active;
        if (active) {
            textfield.addEventListener(TextEvent.LINK, textLinkHandler);
            textfield.addEventListener(MouseEvent.CLICK, handleTextfieldMouse);
            textfield.addEventListener(MouseEvent.DOUBLE_CLICK, handleTextfieldMouse);
            textfield.addEventListener(MouseEvent.MOUSE_DOWN, handleTextfieldMouse);
            textfield.addEventListener(MouseEvent.MOUSE_UP, handleTextfieldMouse);
            textfield.addEventListener(MouseEvent.MOUSE_OVER, handleTextfieldMouse);
            textfield.addEventListener(MouseEvent.MOUSE_OUT, handleTextfieldMouse);
        } else {
            textfield.removeEventListener(TextEvent.LINK, textLinkHandler);
            textfield.removeEventListener(MouseEvent.CLICK, handleTextfieldMouse);
            textfield.removeEventListener(MouseEvent.DOUBLE_CLICK, handleTextfieldMouse);
            textfield.removeEventListener(MouseEvent.MOUSE_DOWN, handleTextfieldMouse);
            textfield.removeEventListener(MouseEvent.MOUSE_UP, handleTextfieldMouse);
            textfield.removeEventListener(MouseEvent.MOUSE_OVER, handleTextfieldMouse);
            textfield.removeEventListener(MouseEvent.MOUSE_OUT, handleTextfieldMouse);
        }
    }

    protected function updateMouseEnabled() :void {
        var active:Boolean = ! forwardsMouse;
        this.mouseEnabled = active;
        this.mouseChildren = active;
        this.activateLinks(active);
    }

    }#
}


