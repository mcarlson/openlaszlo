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

#include "kernel/swf/dojo/flash8/ExpressInstall.as"

class DojoExternalInterfaceClass {
	var available = null;
	var flashMethods = [];
	var numArgs = null;
	var argData = null;
	var resultData = null;
	var _id;
	
	function DojoExternalInterfaceClass(id){
		// extract the dojo base path
		//Debug.write('initialize', flash.external.ExternalInterface.addCallback);
		
		// see if we need to do an express install
		var install = new ExpressInstall();
		if(install.needsUpdate){
			install.init();
		}
		this._id = id;
		
		// register our callback functions
		var s = flash.external.ExternalInterface.addCallback("startExec", this, this.startExec);
		//Debug.write('addCallback', s, this, this.startExec);
		flash.external.ExternalInterface.addCallback("setNumberArguments", this, this.setNumberArguments);
		flash.external.ExternalInterface.addCallback("chunkArgumentData", this, this.chunkArgumentData);
		flash.external.ExternalInterface.addCallback("exec", this, this.exec);
		flash.external.ExternalInterface.addCallback("getReturnLength", this, this.getReturnLength);
		flash.external.ExternalInterface.addCallback("chunkReturnData", this, this.chunkReturnData);
		flash.external.ExternalInterface.addCallback("endExec", this, this.endExec);
		
		// set whether communication is available
		DojoExternalInterface.available = flash.external.ExternalInterface.available;
		DojoExternalInterface.call("loaded");
	}
	
	function addCallback(methodName, instance, method) {
		//Debug.write('addCallback', methodName, instance, method);
		// register DojoExternalInterface methodName with it's instance
		this.flashMethods[methodName] = instance;
		
		// tell JavaScript about DojoExternalInterface new method so we can create a proxy
		//Debug.write('calling dojo.flash.comm.' + this._id + "._addExternalInterfaceCallback", methodName, this._id);
		flash.external.ExternalInterface.call("dojo.flash.comm." + this._id + "._addExternalInterfaceCallback", methodName, this._id);
													 
		return true;
	}
	
	function call(methodName, resultsCallback) {
		// we might have any number of optional arguments, so we have to 
		// pass them in dynamically; strip out the results callback
		var parameters = [];
		for(var i = 0; i < arguments.length; i++){
			if(i != 1){ // skip the callback
				parameters.push(arguments[i]);
			}
		}
		
		var results = flash.external.ExternalInterface.call.apply(flash.external.ExternalInterface, parameters);
		
		// immediately give the results back, since ExternalInterface is
		// synchronous
		if(resultsCallback != null && typeof resultsCallback != "undefined"){
			resultsCallback.call(null, results);
		}
	}
	
	/** 
			Called by Flash to indicate to JavaScript that we are ready to have
			our Flash functions called. Calling loaded()
			will fire the dojo.flash.loaded() event, so that JavaScript can know that
			Flash has finished loading and adding its callbacks, and can begin to
			interact with the Flash file.
	*/
	function loaded(){
		DojoExternalInterface.call("dojo.flash.loaded", null, this._id);
		LzBrowserKernel.__jsready();
	}
	
	function startExec(){ 
		//Debug.write('startExec');
		DojoExternalInterface.numArgs = null;
		DojoExternalInterface.argData = null;
		DojoExternalInterface.resultData = null;
	}
	
	function setNumberArguments(numArgs){
		//Debug.write('setNumberArguments', numArgs);
		DojoExternalInterface.numArgs = numArgs;
		DojoExternalInterface.argData = [];
	}
	
	function chunkArgumentData(value, argIndex){
		//Debug.write('chunkArgumentData', value, argIndex);
		//getURL("javascript:dojo.debug('FLASH: chunkArgumentData, value="+value+", argIndex="+argIndex+"')");
		var currentValue = DojoExternalInterface.argData[argIndex];
		if(currentValue == null || typeof currentValue == "undefined"){
			DojoExternalInterface.argData[argIndex] = value;
		}else{
			DojoExternalInterface.argData[argIndex] += value;
		}
	}
	
	function exec(methodName){
		//Debug.write('exec', methodName);
		// decode all of the arguments that were passed in
		for(var i = 0; i < DojoExternalInterface.argData.length; i++){
			DojoExternalInterface.argData[i] = 
				DojoExternalInterface.decodeData(DojoExternalInterface.argData[i]);
		}
		
		var instance = DojoExternalInterface.flashMethods[methodName];
		//Debug.write('instance', instance, instance[methodName]);
		DojoExternalInterface.resultData = instance[methodName].apply(
																			instance, DojoExternalInterface.argData) + '';
		//Debug.write('result', DojoExternalInterface.resultData);
		// encode the result data
		DojoExternalInterface.resultData = 
			DojoExternalInterface.encodeData(DojoExternalInterface.resultData);

		//Debug.write('resultData', DojoExternalInterface.resultData);
			
		//getURL("javascript:dojo.debug('FLASH: encoded result data="+DojoExternalInterface.resultData+"')");
	}
	
	function getReturnLength(){
	 if(DojoExternalInterface.resultData == null || 
	 					typeof DojoExternalInterface.resultData == "undefined"){
	 	return 0;
	 }
	 var segments = Math.ceil(DojoExternalInterface.resultData.length / 1024);
	//Debug.write('getReturnLength', typeof DojoExternalInterface.resultData, DojoExternalInterface.resultData.length, segments);
	 return segments;
	}
	
	function chunkReturnData(segment){
		var numSegments = DojoExternalInterface.getReturnLength();
		var startCut = segment * 1024;
		var endCut = segment * 1024 + 1024;
		if(segment == (numSegments - 1)){
			endCut = segment * 1024 + DojoExternalInterface.resultData.length;
		}
			
		var piece = DojoExternalInterface.resultData.substring(startCut, endCut);
		
		//getURL("javascript:dojo.debug('FLASH: chunking return piece="+piece+"')");
		
		return piece;
	}
	
	function endExec(){
	}
	
	function decodeData(data){
		// we have to use custom encodings for certain characters when passing
		// them over; for example, passing a backslash over as //// from JavaScript
		// to Flash doesn't work
		data = DojoExternalInterface.replaceStr(data, "&custom_backslash;", "\\");
		
		data = DojoExternalInterface.replaceStr(data, "\\\'", "\'");
		data = DojoExternalInterface.replaceStr(data, "\\\"", "\"");
		//Debug.write('decodeData', data);
		
		return data;
	}
	
	function encodeData(data){
		//getURL("javascript:dojo.debug('inside flash, data before="+data+"')");

		// double encode all entity values, or they will be mis-decoded
		// by Flash when returned
		data = DojoExternalInterface.replaceStr(data, "&", "&amp;");
		
		// certain XMLish characters break Flash's wire serialization for
		// ExternalInterface; encode these into a custom encoding, rather than
		// the standard entity encoding, because otherwise we won't be able to
		// differentiate between our own encoding and any entity characters
		// that are being used in the string itself
		data = DojoExternalInterface.replaceStr(data, '<', '&custom_lt;');
		data = DojoExternalInterface.replaceStr(data, '>', '&custom_gt;');
		
		// encode control characters and JavaScript delimiters
		data = DojoExternalInterface.replaceStr(data, "\n", "\\n");
		data = DojoExternalInterface.replaceStr(data, "\r", "\\r");
		data = DojoExternalInterface.replaceStr(data, "\f", "\\f");
		data = DojoExternalInterface.replaceStr(data, "'", "\\'");
		data = DojoExternalInterface.replaceStr(data, '"', '\"');

		//Debug.write('encodeData', data);
		//getURL("javascript:dojo.debug('inside flash, data after="+data+"')");
		return data;
	}
	
	/** 
			Flash ActionScript has no String.replace method or support for
			Regular Expressions! We roll our own very simple one.
	*/
	function replaceStr(inputStr, replaceThis, withThis){
		var splitStr = inputStr.split(replaceThis)
		inputStr = splitStr.join(withThis)
		return inputStr;
	}
	
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
}

/* X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.          *
* Use is subject to license terms.                                        *
* X_LZ_COPYRIGHT_END ******************************************************/

// vim:ts=4:noet:tw=0:
