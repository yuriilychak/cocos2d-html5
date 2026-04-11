/****************************************************************************
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

/**
 * ccs.Bone uses ccs.Skin to displays on screen.
 * @class
 * @extends ccs.Sprite
 *
 * @param {String} [fileName]
 * @param {cc.Rect} [rect]
 *
 * @property {Object}   skinData    - The data of the skin
 * @property {ccs.Bone} bone        - The bone of the skin
 * @property {String}   displayName - <@readonly> The displayed name of skin
 *
 */
ccs.Skin = class Skin extends ccs.Sprite {

    constructor(fileName, rect) {
        super();
        this._skinData = null;
        this.bone = null;
        this._displayName = "";
        this._skinTransform = cc.affineTransformIdentity();
        this._armature = null;

        if (fileName == null || fileName === "") {
            this.init();
        } else {
            if(fileName[0] === "#"){
                this.initWithSpriteFrameName(fileName.substr(1));
            } else {
                this.initWithFile(fileName, rect);
            }
        }
    }

    /**
     * Initializes with sprite frame name
     * @param {String} spriteFrameName
     * @returns {Boolean}
     */
    initWithSpriteFrameName(spriteFrameName) {
        if(spriteFrameName === "")
            return false;
        var pFrame = cc.spriteFrameCache.getSpriteFrame(spriteFrameName);
        var ret = true;
        if(pFrame)
            this.initWithSpriteFrame(pFrame);
        else{
            cc.log("Can't find CCSpriteFrame with %s. Please check your .plist file", spriteFrameName);
            ret = false;
        }
        this._displayName = spriteFrameName;
        return ret;
    }

    /**
     * Initializes with texture file name.
     * @param {String} fileName
     * @param {cc.Rect} rect
     * @returns {Boolean}
     */
    initWithFile(fileName, rect) {
        var ret = rect ? super.initWithFile(fileName, rect)
                       : super.initWithFile(fileName);
        this._displayName = fileName;
        return ret;
    }

    /**
     * Sets skin data to ccs.Skin.
     * @param {ccs.BaseData} skinData
     */
    setSkinData(skinData) {
        this._skinData = skinData;
        this.setScaleX(skinData.scaleX);
        this.setScaleY(skinData.scaleY);
        this.setRotationX(cc.radiansToDegrees(skinData.skewX));
        this.setRotationY(cc.radiansToDegrees(-skinData.skewY));
        this.setPosition(skinData.x, skinData.y);

        this._renderCmd.transform();
    }

    /**
     * Returns skin date of ccs.Skin.
     * @returns {ccs.BaseData}
     */
    getSkinData() {
        return this._skinData;
    }

    /**
     * Updates armature skin's transform with skin transform and bone's transform.
     */
    updateArmatureTransform() {
        this._renderCmd.transform();
    }

    /**
     * Returns skin's world transform.
     * @returns {cc.AffineTransform}
     */
    getNodeToWorldTransform(){
        return this._renderCmd.getNodeToWorldTransform();
    }

    getNodeToWorldTransformAR(){
        return this._renderCmd.getNodeToWorldTransformAR();
    }

    /**
     * Sets the bone reference to ccs.Skin.
     * @param bone
     */
    setBone(bone) {
        this.bone = bone;
        var armature = this.bone.getArmature();
        if(armature)
            this._armature = armature;
    }

    /**
     * Returns the bone reference of ccs.Skin.
     * @returns {null}
     */
    getBone() {
        return this.bone;
    }

    /**
     * display name getter
     * @returns {String}
     */
    getDisplayName() {
        return this._displayName;
    }

    _createRenderCmd(){
        if(cc._renderType === cc.game.RENDER_TYPE_CANVAS)
            return new ccs.Skin.CanvasRenderCmd(this);
        else
            return new ccs.Skin.WebGLRenderCmd(this);
    }

};

var _p = ccs.Skin.prototype;

// Extended properties
/** @expose */
_p.skinData;
cc.defineGetterSetter(_p, "skinData", _p.getSkinData, _p.setSkinData);
/** @expose */
_p.displayName;
cc.defineGetterSetter(_p, "displayName", _p.getDisplayName);

_p = null;
