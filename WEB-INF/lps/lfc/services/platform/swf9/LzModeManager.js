/**
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @affects lzmodemanager
  * @access public
  * @topic LFC
  * @subtopic Services
  */

public class LzModeManagerClass extends LzModeManagerBase {

    static function rawMouseEvent (me) {
        this.handleMouseEvent( null , me );
    }

    static function handleMouseButton (view, eventName) {
        this.handleMouseEvent( view , eventName );
    }
    
    /**
     * Finds the view for if the mouse event occurred in an input text field 
     * TODO: implement
     * @access private
     */
    override static function __findInputtextSelection  () {
        if (LzInputTextSprite.__focusedSprite 
            && LzInputTextSprite.__focusedSprite.owner) {
            return LzInputTextSprite.__focusedSprite.owner;
        }
    }
}

var LzModeManager:LzModeManagerClass = new LzModeManagerClass();
// Register for callbacks from the kernel
LzMouseKernel.setCallback(LzModeManager, 'rawMouseEvent');
