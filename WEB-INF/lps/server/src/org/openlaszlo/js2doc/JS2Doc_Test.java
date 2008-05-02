/* ****************************************************************************
 * JS2Doc_Test.java
 *
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2007-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.js2doc;
import org.openlaszlo.utils.*;
import java.io.*;
import java.util.*;
import junit.framework.*;
import org.w3c.dom.*;
import javax.xml.transform.*;
import javax.xml.transform.dom.*;
import javax.xml.transform.stream.*;
import org.custommonkey.xmlunit.*;


public class JS2Doc_Test extends XMLTestCase {

    public JS2Doc_Test (String name) {
        super(name);
    }

    public void setUp () {
    }

    public void testComments () {
        String[] tests = {
            // Each case is input, expected output
            // "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" is automatically prepended to output

            "", "<js2doc/>",
            
            // properly-formatted but empty comment
            "/** */ var foo;",
            "<js2doc><property id=\"foo\" name=\"foo\"/></js2doc>",
            
            // comment applying to variable statement (var foo)
            "/** this is a js2doc comment */ var foo;", 
            "<js2doc><property id=\"foo\" name=\"foo\"><doc><text>this is a js2doc comment</text></doc></property></js2doc>",
            
            // invalid comment applying to variable statement (var foo)
            "/* this is a non-js2doc comment */ var foo;", 
            "<js2doc><property id=\"foo\" name=\"foo\"/></js2doc>",
            
            // another invalid comment syntax
            "// this is a comment\n var foo;",
            "<js2doc><property id=\"foo\" name=\"foo\"/></js2doc>",

            // multi-line comments
            "/** this is the subject\n *\n * and here's some more text\n */\n var foo;",
            "<js2doc><property id=\"foo\" name=\"foo\"><doc><text>this is the subject\n\n and here's some more text</text></doc></property></js2doc>",
            
            "/** this is the subject\n *** \n ** and here's some more text\n */\n var foo;",
            "<js2doc><property id=\"foo\" name=\"foo\"><doc><text>this is the subject\n \n and here's some more text</text></doc></property></js2doc>",
            
            // formatted comments
            "/** this is the subject\n * @field1 foo\n */\n var foo;",
            "<js2doc><property id=\"foo\" name=\"foo\"><doc><text>this is the subject</text><tag name=\"field1\"><text>foo</text></tag></doc></property></js2doc>",

            "/** this is the subject\n * @field1 foo\n * @field2 bar\n */\n var foo;",
            "<js2doc><property id=\"foo\" name=\"foo\"><doc><text>this is the subject</text><tag name=\"field1\"><text>foo</text></tag><tag name=\"field2\"><text>bar</text></tag></doc></property></js2doc>",

            "/** this is the subject\n * here's more\n * @field1 foo\n * bar\n */\n var foo;",
            "<js2doc><property id=\"foo\" name=\"foo\"><doc><text>this is the subject\n here's more</text><tag name=\"field1\"><text>foo\n bar</text></tag></doc></property></js2doc>",

            "/** this is the subject\n *  here's more\n * @field1 foo\n *  bar\n */\n var foo;",
            "<js2doc><property id=\"foo\" name=\"foo\"><doc><text>this is the subject\n  here's more</text><tag name=\"field1\"><text>foo\n  bar</text></tag></doc></property></js2doc>",

            "/** this is <b>the</b> subject\n *  here's more\n * @field1 foo\n *  bar\n */\n var foo;",
            "<js2doc><property id=\"foo\" name=\"foo\"><doc><text>this is <b>the</b> subject\n  here's more</text><tag name=\"field1\"><text>foo\n  bar</text></tag></doc></property></js2doc>",

            // consecutive comments
            "// garbage\n/** legit */\nvar foo;",
            "<js2doc><property id=\"foo\" name=\"foo\"><doc><text>legit</text></doc></property></js2doc>",
            
            "/* nope */\n/* nope */\n/** yep */\nvar foo;",
            "<js2doc><property id=\"foo\" name=\"foo\"><doc><text>yep</text></doc></property></js2doc>",
            
            // don't pick up js2doc-formatted comment in the middle of a sequence of regular comments
            "/* nope */\n/** you wish */\n/* nope */\nvar foo;",
            "<js2doc><property id=\"foo\" name=\"foo\"/></js2doc>",
            
            "/**\n  * foo\n  * @access private */\nvar foo;",
            "<js2doc><property id=\"foo\" name=\"foo\" access=\"private\"><doc><text>foo</text></doc></property></js2doc>",
            
            "/** jaz &lt; bar */\nvar foo;", "<js2doc><property id=\"foo\" name=\"foo\"><doc><text>jaz &lt; bar</text></doc></property></js2doc>",
        };
        
        iterateTests(tests);
    }
    
    public void testVariableDeclarations () {
        String[] tests = {
            // simple variable declaration without comment
            "var foo;", 
            "<js2doc><property id=\"foo\" name=\"foo\"/></js2doc>",
            
            // simple multiple variable declaration without comment
            "var foo, bar;", 
            "<js2doc><property id=\"foo\" name=\"foo\"/><property id=\"bar\" name=\"bar\"/></js2doc>",
            
            // simple multiple variable declaration without comment
            "var foo; var bar;", 
            "<js2doc><property id=\"foo\" name=\"foo\"/><property id=\"bar\" name=\"bar\"/></js2doc>",

            // comment applying to one decl is var statement
            "/** this is a comment */ var foo;", 
            "<js2doc><property id=\"foo\" name=\"foo\"><doc><text>this is a comment</text></doc></property></js2doc>",
            
            // access keyword applying to one decl is var statement
            "/** @keywords private */ var foo;", 
            "<js2doc><property id=\"foo\" name=\"foo\" access=\"private\"/></js2doc>",
            
            // access keyword applying to one decl is var statement
            "/** @access private */ var foo;", 
            "<js2doc><property id=\"foo\" name=\"foo\" access=\"private\"/></js2doc>",
            
            "/** @type Boolean */ var foo;",
            "<js2doc><property id=\"foo\" name=\"foo\" type=\"Boolean\"/></js2doc>",
            
            // comment applying to all decls in a multiple-decl var statement
            "/** this is a comment */ var foo, bar;", 
            "<js2doc><property id=\"foo\" name=\"foo\"><doc><text>this is a comment</text></doc></property><property id=\"bar\" name=\"bar\"><doc><text>this is a comment</text></doc></property></js2doc>",
            
            // comment applying to variable declaration ("foo")
            "var /** this is a comment */ foo;", 
            "<js2doc><property id=\"foo\" name=\"foo\"><doc><text>this is a comment</text></doc></property></js2doc>",
            
            // separate comments applying to each variable decl in a statement
            "var /** comment A */ foo, /** comment B */ bar;", 
            "<js2doc><property id=\"foo\" name=\"foo\"><doc><text>comment A</text></doc></property><property id=\"bar\" name=\"bar\"><doc><text>comment B</text></doc></property></js2doc>",
            
            "var foo = new Object;",
            "<js2doc><property id=\"foo\" name=\"foo\"><object/></property></js2doc>",

            // no real purpose with support for new Function(arg1, ..., argn, body)
            "var foo = new Function;",
            "<js2doc><property id=\"foo\" name=\"foo\"><function/></property></js2doc>",

            "var foo = new LzEvent;",
            "<js2doc><property id=\"foo\" name=\"foo\"><object type=\"LzEvent\"/></property></js2doc>",
        };
        
        iterateTests(tests);
    }
    
    public void testTopLevelAssignments () {
            
        String[] tests = {
            // Each case is input, expected-output
            // "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" is automatically prepended to output

            "var foo = new Object; foo.bar = 10;",
            "<js2doc><property id=\"foo\" name=\"foo\"><object><property id=\"foo.bar\" name=\"bar\" value=\"10\"/></object></property></js2doc>",
            
            "var foo = new Object(); foo.bar = 10;",
            "<js2doc><property id=\"foo\" name=\"foo\"><object><property id=\"foo.bar\" name=\"bar\" value=\"10\"/></object></property></js2doc>",
            
            "var foo = new String; foo.bar = 10;",
            "<js2doc><property id=\"foo\" name=\"foo\"><object type=\"String\"><property id=\"foo.bar\" name=\"bar\" value=\"10\"/></object></property></js2doc>",
            
            "var foo = new String(); foo.bar = 10;",
            "<js2doc><property id=\"foo\" name=\"foo\"><object type=\"String\"><property id=\"foo.bar\" name=\"bar\" value=\"10\"/></object></property></js2doc>",
            
            "var foo = new Object; foo.bar = 'baz';",
            "<js2doc><property id=\"foo\" name=\"foo\"><object><property id=\"foo.bar\" name=\"bar\" value=\"baz\"/></object></property></js2doc>",
            
            "var foo = new Object; foo.bar = function () {};",
            "<js2doc><property id=\"foo\" name=\"foo\"><object><property id=\"foo.bar\" name=\"bar\"><function/></property></object></property></js2doc>",

            "var foo = new Object; foo.prototype.bar = 10;",
            "<js2doc><property id=\"foo\" name=\"foo\"><object><property id=\"foo.prototype\" name=\"prototype\"><object><property id=\"foo.prototype.bar\" name=\"bar\" value=\"10\"/></object></property></object></property></js2doc>",

            "var foo = function () {};",
            "<js2doc><property id=\"foo\" name=\"foo\"><function/></property></js2doc>",

            "var foo = function (a) {};",
            "<js2doc><property id=\"foo\" name=\"foo\"><function><parameter name=\"a\"/></function></property></js2doc>",

            "/** @param String a */ var foo = function (a) {};",
            "<js2doc><property id=\"foo\" name=\"foo\"><function><parameter name=\"a\" type=\"String\"/></function></property></js2doc>",

            "var foo = function (a) {}; foo.bar = 10;",
            "<js2doc><property id=\"foo\" name=\"foo\"><function><parameter name=\"a\"/><property id=\"foo.bar\" name=\"bar\" value=\"10\"/></function></property></js2doc>",

            "var foo = function (a) {}; foo.prototype.bar = 10;",
            "<js2doc><property id=\"foo\" name=\"foo\"><function><parameter name=\"a\"/><property id=\"foo.prototype\" name=\"prototype\"><object><property id=\"foo.prototype.bar\" name=\"bar\" value=\"10\"/></object></property></function></property></js2doc>",

            "a = 10",
            "<js2doc><property id=\"a\" name=\"a\" value=\"10\"/></js2doc>",
            
            "a = { foo: 10 }",
            "<js2doc><property id=\"a\" name=\"a\"><object><property name=\"foo\" id=\"a.foo\" value=\"10\"/></object></property></js2doc>",
            
            "a = { /** @access private */ foo: 10 }",
            "<js2doc><property id=\"a\" name=\"a\"><object><property name=\"foo\" id=\"a.foo\" value=\"10\" access=\"private\"/></object></property></js2doc>",
            
            "var Debug; /** @access private  */ Debug.addText = function (msg1) { }; /** Foo */ Debug.addText = function (msg2) { };",
            "<js2doc><property id=\"Debug\" name=\"Debug\"><object><property id=\"Debug.addText\" name=\"addText\"><doc><text>Foo</text></doc><function><parameter name=\"msg2\"/></function></property></object></property></js2doc>",
            
            "Object.make = function () {}",
            "<js2doc><property id=\"Object\" name=\"Object\" topic=\"JavaScript\" subtopic=\"Intrinsic Classes\"><object><property id=\"Object.make\" name=\"make\"><function/></property></object></property></js2doc>",
        };

        iterateTests(tests);
    }
    
    public void testFunctionDefinitions () {
            
        String[] tests = {
            // Each case is input, expected-output
            // "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" is automatically prepended to output

            // simple function definition
            "function foo () { }",
            "<js2doc><property id=\"foo\" name=\"foo\"><function/></property></js2doc>",

            // simple function definition with comment
            "/** this is a comment */ function foo () { }",
            "<js2doc><property id=\"foo\" name=\"foo\"><doc><text>this is a comment</text></doc><function/></property></js2doc>",

            // alternative comment syntax
            "// this is a comment\n function foo () { }",
            "<js2doc><property id=\"foo\" name=\"foo\"><function/></property></js2doc>",
            
            // simple function definition with access keyword
            "/** @keywords private */ function foo () { }",
            "<js2doc><property id=\"foo\" name=\"foo\" access=\"private\"><function/></property></js2doc>",

            // simple function definition with access keyword
            "/** @access private */ function foo () { }",
            "<js2doc><property id=\"foo\" name=\"foo\" access=\"private\"><function/></property></js2doc>",

            // function definition with one parameter
            "function foo (bar) {}",
            "<js2doc><property id=\"foo\" name=\"foo\"><function><parameter name=\"bar\"/></function></property></js2doc>",

            // function definition with three parameters
            "function foo (bar, bazzle, batchelder) {}",
            "<js2doc><property id=\"foo\" name=\"foo\"><function><parameter name=\"bar\"/><parameter name=\"bazzle\"/><parameter name=\"batchelder\"/></function></property></js2doc>",

            // function definition with commented params
            "/** @param String bar: test */ function foo(bar) {}",
            "<js2doc><property id=\"foo\" name=\"foo\"><function><parameter name=\"bar\" type=\"String\"><doc><text>test</text></doc></parameter></function></property></js2doc>",

            // function definition with commented params
            "/** blest\n @param String bar: test */ function foo(bar) {}",
            "<js2doc><property id=\"foo\" name=\"foo\"><doc><text>blest</text></doc><function><parameter name=\"bar\" type=\"String\"><doc><text>test</text></doc></parameter></function></property></js2doc>",

            "/** @param bar: test */ function foo(bar) {}",
            "<js2doc><property id=\"foo\" name=\"foo\"><function><parameter name=\"bar\"><doc><text>test</text></doc></parameter></function></property></js2doc>",

            "/** @param String bar: */ function foo(bar) {}",
            "<js2doc><property id=\"foo\" name=\"foo\"><function><parameter name=\"bar\" type=\"String\"></parameter></function></property></js2doc>",

            "/** @param String bar */ function foo(bar) {}",
            "<js2doc><property id=\"foo\" name=\"foo\"><function><parameter name=\"bar\" type=\"String\"></parameter></function></property></js2doc>",

            "/** @return String */ function foo(bar) {}",
            "<js2doc><property id=\"foo\" name=\"foo\"><function><parameter name=\"bar\"/><returns type=\"String\"/></function></property></js2doc>",

            "/** @returns String */ function foo(bar) {}",
            "<js2doc><property id=\"foo\" name=\"foo\"><function><parameter name=\"bar\"/><returns type=\"String\"/></function></property></js2doc>",

            "/** @return String: test */ function foo(bar) {}",
            "<js2doc><property id=\"foo\" name=\"foo\"><function><parameter name=\"bar\"/><returns type=\"String\"><doc><text>test</text></doc></returns></function></property></js2doc>",

            "/** @return String: <p>test</p> */ function foo(bar) {}",
            "<js2doc><property id=\"foo\" name=\"foo\"><function><parameter name=\"bar\"/><returns type=\"String\"><doc><text><p>test</p></text></doc></returns></function></property></js2doc>",

            "/** @return String: test &lt; best */ function foo(bar) {}",
            "<js2doc><property id=\"foo\" name=\"foo\"><function><parameter name=\"bar\"/><returns type=\"String\"><doc><text>test &lt; best</text></doc></returns></function></property></js2doc>",

            "/** @return String */ function foo(bar) {}",
            "<js2doc><property id=\"foo\" name=\"foo\"><function><parameter name=\"bar\"/><returns type=\"String\"/></function></property></js2doc>",

            "/**\n  * Set the x scroll position of the textfield.\n  * @param Number n: set the left edge of the textfield to offset\n  * n pixels \n  * (n is always &lt; 0)\n  */\nfunction setXScroll ( n ){\n    this.sprite.setXScroll(n);\n}",
            "<js2doc><property id=\"setXScroll\" name=\"setXScroll\"><doc><text>Set the x scroll position of the textfield.</text></doc><function><parameter name=\"n\" type=\"Number\"><doc><text>set the left edge of the textfield to offset\n n pixels \n (n is always &lt; 0)</text></doc></parameter></function></property></js2doc>",

            "/** @access private  */ function addText (msg1) { }; /** Foo */ function addText (msg2) { };",
            "<js2doc><property id=\"addText\" name=\"addText\"><doc><text>Foo</text></doc><function><parameter name=\"msg2\"/></function></property></js2doc>",
        };

        iterateTests(tests);
    }

    public void testCallExpressions () {

        String[] tests = {
            // Each case is input, expected-output
            // "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" is automatically prepended to output

            "DeclareEvent(foo, \"onBar\");",
            "<js2doc/>",
        };

        iterateTests(tests);
    }

    public void testUnhandledDirectives () {

        String[] tests = {
            // Each case is input, expected-output
            // "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" is automatically prepended to output

            "foo(10)",
            "<js2doc/>",
            
            "#pragma 'warnUndefinedReferences=false'",
            "<js2doc/>",
        };

        iterateTests(tests);
    }
    
    public void testClassDefinitions () {
            
        String[] tests = {
            // Each case is input, expected-output
            // "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" is automatically prepended to output

            // simple class declaration, no comment
            "class foo {};",
            "<js2doc><property id=\"foo\" name=\"foo\"><class/></property></js2doc>",

            // simple class declaration with comment
            "/** this is a comment */ class foo {};",
            "<js2doc><property id=\"foo\" name=\"foo\"><doc><text>this is a comment</text></doc><class/></property></js2doc>",

            "// this is a comment\n class foo {};",
            "<js2doc><property id=\"foo\" name=\"foo\"><class/></property></js2doc>",

            // class declaration with superclass, no comment
            "class foo extends bar {};",
            "<js2doc><property id=\"foo\" name=\"foo\"><class extends=\"bar\"/></property></js2doc>",

            // class declaration with superclass, with comment
            "/** this is a comment */ class foo extends bar {};",
            "<js2doc><property id=\"foo\" name=\"foo\"><doc><text>this is a comment</text></doc><class extends=\"bar\"/></property></js2doc>",

            "// garbage\n\n/** this is a comment\n  */\nclass foo {};",
            "<js2doc><property id=\"foo\" name=\"foo\"><doc><text>this is a comment</text></doc><class/></property></js2doc>",

            "// this is a comment\n class foo extends bar {};",
            "<js2doc><property id=\"foo\" name=\"foo\"><class extends=\"bar\"/></property></js2doc>",
            
            "class foo { var bar; };",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property id=\"foo.__ivars__\" name=\"__ivars__\"><object><property id=\"foo.__ivars__.bar\" name=\"bar\"/></object></property></class></property></js2doc>",

            "class foo { var bar; }; var baz; ",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property id=\"foo.__ivars__\" name=\"__ivars__\"><object><property id=\"foo.__ivars__.bar\" name=\"bar\"/></object></property></class></property><property id=\"baz\" name=\"baz\"/></js2doc>",

            "class foo { static var bar; };",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property id=\"foo.bar\" name=\"bar\" /></class></property></js2doc>",

            "class foo { static var bar; var baz; };",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property id=\"foo.bar\" name=\"bar\" /><property id=\"foo.__ivars__\" name=\"__ivars__\"><object><property id=\"foo.__ivars__.baz\" name=\"baz\"/></object></property></class></property></js2doc>",

            "class foo { var bar, baz; };",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property id=\"foo.__ivars__\" name=\"__ivars__\"><object><property id=\"foo.__ivars__.bar\" name=\"bar\"/><property id=\"foo.__ivars__.baz\" name=\"baz\"/></object></property></class></property></js2doc>",

            // no comment, but an attribute declaration
            "class foo { var bar; var baz; };",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property id=\"foo.__ivars__\" name=\"__ivars__\"><object><property id=\"foo.__ivars__.bar\" name=\"bar\"/><property id=\"foo.__ivars__.baz\" name=\"baz\"/></object></property></class></property></js2doc>",

            "class foo { function bar () {}; };",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property id=\"foo.prototype\" name=\"prototype\"><object><property id=\"foo.prototype.bar\" name=\"bar\"><function/></property></object></property></class></property></js2doc>",

            "class foo { static function bar () {}; };",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property id=\"foo.bar\" name=\"bar\"><function/></property></class></property></js2doc>",

            // no comment, but an attribute declaration
            "class foo { function bar (baz) {}; };",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property name=\"prototype\" id=\"foo.prototype\"><object><property id=\"foo.prototype.bar\" name=\"bar\"><function><parameter name=\"baz\"/></function></property></object></property></class></property></js2doc>",

            "class foo { /** @access private */ var bar; };",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property id=\"foo.__ivars__\" name=\"__ivars__\"><object><property id=\"foo.__ivars__.bar\" name=\"bar\" access=\"private\"/></object></property></class></property></js2doc>",

            "class foo { /** comment */ static var bar; };",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property id=\"foo.bar\" name=\"bar\"><doc><text>comment</text></doc></property></class></property></js2doc>",

            "class foo { /** @access private */ static var bar; };",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property id=\"foo.bar\" name=\"bar\" access=\"private\"/></class></property></js2doc>",

            "class foo { /** comment */ static function bar () {}; };",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property id=\"foo.bar\" name=\"bar\"><doc><text>comment</text></doc><function/></property></class></property></js2doc>",

            "class foo { /** @access private */ static function bar () {}; };",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property id=\"foo.bar\" name=\"bar\" access=\"private\"><function/></property></class></property></js2doc>",

            "class foo { /** @keywords private */ var bar; };",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property id=\"foo.__ivars__\" name=\"__ivars__\"><object><property id=\"foo.__ivars__.bar\" name=\"bar\" access=\"private\"/></object></property></class></property></js2doc>",

            "class foo { /** @type Boolean */ var bar; };",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property id=\"foo.__ivars__\" name=\"__ivars__\"><object><property id=\"foo.__ivars__.bar\" name=\"bar\" type=\"Boolean\"/></object></property></class></property></js2doc>",

            "class foo { /** @keywords private hack */ var bar; };",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property id=\"foo.__ivars__\" name=\"__ivars__\"><object><property id=\"foo.__ivars__.bar\" name=\"bar\" access=\"private\"><doc keywords=\"hack\"/></property></object></property></class></property></js2doc>",

            "class foo { var bar = true; };",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property id=\"foo.__ivars__\" name=\"__ivars__\"><object><property id=\"foo.__ivars__.bar\" name=\"bar\" value=\"true\" /></object></property></class></property></js2doc>",
            
            "class foo { var bar = null; };",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property id=\"foo.__ivars__\" name=\"__ivars__\"><object><property id=\"foo.__ivars__.bar\" name=\"bar\" value=\"null\" /></object></property></class></property></js2doc>",
            
            "class foo { DeclareEvent(prototype, \"onhack\"); };",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property name=\"prototype\" id=\"foo.prototype\"><object><property id=\"foo.prototype.onhack\" name=\"onhack\" type=\"LzEvent\" value=\"LzNullEvent\"/></object></property></class></property></js2doc>",
            
            "class foo { /** a hack */ DeclareEvent(prototype, \"onhack\"); };",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property name=\"prototype\" id=\"foo.prototype\"><object><property id=\"foo.prototype.onhack\" name=\"onhack\" type=\"LzEvent\" value=\"LzNullEvent\"><doc><text>a hack</text></doc></property></object></property></class></property></js2doc>",
            
            // should trigger "no referent" warning
            "class foo { DeclareEvent(bar, \"onhack\"); };",
            "<js2doc><property id=\"foo\" name=\"foo\"><class/></property></js2doc>",
            
            "/** @access private */ class foo {};",
            "<js2doc><property id=\"foo\" name=\"foo\" access=\"private\"><class/></property></js2doc>",

            "/** @keywords private */ class foo { };",
            "<js2doc><property id=\"foo\" name=\"foo\" access=\"private\"><class/></property></js2doc>",
            
            "class foo { function construct(parent, args) {} };",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property name=\"prototype\" id=\"foo.prototype\"><object><property id=\"foo.prototype.construct\" name=\"construct\"><function><parameter name=\"parent\"/><parameter name=\"args\"/></function></property></object></property></class></property></js2doc>",

            "/** @initarg foo */ class foo {};",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><initarg id=\"foo.foo\" name=\"foo\"/></class></property></js2doc>",

            "/** @initarg foo: bar */ class foo {};",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><initarg id=\"foo.foo\" name=\"foo\"><doc><text>bar</text></doc></initarg></class></property></js2doc>",

            "/** @initarg Number foo */ class foo {};",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><initarg id=\"foo.foo\" name=\"foo\" type=\"Number\"/></class></property></js2doc>",

            "/** @initarg Number foo: bar */ class foo {};",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><initarg id=\"foo.foo\" name=\"foo\" type=\"Number\"><doc><text>bar</text></doc></initarg></class></property></js2doc>",

            "/** @initarg public Number foo */ class foo {};",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><initarg id=\"foo.foo\" name=\"foo\" type=\"Number\" access=\"public\"/></class></property></js2doc>",

            "/** @initarg public Number foo: bar */ class foo {};",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><initarg id=\"foo.foo\" name=\"foo\" type=\"Number\" access=\"public\"><doc><text>bar</text></doc></initarg></class></property></js2doc>",

            "/** @initarg deprecated Number foo: bar */ class foo {};",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><initarg id=\"foo.foo\" name=\"foo\" type=\"Number\" modifiers=\"deprecated\"><doc><text>bar</text></doc></initarg></class></property></js2doc>",

            "class foo { setters.bar = \"setBar\"; };",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property id=\"foo.setters\" name=\"setters\"><object><property id=\"foo.setters.bar\" name=\"bar\" value=\"setBar\"/></object></property></class></property></js2doc>",

            "class foo { setters.bar = \"setBar\"; var bar; };",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property id=\"foo.setters\" name=\"setters\"><object><property id=\"foo.setters.bar\" name=\"bar\" value=\"setBar\"/></object></property><property id=\"foo.__ivars__\" name=\"__ivars__\"><object><property id=\"foo.__ivars__.bar\" name=\"bar\"/></object></property></class></property></js2doc>",

            "class foo { var bar; setters.bar = \"setBar\"; };",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property id=\"foo.__ivars__\" name=\"__ivars__\"><object><property id=\"foo.__ivars__.bar\" name=\"bar\"/></object></property><property id=\"foo.setters\" name=\"setters\"><object><property id=\"foo.setters.bar\" name=\"bar\" value=\"setBar\"/></object></property></class></property></js2doc>",
            
            "class foo { foo.prototype.bar = 10; }",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property name=\"prototype\" id=\"foo.prototype\"><object><property name=\"bar\" id=\"foo.prototype.bar\" value=\"10\"/></object></property></class></property></js2doc>",

            "class foo { function bar() {}; bar.prototype.baz = 10; }",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property id=\"foo.prototype\" name=\"prototype\"><object><property id=\"foo.prototype.bar\" name=\"bar\"><function/></property></object></property></class></property></js2doc>",
        };
    
        iterateTests(tests);
    }
    
    public void testTopLevelIfDirective () {
            
        String[] tests = {
            // Each case is input, expected-output
            // "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" is automatically prepended to output

            "if (false) { var foo; }",
            "<js2doc></js2doc>",
            
            "if (true) { var foo; }",
            "<js2doc><property id=\"foo\" name=\"foo\"/></js2doc>",
            
            "if (true) { var foo; } else { var bar; }",
            "<js2doc><property id=\"foo\" name=\"foo\"/></js2doc>",
            
            "if (true) { var foo; } else if (true) { var bar; }",
            "<js2doc><property id=\"foo\" name=\"foo\"/></js2doc>",
            
            "if (true) { var foo; } else if (false) { var bar; }",
            "<js2doc><property id=\"foo\" name=\"foo\"/></js2doc>",
            
            "if (false) { var foo; } else { var bar; }",
            "<js2doc><property id=\"bar\" name=\"bar\"/></js2doc>",
            
            "if (false) { var foo; } else if (true) { var bar; }",
            "<js2doc><property id=\"bar\" name=\"bar\"/></js2doc>",
            
            "if (false) { var foo; } else if (false) { var bar; }",
            "<js2doc></js2doc>",
            
            "if ($dhtml) { var foo; }",
            "<js2doc><property name=\"foo\" id=\"foo+dhtml\" runtimes=\"dhtml\"/></js2doc>",
            
            "if ($dhtml) { function foo() {}; }",
            "<js2doc><property name=\"foo\" id=\"foo+dhtml\" runtimes=\"dhtml\"><function/></property></js2doc>",
            
            "if ($swf8) { var foo; } else { }",
            "<js2doc><property name=\"foo\" id=\"foo+swf8\" runtimes=\"swf8\"/></js2doc>",
            
            "if ($swf8) { var foo; } else { var bar; }",
            "<js2doc><property name=\"foo\" id=\"foo+swf8\" runtimes=\"swf8\"/><property name=\"bar\" id=\"bar+dhtml+swf9\" runtimes=\"dhtml swf9\"/></js2doc>",
            
            "if ($swf8) { var foo; } else { var bar; var baz; }",
            "<js2doc><property name=\"foo\" id=\"foo+swf8\" runtimes=\"swf8\"/><property name=\"bar\" id=\"bar+dhtml+swf9\" runtimes=\"dhtml swf9\"/><property name=\"baz\" id=\"baz+dhtml+swf9\" runtimes=\"dhtml swf9\"/></js2doc>",
            
            "if ($swf8) { var foo; } else { if ($dhtml) { var bar; } }",
            "<js2doc><property name=\"foo\" id=\"foo+swf8\" runtimes=\"swf8\"/><property name=\"bar\" id=\"bar+dhtml\" runtimes=\"dhtml\"/></js2doc>",
            
            "if ($swf8) { var foo; } else { if ($dhtml) { var bar; } var baz; }",
            "<js2doc><property name=\"foo\" id=\"foo+swf8\" runtimes=\"swf8\"/><property name=\"bar\" id=\"bar+dhtml\" runtimes=\"dhtml\"/><property name=\"baz\" id=\"baz+dhtml+swf9\" runtimes=\"dhtml swf9\"/></js2doc>",
            
            "if ($swf8) { var foo; } else if ($dhtml) { var bar; }",
            "<js2doc><property name=\"foo\" id=\"foo+swf8\" runtimes=\"swf8\"/><property name=\"bar\" id=\"bar+dhtml\" runtimes=\"dhtml\"/></js2doc>",
            
            "if ($swf8) { var foo; } else if ($swf9) { var fab; } else if ($dhtml) { var bar; }",
            "<js2doc><property name=\"foo\" id=\"foo+swf8\" runtimes=\"swf8\"/><property name=\"fab\" id=\"fab+swf9\" runtimes=\"swf9\"/><property name=\"bar\" id=\"bar+dhtml\" runtimes=\"dhtml\"/></js2doc>",

            "if ($swf8) { var foo; } else if (!$swf8) { var bar; }",
            "<js2doc><property name=\"foo\" id=\"foo+swf8\" runtimes=\"swf8\"/><property name=\"bar\" id=\"bar+dhtml+swf9\" runtimes=\"dhtml swf9\"/></js2doc>",
            
            "if ($swf8) { var foo; } else if (false) { var bar; }",
            "<js2doc><property name=\"foo\" id=\"foo+swf8\" runtimes=\"swf8\"/></js2doc>",

            "if ($swf8) { var foo; } else if (true) { var bar; }",
            "<js2doc><property name=\"foo\" id=\"foo+swf8\" runtimes=\"swf8\"/><property name=\"bar\" id=\"bar+dhtml+swf9\" runtimes=\"dhtml swf9\"/></js2doc>",

            "if (! $dhtml) { var foo; }",
            "<js2doc><property name=\"foo\" id=\"foo+swf8+swf9\" runtimes=\"swf8 swf9\"/></js2doc>",

            "if (! ($swf8 || $swf9)) { var foo; }",
            "<js2doc><property name=\"foo\" id=\"foo+dhtml\" runtimes=\"dhtml\"/></js2doc>",

            "if (true || false) { var foo; }",
            "<js2doc><property id=\"foo\" name=\"foo\"/></js2doc>",

            "if (true || true) { var foo; }",
            "<js2doc><property id=\"foo\" name=\"foo\"/></js2doc>",

            "if (false || true) { var foo; }",
            "<js2doc><property id=\"foo\" name=\"foo\"/></js2doc>",

            "if (false || false) { var foo; }",
            "<js2doc/>",

            "if ($swf8 || $swf9) { var foo; }",
            "<js2doc><property name=\"foo\" id=\"foo+swf8+swf9\" runtimes=\"swf8 swf9\"/></js2doc>",

            "if (true || $swf9) { var foo; }",
            "<js2doc><property id=\"foo\" name=\"foo\"/></js2doc>",

            "if ($swf9 || true) { var foo; }",
            "<js2doc><property id=\"foo\" name=\"foo\"/></js2doc>",

            "if (false || $swf9) { var foo; }",
            "<js2doc><property name=\"foo\" id=\"foo+swf9\" runtimes=\"swf9\"/></js2doc>",

            "if ($swf9 || false) { var foo; }",
            "<js2doc><property name=\"foo\" id=\"foo+swf9\" runtimes=\"swf9\"/></js2doc>",

            "if ($swf8 || $swf9) { var foo; } else { var bar; }",
            "<js2doc><property name=\"foo\" id=\"foo+swf8+swf9\" runtimes=\"swf8 swf9\"/><property name=\"bar\" id=\"bar+dhtml\" runtimes=\"dhtml\"/></js2doc>",

            "if ($swf8 || !$swf9) { var foo; } else { var bar; }",
            "<js2doc><property name=\"foo\" id=\"foo+swf8\" runtimes=\"swf8\"/><property name=\"bar\" id=\"bar+swf9\" runtimes=\"swf9\"/></js2doc>",

            "if (true && true) { var foo; }",
            "<js2doc><property id=\"foo\" name=\"foo\"/></js2doc>",

            "if (true && false) { var foo; }",
            "<js2doc/>",

            "if (false && true) { var foo; }",
            "<js2doc/>",

            "if (false && false) { var foo; }",
            "<js2doc/>",

            "if (true && $swf9) { var foo; }",
            "<js2doc><property name=\"foo\" id=\"foo+swf9\" runtimes=\"swf9\"/></js2doc>",

            "if ($swf9 && true) { var foo; }",
            "<js2doc><property name=\"foo\" id=\"foo+swf9\" runtimes=\"swf9\"/></js2doc>",

            "if (false && $swf9) { var foo; }",
            "<js2doc/>",

            "if ($swf9 && false) { var foo; }",
            "<js2doc/>",

            // we punt if we see something like this -- too complex to model
            "if ($swf8 && $swf9) { var foo; }",
            "<js2doc><property id=\"foo\" name=\"foo\"/></js2doc>",
            
            // we punt if we see something like this -- too complex to model
            "if ($swf8 && $swf9) { var foo; } else { var bar; }",
            "<js2doc><property id=\"foo\" name=\"foo\" /></js2doc>",

            // punt
            "if ($swf8 && !$swf9) { var foo; } else { var bar; }",
            "<js2doc><property id=\"foo\" name=\"foo\"/></js2doc>",

            // punt
            "if ((! $swf8) && (! $swf9)) { var foo; }",
            "<js2doc><property id=\"foo\" name=\"foo\"/></js2doc>",

            // punt
            "if ($swf8) { var foo; } if ((!$swf8) && $dhtml) { var bar; }",
            "<js2doc><property name=\"foo\" id=\"foo+swf8\" runtimes=\"swf8\"/><property id=\"bar\" name=\"bar\"/></js2doc>",
            
            // punt
            "if ($debug) { function foo () {}; if ($swf8) { foo.bar = 10; } }",
            "<js2doc><property name=\"foo\" id=\"foo+debug\" includebuilds=\"debug\"><function/></property></js2doc>",
            //"<js2doc><property name=\"foo\" id=\"foo+debug\" includebuilds=\"debug\"><function><property name=\"bar\" id=\"foo+debug.bar+swf8\" value=\"10\" runtimes=\"swf8\" /></function></property></js2doc>",
            
            "if (! $swf9) { if (! $swf8) { var foo; } }",
            "<js2doc><property name=\"foo\" id=\"foo+dhtml\" runtimes=\"dhtml\"/></js2doc>",
            
            "if ($swf8) { class foo { var bar; function baz () {}; } }",
            "<js2doc><property name=\"foo\" id=\"foo+swf8\" runtimes=\"swf8\"><class><property name=\"__ivars__\" id=\"foo+swf8.__ivars__\"><object><property id=\"foo+swf8.__ivars__.bar\" name=\"bar\"/></object></property><property name=\"prototype\" id=\"foo+swf8.prototype\"><object><property id=\"foo+swf8.prototype.baz\" name=\"baz\"><function/></property></object></property></class></property></js2doc>",

            "if ($swf8) { class foo { prototype.bar = 10; } }",
            "<js2doc><property name=\"foo\" id=\"foo+swf8\" runtimes=\"swf8\"><class><property id=\"foo+swf8.prototype\" name=\"prototype\"><object><property id=\"foo+swf8.prototype.bar\" name=\"bar\" value=\"10\" /></object></property></class></property></js2doc>",

            "if ($swf8) { /** this is a comment */ var foo; }",
            "<js2doc><property name=\"foo\" id=\"foo+swf8\" runtimes=\"swf8\"><doc><text>this is a comment</text></doc></property></js2doc>",
            
            "if ($swf8) { /** this is a comment */ var foo; // another comment\n var bar; }",
            "<js2doc><property name=\"foo\" id=\"foo+swf8\" runtimes=\"swf8\"><doc><text>this is a comment</text></doc></property><property name=\"bar\" id=\"bar+swf8\" runtimes=\"swf8\"/></js2doc>",
            
            "if ($swf8) { /** this is a comment */ var foo; function bar (baz) {} }",
            "<js2doc><property name=\"foo\" id=\"foo+swf8\" runtimes=\"swf8\"><doc><text>this is a comment</text></doc></property><property name=\"bar\" id=\"bar+swf8\" runtimes=\"swf8\"><function><parameter name=\"baz\"/></function></property></js2doc>",

            "if ($swf8) { /* this is a comment */ var foo; }",
            "<js2doc><property name=\"foo\" id=\"foo+swf8\" runtimes=\"swf8\"/></js2doc>",
            
            "if ($swf8) { // this is a comment\n var foo; }",
            "<js2doc><property name=\"foo\" id=\"foo+swf8\" runtimes=\"swf8\"/></js2doc>",
            
            "class foo { if ($dhtml) { function construct(parent, args) {} } };",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property name=\"prototype\" id=\"foo.prototype\"><object><property name=\"construct\" runtimes=\"dhtml\" id=\"foo.prototype.construct+dhtml\"><function><parameter name=\"parent\"/><parameter name=\"args\"/></function></property></object></property></class></property></js2doc>",

            "if ($swf8) { var foo; } else if ($dhtml) { var foo; }",
            "<js2doc><property id=\"foo+swf8\" name=\"foo\" runtimes=\"swf8\"/><property id=\"foo+dhtml\" name=\"foo\" runtimes=\"dhtml\"/></js2doc>",

            "if ($swf8) { class foo extends bar {}; }",
            "<js2doc><property id=\"foo+swf8\" name=\"foo\" runtimes=\"swf8\"><class extends=\"bar\"/></property></js2doc>",
        };
    
        iterateTests(tests);
    }
    

    public void testClassIfDirective () {
            
        String[] tests = {
            // Each case is input, expected-output
            // "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" is automatically prepended to output
            
            "class foo { if ($dhtml) { var bar; } };",
            "<js2doc><property id=\"foo\" name=\"foo\"><class><property id=\"foo.__ivars__\" name=\"__ivars__\"><object><property name=\"bar\" id=\"foo.__ivars__.bar+dhtml\" runtimes=\"dhtml\"/></object></property></class></property></js2doc>",
            
        };
    
        iterateTests(tests);
    }
    
    public void testObjectLiteral () {
            
        String[] tests = {
            // Each case is input, expected-output
            // "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" is automatically prepended to output
            
            "var foo = { bar: 10 }",
            "<js2doc><property id=\"foo\" name=\"foo\"><object><property id=\"foo.bar\" name=\"bar\" value=\"10\"/></object></property></js2doc>",
            
            "var foo = { bar: function () {} }",
            "<js2doc><property id=\"foo\" name=\"foo\"><object><property id=\"foo.bar\" name=\"bar\"><function/></property></object></property></js2doc>",
            
        };
    
        iterateTests(tests);
    }
    
    public void testOldSkoolClassDeclarations () {
            
        String[] tests = {
            // Each case is input, expected-output
            // "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" is automatically prepended to output
            
            "var LzMessage = function (message) {}; LzMessage.prototype = new String();",
            "<js2doc><property id=\"LzMessage\" name=\"LzMessage\"><function><parameter name=\"message\"/><property id=\"LzMessage.prototype\" name=\"prototype\"><object type=\"String\"></object></property></function></property></js2doc>",
            
            "var LzMessage = function (message) {}; LzMessage.prototype = new String(); LzMessage.prototype.message = '';",
            "<js2doc><property id=\"LzMessage\" name=\"LzMessage\"><function><parameter name=\"message\"/><property id=\"LzMessage.prototype\" name=\"prototype\"><object type=\"String\"><property id=\"LzMessage.prototype.message\" name=\"message\" value=\"\"/></object></property></function></property></js2doc>",
            
            "if ($swf8) { var LzMessage = function (message) {}; LzMessage.prototype = new String(); LzMessage.prototype.message = ''; }",
            "<js2doc><property id=\"LzMessage+swf8\" name=\"LzMessage\" runtimes=\"swf8\"><function><parameter name=\"message\"/><property id=\"LzMessage+swf8.prototype\" name=\"prototype\"><object type=\"String\"><property id=\"LzMessage+swf8.prototype.message\" name=\"message\" value=\"\"/></object></property></function></property></js2doc>",
            
        };
    
        iterateTests(tests);
    }
    
    static final String[] runtimeOptionStrings = { "swf8", "swf9", "dhtml" };
    static final Set runtimeOptions = new HashSet(Arrays.asList(runtimeOptionStrings));
    static final String[][] runtimeAliasStrings = { { "as2", "swf8", "swf9" },
                                                    { "as3", "swf9" },
                                                    { "js1", "dhtml" } };
    static final List runtimeAliases = Arrays.asList(runtimeAliasStrings);                                                 
    static final String[] buildOptionStrings = { "debug", "profile" };
    static final List buildOptions = Arrays.asList(buildOptionStrings);
    
    private void iterateTests(String[] tests) {
    
        for (Iterator iter = Arrays.asList(tests).iterator(); iter.hasNext();) {
            String source = (String) iter.next();
            assertTrue(iter.hasNext());
            String result = (String) iter.next();
            result = result.replace("<js2doc", "<js2doc buildoptions=\"debug profile\" runtimeoptions=\"dhtml swf8 swf9\"");
            result = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + result;
            
            try {
                Document control = XMLUnit.buildControlDocument(result);
                
                Document test = JS2Doc.toXML(source, null, null, null, runtimeOptions, runtimeAliases, buildOptions);
                
                Diff diff = new Diff(control, test);
                
                String testString = JS2DocUtils.xmlToString(test);
                
                if (diff.identical() == false) {
                    System.out.println("identical: " + diff.identical());
                    System.out.println("input:  " + source);
                    System.out.println("output: " + testString);
                    System.out.println("expect: " + result);
                }

                assertXMLIdentical(diff, true, "JS2Doc.toXML(\"" + source + "\")");
    
            } catch (org.xml.sax.SAXException exc) {
                fail("SAXException JS2Doc.toXML(\"" + source + "\")");
                exc.printStackTrace();
            } catch (java.io.IOException exc) {
                fail("IOException JS2Doc.toXML(\"" + source + "\")");
                exc.printStackTrace();
            } catch (javax.xml.parsers.ParserConfigurationException exc) {
                fail("ParserConfigurationException JS2Doc.toXML(\"" + source + "\")");
                exc.printStackTrace();
            }
        }
    }
}
