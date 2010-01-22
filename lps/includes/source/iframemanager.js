/* X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2010 Laszlo Systems, Inc.  All Rights Reserved.          *
* Use is subject to license terms.                                        *
* X_LZ_COPYRIGHT_END ******************************************************/
lz.embed.iframemanager = {
    __counter: 0
    ,__frames: {}
    ,__namebyid: {}
    ,__loading: {}
    ,__callqueue: {}
    ,__calljsqueue: {}
    ,__sendmouseevents: {}
    ,__hidenativecontextmenu: {}
    ,__selectionbookmarks: {}
    ,create: function(owner, name, scrollbars, appendto, defaultz, canvasref) {
        //console.log(owner + ', ' + name + ', ' + scrollbars + ', ' + appendto + ', ' + defaultz)
        var id = '__lz' + lz.embed.iframemanager.__counter++;
        var src = 'javascript:""';
        var onload = 'lz.embed.iframemanager.__gotload("' + id + '")';

        if (name == null || name == 'null' || name == '') name = id;
        //console.log('using name', name);
        lz.embed.iframemanager.__namebyid[id] = name;

        if (appendto == null || appendto == "undefined") {
            appendto = document.body;
        }

        //alert(owner + ', ' + name + ', ' + appendto)
        if (document.all) {
            // IE
            var html = "<iframe name='" + name + "' id='" + id + "' src='" + src + "' onload='" + onload + "' frameBorder='0'";
            if (scrollbars != true) html += " scrolling='no'";
            html += "></iframe>";
            //alert(html);
            var div = document.createElement('div');
            lz.embed.__setAttr(div, 'id', id + 'Container');
            appendto.appendChild(div);
            div.innerHTML = html
            var i = document.getElementById(id);
        } else {
            var i = document.createElement('iframe');
            lz.embed.__setAttr(i, 'name', name);
            lz.embed.__setAttr(i, 'src', src);
            lz.embed.__setAttr(i, 'id', id);
            lz.embed.__setAttr(i, 'onload', onload);
            if (scrollbars != true) lz.embed.__setAttr(i, 'scrolling', 'no');

            this.appendTo(i, appendto);
        }

        if (i) {
            this.__finishCreate(id, owner, name, scrollbars, appendto, defaultz, canvasref);
        } else {
            // init call queue and set timeout to finish startup after the element can be found..
            this.__callqueue[id] = [ ['__finishCreate', id, owner, name, scrollbars, appendto, defaultz, canvasref] ];
            setTimeout('lz.embed.iframemanager.__checkiframe("' + id + '")', 10); 
        }
        return id + '';
    }
    // check to see if the iframe is available yet...
    ,__checkiframe: function(id) {
        var iframe = document.getElementById(id);
        if (iframe) {
            var queue = lz.embed.iframemanager.__callqueue[id];
            delete lz.embed.iframemanager.__callqueue[id];
            lz.embed.iframemanager.__playQueue(queue);
        } else {
            // try again in a little while
            setTimeout('lz.embed.iframemanager.__checkiframe("' + id + '")', 10); 
        }
    }
    // generic function for playing back queues
    ,__playQueue: function(queue) {
        var scope = lz.embed.iframemanager;
        for (var i = 0; i < queue.length; i++) {
            var callback = queue[i];
            var methodName = callback.splice(0,1);
            scope[methodName].apply(scope, callback);
        }
    }
    // needed to break this out into a separate method to deal with IE
    ,__finishCreate: function(id, owner, name, scrollbars, appendto, defaultz, canvasref) {
        var i = document.getElementById(id);
        // Find owner div
        if (typeof owner == 'string') {
            // only required for swf - dhtml iframes are positioned by being attached into the div heirarchy...
            i.appcontainer = lz.embed.applications[owner]._getSWFDiv();
        }

        i.owner = owner;
        lz.embed.iframemanager.__frames[id] = i;
        this.__namebyid[id] = name;

        var iframe = lz.embed.iframemanager.getFrame(id);
        iframe.__gotload = lz.embed.iframemanager.__gotload;
        iframe._defaultz = defaultz ? defaultz : 99900;
        this.setZ(id, iframe._defaultz);

        lz.embed.iframemanager.__topiframe = id;
        if (document.getElementById && !(document.all) ) {
            iframe.style.border = '0';
        } else if (document.all) {
            // IE
            // must be set before the iframe is appended to the document (LPP-7310)
            // lz.embed.__setAttr(iframe, 'frameBorder', '0');
            lz.embed.__setAttr(iframe, 'allowtransparency', 'true');

            var metadata = lz.embed[iframe.owner]
            if (metadata && metadata.runtime == 'swf') { 
                // register for onfocus event for swf movies - see LPP-5482 
                var div = metadata._getSWFDiv();
                div.onfocus = lz.embed.iframemanager.__refresh;
            }
        }
        iframe.style.position = 'absolute';
    }
    ,appendTo: function(iframe, div) { 
        //console.log('appendTo', iframe, div, iframe.__appended);
        if (div.__appended == div) return;
        if (iframe.__appended) {
            // remove 
            //console.log('remove', iframe, iframe.__appended);
            old = iframe.__appended.removeChild(iframe);
            div.appendChild(old);
        } else {
            div.appendChild(iframe);
        }
        iframe.__appended = div;
    }
    ,getFrame: function(id) { 
        return lz.embed.iframemanager.__frames[id];
    }
    ,getFrameWindow: function(id) {
        if (!this['framesColl']) {
            if (document.frames) { //Opera, Internet Explorer
                this.framesColl = document.frames;
            }
            else {
                this.framesColl = window.frames; //Firefox, Safari, Netscape
            }
        }
        return this.framesColl[id];
    }
    ,setSrc: function(id, s, history) { 
        if (this.__callqueue[id]) { 
            this.__callqueue[id].push(['setSrc', id, s, history]);
            return;
        }
        // clear out mouse listeners
        this.__setSendMouseEvents(id, false);
        //console.log('setSrc', id, s, history)
        if (history) {
            var iframe = lz.embed.iframemanager.getFrame(id);
            if (! iframe) return;
            lz.embed.__setAttr(iframe, 'src', s);
        } else {
            var id = lz.embed.iframemanager.__namebyid[id];
            var iframe = window[id];
            if (! iframe) return;
            iframe.location.replace(s);
        }
        this.__loading[id] = true;
    }
    ,setPosition: function(id, x, y, width, height, visible, z) { 
        if (this.__callqueue[id]) { 
            this.__callqueue[id].push(['setPosition', id, x, y, width, height, visible, z]);
            return;
        }
        //Debug.write('setPosition', id);
        //console.log('setPosition', id, x, y, width, height, visible)
        var iframe = lz.embed.iframemanager.getFrame(id);
        if (! iframe) return;
        if (iframe.appcontainer) {
            var pos = lz.embed.getAbsolutePosition(iframe.appcontainer);
        } else {
            var pos = {x:0,y:0};
        }
        if (x != null && ! isNaN(x)) iframe.style.left = (x + pos.x) + 'px';
        if (y != null && ! isNaN(y)) iframe.style.top = (y + pos.y) + 'px';
        if (width != null && ! isNaN(width)) iframe.style.width = width + 'px';
        if (height != null && ! isNaN(height)) iframe.style.height = height + 'px';
        if (visible != null) {
            if (typeof visible == 'string') {
                visible = visible == 'true';
            }
            iframe.style.display = visible ? 'block' : 'none';
        }
        if (z != null) this.setZ(id, z + iframe._defaultz);
    }
    ,setVisible: function(id, v) { 
        if (this.__callqueue[id]) { 
            this.__callqueue[id].push(['setVisible', id, v]);
            return;
        }
        if (typeof v == 'string') {
            v = v == 'true';
        }
        //console.log('setVisible', id, v)
        //Debug.write('setVisible', id);
        var iframe = lz.embed.iframemanager.getFrame(id);
        if (! iframe) return;
        iframe.style.display = v ? 'block' : 'none';
    }
    ,bringToFront: function(id) { 
        if (this.__callqueue[id]) { 
            this.__callqueue[id].push(['bringToFront', id]);
            return;
        }
        var iframe = lz.embed.iframemanager.getFrame(id);
        if (! iframe) return;
        iframe._defaultz = 100000;
        this.setZ(id, iframe._defaultz);
        lz.embed.iframemanager.__topiframe = id;
    }
    ,sendToBack: function(id) { 
        if (this.__callqueue[id]) { 
            this.__callqueue[id].push(['sendToBack', id]);
            return;
        }
        var iframe = lz.embed.iframemanager.getFrame(id);
        if (! iframe) return;
        iframe._defaultz = 99900;
        this.setZ(id, iframe._defaultz);
    }
    ,__gotload: function(id) { 
        var iframe = lz.embed.iframemanager.getFrame(id);
        //console.log('__gotload', iframe;
        if (! iframe || ! iframe.owner) return;

        if (iframe.owner.__gotload) {
            iframe.owner.__gotload();
        } else {
            // Flash
            //console.log('calling method', 'lz.embed.iframemanager.__gotload(\'' + id + '\')');
            if (lz.embed[iframe.owner]) {
                lz.embed[iframe.owner].callMethod('lz.embed.iframemanager.__gotload(\'' + id + '\')');
            } else {
                // installing a new player now...
                return;
            }
        }
        this.__loading[id] = false;
        // Enable mouse listeners if needed
        if (this.__sendmouseevents[id]) {
            this.__setSendMouseEvents(id, true);
        }
        if (this.__calljsqueue[id]) {
            this.__playQueue(this.__calljsqueue[id]);
            delete this.__calljsqueue[id];
        }
    }
    ,__refresh: function() { 
        // called in IE for onfocus event in swf - see LPP-5482 
        if (lz.embed.iframemanager.__topiframe) {
            var iframe = lz.embed.iframemanager.getFrame(lz.embed.iframemanager.__topiframe);
            if (iframe.style.display == 'block') {
                iframe.style.display = 'none';
                iframe.style.display = 'block'; 
            }
        }
    }
    ,setZ: function(id, z) { 
        if (this.__callqueue[id]) { 
            this.__callqueue[id].push(['setZ', id, z]);
            return;
        }
        var iframe = lz.embed.iframemanager.getFrame(id);
        if (! iframe) return;
        //console.log('setZ', z, iframe); 
        iframe.style.zIndex = z;
    }
    ,scrollBy: function(id, x, y) { 
        if (this.__callqueue[id]) { 
            this.__callqueue[id].push(['scrollBy', id, x, y]);
            return;
        }
        var id = lz.embed.iframemanager.__namebyid[id];
        var iframe = window.frames[id];
        if (! iframe) return;
        //console.log('scrollBy', x, y, iframe); 
        iframe.scrollBy(x, y);
    }
    ,__destroy: function(id) { 
        if (this.__callqueue[id]) { 
            this.__callqueue[id].push(['__destroy', id]);
            return;
        }
        var iframe = lz.embed.iframemanager.__frames[id];
        if (iframe) {
            // clear out mouse listeners
            this.__setSendMouseEvents(id, false);
            iframe.owner = null;
            iframe.appcontainer = null;
            LzSprite.prototype.__discardElement(iframe);
            delete lz.embed.iframemanager.__frames[id];
            delete lz.embed.iframemanager.__namebyid[id];
        }
    }
    ,callJavascript: function(id, methodName, callbackDel, args) {
        if (this.__callqueue[id]) { 
            this.__callqueue[id].push(['callJavascript', id, methodName, callbackDel, args]);
            return;
        }
        if (this.__loading[id]) {
            // queue call for later
            if (! this.__calljsqueue[id]) {
                this.__calljsqueue[id] = [];
            }
            this.__calljsqueue[id].push(['callJavascript', id, methodName, callbackDel, args]);
            return;
        }
        var iframe = lz.embed.iframemanager.getFrameWindow(id);
        if (!args) args = [];
        try {
            var method = iframe.eval(methodName);
            if (method) {
                var retVal = method.apply(iframe, args);
                //console.log('callJavascript', methodName, args, 'in', iframe, 'result', retVal);
                if (callbackDel) callbackDel.execute(retVal);
                return retVal;
            }
        } catch (e) {
        }
    }
    ,__globalMouseover: function(e, id) {
        var iframe = lz.embed.iframemanager.getFrame(id);
        if (! iframe) return;
        e = window.event;

        // DHTML only...
        if (iframe.owner && iframe.owner.sprite) {
            // Turn mouse events back on unless this was over an iframe
            if (e.toElement && e.toElement.nodeName != 'IFRAME') {
                LzMouseKernel.__resetMouse();
            }
        }
    }
    ,__mouseEvent: function(e, id) {
        var lze = lz.embed;
        var iframe = lze.iframemanager.getFrame(id);
        if (! iframe) return;

        if (!e) {
            e = window.event;
        }

        var eventname = 'on' + e.type;
        if (iframe.owner && iframe.owner.sprite && iframe.owner.sprite.__mouseEvent) {
            // dhtml
            if (eventname == 'oncontextmenu') {
                if (! lze.iframemanager.__hidenativecontextmenu[id]) {
                    return;
                } else {
                    var pos = lze.getAbsolutePosition(iframe); 
                    LzMouseKernel.__sendMouseMove(e, pos.x, pos.y)
                    return LzMouseKernel.__showContextMenu(e);
                }
            }
            iframe.owner.sprite.__mouseEvent(e);

            // clear __lastMouseDown to prevent mouseover/out events being sent as dragin/out events - see LzSprite.js and LzMouseKernel.js - there will be no global mouseup sent from window.document to clear this...
            if (eventname == 'onmouseup') {
                if (LzMouseKernel.__lastMouseDown == iframe.owner.sprite) {
                    LzMouseKernel.__lastMouseDown = null;
                }
            }
        } else {
            // deal with IE event names
            if (eventname == 'onmouseleave') {
                eventname = 'onmouseout';
            } else if (eventname == 'onmouseenter') {
                eventname = 'onmouseover';
            } else if (eventname == 'oncontextmenu') {
                return;
            }
            lze[iframe.owner].callMethod('lz.embed.iframemanager.__gotMouseEvent(\'' + id + '\',\'' + eventname + '\')');
        }
    }
    ,setSendMouseEvents: function(id, send) {
        if (this.__callqueue[id]) { 
            this.__callqueue[id].push(['setSendMouseEvents', id, send]);
            return;
        }
        this.__sendmouseevents[id] = send;
    }
    ,__setSendMouseEvents: function(id, send) {
        var iframe = lz.embed.iframemanager.getFrameWindow(id);
        if (! iframe) {
            return;
        }
        //console.log('sending', id, send);
        if (send) {
            // bind into global events.
            if (lz.embed.browser.isIE) {
                lz.embed.attachEventHandler(document, 'mouseover', lz.embed.iframemanager, '__globalMouseover', id);
            }
            try {
                lz.embed.attachEventHandler(iframe.document, 'mousedown', lz.embed.iframemanager, '__mouseEvent', id);
                lz.embed.attachEventHandler(iframe.document, 'mouseup', lz.embed.iframemanager, '__mouseEvent', id);
                lz.embed.attachEventHandler(iframe.document, 'click', lz.embed.iframemanager, '__mouseEvent', id);
                //lz.embed.attachEventHandler(iframe.document, 'mousemove', lz.embed.iframemanager, '__mouseEvent', id);
                iframe.document.oncontextmenu = function(e) {
                    if (! e) e = iframe.event;
                    return lz.embed.iframemanager.__mouseEvent(e, id);
                }
                if (lz.embed.browser.isIE) {
                    lz.embed.attachEventHandler(iframe.document, 'mouseenter', lz.embed.iframemanager, '__mouseEvent', id);
                    lz.embed.attachEventHandler(iframe.document, 'mouseleave', lz.embed.iframemanager, '__mouseEvent', id);
                } else {
                    lz.embed.attachEventHandler(iframe.document, 'mouseover', lz.embed.iframemanager, '__mouseEvent', id);
                    lz.embed.attachEventHandler(iframe.document, 'mouseout', lz.embed.iframemanager, '__mouseEvent', id);
                }
            } catch(e) {
            }
        } else {
            // remove event listeners
            if (lz.embed.browser.isIE) {
                lz.embed.removeEventHandler(document, 'mouseover', lz.embed.iframemanager, '__globalMouseover');
            }
            try {
                lz.embed.removeEventHandler(iframe.document, 'mousedown', lz.embed.iframemanager, '__mouseEvent');
                lz.embed.removeEventHandler(iframe.document, 'mouseup', lz.embed.iframemanager, '__mouseEvent');
                lz.embed.removeEventHandler(iframe.document, 'click', lz.embed.iframemanager, '__mouseEvent');
                //lz.embed.removeEventHandler(iframe.document, 'mousemove', lz.embed.iframemanager, '__mouseEvent');
                iframe.document.oncontextmenu = null;
                if (lz.embed.browser.isIE) {
                    lz.embed.removeEventHandler(iframe.document, 'mouseenter', lz.embed.iframemanager, '__mouseEvent');
                    lz.embed.removeEventHandler(iframe.document, 'mouseleave', lz.embed.iframemanager, '__mouseEvent');
                } else {
                    lz.embed.removeEventHandler(iframe.document, 'mouseover', lz.embed.iframemanager, '__mouseEvent');
                    lz.embed.removeEventHandler(iframe.document, 'mouseout', lz.embed.iframemanager, '__mouseEvent');
                }
            } catch(e) {
            }
        }
    }
    ,setShowNativeContextMenu: function(id, show) {
        this.__hidenativecontextmenu[id] = ! show;
    }
    ,storeSelection: function(id) {
        var ifm = lz.embed.iframemanager;
        var win = ifm.getFrameWindow(id);
        if (win && win.document && win.document.selection && win.document.selection.type=="Text"){
            ifm.__selectionbookmarks[id] = win.document.selection.createRange().getBookmark();
        }
    }
    ,restoreSelection: function(id) {
        var ifm = lz.embed.iframemanager;
        var win = ifm.getFrameWindow(id);
        if (ifm.__selectionbookmarks[id] && win) {
            var bookmark = ifm.__selectionbookmarks[id];
            var range = win.document.body.createTextRange();
            range.moveToBookmark(bookmark);
            range.select();
        }
    }
}
