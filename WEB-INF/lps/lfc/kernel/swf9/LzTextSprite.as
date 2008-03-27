
/**
  * LzTextSprite.as
  *
  * @copyright Copyright 2007, 2008 Laszlo Systems, Inc.  All Rights Reserved.
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
        public var fontsize:String = "11";
        public var fontstyle:String = "plain";
        public var fontname:String = "Verdana";
        public var lineheight = 11;

        public var colorstring:String = "#000000";
        public var text:String = "";

        public var resize:Boolean = true;
        public var multiline:Boolean = false;
        public var underline:Boolean = false;
        public var closeformat:String;

        public var sizeToHeight:Boolean = false;
        public var password:Boolean = false;
        public var scrollheight:Number = 0;

        public function LzTextSprite (newowner = null, args = null) {
            super(newowner,false);
            // owner:*, isroot:Boolean
            this.textfield = createTextField(0,0,400,20);
        }

        
        override public function setClickable( c:Boolean ):void {
          if (this.clickable == c) return;

          this.textfield.mouseEnabled = c;

          this.clickable = c;
          if (c) {
              attachMouseEvents(this.textfield);
          } else {
              removeMouseEvents(this.textfield);
          }
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
            tfield.x = nx;
            tfield.y = ny;
            tfield.width = w;
            tfield.height = h;
            tfield.border = false;
            //tfield.cacheAsBitmap = true;
            addChild(tfield);
            return tfield;
        }

        public  function __initTextProperties (args:Object) {
            this.password = args.password  ? true : false;
            var textclip:TextField = this.textfield;
            textclip.displayAsPassword = this.password;

            textclip.selectable = args.selectable;
            textclip.autoSize = TextFieldAutoSize.LEFT;

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


            textclip.autoSize = TextFieldAutoSize.LEFT;

            // To compute our height:
            // + If height is supplied, use it.
            // + if no height supplied:
            //    if  single line, use font line height
            //    else get height from flash textobject.textHeight 
            // 
            if (args.height == null && (args.$ref == null || typeof(args.$refs.height) != "function")) {
                this.sizeToHeight = true;
                //trace('sizeToHeight == true');
                // set autoSize to get text measured
                if (!this.multiline) {
                    // But turn off autosizing for single line text, now that
                    // we got a correct line height from flash.
                    //textclip.autoSize = TextFieldAutoSize.NONE;
                }
            }  else {
                // Does setting height of the text object do the right thing in swf9?
                textclip.height = args.height;
            }
            // Default the scrollheight to the visible height.
            this.scrollheight = this.height;

            // TODO [hqm 2008-01] There ought to be only call to
            // __setFormat during instantiation of an lzText. Figure
            // out how to suppress the other calls from setters.
            this.__setFormat();
            this.setText(args.text);
        }

        override public function setBGColor( c:* ):void {
            //trace("LzTextSprite. setBGColor  ", c);
            if (c == null) {
                this.textfield.background = false; }
            else {
                this.textfield.background = true; 
                this.textfield.backgroundColor = c;
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
        public function setFontName ( fname:String ):void{
            this.fontname = fname;
            this.__setFormat();
            // force recompute of height if needed
            this.setText( this.text );
        }

        function setFontInfo () {
            this.font = LzFontManager.getFont( this.fontname , this.fontstyle );
            //trace('setFontInfo this.font = ', this.font, 'this.fontname = ', this.fontname, this.fontstyle);

            if (this.font != null) {
                //trace('font.leading', this.font.leading, 'font.height = ',this.font.height, 'fontsize =',this.fontsize);
                this.lineheight = Number(this.font.leading) + ( Number(this.font.height) *
                                                        Number(this.fontsize) / DEFAULT_SIZE );
            }
        }

        /**
         * Sets the color of all the text in the field to the given hex color.
         * @param Number c: The color for the text -- from 0x0 (black) to 0xFFFFFF (white)
         */
        public override function setColor ( col:* ):void {
            this.colorstring = "#" + col.toString( 16 );
            this.__setFormat();
            this.setText( this.text );
        }



        public function appendText( t:String ):void {
            this.textfield.appendText(t);
            this.text = this.textfield.text;
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
            if (t == null || typeof(t) == 'undefined' || t == 'null') {
                t = "";
            } else if (typeof(t) != "string") {
                t = t.toString();
            }

            this.text =  t;
            this.textfield.htmlText = t;
        
            if (this.resize && (this.multiline == false)) {
                // single line resizable fields adjust their width to match the text
            var w:Number = this.getTextWidth();
                //trace('lztextsprite resize setwidth ', w, this.lzheight );
                if (w != this.lzwidth) {
                    this.setWidth(w);
                }
            }

            //multiline resizable fields adjust their height
            if (this.sizeToHeight) {
                this.setHeight(this.textfield.height);
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
            //            trace("__setFormat this.font=", this.font, 'this.fontname = ',this.fontname,
            //'cfontname=', cfontname);

            var tf:TextFormat = new TextFormat();
            tf.size = this.fontsize;
            tf.font = (this.font == null ? cfontname : this.font.name);
            tf.color = this.colorstring;

            // If there is no font found, assume a device font
            if (this.font == null) {
                this.textfield.embedFonts = false;
            } else {
                this.textfield.embedFonts = true;
            }

            if (this.fontstyle == "bold" || this.fontstyle =="bolditalic"){
                tf.bold = true;
            }

            if (this.fontstyle == "italic" || this.fontstyle =="bolditalic"){
                tf.italic = true;
            }
            if (this.underline){
                tf.underline = true;
            }

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
        }



function setHScroll (s){}

function setAntiAliasType( aliasType ){}

function getAntiAliasType() {}


function setGridFit( gridFit ){}

function getGridFit() {}

function setSharpness( sharpness ){}

function getSharpness() { }

function setThickness( thickness ){}

function getThickness() {}

function setMaxLength ( val ){}
function setPattern ( val ){}

function setSelection ( start , end ){ }

function setResize ( val ){
    this.resize = val;
}

function setScroll ( h ){
    trace("LzTextSprite.setScroll not yet implemented");
}
function getScroll (  ){
    trace("LzTextSprite.getScroll not yet implemented");
}

function getMaxScroll (  ){
    trace("LzTextSprite.getMaxScroll not yet implemented");
}

function getBottomScroll (  ){
    trace("LzTextSprite.getBottomScroll not yet implemented");
}

function setXScroll ( n ){
    trace("LzTextSprite.setXScroll not yet implemented");
}

function setYScroll ( n ){
    trace("LzTextSprite.setYScroll not yet implemented");
}

function setWordWrap ( wrap ){
    trace("LzTextSprite.setWordWrap not yet implemented");
}

function getSelectionPosition ( ){
    trace("LzTextSprite.getSelectionPosition not yet implemented");
}    
function getSelectionSize ( ){
    trace("LzTextSprite.getSelectionSize not yet implemented");
}    

    }#
}


