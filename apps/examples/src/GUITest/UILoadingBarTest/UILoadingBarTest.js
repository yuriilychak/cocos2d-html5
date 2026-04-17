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

var UILoadingBarTest = class UILoadingBarTest extends UIMainLayer {
    constructor() {
        super();

        this._count = 0;

        this._loadingBar = null;
        this._count = 0;
    }
    init() {
        if (super.init()) {
            var widgetSize = this._widget.getContentSize();
            //init text
            this._topDisplayLabel.setString("");
            this._bottomDisplayLabel.setString("LoadingBar");

            this.createLoadingBar();

            this.scheduleUpdate();
            return true;
        }
        return false;
    }
    createLoadingBar() {
        // override me
    }
    update(dt) {
        this._count++;
        if (this._count > 100) {
            this._count = 0;
        }

        this._loadingBar && this._loadingBar.setPercent(this._count);
    }

    previousCallback(sender, type) {
        this.unscheduleUpdate();
        super.previousCallback(sender, type)
    }

    restartCallback(sender, type) {
        this.unscheduleUpdate();
        super.restartCallback(sender, type)
    }

    nextCallback(sender, type) {
        this.unscheduleUpdate();
        super.nextCallback(sender, type)
    }

};

var UILoadingBarTest_Left = class UILoadingBarTest_Left extends UILoadingBarTest {
    createLoadingBar() {
        var widgetSize = this._widget.getContentSize();
        var loadingBar = new ccui.LoadingBar();
        loadingBar.setName("LoadingBar");
        loadingBar.loadTexture("ccs-res/cocosui/sliderProgress.png");
        loadingBar.setPercent(0);
        loadingBar.x = widgetSize.width / 2;
        loadingBar.y = widgetSize.height / 2 + loadingBar.height / 4;
        this._mainNode.addChild(loadingBar);
        this._loadingBar = loadingBar;
    }

};

var UILoadingBarTest_Right = class UILoadingBarTest_Right extends UILoadingBarTest {
    createLoadingBar() {
        var widgetSize = this._widget.getContentSize();
        var loadingBar = new ccui.LoadingBar();
        loadingBar.setName("LoadingBar");
        loadingBar.loadTexture("ccs-res/cocosui/sliderProgress.png");
        loadingBar.setDirection(ccui.LoadingBar.TYPE_RIGHT);
        loadingBar.setPercent(0);
        loadingBar.x = widgetSize.width / 2;
        loadingBar.y = widgetSize.height / 2 + loadingBar.height / 4;
        this._mainNode.addChild(loadingBar);
        this._loadingBar = loadingBar;
    }

};

var UILoadingBarTest_Fix = class UILoadingBarTest_Fix extends UILoadingBarTest {
    createLoadingBar() {
        var widgetSize = this._widget.getContentSize();
        var loadingBar = new ccui.LoadingBar();
        loadingBar.setName("LoadingBar");
        loadingBar.loadTexture("ccs-res/cocosui/sliderProgress.png");
        loadingBar.setDirection(ccui.LoadingBar.TYPE_RIGHT);
        loadingBar.setPercent(40);
        loadingBar.x = widgetSize.width / 2;
        loadingBar.y = widgetSize.height / 2 + loadingBar.height / 4;
        this._mainNode.addChild(loadingBar);
        this._loadingBar = null;
    }

};

var UILoadingBarTest_Left_Scale9 = class UILoadingBarTest_Left_Scale9 extends UILoadingBarTest {
    createLoadingBar() {
        var widgetSize = this._widget.getContentSize();
        var loadingBar = new ccui.LoadingBar();
        loadingBar.setName("LoadingBar");
        loadingBar.setScale9Enabled(true);
        loadingBar.loadTexture("ccs-res/cocosui/slider_bar_active_9patch.png");
        loadingBar.setCapInsets(cc.rect(0, 0, 0, 0));
        loadingBar.setContentSize(cc.size(300, 30));
        loadingBar.setPercent(0);
        loadingBar.x = widgetSize.width / 2;
        loadingBar.y = widgetSize.height / 2 + loadingBar.height / 4;
        this._mainNode.addChild(loadingBar);
        this._loadingBar = loadingBar;
    }

};

var UILoadingBarTest_Right_Scale9 = class UILoadingBarTest_Right_Scale9 extends UILoadingBarTest {
    createLoadingBar() {
        var widgetSize = this._widget.getContentSize();
        var loadingBar = new ccui.LoadingBar();
        loadingBar.setName("LoadingBar");
        loadingBar.setScale9Enabled(true);
        loadingBar.loadTexture("ccs-res/cocosui/slider_bar_active_9patch.png");
        loadingBar.setCapInsets(cc.rect(0, 0, 0, 0));
        loadingBar.setContentSize(cc.size(300, 30));
        loadingBar.setDirection(ccui.LoadingBar.TYPE_RIGHT);
        loadingBar.setPercent(0);
        loadingBar.x = widgetSize.width / 2;
        loadingBar.y = widgetSize.height / 2 + loadingBar.height / 4;
        this._mainNode.addChild(loadingBar);
        this._loadingBar = loadingBar;
    }

};

var UILoadingBarTest_Fix_Scale9 = class UILoadingBarTest_Fix_Scale9 extends UILoadingBarTest {
    createLoadingBar() {
        var widgetSize = this._widget.getContentSize();
        var loadingBar = new ccui.LoadingBar();
        loadingBar.setName("LoadingBar");
        loadingBar.setScale9Enabled(true);
        loadingBar.loadTexture("ccs-res/cocosui/slider_bar_active_9patch.png");
        loadingBar.setPercent(40);
        loadingBar.setCapInsets(cc.rect(0, 0, 0, 0));
        loadingBar.setContentSize(cc.size(300, 30));
        loadingBar.setDirection(ccui.LoadingBar.TYPE_RIGHT);
        loadingBar.x = widgetSize.width / 2;
        loadingBar.y = widgetSize.height / 2 + loadingBar.height / 4;
        this._mainNode.addChild(loadingBar);
        this._loadingBar = null;
    }

};