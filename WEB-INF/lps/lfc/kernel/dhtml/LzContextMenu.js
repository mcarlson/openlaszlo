/**
  *
  * @copyright Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @access public
  * @affects lzcontextmenu
  * @topic LFC
  * @subtopic Views
  */

/**
  * 
  * <p>
  * The <tagname>LzContextMenu</tagname> represents a context (right-click) menu.
  * </p>
  *
  * @shortdesc A contextual menu
  */
class LzContextMenu extends LzNode {

function initialize(del) {
    // set callback for "oncontextmenu" event
    this.__LZmousedowndel = new LzDelegate( this , "__hide");
    this.items = [];
    this.setDelegate(del);
}

DeclareEvent(prototype, 'onmenuopen' );

var showbuiltins = false;

/**
  * LzContextMenu.setDelegate
  * Sets the delegate which will be called when the menu is opened
  * @param LzDelegate delegate: delegate which is executed when item is selected. An
  * onmenuopen event is also sent.
  * 
  * @access public
  */
function setDelegate (delegate) {
    this._delegate = delegate;
}

/**
  * LzContextMenu.addItem
  * Adds a menu items into a menu
  * @param LzContextMenuItem item: LzContextMenuItem to install on this menu
  * @access public
  */
function addItem (item) {
    this.items.push(item);
}

/** @access private */
function __show () {
    var s = document.getElementById('lzcontextmenu')
    if (! s) {
        s = document.createElement('div');
        Lz.__setAttr(s, 'id', 'lzcontextmenu');
        Lz.__setAttr(s, 'style', 'display: none');
        document.body.appendChild(s);
    }
    if (this.onmenuopen.ready) this.onmenuopen.sendEvent(this);

    var o = '';
    for (var i = 0; i < this.items.length; i++) {
        var v = this.items[i].cmenuitem;
        if (v.visible != true) continue; 
        if (v.separatorBefore) o += '<br/>';
        if (v.enabled) {
            o += '<a onmousedown="javascript:LzMouseKernel.__showncontextmenu.__select(' + i + ');return false;"'
            o +='>' + v.caption + '</a>';
        } else {
            o += v.caption;
        }
    }
    LzMouseKernel.__showncontextmenu = this;

    s.innerHTML = o;
    s.style.left = LzMouseKernel.__x + 'px';
    s.style.top = LzMouseKernel.__y + 'px';
    s.style.display = 'block';

    this.__LZmousedowndel.register(LzGlobalMouse, 'onmousedown');

    if (this._delegate != null) this._delegate.execute(this);
}

/** @access private */
function __hide() {
    var s = document.getElementById('lzcontextmenu')
    if (! s) return;
    s.style.display = 'none';
    this.__LZmousedowndel.unregisterAll();
}

/** @access private */
function __select(i) {
    this.__hide();
    if (this.items[i]) this.items[i].__select();
}

/**
  * LzContextMenu.hideBuiltInItems
  * @access public
  */
function hideBuiltInItems () {
    this.showbuiltins = false;
}

/**
  * LzContextMenu.clearItems
  * Remove all custom items from a menu
  * @access public
  */
function clearItems () {
    this.items = [];
}

/**
  * LzContextMenu.getItems
  * Return list of custom items
  * @access public
  */
function getItems () {
    return this.items;
}

/**
  * LzContextMenu.makeMenuItem
  * create a new menu item for a LzContextMenu
  * @param String title: menu item name
  * @param function callback:  delegate to execute when item is selected
  * @access public
  */
function makeMenuItem (title, callback) {
  var item = new LzContextMenuItem(title, callback);
  return item;
}

}; // End of LzContextMenu



/**
  * <p>
  * The class <tagname>LzContextMenuItem</tagname> represents a menu item within a context menu.
  * </p>
  * 
  * @shortdesc A menu item within a context menu
  */
class LzContextMenuItem extends LzNode {

function initialize (title, del) {
    this.cmenuitem = {visible: true, enabled: true, separatorBefore: false, caption: title};
    this.setDelegate(del);
}; // End of LzContextMenuItem

DeclareEvent(prototype, 'onselect' );

/**
  * LzContextMenuItem.setDelegate
  * Sets the delegate which will be called when the menu item is selected
  * @param LzDelegate delegate: delegate which is executed when item is 
  * selected. An onselect event is also sent.
  * 
  * @access public
  */
function setDelegate (delegate) {
    this._delegate = delegate;
}

/** @access private */
function __select() {
    if (this.onselect.ready) this.onselect.sendEvent(this);
    if (this._delegate != null) {
        if (this._delegate instanceof LzDelegate) {
            this._delegate.execute(this);
        } else if (typeof this._delegate == 'function') {
            this._delegate(this);
        } else {
            if ($debug) {
                Debug.error("LzContextMenuItem.setDelegate must be passed a delegate", this, this._delegate);
            }
        }
    }
}

/**
  * LzContextMenuItem.setCaption
  * Sets the text string which is displayed for the menu item
  * @param String caption: text string to display
  * @access public
  */
function setCaption (caption) {
    this.cmenuitem.caption = caption;
}

/**
  * LzContextMenuItem.setEnabled
  * @param boolean val: if false, menu item is grayed out and will not respond to clicks
  * @access public
  */
function setEnabled (val) {
    this.cmenuitem.enabled = val;
}

/**
  * LzContextMenuItem.separatorBefore
  * Draw a horizontal separator line before this item in the menu
  * @param boolean val: sets visibility of separator line
  * @access public
  */

function setSeparatorBefore (val) {
    this.cmenuitem.separatorBefore = val;
}

/**
  * LzContextMenuItem.setVisible
  * Sets the visibility of the menu item
  * @param boolean val: sets visibility
  * @access public
  */
function setVisible (val) {
    this.cmenuitem.visible = val;
}

}; // End of LzContextMenuItem
