/**
  * LzFunctions.as
  *
  * @copyright Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic AS2
  */

// This makes the ECMAScript eval function available to client code.
// In the LFC, eval is compiled to a special bytecode.  This doesn't
// allow eval to be lexically shadowed or used as a name in
// non-argument position.  The following function definition makes
// eval behave as specified in the ECMAScript spec.
function eval(str) {
    return eval(str);
}
