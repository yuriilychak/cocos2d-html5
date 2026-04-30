/****************************************************************************
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

//2015-01-14
export class UISliderNormalDefaultTest extends UIMainLayer {
    init() {
        if (super.init()) {
            var widgetSize = this._widget.getContentSize();

            this._bottomDisplayLabel.setString("");

            // Add the alert
            var alert = new ccui.Text("when pressed, the slider ball should scale","Marker Felt",20);
            alert.setColor(new cc.Color(159, 168, 176));
            alert.setPosition(new cc.Point(widgetSize.width / 2, widgetSize.height / 2 - alert.height * 3.75));
            this._mainNode.addChild(alert);

            // Create the slider
            var slider = new ccui.Slider();
            slider.loadBarTexture("ccs-res/cocosui/sliderTrack.png");
            slider.loadSlidBallTextures("ccs-res/cocosui/sliderThumb.png");
            slider.setPosition(new cc.Point(widgetSize.width / 2, widgetSize.height / 2 + 50));
            this._mainNode.addChild(slider);

            var sliderScale9 = new ccui.Slider("ccs-res/cocosui/sliderTrack2.png", "ccs-res/cocosui/sliderThumb.png");
            sliderScale9.setScale9Enabled(true);
            sliderScale9.setCapInsets(new cc.Rect(0, 0, 0, 0));
            sliderScale9.setZoomScale(1);
            sliderScale9.setContentSize(new cc.Size(250, 19));
            sliderScale9.setPosition(new cc.Point(widgetSize.width / 2, widgetSize.height / 2 - 20));
            this._mainNode.addChild(sliderScale9);


            return true;
        }
        return false;
    }

}
