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

export class ControlButtonTest_Event extends ControlScene {
    constructor() {
        super();
        this._displayValueLabel = null;
    }


    init() {
        if (super.init()) {
            var screenSize = cc.director.getWinSize();

            // Add the button
            var backgroundButton = new cc.Scale9Sprite(s_extensions_button);
            var backgroundHighlightedButton = new cc.Scale9Sprite(s_extensions_buttonHighlighted);

            // Add a label in which the button events will be displayed
            this.setDisplayValueLabel(new cc.LabelTTF("No Event", "Marker Felt", 32));
            this._displayValueLabel.anchorX = 0.5;
            this._displayValueLabel.anchorY = -1;
            this._displayValueLabel.x = screenSize.width / 2.0;
            this._displayValueLabel.y = screenSize.height / 2.0;
            this.addChild(this._displayValueLabel, 10);

            var titleButton = new cc.LabelTTF("Touch Me!", "Marker Felt", 30);
            titleButton.color = new cc.Color(159, 168, 176);

            var controlButton = new cc.ControlButton(titleButton, backgroundButton);
            controlButton.setBackgroundSpriteForState(backgroundHighlightedButton, cc.CONTROL_STATE_HIGHLIGHTED);
            controlButton.setTitleColorForState(cc.Color.WHITE, cc.CONTROL_STATE_HIGHLIGHTED);

            controlButton.anchorX = 0.5;
            controlButton.anchorY = 1;
            controlButton.x = screenSize.width / 2.0;
            controlButton.y = screenSize.height / 2.0;
            this.addChild(controlButton, 1);

            // Add the black background
            var background = new cc.Scale9Sprite(s_extensions_buttonBackground);
            background.width = 300;
            background.height = 170;
            background.x = screenSize.width / 2.0;
            background.y = screenSize.height / 2.0;
            this.addChild(background);

            // Sets up event handlers
            controlButton.addTargetWithActionForControlEvents(this, this.touchDownAction, cc.CONTROL_EVENT_TOUCH_DOWN);
            controlButton.addTargetWithActionForControlEvents(this, this.touchDragInsideAction, cc.CONTROL_EVENT_TOUCH_DRAG_INSIDE);
            controlButton.addTargetWithActionForControlEvents(this, this.touchDragOutsideAction, cc.CONTROL_EVENT_TOUCH_DRAG_OUTSIDE);
            controlButton.addTargetWithActionForControlEvents(this, this.touchDragEnterAction, cc.CONTROL_EVENT_TOUCH_DRAG_ENTER);
            controlButton.addTargetWithActionForControlEvents(this, this.touchDragExitAction, cc.CONTROL_EVENT_TOUCH_DRAG_EXIT);
            controlButton.addTargetWithActionForControlEvents(this, this.touchUpInsideAction, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
            controlButton.addTargetWithActionForControlEvents(this, this.touchUpOutsideAction, cc.CONTROL_EVENT_TOUCH_UP_OUTSIDE);
            controlButton.addTargetWithActionForControlEvents(this, this.touchCancelAction, cc.CONTROL_EVENT_TOUCH_CANCEL);
            return true;
        }
        return false;
    }

    getDisplayValueLabel() {
        return this._displayValueLabel;
    }
    setDisplayValueLabel(displayValueLabel) {
        this._displayValueLabel = displayValueLabel;
    }

    touchDownAction(sender, controlEvent) {
        this._displayValueLabel.setString("Touch Down");
    }
    touchDragInsideAction(sender, controlEvent) {
        this._displayValueLabel.setString("Drag Inside");
    }
    touchDragOutsideAction(sender, controlEvent) {
        this._displayValueLabel.setString("Drag Outside");
    }
    touchDragEnterAction(sender, controlEvent) {
        this._displayValueLabel.setString("Drag Enter");
    }
    touchDragExitAction(sender, controlEvent) {
        this._displayValueLabel.setString("Drag Exit");
    }
    touchUpInsideAction(sender, controlEvent) {
        this._displayValueLabel.setString("Touch Up Inside.");
    }
    touchUpOutsideAction(sender, controlEvent) {
        this._displayValueLabel.setString("Touch Up Outside.");
    }
    touchCancelAction(sender, controlEvent) {
        this._displayValueLabel.setString("Touch Cancel");
    }

}
