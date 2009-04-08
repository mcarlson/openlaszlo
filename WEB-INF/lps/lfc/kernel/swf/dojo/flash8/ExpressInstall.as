/**
 * Based on the expressinstall.as class created by Geoff Stearns as part
 * of the FlashObject library.
 *
 * Use this file to invoke the Macromedia Flash Player Express Install functionality
 * This file is intended for use with the FlashObject embed script. You can download FlashObject 
 * and this file at the following URL: http://blog.deconcept.com/flashobject/
 *
 * Usage: 
 *          var ExpressInstall = new ExpressInstall();
 *          
 *          // test to see if install is needed:
 *          if (ExpressInstall.needsUpdate) { // returns true if update is needed
 *              ExpressInstall.init(); // starts the update
 *          }
 *
 *	NOTE: Your Flash movie must be at least 214px by 137px in order to use ExpressInstall.
 *
 */

class ExpressInstall {
	var needsUpdate = null
	var updater = null
	var hold = null
	
    var time = 0;
    var timeOut = 10;    // expressed in seconds
    var delay = 10;   // expressed in milliseconds

    function ExpressInstall(){
		// does the user need to update?
		this.needsUpdate = (_root.MMplayerType == undefined) ? false : true;	
    }

    function checkLoaded(mc){
        if (mc.startUpdate.toString() == "[type Function]"){
            // updater has loaded successfully
            this.initUpdater();
            this.updater.onEnterFrame = null;
        } else if(this.time > this.timeOut){
            // updater did not load in time, abort load and force alternative content
            this.updater.unloadMovie();
            this.callBack();
        }
        this.time += 1/30;
    }

	function init(){
		this.loadUpdater();
	}

	function loadUpdater(){
		System.security.allowDomain("fpdownload.macromedia.com");
		System.security.allowInsecureDomain("fpdownload.macromedia.com");

		// hope that nothing is at a depth of 10000000, you can change this depth if needed, but you want
		// it to be on top of your content if you have any stuff on the first frame
		this.updater = _root.createEmptyMovieClip("expressInstallHolder", 10000000);

		// register the callback so we know if they cancel or there is an error
		var _self = this;
		this.updater.installStatus = _self.onInstallStatus;
		this.hold = this.updater.createEmptyMovieClip("hold", 1);

		// can't use movieClipLoader because it has to work in 6.0.65
		this.updater.onEnterFrame = function(){
            _self.checkLoaded(this.hold);
		}

		var cacheBuster= Math.random();

		this.hold.loadMovie("http://fpdownload.macromedia.com/pub/flashplayer/"
												+"update/current/swf/autoUpdater.swf?"+ cacheBuster);
	}

	function initUpdater(){
		this.hold.redirectURL = _root.MMredirectURL;
		this.hold.MMplayerType = _root.MMplayerType;
		this.hold.MMdoctitle = _root.MMdoctitle;
		this.hold.startUpdate();
	}

	function onInstallStatus(msg){
        //Debug.write('callBack', "javascript:lz.embed.dojo.installer._onInstallStatus('"+msg+"')");
        _root.getURL("javascript:lz.embed.dojo.installer._onInstallStatus('"+msg+"')");
	}
}

/* X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.          *
* Use is subject to license terms.                                        *
* X_LZ_COPYRIGHT_END ******************************************************/
