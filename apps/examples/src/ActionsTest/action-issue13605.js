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

export class ActionIssue13605 extends ActionsDemo {
  onEnter() {
    //----start47----onEnter
    super.onEnter();
    this.centerSprites(2);

    var move = new CustomMoveBy(2, new Point(50, 0));
    var move_back = move.reverse();
    var move_seq = sequence(
      move,
      new DelayTime(1),
      move_back,
      new DelayTime(1)
    );
    this._kathia.runAction(move_seq.repeat(2));

    var moveClone = move.clone();
    var moveCloneBack = moveClone.reverse();
    var moveCloneSeq = sequence(
      moveClone,
      new DelayTime(1),
      moveCloneBack,
      new DelayTime(1)
    );
    this._tamara.runAction(moveCloneSeq.repeat(2));
    //----end47----
  }

  title() {
    return "action reverse and clone issue";
  }

  subtitle() {
    return "action move and back will change rand color";
  }

}
