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
        import flash.ui.ContextMenu;
        import flashx.undo.IUndoManager;
        import flashx.textLayout.edit.ISelectionManager;
        import flashx.textLayout.edit.IEditManager;
    }#
        
        #passthrough {

        // Pointer back to the owner LzTLFTextField, so we can forward mouse and keyboard events, and
        // check status flags like clickable, enabled, and selectable, in order to display proper cursor
        public var textfield:LzTLFTextField;

        public function LzTextContainerManager(container:Sprite, configuration:IConfiguration, owner:LzTLFTextField) {
            super(container, configuration);
            this.textfield = owner;
        }

        /**
         *  @private
         */
        override public function drawBackgroundAndSetScrollRect(scrollX:Number, scrollY:Number):Boolean
        {
            return true;
        }

        override protected function createEditManager(undoManager:IUndoManager):IEditManager
        {
            //Debug.info("createEditManager LzTLFEditManager");
            return new LzTLFEditManager(undoManager, textfield);
        }

        override protected function createSelectionManager():ISelectionManager
        {
            //Debug.info("createSelectionManager");
            return new LzTLFSelectionManager(textfield);

        }

        override public function beginInteraction():ISelectionManager {
            //Debug.info("beginInteraction");
            return super.beginInteraction();
        }

        override public function menuSelectHandler(event:ContextMenuEvent):void
        {
            //Debug.info("menuSelectHandler", event);
            super.menuSelectHandler(event);

        }

        public function makeContextMenu():ContextMenu {
            return createContextMenu();
        }
    }#
}


