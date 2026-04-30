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

export class S9SpriteColorOpacityTest extends S9SpriteTestDemo {

    constructor() {
        super();


        this._title = "Test color/opacity cascade for Scale9Sprite (red with 128 opacity)";

        this.setCascadeColorEnabled(true);
        this.setCascadeOpacityEnabled(true);
        this.setOpacity(128);
        this.setColor(new Color(255, 0, 0));

        var blocks = new Scale9Sprite('blocks9.png');
        blocks.x = winSize.width / 2 - 100;
        blocks.y = winSize.height / 2;
        this.addChild(blocks);

        var batchNode = new SpriteBatchNode("Images/blocks9.png");
        var blocks2 = new Scale9Sprite();
        blocks2.updateWithBatchNode(batchNode, new Rect(0, 0, 96, 96), false, new Rect(0, 0, 96, 96));
        blocks2.x = winSize.width / 2 + 100;
        blocks2.y = winSize.height / 2;
        this.addChild(blocks2);
    }

}
