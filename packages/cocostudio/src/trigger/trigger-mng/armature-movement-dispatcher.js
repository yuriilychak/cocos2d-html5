import { BaseClass } from '@aspect/core';

/**
 * The armature movement dispatcher for trigger manager.
 */
export class ArmatureMovementDispatcher extends BaseClass {

    /**
     * Constructor of ArmatureMovementDispatcher.
     */
    constructor () {
        super();
        this._mapEventAnimation = [];
    }

    /**
     * Calls armature movement events.
     * @param {Armature} armature
     * @param {Number} movementType
     * @param {String} movementID
     */
    animationEvent (armature, movementType, movementID) {
        var locEventAni, locTarget, locFunc;
        for (var i = 0; i < this._mapEventAnimation.length; i++) {
            locEventAni = this._mapEventAnimation[i];
            locTarget = locEventAni[0];
            locFunc = locEventAni[1];
            if (locFunc)
                locFunc.call(locTarget, armature, movementType, movementID);
        }
    }

    /**
     * Adds animation event callback to event animation list
     * @param {function} callFunc
     * @param {Object|null} [target]
     */
    addAnimationEventCallBack (callFunc, target) {
        this._mapEventAnimation.push([target, callFunc]);
    }

    /**
     * Removes animation event callback from trigger manager.
     * @param {function} callFunc
     * @param {Object|null} [target]
     */
    removeAnimationEventCallBack (callFunc, target) {
        var locEventAni;
        for (var i = 0; i < this._mapEventAnimation.length; i++) {
            locEventAni = this._mapEventAnimation[i];
            if (locEventAni[0] === target) {
                this._mapEventAnimation.splice(i, 1);
            }
        }
    }
};
