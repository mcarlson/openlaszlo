/* X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.          *
* Use is subject to license terms.                                        *
* X_LZ_COPYRIGHT_END ******************************************************/
lz.embed.iframemanager = {
    __highestz: 0
    ,__frames: {}
    ,__namebyid: {}
    ,create: function(owner, name, appendto) {
        //alert(owner + ', ' + name + ', ' + appendto)
        var i = document.createElement('iframe');
        i.owner = owner;
        i.skiponload = true;

        var id = '__lz' + lz.embed.iframemanager.__highestz++;
        lz.embed.iframemanager.__frames[id] = i;

        if (name == null || name == 'null') name = id;
        if (name != "") lz.embed.__setAttr(i, 'name', name);
        this.__namebyid[id] = name;

        lz.embed.__setAttr(i, 'src', 'javascript:""');

        if (appendto == null || appendto == "undefined") {
            appendto = document.body;
        }
        appendto.appendChild(i);
        lz.embed.__setAttr(i, 'id', id);

        var iframe = lz.embed.iframemanager.getFrame(id);
        lz.embed.__setAttr(iframe, 'onload', 'lz.embed.iframemanager.__gotload("' + id + '")');
        iframe.__gotload = lz.embed.iframemanager.__gotload;
        iframe._defaultz = 99900 + lz.embed.iframemanager.__highestz;
        iframe.style.zIndex = iframe._defaultz;

        lz.embed.iframemanager.__topiframe = id;
        if (document.getElementById && !(document.all) ) {
            iframe.style.border = '0';
        } else if (document.all) {
            // IE
            lz.embed.__setAttr(iframe, 'border', '0');
            lz.embed.__setAttr(iframe, 'allowtransparency', 'true');

            var metadata = lz.embed[iframe.owner]
            if (metadata.runtime == 'swf') { 
                // register for onfocus event for swf movies - see LPP-5482 
                var div = metadata._getSWFDiv();
                div.onfocus = lz.embed.iframemanager.__refresh;
            }
        }
        iframe.style.position = 'absolute';
        return id + '';
    }
    ,getFrame: function(id) { 
        return lz.embed.iframemanager.__frames[id];
    }
    ,setSrc: function(id, s, history) { 
        //console.log('setSrc', id, s)
        if (history) {
            var iframe = lz.embed.iframemanager.getFrame(id);
            if (! iframe) return;
            lz.embed.__setAttr(iframe, 'src', s);
            return true;
        } else {
            var id = lz.embed.iframemanager.__namebyid[id];
            var iframe = window[id];
            if (! iframe) return;
            iframe.location.replace(s);
            return true;
        }
    }
    ,setPosition: function(id, x, y, width, height, visible) { 
        //Debug.write('setPosition', id);
        //console.log('setPosition', id, x, y, width, height, visible)
        var iframe = lz.embed.iframemanager.getFrame(id);
        if (! iframe) return;
        if (x != null) iframe.style.left = x + 'px';
        if (y != null) iframe.style.top = y + 'px';
        if (width != null) iframe.style.width = width + 'px';
        if (height != null) iframe.style.height = height + 'px';
        if (visible != null) {
            if (typeof visible == 'string') {
                visible = visible == 'true';
            }
            iframe.style.display = visible ? 'block' : 'none';
        }
        
        return true;
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
        return true;
    }
    ,bringToFront: function(id) { 
        //console.log('bringToFront', id)
        //Debug.write('bringToFront', id);
        var iframe = lz.embed.iframemanager.getFrame(id);
        if (! iframe) return;
        iframe.style.zIndex = 100000 + lz.embed.iframemanager.__highestz;
        lz.embed.iframemanager.__topiframe = id;
        return true;
    }
    ,sendToBack: function(id) { 
        //console.log('sendToBack', id)
        //Debug.write('bringToFront', id);
        var iframe = lz.embed.iframemanager.getFrame(id);
        if (! iframe) return;
        iframe.style.zIndex = iframe._defaultz;
        return true;
    }
    ,__gotload: function(id) { 
        //Debug.write('__gotload', id);
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
}
