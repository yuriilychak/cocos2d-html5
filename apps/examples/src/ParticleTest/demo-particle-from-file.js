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

import { ParticleDemo } from "./particle-demo";
import { s_resprefix } from "../resources";
import { director } from "../constants";

export class DemoParticleFromFile extends ParticleDemo {
    constructor(filename) {
        super();

        this._title = "";
        this._title = filename;
    }
    onEnter() {
        super.onEnter();
        this.setColor(new cc.Color(0, 0, 0));
        this.removeChild(this._background, true);
        this._background = null;

        this._emitter = new cc.ParticleSystem(s_resprefix + "Particles/" + this._title + ".plist");
        // test create from a object
        // var plistData = jsb.fileUtils.getValueMapFromFile(s_resprefix + "Particles/" + this._title + ".plist");
        // this._emitter = new cc.ParticleSystem(plistData);

        this.addChild(this._emitter, 10);

        if (this._title == "Flower") {
            this._emitter.shapeType = cc.ParticleSystem.STAR_SHAPE;
        }//else if( this._title == "Upsidedown"){
        //   this._emitter.setDrawMode(cc.ParticleSystem.TEXTURE_MODE);
        //}

        this.setEmitterPosition();
    }

    setEmitterPosition() {
        var sourcePos = this._emitter.getSourcePosition();
        if (sourcePos.x === 0 && sourcePos.y === 0)
            this._emitter.x = director.getWinSize().width / 2;
            this._emitter.y = director.getWinSize().height / 2 - 50;
    }

    title() {
        return this._title;
    }

}
