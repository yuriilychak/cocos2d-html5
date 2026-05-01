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

import { AnimationCacheFile } from "./animation-cache-file";
import { AnimationCacheTest } from "./animation-cache-test";
import { NodeSort } from "./node-sort";
import { SpriteAliased } from "./sprite-aliased";
import { SpriteAnchorPoint } from "./sprite-anchor-point";
import { SpriteAnimationSplit } from "./sprite-animation-split";
import { SpriteBatchBug1217 } from "./sprite-batch-bug1217";
import { SpriteBatchNodeAliased } from "./sprite-batch-node-aliased";
import { SpriteBatchNodeAnchorPoint } from "./sprite-batch-node-anchor-point";
import { SpriteBatchNodeChildrenAnchorPoint } from "./sprite-batch-node-children-anchor-point";
import { SpriteBatchNodeChildrenChildren } from "./sprite-batch-node-children-children";
import { SpriteBatchNodeChildrenScale } from "./sprite-batch-node-children-scale";
import { SpriteBatchNodeChildrenZ } from "./sprite-batch-node-children-z";
import { SpriteBatchNodeChildren } from "./sprite-batch-node-children";
import { SpriteBatchNodeColorOpacity } from "./sprite-batch-node-color-opacity";
import { SpriteBatchNodeFlip } from "./sprite-batch-node-flip";
import { SpriteBatchNodeNewTexture } from "./sprite-batch-node-new-texture";
import { SpriteBatchNodeOffsetAnchorFlip } from "./sprite-batch-node-offset-anchor-flip";
import { SpriteBatchNodeOffsetAnchorRotation } from "./sprite-batch-node-offset-anchor-rotation";
import { SpriteBatchNodeOffsetAnchorScale } from "./sprite-batch-node-offset-anchor-scale";
import { SpriteBatchNodeOffsetAnchorSkewScale } from "./sprite-batch-node-offset-anchor-skew-scale";
import { SpriteBatchNodeOffsetAnchorSkew } from "./sprite-batch-node-offset-anchor-skew";
import { SpriteBatchNodeReorderIssue744 } from "./sprite-batch-node-reorder-issue744";
import { SpriteBatchNodeReorderIssue766 } from "./sprite-batch-node-reorder-issue766";
import { SpriteBatchNodeReorderIssue767 } from "./sprite-batch-node-reorder-issue767";
import { SpriteBatchNodeReorderOneChild } from "./sprite-batch-node-reorder-one-child";
import { SpriteBatchNodeSkewNegativeScaleChildren } from "./sprite-batch-node-skew-negative-scale-children";
import { SpriteBatchNodeZOrder } from "./sprite-batch-node-zorder";
import { SpriteBatchNode1 } from "./sprite-batch-node1";
import { SpriteBlendFuncTest } from "./sprite-blend-func-test";
import { SpriteChildrenAnchorPoint } from "./sprite-children-anchor-point";
import { SpriteChildrenChildren } from "./sprite-children-children";
import { SpriteChildrenVisibilityIssue665 } from "./sprite-children-visibility-issue665";
import { SpriteChildrenVisibility } from "./sprite-children-visibility";
import { SpriteColorOpacity } from "./sprite-color-opacity";
import { SpriteDoubleResolution } from "./sprite-double-resolution";
import { SpriteFlip } from "./sprite-flip";
import { SpriteFrameAliasNameTest } from "./sprite-frame-alias-name-test";
import { SpriteFrameTest } from "./sprite-frame-test";
import { SpriteHybrid } from "./sprite-hybrid";
import { SpriteNewTexture } from "./sprite-new-texture";
import { SpriteOffsetAnchorFlip } from "./sprite-offset-anchor-flip";
import { SpriteOffsetAnchorRotation } from "./sprite-offset-anchor-rotation";
import { SpriteOffsetAnchorScale } from "./sprite-offset-anchor-scale";
import { SpriteOffsetAnchorSkewScale } from "./sprite-offset-anchor-skew-scale";
import { SpriteOffsetAnchorSkew } from "./sprite-offset-anchor-skew";
import { SpriteSkewNegativeScaleChildren } from "./sprite-skew-negative-scale-children";
import { SpriteSubclass } from "./sprite-subclass";
import { spriteTestIdx, _setspriteTestIdx } from "./sprite-test-constants";
import { SpriteWithRepeatingTexture } from "./sprite-with-repeating-texture";
import { SpriteZOrder } from "./sprite-zorder";
import { Sprite1 } from "./sprite1";
import { Sprite6 } from "./sprite6";
import { TextureColorCacheIssue } from "./texture-color-cache-issue";
import { TextureColorCacheIssue2 } from "./texture-color-cache-issue2";
import { TextureRotatedSpriteFrame } from "./texture-rotated-sprite-frame";

//
// Flow control
//
export var arrayOfSpriteTest = [
  Sprite1,
  SpriteBatchNode1,
  SpriteFrameTest,
  SpriteFrameAliasNameTest,
  SpriteAnchorPoint,
  SpriteBatchNodeAnchorPoint,
  SpriteOffsetAnchorRotation,
  SpriteBatchNodeOffsetAnchorRotation,
  SpriteOffsetAnchorScale,
  SpriteBatchNodeOffsetAnchorScale,
  SpriteAnimationSplit,
  SpriteColorOpacity,
  SpriteBatchNodeColorOpacity,
  SpriteZOrder,
  SpriteBatchNodeZOrder,
  SpriteBatchNodeReorderIssue744,
  SpriteBatchNodeReorderIssue766,
  SpriteBatchNodeReorderIssue767,
  Sprite6,
  SpriteFlip,
  SpriteBatchNodeFlip,
  SpriteAliased,
  SpriteBatchNodeAliased,
  SpriteNewTexture,
  SpriteBatchNodeNewTexture,
  SpriteHybrid,
  SpriteBatchNodeChildren,
  SpriteBatchNodeChildrenZ,
  SpriteChildrenVisibility,
  SpriteChildrenVisibilityIssue665,
  SpriteChildrenAnchorPoint,
  SpriteBatchNodeChildrenAnchorPoint,
  SpriteBatchNodeChildrenScale,
  SpriteChildrenChildren,
  SpriteBatchNodeChildrenChildren,
  SpriteSubclass,
  AnimationCacheTest,
  SpriteOffsetAnchorSkew,
  SpriteBatchNodeOffsetAnchorSkew,
  SpriteOffsetAnchorSkewScale,
  SpriteBatchNodeOffsetAnchorSkewScale,
  SpriteOffsetAnchorFlip,
  SpriteBatchNodeOffsetAnchorFlip,
  SpriteBatchNodeReorderOneChild,
  NodeSort,
  SpriteSkewNegativeScaleChildren,
  SpriteBatchNodeSkewNegativeScaleChildren,
  SpriteDoubleResolution,
  SpriteBatchBug1217,
  AnimationCacheFile,
  TextureColorCacheIssue,
  TextureColorCacheIssue2,
  TextureRotatedSpriteFrame,
  SpriteWithRepeatingTexture,
  SpriteBlendFuncTest
];

export function nextSpriteTest() {
  _setspriteTestIdx(spriteTestIdx + 1);
  _setspriteTestIdx(spriteTestIdx % arrayOfSpriteTest.length);

  if (window.sideIndexBar) {
    _setspriteTestIdx(window.sideIndexBar.changeTest(spriteTestIdx, 36));
  }

  return new arrayOfSpriteTest[spriteTestIdx]();
}

export function previousSpriteTest() {
  _setspriteTestIdx(spriteTestIdx - 1);
  if (spriteTestIdx < 0)
    _setspriteTestIdx(spriteTestIdx + arrayOfSpriteTest.length);

  if (window.sideIndexBar) {
    _setspriteTestIdx(window.sideIndexBar.changeTest(spriteTestIdx, 36));
  }

  return new arrayOfSpriteTest[spriteTestIdx]();
}

export function restartSpriteTest() {
  return new arrayOfSpriteTest[spriteTestIdx]();
}
