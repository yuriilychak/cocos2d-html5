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
// RemoveTest
//
//------------------------------------------------------------------
export class RemoveTest extends ActionManagerTest {
    constructor() {
        super();
        this.testDuration = 3.5;
    }

    title() {
        return "Stop Action Test";
    }
    onEnter() {
        //----start3----onEnter
        super.onEnter();

        var s = director.getWinSize();
        var l = new cc.LabelTTF("Should not crash", "Thonburi", 16);
        this.addChild(l);
        l.x = s.width / 2;
	    l.y = 245;

        var move = new cc.MoveBy(2, new cc.Point(200, 0));
        var callback = new cc.CallFunc(this.stopAction, this);
        var sequence = cc.sequence(move, callback);
        sequence.tag = TAG_SEQUENCE;

        var child = new cc.Sprite(s_pathGrossini);
        child.x = 200;
	    child.y = 200;

        this.addChild(child, 1, TAG_GROSSINI);
        child.runAction(sequence);
        //----end3----
    }

    stopAction() {
        //----start3----onEnter
        var sprite = this.getChildByTag(TAG_GROSSINI);
        sprite.stopActionByTag(TAG_SEQUENCE);
        //----end3----
    }

    //
    // Automation
    //
    getExpectedResult() {
        return NOT_CRASHED_CONST;
    }
    getCurrentResult() {
        return NOT_CRASHED_CONST;
    }

}
