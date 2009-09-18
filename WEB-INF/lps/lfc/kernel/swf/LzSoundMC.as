/**
  * LzSoundMC.as
  *
  * @copyright Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic AS2
  */

/**
  * Wraps the streaming MP3 loader in a movieclip-like API. 
  * Used for mp3 audio loading.
  * 
  * @access private
  */
var SoundMC = function (mc) {
    this.init(mc);
}

SoundMC.prototype = new MovieClip();

// the attached flash Sound object
SoundMC.prototype._sound = null;
// flag required for loader
SoundMC.prototype.isaudio = true;
// tracks the loading progress
SoundMC.prototype.loadstate = 0;
// next frame to be played
SoundMC.prototype._nextframe = -1;

SoundMC.prototype.addProperty("_totalframes", function () {
    return Math.floor(this._sound.duration * .001 * canvas.framerate) || 0;
}, null);

SoundMC.prototype.addProperty("_currentframe", function () {
    if (this._nextframe != -1) {
        return this._nextframe;
    } else {
        return Math.floor(this._sound.position * .001 * canvas.framerate) || 0;
    }
}, null);

SoundMC.prototype.addProperty("_framesloaded", function () {
    return Math.floor((this._sound.getBytesLoaded() / this._sound.getBytesTotal()) * this._totalframes) || 0;
}, null);

/**
  * @access private 
  */
SoundMC.prototype.play = function (direct=false) {
    // if we're not seeking to a specific frame and we're at the end already, start at the beginning
    if (direct != true && this._currentframe == this._totalframes) {
        var t = 0;
    } else {
        var t = this._currentframe / canvas.framerate;
        if (t < 0) t = 0;
    }
    this._nextframe = -1;
    this._sound.stop();
    this._sound.start(t);
}

/**
  * @access private
  */
SoundMC.prototype.gotoAndPlay = function (f) {
    this._nextframe = f;
    this.play(true);
}

/**
  * @access private
  */
SoundMC.prototype.stop = function () {
    this._sound.stop();
}

/**
  * @access private
  */
SoundMC.prototype.gotoAndStop = function (f) {
    this.stop();
    this._nextframe = f;
}

/**
  * @access private
  */
SoundMC.prototype.loadMovie = function (url, method) {
    if ($debug) {
        if (method == "POST") {
            Debug.warn("You cannot use POST for audio loading ('%s')", url);
        }
    }
    this.init();
    this._sound.loadSound(url, true);
    this.loadstate = 1;
}

/**
  * @access private
  */
SoundMC.prototype.unloadMovie = function () {
    this._sound.stop();
    delete this._sound.onLoad;
    // try to cancel streaming, don't use loadSound(null) although it's often
    // suggested for this purpose, it'll start a download from "%APP_URL%/null".
    // using the empty string stops the current download and won't create a new
    // one (at least according to firebug's network control).
    this._sound.loadSound("");
    delete this._sound;
    this.loadstate = 0;
}

/**
  * @access private
  */
SoundMC.prototype.getBytesLoaded = function () {
    return this._sound.getBytesLoaded();
}

/**
  * @access private
  */
SoundMC.prototype.getBytesTotal = function () {
    return this._sound.getBytesTotal();
}

/**
  * Alias for unloadMovie
  * @access private
  */
SoundMC.prototype.unload = SoundMC.prototype.unloadMovie;

/**
  * @access private
  */
SoundMC.prototype.setPan = function (p) {
    this._sound.setPan(p);
}

/**
  * @access private
  */
SoundMC.prototype.setVolume = function (v) {
    this._sound.setVolume(v);
}

/**
  * @access private
  */
SoundMC.prototype.getPan = function () {
    return this._sound.getPan();
}

/**
  * @access private
  */
SoundMC.prototype.getVolume = function () {
    return this._sound.getVolume();
}

/**
  * @access private
  */
SoundMC.prototype.loadDone = function (success) {
    // @devnote Loading invalid files still results in a successful load,
    // therefore check duration to identify valid mp3-files (LPP-7880)
    if (success != true || this._sound.duration == 0) {
        this.loader.doError(this.loader.mc, "failed to load " + this.reqobj.url);
    } else {
        this.loadstate = 2;
    }
}

/**
  * @access private
  */
SoundMC.prototype.init = function (mc) {
    // clear previous _sound
    this.unloadMovie();
    if (mc != null) {
        this._sound = new Sound(mc);
    } else {
        this._sound = new Sound();
    }
    this._sound.checkPolicyFile = true;
    this._sound.mc = this;
/** @access private */
    this._sound.onLoad = function (success) {
        this.mc.loadDone(success);
    }
/** @access private */
    this._sound.onSoundComplete = function () {
    }

    this.loadstate = 0;
}

/**
  * @access private
  */
SoundMC.prototype.getTotalTime = function () {
    return this._sound.duration * .001;
}

/**
  * @access private
  */
SoundMC.prototype.getCurrentTime = function () {
    // use _nextframe if the sound was stopped at a specific frame, cf. gotoAndStop
    if (this._nextframe != -1) {
        return this._nextframe / canvas.framerate;
    } else {
        return this._sound.position * .001;
    }
}

/**
  * @access private
  */
SoundMC.prototype.seek = function (secs, playing) {
    this._sound.stop();
    this._sound.start(this.getCurrentTime() + secs);
    if (playing != true) {
        this._sound.stop();
        // LzLoader -> LzSprite
        this.loader.owner.updatePlayStatus();
    }
}

/**
  * @access private
  */
SoundMC.prototype.getID3 = function () {
    return this._sound.id3;
}
