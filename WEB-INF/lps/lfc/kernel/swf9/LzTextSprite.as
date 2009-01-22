
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
        import flash.display.*;
        import flash.events.*;
        import flash.text.*;
        import flash.net.URLRequest;  
    }#

        #passthrough  {  

        public var textfield:TextField = null;

        public static var PAD_TEXTWIDTH:Number = 4;
        public static var DEFAULT_SIZE = 11;

        var font = null;
        public var lineheight = 11;

        public var textcolor = 0;
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

        public function LzTextSprite (newowner = null, args = null) {
            super(newowner,false);
            // owner:*, isroot:Boolean
            this.textfield = createTextField(0,0,400,20);
        }

        
        override public function setClickable( c:Boolean ):void {
          if (this.clickable == c) return;

          this.textfield.mouseEnabled = c || this.textfield.selectable;
          this.setCancelBubbling();

          this.clickable = c;
          if (c) {
              attachMouseEvents(this.textfield);
          } else {
              removeMouseEvents(this.textfield);
          }
      }

      // turn on/off canceling of mouse event bubbling
      private function setCancelBubbling():void {
          var dobj:DisplayObject = this.textfield;

          // base on the displayobject's mouseenabled property - on for selectable
          var prevent = this.textfield.mouseEnabled;
          // if clickable is on, we don't want to cancel events
          if (this.clickable) prevent = false;

          if (prevent) {
              dobj.addEventListener(MouseEvent.CLICK, __ignoreMouseEvent);
              dobj.addEventListener(MouseEvent.DOUBLE_CLICK, __ignoreMouseEvent);
              dobj.addEventListener(MouseEvent.MOUSE_DOWN, __ignoreMouseEvent);
              dobj.addEventListener(MouseEvent.MOUSE_UP, __ignoreMouseEvent);
              dobj.addEventListener(MouseEvent.MOUSE_OVER, __ignoreMouseEvent);
              dobj.addEventListener(MouseEvent.MOUSE_OUT, __ignoreMouseEvent);
          } else {
              dobj.removeEventListener(MouseEvent.CLICK, __ignoreMouseEvent);
              dobj.removeEventListener(MouseEvent.DOUBLE_CLICK, __ignoreMouseEvent);
              dobj.removeEventListener(MouseEvent.MOUSE_DOWN, __ignoreMouseEvent);
              dobj.removeEventListener(MouseEvent.MOUSE_UP, __ignoreMouseEvent);
              dobj.removeEventListener(MouseEvent.MOUSE_OVER, __ignoreMouseEvent);
              dobj.removeEventListener(MouseEvent.MOUSE_OUT, __ignoreMouseEvent);
          }
      }

      private function __ignoreMouseEvent(e:MouseEvent) :void {
          if (e.type != MouseEvent.MOUSE_UP || LzMouseKernel.__lastMouseDown == this) {
              // don't cancel "onmouseup" if another sprite was selected
              e.stopPropagation();
          }
      }

        public function enableClickableLinks( enabled:Boolean):void {
            if (enabled) {
                addEventListener(TextEvent.LINK, textLinkHandler);
            } else {
                removeEventListener(TextEvent.LINK, textLinkHandler);
            }
        }

        public function textLinkHandler(e:TextEvent) {
            this.owner.ontextlink.sendEvent(e.text);
        }

        public function makeTextLink(str, value) {
            return '<a href="event:'+value+'">'+str+'</a>';
        }

        override public function setWidth( w:* ):void {
            super.setWidth(w);
            if (w) {
                this.textfield.width = w;
            }
        }

        override public function setHeight( h:* ):void {
            super.setHeight(h);
            if (h) {
                this.textfield.height = h;
            }
        }

        private function createTextField(nx:Number, ny:Number, w:Number, h:Number):TextField {
        var tfield:TextField = new TextField();
            tfield.antiAliasType = flash.text.AntiAliasType.ADVANCED;
            tfield.x = nx;
            tfield.y = ny;
            tfield.width = w;
            tfield.height = h;
            tfield.border = false;
            tfield.mouseEnabled = false;
            tfield.tabEnabled = LFCApplication.textfieldTabEnabled;
            //tfield.cacheAsBitmap = true;
            addChild(tfield);
            return tfield;
        }

        public  function __initTextProperties (args:Object) {
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
                //text and format is set, measure it
                var lm:TextLineMetrics = textclip.getLineMetrics(0);
                var h = lm.ascent + lm.descent + lm.leading;
                //TODO [anba 20080602] is this ok for multiline? 
                if (this.multiline) h *= textclip.numLines;
                h += 4;//2*2px gutter, see flash docs for flash.text.TextLineMetrics 
                this.setHeight(h);
            }
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
        override public function setFontName ( fname:String , prop=null):void{
            this.fontname = fname;
            this.__setFormat();
            // force recompute of height if needed
            this.setText( this.text );
        }

        function setFontInfo () {
            this.font = LzFontManager.getFont( this.fontname , this.fontstyle );
            //Debug.write('setFontInfo this.font = ', this.font, 'this.fontname = ', this.fontname, this.fontstyle);

            if (this.font != null) {
                //Debug.write('font.leading', this.font.leading, 'font.height = ',this.font.height, 'fontsize =',this.fontsize);
                this.lineheight = Number(this.font.leading) + ( Number(this.font.height) *
                                                        Number(this.fontsize) / DEFAULT_SIZE );
            }
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
                //FIXME [20080602 anba] won't possibly work, example: 
                //textfield.textHeight=100
                //textfield.height=10
                //=> setHeight(Math.max(100, 10)) == setHeight(100)
                //setHeight sets textfield.height to 100
                //next round:
                //textfield.textHeight=10 (new text was entered)
                //textfield.height=100 (set above!)
                //=> setHeight(Math.max(10, 100)) == setHeight(100)
                // => textfield.height still 100, sprite-height didn't change, but it should!
                this.setHeight(Math.max(this.textfield.textHeight, this.textfield.height));
            }
            //this.textfield.cacheAsBitmap = true;
        }

        /**
         * Sets the format string for the text field.
         * @access private
         */
        public function __setFormat ():void {
            this.setFontInfo();
            var cfontname = LzFontManager.__fontnameCacheMap[this.fontname];
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
            this.textfield.mouseEnabled = isSel || this.clickable;
            this.setCancelBubbling();
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

        public function getTextHeight ( ):Number {
            return this.textfield.textHeight;
        }

        public function getTextfieldHeight ( ) {
            return this.textfield.height;
        }


function setHScroll(s:Number) {
    this.textfield.scrollH = s;
}

function setAntiAliasType( aliasType:String ):void {
    var atype:String = (aliasType == 'advanced') ? flash.text.AntiAliasType.ADVANCED : flash.text.AntiAliasType.NORMAL;
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

function setSelection(start:Number, end:Number) { 
    this.textfield.setSelection(start, end);
}

function setResize ( val:Boolean ) {
    this.resize = val;
}

function setScroll ( h:Number ) {
    this.textfield.scrollV = h;
}
function getScroll() {
    return this.textfield.scrollV;
}

function getMaxScroll() {
    return this.textfield.maxScrollV;
}

function getBottomScroll() {
    return this.textfield.bottomScrollV;
}

function setXScroll ( n ){
    Debug.write("LzTextSprite.setXScroll not yet implemented");
}

function setYScroll ( n ){
    Debug.write("LzTextSprite.setYScroll not yet implemented");
}

function setWordWrap ( wrap ){
    Debug.write("LzTextSprite.setWordWrap not yet implemented");
}

function getSelectionPosition() {
    return this.textfield.selectionBeginIndex;
}    
function getSelectionSize() {
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


