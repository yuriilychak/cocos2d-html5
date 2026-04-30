/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

//------------------------------------------------------------------
//
// Query
//
//------------------------------------------------------------------
export class Query extends ChipmunkDemo {
    constructor() {
        super();

        this.drawNode = null;
        this._subtitle = 'Chipmunk Demo';
        this._title = 'Query';

        this.drawNode = new DrawNode();
        this.addChild(this.drawNode, 10);

        if( 'mouse' in sys.capabilities ) {
            eventManager.addListener({
                event: EventListener.MOUSE,
                onMouseMove: this.drawQuery
            }, this);
        }
        else if( 'touches' in sys.capabilities ) {
            eventManager.addListener({
                event: EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan:function(){
                    return true;
                },
                onTouchMoved: this.drawQuery
            }, this);
        }

        var space = this.space;

        { // add a fat segment
            var mass = 1;
            var length = 100;
            var a = v(-length/2, 0), b = v(length/2, 0);
            
            var body = space.addBody(new cp.Body(mass, cp.momentForSegment(mass, a, b)));
            body.setPos(v(320, 340));
            
            space.addShape(new cp.SegmentShape(body, a, b, 20));
        }

        { // add a static segment
            space.addShape(new cp.SegmentShape(space.staticBody, v(320, 540), v(620, 240), 0));
        }

        { // add a pentagon
            var mass = 1;
            var NUM_VERTS = 5;
            
            var verts = new Array(NUM_VERTS * 2);
            for(var i=0; i<NUM_VERTS*2; i+=2){
                var angle = -Math.PI*i/NUM_VERTS;
                verts[i]   = 30*Math.cos(angle);
                verts[i+1] = 30*Math.sin(angle);
            }
            
            var body = space.addBody(new cp.Body(mass, cp.momentForPoly(mass, verts, v(0,0))));
            body.setPos(v(350+60, 220+60));

            space.addShape(new cp.PolyShape(body, verts, v(0,0)));
        }
        
        { // add a circle
            var mass = 1;
            var r = 20;
            
            var body = space.addBody(new cp.Body(mass, cp.momentForCircle(mass, 0, r, v(0,0))));
            body.setPos(v(320+100, 240+120));
            
            space.addShape(new cp.CircleShape(body, r, v(0,0)));
        }

    }

    drawBB(bb, fillColor, lineColor){
        this.drawNode.drawRect(new Point(bb.l, bb.b), new Point(bb.r, bb.t), fillColor, 1, lineColor);
    }

    drawQuery(touch, event){
        var target = !!event ? event.getCurrentTarget() : touch.getCurrentTarget();
        var drawNode = target.drawNode;
        drawNode.clear();

        var start = new Point(320, 240);
        var end = touch.getLocation();
        var radius = 10;
        drawNode.drawSegment(start, end, 1, new Color(0, 255, 0, 255));

        // WARNING: API changed in Chipmunk v7.0
        var info = target.space.segmentQueryFirst(start, end, radius, cp.SHAPE_FILTER_ALL);
        if(info) {

            // Draw blue over the occluded part of the query
            drawNode.drawSegment(cp.v.lerp(start, end, info.alpha), end, 1, new Color(0,0,255,255));
            
            // Draw a little red surface normal
            drawNode.drawSegment(info.point, cp.v.add(info.point, cp.v.mult(info.normal, 16)), 1, new Color(255,0,0,255));
        
            // Draw a little red dot on the hit point.
            drawNode.drawDot(info.point, 3, new Color(255,0,0,255));

            log("Segment Query: Dist(" + info.alpha * cp.v.dist(start,end) + ") Normal:(" + info.normal.x + "," + info.normal.y + ")");

            // Draw a fat green line over the unoccluded part of the query
            // drawNode.drawSegment(start, cp.v.lerp(start, end, info.alpha), radius, new Color(0,255,0,255));
        } else {
            log("Segment Query (None)");
        }

        var nearestInfo = target.space.pointQueryNearest(touch.getLocation(), 100.0, cp.SHAPE_FILTER_ALL);
        if(nearestInfo){
            // Draw a grey line to the closest shape.
            drawNode.drawDot(touch.getLocation(), 3, new Color(128, 128, 128, 255));
            drawNode.drawSegment(touch.getLocation(), nearestInfo.p, 1, new Color(128, 128, 128, 255));
            
            // Draw a red bounding box around the shape under the mouse.
//            if(nearestInfo.d < 0)
//                drawNode.drawBB(cpShapeGetBB(nearestInfo.shape), RGBAColor(1,0,0,1));
        }
        
    }

}
