/****************************************************************************
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
// ChipmunkBaseLayer
//
//------------------------------------------------------------------
import { BaseTestLayer } from "../BaseTestLayer/BaseTestLayer";
import { s_simpleFont_fnt } from "../resources";
import { chipmunkTestSceneIdx } from "./chipmunk-test-constants";
import {
  arrayOfChipmunkTest,
  nextChipmunkTest,
  previousChipmunkTest,
  restartChipmunkTest
} from "./chipmunk-test-helpers";
import { ChipmunkTestScene } from "./chipmunk-test-scene";
import { director, winSize } from "../constants";
import { Color, Rect, Sys } from "@aspect/core";
import { PhysicsDebugNode } from "@aspect/physics";
import { BMButton, Widget } from "@aspect/ccui";

export class ChipmunkBaseLayer extends BaseTestLayer {
  constructor() {
    //
    // VERY IMPORTANT
    //
    // Only subclasses of a native classes MUST call associateWithNative
    // Failure to do so, it will crash.
    //
    super(
      new Color(0, 0, 0, 255),
      new Color(98 * 0.5, 99 * 0.5, 117 * 0.5, 255)
    );

    this._title = "No title";
    this._subtitle = "No Subtitle";

    const toggleBtn = new BMButton(
      "default_theme/rounded_shadow_2.png",
      "default_theme/rounded_shadow_2.png",
      "default_theme/rounded_shadow_2.png",
      Widget.PLIST_TEXTURE
    );
    toggleBtn.setScale9Enabled(true);
    toggleBtn.setCapInsets(new Rect(12, 12, 12, 12));
    toggleBtn.setContentSize(196, 32);
    toggleBtn.setTitleFntFile(s_simpleFont_fnt);
    toggleBtn.setTitleText("Physics On/Off");
    toggleBtn.setTitleFontSize(12);
    toggleBtn.setNormalBgColor(new Color(0x00, 0x99, 0x00));
    toggleBtn.setPressedBgColor(new Color(0x00, 0x66, 0x00));
    toggleBtn.setDisabledBgColor(new Color(0x55, 0x55, 0x55));
    toggleBtn.pressedActionEnabled = true;
    toggleBtn.x = winSize.width - 108;
    toggleBtn.y = winSize.height - 80;
    toggleBtn.addClickEventListener(() => this.onToggleDebug());
    this.addChild(toggleBtn, 10);

    // Create the initial space
    this.space = new cp.Space();

    this.setupDebugNode();
  }

  setupDebugNode() {
    // debug only
    this._debugNode = new PhysicsDebugNode(this.space);
    this._debugNode.visible = false;
    this.addChild(this._debugNode);
  }

  onToggleDebug(sender) {
    var state = this._debugNode.visible;
    this._debugNode.visible = !state;
  }

  onEnter() {
    super.onEnter();
    //base(this, 'onEnter');

    Sys.getInstance().garbageCollect();
  }

  onCleanup() {
    // Not compulsory, but recommended: cleanup the scene
    this.unscheduleUpdate();
  }

  onRestartCallback(sender) {
    this.onCleanup();
    var s = new ChipmunkTestScene();
    s.addChild(restartChipmunkTest());
    director.runScene(s);
  }

  onNextCallback(sender) {
    this.onCleanup();
    var s = new ChipmunkTestScene();
    s.addChild(nextChipmunkTest());
    director.runScene(s);
  }

  onBackCallback(sender) {
    this.onCleanup();
    var s = new ChipmunkTestScene();
    s.addChild(previousChipmunkTest());
    director.runScene(s);
  }

  numberOfPendingTests() {
    return arrayOfChipmunkTest.length - 1 - chipmunkTestSceneIdx;
  }

  getTestNumber() {
    return chipmunkTestSceneIdx;
  }
}
