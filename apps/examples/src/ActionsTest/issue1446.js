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
import { ActionsDemo } from "./actions-demo";
import { winSize } from "../constants";

import { DelayTime, FadeTo, Sequence, Speed } from "@aspect/actions";
import { TextBMFont } from "@aspect/ccui";
import { s_simpleFont_fnt } from "../resources";

export class Issue1446 extends ActionsDemo {
  title() {
    return "Sequence + Speed in 'reverse mode'";
  }

  subtitle() {
    return "Issue #1446. 'Hello World' should be visible for only 0.1 seconds";
  }

  onEnter() {
    //----start46----onEnter
    super.onEnter();
    this.centerSprites(0);
    var label = (this.label = new TextBMFont("Hello World", s_simpleFont_fnt));

    label.x = winSize.width / 2;
    label.y = winSize.height / 2;
    label.opacity = 0;

    this.addChild(label);

    this.backwardsFade = new Speed(
      new Sequence(
        new DelayTime(2),
        new FadeTo(1, 255),
        new DelayTime(2)
      ),
      1
    );
    label.runAction(this.backwardsFade);

    // Comment out to see that 1.0 in the update function is called which is expected
    // Leave it uncommented to see that 0.0 is never called when going in reverse
    this.scheduleOnce(this.stepForwardGoBackward, 0.1);
    //----end46----
  }

  stepForwardGoBackward() {
    var action = this.backwardsFade.getInnerAction();
    action.step(2.5);
    // Try with -10.0f and you can see the opacity not fully faded out. Try with lower values to see it 'almost' fade out
    this.backwardsFade.setSpeed(-10);
  }
}
