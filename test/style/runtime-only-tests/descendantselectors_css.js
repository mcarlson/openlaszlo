//Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.

/*
    [ id="gJoeSr"] { 
        occupation: "politician";
    }
*/
var idrule = new LzCSSStyleRule();
idrule.selector =  { attrname: "id", attrvalue: "gJoeSr" };
idrule.properties = { occupation: "politician"};
LzCSSStyle._addRule( idrule );

/*
  All descendants of Joe Sr are politicians
  [id="gJoeSr"] person {
      occupation: "politician";
  }
*/ 
var descendantrule = new LzCSSStyleRule();
descendantrule.selector =  [
    { attrname: "id", attrvalue: "gJoeSr" }, 
    "person" ];
descendantrule.properties = { occupation: "politician"};
LzCSSStyle._addRule( descendantrule );

