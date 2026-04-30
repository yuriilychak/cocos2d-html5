/****************************************************************************
 Copyright (c) 2010-2013 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2012 Pierre-David Bélanger
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

export class BaseClippingNodeTest extends BaseTestLayer {

    constructor() {
        super(new Color(0,0,0,255), new Color(98,99,117,255));


        this._title = "";


        this._subtitle = "";
        this.setup();
    }

    onRestartCallback(sender) {
        var s = new ClippingNodeTestScene();
        s.addChild(restartClippingNodeTest());
        director.runScene(s);
    }
    onNextCallback(sender) {
        var s = new ClippingNodeTestScene();
        s.addChild(nextClippingNodeTest());
        director.runScene(s);
    }
    onBackCallback(sender) {
        var s = new ClippingNodeTestScene();
        s.addChild(previousClippingNodeTest());
        director.runScene(s);
    }
    // automation
    numberOfPendingTests() {
        return ( (arrayOfClippingNodeTest.length-1) - clippingNodeTestSceneIdx );
    }

    getTestNumber() {
        return clippingNodeTestSceneIdx;
    }


}
