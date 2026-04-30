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

export class UILayoutComponent_Berth_Stretch_Test extends UILayoutComponentTest {
    init(){
        if (super.init()) {
            var leftTopSprite = new ccui.ImageView("ccs-res/cocosui/CloseSelected.png");
            leftTopSprite.ignoreContentAdaptWithSize(false);
            var leftTop = ccui.LayoutComponent.bindLayoutComponent(leftTopSprite);
            leftTop.setHorizontalEdge(ccui.LayoutComponent.horizontalEdge.LEFT);
            leftTop.setVerticalEdge(ccui.LayoutComponent.verticalEdge.TOP);
            leftTop.setStretchWidthEnabled(true);
            leftTop.setStretchHeightEnabled(true);
            this._baseLayer.addChild(leftTopSprite);
            leftTop.setSize(leftTopSprite.getContentSize());
            leftTop.setLeftMargin(0);
            leftTop.setTopMargin(0);

            var leftBottomSprite = new ccui.ImageView("ccs-res/cocosui/CloseSelected.png");
            leftBottomSprite.ignoreContentAdaptWithSize(false);
            var leftBottom = ccui.LayoutComponent.bindLayoutComponent(leftBottomSprite);
            leftBottom.setHorizontalEdge(ccui.LayoutComponent.horizontalEdge.LEFT);
            leftBottom.setVerticalEdge(ccui.LayoutComponent.verticalEdge.BOTTOM);
            leftBottom.setStretchWidthEnabled(true);
            leftBottom.setStretchHeightEnabled(true);
            this._baseLayer.addChild(leftBottomSprite);
            leftBottom.setSize(leftBottomSprite.getContentSize());
            leftBottom.setLeftMargin(0);
            leftBottom.setBottomMargin(0);

            var rightTopSprite = new ccui.ImageView("ccs-res/cocosui/CloseSelected.png");
            rightTopSprite.ignoreContentAdaptWithSize(false);
            var rightTop = ccui.LayoutComponent.bindLayoutComponent(rightTopSprite);
            rightTop.setHorizontalEdge(ccui.LayoutComponent.horizontalEdge.RIGHT);
            rightTop.setVerticalEdge(ccui.LayoutComponent.verticalEdge.TOP);
            rightTop.setStretchWidthEnabled(true);
            rightTop.setStretchHeightEnabled(true);
            this._baseLayer.addChild(rightTopSprite);
            rightTop.setSize(rightTopSprite.getContentSize());
            rightTop.setTopMargin(0);
            rightTop.setRightMargin(0);

            var rightBottomSprite = new ccui.ImageView("ccs-res/cocosui/CloseSelected.png");
            rightBottomSprite.ignoreContentAdaptWithSize(false);
            var rightBottom = ccui.LayoutComponent.bindLayoutComponent(rightBottomSprite);
            rightBottom.setHorizontalEdge(ccui.LayoutComponent.horizontalEdge.RIGHT);
            rightBottom.setVerticalEdge(ccui.LayoutComponent.verticalEdge.BOTTOM);
            rightBottom.setStretchWidthEnabled(true);
            rightBottom.setStretchHeightEnabled(true);
            this._baseLayer.addChild(rightBottomSprite);
            rightBottom.setSize(rightBottomSprite.getContentSize());
            rightBottom.setBottomMargin(0);
            rightBottom.setRightMargin(0);

            ccui.helper.doLayout(this._baseLayer);
            return true;
        }
        return false;
    }

}
