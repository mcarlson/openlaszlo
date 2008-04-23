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

/** */
public class LzModeManagerClass extends LzModeManagerBase {

    function LzModeManagerClass() {
        this.clickStream = new Array();
        this.clstDel = new LzDelegate( this , "checkClickStream" );
        this.clstDict ={ onmouseup : 1 , onmousedown: 2 };
    var WAIT_FOR_CLICK = 4;
    }

    /**
    * Called by clickable movieclip
    * @access private
    */
    function handleMouseButton ( view , eventStr){
        //Debug.write('handleMouseButton', view, eventStr);
        this.clickStream.push( this.clstDict[ eventStr ] + 2);

        this.handleMouseEvent( view , eventStr );
        this.callNext();
    }

    /**
    * Called when any mousedown or mouseup event is received by canvas to try and 
    * match up mouse events with non-clickable view.  Not reliable - could happen 
    * after any number of frames.
    * 
    * A Timer is then activated to call
    * the cleanup method in the next frame
    * 
    * @access private
    */
    function rawMouseEvent ( eName ) {
        // If applicable, update the current sprite's insertion position/size.
        var focus = Selection.getFocus();
        if (focus) {
            var textclip = eval(focus);  // path -> object
            if (textclip && textclip.__cacheSelection) {
                textclip.__cacheSelection();
            }
        }

        //Debug.warn("rawmouseevent %w", eName);

        //not guaranteed

        this.clickStream.push( this.clstDict[ eName ] );
        //call the cleanup delegate


        this.callNext();
    }

    /**
    * Cleanup method for raw mouseup
    * @access private
    */
    function checkClickStream (){
        this.willCall = false;

        //clickstream that looks like this
        //1 , 3 , 2, 0 , ....
        //raw mup , view mup , raw down , frame -- ok to check next for pair
        //but then stop.
        var i = 0;
        var cl = this.clickStream;
        var cllen = this.clickStream.length;

        while( i < cllen -1 ){

            if (  !( cl[i] == 1 || cl[i]==2 )){
                //if we encounter a button mouse event here, it means we sent
                //a global mouse event too soon
                if ( cl[i] != 0 ) {
                    Debug.warn( "Sent extra global mouse event" );
                }

                //advance pointer
                i++;

                continue;
            }

            var nextp = i + 1;
            var maxnext = this.WAIT_FOR_CLICK + i;

            while ( cl[ nextp ] ==  0 && nextp  < maxnext ){
                nextp++;
            }

            if ( nextp >= cllen ){
                //it's not here, so wait till next frame
                break;
            }

            if ( cl[ i ] == cl[ nextp ] - 2 ){
                //this is a pair -- simple case. just advance pointer
                i = nextp+1;
            } else {
                //this is unpaired
                if ( cl[i] == 1 ){
                    var me= "onmouseup";
                }else{
                    var me="onmousedown";
                }
                this.handleMouseEvent( null , me );
                i++;
            }
        }

        while( cl[ i ] == 0 ){ i++; }

        cl.splice( 0 , i ); //remove up to i

        if ( cl.length > 0 ){
            this.clickStream.push( 0 );
            this.callNext();
        }

    }

    /**
    * @access private
    */
    function callNext (){
        if ( !this.willCall ){
            this.willCall = true;
            LzIdle.callOnIdle( this.clstDel );
        }
    }

    /**
    * Finds the view for if the mouse event occurred in an input text field 
    * @access private
    */
    override function __findInputtextSelection () {
        var ss = Selection.getFocus();
        if ( ss != null ){
            var focusview = eval(ss + '.__lzview');
            //Debug.warn("Selection.getFocus: %w, %w, %w", focusview, ss);
            if ( focusview != undefined ) return focusview;
        } 
    }
}

var LzModeManager:LzModeManagerClass = new LzModeManagerClass();
// Register for callbacks from the kernel
LzMouseKernel.setCallback(LzModeManager, 'rawMouseEvent');
