// Copyright 2006 Laszlo Systems
var theTestSuite = new LzTestSuite("simple");

var simpleTest = function() {
    LzTestManager.assertTrue(true);
}

function otherTest() {
    print("okay");
    LzTestManager.assertTrue(true);
}

theTestSuite.addTest(simpleTest);
theTestSuite.addTest(otherTest);