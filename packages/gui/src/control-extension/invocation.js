export class Invocation {
    _action = null;
    _target = null;
    _controlEvent = null;

    constructor(target, action, controlEvent) {
        this._target = target;
        this._action = action;
        this._controlEvent = controlEvent;
    }

    get action() {
        return this._action;
    }

    get target() {
        return this._target;
    }

    get controlEvent() {
        return this._controlEvent;
    }

    invoke(sender) {
        if (!this._target || !this._action) {
            return;
        }
        
        if (typeof this._action === "string") {
            this._target[this._action](sender, this._controlEvent);
        } else {
            this._action.call(this._target, sender, this._controlEvent);
        }
    }
}
