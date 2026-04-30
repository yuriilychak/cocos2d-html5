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

import { AnimationCacheFile } from "./animation-cache-file.js";
import { AnimationCacheTest } from "./animation-cache-test.js";
import { NodeSort } from "./node-sort.js";
import { SpriteAliased } from "./sprite-aliased.js";
import { SpriteAnchorPoint } from "./sprite-anchor-point.js";
import { SpriteAnimationSplit } from "./sprite-animation-split.js";
import { SpriteBatchBug1217 } from "./sprite-batch-bug1217.js";
import { SpriteBatchNodeAliased } from "./sprite-batch-node-aliased.js";
import { SpriteBatchNodeAnchorPoint } from "./sprite-batch-node-anchor-point.js";
import { SpriteBatchNodeChildrenAnchorPoint } from "./sprite-batch-node-children-anchor-point.js";
import { SpriteBatchNodeChildrenChildren } from "./sprite-batch-node-children-children.js";
import { SpriteBatchNodeChildrenScale } from "./sprite-batch-node-children-scale.js";
import { SpriteBatchNodeChildrenZ } from "./sprite-batch-node-children-z.js";
import { SpriteBatchNodeChildren } from "./sprite-batch-node-children.js";
import { SpriteBatchNodeColorOpacity } from "./sprite-batch-node-color-opacity.js";
import { SpriteBatchNodeFlip } from "./sprite-batch-node-flip.js";
import { SpriteBatchNodeNewTexture } from "./sprite-batch-node-new-texture.js";
import { SpriteBatchNodeOffsetAnchorFlip } from "./sprite-batch-node-offset-anchor-flip.js";
import { SpriteBatchNodeOffsetAnchorRotation } from "./sprite-batch-node-offset-anchor-rotation.js";
import { SpriteBatchNodeOffsetAnchorScale } from "./sprite-batch-node-offset-anchor-scale.js";
import { SpriteBatchNodeOffsetAnchorSkewScale } from "./sprite-batch-node-offset-anchor-skew-scale.js";
import { SpriteBatchNodeOffsetAnchorSkew } from "./sprite-batch-node-offset-anchor-skew.js";
import { SpriteBatchNodeReorderIssue744 } from "./sprite-batch-node-reorder-issue744.js";
import { SpriteBatchNodeReorderIssue766 } from "./sprite-batch-node-reorder-issue766.js";
import { SpriteBatchNodeReorderIssue767 } from "./sprite-batch-node-reorder-issue767.js";
import { SpriteBatchNodeReorderOneChild } from "./sprite-batch-node-reorder-one-child.js";
import { SpriteBatchNodeSkewNegativeScaleChildren } from "./sprite-batch-node-skew-negative-scale-children.js";
import { SpriteBatchNodeZOrder } from "./sprite-batch-node-zorder.js";
import { SpriteBatchNode1 } from "./sprite-batch-node1.js";
import { SpriteBlendFuncTest } from "./sprite-blend-func-test.js";
import { SpriteChildrenAnchorPoint } from "./sprite-children-anchor-point.js";
import { SpriteChildrenChildren } from "./sprite-children-children.js";
import { SpriteChildrenVisibilityIssue665 } from "./sprite-children-visibility-issue665.js";
import { SpriteChildrenVisibility } from "./sprite-children-visibility.js";
import { SpriteColorOpacity } from "./sprite-color-opacity.js";
import { SpriteDoubleResolution } from "./sprite-double-resolution.js";
import { SpriteFlip } from "./sprite-flip.js";
import { SpriteFrameAliasNameTest } from "./sprite-frame-alias-name-test.js";
import { SpriteFrameTest } from "./sprite-frame-test.js";
import { SpriteHybrid } from "./sprite-hybrid.js";
import { SpriteNewTexture } from "./sprite-new-texture.js";
import { SpriteOffsetAnchorFlip } from "./sprite-offset-anchor-flip.js";
import { SpriteOffsetAnchorRotation } from "./sprite-offset-anchor-rotation.js";
import { SpriteOffsetAnchorScale } from "./sprite-offset-anchor-scale.js";
import { SpriteOffsetAnchorSkewScale } from "./sprite-offset-anchor-skew-scale.js";
import { SpriteOffsetAnchorSkew } from "./sprite-offset-anchor-skew.js";
import { SpriteSkewNegativeScaleChildren } from "./sprite-skew-negative-scale-children.js";
import { SpriteSubclass } from "./sprite-subclass.js";
import { spriteTestIdx , _setspriteTestIdx} from "./sprite-test-constants.js";
import { SpriteWithRepeatingTexture } from "./sprite-with-repeating-texture.js";
import { SpriteZOrder } from "./sprite-zorder.js";
import { Sprite1 } from "./sprite1.js";
import { Sprite6 } from "./sprite6.js";
import { TextureColorCacheIssue } from "./texture-color-cache-issue.js";
import { TextureColorCacheIssue2 } from "./texture-color-cache-issue2.js";
import { TextureRotatedSpriteFrame } from "./texture-rotated-sprite-frame.js";

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

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

    if(window.sideIndexBar){
        _setspriteTestIdx(window.sideIndexBar.changeTest(spriteTestIdx, 36));
    }

    return new arrayOfSpriteTest[spriteTestIdx ]();
}

;

export function previousSpriteTest() {
    _setspriteTestIdx(spriteTestIdx - 1);
    if (spriteTestIdx < 0)
        _setspriteTestIdx(spriteTestIdx + (arrayOfSpriteTest.length));

    if(window.sideIndexBar){
        _setspriteTestIdx(window.sideIndexBar.changeTest(spriteTestIdx, 36));
    }

    return new arrayOfSpriteTest[spriteTestIdx ]();
}

;

export function restartSpriteTest() {
    return new arrayOfSpriteTest[spriteTestIdx ]();
}

;
