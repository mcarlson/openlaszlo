/**
  * LzMouseKernel.as
  *
  * @copyright Copyright 2001-2010 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic AS2
  */

// Receives mouse events from the runtime
// Sent from org/openlaszlo/compiler/SWFFile.java
var LzMouseKernel = {
    // Receives events from sprites
    handleMouseEvent: function(view, eventname) {
        if (LzSprite.quirks.ignorespuriousff36events) {
            if (eventname == 'onclick') {
                this.__ignoreoutover = true;
            } else if (this.__ignoreoutover) {
                if (eventname == 'onmouseout') {
                    // skip event
                    return;
                } else if (eventname == 'onmouseover') {
                    // allow events to propagate again
                    this.__ignoreoutover = false;
                    return;
                }
            }
        } 

        if (LzMouseKernel.__callback) LzMouseKernel.__scope[LzMouseKernel.__callback](eventname, view);
        //Debug.write('LzMouseKernel event', eventname);
    }
    ,__ignoreoutover: false
    ,__callback: null
    ,__scope: null
    ,__listeneradded: false 
    ,setCallback: function (scope, funcname) {
        this.__scope = scope;
        this.__callback = funcname;
        if (this.__listeneradded == false) {
            this.__clstDel = new LzDelegate( this , "__checkClickStream" )
            Mouse.addListener(LzMouseKernel.__mouselistener);
            this.__listeneradded = true;
        }
    }    

    /**
    * Shows or hides the hand cursor for all clickable views.
    * @param Boolean show: true shows the hand cursor for buttons, false hides it
    */
    ,showHandCursor: function (show) {
        Button.prototype.useHandCursor = show;
    }

    /**
    * Sets the cursor to a resource
    * @param String what: The resource to use as the cursor. 
    */
    ,setCursorGlobal: function ( what ){
        if ( LzMouseKernel.__amLocked ) { return; }
        var cr = _root.attachMovie (what , "cCursor" , 5555 );
        if ($debug) {
            if (typeof(cr) != 'movieclip') {
                Debug.warn('Could not find cursor-resource', what);
            }
        }
        // @devnote Intentionally not used local variable cr below:
        // if attachMovie failed, the previous movieclip remains intact
        _root.cCursor._x = _root._xmouse;
        _root.cCursor._y = _root._ymouse;
        _root.cCursor.startDrag( true );
        Mouse.hide();
    }

    /**
    * This function restores the default cursor if there is no locked cursor on
    * the screen.
    * 
    * @access private
    */
    ,restoreCursor: function ( ){
        if ( LzMouseKernel.__amLocked ) { return; }
        // SWF-specific
        _root.cCursor.stopDrag();
        _root.cCursor.removeMovieClip (  );
        Mouse.show();
    }

    /**
    * Prevents the cursor from being changed until unlock is called.
    * 
    */
    ,lock: function (){
        LzMouseKernel.__amLocked = true;
    }

    /**
    * Restores the default cursor.
    * 
    */
    ,unlock: function (){
        LzMouseKernel.__amLocked = false;
        LzMouseKernel.restoreCursor(); 
    }
    ,__mouselistener: {
        onMouseMove: function () { 
            LzMouseKernel.handleMouseEvent(null, 'onmousemove');
        }
        ,onMouseWheel: function(d) {
            lz.Keys.__mousewheelEvent(d);
        }
    }

    // Mouse event processing code, formerly from lz.ModeManager.as
    ,__clickStream: []
    ,__clstDict: { onmouseup : 1 , onmousedown: 2 }
    ,__WAIT_FOR_CLICK: 4

    /**
    * Called for onmouseup/down by clickable sprites
    * @access private
    */
    ,handleMouseButton: function( view, eventname){
        //Debug.write('handleMouseButton', view, eventname);
        this.__clickStream.push( this.__clstDict[ eventname ] + 2);
        this.handleMouseEvent( view , eventname );
        this.__callNext();
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
    ,rawMouseEvent: function( eventname ) {
        // If applicable, update the current sprite's insertion position/size.
        var focus = Selection.getFocus();
        if (focus) {
            var textclip = eval(focus);  // path -> object
            if (textclip && textclip.__cacheSelection) {
                textclip.__cacheSelection();
            }
        }

        //Debug.warn("rawmouseevent %w", eventname);

        //not guaranteed

        this.__clickStream.push( this.__clstDict[ eventname ] );
        //call the cleanup delegate


        this.__callNext();
    }

    /**
    * Cleanup method for raw mouseup
    * @access private
    */
    ,__checkClickStream: function(ignore){
        this.willCall = false;

        //clickstream that looks like this
        //1 , 3 , 2, 0 , ....
        //raw mup , view mup , raw down , frame -- ok to check next for pair
        //but then stop.
        var i = 0;
        var cl = this.__clickStream;
        var cllen = this.__clickStream.length;

        while( i < cllen -1 ){

            if (  !( cl[i] == 1 || cl[i]==2 )){
                //if we encounter a button mouse event here, it means we sent
                //a global mouse event too soon
                if ($debug) {
                    if ( cl[i] != 0 ) {
                        Debug.warn( "Sent extra global mouse event" );
                    }
                }

                //advance pointer
                i++;

                continue;
            }

            var nextp = i + 1;
            var maxnext = this.__WAIT_FOR_CLICK + i;

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
            this.__clickStream.push( 0 );
            this.__callNext();
        }

    }

    /**
    * @access private
    */
    ,__callNext: function(){
        if ( !this.willCall ){
            this.willCall = true;
            lz.Idle.callOnIdle( this.__clstDel );
        }
    }
    ,onMouseDown: function () { LzMouseKernel.rawMouseEvent('onmousedown'); }
    ,onMouseUp: function () { LzMouseKernel.rawMouseEvent('onmouseup'); }


}

Mouse.addListener(LzMouseKernel);
