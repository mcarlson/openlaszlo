//AW[ 24-04-2006] Adapted from platform testsuite in lps=legas
/* X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2006 Laszlo Systems, Inc.  All Rights Reserved.          *
* Use is subject to license terms.                                        *
* X_LZ_COPYRIGHT_END ******************************************************/

testsuite.prototype.failAssertion = function( msg ) {    
    this._failed = true;
    Debug.error("failed assertion: " + msg ); 
}

testsuite.prototype.assertTrue = function(condition, assertion) {
    if (!condition)  {
        var errmsg = "FAIL:" + (assertion ? assertion : '') +
                     " Expected TRUE got " + condition;
        this.failAssertion(errmsg); 
    }
}


testsuite.prototype.assertFalse = function(condition, assertion) {
    if (condition)  {
        var errmsg = "FAIL: " + (assertion ? ': ' + assertion : '');      
        this.failAssertion(errmsg); 
    }
}

testsuite.prototype.assertEquals = function(expected, actual, message) {
    if (! (expected == actual)) {
        var errmsg = "FAIL: " + ( message? message : "" )  + 
                     "Equals expected " + expected + ", got " + actual; 
        this.failAssertion(errmsg); 
    }
}

testsuite.prototype.assertLessThan = function(max, actual, message) {
    if (! (max > actual)) {
        var errmsg = "FAIL: " + ( message? message : "" )  + 
                     "LessThan expected max of " + max + ", got " + actual; 
        this.failAssertion(errmsg); 
    }
}


testsuite.prototype.assertNull = function(object, message) {
    if (object !== null) {
       this.failAssertion(message + " Expected null, got: " + object);
    }
}

testsuite.prototype.assertNotNull = function(object, message) {
    if (object === null) {
       this.failAssertion( ( message ? message + " "  : "" ) + 
                            "Expected non-null value." );
    }
}

testsuite.prototype.assertSame = function(expected, actual, message) {
    if (typeof(expected) == "undefined" && typeof(actual) == "undefined") {
        return;
    }
    
    if (expected !== actual) {
        this.failAssertion(message + " Same: expected " + expected + ", got " + actual);
    }
}

testsuite.prototype.assertNotSame = function(expected, actual, message) {
    if (expected === actual) {
        var msg = "NotSame " + msg + " expected anything but " + expected + ", got ", actual; 
        this.failAssertion(msg);
    }
}

testsuite.prototype.assertUndefined = function(object, message) {
    if (typeof(object) != "undefined") {
       this.failAssertion(message + " undefined value  " + object);
    }
}

testsuite.prototype.assertNotUndefined = function(object, message) {
    if (typeof(object) == "undefined") {
        this.failAssertion(message + " undefined value  " + object);
    }
}

testsuite.prototype.assertWithin = function(expected, actual, delta, message) {
    // handle infinite expected
    if (expected == actual) return;

    var error = (actual <= expected) ? (expected - actual) : (actual - expected);
    // note NaN compares are always false
    if (! (error <= delta)) {
        this.failAssertion(message + "Within" + "" + expected + "\u00B1" + delta + " " + actual);
    }
}
