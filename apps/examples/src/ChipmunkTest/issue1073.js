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

export class Issue1073 extends ChipmunkDemo {
    constructor(){
        super();
        this._subtitle = 'Chipmunk Demo';
        this._title = 'Issue 1073';

        var space = this.space;
        // add a circle
        var mass = 1;
        var r = 20;
        var body = space.addBody(new cp.Body(mass, cp.momentForCircle(mass, 0, r, v(0,0))));
        body.setPos(cp.v(winSize.width/2, winSize.height/2));
        var shape = new cp.CircleShape(body, r, v(0,0));
        space.addShape(shape);

        var nearestPointQueryInfo = shape.nearestPointQuery(cp.v(winSize.width/2+100, winSize.height/2));
        cc.log("The nearest point on the shape's surface to query point is : (" + nearestPointQueryInfo.p.x + "," + nearestPointQueryInfo.p.y + ")");
        cc.log("And the distance is : " + nearestPointQueryInfo.d);

        var segmentQueryInfo = shape.segmentQuery(cp.v(winSize.width/2 - 100, winSize.height/2), cp.v(winSize.width/2 + 100, winSize.height/2));
        cc.log("The normal of the surface hit is : (" + segmentQueryInfo.n.x + "," + segmentQueryInfo.n.y + ")");
        cc.log("The normalized distance along the query segment in the range [0, 1] is : " + segmentQueryInfo.t);
    }

}
