// Copyright 2006 Laszlo Systems

load("test/lfc/services/cssstyle/loadlzcss.js");
var theTestSuite = new LzTestSuite("stylesheet");

var simpleTest = function() {
    var myMediaList = ["screen"];
    myStyleSheet = new LzStyleSheet(
        "myStyleSheet", 
        "here.css",
        myMediaList,
        "text/css"
        ); 
    
    LzTestManager.assertNotNull(myStyleSheet);
    LzTestManager.assertEquals("myStyleSheet", myStyleSheet.title);
    LzTestManager.assertFalse(myStyleSheet.disabled);    
    // TODO: test ownerNode, parentStyleSheet
    LzTestManager.assertEquals( "screen", myStyleSheet.media[0]);
    LzTestManager.assertEquals("text/css", myStyleSheet.type);
    LzTestManager.assertEquals("here.css", myStyleSheet.href);
}


theTestSuite.addTest(simpleTest);
