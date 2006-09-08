// Copyright 2006 Laszlo Systems
var theTestSuite = new LzTestSuite("failsonpurpose");

var failingTest = function() {
    LzTestManager.assertTrue(false);
}

function otherTest() {
    print("okay");
    LzTestManager.assertTrue(true);
}

theTestSuite.addTest(failingTest);
theTestSuite.addTest(otherTest);