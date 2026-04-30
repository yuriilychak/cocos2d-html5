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

import { SpriteTestDemo } from "./sprite-test-demo.js";
import { s_piece } from "../tests_resources.js";

export class NodeSort extends SpriteTestDemo {


    constructor() {
        //----start49----ctor
        super();



        this._node = null;



        this._sprite1 = null;



        this._sprite2 = null;



        this._sprite3 = null;



        this._sprite4 = null;



        this._sprite5 = null;



        this._title = "node sort same index";



        this._subtitle = "tag order in console should be 2,1,3,4,5";



        this.testDuration = 1;



        this.testOrders = [];
        this._node = new cc.Node();
        this.addChild(this._node, 0, 0);

        this._sprite1 = new cc.Sprite(s_piece, new cc.Rect(128, 0, 64, 64));
        this._sprite1.x = 100;
        this._sprite1.y = 160;
        this._node.addChild(this._sprite1, -6, 1);

        this._sprite2 = new cc.Sprite(s_piece, new cc.Rect(128, 0, 64, 64));
        this._sprite2.x = 164;
        this._sprite2.y = 160;
        this._node.addChild(this._sprite2, -6, 2);

        this._sprite4 = new cc.Sprite(s_piece, new cc.Rect(128, 0, 64, 64));
        this._sprite4.x = 292;
        this._sprite4.y = 160;
        this._node.addChild(this._sprite4, -3, 4);

        this._sprite3 = new cc.Sprite(s_piece, new cc.Rect(128, 0, 64, 64));
        this._sprite3.x = 228;
        this._sprite3.y = 160;
        this._node.addChild(this._sprite3, -4, 3);

        this._sprite5 = new cc.Sprite(s_piece, new cc.Rect(128, 0, 64, 64));
        this._sprite5.x = 356;
        this._sprite5.y = 160;
        this._node.addChild(this._sprite5, -3, 5);

        this.schedule(this.reorderSprite);
        //----end49----
    }

    reorderSprite(dt) {
        //----start49----reorderSprite
        this.unschedule(this.reorderSprite);

        cc.log("Before reorder--");

        var i = 0;
        var child;
        var nodeChildren = this._node.children;
        for (i = 0; i < nodeChildren.length; i++) {
            child = nodeChildren[i];
            cc.log("tag:" + child.tag + "  z: " + child.zIndex);
        }

        //z-4
        this._node.reorderChild(this._node.children[0], -6);
        this._node.sortAllChildren();

        cc.log("After reorder--");
        nodeChildren = this._node.children;
        for (i = 0; i < nodeChildren.length; i++) {
            child = nodeChildren[i];
            cc.log("tag:" + child.tag + "  z: " +
                child.zIndex);
            this.testOrders.push(child.tag);
        }
        //----end49----
    }
    //
    // Automation
    //
    getExpectedResult() {
        return JSON.stringify([2, 1, 3, 4, 5]);
    }
    getCurrentResult() {
        return JSON.stringify(this.testOrders);
    }

}
