import { NewClass } from '@aspect/core';

import { objectFactory } from "./object-factory.js";
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
        objectFactory.registerType(this);
    }
};

