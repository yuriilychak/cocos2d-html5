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

import { ParallaxTestScene } from "./ParallaxTest/parallax-test-helpers";
import { SceneTestScene } from "./SceneTest/scene-test-helpers";
import { ActionManagerTestScene } from "./ActionManagerTest/action-manager-test-scene";
import { ActionsTestScene } from "./ActionsTest/actions-test-scene";
import { BakeLayerTestScene } from "./BakeLayerTest/bake-layer-test-scene";
import { Box2DTestScene } from "./Box2dTest/box2-dtest-scene";
import { ChipmunkTestScene } from "./ChipmunkTest/chipmunk-test-scene";
import { ClippingNodeTestScene } from "./ClippingNodeTest/clipping-node-test-scene";
import { CocosDenshionTestScene } from "./CocosDenshionTest/cocos-denshion-test-scene";
import { NodeTestScene } from "./CocosNodeTest/node-test-scene";
import { CurrentLanguageTestScene } from "./CurrentLanguageTest/current-language-test-scene";
import { DrawPrimitivesTestScene } from "./DrawPrimitivesTest/draw-primitives-test-scene";
import { EaseActionsTestScene } from "./EaseActionsTest/ease-actions-test-scene";
import { EffectAdvanceScene } from "./EffectsAdvancedTest/effect-advance-scene";
import { EffectsTestScene } from "./EffectsTest/effects-test-scene";
import { EventTestScene } from "./EventTest/event-test-scene";
import { ExtensionsTestScene } from "./ExtensionsTest/extensions-test-scene";
import { S9SpriteTestScene } from "./ExtensionsTest/S9SpriteTest/s9-sprite-test-scene";
import { IntervalTestScene } from "./IntervalTest/interval-test-scene";
import { LayerTestScene } from "./LayerTest/layer-test-scene";
import { LoaderTestScene } from "./LoaderTest/loader-test-scene";
import { MotionStreakTestScene } from "./MotionStreakTest/motion-streak-test-scene";
import { EventDispatcherTestScene } from "./NewEventManagerTest/event-dispatcher-test-scene";
import { OpenGLTestScene } from "./OpenGLTest/open-gltest-scene";
import { ParticleTestScene } from "./ParticleTest/particle-test-scene";
import { PathTestScene } from "./PathTest/path-test-scene";
import { PerformanceNowTestScene } from "./PerformanceNowTest/performance-now-test-scene";
import { ProgressActionsTestScene } from "./ProgressActionsTest/progress-actions-test-scene";
import { RenderTextureTestScene } from "./RenderTextureTest/render-texture-test-scene";
import { RotateWorldTestScene } from "./RotateWorldTest/rotate-world-test-scene";
import { SchedulerTestScene } from "./SchedulerTest/scheduler-test-scene";
import { SpineTestScene } from "./SpineTest/spine-test-scene";
import { SpriteTestScene } from "./SpriteTest/sprite-test-scene";
import { SysTestScene } from "./SysTest/sys-test-scene";
import { TestController } from "./test-controller";
import {
  g_box2d,
  g_cocosdeshion,
  g_eventDispatcher,
  g_extensions,
  g_opengl_resources,
  g_parallax,
  g_particle,
  g_s9s_blocks,
  g_spine,
  g_sprites,
  g_tilemaps,
  g_touches,
  g_transitions,
  g_ui
} from "./resources";
import {
  PLATFORM_ALL,
  PLATFORM_HTML5,
  PLATFORM_JSB_AND_WEBGL
} from "./constants";
import { TextInputTestScene } from "./TextInputTest/text-input-test-scene";
import { TexCacheTestScene } from "./TextureCacheTest/tex-cache-test-scene";
import { TileMapTestScene } from "./TileMapTest/tile-map-test-scene";
import { TouchesTestScene } from "./TouchesTest/touches-test-scene";
import { TransitionsTestScene } from "./TransitionsTest/transitions-test-scene";
import { UnitTestScene } from "./UnitTest/unit-test-scene";
import { XHRArrayBufferTestScene } from "./XHRTest/xhrarray-buffer-test-scene";
import { XHRTestScene } from "./XHRTest/xhrtest-scene";
import { GUITestScene } from "./GUITest/UISceneManager";
import { Point } from "@aspect/core";

//Controller stuff
export var LINE_SPACE = 40;

export var curPos = new Point(0, 0);

export var testNames = [
  {
    title: "ActionManager Test",
    platforms: PLATFORM_ALL,
    linksrc: "src/ActionManagerTest/ActionManagerTest.js",
    testScene: function () {
      return new ActionManagerTestScene();
    }
  },
  {
    title: "Actions Test",
    platforms: PLATFORM_ALL,
    linksrc: "src/ActionsTest/ActionsTest.js",
    testScene: function () {
      return new ActionsTestScene();
    }
  },
  {
    title: "Bake Layer Test",
    platforms: PLATFORM_HTML5,
    linksrc: "src/BakeLayerTest/BakeLayerTest.js",
    testScene: function () {
      return new BakeLayerTestScene();
    }
  },
  {
    title: "Box2D Test",
    resource: g_box2d,
    platforms: PLATFORM_HTML5,
    linksrc: "src/Box2dTest/Box2dTest.js",
    testScene: function () {
      return new Box2DTestScene();
    }
  },
  {
    title: "Chipmunk Test",
    platforms: PLATFORM_ALL,
    linksrc: "src/ChipmunkTest/ChipmunkTest.js",
    testScene: function () {
      return new ChipmunkTestScene();
    }
  },
  {
    title: "ClippingNode Test",
    platforms: PLATFORM_ALL,
    linksrc: "src/ClippingNodeTest/ClippingNodeTest.js",
    testScene: function () {
      return new ClippingNodeTestScene();
    }
  },
  {
    title: "CocosDenshion Test",
    resource: g_cocosdeshion,
    platforms: PLATFORM_ALL,
    linksrc: "src/CocosDenshionTest/CocosDenshionTest.js",
    testScene: function () {
      return new CocosDenshionTestScene();
    }
  },
  {
    title: "CurrentLanguage Test",
    platforms: PLATFORM_ALL,
    linksrc: "src/CurrentLanguageTest/CurrentLanguageTest.js",
    testScene: function () {
      return new CurrentLanguageTestScene();
    }
  },
  {
    title: "DrawPrimitives Test",
    platforms: PLATFORM_ALL,
    linksrc: "src/DrawPrimitivesTest/DrawPrimitivesTest.js",
    testScene: function () {
      return new DrawPrimitivesTestScene();
    }
  },
  {
    title: "EaseActions Test",
    platforms: PLATFORM_ALL,
    linksrc: "src/EaseActionsTest/EaseActionsTest.js",
    testScene: function () {
      return new EaseActionsTestScene();
    }
  },
  {
    title: "Event Manager Test",
    resource: g_eventDispatcher,
    platforms: PLATFORM_ALL,
    linksrc: "src/NewEventManagerTest/NewEventManagerTest.js",
    testScene: function () {
      return new EventDispatcherTestScene();
    }
  },
  {
    title: "Event Test",
    platforms: PLATFORM_ALL,
    linksrc: "src/EventTest/EventTest.js",
    testScene: function () {
      return new EventTestScene();
    }
  },
  {
    title: "Extensions Test",
    resource: g_extensions,
    platforms: PLATFORM_ALL,
    linksrc: "",
    testScene: function () {
      return new ExtensionsTestScene();
    }
  },
  {
    title: "Effects Test",
    platforms: PLATFORM_JSB_AND_WEBGL,
    linksrc: "src/EffectsTest/EffectsTest.js",
    testScene: function () {
      return new EffectsTestScene();
    }
  },
  {
    title: "Effects Advanced Test",
    platforms: PLATFORM_JSB_AND_WEBGL,
    linksrc: "src/EffectsAdvancedTest/EffectsAdvancedTest.js",
    testScene: function () {
      return new EffectAdvanceScene();
    }
  },
  {
    title: "UI Test",
    resource: g_ui,
    platforms: PLATFORM_ALL,
    linksrc: "",
    testScene: function () {
      return new GUITestScene();
    }
  },
  //"HiResTest",
  {
    title: "Interval Test",
    platforms: PLATFORM_ALL,
    linksrc: "src/IntervalTest/IntervalTest.js",
    testScene: function () {
      return new IntervalTestScene();
    }
  },
  {
    title: "Layer Test",
    platforms: PLATFORM_ALL,
    linksrc: "src/LayerTest/LayerTest.js",
    testScene: function () {
      return new LayerTestScene();
    }
  },
  {
    title: "Loader Test",
    platforms: PLATFORM_ALL,
    linksrc: "src/LoaderTest/LoaderTest.js",
    testScene: function () {
      return new LoaderTestScene();
    }
  },
  {
    title: "MotionStreak Test",
    platforms: PLATFORM_JSB_AND_WEBGL,
    linksrc: "src/MotionStreakTest/MotionStreakTest.js",
    testScene: function () {
      return new MotionStreakTestScene();
    }
  },
  {
    title: "Node Test",
    platforms: PLATFORM_ALL,
    linksrc: "src/CocosNodeTest/CocosNodeTest.js",
    testScene: function () {
      return new NodeTestScene();
    }
  },
  {
    title: "OpenGL Test",
    resource: g_opengl_resources,
    platforms: PLATFORM_JSB_AND_WEBGL,
    linksrc: "src/OpenGLTest/OpenGLTest.js",
    testScene: function () {
      return new OpenGLTestScene();
    }
  },
  {
    title: "Parallax Test",
    resource: g_parallax,
    platforms: PLATFORM_ALL,
    linksrc: "src/ParallaxTest/ParallaxTest.js",
    testScene: function () {
      return new ParallaxTestScene();
    }
  },
  {
    title: "Particle Test",
    platforms: PLATFORM_ALL,
    linksrc: "",
    resource: g_particle,
    testScene: function () {
      return new ParticleTestScene();
    }
  },
  {
    title: "Path Tests",
    platforms: PLATFORM_ALL,
    linksrc: "src/PathTest/PathTest.js",
    testScene: function () {
      return new PathTestScene();
    }
  },
  {
    title: "PerformanceNow Tests",
    platforms: PLATFORM_ALL,
    linksrc: "src/PerformanceNowTest/PerformanceNowTest.js",
    testScene: function () {
      return new PerformanceNowTestScene();
    }
  },
  {
    title: "ProgressActions Test",
    platforms: PLATFORM_ALL,
    linksrc: "src/ProgressActionsTest/ProgressActionsTest.js",
    testScene: function () {
      return new ProgressActionsTestScene();
    }
  },
  {
    title: "RenderTexture Test",
    platforms: PLATFORM_ALL,
    linksrc: "src/RenderTextureTest/RenderTextureTest.js",
    testScene: function () {
      return new RenderTextureTestScene();
    }
  },
  {
    title: "RotateWorld Test",
    platforms: PLATFORM_ALL,
    linksrc: "src/RotateWorldTest/RotateWorldTest.js",
    testScene: function () {
      return new RotateWorldTestScene();
    }
  },
  {
    title: "Scene Test",
    platforms: PLATFORM_ALL,
    linksrc: "src/SceneTest/SceneTest.js",
    testScene: function () {
      return new SceneTestScene();
    }
  },
  {
    title: "Scheduler Test",
    platforms: PLATFORM_ALL,
    linksrc: "src/SchedulerTest/SchedulerTest.js",
    testScene: function () {
      return new SchedulerTestScene();
    }
  },
  {
    title: "Spine Test",
    resource: g_spine,
    platforms: PLATFORM_ALL,
    linksrc: "src/SpineTest/SpineTest.js",
    testScene: function () {
      return new SpineTestScene();
    }
  },
  {
    title: "Sprite Test",
    resource: g_sprites,
    platforms: PLATFORM_ALL,
    linksrc: "src/SpriteTest/SpriteTest.js",
    testScene: function () {
      return new SpriteTestScene();
    }
  },
  {
    title: "Scale9Sprite Test",
    resource: g_s9s_blocks,
    platforms: PLATFORM_ALL,
    linksrc: "src/ExtensionsTest/S9SpriteTest/S9SpriteTest.js",
    testScene: function () {
      return new S9SpriteTestScene();
    }
  },
  {
    title: "TextInput Test",
    platforms: PLATFORM_HTML5,
    linksrc: "src/TextInputTest/TextInputTest.js",
    testScene: function () {
      return new TextInputTestScene();
    }
  },
  {
    title: "TextureCache Test",
    platforms: PLATFORM_ALL,
    linksrc: "src/TextureCacheTest/TextureCacheTest.js",
    testScene: function () {
      return new TexCacheTestScene();
    }
  },
  {
    title: "TileMap Test",
    resource: g_tilemaps,
    platforms: PLATFORM_ALL,
    linksrc: "src/TileMapTest/TileMapTest.js",
    testScene: function () {
      return new TileMapTestScene();
    }
  },
  {
    title: "Touches Test",
    resource: g_touches,
    platforms: PLATFORM_HTML5,
    linksrc: "src/TouchesTest/TouchesTest.js",
    testScene: function () {
      return new TouchesTestScene();
    }
  },
  {
    title: "Transitions Test",
    resource: g_transitions,
    platforms: PLATFORM_ALL,
    linksrc: "",
    testScene: function () {
      return new TransitionsTestScene();
    }
  },
  {
    title: "Unit Tests",
    platforms: PLATFORM_ALL,
    linksrc: "src/UnitTest/UnitTest.js",
    testScene: function () {
      return new UnitTestScene();
    }
  },
  {
    title: "Sys Tests",
    platforms: PLATFORM_ALL,
    linksrc: "src/SysTest/SysTest.js",
    testScene: function () {
      return new SysTestScene();
    }
  },
  {
    title: "XMLHttpRequest",
    platforms: PLATFORM_ALL,
    linksrc: "src/XHRTest/XHRTest.js",
    testScene: function () {
      return new XHRTestScene();
    }
  },
  {
    title: "XMLHttpRequest send ArrayBuffer",
    platforms: PLATFORM_ALL,
    linksrc: "src/XHRTest/XHRArrayBufferTest.js",
    testScene: function () {
      return new XHRArrayBufferTestScene();
    }
  }
];
