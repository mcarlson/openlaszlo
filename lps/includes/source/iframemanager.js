/* X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.          *
* Use is subject to license terms.                                        *
* X_LZ_COPYRIGHT_END ******************************************************/
lz.embed.iframemanager = {
    __counter: 0
    ,__frames: {}
    ,__namebyid: {}
    ,create: function(owner, name, scrollbars, appendto, defaultz, canvasref) {
        //console.log(owner + ', ' + name + ', ' + scrollbars + ', ' + appendto + ', ' + defaultz)
        var i = document.createElement('iframe');
        // Find owner div
        if (typeof owner == 'string') {
            i.appcontainer = lz.embed.applications[owner]._getSWFDiv();
        } else {
            i.appcontainer = canvasref.sprite.__LZdiv;
        }
        i.owner = owner;
        i.skiponload = true;

        var id = '__lz' + lz.embed.iframemanager.__counter++;
        lz.embed.iframemanager.__frames[id] = i;

        if (name == null || name == 'null' || name == '') name = id;
        if (name != "") lz.embed.__setAttr(i, 'name', name);
        //console.log('using name', name);
        lz.embed.iframemanager.__namebyid[id] = name;

        lz.embed.__setAttr(i, 'src', 'javascript:""');

        if (appendto == null || appendto == "undefined") {
            appendto = document.body;
        }
        lz.embed.__setAttr(i, 'id', id);
        if (scrollbars != true) lz.embed.__setAttr(i, 'scrolling', 'no');
        if (document.all) lz.embed.__setAttr(i, 'frameBorder', '0');
        this.appendTo(id, appendto);

        var iframe = lz.embed.iframemanager.getFrame(id);
        lz.embed.__setAttr(iframe, 'onload', 'lz.embed.iframemanager.__gotload("' + id + '")');
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
        return id + '';
    }
    ,appendTo: function(id, div) { 
        var iframe = lz.embed.iframemanager.getFrame(id);
        //console.log('appendTo', id, div, iframe.__appended);
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
    ,setSrc: function(id, s, history) { 
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
    }
    ,setPosition: function(id, x, y, width, height, visible, z) { 
        //Debug.write('setPosition', id);
        //console.log('setPosition', id, x, y, width, height, visible)
        var iframe = lz.embed.iframemanager.getFrame(id);
        if (! iframe) return;
        var pos = lz.embed.getAbsolutePosition(iframe.appcontainer);
        if (x != null) iframe.style.left = (x + pos.x) + 'px';
        if (y != null) iframe.style.top = (y + pos.y) + 'px';
        if (width != null) iframe.style.width = width + 'px';
        if (height != null) iframe.style.height = height + 'px';
        if (visible != null) {
            if (typeof visible == 'string') {
                visible = visible == 'true';
            }
            iframe.style.display = visible ? 'block' : 'none';
        }
        if (z != null) this.setZ(id, z + iframe._defaultz);
    }
    ,setVisible: function(id, v) { 
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
        var iframe = lz.embed.iframemanager.getFrame(id);
        if (! iframe) return;
        iframe._defaultz = 100000;
        this.setZ(id, iframe._defaultz);
        lz.embed.iframemanager.__topiframe = id;
    }
    ,sendToBack: function(id) { 
        var iframe = lz.embed.iframemanager.getFrame(id);
        if (! iframe) return;
        iframe._defaultz = 99900;
        this.setZ(id, iframe._defaultz);
    }
    ,__gotload: function(id) { 
        var iframe = lz.embed.iframemanager.getFrame(id);
        //console.log('__gotload', iframe, iframe.skiponload);
        if (! iframe) return;
        if (iframe.skiponload) {
            iframe.skiponload = false;
            return;
        }

        if (iframe.owner && iframe.owner.__gotload) {
            iframe.owner.__gotload();
        } else {
            //console.log('calling method', 'lz.embed.iframemanager.__gotload(\'' + id + '\')');
            lz.embed[iframe.owner].callMethod('lz.embed.iframemanager.__gotload(\'' + id + '\')');
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
        var iframe = lz.embed.iframemanager.getFrame(id);
        if (! iframe) return;
        //console.log('setZ', z, iframe); 
        iframe.style.zIndex = z;
    }
    ,scrollBy: function(id, x, y) { 
        var id = lz.embed.iframemanager.__namebyid[id];
        var iframe = window.frames[id];
        if (! iframe) return;
        //console.log('scrollBy', x, y, iframe); 
        iframe.scrollBy(x, y);
    }
    ,__destroy: function(id) { 
        var iframe = lz.embed.iframemanager.__frames[id];
        if (iframe) {
            iframe.owner = null;
            iframe.appcontainer = null;
            LzSprite.prototype.__discardElement(iframe);
            delete lz.embed.iframemanager.__frames[id];
            delete lz.embed.iframemanager.__namebyid[id];
        }
    }
}
