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
var TAG_NODE = 9960;

var parallaxTestSceneIdx = -1;

ParallaxDemo = class ParallaxDemo extends BaseTestLayer {
    constructor() {
        super(new cc.Color(0,0,0,255), new cc.Color(160,32,32,255));

        this._atlas = null;
    }

    title() {
        return "No title";
    }

    onBackCallback(sender) {
        var s = new ParallaxTestScene();
        s.addChild(previousParallaxTest());
        director.runScene(s);
    }

    onRestartCallback(sender) {
        var s = new ParallaxTestScene();
        s.addChild(restartParallaxTest());
        director.runScene(s);
    }

    onNextCallback(sender) {
        var s = new ParallaxTestScene();
        s.addChild(nextParallaxTest());
        director.runScene(s);
    }
    // automation
    numberOfPendingTests() {
        return ( (arrayOfParallaxTest.length-1) - parallaxTestSceneIdx );
    }

    getTestNumber() {
        return parallaxTestSceneIdx;
    }


};

var Parallax1 = class Parallax1 extends ParallaxDemo {

    constructor() {
        super();


        this._parentNode = null;


        this._background = null;


        this._tilemap = null;


        this._cocosimage = null;


        this.testDuration = 5;

        // Top Layer, a simple image
        this._cocosimage = new cc.Sprite(s_power);
        // scale the image (optional)
        this._cocosimage.scale = 1.5;
        // change the transform anchor point to 0,0 (optional)
        this._cocosimage.anchorX = 0;
        this._cocosimage.anchorY = 0;

        // Middle layer: a Tile map atlas
        //var tilemap = cc.TileMapAtlas.create(s_tilesPng, s_levelMapTga, 16, 16);
        this._tilemap = new cc.TMXTiledMap(s_resprefix + "TileMaps/orthogonal-test2.tmx");

        // change the transform anchor to 0,0 (optional)
        this._tilemap.anchorX = 0;
        this._tilemap.anchorY = 0;

        // Anti Aliased images
        //tilemap.texture.setAntiAliasTexParameters();

        // background layer: another image
        this._background = new cc.Sprite(s_back);
        // scale the image (optional)
        //background.scale = 1.5;
        // change the transform anchor point (optional)
        this._background.anchorX = 0;
        this._background.anchorY = 0;

        // create a void node, a parent node
        this._parentNode = new cc.ParallaxNode();

        // NOW add the 3 layers to the 'void' node

        // background image is moved at a ratio of 0.4x, 0.5y
        this._parentNode.addChild(this._background, -1, new cc.Point(0.4, 0.5), new cc.Point(0,0));

        // tiles are moved at a ratio of 2.2x, 1.0y
        this._parentNode.addChild(this._tilemap, 1, new cc.Point(2.2, 1.0), new cc.Point(0, 0));

        // top image is moved at a ratio of 3.0x, 2.5y
        this._parentNode.addChild(this._cocosimage, 2, new cc.Point(3.0, 2.5), new cc.Point(0, 0));

        // now create some actions that will move the '_parent' node
        // and the children of the '_parent' node will move at different
        // speed, thus, simulation the 3D environment
        var goUp = new cc.MoveBy(2, new cc.Point(0, 100));
        var goRight = new cc.MoveBy(2, new cc.Point(200, 0));
        var delay = new cc.DelayTime(2.0);
        var goDown = goUp.reverse();
        var goLeft = goRight.reverse();
        var seq = cc.sequence(goUp, goRight, delay, goDown, goLeft);
        this._parentNode.runAction(seq.repeatForever());

        this.addChild(this._parentNode);
    }

    title() {
        return "Parallax: parent and 3 children";
    }

    // default values for automation
    getExpectedResult() {
        var ret = {};
        ret.pos_parent = new cc.Point(200,100);
        ret.pos_child1 = new cc.Point(-120, -50);
        ret.pos_child2 = new cc.Point(240, 0);
        ret.pos_child3 = new cc.Point(400, 150);

        return JSON.stringify(ret);
    }

    getCurrentResult() {
        var ret = {};
        ret.pos_parent = new cc.Point(Math.round(this._parentNode.x), Math.round(this._parentNode.y));
        ret.pos_child1 = new cc.Point(Math.round(this._background.x), Math.round(this._background.y));
        ret.pos_child2 = new cc.Point(Math.round(this._tilemap.x), Math.round(this._tilemap.y));
        ret.pos_child3 = new cc.Point(Math.round(this._cocosimage.x), Math.round(this._cocosimage.y));

        return JSON.stringify(ret);
    }

};

var Parallax2 = class Parallax2 extends ParallaxDemo {
    constructor() {
        super();

        this._root = null;

        this._target = null;

        this._streak = null;

        if( 'touches' in cc.sys.capabilities ){
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesMoved:function (touches, event) {
                    var touch = touches[0];
                    var node = event.getCurrentTarget().getChildByTag(TAG_NODE);
                    node.x += touch.getDelta().x;
                    node.y += touch.getDelta().y;
                }
            }, this);
        } else if ('mouse' in cc.sys.capabilities ){
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseMove: function(event){
                    if(event.getButton() == cc.EventMouse.BUTTON_LEFT){
                        var node = event.getCurrentTarget().getChildByTag(TAG_NODE);
                        node.x += event.getDeltaX();
                        node.y += event.getDeltaY();
                    }
                }
            }, this);
        }


        // Top Layer, a simple image
        var cocosImage = new cc.Sprite(s_power);
        // scale the image (optional)
        cocosImage.scale = 1.5;
        // change the transform anchor point to 0,0 (optional)
        cocosImage.anchorX = 0;
        cocosImage.anchorY = 0;

        // Middle layer: a Tile map atlas
        //var tilemap = cc.TileMapAtlas.create(s_tilesPng, s_levelMapTga, 16, 16);
        var tilemap = new cc.TMXTiledMap(s_resprefix + "TileMaps/orthogonal-test2.tmx");

        // change the transform anchor to 0,0 (optional)
        tilemap.anchorX = 0;
        tilemap.anchorY = 0;

        // Anti Aliased images
        //tilemap.texture.setAntiAliasTexParameters();

        // background layer: another image
        var background = new cc.Sprite(s_back);
        // scale the image (optional)
        //background.scale = 1.5;
        // change the transform anchor point (optional)
        background.anchorX = 0;
        background.anchorY = 0;

        // create a void node, a parent node
        var voidNode = new cc.ParallaxNode();
        // NOW add the 3 layers to the 'void' node

        // background image is moved at a ratio of 0.4x, 0.5y
        voidNode.addChild(background, -1, new cc.Point(0.4, 0.5), new cc.Point(0,0));

        // tiles are moved at a ratio of 1.0, 1.0y
        voidNode.addChild(tilemap, 1, new cc.Point(1.0, 1.0), new cc.Point(0, 0));

        // top image is moved at a ratio of 3.0x, 2.5y
        voidNode.addChild(cocosImage, 2, new cc.Point(3.0, 2.5), new cc.Point(0, 0));
        this.addChild(voidNode, 0, TAG_NODE);
    }

    title() {
        return "Parallax: drag screen";
    }

};

ParallaxTestScene = class ParallaxTestScene extends TestScene {
    runThisTest(num) {
        parallaxTestSceneIdx = (num || num == 0) ? (num - 1) : -1;
        this.addChild(nextParallaxTest());
        director.runScene(this);
    }

};

var arrayOfParallaxTest = [
    Parallax1,
    Parallax2
];

var nextParallaxTest = function () {
    parallaxTestSceneIdx++;
    parallaxTestSceneIdx = parallaxTestSceneIdx % arrayOfParallaxTest.length;

    return new arrayOfParallaxTest[parallaxTestSceneIdx]();
};
var previousParallaxTest = function () {
    parallaxTestSceneIdx--;
    if (parallaxTestSceneIdx < 0)
        parallaxTestSceneIdx += arrayOfParallaxTest.length;

    return new arrayOfParallaxTest[parallaxTestSceneIdx]();
};
var restartParallaxTest = function () {
    return new arrayOfParallaxTest[parallaxTestSceneIdx]();
};
