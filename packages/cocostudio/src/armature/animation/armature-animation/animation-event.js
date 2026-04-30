import { NewClass } from "@aspect/core";

/**
 * The animation event class, it has the callback, target and arguments.
 * @deprecated since v3.0.
 */
export class AnimationEvent extends NewClass {

    /**
     * Constructor of AnimationEvent
     * @param {function} callFunc
     * @param {object} target
     * @param {object} [data]
     */
    constructor(callFunc,target, data) {
        super();
        this._data = data;
        this._callFunc = callFunc;
        this._selectorTarget = target;
    }
    call() {
        if (this._callFunc)
            this._callFunc.apply(this._selectorTarget, this._arguments);
    }
    setArguments(args) {
        this._arguments = args;
    }

};

ccs.AnimationEvent = AnimationEvent;
