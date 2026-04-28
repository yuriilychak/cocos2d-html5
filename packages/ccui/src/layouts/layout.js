import { RendererConfig, Size, Rect, Color, Point, Sprite, LayerColor, LayerGradient, assert, log, FLT_MAX } from '@aspect/core';
import { DrawNode } from '@aspect/shape-nodes';
import { Widget } from '../base-classes/widget';
import { Scale9Sprite } from '../base-classes/scale9-sprite';
import { LayoutParameter, LinearLayoutParameter, RelativeLayoutParameter } from './layout-parameter';
import { LayoutCanvasRenderCmd } from './layout-canvas-render-cmd';
import { LayoutWebGLRenderCmd } from './layout-webgl-render-cmd';
import { getLayoutManager } from './layout-manager';

export class Layout extends Widget {
    constructor() {
        super();

        if (this._clippingEnabled === undefined) {
            this._clippingEnabled = false;
        }
        this._backGroundScale9Enabled = null;
        this._backGroundImage = null;
        this._backGroundImageFileName = null;
        this._bgImageTexType = Widget.LOCAL_TEXTURE;
        this._colorRender = null;
        this._gradientRender = null;
        this._opacity = 255;
        this._doLayoutDirty = true;
        this._clippingRectDirty = true;
        if (this._clippingStencil === undefined) {
            this._clippingStencil = null;
        }
        this._scissorRectDirty = false;
        this._clippingParent = null;
        this._className = "Layout";
        this._finalPositionX = 0;
        this._finalPositionY = 0;
        this._backGroundImageOpacity = 0;
        this._loopFocus = false;
        this.__passFocusToChild = true;
        this._isFocusPassing = false;
        this._isInterceptTouch = false;

        this._layoutType = Layout.ABSOLUTE;
        this._widgetType = Widget.TYPE_CONTAINER;
        this._clippingType = Layout.CLIPPING_STENCIL;
        this._colorType = Layout.BG_COLOR_NONE;

        this.ignoreContentAdaptWithSize(false);
        this.setContentSize(new Size(0, 0));
        this.setAnchorPoint(0, 0);
        this.onPassFocusToChild = this._findNearestChildWidgetIndex.bind(this);

        this._backGroundImageCapInsets = new Rect(0, 0, 0, 0);

        this._color = new Color(255, 255, 255, 255);
        this._startColor = new Color(255, 255, 255, 255);
        this._endColor = new Color(255, 255, 255, 255);
        this._alongVector = new Point(0, -1);
        this._backGroundImageTextureSize = new Size(0, 0);

        this._clippingRect = new Rect(0, 0, 0, 0);
        this._backGroundImageColor = new Color(255, 255, 255, 255);
    }

    get clippingEnabled() { return this.isClippingEnabled(); }
    set clippingEnabled(v) { this.setClippingEnabled(v); }

    set clippingType(v) { this.setClippingType(v); }

    get layoutType() { return this.getLayoutType(); }
    set layoutType(v) { this.setLayoutType(v); }

    onEnter() {
        super.onEnter();
        if (this._clippingStencil)
            this._clippingStencil._performRecursive(Node._stateCallbackType.onEnter);
        this._doLayoutDirty = true;
        this._clippingRectDirty = true;
    }

    onExit() {
        super.onExit();
        if (this._clippingStencil)
            this._clippingStencil._performRecursive(Node._stateCallbackType.onExit);
    }

    visit(parent) {
        var cmd = this._renderCmd, parentCmd = parent ? parent._renderCmd : null;

        if (!this._visible) {
            cmd._propagateFlagsDown(parentCmd);
            return;
        }

        this._adaptRenderers();
        this._doLayout();

        var renderer = RendererConfig.getInstance().renderer;
        cmd.visit(parentCmd);

        var stencilClipping = this._clippingEnabled && this._clippingType === Layout.CLIPPING_STENCIL;
        var scissorClipping = this._clippingEnabled && this._clippingType === Layout.CLIPPING_SCISSOR;

        if (stencilClipping) {
            cmd.stencilClippingVisit(parentCmd);
        }
        else if (scissorClipping) {
            cmd.scissorClippingVisit(parentCmd);
        }

        var i, children = this._children, len = children.length, child;
        var j, pChildren = this._protectedChildren, pLen = pChildren.length, pChild;

        if (this._reorderChildDirty) this.sortAllChildren();
        if (this._reorderProtectedChildDirty) this.sortAllProtectedChildren();
        for (i = 0; i < len; i++) {
            child = children[i];
            if (child._localZOrder < 0) {
                child.visit(this);
            }
            else break;
        }
        for (j = 0; j < pLen; j++) {
            pChild = pChildren[j];
            if (pChild._localZOrder < 0) {
                cmd._changeProtectedChild(pChild);
                pChild.visit(this);
            }
            else break;
        }
        for (; i < len; i++) {
            children[i].visit(this);
        }
        for (; j < pLen; j++) {
            pChild = pChildren[j];
            cmd._changeProtectedChild(pChild);
            pChild.visit(this);
        }

        if (stencilClipping) {
            cmd.postStencilVisit();
        }
        else if (scissorClipping) {
            cmd.postScissorVisit();
        }

        cmd._dirtyFlag = 0;
    }

    setLoopFocus(loop) {
        this._loopFocus = loop;
    }

    isLoopFocus() {
        return this._loopFocus;
    }

    setPassFocusToChild(pass) {
        this.__passFocusToChild = pass;
    }

    isPassFocusToChild() {
        return this.__passFocusToChild;
    }

    findNextFocusedWidget(direction, current) {
        if (this._isFocusPassing || this.isFocused()) {
            var parent = this.getParent();
            this._isFocusPassing = false;
            if (this.__passFocusToChild) {
                var w = this._passFocusToChild(direction, current);
                if (w instanceof Layout && parent) {
                    parent._isFocusPassing = true;
                    return parent.findNextFocusedWidget(direction, this);
                }
                return w;
            }

            if (null == parent || !(parent instanceof Layout))
                return this;
            parent._isFocusPassing = true;
            return parent.findNextFocusedWidget(direction, this);
        } else if (current.isFocused() || current instanceof Layout) {
            if (this._layoutType === Layout.LINEAR_HORIZONTAL) {
                switch (direction) {
                    case Widget.LEFT:
                        return this._getPreviousFocusedWidget(direction, current);
                    case Widget.RIGHT:
                        return this._getNextFocusedWidget(direction, current);
                    case Widget.DOWN:
                    case Widget.UP:
                        if (this._isLastWidgetInContainer(this, direction)) {
                            if (this._isWidgetAncestorSupportLoopFocus(current, direction))
                                return super.findNextFocusedWidget(direction, this);
                            return current;
                        } else {
                            return super.findNextFocusedWidget(direction, this);
                        }
                    default:
                        assert(0, "Invalid Focus Direction");
                        return current;
                }
            } else if (this._layoutType === Layout.LINEAR_VERTICAL) {
                switch (direction) {
                    case Widget.LEFT:
                    case Widget.RIGHT:
                        if (this._isLastWidgetInContainer(this, direction)) {
                            if (this._isWidgetAncestorSupportLoopFocus(current, direction))
                                return super.findNextFocusedWidget(direction, this);
                            return current;
                        }
                        else
                            return super.findNextFocusedWidget(direction, this);
                    case Widget.DOWN:
                        return this._getNextFocusedWidget(direction, current);
                    case Widget.UP:
                        return this._getPreviousFocusedWidget(direction, current);
                    default:
                        assert(0, "Invalid Focus Direction");
                        return current;
                }
            } else {
                assert(0, "Un Supported Layout type, please use VBox and HBox instead!!!");
                return current;
            }
        } else
            return current;
    }

    addChild(widget, zOrder, tag) {
        if ((widget instanceof Widget)) {
            this._supplyTheLayoutParameterLackToChild(widget);
        }
        super.addChild(widget, zOrder, tag);
        this._doLayoutDirty = true;
    }

    removeChild(widget, cleanup) {
        super.removeChild(widget, cleanup);
        this._doLayoutDirty = true;
    }

    removeAllChildren(cleanup) {
        super.removeAllChildren(cleanup);
        this._doLayoutDirty = true;
    }

    removeAllChildrenWithCleanup(cleanup) {
        super.removeAllChildrenWithCleanup(cleanup);
        this._doLayoutDirty = true;
    }

    isClippingEnabled() {
        return this._clippingEnabled;
    }

    setClippingEnabled(able) {
        if (able === this._clippingEnabled)
            return;
        this._clippingEnabled = able;
        switch (this._clippingType) {
            case Layout.CLIPPING_SCISSOR:
            case Layout.CLIPPING_STENCIL:
                if (able) {
                    this._clippingStencil = new DrawNode();
                    this._renderCmd.rebindStencilRendering(this._clippingStencil);
                    if (this._running)
                        this._clippingStencil._performRecursive(Node._stateCallbackType.onEnter);
                    this._setStencilClippingSize(this._contentSize);
                } else {
                    if (this._running && this._clippingStencil)
                        this._clippingStencil._performRecursive(Node._stateCallbackType.onExit);
                    this._clippingStencil = null;
                }
                break;
            default:
                break;
        }
    }

    setClippingType(type) {
        if (type === this._clippingType)
            return;
        var clippingEnabled = this.isClippingEnabled();
        this.setClippingEnabled(false);
        this._clippingType = type;
        this.setClippingEnabled(clippingEnabled);
    }

    getClippingType() {
        return this._clippingType;
    }

    _setStencilClippingSize(size) {
        if (this._clippingEnabled && this._clippingType === Layout.CLIPPING_STENCIL) {
            var rect = [];
            rect[0] = new Point(0, 0);
            rect[1] = new Point(size.width, 0);
            rect[2] = new Point(size.width, size.height);
            rect[3] = new Point(0, size.height);
            var green = Color.GREEN;
            this._clippingStencil.clear();
            this._clippingStencil.setLocalBB && this._clippingStencil.setLocalBB(0, 0, size.width, size.height);
            this._clippingStencil.drawPoly(rect, green, 0, green);
        }
    }

    _getClippingRect() {
        if (this._clippingRectDirty) {
            var worldPos = this.convertToWorldSpace(new Point(0, 0));
            var t = this.getNodeToWorldTransform();
            var scissorWidth = this._contentSize.width * t.a;
            var scissorHeight = this._contentSize.height * t.d;
            var parentClippingRect;
            var parent = this;

            while (parent) {
                parent = parent.getParent();
                if (parent && parent instanceof Layout && parent.isClippingEnabled()) {
                    this._clippingParent = parent;
                    break;
                }
            }

            if (this._clippingParent) {
                parentClippingRect = this._clippingParent._getClippingRect();

                this._clippingRect.x = Math.max(worldPos.x, parentClippingRect.x);
                this._clippingRect.y = Math.max(worldPos.y, parentClippingRect.y);

                var right = Math.min(worldPos.x + scissorWidth, parentClippingRect.x + parentClippingRect.width);
                var top = Math.min(worldPos.y + scissorHeight, parentClippingRect.y + parentClippingRect.height);

                this._clippingRect.width = Math.max(0.0, right - this._clippingRect.x);
                this._clippingRect.height = Math.max(0.0, top - this._clippingRect.y);
            } else {
                this._clippingRect.x = worldPos.x;
                this._clippingRect.y = worldPos.y;
                this._clippingRect.width = scissorWidth;
                this._clippingRect.height = scissorHeight;
            }
            this._clippingRectDirty = false;
        }
        return this._clippingRect;
    }

    _onSizeChanged() {
        super._onSizeChanged();
        var locContentSize = this._contentSize;
        this._setStencilClippingSize(locContentSize);
        this._doLayoutDirty = true;
        this._clippingRectDirty = true;
        if (this._backGroundImage) {
            this._backGroundImage.setPosition(locContentSize.width * 0.5, locContentSize.height * 0.5);
            if (this._backGroundScale9Enabled && this._backGroundImage instanceof Scale9Sprite)
                this._backGroundImage.setPreferredSize(locContentSize);
        }
        if (this._colorRender)
            this._colorRender.setContentSize(locContentSize);
        if (this._gradientRender)
            this._gradientRender.setContentSize(locContentSize);
    }

    setBackGroundImageScale9Enabled(able) {
        if (this._backGroundScale9Enabled === able)
            return;
        this.removeProtectedChild(this._backGroundImage);
        this._backGroundImage = null;
        this._backGroundScale9Enabled = able;
        this._addBackGroundImage();
        this.setBackGroundImage(this._backGroundImageFileName, this._bgImageTexType);
        this.setBackGroundImageCapInsets(this._backGroundImageCapInsets);
    }

    isBackGroundImageScale9Enabled() {
        return this._backGroundScale9Enabled;
    }

    setBackGroundImage(fileName, texType) {
        if (!fileName)
            return;
        texType = texType || Widget.LOCAL_TEXTURE;
        if (this._backGroundImage === null) {
            this._addBackGroundImage();
            this.setBackGroundImageScale9Enabled(this._backGroundScale9Enabled);
        }
        this._backGroundImageFileName = fileName;
        this._bgImageTexType = texType;
        var locBackgroundImage = this._backGroundImage;
        switch (this._bgImageTexType) {
            case Widget.LOCAL_TEXTURE:
                locBackgroundImage.initWithFile(fileName);
                break;
            case Widget.PLIST_TEXTURE:
                locBackgroundImage.initWithSpriteFrameName(fileName);
                break;
            default:
                break;
        }
        if (this._backGroundScale9Enabled)
            locBackgroundImage.setPreferredSize(this._contentSize);

        this._backGroundImageTextureSize = locBackgroundImage.getContentSize();
        locBackgroundImage.setPosition(this._contentSize.width * 0.5, this._contentSize.height * 0.5);
        this._updateBackGroundImageColor();
    }

    setBackGroundImageCapInsets(capInsets) {
        if (!capInsets)
            return;
        var locInsets = this._backGroundImageCapInsets;
        locInsets.x = capInsets.x;
        locInsets.y = capInsets.y;
        locInsets.width = capInsets.width;
        locInsets.height = capInsets.height;
        if (this._backGroundScale9Enabled)
            this._backGroundImage.setCapInsets(capInsets);
    }

    getBackGroundImageCapInsets() {
        return new Rect(this._backGroundImageCapInsets);
    }

    _supplyTheLayoutParameterLackToChild(locChild) {
        if (!locChild) {
            return;
        }
        switch (this._layoutType) {
            case Layout.ABSOLUTE:
                break;
            case Layout.LINEAR_HORIZONTAL:
            case Layout.LINEAR_VERTICAL:
                var layoutParameter = locChild.getLayoutParameter(LayoutParameter.LINEAR);
                if (!layoutParameter)
                    locChild.setLayoutParameter(new LinearLayoutParameter());
                break;
            case Layout.RELATIVE:
                var layoutParameter = locChild.getLayoutParameter(LayoutParameter.RELATIVE);
                if (!layoutParameter)
                    locChild.setLayoutParameter(new RelativeLayoutParameter());
                break;
            default:
                break;
        }
    }

    _addBackGroundImage() {
        var contentSize = this._contentSize;
        if (this._backGroundScale9Enabled) {
            this._backGroundImage = new Scale9Sprite();
            this._backGroundImage.setPreferredSize(contentSize);
        } else
            this._backGroundImage = new Sprite();
        this.addProtectedChild(this._backGroundImage, Layout.BACKGROUND_IMAGE_ZORDER, -1);
        this._backGroundImage.setPosition(contentSize.width * 0.5, contentSize.height * 0.5);
    }

    removeBackGroundImage() {
        if (!this._backGroundImage)
            return;
        this.removeProtectedChild(this._backGroundImage);
        this._backGroundImage = null;
        this._backGroundImageFileName = "";
        this._backGroundImageTextureSize.width = 0;
        this._backGroundImageTextureSize.height = 0;
    }

    setBackGroundColorType(type) {
        if (this._colorType === type)
            return;
        switch (this._colorType) {
            case Layout.BG_COLOR_NONE:
                if (this._colorRender) {
                    this.removeProtectedChild(this._colorRender);
                    this._colorRender = null;
                }
                if (this._gradientRender) {
                    this.removeProtectedChild(this._gradientRender);
                    this._gradientRender = null;
                }
                break;
            case Layout.BG_COLOR_SOLID:
                if (this._colorRender) {
                    this.removeProtectedChild(this._colorRender);
                    this._colorRender = null;
                }
                break;
            case Layout.BG_COLOR_GRADIENT:
                if (this._gradientRender) {
                    this.removeProtectedChild(this._gradientRender);
                    this._gradientRender = null;
                }
                break;
            default:
                break;
        }
        this._colorType = type;
        switch (this._colorType) {
            case Layout.BG_COLOR_NONE:
                break;
            case Layout.BG_COLOR_SOLID:
                this._colorRender = new LayerColor();
                this._colorRender.setContentSize(this._contentSize);
                this._colorRender.setOpacity(this._opacity);
                this._colorRender.setColor(this._color);
                this.addProtectedChild(this._colorRender, Layout.BACKGROUND_RENDERER_ZORDER, -1);
                break;
            case Layout.BG_COLOR_GRADIENT:
                this._gradientRender = new LayerGradient(new Color(255, 0, 0, 255), new Color(0, 255, 0, 255));
                this._gradientRender.setContentSize(this._contentSize);
                this._gradientRender.setOpacity(this._opacity);
                this._gradientRender.setStartColor(this._startColor);
                this._gradientRender.setEndColor(this._endColor);
                this._gradientRender.setVector(this._alongVector);
                this.addProtectedChild(this._gradientRender, Layout.BACKGROUND_RENDERER_ZORDER, -1);
                break;
            default:
                break;
        }
    }

    getBackGroundColorType() {
        return this._colorType;
    }

    setBackGroundColor(color, endColor) {
        if (!endColor) {
            this._color.r = color.r;
            this._color.g = color.g;
            this._color.b = color.b;
            if (this._colorRender)
                this._colorRender.setColor(color);
        } else {
            this._startColor.r = color.r;
            this._startColor.g = color.g;
            this._startColor.b = color.b;
            if (this._gradientRender)
                this._gradientRender.setStartColor(color);

            this._endColor.r = endColor.r;
            this._endColor.g = endColor.g;
            this._endColor.b = endColor.b;
            if (this._gradientRender)
                this._gradientRender.setEndColor(endColor);
        }
    }

    getBackGroundColor() {
        var tmpColor = this._color;
        return new Color(tmpColor.r, tmpColor.g, tmpColor.b, tmpColor.a);
    }

    getBackGroundStartColor() {
        var tmpColor = this._startColor;
        return new Color(tmpColor.r, tmpColor.g, tmpColor.b, tmpColor.a);
    }

    getBackGroundEndColor() {
        var tmpColor = this._endColor;
        return new Color(tmpColor.r, tmpColor.g, tmpColor.b, tmpColor.a);
    }

    setBackGroundColorOpacity(opacity) {
        this._opacity = opacity;
        switch (this._colorType) {
            case Layout.BG_COLOR_NONE:
                break;
            case Layout.BG_COLOR_SOLID:
                this._colorRender.setOpacity(opacity);
                break;
            case Layout.BG_COLOR_GRADIENT:
                this._gradientRender.setOpacity(opacity);
                break;
            default:
                break;
        }
    }

    getBackGroundColorOpacity() {
        return this._opacity;
    }

    setBackGroundColorVector(vector) {
        this._alongVector.x = vector.x;
        this._alongVector.y = vector.y;
        if (this._gradientRender) {
            this._gradientRender.setVector(vector);
        }
    }

    getBackGroundColorVector() {
        return this._alongVector;
    }

    setBackGroundImageColor(color) {
        this._backGroundImageColor.r = color.r;
        this._backGroundImageColor.g = color.g;
        this._backGroundImageColor.b = color.b;

        this._updateBackGroundImageColor();
    }

    setBackGroundImageOpacity(opacity) {
        this._backGroundImageColor.a = opacity;
        this.getBackGroundImageColor();
    }

    getBackGroundImageColor() {
        var color = this._backGroundImageColor;
        return new Color(color.r, color.g, color.b, color.a);
    }

    getBackGroundImageOpacity() {
        return this._backGroundImageColor.a;
    }

    _updateBackGroundImageColor() {
        if (this._backGroundImage)
            this._backGroundImage.setColor(this._backGroundImageColor);
    }

    getBackGroundImageTextureSize() {
        return this._backGroundImageTextureSize;
    }

    setLayoutType(type) {
        this._layoutType = type;
        var layoutChildrenArray = this._children;
        var locChild = null;
        for (var i = 0; i < layoutChildrenArray.length; i++) {
            locChild = layoutChildrenArray[i];
            if (locChild instanceof Widget)
                this._supplyTheLayoutParameterLackToChild(locChild);
        }
        this._doLayoutDirty = true;
    }

    getLayoutType() {
        return this._layoutType;
    }

    requestDoLayout() {
        this._doLayoutDirty = true;
    }

    _doLayout() {
        if (!this._doLayoutDirty)
            return;

        this.sortAllChildren();

        var executant = getLayoutManager(this._layoutType);
        if (executant)
            executant._doLayout(this);
        this._doLayoutDirty = false;
    }

    _getLayoutContentSize() {
        return this.getContentSize();
    }

    _getLayoutElements() {
        return this.getChildren();
    }

    _updateBackGroundImageOpacity() {
        if (this._backGroundImage)
            this._backGroundImage.setOpacity(this._backGroundImageOpacity);
    }

    _updateBackGroundImageRGBA() {
        if (this._backGroundImage) {
            this._backGroundImage.setColor(this._backGroundImageColor);
            this._backGroundImage.setOpacity(this._backGroundImageOpacity);
        }
    }

    _getLayoutAccumulatedSize() {
        var children = this.getChildren();
        var layoutSize = new Size(0, 0);
        var widgetCount = 0, locSize;
        for (var i = 0, len = children.length; i < len; i++) {
            var layout = children[i];
            if (null !== layout && layout instanceof Layout) {
                locSize = layout._getLayoutAccumulatedSize();
                layoutSize.width += locSize.width;
                layoutSize.height += locSize.height;
            } else {
                if (layout instanceof Widget) {
                    widgetCount++;
                    var m = layout.getLayoutParameter().getMargin();
                    locSize = layout.getContentSize();
                    layoutSize.width += locSize.width + (m.right + m.left) * 0.5;
                    layoutSize.height += locSize.height + (m.top + m.bottom) * 0.5;
                }
            }
        }

        var type = this.getLayoutType();
        if (type === Layout.LINEAR_HORIZONTAL)
            layoutSize.height = layoutSize.height - layoutSize.height / widgetCount * (widgetCount - 1);

        if (type === Layout.LINEAR_VERTICAL)
            layoutSize.width = layoutSize.width - layoutSize.width / widgetCount * (widgetCount - 1);
        return layoutSize;
    }

    _findNearestChildWidgetIndex(direction, baseWidget) {
        if (baseWidget == null || baseWidget === this)
            return this._findFirstFocusEnabledWidgetIndex();

        var index = 0, locChildren = this.getChildren();
        var count = locChildren.length, widgetPosition;

        var distance = FLT_MAX, found = 0;
        if (direction === Widget.LEFT || direction === Widget.RIGHT || direction === Widget.DOWN || direction === Widget.UP) {
            widgetPosition = this._getWorldCenterPoint(baseWidget);
            while (index < count) {
                var w = locChildren[index];
                if (w && w instanceof Widget && w.isFocusEnabled()) {
                    var length = (w instanceof Layout) ? w._calculateNearestDistance(baseWidget)
                        : Point.length(Point.sub(this._getWorldCenterPoint(w), widgetPosition));
                    if (length < distance) {
                        found = index;
                        distance = length;
                    }
                }
                index++;
            }
            return found;
        }
        log("invalid focus direction!");
        return 0;
    }

    _findFarthestChildWidgetIndex(direction, baseWidget) {
        if (baseWidget == null || baseWidget === this)
            return this._findFirstFocusEnabledWidgetIndex();

        var index = 0, locChildren = this.getChildren();
        var count = locChildren.length;

        var distance = -FLT_MAX, found = 0;
        if (direction === Widget.LEFT || direction === Widget.RIGHT || direction === Widget.DOWN || direction === Widget.UP) {
            var widgetPosition = this._getWorldCenterPoint(baseWidget);
            while (index < count) {
                var w = locChildren[index];
                if (w && w instanceof Widget && w.isFocusEnabled()) {
                    var length = (w instanceof Layout) ? w._calculateFarthestDistance(baseWidget)
                        : Point.length(Point.sub(this._getWorldCenterPoint(w), widgetPosition));
                    if (length > distance) {
                        found = index;
                        distance = length;
                    }
                }
                index++;
            }
            return found;
        }
        log("invalid focus direction!!!");
        return 0;
    }

    _calculateNearestDistance(baseWidget) {
        var distance = FLT_MAX;
        var widgetPosition = this._getWorldCenterPoint(baseWidget);
        var locChildren = this._children;

        for (var i = 0, len = locChildren.length; i < len; i++) {
            var widget = locChildren[i], length;
            if (widget instanceof Layout)
                length = widget._calculateNearestDistance(baseWidget);
            else {
                if (widget instanceof Widget && widget.isFocusEnabled())
                    length = Point.length(Point.sub(this._getWorldCenterPoint(widget), widgetPosition));
                else
                    continue;
            }
            if (length < distance)
                distance = length;
        }
        return distance;
    }

    _calculateFarthestDistance(baseWidget) {
        var distance = -FLT_MAX;
        var widgetPosition = this._getWorldCenterPoint(baseWidget);
        var locChildren = this._children;

        for (var i = 0, len = locChildren.length; i < len; i++) {
            var layout = locChildren[i];
            var length;
            if (layout instanceof Layout)
                length = layout._calculateFarthestDistance(baseWidget);
            else {
                if (layout instanceof Widget && layout.isFocusEnabled()) {
                    var wPosition = this._getWorldCenterPoint(layout);
                    length = Point.length(Point.sub(wPosition, widgetPosition));
                } else
                    continue;
            }

            if (length > distance)
                distance = length;
        }
        return distance;
    }

    _findProperSearchingFunctor(direction, baseWidget) {
        if (baseWidget === undefined)
            return;

        var previousWidgetPosition = this._getWorldCenterPoint(baseWidget);
        var widgetPosition = this._getWorldCenterPoint(this._findFirstNonLayoutWidget());
        if (direction === Widget.LEFT) {
            this.onPassFocusToChild = (previousWidgetPosition.x > widgetPosition.x) ? this._findNearestChildWidgetIndex
                : this._findFarthestChildWidgetIndex;
        } else if (direction === Widget.RIGHT) {
            this.onPassFocusToChild = (previousWidgetPosition.x > widgetPosition.x) ? this._findFarthestChildWidgetIndex
                : this._findNearestChildWidgetIndex;
        } else if (direction === Widget.DOWN) {
            this.onPassFocusToChild = (previousWidgetPosition.y > widgetPosition.y) ? this._findNearestChildWidgetIndex
                : this._findFarthestChildWidgetIndex;
        } else if (direction === Widget.UP) {
            this.onPassFocusToChild = (previousWidgetPosition.y < widgetPosition.y) ? this._findNearestChildWidgetIndex
                : this._findFarthestChildWidgetIndex;
        } else
            log("invalid direction!");
    }

    _findFirstNonLayoutWidget() {
        var locChildren = this._children;
        for (var i = 0, len = locChildren.length; i < len; i++) {
            var child = locChildren[i];
            if (child instanceof Layout) {
                var widget = child._findFirstNonLayoutWidget();
                if (widget)
                    return widget;
            } else {
                if (child instanceof Widget)
                    return child;
            }
        }
        return null;
    }

    _findFirstFocusEnabledWidgetIndex() {
        var index = 0, locChildren = this.getChildren();
        var count = locChildren.length;
        while (index < count) {
            var w = locChildren[index];
            if (w && w instanceof Widget && w.isFocusEnabled())
                return index;
            index++;
        }
        return 0;
    }

    _findFocusEnabledChildWidgetByIndex(index) {
        var widget = this._getChildWidgetByIndex(index);
        if (widget) {
            if (widget.isFocusEnabled())
                return widget;
            index = index + 1;
            return this._findFocusEnabledChildWidgetByIndex(index);
        }
        return null;
    }

    _getWorldCenterPoint(widget) {
        var widgetSize = widget instanceof Layout ? widget._getLayoutAccumulatedSize() : widget.getContentSize();
        return widget.convertToWorldSpace(new Point(widgetSize.width / 2, widgetSize.height / 2));
    }

    _getNextFocusedWidget(direction, current) {
        var nextWidget = null, locChildren = this._children;
        var previousWidgetPos = locChildren.indexOf(current);
        previousWidgetPos = previousWidgetPos + 1;
        if (previousWidgetPos < locChildren.length) {
            nextWidget = this._getChildWidgetByIndex(previousWidgetPos);
            if (nextWidget) {
                if (nextWidget.isFocusEnabled()) {
                    if (nextWidget instanceof Layout) {
                        nextWidget._isFocusPassing = true;
                        return nextWidget.findNextFocusedWidget(direction, nextWidget);
                    } else {
                        this.dispatchFocusEvent(current, nextWidget);
                        return nextWidget;
                    }
                } else
                    return this._getNextFocusedWidget(direction, nextWidget);
            } else
                return current;
        } else {
            if (this._loopFocus) {
                if (this._checkFocusEnabledChild()) {
                    previousWidgetPos = 0;
                    nextWidget = this._getChildWidgetByIndex(previousWidgetPos);
                    if (nextWidget.isFocusEnabled()) {
                        if (nextWidget instanceof Layout) {
                            nextWidget._isFocusPassing = true;
                            return nextWidget.findNextFocusedWidget(direction, nextWidget);
                        } else {
                            this.dispatchFocusEvent(current, nextWidget);
                            return nextWidget;
                        }
                    } else
                        return this._getNextFocusedWidget(direction, nextWidget);
                } else
                    return (current instanceof Layout) ? current : Widget._focusedWidget;
            } else {
                if (this._isLastWidgetInContainer(current, direction)) {
                    if (this._isWidgetAncestorSupportLoopFocus(this, direction))
                        return super.findNextFocusedWidget(direction, this);
                    return (current instanceof Layout) ? current : Widget._focusedWidget;
                } else
                    return super.findNextFocusedWidget(direction, this);
            }
        }
    }

    _getPreviousFocusedWidget(direction, current) {
        var nextWidget = null, locChildren = this._children;
        var previousWidgetPos = locChildren.indexOf(current);
        previousWidgetPos = previousWidgetPos - 1;
        if (previousWidgetPos >= 0) {
            nextWidget = this._getChildWidgetByIndex(previousWidgetPos);
            if (nextWidget.isFocusEnabled()) {
                if (nextWidget instanceof Layout) {
                    nextWidget._isFocusPassing = true;
                    return nextWidget.findNextFocusedWidget(direction, nextWidget);
                }
                this.dispatchFocusEvent(current, nextWidget);
                return nextWidget;
            } else
                return this._getPreviousFocusedWidget(direction, nextWidget);
        } else {
            if (this._loopFocus) {
                if (this._checkFocusEnabledChild()) {
                    previousWidgetPos = locChildren.length - 1;
                    nextWidget = this._getChildWidgetByIndex(previousWidgetPos);
                    if (nextWidget.isFocusEnabled()) {
                        if (nextWidget instanceof Layout) {
                            nextWidget._isFocusPassing = true;
                            return nextWidget.findNextFocusedWidget(direction, nextWidget);
                        } else {
                            this.dispatchFocusEvent(current, nextWidget);
                            return nextWidget;
                        }
                    } else
                        return this._getPreviousFocusedWidget(direction, nextWidget);
                } else
                    return (current instanceof Layout) ? current : Widget._focusedWidget;
            } else {
                if (this._isLastWidgetInContainer(current, direction)) {
                    if (this._isWidgetAncestorSupportLoopFocus(this, direction))
                        return super.findNextFocusedWidget(direction, this);
                    return (current instanceof Layout) ? current : Widget._focusedWidget;
                } else
                    return super.findNextFocusedWidget(direction, this);
            }
        }
    }

    _getChildWidgetByIndex(index) {
        var locChildren = this._children;
        var size = locChildren.length, count = 0, oldIndex = index;
        while (index < size) {
            var firstChild = locChildren[index];
            if (firstChild && firstChild instanceof Widget)
                return firstChild;
            count++;
            index++;
        }

        var begin = 0;
        while (begin < oldIndex) {
            var child = locChildren[begin];
            if (child && child instanceof Widget)
                return child;
            count++;
            begin++;
        }
        return null;
    }

    _isLastWidgetInContainer(widget, direction) {
        var parent = widget.getParent();
        if (parent == null || !(parent instanceof Layout))
            return true;

        var container = parent.getChildren();
        var index = container.indexOf(widget);
        if (parent.getLayoutType() === Layout.LINEAR_HORIZONTAL) {
            if (direction === Widget.LEFT) {
                if (index === 0)
                    return this._isLastWidgetInContainer(parent, direction);
                else
                    return false;
            }
            if (direction === Widget.RIGHT) {
                if (index === container.length - 1)
                    return this._isLastWidgetInContainer(parent, direction);
                else
                    return false;
            }
            if (direction === Widget.DOWN)
                return this._isLastWidgetInContainer(parent, direction);

            if (direction === Widget.UP)
                return this._isLastWidgetInContainer(parent, direction);
        } else if (parent.getLayoutType() === Layout.LINEAR_VERTICAL) {
            if (direction === Widget.UP) {
                if (index === 0)
                    return this._isLastWidgetInContainer(parent, direction);
                else
                    return false;
            }
            if (direction === Widget.DOWN) {
                if (index === container.length - 1)
                    return this._isLastWidgetInContainer(parent, direction);
                else
                    return false;
            }
            if (direction === Widget.LEFT)
                return this._isLastWidgetInContainer(parent, direction);

            if (direction === Widget.RIGHT)
                return this._isLastWidgetInContainer(parent, direction);
        } else {
            log("invalid layout Type");
            return false;
        }
    }

    _isWidgetAncestorSupportLoopFocus(widget, direction) {
        var parent = widget.getParent();
        if (parent == null || !(parent instanceof Layout))
            return false;
        if (parent.isLoopFocus()) {
            var layoutType = parent.getLayoutType();
            if (layoutType === Layout.LINEAR_HORIZONTAL) {
                if (direction === Widget.LEFT || direction === Widget.RIGHT)
                    return true;
                else
                    return this._isWidgetAncestorSupportLoopFocus(parent, direction);
            }
            if (layoutType === Layout.LINEAR_VERTICAL) {
                if (direction === Widget.DOWN || direction === Widget.UP)
                    return true;
                else
                    return this._isWidgetAncestorSupportLoopFocus(parent, direction);
            } else {
                assert(0, "invalid layout type");
                return false;
            }
        } else
            return this._isWidgetAncestorSupportLoopFocus(parent, direction);
    }

    _passFocusToChild(direction, current) {
        if (this._checkFocusEnabledChild()) {
            var previousWidget = Widget.getCurrentFocusedWidget();
            this._findProperSearchingFunctor(direction, previousWidget);
            var index = this.onPassFocusToChild(direction, previousWidget);

            var widget = this._getChildWidgetByIndex(index);
            if (widget instanceof Layout) {
                widget._isFocusPassing = true;
                return widget.findNextFocusedWidget(direction, widget);
            } else {
                this.dispatchFocusEvent(current, widget);
                return widget;
            }
        } else
            return this;
    }

    _checkFocusEnabledChild() {
        var locChildren = this._children;
        for (var i = 0, len = locChildren.length; i < len; i++) {
            var widget = locChildren[i];
            if (widget && widget instanceof Widget && widget.isFocusEnabled())
                return true;
        }
        return false;
    }

    getDescription() {
        return "Layout";
    }

    _createCloneInstance() {
        return new Layout();
    }

    _copyClonedWidgetChildren(model) {
        super._copyClonedWidgetChildren(model);
    }

    _copySpecialProperties(layout) {
        if (!(layout instanceof Layout))
            return;
        this.setBackGroundImageScale9Enabled(layout._backGroundScale9Enabled);
        this.setBackGroundImage(layout._backGroundImageFileName, layout._bgImageTexType);
        this.setBackGroundImageCapInsets(layout._backGroundImageCapInsets);
        this.setBackGroundColorType(layout._colorType);
        this.setBackGroundColor(layout._color);
        this.setBackGroundColor(layout._startColor, layout._endColor);
        this.setBackGroundColorOpacity(layout._opacity);
        this.setBackGroundColorVector(layout._alongVector);
        this.setLayoutType(layout._layoutType);
        this.setClippingEnabled(layout._clippingEnabled);
        this.setClippingType(layout._clippingType);
        this._loopFocus = layout._loopFocus;
        this.__passFocusToChild = layout.__passFocusToChild;
        this._isInterceptTouch = layout._isInterceptTouch;
    }

    forceDoLayout() {
        this.requestDoLayout();
        this._doLayout();
    }

    _createRenderCmd() {
        if (RendererConfig.getInstance().isWebGL)
            return new LayoutWebGLRenderCmd(this);
        else
            return new LayoutCanvasRenderCmd(this);
    }
}

Layout.BG_COLOR_NONE = 0;
Layout.BG_COLOR_SOLID = 1;
Layout.BG_COLOR_GRADIENT = 2;

Layout.ABSOLUTE = 0;
Layout.LINEAR_VERTICAL = 1;
Layout.LINEAR_HORIZONTAL = 2;
Layout.RELATIVE = 3;

Layout.CLIPPING_STENCIL = 0;
Layout.CLIPPING_SCISSOR = 1;

Layout.prototype._clippingType = Layout.CLIPPING_STENCIL;

Layout.BACKGROUND_IMAGE_ZORDER = -1;
Layout.BACKGROUND_RENDERER_ZORDER = -2;
