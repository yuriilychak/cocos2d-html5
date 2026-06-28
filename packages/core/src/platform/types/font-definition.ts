/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
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

import { TextAlignment, VerticalTextAlignment } from "../../enums";
import { Color } from "./color";
import { BYTE } from "../../constants";
import { isNumber, isObject } from "../../boot/utils";

/**
 * Common usage:
 *
 * var fontDef = new FontDefinition();
 * fontDef.fontName = "Arial";
 * fontDef.fontSize = 12;
 * ...
 *
 * OR using inline definition useful for constructor injection
 *
 * var fontDef = new FontDefinition({
 *  fontName: "Arial",
 *  fontSize: 12
 * });
 *
 *
 *
 * @param {Object} properties - (OPTIONAL) Allow inline FontDefinition
 */
export class FontDefinition {
    [key: string]: unknown;

    fontName: string;
    fontSize: number;
    textAlign: TextAlignment;
    verticalAlign: VerticalTextAlignment;
    fillStyle: Color;
    boundingWidth: number;
    boundingHeight: number;

    strokeEnabled: boolean;
    strokeStyle: Color;
    lineWidth: number;
    lineHeight: string | number;
    fontStyle: string;
    fontWeight: string;

    shadowEnabled: boolean;
    shadowOffsetX: number;
    shadowOffsetY: number;
    shadowBlur: number;
    shadowOpacity: number;

    constructor(properties?: unknown) {
        this.fontName = "Arial";
        this.fontSize = 12;
        this.textAlign = TextAlignment.CENTER;
        this.verticalAlign = VerticalTextAlignment.TOP;
        this.fillStyle = new Color(BYTE, BYTE, BYTE, BYTE);
        this.boundingWidth = 0;
        this.boundingHeight = 0;

        this.strokeEnabled = false;
        this.strokeStyle = new Color(BYTE, BYTE, BYTE, BYTE);
        this.lineWidth = 1;
        this.lineHeight = "normal";
        this.fontStyle = "normal";
        this.fontWeight = "normal";

        this.shadowEnabled = false;
        this.shadowOffsetX = 0;
        this.shadowOffsetY = 0;
        this.shadowBlur = 0;
        this.shadowOpacity = 1.0;

        //properties mapping:
        if (isObject(properties)) {
            for (const key in properties) {
                this[key] = properties[key];
            }
        }
    }

    _getCanvasFontStr(): string {
        const lineHeight = isNumber(this.lineHeight) ? this.lineHeight + "px" : this.lineHeight;
        return this.fontStyle + " " + this.fontWeight + " " + this.fontSize + "px/" + lineHeight + " '" + this.fontName + "'";
    }
}
