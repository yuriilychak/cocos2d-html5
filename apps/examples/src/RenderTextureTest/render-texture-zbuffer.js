/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

import { RenderTextureBaseLayer } from "./render-texture-base-layer";
import { s_circle_plist, s_circle_png } from "../resources";

export class RenderTextureZbuffer extends RenderTextureBaseLayer {
  constructor() {
    super();

    this.mgr = null;

    this.sp1 = null;

    this.sp2 = null;

    this.sp3 = null;

    this.sp4 = null;

    this.sp5 = null;

    this.sp6 = null;

    this.sp7 = null;

    this.sp8 = null;

    this.sp9 = null;

    cc.eventManager.addListener(
      {
        event: cc.EventListener.TOUCH_ALL_AT_ONCE,
        onTouchesBegan: this.onTouchesBegan.bind(this),
        onTouchesEnded: this.onTouchesEnded.bind(this),
        onTouchesMoved: this.onTouchesMoved.bind(this)
      },
      this
    );

    var size = cc.director.getWinSize();
    var label = new cc.LabelTTF("vertexZ = 50", "Marker Felt", 64);
    label.x = size.width / 2;
    label.y = size.height * 0.25;
    this.addChild(label);

    var label2 = new cc.LabelTTF("vertexZ = 0", "Marker Felt", 64);
    label2.x = size.width / 2;
    label2.y = size.height * 0.5;
    this.addChild(label2);

    var label3 = new cc.LabelTTF("vertexZ = -50", "Marker Felt", 64);
    label3.x = size.width / 2;
    label3.y = size.height * 0.75;
    this.addChild(label3);

    label.vertexZ = 50;
    label2.vertexZ = 0;
    label3.vertexZ = -50;

    cc.spriteFrameCache.addSpriteFrames(s_circle_plist);
    this.mgr = new cc.SpriteBatchNode(s_circle_png, 9);
    this.addChild(this.mgr);
    this.sp1 = new cc.Sprite("#circle.png");
    this.sp2 = new cc.Sprite("#circle.png");
    this.sp3 = new cc.Sprite("#circle.png");
    this.sp4 = new cc.Sprite("#circle.png");
    this.sp5 = new cc.Sprite("#circle.png");
    this.sp6 = new cc.Sprite("#circle.png");
    this.sp7 = new cc.Sprite("#circle.png");
    this.sp8 = new cc.Sprite("#circle.png");
    this.sp9 = new cc.Sprite("#circle.png");

    this.mgr.addChild(this.sp1, 9);
    this.mgr.addChild(this.sp2, 8);
    this.mgr.addChild(this.sp3, 7);
    this.mgr.addChild(this.sp4, 6);
    this.mgr.addChild(this.sp5, 5);
    this.mgr.addChild(this.sp6, 4);
    this.mgr.addChild(this.sp7, 3);
    this.mgr.addChild(this.sp8, 2);
    this.mgr.addChild(this.sp9, 1);

    this.sp1.vertexZ = 400;
    this.sp2.vertexZ = 300;
    this.sp3.vertexZ = 200;
    this.sp4.vertexZ = 100;
    this.sp5.vertexZ = 0;
    this.sp6.vertexZ = -100;
    this.sp7.vertexZ = -200;
    this.sp8.vertexZ = -300;
    this.sp9.vertexZ = -400;

    this.sp9.scale = 2;
    this.sp9.color = cc.Color.YELLOW;
  }

  onTouchesBegan(touches, event) {
    if (!touches || touches.length === 0) return;

    for (var i = 0; i < touches.length; i++) {
      var location = touches[i].getLocation();

      this.sp1.x = location.x;
      this.sp1.y = location.y;
      this.sp2.x = location.x;
      this.sp2.y = location.y;
      this.sp3.x = location.x;
      this.sp3.y = location.y;
      this.sp4.x = location.x;
      this.sp4.y = location.y;
      this.sp5.x = location.x;
      this.sp5.y = location.y;
      this.sp6.x = location.x;
      this.sp6.y = location.y;
      this.sp7.x = location.x;
      this.sp7.y = location.y;
      this.sp8.x = location.x;
      this.sp8.y = location.y;
      this.sp9.x = location.x;
      this.sp9.y = location.y;
    }
  }

  onTouchesMoved(touches, event) {
    if (!touches || touches.length === 0) return;

    for (var i = 0; i < touches.length; i++) {
      var location = touches[i].getLocation();

      this.sp1.x = location.x;
      this.sp1.y = location.y;
      this.sp2.x = location.x;
      this.sp2.y = location.y;
      this.sp3.x = location.x;
      this.sp3.y = location.y;
      this.sp4.x = location.x;
      this.sp4.y = location.y;
      this.sp5.x = location.x;
      this.sp5.y = location.y;
      this.sp6.x = location.x;
      this.sp6.y = location.y;
      this.sp7.x = location.x;
      this.sp7.y = location.y;
      this.sp8.x = location.x;
      this.sp8.y = location.y;
      this.sp9.x = location.x;
      this.sp9.y = location.y;
    }
  }

  onTouchesEnded(touches, event) {
    this.renderScreenShot();
  }

  title() {
    return "Testing Z Buffer in Render Texture";
  }

  subtitle() {
    return "Touch screen. It should be green";
  }

  renderScreenShot() {
    var winSize = cc.director.getWinSize();
    var texture = new cc.RenderTexture(winSize.width, winSize.width);
    if (!texture) return;

    texture.anchorX = 0;
    texture.anchorY = 0;
    texture.begin();
    this.visit();
    texture.end();

    var sprite = new cc.Sprite(texture.getSprite().texture);

    sprite.x = winSize.width / 2;
    sprite.y = winSize.width / 2;
    sprite.opacity = 182;
    sprite.flippedY = 1;
    this.addChild(sprite, 999999);
    sprite.color = cc.Color.GREEN;

    sprite.runAction(cc.sequence(new cc.FadeTo(2, 0), new cc.Hide()));
  }
}
