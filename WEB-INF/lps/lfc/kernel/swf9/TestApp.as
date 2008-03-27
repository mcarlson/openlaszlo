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
  
  // When the user clicks an empty area of the Stage instance, this class
  // draws a randomly sized and colored circle. When the user clicks 
  // a circle, this class removes that circle from the screen.
  public class TestApp extends Sprite {

      [Embed(source="logo.swf")]
      public var logoClass:Class;

    public function TestApp () {



        //stage.addEventListener(MouseEvent.CLICK, clickListener);
    var sprite1:* = new LzSprite(null, false);

      sprite1.setX(100);
      sprite1.setY(20);
      sprite1.setWidth(100);
      sprite1.setHeight(50);
      sprite1.setBGColor(0xff0000);


      sprite1.addEventListener(MouseEvent.MOUSE_DOWN, mouseDown) ;
      sprite1.addEventListener(MouseEvent.MOUSE_UP, mouseReleased);

      addChild(sprite1);

    var sprite2:* = new LzSprite(null, false);

      /*      sprite2.setY(100);
      sprite2.setSource("logo.swf");
      addChild(sprite2);
      sprite2.addEventListener(MouseEvent.MOUSE_DOWN, toggleplay) ;*/




    var asset:DisplayObject = new logoClass();
      trace('making new asset ' +asset);
      addChild(asset);



      //sprite2.scaleX = 0.3;
      //      sprite2.scaleY = 0.3;


    var sprite3:* = new LzSprite(null, false);

      sprite3.setX( 200);
      sprite3.setWidth( 100);
      sprite3.setHeight( 100);
      sprite3.setBGColor(0x0000ff);
      addChild(sprite3);

      sprite3.addEventListener(MouseEvent.MOUSE_DOWN, describeImg) ;      


      // Test clipping
    var sprite4:LzSprite = new LzSprite(null, false);

      sprite4.setX(100);
      sprite4.setY(100);
      sprite4.setSource("picture.jpg");
      sprite4.setWidth(100);
      sprite4.setHeight(50);
      sprite4.setClip(true);
      addChild(sprite4);



      // This is invisible, but should catch mouse clicks
    var sprite5:* = new LzSprite(null, false);
      sprite5.setX(0);
      sprite5.setY(0);
      sprite5.setWidth( 100);
      sprite5.setHeight( 100);
      sprite5.setClickable(true);
      addChild(sprite5);
      sprite5.addEventListener(MouseEvent.MOUSE_DOWN, describeSprite) ;      





      // Test 'stretches'

          var sprite6:LzSprite = new LzSprite(null, false);
        sprite6.owner = this;
      sprite6.setX(400);
      sprite6.setY(200);
      sprite6.setWidth(100);
      sprite6.setHeight(50);
      sprite6.stretchResource("both");
      sprite6.setSource("picture.jpg");
      sprite6.addEventListener(MouseEvent.MOUSE_DOWN, bringToFront) ;      
      addChild(sprite6);

      // Test bringToFront, sendToBack
      
    var sprite7:LzSprite = new LzSprite(null, false);
        sprite7.owner = this;
      sprite7.setX(400);
      sprite7.setY(200);
      sprite7.setWidth(100);
      sprite7.setHeight(100);
      sprite7.setSource("logo.swf");
      addChild(sprite7);

    }

      public function bringToFront(event:MouseEvent):void {
          event.target.parent.bringToFront();
      }

      // emulating callback of lzview
      public function resourceload(info:Object):void {
          //info.sprite.stretchResource("both");
          trace("resource loaded " +info);
      }


      public function describeSprite(event:MouseEvent):void {
          trace('clicked on sprite', event);
      }


      static public var playing:Boolean = true;

      /*      public function toggleplay(event:MouseEvent):void {
          trace('toggle play on sprite', event);
      var obj:AVM1Movie = AVM1Movie(event.target.content);
          trace('movieclip = '+obj);
                  if (playing) {
              obj.stop();
          } else {
              obj.play();
          }
        
          playing = (! playing);
      }
  */



      public function describeImg(event:MouseEvent):void {
          trace("describe "+event.target+" width="+event.target.width);
          trace("describe "+event.target+" height="+event.target.height);
          trace("describe "+event.target+" scaleX="+event.target.scaleX);

          trace("describe parent "+event.target.parent+" width="+event.target.parent.width);
          trace("describe "+event.target.parent+" height="+event.target.parent.height);
          trace("describe "+event.target.parent+" scaleX="+event.target.parent.scaleX);
      }

      public function mouseDown(event:MouseEvent):void {
          trace("mouse down on "+event.target);
          event.target.startDrag();
      }

      public function mouseReleased(event:MouseEvent):void {
          trace("mouse up on "+event.target);
          event.target.stopDrag();
      }


    private function clickListener (e:MouseEvent):void {
      // If the event target is the Stage instance
      if (e.target == stage) {
        // ...draw a circle
        addSprite(e.stageX, e.stageY);
      var foo:Sprite = new LzSprite();
      } else {
        // ... otherwise, the event target must be a Sprite object 
        // containing a circle, so remove it
        removeChild(DisplayObject(e.target));
      }
    }

    public function addSprite (x:int, y:int):void {
      var randomColor:int = Math.floor(Math.random()*0xFFFFFF);
      var randomSize:int = 10 + Math.floor(Math.random()*150);
      var circle:LzSprite = new LzSprite()
      circle.graphics.beginFill(randomColor, 1);
      circle.graphics.lineStyle();
      circle.graphics.drawEllipse(0, 0,randomSize, randomSize);
      circle.x = x-randomSize/2;
      circle.y = y-randomSize/2;
      addChild(circle);
    }
  }
}

