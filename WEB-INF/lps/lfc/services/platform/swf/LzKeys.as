/**
  *
  * @copyright Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @affects lzbrowser
  * @access public
  * @topic LFC
  * @subtopic Events
  */

/**
  * LzKeys is a service that provides key handling messages. Objects can also
  * register callbacks to be sent when specific key combinitions are down.
  * 
  * <p>Here is a simple example:</p>
  * 
  * <example title="LzKeys">
  * <programlisting>&lt;canvas height="140" debug="true"&gt;
  *   &lt;handler name="onkeydown" reference="LzKeys" args="k"&gt;
  *     Debug.write("key " + k + " down");
  *   &lt;/handler&gt;
  *   &lt;handler name="onkeyup" reference="LzKeys" args="k"&gt;
  *     Debug.write("key " + k + " up");
  *   &lt;/handler&gt;
  *   &lt;method name="pressA"&gt;
  *     Debug.write("A pressed");
  *   &lt;/method&gt;
  *   &lt;handler name="oninit"&gt;
  *     del = new LzDelegate(this, "pressA");
  *     LzKeys.callOnKeyCombo(del, ["A"]);
  *   &lt;/handler&gt; 
  * &lt;/canvas&gt;</programlisting></example>
  *
  * @shortdesc Keyboard input service.
  */
var LzKeys = new Object;

/**
  * A hash where each of the keys that is currently 
  * down on the keyboard is set to true.
  * @type Object
  */
LzKeys.downKeysHash = {};

/**
  * An array of currently pressed key codes.
  * @type [Number]
  */
LzKeys.downKeysArray = [];
LzKeys.keycombos = {};

/**
  * event sent when a key is pressed; sent with keycode 
  * for key that was pressed.
  */
LzKeys.onkeydown = LzDeclaredEvent;
/**
  * event sent whenever a key goes up; sent with keycode
  * for key that was let go.
  */
LzKeys.onkeyup = LzDeclaredEvent;
LzKeys.onmousewheeldelta = LzDeclaredEvent;

LzKeyboardKernel.setCallback(LzKeys, '__keyEvent');
/** @access private */
LzKeys.__keyEvent = function ( delta, k, type ){
    //Debug.write('LzKeys.__keyEvent', delta, k, type);
    if (type == 'onkeydown') {
        this.gotKeyDown(k);
    } else if (type == 'onkeyup') {
        this.gotKeyUp(k);
    }    
}    
    
/**
  * Called whenever a key is pressed with the Flash keycode corresponding to 
  * the down key.
  * 
  * @access private
  * @param Number kC: The Flash keycode for the key that is down.
  * @param string info: if "extra" then ignore if you already got one
  */
LzKeys.gotKeyDown = function ( kC, info ){
    if ( this.downKeysArray.length > 0 ){
        var badkeys = null;

        for ( var i = this.downKeysArray.length-1 ; i >=0; i-- ){
            var dkC = this.downKeysArray[ i ];
            if (  dkC == kC ) continue;

            if ( !Key.isDown( dkC ) ){
                // Trouble here. Browser issues specific to Safari. 
                if ( !badkeys ) badkeys = [];
                badkeys.push( dkC );
            }
        }

        if ( badkeys ){
            for ( var i = badkeys.length-1; i >=0; i-- ){
                this.gotKeyUp( badkeys[ i ] );
            }
        }
    }
    var firstkeydown = !this.downKeysHash[ kC ];
    if (firstkeydown) {
        this.downKeysHash[ kC ] = true;
        this.downKeysArray.push (  kC );
    } 
    // send key down event first, so inputtext will get key event
    // before a command that may change the focus
    if (firstkeydown || info != "extra") {
        // won'tdown || info != "extra") {
        // won't send repeated key events in player XXX ?

        // Workaround for bug lpp-1830; we need to check if the shift
        // key or control keys are stuck down, use Flash isDown
        // routine vefify whether downKeysHash state is correct
        if ($swf8) {
            if (this.downKeysHash[ Key.SHIFT ] && !Key.isDown(Key.SHIFT) 
                && kC != Key.SHIFT) {
                this.gotKeyUp(Key.SHIFT);
            }
            if (this.downKeysHash[ Key.CONTROL ] && !Key.isDown(Key.CONTROL)
                && kC != Key.CONTROL) {
                 this.gotKeyUp(Key.CONTROL);
            }  
        }
        

        // check for IME
        if (this.downKeysHash[229] != true) {
            if (this.onkeydown.ready) this.onkeydown.sendEvent( kC );
        }
    }

    if ( firstkeydown ){
        var cp = this.keycombos;
        var dkeys = this.downKeysArray;
        dkeys.sort();
        for ( var i = 0 ; i < dkeys.length && cp != null ; i++ ){
            cp  = cp[ dkeys[ i ] ];
        }

        if ('delegates' in cp) {
        for ( var i = 0 ; i < cp.delegates.length ; i++ ){
            cp.delegates[ i ].execute( this.downKeysArray );
        }
        }
    }

    /*if ( Selection.getFocus() != null ){
        this.passKeyPress( kC );
    }*/
            
}

/**
  * Called whenever the a key is released with the Flash keycode 
  * corresponding to the up key.
  * 
  * @access private
  * @param Number kC: The Flash keycode for the key that was released.
  */
LzKeys.gotKeyUp = function ( kC ){

    if (!this.downKeysHash[ kC ]) {
        // Debug.write("derived keyDown", kC);
    }
    
    if ( this.downKeysHash[229] != true && !this.downKeysHash[ kC ]) {
        // in FP5 some keys don't get a keydown event, but do get a keyup
        LzKeys.gotKeyDown( kC );
    }

    delete this.downKeysHash[ kC ];

    this.downKeysArray = [];
    for ( var k in this.downKeysHash ){
        this.downKeysArray.push( k );
    }
    if (this.onkeyup.ready) this.onkeyup.sendEvent( kC );

        // Workaround for bug lpp-1830; we need to check if the shift
        // key or control keys are stuck down, use Flash isDown
        // routine vefify whether downKeysHash state is correct
        if ($swf8) {
            if (this.downKeysHash[ Key.SHIFT ] && !Key.isDown(Key.SHIFT) 
                && kC != Key.SHIFT) {
                this.gotKeyUp(Key.SHIFT);
            }
            if (this.downKeysHash[ Key.CONTROL ] && !Key.isDown(Key.CONTROL)
                && kC != Key.CONTROL) {
                 this.gotKeyUp(Key.CONTROL);
            }  
        }
 }

/**
  * @return [Number] : array of keys codes that are currently down
  */
LzKeys.getDownKeys = function (){
    return  this.downkeys
}

/**
  * @return Boolean:  indicating whether the given key is down.
  * @param String k: The name of the key to check for downness or an array of
  * key names (e.g. ['shift', 'tab']
  */
LzKeys.isKeyDown = function ( k ){
    // Workaround for bug lpp-1830; we need to check if the shift
    // key or control keys are stuck down, use Flash isDown
    // routine vefify whether downKeysHash state is correct
    if ($swf8) {
        if (this.downKeysHash[ Key.SHIFT ] && !Key.isDown(Key.SHIFT) 
            && kC != Key.SHIFT) {
                this.gotKeyUp(Key.SHIFT);
         }
         if (this.downKeysHash[ Key.CONTROL ] && !Key.isDown(Key.CONTROL)
            && kC != Key.CONTROL) {
                 this.gotKeyUp(Key.CONTROL);
         }  
    }
    
    if (typeof(k) == "string") {
        return (this.downKeysHash[ this.keyCodes[ k.toLowerCase() ] ] == true);
    } else {
        // an array of keys was passed
        var down = true;
        for (var i=0; i < k.length; i++) {
            down = down && (this.downKeysHash[this.keyCodes[k[i].toLowerCase()]]
                             == true);
        }
        return down;
    }
}

/**
  * Instructs the service to call the given delegate whenever the
  * given key combination is pressed.  
  * The names for recognized special keys are (case-insensitive):
  * <ul>
  * <li>numbpad0 </li>
  * <li>numbpad1 </li>
  * <li>numbpad2 </li>
  * <li>numbpad3 </li>
  * <li>numbpad4 </li>
  * <li>numbpad5 </li>
  * <li>numbpad6 </li>
  * <li>numbpad7 </li>
  * <li>numbpad8 </li>
  * <li>numbpad9 </li>
  * <li>multiply </li>
  * <li>enter </li>
  * <li>subtract </li>
  * <li>decimal </li>
  * <li>divide </li>
  * <li>f1 </li>
  * <li>f2 </li>
  * <li>f3 </li>
  * <li>f4 </li>
  * <li>f5 </li>
  * <li>f6 </li>
  * <li>f7 </li>
  * <li>f8 </li>
  * <li>f9 </li>
  * <li>f10 </li>
  * <li>f11 </li>
  * <li>f12 </li>
  * <li>backspace </li>
  * <li>tab </li>
  * <li>clear </li>
  * <li>enter </li>
  * <li>shift </li>
  * <li>control </li>
  * <li>alt </li>
  * <li>capslock </li>
  * <li>esc </li>
  * <li>spacebar </li>
  * <li>pageup </li>
  * <li>pagedown </li>
  * <li>end </li>
  * <li>home </li>
  * <li>leftarrow </li>
  * <li>uparrow </li>
  * <li>rightarrow </li>
  * <li>downarrow </li>
  * <li>insert </li>
  * <li>help </li>
  * <li>numlock </li>
  * <li>add </li>
  * <li>delete </li>
  * <li>0 </li>
  * <li>1 </li>
  * <li>2 </li>
  * <li>3 </li>
  * <li>4 </li>
  * <li>5 </li>
  * <li>6 </li>
  * <li>7 </li>
  * <li>8 </li>
  * <li>9 </li>
  * <li>[ </li>
  * <li>@ </li>
  * <li># </li>
  * <li>$ </li>
  * <li>% </li>
  * <li>^ </li>
  * <li>&amp; </li>
  * <li>* </li>
  * <li>* </li>
  * <li>( </li>
  * <li>) </li>
  * <li>; </li>
  * <li>: </li>
  * <li>= </li>
  * <li>+ </li>
  * <li>- </li>
  * <li>_ </li>
  * <li>/ </li>
  * <li>? </li>
  * <li>~ </li>
  * <li>[ </li>
  * <li>{ </li>
  * <li>\ </li>
  * <li>| </li>
  * <li>] </li>
  * <li>} </li>
  * <li>" </li>
  * <li>' </li>
  *  </ul>
  * @param LzDelegate d: The delegate to be called when the keycombo is down.
  * @param [String] kCArr: Array of strings indicating which keys constitute the
  * keycombo. This array may be in any order.
  */
LzKeys.callOnKeyCombo = function ( d , kCArr ){

    var kcSorted = [];
    for (var i = 0; i < kCArr.length; i++ ){
        kcSorted.push( this.keyCodes[ kCArr[ i ].toLowerCase() ] );
    }
    
    kcSorted.sort();
    
    var cp = this.keycombos;
    for ( var i = 0 ; i < kcSorted.length; i++ ){

        if ( cp[ kcSorted[ i ] ] == null ){
            cp[ kcSorted[ i ] ] = {};
            cp[ kcSorted[ i ] ].delegates = [ ];
        }
        cp  = cp[ kcSorted[ i ] ];
    }
    cp.delegates.push( d );
}
                        
/**
  * Removes the request to call the delegate on the keycombo. 
  * @param LzDelegate d: The delegate that was to be called when the 
  * keycombo was down.
  * @param [String] kCArr: An array of strings indicating which keys 
  * constituted the keycombo.
  */
LzKeys.removeKeyComboCall = function ( d , kCArr ){
    var kcSorted = [];
    for (var i = 0; i < kCArr.length; i++ ){
        kcSorted.push( this.keyCodes[ kCArr[ i ].toLowerCase() ] );
    }
    kcSorted.sort();

    var cp = this.keycombos;
    for ( var i = 0 ; i < kcSorted.length; i++ ){
        if ( cp[ kcSorted[ i ] ] == null ){
            return false; //error
        }
        cp  = cp[ kcSorted[ i ] ];
    }
    for ( var i = cp.delegates.length-1 ; i >=0; i-- ){
        if ( cp.delegates[ i ] == d ){
            cp.delegates.splice( i , 1 );
        }
    }
}

/**
  * @access private
  */
LzKeys.enableEnter = function ( onroff ){
  //Debug.write("enableEnter: "+onroff);
  // SWF-specific
  _root.entercontrol.gotoAndStop( onroff ? 1 : 2 );
}

/**
  * A hash that maps key names to key codes.
  * @type Object
  */
LzKeys.keyCodes = {
a : 65 ,
b : 66 ,
c : 67 ,
d : 68 ,
e : 69 ,
f : 70 ,
g : 71 ,
h : 72 ,
i : 73 ,
j : 74 ,
k : 75 ,
l : 76 ,
m : 77 ,
n : 78 ,
o : 79 ,
p : 80 ,
q : 81 ,
r : 82 ,
s : 83 ,
t : 84 ,
u : 85 ,
v : 86 ,
w : 87 ,
x : 88 ,
y : 89 ,
z : 90 ,
numbpad0 : 96 ,
numbpad1 : 97 ,
numbpad2 : 98 ,
numbpad3 : 99 ,
numbpad4 : 100 ,
numbpad5 : 101 ,
numbpad6 : 102 ,
numbpad7 : 103 ,
numbpad8 : 104 ,
numbpad9 : 105 ,
multiply : 106 ,
enter : 13 ,
subtract : 109 ,
decimal : 110 ,
divide : 111 ,
f1 : 112 ,
f2 : 113 ,
f3 : 114 ,
f4 : 115 ,
f5 : 116 ,
f6 : 117 ,
f7 : 118 ,
f8 : 119 ,
f9 : 120 ,
f10 : 121 ,
f11 : 122 ,
f12 : 123 ,
backspace : 8 ,
tab : 9 ,
clear : 12 ,
enter : 13 ,
shift : 16 ,
control : 17 ,
alt : 18 ,
capslock : 20 ,
esc : 27 ,
spacebar : 32 ,
pageup : 33 ,
pagedown : 34 ,
end : 35 ,
home : 36 ,
leftarrow : 37 ,
uparrow : 38 ,
rightarrow : 39 ,
downarrow : 40 ,
insert : 45 ,
help : 47 ,
numlock : 144
}

LzKeys.keyCodes['add'] = 107;
// Backspace doesn't work in the Authoring tool player...
LzKeys.keyCodes['delete'] = 46;
LzKeys.keyCodes['0']  = 48 ;
LzKeys.keyCodes['1']  = 49 ;
LzKeys.keyCodes['2']  = 50 ;
LzKeys.keyCodes['3']  = 51 ;
LzKeys.keyCodes['4']  = 52 ;
LzKeys.keyCodes['5']  = 53 ;
LzKeys.keyCodes['6']  = 54 ;
LzKeys.keyCodes['7']  = 55 ;
LzKeys.keyCodes['8']  = 56 ;
LzKeys.keyCodes['9']  = 57 ;

LzKeys.keyCodes[')']  = 48 ;
LzKeys.keyCodes['!']  = 49 ;
LzKeys.keyCodes['@']  = 50 ;
LzKeys.keyCodes['#']  = 51 ;
LzKeys.keyCodes['$']  = 52 ;
LzKeys.keyCodes['%']  = 53 ;
LzKeys.keyCodes['^']  = 54 ;
LzKeys.keyCodes['&']  = 55 ;
LzKeys.keyCodes['*']  = 56 ;
LzKeys.keyCodes['(']  = 57 ;

LzKeys.keyCodes[';']  = 186 ;
LzKeys.keyCodes[':']  = 186 ;
LzKeys.keyCodes['=']  = 187 ;
LzKeys.keyCodes['+']  = 187 ;

LzKeys.keyCodes['<']  = 188 ;
LzKeys.keyCodes[',']  = 188 ;
LzKeys.keyCodes['-']  = 189 ;
LzKeys.keyCodes['_']  = 189; 
LzKeys.keyCodes['>']  = 190 ;
LzKeys.keyCodes['.']  = 190 ;
LzKeys.keyCodes['/']  = 191 ;
LzKeys.keyCodes['?']  = 191 ;

LzKeys.keyCodes['`']  = 192 ;
LzKeys.keyCodes['~']  = 192 ;
LzKeys.keyCodes['[']  = 219 ;
LzKeys.keyCodes['{']  = 219 ;
LzKeys.keyCodes['\\']  = 220 ;
LzKeys.keyCodes['|']  =  220; 
LzKeys.keyCodes[']']  = 221 ;
LzKeys.keyCodes['}']  = 221 ;
LzKeys.keyCodes['\"']  = 222 ;
LzKeys.keyCodes['\'']  = 222 ;

LzKeys.keyCodes['IME']  = 229 ;

//for ( ks in LzKeys.keyCodes ){
//    trace ( ks add " :  " add LzKeys.keyCodes[ ks ] );
//}


/** @access private */
var mouseListener = new Object();

/**
  * @field Number mousewheeldelta: the amount the mouse wheel last moved.  Use
  * onmousewheeldelta to learn when this value changes.
  */
LzKeys.mousewheeldelta = 0;

/** @access private */
LzKeys.__mousewheelEvent = function(d) {
    this.mousewheeldelta = d;
    if (this.onmousewheeldelta.ready) this.onmousewheeldelta.sendEvent(d);
}

/**
  * @access private
  */
mouseListener.onMouseWheel = function(d) {
    LzKeys.__mousewheelEvent(d);
}
// SWF-specific
Mouse.addListener(mouseListener);

