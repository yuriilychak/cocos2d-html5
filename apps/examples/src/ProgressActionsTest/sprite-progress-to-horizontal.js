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

export class SpriteProgressToHorizontal extends SpriteDemo {
    onEnter() {
        //----start1----onEnter
        super.onEnter();

        var to1 = sequence(progressTo(2, 100), progressTo(0, 0));
        var to2 = sequence(progressTo(2, 100), progressTo(0, 0));

        var left = new ProgressTimer(new Sprite(s_pathSister1));
        left.type = ProgressTimer.TYPE_BAR;
        //    Setup for a bar starting from the left since the midpoint is 0 for the x
        left.midPoint = new Point(0, 0);
        //    Setup for a horizontal bar since the bar change rate is 0 for y meaning no vertical change
        left.barChangeRate = new Point(1, 0);
        this.addChild(left);
        left.x = 200;
        left.y = winSize.height / 2;
        left.runAction(to1.repeatForever());

        var right = new ProgressTimer(new Sprite(s_pathSister2));
        right.type = ProgressTimer.TYPE_BAR;
        //    Setup for a bar starting from the left since the midpoint is 1 for the x
        right.midPoint = new Point(1, 0);
        //    Setup for a horizontal bar since the bar change rate is 0 for y meaning no vertical change
        right.barChangeRate = new Point(1, 0);
        this.addChild(right);
        right.x = winSize.width - 200;
        right.y = winSize.height / 2;
        right.runAction(to2.repeatForever());
        //----end1----
    }
    title() {
        return "ProgressTo Horizontal";
    }

}
