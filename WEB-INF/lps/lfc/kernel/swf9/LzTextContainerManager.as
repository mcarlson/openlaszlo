/**
  * LzTextContainerManager.as
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

public class LzTextContainerManager extends TextContainerManager {
    #passthrough (toplevel:true) {
        import flash.display.Sprite;
        import flashx.textLayout.container.TextContainerManager;
        import flashx.textLayout.elements.IConfiguration;
        import flash.events.ContextMenuEvent;
        import flash.events.FocusEvent;
        import flash.events.MouseEvent;
        import flash.events.TextEvent;
        import flash.ui.ContextMenu;
        import flashx.undo.IUndoManager;
        import flashx.textLayout.edit.ISelectionManager;
        import flashx.textLayout.edit.IEditManager;
    }#
        
        #passthrough {

        // restrict entry of chars to anything in this regexp
        public var restrict:String = null;

        // max number of chars, an int value, 0 means unlimited
        public var maxChars:int = 0;

        public var password:Boolean = false;

        public function LzTextContainerManager(container:Sprite, configuration:IConfiguration) {
            super(container, configuration);
        }

        override public function textInputHandler(event:TextEvent):void {
            if (restrict == null || event.text.match(restrict)) {
                if ((maxChars == 0) || ((maxChars > 0) && (getText("\n").length < maxChars))) {
                    super.textInputHandler(event);
                }
            }
        }

    }#
}


