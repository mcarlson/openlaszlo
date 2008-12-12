/**
  * LzSprite.as
  *
  * @copyright Copyright 2007, 2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * based on http://www.ghost23.de/blogarchive/2008/04/as3-application-1.html
  * included in SWF9Writer.java
  *
  * @topic Kernel
  * @subtopic swf9
  * @author Max Carlson &lt;max@laszlosystems.com&gt;
  */
package {
    import flash.display.DisplayObject;
    import flash.display.MovieClip;
    import flash.events.Event;
    import flash.events.ProgressEvent;
    import flash.net.navigateToURL;
    import flash.net.URLRequest;

    public class LzPreloader extends MovieClip {
        public function LzPreloader() {
            stop();
            root.loaderInfo.addEventListener(ProgressEvent.PROGRESS,loadProgress);
            addEventListener(Event.ENTER_FRAME, enterFrame);
        }
        
        public function enterFrame(event:Event):void {
            if (framesLoaded == totalFrames) {
                root.loaderInfo.removeEventListener(ProgressEvent.PROGRESS,loadProgress);
                nextFrame();
                var mainClass:Class = Class(loaderInfo.applicationDomain.getDefinition('LzSpriteApplication'));
                if(mainClass) {
                    var main:DisplayObject = DisplayObject(new mainClass());
                    if (main) {
                        removeEventListener(Event.ENTER_FRAME, enterFrame);
                        stage.addChild(main);
                        stage.removeChild(this);
                    }
                }
            }
        }
        
        private function loadProgress(event:Event):void {
            var percload:Number = Math.floor(root.loaderInfo.bytesLoaded / root.loaderInfo.bytesTotal * 100);
            var id = stage.loaderInfo.parameters.id;
            if (id) {
                var js = 'if (window.lz && lz.embed && lz.embed.applications && lz.embed.applications.' + id + ') lz.embed.applications.' + id + '._sendPercLoad(' + percload + ')';
                navigateToURL(new URLRequest('javascript:' + js + ';void(0);'), '_self');
            }
        }
    }
}
