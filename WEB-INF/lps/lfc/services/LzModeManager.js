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

/**
  * <p>
  * The mode manager controls the dispatch of mouse events to the rest 
  * of the system. The mode manager keeps a stack of modal views. When a 
  * view is made <i>modal</i> (with the 
  * call <xref linkend="LzModeManager.makeModal"/>) only it and 
  * its children receive mouse events. </p>
  * 
  * <p>
  * In the example below, the window grabs the mode when it is opened and releases it when it is closed. Note that the button no longer responds to mouse examplesses after the window is made modal, but the children of the window (such as the close button and the drag bar) still do. For a more detailed example of using modes with Laslzo, see 
  * <a href="${examples}modeexample.lzx">modeexample.lzx</a> in the examples 
  * directory.
  * </p>
  * 
  * <example title="Using the mode manager to make a window behave like a modal dialog">
  * &lt;canvas height="160"&gt;
  *   &lt;button name="b1" onclick="winDia.openWindow()"&gt;Show modal dialog&lt;/button&gt;
  *   &lt;window width="200" name="winDia" closeable="true" visible="false"
  *           x="150" title="modal dialog"&gt;
  * 
  *     &lt;method name="openWindow"&gt;
  *       this.open();
  *       LzModeManager.makeModal(this);
  *     &lt;/method&gt;
  *     &lt;method name="close"&gt;
  *       LzModeManager.release(this);
  *       super.close();
  *     &lt;/method&gt;
  *   &lt;/window&gt;
  * 
  * &lt;/canvas&gt; 
  * </example>
  * 
  * @shortdesc Controls pass-through of mouse events.
  * @see mode example
  * @devnote Manages the modal states of views and also notifies views ( that have
  * registered with it ) when their focus has changed.
  */
public class LzModeManager {

      #passthrough (toplevel:true) {  

  import flash.utils.*;

}#

/** Sent when the mode changes. */
static var onmode = LzDeclaredEvent;

/** @access private */
static var __LZlastclick = null;
static var __LZlastClickTime = 0;
static var willCall = false;
static var eventsLocked = false;

static var modeArray = new Array();

static function toString (){
    return "mode manager";
}


/**
  * Pushes the view onto the stack of modal views
  * @param LzView view: The view intending to have modal iteraction
  */
static function makeModal ( view ) {
    modeArray.push( view );
    if (onmode.ready) onmode.sendEvent( view );
    var f = LzFocus.getFocus();
    if ( f && ! f.childOf( view ) ){
        LzFocus.clearFocus();
    }
}

/**
  * Removes the view (and all the views below it) from the stack of modal views
  * @param LzView view: The view to be released of modal interaction
  */
static function release ( view ) {
    //releases all views past this one in the modelist as well
    for ( var i = modeArray.length-1 ; i >=0 ; i-- ){
        if ( modeArray[ i ] == view ){
            modeArray.splice( i , modeArray.length - i );
            var newmode = modeArray[ i - 1 ];
            if (onmode.ready) onmode.sendEvent( newmode || null );
            var f = LzFocus.getFocus();
            if ( newmode && f && ! f.childOf( newmode ) ){
                LzFocus.clearFocus();
            }
            return;
        }
    }
}

/**
  * Clears all modal views from the stack
  */
static function releaseAll ( ) {
    // reset array to remove all views
    modeArray = new Array();
    if (onmode.ready) onmode.sendEvent( null );
}

/**
  * Check to see if the current event should be passed to its intended view
  * @access private
  * 
  * @param LzView view: the view that received the event
  * @param String eventStr: the event string
  */
static function handleMouseEvent ( view, eventStr ) {
    //Debug.warn("%w, %w", view , eventStr);
    if (eventStr == "onmouseup") LzTrack.__LZmouseup();

    var dosend = true;
    var isinputtext = false;

    // TODO [hqm 2008-01] what is this?
    /*
      if (view == null ) {  // check if the mouse event is in a inputtext
        view = __findInputtextSelection(); 
    }
    */

    LzGlobalMouse.__mouseEvent(eventStr, view);

    if ( eventsLocked == true ){
        return;
    }

    var i = modeArray.length-1;
    while( dosend && i >= 0 ){
        var mView = modeArray[ i-- ];
        // exclude the debugger from the mode
        if ($debug) {
             if (view && Debug && view.childOf(Debug))
                break;
        }

        if (view && view.childOf( mView ) ){
            break;
        } else if (mView) {
            dosend = mView.passModeEvent ? mView.passModeEvent( eventStr , view ) : null;
        }
    }

    if ( dosend ){
        //check for double-click
        if ( eventStr == "onclick" ){
            if ( __LZlastclick == view  &&
               ('ondblclick' in view && view.ondblclick) && 
               (view.ondblclick.getDelegateCount() > 0) &&
                (getTimer() - __LZlastClickTime)< view.DOUBLE_CLICK_TIME ){
                    //this is a double-click
                    eventStr = "ondblclick";
                    __LZlastclick = null;
            } else {
                __LZlastclick = view;
                __LZlastClickTime = getTimer();
            }
        }

        //Debug.warn("sending %w, %w", view , eventStr);

        if (view) view.mouseevent( eventStr );
        if ( eventStr == "onmousedown" ){
            LzFocus.__LZcheckFocusChange( view );
        }
    } 


    //this on matters for onmouseup and onmousedown, but it's easier to just
    //set it regardless
    // TODO [hqm 2008-01] I don't know what this is for... 
    //   this[ "haveGlobal" + eventStr ] = false;

}

/**
  * return true if the given view is allowed to receive the focus
  * any view that is a child of the view that has the mode may be focused
  * other views may not
  * @access private
  */
static function __LZallowFocus ( view ) {
    var len = modeArray.length;
    return len == 0 || view.childOf ( modeArray[len-1] );
}

/**
  * Prevents all mouse events from firing.
  * */
static function globalLockMouseEvents (){
    eventsLocked = true;
}

/**
  * Restore normal mouse event firing.
  * */
static function globalUnlockMouseEvents (){
    eventsLocked = false;
}

/**
  * Tests whether the given view is in the modelist.
  * @param LzView view: The mode to be tested to see if it is in the modelist
  * @return Boolean: true if the view is in the modelist
  * 
  */
static function hasMode ( view ){
    for ( var i = modeArray.length -1 ; i >= 0; i-- ){
        if ( view == modeArray[ i ] ){
            return true;
        }
    }
    return false;
}

/**
  * @access private
  */
static function getModalView ( ){
    return modeArray[ modeArray.length - 1] || null;
}
}
