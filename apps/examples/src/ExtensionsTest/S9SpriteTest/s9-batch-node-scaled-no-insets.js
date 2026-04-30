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

// S9BatchNodeScaledNoInsets
export class S9BatchNodeScaledNoInsets extends S9SpriteTestDemo {


    constructor() {
        super();



        this._title = "Scale9Sprite created empty and updated from SpriteBatchNode";



        this._subtitle = "updateWithBatchNode(); capInsets=full size; rendered 4 X width, 2 X height";

        var x = winSize.width / 2;
        var y = 0 + (winSize.height / 2);

        log("S9BatchNodeScaledNoInsets ...");

        // scaled without insets
        var batchNode_scaled = new SpriteBatchNode("Images/blocks9.png");
        log("batchNode_scaled created with : " + "Images/blocks9.png");

        var blocks_scaled = new Scale9Sprite();
        log("... created");
        blocks_scaled.updateWithBatchNode(batchNode_scaled, new Rect(0, 0, 96, 96), false, new Rect(0, 0, 96, 96));
        log("... updateWithBatchNode");

        blocks_scaled.x = x;
        blocks_scaled.y = y;
        log("... setPosition");

        blocks_scaled.width = 96 * 4;
        blocks_scaled.height = 96*2;
        log("... setContentSize");

        this.addChild(blocks_scaled);
        log("this..addChild");

        log("... S9BtchNodeScaledNoInsets done.");
    }

}
