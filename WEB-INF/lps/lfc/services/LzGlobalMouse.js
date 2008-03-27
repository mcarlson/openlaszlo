/**
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @affects lzglobalmouse
  * @access public
  * @topic LFC
  * @subtopic Services
  */

/**
  * <p>
  * The LzGlobalMouse service sends events any time the mouse button state changes, even if mouse events are locked using the <classname>LzModeManager</classname> API. The LzGlobalMouse is also useful for detecting when the mouse button goes up or down on a non-clickable view.
  * </p>
  * 
  * <example>
  * &lt;canvas height="100"&gt;
  *   &lt;simplelayout inset="10" spacing="10"/&gt;
  * 
  *   &lt;checkbox&gt;Lock mouse events
  *     &lt;handler name="onvalue"&gt;
  *       if (this.value){
  *         <em>LzModeManager.globalLockMouseEvents();</em>
  *       } 
  *     &lt;/handler&gt;
  * 
  *     &lt;handler name="onclick" reference="LzGlobalMouse" args="who"&gt;
  *       //need to use LzGlobalMouse, since we don't get clicks if we're
  *       //checked. NB that LzGlobalMouse sends its events before the view
  *       //receives the events, so we can just unlock it here, and the
  *       //checkbox can do its normal onclick handling.
  *       if (this.value &amp;&amp; who == this){
  *         <em>LzModeManager.globalUnlockMouseEvents();</em>
  *       }
  *     &lt;/handler&gt;
  *   &lt;/checkbox&gt;
  * 
  *   &lt;button&gt;click me!&lt;/button&gt;
  * 
  *   &lt;text resize="true"&gt;
  *     &lt;method name="showEvent" args="what, who"&gt;
  *       this.setText(what +": " + who);
  *     &lt;/method&gt;
  * 
  *     &lt;handler name="onmouseover" reference="<em>LzGlobalMouse</em>" args="who"&gt;
  *       this.showEvent("mouseover" , who);
  *     &lt;/handler&gt;
  *     &lt;handler name="onmouseout" reference="<em>LzGlobalMouse</em>" args="who"&gt;
  *       this.showEvent("mouseout" , who);
  *     &lt;/handler&gt;
  * 
  *     &lt;handler name="onmousedown" reference="<em>LzGlobalMouse</em>" args="who"&gt;
  *       this.showEvent("mousedown" , who);
  *     &lt;/handler&gt;
  *     &lt;handler name="onmouseup" reference="<em>LzGlobalMouse</em>" args="who"&gt;
  *       this.showEvent("mouseup" , who);
  *     &lt;/handler&gt;
  * 
  *     &lt;handler name="onclick" reference="<em>LzGlobalMouse</em>" args="who"&gt;
  *       this.showEvent("mouseclick" , who);
  *     &lt;/handler&gt;
  *   &lt;/text&gt;
  * &lt;/canvas&gt;
  * </example>
  * 
  * <p>Use the LzGlobalMouse service in conjunction with <classname>LzModeManager</classname>'s event lock.</p>
  * 
  * @shortdesc Application-wide control of and information about the mouse.
  * @see mode example
  * @devnote The global mouse service sends onmouse*** and onclick events when the mouse
  * rollover or button state changes.  The argument sent with the events is the
  * view that was clicked. If no view was clicked, the argument is null. 
  */
public class LzGlobalMouse {

    static var onmousemove = LzDeclaredEvent;
    static var onmouseup = LzDeclaredEvent;
    static var onmousedown = LzDeclaredEvent;

    static var __movecounter = 0;

/** @access private */
    static function __mouseEvent (eventname, view) {
        if (eventname == 'onmousemove') LzGlobalMouse.__movecounter++;
        if (LzGlobalMouse[eventname] && LzGlobalMouse[eventname].ready) LzGlobalMouse[eventname].sendEvent(view);
    }
}
