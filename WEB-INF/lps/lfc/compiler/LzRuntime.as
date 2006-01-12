/******************************************************************************
 * LzRuntime.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

/***
 * Define global namespace
 */
_root.global = _root;


/*
 * The compiler tranforms 'a instanceof b' into '$instanceof(a, b)'
 *
 * From the ECMAScript262-3 spec:
 *
 * 11.8.6 The instanceof operator
 * The production RelationalExpression: RelationalExpression
 * instanceof ShiftExpression is evaluated as follows:
 *  1. Evaluate RelationalExpression.
 *  2. Call GetValue(Result(1)).
 *  3. Evaluate ShiftExpression.
 *  4. Call GetValue(Result(3)).
 *  5. If Result(4) is not an object, throw a TypeError exception.
 *  6. If Result(4) does not have a [[HasInstance]] method, throw a
 *  TypeError exception.
 *  7. Call the [[HasInstance]] method of Result(4) with parameter
 *  Result(2).
 *  8. Return Result(7).
 *
 * 15.3.5.3  [[HasInstance]] (V)
 * Assume F is a Function object. When the [[HasInstance]] method of F is
 * called with value V, the following steps are taken:
 *  1. If V is not an object, return false.
 *  2.  Call the [[Get]] method of F with property name "prototype".
 *  3. Let O be Result(2).
 *  4. If O is not an object, throw a TypeError exception.
 *  5. Let V be the value of the [[Prototype]] property of V.
 *  6. If V is null, return false.
 *  7. If O and V refer to the same object or if they refer to objects
 *  joined to each other (section 13.1.2), return true.
 *  8.  Go to step 5.
 */


/***
 * Runtime support for 'instanceof' operator
 *
 * @param Function constructor: right-hand operand
 * @param instance: left-hand operand
 * @return (boolean | undefined): undefined if constructor is not a
 * constructor, true if instance is an instance of
 * constructor, false otherwise.
 */
function $instanceof(constructor, instance) {
  if (
    // TODO: [2003-11-19 ptw] (typeof, optimized)
    // typeof(constructor) != 'function'
    // functions compare == null, but are true in a boolean context
    ((constructor != null) || (!constructor)) ||
    // TODO: [2003-11-19 ptw] (typeof, optimized)
    // typeof(constructor.prototype) != 'object'
    // sloppy, but more efficient
    (! constructor.prototype)
    )
  {
    if ($debug) {
      _root.Debug.write('Type error: ', constructor, ' is not a constructor');
    }
    // undefined
    return void 0;
  }
  // TODO: [2003-11-19 ptw] (typeof, optimized)
  // Because typeof is slow, we only make this test for constructors
  // that could give false positives if instance is coerced to an
  // Object in the loop
  if (constructor == Object || constructor == String || constructor == Number || constructor == Boolean) {
    if (typeof(instance) != 'object') {
      return false;
    }
  }
  var v = instance.__proto__;
  var p = constructor.prototype;
  while (v) {
    if (v == p) {
      return true;
    }
    v = v.__proto__;
  }
  return false;
}
