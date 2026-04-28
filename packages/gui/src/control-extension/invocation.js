import { NewClass, isString } from "@aspect/core";

export class Invocation extends NewClass {
    _action = null;
    _target = null;
    _controlEvent = null;

    constructor(target, action, controlEvent) {
        super();
        this._target = target;
        this._action = action;
        this._controlEvent = controlEvent;
    }

    getAction() {
        return this._action;
    }

    getTarget() {
        return this._target;
    }

    getControlEvent() {
        return this._controlEvent;
    }

    invoke(sender) {
        if (this._target && this._action) {
            if (isString(this._action)) {
                this._target[this._action](sender, this._controlEvent);
            } else {
                this._action.call(this._target, sender, this._controlEvent);
            }
        }
    }
}
