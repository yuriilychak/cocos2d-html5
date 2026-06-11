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

import { Color, EventListener, Rect, ServiceLocator } from "@aspect/core";
import { ImageView, Widget } from "@aspect/ccui";

const SQUARE_SIZE = 80;
const SQUARE_TEXTURE = "default_theme/rounded_shadow_2.png";
const SQUARE_CAP = new Rect(12, 12, 12, 12);

export function createColoredView(color, size) {
    size = size || SQUARE_SIZE;
    const iv = new ImageView();
    iv.setScale9Enabled(true);
    iv.ignoreContentAdaptWithSize(false);
    iv.loadTexture(SQUARE_TEXTURE, Widget.PLIST_TEXTURE);
    iv.setCapInsets(SQUARE_CAP);
    iv.setContentSize(size, size);
    iv.color = color;
    return iv;
}

export class TouchableSprite extends ImageView {

    constructor(priority){
        super();

        this._listener = null;
        this._fixedPriority = 0;
        this._removeListenerOnTouchEnded = false;
        this._fixedPriority = priority || 0;

        this.setScale9Enabled(true);
        this.ignoreContentAdaptWithSize(false);
        this.loadTexture(SQUARE_TEXTURE, Widget.PLIST_TEXTURE);
        this.setCapInsets(SQUARE_CAP);
        this.setContentSize(SQUARE_SIZE, SQUARE_SIZE);
    }

    setPriority(fixedPriority){
        this._fixedPriority = fixedPriority;
    }

    onEnter(){
        super.onEnter();

        var selfPointer = this;
        var listener = EventListener.create({
            event: EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var locationInNode = selfPointer.convertToNodeSpace(touch.getLocation());
                var s = selfPointer.getContentSize();
                var rect = new Rect(0, 0, s.width, s.height);

                if (Rect.containsPoint(rect, locationInNode)) {
                    selfPointer.opacity = 128;
                    return true;
                }
                return false;
            },
            onTouchMoved: function (touch, event) {
                //this.setPosition(this.getPosition() + touch.getDelta());
            },
            onTouchEnded: function (touch, event) {
                selfPointer.opacity = 255;
                if(selfPointer._removeListenerOnTouchEnded) {
                    ServiceLocator.eventManager.removeListener(selfPointer._listener);
                    selfPointer._listener = null;
                }
            }
        });

        if(this._fixedPriority != 0)
            ServiceLocator.eventManager.addListener(listener, this._fixedPriority);
        else
            ServiceLocator.eventManager.addListener(listener, this);
        this._listener = listener;
    }

    onExit(){
        this._listener && ServiceLocator.eventManager.removeListener(this._listener);
        super.onExit();
    }

    removeListenerOnTouchEnded(toRemove){
        this._removeListenerOnTouchEnded = toRemove;
    }

    getListener() {
        return this._listener;
    }

}
