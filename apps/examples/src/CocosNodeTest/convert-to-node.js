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

//
// ConvertToNode
//
import { TestNodeDemo } from "./test-node-demo";
import { s_pathGrossini, s_pathR1 } from "../resources";
import { winSize } from "../constants";

export class ConvertToNode extends TestNodeDemo {
    constructor() {
        //----start9----ctor
        super();

        this.testDuration = 1;

        this.testP1 = [];

        this.expectedP1 = [];

        this.testP2 = [];

        this.expectedP2 = [];
        if ('touches' in cc.sys.capabilities){
            cc.eventManager.addListener(cc.EventListener.create({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesEnded:function (touches, event) {
                    var target = event.getCurrentTarget();
                    for (var it = 0; it < touches.length; it++) {
                        var touch = touches[it];
                        var location = touch.getLocation();
                        target.processEvent(location);
                    }
                }
            }), this);
        } else if ('mouse' in cc.sys.capabilities)
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseUp: function(event){
                    event.getCurrentTarget().processEvent(event.getLocation());
                }
            }, this);

        var rotate = new cc.RotateBy(10, 360);
        var action = rotate.repeatForever();
        for (var i = 0; i < 3; i++) {
            var sprite = new cc.Sprite(s_pathGrossini);
            sprite.x = winSize.width / 4 * (i + 1);
            sprite.y = winSize.height / 2;
            var point = new cc.Sprite(s_pathR1);
            point.scale = 0.25;
	        point.x = sprite.x;
	        point.y = sprite.y;
            this.addChild(point, 10, 100 + i);

            switch (i) {
                case 0:
                    sprite.anchorX = 0;
                    sprite.anchorY = 0;
                    break;
                case 1:
                    sprite.anchorX = 0.5;
                    sprite.anchorY = 0.5;
                    break;
                case 2:
                    sprite.anchorX = 1;
                    sprite.anchorY = 1;
                    break;
            }

            point.x = sprite.x;
	        point.y = sprite.y;

            var copy = action.clone();
            sprite.runAction(copy);
            this.addChild(sprite, i);
        }
        //----end9----
    }
    processEvent(location) {
        //----start9----processEvent
        this.testP1 = [];
        this.testP2 = [];
        for (var i = 0; i < 3; i++) {
            var node = this.getChildByTag(100 + i);

            var p1 = node.convertToNodeSpaceAR(location);
            var p2 = node.convertToNodeSpace(location);

            cc.log("AR: x=" + p1.x.toFixed(2) + ", y=" + p1.y.toFixed(2) + " -- Not AR: x=" + p2.x.toFixed(2) + ", y=" + p2.y.toFixed(2));

            this.testP1.push({"x":p1.x, "y":p1.y});
            this.testP2.push({"x":p2.x, "y":p2.y});
        }
        //----end9----
    }

    title() {
        return "Convert To Node Space";
    }
    subtitle() {
        return "testing convertToNodeSpace / AR. Touch and see console";
    }
    //
    // Automation
    //
    setupAutomation() {
        this.expectedP1.push({"x":-winSize.width, "y":-winSize.height * 2});
        this.expectedP1.push({"x":-winSize.width * 2, "y":-winSize.height * 2});
        this.expectedP1.push({"x":-winSize.width * 3, "y":-winSize.height * 2});

        this.expectedP2.push({"x":-winSize.width + 24.5, "y":-winSize.height * 2 + 23.5});
        this.expectedP2.push({"x":-winSize.width * 2 + 24.5, "y":-winSize.height * 2 + 23.5});
        this.expectedP2.push({"x":-winSize.width * 3 + 24.5, "y":-winSize.height * 2 + 23.5});
    }
    getExpectedResult() {
        return JSON.stringify({"p1":this.expectedP1, "p2":this.expectedP2});
    }
    getCurrentResult() {
        this.processEvent(new cc.Point(0, 0));
        var ret = {"p1":this.testP1, "p2":this.testP2};
        return JSON.stringify(ret);
    }

}
