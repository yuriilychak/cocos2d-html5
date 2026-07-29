import { BaseClass } from '@aspect/core';

import { objectFactory } from "./object-factory.js";
export class TInfo extends BaseClass {

    constructor (c, f) {
        super();
        if (f) {
            this.typeName = c;
            this._fun = f;
        } else {
            this.typeName = c.name;
            this._fun = c._fun;
        }
        objectFactory.registerType(this);
    }
};
