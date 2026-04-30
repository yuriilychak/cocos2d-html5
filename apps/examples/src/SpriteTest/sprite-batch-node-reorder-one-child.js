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

export class SpriteBatchNodeReorderOneChild extends SpriteTestDemo {

    constructor() {
        //----start48----ctor
        super();


        this._batchNode = null;


        this._reoderSprite = null;


        this._title = "SpriteBatchNode reorder 1 child";


        this.testDuration = 2.5;


        this.pixel = {"0":0, "1":102, "2":255, "3":255};

        cc.spriteFrameCache.addSpriteFrames(s_ghostsPlist);
        //
        // SpriteBatchNode: 3 levels of children
        //
        var aParent = new cc.SpriteBatchNode(s_ghosts);

        this._batchNode = aParent;
        //[[aParent texture] generateMipmap];
        if ("opengl" in cc.sys.capabilities && cc.rendererConfig.isWebGL)
            aParent.texture.generateMipmap();
        this.addChild(aParent);

        // parent
        var l1 = new cc.Sprite("#father.gif");
        l1.x = winSize.width / 2;
        l1.y = winSize.height / 2;

        aParent.addChild(l1);
        var l1W = l1.width, l1H = l1.height;

        // child left
        var l2a = new cc.Sprite("#sister1.gif");
        l2a.x = -10 + l1W / 2;
        l2a.y = 0 + l1H / 2;

        l1.addChild(l2a, 1);
	    var l2aW = l2a.width, l2aH = l2a.height;

        // child right
        var l2b = new cc.Sprite("#sister2.gif");
        l2b.x = +50 + l1W / 2;
        l2b.y = 0 + l1H / 2;

        l1.addChild(l2b, 2);
        var l2bW = l2b.width, l2bH = l2b.height;

        // child left bottom
        var l3a1 = new cc.Sprite("#child1.gif");
        l3a1.scale = 0.45;
        l3a1.x = 0 + l2aW / 2;
        l3a1.y = -50 + l2aH / 2;
        l2a.addChild(l3a1, 1);

        // child left top
        var l3a2 = new cc.Sprite("#child1.gif");
        l3a2.scale = 0.45;
        l3a2.x = 0 + l2aW / 2;
        l3a2.y = +50 + l2aH / 2;
        l2a.addChild(l3a2, 2);

        this._reoderSprite = l2a;

        // child right bottom
        var l3b1 = new cc.Sprite("#child1.gif");
        l3b1.scale = 0.45;
        l3b1.setFlippedY(true);
        l3b1.x = 0 + l2bW / 2;
        l3b1.y = -50 + l2bH / 2;
        l2b.addChild(l3b1);

        // child right top
        var l3b2 = new cc.Sprite("#child1.gif");
        l3b2.scale = 0.45;
        l3b2.setFlippedY(true);
        l3b2.x = 0 + l2bW / 2;
        l3b2.y = 50 + l2bH / 2;
        l2b.addChild(l3b2);

        this.scheduleOnce(this.reorderSprite, 2.0);
        //----end48----
    }

    reorderSprite(dt) {
        this._reoderSprite.parent.reorderChild(this._reoderSprite, -1);
        this._batchNode.sortAllChildren();
        //cc.Sprite* child;
        //CCARRAY_FOREACH(batchNode.descendants,child) NSLog(@"tag %i",child.tag);
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(winSize.width / 2 - 11, winSize.height / 2 + 33, 3, 3);
        var ret = {"pixel":this.containsPixel(ret1, this.pixel, false) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

}
