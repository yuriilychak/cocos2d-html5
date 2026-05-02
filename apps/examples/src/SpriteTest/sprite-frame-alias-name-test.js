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
// SpriteFrameAliasNameTest
//
//------------------------------------------------------------------
import { SpriteTestDemo } from "./sprite-test-demo";
import { s_grossini_aliases, s_grossini_aliasesPlist } from "../resources";
import { winSize } from "../constants";
import { Animate } from "@aspect/actions";
import { Animation, Sprite, SpriteBatchNode, SpriteFrameCache } from "@aspect/core";
export class SpriteFrameAliasNameTest extends SpriteTestDemo {
    constructor() {
        super();
        this._title = "SpriteFrame Alias Name";
        this._subtitle = "SpriteFrames are obtained using the alias name";
        this.testDuration = 0.5;
        this.pixel = {"0":255, "1":204, "2":153, "3":255};
    }

    onEnter(){
        //----start3----onEnter
        super.onEnter();
        // IMPORTANT:
        // The sprite frames will be cached AND RETAINED, and they won't be released unless you call
        //
        // spriteFrameCache is a cache of SpriteFrames
        // SpriteFrames each contain a texture id and a rect (frame).
        SpriteFrameCache.getInstance().addSpriteFrames(s_grossini_aliasesPlist, s_grossini_aliases);

        //
        // Animation using Sprite batch
        //
        // A SpriteBatchNode can reference one and only one texture (one .png file)
        // Sprites that are contained in that texture can be instantiated as Sprites and then added to the SpriteBatchNode
        // All Sprites added to a SpriteBatchNode are drawn in one OpenGL ES draw call
        // If the Sprites are not added to a SpriteBatchNode then an OpenGL ES draw call will be needed for each one, which is less efficient
        //
        // When you animate a sprite, CCAnimation changes the frame of the sprite using setDisplayFrame: (this is why the animation must be in the same texture)
        // When setDisplayFrame: is used in the CCAnimation it changes the frame to one specified by the SpriteFrames that were added to the animation,
        // but texture id is still the same and so the sprite is still a child of the SpriteBatchNode,
        // and therefore all the animation sprites are also drawn as part of the SpriteBatchNode
        //
        var sprite = new Sprite("#grossini_dance_01.png");
        sprite.x = winSize.width / 2;
        sprite.y = winSize.height / 2;

        var spriteBatch = new SpriteBatchNode(s_grossini_aliases);
        spriteBatch.addChild(sprite);
        this.addChild(spriteBatch);

        var animFrames = [];
        var str = "";
        for (var i = 1; i < 15; i++) {
            // Obtain frames by alias name
            str = "dance_" + (i < 10 ? ("0" + i) : i);
            var frame = SpriteFrameCache.getInstance().getSpriteFrame(str);
            animFrames.push(frame);
        }

        var animation = new Animation(animFrames, 0.3);
        // 14 frames * 1sec = 14 seconds
        sprite.runAction(new Animate(animation).repeatForever());
        this.testSprite = sprite;
        //----end3----
    }
    onExit() {
        super.onExit();
        SpriteFrameCache.getInstance().removeSpriteFramesFromFile(s_grossini_aliasesPlist);
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(winSize.width / 2 - 32, winSize.height / 2 - 10, 5, 5);
        var ret = {"pixel":this.containsPixel(ret1, this.pixel, false) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

}
