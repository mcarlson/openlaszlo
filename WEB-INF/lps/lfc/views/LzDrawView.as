/******************************************************************************
 * LzDrawView.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2005 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// DEFINE OBJECT: LzDrawView
//
// LzDrawView extends view to add procedural APIs that allow drawing.
// Drawview implements a subset of the whatwg drawing APIs, which can be found at:
// http://www.whatwg.org/specs/web-apps/current-work/#graphics
//=============================================================================
var LzDrawView = Class( "LzDrawView" , LzView );

LzDrawView.prototype.__MOVETO_OP = 0;
LzDrawView.prototype.__LINETO_OP = 1;
LzDrawView.prototype.__QCURVE_OP = 2;
LzDrawView.prototype.__pathisopen = false;
LzDrawView.prototype.__mclevel = 1;
LzDrawView.prototype.__mc = null;

//============================================================================
// @keywords public
//
// @field globalAlpha: Gives an alpha value that is applied to shapes and images before they are composited onto the canvas. The valid range of values is from 0.0 (fully transparent) to 1.0 (no additional transparency). If the attribute is set to values outside this range, they are ignored. When the context is created, the globalAlpha attribute initially has the value 1.0.
// @field lineWidth: Gives the default width of lines, in coordinate space units. Negative values are ignored.  0 draws hairlines - lines that are always 1 pixel wide even when scaled.
// @field strokeStyle: Represents the colour to use for the lines around shapes.  Specified as a hexadecimal number in the format 0xffffff.
// @field fillStyle: Represents the colour or style to use for the fill inside the shapes. Can be either a hexadecimal number (0xffffff) or an LzCanvasGradient.
LzDrawView.prototype.globalAlpha = 1;
LzDrawView.prototype.lineWidth = 1;
LzDrawView.prototype.strokeStyle = 0x000000;
LzDrawView.prototype.fillStyle = 0x000000;

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDrawView.prototype.construct = function(parent, args) {
    super.construct(parent, args);
    if ( this.__LZmovieClipRef == null ){
        this.makeContainerResource( );
    }
    this.__mc = this.__LZmovieClipRef;
    // use view movieclp for now instead of .createEmptyMovieClip('drawview' + this.__mclevel, this.__mclevel);
    this.beginPath();
}

//------------------------------------------------------------------------------
// Resets the list of subpaths to an empty list, and calls moveTo() with the point (0,0).
//------------------------------------------------------------------------------
LzDrawView.prototype.beginPath = function() {
    //_root.Debug.write('beginPath');
    var m = this.__mc;
    this.__path=[]
    this.__pathisopen = true;
    m.moveTo(0,0);
}

//------------------------------------------------------------------------------
// Adds a straight line from the current position to the first point in the last subpath and marks the subpath as closed, if the last subpath isn't closed, and if it has more than one point in its list of points. If the last subpath is not open or has only one point, it does nothing.
//------------------------------------------------------------------------------
LzDrawView.prototype.closePath = function() {
    if (this.__pathisopen && this.__path.length > 1) {   
        var p = this.__path[0];
        if (p[0] == this.__MOVETO_OP || p[0] == this.__LINETO_OP) {
            var x = p[1];
            var y = p[2];
        } else if (p[0] == this.__QCURVE_OP) {
            var x = p[3];
            var y = p[4];
        } else {
            return;
        }
        //_root.Debug.write('closePath', x, y);
        this.lineTo(x,y);
        this.__pathisopen = false;
    }
}

//------------------------------------------------------------------------------
// Sets the current position to the given coordinate and creates a new subpath with that point as its first (and only) point. If there was a previous subpath, and it consists of just one point, then that subpath is removed from the path.
//------------------------------------------------------------------------------
LzDrawView.prototype.moveTo = function(x, y) {
    if (this.__pathisopen) {
        this.__path[this.__path.length] = [this.__MOVETO_OP, x, y];
    }
    //_root.Debug.write('moveTo', this.__path);
}

//------------------------------------------------------------------------------
// Adds the given coordinate (x, y) to the list of points of the subpath, and connects the current position to that point with a straight line. It then sets the current position to the given coordinate (x, y).
// @param Number x: x position to draw to
// @param Number y: y position to draw to
//------------------------------------------------------------------------------
LzDrawView.prototype.lineTo = function(x, y) {
    if (this.__pathisopen) {
        this.__path[this.__path.length] = [this.__LINETO_OP, x, y];
    }
    //_root.Debug.write('lineTo', this.__path);
}

//------------------------------------------------------------------------------
// Adds the given coordinate (x, y) to the list of points of the subpath, and connects the current position to that point with a quadratic curve with control point (cpx, cpy). It then sets the current position to the given coordinate (x, y).
// @param Number cpx: curve control point's x position
// @param Number cpy: curve control point's y position
// @param Number x: x position to draw to
// @param Number y: y position to draw to
//------------------------------------------------------------------------------
LzDrawView.prototype.quadraticCurveTo = function(cpx, cpy, x, y) {
    if (this.__pathisopen) {
        this.__path[this.__path.length] = [this.__QCURVE_OP, cpx, cpy, x, y];
    }
    //_root.Debug.write('quadraticCurveTo', this.__path);
}

//------------------------------------------------------------------------------
// Fills each subpath of the current path in turn, using fillStyle, and using the non-zero winding number rule. Open subpaths are implicitly closed when being filled (without affecting the actual subpaths).
// Note that closePath() is called before the line is filled.
//------------------------------------------------------------------------------
LzDrawView.prototype.fill = function(m) {
    if (m == null) {
        m = this.__mc;
    }

    if (typeof this.fillStyle == 'object' && this.fillStyle instanceof LzCanvasGradient) {
        //_root.Debug.write('before apply');
        this.fillStyle.__applyTo(m);
    } else {
        //_root.Debug.write('fill', m, this.fillStyle, this.globalAlpha * 100);
        m.beginFill(this.fillStyle, this.globalAlpha * 100);
    }
    this.closePath();
    this.__playPath(m);
    m.endFill();
    this.updateResourceSize();
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDrawView.prototype.clip = function() {
    if (this.__LZmaskClip == null){
        this.applyMask(true);
    }
    //_root.Debug.write('mask', this.__LZmaskClip, this.masked, this.__LZmovieClipRef);
    this.fill(this.__LZmaskClip);
}

//------------------------------------------------------------------------------
// Strokes each subpath of the current path in turn, using the strokeStyle and lineWidth attributes.
//------------------------------------------------------------------------------
LzDrawView.prototype.stroke = function() {
    if (typeof this.strokeStyle == 'object' && this.strokeStyle instanceof LzCanvasGradient) {
        //_root.Debug.warn ("Gradient line fills aren't supported.");
        return;
    }
    var m = this.__mc;
    m.lineStyle(this.lineWidth, this.strokeStyle, this.globalAlpha * 100);
    //_root.Debug.write(m, 'stroke',this.lineWidth, this.strokeStyle, this.globalAlpha * 100);
    this.__playPath(m);
    m.lineStyle(undefined);
    this.updateResourceSize();
}

//------------------------------------------------------------------------------
// Clears drawing area
//------------------------------------------------------------------------------
LzDrawView.prototype.clear = function() {
    if (this.__mc) this.__mc.clear();
}

//------------------------------------------------------------------------------
// Clears mask area
// @keywords private
//------------------------------------------------------------------------------
LzDrawView.prototype.clearMask = function() {
    if (this.__LZmaskClip) this.__LZmaskClip.clear();
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDrawView.prototype.__playPath = function(m) {
    var p = this.__path;
    //_root.Debug.write(p, m);
    for (var i = 0; i < p.length; i++) {
        var op = p[i];
        var optype = op[0];
        if (optype == this.__MOVETO_OP) {
            //_root.Debug.write(m, 'moveTo', op[1], op[2]);
            m.moveTo(op[1], op[2]);
        } else if (optype == this.__LINETO_OP) {
            //_root.Debug.write(m, 'lineTo', op[1], op[2]);
            m.lineTo(op[1], op[2]);
        } else if (optype == this.__QCURVE_OP) {
            //_root.Debug.write(m, 'quadraticCurveTo', op[1], op[2], op[3], op[4]);
            m.curveTo(op[1], op[2], op[3], op[4]);
        }
    }
} 

//-----------------------------------------------------------------------------
// Takes four arguments, representing the start point (x0, y0) and end point (x1, y1) of the gradient, in coordinate space units, and returns a linear CanvasGradient  initialised with that line.
// Linear gradients are rendered such that at the starting point on the canvas the colour at offset 0 is used, that at the ending point the color at offset 1 is used, that all points on a line perpendicular to the line between the start and end points have the colour at the point where those two lines cross. (Of course, the colours are only painted where the shape they are being painted on needs them.) 
//
// @param Number x0: Starting x position
// @param Number y0: Starting y position
// @param Number x1: Ending x position
// @param Number y1: Ending y position
// @return LzCanvasGradient: Opaque class used to add color/offset/alpha steps - see LzCanvasGradient.addColorStop();
//-----------------------------------------------------------------------------
LzDrawView.prototype.createLinearGradient = function(x0, y0, x1, y1) {
    var dx = x1-x0;
    var dy = y1-y0;
    var r = Math.atan2(dy, dx);
    var h = Math.sqrt(dx*dx + dy*dy);
    var w = h;
    var y = y0;
    var x = x0;
    if (y1 < y0) {
        y = y1;
    }
    if (x1 < x0) {
        x = x1;
    }
    
    var g = new LzCanvasGradient();
    g.__init(this, {matrixType:"box", x:x, y:y, w:w, h:h, r:r});
    //_root.Debug.write('createLinearGradient', {matrixType:"box", x:x0, y:y0, w:w, h:h, r:r});
    return g;
}

//-----------------------------------------------------------------------------
// Takes six arguments, the first three representing the start point (x0, y0) and rotation r0, and the last three representing the end point (x1, y1) and radius r1. The values are in coordinate space units. 
// 
// Rotation doesn't appear to work for radial gradients.  Even so, it can be set by specifying r0 in radians.  r1 is ignored.
// 
// @param Number x0: Starting x position
// @param Number y0: Starting y position
// @param Number r0: Rotation of the gradient - not working
// @param Number x1: Ending x position
// @param Number y1: Ending y position
// @param Number r1: Ignored
// @return LzCanvasGradient: Opaque class used to add color/offset/alpha steps - see addColorStop();
//-----------------------------------------------------------------------------
LzDrawView.prototype.createRadialGradient = function(x0, y0, r0, x1, y1, r1) {
    var w = x1-x0;
    var h = y1-y0;
    // Rotation doesn't seem to work
    var r = r0 != null ? r0 : Math.atan2(h, w);
    var g = new LzCanvasGradient();
    g.__init(this, {matrixType:"box", x:x0, y:y0, w:w, h:h, r:r});
    //_root.Debug.write('createRadialGradient', {matrixType:"box", x:x0, y:y0, w:w, h:h, r:r});
    g._t = "radial";
    return g;
}


//-----------------------------------------------------------------------------
// Adds an arc to the current path. The arc is a segment of a circle that has radius as given. 
// The circle segment is determined by the two angles startAngle and endAngle and begins at the given coordinate (x,y).
// If clockwise is true, the arc is drawn clockwise from startAngle to endAngle, otherwise it is drawn counter-clockwise (anti-clockwise).
//
// @param Number x: Starting x position
// @param Number y: Starting y position
// @param Number radius: Radius
// @param Number startAngle: Angle to start in degrees
// @param Number endAngle: Angle to end in degrees
// @param Number clockwise: anticlockwise if true, clockwise otherwise 
//-----------------------------------------------------------------------------
LzDrawView.prototype.arc = function(x, y, radius, startAngle, endAngle, clockwise) {
    var arc = clockwise == true ? startAngle - endAngle : endAngle - startAngle;
    this.moveTo(x, y);
    return this._drawArc(x, y, radius, arc, startAngle);
}

//-----------------------------------------------------------------------------
// Rect creates a new subpath containing just the rectangle with top left coordinate (x, y), width w and height h.
// based on mc.drawRect() - by Ric Ewing (ric@formequalsfunction.com)
//
// @param Number x: starting x position
// @param Number y: starting y position
// @param Number w: Width
// @param Number h: Height
// @param Number cornerRadius: Optional radius of rounding for corners (defaults to 0)
//-----------------------------------------------------------------------------
LzDrawView.prototype.rect = function(x, y, w, h, cornerRadius) {
    if (arguments.length<4) {
        return;
    }
    // if the user has defined cornerRadius our task is a bit more complex. :)
    if (cornerRadius>0) {
        // init vars
        var theta, angle, cx, cy, px, py;
        // make sure that w + h are larger than 2*cornerRadius
        if (cornerRadius>Math.min(w, h)/2) {
            cornerRadius = Math.min(w, h)/2;
        }
        // theta = 45 degrees in radians
        theta = Math.PI/4;
        // draw top line
        this.moveTo(x+cornerRadius, y);
        this.lineTo(x+w-cornerRadius, y);
        //angle is currently 90 degrees
        angle = -Math.PI/2;
        // draw tr corner in two parts
        cx = x+w-cornerRadius+(Math.cos(angle+(theta/2))*cornerRadius/Math.cos(theta/2));
        cy = y+cornerRadius+(Math.sin(angle+(theta/2))*cornerRadius/Math.cos(theta/2));
        px = x+w-cornerRadius+(Math.cos(angle+theta)*cornerRadius);
        py = y+cornerRadius+(Math.sin(angle+theta)*cornerRadius);
        this.quadraticCurveTo(cx, cy, px, py);
        angle += theta;
        cx = x+w-cornerRadius+(Math.cos(angle+(theta/2))*cornerRadius/Math.cos(theta/2));
        cy = y+cornerRadius+(Math.sin(angle+(theta/2))*cornerRadius/Math.cos(theta/2));
        px = x+w-cornerRadius+(Math.cos(angle+theta)*cornerRadius);
        py = y+cornerRadius+(Math.sin(angle+theta)*cornerRadius);
        this.quadraticCurveTo(cx, cy, px, py);
        // draw right line
        this.lineTo(x+w, y+h-cornerRadius);
        // draw br corner
        angle += theta;
        cx = x+w-cornerRadius+(Math.cos(angle+(theta/2))*cornerRadius/Math.cos(theta/2));
        cy = y+h-cornerRadius+(Math.sin(angle+(theta/2))*cornerRadius/Math.cos(theta/2));
        px = x+w-cornerRadius+(Math.cos(angle+theta)*cornerRadius);
        py = y+h-cornerRadius+(Math.sin(angle+theta)*cornerRadius);
        this.quadraticCurveTo(cx, cy, px, py);
        angle += theta;
        cx = x+w-cornerRadius+(Math.cos(angle+(theta/2))*cornerRadius/Math.cos(theta/2));
        cy = y+h-cornerRadius+(Math.sin(angle+(theta/2))*cornerRadius/Math.cos(theta/2));
        px = x+w-cornerRadius+(Math.cos(angle+theta)*cornerRadius);
        py = y+h-cornerRadius+(Math.sin(angle+theta)*cornerRadius);
        this.quadraticCurveTo(cx, cy, px, py);
        // draw bottom line
        this.lineTo(x+cornerRadius, y+h);
        // draw bl corner
        angle += theta;
        cx = x+cornerRadius+(Math.cos(angle+(theta/2))*cornerRadius/Math.cos(theta/2));
        cy = y+h-cornerRadius+(Math.sin(angle+(theta/2))*cornerRadius/Math.cos(theta/2));
        px = x+cornerRadius+(Math.cos(angle+theta)*cornerRadius);
        py = y+h-cornerRadius+(Math.sin(angle+theta)*cornerRadius);
        this.quadraticCurveTo(cx, cy, px, py);
        angle += theta;
        cx = x+cornerRadius+(Math.cos(angle+(theta/2))*cornerRadius/Math.cos(theta/2));
        cy = y+h-cornerRadius+(Math.sin(angle+(theta/2))*cornerRadius/Math.cos(theta/2));
        px = x+cornerRadius+(Math.cos(angle+theta)*cornerRadius);
        py = y+h-cornerRadius+(Math.sin(angle+theta)*cornerRadius);
        this.quadraticCurveTo(cx, cy, px, py);
        // draw left line
        this.lineTo(x, y+cornerRadius);
        // draw tl corner
        angle += theta;
        cx = x+cornerRadius+(Math.cos(angle+(theta/2))*cornerRadius/Math.cos(theta/2));
        cy = y+cornerRadius+(Math.sin(angle+(theta/2))*cornerRadius/Math.cos(theta/2));
        px = x+cornerRadius+(Math.cos(angle+theta)*cornerRadius);
        py = y+cornerRadius+(Math.sin(angle+theta)*cornerRadius);
        this.quadraticCurveTo(cx, cy, px, py);
        angle += theta;
        cx = x+cornerRadius+(Math.cos(angle+(theta/2))*cornerRadius/Math.cos(theta/2));
        cy = y+cornerRadius+(Math.sin(angle+(theta/2))*cornerRadius/Math.cos(theta/2));
        px = x+cornerRadius+(Math.cos(angle+theta)*cornerRadius);
        py = y+cornerRadius+(Math.sin(angle+theta)*cornerRadius);
        this.quadraticCurveTo(cx, cy, px, py);
    } else {
        // cornerRadius was not defined or = 0. This makes it easy.
        this.moveTo(x, y);
        this.lineTo(x+w, y);
        this.lineTo(x+w, y+h);
        this.lineTo(x, y+h);
        this.lineTo(x, y);
    }
}


//-----------------------------------------------------------------------------
// Draws an oval at the origin x, y with a radius radius.  If yRadius is specified, radius is the x radius of the oval.
// based on mc.drawOval() - by Ric Ewing (ric@formequalsfunction.com) - version 1.1 - 4.7.2002
// 
// @param Number x: Starting x position
// @param Number y: Starting y position
// @param Number radius: The radius of the oval. If [optional] yRadius is defined, r is the x radius.
// @param Number yRadius: Optional y radius of the oval
//-----------------------------------------------------------------------------
LzDrawView.prototype.oval = function(x, y, radius, yRadius) {
    if (arguments.length<3) {
        return;
    }
    // init variables
    var theta, xrCtrl, yrCtrl, angle, angleMid, px, py, cx, cy;
    // if only yRadius is undefined, yRadius = radius
    if (yRadius == undefined) {
        yRadius = radius;
    }
    // covert 45 degrees to radians for our calculations
    theta = Math.PI/4;
    // calculate the distance for the control point
    xrCtrl = radius/Math.cos(theta/2);
    yrCtrl = yRadius/Math.cos(theta/2);
    // start on the right side of the circle
    angle = 0;
    this.moveTo(x+radius, y);
    // this loop draws the circle in 8 segments
    for (var i = 0; i<8; i++) {
        // increment our angles
        angle += theta;
        angleMid = angle-(theta/2);
        // calculate our control point
        cx = x+Math.cos(angleMid)*xrCtrl;
        cy = y+Math.sin(angleMid)*yrCtrl;
        // calculate our end point
        px = x+Math.cos(angle)*radius;
        py = y+Math.sin(angle)*yRadius;
        // draw the circle segment
        this.quadraticCurveTo(cx, cy, px, py);
    }
    return {x:px, y:py};
}


//-----------------------------------------------------------------------------
// based on mc.drawArc() - by Ric Ewing (ric@formequalsfunction.com) - version 1.5 - 4.7.2002
// 
// x, y = This must be the current pen position... other values will look bad
// radius = radius of Arc. If [optional] yRadius is defined, then r is the x radius
// arc = sweep of the arc. Negative values draw clockwise.
// startAngle = starting angle in degrees.
// yRadius = [optional] y radius of arc. Thanks to Robert Penner for the idea.
//
// Thanks to: Robert Penner, Eric Mueller and Michael Hurwicz for their contributions.
// @keywords private
//-----------------------------------------------------------------------------
LzDrawView.prototype._drawArc = function(x, y, radius, arc, startAngle, yRadius){
    if (arguments.length<5) {
        return;
    }
    // if yRadius is undefined, yRadius = radius
    if (yRadius == undefined) {
        yRadius = radius;
    }
    // Init vars
    var segAngle, theta, angle, angleMid, segs, ax, ay, bx, by, cx, cy;
    // no sense in drawing more than is needed :)
    if (Math.abs(arc)>360) {
        arc = 360;
    }
    // Flash uses 8 segments per circle, to match that, we draw in a maximum
    // of 45 degree segments. First we calculate how many segments are needed
    // for our arc.
    segs = Math.ceil(Math.abs(arc)/45);
    // Now calculate the sweep of each segment
    segAngle = arc/segs;
    // The math requires radians rather than degrees. To convert from degrees
    // use the formula (degrees/180)*Math.PI to get radians. 
    theta = -(segAngle/180)*Math.PI;
    // convert angle startAngle to radians
    angle = -(startAngle/180)*Math.PI;
    // find our starting points (ax,ay) relative to the secified x,y
    ax = x-Math.cos(angle)*radius;
    ay = y-Math.sin(angle)*yRadius;
    // if our arc is larger than 45 degrees, draw as 45 degree segments
    // so that we match Flash's native circle routines.
    if (segs>0) {
        // Loop for drawing arc segments
        for (var i = 0; i<segs; i++) {
            // increment our angle
            angle += theta;
            // find the angle halfway between the last angle and the new
            angleMid = angle-(theta/2);
            // calculate our end point
            bx = ax+Math.cos(angle)*radius;
            by = ay+Math.sin(angle)*yRadius;
            // calculate our control point
            cx = ax+Math.cos(angleMid)*(radius/Math.cos(theta/2));
            cy = ay+Math.sin(angleMid)*(yRadius/Math.cos(theta/2));
            // draw the arc segment
            this.quadraticCurveTo(cx, cy, bx, by);
        }
    }
    // In the native draw methods the user must specify the end point
    // which means that they always know where they are ending at, but
    // here the endpoint is unknown unless the user calculates it on their 
    // own. Lets be nice and let save them the hassle by passing it back. 
    return {x:bx, y:by};
}



//=============================================================================
// DEFINE OBJECT: LzCanvasGradient
//
// LzCanvasGradient is an opaque object, which is used for assigning to 
// other attributes, e.g. fillStyle.  It is also used to add color stops.
// An LzCanvasGradient is returned by LzDrawView.createRadialGradient or  
// LzDrawView.createRadialGradient.
//=============================================================================
function LzCanvasGradient() {}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzCanvasGradient.prototype.__init = function(c, m) {
    this._context = c;
    this._m = m;
    this._t = "linear";
    this._c = [];
    this._a = [];
    this._o = [];
}


//------------------------------------------------------------------------------
// Adds a new stop to a gradient. gradients are rendered such that at the starting point the colour at offset 0 is used, that at the ending point the color at offset 1 is used.  globalAlpha is stored for each gradient step added.
// @param Number o: The offset this stop used for placement in the gradient.  Gradients are rendered such that for the starting point the colour at offset 0 is used, that at the ending point the color at offset 1 is used and all colors between those offsets are blended.  Must be less than 0 or greater than 1.
// @param Number c: The color to be used at this color.  A hexadecimal value, e.g. 0xffffff
//------------------------------------------------------------------------------
LzCanvasGradient.prototype.addColorStop = function(o, c) {
    this._o[this._o.length] = o * 255;
    this._c[this._c.length] = c;
    this._a[this._a.length] = this._context.globalAlpha * 100;
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzCanvasGradient.prototype.__applyTo = function(m) {
    //_root.Debug.write('LzCanvasGradient.__applyTo', this._t, this._c, this._a, this._o, this._m);
    m.beginGradientFill(this._t, this._c, this._a, this._o, this._m)
}
