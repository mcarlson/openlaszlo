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

public class LzTLFSelectionManager extends SelectionManager {

    #passthrough (toplevel:true) {
        import flash.display.Sprite;
        import flash.events.*;
        import flash.geom.Rectangle;
        import flashx.textLayout.operations.FlowOperation;
        import flashx.textLayout.edit.SelectionManager;
        import flashx.undo.UndoManager;
        import flashx.undo.IUndoManager;
        import flash.ui.Mouse;
    }#

        var lzsprite:LzTLFTextSprite;

        #passthrough {
            public function LzTLFSelectionManager(owner:LzTLFTextSprite)
            {
                super();
                this.lzsprite = owner;
            }


            override public function mouseOverHandler(event:MouseEvent):void {
                if (lzsprite.selectable || lzsprite.clickable)  {
                    super.mouseOverHandler(event);
                    lzsprite.__mouseEvent(event);
                } else {
                    Mouse.cursor = flash.ui.MouseCursor.ARROW;
                    // TODO [hqm 2010-06] use a HAND if clickable
                }
                Debug.info('mouseOverHandler', this, event);
            }


            override public function mouseOutHandler(event:MouseEvent):void {
                if (lzsprite.selectable || lzsprite.clickable)  {
                    super.mouseOutHandler(event);
                    lzsprite.__mouseEvent(event);
                }
                Debug.info("mouseOutHandler", this, event);
            }

            // process cut copy paste select-all
            override public function editHandler(event:Event):void {
                Debug.info("editHandler", this, event);            
                if (lzsprite.selectable || lzsprite.clickable)  {
                    super.editHandler(event);
                    lzsprite.__mouseEvent(event as MouseEvent);
                }
            }

            //override public function doOperation(op:FlowOperation):void {
            //                      Debug.info("doOperation (need call //super?)", this);            
            //                      op.undo();
            //}
        
            public override function  activateHandler(event:Event):void {
                if (lzsprite.selectable || lzsprite.clickable) {
                    super.activateHandler(event);
                }
                Debug.info(" activateHandler", lzsprite.selectable, event);
            }

            public override function  deactivateHandler(event:Event):void {
                super.deactivateHandler(event);
                Debug.info(" deactivateHandler", event);
            }

            public override function  doOperation(op:FlowOperation):void {
                super.doOperation(op);
                Debug.info(" doOperation", op);
            }

            public override function  focusChangeHandler(event:FocusEvent):void {
                super.focusChangeHandler(event);
                Debug.info(" focusChangeHandler", event);
            }

            // Disables selectability
            public override function  focusInHandler(event:FocusEvent):void {
                Debug.info(" focusInHandler", event);
                if (lzsprite.selectable || lzsprite.clickable) {
                    super.focusInHandler(event);
                    lzsprite. __gotFocus(event);
                } else {
                    Mouse.cursor = flash.ui.MouseCursor.ARROW;
                }
            }
            public override function  focusOutHandler(event:FocusEvent):void {
                super.focusOutHandler(event);
                lzsprite.__lostFocus(event);
                Debug.info(" focusOutHandler", event);
            }
            public override function  imeStartCompositionHandler(event:IMEEvent):void {
                super.imeStartCompositionHandler(event);
                Debug.info(" imeStartCompositionHandler", event);
            }
            public override function  keyDownHandler(event:KeyboardEvent):void {
                super.keyDownHandler(event);
                LzKeyboardKernel.__keyboardEvent(event);
                Debug.info(" keyDownHandler", event);
            }
            public override function  keyFocusChangeHandler(event:FocusEvent):void {
                super.keyFocusChangeHandler(event);
                Debug.info(" keyFocusChangeHandler", event);
            }
            public override function  keyUpHandler(event:KeyboardEvent):void {
                super.keyUpHandler(event);
                LzKeyboardKernel.__keyboardEvent(event);
                Debug.info(" keyUpHandler", event);
            }
            public override function  menuSelectHandler(event:ContextMenuEvent):void {
                super.menuSelectHandler(event);
                Debug.info(" menuSelectHandler", event);
            }

            public override function  mouseDoubleClickHandler(event:MouseEvent):void {
                super.mouseDoubleClickHandler(event);
                lzsprite.handleMouse_DOUBLE_CLICK(event);
                Debug.info(" mouseDoubleClickHandler", event);
            }
            public override function  mouseDownHandler(event:MouseEvent):void {
                if (lzsprite.selectable || lzsprite.clickable) {
                    super.mouseDownHandler(event);
                    lzsprite.__mouseEvent(event);
                }
                Debug.info(" mouseDownHandler", event);
            }
            public override function  mouseMoveHandler(event:MouseEvent):void { //
                if (lzsprite.selectable || lzsprite.clickable) {
                    super.mouseMoveHandler(event);
                    lzsprite.__mouseEvent(event);
                }
                //Debug.info(" mouseMoveHandler", event);
            }
            public override function  mouseUpHandler(event:MouseEvent):void {
                if (lzsprite.selectable || lzsprite.clickable) {
                    super.mouseUpHandler(event);
                    lzsprite.__mouseEvent(event);
                }
            }

            public override function  mouseWheelHandler(event:MouseEvent):void {
                super.mouseWheelHandler(event);
                Debug.info(" mouseWheelHandler", event);
            }

            public override function  textInputHandler(event:flash.events.TextEvent):void {
                super.textInputHandler(event);
                lzsprite.__onChanged(event);
                Debug.info(" textInputHandler", event);
            }


        }#
}

