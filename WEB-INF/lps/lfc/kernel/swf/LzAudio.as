/**
  * LzAudio.as
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic AS2
  */

/**
  * @shortdesc This service manages audio resource playback.
  * @access public
  * 
  */
var LzAudio = new Object;
{
#pragma "passThrough=true"
LzAudio.globalSound = new Sound();
}
LzAudio.globalSound.$xxx = "globsnd" ;

/**
  * Sets the current sound resource and starts playing it. 
  * @param String snd: Name of a sound resource to play
  */
LzAudio.playSound = function ( snd , t ){
    // Intentionally undocumented 
    // @param Object t: MovieClip for sound to act upon
    #pragma "passThrough=true"
    var s = new Sound(t); 
    s.attachSound(snd);  
    s.start(); 
}

/**
  * Stop playing the current sound
  * */
LzAudio.stopSound = function ( t ){
    // Intentionally undocumented 
    // @param Object t: MovieClip for sound to act upon
    #pragma "passThrough=true"
    var s = new Sound(t); 
    s.stop(); 
}

/**
  * Start playing the current sound
  * */
LzAudio.startSound = function (t) {
    // Intentionally undocumented 
    // @param Object t: MovieClip for sound to act upon
    #pragma "passThrough=true"
    var s = new Sound(t);
    s.start(v);
}

/**
  * @access private
  */
LzAudio.getSoundObject = function (t) {
    if ( t == null ) return this.globalSound;
    if ( t.$snd == null ){
        #pragma "passThrough=true"
        t.$snd = new Sound(t);
    }
    return t.$snd;
}

/**
  * Get the global volume
  * @param Object t: MovieClip for sound to act upon
  * @return Number: volume from 0 to 100 (0 is silent).
  */
LzAudio.getVolume = function (t) {
    // Intentionally undocumented 
    return this.getSoundObject(t).getVolume();
}

/**
  * Set the global volume.
  * @param Number v: linear volume from 0 to 100 (0 is silent).
  */
LzAudio.setVolume = function (v, t) {
    // Intentionally undocumented 
    // @param Object t: MovieClip for sound to act upon
    var s = this.getSoundObject( t );
    s.setVolume(v);
    if (s.getVolume() < 0) {
        s.setVolume(0);
    } else if (s.getVolume() > 100) {
        s.setVolume(100);
    }
}

/**
  * Get the global pan.
  * @return Number: linear pan from -100 to +100 (left to right)
  */
LzAudio.getPan = function (t) {
    // Intentionally undocumented 
    // @param Object t: MovieClip for sound to act upon
    var s = this.getSoundObject( t );
    return s.getPan();
}

/**
  * Set the global pan.
  * @param Number p: linear pan from -100 to +100 (left to right)
  */
LzAudio.setPan = function (p, t) {
    // Intentionally undocumented 
    // @param Object t: MovieClip for sound to act upon
    var s = this.getSoundObject( t );
    s.setPan(p);
    if (s.getPan() < -100) {
        s.setPan(-100);
    } else if (s.getPan() > 100) {
        s.setPan(100);
    }
}
