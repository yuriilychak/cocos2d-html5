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

var drawTestSceneIdx = -1;

//------------------------------------------------------------------
//
// DrawTestDemo
//
//------------------------------------------------------------------
var DrawTestDemo = class DrawTestDemo extends BaseTestLayer {

    constructor() {
        super(cc.color(0,0,0,255), cc.color(98,99,117,255));


        this._title = "";


        this._subtitle = "";
    }

    onRestartCallback(sender) {
        var s = new DrawPrimitivesTestScene();
        s.addChild(restartDrawTest());
        director.runScene(s);
    }
    onNextCallback(sender) {
        var s = new DrawPrimitivesTestScene();
        s.addChild(nextDrawTest());
        director.runScene(s);
    }
    onBackCallback(sender) {
        var s = new DrawPrimitivesTestScene();
        s.addChild(previousDrawTest());
        director.runScene(s);
    }
    // automation
    numberOfPendingTests() {
        return ( (arrayOfDrawTest.length-1) - drawTestSceneIdx );
    }

    getTestNumber() {
        return drawTestSceneIdx;
    }


};

//------------------------------------------------------------------
//
// Testing cc.DrawNode API 2
//
//------------------------------------------------------------------
var DrawNewAPITest2 = class DrawNewAPITest2 extends DrawTestDemo {
    constructor() {
        super();
        this._title = "cc.DrawNode";
        this._subtitle = "Testing cc.DrawNode API 2";
    }

    onEnter() {
        //----start0----ctor
        super.onEnter();
        var draw = new cc.DrawNode();
        this.addChild(draw, 10);
        var winSize = cc.director.getWinSize();
        var centerPos = new cc.Point(winSize.width / 2, winSize.height / 2);
        //drawSegment
        draw.drawSegment(new cc.Point(0, 0), new cc.Point(winSize.width, winSize.height), 1, cc.color(255, 255, 255, 255));
        draw.drawSegment(new cc.Point(0, winSize.height), new cc.Point(winSize.width, 0), 5, cc.color(255, 0, 0, 255));

        //drawDot
        draw.drawDot(new cc.Point(winSize.width / 2, winSize.height / 2), 40, cc.color(0, 0, 255, 128));
        var points = [new cc.Point(60, 60), new cc.Point(70, 70), new cc.Point(60, 70), new cc.Point(70, 60)];
        for (var i = 0; i < points.length; i++) {
            draw.drawDot(points[i], 4, cc.color(0, 255, 255, 255));
        }
        //drawCircle
        draw.drawCircle(new cc.Point(winSize.width / 2, winSize.height / 2), 100, 0, 10, false, 6, cc.color(0, 255, 0, 255));
        draw.drawCircle(new cc.Point(winSize.width / 2, winSize.height / 2), 50, cc.degreesToRadians(90), 50, true, 2, cc.color(0, 255, 255, 255));

        //draw poly
        //not fill
        var vertices = [new cc.Point(0, 0), new cc.Point(50, 50), new cc.Point(100, 50), new cc.Point(100, 100), new cc.Point(50, 100) ];
        draw.drawPoly(vertices, null, 5, cc.color(255, 255, 0, 255));
        var vertices2 = [new cc.Point(30, 130), new cc.Point(30, 230), new cc.Point(50, 200)];
        draw.drawPoly(vertices2, null, 2, cc.color(255, 0, 255, 255));
        //fill
        var vertices3 = [new cc.Point(60, 130), new cc.Point(60, 230), new cc.Point(80, 200)];
        draw.drawPoly(vertices3, cc.color(0, 255, 255, 50), 2, cc.color(255, 0, 255, 255));

        //draw rect
        //not fill
        draw.drawRect(new cc.Point(120, 120), new cc.Point(200, 200), null, 2, cc.color(255, 0, 255, 255));
        //fill
        draw.drawRect(new cc.Point(120, 220), new cc.Point(200, 300), cc.color(0, 255, 255, 50), 2, cc.color(128, 128, 0, 255));

        // draw quad bezier path
        draw.drawQuadBezier(new cc.Point(0, winSize.height), new cc.Point(centerPos.x, centerPos.y), new cc.Point(winSize.width, winSize.height), 50, 2, cc.color(255, 0, 255, 255));

        // draw cubic bezier path
        draw.drawCubicBezier(new cc.Point(winSize.width / 2, winSize.height / 2), new cc.Point(winSize.width / 2 + 30, winSize.height / 2 + 50),
            new cc.Point(winSize.width / 2 + 60, winSize.height / 2 - 50), new cc.Point(winSize.width, winSize.height / 2), 100, 2, cc.color(255, 0, 255, 255));

        //draw cardinal spline
        var vertices4 = [
            new cc.Point(centerPos.x - 130, centerPos.y - 130),
            new cc.Point(centerPos.x - 130, centerPos.y + 130),
            new cc.Point(centerPos.x + 130, centerPos.y + 130),
            new cc.Point(centerPos.x + 130, centerPos.y - 130),
            new cc.Point(centerPos.x - 130, centerPos.y - 130)
        ];
        draw.drawCardinalSpline(vertices4, 0.5, 100, 2, cc.color(255, 255, 255, 255));
        //----end0----
    }

};
DrawNewAPITest2.prototype.title = function(){
    return 'cc.DrawNode 2';
};

//------------------------------------------------------------------
//
// Draw New API Test
//
//------------------------------------------------------------------
var DrawNewAPITest = class DrawNewAPITest extends DrawTestDemo {
    constructor() {
        super();
        this._title = "cc.DrawNode";
        this._subtitle = "Testing cc.DrawNode API";
    }


    onEnter() {
        //----start1----ctor
        super.onEnter();

        var draw = new cc.DrawNode();
        this.addChild(draw, 10);
        //
        // Circles
        //
        for( var i=0; i < 10; i++) {
            draw.drawDot( new cc.Point(winSize.width/2, winSize.height/2), 10*(10-i), cc.color( Math.random()*255, Math.random()*255, Math.random()*255, 255) );
        }

        //
        // Polygons
        //
        var points = [ new cc.Point(winSize.height/4,0), new cc.Point(winSize.width,winSize.height/5), new cc.Point(winSize.width/3*2,winSize.height) ];
        draw.drawPoly(points, cc.color(255,0,0,128), 8, cc.color(0,128,128,255) );

        // star poly (triggers bugs)
        var o=80;
        var w=20;
        var h=50;
        var star = [
            new cc.Point(o+w,o-h), new cc.Point(o+w*2, o),                  // lower spike
            new cc.Point(o + w*2 + h, o+w ), new cc.Point(o + w*2, o+w*2),  // right spike
            new cc.Point(o +w, o+w*2+h), new cc.Point(o,o+w*2),             // top spike
            new cc.Point(o -h, o+w), new cc.Point(o,o)                     // left spike
        ];
        draw.drawPoly(star, cc.color(255,0,0,128), 2, cc.color(0,0,255,255) );

        // star poly (doesn't trigger bug... order is important un tesselation is supported.
        o=180;
        w=20;
        h=50;
        star = [
            new cc.Point(o,o), new cc.Point(o+w,o-h), new cc.Point(o+w*2, o),       // lower spike
            new cc.Point(o + w*2 + h, o+w ), new cc.Point(o + w*2, o+w*2),  // right spike
            new cc.Point(o +w, o+w*2+h), new cc.Point(o,o+w*2),             // top spike
            new cc.Point(o -h, o+w)                                 // left spike
        ];
        draw.drawPoly(star, cc.color(255,0,0,128), 2, cc.color(0,0,255,255) );

        //
        // Segments
        //
        draw.drawSegment( new cc.Point(20,winSize.height), new cc.Point(20,winSize.height/2), 10, cc.color(0, 255, 0, 255) );
        draw.drawSegment( new cc.Point(10,winSize.height/2), new cc.Point(winSize.width/2, winSize.height/2), 40, cc.color(255, 0, 255, 128) );
        //----end1----
    }

};

DrawNewAPITest.prototype.title = function(){
    return 'cc.DrawNode 1';
};

//
//
var DrawPrimitivesTestScene = class DrawPrimitivesTestScene extends TestScene {
    runThisTest(num) {
        drawTestSceneIdx = (num || num == 0) ? (num - 1) : -1;
        var layer = nextDrawTest();
        this.addChild(layer);

        director.runScene(this);
    }

};

//
// Flow control
//

var arrayOfDrawTest = [
    DrawNewAPITest,
    DrawNewAPITest2
];

var nextDrawTest = function () {
    drawTestSceneIdx++;
    drawTestSceneIdx = drawTestSceneIdx % arrayOfDrawTest.length;

    if(window.sideIndexBar){
        drawTestSceneIdx = window.sideIndexBar.changeTest(drawTestSceneIdx, 9);
    }

    return new arrayOfDrawTest[drawTestSceneIdx]();
};
var previousDrawTest = function () {
    drawTestSceneIdx--;
    if (drawTestSceneIdx < 0)
        drawTestSceneIdx += arrayOfDrawTest.length;

    if(window.sideIndexBar){
        drawTestSceneIdx = window.sideIndexBar.changeTest(drawTestSceneIdx, 9);
    }

    return new arrayOfDrawTest[drawTestSceneIdx]();
};
var restartDrawTest = function () {
    return new arrayOfDrawTest[drawTestSceneIdx]();
};

