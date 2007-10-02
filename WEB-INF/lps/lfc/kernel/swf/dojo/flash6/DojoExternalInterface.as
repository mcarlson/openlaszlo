/** 
		An implementation of Flash 8's ExternalInterface that works with Flash 6
		and which is source-compatible with Flash 8. 
		
		@author Brad Neuberg, bkn3@columbia.edu 
*/

class DojoExternalInterfaceClass {
	var available;
	var dojoPath = "";
	var _fscommandReady = false;
	var _callbacks = [];

	function initialize(){ 
		//getURL("javascript:alert('FLASH:DojoExternalInterface initialize')");
		//Debug.write('DojoExternalInterface.initialize()');
		// FIXME: Set available variable by testing for capabilities
		DojoExternalInterface.available = true;
		
		// extract the dojo base path
		DojoExternalInterface.dojoPath = DojoExternalInterface.__getDojoPath();
		//getURL("javascript:alert('FLASH:dojoPath="+DojoExternalInterface.dojoPath+"')");
		//Debug.write('DojoExternalInterface.dojoPath', DojoExternalInterface.dojoPath);
		
		// Sometimes, on IE, the fscommand infrastructure can take a few hundred
		// milliseconds the first time a page loads. Set a timer to keep checking
		// to make sure we can issue fscommands; otherwise, our calls to fscommand
		// for setCallback() and loaded() will just "disappear"
		_root.fscommandReady = false;
		var fsChecker = function(){
			// issue a test fscommand
			fscommand('fscommandReady', '');
			//getURL("javascript:alert('FLASH:fsChecker')");
			
			// JavaScript should set _root.fscommandReady if it got the call
			if(_root.fscommandReady == "true"){
				//getURL("javascript:alert('FLASH:fscommandReady')");

				DojoExternalInterface._fscommandReady = true;
				clearInterval(_root.fsTimer);
			}
		};
		_root.fsTimer = setInterval(fsChecker, 100);
	}
	
	function addCallback(methodName, instance, method) {
		// A variable that indicates whether the call below succeeded
		_root._succeeded = null;
		
		// Callbacks are registered with the JavaScript side as follows.
		// On the Flash side, we maintain a lookup table that associates
		// the methodName with the actual instance and method that are
		// associated with this method.
		// Using fscommand, we send over the action "addCallback", with the
		// argument being the methodName to add, such as "foobar".
		// The JavaScript takes these values and registers the existence of
		// this callback point.
		
		// precede the method name with a _ character in case it starts
		// with a number
		DojoExternalInterface._callbacks["_" + methodName] = {_instance: instance, _method: method};
		DojoExternalInterface._callbacks[DojoExternalInterface._callbacks.length] = methodName;
		//getURL("javascript:alert('FLASH:addCallback"+ methodName + ', ' + DojoExternalInterface._callbacks.length +"')");
		
		// The API for ExternalInterface says we have to make sure the call
		// succeeded; check to see if there is a value 
		// for _succeeded, which is set by the JavaScript side
		if(_root._succeeded == null){
			return false;
		}else{
			return true;
		}
	}
	
	function call(methodName, resultsCallback) {
		// FIXME: support full JSON serialization
		
		// First, we pack up all of the arguments to this call and set them
		// as Flash variables, which the JavaScript side will unpack using
		// plugin.GetVariable(). We set the number of arguments as "_numArgs",
		// and add each argument as a variable, such as "_1", "_2", etc., starting
		// from 0.
		// We then execute an fscommand with the action "call" and the
		// argument being the method name. JavaScript takes the method name,
		// retrieves the arguments using GetVariable, executes the method,
		// and then places the return result in a Flash variable
		// named "_returnResult".
		_root._numArgs = arguments.length - 2;
		for(var i = 2; i < arguments.length; i++){
			var argIndex = i - 2;
			_root["_" + argIndex] = arguments[i];
		}
		
		_root._returnResult = undefined;
		fscommand("call", methodName);
		//Debug.write("call", methodName, resultsCallback);
		
		// immediately return if the caller is not waiting for return results
		if(resultsCallback == undefined || resultsCallback == null){
			return;
		}
		
		// check at regular intervals for return results	
		var resultsChecker = function resultsChecker(){
			if((typeof _root._returnResult != "undefined")&&
				(_root._returnResult != "undefined")){
				clearInterval(_root._callbackID);
				_root._callbackID = null;
				//Debug.write('resultsChecker clear', _root._callbackID);
				resultsCallback.call(null, _root._returnResult);
			}
		};	
		_root._callbackID = setInterval(resultsChecker, 100);
	}
	
	/** 
			Called by Flash to indicate to JavaScript that we are ready to have
			our Flash functions called. Calling loaded()
			will fire the dojo.flash.loaded() event, so that JavaScript can know that
			Flash has finished loading and adding its callbacks, and can begin to
			interact with the Flash file.
	*/
	function loaded(){
		//getURL("javascript:alert('FLASH:loaded')");
		//Debug.write('DojoExternalInterface.loaded');
		
		// one more step: see if fscommands are ready to be executed; if not,
		// set an interval that will keep running until fscommands are ready;
		// make sure the gateway is loaded as well
		var execLoaded = function(){
			if(DojoExternalInterface._fscommandReady == true){
				clearInterval(_root.loadedInterval);
				//getURL("javascript:alert('FLASH:ready')");
				
				// initialize the small Flash file that helps gateway JS to Flash
				// calls
				DojoExternalInterface._initializeFlashRunner();
			}	
		};
		
		if(_fscommandReady == true){
			execLoaded();
		}else{
			_root.loadedInterval = setInterval(execLoaded, 50);
		}
	}
	
	/** 
			Handles and executes a JavaScript to Flash method call. Used by
			initializeFlashRunner. 
	*/
	function _handleJSCall(){
		// get our parameters
		var numArgs = parseInt(_root._numArgs);
		var jsArgs = [];
		for(var i = 0; i < numArgs; i++){
			var currentValue = _root["_" + i];
			jsArgs.push(currentValue);
		}
		
		// get our function name
		var functionName = _root._functionName;
		
		// now get the actual instance and method object to execute on,
		// using our lookup table that was constructed by calls to
		// addCallback on initialization
		var instance = DojoExternalInterface._callbacks["_" + functionName]._instance;
		var method = DojoExternalInterface._callbacks["_" + functionName]._method;
		
		//Debug.write('_handleJSCall', instance, method);
		// execute it
		var results = method.apply(instance, jsArgs);
		
		// return the results
		_root._returnResult = results;
	}
	
	/** Called by the flash6_gateway.swf to indicate that it is loaded. */
	function _gatewayReady(){
		//Debug.write('_gatewayReady');
		//getURL("javascript:alert('FLASH: gateway ready')");
		for(var i = 0; i < DojoExternalInterface._callbacks.length; i++){
			fscommand("addCallback", DojoExternalInterface._callbacks[i]);
			//Debug.write('addCallback', DojoExternalInterface._callbacks[i]);
		}
		DojoExternalInterface.call("dojo.flash.loaded");
		LzBrowser.__jsready();
	}
	
	/** 
			When JavaScript wants to communicate with Flash it simply sets
			the Flash variable "_execute" to true; this method creates the
			internal Movie Clip, called the Flash Runner, that makes this
			magic happen.
	*/
	function _initializeFlashRunner(){
		// figure out where our Flash movie is
		var swfLoc = DojoExternalInterface.dojoPath + "/flash6_gateway.swf";
		
		// load our gateway helper file
		//_root.createEmptyMovieClip("flashRunner", 199);
		_root.attachMovie('__LZjsevent', 'flashRunner', 7);
		//c._lockroot = true;
		//Debug.write('flashRunner attached', _root.flashRunner);
		//getURL("javascript:alert('FLASH:loading "+ swfLoc +"')");
	}
	
	function __getDojoPath(){
		return _root.baseRelativePath;

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
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.          *
* Use is subject to license terms.                                        *
* X_LZ_COPYRIGHT_END ******************************************************/

// vim:ts=4:noet:tw=0:
