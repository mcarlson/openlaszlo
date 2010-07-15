/**
  * LzTLFTextFieldHostFormat.as
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
 */
public class LzTLFTextFieldHostFormat implements ITextLayoutFormat
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
        public function LzTLFTextFieldHostFormat(textField:LzTLFTextField)
        {
            super();
        
            this.textField = textField;
        }
    
        private var textField:LzTLFTextField;
    
        public function get alignmentBaseline():*
        {
            return undefined;
        }
    
        public function get backgroundAlpha():*
        {
            return undefined;
        }
    
        public function get backgroundColor():*
        {
            return undefined;
        }
    
        public function get baselineShift():*
        {
            return undefined;
        }
    
        public function get blockProgression():*
        {
            return undefined;
        }
    
        public function get breakOpportunity():*
        {
            return undefined;
        }
    
        public function get cffHinting():*
        {
            return undefined;
        }
    
        public function get color():*
        {
            return textField._defaultTextFormat.color;
        }
    
        public function get columnCount():*
        {
            return undefined;
        }
    
        public function get columnGap():*
        {
            return undefined;
        }
    
        public function get columnWidth():*
        {
            return undefined;
        }
    
        public function get digitCase():*
        {
            return undefined;
        }
    
        public function get digitWidth():*
        {
            return undefined;
        }
    
        public function get direction():*
        {
            return textField.direction;
        }
    
        public function get dominantBaseline():*
        {
            return undefined;
        }
    
        public function get firstBaselineOffset():*
        {
            return undefined;
        }
    
        public function get fontFamily():*
        {
            return textField._defaultTextFormat.font;
        }
    
        public function get fontLookup():*
        {
            return textField.embedFonts ?
                FontLookup.EMBEDDED_CFF :
                FontLookup.DEVICE;
        }
    
        public function get fontSize():*
        {
            return textField._defaultTextFormat.size;
        }
    
        public function get fontStyle():*
        {
            return textField._defaultTextFormat.italic ?
                FontPosture.ITALIC :
                FontPosture.NORMAL;
        }
    
        public function get fontWeight():*
        {
            return textField._defaultTextFormat.bold ?
                FontWeight.BOLD :
                FontWeight.NORMAL;
        }
    
        public function get justificationRule():*
        {
            return undefined;
        }
    
        public function get justificationStyle():*
        {
            return undefined;
        }
    
        public function get kerning():*
        {
            return textField._defaultTextFormat.kerning ?
                Kerning.AUTO :
                Kerning.OFF;
        }
    
        public function get leadingModel():*
        {
            return LeadingModel.APPROXIMATE_TEXT_FIELD;
        }
    
        public function get ligatureLevel():*
        {
            return undefined;
        }
    
        public function get lineBreak():*
        {
            return textField.wordWrap ?
                LineBreak.TO_FIT :
                LineBreak.EXPLICIT;
        }
    
        public function get lineHeight():*
        {
            return textField._defaultTextFormat.leading;
        }
    
        public function get lineThrough():*
        {
            return undefined;
        }
    
        public function get locale():*
        {
            return textField.locale;
        }
    
        public function get paddingBottom():*
        {
            return LzTLFTextField.PADDING_BOTTOM;
        }
    
        public function get paddingLeft():*
        {
            return LzTLFTextField.PADDING_LEFT;
        }
    
        public function get paddingRight():*
        {
            return LzTLFTextField.PADDING_RIGHT;
        }
    
        public function get paddingTop():*
        {
            return LzTLFTextField.PADDING_TOP;
        }
    
        public function get paragraphEndIndent():*
        {
            return textField._defaultTextFormat.rightMargin;
        }
    
        public function get paragraphSpaceAfter():*
        {
            return undefined;
        }
    
        public function get paragraphSpaceBefore():*
        {
            return undefined;
        }
    
        public function get paragraphStartIndent():*
        {
            return textField._defaultTextFormat.leftMargin;
        }
    
        public function get renderingMode():*
        {
            return undefined;
        }
    
        public function get tabStops():*
        {
            return undefined;
        }
    
        public function get textAlign():*
        {
            return textField._defaultTextFormat.align;
        }
    
        public function get textAlignLast():*
        {
            return textField._defaultTextFormat.align;
        }
    
        public function get textAlpha():*
        {
            return undefined;
        }
    
        public function get textDecoration():*
        {
            return textField._defaultTextFormat.underline ?
                TextDecoration.UNDERLINE :
                TextDecoration.NONE;
        }
    
        public function get textIndent():*
        {
            return textField._defaultTextFormat.indent;
        }
    
        public function get textJustify():*
        {
            return undefined;
        }
    
        public function get textRotation():*
        {
            return undefined;
        }
    
        public function get trackingLeft():*
        {
            return undefined;
        }
    
        public function get trackingRight():*
        {
            return textField._defaultTextFormat.letterSpacing;
        }
    
        public function get typographicCase():*
        {
            return undefined;
        }
    
        public function get verticalAlign():*
        {
            return undefined;
        }
    
        public function get whiteSpaceCollapse():*
        {
            return undefined;
        }
    }#
}
