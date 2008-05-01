/**
  * LzSoundMC.as
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic AS2
  */

/**
  * Wraps the streaming MP3 loader in a movieclip-like API. 
  * Used for proxyless mp3 audio loading.
  * 
  * @access private
  */
var SoundMC = function(mc) {
    this.init(mc);
    this._playdel = new LzDelegate( this , "testPlay" );
}

SoundMC.prototype = new MovieClip();

SoundMC.prototype._currentframe = 0;
SoundMC.prototype._framesloaded = 0;
SoundMC.prototype._totalframes = 0;
SoundMC.prototype._fps = 30;
SoundMC.prototype.isaudio = true;
SoundMC.prototype.loadstate = 0;

/**
  * @access private
  */
SoundMC.prototype.play = function() {
    var t = this._currentframe / this._fps;
    if (t < 0) t = 0;
    this._sound.stop();
    this._sound.start(t)
    //Debug.write('play mp3', t);
    this._playdel.unregisterAll();
    this._playdel.register( LzIdle, "onidle" );
}

/**
  * @access private
  */
SoundMC.prototype.gotoAndPlay = function(f) {
    this._currentframe = f;
    this.play();
}


/**
  * @access private
  */
SoundMC.prototype.stop = function() {
    this._sound.stop();
    this._playdel.unregisterAll();
    this.testPlay();
}

/**
  * @access private
  */
SoundMC.prototype.gotoAndStop = function(f) {
    this.stop();
    this._currentframe = f;
}


/**
  * @access private
  */
SoundMC.prototype.loadMovie = function( reqstr ) {
    //Debug.warn('SoundMC loading mp3 %w', reqstr);
    this.init();
    this._sound.loadSound(reqstr, true);
    this.loadstate = 1;
    //this._playdel.unregisterAll();
    //this._playdel.register( LzIdle, "onidle" );
}



/**
  * @access private
  */
SoundMC.prototype.getBytesLoaded = function( ) {
    //Debug.warn('getBytesLoaded %w', this._sound.getBytesLoaded());
    this.testPlay();
    return this._sound.getBytesLoaded();
}


/**
  * @access private
  */
SoundMC.prototype.getBytesTotal = function( ) {
    //Debug.warn('getBytesTotal %w', this._sound.getBytesTotal());
    this.testPlay();
    return this._sound.getBytesTotal();
}

/**
  * @access private
  */
SoundMC.prototype.unload = function( ) {
    //Debug.warn('unload %w', this._sound.getBytesTotal());
    this.stop();
    delete this._sound;
    this.loadstate = 0;
}

/**
  * @access private
  */
SoundMC.prototype.testPlay = function(ignore) {
    this._totalframes = Math.floor(this._sound.duration * .001 * this._fps);
    this._currentframe = Math.floor(this._sound.position * .001 * this._fps);
    this._framesloaded = Math.floor((this._sound.getBytesLoaded() / this._sound.getBytesTotal()) * this._totalframes)
    //Debug.write('testPlay ', this._currentframe, this._totalframes, this._framesloaded);
}

/**
  * @access private
  */
SoundMC.prototype.setPan = function(p) {
    //Debug.write('setPan', p);
    this._sound.setPan(p);
}

/**
  * @access private
  */
SoundMC.prototype.setVolume = function(v) {
    //Debug.write('setVolume', v);
    this._sound.setVolume(v);
}

/**
  * @access private
  */
SoundMC.prototype.getPan = function(p) {
    return this._sound.getPan(p);
}

/**
  * @access private
  */
SoundMC.prototype.getVolume = function(v) {
    return this._sound.getVolume(v);
}

/**
  * @access private
  */
SoundMC.prototype.loadDone = function(success) {
    if (success != true) {
        this.loader.owner.owner.resourceloaderror();
        if ($debug) {
            Debug.warn("failed to load %w", this.reqobj.url);
        }
    } else {
        //this.testPlay();
        //Debug.write('done loading');
        this.loadstate = 2;
        this._playdel.unregisterAll();
        this._playdel.register( LzIdle, "onidle" );
    }
}

/**
  * @access private
  */
SoundMC.prototype.init = function(mc) {
    this._sound.stop();
    delete this._sound;
    if (mc != null) {
        this._sound = new Sound(mc);
    } else {
        this._sound = new Sound();
    }
    this._sound.checkPolicyFile = true;
    this._sound.mc = this;
/** @access private */
    this._sound.onLoad = function(success) {
        this.mc.loadDone(success);
    }
/** @access private */
    this._sound.onSoundDone = function() {
        this.mc.testPlay();
    }

    this._playdel.unregisterAll();
    this._currentframe = 0;
    this._totalframes = 0;
    this._framesloaded = 0;
    this.loadstate = 0;
}

/**
  * @access private
  */
SoundMC.prototype.getTotalTime = function() {
    return this._sound.duration * .001;
}

/**
  * @access private
  */
SoundMC.prototype.getCurrentTime = function() {
    return this._sound.position * .001;
}

/**
  * @access private
  */
SoundMC.prototype.seek = function(secs, playing) {
    //Debug.write('seek', secs, playing);
    this._sound.stop();
    this._sound.start(this.getCurrentTime() + secs);
    if (playing != true) this._sound.stop();
}

/**
  * @access private
  */
SoundMC.prototype.getID3 = function() {
    //Debug.write('getID3', this._sound);
    return this._sound.id3;
}
