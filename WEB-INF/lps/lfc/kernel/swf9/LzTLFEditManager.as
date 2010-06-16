/**
  * LzTLFEditManager.as
  *
  * @copyright Copyright 2007-2010 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic swf9
  * @author Henry Minsky &lt;hminsky@laszlosystems.com&gt;
  */


/**
    Custom EditManager for LzTLFSprite
 */

public class LzTLFEditManager extends EditManager {

    #passthrough (toplevel:true) {
        import flash.display.Sprite;
        import flash.events.TextEvent;
        import flash.events.KeyboardEvent;
        import flash.geom.Rectangle;

        import flashx.textLayout.container.ContainerController;
        import flashx.textLayout.elements.TextFlow;
        import flashx.textLayout.conversion.TextConverter;
        import flashx.textLayout.conversion.ConversionType;
        import flashx.textLayout.edit.EditManager;
        import flashx.undo.UndoManager;
        import flashx.undo.IUndoManager;
        import flash.events.MouseEvent;

    }#

        var lzsprite:LzTLFTextSprite;

        #passthrough {
            public function LzTLFEditManager(undoManager:IUndoManager, owner:LzTLFTextSprite)
        {
            super(undoManager);
            this.lzsprite = owner;
        }

        override public function mouseOverHandler(event:MouseEvent):void {
            super.mouseOverHandler(event);
            Debug.info("LzTLFEditManager mouseOverHandler");
        }


        override public function mouseOutHandler(event:MouseEvent):void {
            super.mouseOutHandler(event);
            Debug.info("LzTLFEditManager mouseOutHandler");
        }

        override public function textInputHandler(event:TextEvent):void
        {    
            super.textInputHandler(event);
            Debug.info("LzTLFEditManager textInputHandler", event);

        }
    }#
}

