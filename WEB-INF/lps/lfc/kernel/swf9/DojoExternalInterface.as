/**
    A wrapper around Flash 8's ExternalInterface; DojoExternalInterface is needed so that we
    can do a Flash 6 implementation of ExternalInterface, and be able
    to support having a single codebase that uses DojoExternalInterface
    across Flash versions rather than having two seperate source bases,
    where one uses ExternalInterface and the other uses DojoExternalInterface.
    
    DojoExternalInterface class does a variety of optimizations to bypass ExternalInterface's
    unbelievably bad performance so that we can have good performance
    on Safari; see the blog post
    http://codinginparadise.org/weblog/2006/02/how-to-speed-up-flash-8s.html
    for details.
    
    @author Brad Neuberg, bkn3@columbia.edu
*/

class DojoExternalInterfaceClass {
    #passthrough (toplevel:true) {  
    import flash.external.ExternalInterface;
    }#
    var available :Boolean = false;
    var flashMethods :Object = {};
    var numArgs :* = null;
    var argData :Array = null;
    var resultData :String = null;
//  var installing = false;
    var _id:*;

    function DojoExternalInterfaceClass(id:*){
        // extract the dojo base path
        //Debug.write('initialize', ExternalInterface.addCallback);

        // see if we need to do an express install
/*      var install = new ExpressInstall();
        if(install.needsUpdate){
            install.init();
            this.installing = true;
        }
*/
        // not loaded from the wrapper JS...
        if (id == null) return; 

        this._id = id;

        // register our callback functions
        ExternalInterface.addCallback("startExec", this.startExec);
        ExternalInterface.addCallback("setNumberArguments", this.setNumberArguments);
        ExternalInterface.addCallback("chunkArgumentData", this.chunkArgumentData);
        ExternalInterface.addCallback("exec", this.exec);
        ExternalInterface.addCallback("getReturnLength", this.getReturnLength);
        ExternalInterface.addCallback("chunkReturnData", this.chunkReturnData);
        ExternalInterface.addCallback("endExec", this.endExec);

        // set whether communication is available
        this.available = ExternalInterface.available;
        this.call("loaded");
    }

    function addCallback(methodName:String, instance:*, method:*) :Boolean {
        //Debug.write('addCallback', methodName, instance, method);
        // register DojoExternalInterface methodName with it's instance
        this.flashMethods[methodName] = instance;

        // tell JavaScript about DojoExternalInterface new method so we can create a proxy
        //Debug.write('calling dojo.flash.comm.' + this._id + "._addExternalInterfaceCallback", methodName, this._id);

        /* bypass dojo
        var wrapperCall = function(args) {
            //Debug.write('Called', instance, '.', methodName, 'with', args);
            return instance[methodName].apply(instance, args);
        }
        ExternalInterface.addCallback("dojo.comm." + this._id + "." + methodName, wrapperCall);
        */
        ExternalInterface.call("lz.embed.dojo.comm." + this._id + "._addExternalInterfaceCallback", methodName, this._id);

        return true;
    }

    function call(...args) {
        var methodName:String = args[0];
        var resultsCallback:Function = args[1];

        var parameters:Array = [];
        for(var i:int = 0; i < args.length; i++){
            if(i != 1){ // skip the callback
				// TODO: should do objects and arrays properties also (sigh)
                // \ characters cause problems and need to be escaped. 
				var param = args[i];
				if (typeof param == 'string') {
                    if (param.indexOf("\\") > -1) {
                        param = param.split("\\").join("\\\\")
                    }
				}
                parameters.push(param);
            }
        }

        // we might have any number of optional arguments, so we have to 
        // pass them in dynamically; strip out the results callback
        //Debug.write('Calling', parameters);
        var results:* = ExternalInterface.call.apply(null, parameters);

        // immediately give the results back, since ExternalInterface is
        // synchronous
        if(resultsCallback != null && typeof resultsCallback != "undefined"){
            resultsCallback.call(null, results);
        }
        return results;
    }

    /** 
            Called by Flash to indicate to JavaScript that we are ready to have
            our Flash functions called. Calling loaded()
            will fire the dojo.flash.loaded() event, so that JavaScript can know that
            Flash has finished loading and adding its callbacks, and can begin to
            interact with the Flash file.
    */
    function loaded() :void {
        //Debug.write('loaded');
        //if (this.installing) return;
        this.call("lz.embed.dojo.loaded", null, this._id);
        LzBrowserKernel.__jsready();
    }

    function startExec() :void { 
        //Debug.write('startExec');
        this.numArgs = null;
        this.argData = null;
        this.resultData = null;
    }

    function setNumberArguments(numArgs:Number) :void {
        //Debug.write('setNumberArguments', numArgs);
        this.numArgs = numArgs;
        this.argData = [];
    }

    function chunkArgumentData(value:*, argIndex:int) :void {
        //Debug.write('chunkArgumentData', value, argIndex);
        //getURL("javascript:dojo.debug('FLASH: chunkArgumentData, value="+value+", argIndex="+argIndex+"')");
        var currentValue:* = this.argData[argIndex];
        if(currentValue == null || typeof currentValue == "undefined"){
            this.argData[argIndex] = value;
        } else {
            this.argData[argIndex] += value;
        }
    }

    function exec(methodName:String) :void {
        //Debug.write('exec', methodName);
        // decode all of the arguments that were passed in
        for(var i:int = 0; i < this.argData.length; i++){
            this.argData[i] = this.decodeData(this.argData[i]);
        }

        var instance:* = this.flashMethods[methodName];
        //Debug.write('instance', instance, instance[methodName]);
        this.resultData = String(instance[methodName].apply(instance, this.argData));
        //Debug.write('result', this.resultData);
        // encode the result data
        this.resultData = this.encodeData(this.resultData);

        //Debug.write('resultData', this.resultData);

        //getURL("javascript:dojo.debug('FLASH: encoded result data="+this.resultData+"')");
    }

    function getReturnLength() :Number {
        if(this.resultData == null || 
                        typeof this.resultData == "undefined"){
            return 0;
        }
        var segments:Number = Math.ceil(this.resultData.length / 1024);
        //Debug.write('getReturnLength', typeof this.resultData, this.resultData.length, segments);
        return segments;
    }

    function chunkReturnData(segment:Number) :String {
        var numSegments:Number = this.getReturnLength();
        var startCut:Number = segment * 1024;
        var endCut:Number = segment * 1024 + 1024;
        if(segment == (numSegments - 1)){
            endCut = segment * 1024 + this.resultData.length;
        }

        var piece:String = this.resultData.substring(startCut, endCut);

        //getURL("javascript:dojo.debug('FLASH: chunking return piece="+piece+"')");

        return piece;
    }

    function endExec() :void {
    }

    function decodeData(data:String) :String{
        // we have to use custom encodings for certain characters when passing
        // them over; for example, passing a backslash over as //// from JavaScript
        // to Flash doesn't work
        data = this.replaceStr(data, "&custom_backslash;", "\\");

        data = this.replaceStr(data, "\\\'", "\'");
        data = this.replaceStr(data, "\\\"", "\"");
        //Debug.write('decodeData', data);

        return data;
    }

    function encodeData(data:String) :String {
        //getURL("javascript:dojo.debug('inside flash, data before="+data+"')");

        // double encode all entity values, or they will be mis-decoded
        // by Flash when returned
        data = this.replaceStr(data, "&", "&amp;");

        // certain XMLish characters break Flash's wire serialization for
        // ExternalInterface; encode these into a custom encoding, rather than
        // the standard entity encoding, because otherwise we won't be able to
        // differentiate between our own encoding and any entity characters
        // that are being used in the string itself
        data = this.replaceStr(data, '<', '&custom_lt;');
        data = this.replaceStr(data, '>', '&custom_gt;');

        // encode control characters and JavaScript delimiters
        data = this.replaceStr(data, "\n", "\\n");
        data = this.replaceStr(data, "\r", "\\r");
        data = this.replaceStr(data, "\f", "\\f");
        data = this.replaceStr(data, "'", "\\'");
        data = this.replaceStr(data, '"', '\"');

        //Debug.write('encodeData', data);
        //getURL("javascript:dojo.debug('inside flash, data after="+data+"')");
        return data;
    }

    /** 
            Flash ActionScript has no String.replace method or support for
            Regular Expressions! We roll our own very simple one.
    */
    function replaceStr(inputStr:String, replaceThis:String, withThis:String) :String {
        var splitStr:Array = inputStr.split(replaceThis)
        inputStr = splitStr.join(withThis)
        return inputStr;
    }

    /*
    function getDojoPath(){
        var url = _root._url;
        var start = url.indexOf("baseRelativePath=") + "baseRelativePath=".length;
        var path = url.substring(start);
        var end = path.indexOf("&");
        if(end != -1){
            path = path.substring(0, end);
        }
        return path;
    }
    */
}

/* X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2010 Laszlo Systems, Inc.  All Rights Reserved.          *
* Use is subject to license terms.                                        *
* X_LZ_COPYRIGHT_END ******************************************************/
