/****************************************************************************
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

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

ccui.LayoutComponent_ReferencePoint = {
    BOTTOM_LEFT: 0,
    TOP_LEFT: 1,
    BOTTOM_RIGHT: 2,
    TOP_RIGHT: 3
};
ccui.LayoutComponent_PositionType = {
    Position: 0,
    RelativePosition: 1,
    PreRelativePosition: 2,
    PreRelativePositionEnable: 3
};
ccui.LayoutComponent_SizeType = {
    Size: 0,
    PreSize: 1,
    PreSizeEnable: 2
};

//refactor since v3.3
ccui.LayoutComponent = class LayoutComponent extends cc.Component {
    constructor() {
        super();
        this._horizontalEdge = 0;
        this._verticalEdge = 0;

        this._leftMargin = 0;
        this._rightMargin = 0;
        this._bottomMargin = 0;
        this._topMargin = 0;

        this._usingPositionPercentX = false;
        this._positionPercentX = 0;
        this._usingPositionPercentY = false;
        this._positionPercentY = 0;

        this._usingStretchWidth = false;
        this._usingStretchHeight = false;

        this._percentWidth = 0;
        this._usingPercentWidth = false;

        this._percentHeight = 0;
        this._usingPercentHeight = false;

        this._actived = true;
        this._isPercentOnly = false;

        this._name = ccui.LayoutComponent.NAME;
    }

    init() {
        var ret = true;

        if (!super.init()) {
            return false;
        }

        //put layout component initalized code here

        return ret;
    }

    getPercentContentSize() {
        return cc.p(this._percentWidth, this._percentHeight);
    }
    setPercentContentSize(percent) {
        this.setPercentWidth(percent.x);
        this.setPercentHeight(percent.y);
    }

    setUsingPercentContentSize(isUsed) {
        this._usingPercentWidth = this._usingPercentHeight = isUsed;
    }

    //old
    SetActiveEnable(enable) {
        this._actived = enable;
    }

    //v3.3
    getUsingPercentContentSize() {
        return this._usingPercentWidth && this._usingPercentHeight;
    }

    //position & margin
    getAnchorPosition() {
        return this._owner.getAnchorPoint();
    }

    setAnchorPosition(point, y) {
        var oldRect = this._owner.getBoundingBox();
        this._owner.setAnchorPoint(point, y);
        var newRect = this._owner.getBoundingBox();
        var offSetX = oldRect.x - newRect.x, offSetY = oldRect.y - newRect.y;

        var ownerPosition = this._owner.getPosition();
        ownerPosition.x += offSetX;
        ownerPosition.y += offSetY;
        this.setPosition(ownerPosition);
    }

    getPosition() {
        return this._owner.getPosition();
    }

    setPosition(position, y) {
        var parent = this._getOwnerParent(), x;
        if (parent != null) {
            if (y === undefined) {
                x = position.x;
                y = position.y;
            } else
                x = position;
            var parentSize = parent.getContentSize();

            if (parentSize.width !== 0)
                this._positionPercentX = x / parentSize.width;
            else {
                this._positionPercentX = 0;
                if (this._usingPositionPercentX)
                    x = 0;
            }

            if (parentSize.height !== 0)
                this._positionPercentY = y / parentSize.height;
            else {
                this._positionPercentY = 0;
                if (this._usingPositionPercentY)
                    y = 0;
            }

            this._owner.setPosition(x, y);
            this._refreshHorizontalMargin();
            this._refreshVerticalMargin();
        } else
            this._owner.setPosition(position, y);
    }

    isPositionPercentXEnabled() {
        return this._usingPositionPercentX;
    }
    setPositionPercentXEnabled(isUsed) {
        this._usingPositionPercentX = isUsed;
        if (this._usingPositionPercentX)
            this._horizontalEdge = ccui.LayoutComponent.horizontalEdge.NONE;
    }

    getPositionPercentX() {
        return this._positionPercentX;
    }
    setPositionPercentX(percentMargin) {
        this._positionPercentX = percentMargin;

        var parent = this._getOwnerParent();
        if (parent !== null) {
            this._owner.setPositionX(parent.width * this._positionPercentX);
            this._refreshHorizontalMargin();
        }
    }

    isPositionPercentYEnabled() {
        return this._usingPositionPercentY;
    }
    setPositionPercentYEnabled(isUsed) {
        this._usingPositionPercentY = isUsed;
        if (this._usingPositionPercentY)
            this._verticalEdge = ccui.LayoutComponent.verticalEdge.NONE;
    }

    getPositionPercentY() {
        return this._positionPercentY;
    }
    setPositionPercentY(percentMargin) {
        this._positionPercentY = percentMargin;

        var parent = this._getOwnerParent();
        if (parent !== null) {
            this._owner.setPositionY(parent.height * this._positionPercentY);
            this._refreshVerticalMargin();
        }
    }

    getHorizontalEdge() {
        return this._horizontalEdge;
    }
    setHorizontalEdge(hEdge) {
        this._horizontalEdge = hEdge;
        if (this._horizontalEdge !== ccui.LayoutComponent.horizontalEdge.NONE)
            this._usingPositionPercentX = false;

        var parent = this._getOwnerParent();
        if (parent !== null) {
            var ownerPoint = this._owner.getPosition();
            var parentSize = parent.getContentSize();
            if (parentSize.width !== 0)
                this._positionPercentX = ownerPoint.x / parentSize.width;
            else {
                this._positionPercentX = 0;
                ownerPoint.x = 0;
                if (this._usingPositionPercentX)
                    this._owner.setPosition(ownerPoint);
            }
            this._refreshHorizontalMargin();
        }
    }

    getVerticalEdge() {
        return this._verticalEdge;
    }
    setVerticalEdge(vEdge) {
        this._verticalEdge = vEdge;
        if (this._verticalEdge !== ccui.LayoutComponent.verticalEdge.NONE)
            this._usingPositionPercentY = false;

        var parent = this._getOwnerParent();
        if (parent !== null) {
            var ownerPoint = this._owner.getPosition();
            var parentSize = parent.getContentSize();
            if (parentSize.height !== 0)
                this._positionPercentY = ownerPoint.y / parentSize.height;
            else {
                this._positionPercentY = 0;
                ownerPoint.y = 0;
                if (this._usingPositionPercentY)
                    this._owner.setPosition(ownerPoint);
            }
            this._refreshVerticalMargin();
        }
    }

    getLeftMargin() {
        return this._leftMargin;
    }
    setLeftMargin(margin) {
        this._leftMargin = margin;
    }

    getRightMargin() {
        return this._rightMargin;
    }
    setRightMargin(margin) {
        this._rightMargin = margin;
    }

    getTopMargin() {
        return this._topMargin;
    }
    setTopMargin(margin) {
        this._topMargin = margin;
    }

    getBottomMargin() {
        return this._bottomMargin;
    }
    setBottomMargin(margin) {
        this._bottomMargin = margin;
    }

    //size &
    getSize() {
        return this.getOwner().getContentSize();
    }
    setSize(size) {
        var parent = this._getOwnerParent();
        if (parent !== null) {
            var ownerSize = size, parentSize = parent.getContentSize();

            if (parentSize.width !== 0)
                this._percentWidth = ownerSize.width / parentSize.width;
            else {
                this._percentWidth = 0;
                if (this._usingPercentWidth)
                    ownerSize.width = 0;
            }

            if (parentSize.height !== 0)
                this._percentHeight = ownerSize.height / parentSize.height;
            else {
                this._percentHeight = 0;
                if (this._usingPercentHeight)
                    ownerSize.height = 0;
            }

            this._owner.setContentSize(ownerSize);

            this._refreshHorizontalMargin();
            this._refreshVerticalMargin();
        }
        else
            this._owner.setContentSize(size);
    }

    isPercentWidthEnabled() {
        return this._usingPercentWidth;
    }
    setPercentWidthEnabled(isUsed) {
        this._usingPercentWidth = isUsed;
        if (this._usingPercentWidth)
            this._usingStretchWidth = false;
    }

    getSizeWidth() {
        return this._owner.width;
    }
    setSizeWidth(width) {
        var ownerSize = this._owner.getContentSize();
        ownerSize.width = width;

        var parent = this._getOwnerParent();
        if (parent !== null) {
            var parentSize = parent.getContentSize();
            if (parentSize.width !== 0)
                this._percentWidth = ownerSize.width / parentSize.width;
            else {
                this._percentWidth = 0;
                if (this._usingPercentWidth)
                    ownerSize.width = 0;
            }
            this._owner.setContentSize(ownerSize);
            this._refreshHorizontalMargin();
        } else
            this._owner.setContentSize(ownerSize);
    }

    getPercentWidth() {
        return this._percentWidth;
    }
    setPercentWidth(percentWidth) {
        this._percentWidth = percentWidth;

        var parent = this._getOwnerParent();
        if (parent !== null) {
            var ownerSize = this._owner.getContentSize();
            ownerSize.width = parent.width * this._percentWidth;
            this._owner.setContentSize(ownerSize);
            this._refreshHorizontalMargin();
        }
    }

    isPercentHeightEnabled() {
        return this._usingPercentHeight;
    }
    setPercentHeightEnabled(isUsed) {
        this._usingPercentHeight = isUsed;
        if (this._usingPercentHeight)
            this._usingStretchHeight = false;
    }

    getSizeHeight() {
        return this._owner.height;
    }
    setSizeHeight(height) {
        var ownerSize = this._owner.getContentSize();
        ownerSize.height = height;

        var parent = this._getOwnerParent();
        if (parent !== null) {
            var parentSize = parent.getContentSize();
            if (parentSize.height !== 0)
                this._percentHeight = ownerSize.height / parentSize.height;
            else {
                this._percentHeight = 0;
                if (this._usingPercentHeight)
                    ownerSize.height = 0;
            }
            this._owner.setContentSize(ownerSize);
            this._refreshVerticalMargin();
        }
        else
            this._owner.setContentSize(ownerSize);
    }

    getPercentHeight() {
        return this._percentHeight;
    }
    setPercentHeight(percentHeight) {
        this._percentHeight = percentHeight;

        var parent = this._getOwnerParent();
        if (parent !== null) {
            var ownerSize = this._owner.getContentSize();
            ownerSize.height = parent.height * this._percentHeight;
            this._owner.setContentSize(ownerSize);
            this._refreshVerticalMargin();
        }
    }

    isStretchWidthEnabled() {
        return this._usingStretchWidth;
    }
    setStretchWidthEnabled(isUsed) {
        this._usingStretchWidth = isUsed;
        if (this._usingStretchWidth)
            this._usingPercentWidth = false;
    }

    isStretchHeightEnabled() {
        return this._usingStretchHeight;
    }
    setStretchHeightEnabled(isUsed) {
        this._usingStretchHeight = isUsed;
        if (this._usingStretchHeight)
            this._usingPercentHeight = false;
    }

    setPercentOnlyEnabled(enable){
        this._isPercentOnly = enable;
    }

    setActiveEnabled(enable) {
        this._actived = enable;
    }
    refreshLayout() {
        if(!this._actived)
            return;

        var parent = this._getOwnerParent();
        if (parent === null)
            return;

        var parentSize = parent.getContentSize(), locOwner = this._owner;
        var ownerAnchor = locOwner.getAnchorPoint(), ownerSize = locOwner.getContentSize();
        var ownerPosition = locOwner.getPosition();

        switch (this._horizontalEdge) {
            case ccui.LayoutComponent.horizontalEdge.NONE:
                if (this._usingStretchWidth && !this._isPercentOnly) {
                    ownerSize.width = parentSize.width * this._percentWidth;
                    ownerPosition.x = this._leftMargin + ownerAnchor.x * ownerSize.width;
                } else {
                    if (this._usingPositionPercentX)
                        ownerPosition.x = parentSize.width * this._positionPercentX;
                    if (this._usingPercentWidth)
                        ownerSize.width = parentSize.width * this._percentWidth;
                }
                break;
            case ccui.LayoutComponent.horizontalEdge.LEFT:
                if(this._isPercentOnly)
                    break;
                if (this._usingPercentWidth || this._usingStretchWidth)
                    ownerSize.width = parentSize.width * this._percentWidth;
                ownerPosition.x = this._leftMargin + ownerAnchor.x * ownerSize.width;
                break;
            case ccui.LayoutComponent.horizontalEdge.RIGHT:
                if(this._isPercentOnly)
                    break;
                if (this._usingPercentWidth || this._usingStretchWidth)
                    ownerSize.width = parentSize.width * this._percentWidth;
                ownerPosition.x = parentSize.width - (this._rightMargin + (1 - ownerAnchor.x) * ownerSize.width);
                break;
            case ccui.LayoutComponent.horizontalEdge.CENTER:
                if(this._isPercentOnly)
                    break;
                if (this._usingStretchWidth) {
                    ownerSize.width = parentSize.width - this._leftMargin - this._rightMargin;
                    if (ownerSize.width < 0)
                        ownerSize.width = 0;
                    ownerPosition.x = this._leftMargin + ownerAnchor.x * ownerSize.width;
                } else {
                    if (this._usingPercentWidth)
                        ownerSize.width = parentSize.width * this._percentWidth;
                    ownerPosition.x = parentSize.width * this._positionPercentX;
                }
                break;
            default:
                break;
        }

        switch (this._verticalEdge) {
            case ccui.LayoutComponent.verticalEdge.NONE:
                if (this._usingStretchHeight && !this._isPercentOnly) {
                    ownerSize.height = parentSize.height * this._percentHeight;
                    ownerPosition.y = this._bottomMargin + ownerAnchor.y * ownerSize.height;
                } else {
                    if (this._usingPositionPercentY)
                        ownerPosition.y = parentSize.height * this._positionPercentY;
                    if (this._usingPercentHeight)
                        ownerSize.height = parentSize.height * this._percentHeight;
                }
                break;
            case ccui.LayoutComponent.verticalEdge.BOTTOM:
                if(this._isPercentOnly)
                    break;
                if (this._usingPercentHeight || this._usingStretchHeight)
                    ownerSize.height = parentSize.height * this._percentHeight;
                ownerPosition.y = this._bottomMargin + ownerAnchor.y * ownerSize.height;
                break;
            case ccui.LayoutComponent.verticalEdge.TOP:
                if(this._isPercentOnly)
                    break;
                if (this._usingPercentHeight || this._usingStretchHeight)
                    ownerSize.height = parentSize.height * this._percentHeight;
                ownerPosition.y = parentSize.height - (this._topMargin + (1 - ownerAnchor.y) * ownerSize.height);
                break;
            case ccui.LayoutComponent.verticalEdge.CENTER:
                if(this._isPercentOnly)
                    break;
                if (this._usingStretchHeight) {
                    ownerSize.height = parentSize.height - this._topMargin - this._bottomMargin;
                    if (ownerSize.height < 0)
                        ownerSize.height = 0;
                    ownerPosition.y = this._bottomMargin + ownerAnchor.y * ownerSize.height;
                } else {
                    if(this._usingPercentHeight)
                        ownerSize.height = parentSize.height * this._percentHeight;
                    ownerPosition.y = parentSize.height * this._positionPercentY;
                }
                break;
            default:
                break;
        }

        locOwner.setPosition(ownerPosition);
        locOwner.setContentSize(ownerSize);

        if(locOwner instanceof ccui.PageView){
            locOwner.forceDoLayout();

            var layoutVector = locOwner.getPages();
            for(var i=0; i<layoutVector.length; i++){
                ccui.helper.doLayout(layoutVector[i]);
            }
        }else{
            ccui.helper.doLayout(locOwner);
        }
    }

    _getOwnerParent() {
        return this._owner ? this._owner.getParent() : null;
    }
    _refreshHorizontalMargin() {
        var parent = this._getOwnerParent();
        if (parent === null)
            return;

        var ownerPoint = this._owner.getPosition(), ownerAnchor = this._owner.getAnchorPoint();
        var ownerSize = this._owner.getContentSize(), parentSize = parent.getContentSize();

        this._leftMargin = ownerPoint.x - ownerAnchor.x * ownerSize.width;
        this._rightMargin = parentSize.width - (ownerPoint.x + (1 - ownerAnchor.x) * ownerSize.width);
    }
    _refreshVerticalMargin() {
        var parent = this._getOwnerParent();
        if (parent === null)
            return;

        var ownerPoint = this._owner.getPosition(), ownerAnchor = this._owner.getAnchorPoint();
        var ownerSize = this._owner.getContentSize(), parentSize = parent.getContentSize();

        this._bottomMargin = ownerPoint.y - ownerAnchor.y * ownerSize.height;
        this._topMargin = parentSize.height - (ownerPoint.y + (1 - ownerAnchor.y) * ownerSize.height);
    }
};

ccui.LayoutComponent.horizontalEdge = {NONE: 0, LEFT: 1, RIGHT: 2, CENTER: 3};
ccui.LayoutComponent.verticalEdge = {NONE: 0, BOTTOM: 1, TOP: 2, CENTER: 3};

ccui.LayoutComponent.NAME = "__ui_layout";
ccui.LayoutComponent.bindLayoutComponent = function (node) {
    var layout = node.getComponent(ccui.LayoutComponent.NAME);
    if (layout !== undefined)
        return layout;

    layout = new ccui.LayoutComponent();
    layout.init();
    node.addComponent(layout);
    if (!(node instanceof ccui.Widget)) {
        node.addEventListener && node.addEventListener("load", function () {
            layout.refreshLayout();
        }, this);
    }

    return layout;
};