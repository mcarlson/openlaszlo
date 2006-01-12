/* -*- mode: JavaScript; c-basic-offset: 2; -*- */

/******************************************************************************
 * LzFormat.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

// Formatted output for the Laszlo Debugger

// Stolen from components/utils/performance/measure.lzx, but much
// improved since then!
//---
// pad or trim a string to a specified length
//
// @param str: the value to pad, will be coerced to a string if not a number
// @param Number len: the minimum width, if negative pad on the right
// @param Number dec: for numbers: ensure dec characters to the right
// of '.', padding with 0, otherwise maximum width
// @param String pad: character to pad on left with, default ' '
// @param String sign: ' ', '-', '+', default '-'
// @param Number radix: radix to represent numbers in, default 10
// @param Boolean force: ensure numbers always have a decimal
//---
Debug.pad = function (str, len, dec, pad, sign, radix, force) {
  switch (arguments.length) {
    case 0:
      str = '';
    case 1:
      len = null;
    case 2:
      dec = null;
    case 3:
      pad = ' ';
    case 4:
      sign = '-';
    case 5:
      radix = 10;
    case 6:
      force = false;
  }
  var num = typeof(str) == 'number';
  // coerce to be string
  if (num) {
    if (dec != null) {
      var precision = Math.pow(10, (- dec));
      str = Math.round(str/precision)*precision;
    }
    str = Number(str).toString(radix);
    if (sign != '-') {
      if (str.indexOf('-') != 0) {
        if (str != 0) {
          str = sign + str;
        } else {
          // ' 0' not '+0'
          str = ' ' + str;
        }
      }
    }
  } else {
    str = '' + str;
  }
  var strlen = str.length;
  // enforce precision
  if (dec != null) {
    if (num) {
      var decimal = str.lastIndexOf('.');
      if (decimal == -1) {
        var decimals = 0;
        if (force || (dec > 0)) {
          str += '.';
        }
      } else {
        var decimals = strlen - (decimal + 1);
      }
      for (var i = decimals; i < dec; i++) str += '0';
    } else {
      str = str.substring(0, dec);
    }
  }
  // enforce minimum width
  strlen = str.length;
  if (! len) {
    len = 0;
  }
  var left = false;
  if (len < 0) {
    len = (- len);
    left = true;
  }
  if (strlen >= len) {
    return str;
  }
  if (left) {
    for (var i = strlen; i < len; i++) str = str + ' ';
  } else {
    sign = null;
    if (pad != ' ') {
      if (isNaN(str.substring(0, 1))) {
        sign = str.substring(0, 1);
        str = str.substring(1);
      }
    }
    for (var i = strlen; i < len; i++) str = pad + str;
    if (sign != null) {
      str = sign + str;
    }
  }
  return str;
}

//---
// Formatted output to string
//
// Formats its arguments according to the control string
//
// The standard printf conversions are accepted, with the exception of
// `a`, `n`, and `p`.  `e`, `f`, and `g` conversions are accepted but
// equivalent to `f`.  The `h` and `l` length modifiers are accepted
// but ignored.  No errors are signalled for invalid format controls
// or insufficient arguments.
//
// There is an additional format specifier `w` that formats the
// argument as if by `Debug.__String` with the 'pretty' option and
// creates a 'hotlink' so the object can be inspected.  If alternate
// format is requested (#), `w` uses the full `Debug.__String` format
// used by Debug.write.  `%w` format obeys Debug.printLength.  If a
// precision is specified, that is used as printLength.
//
// @param string control: A control string where % indicates a
// subsequent argument is to be substituted.
//
// @param any... args: arguments to be formatted according to the
// control string.
//
// @return LzMessage: the return value is an LzMessage which can be
// coreced to a string or HTML (the latter supports the hot-linking
// feature).
//---
Debug.formatToString = function (control, args) {
  if (arguments.length < 1) { control = '' };
  control = String(control);
  // skip control
  var arg = 1;
  var limit = control.length;
  var start = 0;
  var end = 0;
  var out = new _root.LzMessage();
  while (start < limit) {
    end = control.indexOf('%');
    if (end == -1) { end = limit; }
    out.append(control.substring(start, end));
    // skip %
    start = end + 1;
    end = end + 2;
    var sign = '-';
    var pad = ' ';
    var alternate = false;
    var length = '';
    var precision = '';
    var directive = null;
    while ((start < limit) && 
           // swf7 (! directive)
           (directive == null)) {
      var char = control.substring(start, end);
      start = end++;
      // This is a little sloppy.  It will parse valid options,
      // but also permits invalid ones, whose behaviour is
      // undefined.
      switch (char) {
        case '-': length = char; break;
        case '+': case ' ':
          sign = char; 
          break;
        case '#': alternate = true; break;
        case '0':
          if (isNaN(length) && isNaN(precision)) {
            pad = char; break;
          }
        case '1': case '2': case '3': case '4': case '5':
        case '6': case '7': case '8': case '9':
          if (precision != '') {
            precision += char;
          } else {
            length += char;
          }
          break;
        case '$':
          arg = length;
          length = '';
          break;
        case '*':
          if (precision != '') {
            precision = arguments[arg++];
          } else {
            length = arguments[arg++];
          }
          break;
        case '.': precision = 0; break;
        case 'h': case 'l': break;
        default:
          directive = char;
          break;
      }
    }
    var value = arguments[arg];
    // set decimals
    var decimals = null;
    var force = false;
    if (! isNaN(precision)) {
      decimals = 1 * precision;
    } else {
      switch (directive) {
        case 'F': case 'E': case 'G':
        case 'f': case 'e': case 'g':
          decimals = 6;
          force = alternate;
          break;
        case 'O': case 'o':
          if (alternate && value != 0) {
            out.append('0');
          }
          break;
        case 'X': case 'x':
          if (alternate && value != 0) {
            out.append('0' + directive);
          }
          break;
      }
    }
    // set radix
    var radix = 10;
    switch (directive) {
      case 'o': case 'O':
        radix = 8; break;
      case 'x': case'X':
        radix = 16; break;
    }
    // 'unsigned'
    if (value < 0) {
      switch (directive) {
        case 'U': case 'O': case 'X':
        case 'u': case 'o': case 'x':
          value = (- value);
          var wid = Math.abs(length);
          if (isNaN(wid)) {
            wid = Number(value).toString(radix).length;
          }
          var max = Math.pow(radix, wid);
          value = max - value;
      }
    }
//     Debug.write('directive', directive, 'value', value, 'length', length,
//                 'decimals', decimals, 'pad', pad, 'sign', sign, 'radix', radix);
    // do the directive
    // e, f, and, g could be implemented with toExponential or
    // toPrecision if they existed in the runtime.
    switch (directive) {
      case 'D': case 'U': case 'I': case 'O': case 'X': case 'F': case 'E': case 'G':
        value = Number(value);
        out.append(this.pad(value, length, decimals, pad, sign, radix, force).toUpperCase());
        arg++;                  // consume value
        break;
      case 'c':
        value = String.fromCharCode(value);
      case 's':
        value = String(value);
        out.append(this.pad(value, length, decimals, pad, sign, radix, force));
        arg++;                  // consume value
        break;
      case 'd': case 'u': case 'i': case 'o': case 'x': case 'f': case 'e': case 'g':
        value = Number(value);
        out.append(this.pad(value, length, decimals, pad, sign, radix, force));
        arg++;                  // consume value
        break;
      case 'w':
        var width = decimals || this.printLength;
        out.appendInternal(this.pad(this.__String(value, (! alternate), width),
                                    length, null, pad, sign, radix, force),
                           value);
        arg++;                  // consume value
        break;
      case null:
        break;
      case '%':
        out.append(directive);
        break;
      default:
        // ignore unknown
        out.append('%' + directive);
        break;
    }
    control = control.substring(start, limit);
    limit = control.length;
    start = 0;
    end = 0;
  }

  return out;
}

//---
// Formatted output
//
// Formats its arguments using `formatToString`.  (See that for
// details)
//
// @param string control: A control string where % indicates a
// subsequent argument is to be substituted
//
// @param any... args: arguments to be formatted according to the
// control string
//---

Debug.format = function (control, args) {
  _root.Debug.addText(this.formatToString.apply(this, arguments));
}

