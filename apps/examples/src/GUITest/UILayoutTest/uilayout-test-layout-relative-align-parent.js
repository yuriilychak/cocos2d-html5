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

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

export class UILayoutTest_Layout_Relative_Align_Parent extends UIMainLayer {
     init(){
         if (super.init()) {
             var widgetSize = this._widget.getContentSize();

             // Add the alert
             var alert = new ccui.Text("Layout Relative Align Parent", "Arial", 20);
             alert.setColor(new cc.Color(159, 168, 176));
             alert.setPosition(widgetSize.width / 2.0, widgetSize.height / 2.0 - alert.getContentSize().height * 4.5);
             this._mainNode.addChild(alert);

             var root = this._mainNode.getChildByTag(81);
             var background = root.getChildByName("background_Panel");

             // Create the layout
             var layout = new ccui.Layout();
             layout.setLayoutType(ccui.Layout.RELATIVE);
             layout.setContentSize(280, 150);
             layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
             layout.setBackGroundColor(cc.Color.GREEN);
             var backgroundSize = background.getContentSize();
             layout.setPosition((widgetSize.width - backgroundSize.width) / 2.0 + (backgroundSize.width - layout.width) / 2.0,
                     (widgetSize.height - backgroundSize.height) / 2.0 + (backgroundSize.height - layout.height) / 2.0);
             this._mainNode.addChild(layout);

             // top left
             var button_TopLeft = new ccui.Button("ccs-res/cocosui/animationbuttonnormal.png", "ccs-res/cocosui/animationbuttonpressed.png");
             layout.addChild(button_TopLeft);

             var rp_TopLeft = new ccui.RelativeLayoutParameter();
             rp_TopLeft.setAlign(ccui.RelativeLayoutParameter.PARENT_TOP_LEFT);
             button_TopLeft.setLayoutParameter(rp_TopLeft);

             // top center horizontal
             var button_TopCenter = new ccui.Button("ccs-res/cocosui/animationbuttonnormal.png", "ccs-res/cocosui/animationbuttonpressed.png");
             layout.addChild(button_TopCenter);

             var rp_TopCenter = new ccui.RelativeLayoutParameter();
             rp_TopCenter.setAlign(ccui.RelativeLayoutParameter.PARENT_TOP_CENTER_HORIZONTAL);
             button_TopCenter.setLayoutParameter(rp_TopCenter);

             // top right
             var button_TopRight = new ccui.Button("ccs-res/cocosui/animationbuttonnormal.png", "ccs-res/cocosui/animationbuttonpressed.png");
             layout.addChild(button_TopRight);
             var rp_TopRight = new ccui.RelativeLayoutParameter();
             rp_TopRight.setAlign(ccui.RelativeLayoutParameter.PARENT_TOP_RIGHT);
             button_TopRight.setLayoutParameter(rp_TopRight);

             // left center
             var button_LeftCenter = new ccui.Button("ccs-res/cocosui/animationbuttonnormal.png", "ccs-res/cocosui/animationbuttonpressed.png");
             layout.addChild(button_LeftCenter);
             var rp_LeftCenter = new ccui.RelativeLayoutParameter();
             rp_LeftCenter.setAlign(ccui.RelativeLayoutParameter.PARENT_LEFT_CENTER_VERTICAL);
             button_LeftCenter.setLayoutParameter(rp_LeftCenter);

             // center
             var buttonCenter = new ccui.Button("ccs-res/cocosui/animationbuttonnormal.png", "ccs-res/cocosui/animationbuttonpressed.png");
             layout.addChild(buttonCenter);

             var rpCenter = new ccui.RelativeLayoutParameter();
             rpCenter.setAlign(ccui.RelativeLayoutParameter.CENTER_IN_PARENT);
             buttonCenter.setLayoutParameter(rpCenter);

             // right center
             var button_RightCenter = new ccui.Button("ccs-res/cocosui/animationbuttonnormal.png", "ccs-res/cocosui/animationbuttonpressed.png");
             layout.addChild(button_RightCenter);
             var rp_RightCenter = new ccui.RelativeLayoutParameter();
             rp_RightCenter.setAlign(ccui.RelativeLayoutParameter.PARENT_RIGHT_CENTER_VERTICAL);
             button_RightCenter.setLayoutParameter(rp_RightCenter);


             // left bottom
             var button_LeftBottom = new ccui.Button("ccs-res/cocosui/animationbuttonnormal.png", "ccs-res/cocosui/animationbuttonpressed.png");
             layout.addChild(button_LeftBottom);
             var rp_LeftBottom = new ccui.RelativeLayoutParameter();
             rp_LeftBottom.setAlign(ccui.RelativeLayoutParameter.PARENT_LEFT_BOTTOM);
             button_LeftBottom.setLayoutParameter(rp_LeftBottom);

             // bottom center
             var button_BottomCenter = new ccui.Button("ccs-res/cocosui/animationbuttonnormal.png", "ccs-res/cocosui/animationbuttonpressed.png");
             layout.addChild(button_BottomCenter);
             var rp_BottomCenter = new ccui.RelativeLayoutParameter();
             rp_BottomCenter.setAlign(ccui.RelativeLayoutParameter.PARENT_BOTTOM_CENTER_HORIZONTAL);
             button_BottomCenter.setLayoutParameter(rp_BottomCenter);

             // right bottom
             var button_RightBottom = new ccui.Button("ccs-res/cocosui/animationbuttonnormal.png", "ccs-res/cocosui/animationbuttonpressed.png");
             layout.addChild(button_RightBottom);
             var rp_RightBottom = new ccui.RelativeLayoutParameter();
             rp_RightBottom.setAlign(ccui.RelativeLayoutParameter.PARENT_RIGHT_BOTTOM);
             button_RightBottom.setLayoutParameter(rp_RightBottom);

             return true;
         }
         return false;
     }

}
