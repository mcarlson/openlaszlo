/* X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2010 Laszlo Systems, Inc.  All Rights Reserved.          *
* Use is subject to license terms.                                        *
* X_LZ_COPYRIGHT_END ******************************************************/

// Notes:
//
// These objects are loaded by every iframe. I tried to load it once and reference it from the
// iframe, but dojo uses globals and I couldn't get it to work.
//
// I have seen cases where the wrong lz.rtemanager is called when a button is clicked. Each iframe
// has its own copy so I don't understand why the wrong one is found. See generate_event.
//
// Deferred loading dojo generates loading errors when you load a local copy of dojo. This doesn't
// happen when you load a cross-domain version from Google.
// (http://trac.dojotoolkit.org/ticket/11445)
// I found that setting debugAtAllCosts=true fixes the problem.
//
// You currently should not open two or more editor simultaneously. The loading is messed up
//
// Heap leaks!
//
// I'm loading a static html page to get the rte functionality. Should I create this page on the fly
// and load it each time?
//
// solo issues
//
// Location of rtewrapper.html. In dhtml I can use lz.embed.options.serverroot, but not in swf
//
// Add Loading... or icon to show that rte editor is loading
//
// A couple of IE issues. I disabled keyboard handling since this generated an error when the rte is embedded ina window that gets deleted. However, I get a permission denied error now.


// djConfig defines what dojo loads
var djConfig = {
    //isDebug: true
    //,parseOnLoad: true
    afterOnLoad: true
    ,require: ['dojo.parser', 'dijit.Editor', 'dijit.form.Form', 'dijit._editor.range', 'dijit._editor.plugins.LinkDialog', 'dijit._editor.plugins.Print', 'dijit._editor.plugins.TextColor', 'dijit._editor.plugins.FontChoice','dojox.editor.plugins.Smiley','dojox.editor.plugins.ToolbarLineBreak']
    ,debugAtAllCosts: true   // Setting this fixes local loading of dojo
    ,addOnLoad: function() {
        lzrte.rteloader.editor_loaded();
    }
};


lzrte = {}

lzrte.util = {
    loadJavascript: function(doc, url, onload) {
        var s = doc.createElement('script');
        s.src  = url;
        s.type = 'text/javascript';
        if (onload) {
          s.onload = onload;
          s.onreadystatechange = onload;  //IE
        }
        doc.getElementsByTagName('head')[0].appendChild(s);
    }

    // Load css file into the top-level page
    ,loadCSS: function(doc, url) {
        var l = doc.createElement('link');
        l.rel  = 'stylesheet';
        l.type = 'text/css';
        l.href = url;
        doc.getElementsByTagName('head')[0].appendChild(l);
    }
}


lzrte.rteloader = {
    __loading: false    // true if the loading process is running
    ,__loaded: false    // true if dijit Editor is loaded
    ,__callbacks: []    // object names requesting notification when editor has loaded

    ,__dojoroot: 'http://ajax.googleapis.com/ajax/libs/dojo/1.4/'
    //,__dojoroot: 'http://localhost:8080/trunk/dojo-release-1.4.3/'
    //,__dojoroot: 'http://localhost:8080/trunk/dojo-release-1.5.0rc3/'
    ,__csspath: 'dijit/themes/'
    ,__jspath: 'dojo/dojo.xd.js'
    //,__jspath: 'dojo/dojo.js.uncompressed.js'
    //,__jspath: 'dojo/dojo.js'

    ,loadDojoCSS: function(doc, theme) {
        lzrte.util.loadCSS (doc, lzrte.rteloader.__dojoroot + lzrte.rteloader.__csspath + theme + '/' + theme + '.css');

        document.body.className += document.body.className ? ' ' + theme : theme;
    }

    // Load dojo/dijit.Editor into the specified document. Call obj.editor_loaded when complete. 
    ,loadDojo: function(doc, callback, require) {
        if (lzrte.rteloader.__loading) {
            // Already loading. Add to callback
            lzrte.rteloader.__callbacks.push (callback);
            return;
        }
        else if (lzrte.rteloader.__loaded) {
            callback.call ();
            return;
        }
        else {
            lzrte.rteloader.__loading = true;

            if (require)
                djConfig.require = require;

            lzrte.rteloader.__callbacks.push (callback);
            lzrte.util.loadJavascript (doc, lzrte.rteloader.__dojoroot + lzrte.rteloader.__jspath);
        }
    }

    // Called when dojo/dijit.Editor is loaded. This runs once per browser, not once per iframe
    ,editor_loaded: function() {
        lzrte.rteloader.__loaded = true;
        lzrte.rteloader.__loading = false;

        // Inform anyone waiting that dojo/dijit.Editor is loaded
        while (lzrte.rteloader.__callbacks.length > 0) {
            var callback = lzrte.rteloader.__callbacks.shift ();
            callback.call ();
        }
    }
}


lzrte.rtemanager = {
    __id:         null     // DOM id of <div> element containing text
    ,__frameid:   null     // id of iframe of html component
    ,__loading:   false    // true if the loading process is running
    ,__loaded:    false    // true if dijit Editor is loaded
    ,__text:      ''       // Text to display when the editor first loads. Also the current text
    ,__onclick:   null     // lz delegate to fire when a button is clicked
    ,__editing:   false    // true if the editor is running
    ,__editor:    null     // dijit.Editor object
    ,button_counter: 0     // unique id of button
    ,__theme:     'tundra' // editor theme (tundra,soria,nihilo)

    // Order that plugins are displayed in the editor
    ,__plugins:   ['undo','redo','|','cut','copy','paste','|','bold','italic','underline','strikethrough','|','insertOrderedList','insertUnorderedList','indent','outdent','|','justifyLeft','justifyRight','justifyCenter','justifyFull','|', 'foreColor', 'hiliteColor', '|', 'createLink', 'unlink', 'insertImage', '|', 'print', 'smiley', '||' , 'fontName', 'fontSize']

    // Create the rte, but do not display it
    ,create: function(id_name, frameid) {
        lzrte.rtemanager.__id = id_name;
        lzrte.rtemanager.__frameid = frameid;
    }

    // Cleanup
    ,destroy: function (frameid) {
        lzrte.rtemanager.rte_stop ();
        
        if (lzrte.rtemanager.__editor) {
            //lzrte.rtemanager.__editor.destroyRecursive ();
            //delete lzrte.rtemanager.__editor;
            lzrte.rtemanager.__editor = null;
            lzrte.rtemanager.__editing = false;
        }
    }

    // Run the RTE for the specified id
    ,__rte_start: function(initial_text) {
        lzrte.rtemanager.initialize(); // nop if already initialized
        lzrte.rtemanager.__editing = true;

        var id = dojo.byId(lzrte.rtemanager.__id);

        if (initial_text)
          id.innerHTML = initial_text;

        if (lzrte.rtemanager.__editor)
          lzrte.rtemanager.__editor.open ();
        else {
            var plugins = lzrte.rtemanager.__plugins;
            // TODO. This has issues in IE when rte is in a window that gets removed
            //            plugins.push ('dijit._editor.plugins.EnterKeyHandling');
            lzrte.rtemanager.__editor = new dijit.Editor({height: '90%', plugins: plugins}, id);
        }
        if (console && console.debug) console.debug("Created editor", lzrte.rtemanager.__editor);

        // Capturing mouse clicks and key presses is enough to find out when the text changes
        // The onChange event in dijit.Editor doesn't fire until the editor loses focus.
        dojo.connect(lzrte.rtemanager.__editor, 'onClick', lzrte.rtemanager.onchange);
        dojo.connect(lzrte.rtemanager.__editor, 'onKeyUp', lzrte.rtemanager.onchange);
    }

    ,rte_start: function(initial_text) {
        if (console && console.debug) console.debug("rte_start");
        if (lzrte.rtemanager.isEditing())
            return;
        if (lzrte.rtemanager.isLoaded()) {
            lzrte.rtemanager.__rte_start(initial_text);
        }
        else {
            // Load the editor and then show editor
            lzrte.rtemanager.__text = initial_text;
            lzrte.rtemanager.initialize();
        }
    }

    // Stop RTE and return the content
    ,rte_stop: function() {
        var contents;
        if (lzrte.rtemanager.__editor) {
            contents = lzrte.rtemanager.getText();
            if (lzrte.rtemanager.isEditing())
                lzrte.rtemanager.__editor.close ();
            if (console && console.debug) console.debug("rte_stop", contents);
        }

        return contents;
    }

    // Set the editor contents
    ,setText: function(s) {
        if (lzrte.rtemanager.__editor) {
          lzrte.rtemanager.__editor.attr('value', s);
        }
    }

    // Insert html
    ,insertHtml: function(html) {
        if (lzrte.rtemanager.__editor) {
          lzrte.rtemanager.__editor.execCommand("inserthtml", html);
        }
    }
 
    // Retrieve the editor contents
    ,getText: function() {
        var contents;
        if (lzrte.rtemanager.__editor) {
          contents = lzrte.rtemanager.__editor.attr('value');
        }
        return contents;
    }

    // Callback method when the editor content changes. Nothing is generated if the text doesn't change
    // Sends ontext event to lzx
    ,onchange: function(e) {
        var txt = lzrte.rtemanager.getText();
        if (txt != lzrte.rtemanager.__text) {
            // if (console && console.debug) console.debug("onchange:", txt);
            lzrte.rtemanager.__text = txt;
            lzrte.rtemanager.generate_event (lzrte.rtemanager.__frameid, '_text', txt);
        }
    }


    // Generate an event in lzx
    // Note: frame_id is passed in because I have seen cases where the wrong lzrte.rtemanager is called
    // in response to a button click.
    ,generate_event: function(frameid, name,value) {
        //if (console && console.debug) console.debug("lzrte.rtemanager.generate_event", lzrte.rtemanager.__frameid, frameid, name, value);
        //        if (lzrte.rtemanager.__frameid)
        //          lz.embed.iframemanager.asyncCallback (lzrte.rtemanager.__frameid, name, value);
        lz.embed.iframemanager.asyncCallback (frameid, name, value);
    }

    // Callback method when dijit is loaded
    ,editor_loaded: function() {
        //if (console && console.debug) console.debug("rte.editor_loaded");

        lzrte.rtemanager.__loaded = true;
        lzrte.rtemanager.__loading = false;

        //__text is the initial text to show
        lzrte.rtemanager.__rte_start (lzrte.rtemanager.__text);
  
        if (console && console.debug) console.debug("editor_loaded");

        // Generate an on_editorready event. The rte component will send the oneditorready event
        lzrte.rtemanager.generate_event (lzrte.rtemanager.__frameid, '_editorready');
    }

    // Return true if editor is loaded
    ,isLoaded: function() {
        return lzrte.rtemanager.__loaded;
    }

      // Return true if the editor is enabled and running
    ,isEditing: function() {
        return lzrte.rtemanager.__editing;
    }

    // Install a delegate used whenever a button is clicked. The argument
    // to the delegate is the button_id.
    ,set_onclick: function(callback) {
        lzrte.rtemanager.__onclick = callback;
    }

    // Call to initialize() package.
    ,initialize: function() {
        if (console && console.debug) console.debug("initialize");
        if (lzrte.rtemanager.isLoaded())
            return;
        // Install the css and theme
        lzrte.rteloader.loadDojoCSS (document, lzrte.rtemanager.__theme);
        // Load dojo
        lzrte.rteloader.loadDojo (document, lzrte.rtemanager.editor_loaded);
    }

    // Manage plugins

    // Set the list and order of toolbar icons to show in the editor.
    ,setPlugins: function(list) {
        var plugins = list.split (',');
        lzrte.rtemanager.__plugins = plugins;
    }

    // Add a button (or image button) and put at the end of the buttons

    // Remove all buttons from above the rte
    ,removeAllButtons: function() {
        dojo.empty('rte_buttons');
    }

    // Attributes are passed as a json object
    ,addButton: function(attributes) {
        var id = lzrte.rtemanager.__frameid + '_rte_button_' + lzrte.rtemanager.button_counter++;
        var frameid = lzrte.rtemanager.__frameid;

        if (dojo.byId(id))
          dojo.destroy(id);  // We already have a button of this name. Delete it

        // Default attributes
        var attr = {id: id, type: 'button', onclick: function(){ lzrte.rtemanager.generate_event(frameid, 'buttonclick', id);}};
        for (var a in attributes) {
          attr[a] = attributes[a];
        }

        // Create the button
        dojo.create('input', attr, dojo.byId('rte_buttons'), 'last');

        return id;
    }
}