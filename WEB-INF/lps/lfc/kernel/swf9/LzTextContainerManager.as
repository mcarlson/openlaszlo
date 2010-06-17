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

    var lzsprite:LzTLFTextSprite;

    #passthrough {
        public function LzTextContainerManager(container:Sprite, configuration:IConfiguration, owner:LzTLFTextSprite) {
                super(container, configuration);
                this.lzsprite = owner;
            }


            override protected function createEditManager(undoManager:IUndoManager):IEditManager
            {
                Debug.info("createEditManager");
                return new LzTLFEditManager(undoManager, lzsprite as LzTLFInputTextSprite);
            }

            override protected function createSelectionManager():ISelectionManager
            {
                return new LzTLFSelectionManager(lzsprite);

            }

            override public function beginInteraction():ISelectionManager {
                Debug.info("beginInteraction");
                return super.beginInteraction();
            }

            override public function menuSelectHandler(event:ContextMenuEvent):void
            {
                Debug.info("menuSelectHandler", event);
                super.menuSelectHandler(event);

            }

            public function makeContextMenu():ContextMenu {
                return createContextMenu();
            }

    }#
}



