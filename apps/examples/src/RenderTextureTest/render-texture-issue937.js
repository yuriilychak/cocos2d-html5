/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

export class RenderTextureIssue937 extends RenderTextureBaseLayer {
    constructor() {
        super();
        var winSize = director.getWinSize();
        /*
         *     1    2
         * A: A1   A2
         *
         * B: B1   B2
         *
         *  A1: premulti sprite
         *  A2: premulti render
         *
         *  B1: non-premulti sprite
         *  B2: non-premulti render
         */
        var background = new LayerColor(new Color(200, 200, 200, 255));
        this.addChild(background);

        var spr_premulti = new Sprite(s_fire);
        spr_premulti.x = 16;
        spr_premulti.y = 48;

        var spr_nonpremulti = new Sprite(s_fire);
        spr_nonpremulti.x = 16;
        spr_nonpremulti.y = 16;

        /* A2 & B2 setup */
        var rend = new RenderTexture(32, 64, Texture2D.PIXEL_FORMAT_RGBA8888);
        if (!rend)
            return;
        // It's possible to modify the RenderTexture blending function by
        //        [[rend sprite] setBlendFunc:(ccBlendFunc) {GL_ONE, GL_ONE_MINUS_SRC_ALPHA}];
        //rend.getSprite().setBlendFunc(rendererConfig.renderContext.ONE, rendererConfig.renderContext.ONE_MINUS_SRC_ALPHA);
        rend.begin();
        spr_premulti.visit();
        spr_nonpremulti.visit();
        rend.end();

        /* A1: setup */
        spr_premulti.x = winSize.width / 2 - 16;
        spr_premulti.y = winSize.height / 2 + 16;
        /* B1: setup */
        spr_nonpremulti.x = winSize.width / 2 - 16;
        spr_nonpremulti.y = winSize.height / 2 - 16;

        rend.x = winSize.width / 2 + 16;
        rend.y = winSize.height / 2;
        //background.visible = false;
        this.addChild(spr_nonpremulti);
        this.addChild(spr_premulti);
        this.addChild(rend);
    }

    title() {
        return "Testing issue #937";
    }

    subtitle() {
        return "All images should be equal..";
    }

}
