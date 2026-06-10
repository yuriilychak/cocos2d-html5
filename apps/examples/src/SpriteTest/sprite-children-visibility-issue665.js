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
// SpriteChildrenVisibilityIssue665
//
//------------------------------------------------------------------
import { SpriteTestDemo } from "./sprite-test-demo";
import { s_grossini, s_grossiniPlist } from "../resources";
import { winSize } from "../constants";
import { Node, Sprite, SpriteBatchNode, ServiceLocator } from "@aspect/core";

export class SpriteChildrenVisibilityIssue665 extends SpriteTestDemo {


    constructor() {
        //----start32----ctor
        super();



        this._title = "Sprite & SpriteBatchNode Visibility";



        this._subtitle = "No sprites should be visible";



        this.testDuration = 1;



        this.pixel = {"0":0, "1":0, "2":0, "3":255};
        ServiceLocator.spriteFrameCache.addSpriteFrames(s_grossiniPlist);
        //
        // SpriteBatchNode
        //
        // parents
        var aParent = new SpriteBatchNode(s_grossini, 50);
        aParent.x = winSize.width / 3;
        aParent.y = winSize.height / 2;
        this.addChild(aParent, 0);

        var sprite1 = new Sprite(ServiceLocator.spriteFrameCache.getSpriteFrame("grossini_dance_01.png"));
        sprite1.x = 0;
        sprite1.y = 0;

        var sprite2 = new Sprite(ServiceLocator.spriteFrameCache.getSpriteFrame("grossini_dance_02.png"));
        sprite2.x = 20;
        sprite2.y = 30;

        var sprite3 = new Sprite(ServiceLocator.spriteFrameCache.getSpriteFrame("grossini_dance_03.png"));
        sprite3.x = -20;
        sprite3.y = 30;

        // test issue #665
        sprite1.visible = false;

        aParent.addChild(sprite1);
        sprite1.addChild(sprite2, -2);
        sprite1.addChild(sprite3, 2);

        //
        // Sprite
        //
        aParent = new Node();
        aParent.x = 2 * winSize.width / 3;
        aParent.y = winSize.height / 2;
        this.addChild(aParent, 0);

        sprite1 = new Sprite(ServiceLocator.spriteFrameCache.getSpriteFrame("grossini_dance_01.png"));
        sprite1.x = 0;
        sprite1.y = 0;

        sprite2 = new Sprite(ServiceLocator.spriteFrameCache.getSpriteFrame("grossini_dance_02.png"));
        sprite2.x = 20;
        sprite2.y = 30;

        sprite3 = new Sprite(ServiceLocator.spriteFrameCache.getSpriteFrame("grossini_dance_03.png"));
        sprite3.x = -20;
        sprite3.y = 30;

        // test issue #665
        sprite1.visible = false;

        aParent.addChild(sprite1);
        sprite1.addChild(sprite2, -2);
        sprite1.addChild(sprite3, 2);
        //----end32----
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"visible1":"false", "visible2":"false"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(winSize.width / 3, winSize.height / 2 + 38, 5, 5);
        var ret2 = this.readPixels(2 * winSize.width / 3, winSize.height / 2 + 38, 5, 5);
        var ret = {"visible1":this.containsPixel(ret1, this.pixel) ? "false" : "true", "visible2":this.containsPixel(ret2, this.pixel) ? "false" : "true"};
        return JSON.stringify(ret);
    }

}
