/* X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.          *
* Use is subject to license terms.                                        *
* X_LZ_COPYRIGHT_END ******************************************************/
Lz.iframemanager = {
    __highestz: 0
    ,__frames: {}
    ,create: function(owner, name, appendto) {
        //alert(owner + ', ' + name + ', ' + appendto)
        var i = document.createElement('iframe');
        i.owner = owner;
        i.skiponload = true;

        var id = '__lz' + Lz.iframemanager.__highestz++;
        Lz.iframemanager.__frames[id] = i;
        Lz.__setAttr(i, 'id', id);

        if (name == null) name = '';
        if (name != "") Lz.__setAttr(i, 'name', name);

        i.__gotload = Lz.iframemanager.__gotload;
        Lz.__setAttr(i, 'onload', 'Lz.iframemanager.__gotload("' + id + '")');
        if (appendto == null || appendto == "undefined") {
            appendto = document.body;
        }
        appendto.appendChild(i);

        var iframe = Lz.iframemanager.getFrame(id);
        if (document.getElementById && !(document.all) ) {
            iframe.style.border = '0';
        } else if (document.all) {
            Lz.__setAttr(iframe, 'frameborder', '0');
            Lz.__setAttr(iframe, 'allowtransparency', 'true');
        }
        iframe.style.position = 'absolute';
        return id;
    }
    ,getFrame: function(id) { 
        return Lz.iframemanager.__frames[id];
    }
    ,setSrc: function(id, s) { 
        //console.log('setSrc', id, s)
        var iframe = Lz.iframemanager.getFrame(id);
        if (! iframe) return;
        Lz.__setAttr(iframe, 'src', s);
        return true;
    }
    ,setPosition: function(id, x, y, width, height, visible) { 
        //Debug.write('setPosition', id);
        //console.log('setPosition', id, x, y, width, height, visible)
        var iframe = Lz.iframemanager.getFrame(id);
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
        var iframe = Lz.iframemanager.getFrame(id);
        if (! iframe) return;
        iframe.style.display = v ? 'block' : 'none';
        this._visible = v;
        return true;
    }
    ,bringToFront: function(id) { 
        //console.log('bringToFront', id)
        //Debug.write('bringToFront', id);
        var iframe = Lz.iframemanager.getFrame(id);
        if (! iframe) return;
        iframe.style.zIndex = 100000 + Lz.iframemanager.__highestz;
        return true;
    }
    ,__gotload: function(id) { 
        //Debug.write('__gotload', id);
        //console.log('__gotload', id);
        var iframe = Lz.iframemanager.getFrame(id);
        if (! iframe) return;
        if (iframe.skiponload) {
            iframe.skiponload = false;
            return;
        }

        if (iframe.owner && iframe.owner.__gotload) {
            iframe.owner.__gotload();
        } else {
            //console.log('calling method', 'Lz.iframemanager.__gotload(\'' + id + '\')');
            Lz.callMethod('Lz.iframemanager.__gotload(\'' + id + '\')');
        }
    }
}
