/**
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
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
dynamic public class LzKeys {

    /**
     * A hash where each of the keys that is currently 
     * down on the keyboard is set to true.
     * @type Object
     */
    static var downKeysHash = {};

    /**
     * An array of currently pressed key codes.
     * @type [Number]
     */
    static var downKeysArray = [];
    static var keycombos = {};

    /**
     * event sent when a key is pressed; sent with keycode 
     * for key that was pressed.
     */
    static var onkeydown = LzDeclaredEvent;
    /**
     * event sent whenever a key goes up; sent with keycode
     * for key that was let go.
     */
    static var onkeyup = LzDeclaredEvent;
    static var onmousewheeldelta = LzDeclaredEvent;


    /** @access private */
    static static function __keyEvent ( delta, k, type ){
        //Debug.write('LzKeys.__keyEvent', delta, k, type);
        if (type == 'onkeydown') {
            gotKeyDown(k);
        } else if (type == 'onkeyup') {
            gotKeyUp(k);
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
    static function gotKeyDown ( kC, info = null ){
        if ( downKeysArray.length > 0 ){
            var badkeys = null;

            for ( var i = downKeysArray.length-1 ; i >=0; i-- ){
                var dkC = downKeysArray[ i ];
                if (  dkC == kC ) continue;
            }
        }
        var firstkeydown = !downKeysHash[ kC ];
        if (firstkeydown) {
            downKeysHash[ kC ] = true;
            downKeysArray.push (  kC );
        } 
        // send key down event first, so inputtext will get key event
        // before a command that may change the focus
        if (firstkeydown || info != "extra") {
            // won'tdown || info != "extra") {
            // won't send repeated key events in player XXX ?

            // check for IME
            if (downKeysHash[229] != true) {
                if (onkeydown.ready) onkeydown.sendEvent( kC );
            }
        }

        if ( firstkeydown ){
            var cp = keycombos;
            var dkeys = downKeysArray;
            dkeys.sort();
            for ( var i = 0 ; i < dkeys.length && cp != null ; i++ ){
                cp  = cp[ dkeys[ i ] ];
            }

            if (cp != null && 'delegates' in cp) {
                for ( var i = 0 ; i < cp.delegates.length ; i++ ){
                    cp.delegates[ i ].execute( downKeysArray );
                }
            }
        }

        /*if ( Selection.getFocus() != null ){
          passKeyPress( kC );
          }*/
            
    }

    /**
     * Called whenever the a key is released with the Flash keycode 
     * corresponding to the up key.
     * 
     * @access private
     * @param Number kC: The Flash keycode for the key that was released.
     */
    static function gotKeyUp ( kC ){

        if (!downKeysHash[ kC ]) {
            // Debug.write("derived keyDown", kC);
        }
    
        if ( downKeysHash[229] != true && !downKeysHash[ kC ]) {
            // in FP5 some keys don't get a keydown event, but do get a keyup
            LzKeys.gotKeyDown( kC );
        }

        delete downKeysHash[ kC ];

        downKeysArray = [];
        for ( var k in downKeysHash ){
            downKeysArray.push( k );
        }
        if (onkeyup.ready) onkeyup.sendEvent( kC );

    }

    /**
     * @return Boolean:  indicating whether the given key is down.
     * @param String k: The name of the key to check for downness or an array of
     * key names (e.g. ['shift', 'tab']
     */
    static function isKeyDown ( k ){
        if (typeof(k) == "string") {
            return (downKeysHash[ keyCodes[ k.toLowerCase() ] ] == true);
        } else {
            // an array of keys was passed
            var down = true;
            for (var i=0; i < k.length; i++) {
                down = down && (downKeysHash[keyCodes[k[i].toLowerCase()]]
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
    static function callOnKeyCombo ( d , kCArr ){

        var kcSorted = [];
        for (var i = 0; i < kCArr.length; i++ ){
            kcSorted.push( keyCodes[ kCArr[ i ].toLowerCase() ] );
        }
    
        kcSorted.sort();
    
        var cp = keycombos;
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
    static function removeKeyComboCall ( d , kCArr ){
        var kcSorted = [];
        for (var i = 0; i < kCArr.length; i++ ){
            kcSorted.push( keyCodes[ kCArr[ i ].toLowerCase() ] );
        }
        kcSorted.sort();

        var cp = keycombos;
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
    static function enableEnter ( onroff ){
        //Debug.write("enableEnter: "+onroff);
        // SWF-specific
        Debug.write('LzKeys.enableEnter not yet defined in swf9');
        // TODO [hqm 2008-01] What is the way to do this in SWF9 ??
        /*   _root.entercontrol.gotoAndStop( onroff ? 1 : 2 );
         */
    }

    /**
     * A hash that maps key names to key codes.
     * @type Object
     */
    static var keyCodes = {
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

         keyCodes['add'] = 107;
    // Backspace doesn't work in the Authoring tool player...
    keyCodes['delete'] = 46;
    keyCodes['0']  = 48 ;
    keyCodes['1']  = 49 ;
    keyCodes['2']  = 50 ;
    keyCodes['3']  = 51 ;
    keyCodes['4']  = 52 ;
    keyCodes['5']  = 53 ;
    keyCodes['6']  = 54 ;
    keyCodes['7']  = 55 ;
    keyCodes['8']  = 56 ;
    keyCodes['9']  = 57 ;

    keyCodes[')']  = 48 ;
    keyCodes['!']  = 49 ;
    keyCodes['@']  = 50 ;
    keyCodes['#']  = 51 ;
    keyCodes['$']  = 52 ;
    keyCodes['%']  = 53 ;
    keyCodes['^']  = 54 ;
    keyCodes['&']  = 55 ;
    keyCodes['*']  = 56 ;
    keyCodes['(']  = 57 ;

    keyCodes[';']  = 186 ;
    keyCodes[':']  = 186 ;
    keyCodes['=']  = 187 ;
    keyCodes['+']  = 187 ;

    keyCodes['<']  = 188 ;
    keyCodes[',']  = 188 ;
    keyCodes['-']  = 189 ;
    keyCodes['_']  = 189; 
    keyCodes['>']  = 190 ;
    keyCodes['.']  = 190 ;
    keyCodes['/']  = 191 ;
    keyCodes['?']  = 191 ;

    keyCodes['`']  = 192 ;
    keyCodes['~']  = 192 ;
    keyCodes['[']  = 219 ;
    keyCodes['{']  = 219 ;
    keyCodes['\\']  = 220 ;
    keyCodes['|']  =  220; 
    keyCodes[']']  = 221 ;
    keyCodes['}']  = 221 ;
    keyCodes['\"']  = 222 ;
    keyCodes['\'']  = 222 ;

    keyCodes['IME']  = 229 ;

    //for ( ks in keyCodes ){
    //    trace ( ks add " :  " add keyCodes[ ks ] );
    //}

    /**
     * @field Number mousewheeldelta: the amount the mouse wheel last moved.  Use
     * onmousewheeldelta to learn when this value changes.
     */
    static var mousewheeldelta = 0;

    /** @access private */
    static function __mousewheelEvent (d) {
        mousewheeldelta = d;
        if (onmousewheeldelta.ready) onmousewheeldelta.sendEvent(d);
    }

}

