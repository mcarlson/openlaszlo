/* X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2010 Laszlo Systems, Inc.  All Rights Reserved.               *
* Use is subject to license terms.                                        *
* X_LZ_COPYRIGHT_END ******************************************************/
lz.embed.__iframemanager_frames = [];
lz.embed.iframemanager = {
    create: function(owner, name, scrollbars, appendto, defaultz, canvasref) {
        var embed = lz.embed;
        // store callback reference on stack
        embed.__iframemanager_frames.push([].slice.call(arguments, 0));

        if (typeof owner == 'string') {
            // Flash needs iframeid right away.  Generate one.
            iframeid = '__lz' + (embed.__iframemanager_frames.length - 1);
        } else {
            // DHTML works better without an immediate iframe
            var iframeid;
        }
        var url = embed.getServerRoot() + 'iframemanager.js';
        if (embed.jsloaded[url]) return iframeid;

        var callback = function() {
            var embed = lz.embed;
            //console.log('loaded iframemanager.js');
            // create iframes
            for (var i = 0, l = embed.__iframemanager_frames.length; i < l; i++) {
                var args = embed.__iframemanager_frames[i];
                var id = embed.iframemanager.create.apply(embed.iframemanager, args);
                var owner = args[0];
                if (typeof owner == 'string') {
                    // Use Flash-specific callback
                    lz.embed.applications[owner].callMethod('lz.embed.iframemanager.__createcallback("' + id + '")');
                } else {
                    owner.setiframeid(id);
                }
                //console.log('created iframe', id, args, embed.iframemanager.create);
            }
            delete embed.__iframemanager_frames;
        }
        //console.log('loading', url, iframeid);

        // load iframemanager.js
        embed.loadJSLib(url, callback);

        return iframeid;
    }
}
