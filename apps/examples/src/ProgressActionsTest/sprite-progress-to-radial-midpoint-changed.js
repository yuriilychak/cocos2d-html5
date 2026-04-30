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

export class SpriteProgressToRadialMidpointChanged extends SpriteDemo {
    onEnter() {
        //----start3----onEnter
        super.onEnter();

        var action = cc.sequence(cc.progressTo(2, 100), cc.progressTo(0, 0));

        /**
         *  Our image on the left should be a radial progress indicator, clockwise
         */
        var left = new cc.ProgressTimer(new cc.Sprite(s_pathBlock));
        left.type = cc.ProgressTimer.TYPE_RADIAL;
        this.addChild(left);
        left.midPoint = new cc.Point(0.25, 0.75);
        left.x = 200;
        left.y = winSize.height / 2;
        left.runAction(action.clone().repeatForever());

        /**
         *  Our image on the left should be a radial progress indicator, counter clockwise
         */
        var right = new cc.ProgressTimer(new cc.Sprite(s_pathBlock));
        right.type = cc.ProgressTimer.TYPE_RADIAL;
        right.midPoint = new cc.Point(0.75, 0.25);
        /**
         *  Note the reverse property (default=NO) is only added to the right image. That's how
         *  we get a counter clockwise progress.
         */
        this.addChild(right);
        right.x = winSize.width - 200;
        right.y = winSize.height / 2;
        right.runAction(action.clone().repeatForever());
        //----end3----
    }

    title() {
        return "Radial w/ Different Midpoints";
    }

}
