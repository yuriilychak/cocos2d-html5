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

import { ParticleDemo } from "./particle-demo.js";
import { s_back3, s_fire } from "../tests_resources.js";

export class ParallaxParticle extends ParticleDemo {
    onEnter() {
        super.onEnter();

        this._background.getParent().removeChild(this._background, true);
        this._background = null;

        //TODO
        var p = new cc.ParallaxNode();
        this.addChild(p, 5);

        var p1 = new cc.Sprite(s_back3);
        var p2 = new cc.Sprite(s_back3);

        p.addChild(p1, 1, new cc.Point(0.5, 1), new cc.Point(0, 250));
        p.addChild(p2, 2, new cc.Point(1.5, 1), new cc.Point(0, 50));

        this._emitter = new cc.ParticleFlower();
        this._emitter.texture = cc.textureCache.addImage(s_fire);

        p1.addChild(this._emitter, 10);
        this._emitter.x = 250;
        this._emitter.y = 200;

        var par = new cc.ParticleSun();
        p2.addChild(par, 10);
        par.texture = cc.textureCache.addImage(s_fire);

        var move = new cc.MoveBy(4, new cc.Point(300, 0));
        var move_back = move.reverse();
        var seq = cc.sequence(move, move_back);
        p.runAction(seq.repeatForever());
    }
    title() {
        return "Parallax + Particles";
    }

}
