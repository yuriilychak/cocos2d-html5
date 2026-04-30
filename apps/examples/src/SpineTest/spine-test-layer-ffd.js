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

import { sp } from "./spine-test-constants.js";
import { SpineTestLayer } from "./spine-test-layer.js";

export class SpineTestLayerFFD extends SpineTestLayer {
    constructor(){
        super(new cc.Color(0,0,0,255), new cc.Color(98,99,117,255));

        var skeletonNode = new sp.SkeletonAnimation("spine/goblins-pro.json", "spine/goblins.atlas", 1.5);
        skeletonNode.setAnimation(0, "walk", true);
        skeletonNode.setSkin("goblin");

        skeletonNode.setScale(0.5);
        var winSize = cc.director.getWinSize();
        skeletonNode.setPosition(winSize.width /2, 20);
        this.addChild(skeletonNode);

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan : function(touch, event){
                if(!skeletonNode.getDebugBonesEnabled())
                    skeletonNode.setDebugBonesEnabled(true);
                else if(skeletonNode.getTimeScale() === 1.0)
                    skeletonNode.setTimeScale(0.3);
                else{
                    skeletonNode.setTimeScale(1);
                    skeletonNode.setDebugBonesEnabled(false);
                }
                return true;
            }
        });
        cc.eventManager.addListener(listener, this);
    }

    title(){
       return "Spine Test";
    }

    subtitle(){
        return "FFD Spine";
    }

}
