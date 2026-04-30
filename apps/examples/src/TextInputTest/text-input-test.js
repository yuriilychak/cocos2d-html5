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

/**
 @brief    TextInputTest for retain prev, reset, next, main menu buttons.
 */
export class TextInputTest extends cc.Layer {
    constructor() {
        super();

        this.notificationLayer = null;
        this.init();
    }

    restartCallback(sender) {
        var scene = new TextInputTestScene();
        scene.addChild(restartTextInputTest());
        director.runScene(scene);
    }
    nextCallback(sender) {
        var scene = new TextInputTestScene();
        scene.addChild(nextTextInputTest());
        director.runScene(scene);
    }
    backCallback(sender) {
        var scene = new TextInputTestScene();
        scene.addChild(previousTextInputTest());
        director.runScene(scene);
    }

    title() {
        return "text input test";
    }

    addKeyboardNotificationLayer(layer) {
        this.notificationLayer = layer;
        this.addChild(layer);
    }

    onEnter() {
        super.onEnter();

        var winSize = director.getWinSize();

        var label = new LabelTTF(this.title(), "Arial", 24);
        this.addChild(label);
        label.x = winSize.width / 2;
        label.y = winSize.height - 50;

        var subTitle = this.subtitle();
        if (subTitle && subTitle !== "") {
            var l = new LabelTTF(subTitle, "Thonburi", 16);
            this.addChild(l, 1);
            l.x = winSize.width / 2;
            l.y = winSize.height - 80;
        }

        var item1 = new MenuItemImage(s_pathB1, s_pathB2, this.backCallback, this);
        var item2 = new MenuItemImage(s_pathR1, s_pathR2, this.restartCallback, this);
        var item3 = new MenuItemImage(s_pathF1, s_pathF2, this.nextCallback, this);

        var menu = new Menu(item1, item2, item3);
        menu.x = 0;
        menu.y = 0;
        item1.x = winSize.width / 2 - 100;
        item1.y = 30;
        item2.x = winSize.width / 2;
        item2.y = 30;
        item3.x = winSize.width / 2 + 100;
        item3.y = 30;

        this.addChild(menu, 1);
    }

}
