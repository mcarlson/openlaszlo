//=============================================================================
// DEFINE OBJECT: SoundMC
// Wraps the streaming MP3 loader in a movieclip-like API. 
// Used for proxyless mp3 audio loading.
//
// @keywords private
//=============================================================================
SoundMC = function(mc) {
    this.init();
    this._playdel = new _root.LzDelegate( this , "testPlay" );
}

SoundMC.prototype = new MovieClip();

SoundMC.prototype._currentframe = 0;
SoundMC.prototype._framesloaded = 0;
SoundMC.prototype._totalframes = 0;
SoundMC.prototype._fps = 30;
SoundMC.prototype.isaudio = true;
SoundMC.prototype.loadstate = 0;

//=============================================================================
// @keywords private
//=============================================================================
SoundMC.prototype.play = function() {
    var t = this._currentframe / this._fps;
    if (t < 0) t = 0;
    this._sound.stop();
    this._sound.start(t)
    //_root.Debug.write('play mp3', t);
    this._playdel.unregisterAll();
    this._playdel.register( _root.LzIdle, "onidle" );
}

//=============================================================================
// @keywords private
//=============================================================================
SoundMC.prototype.gotoAndPlay = function(f) {
    this._currentframe = f;
    this.play();
}


//=============================================================================
// @keywords private
//=============================================================================
SoundMC.prototype.stop = function() {
    this._sound.stop();
    this._playdel.unregisterAll();
    this.testPlay();
}

//=============================================================================
// @keywords private
//=============================================================================
SoundMC.prototype.gotoAndStop = function(f) {
    this.stop();
    this._currentframe = f;
}


//=============================================================================
// @keywords private
//=============================================================================
SoundMC.prototype.loadMovie = function( reqstr ) {
    //_root.Debug.warn('SoundMC loading mp3 %w', reqstr);
    this.init();
    this._sound.loadSound(reqstr, true);
    this.loadstate = 1;
    //this._playdel.unregisterAll();
    //this._playdel.register( _root.LzIdle, "onidle" );
}



//=============================================================================
// @keywords private
//=============================================================================
SoundMC.prototype.getBytesLoaded = function( ) {
    //_root.Debug.warn('getBytesLoaded %w', this._sound.getBytesLoaded());
    this.testPlay();
    return this._sound.getBytesLoaded();
}


//=============================================================================
// @keywords private
//=============================================================================
SoundMC.prototype.getBytesTotal = function( ) {
    //_root.Debug.warn('getBytesTotal %w', this._sound.getBytesTotal());
    this.testPlay();
    return this._sound.getBytesTotal();
}

//=============================================================================
// @keywords private
//=============================================================================
SoundMC.prototype.unload = function( ) {
    //_root.Debug.warn('unload %w', this._sound.getBytesTotal());
    this.stop();
    delete this._sound;
    this.loadstate = 0;
}

//=============================================================================
// @keywords private
//=============================================================================
SoundMC.prototype.testPlay = function() {
    this._totalframes = Math.floor(this._sound.duration * .001 * this._fps);
    this._currentframe = Math.floor(this._sound.position * .001 * this._fps);
    this._framesloaded = Math.floor((this._sound.getBytesLoaded() / this._sound.getBytesTotal()) * this._totalframes)
    //_root.Debug.write('testPlay ', this._currentframe, this._totalframes, this._framesloaded);
}

//=============================================================================
// @keywords private
//=============================================================================
SoundMC.prototype.setPan = function(p) {
    //_root.Debug.write('setPan', p);
    this._sound.setPan(p);
}

//=============================================================================
// @keywords private
//=============================================================================
SoundMC.prototype.setVolume = function(v) {
    //_root.Debug.write('setVolume', v);
    this._sound.setVolume(v);
}

//=============================================================================
// @keywords private
//=============================================================================
SoundMC.prototype.getPan = function(p) {
    return this._sound.getPan(p);
}

//=============================================================================
// @keywords private
//=============================================================================
SoundMC.prototype.getVolume = function(v) {
    return this._sound.getVolume(v);
}

//=============================================================================
// @keywords private
//=============================================================================
SoundMC.prototype.loadDone = function(success) {
    if (success != true) {
        if ($debug) {
            _root.Debug.write("WARNING: failed to load " + this.reqobj.url  + '.');
        }
    } else {
        //this.testPlay();
        //_root.Debug.write('done loading');
        this.loadstate = 2;
        this._playdel.unregisterAll();
        this._playdel.register( _root.LzIdle, "onidle" );
    }
}

//=============================================================================
// @keywords private
//=============================================================================
SoundMC.prototype.init = function() {
    this._sound.stop();
    delete this._sound;
    this._sound = new Sound(mc);
    this._sound.mc = this;
    //=============================================================================
    // @keywords private
    //=============================================================================
    this._sound.onLoad = function(success) {
        this.mc.loadDone(success);
    }
    //=============================================================================
    // @keywords private
    //=============================================================================
    this._sound.onSoundDone = function() {
        this.mc.testPlay();
    }

    this._playdel.unregisterAll();
    this._currentframe = 0;
    this._totalframes = 0;
    this._framesloaded = 0;
    this.loadstate = 0;
}

//=============================================================================
// @keywords private
//=============================================================================
SoundMC.prototype.getTotalTime = function() {
    return this._sound.duration * .001;
}

//=============================================================================
// @keywords private
//=============================================================================
SoundMC.prototype.getCurrentTime = function() {
    return this._sound.position * .001;
}

//=============================================================================
// @keywords private
//=============================================================================
SoundMC.prototype.seek = function(secs, playing) {
    //_root.Debug.write('seek', secs, playing);
    this._sound.stop();
    this._sound.start(this.getCurrentTime() + secs);
    if (playing != true) this._sound.stop();
}

//=============================================================================
// @keywords private
//=============================================================================
SoundMC.prototype.getID3 = function() {
    //_root.Debug.write('getID3', this._sound);
    return this._sound.id3;
}
