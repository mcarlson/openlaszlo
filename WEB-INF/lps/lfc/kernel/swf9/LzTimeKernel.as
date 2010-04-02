/**
  * LzTimeKernel.as
  *
  * @copyright Copyright 2001-2010 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic swf9
  */

// Receives and sends timing events
final class LzTimeKernelClass {
    #passthrough (toplevel:true) {
    import flash.utils.getTimer;
    import flash.events.TimerEvent;
    }#

    private var timers :Object = {};

    /**
      * Creates a new timer and returns an unique identifier which can be used to remove the timer.
      */
    private function createTimer (delay:Number, repeatCount:int, closure:Function, args:Array) :uint {
        var timer:LzKernelTimer = LzKernelTimer.create();
        this.timers[timer.timerID] = timer;
        timer.delay = delay;
        timer.repeatCount = repeatCount;
        timer.closure = closure;
        timer.arguments = args;
        timer.addEventListener(TimerEvent.TIMER, this.timerHandler);
        timer.addEventListener(TimerEvent.TIMER_COMPLETE, this.timerCompleteHandler);
        timer.start();
        return timer.timerID;
    }

    /**
      * Stops and removes the timer with the given id.
      */
    private function removeTimer (id:uint) :void {
        var timer:LzKernelTimer = this.timers[id];
        if (timer) {
            timer.closure = null;
            timer.arguments = null;
            timer.removeEventListener(TimerEvent.TIMER, this.timerHandler);
            timer.removeEventListener(TimerEvent.TIMER_COMPLETE, this.timerCompleteHandler);
            timer.reset();
            delete this.timers[id];
            LzKernelTimer.remove(timer);
        }
    }

    private function timerHandler (event:TimerEvent) :void {
        var timer:LzKernelTimer = LzKernelTimer(event.target);
        if (timer.closure) {
            timer.closure.apply(null, timer.arguments);
        }
    }

    private function timerCompleteHandler (event:TimerEvent) :void {
        var timer:LzKernelTimer = LzKernelTimer(event.target);
        this.removeTimer(timer.timerID);
    }

    public const getTimer :Function = flash.utils.getTimer;

    // const setTimeout :Function = flash.utils.setTimeout;
    public function setTimeout (closure:Function, delay:Number, ...args) :uint {
        return this.createTimer(delay, 1, closure, args);
    }

    // const setInterval :Function = flash.utils.setInterval;
    public function setInterval (closure:Function, delay:Number, ...args) :uint {
        return this.createTimer(delay, 0, closure, args);
    }

    // const clearTimeout :Function = flash.utils.clearTimeout;
    public function clearTimeout (id:uint) :void {
        this.removeTimer(id);
    }

    // const clearInterval :Function = flash.utils.clearInterval;
    public function clearInterval (id:uint) :void {
        this.removeTimer(id);
    }

    function LzTimeKernelClass() {
    }
}
var LzTimeKernel = new LzTimeKernelClass();

/**
  * This is a helper class for LzTimeKernel. In addition to the flash.utils.Timer
  * class, each timer has got an unique id and holds a reference to a function
  * and an arguments array.
  * @see LzTimeKernelClass#createTimer
  * @see LzTimeKernelClass#removeTimer
  */
final class LzKernelTimer extends Timer {
  #passthrough (toplevel:true) {
    import flash.utils.Timer;
  }#

  #passthrough {
    private static var idCounter :uint = 0;
    private static const MAX_POOL :int = 10;
    private static var timerPool :Array = [];

    /**
     * Use this method instead of the constructor to create an instance
     */
    public static function create () :LzKernelTimer {
        var timer:LzKernelTimer = timerPool.pop() || new LzKernelTimer();
        timer._timerID = ++idCounter;
        return timer;
    }

    /**
     * Allow timers to be pooled and reused later
     */
    public static function remove (timer:LzKernelTimer) :void {
        if (timerPool.length < MAX_POOL) {
            timerPool.push(timer);
        }
    }

    public function LzKernelTimer () {
        super(0);
    }

    private var _timerID :uint;
    public function get timerID () :uint {
        return this._timerID;
    }

    private var _closure :Function;
    public function get closure () :Function {
        return this._closure;
    }
    public function set closure (c:Function) :void {
        this._closure = c;
    }

    private var _arguments :Array;
    public function get arguments () :Array {
        return this._arguments;
    }
    public function set arguments (a:Array) :void {
        this._arguments = a;
    }
  }#
}
