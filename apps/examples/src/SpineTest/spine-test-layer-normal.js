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

import { SkeletonAnimation, ANIMATION_EVENT_TYPE } from "@aspect/extensions";
import { SpineTestLayer } from "./spine-test-layer";
import { s_simpleFont_fnt } from "../resources";
import { director } from "../constants";
import { Color, EventListener, EventManager, Point, Rect, log } from "@aspect/core";
import { BMButton, Widget } from "@aspect/ccui";

export class SpineTestLayerNormal extends SpineTestLayer {
  constructor(idx) {
    super(new Color(0, 0, 0, 255), new Color(98, 99, 117, 255));

    this._spineboy = null;

    this._debugMode = 0;

    this._flipped = false;

    this._idx = 0;
    this._idx = idx;

    var size = director.getWinSize();

    /////////////////////////////
    // Make Spine's Animated skeleton Node
    // You need 'json + atlas + image' resource files to make it.
    var spineBoy = new SkeletonAnimation(
      "spine/spineboy-pro.json",
      "spine/spineboy.atlas",
      0.6
    );
    spineBoy.setPosition(new Point(size.width / 2, size.height / 2 - 150));
    spineBoy.setMix("walk", "jump", 0.2);
    spineBoy.setMix("jump", "run", 0.2);
    spineBoy.setAnimation(0, "walk", true);
    //spineBoy.setAnimationListener(this, this.animationStateEvent);
    spineBoy.setScale(0.5);
    this.addChild(spineBoy, 4);
    this._spineboy = spineBoy;
    spineBoy.setStartListener(function (trackEntry) {
      if (trackEntry) {
        var animationName = trackEntry.animation
          ? trackEntry.animation.name
          : "";
        log("%d start: %s", trackEntry.trackIndex, animationName);
      }
    });
    spineBoy.setEndListener(function (trackEntry) {
      log("%d end.", trackEntry.trackIndex);
    });
    spineBoy.setCompleteListener(function (trackEntry) {
      var loopCount = Math.floor(
        trackEntry.trackTime / trackEntry.animationEnd
      );
      log("%d complete: %d", trackEntry.trackIndex, loopCount);
    });
    spineBoy.setEventListener(function (trackEntry, event) {
      log(
        trackEntry.trackIndex + " event: %s, %d, %d, %s",
        event.data.name,
        event.intValue,
        event.floatValue,
        event.stringValue
      );
    });

    var jumpEntry = spineBoy.addAnimation(0, "jump", false, 3);
    spineBoy.addAnimation(0, "run", true);
    // spineBoy.setTrackStartListener(jumpEntry, function(traceIndex){
    //     log("jumped!");
    // });

    EventManager.getInstance().addListener(
      {
        event: EventListener.TOUCH_ALL_AT_ONCE,
        onTouchesBegan: function (touches, event) {
          if (spineBoy.getTimeScale() === 1.0) spineBoy.setTimeScale(0.3);
          else spineBoy.setTimeScale(1);
        }
      },
      this
    );

    let debugBonesOn = false;
    const boneBtn = new BMButton("default_theme/rounded_shadow_2.png", "default_theme/rounded_shadow_2.png", "default_theme/rounded_shadow_2.png", Widget.PLIST_TEXTURE);
    boneBtn.setScale9Enabled(true);
    boneBtn.setCapInsets(new Rect(12, 12, 12, 12));
    boneBtn.setContentSize(196, 32);
    boneBtn.setTitleFntFile(s_simpleFont_fnt);
    boneBtn.setTitleText("Debug Bones: Off");
    boneBtn.setTitleFontSize(12);
    boneBtn.setNormalBgColor(new Color(0x00, 0x99, 0x00));
    boneBtn.setPressedBgColor(new Color(0x00, 0x66, 0x00));
    boneBtn.setDisabledBgColor(new Color(0x55, 0x55, 0x55));
    boneBtn.pressedActionEnabled = true;
    boneBtn.x = 160;
    boneBtn.y = 120;
    boneBtn.addClickEventListener(() => {
      debugBonesOn = !debugBonesOn;
      boneBtn.setTitleText(debugBonesOn ? "Debug Bones: On" : "Debug Bones: Off");
      this.onDebugBones();
    });
    this.addChild(boneBtn, 5);

    let debugSlotsOn = false;
    const slotBtn = new BMButton("default_theme/rounded_shadow_2.png", "default_theme/rounded_shadow_2.png", "default_theme/rounded_shadow_2.png", Widget.PLIST_TEXTURE);
    slotBtn.setScale9Enabled(true);
    slotBtn.setCapInsets(new Rect(12, 12, 12, 12));
    slotBtn.setContentSize(196, 32);
    slotBtn.setTitleFntFile(s_simpleFont_fnt);
    slotBtn.setTitleText("Debug Slots: Off");
    slotBtn.setTitleFontSize(12);
    slotBtn.setNormalBgColor(new Color(0x00, 0x99, 0x00));
    slotBtn.setPressedBgColor(new Color(0x00, 0x66, 0x00));
    slotBtn.setDisabledBgColor(new Color(0x55, 0x55, 0x55));
    slotBtn.pressedActionEnabled = true;
    slotBtn.x = 160;
    slotBtn.y = 160;
    slotBtn.addClickEventListener(() => {
      debugSlotsOn = !debugSlotsOn;
      slotBtn.setTitleText(debugSlotsOn ? "Debug Slots: On" : "Debug Slots: Off");
      this.onDebugSlots();
    });
    this.addChild(slotBtn, 5);
  }

  onDebugBones(sender) {
    this._spineboy.setDebugBonesEnabled(!this._spineboy.getDebugBonesEnabled());
  }

  onDebugSlots(sender) {
    this._spineboy.setDebugSlotsEnabled(!this._spineboy.getDebugSlotsEnabled());
  }

  subtitle() {
    if (this._idx % 2 == 0) {
      return "custom spine test";
    } else {
      return "Spine test";
    }
  }
  title() {
    return "Spine test";
  }

  animationStateEvent(obj, trackIndex, type, event, loopCount) {
    var entry = this._spineboy.getCurrent();
    var animationName = entry && entry.animation ? entry.animation.name : 0;
    switch (type) {
      case ANIMATION_EVENT_TYPE.START:
        log(trackIndex + " start: " + animationName);
        break;
      case ANIMATION_EVENT_TYPE.END:
        log(trackIndex + " end:" + animationName);
        break;
      case ANIMATION_EVENT_TYPE.EVENT:
        log(trackIndex + " event: " + animationName);
        break;
      case ANIMATION_EVENT_TYPE.COMPLETE:
        log(trackIndex + " complete: " + animationName + "," + loopCount);
        if (this._flipped) {
          this._flipped = false;
          this._spineboy.setScaleX(0.5);
        } else {
          this._flipped = true;
          this._spineboy.setScaleX(-0.5);
        }
        break;
      default:
        break;
    }
  }

  // automation
  numberOfPendingTests() {
    return 1;
  }
  getTestNumber() {
    return 0;
  }
}
