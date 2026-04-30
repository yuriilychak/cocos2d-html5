import { NewClass } from '@aspect/core';

export class TInfo extends NewClass {

    constructor (c, f) {
        super();
        if (f) {
            this._className = c;
            this._fun = f;
        } else {
            this._className = c._className;
            this._fun = c._fun;
        }
        ccs.objectFactory.registerType(this);
    }
};

ccs.TInfo = TInfo;
