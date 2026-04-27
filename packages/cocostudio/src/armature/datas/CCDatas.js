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

//BlendType
/**
 * The value of the blend type of normal
 * @constant
 * @type Number
 */
ccs.BLEND_TYPE_NORMAL = 0;

/**
 * The value of the blend type of layer
 * @constant
 * @type Number
 */
ccs.BLEND_TYPE_LAYER = 1;

/**
 * The value of the blend type of darken
 * @constant
 * @type Number
 */
ccs.BLEND_TYPE_DARKEN = 2;

/**
 * The value of the blend type of multiply
 * @constant
 * @type Number
 */
ccs.BLEND_TYPE_MULTIPLY = 3;

/**
 * The value of the blend type of lighten
 * @constant
 * @type Number
 */
ccs.BLEND_TYPE_LIGHTEN = 4;

/**
 * The value of the blend type of screen
 * @constant
 * @type Number
 */
ccs.BLEND_TYPE_SCREEN = 5;

/**
 * The value of the blend type of overlay
 * @constant
 * @type Number
 */
ccs.BLEND_TYPE_OVERLAY = 6;

/**
 * The value of the blend type of highlight
 * @constant
 * @type Number
 */
ccs.BLEND_TYPE_HIGHLIGHT = 7;

/**
 * The value of the blend type of add
 * @constant
 * @type Number
 */
ccs.BLEND_TYPE_ADD = 8;

/**
 * The value of the blend type of subtract
 * @constant
 * @type Number
 */
ccs.BLEND_TYPE_SUBTRACT = 9;

/**
 * The value of the blend type of difference
 * @constant
 * @type Number
 */
ccs.BLEND_TYPE_DIFFERENCE = 10;

/**
 * The value of the blend type of invert
 * @constant
 * @type Number
 */
ccs.BLEND_TYPE_INVERT = 11;

/**
 * The value of the blend type of alpha
 * @constant
 * @type Number
 */
ccs.BLEND_TYPE_ALPHA = 12;

/**
 * The value of the blend type of erase
 * @constant
 * @type Number
 */
ccs.BLEND_TYPE_ERASE = 13;

//DisplayType
/**
 * The Sprite flag of display render type.
 * @constant
 * @type Number
 */
ccs.DISPLAY_TYPE_SPRITE = 0;
/**
 * The Armature flag of display render type.
 * @constant
 * @type Number
 */
ccs.DISPLAY_TYPE_ARMATURE = 1;
/**
 * The Particle flag of display render type.
 * @constant
 * @type Number
 */
ccs.DISPLAY_TYPE_PARTICLE = 2;
ccs.DISPLAY_TYPE_MAX = 3;

/**
 * <p>
 *     The base data class for Armature. it contains position, zOrder, skew, scale, color datas.                                       <br/>
 *     x y skewX skewY scaleX scaleY used to calculate transform matrix                                                                <br/>
 *     skewX, skewY can have rotation effect                                                                                           <br/>
 *     To get more matrix information, you can have a look at this pape : http://www.senocular.com/flash/tutorials/transformmatrix/    <br/>
 * </p>
 *
 * @property {Number}         x                - x
 * @property {Number}         y                - y
 * @property {Number}         zOrder           - zOrder
 * @property {Number}         skewX            - skewX
 * @property {Number}         skewY            - skewY
 * @property {Number}         scaleX           - scaleX
 * @property {Number}         scaleY           - scaleY
 * @property {Number}         tweenRotate      - tween Rotate
 * @property {Number}         isUseColorInfo   - is Use Color Info
 * @property {Number}         r                - r of color
 * @property {Number}         g                - g of color
 * @property {Number}         b                - b of color
 * @property {Number}         a                - a of color
 */
ccs.BaseData = class BaseData extends cc.NewClass {

    /**
     * Construction of ccs.BaseData
     */
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
        this.zOrder = 0;
        this.skewX = 0;
        this.skewY = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.tweenRotate = 0;
        this.isUseColorInfo = false;
        this.r = 255;
        this.g = 255;
        this.b = 255;
        this.a = 255;
    }

    /**
     * Copy data from node
     * @function
     * @param {ccs.BaseData} node
     */
    copy(node) {
        this.x = node.x;
        this.y = node.y;
        this.zOrder = node.zOrder;

        this.scaleX = node.scaleX;
        this.scaleY = node.scaleY;
        this.skewX = node.skewX;
        this.skewY = node.skewY;

        this.tweenRotate = node.tweenRotate;

        this.isUseColorInfo = node.isUseColorInfo;
        this.r = node.r;
        this.g = node.g;
        this.b = node.b;
        this.a = node.a;
    }

    /**
     * Sets color to base data.
     * @function
     * @param {cc.Color} color
     */
    setColor(color){
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
        this.a = color.a;
    }

    /**
     * Returns the color of ccs.BaseData
     * @function
     * @returns {cc.Color}
     */
    getColor(){
        return new cc.Color(this.r, this.g, this.b, this.a);
    }

    /**
     * Calculate two baseData's between value(to - from) and set to self
     * @function
     * @param {ccs.BaseData} from
     * @param {ccs.BaseData} to
     * @param {Boolean} limit
     */
    subtract(from, to, limit) {
        this.x = to.x - from.x;
        this.y = to.y - from.y;
        this.scaleX = to.scaleX - from.scaleX;
        this.scaleY = to.scaleY - from.scaleY;
        this.skewX = to.skewX - from.skewX;
        this.skewY = to.skewY - from.skewY;

        if (this.isUseColorInfo || from.isUseColorInfo || to.isUseColorInfo) {
            this.a = to.a - from.a;
            this.r = to.r - from.r;
            this.g = to.g - from.g;
            this.b = to.b - from.b;
            this.isUseColorInfo = true;
        } else {
            this.a = this.r = this.g = this.b = 0;
            this.isUseColorInfo = false;
        }

        if (limit) {
            if (this.skewX > ccs.M_PI)
                this.skewX -= ccs.DOUBLE_PI;
            if (this.skewX < -ccs.M_PI)
                this.skewX += ccs.DOUBLE_PI;
            if (this.skewY > ccs.M_PI)
                this.skewY -= ccs.DOUBLE_PI;
            if (this.skewY < -ccs.M_PI)
                this.skewY += ccs.DOUBLE_PI;
        }

        if (to.tweenRotate) {
            this.skewX += to.tweenRotate * ccs.PI * 2;
            this.skewY -= to.tweenRotate * ccs.PI * 2;
        }
    }

};

/**
 * The class use for save display data.
 *
 * @property {Number}         displayType                - the display type
 * @property {String}         displayName                - the display name
 */
ccs.DisplayData = class DisplayData extends cc.NewClass {

    /**
     * Construction of ccs.DisplayData
     */
    constructor() {
        super();
        this.displayType = ccs.DISPLAY_TYPE_MAX;
    }
    /**
     * Changes display name to texture type
     * @function
     * @param {String} displayName
     * @returns {String}
     */
    changeDisplayToTexture(displayName) {
        // remove .xxx
        var textureName = displayName;
        var startPos = textureName.lastIndexOf(".");

        if (startPos !== -1)
            textureName = textureName.substring(0, startPos);
        return textureName;
    }

    /**
     * copy data
     * @function
     * @param {ccs.DisplayData} displayData
     */
    copy(displayData) {
        this.displayName = displayData.displayName;
        this.displayType = displayData.displayType;
    }

};

/**
 * The sprite display data class.
 *
 * @property {ccs.BaseData}         skinData                - the skin data
 */
ccs.SpriteDisplayData = class SpriteDisplayData extends ccs.DisplayData {

    /**
     * Construction of ccs.SpriteDisplayData
     */
    constructor() {
        super();
        this.skinData = new ccs.BaseData();
        this.displayType = ccs.DISPLAY_TYPE_SPRITE;
    }
    /**
     * copy data
     * @function
     * @param {ccs.SpriteDisplayData} displayData
     */
    copy(displayData) {
        super.copy(displayData);
        this.skinData = displayData.skinData;
    }

};

/**
 * The armature display data class
 */
ccs.ArmatureDisplayData = class ArmatureDisplayData extends ccs.DisplayData {
    /**
     * Construction of ccs.ArmatureDisplayData
     */
    constructor() {
        super();
        this.displayName = "";
        this.displayType = ccs.DISPLAY_TYPE_ARMATURE;
    }

};

/**
 * The particle display data class.
 */
ccs.ParticleDisplayData = class ParticleDisplayData extends ccs.DisplayData {
    /**
     * Construction of ccs.ParticleDisplayData
     */
    constructor() {
        super();
        this.displayType = ccs.DISPLAY_TYPE_PARTICLE;
    }

};

/**
 * <p>
 *      BoneData used to init a Bone.                                                               <br/>
 *      BoneData keeps a DisplayData list, a Bone can have many display to change.                  <br/>
 *      The display information saved in the DisplayData                                            <br/>
 * </p>
 *
 * @property {Array}                    displayDataList                - the display data list
 * @property {String}                   name                           - the name of Bone
 * @property {String}                   parentName                     - the parent name of bone
 * @property {cc.AffineTransform}       boneDataTransform              - the bone transform data
 */
ccs.BoneData = class BoneData extends ccs.BaseData {

    /**
     * Construction of ccs.BoneData
     */
    constructor() {
        super();
        this.displayDataList = [];
        this.name = "";
        this.parentName = "";
        this.boneDataTransform = null;
    }

    /**
     * Initializes a ccs.BoneData
     * @returns {boolean}
     */
    init() {
        this.displayDataList.length = 0;
        return true;
    }
    /**
     * Adds display data to list
     * @function
     * @param {ccs.DisplayData} displayData
     */
    addDisplayData(displayData) {
        this.displayDataList.push(displayData);
    }

    /**
     * Returns display data with index.
     * @function
     * @param {Number} index
     * @returns {ccs.DisplayData}
     */
    getDisplayData(index) {
        return this.displayDataList[index];
    }

};

/**
 * <p>
 * ArmatureData saved the Armature name and BoneData needed for the Bones in this Armature      <br/>
 * When we create a Armature, we need to get each Bone's BoneData as it's init information.       <br/>
 * So we can get a BoneData from the Dictionary saved in the ArmatureData.                        <br/>
 * </p>
 *
 * @property {Object}                    boneDataDic                - the bone data dictionary
 * @property {String}                    name                       - the name of armature data
 * @property {Number}                    dataVersion                - the data version of armature data
 */
ccs.ArmatureData = class ArmatureData extends cc.NewClass {

    /**
     * Construction of ccs.ArmatureData
     */
    constructor() {
        super();
        this.boneDataDic = {};
        this.name = "";
        this.dataVersion = 0.1;
    }

    /**
     * Initializes a ccs.ArmatureData
     * @returns {boolean}
     */
    init() {
        return true;
    }

    /**
     * Adds bone data to dictionary
     * @param {ccs.BoneData} boneData
     */
    addBoneData(boneData) {
        this.boneDataDic[boneData.name] = boneData;
    }

    /**
     * Gets bone data dictionary
     * @returns {Object}
     */
    getBoneDataDic() {
        return this.boneDataDic;
    }
    /**
     * Gets bone data by bone name
     * @function
     * @param {String} boneName
     * @returns {ccs.BoneData}
     */
    getBoneData(boneName) {
        return this.boneDataDic[boneName];
    }

};

/**
 * FrameData saved the frame data needed for armature animation in this Armature.
 *
 * @property {Number}                    duration                - the duration of frame
 * @property {Number}                    tweenEasing             - the easing type of frame
 * @property {Number}                    easingParamNumber       - the count of easing parameters.
 * @property {Object}                    easingParams            - the dictionary of easing parameters.
 * @property {Number}                    displayIndex            - the display renderer index.
 * @property {String}                    movement                - the movement name.
 * @property {String}                    event                   - the event name
 * @property {String}                    sound                   - the sound path.
 * @property {String}                    soundEffect             - the sound effect path.
 * @property {Object}                    blendFunc               - the blendFunc of frame.
 * @property {Number}                    frameID                 - the frame ID of frame
 * @property {Boolean}                   isTween                 - the flag which frame whether is tween.
 */
ccs.FrameData = class FrameData extends ccs.BaseData {

        /**
         * Construction of ccs.FrameData.
         */
        constructor() {
            super();
            this.duration = 1;
            this.tweenEasing = ccs.TweenType.LINEAR;
            this.easingParamNumber = 0;
            this.easingParams = [];
            this.displayIndex = 0;
            this.movement = "";
            this.event = "";
            this.sound = "";
            this.soundEffect = "";
            this.blendFunc = new cc.BlendFunc(cc.BLEND_SRC, cc.BLEND_DST);
            this.frameID = 0;
            this.isTween = true;
        }

        /**
         * copy data
         * @function
         * @param frameData
         */
        copy(frameData) {
            super.copy(frameData);
            this.duration = frameData.duration;
            this.displayIndex = frameData.displayIndex;

            this.tweenEasing = frameData.tweenEasing;
            this.easingParamNumber = frameData.easingParamNumber;

//            this.movement = frameData.movement;
//            this.event = frameData.event;
//            this.sound = frameData.sound;
//            this.soundEffect = frameData.soundEffect;
//            this.easingParams.length = 0;
            if (this.easingParamNumber !== 0){
                this.easingParams.length = 0;
                for (var i = 0; i<this.easingParamNumber; i++){
                    this.easingParams[i] = frameData.easingParams[i];
                }
            }
            this.blendFunc = frameData.blendFunc;
            this.isTween = frameData.isTween;

        }
    
};

/**
 * MovementBoneData saved the name, delay, frame list of Bone's movement.
 *
 * @property {Number}                    delay             - the delay of bone's movement.
 * @property {Number}                    scale             - the scale of bone's movement.
 * @property {Number}                    duration          - the duration of bone's movement.
 * @property {Array}                     frameList         - the frame list of bone's movement.
 * @property {String}                    name              - the name of bone's movement.
 */
ccs.MovementBoneData = class MovementBoneData extends cc.NewClass {

    /**
     * Construction of ccs.MovementBoneData.
     */
    constructor() {
        super();
        this.delay = 0;
        this.scale = 1;
        this.duration = 0;
        this.frameList = [];
        this.name = "";
    }

    /**
     * Initializes a ccs.MovementBoneData.
     * @returns {boolean}
     */
    init() {
        return true;
    }
    /**
     * Adds frame data to frame list.
     * @param {ccs.FrameData} frameData
     */
    addFrameData(frameData) {
        this.frameList.push(frameData);
    }
    /**
     * Gets frame data by Index.
     * @function
     * @param {Number} index
     * @returns {ccs.FrameData}
     */
    getFrameData(index) {
        return this.frameList[index];
    }

};

/**
 * The movement data information of Cocos Armature.
 * @constructor
 */
ccs.MovementData = function(){
    this.name = "";
    this.duration = 0;
    this.scale = 1;
    /**
     * Change to this movement will last durationTo frames. Use this effect can avoid too suddenly changing.
     *
     * Example : current movement is "stand", we want to change to "run", then we fill durationTo frames before
     * change to "run" instead of changing to "run" directly.
     */
    this.durationTo = 0;
    /**
     * This is different from duration, durationTween contain tween effect.
     * duration is the raw time that the animation will last, it's the same with the time you edit in the Action Editor.
     * durationTween is the actual time you want this animation last.
     * Example : If we edit 10 frames in the flash, then duration is 10. When we set durationTween to 50, the movement will last 50 frames, the extra 40 frames will auto filled with tween effect
     */
    this.durationTween = 0;
    this.loop = true;                            //! whether the movement was looped
    /**
     * Which tween easing effect the movement use
     * TWEEN_EASING_MAX : use the value from MovementData get from flash design panel
     */
    this.tweenEasing = ccs.TweenType.LINEAR;
    this.movBoneDataDic = {};
};

/**
 * add a movement bone data to dictionary
 * @param {ccs.MovementBoneData} movBoneData
 */
ccs.MovementData.prototype.addMovementBoneData = function(movBoneData){
    this.movBoneDataDic[ movBoneData.name] = movBoneData;
};

/**
 * add a movement bone data from dictionary by name
 * @param boneName
 * @returns {ccs.MovementBoneData}
 */
ccs.MovementData.prototype.getMovementBoneData = function(boneName){
    return  this.movBoneDataDic[boneName];
};

/**
 * <p>
 * The animation data information of Cocos Armature. It include all movement information for the Armature.         <br/>
 * The struct is AnimationData -> MovementData -> MovementBoneData -> FrameData                                    <br/>
 *                                              -> MovementFrameData                                               <br/>
 * </p>
 */
ccs.AnimationData = function(){
    this.movementDataDic = {};
    this.movementNames = [];
    this.name = "";
};

/**
 * adds movement data to the movement data dictionary
 * @param {ccs.MovementData} moveData
 */
ccs.AnimationData.prototype.addMovement = function(moveData){
    this.movementDataDic[moveData.name] = moveData;
    this.movementNames.push(moveData.name);
};

/**
 * gets movement data from movement data dictionary
 * @param {String} moveName
 * @returns {ccs.MovementData}
 */
ccs.AnimationData.prototype.getMovement = function(moveName){
    return this.movementDataDic[moveName];
};

/**
 * gets the count of movement data dictionary
 * @returns {Number}
 */
ccs.AnimationData.prototype.getMovementCount = function(){
    return Object.keys(this.movementDataDic).length;
};

/**
 * contour vertex
 * @param {Number} x
 * @param {Number} y
 * @constructor
 */
ccs.ContourVertex2 = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

/**
 * The Contour data information of Cocos Armature.
 * @constructor
 */
ccs.ContourData = function(){
    this.vertexList = [];
};

ccs.ContourData.prototype.init = function(){
    this.vertexList.length = 0;
    return true;
};

/**
 * add a vertex object to vertex list
 * @param {cc.Point} p
 */
ccs.ContourData.prototype.addVertex = function(p){
    //var v = new ccs.ContourVertex2(p.x, p.y);              //ccs.ContourVertex2 is same as cc.Point, so we needn't create a ccs.ContourVertex2 object
    this.vertexList.push(p);
};

/**
 * The texture data information of Cocos Armature
 */
ccs.TextureData = function(){
    this.height = 0;
    this.width = 0;
    this.pivotX = 0.5;
    this.pivotY = 0.5;
    this.name = "";
    this.contourDataList = [];
};

ccs.TextureData.prototype.init = function(){
    this.contourDataList.length = 0;
};

/**
 * Adds a contourData to contourDataList
 * @param {ccs.ContourData} contourData
 */
ccs.TextureData.prototype.addContourData = function(contourData){
    this.contourDataList.push(contourData);
};

/**
 * gets a contourData from contourDataList by index
 * @param {Number} index
 * @returns {ccs.ContourData}
 */
ccs.TextureData.prototype.getContourData = function(index){
    return this.contourDataList[index];
};
