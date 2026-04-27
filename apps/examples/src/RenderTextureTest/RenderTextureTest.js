/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

var sceneRenderTextureIdx = -1;

var RenderTextureBaseLayer = class RenderTextureBaseLayer extends BaseTestLayer {
    constructor() {
        super(new cc.Color(0,0,0,255), new cc.Color(98,99,117,255) );
    }

    title() {
        return "Render Texture";
    }

    subtitle() {
        return "";
    }

    code() {
        return "";
    }

    // callbacks
    onRestartCallback(sender) {
        var s = new RenderTextureTestScene();
        s.addChild(restartRenderTextureTest());
        director.runScene(s);
    }
    onNextCallback(sender) {
        var s = new RenderTextureTestScene();
        s.addChild(nextRenderTextureTest());
        director.runScene(s);
    }
    onBackCallback(sender) {
        var s = new RenderTextureTestScene();
        s.addChild(previousRenderTextureTest());
        director.runScene(s);
    }

    // automation
    numberOfPendingTests() {
        return ( (arrayOfRenderTextureTest.length-1) - sceneRenderTextureIdx );
    }

    getTestNumber() {
        return sceneRenderTextureIdx;
    }

};

//------------------------------------------------------------------
//
// Tests
//
//------------------------------------------------------------------
var RenderTextureSave = class RenderTextureSave extends RenderTextureBaseLayer {
    constructor() {
        super();
        this._brushs = null;
        this._target = null;
        this._lastLocation = null;
        this._counter = 0;
    }


    onEnter() {
        super.onEnter();

        if ('touches' in cc.sys.capabilities){
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesMoved:function (touches, event) {
                    event.getCurrentTarget().drawInLocation(touches[0].getLocation());
                }
            }, this);
        } else if ('mouse' in cc.sys.capabilities)
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseDown: function(event){
                    event.getCurrentTarget()._lastLocation = event.getLocation();
                },
                onMouseMove: function(event){
                    if(event.getButton() == cc.EventMouse.BUTTON_LEFT)
                        event.getCurrentTarget().drawInLocation(event.getLocation());
                }
            }, this);

        this._brushs = [];

        var save = new cc.MenuItemFont("Save", this.saveCB, this);
        var clear = new cc.MenuItemFont("Clear", this.clearCB.bind(this)); // another way to pass 'this'
        var menu = new cc.Menu(save, clear);
        menu.alignItemsVertically();
        menu.x = winSize.width - 70;
        menu.y = winSize.height - 80;
        this.addChild(menu, 10);

        // create a render texture
        var target = new cc.RenderTexture(winSize.width, winSize.height, 2);
        target.x = winSize.width / 2;
        target.y = winSize.height / 2;
        this.addChild(target, 1);

        this._target = target;

        this._lastLocation = new cc.Point(winSize.width / 2, winSize.height / 2);
    }

    onExit() {
        super.onExit();
    }

    saveCB(sender) {
        if(!cc.sys.isNative){
            cc.log("RenderTexture's saveToFile doesn't support on HTML5");
            return;
        }
        var namePNG = "image-" + this._counter + ".png";
        var nameJPG = "image-" + this._counter + ".jpg";

        // You can only save one file at a time (in one frame)
        this._target.saveToFile(nameJPG, cc.IMAGE_FORMAT_JPEG, false);
        //this._target.saveToFile(namePNG, cc.IMAGE_FORMAT_PNG);

        cc.log("images saved!");
        this._counter++;
    }

    clearCB(sender) {
        this._target.clear(Math.random() * 255, Math.random() * 255, Math.random() * 255, 255);
    }

    drawInLocation(location) {
        var distance = cc.Point.distance(location, this._lastLocation);

        if (distance > 1) {
            var locLastLocation = this._lastLocation, i;
            this._target.begin();
            this._brushs = [];
            for(i = 0; i < distance; ++i) {
                var diffX = locLastLocation.x - location.x;
                var diffY = locLastLocation.y - location.y;
                var delta = i / distance;
                var sprite = new cc.Sprite(s_fire);
                sprite.attr({
                    x: location.x + diffX * delta,
                    y: location.y + diffY * delta,
                    rotation: Math.random() * 360,
                    color: new cc.Color(Math.random() * 255, 255, 255),
                    scale: Math.random() + 0.25,
                    opacity: 20
                });
                sprite.parent = this;
                this._brushs.push(sprite);
            }
            for (i = 0; i < distance; i++) {
                this._brushs[i].visit();
            }
            this._target.end();
        }
        this._lastLocation = location;
    }

    subtitle() {
        return "Testing 'save'";
    }

};

var RenderTextureIssue937 = class RenderTextureIssue937 extends RenderTextureBaseLayer {
    constructor() {
        super();
        var winSize = cc.director.getWinSize();
        /*
         *     1    2
         * A: A1   A2
         *
         * B: B1   B2
         *
         *  A1: premulti sprite
         *  A2: premulti render
         *
         *  B1: non-premulti sprite
         *  B2: non-premulti render
         */
        var background = new cc.LayerColor(new cc.Color(200, 200, 200, 255));
        this.addChild(background);

        var spr_premulti = new cc.Sprite(s_fire);
        spr_premulti.x = 16;
        spr_premulti.y = 48;

        var spr_nonpremulti = new cc.Sprite(s_fire);
        spr_nonpremulti.x = 16;
        spr_nonpremulti.y = 16;

        /* A2 & B2 setup */
        var rend = new cc.RenderTexture(32, 64, cc.Texture2D.PIXEL_FORMAT_RGBA8888);
        if (!rend)
            return;
        // It's possible to modify the RenderTexture blending function by
        //        [[rend sprite] setBlendFunc:(ccBlendFunc) {GL_ONE, GL_ONE_MINUS_SRC_ALPHA}];
        //rend.getSprite().setBlendFunc(cc.rendererConfig.renderContext.ONE, cc.rendererConfig.renderContext.ONE_MINUS_SRC_ALPHA);
        rend.begin();
        spr_premulti.visit();
        spr_nonpremulti.visit();
        rend.end();

        /* A1: setup */
        spr_premulti.x = winSize.width / 2 - 16;
        spr_premulti.y = winSize.height / 2 + 16;
        /* B1: setup */
        spr_nonpremulti.x = winSize.width / 2 - 16;
        spr_nonpremulti.y = winSize.height / 2 - 16;

        rend.x = winSize.width / 2 + 16;
        rend.y = winSize.height / 2;
        //background.visible = false;
        this.addChild(spr_nonpremulti);
        this.addChild(spr_premulti);
        this.addChild(rend);
    }

    title() {
        return "Testing issue #937";
    }

    subtitle() {
        return "All images should be equal..";
    }

};

var RenderTextureZbuffer = class RenderTextureZbuffer extends RenderTextureBaseLayer {

    constructor() {
        super();


        this.mgr = null;


        this.sp1 = null;


        this.sp2 = null;


        this.sp3 = null;


        this.sp4 = null;


        this.sp5 = null;


        this.sp6 = null;


        this.sp7 = null;


        this.sp8 = null;


        this.sp9 = null;

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan: this.onTouchesBegan.bind(this),
            onTouchesEnded: this.onTouchesEnded.bind(this),
            onTouchesMoved: this.onTouchesMoved.bind(this)
        }, this);

        var size = cc.director.getWinSize();
        var label = new cc.LabelTTF("vertexZ = 50", "Marker Felt", 64);
        label.x = size.width / 2;
        label.y = size.height * 0.25;
        this.addChild(label);

        var label2 = new cc.LabelTTF("vertexZ = 0", "Marker Felt", 64);
        label2.x = size.width / 2;
        label2.y = size.height * 0.5;
        this.addChild(label2);

        var label3 = new cc.LabelTTF("vertexZ = -50", "Marker Felt", 64);
        label3.x = size.width / 2;
        label3.y = size.height * 0.75;
        this.addChild(label3);

        label.vertexZ = 50;
        label2.vertexZ = 0;
        label3.vertexZ = -50;

        cc.spriteFrameCache.addSpriteFrames(s_circle_plist);
        this.mgr = new cc.SpriteBatchNode(s_circle_png, 9);
        this.addChild(this.mgr);
        this.sp1 = new cc.Sprite("#circle.png");
        this.sp2 = new cc.Sprite("#circle.png");
        this.sp3 = new cc.Sprite("#circle.png");
        this.sp4 = new cc.Sprite("#circle.png");
        this.sp5 = new cc.Sprite("#circle.png");
        this.sp6 = new cc.Sprite("#circle.png");
        this.sp7 = new cc.Sprite("#circle.png");
        this.sp8 = new cc.Sprite("#circle.png");
        this.sp9 = new cc.Sprite("#circle.png");

        this.mgr.addChild(this.sp1, 9);
        this.mgr.addChild(this.sp2, 8);
        this.mgr.addChild(this.sp3, 7);
        this.mgr.addChild(this.sp4, 6);
        this.mgr.addChild(this.sp5, 5);
        this.mgr.addChild(this.sp6, 4);
        this.mgr.addChild(this.sp7, 3);
        this.mgr.addChild(this.sp8, 2);
        this.mgr.addChild(this.sp9, 1);

        this.sp1.vertexZ = 400;
        this.sp2.vertexZ = 300;
        this.sp3.vertexZ = 200;
        this.sp4.vertexZ = 100;
        this.sp5.vertexZ = 0;
        this.sp6.vertexZ = -100;
        this.sp7.vertexZ = -200;
        this.sp8.vertexZ = -300;
        this.sp9.vertexZ = -400;

        this.sp9.scale = 2;
        this.sp9.color = cc.Color.YELLOW;
    }

    onTouchesBegan(touches, event) {
        if (!touches || touches.length === 0)
            return;

        for (var i = 0; i < touches.length; i++) {
            var location = touches[i].getLocation();

            this.sp1.x = location.x;
            this.sp1.y = location.y;
            this.sp2.x = location.x;
            this.sp2.y = location.y;
            this.sp3.x = location.x;
            this.sp3.y = location.y;
            this.sp4.x = location.x;
            this.sp4.y = location.y;
            this.sp5.x = location.x;
            this.sp5.y = location.y;
            this.sp6.x = location.x;
            this.sp6.y = location.y;
            this.sp7.x = location.x;
            this.sp7.y = location.y;
            this.sp8.x = location.x;
            this.sp8.y = location.y;
            this.sp9.x = location.x;
            this.sp9.y = location.y;
        }
    }

    onTouchesMoved(touches, event) {
        if (!touches || touches.length === 0)
            return;

        for (var i = 0; i < touches.length; i++) {
            var location = touches[i].getLocation();

            this.sp1.x = location.x;
            this.sp1.y = location.y;
            this.sp2.x = location.x;
            this.sp2.y = location.y;
            this.sp3.x = location.x;
            this.sp3.y = location.y;
            this.sp4.x = location.x;
            this.sp4.y = location.y;
            this.sp5.x = location.x;
            this.sp5.y = location.y;
            this.sp6.x = location.x;
            this.sp6.y = location.y;
            this.sp7.x = location.x;
            this.sp7.y = location.y;
            this.sp8.x = location.x;
            this.sp8.y = location.y;
            this.sp9.x = location.x;
            this.sp9.y = location.y;
        }
    }

    onTouchesEnded(touches, event) {
        this.renderScreenShot();
    }

    title() {
        return "Testing Z Buffer in Render Texture";
    }

    subtitle() {
        return "Touch screen. It should be green";
    }

    renderScreenShot() {
        var winSize = cc.director.getWinSize();
        var texture = new cc.RenderTexture(winSize.width, winSize.width);
        if (!texture)
            return;

        texture.anchorX = 0;
        texture.anchorY = 0;
        texture.begin();
        this.visit();
        texture.end();

        var sprite = new cc.Sprite(texture.getSprite().texture);

        sprite.x = winSize.width/2;
        sprite.y = winSize.width/2;
        sprite.opacity = 182;
        sprite.flippedY = 1;
        this.addChild(sprite, 999999);
        sprite.color = cc.Color.GREEN;

        sprite.runAction(cc.sequence(new cc.FadeTo(2, 0), new cc.Hide()));
    }

};

var RenderTextureTestDepthStencil = class RenderTextureTestDepthStencil extends RenderTextureBaseLayer {

    constructor() {
        super();


        this._spriteDraw = null;


        this._rend = null;
        var winSize = cc.director.getWinSize();

        this._spriteDraw = new cc.Sprite(s_fire);
        this._spriteDraw.x = winSize.width * 0.25;
        this._spriteDraw.y = 0;
        this._spriteDraw.scale = 10;

        this._spriteDraw.x = this._spriteDraw.x + this._spriteDraw.getContentSize().width * this._spriteDraw.getScale() * 0.5;
        this._spriteDraw.y = this._spriteDraw.y + this._spriteDraw.getContentSize().height * this._spriteDraw.getScale() * 0.5;

        this._rend = new cc.RenderTexture(winSize.width, winSize.height, cc.Texture2D.PIXEL_FORMAT_RGBA4444, gl.DEPTH24_STENCIL8_OES);
        this._rend.x = winSize.width * 0.5;
        this._rend.y = winSize.height * 0.5;
        this.addChild(this._rend);
        var item = new cc.MenuItemFont("Click Me", this.maskTest, this);
        var menu = new cc.Menu(item);
        menu.x = winSize.width - 90;
        menu.y = winSize.height - 100;

        this.addChild(menu);
        this.addChild(this._spriteDraw);
    }

    releaseMask() {
        var gl = cc.rendererConfig.renderContext;
        gl.stencilFunc(gl.NOTEQUAL, 1, 0xFF);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        gl.disable(gl.STENCIL_TEST);
        this.onRestartCallback();
    }

    maskTest(sender) {
        var gl = cc.rendererConfig.renderContext;

        gl.clear(gl.STENCIL_BUFFER_BIT);
        this._rend.beginWithClear(0, 0, 0, 0, 0, 0);

        gl.stencilMask(0xFF);
        cc.eventManager.removeListeners(cc.EventListener.TOUCH_ONE_BY_ONE);
        gl.stencilFunc(gl.NEVER, 1, 0xFF);
        gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);
        gl.enable(gl.STENCIL_TEST);

        this._rend.end();
        this.schedule(this.releaseMask, 0.5);
    }

    title() {
        return "Testing depthStencil attachment";
    }
    subtitle() {
        return "Click to be masked and turn black\n Come back after 0.5s";
    }

};

var RenderTextureTargetNode = class RenderTextureTargetNode extends RenderTextureBaseLayer {


    constructor() {
        super();



        this._sprite1 = null;



        this._sprite2 = null;



        this._time = 0;



        this._winSize = null;



        this._renderTexture = null;
        /*
         *     1    2
         * A: A1   A2
         *
         * B: B1   B2
         *
         *  A1: premulti sprite
         *  A2: premulti render
         *
         *  B1: non-premulti sprite
         *  B2: non-premulti render
         */
        var background = new cc.LayerColor(new cc.Color(40, 40, 40, 255));
        this.addChild(background);

        var winSize = cc.director.getWinSize();
        this._winSize = winSize;

        // sprite 1
        var sprite1 = new cc.Sprite(s_fire);
        sprite1.x = winSize.width;
        sprite1.y = winSize.height;
        this._sprite1 = sprite1;

        // sprite 2
        //todo Images/fire_rgba8888.pvr
        var sprite2 = new cc.Sprite(s_fire);
        sprite2.x = winSize.width;
        sprite2.y = winSize.height;
        this._sprite2 = sprite2;

        /* Create the render texture */
        //var renderTexture = new cc.RenderTexture(winSize.width, winSize.height, cc.TEXTURE_2D_PIXEL_FORMAT_RGBA4444);
        var renderTexture = new cc.RenderTexture(winSize.width, winSize.height);
        this._renderTexture = renderTexture;

        renderTexture.x = winSize.width / 2;
        renderTexture.y = winSize.height / 2;

        /* add the sprites to the render texture */
        renderTexture.addChild(this._sprite1);
        renderTexture.addChild(this._sprite2);
        renderTexture.clearColorVal = new cc.Color(0, 0, 0, 0);
        renderTexture.clearFlags = cc.rendererConfig.renderContext.COLOR_BUFFER_BIT;

        /* add the render texture to the scene */
        this.addChild(renderTexture);

        renderTexture.setAutoDraw(true);

        this.scheduleUpdate();

        // Toggle clear on / off
        var item = new cc.MenuItemFont("Clear On/Off", this.touched, this);
        var menu = new cc.Menu(item);
        this.addChild(menu);

        menu.x = winSize.width / 2;
        menu.y = winSize.height / 2;
    }

    update(dt) {
        var r = 80;
        var locWinSize = this._winSize;
        var locTime = this._time;
        this._sprite1.x = Math.cos(locTime * 2) * r + locWinSize.width /2;
        this._sprite1.y = Math.sin(locTime * 2) * r + locWinSize.height /2;
        this._sprite2.x = Math.sin(locTime * 2) * r + locWinSize.width /2;
        this._sprite2.y = Math.cos(locTime * 2) * r + locWinSize.height /2;

        this._time += dt;
    }

    title() {
        return "Testing Render Target Node";
    }

    subtitle() {
        return "Sprites should be equal and move with each frame";
    }

    touched(sender) {
        if (this._renderTexture.clearFlags == 0)
            this._renderTexture.clearFlags = cc.rendererConfig.renderContext.COLOR_BUFFER_BIT;
        else {
            this._renderTexture.clearFlags = 0;
            this._renderTexture.clearColorVal = new cc.Color(Math.random()*255, Math.random()*255, Math.random()*255, 255);
        }
    }

};

//------------------------------------------------------------------
//
// Issue1464
//
//------------------------------------------------------------------
var Issue1464 = class Issue1464 extends RenderTextureBaseLayer {

    constructor() {
        super();


        this._brush = null;


        this._target = null;


        this._lastLocation = null;


        this._counter = 0;


        this.testDuration = 2.1;

        var sprite = new cc.Sprite(s_grossini);

        // create a render texture
        var rend = new cc.RenderTexture( winSize.width/2, winSize.height/2 );
        rend.x = winSize.width/2;
        rend.y = winSize.height/2 ;
        this.addChild( rend, 1 );

        sprite.x = winSize.width/4;

        sprite.y = winSize.height/4;
        rend.begin();
        sprite.visit();
        rend.end();

        var fadeout = new cc.FadeOut(2);
        var fadein = fadeout.reverse();
        var delay = new cc.DelayTime(0.25);
        var seq = cc.sequence(fadeout, delay, fadein, delay.clone());
        var fe = seq.repeatForever();
        rend.getSprite().runAction(fe);

        if (!cc.sys.isNative && !("opengl" in cc.sys.capabilities)) {
            var label = new cc.LabelTTF("Not support Actions on HTML5-canvas", "Times New Roman", 30);
            label.x = winSize.width / 2;
            label.y = winSize.height / 2 + 50;
            this.addChild(label, 100);
        }
    }

    title() {
        return "Issue 1464";
    }

    subtitle() {
        return "Sprites should fade in / out correctly";
    }

    //
    // Automation
    //

    getExpectedResult() {
        // blue, red, blue
        var ret = {"0":0,"1":0,"2":0,"3":255,"4":0,"5":0,"6":0,"7":255,"8":0,"9":0,"10":0,"11":255,"12":0,"13":0,"14":0,"15":255,"16":0,"17":0,"18":0,"19":255,"20":0,"21":0,"22":0,"23":255,"24":0,"25":0,"26":0,"27":255,"28":0,"29":0,"30":0,"31":255,"32":0,"33":0,"34":0,"35":255,"36":0,"37":0,"38":0,"39":255,"40":0,"41":0,"42":0,"43":255,"44":0,"45":0,"46":0,"47":255,"48":0,"49":0,"50":0,"51":255,"52":0,"53":0,"54":0,"55":255,"56":0,"57":0,"58":0,"59":255,"60":0,"61":0,"62":0,"63":255};
        return JSON.stringify(ret);
    }

    getCurrentResult() {
        var ret = this.readPixels(winSize.width/2-2, winSize.height/2-2,  4, 4);
        return JSON.stringify(ret);
    }

};


var RenderTextureTestScene = class RenderTextureTestScene extends TestScene {
    runThisTest(num) {
        sceneRenderTextureIdx = (num || num == 0) ? (num - 1) : -1;
        var layer = nextRenderTextureTest();
        this.addChild(layer);

        director.runScene(this);
    }

};

//
// Flow control
//
var arrayOfRenderTextureTest = [
    RenderTextureSave,
    Issue1464
];

if(('opengl' in cc.sys.capabilities) && cc.rendererConfig.isWebGL && (!cc.sys.isNative) ){
    arrayOfRenderTextureTest.push(RenderTextureIssue937);
    arrayOfRenderTextureTest.push(RenderTextureZbuffer);
    arrayOfRenderTextureTest.push(RenderTextureTestDepthStencil);
    arrayOfRenderTextureTest.push(RenderTextureTargetNode);
}

var nextRenderTextureTest = function () {
    sceneRenderTextureIdx++;
    sceneRenderTextureIdx = sceneRenderTextureIdx % arrayOfRenderTextureTest.length;

    return new arrayOfRenderTextureTest[sceneRenderTextureIdx]();
};
var previousRenderTextureTest = function () {
    sceneRenderTextureIdx--;
    if (sceneRenderTextureIdx < 0)
        sceneRenderTextureIdx += arrayOfRenderTextureTest.length;

    return new arrayOfRenderTextureTest[sceneRenderTextureIdx]();
};
var restartRenderTextureTest = function () {
    return new arrayOfRenderTextureTest[sceneRenderTextureIdx]();
};
