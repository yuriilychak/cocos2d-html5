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

export class ParticleBatchTest extends ParticleDemo {
    constructor() {
        super();
        this._index = 0;
    }

    onEnter() {
        super.onEnter();

        var emitter1 = new ParticleSystem(s_resprefix + 'Particles/LavaFlow.plist');
        emitter1.startColor = new Color(255, 0, 0, 255);
        var emitter2 = new ParticleSystem(s_resprefix + 'Particles/LavaFlow.plist');
        emitter2.startColor = new Color(0, 255, 0, 255);
        var emitter3 = new ParticleSystem(s_resprefix + 'Particles/LavaFlow.plist');
        emitter3.startColor = new Color(0, 0, 255, 255);

        emitter1.x = winSize.width / 1.25;

        emitter1.y = winSize.height / 1.25;
        emitter2.x = winSize.width / 2;
        emitter2.y = winSize.height / 2;
        emitter3.x = winSize.width / 4;
        emitter3.y = winSize.height / 4;

        var batch = new ParticleBatchNode(emitter1.texture);

        batch.addChild(emitter1);
        batch.addChild(emitter2);
        batch.addChild(emitter3);

        this.addChild(batch, 10);

        // to be able to use "reset" button
        this.removeChild(this._background, true);
        this._background = null;
        this._emitter = emitter1;
    }
    title() {
        return "Particle Batch Test";
    }
    subtitle() {
        return "You should 3 particles. They are batched";
    }

}
