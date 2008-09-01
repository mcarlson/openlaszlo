/* X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2008 Laszlo Systems, Inc.  All Rights Reserved.               *
* Use is subject to license terms.                                        *
* X_LZ_COPYRIGHT_END ******************************************************/
lz.embed.regex = {
    /**
      * RegExp-support for Flash8. Always keep in sync with 'lfc/kernel/swf/LzRegExp.lzs'.
      * @author abargull
      */
    cache: {},
    create:
            function (id, pattern, flags) {
                try {
                    var o = lz.embed.regex;
                    o.cache[id] = new RegExp(o.unmask(pattern), o.unmask(flags));
                    return true;
                } catch (e) {
                    return e.name + ': ' + e.message;
                }
            },
    test:
            function (id, s, li) {
                var o = lz.embed.regex;
                var re = o.cache[id];
                re.lastIndex = li;
                return [re.test(o.unmask(s)), re.lastIndex];
            },
    exec:
            function (id, s, li) {
                var o = lz.embed.regex;
                var re = o.cache[id];
                re.lastIndex = li;
                var a = re.exec(o.unmask(s));
                if (a) {
                    // ExternalInterface removes any additional properties from the Array-object, 
                    // e.g. the "index"-field, so we add them at the end
                    (a = o.maskArr(a)).push(a.index, re.lastIndex);
                    return a;
                } else {
                    return null;
                }
            },
    match:
            function (id, s) {
                var o = lz.embed.regex;
                var a = o.unmask(s).match(o.cache[id]);
                return a ? o.maskArr(a) : null;
            },
    replace:
            function (id, s, r) {
                var o = lz.embed.regex;
                return o.mask(o.unmask(s).replace(o.cache[id], o.unmask(r)));
            },
    search:
            function (id, s) {
                var o = lz.embed.regex;
                return o.unmask(s).search(o.cache[id]);
            },
    remove:
            function (id) {
                delete lz.embed.regex.cache[id];
            },
    mask:
            function (s) {
#passthrough {
var re = /^\s*$/;
var re2 = /\s/g;
}#
                return s == null || !re.test(s) ? s : '__#lznull' + s.replace(re2, function (c) {
                    switch (c) {
                        case ' ': return 'w';
                        case '\f': return 'f';
                        case '\n': return 'n';
                        case '\r': return 'r';
                        case '\t': return 't';
                        case '\u00A0': return 's';
                        case '\u2028': return 'l';
                        case '\u2029': return 'p';
                    }
                });
            },
    unmask:
            function (s) {
                return s == '__#lznull' ? '' : s;
            },
    maskArr:
            function (a) {
                var o = lz.embed.regex;
                for (var i = 0; i < a.length; ++i)
                    a[i] = o.mask(a[i]);
                return a;
            }
}