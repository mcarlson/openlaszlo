/***
 * OpenLaszlo class support for JS2 runtimes
 *
 * @copyright Copyright 2008 Laszlo Systems, Inc.  All Rights Reserved.
 * Use is subject to license terms.
 *
 * @access private
 * @topic LZX
 * @subtopic Runtime
 * @author ptw
 */

/**
 * Instance class
 *
 * The root of the Class tree.  All LZX instances are
 * instanceof Instance.
 *
 * @access private
 * @bootstrap true
 *
 * @devnote This is the first class constructor.  Constructors for
 * all other classes are created by Class.make (below).
 *
 */
public class Instance {

  public const constructor:Class = Instance;

  public function Instance () {
    this.constructor = arguments.callee;
    this.initialize.apply(this, arguments);
  }

  /**
   * Add a property to an instance
   *
   * If the property is a Function (method), annotates the method so
   * nextMethod can find the next most applicable method
   *
   * @param String name: the name of the property
   * @param value: the value of the property
   *
   * @access private
   *
   * @devnote LFC instances do not support addProperty.  This should
   * only be necessary for the interim implementation of LzUserClass
   */
  public function addProperty (name:String, value:*):void {
    trace('addProperty of ' + value + ' not supported.');
  };

  /**
   * Instance initialize method
   *
   * Called by Instance constructor as the last operation on a new
   * instance of a class.  Arguments are the arguments that were passed
   * to make.
   *
   * Can be overridden in subclasses, but must call superclass initialze
   * if so.
   *
   * Default method does nothing
   *
   * @access private
   *
   * @devnote The call to the default method is optimized away in class constructors
   */
  public function initialize (...rest):void {};

  /**
   * Class initialize method
   *
   * Called by Class.make each time a class or subclass is made.
   * Argument is the prototype of the class.  The class initializer
   * allows the class to initialize prototype properties with
   * non-constant values.
   *
   * Class initializers are invoked from least to most specific,
   * automatically by the Class.make method.  They cannot be overridden.
   *
   * Default method does nothing
   *
   * @access private
   */
  public static function initialize (prototype:Object):void {
    // @devnote: Subclasses must have this as their first line:
    // prototype.constructor.initialize.call(this, prototype);
  }

};
