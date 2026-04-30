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

var LongSentencesExample = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

var chineseExampleText = "美好的一天美好的一天美好的一天美好的一天美好的一天美好的一天美好的一天美好的一天美好的一天美好的一天美好的一天";

var chineseMixEnglishText = "美好的一天bdgpy美b好b的d一b天d美好bd的p一g天美好b的d一d天bdgpybdgpybdgpybdg美好的一天bdgpy美好的一天美好的一天";

var mixAllLanguageText = "美好良い一日を一Buen díabdgpy美b好b的d一b天d美Buen い一日を好b的d一d天Buen py美好的一天bdgpy美好的一天美好的一天";

var LineBreaksExample = "Lorem ipsum dolor\nsit amet\nconsectetur adipisicing elit\nblah\nblah";

var MixedExample = "ABC\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt\nDEF";

var ArrowsMax = 0.95;

var ArrowsMin = 0.7;

var LeftAlign = 0;

var CenterAlign = 1;

var RightAlign = 2;

var LongSentences = 0;

var LineBreaks = 1;

var Mixed = 2;

var chineseText = 3;

var chineseMixEnglish = 4;

var mixAllLanguage = 5;

var alignmentItemPadding = 40;

var menuItemPaddingCenter = 80;

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
var arrayOfLabelTest = [
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
    labelTestIdx++;
    labelTestIdx = labelTestIdx % arrayOfLabelTest.length;

    if(window.sideIndexBar){
        labelTestIdx = window.sideIndexBar.changeTest(labelTestIdx, 19);
    }

    return new arrayOfLabelTest[labelTestIdx]();
}

;

export function previousLabelTest() {
    labelTestIdx--;
    if (labelTestIdx < 0)
        labelTestIdx += arrayOfLabelTest.length;

    if(window.sideIndexBar){
        labelTestIdx = window.sideIndexBar.changeTest(labelTestIdx, 19);
    }

    return new arrayOfLabelTest[labelTestIdx]();
}

;

export function restartLabelTest() {
    return new arrayOfLabelTest[labelTestIdx]();
}

;
