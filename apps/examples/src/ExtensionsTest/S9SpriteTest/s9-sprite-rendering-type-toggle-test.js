/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 Copyright (c) 2013      Surith Thekkiam

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

export class S9SpriteRenderingTypeToggleTest extends S9SpriteTestDemo {

    constructor() {
        super();


        this._title = "Test Toggle Scale9Sprite RenderingType";


        var blocks = new ccui.Scale9Sprite('blocks9.png');
        blocks.x = winSize.width / 2;
        blocks.y = winSize.height / 2 + 50;

        blocks.width = blocks.width * 2;


        var button = this._button = new ccui.Button();
        button.setTouchEnabled(true);
        button.x = winSize.width / 2.0;
        button.y = winSize.height / 2.0 - 50;
        button.setTitleText("Toggle SIMPLE");
        button.addTouchEventListener(function (sender, type) {
            if(type === ccui.Widget.TOUCH_ENDED) {
                if(blocks.getRenderingType() === ccui.Scale9Sprite.RenderingType.SLICED) {
                    blocks.setRenderingType(ccui.Scale9Sprite.RenderingType.SIMPLE);
                    button.setTitleText("Toggle SLICED");
                } else {
                    blocks.setRenderingType(ccui.Scale9Sprite.RenderingType.SLICED);
                    button.setTitleText("Toggle SIMPLE");
                }
            }
        } , this);

        this.addChild(button);


        this.addChild(blocks);
    }

}
