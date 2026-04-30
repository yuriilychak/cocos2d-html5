/****************************************************************************
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

export class UIFocusTestBase extends UIMainLayer {
    constructor() {
        super();
        this._dpadMenu = null;
        this._firstFocusedWidget = null;
        this._eventListener = null;
        this._btn = null;
    }


    init(){
        if (super.init()) {
            var root = this._mainNode.getChildByTag(81);
            var background = root.getChildByName("background_Panel");
            background.removeFromParent(true);

            this._dpadMenu = new Menu();

            MenuItemFont.setFontSize(20);
            var winSize = director.getVisibleSize();
            var leftItem = new MenuItemFont("Left", this.onLeftKeyPressed, this);
            leftItem.setPosition(winSize.width - 100, winSize.height/2);
            this._dpadMenu.addChild(leftItem);

            var rightItem = new MenuItemFont("Right", this.onRightKeyPressed, this);
            rightItem.setPosition(winSize.width - 30, winSize.height/2);
            this._dpadMenu.addChild(rightItem);

            var upItem = new MenuItemFont("Up", this.onUpKeyPressed, this);
            upItem.setPosition(winSize.width - 60, winSize.height/2 + 50);
            this._dpadMenu.addChild(upItem);

            var downItem = new MenuItemFont("Down", this.onDownKeyPressed, this);
            downItem.setPosition(winSize.width - 60, winSize.height/2 - 50);
            this._dpadMenu.addChild(downItem);

            this._dpadMenu.setPosition(0, 0);
            this.addChild(this._dpadMenu);

            this._btn = new ccui.Button("ccs-res/cocosui/switch-mask.png");
            this._btn.setTitleText("Toggle Loop");
            this._btn.setPosition(60, winSize.height - 50);
            this._btn.setTitleColor(Color.RED);
            this._btn.addTouchEventListener(this.toggleFocusLoop,this);
            this._btn.setFocusEnabled(false);
            this.addChild(this._btn);

            //call this method to enable Dpad focus navigation
            ccui.Widget.enableDpadNavigation(true);

            this._eventListener = EventListener.create({
                event: EventListener.FOCUS,                            //TODO Need add focus event in JSB
                onFocusChanged: this.onFocusChanged.bind(this)
            });
            eventManager.addListener(this._eventListener, 1);
            return true;
        }
        return false;
    }

    onLeftKeyPressed(){
        var event = new EventKeyboard(KEY.dpadLeft, false);
        eventManager.dispatchEvent(event);
    }
    onRightKeyPressed(){
        var event = new EventKeyboard(KEY.dpadRight, false);
        eventManager.dispatchEvent(event);
    }
    onUpKeyPressed(){
        var event = new EventKeyboard(KEY.dpadUp, false);
        eventManager.dispatchEvent(event);
    }
    onDownKeyPressed(){
        var event = new EventKeyboard(KEY.dpadDown, false);
        eventManager.dispatchEvent(event);
    }
    onFocusChanged(widgetLostFocus, widgetGetFocus){
        if (widgetGetFocus && widgetGetFocus.isFocusEnabled())
            widgetGetFocus.setColor(Color.RED);

        if (widgetLostFocus && widgetLostFocus.isFocusEnabled())
            widgetLostFocus.setColor(Color.WHITE);

        if (widgetLostFocus && widgetGetFocus)
            log("on focus change, %d widget get focus, %d widget lose focus", widgetGetFocus.getTag(),  widgetLostFocus.getTag());
    }

    onImageViewClicked(widget, touchType){
        if (touchType == ccui.Widget.TOUCH_ENDED) {
            if (widget.isFocusEnabled()) {
                widget.setFocusEnabled(false);
                widget.setColor(Color.YELLOW);
            }else{
                widget.setFocusEnabled(true);
                widget.setColor(Color.WHITE);
            }
        }
    }
    onExit() {
        eventManager.removeListener(this._eventListener);
        super.onExit();
    }

}
