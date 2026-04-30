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
// ActionReverseSequence2
//
//------------------------------------------------------------------
export class ActionReverseSequence2 extends ActionsDemo {
  onEnter() {
    //----start29----onEnter
    super.onEnter();
    this.alignSpritesLeft(2);

    // Test:
    //   Sequence should work both with IntervalAction and InstantActions
    var move1 = new MoveBy(3, new Point(250, 0));
    var move2 = new MoveBy(3, new Point(0, 50));
    var tog1 = new ToggleVisibility();
    var tog2 = new ToggleVisibility();
    var seq = sequence(move1, tog1, move2, tog2, move1.reverse());

    var action = sequence(seq, seq.reverse()).repeat(3);

    // Test:
    //   Also test that the reverse of Hide is Show, and vice-versa
    this._kathia.runAction(action);

    var move_tamara = new MoveBy(1, new Point(100, 0));
    var move_tamara2 = new MoveBy(1, new Point(50, 0));
    var hide = new Hide();
    var seq_tamara = sequence(move_tamara, hide, move_tamara2);
    var seq_back = seq_tamara.reverse();
    this._tamara.runAction(sequence(seq_tamara, seq_back));
    //----end29----
  }
  subtitle() {
    return "Reverse sequence 2";
  }

}
