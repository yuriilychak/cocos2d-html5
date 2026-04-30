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

export class Issue870 extends ParticleDemo {
    constructor() {
        super();
        this._index = 0;
    }

    onEnter() {
        super.onEnter();

        this.setColor(new cc.Color(0, 0, 0));
        this.removeChild(this._background, true);
        this._background = null;

        var system = new cc.ParticleSystem(s_resprefix + "Particles/SpinningPeas.plist");
        system.setTextureWithRect(cc.textureCache.addImage(s_particles), new cc.Rect(0, 0, 32, 32));
        this.addChild(system, 10);
        this._emitter = system;
        this._emitter.drawMode = cc.ParticleSystem.TEXTURE_MODE;
        this._emitter.x = director.getWinSize().width / 2;
        this._emitter.y = director.getWinSize().height / 2 - 50;
        this._index = 0;
        this.schedule(this.updateQuads, 2.0);
    }
    title() {
        return "Issue 870. SubRect";
    }
    subtitle() {
        return "Every 2 seconds the particle should change";
    }
    updateQuads(dt) {
        this._index = (this._index + 1) % 4;
        var rect = new cc.Rect(this._index * 32, 0, 32, 32);
        this._emitter.setTextureWithRect(this._emitter.texture, rect);
    }

}
