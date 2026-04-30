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
// Issue1305
//
//------------------------------------------------------------------
export class Issue1305 extends ActionsDemo {
    constructor() {
        super();
        this._spriteTemp = null;
    }

  onEnter() {
    //----start39----onEnter
    super.onEnter();
    this.centerSprites(0);

    this._spriteTmp = new cc.Sprite(s_pathGrossini);
    /* c++ can't support block, so we use CCCallFuncN instead.
         [spriteTmp_ runAction:[CCCallBlockN actionWithBlock:^(CCNode* node) {
         NSLog(@"This message SHALL ONLY appear when the sprite is added to the scene, NOT BEFORE");
         }] ];
         */

    this._spriteTmp.runAction(new cc.CallFunc(this.onLog, this));
    this.scheduleOnce(this.onAddSprite, 2);
    //----end39----
  }
  onExit() {
    super.onExit();
    if (this._spriteTmp) {
      this._spriteTmp = null;
    }
  }
  onLog(pSender) {
    cc.log(
      "This message SHALL ONLY appear when the sprite is added to the scene, NOT BEFORE"
    );
  }
  onAddSprite(dt) {
    this._spriteTmp.x = 250;
    this._spriteTmp.y = 250;
    if (this._spriteTmp) {
      this.addChild(this._spriteTmp);
      this._spriteTmp = null;
    }
  }
  title() {
    return "Issue 1305";
  }
  subtitle() {
    return "In two seconds you should see a message on the console. NOT BEFORE.";
  }

}
