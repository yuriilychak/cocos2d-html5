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

import { SpriteTestDemo } from "./sprite-test-demo";
import { ONE, ONE_MINUS_SRC_ALPHA, SRC_ALPHA, Size, Sprite, ZERO, DST_COLOR, ONE_MINUS_DST_COLOR, DST_ALPHA, ONE_MINUS_DST_ALPHA, SRC_COLOR, ONE_MINUS_SRC_COLOR, ServiceLocator } from "@aspect/core";
import { TextBMFont } from "@aspect/ccui";
import { s_simpleFont_fnt } from "../resources";
export class SpriteBlendFuncTest extends SpriteTestDemo {
  //webgl only

  constructor() {
    //----start59----ctor
    super();

    ((this._title = ""), //Sprite BlendFunc test;
      (this._subtitle = ""));

    var destFactors = [
        ZERO,
        ONE,
        DST_COLOR,
        ONE_MINUS_DST_COLOR,
        DST_ALPHA,
        ONE_MINUS_DST_ALPHA
      ],
      srcFactors = [
        ZERO,
        ONE,
        SRC_COLOR,
        ONE_MINUS_SRC_COLOR,
        SRC_ALPHA,
        ONE_MINUS_SRC_ALPHA
      ];
    var destTitles = [
        "ZERO",
        "ONE",
        "DST_COLOR",
        "ONE_MINUS_DST_COLOR",
        "DST_ALPHA",
        "ONE_MINUS_DST_ALPHA"
      ],
      srcTitles = [
        "ZERO",
        "ONE",
        "SRC_COLOR",
        "ONE_MINUS_SRC_COLOR",
        "SRC_ALPHA",
        "ONE_MINUS_SRC_ALPHA"
      ];

    var sourceImg = "Images/dot.png",
      destImg = "Images/wood.jpg";
    var sourceTexture = ServiceLocator.textureCache.addImage(sourceImg);
    sourceTexture.handleLoadedTexture(true);
    var sourceSprite = new Sprite(sourceImg);
    var destSprite = new Sprite(destImg);
    sourceSprite.scale = 0.8;
    destSprite.scale = 0.8;
    sourceSprite.setPosition(60, 400);
    destSprite.setPosition(120, 400);
    this.addChild(sourceSprite);
    this.addChild(destSprite);

    if (ServiceLocator.rendererConfig.isCanvas) {
      var info = new TextBMFont("support is not complete on canvas", s_simpleFont_fnt);
      info.x = 680;
      info.y = 250;
      info.setDimensions(new Size(200, 200));
      this.addChild(info);
    }

    var i, j, title, fontSize, titleLabel;
    for (i = 0; i < destTitles.length; i++) {
      title = destTitles[i];
      fontSize = title.length > 10 ? 14 : 18;
      titleLabel = new TextBMFont(title, s_simpleFont_fnt);
      titleLabel.setAnchorPoint(0, 0.5);
      titleLabel.setPosition(0, 355 - 60 * i);
      this.addChild(titleLabel);
    }

    for (i = 0; i < srcTitles.length; i++) {
      title = srcTitles[i];
      fontSize = title.length > 10 ? 14 : 18;
      titleLabel = new TextBMFont(title, s_simpleFont_fnt);
      titleLabel.setAnchorPoint(0, 0.5);
      titleLabel.setPosition(220 + i * 60, 390);
      titleLabel.rotation = -20;
      this.addChild(titleLabel);
    }
    //j = 0;
    for (i = 0; i < srcFactors.length; i++) {
      for (j = 0; j < destFactors.length; j++) {
        sourceSprite = new Sprite(sourceImg);
        //sourceSprite.scale = 0.8;
        sourceSprite.setPosition(220 + i * 60, 355 - j * 60);
        sourceSprite.setBlendFunc(srcFactors[i], destFactors[j]);

        destSprite = new Sprite(destImg);
        //destSprite.scale = 0.8;
        destSprite.setPosition(220 + i * 60, 355 - j * 60);
        //                destSprite.setBlendFunc(srcFactors[j], destFactors[i]);

        this.addChild(destSprite, 1);
        this.addChild(sourceSprite, 2);
      }
    }
    //----end59----
  }
}
