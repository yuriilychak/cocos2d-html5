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
import { Animation, Color, LabelTTF, Layer, Point, Sprite, log } from "@aspect/core";
import {
  Animate,
  BezierBy,
  BezierTo,
  Blink,
  CallFunc,
  DelayTime,
  FadeIn,
  FadeOut,
  FadeTo,
  FlipX,
  FlipY,
  Hide,
  JumpBy,
  JumpTo,
  MoveBy,
  MoveTo,
  Place,
  Repeat,
  RepeatForever,
  RotateBy,
  RotateTo,
  ScaleBy,
  ScaleTo,
  Show,
  SkewBy,
  SkewTo,
  Spawn,
  TintBy,
  TintTo,
  Sequence,
  spawn
} from "@aspect/actions";
import { ButtonLayout } from "../button-layout";
import { winSize } from "../constants";

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

    this._layer = new Layer();
    this.addChild(this._layer);

    this.addChild(new ButtonLayout(
      [
        { label: "showInterval", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) },
        { label: "showInstant", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) }
      ],
      196, "Actions",
      (i) => {
        if (i === 0) this.createActionInterval();
        else this.createActionInstant();
      }
    ));

    this.createActionInterval();
  }
  initActionProperty() {
    this._spritePos = new Point(25, 50);
    this._layer.removeAllChildren();
  }
  createActionInstant() {
    this.initActionProperty();

    /**
     * group 1
     */
    var spriteTemp = this.addandCreateSpriteTemp("Show");
    spriteTemp.setVisible(false);
    var show = new (createCustomAction(Show))();
    spriteTemp.runAction(show);

    spriteTemp = this.addandCreateSpriteTemp("Hide", true);
    var hide = new (createCustomAction(Hide))();
    spriteTemp.runAction(hide);

    spriteTemp = this.addandCreateSpriteTemp("FlipX");
    var flipX = new (createCustomAction(FlipX))(true);
    spriteTemp.runAction(flipX);

    /**
     * group 2
     */

    spriteTemp = this.addandCreateSpriteTemp("FlipY");
    var flipY = new (createCustomAction(FlipY))(true);
    spriteTemp.runAction(flipY);

    // RemoveSelf action don't need test
    // skip

    spriteTemp = this.addandCreateSpriteTemp("Place");
    var place = new (createCustomAction(Place))(spriteTemp.getPosition());
    spriteTemp.runAction(place);

    spriteTemp = this.addandCreateSpriteTemp("CallFunc");
    var callFunc = new (createCustomAction(CallFunc))(function () {
      log("callfunc");
    }, this);
    spriteTemp.runAction(callFunc);
  }
  createActionInterval() {
    this.initActionProperty();

    /**
     * group 1
     */
    var spriteTemp = this.addandCreateSpriteTemp("MoveBy");
    var move = new CustomMoveBy(5, new Point(50, 0));
    spriteTemp.runAction(move);

    spriteTemp = this.addandCreateSpriteTemp("MoveTo");
    var customMoveTo = new (createCustomAction(MoveTo))(
      5,
      new Point(spriteTemp.getPosition().x + 50, spriteTemp.getPosition().y)
    );
    spriteTemp.runAction(customMoveTo);

    spriteTemp = this.addandCreateSpriteTemp("sequence");
    var moveSeq = new Sequence(
      new (createCustomAction(MoveBy))(5, new Point(50, 0)),
      new DelayTime(1),
      new (createCustomAction(MoveBy))(5, new Point(50, 0)),
      new DelayTime(1)
    );
    spriteTemp.runAction(moveSeq);
    /**
     * group 2
     */
    spriteTemp = this.addandCreateSpriteTemp("repeat");
    var moveRepeat = new Repeat(
      new (createCustomAction(MoveBy))(5, new Point(50, 0)),
      2
    );
    spriteTemp.runAction(moveRepeat);

    spriteTemp = this.addandCreateSpriteTemp("repeatForever");
    var moveRepeatForever = new RepeatForever(
      new Sequence(
        new (createCustomAction(MoveBy))(5, new Point(50, 0)),
        new (createCustomAction(MoveBy))(5, new Point(-50, 0))
      )
    );
    spriteTemp.runAction(moveRepeatForever);

    spriteTemp = this.addandCreateSpriteTemp("spawn");
    var moveRoationSpawn = new Spawn(
      new (createCustomAction(MoveBy))(5, new Point(50, 0)),
      new (createCustomAction(RotateBy))(5, 360)
    );
    spriteTemp.runAction(moveRoationSpawn);

    /**
     * group 3
     */
    spriteTemp = this.addandCreateSpriteTemp("RotateTo");
    var rotateTo = new (createCustomAction(RotateTo))(5, 180);
    spriteTemp.runAction(rotateTo);

    spriteTemp = this.addandCreateSpriteTemp("RotateBy");
    var rotateBy = new (createCustomAction(RotateBy))(5, 270);
    spriteTemp.runAction(rotateBy);

    spriteTemp = this.addandCreateSpriteTemp("SkewTo");
    var skewTo = new (createCustomAction(SkewTo))(5, 20, 20);
    spriteTemp.runAction(skewTo);

    /**
     * group 4
     */
    spriteTemp = this.addandCreateSpriteTemp("SkewBy");
    var skewBy = new (createCustomAction(SkewBy))(5, 20, 20);
    spriteTemp.runAction(skewBy);

    spriteTemp = this.addandCreateSpriteTemp("JumpBy");
    var jumpBy = new (createCustomAction(JumpBy))(
      5,
      spriteTemp.getPosition(),
      50,
      4
    );
    spriteTemp.runAction(jumpBy);

    spriteTemp = this.addandCreateSpriteTemp("JumpTo");
    var jumpTo = new (createCustomAction(JumpTo))(
      5,
      spriteTemp.getPosition(),
      50,
      4
    );
    spriteTemp.runAction(jumpTo);

    /**
     * group 5
     */
    spriteTemp = this.addandCreateSpriteTemp("BezierBy");
    var bezierBy = new (createCustomAction(BezierBy))(5, [
      spriteTemp.getPosition(),
      new Point(0, spriteTemp.getPosition().y),
      new Point(winSize.x, spriteTemp.getPosition().y),
      spriteTemp.getPosition()
    ]);
    spriteTemp.runAction(bezierBy);

    spriteTemp = this.addandCreateSpriteTemp("BezierTo");
    var bezierTo = new (createCustomAction(BezierTo))(5, [
      new Point(0, winSize.height / 2),
      new Point(300, -winSize.height / 2),
      new Point(300, 100)
    ]);
    spriteTemp.runAction(bezierTo);

    spriteTemp = this.addandCreateSpriteTemp("ScaleTo");
    var scaleTo = new (createCustomAction(ScaleTo))(5, 0.5);
    spriteTemp.runAction(scaleTo);

    /**
     * group 6
     */
    spriteTemp = this.addandCreateSpriteTemp("ScaleBy");
    var scaleBy = new (createCustomAction(ScaleBy))(5, 1.5);
    spriteTemp.runAction(scaleBy);

    spriteTemp = this.addandCreateSpriteTemp("Blink");
    var blink = new (createCustomAction(Blink))(5, 2);
    spriteTemp.runAction(blink);

    spriteTemp = this.addandCreateSpriteTemp("FadeTo");
    var fadeTo = new (createCustomAction(FadeTo))(5, 64);
    spriteTemp.runAction(fadeTo);

    /**
     * group 7
     */
    spriteTemp = this.addandCreateSpriteTemp("FadeIn");
    spriteTemp.setOpacity(128);
    var fadeIn = new (createCustomAction(FadeIn))(5);
    spriteTemp.runAction(fadeIn);

    spriteTemp = this.addandCreateSpriteTemp("FadeOut");
    spriteTemp.setOpacity(128);
    var fadeOut = new (createCustomAction(FadeOut))(5);
    spriteTemp.runAction(fadeOut);

    spriteTemp = this.addandCreateSpriteTemp("TintTo");
    var tintTo = new (createCustomAction(TintTo))(5, 255, 0, 255);
    spriteTemp.runAction(tintTo);

    /**
     * group 8
     */
    spriteTemp = this.addandCreateSpriteTemp("TintBy");
    var tintBy = new (createCustomAction(TintBy))(5, -127, -255, -127);
    spriteTemp.runAction(tintBy);

    spriteTemp = this.addandCreateSpriteTemp("Animate");
    var animation = new Animation();
    for (var i = 1; i < 15; i++) {
      var frameName =
        "Images/grossini_dance_" + (i < 10 ? "0" + i : i) + ".png";
      animation.addSpriteFrameWithFile(frameName);
    }
    animation.setDelayPerUnit(5 / 14);
    animation.setRestoreOriginalFrame(true);
    var animate = new (createCustomAction(Animate))(animation);
    spriteTemp.runAction(animate);
  }
  addandCreateSpriteTemp(actionTypeName, addLabelInLayerFlag) {
    var spriteTemp = new Sprite(s_pathGrossini);
    this._layer.addChild(spriteTemp);
    spriteTemp.setPosition(this._spritePos);
    var spriteContentSize = spriteTemp.getContentSize();
    this._spritePos.y += spriteContentSize.height;
    if (this._spritePos.y > winSize.height - spriteContentSize.height) {
      this._spritePos.x += spriteContentSize.width;
      this._spritePos.y = 50;
    }

    if (actionTypeName) {
      var label = new LabelTTF(actionTypeName, "arial", 18);
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
