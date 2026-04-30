/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

//------------------------------------------------------------------
//
// LabelTTFTest
//
//------------------------------------------------------------------
export class LabelTTFStrokeShadowTest extends AtlasDemo {

    constructor() {
        //----start26----ctor
        super();


        this._labelShadow = null;


        this._labelStroke = null;


        this._labelStrokeShadow = null;
        this.updateLabels();
        //----end26----
    }

    updateLabels() {
        //----start26----updateLabels
        var blockSize = new cc.Size(400, 100);
        var s = director.getWinSize();

        // colors
        var redColor = new cc.Color(255, 0, 0);
        var yellowColor = new cc.Color(255, 255, 0);
        var blueColor = new cc.Color(0, 0, 255);

        // shadow offset
        var shadowOffset = new cc.Point(12, -12);

        // positioning stuff
        var posX = s.width / 2 - (blockSize.width / 2);
        var posY_5 = s.height / 7;

        // font definition
        var fontDefRedShadow = new cc.FontDefinition();
        fontDefRedShadow.fontName = "Arial";
        fontDefRedShadow.fontSize = 32;
        fontDefRedShadow.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        fontDefRedShadow.verticalAlign = cc.VERTICAL_TEXT_ALIGNMENT_TOP;
        fontDefRedShadow.fillStyle = redColor;
        fontDefRedShadow.boundingWidth = blockSize.width;
	    fontDefRedShadow.boundingHeight = blockSize.height;
        // shadow
        fontDefRedShadow.shadowEnabled = true;
        fontDefRedShadow.shadowOffsetX = shadowOffset.x;
	    fontDefRedShadow.shadowOffsetY = shadowOffset.y;

        // create the label using the definition
        this._labelShadow = new cc.LabelTTF("Shadow Only", fontDefRedShadow);
        this._labelShadow.anchorX = 0;
        this._labelShadow.anchorY = 0;
        this._labelShadow.x = posX;
        this._labelShadow.y = posY_5;

        // font definition
        var fontDefBlueStroke = new cc.FontDefinition();
        fontDefBlueStroke.fontName = "Arial";
        fontDefBlueStroke.fontSize = 32;
        fontDefBlueStroke.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        fontDefBlueStroke.verticalAlign = cc.VERTICAL_TEXT_ALIGNMENT_TOP;
        fontDefBlueStroke.fillStyle = blueColor;
        fontDefBlueStroke.boundingWidth = blockSize.width;
	    fontDefBlueStroke.boundingHeight = blockSize.height;
        // stroke
        fontDefBlueStroke.strokeEnabled = true;
        fontDefBlueStroke.strokeStyle = yellowColor;

        this._labelStroke = new cc.LabelTTF("Stroke Only", fontDefBlueStroke);
        this._labelStroke.anchorX = 0;
        this._labelStroke.anchorY = 0;
        this._labelStroke.x = posX;
        this._labelStroke.y = posY_5 * 2;

        // font definition
        var fontDefRedStrokeShadow = new cc.FontDefinition();
        fontDefRedStrokeShadow.fontName = "Arial";
        fontDefRedStrokeShadow.fontSize = 32;
        fontDefRedStrokeShadow.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        fontDefRedStrokeShadow.verticalAlign = cc.VERTICAL_TEXT_ALIGNMENT_TOP;
        fontDefRedStrokeShadow.fillStyle = blueColor;
        fontDefRedStrokeShadow.boundingWidth = blockSize.width;
	    fontDefRedStrokeShadow.boundingHeight = blockSize.height;
        // stroke
        fontDefRedStrokeShadow.strokeEnabled = true;
        fontDefRedStrokeShadow.strokeStyle = redColor;
        // shadow
        fontDefRedStrokeShadow.shadowEnabled = true;
        fontDefRedStrokeShadow.shadowOffsetX = -12;
	    fontDefRedStrokeShadow.shadowOffsetY = 12;   //shadowOffset;

        this._labelStrokeShadow = new cc.LabelTTF("Stroke + Shadow\n New Line", fontDefRedStrokeShadow);
        this._labelStrokeShadow.anchorX = 0;
        this._labelStrokeShadow.anchorY = 0;
        this._labelStrokeShadow.x = posX;
        this._labelStrokeShadow.y = posY_5 * 3;

        // add all the labels
        this.addChild(this._labelShadow);
        this.addChild(this._labelStroke);
        this.addChild(this._labelStrokeShadow);
        //----end26----
    }

    title() {
        return "Testing cc.LabelTTF + shadow and stroke";
    }

    subtitle() {
        return "";
    }

}
