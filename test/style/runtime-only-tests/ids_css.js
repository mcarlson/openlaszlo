/* Copyright 2006 Laszlo Systems */
var philrule = new LzCSSStyleRule();
philrule.selector =  "#gPhilip";
philrule.properties = { miscdata: "san jose state", 
    innercolor: 0x8F008F};
LzCSSStyle._addRule( philrule );


/* Test a selector of the form tag#id */
var arule = new LzCSSStyleRule();
arule.selector = "designerview#gFindMe";
arule.properties = {
    bordercolor: 0x00AA00,
    miscdata: "find me please"
};
LzCSSStyle._addRule( arule );

/*
var tricksterrule = new LzCSSStyleRule();
arule.selector = { attrname: "id", attrvalue: "gFindMe" };
arule.properties = {
    bordercolor: 0xAA0000,
    miscdata: "trickster coyote!"
};
LzCSSStyle._addRule( arule );
*/