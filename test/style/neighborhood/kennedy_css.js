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


/* Some of Joe's kids have special professions 
#gJFK {
    occupation: "president";
}
*/ 
var presidentRule = new LzCSSStyleRule();
presidentRule.selector =  "#gJFK";
presidentRule.properties = { occupation: "president"};
LzCSSStyle._addRule( presidentRule );

/*
#gTed {
    occupation: "senator";
}
*/ 
var senatorRule = new LzCSSStyleRule();
senatorRule.selector =  "#gTed";
senatorRule.properties = { occupation: "senator"};
LzCSSStyle._addRule( senatorRule );


/*
#gJFK person {
    occupation: "jetsetter";
}
*/
var jetsetrule = new LzCSSStyleRule();
jetsetrule.selector =  [
    "#gJFK",
    "person" ];
jetsetrule.properties = { occupation: "jetsetter"};
LzCSSStyle._addRule( jetsetrule );

