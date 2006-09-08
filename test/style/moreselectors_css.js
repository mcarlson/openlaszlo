//Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.

/*
    [ id="davidtemkin"] { 
        haircolor: brown;
        occupation: "CTO";
    }
*/
var idrule = new LzCSSStyleRule();
idrule.selector =  { attrname: "id", attrvalue: "gDavidtemkin" };
idrule.properties = { haircolor: "brown", occupation: "CTO"};
LzCSSStyle._addRule( idrule );

var namerule = new LzCSSStyleRule();
namerule.selector =  { attrname: "name", attrvalue: "michaelgovern" };
namerule.properties = { haircolor: "blonde", occupation: "monarch"};
LzCSSStyle._addRule( namerule );

var attrvalrule = new LzCSSStyleRule();
attrvalrule.selector =  { attrname: "width", attrvalue: "200" };
attrvalrule.properties = { eyecolor : "paleblue" };
LzCSSStyle._addRule( attrvalrule );

var attrvalrule = new LzCSSStyleRule();
attrvalrule.selector =  { attrname: "height", attrvalue: "100" };
attrvalrule.properties = { eyecolor : "redrum" };
LzCSSStyle._addRule( attrvalrule );

var everythingrule = new LzCSSStyleRule();
everythingrule.selector = "*";
everythingrule.properties = { groovy: true,  kingdom: "mammal" };
LzCSSStyle._addRule( everythingrule );
