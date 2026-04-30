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
// SpriteEaseBezier action
//
export class SpriteEaseBezierTest extends EaseSpriteDemo {

    onEnter(){
        super.onEnter();
        //----start14----onEnter

        var size = director.getWinSize();

        //
        // startPosition can be any coordinate, but since the movement
        // is relative to the Bezier curve, make it (0,0)
        //

        this._grossini.setPosition( new cc.Point(size.width/2, size.height/2));
        this._tamara.setPosition( new cc.Point(size.width/4, size.height/2));
        this._kathia.setPosition( new cc.Point(3 * size.width/4, size.height/2));

        // sprite 1
        var bezier = [
            new cc.Point(0, size.height / 2),
            new cc.Point(300 / 480 * 800, -size.height / 2),
            new cc.Point(300 / 480 * 800, 100 / 320 * 450)
        ];
        var bezierForward = new cc.BezierBy(3, bezier);
        var bezierEaseForward = bezierForward.easing(cc.easeBezierAction(0.5, 0.5, 1.0, 1.0));

        var bezierEaseBack = bezierEaseForward.reverse();
        var bezierEaseTo = cc.sequence(bezierEaseForward, bezierEaseBack).repeatForever();

        // sprite 2
        this._tamara.setPosition(new cc.Point(135,225));
        var bezier2 = [
            new cc.Point(100 / 480 * 800, size.height / 2),
            new cc.Point(200 / 480 * 800, -size.height / 2),
            new cc.Point(200 / 480 * 800, 160 / 320 * 450)
        ];
        var bezierTo1 = new cc.BezierTo(2, bezier2);
        var bezierEaseTo1 = bezierTo1.easing(cc.easeBezierAction(0.5, 0.5, 1.0, 1.0));

        // sprite 3
        this._kathia.setPosition(new cc.Point(667, 225));
        var bezierTo2 = new cc.BezierTo(2, bezier2);
        var bezierEaseTo2 = bezierTo2.easing(cc.easeBezierAction(0.0, 0.5, -5.0, 1.0));


        this._grossini.runAction(bezierEaseTo);
        this._tamara.runAction(bezierEaseTo1);
        this._kathia.runAction(bezierEaseTo2);

        //----end14----
    }
    title(){
        return "SpriteEaseBezier action";
    }

}
