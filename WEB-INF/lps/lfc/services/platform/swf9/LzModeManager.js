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
    /**
     * Finds the view for if the mouse event occurred in an input text field 
     * TODO: implement
     * @access private
     */
    override function __findInputtextSelection() {
        return null;
    }
}

var LzModeManager:LzModeManagerClass = new LzModeManagerClass();
// Register for callbacks from LFCApplication
// LzMouseKernel.setCallback(LzModeManager, 'rawMouseEvent');
