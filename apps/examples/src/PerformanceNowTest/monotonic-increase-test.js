/****************************************************************************
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

export class MonotonicIncreaseTest extends PerformanceNowBaseLayer {
    constructor() {
        super();
        if (performance && typeof performance.now !== 'function') {
             var errLabel = new cc.LabelTTF("On browser that does not support performance.now");
            this.addChild(errLabel);   
            errLabel.attr({
                x: cc.winSize.width/2,
                y: cc.winSize.height/2
            });          
            return;
        }


        var performanceValues = [];
        for (var i = 0; i < 20; ++i) {
            performanceValues.push(performance.now().toFixed(3));
        }

        var monotonicIncrease = false;
        for (var i = 1; i < performanceValues.length; ++i) {
            monotonicIncrease = performanceValues[i] >= performanceValues[i - 1];
        }

        var label = new cc.LabelTTF("Result that values are montonically increasing : " + monotonicIncrease);
        label.attr({
            x: cc.winSize.width/2,
            y: cc.winSize.height/2 + 50
        });
        this.addChild(label);

        var values = new cc.LabelTTF("Result Values : " + JSON.stringify(performanceValues));
        values.attr({
            x: cc.winSize.width/2,
            y: (cc.winSize.height/2) - 50
        });
        values.setDimensions(cc.winSize.width/2, 100);
        this.addChild(values);

    }

    title() {
        return "Testing monotonic increase of performance.now";
    }

    subtitle() {
        return "Listed values should all be increasing";
    }

}
