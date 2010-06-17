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
        import flash.events.*;
        import flash.display.Sprite;
        import flash.events.TextEvent;
        import flash.events.KeyboardEvent;
        import flash.geom.Rectangle;
        import flashx.textLayout.operations.FlowOperation;

        import flashx.textLayout.edit.SelectionManager;
        import flash.ui.Mouse;

        import flashx.textLayout.container.ContainerController;
        import flashx.textLayout.elements.TextFlow;
        import flashx.textLayout.conversion.TextConverter;
        import flashx.textLayout.conversion.ConversionType;
        import flashx.textLayout.edit.EditManager;
        import flashx.undo.UndoManager;
        import flashx.undo.IUndoManager;
        import flash.events.MouseEvent;

    }#

        var lzsprite:LzTLFInputTextSprite;

        #passthrough {
            public function LzTLFEditManager(undoManager:IUndoManager, owner:LzTLFInputTextSprite)
        {
            super(undoManager);
            this.lzsprite = owner;
        }

            override public function mouseOverHandler(event:MouseEvent):void {
                if (lzsprite.enabled || lzsprite.clickable)  {
                    super.mouseOverHandler(event);
                    lzsprite.__mouseEvent(event);
                } else {
                    Mouse.cursor = flash.ui.MouseCursor.ARROW;
                    // TODO [hqm 2010-06] use a HAND if clickable
                }
                Debug.info('mouseOverHandler', this, event);
            }


            override public function mouseOutHandler(event:MouseEvent):void {
                if (lzsprite.enabled || lzsprite.clickable)  {
                    super.mouseOutHandler(event);
                    lzsprite.__mouseEvent(event);
                }
                Debug.info("mouseOutHandler", this, event);
            }

            // process cut copy paste select-all
            override public function editHandler(event:Event):void {
                Debug.info("editHandler", this, event);            
                super.editHandler(event);
            }

            //override public function doOperation(op:FlowOperation):void {
            //                      Debug.info("doOperation (need call //super?)", this);            
            //                      op.undo();
            //}
        
            public override function  activateHandler(event:Event):void {
                if (lzsprite.enabled || lzsprite.clickable) {
                    super.activateHandler(event);
                }
                Debug.info(" activateHandler", lzsprite.enabled, event);
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
                Debug.info(" focusChangeHandler", event.type, event.target, event.relatedObject, event.currentTarget);
            }

            // Disables selectability
            public override function  focusInHandler(event:FocusEvent):void {
                Debug.info(" focusInHandler", event.type, event.target.parent.owner, event.relatedObject);
                if (lzsprite.enabled || lzsprite.clickable) {
                    lzsprite.__gotFocus(event);
                    super.focusInHandler(event);

                } else {
                    Mouse.cursor = flash.ui.MouseCursor.ARROW;
                }
            }
            public override function  focusOutHandler(event:FocusEvent):void {
                super.focusOutHandler(event);
                // TODO [hqm 2010-06] For some reason, if an inputtext already has the focus, and you mousedown on it,
                // this focusOutHandler method gets called, so if you uncomment the line below, the field will lose
                // focus. This has the effect of toggling the focus each time you click the mouse, which is bogus.

                lzsprite.__lostFocus(event);

                Debug.info(" focusOutHandler", event.type, event.target.parent.owner, event.relatedObject, event.currentTarget);
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
                Debug.info(" keyFocusChangeHandler", event.type, event.target.parent.owner, event.relatedObject);
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
                if (lzsprite.enabled || lzsprite.clickable) {
                    super.mouseDownHandler(event);
                    // This prevents the default selectAll behavior from inputtextsprite
                    lzsprite.hasFocus = true;
                    lzsprite.__mouseEvent(event);
                }
                Debug.info(" mouseDownHandler", event);
            }
            public override function  mouseMoveHandler(event:MouseEvent):void { //
                if (lzsprite.enabled || lzsprite.clickable) {
                    super.mouseMoveHandler(event);
                    lzsprite.__mouseEvent(event);
                }
                //Debug.info(" mouseMoveHandler", event);
            }
            public override function  mouseUpHandler(event:MouseEvent):void {
                if (lzsprite.enabled || lzsprite.clickable) {
                    super.mouseUpHandler(event);
                    lzsprite.__mouseEvent(event);
                }
                Debug.info(" mouseMoveHandler", event);
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

