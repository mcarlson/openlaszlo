/**
  * sprite tests
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic AS3
  */

package {
    import flash.display.*;
    import flash.events.*;
  
public class TestText extends Sprite {
        public function TestText () {

            //stage.addEventListener(MouseEvent.CLICK, clickListener);
        var sprite1:* = new LzTextSprite();

            sprite1.setX(100);
            sprite1.setY(20);
        var args:* = {};
            args.password =  false;
            args.multiline = false;
            args.font  = "Verdana";
            args.fontsize  =  11;
            args.fontstyle = "plain";
            
            sprite1.__initTextProperties(args);

            sprite1.setText("Hello Whirled!");
            sprite1.setBGColor(0xcccccc);

            sprite1.addEventListener(MouseEvent.MOUSE_DOWN, mouseDown) ;
            sprite1.addEventListener(MouseEvent.MOUSE_UP, mouseReleased);

            addChild(sprite1);


        var sprite2:* = new LzTextSprite();
                sprite2.setText("Hello Whirled!");
            sprite2.setBGColor(0xcccccc);
            sprite2.setX(100);
            sprite2.setY(50);
            
            args.fontstyle = "bold";
            sprite2.__initTextProperties(args);


            sprite2.addEventListener(MouseEvent.MOUSE_DOWN, mouseDown) ;
            sprite2.addEventListener(MouseEvent.MOUSE_UP, mouseReleased);

            addChild(sprite2);


        }


        public function mouseDown(event:MouseEvent):void {
        var foo:* = new ClassB();
            trace("foo =  "+foo);
            trace("foo.constructor "+foo.constructor);
            trace("foo.prototype "+foo.prototype);
            trace("foo.prototype.constructor "+foo.prototype.constructor);
            trace("foo.prototype.prototype "+foo.prototype.prototype);
            trace("foo.constructor.prototype "+foo.constructor.prototype);
            trace("foo.constructor.constructor "+foo.constructor.constructor);
            trace("foo.constructor.prototype.prototype "+foo.constructor.prototype.prototype);
            trace("foo.constructor.prototype.constructor "+foo.constructor.prototype.constructor);
            trace("foo.constructor.prototype.constructor.prototype "+foo.constructor.prototype.constructor.prototype);
        }

        public function mouseReleased(event:MouseEvent):void {
            trace("mouse up on "+event.target);
        }

    }
}

trace('foo');

class ClassA {
}
    
class ClassB extends ClassA {
}
