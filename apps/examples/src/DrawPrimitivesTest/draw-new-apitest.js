/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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
// Draw New API Test
//
//------------------------------------------------------------------
export class DrawNewAPITest extends DrawTestDemo {
    constructor() {
        super();
        this._title = "DrawNode";
        this._subtitle = "Testing DrawNode API";
    }


    onEnter() {
        //----start1----ctor
        super.onEnter();

        var draw = new DrawNode();
        this.addChild(draw, 10);
        //
        // Circles
        //
        for( var i=0; i < 10; i++) {
            draw.drawDot( new Point(winSize.width/2, winSize.height/2), 10*(10-i), new Color( Math.random()*255, Math.random()*255, Math.random()*255, 255) );
        }

        //
        // Polygons
        //
        var points = [ new Point(winSize.height/4,0), new Point(winSize.width,winSize.height/5), new Point(winSize.width/3*2,winSize.height) ];
        draw.drawPoly(points, new Color(255,0,0,128), 8, new Color(0,128,128,255) );

        // star poly (triggers bugs)
        var o=80;
        var w=20;
        var h=50;
        var star = [
            new Point(o+w,o-h), new Point(o+w*2, o),                  // lower spike
            new Point(o + w*2 + h, o+w ), new Point(o + w*2, o+w*2),  // right spike
            new Point(o +w, o+w*2+h), new Point(o,o+w*2),             // top spike
            new Point(o -h, o+w), new Point(o,o)                     // left spike
        ];
        draw.drawPoly(star, new Color(255,0,0,128), 2, new Color(0,0,255,255) );

        // star poly (doesn't trigger bug... order is important un tesselation is supported.
        o=180;
        w=20;
        h=50;
        star = [
            new Point(o,o), new Point(o+w,o-h), new Point(o+w*2, o),       // lower spike
            new Point(o + w*2 + h, o+w ), new Point(o + w*2, o+w*2),  // right spike
            new Point(o +w, o+w*2+h), new Point(o,o+w*2),             // top spike
            new Point(o -h, o+w)                                 // left spike
        ];
        draw.drawPoly(star, new Color(255,0,0,128), 2, new Color(0,0,255,255) );

        //
        // Segments
        //
        draw.drawSegment( new Point(20,winSize.height), new Point(20,winSize.height/2), 10, new Color(0, 255, 0, 255) );
        draw.drawSegment( new Point(10,winSize.height/2), new Point(winSize.width/2, winSize.height/2), 40, new Color(255, 0, 255, 128) );
        //----end1----
    }

}
