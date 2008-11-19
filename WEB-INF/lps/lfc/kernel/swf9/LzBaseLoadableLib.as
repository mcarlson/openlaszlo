/**
  * LzBaseLoadableLib.as
  *
  * @copyright Copyright 2007, 2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic swf9
  * @author Henry Minsky &lt;hminsky@laszlosystems.com&gt;
  */

public class LzBaseLoadableLib extends Sprite {

    // This serves as the superclass of an <import> (runtime loadable) library
    #passthrough (toplevel:true) {  
    import flash.display.*;
    import flash.events.*;
    import flash.utils.*;
    import flash.text.*;
    import flash.system.*;
    import flash.net.*;
    import flash.ui.*;
    import flash.text.Font;
    }#

    public function LzBaseLoadableLib () { }

    public function runToplevelDefinitions() {
        // Overridden by method in code emitted by SWF9 script compiler
    }

    // A link object is passed in with pointers to main app globals
    //library.exportClassDefs({lz: lz, canvas: canvas,
    //    LzResourceLibrary: LzResourceLibrary
    //    });
    public function exportClassDefs(link:Object) {
        this.runToplevelDefinitions();
    }

}




