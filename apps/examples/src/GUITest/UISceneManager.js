/****************************************************************************
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

 THE SOFTWARE IS PROVIDED "AS IS()", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import { UIButtonDisableDefaultTest } from "./UIButtonTest/uibutton-disable-default-test.js";
import { UIButtonFlipTest } from "./UIButtonTest/uibutton-flip-test.js";
import { UIButtonIgnoreContentSizeTest } from "./UIButtonTest/uibutton-ignore-content-size-test.js";
import { UIButtonNormalDefaultTest } from "./UIButtonTest/uibutton-normal-default-test.js";
import { UIButtonTest_PressedAction } from "./UIButtonTest/uibutton-test-pressed-action.js";
import { UIButtonTestRemoveSelf } from "./UIButtonTest/uibutton-test-remove-self.js";
import { UIButtonTest_Scale9 } from "./UIButtonTest/uibutton-test-scale9.js";
import { UIButtonTestSwitchScale9 } from "./UIButtonTest/uibutton-test-switch-scale9.js";
import { UIButtonTest_Title } from "./UIButtonTest/uibutton-test-title.js";
import { UIButtonTestZoomScale } from "./UIButtonTest/uibutton-test-zoom-scale.js";
import { UIButtonTest } from "./UIButtonTest/uibutton-test.js";
import { UIButtonTextOnly } from "./UIButtonTest/uibutton-text-only.js";
import { UIButtonTitleEffectTest } from "./UIButtonTest/uibutton-title-effect-test.js";
import { UICheckBoxDefaultBehaviorTest } from "./UICheckBoxTest/uicheck-box-default-behavior-test.js";
import { UICheckBoxTest } from "./UICheckBoxTest/uicheck-box-test.js";
import { UIFocusTestHorizontal } from "./UIFocusTest/uifocus-test-horizontal.js";
import { UIFocusTestNestedLayout1 } from "./UIFocusTest/uifocus-test-nested-layout1.js";
import { UIFocusTestNestedLayout2 } from "./UIFocusTest/uifocus-test-nested-layout2.js";
import { UIFocusTestNestedLayout3 } from "./UIFocusTest/uifocus-test-nested-layout3.js";
import { UIFocusTestVertical } from "./UIFocusTest/uifocus-test-vertical.js";
import { UIImageViewFlipTest } from "./UIImageViewTest/uiimage-view-flip-test.js";
import { UIImageViewTest_ContentSize } from "./UIImageViewTest/uiimage-view-test-content-size.js";
import { UIImageViewTest_Scale9 } from "./UIImageViewTest/uiimage-view-test-scale9.js";
import { UIImageViewTest } from "./UIImageViewTest/uiimage-view-test.js";
import { UILabelAtlasTest } from "./UILabelAtlasTest/UILabelAtlasTest.js";
import { UILabelBMFontTest } from "./UILabelBMFontTest/UILabelBMFontTest.js";
import { UILabelTest_LineWrap } from "./UILabelTest/uilabel-test-line-wrap.js";
import { UILabelTest_TTF } from "./UILabelTest/uilabel-test-ttf.js";
import { UILabelTest } from "./UILabelTest/uilabel-test.js";
import { UILayoutComponent_Berth_Stretch_Test } from "./UILayoutTest/uilayout-component-berth-stretch-test.js";
import { UILayoutComponent_Berth_Test } from "./UILayoutTest/uilayout-component-berth-test.js";
import { UILayoutTest_BackGroundImage_Scale9 } from "./UILayoutTest/uilayout-test-back-ground-image-scale9.js";
import { UILayoutTest_BackGroundImage } from "./UILayoutTest/uilayout-test-back-ground-image.js";
import { UILayoutTest_Color } from "./UILayoutTest/uilayout-test-color.js";
import { UILayoutTest_Gradient } from "./UILayoutTest/uilayout-test-gradient.js";
import { UILayoutTest_Layout_Linear_Horizontal } from "./UILayoutTest/uilayout-test-layout-linear-horizontal.js";
import { UILayoutTest_Layout_Linear_Vertical } from "./UILayoutTest/uilayout-test-layout-linear-vertical.js";
import { UILayoutTest_Layout_Relative_Align_Parent } from "./UILayoutTest/uilayout-test-layout-relative-align-parent.js";
import { UILayoutTest_Layout_Relative_Location } from "./UILayoutTest/uilayout-test-layout-relative-location.js";
import { UILayoutTest_Layout_Relative } from "./UILayoutTest/uilayout-test-layout-relative.js";
import { UILayoutTest_Layout_Scaled_Widget } from "./UILayoutTest/uilayout-test-layout-scaled-widget.js";
import { UILayoutTest } from "./UILayoutTest/uilayout-test.js";
import { UIListViewTest_Horizontal } from "./UIListViewTest/uilist-view-test-horizontal.js";
import { UIListViewTest_MagneticHorizontal } from "./UIListViewTest/uilist-view-test-magnetic-horizontal.js";
import { UIListViewTest_MagneticVertical } from "./UIListViewTest/uilist-view-test-magnetic-vertical.js";
import { UIListViewTest_ScrollToItemHorizontal } from "./UIListViewTest/uilist-view-test-scroll-to-item-horizontal.js";
import { UIListViewTest_ScrollToItemVertical } from "./UIListViewTest/uilist-view-test-scroll-to-item-vertical.js";
import { UIListViewTest_TouchIntercept } from "./UIListViewTest/uilist-view-test-touch-intercept.js";
import { UIListViewTest_Vertical } from "./UIListViewTest/uilist-view-test-vertical.js";
import { UILoadingBarTest_Fix_Scale9 } from "./UILoadingBarTest/uiloading-bar-test-fix-scale9.js";
import { UILoadingBarTest_Fix } from "./UILoadingBarTest/uiloading-bar-test-fix.js";
import { UILoadingBarTest_Left_Scale9 } from "./UILoadingBarTest/uiloading-bar-test-left-scale9.js";
import { UILoadingBarTest_Left } from "./UILoadingBarTest/uiloading-bar-test-left.js";
import { UILoadingBarTest_Right_Scale9 } from "./UILoadingBarTest/uiloading-bar-test-right-scale9.js";
import { UILoadingBarTest_Right } from "./UILoadingBarTest/uiloading-bar-test-right.js";
import { UIWidgetAddNodeTest } from "./UINodeContainerTest/UINodeContainerTest.js";
import { UIPageViewButtonTest } from "./UIPageViewTest/uipage-view-button-test.js";
import { UIPageViewChildSizeTest } from "./UIPageViewTest/uipage-view-child-size-test.js";
import { UIPageViewCustomScrollThreshold } from "./UIPageViewTest/uipage-view-custom-scroll-threshold.js";
import { UIPageViewDisableTouchTest } from "./UIPageViewTest/uipage-view-disable-touch-test.js";
import { UIPageViewDynamicAddAndRemoveTest } from "./UIPageViewTest/uipage-view-dynamic-add-and-remove-test.js";
import { UIPageViewIndicatorTest } from "./UIPageViewTest/uipage-view-indicator-test.js";
import { UIPageViewJumpToPageTest } from "./UIPageViewTest/uipage-view-jump-to-page-test.js";
import { UIPageViewTest } from "./UIPageViewTest/uipage-view-test.js";
import { UIPageViewTouchPropagationTest } from "./UIPageViewTest/uipage-view-touch-propagation-test.js";
import { UIRichTextTest } from "./UIRichTextTest/uirich-text-test.js";
import { UIRichTextXMLBasic } from "./UIRichTextTest/uirich-text-xmlbasic.js";
import { UIRichTextXMLBR } from "./UIRichTextTest/uirich-text-xmlbr.js";
import { UIRichTextXMLColor } from "./UIRichTextTest/uirich-text-xmlcolor.js";
import { UIRichTextXMLFace } from "./UIRichTextTest/uirich-text-xmlface.js";
import { UIRichTextXMLImg } from "./UIRichTextTest/uirich-text-xmlimg.js";
import { UIRichTextXMLInvalid } from "./UIRichTextTest/uirich-text-xmlinvalid.js";
import { UIRichTextXMLSmallBig } from "./UIRichTextTest/uirich-text-xmlsmall-big.js";
import { UIRichTextXMLSUIB } from "./UIRichTextTest/uirich-text-xmlsuib.js";
import { UIRichTextXMLSUIB2 } from "./UIRichTextTest/uirich-text-xmlsuib2.js";
import { UIRichTextXMLSUIB3 } from "./UIRichTextTest/uirich-text-xmlsuib3.js";
import { UIRichTextXMLUrl } from "./UIRichTextTest/uirich-text-xmlurl.js";
import { UIS9NinePatchTest } from "./UIS9NinePatchTest/UIS9NinePatchTest.js";
import { UIScene } from "./uiscene.js";
import { UIScrollViewDisableTest } from "./UIScrollViewTest/uiscroll-view-disable-test.js";
import { UIScrollViewNestTest } from "./UIScrollViewTest/uiscroll-view-nest-test.js";
import { UIScrollViewRotated } from "./UIScrollViewTest/uiscroll-view-rotated.js";
import { UIScrollViewTest_Both } from "./UIScrollViewTest/uiscroll-view-test-both.js";
import { UIScrollViewTest_Horizontal } from "./UIScrollViewTest/uiscroll-view-test-horizontal.js";
import { UIScrollViewTest_ScrollBar } from "./UIScrollViewTest/uiscroll-view-test-scroll-bar.js";
import { UIScrollViewTest_ScrollToPercentBothDirection_Bounce } from "./UIScrollViewTest/uiscroll-view-test-scroll-to-percent-both-direction-bounce.js";
import { UIScrollViewTest_ScrollToPercentBothDirection } from "./UIScrollViewTest/uiscroll-view-test-scroll-to-percent-both-direction.js";
import { UIScrollViewTest_Vertical_Multiple } from "./UIScrollViewTest/uiscroll-view-test-vertical-multiple.js";
import { UIScrollViewTest_Vertical } from "./UIScrollViewTest/uiscroll-view-test-vertical.js";
import { UISliderDisabledDefaultTest } from "./UISliderTest/uislider-disabled-default-test.js";
import { UISliderNormalDefaultTest } from "./UISliderTest/uislider-normal-default-test.js";
import { UISliderTest_Scale9 } from "./UISliderTest/uislider-test-scale9.js";
import { UISliderTest } from "./UISliderTest/uislider-test.js";
import { UITextFieldTest_LineWrap } from "./UITextFieldTest/uitext-field-test-line-wrap.js";
import { UITextFieldTest_MaxLength } from "./UITextFieldTest/uitext-field-test-max-length.js";
import { UITextFieldTest_Password } from "./UITextFieldTest/uitext-field-test-password.js";
import { UITextFieldTest_PlaceHolderColor } from "./UITextFieldTest/uitext-field-test-place-holder-color.js";
import { UITextFieldTest_TrueTypeFont } from "./UITextFieldTest/uitext-field-test-true-type-font.js";
import { UITextFieldTest } from "./UITextFieldTest/uitext-field-test.js";
import { UILabelTest_Effect } from "./UITextTest/uilabel-test-effect.js";
import { UITextTest_IgnoreContentSize } from "./UITextTest/uitext-test-ignore-content-size.js";
import { UITextTest_LineWrap } from "./UITextTest/uitext-test-line-wrap.js";
import { UITextTest_TTF } from "./UITextTest/uitext-test-ttf.js";
import { UITextTest } from "./UITextTest/uitext-test.js";
import { UIVideoPlayerTest } from "./UIVideoPlayerTest/UIVideoPlayerTest.js";
import { UIWebViewTest } from "./UIWebViewTest/UIWebViewTest.js";
import { TestScene } from "../test-scene.js";
import { winSize } from "../tests-main-constants.js";

    var currentTestingArray = null;

    var testingItems = {
        "UIButton": [
            {
                title: "UIButtonTest",
                func: function () {
                    return new UIButtonTest();
                }
            },
            {
                title: "UIButtonTest_Scale9",
                func: function () {
                    return new UIButtonTest_Scale9();
                }
            },
            {
                title: "UIButtonTest_PressedAction",
                func: function () {
                    return new UIButtonTest_PressedAction();
                }
            },
            {
                title: "UIButtonTest_Title",
                func: function () {
                    return new UIButtonTest_Title();
                }
            },
            {
                title: "UIButtonTestRemoveSelf",
                func: function () {
                    return new UIButtonTestRemoveSelf();
                }
            },
            {
                title: "UIButtonTestSwitchScale9",
                func: function () {
                    return new UIButtonTestSwitchScale9();
                }
            },
            {
                title: "UIButtonTestZoomScale",
                func: function () {
                    return new UIButtonTestZoomScale();
                }
            },
            {
                title: "UIButtonTextOnly",
                func: function () {
                    return new UIButtonTextOnly();
                }
            },
            {
                title: "UIButtonIgnoreContentSizeTest",
                func: function () {
                    return new UIButtonIgnoreContentSizeTest();
                }
            },
            {
                title: "UIButtonTitleEffectTest",
                func: function () {
                    return new UIButtonTitleEffectTest();
                }
            },
            {
                title: "UIButtonFlipTest",
                func: function () {
                    return new UIButtonFlipTest();
                }
            },
            {
                title: "UIButtonNormalDefaultTest",
                func: function () {
                    return new UIButtonNormalDefaultTest();
                }
            },
            {
                title: "UIButtonDisableDefaultTest",
                func: function () {
                    return new UIButtonDisableDefaultTest();
                }
            }
        ],
        "UIFocus": [
            {
                title: "UIFocusTestHorizontal",
                func: function () {
                    return new UIFocusTestHorizontal();
                }
            },
            {
                title: "UIFocusTestVertical",
                func: function () {
                    return new UIFocusTestVertical();
                }
            },
            {
                title: "UIFocusTestNestedLayout1",
                func: function () {
                    return new UIFocusTestNestedLayout1();
                }
            },
            {
                title: "UIFocusTestNestedLayout2",
                func: function () {
                    return new UIFocusTestNestedLayout2();
                }
            },
            {
                title: "UIFocusTestNestedLayout3",
                func: function () {
                    return new UIFocusTestNestedLayout3();
                }
            }
            /*{     //need test
                title: "UIFocusTestListView",
                func: function () {
                    return new UIFocusTestListView();
                }
            }*/
        ],
        "UICheckBox": [
            {
                title: "UICheckBoxTest",
                func: function () {
                    return new UICheckBoxTest();
                }
            },
            {
                title: "UICheckBoxDefaultBehaviorTest",
                func: function(){
                    return new UICheckBoxDefaultBehaviorTest();
                }
            }
        ],
        "UISlider": [
            {
                title: "UISliderTest",
                func: function () {
                    return new UISliderTest();
                }
            },
            {
                title: "UISliderTest_Scale9",
                func: function () {
                    return new UISliderTest_Scale9();
                }
            },
            {
                title: "UISliderNormalDefaultTest",
                func: function () {
                    return new UISliderNormalDefaultTest();
                }
            },
            {
                title: "UISliderDisabledDefaultTest",
                func: function () {
                    return new UISliderDisabledDefaultTest();
                }
            }
        ],
        "UIImageView": [
            {
                title: "UIImageViewTest",
                func: function () {
                    return new UIImageViewTest();
                }
            },
            {
                title: "UIImageViewTest_Scale9",
                func: function () {
                    return new UIImageViewTest_Scale9();
                }
            },
            {
                title: "UIImageViewTest_ContentSize",
                func: function () {
                    return new UIImageViewTest_ContentSize();
                }
            },
            {
                title: "UIImageViewFlipTest",
                func: function () {
                    return new UIImageViewFlipTest();
                }
            }
        ],
        "UILoadingBar": [
            {
                title: "UILoadingBarTest_Left",
                func: function () {
                    return new UILoadingBarTest_Left();
                }
            },
            {
                title: "UILoadingBarTest_Right",
                func: function () {
                    return new UILoadingBarTest_Right();
                }
            },
            {
                title: "UILoadingBarTest_Fix",
                func: function(){
                    return new UILoadingBarTest_Fix();
                }
            },
            {
                title: "UILoadingBarTest_Left_Scale9",
                func: function () {
                    return new UILoadingBarTest_Left_Scale9();
                }
            },
            {
                title: "UILoadingBarTest_Right_Scale9",
                func: function () {
                    return new UILoadingBarTest_Right_Scale9();
                }
            },
            {
                title: "UILoadingBarTest_Fix_Scale9",
                func: function(){
                    return new UILoadingBarTest_Fix_Scale9();
                }
            }
        ],
        "UIText": [
            {
                title: "UITextTest",
                func: function(){
                    return new UITextTest();
                }
            },
            {
                title: "UITextTest_LineWrap",
                func: function(){
                    return new UITextTest_LineWrap();
                }
            },
            {
                title: "UILabelTest_Effect",
                func: function(){
                    return new UILabelTest_Effect();
                }
            },
            {
                title: "UITextTest_TTF",
                func: function(){
                    return new UITextTest_TTF();
                }
            },
            {
                title: "UITextTest_IgnoreContentSize",
                func: function(){
                    return new UITextTest_IgnoreContentSize();
                }
            },
            {
                title: "UILabelAtlasTest",
                func: function () {
                    return new UILabelAtlasTest();
                }
            },
            {
                title: "UILabelTest",
                func: function () {
                    return new UILabelTest();
                }
            },
            {
                title: "UILabelTest_LineWrap",
                func: function () {
                    return new UILabelTest_LineWrap();
                }
            },
            {
                title: "UILabelBMFontTest",
                func: function () {
                    return new UILabelBMFontTest();
                }
            },
            {
                title: "UILabelTest_TTF",
                func: function () {
                    return new UILabelTest_TTF();
                }
            }
        ],
        "UITextFiled": [
            {
                title: "UITextFieldTest",
                func: function () {
                    return new UITextFieldTest();
                }
            },
            {
                title: "UITextFieldTest_MaxLength",
                func: function () {
                    return new UITextFieldTest_MaxLength();
                }
            },
            {
                title: "UITextFieldTest_Password",
                func: function () {
                    return new UITextFieldTest_Password();
                }
            },
            {
                title: "UITextFieldTest_LineWrap",
                func: function () {
                    return new UITextFieldTest_LineWrap();
                }
            },
            {
                title: "UITextFieldTest_TrueTypeFont",
                func: function () {
                    return new UITextFieldTest_TrueTypeFont();
                }
            },
            {
                title: "UITextFieldTest_PlaceHolderColor",
                func: function () {
                    return new UITextFieldTest_PlaceHolderColor();
                }
            }
        ],
        "UILayout": [
            {
                title: "UILayoutTest",
                func: function () {
                    return new UILayoutTest();
                }
            },
            {
                title: "UILayoutTest_Color",
                func: function () {
                    return new UILayoutTest_Color();
                }
            },
            {
                title: "UILayoutTest_Gradient", func: function () {
                return new UILayoutTest_Gradient();
            }
            },
            {
                title: "UILayoutTest_BackGroundImage",
                func: function () {
                    return new UILayoutTest_BackGroundImage();
                }
            },
            {
                title: "UILayoutTest_BackGroundImage_Scale9",
                func: function () {
                    return new UILayoutTest_BackGroundImage_Scale9();
                }
            },
            {
                title: "UILayoutTest_Layout_Linear_Vertical",
                func: function () {
                    return new UILayoutTest_Layout_Linear_Vertical();
                }
            },
            {
                title: "UILayoutTest_Layout_Linear_Horizontal",
                func: function () {
                    return new UILayoutTest_Layout_Linear_Horizontal();
                }
            },
            {
                title: "UILayoutTest_Layout_Relative",
                func: function () {
                    return new UILayoutTest_Layout_Relative();
                }
            },
            {
                title: "UILayoutTest_Layout_Relative_Align_Parent",
                func: function () {
                    return new UILayoutTest_Layout_Relative_Align_Parent();
                }
            },
            {
                title: "UILayoutTest_Layout_Relative_Location",
                func: function () {
                    return new UILayoutTest_Layout_Relative_Location();
                }
            },
            {
                title: "UILayoutTest_Layout_Scaled_Widget",
                func: function () {
                    return new UILayoutTest_Layout_Scaled_Widget();
                }
            },
            {
                title: "UILayoutComponent_Berth_Test",
                func: function () {
                    return new UILayoutComponent_Berth_Test();
                }
            },
            {
                title: "UILayoutComponent_Berth_Stretch_Test",
                func: function () {
                    return new UILayoutComponent_Berth_Stretch_Test();
                }
            }
        ],
        "UIScrollView": [
            {
                title: "UIScrollViewTest_Vertical",
                func: function () {
                    return new UIScrollViewTest_Vertical();
                }
            },
            {
                title: "UIScrollViewTest_Horizontal",
                func: function () {
                    return new UIScrollViewTest_Horizontal();
                }
            },
            {
                title: "UIScrollViewTest_Both",
                func: function () {
                    return new UIScrollViewTest_Both();
                }
            },
            {
                title: "UIScrollViewTest_ScrollToPercentBothDirection",
                func: function () {
                    return new UIScrollViewTest_ScrollToPercentBothDirection();
                }
            },
            {
                title: "UIScrollViewTest_ScrollToPercentBothDirection_Bounce",
                func: function () {
                    return new UIScrollViewTest_ScrollToPercentBothDirection_Bounce();
                }
            },
            {
                title: "UIScrollViewNestTest",
                func: function () {
                    return new UIScrollViewNestTest();
                }
            },
            {
                title: "UIScrollViewRotated",
                func: function () {
                    return new UIScrollViewRotated();
                }
            },
            {
                title: "UIScrollViewDisableTest",
                func: function () {
                    return new UIScrollViewDisableTest();
                }
            },
            {
                title:"UIScrollView Multiple Items Test",
                func: function () {
                    return new UIScrollViewTest_Vertical_Multiple();
                }
            },
            {
                title:"UIScrollView Scroll Bar Test",
                func: function () {
                    return new UIScrollViewTest_ScrollBar();
                }
            }
        ],
        "UIPageView": [
            {
                title: "UIPageViewTest",
                func: function () {
                    return new UIPageViewTest();
                }
            },
            {
                title: "UIPageViewButtonTest",
                func: function () {
                    return new UIPageViewButtonTest();
                }
            },
            {
                title: "UIPageViewCustomScrollThreshold",
                func: function () {
                    return new UIPageViewCustomScrollThreshold();
                }
            },
            {
                title: "UIPageViewTouchPropagationTest",
                func: function () {
                    return new UIPageViewTouchPropagationTest();
                }
            },
            {
                title: "UIPageViewDynamicAddAndRemoveTest",
                func: function () {
                    return new UIPageViewDynamicAddAndRemoveTest();
                }
            },
            {
                title: "UIPageViewDisableTouchTest",
                func: function () {
                    return new UIPageViewDisableTouchTest();
                }
            },
            {
                title: "UIPageViewJumpToPageTest",
                func: function () {
                    return new UIPageViewJumpToPageTest();
                }
            },
            {
                title: "UIPageViewChildSizeTest",
                func: function () {
                    return new UIPageViewChildSizeTest();
                }
            },
            {
                title: "UIPageViewIndicatorTest",
                func: function () {
                    return new UIPageViewIndicatorTest();
                }
            }
        ],
        "UIListView": [
            {
                title: "UIListViewTest_Vertical",
                func: function () {
                    return new UIListViewTest_Vertical();
                }
            },
            {
                title: "UIListViewTest_Horizontal",
                func: function () {
                    return new UIListViewTest_Horizontal();
                }
            },
            {
                title:"UIListViewTest_TouchIntercept ",
                func: function() {
                    return new UIListViewTest_TouchIntercept();
                }
            },
            {
                title:"UIListViewTest Scroll to item  vertical",
                func: function() {
                    return new UIListViewTest_ScrollToItemVertical();
                }
            },
            {
                title:"UIListViewTest Scroll to item horizontal",
                func: function() {
                    return new UIListViewTest_ScrollToItemHorizontal();
                }
            },
            {
                title:"UIListViewTest magnetic vertical",
                func: function() {
                    return new UIListViewTest_MagneticVertical();
                }
            },
            {
                title:"UIListViewTest magnetic horizontal",
                func: function() {
                    return new UIListViewTest_MagneticHorizontal();
                }
            }
        ],
        "UIWidget": [
            {
                title: "UIWidgetAddNodeTest",
                func: function () {
                    return new UIWidgetAddNodeTest();
                }
            }
        ],
        "UIRichText": [
            {
                title: "UIRichTextTest",
                func: function () {
                    return new UIRichTextTest();
                }
            },
            {
                title: "UIRichTextXMLBasic",
                func: function () {
                    return new UIRichTextXMLBasic();
                }
            },
            {
                title: "UIRichTextXMLSmallBig",
                func: function () {
                    return new UIRichTextXMLSmallBig();
                }
            },
            {
                title: "UIRichTextXMLColor",
                func: function () {
                    return new UIRichTextXMLColor();
                }
            },
            {
                title: "UIRichTextXMLSUIB",
                func: function () {
                    return new UIRichTextXMLSUIB();
                }
            },
            {
                title: "UIRichTextXMLSUIB2",
                func: function () {
                    return new UIRichTextXMLSUIB2();
                }
            },
            {
                title: "UIRichTextXMLSUIB3",
                func: function () {
                    return new UIRichTextXMLSUIB3();
                }
            },
            {
                title: "UIRichTextXMLImg",
                func: function () {
                    return new UIRichTextXMLImg();
                }
            },
            {
                title: "UIRichTextXMLUrl",
                func: function () {
                    return new UIRichTextXMLUrl();
                }
            },
            {
                title: "UIRichTextXMLFace",
                func: function () {
                    return new UIRichTextXMLFace();
                }
            },
            {
                title: "UIRichTextXMLBR",
                func: function () {
                    return new UIRichTextXMLBR();
                }
            },
            {
                title: "UIRichTextXMLInvalid",
                func: function () {
                    return new UIRichTextXMLInvalid();
                }
            }
        ]
    };

    if (cc.sys.isNative) {
        testingItems["UIS9NinePatchTest"] = [
        {
                title: "UIS9NinePatchTest",
                func: function () {
                    return new UIS9NinePatchTest();
                }
            }
        ];
    }
    else {
        testingItems["UIRichText"] = [
            {
                title: "UIRichTextTest",
                func: function () {
                    return new UIRichTextTest();
                }
            }
        ];
    }

    if (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS || !cc.sys.isNative)
    {
        testingItems["UIVideoPlayer"] = [
            {
                title: "UIVideoPlayerTest",
                func: function () {
                    return new UIVideoPlayerTest();
                }
            }
        ];

        testingItems["UIWebViewTest"] = [
            {
                title: "UIWebViewTest",
                func: function () {
                    return new UIWebViewTest();
                }
            }
        ];
    }

    var guiTestScene = null;
    export class GUITestScene extends cc.NewClass {

        runThisTest(){
            var guiTestScene = new listScene();
            cc.director.runScene(guiTestScene);
        }

    
};

    var listScene = class listScene extends TestScene {

        constructor(){
            super();

            UISceneManager.getInstance().ctor();
            var menu = new cc.Menu();
            menu.x = 0;
            menu.y = 0;
            var index = 0;
            for(var p in testingItems){
                (function(name, list){
                    var label = new cc.LabelTTF(name, "Arial", 24);
                    var menuItem = new cc.MenuItemLabel(label, function(){
                        currentTestingArray = list;
                        var manager = UISceneManager.getInstance();
                        var scene = manager.currentUIScene();
                        cc.director.runScene(scene);
                    }, this);
                    menuItem.x = winSize.width / 2;
                    menuItem.y = (winSize.height - (index++ + 1) * 25);
                    index++;
                    menu.addChild(menuItem);
                })(p, testingItems[p]);
            }

            this._menu = menu;
            this.addChild(menu);

            this._length = 0;
            for(var p in testingItems){
                this._length++;
            }
        }

        onEnter(){
            super.onEnter();
            if ('touches' in cc.sys.capabilities)
                cc.eventManager.addListener({
                    event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                    onTouchesMoved: function (touches, event) {
                        var target = event.getCurrentTarget();
                        var delta = touches[0].getDelta();
                        target.moveMenu(delta);
                        return true;
                    }
                }, this);
            else if ('mouse' in cc.sys.capabilities) {
                cc.eventManager.addListener({
                    event: cc.EventListener.MOUSE,
                    onMouseMove: function (event) {
                        if (event.getButton() == cc.EventMouse.BUTTON_LEFT)
                            event.getCurrentTarget().moveMenu(event.getDelta());
                    },
                    onMouseScroll: function (event) {
                        var delta = cc.sys.isNative ? event.getScrollY() * 6 : -event.getScrollY();
                        event.getCurrentTarget().moveMenu({y: delta});
                        return true;
                    }
                }, this);
            }
        }

        moveMenu(delta){
            var newY = this._menu.y + delta.y;
            if (newY < 0 )
                newY = 0;

            if( newY > ((this._length + 1) * 49 - winSize.height))
                newY = ((this._length + 1) * 49 - winSize.height);

            this._menu.y = newY;
        }
    
};

    export const UISceneManager = {

        _currentUISceneId: 0,

        ctor: function () {
            this._currentUISceneId = 0;
        },

        nextUIScene: function () {
            this._currentUISceneId++;
            if (this._currentUISceneId > currentTestingArray.length - 1) {
                this._currentUISceneId = 0;
            }
            return this.currentUIScene();
        },

        previousUIScene: function () {
            this._currentUISceneId--;
            if (this._currentUISceneId < 0) {
                this._currentUISceneId = currentTestingArray.length - 1;
            }
            return this.currentUIScene();
        },

        currentUIScene: function () {
            var test = currentTestingArray[this._currentUISceneId];
            var layer = test.func();
            layer.init();
            layer.setSceneTitle(test.title);
            var scene = new UIScene();
            scene.addChild(layer);
            return scene;
        }
    };

    UISceneManager.getInstance = function () {
        return this;
    };

    UISceneManager.purge = function (){
        this._currentUISceneId = 0;
    };

// IIFE wrapper removed for ES module compatibility
