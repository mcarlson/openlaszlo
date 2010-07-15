/**
  * LzTLFTextSprite.as
  *
  * @copyright Copyright 2007-2010 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic swf9
  * @author Henry Minsky &lt;hminsky@laszlosystems.com&gt;
  */


/**
   Text Sprite implemented using Flash 10 Text Layout Framework API
 */

public class LzTLFTextSprite extends LzSprite {
    #passthrough (toplevel:true) {
   
    import flash.display.DisplayObject;
    import flash.display.Sprite;
    import flash.events.Event;
    import flash.events.MouseEvent;
    import flash.events.TextEvent;
    import flash.geom.Rectangle;
    import flash.text.engine.FontPosture;
    import flash.text.engine.Kerning;
    import flash.text.engine.TextBaseline;
    import flashx.textLayout.container.ContainerController;
    import flashx.textLayout.container.TextContainerManager;
    import flashx.textLayout.conversion.TextConverter;
    import flashx.textLayout.edit.EditManager;
    import flashx.textLayout.edit.EditingMode;
    import flashx.textLayout.edit.ISelectionManager;
    import flashx.textLayout.edit.SelectionState;
    import flashx.textLayout.elements.Configuration;
    import flashx.textLayout.elements.IConfiguration;
    import flashx.textLayout.elements.LinkElement;
    import flashx.textLayout.elements.ParagraphElement;
    import flashx.textLayout.elements.TextFlow;
    import flashx.textLayout.events.*;
    import flashx.textLayout.events.CompositionCompleteEvent;
    import flashx.textLayout.events.FlowOperationEvent;
    import flashx.textLayout.events.SelectionEvent;
    import flashx.textLayout.formats.Direction;
    import flashx.textLayout.formats.LineBreak;
    import flashx.textLayout.formats.TextAlign;
    import flashx.textLayout.formats.TextLayoutFormat;
    import flashx.textLayout.formats.WhiteSpaceCollapse;
    import flashx.textLayout.operations.*;
    import flashx.undo.UndoManager;
    }#

    #passthrough {

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
        public var textcolor:Number = 0;
        public var text:String = "";

        public var resize:Boolean = true;
        public var multiline:Boolean = false;
        public var underline:Boolean = false;
        public var selectable:Boolean = false;

        public var textalign:String = "left";
        public var textindent:Number = 0;
        public var letterspacing:Number = 0;
        public var textdecoration:String = "none";

        public var sizeToHeight:Boolean = false;
        public var password:Boolean = false;
        public var scrollheight:Number = 0;
        public var html:Boolean = true;

        var config:Configuration = null;
        var layoutFormat:TextLayoutFormat = null;
        public var direction:String = Direction.LTR;

        ////////////////////////////////////////////////////////////////
        // TODO [hqm 2010-06] TLF objects, these are declared public right now for debugging
        public var editManager:EditManager = null;
        public var undoManager:UndoManager = null;
        public var textContainerManager:LzTextContainerManager;
        public var textFlow:TextFlow;
        // The text sprite layout puts its stuff in here
        public var container:Sprite; 

        public static const TEXTPADDING = 2;
        public static const LEADING = 1.2;

        public function LzTLFTextSprite (newowner:LzView = null, args:Object = null) {
            super(newowner,false);
            container = new Sprite();
            container.mouseChildren  = false;
            container.mouseEnabled  = false;
            
            // add container to the stage; create controller and add it to the text flow
            addChild(container);
            this.config = ((TextContainerManager.defaultConfiguration) as Configuration).clone();
            //Debug.info("config.textFlowInitialFormat = ",  config.textFlowInitialFormat);
            layoutFormat =  new TextLayoutFormat(config.textFlowInitialFormat);
            layoutFormat.paddingTop = layoutFormat.paddingBottom = layoutFormat.paddingLeft =
                layoutFormat.paddingRight = LzTLFTextSprite.TEXTPADDING;
            config.textFlowInitialFormat = layoutFormat;
            
            textContainerManager = new LzTextContainerManager(container, null, this);
            textContainerManager.editingMode = EditingMode.READ_SELECT;
            // install event listeners on EditManager or ContainerController
            //            textContainerManager.addEventListener( SelectionEvent.SELECTION_CHANGE, selectionChangeHandler);
            // Converts a click on a LinkElement to a "TextEvent.LINK"
            // event.  For some (stupid?) reason textFlow does not
            // generate it's own TextEvent.LINK event, when you click
            // on a link.
            textContainerManager.addEventListener(MouseEvent.CLICK, handleLinkClick);
            this.addEventListener(TextEvent.LINK, textLinkHandler);
        }

        // This is too late to stop the selection behavior
        function selectionChangeHandler(event:flashx.textLayout.events.SelectionEvent):void {
            //Debug.info("selectionChangeHandler",
                      //event.selectionState.absoluteStart, event.selectionState.absoluteEnd);

            if (!this.selectable) {
                //                Debug.info("not selectable, calling event.preventDefault, cancelable:", event.cancelable,
                //                           "eventphase:", event.eventPhase, 'type:', event.type);
                event.preventDefault();
            }
        }

        function mouseEventHandler(event:MouseEvent):void {


        }


    function textFlow_flowOperationBeginHandler(event:FlowOperationEvent):void
    {
        //trace("operationBegin");
        
        //Debug.info("textFlow_flowOperationBeginHandler", event.operation);
        var op:FlowOperation = event.operation;

        // If the user presses the Enter key in a single-line TextView,
        // we cancel the paragraph-splitting operation and instead
        // simply dispatch an 'enter' event.
        if (op is SplitParagraphOperation && !multiline)
        {
            //Debug.info("got SplitParagraphOperation");
            event.preventDefault();
        }
        
    }


        private function setTextfieldCursor (lzsprite:LzSprite) :void { }

        override public function setClickable( c:Boolean ):void {
            if (this.clickable == c) return;
            //setShowHandCursor(c);
            container.mouseChildren = c || selectable;
            container.mouseEnabled = c || selectable;
            this.clickable = c;
        }

        public function addScrollEventListener():void {
            textContainerManager.addEventListener(TextLayoutEvent.SCROLL, __handleScrollEvent);
        }

        var scrollevents = false;
        function setScrollEvents(on) {
            this.scrollevents = on;
        }

        function __handleScrollEvent(e:Event = null) :void {
            //Debug.info('__handleScrollEvent');

            if (! this.scrollevents) return;
            if (scroll !== getScroll()) {
                scroll = getScroll();
                owner.scrollevent('scrollTop', lineNoToPixel(scroll));
            }
            if (maxscroll !== getMaxScroll()) {
                maxscroll = getMaxScroll();
                //Debug.info('__handleScrollEvent', 'scrollHeight', lineNoToPixel(textfield.maxScrollV));
                owner.scrollevent('scrollHeight', lineNoToPixel(maxscroll) + owner.height);
            }
            if (hscroll !== textContainerManager.horizontalScrollPosition) {
                hscroll = textContainerManager.horizontalScrollPosition;
                //Debug.info('__handleScrollEvent', 'scrollLeft', textfield.scrollH);
                owner.scrollevent('scrollLeft', textContainerManager.horizontalScrollPosition);
            }
            if (maxhscroll !== getMaxScrollH()) {
                maxhscroll = getMaxScrollH();
                //Debug.info('__handleScrollEvent', 'scrollWidth', textfield.maxScrollH);
                owner.scrollevent('scrollWidth', maxhscroll + owner.width);
            }
        }

        public function textLinkHandler(e:TextEvent) :void {
            // ignore the next onclick-event for swf8-compatibility
            // Debug.write("textLinkHandler on %w", this);
            this.owner.ontextlink.sendEvent(e.text);
        }

        private function handleLinkClick(event:FlowElementMouseEvent):void
        {
            if (event.flowElement is LinkElement)
            {
                event.preventDefault();
                dispatchEvent(new TextEvent(TextEvent.LINK,
                                            LinkElement(event.flowElement).href));
            }
        }


        public function makeTextLink(str:String, value:String) :String {
            return '<a href="event:'+value+'">'+str+'</a>';
        }

        override public function setWidth( w:Number ):void {
            super.setWidth(w);
            textContainerManager.compositionWidth = w;
            textContainerManager.updateContainer();
            this.__handleScrollEvent();
        }

        override public function setHeight( h:Number ):void {
            super.setHeight(h);
            textContainerManager.compositionHeight = h;
            textContainerManager.updateContainer();
            this.__handleScrollEvent();
        }

        public function __initTextProperties (args:Object) :void {
            //textclip.autoSize = TextFieldAutoSize.NONE;

            //inherited attributes, documented in view

            //Debug.info("__initTextProperties", args);

            this.fontname = args.font;
            this.fontsize = args.fontsize;
            this.fontstyle = args.fontstyle;
            this.textcolor = args.fgcolor;
            if (! args.hassetheight) {
                this.sizeToHeight = true;
                //                if (this.multiline) {
                //                    textclip.autoSize = TextFieldAutoSize.LEFT;
                //}
            } else if (args['height'] != null) {
                textContainerManager.compositionHeight = args.height;
            }
            // Default the scrollheight to the visible height.
            this.scrollheight = this.height;

            // TODO [hqm 2008-01] There ought to be only call to
            // __setFormat during instantiation of an lzText. Figure
            // out how to suppress the other calls from setters.

            if (this.sizeToHeight) {
                var h = fontsize;
                //TODO [anba 20080602] is this ok for multiline? 
                if (this.multiline) h *= textContainerManager.numLines;
                h += 4;//2*2px gutter, see flash docs for flash.text.TextLineMetrics 
                this.setHeight(h);
            }

            this.__setFormat();
            addScrollEventListener();
            textContainerManager.compose();
            textContainerManager.updateContainer();
            __handleScrollEvent();
        }

        public function setBorder ( onroff:Boolean):void {
        }

        public function setEmbedFonts ( onroff:Boolean ):void {
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
            textFlow.direction = layoutFormat.direction = this.direction;
            textContainerManager.updateContainer();
        }

        /*
         *  setFontSize( Number:size )
         o Sets the size of the font in pixels 
        */
        public function setFontSize ( fsize:Number ):void {
            //Debug.info("setFontSize", fsize);
            fontsize= textFlow.fontSize = layoutFormat.fontSize = fsize;
            textContainerManager.compose();
            setText(text );
        }


        public function setFontStyle ( fstyle:String ):void {
            // FontPosture.NORMAL, for use in plain text, or FontPosture.ITALIC
            // TODO [hqm 2010-06] Need BOLD BOLDITALIC also
            layoutFormat.fontStyle = fstyle == 'normal' ? FontPosture.NORMAL : FontPosture.ITALIC;
            textFlow.fontStyle = layoutFormat.fontStyle;
            setText(text);
        }

        /* setFontName( String:name )
           o Sets the name of the font
           o Can be a comma-separated list of font names 
        */
        public function setFontName ( fname:String , prop:*=null):void{
            textFlow.fontFamily = layoutFormat.fontFamily = fname;
            setText( text );
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
            textFlow.color = layoutFormat.color = col;
            textContainerManager.updateContainer();            
        }

        /**
         * Set the html flag on this text view
         */
        function setHTML (htmlp:Boolean) :void {
            this.html = htmlp;
        }

        public function appendText( t:String ):void {
            t = t.replace(linebreakPat, '<br/>');
            var aflow:TextFlow = TextConverter.importToFlow(t,
                                                            html ? TextConverter.TEXT_FIELD_HTML_FORMAT : TextConverter.PLAIN_TEXT_FORMAT,
                                                            config);

            while (aflow.numChildren) {
                textFlow.addChild(aflow.getChildAt(0));
            }
            textFlow.flowComposer.updateAllControllers();
        }

        public function getText():String {
            return this.textContainerManager.getText();
        }

        /** setText( String:text )
            o Sets the contents to the specified text
            o Uses the widthchange callback method if multiline is false and text is not resizable
            o Uses the heightchange callback method if multiline is true
        */


        private var linebreakPat:RegExp = /\n/g; 


        /**
         * setText sets the text of the field to display
         * @param String t: the string to which to set the text
         */
        public function setText ( t:String ):void {
            this.text = t;
            t = t.replace(linebreakPat, '<br/>');
            textFlow = TextConverter.importToFlow(t,
                                                  html ? TextConverter.TEXT_FIELD_HTML_FORMAT : TextConverter.PLAIN_TEXT_FORMAT,
                                                  config);
            textFlow.addEventListener(
                FlowOperationEvent.FLOW_OPERATION_BEGIN,
                textFlow_flowOperationBeginHandler);
            textFlow.alignmentBaseline = flash.text.engine.TextBaseline.DESCENT;
            textFlow.whiteSpaceCollapse = flashx.textLayout.formats.WhiteSpaceCollapse.PRESERVE;

            textContainerManager.setTextFlow(textFlow);
            // hqm [2010-06] This call to beginInteraction creates our
            // custom EditManager or SelectionManager, which is the
            // only way I have found to get mouse events, such as
            // mouseOver, mouseOut.
            textContainerManager.beginInteraction();
            textContainerManager.updateContainer();


            if (this.resize && (this.multiline == false)) {
                // single line resizable fields adjust their width to match the text
                var w:Number = this.getTextWidth();
                if (w != this.lzwidth) {
                    this.setWidth(w);
                }
            }

            //multiline resizable fields adjust their height
            if (this.sizeToHeight) {
                var theight:Number = getLineHeight();
                if (theight == 0) { theight = fontsize; }
                this.setHeight(theight + (2 * LzTLFTextSprite.TEXTPADDING));
            }
            // Update scroll params on owner LzText
            __handleScrollEvent(null);

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

            //SET TEXTCONTAINERMANAGER OR FLOW LAYOUT PROPERTIES?? 

            layoutFormat.fontFamily = cfontname;
            layoutFormat.fontSize = this.fontsize;
            layoutFormat.color = this.textcolor;
            //            textFlow.color = this.color;
            // TODO [hqm 2010-06] need to set all text properties
            // color
            // style
            // indent
            // kerning
            // linespacing
            // 
            // Should we be keeping a flash.textLayout.formats.TextLayoutFormat object around for this?
            if (this.initted) this.owner._updateSize();
        }


        public function setMultiline ( ml:Boolean ):void {
            // TODO [hqm 2008-01] have to figure out how the Flex textfield multiline
            // maps to Laszlo model.
            multiline = (ml == true);
            if (this.initted) this.owner._updateSize();
        }


        

        /**
         * Sets the selectability (with Ibeam cursor) of the text field
         * @param Boolean isSel: true if the text may be selected by the user
         *
         */
        public function setSelectable ( isSel:Boolean ):void {
            if (this.selectable == isSel) return;
            this.selectable = isSel;
            container.mouseChildren = isSel || clickable;
            container.mouseEnabled = isSel || clickable;
            textContainerManager.editingMode = EditingMode.READ_SELECT;
            // TODO [hqm 2010-06] will this be sufficient to force the cursor to change?
            textContainerManager.updateContainer();
        }


        public function getTextWidth (force=null):Number {
            var ocw:Number = textContainerManager.compositionWidth;
            textContainerManager.compositionWidth = Infinity;
            textContainerManager.updateContainer();
            var bounds:Rectangle = textContainerManager.getContentBounds();
            textContainerManager.compositionWidth = ocw;
            textContainerManager.updateContainer();
            //            return bounds.width + ( 2 * LzTLFTextSprite.TEXTPADDING);
            return Math.round(bounds.width + 1);
            
        }

        
        public function getLineHeight ( ):Number {
            //            return textFlow.flowComposer.getLineAt(0).textHeight;
            return fontsize * LzTLFTextSprite.LEADING;
        }

        public function getTextfieldHeight (force=null) :Number {
            var bounds:Rectangle = textContainerManager.getContentBounds();
            if (multiline) {
                return Math.round( bounds.height  + ( 2 * LzTLFTextSprite.TEXTPADDING));
            } else {
                return Math.round(getLineHeight()  + ( 2 * LzTLFTextSprite.TEXTPADDING));
            }
        }


        function setHScroll(s:Number) :void {
            textContainerManager.horizontalScrollPosition = s;
        }

        function setAntiAliasType( aliasType:String ):void {
            if (this.initted) this.owner._updateSize();
        }

        function getAntiAliasType():String {
            return null;
        }

        function setGridFit( gridFit:String ):void{
            if (this.initted) this.owner._updateSize();
        }

        function getGridFit():String {
            return null;
        }

        function setSharpness( sharpness:Number ):void {
        }

        function getSharpness():Number {
            return null;
        }

        function setThickness( thickness:Number ):void{
        }

        function getThickness():Number {
            return null;
        }

        function setMaxLength(val:Number) {
            if (this.initted) this.owner._updateSize();
        }

        function setPattern (val:String) :void {
        }

        function setSelection(start:Number, end:Number) :void {
            var selmgr:ISelectionManager = textFlow.interactionManager;
            if (selmgr != null) {
                selmgr.selectRange(start, end);
                // TODO [hqm 2010-06] is this call to setFocus
                // required? Can you set selection without having the
                // focus?  How does this compare with swf8 and HTML5
                // behavior?
                selmgr.setFocus();
             
                // TODO [hqm 2010-06] we need to decide how to display the selection region, if any,
                // when the text view does not have the focus. What is the right behavior? Is it settable by user?

                // selmgr.inactiveSelectionFormat = selmgr.unfocusedSelectionFormat = selmgr.currentSelectionFormat;
            }
        }


        function select () :void {
            var selmgr:ISelectionManager = textFlow.interactionManager;
            if (selmgr != null) {
                selmgr.selectAll();
                selmgr.setFocus();
            }            
        }

        function deselect () :void {
            this.setSelection(-1, -1);
        }



        function setResize ( val:Boolean ) :void {
            this.resize = val;
            if (this.initted) this.owner._updateSize();
        }

        function setScroll ( h:Number ) :void {
            this.scroll = h;
            textContainerManager.verticalScrollPosition = h;
        }

        function getScroll() :Number {
            return Math.ceil(textContainerManager.verticalScrollPosition);
        }

        function getMaxScroll() :Number {
            // TODO [hqm 2010-06] how do we compute this? controller.getContentBounds() - controller.compositionHeight???
            var bounds:Rectangle = textContainerManager.getContentBounds();
            return Math.max (0, Math.ceil(bounds.height - textContainerManager.compositionHeight));
        }

        function getMaxScrollH() :Number {
            // TODO [hqm 2010-06] how do we compute this? controller.getContentBounds() - controller.compositionHeight???
            var bounds:Rectangle = textContainerManager.getContentBounds();
            return Math.max (0, bounds.width - textContainerManager.compositionWidth);
        }

        function getBottomScroll() :Number {
            return 0;
        }

        function lineNoToPixel (n:Number):Number {
            return (n - 1) * getLineHeight();
        }

        function pixelToLineNo (n:Number):Number {
            return Math.ceil(n / getLineHeight()) + 1;
        }

        function setYScroll (n:Number) :void {
         textContainerManager.verticalScrollPosition = scroll = pixelToLineNo((- n));
        }

        function setXScroll (n:Number) :void {
            textContainerManager.horizontalScrollPosition =  hscroll = (- n);
        }

        function setWordWrap (wrap:Boolean) :void {
            Debug.warn("LzTLFTextSprite.setWordWrap not yet implemented");
        }

        function getSelectionPosition() :int {
            // TODO [hqm 2010-06] the SelectionState operates on a TextRange
            var selection:SelectionState = textFlow.interactionManager.getSelectionState();
            return selection.absoluteStart;

        }    
        function getSelectionSize() :int {
            var selection:SelectionState = textFlow.interactionManager.getSelectionState();
            return selection.absoluteEnd - selection.absoluteEnd;
        }    

        function setTextAlign (align:String) :void {
            if (align == "left") {
                textFlow.textAlign = TextAlign.LEFT;
            } else if (align == "right") {
                textFlow.textAlign = TextAlign.RIGHT;
            } else if (align == "center") {
                textFlow.textAlign = TextAlign.CENTER;
            } else if (align == "justify") {
                textFlow.textAlign = TextAlign.JUSTIFY;
            } else {
                Debug.error("setTextAlign unknown value", align);
            }
            this.setText( this.text );
        }

        function setTextIndent (indent:Number) :void {
            Debug.warn("setTextIndent NYI");
        }

        function setLetterSpacing (spacing:Number) :void {
            Debug.warn("setLetterSpacing NYI");
        }

        function setTextDecoration (decoration:String) :void {
            Debug.warn("setTextDecoration NYI");
        }

        function __gotFocus (event:Event) :void { }

        function __onChanged (event:Event) :void { }

        function __lostFocus (event:Event) :void { }


        function get forwardsMouse () :Boolean {
            return ! (this.clickable || this.selectable);
        }

        function getNextMouseObject (e:MouseEvent) :DisplayObject {
            return null;
        }


    }#
}


