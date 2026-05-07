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

import {
  BaseTestLayer
} from "../BaseTestLayer/BaseTestLayer";
import { TAG_LABEL_ATLAS, particleSceneIdx } from "./particle-test-constants";
import {
  backParticleAction,
  nextParticleAction,
  particleSceneArr
} from "./particle-test-helpers";
import { ParticleTestScene } from "./particle-test-scene";
import {
  s_back3,
  s_simpleFont_fnt
} from "../resources";
import { director } from "../constants";
import {
  Color,
  EventListener,
  EventManager,
  EventMouse,
  Point,
  Rect,
  Sprite,
  Sys
} from "@aspect/core";
import { MoveBy, Sequence } from "@aspect/actions";
import { BMButton, TextBMFont, Widget } from "@aspect/ccui";
import { ParticleSystem } from "@aspect/particle";

export class ParticleDemo extends BaseTestLayer {
  setColor() {}

  constructor() {
    super(new Color(0, 0, 0, 255), new Color(98, 99, 117, 255));

    this._emitter = null;

    this._background = null;

    this._shapeModeButton = null;

    this._textureModeButton = null;

    this._isPressed = false;
    this._emitter = null;

    if ("touches" in Sys.getInstance().capabilities) {
      EventManager.getInstance().addListener(
        {
          event: EventListener.TOUCH_ALL_AT_ONCE,
          onTouchesBegan: function (touches, event) {
            event
              .getCurrentTarget()
              ._moveToTouchPoint(touches[0].getLocation());
          },
          onTouchesMoved: function (touches, event) {
            event
              .getCurrentTarget()
              ._moveToTouchPoint(touches[0].getLocation());
          }
        },
        this
      );
    } else if ("mouse" in Sys.getInstance().capabilities)
      EventManager.getInstance().addListener(
        {
          event: EventListener.MOUSE,
          onMouseDown: function (event) {
            event.getCurrentTarget()._moveToTouchPoint(event.getLocation());
          },
          onMouseMove: function (event) {
            if (event.getButton() == EventMouse.BUTTON_LEFT)
              event.getCurrentTarget()._moveToTouchPoint(event.getLocation());
          }
        },
        this
      );

    var s = director.getWinSize();

    const makePBtn = (text, x, y, visible, bgColor, callback) => {
      const btn = new BMButton(
        "default_theme/rounded_shadow_2.png",
        "default_theme/rounded_shadow_2.png",
        "default_theme/rounded_shadow_2.png",
        Widget.PLIST_TEXTURE
      );
      btn.setScale9Enabled(true);
      btn.setCapInsets(new Rect(12, 12, 12, 12));
      btn.setContentSize(120, 28);
      btn.setTitleFntFile(s_simpleFont_fnt);
      btn.setTitleText(text);
      btn.setTitleFontSize(12);
      btn.setNormalBgColor(bgColor);
      btn.setPressedBgColor(new Color(0x22, 0x33, 0x55));
      btn.setDisabledBgColor(new Color(0x55, 0x55, 0x55));
      btn.pressedActionEnabled = true;
      btn.setAnchorPoint(0, 0);
      btn.x = x;
      btn.y = y;
      if (!visible) btn.setVisible(false);
      btn.addClickEventListener(callback);
      this.addChild(btn, 100);
      return btn;
    };

    const movementColor = new Color(0xFF, 0x88, 0x00);
    const modeColor = new Color(0x00, 0xAA, 0x00);

    this._freeMovementButton = makePBtn("Free Movement", 10, 150, true, movementColor, () => {
      this._emitter.setPositionType(ParticleSystem.TYPE_RELATIVE);
      this._relativeMovementButton.setVisible(true);
      this._freeMovementButton.setVisible(false);
      this._groupMovementButton.setVisible(false);
    });

    this._relativeMovementButton = makePBtn("Relative", 10, 150, false, movementColor, () => {
      this._emitter.setPositionType(ParticleSystem.TYPE_GROUPED);
      this._relativeMovementButton.setVisible(false);
      this._freeMovementButton.setVisible(false);
      this._groupMovementButton.setVisible(true);
    });

    this._groupMovementButton = makePBtn("Group", 10, 150, false, movementColor, () => {
      this._emitter.setPositionType(ParticleSystem.TYPE_FREE);
      this._relativeMovementButton.setVisible(false);
      this._freeMovementButton.setVisible(true);
      this._groupMovementButton.setVisible(false);
    });

    this._shapeModeButton = makePBtn("Shape Mode", 10, 100, false, modeColor, () => {
      if (this._emitter.setDrawMode)
        this._emitter.setDrawMode(ParticleSystem.TEXTURE_MODE);
      this._textureModeButton.setVisible(true);
      this._shapeModeButton.setVisible(false);
    });

    this._textureModeButton = makePBtn("Texture Mode", 10, 100, true, modeColor, () => {
      if (this._emitter.setDrawMode)
        this._emitter.setDrawMode(ParticleSystem.SHAPE_MODE);
      this._textureModeButton.setVisible(false);
      this._shapeModeButton.setVisible(true);
    });

    if ("opengl" in Sys.getInstance().capabilities) {
      // Shape type is not compatible with JSB
      this._textureModeButton.setEnabled(false);
    }

    var particleCountLabel = new TextBMFont("0", s_simpleFont_fnt);
    particleCountLabel.fontSize = 16;
    this.addChild(particleCountLabel, 100, TAG_LABEL_ATLAS);
    particleCountLabel.x = s.width - 66;
    particleCountLabel.y = 50;

    // moving background
    this._background = new Sprite(s_back3);
    this.addChild(this._background, 5);
    this._background.x = s.width / 2;
    this._background.y = s.height - 180;

    var move = new MoveBy(4, new Point(300, 0));
    var move_back = move.reverse();

    var seq = new Sequence(move, move_back);
    this._background.runAction(seq.repeatForever());
    this.scheduleUpdate();
  }

  title() {
    return "No title";
  }

  subtitle() {
    return "(Tap the Screen)";
  }

  onRestartCallback(sender) {
    this._emitter.resetSystem();
  }
  onNextCallback(sender) {
    var s = new ParticleTestScene();
    s.addChild(nextParticleAction());
    director.runScene(s);
  }
  onBackCallback(sender) {
    var s = new ParticleTestScene();
    s.addChild(backParticleAction());
    director.runScene(s);
  }
  toggleCallback(sender) {
    if (this._emitter.getPositionType() == ParticleSystem.TYPE_GROUPED)
      this._emitter.setPositionType(ParticleSystem.TYPE_FREE);
    else if (this._emitter.getPositionType() == ParticleSystem.TYPE_FREE)
      this._emitter.setPositionType(ParticleSystem.TYPE_RELATIVE);
    else if (this._emitter.getPositionType() == ParticleSystem.TYPE_RELATIVE)
      this._emitter.setPositionType(ParticleSystem.TYPE_GROUPED);
  }

  _moveToTouchPoint(location) {
    var pos = new Point(0, 0);
    if (this._background) {
      pos = this._background.convertToWorldSpace(new Point(0, 0));
    }
    this._emitter.x = location.x - pos.x;
    this._emitter.y = location.y - pos.y;
  }

  update(dt) {
    if (this._emitter) {
      var atlas = this.getChildByTag(TAG_LABEL_ATLAS);
      atlas.setString(this._emitter.getParticleCount().toFixed(0));
    }
  }
  setEmitterPosition() {
    var sourcePos = this._emitter.getSourcePosition();
    if (sourcePos.x === 0 && sourcePos.y === 0) this._emitter.x = 200;
    this._emitter.y = 70;
  }
  // automation
  numberOfPendingTests() {
    return particleSceneArr.length - 1 - particleSceneIdx;
  }

  getTestNumber() {
    return particleSceneIdx;
  }
}
