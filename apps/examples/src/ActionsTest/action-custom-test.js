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

import { ActionsDemo } from "./actions-demo";
import { createCustomAction } from "./actions-test-helpers";
import { CustomMoveBy } from "./custom-move-by";
import { s_pathGrossini } from "../resources";

export class ActionCustomTest extends ActionsDemo {
  constructor() {
    super();
    this._spritePos = null;
    this._layer = null;
  }

  onEnter() {
    //----start47----onEnter
    super.onEnter();

    this.centerSprites(0);

    this._layer = new cc.Layer();
    this.addChild(this._layer);

    var label1 = new cc.MenuItemLabel(
      new cc.LabelTTF("showInterval(click me)", "arial", 25),
      this.createActionInterval,
      this
    );
    var label2 = new cc.MenuItemLabel(
      new cc.LabelTTF("showInstant(click me)", "arial", 25),
      this.createActionInstant,
      this
    );
    var buttonTemp = new cc.Menu(label1, label2);
    buttonTemp.alignItemsVerticallyWithPadding(10);
    buttonTemp.setPosition(new cc.Point(100, cc.winSize.height / 2 + 100));
    this.addChild(buttonTemp);

    this.createActionInterval();
  }
  initActionProperty() {
    this._spritePos = new cc.Point(25, 50);
    this._layer.removeAllChildren();
  }
  createActionInstant() {
    this.initActionProperty();

    /**
     * group 1
     */
    var spriteTemp = this.addandCreateSpriteTemp("cc.Show");
    spriteTemp.setVisible(false);
    var show = new (createCustomAction(cc.Show))();
    spriteTemp.runAction(show);

    spriteTemp = this.addandCreateSpriteTemp("cc.Hide", true);
    var hide = new (createCustomAction(cc.Hide))();
    spriteTemp.runAction(hide);

    spriteTemp = this.addandCreateSpriteTemp("cc.FlipX");
    var flipX = new (createCustomAction(cc.FlipX))(true);
    spriteTemp.runAction(flipX);

    /**
     * group 2
     */

    spriteTemp = this.addandCreateSpriteTemp("cc.FlipY");
    var flipY = new (createCustomAction(cc.FlipY))(true);
    spriteTemp.runAction(flipY);

    // RemoveSelf action don't need test
    // skip

    spriteTemp = this.addandCreateSpriteTemp("cc.Place");
    var place = new (createCustomAction(cc.Place))(spriteTemp.getPosition());
    spriteTemp.runAction(place);

    spriteTemp = this.addandCreateSpriteTemp("cc.CallFunc");
    var callFunc = new (createCustomAction(cc.CallFunc))(function () {
      cc.log("callfunc");
    }, this);
    spriteTemp.runAction(callFunc);
  }
  createActionInterval() {
    this.initActionProperty();

    /**
     * group 1
     */
    var spriteTemp = this.addandCreateSpriteTemp("cc.MoveBy");
    var move = new CustomMoveBy(5, new cc.Point(50, 0));
    spriteTemp.runAction(move);

    spriteTemp = this.addandCreateSpriteTemp("cc.MoveTo");
    var customMoveTo = new (createCustomAction(cc.MoveTo))(
      5,
      new cc.Point(spriteTemp.getPosition().x + 50, spriteTemp.getPosition().y)
    );
    spriteTemp.runAction(customMoveTo);

    spriteTemp = this.addandCreateSpriteTemp("cc.sequence");
    var moveSeq = cc.sequence(
      new (createCustomAction(cc.MoveBy))(5, new cc.Point(50, 0)),
      new cc.DelayTime(1),
      new (createCustomAction(cc.MoveBy))(5, new cc.Point(50, 0)),
      new cc.DelayTime(1)
    );
    spriteTemp.runAction(moveSeq);
    /**
     * group 2
     */
    spriteTemp = this.addandCreateSpriteTemp("cc.repeat");
    var moveRepeat = new cc.Repeat(
      new (createCustomAction(cc.MoveBy))(5, new cc.Point(50, 0)),
      2
    );
    spriteTemp.runAction(moveRepeat);

    spriteTemp = this.addandCreateSpriteTemp("cc.repeatForever");
    var moveRepeatForever = new cc.RepeatForever(
      cc.sequence(
        new (createCustomAction(cc.MoveBy))(5, new cc.Point(50, 0)),
        new (createCustomAction(cc.MoveBy))(5, new cc.Point(-50, 0))
      )
    );
    spriteTemp.runAction(moveRepeatForever);

    spriteTemp = this.addandCreateSpriteTemp("cc.spawn");
    var moveRoationSpawn = cc.spawn(
      new (createCustomAction(cc.MoveBy))(5, new cc.Point(50, 0)),
      new (createCustomAction(cc.RotateBy))(5, 360)
    );
    spriteTemp.runAction(moveRoationSpawn);

    /**
     * group 3
     */
    spriteTemp = this.addandCreateSpriteTemp("cc.RotateTo");
    var rotateTo = new (createCustomAction(cc.RotateTo))(5, 180);
    spriteTemp.runAction(rotateTo);

    spriteTemp = this.addandCreateSpriteTemp("cc.RotateBy");
    var rotateBy = new (createCustomAction(cc.RotateBy))(5, 270);
    spriteTemp.runAction(rotateBy);

    spriteTemp = this.addandCreateSpriteTemp("cc.SkewTo");
    var skewTo = new (createCustomAction(cc.SkewTo))(5, 20, 20);
    spriteTemp.runAction(skewTo);

    /**
     * group 4
     */
    spriteTemp = this.addandCreateSpriteTemp("cc.SkewBy");
    var skewBy = new (createCustomAction(cc.SkewBy))(5, 20, 20);
    spriteTemp.runAction(skewBy);

    spriteTemp = this.addandCreateSpriteTemp("cc.JumpBy");
    var jumpBy = new (createCustomAction(cc.JumpBy))(
      5,
      spriteTemp.getPosition(),
      50,
      4
    );
    spriteTemp.runAction(jumpBy);

    spriteTemp = this.addandCreateSpriteTemp("cc.JumpTo");
    var jumpTo = new (createCustomAction(cc.JumpTo))(
      5,
      spriteTemp.getPosition(),
      50,
      4
    );
    spriteTemp.runAction(jumpTo);

    /**
     * group 5
     */
    spriteTemp = this.addandCreateSpriteTemp("cc.BezierBy");
    var bezierBy = new (createCustomAction(cc.BezierBy))(5, [
      spriteTemp.getPosition(),
      new cc.Point(0, spriteTemp.getPosition().y),
      new cc.Point(cc.winSize.x, spriteTemp.getPosition().y),
      spriteTemp.getPosition()
    ]);
    spriteTemp.runAction(bezierBy);

    spriteTemp = this.addandCreateSpriteTemp("cc.BezierTo");
    var bezierTo = new (createCustomAction(cc.BezierTo))(5, [
      new cc.Point(0, cc.winSize.height / 2),
      new cc.Point(300, -cc.winSize.height / 2),
      new cc.Point(300, 100)
    ]);
    spriteTemp.runAction(bezierTo);

    spriteTemp = this.addandCreateSpriteTemp("cc.ScaleTo");
    var scaleTo = new (createCustomAction(cc.ScaleTo))(5, 0.5);
    spriteTemp.runAction(scaleTo);

    /**
     * group 6
     */
    spriteTemp = this.addandCreateSpriteTemp("cc.ScaleBy");
    var scaleBy = new (createCustomAction(cc.ScaleBy))(5, 1.5);
    spriteTemp.runAction(scaleBy);

    spriteTemp = this.addandCreateSpriteTemp("cc.Blink");
    var blink = new (createCustomAction(cc.Blink))(5, 2);
    spriteTemp.runAction(blink);

    spriteTemp = this.addandCreateSpriteTemp("cc.FadeTo");
    var fadeTo = new (createCustomAction(cc.FadeTo))(5, 64);
    spriteTemp.runAction(fadeTo);

    /**
     * group 7
     */
    spriteTemp = this.addandCreateSpriteTemp("cc.FadeIn");
    spriteTemp.setOpacity(128);
    var fadeIn = new (createCustomAction(cc.FadeIn))(5);
    spriteTemp.runAction(fadeIn);

    spriteTemp = this.addandCreateSpriteTemp("cc.FadeOut");
    spriteTemp.setOpacity(128);
    var fadeOut = new (createCustomAction(cc.FadeOut))(5);
    spriteTemp.runAction(fadeOut);

    spriteTemp = this.addandCreateSpriteTemp("cc.TintTo");
    var tintTo = new (createCustomAction(cc.TintTo))(5, 255, 0, 255);
    spriteTemp.runAction(tintTo);

    /**
     * group 8
     */
    spriteTemp = this.addandCreateSpriteTemp("cc.TintBy");
    var tintBy = new (createCustomAction(cc.TintBy))(5, -127, -255, -127);
    spriteTemp.runAction(tintBy);

    spriteTemp = this.addandCreateSpriteTemp("cc.Animate");
    var animation = new cc.Animation();
    for (var i = 1; i < 15; i++) {
      var frameName =
        "Images/grossini_dance_" + (i < 10 ? "0" + i : i) + ".png";
      animation.addSpriteFrameWithFile(frameName);
    }
    animation.setDelayPerUnit(5 / 14);
    animation.setRestoreOriginalFrame(true);
    var animate = new (createCustomAction(cc.Animate))(animation);
    spriteTemp.runAction(animate);
  }
  addandCreateSpriteTemp(actionTypeName, addLabelInLayerFlag) {
    var spriteTemp = new cc.Sprite(s_pathGrossini);
    this._layer.addChild(spriteTemp);
    spriteTemp.setPosition(this._spritePos);
    var spriteContentSize = spriteTemp.getContentSize();
    this._spritePos.y += spriteContentSize.height;
    if (this._spritePos.y > cc.winSize.height - spriteContentSize.height) {
      this._spritePos.x += spriteContentSize.width;
      this._spritePos.y = 50;
    }

    if (actionTypeName) {
      var label = new cc.LabelTTF(actionTypeName, "arial", 18);
      if (addLabelInLayerFlag) {
        label.setPosition(spriteTemp.getPosition());
        this._layer.addChild(label);
      } else {
        label.setPosition(
          spriteContentSize.width / 2,
          spriteContentSize.height / 2
        );
        spriteTemp.addChild(label);
      }
    }

    return spriteTemp;
  }
  title() {
    return "ActionCustomTest";
  }

  subtitle() {
    return "Tests custom action, every sprite changing rand color when they run actions";
  }
}
