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

import { BaseTestLayer } from "../BaseTestLayer/BaseTestLayer";
import { particleSceneIdx } from "./particle-test-constants";
import {
  backParticleAction,
  nextParticleAction,
  particleSceneArr
} from "./particle-test-helpers";
import { ParticleTestScene } from "./particle-test-scene";
import { s_back3 } from "../resources";
import { director } from "../constants";
import {
  Color,
  EventListener,
  EventListenerType,
  Point,
  Sprite,
  ServiceLocator,
  MouseButton
} from "@aspect/core";
import { MoveBy, Sequence } from "@aspect/actions";
import { ParticleSystem } from "@aspect/particle";
import { ButtonLayout } from "../button-layout";

export class ParticleDemo extends BaseTestLayer {
  setColor() {}

  constructor() {
    super(new Color(0, 0, 0, 255), new Color(98, 99, 117, 255));

    this._emitter = null;
    this._background = null;
    this._isPressed = false;

    this._movementIdx = 0;
    this._isTexture = true;

    if (ServiceLocator.sys.capabilities.touches) {
      ServiceLocator.eventManager.addListener(
        {
          event: EventListenerType.TOUCH_ALL_AT_ONCE,
          onTouchesBegan: function (touches, event) {
            event.currentTarget._moveToTouchPoint(touches[0]);
          },
          onTouchesMoved: function (touches, event) {
            event.currentTarget._moveToTouchPoint(touches[0]);
          }
        },
        this
      );
    } else if (ServiceLocator.sys.capabilities.mouse)
      ServiceLocator.eventManager.addListener(
        {
          event: EventListenerType.MOUSE,
          onMouseDown: function (event) {
            event.currentTarget._moveToTouchPoint(event);
          },
          onMouseMove: function (event) {
            if (event.button == MouseButton.LEFT)
              event.currentTarget._moveToTouchPoint(event);
          }
        },
        this
      );

    var s = director.getWinSize();

    const movementColor = new Color(0xff, 0x88, 0x00);
    const modeColor = new Color(0x00, 0xaa, 0x00);
    const pressedColor = new Color(0x22, 0x33, 0x55);

    this._layout = new ButtonLayout(
      [
        { type: "text", label: "Count: 0" },
        {
          label: "Movement: Free",
          tintDefault: movementColor,
          tintPressed: pressedColor
        },
        {
          label: "Mode: Texture",
          tintDefault: modeColor,
          tintPressed: pressedColor
        }
      ],
      196,
      "Actions",
      this._onButtonClick.bind(this)
    );
    this.addChild(this._layout, 100);

    if (ServiceLocator.sys.capabilities.opengl) {
      if (this._layout.getButton(2)) {
        this._layout.getButton(2).enabled = false;
      }
    }

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

  _onButtonClick(i) {
    const movements = [
      { type: ParticleSystem.TYPE_FREE, label: "Movement: Free" },
      { type: ParticleSystem.TYPE_RELATIVE, label: "Movement: Relative" },
      { type: ParticleSystem.TYPE_GROUPED, label: "Movement: Group" }
    ];

    switch (i) {
      case 1:
        this._movementIdx = (this._movementIdx + 1) % movements.length;
        const mv = movements[this._movementIdx];
        this._emitter?.setPositionType(mv.type);
        this._layout.setLabelText(1, mv.label);
        break;
      case 2:
        this._isTexture = !this._isTexture;
        if (this._emitter?.setDrawMode)
          this._emitter.setDrawMode(
            this._isTexture
              ? ParticleSystem.TEXTURE_MODE
              : ParticleSystem.SHAPE_MODE
          );
        this._layout.setLabelText(
          2,
          this._isTexture ? "Mode: Texture" : "Mode: Shape"
        );
        break;
    }
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
      this._layout.setLabelText(
        0,
        `Count: ${this._emitter.getParticleCount().toFixed(0)}`
      );
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
