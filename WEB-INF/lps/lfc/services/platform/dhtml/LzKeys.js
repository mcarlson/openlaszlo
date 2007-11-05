/**
  *
  * @copyright Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @affects lzkeys
  * @access public
  * @topic LFC
  * @subtopic Services
  */

/**
  * LzKeys is a service that provides key handling messages. Objects can also
  * register callbacks to be sent when specific key combinitions are down.
  *
  * @shortdesc Keyboard input service.
  */
var LzKeys = {};
LzKeys.downKeysHash = {};
LzKeys.onkeydown = LzDeclaredEvent;
LzKeys.onkeyup = LzDeclaredEvent;
LzKeys.onmousewheeldelta = LzDeclaredEvent;

/**
  * @field Number mousewheeldelta: the amount the mouse wheel last moved.  Use
  * onmousewheeldelta to learn when this value changes.
  */
LzKeys.mousewheeldelta = 0;

/** @access private */
LzKeys.__keyboardEvent = function(delta, keycode) {
    for (var k in delta) {
        var down = delta[k];
        LzKeys.downKeysHash[k] = down;
        if (keycode) {
            if (down) {
                if (LzKeys.onkeydown.ready) LzKeys.onkeydown.sendEvent(keycode);
            } else {
                if (LzKeys.onkeyup.ready) LzKeys.onkeyup.sendEvent(keycode);
            }    
        }    
    }    
    //Debug.write('__keyboardEvent', delta, LzKeys.downKeysHash);
}    

/** @access private */
LzKeys.__mousewheelEvent = function(delta) {
    LzKeys.mousewheeldelta = delta;
    if (LzKeys.onmousewheeldelta.ready) LzKeys.onmousewheeldelta.sendEvent(delta);
}

LzKeys.isKeyDown = function(k) {
    k = k.toLowerCase();
    //Debug.write('isKeyDown', k, LzKeys.downKeysHash[k]);
    return LzKeys.downKeysHash[k] == true;
}


LzKeys.callOnKeyCombo = function(who, k) {
    //TODO: implement
    if ($debug) {
        Debug.warn("LzKeys.callOnKeyCombo is currently unimplemented");
    }
}    

LzKeyboardKernel.setCallback(LzKeys, '__keyboardEvent');
LzMousewheelKernel.setCallback(LzKeys, '__mousewheelEvent');

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
