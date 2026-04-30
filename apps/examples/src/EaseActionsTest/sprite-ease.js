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
// SpriteEase
//
//------------------------------------------------------------------
export class SpriteEase extends EaseSpriteDemo {
    constructor() {
        super();
        this.testDuration = 4.2;
    }


    onEnter() {
        //----start0----onEnter
        super.onEnter();

        var move = new MoveBy(2, new Point(winSize.width - 80, 0));
        var move_back = move.reverse();


        var move_ease_in = move.clone().easing(easeIn(2.0));
        var move_ease_in_back = move_ease_in.reverse();

        var move_ease_out = move.clone().easing(easeOut(2.0));
        var move_ease_out_back = move_ease_out.reverse();


        var delay = new DelayTime(0.10);

        var seq1 = sequence(move, delay, move_back, delay.clone());
        var seq2 = sequence(move_ease_in, delay.clone(), move_ease_in_back, delay.clone());
        var seq3 = sequence(move_ease_out, delay.clone(), move_ease_out_back, delay.clone());


        var a2 = this._grossini.runAction(seq1.repeatForever());
        a2.tag = 1;

        var a1 = this._tamara.runAction(seq2.repeatForever());
        a1.tag = 1;

        var a = this._kathia.runAction(seq3.repeatForever());
        a.tag = 1;

        this.scheduleOnce(this.testStopAction, 4.1);
        //----end0----
    }
    title() {
        return "EaseIn - EaseOut - Stop";
    }

    testStopAction(dt) {
        this._tamara.stopActionByTag(1);
        this._kathia.stopActionByTag(1);
        this._grossini.stopActionByTag(1);
    }

    //
    // Automation
    //
    getExpectedResult() {
        var ret = [60,60,60];
        return JSON.stringify(ret);
    }

    getCurrentResult() {
        var ret = [ this._grossini.x, this._tamara.x, this._kathia.x ];
        return JSON.stringify(ret);
    }


}
