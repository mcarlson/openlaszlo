/* X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2010 Laszlo Systems, Inc.  All Rights Reserved.          *
* Use is subject to license terms.                                        *
* X_LZ_COPYRIGHT_END ******************************************************/
lz.embed.iframemanager = {
    __counter: 0
    ,__frames: {}
    ,__namebyid: {}
    ,__ownerbyid: {}
    ,__loading: {}
    ,__callqueue: {}
    ,__calljsqueue: {}
    ,__sendmouseevents: {}
    ,__hidenativecontextmenu: {}
    ,__selectionbookmarks: {}
    ,create: function(owner, name, scrollbars, appendto, defaultz, canvasref) {
        //console.log('create: ' + owner + ', ' + name + ', ' + scrollbars + ', ' + appendto + ', ' + defaultz)
        var id = '__lz' + lz.embed.iframemanager.__counter++;
        if (typeof owner == 'string') {
            // Add to table of owners so we can destroy the correct iframes in 
            // __reset();
            lz.embed.iframemanager.__ownerbyid[id] = owner;
        }
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
                
            // Hide iframe container - see LPP-8753
            div.style.position = 'absolute';
            div.style.display = 'none';
            div.style.top = '0px';
            div.style.left = '0px';

            div.innerHTML = html
            var i = document.getElementById(id);
        } else {
            var i = document.createElement('iframe');
            lz.embed.__setAttr(i, 'name', name);
            lz.embed.__setAttr(i, 'src', src);
            lz.embed.__setAttr(i, 'id', id);
            lz.embed.__setAttr(i, 'onload', onload);
            // for Safari, see LPP-9098
            lz.embed.__setAttr(i, 'tabindex', '-1');
            if (scrollbars != true) lz.embed.__setAttr(i, 'scrolling', 'no');

            this.appendTo(i, appendto);
        }

        if (i) {
            this.__finishCreate(id, owner, name, scrollbars, appendto, defaultz, canvasref);
        } else {
            // IE takes a while to create the iframe sometimes...
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

        var iframemanager = lz.embed.iframemanager;

        i.__owner = owner;
        iframemanager.__frames[id] = i;
        this.__namebyid[id] = name;

        // set style
        var iframe = iframemanager.getFrame(id);
        iframe.__gotload = iframemanager.__gotload;
        iframe._defaultz = defaultz ? defaultz : 99900;
        this.setZ(id, iframe._defaultz);

        iframemanager.__topiframe = id;
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
                div.onfocus = iframemanager.__refresh;
            }
        }
        iframe.style.position = 'absolute';

        // Call back to owner
        if (typeof owner == 'string') {
            // Flash-specific callback
            // Use timeout to ensure __setiframeid() is called after create() 
            // returns - see LPP-9272
            setTimeout("lz.embed.applications." +  owner + ".callMethod('lz.embed.iframemanager.__setiframeid(\"" + id + "\")')", 0);
        } else {
            owner.setiframeid(id);
        }
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
    ,setHTML: function(id, html) { 
        // must be called after the iframe loads, or it will be overwritten
        if (html && html != '') {
            var win = lz.embed.iframemanager.getFrameWindow(id);
            if (win) {
                win.document.body.innerHTML = html;
            }
        }
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
            // Flash needs the absolute position
            var pos = lz.embed.getAbsolutePosition(iframe.appcontainer);
        } else {
            // default to the origin of the containing div for DHTML
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
    ,setStyle: function (id, elementid, property, value) {
        var win = lz.embed.iframemanager.getFrameWindow(id);
        if (!win) return;
        var elemid = win.document.getElementById(elementid);
        if (elemid) {
            try {
                elemid.style[property] = value;
            } catch (e) {
            }
        }
    }
    // Sends a named event back to the component, called from an iframe
    ,asyncCallback: function(id, event, arg, callbackid) {
        var iframe = lz.embed.iframemanager.getFrame(id);
        if (! iframe || ! iframe.__owner) return;

        if (iframe.__owner.__iframecallback) {      
            // dhtml
            //console.log('asyncCallback', id, event, arg);
            iframe.__owner.__iframecallback(event, arg);
        } else {
            // Flash
            if (lz.embed[iframe.__owner]) {
                // quote arg if present
                arg = (arg != null) ? ",'" + arg + "'" : '';
                arg += (callbackid != null) ? "," + callbackid + "" : '';
                //console.log("lz.embed.iframemanager.__iframecallback('" + id + "','" + event + "'" + arg + ")")
                lz.embed[iframe.__owner].callMethod("lz.embed.iframemanager.__iframecallback('" + id + "','" + event + "'" + arg + ")");
            } else {
                // installing a new player now...
                return;
            }
        }
    }
    ,__gotload: function(id) { 
        var iframe = lz.embed.iframemanager.getFrame(id);
        //console.log('__gotload', id, iframe);
        if (! iframe || ! iframe.__owner) return;

        if (this.__loading[id] == true) {
            // finish loading
            this.__loading[id] = false;
            if (document.all) {
                // document.all is IE-only
                // Show iframe container - see LPP-8753
                if (iframe.parentElement) {
                    iframe.parentElement.style.display = '';
                }
            }
            // Enable mouse listeners if needed
            if (this.__sendmouseevents[id]) {
                this.__setSendMouseEvents(id, true);
            }
            if (this.__calljsqueue[id]) {
                this.__playQueue(this.__calljsqueue[id]);
                delete this.__calljsqueue[id];
            }
        }

        // Send callback to support setHTML() which must be called after the 
        // initial load
        // Use timeout to ensure frame is really loaded.
        setTimeout("lz.embed.iframemanager.asyncCallback('" + id + "', 'load')", 1);
    }
    // called in IE for onfocus event in swf - see LPP-5482 
    ,__refresh: function() { 
        // refresh all iframes
        var frames = lz.embed.iframemanager.__frames;
        for (var id in frames) {
            var frame = frames[id];
            if (frame && frame.style.display=="block"){
                frame.style.display="none";
                frame.style.display="block"
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
            if (this.__sendmouseevents[id]) {
                this.__setSendMouseEvents(id, false);
            }
            iframe.__owner = null;
            iframe.appcontainer = null;
            if (document.all) {
                // IE needs the iframe container destroyed also
                var el = document.getElementById(id + 'Container');
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            } else if (iframe.parentNode) {
                iframe.parentNode.removeChild(iframe);
            }
            delete lz.embed.iframemanager.__frames[id];
            delete lz.embed.iframemanager.__namebyid[id];
            delete lz.embed.iframemanager.__ownerbyid[id];
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
                //console.log('callJavascript', methodName, args, 'in', iframe, 'result', retVal, callbackDel);
                if (callbackDel) callbackDel.execute(retVal);
                return retVal;
            }
        } catch (e) {
            // dump error to console if available
            window.console && console.error && console.error('callJavascript() caught error:', e);
        }
    }
    ,callRPC: function(id, methodName, callback, args) {
        var iframe = lz.embed.iframemanager.getFrameWindow(id);
        var callobj =  {
            destination: iframe,
            publicProcedureName: 'callRPC',
            params: [methodName, args]
        }
        if (callback != null) {
            if (typeof callback == 'number') {
                // Flash uses a callback ID
                //console.log('callRPC creating callback', callback);
                // store a copy to be closed over by onSuccess
                callobj.onSuccess = function(returnObj) {
                    //console.log('callRPC onSuccess', callback, returnObj.returnValue);
                    // Add the callbackID to the returnObj, so flash knows
                    // who to call
                    lz.embed.iframemanager.asyncCallback(id, '__lzcallback', JSON.stringify(returnObj.returnValue), callback);
                }
            } else {
                callobj.onSuccess = function(returnObj) {
                    //console.log('callRPC onSuccess', callback, returnObj.returnValue);
                    callback.execute(returnObj.returnValue);
                }
            }
        }
        if (window.console && console.error) {
            callobj.onError = function(statusObj) {
                window.console && console.error && console.error('callRPC error', callobj, statusObj);
            }
        }
        //console.log('pmrpc callRPC', callback, callobj);
        pmrpc.call(callobj); 
    }
    ,__mouseEvent: function(e, id) {
        var embed = lz.embed;
        var iframe = embed.iframemanager.getFrame(id);
        if (! iframe) return;

        if (!e) {
            e = window.event;
        }

        var eventname = 'on' + e.type;
        if (iframe.__owner && iframe.__owner.sprite && iframe.__owner.sprite.__mouseEvent) {
            // dhtml
            if (eventname == 'oncontextmenu') {
                if (! embed.iframemanager.__hidenativecontextmenu[id]) {
                    return;
                } else {
                    var pos = embed.getAbsolutePosition(iframe); 
                    LzMouseKernel.__sendMouseMove(e, pos.x, pos.y)
                    return LzMouseKernel.__showContextMenu(e);
                }
            }
            iframe.__owner.sprite.__mouseEvent(e);

            // clear __lastMouseDown to prevent mouseover/out events being sent as dragin/out events - see LzSprite.js and LzMouseKernel.js - there will be no global mouseup sent from window.document to clear this...
            if (eventname == 'onmouseup') {
                if (LzMouseKernel.__lastMouseDown == iframe.__owner.sprite) {
                    LzMouseKernel.__lastMouseDown = null;
                }
            }
        } else {
            // Flash
            // deal with IE event names
            if (eventname == 'onmouseleave') {
                eventname = 'onmouseout';
            } else if (eventname == 'onmouseenter') {
                eventname = 'onmouseover';
            } else if (eventname == 'oncontextmenu') {
                return;
            }
            embed.iframemanager.asyncCallback(id,'mouseevent',eventname);
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
    /* Called when the flash movie reloads.  Destroy all iframes and allow them to be recreated */
    ,__reset: function(appid) {
        //if (! (typeof __owner == 'string')) return;
        if (lz.embed.iframemanager.__counter) {
            var owners = lz.embed.iframemanager.__ownerbyid;
            // Find frames by app id
            for (var id in owners) {
                //alert('destroy: ' + owners[id] + appid)
                if (appid === owners[id]) {
                    lz.embed.iframemanager.__destroy(id);
                }
            }
        }
    }
}

// register asyncCallback
pmrpc.register( {
  publicProcedureName : "asyncCallback",
  procedure: lz.embed.iframemanager.asyncCallback
} );
