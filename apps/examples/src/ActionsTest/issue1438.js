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
// Issue1438
//
//------------------------------------------------------------------
export class Issue1438 extends ActionsDemo {
  onEnter() {
    //----start45----onEnter
    super.onEnter();
    this.centerSprites(2);

    //
    // manual animation
    //
    var animation = new Animation();

    // Add 60 frames
    for (var j = 0; j < 4; j++) {
      for (var i = 1; i < 15; i++) {
        var frameName =
          "Images/grossini_dance_" + (i < 10 ? "0" + i : i) + ".png";
        animation.addSpriteFrameWithFile(frameName);
      }
    }
    // And display 60 frames per second
    animation.setDelayPerUnit(1 / 60);
    animation.setRestoreOriginalFrame(true);

    var action = new Animate(animation);
    this._kathia.runAction(action);

    //
    // File animation
    //
    var animCache = animationCache;
    animCache.addAnimations(s_animations2Plist);
    var animation2 = animCache.getAnimation("dance_1");
    animation2.setDelayPerUnit(1 / 60);

    var action2 = new Animate(animation2);
    this._tamara.runAction(sequence(action2, action2.reverse()));
    //----end45----
  }

  title() {
    return "Animation";
  }

  subtitle() {
    return "Issue 1438. Set FPS to 30 to test this bug.";
  }

}
