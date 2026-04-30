import { assert, log } from "@aspect/core";

import { fmodf } from "../../utils/util-math.js";
import { ANIMATION_TYPE_LOOP_FRONT, ANIMATION_TYPE_MAX, ANIMATION_TYPE_NO_LOOP, ANIMATION_TYPE_SINGLE_FRAME, ANIMATION_TYPE_TO_LOOP_FRONT, ProcessBase } from "../process-base.js";
import { MovementEventType } from "./constants.js";
import { FrameEvent, MovementEvent } from "./utils.js";
/**
 * The Animation class for Armature, it plays armature animation, and controls speed scale and manages animation frame.
 *
 * @param {Armature} [armature] The armature
 *
 * @property {AnimationData}    animationData       - Animation data
 * @property {Object}               userObject          - User custom object
 * @property {Boolean}              ignoreFrameEvent    - Indicate whether the frame event is ignored
 * @property {Number}               speedScale          - Animation play speed scale
 * @property {Number}               animationScale      - Animation play speed scale
 */
export class ArmatureAnimation extends ProcessBase {

    constructor(armature) {
        super();

        this._tweenList = [];
        this._movementList = [];
        this._frameEventQueue = [];
        this._movementEventQueue = [];
        this._armature = null;

        armature && this.init(armature);
    }

    get speedScale() { return this.getSpeedScale(); }
    set speedScale(v) { this.setSpeedScale(v); }

    get animationScale() { return this.getAnimationScale(); }
    set animationScale(v) { this.setAnimationScale(v); }

    /**
     * Initializes with an armature object
     * @param {Armature} armature
     * @return {Boolean}
     */
    init(armature) {
        this._armature = armature;
        this._tweenList.length = 0;
        return true;
    }

    /**
     * Pauses armature animation.
     */
    pause() {
        var locTweenList = this._tweenList;
        for (var i = 0; i < locTweenList.length; i++)
            locTweenList[i].pause();
        super.pause();
    }

    /**
     * Resumes armature animation.
     */
    resume() {
        var locTweenList = this._tweenList;
        for (var i = 0; i < locTweenList.length; i++)
            locTweenList[i].resume();
        super.resume();
    }

    /**
     * Stops armature animation.
     */
    stop() {
        var locTweenList = this._tweenList;
        for (var i = 0; i < locTweenList.length; i++)
            locTweenList[i].stop();
        locTweenList.length = 0;
        super.stop();
    }

    /**
     * Sets animation play speed scale.
     * @deprecated since v3.0, please use setSpeedScale instead.
     * @param {Number} animationScale
     */
    setAnimationScale(animationScale) {
        this.setSpeedScale(animationScale);
    }

    /**
     * Returns animation play speed scale.
     * @deprecated since v3.0, please use getSpeedScale instead.
     * @returns {Number}
     */
    getAnimationScale() {
        return this.getSpeedScale();
    }

    /**
     * Sets animation play speed scale.
     * @param {Number} speedScale
     */
    setSpeedScale(speedScale) {
        if (speedScale === this._speedScale)
            return;
        this._speedScale = speedScale;
        this._processScale = !this._movementData ? this._speedScale : this._speedScale * this._movementData.scale;
        var dict = this._armature.getBoneDic();
        for (var key in dict) {
            var bone = dict[key];
            bone.getTween().setProcessScale(this._processScale);
            if (bone.getChildArmature())
                bone.getChildArmature().getAnimation().setSpeedScale(this._processScale);
        }
    }

    /**
     * Returns animation play speed scale.
     * @returns {Number}
     */
    getSpeedScale() {
        return this._speedScale;
    }

    /**
     * play animation by animation name.
     * @param {String} animationName The animation name you want to play
     * @param {Number} [durationTo=-1]
     *         the frames between two animation changing-over.It's meaning is changing to this animation need how many frames
     *         -1 : use the value from MovementData get from flash design panel
     * @param {Number} [loop=-1]
     *          Whether the animation is loop.
     *         loop < 0 : use the value from MovementData get from flash design panel
     *         loop = 0 : this animation is not loop
     *         loop > 0 : this animation is loop
     * @example
     * // example
     * armature.getAnimation().play("run",-1,1);//loop play
     * armature.getAnimation().play("run",-1,0);//not loop play
     */
    play(animationName, durationTo, loop) {
        assert(this._animationData, "this.animationData can not be null");

        this._movementData = this._animationData.getMovement(animationName);
        assert(this._movementData, "this._movementData can not be null");

        durationTo = (durationTo === undefined) ? -1 : durationTo;
        loop = (loop === undefined) ? -1 : loop;

        //! Get key frame count
        this._rawDuration = this._movementData.duration;
        this._movementID = animationName;
        this._processScale = this._speedScale * this._movementData.scale;

        //! Further processing parameters
        durationTo = (durationTo === -1) ? this._movementData.durationTo : durationTo;
        var durationTween = this._movementData.durationTween === 0 ? this._rawDuration : this._movementData.durationTween;

        var tweenEasing = this._movementData.tweenEasing;
        //loop = (!loop || loop < 0) ? this._movementData.loop : loop;
        loop = (loop < 0) ? this._movementData.loop : loop;
        this._onMovementList = false;

        super.play(durationTo, durationTween, loop, tweenEasing);

        if (this._rawDuration === 0)
            this._loopType = ANIMATION_TYPE_SINGLE_FRAME;
        else {
            this._loopType = loop ? ANIMATION_TYPE_TO_LOOP_FRONT : ANIMATION_TYPE_NO_LOOP;
            this._durationTween = durationTween;
        }

        this._tweenList.length = 0;

        var movementBoneData, map = this._armature.getBoneDic();
        for(var element in map) {
            var bone = map[element];
            movementBoneData = this._movementData.movBoneDataDic[bone.getName()];

            var tween = bone.getTween();
            if(movementBoneData && movementBoneData.frameList.length > 0) {
                this._tweenList.push(tween);
                movementBoneData.duration = this._movementData.duration;
                tween.play(movementBoneData, durationTo, durationTween, loop, tweenEasing);
                tween.setProcessScale(this._processScale);

                if (bone.getChildArmature()) {
                    bone.getChildArmature().getAnimation().setSpeedScale(this._processScale);
                    if (!bone.getChildArmature().getAnimation().isPlaying())
                        bone.getChildArmature().getAnimation().playWithIndex(0);
                }
            } else {
                if(!bone.isIgnoreMovementBoneData()){
                    //! this bone is not include in this movement, so hide it
                    bone.getDisplayManager().changeDisplayWithIndex(-1, false);
                    tween.stop();
                }
            }
        }
        this._armature.update(0);
    }

    /**
     * Plays animation with index, the other param is the same to play.
     * @param {Number} animationIndex
     * @param {Number} durationTo
     * @param {Number} durationTween
     * @param {Number} loop
     * @param {Number} [tweenEasing]
     * @deprecated since v3.0, please use playWithIndex instead.
     */
    playByIndex(animationIndex, durationTo, durationTween, loop, tweenEasing) {
        log("playByIndex is deprecated. Use playWithIndex instead.");
        this.playWithIndex(animationIndex, durationTo, loop);
    }

    /**
     * Plays animation with index, the other param is the same to play.
     * @param {Number|Array} animationIndex
     * @param {Number} durationTo
     * @param {Number} loop
     */
    playWithIndex(animationIndex, durationTo, loop) {
        var movName = this._animationData.movementNames;
        assert((animationIndex > -1) && (animationIndex < movName.length));

        var animationName = movName[animationIndex];
        this.play(animationName, durationTo, loop);
    }

    /**
     * Plays animation with names
     * @param {Array} movementNames
     * @param {Number} durationTo
     * @param {Boolean} loop
     */
    playWithNames(movementNames, durationTo, loop) {
        durationTo = (durationTo === undefined) ? -1 : durationTo;
        loop = (loop === undefined) ? true : loop;

        this._movementListLoop = loop;
        this._movementListDurationTo = durationTo;
        this._onMovementList = true;
        this._movementIndex = 0;
        if(movementNames instanceof Array)
            this._movementList = movementNames;
        else
            this._movementList.length = 0;
        this.updateMovementList();
    }

    /**
     * Plays animation by indexes
     * @param {Array} movementIndexes
     * @param {Number} durationTo
     * @param {Boolean} loop
     */
    playWithIndexes(movementIndexes, durationTo, loop) {
        durationTo = (durationTo === undefined) ? -1 : durationTo;
        loop = (loop === undefined) ? true : loop;

        this._movementList.length = 0;
        this._movementListLoop = loop;
        this._movementListDurationTo = durationTo;
        this._onMovementList = true;
        this._movementIndex = 0;

        var movName = this._animationData.movementNames;

        for (var i = 0; i < movementIndexes.length; i++) {
            var name = movName[movementIndexes[i]];
            this._movementList.push(name);
        }

        this.updateMovementList();
    }

    /**
     * <p>
     * Goes to specified frame and plays current movement.                                  <br/>
     * You need first switch to the movement you want to play, then call this function.     <br/>
     *                                                                                      <br/>
     * example : playByIndex(0);                                                            <br/>
     *           gotoAndPlay(0);                                                            <br/>
     *           playByIndex(1);                                                            <br/>
     *           gotoAndPlay(0);                                                            <br/>
     *           gotoAndPlay(15);                                                           <br/>
     * </p>
     * @param {Number} frameIndex
     */
    gotoAndPlay(frameIndex) {
        if (!this._movementData || frameIndex < 0 || frameIndex >= this._movementData.duration) {
            log("Please ensure you have played a movement, and the frameIndex is in the range.");
            return;
        }

        var ignoreFrameEvent = this._ignoreFrameEvent;
        this._ignoreFrameEvent = true;
        this._isPlaying = true;
        this._isComplete = this._isPause = false;

        super.gotoFrame(frameIndex);
        this._currentPercent = this._curFrameIndex / (this._movementData.duration - 1);
        this._currentFrame = this._nextFrameIndex * this._currentPercent;

        var locTweenList = this._tweenList;
        for (var i = 0; i < locTweenList.length; i++)
            locTweenList[i].gotoAndPlay(frameIndex);
        this._armature.update(0);
        this._ignoreFrameEvent = ignoreFrameEvent;
    }

    /**
     * Goes to specified frame and pauses current movement.
     * @param {Number} frameIndex
     */
    gotoAndPause(frameIndex) {
        this.gotoAndPlay(frameIndex);
        this.pause();
    }

    /**
     * Returns the length of armature's movements
     * @return {Number}
     */
    getMovementCount() {
        return this._animationData.getMovementCount();
    }

    /**
     * Updates the state of Tween list, calls frame event's callback and calls movement event's callback.
     * @param {Number} dt
     */
    update(dt) {
        super.update(dt);

        var locTweenList = this._tweenList;
        for (var i = 0; i < locTweenList.length; i++)
            locTweenList[i].update(dt);

        var frameEvents = this._frameEventQueue, event;
        while (frameEvents.length > 0) {
            event = frameEvents.shift();
            this._ignoreFrameEvent = true;
            if(this._frameEventCallFunc)
                this._frameEventCallFunc.call(this._frameEventTarget, event.bone, event.frameEventName, event.originFrameIndex, event.currentFrameIndex);
            if(this._frameEventListener)
                this._frameEventListener(event.bone, event.frameEventName, event.originFrameIndex, event.currentFrameIndex);
            this._ignoreFrameEvent = false;
        }

        var movementEvents = this._movementEventQueue;
        while (movementEvents.length > 0) {
            event = movementEvents.shift();
            if(this._movementEventCallFunc)
                this._movementEventCallFunc.call(this._movementEventTarget, event.armature, event.movementType, event.movementID);
            if (this._movementEventListener)
                this._movementEventListener(event.armature, event.movementType, event.movementID);
        }
    }

    /**
     * Updates will call this handler, you can handle your logic here
     */
    updateHandler() {      //TODO set it to protected in v3.1
        var locCurrentPercent = this._currentPercent;
        if (locCurrentPercent >= 1) {
            switch (this._loopType) {
                case ANIMATION_TYPE_NO_LOOP:
                    this._loopType = ANIMATION_TYPE_MAX;
                    this._currentFrame = (locCurrentPercent - 1) * this._nextFrameIndex;
                    locCurrentPercent = this._currentFrame / this._durationTween;
                    if (locCurrentPercent < 1.0) {
                        this._nextFrameIndex = this._durationTween;
                        this.movementEvent(this._armature, MovementEventType.start, this._movementID);
                        break;
                    }
                    break;
                case ANIMATION_TYPE_MAX:
                case ANIMATION_TYPE_SINGLE_FRAME:
                    locCurrentPercent = 1;
                    this._isComplete = true;
                    this._isPlaying = false;

                    this.movementEvent(this._armature, MovementEventType.complete, this._movementID);

                    this.updateMovementList();
                    break;
                case ANIMATION_TYPE_TO_LOOP_FRONT:
                    this._loopType = ANIMATION_TYPE_LOOP_FRONT;
                    locCurrentPercent = fmodf(locCurrentPercent, 1);
                    this._currentFrame = this._nextFrameIndex === 0 ? 0 : fmodf(this._currentFrame, this._nextFrameIndex);
                    this._nextFrameIndex = this._durationTween > 0 ? this._durationTween : 1;
                    this.movementEvent(this, MovementEventType.start, this._movementID);
                    break;
                default:
                    //locCurrentPercent = fmodf(locCurrentPercent, 1);
                    this._currentFrame = fmodf(this._currentFrame, this._nextFrameIndex);
                    this._toIndex = 0;
                    this.movementEvent(this._armature, MovementEventType.loopComplete, this._movementID);
                    break;
            }
            this._currentPercent = locCurrentPercent;
        }
    }

    /**
     * Returns the Id of current movement
     * @returns {String}
     */
    getCurrentMovementID() {
        if (this._isComplete)
            return "";
        return this._movementID;
    }

    /**
     * Sets movement event callback to animation.
     * @param {function} callFunc
     * @param {Object} target
     */
    setMovementEventCallFunc(callFunc, target) {
        if(arguments.length === 1){
            this._movementEventListener = callFunc;
        }else if(arguments.length === 2){
            this._movementEventTarget = target;
            this._movementEventCallFunc = callFunc;
        }
    }

    /**
     * Sets frame event callback to animation.
     * @param {function} callFunc
     * @param {Object} target
     */
    setFrameEventCallFunc(callFunc, target) {
        if(arguments.length === 1){
            this._frameEventListener = callFunc;
        }else if(arguments.length === 2){
            this._frameEventTarget = target;
            this._frameEventCallFunc = callFunc;
        }
    }

    /**
     * Sets user object to animation.
     * @param {Object} userObject
     */
    setUserObject(userObject) {
        this._userObject = userObject;
    }

    /**
     * Emits a frame event
     * @param {Bone} bone
     * @param {String} frameEventName
     * @param {Number} originFrameIndex
     * @param {Number} currentFrameIndex
     */
    frameEvent(bone, frameEventName, originFrameIndex, currentFrameIndex) {
        if ((this._frameEventTarget && this._frameEventCallFunc) || this._frameEventListener) {
            var frameEvent = new FrameEvent();
            frameEvent.bone = bone;
            frameEvent.frameEventName = frameEventName;
            frameEvent.originFrameIndex = originFrameIndex;
            frameEvent.currentFrameIndex = currentFrameIndex;
            this._frameEventQueue.push(frameEvent);
        }
    }

    /**
     * Emits a movement event
     * @param {Armature} armature
     * @param {Number} movementType
     * @param {String} movementID
     */
    movementEvent(armature, movementType, movementID) {
        if ((this._movementEventTarget && this._movementEventCallFunc) || this._movementEventListener) {
            var event = new MovementEvent();
            event.armature = armature;
            event.movementType = movementType;
            event.movementID = movementID;
            this._movementEventQueue.push(event);
        }
    }

    /**
     * Updates movement list.
     */
    updateMovementList() {
        if (this._onMovementList) {
            var movementObj, locMovementList = this._movementList;
            if (this._movementListLoop) {
                movementObj = locMovementList[this._movementIndex];
                this.play(movementObj, movementObj.durationTo, 0);
                this._movementIndex++;
                if (this._movementIndex >= locMovementList.length)
                    this._movementIndex = 0;
            } else {
                if (this._movementIndex < locMovementList.length) {
                    movementObj = locMovementList[this._movementIndex];
                    this.play(movementObj, movementObj.durationTo, 0);
                    this._movementIndex++;
                } else
                    this._onMovementList = false;
            }
            this._onMovementList = true;
        }
    }

    /**
     * Sets animation data to animation.
     * @param {AnimationData} data
     */
    setAnimationData(data) {
        if(this._animationData !== data)
            this._animationData = data;
    }

    /**
     * Returns animation data of animation.
     * @return {AnimationData}
     */
    getAnimationData() {
        return this._animationData;
    }

    /**
     * Returns the user object of animation.
     * @return {Object}
     */
    getUserObject() {
        return this._userObject;
    }

    /**
     * Determines if the frame event is ignored
     * @returns {boolean}
     */
    isIgnoreFrameEvent() {
        return this._ignoreFrameEvent;
    }

};

