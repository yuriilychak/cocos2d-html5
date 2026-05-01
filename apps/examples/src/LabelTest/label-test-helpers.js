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

import { BMFontChineseTest } from "./bmfont-chinese-test";
import { BMFontColorParentChild } from "./bmfont-color-parent-child";
import { BMFontGlyphDesignerTest } from "./bmfont-glyph-designer-test";
import { BMFontHDTest } from "./bmfont-hdtest";
import { BMFontInit } from "./bmfont-init";
import { BMFontMultiLineAlignmentTest } from "./bmfont-multi-line-alignment-test";
import { BMFontMultiLineTest } from "./bmfont-multi-line-test";
import { BMFontMultiLine2Test } from "./bmfont-multi-line2-test";
import { BMFontOffsetTest } from "./bmfont-offset-test";
import { BMFontOneAtlas } from "./bmfont-one-atlas";
import { BMFontOpacityColorAlignmentTest } from "./bmfont-opacity-color-alignment-test";
import { BMFontPaddingTest } from "./bmfont-padding-test";
import { BMFontSpeedTest } from "./bmfont-speed-test";
import { BMFontSubSpriteTest } from "./bmfont-sub-sprite-test";
import { BMFontTintTest } from "./bmfont-tint-test";
import { BMFontUnicode } from "./bmfont-unicode";
import { LabelAtlasHD } from "./label-atlas-hd";
import { LabelAtlasOpacityColorTest } from "./label-atlas-opacity-color-test";
import { LabelAtlasOpacityTest } from "./label-atlas-opacity-test";
import { labelTestIdx, _setlabelTestIdx } from "./label-test-constants";
import { LabelTTFA8Test } from "./label-ttfa8-test";
import { LabelTTFAlignment } from "./label-ttfalignment";
import { LabelTTFChinese } from "./label-ttfchinese";
import { labelTTFDrawModeTest } from "./label-ttfdraw-mode-test";
import { LabelTTFFontInitTest } from "./label-ttffont-init-test";
import { LabelTTFMultiline } from "./label-ttfmultiline";
import { LabelTTFStrokeShadowTest } from "./label-ttfstroke-shadow-test";
import { LabelTTFTest } from "./label-ttftest";
import { LabelsEmpty } from "./labels-empty";
import { WrapAlgorithmTest } from "./wrap-algorithm-test";

export var LongSentencesExample =
  "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export var chineseExampleText =
  "美好的一天美好的一天美好的一天美好的一天美好的一天美好的一天美好的一天美好的一天美好的一天美好的一天美好的一天";

export var chineseMixEnglishText =
  "美好的一天bdgpy美b好b的d一b天d美好bd的p一g天美好b的d一d天bdgpybdgpybdgpybdg美好的一天bdgpy美好的一天美好的一天";

export var mixAllLanguageText =
  "美好良い一日を一Buen díabdgpy美b好b的d一b天d美Buen い一日を好b的d一d天Buen py美好的一天bdgpy美好的一天美好的一天";

export var LineBreaksExample =
  "Lorem ipsum dolor\nsit amet\nconsectetur adipisicing elit\nblah\nblah";

export var MixedExample =
  "ABC\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt\nDEF";

export var ArrowsMax = 0.95;

export var ArrowsMin = 0.7;

export var LeftAlign = 0;

export var CenterAlign = 1;

export var RightAlign = 2;

export var LongSentences = 0;

export var LineBreaks = 1;

export var Mixed = 2;

export var chineseText = 3;

export var chineseMixEnglish = 4;

export var mixAllLanguage = 5;

export var alignmentItemPadding = 40;

export var menuItemPaddingCenter = 80;

//
// Flow control
//
export var arrayOfLabelTest = [
  LabelAtlasOpacityTest,
  LabelAtlasOpacityColorTest,
  LabelAtlasHD,

  BMFontOpacityColorAlignmentTest,
  BMFontSubSpriteTest,
  BMFontPaddingTest,
  BMFontOffsetTest,
  BMFontTintTest,
  BMFontSpeedTest,
  BMFontMultiLineTest,
  BMFontMultiLine2Test,
  BMFontMultiLineAlignmentTest,
  BMFontOneAtlas,
  BMFontUnicode,
  BMFontInit,
  BMFontColorParentChild,
  BMFontHDTest,
  BMFontGlyphDesignerTest,
  BMFontChineseTest,

  LabelTTFTest,
  LabelTTFMultiline,
  LabelTTFChinese,
  LabelTTFA8Test,
  LabelTTFFontInitTest,
  LabelTTFAlignment,

  LabelsEmpty,
  LabelTTFStrokeShadowTest,
  labelTTFDrawModeTest
];

if (!cc.sys.isNative || cc.sys.isMobile) {
  arrayOfLabelTest.push(WrapAlgorithmTest);
}

export function nextLabelTest() {
  _setlabelTestIdx(labelTestIdx + 1);
  _setlabelTestIdx(labelTestIdx % arrayOfLabelTest.length);

  if (window.sideIndexBar) {
    _setlabelTestIdx(window.sideIndexBar.changeTest(labelTestIdx, 19));
  }

  return new arrayOfLabelTest[labelTestIdx]();
}

export function previousLabelTest() {
  _setlabelTestIdx(labelTestIdx - 1);
  if (labelTestIdx < 0)
    _setlabelTestIdx(labelTestIdx + arrayOfLabelTest.length);

  if (window.sideIndexBar) {
    _setlabelTestIdx(window.sideIndexBar.changeTest(labelTestIdx, 19));
  }

  return new arrayOfLabelTest[labelTestIdx]();
}

export function restartLabelTest() {
  return new arrayOfLabelTest[labelTestIdx]();
}
