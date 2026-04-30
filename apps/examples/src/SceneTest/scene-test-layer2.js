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

export class SceneTestLayer2 extends cc.Layer {


    constructor() {
        //----start0----Scene2-ctor
        super();



        this.timeCounter = 0;
        this.init();

        this.timeCounter = 0;

        var s = director.getWinSize();

        var item1 = new MenuItemFont("runScene", this.runScene, this);
        var item2 = new MenuItemFont("runScene w/transition", this.runSceneTran, this);
        var item3 = new MenuItemFont("Go Back", this.onGoBack, this);

        var menu = new Menu(item1, item2, item3);
        menu.alignItemsVertically();
        this.addChild(menu);

        var sprite = new Sprite(s_pathGrossini);
        this.addChild(sprite);

        sprite.x = s.width - 40;
        sprite.y = s.height / 2;
        var rotate = new RotateBy(2, 360);
        var repeat = rotate.repeatForever();
        sprite.runAction(repeat);
        //----end0----

        //schedule(this.testDealloc);
    }

    testDealloc(dt) {

    }

    onGoBack(sender) {
        director.popScene();
    }

    runScene(sender) {
        var scene = new SceneTestScene();
        var layer = new SceneTestLayer3();
        scene.addChild(layer, 0);
        director.runScene(scene);

    }

    runSceneTran(sender) {
        var scene = new SceneTestScene();
        var layer = new SceneTestLayer3();
        scene.addChild(layer, 0);
        director.runScene(new TransitionSlideInT(2, scene));
    }

    //CREATE_NODE(SceneTestLayer2);

}
