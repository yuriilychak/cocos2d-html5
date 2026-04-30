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
var arrayOfSpriteTest = [
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
    spriteTestIdx++;
    spriteTestIdx = spriteTestIdx % arrayOfSpriteTest.length;

    if(window.sideIndexBar){
        spriteTestIdx = window.sideIndexBar.changeTest(spriteTestIdx, 36);
    }

    return new arrayOfSpriteTest[spriteTestIdx ]();
}

;

export function previousSpriteTest() {
    spriteTestIdx--;
    if (spriteTestIdx < 0)
        spriteTestIdx += arrayOfSpriteTest.length;

    if(window.sideIndexBar){
        spriteTestIdx = window.sideIndexBar.changeTest(spriteTestIdx, 36);
    }

    return new arrayOfSpriteTest[spriteTestIdx ]();
}

;

export function restartSpriteTest() {
    return new arrayOfSpriteTest[spriteTestIdx ]();
}

;
