/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 Copyright (c) 2013      Surith Thekkiam

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

var sceneIdx = -1;

//------------------------------------------------------------------
//
// S9SpriteTestDemo
//
//------------------------------------------------------------------
var S9SpriteTestDemo = class S9SpriteTestDemo extends cc.LayerGradient {

    constructor() {
        super(new cc.Color(0,0,0,255), new cc.Color(98,99,117,255));


        this._title = "";


        this._subtitle = "";
        cc.spriteFrameCache.addSpriteFrames(s_s9s_blocks9_plist);
        cc.log('sprite frames added to sprite frame cache...');
    }
    onEnter() {
        super.onEnter();

        var label = new cc.LabelTTF(this._title, "Arial", 28);
        this.addChild(label, 1);
        label.x = winSize.width / 2;
        label.y = winSize.height - 50;

        if (this._subtitle !== "") {
            var l = new cc.LabelTTF(this._subtitle, "Thonburi", 16);
            this.addChild(l, 1);
            l.x = winSize.width / 2;
            l.y = winSize.height - 80;
        }

        var item1 = new cc.MenuItemImage(s_pathB1, s_pathB2, this.onBackCallback, this);
        var item2 = new cc.MenuItemImage(s_pathR1, s_pathR2, this.onRestartCallback, this);
        var item3 = new cc.MenuItemImage(s_pathF1, s_pathF2, this.onNextCallback, this);

        var menu = new cc.Menu(item1, item2, item3);

        menu.x = 0;
        menu.y = 0;
        var width = item2.width, height = item2.height;
        item1.x = winSize.width/2 - width*2;
        item1.y = height/2;
        item2.x = winSize.width/2;
        item2.y = height/2;
        item3.x = winSize.width/2 + width*2;
        item3.y = height/2;

        this.addChild(menu, 1);
    }

    onExit() {
        super.onExit();
    }

    onRestartCallback(sender) {
        var s = new S9SpriteTestScene();
        s.addChild(restartS9SpriteTest());
        director.runScene(s);
    }
    onNextCallback(sender) {
        var s = new S9SpriteTestScene();
        s.addChild(nextS9SpriteTest());
        director.runScene(s);
    }
    onBackCallback(sender) {
        var s = new S9SpriteTestScene();
        s.addChild(previousS9SpriteTest());
        director.runScene(s);
    }

};

// S9BatchNodeBasic

var S9BatchNodeBasic = class S9BatchNodeBasic extends S9SpriteTestDemo {


    constructor() {
        super();



        this._title = "Scale9Sprite created empty and updated from SpriteBatchNode";



        this._subtitle = "updateWithBatchNode(); capInsets=full size";

        var x = winSize.width / 2;
        var y = 0 + (winSize.height / 2);

        cc.log("S9BatchNodeBasic ...");

        var batchNode = new cc.SpriteBatchNode("Images/blocks9.png");
        cc.log("batchNode created with : " + "Images/blocks9.png");

        var blocks = new cc.Scale9Sprite();
        cc.log("... created");

        blocks.updateWithBatchNode(batchNode, new cc.Rect(0, 0, 96, 96), false, new cc.Rect(0, 0, 96, 96));
        cc.log("... updateWithBatchNode");

        blocks.x = x;
        blocks.y = y;
        cc.log("... setPosition");

        this.addChild(blocks);
        cc.log("this..addChild");

        cc.log("... S9BatchNodeBasic done.");

        var moveBy = new cc.MoveBy(1, new cc.Point(80, 80));
        var moveByBack = moveBy.reverse();
        blocks.runAction(cc.sequence(moveBy,moveByBack));
    }

};

// S9FrameNameSpriteSheet

var S9FrameNameSpriteSheet = class S9FrameNameSpriteSheet extends S9SpriteTestDemo {


    constructor() {
        super();



        this._title = "Scale9Sprite from sprite sheet";



        this._subtitle = "createWithSpriteFrameName(); default cap insets";

        var x = winSize.width / 2;
        var y = 0 + (winSize.height / 2);

        cc.log("S9FrameNameSpriteSheet ...");

        var blocks = new cc.Scale9Sprite('blocks9.png');
        cc.log("... created");

        blocks.x = x;
        blocks.y = y;
        cc.log("... setPosition");

        this.addChild(blocks);
        cc.log("this..addChild");

        cc.log("... S9FrameNameSpriteSheet done.");

        var moveBy = new cc.MoveBy(1, new cc.Point(80, 80));
        var moveByBack = moveBy.reverse();
        blocks.runAction(cc.sequence(moveBy,moveByBack));
    }

};

// S9FrameNameSpriteSheetRotated

var S9FrameNameSpriteSheetRotated = class S9FrameNameSpriteSheetRotated extends S9SpriteTestDemo {


    constructor() {
        super();



        this._title = "Scale9Sprite from sprite sheet (stored rotated)";



        this._subtitle = "createWithSpriteFrameName(); default cap insets";

        var x = winSize.width / 2;
        var y = 0 + (winSize.height / 2);

        cc.log("S9FrameNameSpriteSheetRotated ...");

        var blocks = new cc.Scale9Sprite('blocks9r.png');
        cc.log("... created");

        blocks.x = x;
        blocks.y = y;
        cc.log("... setPosition");

        this.addChild(blocks);
        cc.log("this..addChild");

        cc.log("... S9FrameNameSpriteSheetRotated done.");
    }

};

// S9BatchNodeScaledNoInsets

var S9BatchNodeScaledNoInsets = class S9BatchNodeScaledNoInsets extends S9SpriteTestDemo {


    constructor() {
        super();



        this._title = "Scale9Sprite created empty and updated from SpriteBatchNode";



        this._subtitle = "updateWithBatchNode(); capInsets=full size; rendered 4 X width, 2 X height";

        var x = winSize.width / 2;
        var y = 0 + (winSize.height / 2);

        cc.log("S9BatchNodeScaledNoInsets ...");

        // scaled without insets
        var batchNode_scaled = new cc.SpriteBatchNode("Images/blocks9.png");
        cc.log("batchNode_scaled created with : " + "Images/blocks9.png");

        var blocks_scaled = new cc.Scale9Sprite();
        cc.log("... created");
        blocks_scaled.updateWithBatchNode(batchNode_scaled, new cc.Rect(0, 0, 96, 96), false, new cc.Rect(0, 0, 96, 96));
        cc.log("... updateWithBatchNode");

        blocks_scaled.x = x;
        blocks_scaled.y = y;
        cc.log("... setPosition");

        blocks_scaled.width = 96 * 4;
        blocks_scaled.height = 96*2;
        cc.log("... setContentSize");

        this.addChild(blocks_scaled);
        cc.log("this..addChild");

        cc.log("... S9BtchNodeScaledNoInsets done.");
    }

};

// S9FrameNameSpriteSheetScaledNoInsets

var S9FrameNameSpriteSheetScaledNoInsets = class S9FrameNameSpriteSheetScaledNoInsets extends S9SpriteTestDemo {


    constructor() {
        super();



        this._title = "Scale9Sprite from sprite sheet";



        this._subtitle = "createWithSpriteFrameName(); default cap insets; rendered 4 X width, 2 X height";

        var x = winSize.width / 2;
        var y = 0 + (winSize.height / 2);

        cc.log("S9FrameNameSpriteSheetScaledNoInsets ...");

        var blocks_scaled = new cc.Scale9Sprite('blocks9.png');
        cc.log("... created");

        blocks_scaled.x = x;
        blocks_scaled.y = y;
        cc.log("... setPosition");

        blocks_scaled.width = 96 * 4;
        blocks_scaled.height = 96*2;
        cc.log("... setContentSize");

        this.addChild(blocks_scaled);
        cc.log("this..addChild");

        cc.log("... S9FrameNameSpriteSheetScaledNoInsets done.");
    }

};

// S9FrameNameSpriteSheetRotatedScaledNoInsets

var S9FrameNameSpriteSheetRotatedScaledNoInsets = class S9FrameNameSpriteSheetRotatedScaledNoInsets extends S9SpriteTestDemo {


    constructor() {
        super();



        this._title = "Scale9Sprite from sprite sheet (stored rotated)";



        this._subtitle = "createWithSpriteFrameName(); default cap insets; rendered 4 X width, 2 X height";

        var x = winSize.width / 2;
        var y = 0 + (winSize.height / 2);

        cc.log("S9FrameNameSpriteSheetRotatedScaledNoInsets ...");

        var blocks_scaled = new cc.Scale9Sprite('blocks9r.png');
        cc.log("... created");

        blocks_scaled.x = x;
        blocks_scaled.y = y;
        cc.log("... setPosition");

        blocks_scaled.width = 96 * 4;
        blocks_scaled.height = 96*2;
        cc.log("... setContentSize");

        this.addChild(blocks_scaled);
        cc.log("this..addChild");

        cc.log("... S9FrameNameSpriteSheetRotatedScaledNoInsets done.");
    }

};


// S9BatchNodeScaleWithCapInsets

var S9BatchNodeScaleWithCapInsets = class S9BatchNodeScaleWithCapInsets extends S9SpriteTestDemo {


    constructor() {
        super();



        this._title = "Scale9Sprite created empty and updated from SpriteBatchNode";



        this._subtitle = "updateWithBatchNode(); capInsets=(32, 32, 32, 32)";

        var x = winSize.width / 2;
        var y = 0 + (winSize.height / 2);

        cc.log("S9BatchNodeScaleWithCapInsets ...");

        var batchNode_scaled_with_insets = new cc.SpriteBatchNode("Images/blocks9.png");
        cc.log("batchNode_scaled_with_insets created with : " + "Images/blocks9.png");

        var blocks_scaled_with_insets = new cc.Scale9Sprite();
        cc.log("... created");

        blocks_scaled_with_insets.updateWithBatchNode(batchNode_scaled_with_insets, new cc.Rect(0, 0, 96, 96), false, new cc.Rect(32, 32, 32, 32));
        cc.log("... updateWithBatchNode");

        blocks_scaled_with_insets.width = 96 * 4.5;
        blocks_scaled_with_insets.height = 96 * 2.5;
        cc.log("... setContentSize");

        blocks_scaled_with_insets.x = x;
        blocks_scaled_with_insets.y = y;
        cc.log("... setPosition");

        this.addChild(blocks_scaled_with_insets);
        cc.log("this..addChild");

        cc.log("... S9BatchNodeScaleWithCapInsets done.");
    }

};

// S9FrameNameSpriteSheetInsets

var S9FrameNameSpriteSheetInsets = class S9FrameNameSpriteSheetInsets extends S9SpriteTestDemo {


    constructor() {
        super();



        this._title = "Scale9Sprite scaled with insets sprite sheet";



        this._subtitle = "createWithSpriteFrameName(); cap insets=(32, 32, 32, 32)";

        var x = winSize.width / 2;
        var y = 0 + (winSize.height / 2);

        cc.log("S9FrameNameSpriteSheetInsets ...");

        var blocks_with_insets = new cc.Scale9Sprite('blocks9.png', new cc.Rect(32, 32, 32, 32));
        cc.log("... created");

        blocks_with_insets.x = x;
        blocks_with_insets.y = y;
        cc.log("... setPosition");

        this.addChild(blocks_with_insets);
        cc.log("this..addChild");

        cc.log("... S9FrameNameSpriteSheetInsets done.");
    }

};

// S9FrameNameSpriteSheetInsetsScaled

var S9FrameNameSpriteSheetInsetsScaled = class S9FrameNameSpriteSheetInsetsScaled extends S9SpriteTestDemo {


    constructor() {
        super();



        this._title = "Scale9Sprite scaled with insets sprite sheet";



        this._subtitle = "createWithSpriteFrameName(); default cap insets; rendered scaled 4.5 X width, 2.5 X height";

        var x = winSize.width / 2;
        var y = 0 + (winSize.height / 2);

        cc.log("S9FrameNameSpriteSheetInsetsScaled ...");

        var blocks_scaled_with_insets = new cc.Scale9Sprite('blocks9.png', new cc.Rect(32, 32, 32, 32));
        cc.log("... created");

        blocks_scaled_with_insets.width = 96 * 4.5;
        blocks_scaled_with_insets.height = 96 * 2.5;
        cc.log("... setContentSize");

        blocks_scaled_with_insets.x = x;
        blocks_scaled_with_insets.y = y;
        cc.log("... setPosition");

        this.addChild(blocks_scaled_with_insets);
        cc.log("this..addChild");

        cc.log("... S9FrameNameSpriteSheetInsetsScaled done.");
    }

};

// S9FrameNameSpriteSheetRotatedInsets

var S9FrameNameSpriteSheetRotatedInsets = class S9FrameNameSpriteSheetRotatedInsets extends S9SpriteTestDemo {


    constructor() {
        super();



        this._title = "Scale9Sprite scaled with insets sprite sheet (stored rotated)";



        this._subtitle = "createWithSpriteFrameName(); cap insets=(32, 32, 32, 32)";

        var x = winSize.width / 2;
        var y = 0 + (winSize.height / 2);

        cc.log("S9FrameNameSpriteSheetRotatedInsets ...");

        var blocks_with_insets = new cc.Scale9Sprite('blocks9r.png', new cc.Rect(32, 32, 32, 32));
        cc.log("... created");

        blocks_with_insets.x = x;
        blocks_with_insets.y = y;
        cc.log("... setPosition");

        this.addChild(blocks_with_insets);
        cc.log("this..addChild");

        cc.log("... S9FrameNameSpriteSheetRotatedInsets done.");
    }

};

// S9_TexturePacker

var S9_TexturePacker = class S9_TexturePacker extends S9SpriteTestDemo {


    constructor() {
        super();



        this._title = "Scale9Sprite from a spritesheet created with TexturePacker";



        this._subtitle = "createWithSpriteFrameName('button_normal.png');createWithSpriteFrameName('button_actived.png');";
        cc.spriteFrameCache.addSpriteFrames(s_s9s_ui_plist);

        var x = winSize.width / 4;
        var y = 0 + (winSize.height / 2);

        cc.log("S9_TexturePacker ...");

        var s = new cc.Scale9Sprite('button_normal.png');
        cc.log("... created");

        s.x = x;

        s.y = y;
        cc.log("... setPosition");

        s.width = 21 * 16;

        s.height = 13 * 16;
        cc.log("... setContentSize");

        this.addChild(s);
        cc.log("this..addChild");

        x = winSize.width * 3/4;

        var s2 = new cc.Scale9Sprite('button_actived.png');
        cc.log("... created");

        s2.x = x;
        s2.y = y;
        cc.log("... setPosition");

        s2.width = 21 * 16;
        s2.height = 13 * 16;
        cc.log("... setContentSize");

        this.addChild(s2);
        cc.log("this..addChild");

        cc.log("... S9_TexturePacker done.");
    }

};

// S9FrameNameSpriteSheetRotatedInsetsScaled

var S9FrameNameSpriteSheetRotatedInsetsScaled = class S9FrameNameSpriteSheetRotatedInsetsScaled extends S9SpriteTestDemo {


    constructor() {
        super();



        this._title = "Scale9Sprite scaled with insets sprite sheet (stored rotated)";



        this._subtitle = "createWithSpriteFrameName(); default cap insets; rendered scaled 4.5 X width, 2.5 X height";

        var x = winSize.width / 2;
        var y = 0 + (winSize.height / 2);

        cc.log("S9FrameNameSpriteSheetRotatedInsetsScaled ...");

        var blocks_scaled_with_insets = new cc.Scale9Sprite('blocks9.png', new cc.Rect(32, 32, 32, 32));
        cc.log("... created");

        blocks_scaled_with_insets.width = 96 * 4.5;
        blocks_scaled_with_insets.height = 96 * 2.5;
        cc.log("... setContentSize");

        blocks_scaled_with_insets.x = x;
        blocks_scaled_with_insets.y = y;
        cc.log("... setPosition");

        this.addChild(blocks_scaled_with_insets);
        cc.log("this..addChild");

        cc.log("... S9FrameNameSpriteSheetRotatedInsetsScaled done.");
    }

};

var S9SpriteActionTest = class S9SpriteActionTest extends S9SpriteTestDemo {


    constructor() {
        super();



        this._title = "Test Action for Scale9Sprite : Rotate + Scale + Translate";

        var blocks_with_insets = new cc.Scale9Sprite('blocks9.png');

        blocks_with_insets.x = winSize.width / 2;
        blocks_with_insets.y = winSize.height / 2;
        blocks_with_insets.width = 96 * 4;
        blocks_with_insets.height = 96 * 2;

        this.addChild(blocks_with_insets);

        var delay = new cc.DelayTime(0.25);

        var rotateBy = new cc.RotateBy(2, 360);
        var rotateByBack = rotateBy.reverse();

        var ScaleTo = new cc.ScaleTo(2, -0.44, 0.47);
        var ScaleToBack = new cc.ScaleTo(2, 1.0, 1.0);

        var moveBy = new cc.MoveBy(1, new cc.Point(80, 80));
        var moveByBack = moveBy.reverse();

        blocks_with_insets.runAction(cc.sequence(rotateBy, delay, rotateByBack));
        blocks_with_insets.runAction(cc.sequence(ScaleTo, delay.clone(), ScaleToBack));
        blocks_with_insets.runAction(cc.sequence(moveBy,moveByBack));
    }

};

var S9SpriteColorOpacityTest = class S9SpriteColorOpacityTest extends S9SpriteTestDemo {

    constructor() {
        super();


        this._title = "Test color/opacity cascade for Scale9Sprite (red with 128 opacity)";

        this.setCascadeColorEnabled(true);
        this.setCascadeOpacityEnabled(true);
        this.setOpacity(128);
        this.setColor(new cc.Color(255, 0, 0));

        var blocks = new cc.Scale9Sprite('blocks9.png');
        blocks.x = winSize.width / 2 - 100;
        blocks.y = winSize.height / 2;
        this.addChild(blocks);

        var batchNode = new cc.SpriteBatchNode("Images/blocks9.png");
        var blocks2 = new cc.Scale9Sprite();
        blocks2.updateWithBatchNode(batchNode, new cc.Rect(0, 0, 96, 96), false, new cc.Rect(0, 0, 96, 96));
        blocks2.x = winSize.width / 2 + 100;
        blocks2.y = winSize.height / 2;
        this.addChild(blocks2);
    }

};

var S9SpriteOpacityWithFadeActionsTest = class S9SpriteOpacityWithFadeActionsTest extends S9SpriteTestDemo {

    constructor() {
        super();


        this._title = "Test opacity cascade for Scale9Sprite with fade actions\n(fade to opacity 144, then fadeOut, then fadeIn)";

        var colorLayer = new cc.LayerColor(new cc.Color(144,144,144));
        colorLayer.setContentSize(winSize.width / 2, winSize.height / 2);
        colorLayer.x = winSize.width / 4;
        colorLayer.y = winSize.height / 4;

        colorLayer.setCascadeOpacityEnabled(true);

        var blocks = new ccui.Scale9Sprite('blocks9.png');
        blocks.x = winSize.width / 4;
        blocks.y = winSize.height / 4;

        colorLayer.addChild(blocks);

        var fadeToAction = new cc.FadeTo(1, 144);
        var delay = new cc.DelayTime(0.5);
        var fadeOutAction = new cc.FadeOut(0.8);
        var fadeInAction = new cc.FadeIn(0.8);

        colorLayer.runAction(cc.sequence(fadeToAction, delay, fadeOutAction, delay.clone(), fadeInAction));

        this.addChild(colorLayer);
    }

};


var S9SpriteRenderingTypeToggleTest = class S9SpriteRenderingTypeToggleTest extends S9SpriteTestDemo {

    constructor() {
        super();


        this._title = "Test Toggle Scale9Sprite RenderingType";


        var blocks = new ccui.Scale9Sprite('blocks9.png');
        blocks.x = winSize.width / 2;
        blocks.y = winSize.height / 2 + 50;

        blocks.width = blocks.width * 2;


        var button = this._button = new ccui.Button();
        button.setTouchEnabled(true);
        button.x = winSize.width / 2.0;
        button.y = winSize.height / 2.0 - 50;
        button.setTitleText("Toggle SIMPLE");
        button.addTouchEventListener(function (sender, type) {
            if(type === ccui.Widget.TOUCH_ENDED) {
                if(blocks.getRenderingType() === ccui.Scale9Sprite.RenderingType.SLICED) {
                    blocks.setRenderingType(ccui.Scale9Sprite.RenderingType.SIMPLE);
                    button.setTitleText("Toggle SLICED");
                } else {
                    blocks.setRenderingType(ccui.Scale9Sprite.RenderingType.SLICED);
                    button.setTitleText("Toggle SIMPLE");
                }
            }
        } , this);

        this.addChild(button);


        this.addChild(blocks);
    }

};

var S9SpriteTestScene = class S9SpriteTestScene extends TestScene {
    runThisTest(num) {
        sceneIdx = (num || num == 0) ? (num - 1) : -1;
        var layer = nextS9SpriteTest();
        this.addChild(layer);

        director.runScene(this);
    }

};
//
// Flow control
//

var arrayOfS9SpriteTest = [
    S9BatchNodeBasic,
    S9FrameNameSpriteSheet,
    S9FrameNameSpriteSheetRotated,
    S9BatchNodeScaledNoInsets,
    S9FrameNameSpriteSheetScaledNoInsets,
    S9FrameNameSpriteSheetRotatedScaledNoInsets,
    S9BatchNodeScaleWithCapInsets,
    S9FrameNameSpriteSheetInsets,
    S9FrameNameSpriteSheetInsetsScaled,
    S9FrameNameSpriteSheetRotatedInsets,
    S9FrameNameSpriteSheetRotatedInsetsScaled,
    S9_TexturePacker,
    S9SpriteActionTest,
    S9SpriteColorOpacityTest,
    S9SpriteOpacityWithFadeActionsTest,
    S9SpriteRenderingTypeToggleTest
];

var nextS9SpriteTest = function () {
    sceneIdx++;
    sceneIdx = sceneIdx % arrayOfS9SpriteTest.length;

    return new arrayOfS9SpriteTest[sceneIdx]();
};
var previousS9SpriteTest = function () {
    sceneIdx--;
    if (sceneIdx < 0)
        sceneIdx += arrayOfS9SpriteTest.length;

    return new arrayOfS9SpriteTest[sceneIdx]();
};
var restartS9SpriteTest = function () {
    return new arrayOfS9SpriteTest[sceneIdx]();
};
