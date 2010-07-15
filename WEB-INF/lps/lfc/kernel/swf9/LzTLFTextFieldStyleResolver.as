/**
  * LzTLFTextFieldStyleResolver.as
  *
  * @copyright Copyright 2007-2010 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic swf9
  * @author Henry Minsky &lt;hminsky@laszlosystems.com&gt;
  */



/**
 *  @private
 *  To attach TextField styling via a style sheet to a TextFlow.
 */

public class LzTLFTextFieldStyleResolver implements IFormatResolver
{
    
    #passthrough (toplevel:true) {
        import flash.display.Sprite;
        import flash.text.engine.FontLookup;
        import flash.text.engine.FontPosture;
        import flash.text.engine.FontWeight;
        import flash.text.StyleSheet;
        import flash.text.engine.Kerning;
        import flash.events.ContextMenuEvent;
        import flash.ui.ContextMenu;
        import flashx.textLayout.container.TextContainerManager;
        import flashx.textLayout.edit.IEditManager;
        import flashx.textLayout.edit.ISelectionManager;
        import flashx.textLayout.elements.FlowElement;
        import flashx.textLayout.elements.IConfiguration;
        import flashx.textLayout.elements.IFormatResolver;
        import flashx.textLayout.elements.LinkElement;
        import flashx.textLayout.elements.ParagraphElement;
        import flashx.textLayout.elements.SpanElement;
        import flashx.textLayout.elements.TextFlow;
        import flashx.textLayout.formats.ITextLayoutFormat;
        import flashx.textLayout.formats.LeadingModel;
        import flashx.textLayout.formats.LineBreak;
        import flashx.textLayout.formats.TextDecoration;
        import flashx.textLayout.formats.TextLayoutFormatValueHolder;
        import flashx.undo.IUndoManager;

        import LzTLFTextField;
        import mx.core.mx_internal;
    }#

        #passthrough {


        //--------------------------------------------------------------------------
        //
        //  Class variables
        //
        //--------------------------------------------------------------------------
    
        /**
         *  Map of TextField StyleSheet CSS properties to their equivalent
         *  TLF properties. This is only the styles which have different names.
         */
        private static const textFieldToTLFStyleMap:Object =
            {
                "leading": "lineHeight",    
                "letterSpacing": "trackingRight",
                "marginLeft": "paragraphStartIndent",
                "marginRight": "paragraphEndIndent"
            };
    
        //--------------------------------------------------------------------------
        //
        //  Constructor
        //
        //--------------------------------------------------------------------------
    
        public function LzTLFTextFieldStyleResolver(styleSheet:StyleSheet):void
        {
            _styleSheet = styleSheet;
        }
    
        //--------------------------------------------------------------------------
        //
        //  Variables
        //
        //--------------------------------------------------------------------------
    
        /**
         *  The TextField style sheet that will be used to create the TLF style
         *  objects.
         */
        private var _styleSheet:StyleSheet;
    
        //--------------------------------------------------------------------------
        //
        //  IFormatResolver
        //
        //--------------------------------------------------------------------------
    
        /**
         *  Given a FlowElement or ContainerController object, return any format 
         *  settings for it.
         *
         *  Return format settings for the specified object.
         */
        public function resolveFormat(elem:Object):ITextLayoutFormat
        {
            var attr:TextLayoutFormatValueHolder = null;
        
            // ContainerController will inherit via the container so it is not
            // handled here.  Map HTML <body> to TextFlow, HTML <p> to
            // ParagraphElement and HTML <span> to SpanElement.
            if (elem is FlowElement)
            {
                if (elem is TextFlow)
                    attr = addStyleAttributes(attr, "body");               
                else if (elem is ParagraphElement)
                    attr = addStyleAttributes(attr, "p");
                else if (elem is SpanElement)
                    attr = addStyleAttributes(attr, "span");
            
                // Apply class selector over any format from above.
                if (elem.styleName != null)
                    attr = addStyleAttributes(attr, "." + elem.styleName);
            }        
        
            return attr;
        }
    
        /**
         *  Given a FlowElement or ContainerController object and the name of a 
         *  format property, return the format value or undefined if 
         *  the value is not found.
         *
         *  Return the value of the specified format for the specified object.
         */
        public function resolveUserFormat(elem:Object,userStyle:String):*
        {
            var flowElem:FlowElement = elem as FlowElement;
            var attr:TextLayoutFormatValueHolder;
        
            // support non-tlf styles
            if (flowElem)
            {
                if (flowElem.styleName)
                {
                    attr = addStyleAttributes(null, "." + flowElem.styleName);
                }
                else if (flowElem is LinkElement)
                {
                    if (userStyle == "linkNormalFormat")
                        attr = addStyleAttributes(null, "a:link");
                    
                    else if (userStyle == "linkHoverFormat")
                        attr = addStyleAttributes(null, "a:hover");
                    
                    else if (userStyle == "linkActiveFormat")
                        attr = addStyleAttributes(null, "a:active");
                }
                else
                {
                    attr = addStyleAttributes(null, userStyle);
                }            
            }
        
            return attr != null ? attr : undefined;
        }
    
        /** 
         * Invalidates any cached formatting information for a TextFlow so that 
         * formatting must be recomputed.
         */
        public function invalidateAll(tf:TextFlow):void
        {
        }
    
        /**
         * Invalidates cached formatting information on this element because, for 
         * example, the parent changed, or the id or the styleName changed.
         */
        public function invalidate(target:Object):void
        {
        }
    
        /** 
         *  Return the format resolver for the copy of the TextFlow.
         */
        public function getResolverForNewFlow(oldFlow:TextFlow,newFlow:TextFlow):IFormatResolver
        { 
            return this; 
        }
    
        //--------------------------------------------------------------------------
        //
        //  Methods
        //
        //--------------------------------------------------------------------------
    
        /**
         *  Look up the styleSelector in the TextField style sheet and build the
         *  object of corresponding TLF styles and values.  Return null if the
         *  styleSelector is not found in the style sheet.
         */
        private function addStyleAttributes(
            attr:TextLayoutFormatValueHolder, 
            styleSelector:String):TextLayoutFormatValueHolder
        {
            var foundStyle:Object = _styleSheet.getStyle(styleSelector);
            if (foundStyle != null)
            {       
                for (var p:* in foundStyle)
                {
                    var propStyle:Object = foundStyle[p];
                
                    if (attr == null)
                        attr = new TextLayoutFormatValueHolder();
                
                    if (textFieldToTLFStyleMap[p])
                    {
                        // different name, same values
                        var tlfProp:String = textFieldToTLFStyleMap[p];
                        attr[tlfProp] = propStyle;
                    }
                    else if (p == "color")
                    {
                        // convert from "#000000" to "0x000000" format
                        var color:String = String(propStyle);
                        if (color && color.charAt(0) == "#")
                            attr.color = "0x"+color.substring(1);
                    }
                    else if (p == "display")
                    {
                        // TODO(cframpto): if we decide to support this.
                    }
                    else if (p == "kerning")
                    {
                        // convert from true/false to on/off
                        if (Boolean(propStyle))
                            attr.kerning = flash.text.engine.Kerning.ON;
                        else                
                            attr.kerning = flash.text.engine.Kerning.OFF;
                    }
                    else
                    {
                        // same name, same values
                        attr[p] = propStyle;
                    }
                }
            }    
        
            return attr;
        }
    }#
}
