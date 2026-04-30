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

export class EaseSpriteDemo extends BaseTestLayer {

    constructor() {
        super(new Color(0, 0, 0, 255), new Color(98, 99, 117, 255));


        this._grossini = null;


        this._tamara = null;


        this._kathia = null;


        this._title = null;


        this.testDuration = 2.05;
    }

    title() {
        return "No title";
    }
    onEnter() {
        super.onEnter();

        // Or you can create an sprite using a filename. PNG and BMP files are supported. Probably TIFF too
        this._grossini = new Sprite(s_pathGrossini);
        this._tamara = new Sprite(s_pathSister1);
        this._kathia = new Sprite(s_pathSister2);

        this.addChild(this._grossini, 3);
        this.addChild(this._kathia, 2);
        this.addChild(this._tamara, 1);

        this._grossini.x = 60;

        this._grossini.y = winSize.height / 5;
        this._kathia.x = 60;
        this._kathia.y = winSize.height / 2;
        this._tamara.x = 60;
        this._tamara.y = winSize.height * 4 / 5;

        this.twoSprites = false;
    }

    onRestartCallback(sender) {
        var s = new EaseActionsTestScene();
        s.addChild(restartEaseActionsTest());
        director.runScene(s);
    }
    onNextCallback(sender) {
        var s = new EaseActionsTestScene();
        s.addChild(nextEaseActionsTest());
        director.runScene(s);
    }
    onBackCallback(sender) {
        var s = new EaseActionsTestScene();
        s.addChild(previousEaseActionsTest());
        director.runScene(s);
    }
    positionForTwo() {
        this.twoSprites = true;
        this._grossini.x = 60;
	    this._grossini.y = winSize.height / 5;
        this._tamara.x = 60;
	    this._tamara.y = winSize.height * 4 / 5;
        this._kathia.visible = false;
    }

    //
    // Automation
    //
    numberOfPendingTests() {
        return ( (arrayOfEaseActionsTest.length-1) - easeActionsTestIdx );
    }

    getTestNumber() {
        return easeActionsTestIdx;
    }

    // default values for automation
    getExpectedResult() {
        var ret;
        var w = 60 + winSize.width - 80;
        if( this.twoSprites )
            ret = [w, w];
        else
            ret = [w, w, w];
        return JSON.stringify(ret);
    }

    getCurrentResult() {
        var ret;
        if( this.twoSprites)
            ret = [ this._grossini.x, this._tamara.x];
        else
            ret = [ this._grossini.x, this._tamara.x, this._kathia.x ];
        return JSON.stringify(ret);
    }


}
