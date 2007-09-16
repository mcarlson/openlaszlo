/**
  *
  * @copyright Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @affects lzmodemanager
  * @access public
  * @topic LFC
  * @subtopic Services
  */

LzModeManager.rawMouseEvent = function(me) {
    this.handleMouseEvent( null , me );
}

LzModeManager.handleMouseButton = function(view, eventName) {
    this.handleMouseEvent( view , eventName );
}
    
/**
  * Finds the view for if the mouse event occurred in an input text field 
  * TODO: implement
  * @access private
  */
LzModeManager.__findInputtextSelection = function () {
    if (LzInputTextSprite.prototype.__focusedSprite 
        && LzInputTextSprite.prototype.__focusedSprite.owner) {
        return LzInputTextSprite.prototype.__focusedSprite.owner;
    }
}
