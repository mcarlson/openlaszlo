/******************************************************************************
 * LzContextMenu.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// DEFINE OBJECT: LzContextMenu


var LzContextMenu = Class( "LzContextMenu" , LzNode,
                           function (del) {
                               // set callback for Flash "onSelect" event
                               this.cm = new ContextMenu();
                               this.hideBuiltInItems();
                               this.items = [];
                               this.setDelegate(del);
                           });

// @keywords public
var LzContextMenuItem = Class( "LzContextMenuItem" , LzNode, function (title, del) {
    this.cmenuitem = new ContextMenuItem(title);
    this.setDelegate(del);
});

//-----------------------------------------------------------------------------
// LzContextMenu.setDelegate
//
// Sets the delegate which will be called when the menu is opened
// @param LzDelegate delegate: delegate which is executed when item is selected. An
// onmenuopen event is also sent.
// 
// @keywords public
//-----------------------------------------------------------------------------
LzContextMenu.prototype.setDelegate = function (delegate) {
  var __litem__ = this;
  var callback =  function (mc,cmitem) {
      if (delegate != null) delegate.execute(__litem__);
      __litem__.onmenuopen.sendEvent(__litem__);
  };
  this.cm.onSelect = callback;
}

//-----------------------------------------------------------------------------
// LzContextMenuItem.setDelegate
//
// Sets the delegate which will be called when the menu item is selected
// @param LzDelegate delegate: delegate which is executed when item is selected. An
// onselect event is also sent.
// 
// @keywords public
//-----------------------------------------------------------------------------
LzContextMenuItem.prototype.setDelegate = function (delegate) {
  var __litem__ = this;
  var callback =  function (mc,cmitem) {
      if (delegate != null) delegate.execute(__litem__);
      __litem__.onselect.sendEvent(__litem__);
  };
  this.cmenuitem.onSelect = callback;
}

//-----------------------------------------------------------------------------
// LzContextMenu.makeMenuItem
//
// create a new menu item for a LzContextMenu
// @param String title: menu item name
// @param function callback:  delegate to execute when item is selected
// @keywords public
//-----------------------------------------------------------------------------
LzContextMenu.prototype.makeMenuItem = function (title, callback) {
  var item = new LzContextMenuItem(title, callback);
  return item;
}

//-----------------------------------------------------------------------------
// LzContextMenu.setCaption
//
// Sets the text string which is displayed for the menu item
// @param String caption: text string to display
// @keywords public
//-----------------------------------------------------------------------------
LzContextMenuItem.prototype.setCaption = function (caption) {
    this.cmenuitem.caption = caption;
}

//-----------------------------------------------------------------------------
// LzContextMenu.setEnabled
//
// @param boolean val: if false, menu item is grayed out and will not respond to clicks
// @keywords public
//-----------------------------------------------------------------------------
LzContextMenuItem.prototype.setEnabled = function (val) {
    this.cmenuitem.enabled = val;
}

//-----------------------------------------------------------------------------
// LzContextMenu.separatorBefore
//
// Draw a horizontal separator line before this item in the menu
// @param boolean val: sets visibility of separator line
// @keywords public
//-----------------------------------------------------------------------------

LzContextMenuItem.prototype.setSeparatorBefore = function (val) {
    this.cmenuitem.separatorBefore = val;
}

//-----------------------------------------------------------------------------
// LzContextMenu.setVisible
//
// Sets the function which will be called when the menu item is selected
// @param boolean val: sets visibility
// @keywords public
//-----------------------------------------------------------------------------
LzContextMenuItem.prototype.setVisible = function (val) {
    this.cmenuitem.visible = val;
}

//-----------------------------------------------------------------------------
// LzContextMenu.addItem
//
// Adds a menu items into a menu
// @param LzContextMenuItem item: LzContextMenuItem to install on this menu
// @keywords public
//-----------------------------------------------------------------------------
LzContextMenu.prototype.addItem = function (item) {
    this.items.push(item);
    this.cm.customItems.push(item.cmenuitem);
}

//-----------------------------------------------------------------------------
// LzContextMenu.hideBuiltInItems
//
// Removes Flash-installed default menu items
// @keywords public
//-----------------------------------------------------------------------------
LzContextMenu.prototype.hideBuiltInItems = function () {
    this.cm.hideBuiltInItems();
}

//-----------------------------------------------------------------------------
// LzContextMenu.clearItems
//
// Remove all custom items from a menu
// @keywords public
//-----------------------------------------------------------------------------
LzContextMenu.prototype.clearItems = function () {
    this.items = [];
    this.cm.customItems = [];
}

//-----------------------------------------------------------------------------
// LzContextMenu.getItems
//
// Return list of custom items
// @keywords public
//-----------------------------------------------------------------------------
LzContextMenu.prototype.getItems = function () {
    return this.items;
}

//-----------------------------------------------------------------------------
// ContextMenu.__LZcontextMenu
//
// Returns Flash ContextMenu object
// @keywords private
//-----------------------------------------------------------------------------
LzContextMenu.prototype.__LZcontextMenu = function () {
   return this.cm;
}
