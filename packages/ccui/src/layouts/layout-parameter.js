import { NewClass, isObject } from '@aspect/core';

export class Margin extends NewClass {
    constructor(margin, top, right, bottom) {
        super();
        this.left = 0;
        this.top = 0;
        this.right = 0;
        this.bottom = 0;
        if (margin !== undefined && top === undefined) {
            this.left = margin.left;
            this.top = margin.top;
            this.right = margin.right;
            this.bottom = margin.bottom;
        }
        if (bottom !== undefined) {
            this.left = margin;
            this.top = top;
            this.right = right;
            this.bottom = bottom;
        }
    }

    setMargin(l, t, r, b) {
        this.left = l;
        this.top = t;
        this.right = r;
        this.bottom = b;
    }

    equals(target) {
        return (this.left === target.left && this.top === target.top && this.right === target.right && this.bottom === target.bottom);
    }
}

export function MarginZero() {
    return new Margin(0, 0, 0, 0);
}

export class LayoutParameter extends NewClass {
    constructor() {
        super();
        this._margin = new Margin();
        this._layoutParameterType = LayoutParameter.NONE;
    }

    setMargin(margin) {
        if (isObject(margin)) {
            this._margin.left = margin.left;
            this._margin.top = margin.top;
            this._margin.right = margin.right;
            this._margin.bottom = margin.bottom;
        } else {
            this._margin.left = arguments[0];
            this._margin.top = arguments[1];
            this._margin.right = arguments[2];
            this._margin.bottom = arguments[3];
        }
    }

    getMargin() {
        return this._margin;
    }

    getLayoutType() {
        return this._layoutParameterType;
    }

    clone() {
        var parameter = this._createCloneInstance();
        parameter._copyProperties(this);
        return parameter;
    }

    _createCloneInstance() {
        return new LayoutParameter();
    }

    _copyProperties(model) {
        this._margin.bottom = model._margin.bottom;
        this._margin.left = model._margin.left;
        this._margin.right = model._margin.right;
        this._margin.top = model._margin.top;
    }
}

LayoutParameter.NONE = 0;
LayoutParameter.LINEAR = 1;
LayoutParameter.RELATIVE = 2;

export class LinearLayoutParameter extends LayoutParameter {
    constructor() {
        super();
        this._linearGravity = LinearLayoutParameter.NONE;
        this._layoutParameterType = LayoutParameter.LINEAR;
    }

    setGravity(gravity) {
        this._linearGravity = gravity;
    }

    getGravity() {
        return this._linearGravity;
    }

    _createCloneInstance() {
        return new LinearLayoutParameter();
    }

    _copyProperties(model) {
        super._copyProperties(model);
        if (model instanceof LinearLayoutParameter)
            this.setGravity(model._linearGravity);
    }
}

LinearLayoutParameter.NONE = 0;
LinearLayoutParameter.LEFT = 1;
LinearLayoutParameter.TOP = 2;
LinearLayoutParameter.RIGHT = 3;
LinearLayoutParameter.BOTTOM = 4;
LinearLayoutParameter.CENTER_VERTICAL = 5;
LinearLayoutParameter.CENTER_HORIZONTAL = 6;

export class RelativeLayoutParameter extends LayoutParameter {
    constructor() {
        super();
        this._relativeAlign = RelativeLayoutParameter.NONE;
        this._relativeWidgetName = "";
        this._relativeLayoutName = "";
        this._put = false;
        this._layoutParameterType = LayoutParameter.RELATIVE;
    }

    setAlign(align) {
        this._relativeAlign = align;
    }

    getAlign() {
        return this._relativeAlign;
    }

    setRelativeToWidgetName(name) {
        this._relativeWidgetName = name;
    }

    getRelativeToWidgetName() {
        return this._relativeWidgetName;
    }

    setRelativeName(name) {
        this._relativeLayoutName = name;
    }

    getRelativeName() {
        return this._relativeLayoutName;
    }

    _createCloneInstance() {
        return new RelativeLayoutParameter();
    }

    _copyProperties(model) {
        super._copyProperties(model);
        if (model instanceof RelativeLayoutParameter) {
            this.setAlign(model._relativeAlign);
            this.setRelativeToWidgetName(model._relativeWidgetName);
            this.setRelativeName(model._relativeLayoutName);
        }
    }
}

RelativeLayoutParameter.NONE = 0;
RelativeLayoutParameter.PARENT_TOP_LEFT = 1;
RelativeLayoutParameter.PARENT_TOP_CENTER_HORIZONTAL = 2;
RelativeLayoutParameter.PARENT_TOP_RIGHT = 3;
RelativeLayoutParameter.PARENT_LEFT_CENTER_VERTICAL = 4;
RelativeLayoutParameter.CENTER_IN_PARENT = 5;
RelativeLayoutParameter.PARENT_RIGHT_CENTER_VERTICAL = 6;
RelativeLayoutParameter.PARENT_LEFT_BOTTOM = 7;
RelativeLayoutParameter.PARENT_BOTTOM_CENTER_HORIZONTAL = 8;
RelativeLayoutParameter.PARENT_RIGHT_BOTTOM = 9;
RelativeLayoutParameter.LOCATION_ABOVE_LEFTALIGN = 10;
RelativeLayoutParameter.LOCATION_ABOVE_CENTER = 11;
RelativeLayoutParameter.LOCATION_ABOVE_RIGHTALIGN = 12;
RelativeLayoutParameter.LOCATION_LEFT_OF_TOPALIGN = 13;
RelativeLayoutParameter.LOCATION_LEFT_OF_CENTER = 14;
RelativeLayoutParameter.LOCATION_LEFT_OF_BOTTOMALIGN = 15;
RelativeLayoutParameter.LOCATION_RIGHT_OF_TOPALIGN = 16;
RelativeLayoutParameter.LOCATION_RIGHT_OF_CENTER = 17;
RelativeLayoutParameter.LOCATION_RIGHT_OF_BOTTOMALIGN = 18;
RelativeLayoutParameter.LOCATION_BELOW_LEFTALIGN = 19;
RelativeLayoutParameter.LOCATION_BELOW_CENTER = 20;
RelativeLayoutParameter.LOCATION_BELOW_RIGHTALIGN = 21;
