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

import {
  BASE_TEST_SUBTITLE_TAG,
  BASE_TEST_TITLE_TAG,
  BaseTestLayer
} from "../BaseTestLayer/BaseTestLayer";
import { TestScene } from "../test-scene";
import { s_pathGrossini, s_simpleFont_fnt } from "../resources";
import { director, winSize } from "../constants";
import {
  Color,
  EventListener,
  EventListenerType,
  Point,
  Sprite,
  SpriteBatchNode,
  ServiceLocator
} from "@aspect/core";
import { TransitionSlideInL, TransitionSlideInR } from "@aspect/transitions";
import { ButtonLayout } from "../button-layout";
import {
  ParticleFireworks,
  ParticleMeteor,
  ParticleSun
} from "../ParticleTest/ParticleExamples";
import { ParticleSystem } from "@aspect/particle";
import { TextBMFont } from "@aspect/ccui";

export var presentationSceneIdx = -1;
export var centerPos = new Point(0, 0); // will be updated later
export var images_path = "Presentation/";

//------------------------------------------------------------------
//
// PresentationBaseLayer
//
//------------------------------------------------------------------
export class PresentationBaseLayer extends BaseTestLayer {
  constructor() {
    //
    // VERY IMPORTANT
    //
    // Only subclasses of a native classes MUST call __associateObjectWithNative
    // Failure to do so, it will crash.
    //
    super(new Color(0, 0, 0, 255), new Color(98, 99, 117, 255));

    this._title = "No title";
    this._subtitle = "No Subtitle";
    this.isMainTitle = false;
  }

  onEnter() {
    super.onEnter();

    var fontSize = 36;
    var tl = this._title.length;
    fontSize = (winSize.width / tl) * 1.6;
    if (fontSize / winSize.width > 0.09) {
      fontSize = winSize.width * 0.09;
    }

    this.label = new TextBMFont(this._title, s_simpleFont_fnt);
    this.addChild(this.label, 100);

    var isMain = this.isMainTitle;

    if (isMain === true) {
      this.label.x = centerPos.x;
      this.label.y = centerPos.y;
    } else {
      this.label.x = winSize.width / 2;
      this.label.y = (winSize.height * 11) / 12;
    }

    var subStr = this._subtitle;
    if (subStr !== "") {
      tl = this._subtitle.length;
      var subfontSize = (winSize.width / tl) * 1.3;
      if (subfontSize > fontSize * 0.4) {
        subfontSize = fontSize * 0.4;
      }

      this.sublabel = new TextBMFont(subStr, s_simpleFont_fnt);
      this.addChild(this.sublabel, 90);
      if (isMain) {
        this.sublabel.x = winSize.width / 2;
        this.sublabel.y = (winSize.height * 3) / 8;
      } else {
        this.sublabel.x = winSize.width / 2;
        this.sublabel.y = (winSize.height * 4) / 5;
      }
    } else this.sublabel = null;

    // remove "super" titles
    this.removeChildByTag(BASE_TEST_TITLE_TAG);
    this.removeChildByTag(BASE_TEST_SUBTITLE_TAG);
  }
  prevTransition() {
    return TransitionSlideInL;
  }
  nextTransition() {
    return TransitionSlideInR;
  }
  createBulletList() {
    var str = "";
    for (var i = 0; i < arguments.length; i++) {
      if (i !== 0) str += "\n";
      str += "- " + arguments[i];
    }

    var fontSize = winSize.height * 0.07;
    var bullets = new TextBMFont(str, s_simpleFont_fnt);
    bullets.x = centerPos.x;
    bullets.y = centerPos.y;
    this.addChild(bullets, 80);
  }
  createImage(file) {
    var sprite = new Sprite(file);
    sprite.x = centerPos.x;
    sprite.y = centerPos.y;
    this.addChild(sprite, 70);

    return sprite;
  }
  onRestartCallback(sender) {
    var s = new PresentationScene();
    s.addChild(restartPresentationSlide());
    director.runScene(s);
  }
  onNextCallback(sender) {
    var s = new PresentationScene();
    s.addChild(nextPresentationSlide());
    director.runScene(s);
  }
  onBackCallback(sender) {
    var s = new PresentationScene();
    s.addChild(previousPresentationSlide());
    director.runScene(s);
  }
  numberOfPendingTests() {
    return arrayOfPresentation.length - 1 - presentationSceneIdx;
  }
  getTestNumber() {
    return presentationSceneIdx;
  }
}
//
//
// callbacks
// automation
//------------------------------------------------------------------
//
// Intro Page
//
//------------------------------------------------------------------
export class IntroPage extends PresentationBaseLayer {
  constructor() {
    super();

    this._title = "cocos2d JS";
    this._subtitle = "Game Development Kit";
    this.isMainTitle = true;
  }
}
//------------------------------------------------------------------
//
// Goal Page
//
//------------------------------------------------------------------
export class GoalPage extends PresentationBaseLayer {
  constructor() {
    super();

    this._title = "Goals";
    this._subtitle = "";
    this.isMainTitle = false;

    this.createBulletList(
      "Rapid prototyping",
      "Rapid game development",
      "Multiplatform: Mobile & Web",
      "High quality code",
      "Good performance"
    );
  }
}
//------------------------------------------------------------------
//
// Solutions ?
//
//------------------------------------------------------------------
export class SolutionsPage extends PresentationBaseLayer {
  constructor() {
    super();

    this._title = "Options";
    this._subtitle = "";
    this.isMainTitle = true;
  }
}
//------------------------------------------------------------------
//
// HTML5 engines ?
//
//------------------------------------------------------------------
export class HTML5EnginesPage extends PresentationBaseLayer {
  constructor() {
    super();

    this._title = "Options";
    this._subtitle = "HTML5 engines";
    this.isMainTitle = false;

    this.createBulletList(
      "cocos2d HTML5",
      "Impact JS",
      "LimeJS",
      "Construct 2",
      "etc..."
    );
  }
}
//------------------------------------------------------------------
//
// Features
//
//------------------------------------------------------------------
export class FeaturesHTML5Page extends PresentationBaseLayer {
  constructor() {
    super();

    this._title = "HTML5 Features";
    this._subtitle = "";
    this.isMainTitle = false;

    this.createBulletList(
      "Rapid prototyping",
      "Rapid game development",
      "Multiplatform: Mobile & Web",
      "High quality code ???",
      "Good Performance ???"
    );
  }
}
//------------------------------------------------------------------
//
// ComparisonPage
//
//------------------------------------------------------------------
export class ComparisonPage extends PresentationBaseLayer {
  constructor() {
    super();

    this._title = "HTML5 Mobile performance";
    this._subtitle = "Bad performance, even with accel frameworks";
    this.isMainTitle = false;

    this.createImage(images_path + "comparison.png");
  }
}
//------------------------------------------------------------------
//
// WhatWeWantPage
//
//------------------------------------------------------------------
export class WhatWeWantPage extends PresentationBaseLayer {
  constructor() {
    super();

    this._title = "Performance";
    this._subtitle = "But what we want is...";
    this.isMainTitle = false;

    this.createBulletList(
      "Hundreds of sprites... at 60 FPS",
      "Physics... at 60 FPS",
      "Particles... at 60 FPS"
    );
  }
}
//------------------------------------------------------------------
//
// Particles Page
//
//------------------------------------------------------------------
export class ParticlesPage extends PresentationBaseLayer {
  constructor() {
    super();

    this._title = "Performance";
    this._subtitle = "Particles";

    // var tex = textureCache.addImage(s_fire);

    var firework = new ParticleFireworks();
    // firework.texture = tex;
    this.addChild(firework);
    firework.x = centerPos.x;
    firework.y = centerPos.y;

    var sun = new ParticleSun();
    // sun.texture = tex;
    this.addChild(sun);
    sun.x = winSize.width / 4;
    sun.y = winSize.height / 2;

    var meteor = new ParticleMeteor();
    // meteor.texture = tex;
    this.addChild(meteor);
    meteor.x = (winSize.width * 3) / 4;
    meteor.y = winSize.height / 2;

    var flower = new ParticleSystem("Particles/Flower.plist");
    this.addChild(flower);
    flower.x = centerPos.x;
    flower.y = centerPos.y;

    this.particle = firework;

    if (ServiceLocator.sys.capabilities.touches) {
      ServiceLocator.eventManager.addListener(
        {
          event: EventListenerType.TOUCH_ALL_AT_ONCE,
          onTouchesMoved: function (touches, event) {
            var particle = event.currentTarget.particle;
            var pos = touches[0];
            particle.x = pos.x;
            particle.y = pos.y;
          },
          onTouchesEnded: function (touches, event) {
            var particle = event.currentTarget.particle;
            var pos = touches[0];
            particle.x = pos.x;
            particle.y = pos.y;
          }
        },
        this
      );
    } else if (ServiceLocator.sys.capabilities.mouse)
      ServiceLocator.eventManager.addListener(
        {
          event: EventListenerType.MOUSE,
          onMouseMove: function (event) {
            var particle = event.currentTarget.particle;
            particle.x = event.getLocationX();
            particle.y = event.getLocationY();
          },
          onMouseUp: function (event) {
            var particle = event.currentTarget.particle;
            particle.x = event.getLocationX();
            particle.y = event.getLocationY();
          }
        },
        this
      );

    this.onExitTransitionDidStart = function () {
      director.setDisplayStats(false);
    };

    this.onEnterTransitionDidFinish = function () {
      director.setDisplayStats(true);
    };
  }
}
//------------------------------------------------------------------
//
// HowToImprovePage
//
//------------------------------------------------------------------
export class HowToImprovePage extends PresentationBaseLayer {
  constructor() {
    super();

    this._title = "Improving the performance";
    this._subtitle = 'Redefining "fast" for mobile';
    this.isMainTitle = true;
  }
}
//------------------------------------------------------------------
//
// HTML5AcceleratorPage
//
//------------------------------------------------------------------
export class HTML5AcceleratorPage extends PresentationBaseLayer {
  constructor() {
    super();

    this._title = "HTML5 Mobile Accelerators";
    this._subtitle = "";
    this.isMainTitle = false;

    this.createImage(images_path + "html5accelerator.png");
  }
}
//------------------------------------------------------------------
//
// GDKAcceleratorPage
//
//------------------------------------------------------------------
export class GDKAcceleratorPage extends PresentationBaseLayer {
  constructor() {
    super();

    this._title = "cocos2d Acceleration";
    this._subtitle = "";
    this.isMainTitle = false;

    this.createImage(images_path + "gdkaccelerator.png");
  }
}
//------------------------------------------------------------------
//
// GDKComponentsPage
//
//------------------------------------------------------------------
export class GDKComponentsPage extends PresentationBaseLayer {
  constructor() {
    super();

    this._title = "Components";
    this._subtitle = "";
    this.isMainTitle = false;

    this.createBulletList(
      "Game engine: cocos2d",
      "Physics engine: Chipmunk",
      "World Editor: CocosBuilder"
    );
  }
}
//------------------------------------------------------------------
//
// CocosStatusPage
//
//------------------------------------------------------------------
export class CocosStatusPage extends PresentationBaseLayer {
  constructor() {
    super();

    this._title = "Game Engine";
    this._subtitle = "";
    this.isMainTitle = false;

    this.createImage(images_path + "cocos2d_status.png");
  }
}
//------------------------------------------------------------------
//
// CCBStatusPage
//
//------------------------------------------------------------------
export class CCBStatusPage extends PresentationBaseLayer {
  constructor() {
    super();

    this._title = "World Editor";
    this._subtitle = "";
    this.isMainTitle = false;

    this.createImage(images_path + "cocosbuilder_status.png");
  }
}
//------------------------------------------------------------------
//
// WhoIsUsingItPage
//
//------------------------------------------------------------------
export class WhoIsUsingItPage extends PresentationBaseLayer {
  constructor() {
    super();

    this._title = "Who is using it";
    this._subtitle = "";
    this.isMainTitle = false;

    // Add companies that are using it
    this.createBulletList("Zynga", "...and you ?");
  }
}
//------------------------------------------------------------------
//
// DemoPage
//
//------------------------------------------------------------------
export class DemoPage extends PresentationBaseLayer {
  constructor() {
    super();

    this._title = "Demo";
    this._subtitle = "";
    this.isMainTitle = true;
  }
}
//------------------------------------------------------------------
//
// Thanks
//
//------------------------------------------------------------------
export class ThanksPage extends PresentationBaseLayer {
  constructor() {
    super();

    this._title = "Thanks";
    this._subtitle = "";
    this.isMainTitle = true;
  }
}
//
// Entry point
//

export class PresentationScene extends TestScene {
  constructor() {
    super("Presentation");
  }

  runThisTest() {
    presentationSceneIdx = -1;
    centerPos = new Point(winSize.width / 2, winSize.height / 2);
    var layer = nextPresentationSlide();
    this.addChild(layer);
    director.runScene(this);
  }
}

//
// Flow control
//
export var arrayOfPresentation = [
  IntroPage,
  GoalPage,
  HTML5EnginesPage,
  FeaturesHTML5Page,
  ComparisonPage,
  WhatWeWantPage,
  ParticlesPage,
  HowToImprovePage,
  HTML5AcceleratorPage,
  GDKAcceleratorPage,
  GDKComponentsPage,
  // CocosStatusPage,
  // CCBStatusPage,
  DemoPage,
  WhoIsUsingItPage,
  ThanksPage
];

export function nextPresentationSlide() {
  presentationSceneIdx++;
  presentationSceneIdx = presentationSceneIdx % arrayOfPresentation.length;
  return new arrayOfPresentation[presentationSceneIdx]();
}

export function previousPresentationSlide() {
  presentationSceneIdx--;
  if (presentationSceneIdx < 0)
    presentationSceneIdx += arrayOfPresentation.length;
  return new arrayOfPresentation[presentationSceneIdx]();
}

export function restartPresentationSlide() {
  return new arrayOfPresentation[presentationSceneIdx]();
}
