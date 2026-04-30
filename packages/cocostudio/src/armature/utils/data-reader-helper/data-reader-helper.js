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
 * @ignore
 */
import { BLEND_DST, BLEND_SRC, DST_COLOR, Director, Loader, ONE, ONE_MINUS_DST_COLOR, ONE_MINUS_SRC_ALPHA, Path, Point, SAXParser, SRC_ALPHA, arrayRemoveObject, degreesToRadians, isFunction, log } from "@aspect/core";

import { TweenType } from "../../animation/tween-function/constants.js";
import { VERSION_CHANGE_ROTATION_RANGE, VERSION_COLOR_READING } from "../../armature-define.js";
import { armatureDataManager } from "../armature-data-manager.js";
import { ArmatureData } from "../datas/armature-data.js";
import { ArmatureDisplayData } from "../datas/armature-display-data.js";
import { BaseData } from "../datas/base-data.js";
import { BoneData } from "../datas/bone-data.js";
import { BLEND_TYPE_ADD, BLEND_TYPE_MULTIPLY, BLEND_TYPE_NORMAL, BLEND_TYPE_SCREEN, DISPLAY_TYPE_ARMATURE, DISPLAY_TYPE_PARTICLE, DISPLAY_TYPE_SPRITE } from "../datas/constants.js";
import { FrameData } from "../datas/frame-data.js";
import { MovementBoneData } from "../datas/movement-bone-data.js";
import { ParticleDisplayData } from "../datas/particle-display-data.js";
import { SpriteDisplayData } from "../datas/sprite-display-data.js";
import { AnimationData, ContourData, MovementData, TextureData } from "../datas/utils.js";
import { TransformHelp } from "../transform-help.js";
import { CONST_ANIMATION, CONST_ANIMATIONS, CONST_ANIMATION_DATA, CONST_ARMATURE, CONST_ARMATURES, CONST_ARMATURE_DATA, CONST_A_ALPHA, CONST_A_ALPHA_OFFSET, CONST_A_BLEND_DST, CONST_A_BLEND_SRC, CONST_A_BLEND_TYPE, CONST_A_BLUE, CONST_A_BLUE_OFFSET, CONST_A_COCOS2DX_X, CONST_A_COCOS2DX_Y, CONST_A_COCOS2D_PIVOT_X, CONST_A_COCOS2D_PIVOT_Y, CONST_A_COLOR_TRANSFORM, CONST_A_DISPLAY_INDEX, CONST_A_DISPLAY_TYPE, CONST_A_DURATION, CONST_A_DURATION_TO, CONST_A_DURATION_TWEEN, CONST_A_EASING_PARAM, CONST_A_EVENT, CONST_A_FRAME_INDEX, CONST_A_GREEN, CONST_A_GREEN_OFFSET, CONST_A_HEIGHT, CONST_A_IS_ARMATURE, CONST_A_LOOP, CONST_A_MOVEMENT, CONST_A_MOVEMENT_DELAY, CONST_A_MOVEMENT_SCALE, CONST_A_NAME, CONST_A_PARENT, CONST_A_PIVOT_X, CONST_A_PIVOT_Y, CONST_A_PLIST, CONST_A_RED, CONST_A_RED_OFFSET, CONST_A_SCALE_X, CONST_A_SCALE_Y, CONST_A_SKEW_X, CONST_A_SKEW_Y, CONST_A_SOUND, CONST_A_SOUND_EFFECT, CONST_A_TWEEN_EASING, CONST_A_TWEEN_FRAME, CONST_A_TWEEN_ROTATE, CONST_A_WIDTH, CONST_A_X, CONST_A_Y, CONST_A_Z, CONST_BONE, CONST_BONE_DATA, CONST_COLOR_INFO, CONST_CONFIG_FILE_PATH, CONST_CONTENT_SCALE, CONST_CONTOUR, CONST_CONTOUR_DATA, CONST_CONTOUR_VERTEX, CONST_DISPLAY, CONST_DISPLAY_DATA, CONST_FL_NAN, CONST_FRAME, CONST_FRAME_DATA, CONST_MOVEMENT, CONST_MOVEMENT_BONE_DATA, CONST_MOVEMENT_DATA, CONST_SKELETON, CONST_SKIN_DATA, CONST_SUB_TEXTURE, CONST_TEXTURE_ATLAS, CONST_TEXTURE_DATA, CONST_VERSION, CONST_VERSION_2_0, CONST_VERSION_COMBINED, CONST_VERTEX_POINT } from "./constants.js";
/**
 * @ignore
 * @constructor
 */
export function DataInfo () {
    this.asyncStruct = null;
    this.configFileQueue = [];
    this.contentScale = 1;
    this.filename = "";
    this.baseFilePath = "";
    this.flashToolVersion = 0;
    this.cocoStudioVersion = 0
}
ccs.DataInfo = DataInfo;

/**
 * dataReaderHelper is a singleton object for reading CocoStudio data
 * @name dataReaderHelper
 */
export const dataReaderHelper = ccs.dataReaderHelper = {
    ConfigType: {
        DragonBone_XML: 0,
        CocoStudio_JSON: 1,
        CocoStudio_Binary: 2
    },

    _configFileList: [],
    _flashToolVersion: CONST_VERSION_2_0,
//    _cocoStudioVersion: CONST_VERSION_COMBINED,
    _positionReadScale: 1,
    _asyncRefCount: 0,
    _asyncRefTotalCount: 0,

    _dataQueue: null,

    //LoadData don't need

    setPositionReadScale: function (scale) {
        this._positionReadScale = scale;
    },

    getPositionReadScale: function () {
        return this._positionReadScale;
    },

    /**
     * Add armature data from file.
     * @param {String} filePath
     */
    addDataFromFile: function (filePath) {
        /*
         * Check if file is already added to ArmatureDataManager, if then return.
         */
        if (this._configFileList.indexOf(filePath) !== -1)
            return;
        this._configFileList.push(filePath);

        //! find the base file path
        var basefilePath = this._initBaseFilePath(filePath);

        // Read content from file
        // Here the reader into the next process

        var str = Path.extname(filePath).toLowerCase();

        var dataInfo = new DataInfo();
        dataInfo.filename = filePath;
        dataInfo.basefilePath = basefilePath;
        if (str === ".xml")
            dataReaderHelper.addDataFromXML(filePath, dataInfo);
        else if (str === ".json" || str === ".exportjson")
            dataReaderHelper.addDataFromJson(filePath, dataInfo);
        else if(str === ".csb")
            dataReaderHelper.addDataFromBinaryCache(filePath, dataInfo);
    },

    /**
     * Adds data from file with Async.
     * @param {String} imagePath
     * @param {String} plistPath
     * @param {String} filePath
     * @param {function} selector
     * @param {Object} [target]
     */
    addDataFromFileAsync: function (imagePath, plistPath, filePath, selector, target) {
        /*
         * Check if file is already added to ArmatureDataManager, if then return.
         */
        if (this._configFileList.indexOf(filePath) !== -1) {
            if (target && selector) {
                if (this._asyncRefTotalCount === 0 && this._asyncRefCount === 0)
                    this._asyncCallBack(selector,target, 1);
                else
                    this._asyncCallBack(selector, target, (this._asyncRefTotalCount - this._asyncRefCount) / this._asyncRefTotalCount);
            }
            return;
        }
//        this._configFileList.push(filePath);

        //! find the base file path
//        var basefilePath = this._initBaseFilePath(filePath);

        this._asyncRefTotalCount++;
        this._asyncRefCount++;
        var self = this;
        var fun = function () {
            self.addDataFromFile(filePath);
            self._asyncRefCount--;
            self._asyncCallBack(selector,target, (self._asyncRefTotalCount - self._asyncRefCount) / self._asyncRefTotalCount);
        };
        Director.getInstance().getScheduler().schedule(fun, this, 0.1, false, 0, false, "armatrueDataHelper");
    },

    /**
     * Removes config file from config file list.
     * @param {String} configFile
     */
    removeConfigFile: function (configFile) {
//      arrayRemoveObject(this._configFileList, configFile);
        var locFileList = this._configFileList;
        var len = locFileList.length;
        var it = locFileList[len];
        for (var i = 0;i<len; i++){
            if (locFileList[i] === configFile)
                it = i;
        }

        if (it !== locFileList[len])
            arrayRemoveObject(locFileList, configFile);
    },

    /**
     * Translate XML export from Dragon Bone flash tool to data, and save them. When you add a new xml, the data already saved will be keeped.
     * @param {Object} skeleton
     * @param {DataInfo} dataInfo
     */
    addDataFromCache: function (skeleton, dataInfo) {
        if (!skeleton) {
            log("XML error  or  XML is empty.");
            return;
        }
        dataInfo.flashToolVersion = parseFloat(skeleton.getAttribute(CONST_VERSION));

        /*
         * Begin decode armature data from xml
         */
        var armaturesXML = skeleton.querySelectorAll(CONST_SKELETON + " > " + CONST_ARMATURES + " >  " + CONST_ARMATURE + "");
        var armatureDataManager = armatureDataManager, i;
        for (i = 0; i < armaturesXML.length; i++) {
            var armatureData = this.decodeArmature(armaturesXML[i], dataInfo);
            armatureDataManager.addArmatureData(armatureData.name, armatureData, dataInfo.filename);
        }

        /*
         * Begin decode animation data from xml
         */
        var animationsXML = skeleton.querySelectorAll(CONST_SKELETON + " > " + CONST_ANIMATIONS + " >  " + CONST_ANIMATION + "");
        for (i = 0; i < animationsXML.length; i++) {
            var animationData = this.decodeAnimation(animationsXML[i], dataInfo);
            armatureDataManager.addAnimationData(animationData.name, animationData, dataInfo.filename);
        }

        var texturesXML = skeleton.querySelectorAll(CONST_SKELETON + " > " + CONST_TEXTURE_ATLAS + " >  " + CONST_SUB_TEXTURE + "");
        for (i = 0; i < texturesXML.length; i++) {
            var textureData = this.decodeTexture(texturesXML[i], dataInfo);
            armatureDataManager.addTextureData(textureData.name, textureData, dataInfo.filename);
        }
    },

    /**
     * decode xml armature data.
     * @param {XMLDocument} armatureXML
     * @param {DataInfo} dataInfo
     * @returns {ArmatureData}
     */
    decodeArmature: function (armatureXML, dataInfo) {
        var armatureData = new ArmatureData();
        armatureData.init();
        armatureData.name = armatureXML.getAttribute(CONST_A_NAME);

        var bonesXML = armatureXML.querySelectorAll(CONST_ARMATURE + " > " + CONST_BONE);

        for (var i = 0; i < bonesXML.length; i++) {
            /*
             *  If this bone have parent, then get the parent bone xml
             */
            var boneXML = bonesXML[i];
            var parentName = boneXML.getAttribute(CONST_A_PARENT);
            var parentXML = null;
            if (parentName) {
                //parentXML = armatureXML.querySelectorAll(CONST_ARMATURE+" > "+CONST_BONE);
                for (var j = 0; j < bonesXML.length; j++) {
                    parentXML = bonesXML[j];
                    if (parentName == bonesXML[j].getAttribute(CONST_A_NAME)) {
                        //todo
                        break;
                    }
                }
            }
            var boneData = this.decodeBone(boneXML, parentXML, dataInfo);
            armatureData.addBoneData(boneData);
        }
        return armatureData;
    },

    /**
     * decode json armature data.
     * @param {Object} json
     * @param {DataInfo} dataInfo
     * @returns {ArmatureData}
     */
    decodeArmatureFromJSON: function (json, dataInfo) {
        var armatureData = new ArmatureData();
        armatureData.init();

        var name = json[CONST_A_NAME];
        if (name) {
            armatureData.name = name;
        }

        dataInfo.cocoStudioVersion = armatureData.dataVersion = json[CONST_VERSION] || 0.1;

        var boneDataList = json[CONST_BONE_DATA];
        for (var i = 0; i < boneDataList.length; i++) {
            var boneData = this.decodeBoneFromJson(boneDataList[i], dataInfo);
            armatureData.addBoneData(boneData);
        }
        return armatureData;
    },

    /**
     * decode xml bone data.
     * @param {XMLDocument} boneXML
     * @param {XMLDocument} parentXML
     * @param {DataInfo} dataInfo
     * @returns {BoneData}
     */
    decodeBone: function (boneXML, parentXML, dataInfo) {
        var boneData = new BoneData();
        boneData.init();

        boneData.name = boneXML.getAttribute(CONST_A_NAME);
        boneData.parentName = boneXML.getAttribute(CONST_A_PARENT) || "";

        boneData.zOrder = parseInt(boneXML.getAttribute(CONST_A_Z)) || 0;

        var displaysXML = boneXML.querySelectorAll(CONST_BONE + " > " + CONST_DISPLAY);
        for (var i = 0; i < displaysXML.length; i++) {
            var displayXML = displaysXML[i];
            var displayData = this.decodeBoneDisplay(displayXML, dataInfo);
            boneData.addDisplayData(displayData);
        }
        return boneData;
    },

    /**
     * decode json bone data.
     * @param {Object} json json bone data.
     * @param {DataInfo} dataInfo
     * @returns {BoneData}
     */
    decodeBoneFromJson: function (json, dataInfo) {
        var boneData = new BoneData();
        boneData.init();

        this.decodeNodeFromJson(boneData, json, dataInfo);

        boneData.name = json[CONST_A_NAME] || "";

        boneData.parentName = json[CONST_A_PARENT] || "";
        var displayDataList = json[CONST_DISPLAY_DATA] || [];
        for (var i = 0; i < displayDataList.length; i++) {
            var locDisplayData = this.decodeBoneDisplayFromJson(displayDataList[i], dataInfo);
            boneData.addDisplayData(locDisplayData);
        }
        return boneData;
    },

    /**
     * decode xml display data of bone
     * @param {XMLDocument} displayXML
     * @param {DataInfo} dataInfo
     * @returns {DisplayData}
     */
    decodeBoneDisplay: function (displayXML, dataInfo) {
        var isArmature = parseFloat(displayXML.getAttribute(CONST_A_IS_ARMATURE)) || 0;
        var displayData = null;

        if (isArmature === 1) {
            displayData = new ArmatureDisplayData();
            displayData.displayType = DISPLAY_TYPE_ARMATURE;
        } else {
            displayData = new SpriteDisplayData();
            displayData.displayType = DISPLAY_TYPE_SPRITE;
        }

        var displayName = displayXML.getAttribute(CONST_A_NAME) || "";
        if (displayName) {
            displayData.displayName = displayName;
        }
        return displayData;
    },

    /**
     * Decodes json display data of bone.
     * @param {Object} json
     * @param {DataInfo} dataInfo
     * @returns {DisplayData}
     */
    decodeBoneDisplayFromJson: function (json, dataInfo) {
        var displayType = json[CONST_A_DISPLAY_TYPE] || DISPLAY_TYPE_SPRITE;
        var displayData = null;

        switch (displayType) {
            case DISPLAY_TYPE_SPRITE:
                displayData = new SpriteDisplayData();

                var name = json[CONST_A_NAME];
                if(name != null){
                    displayData.displayName =  name;
                }

                var dicArray = json[CONST_SKIN_DATA] || [];
                var dic = dicArray[0];
                if (dic) {
                    var skinData = displayData.skinData;
                    skinData.x = dic[CONST_A_X] * this._positionReadScale;
                    skinData.y = dic[CONST_A_Y] * this._positionReadScale;
                    skinData.scaleX = dic[CONST_A_SCALE_X] == null ? 1 : dic[CONST_A_SCALE_X];
                    skinData.scaleY = dic[CONST_A_SCALE_Y] == null ? 1 : dic[CONST_A_SCALE_Y];
                    skinData.skewX = dic[CONST_A_SKEW_X] == null ? 1 : dic[CONST_A_SKEW_X];
                    skinData.skewY = dic[CONST_A_SKEW_Y] == null ? 1 : dic[CONST_A_SKEW_Y];

                    skinData.x *= dataInfo.contentScale;
                    skinData.y *= dataInfo.contentScale;
                }
                break;
            case DISPLAY_TYPE_ARMATURE:
                displayData = new ArmatureDisplayData();
                var name = json[CONST_A_NAME];
                if(name != null){
                    displayData.displayName = json[CONST_A_NAME];
                }
                break;
            case DISPLAY_TYPE_PARTICLE:
                displayData = new ParticleDisplayData();
                var plist = json[CONST_A_PLIST];
                if(plist != null){
                    if(dataInfo.asyncStruct){
                        displayData.displayName = dataInfo.asyncStruct.basefilePath + plist;
                    }else{
                        displayData.displayName = dataInfo.basefilePath + plist;
                    }
                }
                break;
            default:
                displayData = new SpriteDisplayData();
                break;
        }
        displayData.displayType = displayType;
        return displayData;
    },

    /**
     * Decodes xml animation data.
     * @param {XMLDocument} animationXML
     * @param {DataInfo} dataInfo
     * @returns {AnimationData}
     */
    decodeAnimation: function (animationXML, dataInfo) {
        var aniData = new AnimationData();
        var name = animationXML.getAttribute(CONST_A_NAME);
        var armatureData = armatureDataManager.getArmatureData(name);
        aniData.name = name;

        var movementsXML = animationXML.querySelectorAll(CONST_ANIMATION + " > " + CONST_MOVEMENT);
        var movementXML = null;

        for (var i = 0; i < movementsXML.length; i++) {
            movementXML = movementsXML[i];
            var movementData = this.decodeMovement(movementXML, armatureData, dataInfo);
            aniData.addMovement(movementData);
        }
        return aniData;
    },

    /**
     * Decodes animation json data.
     * @param {Object} json
     * @param {DataInfo} dataInfo
     * @returns {AnimationData}
     */
    decodeAnimationFromJson: function (json, dataInfo) {
        var aniData = new AnimationData();
        var name = json[CONST_A_NAME];
        if(name){
            aniData.name = json[CONST_A_NAME];
        }

        var movementDataList = json[CONST_MOVEMENT_DATA] || [];
        for (var i = 0; i < movementDataList.length; i++) {
            var locMovementData = this.decodeMovementFromJson(movementDataList[i], dataInfo);
            aniData.addMovement(locMovementData);
        }
        return aniData;
    },

    /**
     * Decodes xml movement data.
     * @param {XMLDocument} movementXML
     * @param {ArmatureData} armatureData
     * @param {DataInfo} dataInfo
     * @returns {MovementData}
     */
    decodeMovement: function (movementXML, armatureData, dataInfo) {
        var movementData = new MovementData();
        movementData.name = movementXML.getAttribute(CONST_A_NAME);

        var duration, durationTo, durationTween, loop, tweenEasing = 0;

        duration = movementXML.getAttribute(CONST_A_DURATION);
        movementData.duration = duration == null ? 0 : parseFloat(duration);

        durationTo = movementXML.getAttribute(CONST_A_DURATION_TO);
        movementData.durationTo = durationTo == null ? 0 : parseFloat(durationTo);

        durationTween = movementXML.getAttribute(CONST_A_DURATION_TWEEN);
        movementData.durationTween = durationTween == null ? 0 : parseFloat(durationTween);

        loop = movementXML.getAttribute(CONST_A_LOOP);
        movementData.loop = loop ? Boolean(parseFloat(loop)) : true;

        var easing = movementXML.getAttribute(CONST_A_TWEEN_EASING);
        if (easing) {
            if (easing != CONST_FL_NAN) {
                tweenEasing = easing == null ? 0 : parseFloat(easing);
                movementData.tweenEasing = tweenEasing === 2 ? TweenType.SINE_EASEINOUT : tweenEasing;
            } else
                movementData.tweenEasing = TweenType.LINEAR;
        }

        var movBonesXml = movementXML.querySelectorAll(CONST_MOVEMENT + " > " + CONST_BONE);
        var movBoneXml = null;
        for (var i = 0; i < movBonesXml.length; i++) {
            movBoneXml = movBonesXml[i];
            var boneName = movBoneXml.getAttribute(CONST_A_NAME);

            if (movementData.getMovementBoneData(boneName))
                continue;

            var boneData = armatureData.getBoneData(boneName);
            var parentName = boneData.parentName;

            var parentXML = null;
            if (parentName !== "") {
                for (var j = 0; j < movBonesXml.length; j++) {
                    parentXML = movBonesXml[j];
                    if (parentName === parentXML.getAttribute(CONST_A_NAME))
                        break;
                }
            }
            var moveBoneData = this.decodeMovementBone(movBoneXml, parentXML, boneData, dataInfo);
            movementData.addMovementBoneData(moveBoneData);
        }
        return movementData;
    },

    /**
     * Decodes json movement data.
     * @param {Object} json
     * @param {DataInfo} dataInfo
     * @returns {MovementData}
     */
    decodeMovementFromJson: function (json, dataInfo) {
        var movementData = new MovementData();

        movementData.loop = json[CONST_A_LOOP] == null ? false : json[CONST_A_LOOP];
        movementData.durationTween = json[CONST_A_DURATION_TWEEN] || 0;
        movementData.durationTo = json[CONST_A_DURATION_TO] || 0;
        movementData.duration = json[CONST_A_DURATION] || 0;

        if(json[CONST_A_DURATION] == null){
            movementData.scale = 1;
        }else{
            movementData.scale = json[CONST_A_MOVEMENT_SCALE] == null ? 1 : json[CONST_A_MOVEMENT_SCALE];
        }

        movementData.tweenEasing = json[CONST_A_TWEEN_EASING] == null ? TweenType.LINEAR : json[CONST_A_TWEEN_EASING];
        var name = json[CONST_A_NAME];
        if(name)
            movementData.name = name;

        var movementBoneList = json[CONST_MOVEMENT_BONE_DATA] || [];
        for (var i = 0; i < movementBoneList.length; i++) {
            var locMovementBoneData = this.decodeMovementBoneFromJson(movementBoneList[i], dataInfo);
            movementData.addMovementBoneData(locMovementBoneData);
        }
        return movementData;
    },

    /**
     * Decodes xml data of bone's movement.
     * @param {XMLDocument} movBoneXml
     * @param {XMLDocument} parentXml
     * @param {BoneData} boneData
     * @param {DataInfo} dataInfo
     * @returns {MovementBoneData}
     */
    decodeMovementBone: function (movBoneXml, parentXml, boneData, dataInfo) {
        var movBoneData = new MovementBoneData();
        movBoneData.init();

        var scale, delay;
        if (movBoneXml) {
            scale = parseFloat(movBoneXml.getAttribute(CONST_A_MOVEMENT_SCALE)) || 0;
            movBoneData.scale = scale;

            delay = parseFloat(movBoneXml.getAttribute(CONST_A_MOVEMENT_DELAY)) || 0;
            if (delay > 0)
                delay -= 1;
            movBoneData.delay = delay;
        }

        var length = 0, parentTotalDuration = 0,currentDuration = 0;
        var parentFrameXML = null,parentXMLList = [];

        /*
         *  get the parent frame xml list, we need get the origin data
         */
        if (parentXml != null) {
            var parentFramesXML = parentXml.querySelectorAll(CONST_BONE + " > " + CONST_FRAME);
            for (var i = 0; i < parentFramesXML.length; i++)
                parentXMLList.push(parentFramesXML[i]);
            length = parentXMLList.length;
        }

        movBoneData.name = movBoneXml.getAttribute(CONST_A_NAME);

        var framesXML = movBoneXml.querySelectorAll(CONST_BONE + " > " + CONST_FRAME);

        var j = 0, totalDuration = 0;
        for (var ii = 0; ii < framesXML.length; ii++) {
            var frameXML = framesXML[ii];
            if (parentXml) {
                /*
                 *  in this loop we get the corresponding parent frame xml
                 */
                while (j < length && (parentFrameXML ? (totalDuration < parentTotalDuration || totalDuration >= parentTotalDuration + currentDuration) : true)) {
                    parentFrameXML = parentXMLList[j];
                    parentTotalDuration += currentDuration;
                    currentDuration = parseFloat(parentFrameXML.getAttribute(CONST_A_DURATION));
                    j++;
                }
            }
            var boneFrameData = this.decodeFrame(frameXML, parentFrameXML, boneData, dataInfo);
            movBoneData.addFrameData(boneFrameData);
            boneFrameData.frameID = totalDuration;
            totalDuration += boneFrameData.duration;
            movBoneData.duration = totalDuration;
        }

        //Change rotation range from (-180 -- 180) to (-infinity -- infinity)
        var frames = movBoneData.frameList, pi = Math.PI;
        for (var i = frames.length - 1; i >= 0; i--) {
            if (i > 0) {
                var difSkewX = frames[i].skewX - frames[i - 1].skewX;
                var difSkewY = frames[i].skewY - frames[i - 1].skewY;

                if (difSkewX < -pi || difSkewX > pi) {
                    frames[i - 1].skewX = difSkewX < 0 ? frames[i - 1].skewX - 2 * pi : frames[i - 1].skewX + 2 * pi;
                }

                if (difSkewY < -pi || difSkewY > pi) {
                    frames[i - 1].skewY = difSkewY < 0 ? frames[i - 1].skewY - 2 * pi : frames[i - 1].skewY + 2 * pi;
                }
            }
        }

        var frameData = new FrameData();
        frameData.copy(movBoneData.frameList[movBoneData.frameList.length - 1]);
        frameData.frameID = movBoneData.duration;
        movBoneData.addFrameData(frameData);
        return movBoneData;
    },

    /**
     * Decodes json data of bone's movement.
     * @param {Object} json
     * @param {DataInfo} dataInfo
     * @returns {MovementBoneData}
     */
    decodeMovementBoneFromJson: function (json, dataInfo) {
        var movementBoneData = new MovementBoneData();
        movementBoneData.init();
        movementBoneData.delay = json[CONST_A_MOVEMENT_DELAY] || 0;

        var name = json[CONST_A_NAME];
        if(name)
            movementBoneData.name = name;

        var framesData = json[CONST_FRAME_DATA] || [];
        var length = framesData.length;
        for (var i = 0; i < length; i++) {
            var dic = json[CONST_FRAME_DATA][i];
            var frameData = this.decodeFrameFromJson(dic, dataInfo);
            movementBoneData.addFrameData(frameData);

            if (dataInfo.cocoStudioVersion < CONST_VERSION_COMBINED){
                frameData.frameID = movementBoneData.duration;
                movementBoneData.duration += frameData.duration;
            }
        }

        if (dataInfo.cocoStudioVersion < VERSION_CHANGE_ROTATION_RANGE) {
            //! Change rotation range from (-180 -- 180) to (-infinity -- infinity)
            var frames = movementBoneData.frameList;
            var pi = Math.PI;
            for (var i = frames.length - 1; i >= 0; i--) {
                if (i > 0) {
                    var difSkewX = frames[i].skewX - frames[i - 1].skewX;
                    var difSkewY = frames[i].skewY - frames[i - 1].skewY;

                    if (difSkewX < -pi || difSkewX > pi) {
                        frames[i - 1].skewX = difSkewX < 0 ? frames[i - 1].skewX - 2 * pi : frames[i - 1].skewX + 2 * pi;
                    }

                    if (difSkewY < -pi || difSkewY > pi) {
                        frames[i - 1].skewY = difSkewY < 0 ? frames[i - 1].skewY - 2 * pi : frames[i - 1].skewY + 2 * pi;
                    }
                }
            }
        }

        if (dataInfo.cocoStudioVersion < CONST_VERSION_COMBINED) {
            if (movementBoneData.frameList.length > 0) {
                var frameData = new FrameData();
                frameData.copy(movementBoneData.frameList[movementBoneData.frameList.length - 1]);
                movementBoneData.addFrameData(frameData);
                frameData.frameID = movementBoneData.duration;
            }
        }
        return movementBoneData;
    },

    /**
     * Decodes xml data of frame.
     * @param {XMLDocument} frameXML
     * @param {XMLDocument} parentFrameXml
     * @param {BoneData} boneData
     * @param {DataInfo} dataInfo
     * @returns {FrameData}
     */
    decodeFrame: function (frameXML, parentFrameXml, boneData, dataInfo) {
        var x = 0, y = 0, scale_x = 0, scale_y = 0, skew_x = 0, skew_y = 0, tweenRotate = 0;
        var duration = 0, displayIndex = 0, zOrder = 0, tweenEasing = 0, blendType = 0;

        var frameData = new FrameData();
        frameData.strMovement = frameXML.getAttribute(CONST_A_MOVEMENT) || "";
        frameData.movement = frameData.strMovement;
        frameData.strEvent = frameXML.getAttribute(CONST_A_EVENT) || "";
        frameData.event = frameData.strEvent;
        frameData.strSound = frameXML.getAttribute(CONST_A_SOUND) || "";
        frameData.sound = frameData.strSound;
        frameData.strSoundEffect = frameXML.getAttribute(CONST_A_SOUND_EFFECT) || "";
        frameData.soundEffect = frameData.strSoundEffect;

        var isTween = frameXML.getAttribute(CONST_A_TWEEN_FRAME);
        frameData.isTween = !(isTween !== undefined && (isTween === "false" || isTween === "0"));

        if (dataInfo.flashToolVersion >= CONST_VERSION_2_0) {
            x = frameXML.getAttribute(CONST_A_COCOS2DX_X);
            if(x){
                frameData.x = parseFloat(x);
                frameData.x *= this._positionReadScale;
            }
            y = frameXML.getAttribute(CONST_A_COCOS2DX_Y);
            if(y){
                frameData.y = -parseFloat(y);
                frameData.y *= this._positionReadScale;
            }
        } else {
            x = frameXML.getAttribute(CONST_A_X);
            if(x) {
                frameData.x = parseFloat(x);
                frameData.x *= this._positionReadScale;
            }
            y = frameXML.getAttribute(CONST_A_Y);
            if(y) {
                frameData.y = -parseFloat(y);
                frameData.y *= this._positionReadScale;
            }
        }

        scale_x = frameXML.getAttribute(CONST_A_SCALE_X);
        if( scale_x != null )
            frameData.scaleX = parseFloat(scale_x);
        scale_y = frameXML.getAttribute(CONST_A_SCALE_Y);
        if( scale_y != null )
            frameData.scaleY = parseFloat(scale_y);
        skew_x = frameXML.getAttribute(CONST_A_SKEW_X);
        if( skew_x != null )
            frameData.skewX = degreesToRadians(parseFloat(skew_x));
        skew_y = frameXML.getAttribute(CONST_A_SKEW_Y);
        if( skew_y != null )
            frameData.skewY = degreesToRadians(-parseFloat(skew_y));

        duration = frameXML.getAttribute(CONST_A_DURATION);
        if( duration != null )
            frameData.duration = parseFloat(duration);
        displayIndex = frameXML.getAttribute(CONST_A_DISPLAY_INDEX);
        if( displayIndex != null )
            frameData.displayIndex = parseFloat(displayIndex);
        zOrder = frameXML.getAttribute(CONST_A_Z);
        if( zOrder != null )
            frameData.zOrder = parseInt(zOrder);
        tweenRotate = frameXML.getAttribute(CONST_A_TWEEN_ROTATE);
        if( tweenRotate != null )
            frameData.tweenRotate = parseFloat(tweenRotate);

        blendType = frameXML.getAttribute(CONST_A_BLEND_TYPE);
        if ( blendType != null ) {
            var blendFunc = frameData.blendFunc;
            switch (blendType) {
                case BLEND_TYPE_NORMAL:
                    blendFunc.src = BLEND_SRC;
                    blendFunc.dst = BLEND_DST;
                    break;
                case BLEND_TYPE_ADD:
                    blendFunc.src = SRC_ALPHA;
                    blendFunc.dst = ONE;
                    break;
                case BLEND_TYPE_MULTIPLY:
                    blendFunc.src = DST_COLOR;
                    blendFunc.dst = ONE_MINUS_SRC_ALPHA;
                    break;
                case BLEND_TYPE_SCREEN:
                    blendFunc.src = ONE;
                    blendFunc.dst = ONE_MINUS_DST_COLOR;
                    break;
                default:
                    frameData.blendFunc.src = BLEND_SRC;
                    frameData.blendFunc.dst = BLEND_DST;
                    break;
            }
        }

        var colorTransformXML = frameXML.querySelectorAll(CONST_FRAME + " > " + CONST_A_COLOR_TRANSFORM);
        if (colorTransformXML && colorTransformXML.length > 0) {
            colorTransformXML = colorTransformXML[0];
            var alpha, red, green, blue;
            var alphaOffset, redOffset, greenOffset, blueOffset;

            alpha = parseFloat(colorTransformXML.getAttribute(CONST_A_ALPHA)) || 0;
            red = parseFloat(colorTransformXML.getAttribute(CONST_A_RED)) || 0;
            green = parseFloat(colorTransformXML.getAttribute(CONST_A_GREEN)) || 0;
            blue = parseFloat(colorTransformXML.getAttribute(CONST_A_BLUE)) || 0;

            alphaOffset = parseFloat(colorTransformXML.getAttribute(CONST_A_ALPHA_OFFSET)) || 0;
            redOffset = parseFloat(colorTransformXML.getAttribute(CONST_A_RED_OFFSET)) || 0;
            greenOffset = parseFloat(colorTransformXML.getAttribute(CONST_A_GREEN_OFFSET)) || 0;
            blueOffset = parseFloat(colorTransformXML.getAttribute(CONST_A_BLUE_OFFSET)) || 0;

            frameData.a = 2.55 * alphaOffset + alpha;
            frameData.r = 2.55 * redOffset + red;
            frameData.g = 2.55 * greenOffset + green;
            frameData.b = 2.55 * blueOffset + blue;

            frameData.isUseColorInfo = true;
        }

        var _easing = frameXML.getAttribute(CONST_A_TWEEN_EASING);
        if(_easing != null) {
            if(_easing != CONST_FL_NAN){
                tweenEasing = frameXML.getAttribute(CONST_A_TWEEN_EASING);
                if( tweenEasing )
                    frameData.tweenEasing = (tweenEasing === 2) ? TweenType.SINE_EASEINOUT : tweenEasing;
            } else
                frameData.tweenEasing = TweenType.LINEAR;
        }

        if (parentFrameXml) {
            //*  recalculate frame data from parent frame data, use for translate matrix
            var helpNode = new BaseData();
            if (dataInfo.flashToolVersion >= CONST_VERSION_2_0) {
                helpNode.x = parseFloat(parentFrameXml.getAttribute(CONST_A_COCOS2DX_X));
                helpNode.y = parseFloat(parentFrameXml.getAttribute(CONST_A_COCOS2DX_Y));
            } else {
                helpNode.x = parseFloat(parentFrameXml.getAttribute(CONST_A_X));
                helpNode.y = parseFloat(parentFrameXml.getAttribute(CONST_A_Y));
            }
            helpNode.skewX = parseFloat(parentFrameXml.getAttribute(CONST_A_SKEW_X));
            helpNode.skewY = parseFloat(parentFrameXml.getAttribute(CONST_A_SKEW_Y));

            helpNode.y = -helpNode.y;
            helpNode.skewX = degreesToRadians(helpNode.skewX);
            helpNode.skewY = degreesToRadians(-helpNode.skewY);
            TransformHelp.transformFromParent(frameData, helpNode);
        }
        return frameData;
    },

    /**
     * Decodes json data of frame.
     * @param {Object} json
     * @param {DataInfo} dataInfo
     * @returns {FrameData}
     */
    decodeFrameFromJson: function (json, dataInfo) {
        var frameData = new FrameData();

        this.decodeNodeFromJson(frameData, json, dataInfo);

        frameData.tweenEasing = json[CONST_A_TWEEN_EASING] || TweenType.LINEAR;
        frameData.displayIndex = json[CONST_A_DISPLAY_INDEX];
        var bd_src = json[CONST_A_BLEND_SRC] == null ? BLEND_SRC : json[CONST_A_BLEND_SRC];
        var bd_dst = json[CONST_A_BLEND_DST] == null ? BLEND_DST : json[CONST_A_BLEND_DST];
        frameData.blendFunc.src = bd_src;
        frameData.blendFunc.dst = bd_dst;
        frameData.isTween = json[CONST_A_TWEEN_FRAME] == null ? true : json[CONST_A_TWEEN_FRAME];

        var event = json[CONST_A_EVENT];
        if(event != null){
            frameData.strEvent = event;
            frameData.event = event;
        }

        if (dataInfo.cocoStudioVersion < CONST_VERSION_COMBINED)
            frameData.duration = json[CONST_A_DURATION] == null ? 1 : json[CONST_A_DURATION];
        else
            frameData.frameID = json[CONST_A_FRAME_INDEX];

        var twEPs = json[CONST_A_EASING_PARAM] || [];
        for (var i = 0; i < twEPs.length; i++) {
            frameData.easingParams[i] = twEPs[i];
        }

        return frameData;
    },

    /**
     * Decodes xml data of texture
     * @param {XMLDocument} textureXML
     * @param {DataInfo} dataInfo
     * @returns {TextureData}
     */
    decodeTexture: function (textureXML, dataInfo) {
        var textureData = new TextureData();
        textureData.init();

        if (textureXML.getAttribute(CONST_A_NAME)) {
            textureData.name = textureXML.getAttribute(CONST_A_NAME);
        }

        var px, py;

        if (dataInfo.flashToolVersion >= CONST_VERSION_2_0) {
            px = parseFloat(textureXML.getAttribute(CONST_A_COCOS2D_PIVOT_X)) || 0;
            py = parseFloat(textureXML.getAttribute(CONST_A_COCOS2D_PIVOT_Y)) || 0;
        } else {
            px = parseFloat(textureXML.getAttribute(CONST_A_PIVOT_X)) || 0;
            py = parseFloat(textureXML.getAttribute(CONST_A_PIVOT_Y)) || 0;
        }

        var width = parseFloat(textureXML.getAttribute(CONST_A_WIDTH)) || 0;
        var height = parseFloat(textureXML.getAttribute(CONST_A_HEIGHT)) || 0;

        var anchorPointX = px / width;
        var anchorPointY = (height - py) / height;

        textureData.pivotX = anchorPointX;
        textureData.pivotY = anchorPointY;

        var contoursXML = textureXML.querySelectorAll(CONST_SUB_TEXTURE + " > " + CONST_CONTOUR);
        for (var i = 0; i < contoursXML.length; i++) {
            textureData.addContourData(this.decodeContour(contoursXML[i], dataInfo));
        }
        return textureData;
    },

    /**
     * Decodes json data of Texture.
     * @param json
     * @returns {TextureData}
     */
    decodeTextureFromJson: function (json) {
        var textureData = new TextureData();
        textureData.init();

        var name = json[CONST_A_NAME];
        if(name != null)
            textureData.name = name;

        textureData.width = json[CONST_A_WIDTH] || 0;
        textureData.height = json[CONST_A_HEIGHT] || 0;
        textureData.pivotX = json[CONST_A_PIVOT_X] || 0;
        textureData.pivotY = json[CONST_A_PIVOT_Y] || 0;

        var contourDataList = json[CONST_CONTOUR_DATA] || [];
        for (var i = 0; i < contourDataList.length; i++) {
            textureData.contourDataList.push(this.decodeContourFromJson(contourDataList[i]));
        }
        return textureData;
    },

    /**
     * Decodes xml data of contour.
     * @param {XMLDocument} contourXML
     * @param {DataInfo} dataInfo
     * @returns {ContourData}
     */
    decodeContour: function (contourXML, dataInfo) {
        var contourData = new ContourData();
        contourData.init();

        var vertexDatasXML = contourXML.querySelectorAll(CONST_CONTOUR + " > " + CONST_CONTOUR_VERTEX);
        var vertexDataXML;
        for (var i = 0; i < vertexDatasXML.length; i++) {
            vertexDataXML = vertexDatasXML[i];
            var vertex = new Point(0, 0);
            vertex.x = parseFloat(vertexDataXML.getAttribute(CONST_A_X)) || 0;
            vertex.y = parseFloat(vertexDataXML.getAttribute(CONST_A_Y)) || 0;

            vertex.y = - vertex.y;
            contourData.vertexList.push(vertex);
        }
        return contourData;
    },

    /**
     * Decodes json data of contour.
     * @param {Object} json
     * @returns {ContourData}
     */
    decodeContourFromJson: function (json) {
        var contourData = new ContourData();
        contourData.init();

        var vertexPointList = json[CONST_VERTEX_POINT] || [];
        var len = vertexPointList.length;
        for (var i = 0; i < len; i++) {
            var dic = vertexPointList[i];
            var vertex = new Point(0, 0);
            vertex.x = dic[CONST_A_X] || 0;
            vertex.y = dic[CONST_A_Y] || 0;
            contourData.vertexList.push(vertex);
        }
        return contourData;
    },

    /**
     * Adds json armature data to armature data manager.
     * @param {Object} dic json armature data
     * @param {DataInfo} dataInfo
     */
    addDataFromJsonCache: function (dic, dataInfo) {
        dataInfo.contentScale = dic[CONST_CONTENT_SCALE] == null ? 1 : dic[CONST_CONTENT_SCALE];

        // Decode armatures
        var armatureDataArr = dic[CONST_ARMATURE_DATA] || [], i;
        var armatureData;
        for (i = 0; i < armatureDataArr.length; i++) {
            armatureData = this.decodeArmatureFromJSON(armatureDataArr[i], dataInfo);
            armatureDataManager.addArmatureData(armatureData.name, armatureData, dataInfo.filename);
        }

        // Decode animations
        var animationDataArr = dic[CONST_ANIMATION_DATA] || [];
        var animationData;
        for (i = 0; i < animationDataArr.length; i++) {
            animationData = this.decodeAnimationFromJson(animationDataArr[i], dataInfo);
            armatureDataManager.addAnimationData(animationData.name, animationData, dataInfo.filename);
        }

        // Decode textures
        var textureDataArr = dic[CONST_TEXTURE_DATA] || [];
        var textureData;
        for (i = 0; i < textureDataArr.length; i++) {
            textureData = this.decodeTextureFromJson(textureDataArr[i], dataInfo);
            armatureDataManager.addTextureData(textureData.name, textureData, dataInfo.filename);
        }

        // Auto load sprite file
        var autoLoad = dataInfo.asyncStruct == null ? armatureDataManager.isAutoLoadSpriteFile() : dataInfo.asyncStruct.autoLoadSpriteFile;
//        if (isLoadSpriteFrame) {
        if (autoLoad) {
            var configFiles = dic[CONST_CONFIG_FILE_PATH] || [];
            var locFilePath, locPos, locPlistPath, locImagePath;
            for (i = 0; i < configFiles.length; i++) {
                locFilePath = configFiles[i];
                locPos = locFilePath.lastIndexOf(".");
                locFilePath = locFilePath.substring(0, locPos);
                locPlistPath = dataInfo.basefilePath + locFilePath + ".plist";
                locImagePath = dataInfo.basefilePath + locFilePath + ".png";
                armatureDataManager.addSpriteFrameFromFile(locPlistPath, locImagePath, dataInfo.filename);
            }
        }

        armatureData = null;
        animationData = null;
    },

    /**
     * Decodes json data of node.
     * @param node
     * @param json
     * @param dataInfo
     */
    decodeNodeFromJson: function (node, json, dataInfo) {
        node.x = json[CONST_A_X] * this._positionReadScale;
        node.y = json[CONST_A_Y] * this._positionReadScale;

        node.x *= dataInfo.contentScale;
        node.y *= dataInfo.contentScale;

        node.zOrder = json[CONST_A_Z];

        node.skewX = json[CONST_A_SKEW_X] || 0;
        node.skewY = json[CONST_A_SKEW_Y] || 0;
        node.scaleX = json[CONST_A_SCALE_X] == null ? 1 : json[CONST_A_SCALE_X];
        node.scaleY = json[CONST_A_SCALE_Y] == null ? 1 : json[CONST_A_SCALE_Y];

        var colorDic;
        if (dataInfo.cocoStudioVersion < VERSION_COLOR_READING) {
            colorDic = json[0];
            if (colorDic){
                node.a = colorDic[CONST_A_ALPHA] == null ? 255 : colorDic[CONST_A_ALPHA];
                node.r = colorDic[CONST_A_RED] == null ? 255 : colorDic[CONST_A_RED];
                node.g = colorDic[CONST_A_GREEN] == null ? 255 : colorDic[CONST_A_GREEN];
                node.b = colorDic[CONST_A_BLUE] == null ? 255 : colorDic[CONST_A_BLUE];
                node.isUseColorInfo = true;
            }
        } else {
            colorDic = json[CONST_COLOR_INFO] || null;
            if (colorDic){
                node.a = colorDic[CONST_A_ALPHA] == null ? 255 : colorDic[CONST_A_ALPHA];
                node.r = colorDic[CONST_A_RED] == null ? 255 : colorDic[CONST_A_RED];
                node.g = colorDic[CONST_A_GREEN] == null ? 255 : colorDic[CONST_A_GREEN];
                node.b = colorDic[CONST_A_BLUE] == null ? 255 : colorDic[CONST_A_BLUE];
                node.isUseColorInfo = true;
            }
        }
    },

    clear: function () {
        this._configFileList = [];
        this._asyncRefCount = 0;
        this._asyncRefTotalCount = 0;
    },

    _asyncCallBack: function (selector, target, percent) {
        if(selector && isFunction(selector))
            selector.call(target, percent);
        if(target && selector && typeof selector === 'string')
            target[selector](percent);
    },
    /**
     * find the base file path
     * @param filePath
     * @returns {String}
     * @private
     */
    _initBaseFilePath: function (filePath) {
        var path = filePath;
        var pos = path.lastIndexOf("/");
        if (pos > -1)
            path = path.substr(0, pos + 1);
        else
            path = "";
        return path;
    },

    /**
     * Adds xml armature data to armature data manager.
     * @param {XMLDocument} xml
     * @param {DataInfo} dataInfo
     */
    addDataFromXML: function (xml, dataInfo) {
        /*
         *  Need to get the full path of the xml file, or the Tiny XML can't find the xml at IOS
         */
        var xmlStr = Loader.getInstance().getRes(xml);
        if (!xmlStr) throw new Error("Please load the resource first : " + xml);
        var skeletonXML = new SAXParser().parse(xmlStr);
        var skeleton = skeletonXML.documentElement;
        if (skeleton)
            this.addDataFromCache(skeleton, dataInfo);
    },

    /**
     * Adds json armature data to armature data manager.
     * @param {String} filePath
     * @param {DataInfo} dataInfo
     */
    addDataFromJson: function (filePath, dataInfo) {
        var fileContent = Loader.getInstance().getRes(filePath);
        this.addDataFromJsonCache(fileContent, dataInfo);
    }
};