//Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.

/*
    simplestyled { 
        foo : bar;
    }
*/
var simpleststyle = new LzCSSStyleRule();
simpleststyle.selector = "simplestyled";
simpleststyle.properties = { foo : "bar",
                            color: 0x0AAA0A};

LzCSSStyle._addRule( simpleststyle );

/*
cat {
    texture: furry;
    age: "adult";
    sound: "meow";
}
*/

var catstyle = new LzCSSStyleRule();
catstyle.selector = "cat";
catstyle.properties = { texture: "furry", age: "adult", sound: "meow" };
LzCSSStyle._addRule( catstyle );

/*
A kitten who is a descendant of a cat is just like any other kitten, except it purrs. 
cat kitten {
    sound: purr;
}
TODO: we are not supporting this kind of selector yet
var catkittenstyle = new LzCSSStyleRule();
catkittenstyle.selector = ["cat", "kitten"];
catkittenstyle.properties = {  sound: "purr"};
LzCSSStyle._addRule( catkittenstyle );
*/ 


/*
puppy {
    age: "infant";
    texture: downy; 
}
var puppystyle = new LzCSSStyleRule();
puppystle.selectors = ["puppy"];
puppystle.properties = { age: "infant", texture: "downy"};
*/


/*
var kittenface = new LzCSSSStyleRule();
kittenface.selectors = ["kitten", "face"];
kittenface.properties = { 
    color: grey;
    texture: furry
     };
*/     

/*
nose {
    color: red;
    texture: pimply;    
}

 var noserule = new LzCSSStyleRule(); 
 noserule.type = "nose";
 noserule.properties = {
     color: red;
     texture: pimply;
 }
*/
/*
kitten nose {
    color: pink;
    texture: smooth;    
}

var kittennoserule = new LzCSSStyleRule();
kittennoserule.selectors = [ "kitten", "nose"];
kittennoserule.properties = { 
    color: pink;
    texture: smooth};
*/
/*
cat nose {
    color: brown;
    texture: pebbled;
}
    
var catnoserule = new LzCSSStyleRule(); 
catnoserule.selectors = [ "cat", "nose"];
catnoserule.properties = { 
    color: brown;
    texture: pebbled;
    };
*/    
