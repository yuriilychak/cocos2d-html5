/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

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

import { NewClass } from '../../platform/class';

/**
 * <p>
 *    cc.AnimationFrame
 *    A frame of the animation. It contains information like:
 *       - sprite frame name
 *       - # of delay units.
 *       - offset
 * </p>
 * @class
 * @extends cc.Class
 * @param spriteFrame
 * @param delayUnits
 * @param userInfo
 * @returns {AnimationFrame}
 */
export class AnimationFrame extends NewClass {
    constructor(spriteFrame, delayUnits, userInfo) {
        super();
        this._spriteFrame = null;
        this._delayPerUnit = 0;
        this._userInfo = null;
        this._spriteFrame = spriteFrame || null;
        this._delayPerUnit = delayUnits || 0;
        this._userInfo = userInfo || null;
    }

    /**
     * Create a new animation frame and copy all contents into it
     * @returns {AnimationFrame}
     */
    clone() {
        var frame = new AnimationFrame();
        frame.initWithSpriteFrame(
            this._spriteFrame.clone(),
            this._delayPerUnit,
            this._userInfo
        );
        return frame;
    }

    /**
     * Create a new animation frame and copy all contents into it
     * @returns {AnimationFrame}
     */
    copy(pZone) {
        var newFrame = new AnimationFrame();
        newFrame.initWithSpriteFrame(
            this._spriteFrame.clone(),
            this._delayPerUnit,
            this._userInfo
        );
        return newFrame;
    }

    /**
     * initializes the animation frame with a spriteframe, number of delay units and a notification user info
     * @param {cc.SpriteFrame} spriteFrame
     * @param {Number} delayUnits
     * @param {object} userInfo
     */
    initWithSpriteFrame(spriteFrame, delayUnits, userInfo) {
        this._spriteFrame = spriteFrame;
        this._delayPerUnit = delayUnits;
        this._userInfo = userInfo;

        return true;
    }

    /**
     * Returns sprite frame to be used
     * @return {cc.SpriteFrame}
     */
    getSpriteFrame() {
        return this._spriteFrame;
    }

    /**
     * Sets sprite frame to be used
     * @param {cc.SpriteFrame} spriteFrame
     */
    setSpriteFrame(spriteFrame) {
        this._spriteFrame = spriteFrame;
    }

    /**
     * Returns how many units of time the frame takes getter
     * @return {Number}
     */
    getDelayUnits() {
        return this._delayPerUnit;
    }

    /**
     * Sets how many units of time the frame takes setter
     * @param delayUnits
     */
    setDelayUnits(delayUnits) {
        this._delayPerUnit = delayUnits;
    }

    /**
     * Returns the user custom information
     * @return {object}
     */
    getUserInfo() {
        return this._userInfo;
    }

    /**
     * Sets the user custom information
     * @param {object} userInfo
     */
    setUserInfo(userInfo) {
        this._userInfo = userInfo;
    }
}
