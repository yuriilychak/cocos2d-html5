/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 Copyright (c) 2008-2009 Jason Booth

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

export class Issue1358 extends MotionStreakTest {
    constructor() {
        super();
        this._center = null;
        this._radius = 0;
        this._angle = 0;
    }

    title() {
        return "Issue 1358";
    }

    subtitle() {
        return "The tail should use the texture";
    }

    onEnter() {
        super.onEnter();

        // ask director the the window size
        var size = cc.director.getWinSize();
        this._streak = new cc.MotionStreak(2.0, 1.0, 50.0, new cc.Color(255, 255, 0), s_image_icon);
        this.addChild(this._streak);

        this._center = new cc.Point(size.width / 2, size.height / 2);
        this._radius = size.width / 3;
        this._angle = 0.0;
        this.schedule(this.update, 0);
    }

    update(dt) {
        this._angle += 1.0;
        this._streak.x = this._center.x + Math.cos(this._angle / 180 * Math.PI) * this._radius;
        this._streak.y = this._center.y + Math.sin(this._angle / 180 * Math.PI) * this._radius;
    }

}
