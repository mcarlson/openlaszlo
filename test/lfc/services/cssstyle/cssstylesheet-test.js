// Copyright 2006 Laszlo Systems

load("test/lfc/services/cssstyle/loadlzcss.js");
var theTestSuite = new LzTestSuite("cssstylesheet");

var myCSSStyleSheet; 

function setup() {
    var myMediaList = ["screen"];
    myCSSStyleSheet = new LzCSSStyleSheet(
        "myCSSStyleSheet", 
        "here.css",
        myMediaList,
        "text/css", 
        null, // ownerRule
        null // cssRules
        ); 
    
}

function teardown() {
    myCSSStyleSheet = null;
}
var simpleTest = function() {
    setup();
    
    LzTestManager.assertNotNull(myCSSStyleSheet);
    LzTestManager.assertEquals("myCSSStyleSheet", myCSSStyleSheet.title);
    LzTestManager.assertFalse(myCSSStyleSheet.disabled);    
    // TODO: test ownerNode, parentStyleSheet
    LzTestManager.assertEquals( "screen", myCSSStyleSheet.media[0]);
    LzTestManager.assertEquals("text/css", myCSSStyleSheet.type);
    LzTestManager.assertEquals("here.css", myCSSStyleSheet.href);    
    LzTestManager.assertNull(myCSSStyleSheet.ownerRule);        
    LzTestManager.assertNull(myCSSStyleSheet.cssRules);            
    
    teardown();
}

var insertRuleTest = function() {
    setup();
    // We should start off with no rules
    LzTestManager.assertNull(myCSSStyleSheet.cssRules);            
    
    // Now we add a rule
    var index = myCSSStyleSheet.insertRule( "testrule { foo: \"bar\"}", 
                                0);

    // Now we should have one rule
    var rules = myCSSStyleSheet.cssRules;
    LzTestManager.assertNotNull(rules);
    LzTestManager.assertNotNull(rules[0]);
    LzTestManager.assertUndefined(rules[1]); 
    LzTestManager.assertEquals("testrule { foo: \"bar\"}", rules[0]);
    LzTestManager.assertEquals(0, index);
    
    index = myCSSStyleSheet.insertRule( "morerule { baz: \"quux\"}", 
                                1);
    LzTestManager.assertEquals(1, index);                                
    rules = myCSSStyleSheet.cssRules;
    LzTestManager.assertNotNull(rules);
    LzTestManager.assertNotNull(rules[0]);
    LzTestManager.assertNotNull(rules[1]); 
    LzTestManager.assertEquals( "testrule { foo: \"bar\"}", rules[0]);    
    LzTestManager.assertEquals( "morerule { baz: \"quux\"}", rules[1]);
    
    var weirdRule = "weird rule { weird: \"rule\"}";
    index = myCSSStyleSheet.insertRule(weirdRule, 17); // this shouldn't actually
        // add a rule because it is a bad index
    LzTestManager.assertNull(index);                                        
    rules = myCSSStyleSheet.cssRules;
    LzTestManager.assertEquals(2, rules.length);

    index = myCSSStyleSheet.insertRule(weirdRule, -3); // this shouldn't actually
        // add a rule because it is a bad index
    LzTestManager.assertNull(index);                                                
    rules = myCSSStyleSheet.cssRules;
    LzTestManager.assertEquals(2, rules.length);

    var niceRule = "cat {sound: \"meow \"}";
    index = myCSSStyleSheet.insertRule(niceRule, 0);    
    LzTestManager.assertEquals(0, index) 
    rules = myCSSStyleSheet.cssRules;
    LzTestManager.assertEquals(3, rules.length);
    LzTestManager.assertEquals( niceRule, rules[0]);        
    LzTestManager.assertEquals( "testrule { foo: \"bar\"}", rules[1]);    
    LzTestManager.assertEquals( "morerule { baz: \"quux\"}", rules[2]);

    // TODO: test inserting a rule with a syntax error
    // insert a rule with an empty string for the rule; what should happen?

    teardown();
}





theTestSuite.addTest(simpleTest);
theTestSuite.addTest(insertRuleTest);
