/****************************************************************************
 Copyright (c) 2010-2013 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2012 Pierre-David Bélanger
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

var TAG_TITLELABEL = 1;
var TAG_SUBTITLELABEL = 2;
var TAG_STENCILNODE = 100;
var TAG_CLIPPERNODE = 101;
var TAG_CONTENTNODE = 102;

var clippingNodeTestSceneIdx = -1;

var BaseClippingNodeTest = class BaseClippingNodeTest extends BaseTestLayer {

    constructor() {
        super(new cc.Color(0,0,0,255), new cc.Color(98,99,117,255));


        this._title = "";


        this._subtitle = "";
        this.setup();
    }

    onRestartCallback(sender) {
        var s = new ClippingNodeTestScene();
        s.addChild(restartClippingNodeTest());
        director.runScene(s);
    }
    onNextCallback(sender) {
        var s = new ClippingNodeTestScene();
        s.addChild(nextClippingNodeTest());
        director.runScene(s);
    }
    onBackCallback(sender) {
        var s = new ClippingNodeTestScene();
        s.addChild(previousClippingNodeTest());
        director.runScene(s);
    }
    // automation
    numberOfPendingTests() {
        return ( (arrayOfClippingNodeTest.length-1) - clippingNodeTestSceneIdx );
    }

    getTestNumber() {
        return clippingNodeTestSceneIdx;
    }


};



var BasicTest = class BasicTest extends BaseClippingNodeTest {
    title() {
        return "Basic Test";
    }

    subtitle() {
        return "";
    }

    setup() {
        var winSize = cc.director.getWinSize();

        var stencil = this.stencil();
        stencil.tag = TAG_STENCILNODE;
        stencil.x = 50;
        stencil.y = 50;

        var clipper = this.clipper();
        clipper.tag = TAG_CLIPPERNODE;
        clipper.anchorX = 0.5;
        clipper.anchorY = 0.5;
        clipper.x = winSize.width / 2 - 50;
        clipper.y = winSize.height / 2 - 50;
        clipper.stencil = stencil;
        this.addChild(clipper);

        var content = this.content();
        content.x = 50;
        content.y = 50;
        clipper.addChild(content);
        //content.x = 400;
        //content.y = 225;
        //this.addChild(content);
    }

    actionRotate() {
        return new cc.RotateBy(1.0, 90.0).repeatForever();
    }

    actionScale() {
        var scale = new cc.ScaleBy(1.33, 1.5);
        return cc.sequence(scale, scale.reverse()).repeatForever();
    }

    shape() {
        var shape = new cc.DrawNode();
        var triangle = [new cc.Point(-100, -100),new cc.Point(100, -100), new cc.Point(0, 100)];

        var green = new cc.Color(0, 255, 0, 255);
        shape.drawPoly(triangle, green, 3, green);
        return shape;
    }

    grossini() {
        var grossini = new cc.Sprite(s_pathGrossini);
        grossini.scale = 1.5;
        return grossini;
    }

    stencil() {
        return null;
    }

    clipper() {
        return new cc.ClippingNode();
    }

    content() {
        return null;
    }

};

var ShapeTest = class ShapeTest extends BasicTest {
    title() {
        return "Shape Basic Test";
    }

    subtitle() {
        return "A DrawNode as stencil and Sprite as content";
    }

    stencil() {
        var node = this.shape();
        node.runAction(this.actionRotate());
        return node;
    }

    content() {
        var node = this.grossini();
        node.runAction(this.actionScale());
        return node;
    }

};

var ShapeInvertedTest = class ShapeInvertedTest extends ShapeTest {
    title() {
        return "Shape Inverted Basic Test";
    }

    subtitle() {
        return "A DrawNode as stencil and Sprite as content, inverted";
    }

    clipper() {
        var clipper = super.clipper();
        clipper.setInverted(true);
        return clipper;
    }

};

var SpriteTest = class SpriteTest extends BasicTest {
    title() {
        return "Sprite Basic Test";
    }
    subtitle() {
        return "A Sprite as stencil and DrawNode as content";
    }

    stencil() {
        var node = this.grossini();
        node.runAction(this.actionRotate());
        return node;
    }

    clipper() {
        var clipper = super.clipper();
        clipper.alphaThreshold = 0.05;
        return clipper;
    }

    content() {
        var node = this.shape();
        node.runAction(this.actionScale());
        return node;
    }

};

var SpriteNoAlphaTest = class SpriteNoAlphaTest extends SpriteTest {
    title() {
        return "Sprite No Alpha Basic Test";
    }

    subtitle() {
        return "A Sprite as stencil and DrawNode as content, no alpha";
    }

    clipper() {
        var clipper = super.clipper();
        clipper.alphaThreshold = 1;
        return clipper;
    }

};

var SpriteInvertedTest = class SpriteInvertedTest extends SpriteTest {
    title() {
        return "Sprite Inverted Basic Test";
    }

    subtitle() {
        return "A Sprite as stencil and DrawNode as content, inverted";
    }

    clipper() {
        var clipper = super.clipper();
        clipper.alphaThreshold = 0.05;
        clipper.inverted = true;
        return clipper;
    }

};

var NestedTest = class NestedTest extends BaseClippingNodeTest {
    title() {
        return "Nested Test";
    }

    subtitle() {
        return "Nest 9 Clipping Nodes, max is usually 8";
    }

    setup() {
        var depth = 9;

        var parent = this;

        for (var i = 0;  i < depth; i++ ) {
            var size = 225 - i * (225 / (depth * 2));

            var clipper = new cc.ClippingNode();
            clipper.attr({
	            width: size,
	            height: size,
	            anchorX: 0.5,
	            anchorY: 0.5,
	            x: parent.width / 2,
	            y: parent.height / 2
            });
            clipper.alphaThreshold = 0.05;
            clipper.runAction(new cc.RotateBy((i % 3) ? 1.33 : 1.66, (i % 2) ? 90 : -90).repeatForever());
            parent.addChild(clipper);

            var stencil = new cc.Sprite(s_pathGrossini);
            stencil.attr({
	            scale: 2.5 - (i * (2.5 / depth)),
	            anchorX: 0.5,
	            anchorY: 0.5,
	            x: clipper.width / 2,
	            y: clipper.height / 2,
	            visible: false
            });
            stencil.runAction(cc.sequence(new cc.DelayTime(i), new cc.Show()));
            clipper.stencil = stencil;

            clipper.addChild(stencil);
            parent = clipper;
        }
    }

};

var HoleDemo = class HoleDemo extends BaseClippingNodeTest {
    constructor() {
        super();
    }


    setup() {
        var target = new cc.Sprite(s_pathBlock);
        target.anchorX = 0;
        target.anchorY = 0;
        target.scale = 3;

        var scale = target.scale;
        var stencil = new cc.DrawNode();

        var rectangle = [new cc.Point(0, 0),new cc.Point(target.width*scale, 0),
            new cc.Point(target.width*scale, target.height*scale),
            new cc.Point(0, target.height*scale)];
        stencil.drawPoly(rectangle, new cc.Color(255, 0, 0, 255), 0, new cc.Color(255, 255, 255, 0));

        this._outerClipper = new cc.ClippingNode();
        var transform = cc.AffineTransform.makeIdentity();
        transform = cc.AffineTransform.scale(transform, target.scale, target.scale);

	    var ocsize = cc.AffineTransform.applyToSize(new cc.Size(target.width, target.height), transform);
        this._outerClipper.width = ocsize.width;
	    this._outerClipper.height = ocsize.height;
        this._outerClipper.anchorX = 0.5;
        this._outerClipper.anchorY = 0.5;
        this._outerClipper.x = this.width * 0.5;
	    this._outerClipper.y = this.height * 0.5;
        this._outerClipper.runAction(new cc.RotateBy(1, 45).repeatForever());

        this._outerClipper.stencil = stencil;

        var holesClipper = new cc.ClippingNode();
        holesClipper.inverted = true;
        holesClipper.alphaThreshold = 0.05;

        holesClipper.addChild(target);

        this._holes = new cc.Node();

        holesClipper.addChild(this._holes);

        this._holesStencil = new cc.Node();

        holesClipper.stencil = this._holesStencil;
        this._outerClipper.addChild(holesClipper);
        this.addChild(this._outerClipper);

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan:function (touches, event) {
                var target = event.getCurrentTarget();
                var touch = touches[0];
                var point = target._outerClipper.convertToNodeSpace(touch.getLocation());
                var rect = new cc.Rect(0, 0, target._outerClipper.width, target._outerClipper.height);
                if (!cc.Rect.containsPoint(rect,point))
                    return;
                target.pokeHoleAtPoint(point);
            }
        }), this);
    }

    title() {
        return "Hole Demo";
    }

    subtitle() {
        return "Touch/click to poke holes";
    }

    pokeHoleAtPoint(point) {
        var scale = Math.random() * 0.2 + 0.9;
        var rotation = Math.random() * 360;

        var hole = new cc.Sprite(s_hole_effect_png);
        hole.attr({
	        x: point.x,
	        y: point.y,
	        rotation: rotation,
	        scale: scale
        });

        this._holes.addChild(hole);

        var holeStencil = new cc.Sprite(s_hole_stencil_png);
        holeStencil.attr({
	        x: point.x,
	        y: point.y,
	        rotation: rotation,
	        scale: scale
        });

        this._holesStencil.addChild(holeStencil);
        this._outerClipper.runAction(cc.sequence(new cc.ScaleBy(0.05, 0.95), new cc.ScaleTo(0.125, 1)));
    }

};

var ScrollViewDemo = class ScrollViewDemo extends BaseClippingNodeTest {
    constructor() {
        super();
        this._scrolling = false;
        this._lastPoint = null;
    }


    title() {
        return "Scroll View Demo";
    }

    subtitle() {
        return "Move/drag to scroll the content";
    }

    setup() {
        var clipper = new cc.ClippingNode();
        clipper.tag = TAG_CLIPPERNODE;
        clipper.width = 200;
	    clipper.height = 200;
        clipper.anchorX = 0.5;
        clipper.anchorY = 0.5;
        clipper.x = this.width / 2;
        clipper.y = this.height / 2;
        clipper.runAction(new cc.RotateBy(1, 45).repeatForever());
        this.addChild(clipper);

        var stencil = new cc.DrawNode();
        var rectangle = [new cc.Point(0, 0),new cc.Point(clipper.width, 0),
            new cc.Point(clipper.width, clipper.height),
            new cc.Point(0, clipper.height)];

        var white = new cc.Color(255, 255, 255, 255);
        stencil.drawPoly(rectangle, white, 1, white);
        clipper.stencil = stencil;

        var content = new cc.Sprite(s_back2);
        content.tag = TAG_CONTENTNODE;
        content.anchorX = 0.5;
        content.anchorY = 0.5;
        content.x = clipper.width / 2;
	    content.y = clipper.height / 2;
        clipper.addChild(content);

        this._scrolling = false;
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan: function (touches, event) {
                if (!touches || touches.length == 0)
                    return;
	            var target = event.getCurrentTarget();

                var touch = touches[0];
                var clipper = target.getChildByTag(TAG_CLIPPERNODE);
                var point = clipper.convertToNodeSpace(touch.getLocation());
                var rect = new cc.Rect(0, 0, clipper.width, clipper.height);
                target._scrolling = cc.Rect.containsPoint(rect, point);
                target._lastPoint = point;
            },

            onTouchesMoved: function (touches, event) {
                var target = event.getCurrentTarget();
                if (!target._scrolling)
                    return;

                if (!touches || touches.length == 0)
                    return;
                var touch = touches[0];
                var clipper = target.getChildByTag(TAG_CLIPPERNODE);
                var point = clipper.convertToNodeSpace(touch.getLocation());
                var diff = cc.Point.sub(point, target._lastPoint);
                var content = clipper.getChildByTag(TAG_CONTENTNODE);
                content.setPosition(cc.Point.add(content.getPosition(), diff));
                target._lastPoint = point;
            },

            onTouchesEnded: function (touches, event) {
                var target = event.getCurrentTarget();
                if (!target._scrolling) return;
                target._scrolling = false;
            }
        }), this);
    }

};

var _stencilBits = -1;
var _alphaThreshold = 0.05;
var _PLANE_COUNT = 8;

var _planeColor = [
    new cc.Color(0, 0, 0, 166),
    new cc.Color(179, 0, 0, 153),
    new cc.Color(0, 179, 0, 140),
    new cc.Color(0, 0, 179, 128),
    new cc.Color(179, 179, 0, 115),
    new cc.Color(0, 179, 179, 102),
    new cc.Color(179, 0, 179, 89),
    new cc.Color(179, 179, 179, 77)
];

var RawStencilBufferTest = class RawStencilBufferTest extends BaseClippingNodeTest {
    constructor() {
        super();
        this._sprite = null;
    }


    _initRendererCmd(){
        this._rendererCmd = new cc.CustomRenderCmdWebGL(this, this.draw);
    }

    title() {
        return "Raw Stencil Tests";
    }

    subtitle() {
        return "1:Default";
    }

    setup() {
        _stencilBits = cc.rendererConfig.renderContext.getParameter(cc.rendererConfig.renderContext.STENCIL_BITS);
        if (_stencilBits < 3)
            cc.log("Stencil must be enabled for the current CCGLView.");

        this._sprite = new cc.Sprite(s_pathGrossini);
        this._sprite.anchorX = 0.5;
        this._sprite.anchorY = 0;
        this._sprite.scale = 2.5;
        cc.director.setAlphaBlending(true);
    }

    draw(ctx) {
        var gl = ctx || cc.rendererConfig.renderContext;
        var winPoint = cc.Point.fromSize(cc.director.getWinSize());
        var planeSize = cc.Point.mult(winPoint, 1.0 / _PLANE_COUNT);

        gl.enable(gl.STENCIL_TEST);
        //cc.checkGLErrorDebug();

        for (var i = 0; i < _PLANE_COUNT; i++) {
            var stencilPoint = cc.Point.mult(planeSize, _PLANE_COUNT - i);
            stencilPoint.x = winPoint.x;

            var x = planeSize.x / 2 + planeSize.x * i, y = 0;
            this._sprite.x = x;
	        this._sprite.y = y;

            this.setupStencilForClippingOnPlane(i);
            //cc.checkGLErrorDebug();

            cc._drawingUtil.drawSolidRect(new cc.Point(0, 0), stencilPoint, new cc.Color(255, 255, 255, 255));

            cc.kmGLPushMatrix();
            this.transform();
            this._sprite.visit();
            cc.kmGLPopMatrix();

            this.setupStencilForDrawingOnPlane(i);
            //cc.checkGLErrorDebug();

            cc._drawingUtil.drawSolidRect(new cc.Point(0, 0), winPoint, _planeColor[i]);

            cc.kmGLPushMatrix();
            this.transform();
            this._sprite.visit();
            cc.kmGLPopMatrix();
        }

        gl.disable(gl.STENCIL_TEST);
        //cc.checkGLErrorDebug();
    }

    setupStencilForClippingOnPlane(plane) {
        var gl = cc.rendererConfig.renderContext;
        var planeMask = 0x1 << plane;
        gl.stencilMask(planeMask);
        gl.clearStencil(0x0);
        gl.clear(gl.STENCIL_BUFFER_BIT);
        gl.flush();
        gl.stencilFunc(gl.NEVER, planeMask, planeMask);
        gl.stencilOp(gl.REPLACE, gl.KEEP, gl.KEEP);
    }

    setupStencilForDrawingOnPlane(plane) {
        var gl = cc.rendererConfig.renderContext;
        var planeMask = 0x1 << plane;
        var equalOrLessPlanesMask = planeMask | (planeMask - 1);
        gl.stencilFunc(gl.EQUAL, equalOrLessPlanesMask, equalOrLessPlanesMask);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    }

};

var RawStencilBufferTest2 = class RawStencilBufferTest2 extends RawStencilBufferTest {
    subtitle() {
        return "2:DepthMask:FALSE";
    }

    setupStencilForClippingOnPlane(plane) {
        super.setupStencilForClippingOnPlane(plane);
        cc.rendererConfig.renderContext.depthMask(false);
    }

    setupStencilForDrawingOnPlane(plane) {
        cc.rendererConfig.renderContext.depthMask(true);
        super.setupStencilForDrawingOnPlane(plane);
    }

};

var RawStencilBufferTest3 = class RawStencilBufferTest3 extends RawStencilBufferTest {
    subtitle() {
        return "3:DepthTest:DISABLE,DepthMask:FALSE";
    }

    setupStencilForClippingOnPlane(plane) {
        var gl = cc.rendererConfig.renderContext;
        super.setupStencilForClippingOnPlane(plane);
        gl.disable(gl.DEPTH_TEST);
        gl.depthMask(false);
    }

    setupStencilForDrawingOnPlane(plane) {
        var gl = cc.rendererConfig.renderContext;
        gl.depthMask(true);
        //gl.enable(gl.DEPTH_TEST);
        super.setupStencilForDrawingOnPlane(plane);
    }

};

var RawStencilBufferTest4 = class RawStencilBufferTest4 extends RawStencilBufferTest {
    subtitle() {
        return "4:DepthMask:FALSE,AlphaTest:ENABLE";
    }

    setupStencilForClippingOnPlane(plane) {
        var gl = cc.rendererConfig.renderContext;
        super.setupStencilForClippingOnPlane(plane);
        gl.depthMask(false);

        var program = cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLORALPHATEST);
        var alphaValueLocation = gl.getUniformLocation(program.getProgram(),cc.UNIFORM_ALPHA_TEST_VALUE_S);
        cc.glUseProgram(program.getProgram());
        program.setUniformLocationWith1f(alphaValueLocation, _alphaThreshold);
        this._sprite.shaderProgram = program;
    }

    setupStencilForDrawingOnPlane(plane) {
        cc.rendererConfig.renderContext.depthMask(true);
        super.setupStencilForDrawingOnPlane(plane);
    }

};

var RawStencilBufferTest5 = class RawStencilBufferTest5 extends RawStencilBufferTest {
    subtitle() {
        return "5:DepthTest:DISABLE,DepthMask:FALSE,AlphaTest:ENABLE";
    }

    setupStencilForClippingOnPlane(plane) {
        var gl = cc.rendererConfig.renderContext;
        super.setupStencilForClippingOnPlane(plane);
        gl.disable(gl.DEPTH_TEST);
        gl.depthMask(false);

        var program = cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLORALPHATEST);
        var alphaValueLocation = gl.getUniformLocation(program.getProgram(), cc.UNIFORM_ALPHA_TEST_VALUE_S);
        cc.glUseProgram(program.getProgram());
        program.setUniformLocationWith1f(alphaValueLocation, _alphaThreshold);
        this._sprite.shaderProgram = program;
    }

    setupStencilForDrawingOnPlane(plane) {
        cc.rendererConfig.renderContext.depthMask(true);
        //cc.rendererConfig.renderContext.enable(cc.rendererConfig.renderContext.DEPTH_TEST);
        super.setupStencilForDrawingOnPlane(plane);
    }

};

var RawStencilBufferTest6 = class RawStencilBufferTest6 extends RawStencilBufferTest {
    subtitle() {
        return "6:ManualClear,AlphaTest:ENABLE";
    }

    setup() {
        cc.rendererConfig.renderContext.stencilMask(~0);
        super.setup();
    }

    setupStencilForClippingOnPlane(plane) {
        var gl = cc.rendererConfig.renderContext;
        var planeMask = 0x1 << plane;
        gl.stencilMask(planeMask);
        gl.stencilFunc(gl.NEVER, 0, planeMask);
        gl.stencilOp(gl.REPLACE, gl.KEEP, gl.KEEP);
        cc._drawingUtil.drawSolidRect(new cc.Point(0, 0), cc.Point.fromSize(cc.director.getWinSize()), new cc.Color(255, 255, 255, 255));
        gl.stencilFunc(gl.NEVER, planeMask, planeMask);
        gl.stencilOp(gl.REPLACE, gl.KEEP, gl.KEEP);
        gl.disable(gl.DEPTH_TEST);
        gl.depthMask(false);

        var program = cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLORALPHATEST);
        var alphaValueLocation = gl.getUniformLocation(program.getProgram(), cc.UNIFORM_ALPHA_TEST_VALUE_S);
        cc.glUseProgram(program.getProgram());
        program.setUniformLocationWith1f(alphaValueLocation, _alphaThreshold);
        this._sprite.shaderProgram = program;

        gl.flush();
    }

    setupStencilForDrawingOnPlane(plane) {
        var gl = cc.rendererConfig.renderContext;
        gl.depthMask(true);
        //gl.enable(gl.DEPTH_TEST);
        super.setupStencilForDrawingOnPlane(plane);
        gl.flush();
    }

};

var arrayOfClippingNodeTest = [
    ScrollViewDemo,
    ShapeTest,
    SpriteTest
];


if (!cc.sys.isNative && !cc.rendererConfig.isCanvas) {
    arrayOfClippingNodeTest.push(
        ShapeInvertedTest,
        SpriteNoAlphaTest,
        SpriteInvertedTest
        //TODO re-open them later.
        /*    RawStencilBufferTest,
         RawStencilBufferTest2,
         RawStencilBufferTest3,
         RawStencilBufferTest4,
         RawStencilBufferTest5,
         RawStencilBufferTest6*/
    );
}

if ( cc.sys.isNative){
    arrayOfClippingNodeTest.push(
        ShapeInvertedTest,
        SpriteNoAlphaTest,
        SpriteInvertedTest,
        NestedTest);
} else {
    arrayOfClippingNodeTest.push(HoleDemo
    );
}

var nextClippingNodeTest = function () {
    clippingNodeTestSceneIdx++;
    clippingNodeTestSceneIdx = clippingNodeTestSceneIdx % arrayOfClippingNodeTest.length;

    if(window.sideIndexBar){
        clippingNodeTestSceneIdx = window.sideIndexBar.changeTest(clippingNodeTestSceneIdx, 5);
    }

    return new arrayOfClippingNodeTest[clippingNodeTestSceneIdx]();
};

var previousClippingNodeTest = function () {
    clippingNodeTestSceneIdx--;
    if (clippingNodeTestSceneIdx < 0)
        clippingNodeTestSceneIdx += arrayOfClippingNodeTest.length;

    if(window.sideIndexBar){
        clippingNodeTestSceneIdx = window.sideIndexBar.changeTest(clippingNodeTestSceneIdx, 5);
    }

    return new arrayOfClippingNodeTest[clippingNodeTestSceneIdx]();
};

var restartClippingNodeTest = function () {
    return new arrayOfClippingNodeTest[clippingNodeTestSceneIdx]();
};

var ClippingNodeTestScene = class ClippingNodeTestScene extends TestScene {
    runThisTest(num) {
        clippingNodeTestSceneIdx = (num || num == 0) ? (num - 1) : -1;
        cc.director.runScene(this);
	    var layer = nextClippingNodeTest();
	    this.addChild(layer);
    }

};