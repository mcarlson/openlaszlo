// Copyright 2006 Laszlo Systems

var LzTestManager = {
    totalsuites: 0,
    passedsuites: 0,
    failedsuites: 0,
    suites: [],
    cursuite: 0,
    results: [],
    global: this
}; 

var LzTestSuite = function ( nm ) {
    this.name = nm; 
    this.curtest = 0;     
    this.totaltests = 0; 
    this.passedtests = 0;
    this.failedtests = 0; 
    this.tests = [];
    this.results = []; 
}

LzTestSuite.prototype.addTest = function( t ) {
    this.tests.push( t ); 
    this.totaltests = this.totaltests + 1; 
}

LzTestSuite.prototype.printResults = function() {  
    var countedfailedtests = 0; 
    var countedpassedtests = 0; 
    for (var tc in this.tests) {
        if (this.results[tc] != "pass") {
            countedfailedtests += 1; 
        } else {
            countedpassedtests += 1;         
        }
    }
    if ( (countedfailedtests != this.failedtests) 
        || (countedpassedtests != this.passedtests)) {
            Debug.error("oh nooooo countedpassedtests != this.passedtests OR countedfailedtests != this.failedtests don't match"); 
    }
}

LzTestManager.addTestSuite = function( ts ) {
    LzTestManager.suites.push(ts); 
    LzTestManager.totalsuites += 1;             
}       

LzTestManager.printSummary = function () {
    var failedsuitenames = [];
    var passedsuitenames = [];
    var countedfailedsuites = 0; 
    var countedpassedsuites = 0; 
    for (var suite in this.suites) {
        if (this.results[suite] != "pass") {
            this.suites[suite].printResults(); 
            countedfailedsuites += 1;
            failedsuitenames.push(this.suites[suite].name); 
        } else {
            passedsuitenames.push(this.suites[suite].name); 
            countedpassedsuites += 1;
        }
    }
    if (countedfailedsuites > 0) {
        var msg = "Failed " + countedfailedsuites + " suites";
        for (var s in failedsuitenames) {
            msg = msg + ", " + failedsuitenames[s]; 
        }
        Debug.error(msg);  
    } 
    
    if (countedfailedsuites != this.failedsuites) {
        Debug.error("oh noooo countedfailedsuites != this.failedsuites"); 
    }
    if (countedpassedsuites != this.passedsuites) {
        Debug.error("countedpassedsuites: " + countedpassedsuites); 
        Debug.error("this.passedsuites: " + this.passedsuites);         
        Debug.error("oh noooo countedpassedsuites != this.passedsuites");         
    }
    
    if ( this.passedsuites == this.totalsuites ) {
        Debug.info("Passed all suites."); 
    }

    
}

LzTestManager.runTestSuites = function() {
    for (var suite in this.suites) {
        this.results[suite] = "pre"; 
        this.cursuite = suite;
        var suiteObj = this.suites[suite]; 
        for (var testcase in suiteObj.tests) {
            suiteObj.curtest = testcase; 
            var testcaseObj = suiteObj.tests[testcase];     
            suiteObj.results[testcase] = "pre";
            testcaseObj();
            if (suiteObj.results[testcase] == "pre") {
                suiteObj.results[testcase] = "pass";
                suiteObj.passedtests += 1; 
            } else {
                suiteObj.failedtests += 1; 
            }
        }
        if (this.results[suite] == "pre") {
            this.results[suite] = "pass";
            this.passedsuites += 1;
        } else {
            this.failedsuites += 1;
        }
    }
}


LzTestManager.failAssertion = function( msg ) {    
    var ste = this.suites[this.cursuite]; 
    if (ste) {
        var tst = ste.curtest;     
        Debug.error("In suite " + ste.name + ", test " + tst + ", failed assertion: " + msg ); 
        // Mark this test case as having failed
        this.results[this.cursuite] = "fail"; 
        // Mark this test suite as having failed 
        this.suites[this.cursuite].results[tst] = "fail"; 
    } else {
        print("We crashed so hard that we can't even figure out what test suite we're in."); 
    }
}

LzTestManager.assertTrue = function(condition, assertion) {
    if (!condition)  {
        var errmsg = "FAIL: assertTrue('" + condition + "') failed"
                    + (assertion ? ': ' + assertion : '');      
        LzTestManager.failAssertion(errmsg); 
    }
}


LzTestManager.assertFalse = function(condition, assertion) {
    if (condition)  {
        var errmsg = "FAIL: assertFalse('" + condition + "') failed"
                    + (assertion ? ': ' + assertion : '');      
        this.failAssertion(errmsg); 
    }
}

LzTestManager.assertEquals = function(expected, actual, message) {
    if (! (expected == actual)) {
        var errmsg = "FAIL: " + message + "Equals expected " + expected + ", got " + actual; 
        LzTestManager.failAssertion(errmsg); 
    }
}

LzTestManager.assertNull = function(object, message) {
    if (object !== null) {
       LzTestManager.failAssertion(message + " Null " + null + object);
    }
}

LzTestManager.assertNotNull = function(object, message) {
    if (object === null) {
       LzTestManager.failAssertion(message + " NotNull " + "non-null value: " + object);
    }
}

LzTestManager.assertSame = function(expected, actual, message) {
    if (typeof(expected) == "undefined" && typeof(actual) == "undefined") {
        return;
    }
    
    if (expected !== actual) {
        LzTestManager.failAssertion(message + " Same: expected " + expected + ", got " + actual);
    }
}

LzTestManager.assertNotSame = function(expected, actual, message) {
    if (expected === actual) {
        var msg = "NotSame " + msg + " expected anything but " + expected + ", got ", actual; 
        LzTestManager.failAssertion.fail(msg);
    }
}

LzTestManager.assertUndefined = function(object, message) {
    if (typeof(object) != "undefined") {
       LzTestManager.failAssertion(message + " undefined value  " + object);
    }
}

LzTestManager.assertNotUndefined = function(object, message) {
    if (typeof(object) == "undefined") {
        LzTestManager.failAssertion(message + " undefined value  " + object);
    }
}

LzTestManager.assertWithin = function(expected, actual, delta, message) {
    // handle infinite expected
    if (expected == actual) return;

    var error = (actual <= expected) ? (expected - actual) : (actual - expected);
    // note NaN compares are always false
    if (! (error <= delta)) {
        LzTestManager.failAssertion(message + "Within" + "" + expected + "\u00B1" + delta + " " + actual);
    }
}
