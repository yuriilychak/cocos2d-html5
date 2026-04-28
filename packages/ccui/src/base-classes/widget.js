import { NewClass, EventListener, EventManager, KEY, Point, Size, Rect, Node, RendererConfig, ShaderCache } from '@aspect/core';
import { ProtectedNode } from './protected-node.js';
import { WidgetCanvasRenderCmd, WidgetWebGLRenderCmd } from './widget-render-cmd.js';
import { LayoutParameter } from '../layouts/layout-parameter';

export class FocusNavigationController extends NewClass {
    constructor() {
        super();
        this._keyboardListener = null;
        this._firstFocusedWidget = null;
        this._enableFocusNavigation = false;
        this._keyboardEventPriority = 1;
    }

    enableFocusNavigation(flag) {
        if (this._enableFocusNavigation === flag)
            return;

        this._enableFocusNavigation = flag;
        if (flag)
            this._addKeyboardEventListener();
        else
            this._removeKeyboardEventListener();
    }
    _setFirstFocsuedWidget(widget) {
        this._firstFocusedWidget = widget;
    }
    _onKeyPressed(keyCode, event) {
        if (this._enableFocusNavigation && this._firstFocusedWidget) {
            if (keyCode === KEY.dpadDown) {
                this._firstFocusedWidget = this._firstFocusedWidget.findNextFocusedWidget(Widget.DOWN, this._firstFocusedWidget);
            }
            if (keyCode === KEY.dpadUp) {
                this._firstFocusedWidget = this._firstFocusedWidget.findNextFocusedWidget(Widget.UP, this._firstFocusedWidget);
            }
            if (keyCode === KEY.dpadLeft) {
                this._firstFocusedWidget = this._firstFocusedWidget.findNextFocusedWidget(Widget.LEFT, this._firstFocusedWidget);
            }
            if (keyCode === KEY.dpadRight) {
                this._firstFocusedWidget = this._firstFocusedWidget.findNextFocusedWidget(Widget.RIGHT, this._firstFocusedWidget);
            }
        }
    }
    _addKeyboardEventListener() {
        if (!this._keyboardListener) {
            this._keyboardListener = EventListener.create({
                event: EventListener.KEYBOARD,
                onKeyReleased: this._onKeyPressed.bind(this)
            });
            EventManager.getInstance().addListener(this._keyboardListener, this._keyboardEventPriority);
        }
    }
    _removeKeyboardEventListener() {
        if (this._keyboardListener) {
            EventManager.getInstance().removeEventListener(this._keyboardListener);
            this._keyboardListener = null;
        }
    }
}

export const LAYOUT_COMPONENT_NAME = "__ui_layout";

export class Widget extends ProtectedNode {
    constructor() {
        super();
        this._enabled = true;
        this._bright = true;
        this._touchEnabled = false;
        this._brightStyle = null;
        this._touchBeganPosition = null;
        this._touchMovePosition = null;
        this._touchEndPosition = null;
        this._touchEventListener = null;
        this._touchEventSelector = null;
        this._name = "default";
        this._widgetType = null;
        this._actionTag = 0;
        this._customSize = null;
        this._layoutParameterDictionary = null;
        this._layoutParameterType = 0;
        this._focused = false;
        this._focusEnabled = true;
        this._ignoreSize = false;
        this._affectByClipping = false;
        this._sizeType = null;
        this._sizePercent = null;
        this._positionType = null;
        this._positionPercent = null;
        this._hit = false;
        this._nodes = null;
        this._touchListener = null;
        this._className = "Widget";
        this._flippedX = false;
        this._flippedY = false;
        this._opacity = 255;
        this._highlight = false;
        this._touchEventCallback = null;
        this._clickEventListener = null;
        this._propagateTouchEvents = true;
        this._unifySize = false;
        this._callbackName = null;
        this._callbackType = null;
        this._usingLayoutComponent = false;
        this._inViewRect = true;
        this._ccEventCallback = null;
        this.onFocusChanged = null;
        this.onNextFocusedWidget = null;
        this._brightStyle = Widget.BRIGHT_STYLE_NONE;
        this._touchBeganPosition = new Point(0, 0);
        this._touchMovePosition = new Point(0, 0);
        this._touchEndPosition = new Point(0, 0);
        this._widgetType = Widget.TYPE_WIDGET;
        this._customSize = new Size(0, 0);
        this._layoutParameterDictionary = {};
        this._sizeType = Widget.SIZE_ABSOLUTE;
        this._sizePercent = new Point(0, 0);
        this._positionType = Widget.POSITION_ABSOLUTE;
        this._positionPercent = new Point(0, 0);
        this._nodes = [];
        this._layoutParameterType = LayoutParameter.NONE;
        this.init();
    }

    get xPercent() { return this._getXPercent(); }
    set xPercent(v) { this._setXPercent(v); }

    get yPercent() { return this._getYPercent(); }
    set yPercent(v) { this._setYPercent(v); }

    get widthPercent() { return this._getWidthPercent(); }
    set widthPercent(v) { this._setWidthPercent(v); }

    get heightPercent() { return this._getHeightPercent(); }
    set heightPercent(v) { this._setHeightPercent(v); }

    get widgetParent() { return this.getWidgetParent(); }

    get enabled() { return this.isEnabled(); }
    set enabled(v) { this.setEnabled(v); }

    get focused() { return this.isFocused(); }
    set focused(v) { this.setFocused(v); }

    get sizeType() { return this.getSizeType(); }
    set sizeType(v) { this.setSizeType(v); }

    get widgetType() { return this.getWidgetType(); }

    get touchEnabled() { return this.isTouchEnabled(); }
    set touchEnabled(v) { this.setTouchEnabled(v); }

    get updateEnabled() { return this.isUpdateEnabled(); }
    set updateEnabled(v) { this.setUpdateEnabled(v); }

    get bright() { return this.isBright(); }
    set bright(v) { this.setBright(v); }

    get name() { return this.getName(); }
    set name(v) { this.setName(v); }

    get actionTag() { return this.getActionTag(); }
    set actionTag(v) { this.setActionTag(v); }

    get opacity() { return this.getOpacity(); }
    set opacity(v) { this.setOpacity(v); }

    init() {
        this._layoutParameterDictionary = {};
        this._initRenderer();
        this.setBright(true);

        this.onFocusChanged = this.onFocusChange;
        this.onNextFocusedWidget = null;
        this.setAnchorPoint(new Point(0.5, 0.5));

        this.ignoreContentAdaptWithSize(true);
        return true;
    }

    onEnter() {
        var locListener = this._touchListener;
        if (locListener && !locListener._isRegistered() && this._touchEnabled)
            EventManager.getInstance().addListener(locListener, this);
        if(!this._usingLayoutComponent)
            this.updateSizeAndPosition();
        if (this._sizeDirty)
            this._onSizeChanged();
        super.onEnter();
    }

    onExit() {
        this.unscheduleUpdate();
        super.onExit();
    }
    _getOrCreateLayoutComponent(){
        var layoutComponent = this.getComponent(LAYOUT_COMPONENT_NAME);
        if (null == layoutComponent){
            layoutComponent = new cc.LayoutComponent();
            this.addComponent(layoutComponent);
        }
        return layoutComponent;
    }

    getWidgetParent() {
        var widget = this.getParent();
        if (widget instanceof Widget)
            return widget;
        return null;
    }
    _updateContentSizeWithTextureSize(size) {
        if(this._unifySize){
            this.setContentSize(size);
            return;
        }
        this.setContentSize(this._ignoreSize ? size : this._customSize);
    }
    _isAncestorsEnabled() {
        var parentWidget = this._getAncensterWidget(this);
        if (parentWidget == null)
            return true;
        if (parentWidget && !parentWidget.isEnabled())
            return false;

        return parentWidget._isAncestorsEnabled();
    }

    setPropagateTouchEvents(isPropagate) {
        this._propagateTouchEvents = isPropagate;
    }

    isPropagateTouchEvents() {
        return this._propagateTouchEvents;
    }

    setSwallowTouches(swallow) {
        if (this._touchListener)
            this._touchListener.setSwallowTouches(swallow);
    }

    isSwallowTouches() {
        if (this._touchListener) {
            return this._touchListener.isSwallowTouches();
        }
        return false;
    }
    _getAncensterWidget(node) {
        if (null == node)
            return null;

        var parent = node.getParent();
        if (null == parent)
            return null;

        if (parent instanceof Widget)
            return parent;
        else
            return this._getAncensterWidget(parent.getParent());
    }
    _isAncestorsVisible(node) {
        if (null == node)
            return true;

        var parent = node.getParent();

        if (parent && !parent.isVisible())
            return false;
        return this._isAncestorsVisible(parent);
    }

    setEnabled(enabled) {
        this._enabled = enabled;
        this.setBright(enabled);
    }

    _initRenderer() {
    }

    setContentSize(contentSize, height){
        Node.prototype.setContentSize.call(this, contentSize, height);

        var locWidth = this._contentSize.width;
        var locHeight = this._contentSize.height;

        this._customSize.width = locWidth;
        this._customSize.height = locHeight;
        if(this._unifySize){
            //unify size logic
        } else if (this._ignoreSize) {
            this._contentSize = this.getVirtualRendererSize();
        }
        if (!this._usingLayoutComponent && this._running) {
            var widgetParent = this.getWidgetParent();
            var pSize = widgetParent ? widgetParent.getContentSize() : this._parent.getContentSize();
            this._sizePercent.x = (pSize.width > 0.0) ? locWidth / pSize.width : 0.0;
            this._sizePercent.y = (pSize.height > 0.0) ? locHeight / pSize.height : 0.0;
        }

        if (this._running) {
            this._onSizeChanged();
        } else {
            this._sizeDirty = true;
        }
    }
    _setWidth(w) {
        if (w === this._contentSize.width) {
            return;
        }
        Node.prototype._setWidth.call(this, w);
        this._customSize.width = w;
        if(this._unifySize){
            //unify size logic
        } else if (this._ignoreSize) {
            this._contentSize = this.getVirtualRendererSize();
        }

        if (!this._usingLayoutComponent && this._running) {
            var widgetParent = this.getWidgetParent();
            var locWidth = widgetParent ? widgetParent.width : this._parent.width;
            this._sizePercent.x = locWidth > 0 ? this._customSize.width / locWidth : 0;
        }

        if (this._running) {
            this._onSizeChanged();
        } else {
            this._sizeDirty = true;
        }
    }
    _setHeight(h) {
        if (h === this._contentSize.height) {
            return;
        }

        Node.prototype._setHeight.call(this, h);
        this._customSize.height = h;
        if(this._unifySize){
            //unify size logic
        } else if (this._ignoreSize) {
            this._contentSize = this.getVirtualRendererSize();
        }

        if (!this._usingLayoutComponent && this._running) {
            var widgetParent = this.getWidgetParent();
            var locH = widgetParent ? widgetParent.height : this._parent.height;
            this._sizePercent.y = locH > 0 ? this._customSize.height / locH : 0;
        }

        if (this._running) {
            this._onSizeChanged();
        } else {
            this._sizeDirty = true;
        }
    }

    setSizePercent(percent) {
        if(this._usingLayoutComponent){
            var component = this._getOrCreateLayoutComponent();
            component.setUsingPercentContentSize(true);
            component.setPercentContentSize(percent);
            component.refreshLayout();
            return;
        }

        this._sizePercent.x = percent.x;
        this._sizePercent.y = percent.y;
        var width = this._customSize.width, height = this._customSize.height;
        if (this._running) {
            var widgetParent = this.getWidgetParent();
            if (widgetParent) {
                width = widgetParent.width * percent.x;
                height = widgetParent.height * percent.y;
            } else {
                width = this._parent.width * percent.x;
                height = this._parent.height * percent.y;
            }
        }
        if (this._ignoreSize)
            this.setContentSize(this.getVirtualRendererSize());
        else
            this.setContentSize(width, height);

        this._customSize.width = width;
        this._customSize.height = height;
    }
    _setWidthPercent(percent) {
        this._sizePercent.x = percent;
        var width = this._customSize.width;
        if (this._running) {
            var widgetParent = this.getWidgetParent();
            width = (widgetParent ? widgetParent.width : this._parent.width) * percent;
        }
        if (this._ignoreSize)
            this._setWidth(this.getVirtualRendererSize().width);
        else
            this._setWidth(width);
        this._customSize.width = width;
    }
    _setHeightPercent(percent) {
        this._sizePercent.y = percent;
        var height = this._customSize.height;
        if (this._running) {
            var widgetParent = this.getWidgetParent();
            height = (widgetParent ? widgetParent.height : this._parent.height) * percent;
        }
        if (this._ignoreSize)
            this._setHeight(this.getVirtualRendererSize().height);
        else
            this._setHeight(height);
        this._customSize.height = height;
    }

    updateSizeAndPosition(parentSize) {
        if (!parentSize) {
            var widgetParent = this.getWidgetParent();
            if (widgetParent)
                parentSize = widgetParent.getLayoutSize();
            else
                parentSize = this._parent.getContentSize();
        }

        switch (this._sizeType) {
            case Widget.SIZE_ABSOLUTE:
                if (this._ignoreSize)
                    this.setContentSize(this.getVirtualRendererSize());
                else
                    this.setContentSize(this._customSize);
                this._sizePercent.x = (parentSize.width > 0) ? this._customSize.width / parentSize.width : 0;
                this._sizePercent.y = (parentSize.height > 0) ? this._customSize.height / parentSize.height : 0;
                break;
            case Widget.SIZE_PERCENT:
                var cSize = new Size(parentSize.width * this._sizePercent.x, parentSize.height * this._sizePercent.y);
                if (this._ignoreSize)
                    this.setContentSize(this.getVirtualRendererSize());
                else
                    this.setContentSize(cSize);
                this._customSize.width = cSize.width;
                this._customSize.height = cSize.height;
                break;
            default:
                break;
        }
        this._onSizeChanged();
        var absPos = this.getPosition();
        switch (this._positionType) {
            case Widget.POSITION_ABSOLUTE:
                if (parentSize.width <= 0 || parentSize.height <= 0) {
                    this._positionPercent.x = this._positionPercent.y = 0;
                } else {
                    this._positionPercent.x = absPos.x / parentSize.width;
                    this._positionPercent.y = absPos.y / parentSize.height;
                }
                break;
            case Widget.POSITION_PERCENT:
                absPos = new Point(parentSize.width * this._positionPercent.x, parentSize.height * this._positionPercent.y);
                break;
            default:
                break;
        }
        if (this._parent instanceof cc.ccui.ImageView) {
            var renderer = this._parent._imageRenderer;
            if (renderer && !renderer._textureLoaded)
                return;
        }
        this.setPosition(absPos);
    }

    setSizeType(type) {
        this._sizeType = type;
        if (this._usingLayoutComponent) {
            var component = this._getOrCreateLayoutComponent();
            component.setUsingPercentContentSize(this._sizeType === cc.SIZE_PERCENT);
        }
    }

    getSizeType() {
        return this._sizeType;
    }

    ignoreContentAdaptWithSize(ignore) {
        if(this._unifySize){
            this.setContentSize(this._customSize);
            return;
        }

        if (this._ignoreSize === ignore)
            return;

        this._ignoreSize = ignore;
        this.setContentSize(ignore ? this.getVirtualRendererSize() : this._customSize);
    }

    isIgnoreContentAdaptWithSize() {
        return this._ignoreSize;
    }

    getCustomSize() {
        return new Size(this._customSize);
    }

    getLayoutSize() {
        return new Size(this._contentSize);
    }

    getSizePercent() {
        if(this._usingLayoutComponent){
            var component = this._getOrCreateLayoutComponent();
            this._sizePercent = component.getPercentContentSize();
        }
        return this._sizePercent;
    }
    _getWidthPercent() {
        return this._sizePercent.x;
    }
    _getHeightPercent() {
        return this._sizePercent.y;
    }

    getWorldPosition() {
        return this.convertToWorldSpace(new Point(this._anchorPoint.x * this._contentSize.width, this._anchorPoint.y * this._contentSize.height));
    }

    getVirtualRenderer() {
        return this;
    }

    getVirtualRendererSize() {
        return new Size(this._contentSize);
    }

    _onSizeChanged() {
        if(!this._usingLayoutComponent){
            var locChildren = this.getChildren();
            for (var i = 0, len = locChildren.length; i < len; i++) {
                var child = locChildren[i];
                if (child instanceof Widget)
                    child.updateSizeAndPosition();
            }
            this._sizeDirty = false;
        }
    }

    setTouchEnabled(enable) {
        if (this._touchEnabled === enable)
            return;

        this._touchEnabled = enable;
        if (this._touchEnabled) {
            if (!this._touchListener)
                this._touchListener = EventListener.create({
                    event: EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: this.onTouchBegan.bind(this),
                    onTouchMoved: this.onTouchMoved.bind(this),
                    onTouchEnded: this.onTouchEnded.bind(this)
                });
            EventManager.getInstance().addListener(this._touchListener, this);
        } else {
            EventManager.getInstance().removeListener(this._touchListener);
        }
    }

    isTouchEnabled() {
        return this._touchEnabled;
    }

    isHighlighted() {
        return this._highlight;
    }

    setHighlighted(highlight) {
        if (highlight === this._highlight)
            return;
        this._highlight = highlight;
        if (this._bright) {
            if (this._highlight)
                this.setBrightStyle(Widget.BRIGHT_STYLE_HIGH_LIGHT);
            else
                this.setBrightStyle(Widget.BRIGHT_STYLE_NORMAL);
        } else
            this._onPressStateChangedToDisabled();
    }

    isFocused() {
        return this._focused;
    }

    setFocused(focus) {
        this._focused = focus;
        if (focus) {
            Widget._focusedWidget = this;
            if (Widget._focusNavigationController)
                Widget._focusNavigationController._setFirstFocsuedWidget(this);
        }
    }

    isFocusEnabled() {
        return this._focusEnabled;
    }

    setFocusEnabled(enable) {
        this._focusEnabled = enable;
    }

    findNextFocusedWidget(direction, current) {
        if (null === this.onNextFocusedWidget || null == this.onNextFocusedWidget(direction)) {
            var isLayout = current instanceof cc.ccui.Layout;
            if (this.isFocused() || isLayout) {
                var layout = this.getParent();
                if (null === layout || !(layout instanceof cc.ccui.Layout)) {
                    if (isLayout)
                        return current.findNextFocusedWidget(direction, current);
                    return current;
                } else
                    return layout.findNextFocusedWidget(direction, current);
            } else
                return current;
        } else {
            var getFocusWidget = this.onNextFocusedWidget(direction);
            this.dispatchFocusEvent(this, getFocusWidget);
            return getFocusWidget;
        }
    }

    requestFocus() {
        if (this === Widget._focusedWidget)
            return;
        this.dispatchFocusEvent(Widget._focusedWidget, this);
    }

    getCurrentFocusedWidget() {
        return Widget._focusedWidget;
    }

    interceptTouchEvent(eventType, sender, touch) {
        var widgetParent = this.getWidgetParent();
        if (widgetParent)
            widgetParent.interceptTouchEvent(eventType, sender, touch);
    }

    onFocusChange(widgetLostFocus, widgetGetFocus) {
        if (widgetLostFocus)
            widgetLostFocus.setFocused(false);
        if (widgetGetFocus)
            widgetGetFocus.setFocused(true);
    }

    dispatchFocusEvent(widgetLostFocus, widgetGetFocus) {
        if (widgetLostFocus && !widgetLostFocus.isFocused())
            widgetLostFocus = Widget._focusedWidget;

        if (widgetGetFocus !== widgetLostFocus) {
            if (widgetGetFocus && widgetGetFocus.onFocusChanged)
                widgetGetFocus.onFocusChanged(widgetLostFocus, widgetGetFocus);
            if (widgetLostFocus && widgetGetFocus.onFocusChanged)
                widgetLostFocus.onFocusChanged(widgetLostFocus, widgetGetFocus);
            EventManager.getInstance().dispatchEvent(new cc.EventFocus(widgetLostFocus, widgetGetFocus));
        }
    }

    setBright(bright) {
        this._bright = bright;
        if (this._bright) {
            this._brightStyle = Widget.BRIGHT_STYLE_NONE;
            this.setBrightStyle(Widget.BRIGHT_STYLE_NORMAL);
        } else
            this._onPressStateChangedToDisabled();
    }

    setBrightStyle(style) {
        if (this._brightStyle === style)
            return;

        style = style || Widget.BRIGHT_STYLE_NORMAL;
        this._brightStyle = style;
        switch (this._brightStyle) {
            case Widget.BRIGHT_STYLE_NORMAL:
                this._onPressStateChangedToNormal();
                break;
            case Widget.BRIGHT_STYLE_HIGH_LIGHT:
                this._onPressStateChangedToPressed();
                break;
            default:
                break;
        }
    }
    _onPressStateChangedToNormal() {
    }
    _onPressStateChangedToPressed() {
    }
    _onPressStateChangedToDisabled() {
    }
    _updateChildrenDisplayedRGBA() {
        this.setColor(this.getColor());
        this.setOpacity(this.getOpacity());
    }

    didNotSelectSelf() {
    }

    onTouchBegan(touch, event) {
        this._hit = false;
        if (this.isVisible() && this.isEnabled() && this._isAncestorsEnabled() && this._isAncestorsVisible(this)) {
            var touchPoint = touch.getLocation();
            this._touchBeganPosition.x = touchPoint.x;
            this._touchBeganPosition.y = touchPoint.y;
            if (this.hitTest(this._touchBeganPosition) && this.isClippingParentContainsPoint(this._touchBeganPosition))
                this._hit = true;
        }
        if (!this._hit) {
            return false;
        }
        this.setHighlighted(true);

        if (this._propagateTouchEvents) {
            this.propagateTouchEvent(Widget.TOUCH_BEGAN, this, touch);
        }

        this._pushDownEvent();
        return true;
    }
    propagateTouchEvent(event, sender, touch) {
        var widgetParent = this.getWidgetParent();
        if (widgetParent) {
            widgetParent.interceptTouchEvent(event, sender, touch);
        }
    }

    onTouchMoved(touch, event) {
        var touchPoint = touch.getLocation();
        this._touchMovePosition.x = touchPoint.x;
        this._touchMovePosition.y = touchPoint.y;
        this.setHighlighted(this.hitTest(touchPoint));
        if (this._propagateTouchEvents)
            this.propagateTouchEvent(Widget.TOUCH_MOVED, this, touch);
        this._moveEvent();
    }

    onTouchEnded(touch, event) {
        var touchPoint = touch.getLocation();
        this._touchEndPosition.x = touchPoint.x;
        this._touchEndPosition.y = touchPoint.y;
        if (this._propagateTouchEvents)
            this.propagateTouchEvent(Widget.TOUCH_ENDED, this, touch);

        var highlight = this._highlight;
        this.setHighlighted(false);
        if (highlight)
            this._releaseUpEvent();
        else
            this._cancelUpEvent();
    }

    onTouchCancelled(touchPoint) {
        this.setHighlighted(false);
        this._cancelUpEvent();
    }

    onTouchLongClicked(touchPoint) {
        this.longClickEvent();
    }
    _pushDownEvent() {
        if (this._touchEventCallback)
            this._touchEventCallback(this, Widget.TOUCH_BEGAN);
        if (this._touchEventListener && this._touchEventSelector)
            this._touchEventSelector.call(this._touchEventListener, this, Widget.TOUCH_BEGAN);
    }
    _moveEvent() {
        if (this._touchEventCallback)
            this._touchEventCallback(this, Widget.TOUCH_MOVED);
        if (this._touchEventListener && this._touchEventSelector)
            this._touchEventSelector.call(this._touchEventListener, this, Widget.TOUCH_MOVED);
    }
    _releaseUpEvent() {
        if (this._touchEventCallback)
            this._touchEventCallback(this, Widget.TOUCH_ENDED);
        if (this._touchEventListener && this._touchEventSelector)
            this._touchEventSelector.call(this._touchEventListener, this, Widget.TOUCH_ENDED);
        if (this._clickEventListener)
            this._clickEventListener(this);
    }
    _cancelUpEvent() {
        if (this._touchEventCallback)
            this._touchEventCallback(this, Widget.TOUCH_CANCELED);
        if (this._touchEventListener && this._touchEventSelector)
            this._touchEventSelector.call(this._touchEventListener, this, Widget.TOUCH_CANCELED);
    }
    longClickEvent() {
        //TODO it will implement in v3.1
    }

    addTouchEventListener(selector, target) {
        if (target === undefined)
            this._touchEventCallback = selector;
        else {
            this._touchEventSelector = selector;
            this._touchEventListener = target;
        }
    }
    addClickEventListener(callback) {
        this._clickEventListener = callback;
    }

    hitTest(pt) {
        var bb = new Rect(0, 0, this._contentSize.width, this._contentSize.height);
        return Rect.containsPoint(bb, this.convertToNodeSpace(pt));
    }

    isClippingParentContainsPoint(pt) {
        this._affectByClipping = false;
        var parent = this.getParent();
        var clippingParent = null;
        while (parent) {
            if (parent instanceof cc.ccui.Layout) {
                if (parent.isClippingEnabled()) {
                    this._affectByClipping = true;
                    clippingParent = parent;
                    break;
                }
            }
            parent = parent.getParent();
        }

        if (!this._affectByClipping)
            return true;

        if (clippingParent) {
            if (clippingParent.hitTest(pt))
                return clippingParent.isClippingParentContainsPoint(pt);
            return false;
        }
        return true;
    }

    checkChildInfo(handleState, sender, touchPoint) {
        var widgetParent = this.getWidgetParent();
        if (widgetParent)
            widgetParent.checkChildInfo(handleState, sender, touchPoint);
    }

    setPosition(pos, posY) {
        if (!this._usingLayoutComponent && this._running) {
            var widgetParent = this.getWidgetParent();
            if (widgetParent) {
                var pSize = widgetParent.getContentSize();
                if (pSize.width <= 0 || pSize.height <= 0) {
                    this._positionPercent.x = 0;
                    this._positionPercent.y = 0;
                } else {
                    if (posY === undefined) {
                        this._positionPercent.x = pos.x / pSize.width;
                        this._positionPercent.y = pos.y / pSize.height;
                    } else {
                        this._positionPercent.x = pos / pSize.width;
                        this._positionPercent.y = posY / pSize.height;
                    }
                }
            }
        }

        Node.prototype.setPosition.call(this, pos, posY);
    }
    setPositionX(x) {
        if (this._running) {
            var widgetParent = this.getWidgetParent();
            if (widgetParent) {
                var pw = widgetParent.width;
                if (pw <= 0)
                    this._positionPercent.x = 0;
                else
                    this._positionPercent.x = x / pw;
            }
        }

        Node.prototype.setPositionX.call(this, x);
    }
    setPositionY(y) {
        if (this._running) {
            var widgetParent = this.getWidgetParent();
            if (widgetParent) {
                var ph = widgetParent.height;
                if (ph <= 0)
                    this._positionPercent.y = 0;
                else
                    this._positionPercent.y = y / ph;
            }
        }

        Node.prototype.setPositionY.call(this, y);
    }

    setPositionPercent(percent) {
        if (this._usingLayoutComponent){
            var component = this._getOrCreateLayoutComponent();
            component.setPositionPercentX(percent.x);
            component.setPositionPercentY(percent.y);
            component.refreshLayout();
            return;
        }else{
            this._setXPercent(percent.x);
            this._setYPercent(percent.y);
        }
        this._renderCmd.setDirtyFlag(Node._dirtyFlags.transformDirty);
    }
    _setXPercent(percent) {
        if (this._usingLayoutComponent){
            var component = this._getOrCreateLayoutComponent();
            component.setPositionPercentX(percent.x);
            component.refreshLayout();
            return;
        }
        this._positionPercent.x = percent;
        this._renderCmd.setDirtyFlag(Node._dirtyFlags.transformDirty);
    }
    _setYPercent(percent) {
        if (this._usingLayoutComponent){
            var component = this._getOrCreateLayoutComponent();
            component.setPositionPercentY(percent.x);
            component.refreshLayout();
            return;
        }
        this._positionPercent.y = percent;
        this._renderCmd.setDirtyFlag(Node._dirtyFlags.transformDirty);
    }

    getPositionPercent() {
        if (this._usingLayoutComponent) {
            var component = this._getOrCreateLayoutComponent();
            this._positionPercent.x = component.getPositionPercentX();
            this._positionPercent.y = component.getPositionPercentY();
        }
        return new Point(this._positionPercent);
    }
    _getXPercent() {
        if (this._usingLayoutComponent) {
            var component = this._getOrCreateLayoutComponent();
            this._positionPercent.x = component.getPositionPercentX();
            this._positionPercent.y = component.getPositionPercentY();
        }
        return this._positionPercent.x;
    }
    _getYPercent() {
        if (this._usingLayoutComponent) {
            var component = this._getOrCreateLayoutComponent();
            this._positionPercent.x = component.getPositionPercentX();
            this._positionPercent.y = component.getPositionPercentY();
        }
        return this._positionPercent.y;
    }

    setPositionType(type) {
        this._positionType = type;
        if(this._usingLayoutComponent){
            var component = this._getOrCreateLayoutComponent();
            if (type === cc.POSITION_ABSOLUTE){
                component.setPositionPercentXEnabled(false);
                component.setPositionPercentYEnabled(false);
            } else {
                component.setPositionPercentXEnabled(true);
                component.setPositionPercentYEnabled(true);
            }
        }
        this._renderCmd.setDirtyFlag(Node._dirtyFlags.transformDirty);
    }

    getPositionType() {
        return this._positionType;
    }

    setFlippedX(flipX) {
        var realScale = this.getScaleX();
        this._flippedX = flipX;
        this.setScaleX(realScale);
    }

    isFlippedX() {
        return this._flippedX;
    }

    setFlippedY(flipY) {
        var realScale = this.getScaleY();
        this._flippedY = flipY;
        this.setScaleY(realScale);
    }

    isFlippedY() {
        return this._flippedY;
    }
    _adaptRenderers() {
    }

    isBright() {
        return this._bright;
    }

    isEnabled() {
        return this._enabled;
    }

    getLeftBoundary() {
        return this.getPositionX() - this._getAnchorX() * this._contentSize.width;
    }

    getBottomBoundary() {
        return this.getPositionY() - this._getAnchorY() * this._contentSize.height;
    }

    getRightBoundary() {
        return this.getLeftBoundary() + this._contentSize.width;
    }

    getTopBoundary() {
        return this.getBottomBoundary() + this._contentSize.height;
    }

    getTouchBeganPosition() {
        return new Point(this._touchBeganPosition);
    }

    getTouchMovePosition() {
        return new Point(this._touchMovePosition);
    }

    getTouchEndPosition() {
        return new Point(this._touchEndPosition);
    }

    getWidgetType() {
        return this._widgetType;
    }

    setLayoutParameter(parameter) {
        if (!parameter)
            return;
        this._layoutParameterDictionary[parameter.getLayoutType()] = parameter;
        this._layoutParameterType = parameter.getLayoutType();
    }

    getLayoutParameter(type) {
        type = type || this._layoutParameterType;
        return this._layoutParameterDictionary[type];
    }

    getDescription() {
        return "Widget";
    }

    clone() {
        var clonedWidget = this._createCloneInstance();
        clonedWidget._copyProperties(this);
        clonedWidget._copyClonedWidgetChildren(this);
        return clonedWidget;
    }
    _createCloneInstance() {
        return new Widget();
    }
    _copyClonedWidgetChildren(model) {
        var widgetChildren = model.getChildren();
        for (var i = 0; i < widgetChildren.length; i++) {
            var locChild = widgetChildren[i];
            if (locChild instanceof Widget)
                this.addChild(locChild.clone());
        }
    }
    _copySpecialProperties(model) {
    }
    _copyProperties(widget) {
        this.setEnabled(widget.isEnabled());
        this.setVisible(widget.isVisible());
        this.setBright(widget.isBright());
        this.setTouchEnabled(widget.isTouchEnabled());
        this.setLocalZOrder(widget.getLocalZOrder());
        this.setTag(widget.getTag());
        this.setName(widget.getName());
        this.setActionTag(widget.getActionTag());

        this._ignoreSize = widget._ignoreSize;

        this.setContentSize(widget._contentSize);
        this._customSize.width = widget._customSize.width;
        this._customSize.height = widget._customSize.height;

        this._copySpecialProperties(widget);
        this._sizeType = widget.getSizeType();
        this._sizePercent.x = widget._sizePercent.x;
        this._sizePercent.y = widget._sizePercent.y;

        this._positionType = widget._positionType;
        this._positionPercent.x = widget._positionPercent.x;
        this._positionPercent.y = widget._positionPercent.y;

        this.setPosition(widget.getPosition());
        this.setAnchorPoint(widget.getAnchorPoint());
        this.setScaleX(widget.getScaleX());
        this.setScaleY(widget.getScaleY());
        this.setRotation(widget.getRotation());
        this.setRotationX(widget.getRotationX());
        this.setRotationY(widget.getRotationY());
        this.setFlippedX(widget.isFlippedX());
        this.setFlippedY(widget.isFlippedY());
        this.setColor(widget.getColor());
        this.setOpacity(widget.getOpacity());

        this._touchEventCallback = widget._touchEventCallback;
        this._touchEventListener = widget._touchEventListener;
        this._touchEventSelector = widget._touchEventSelector;
        this._clickEventListener = widget._clickEventListener;
        this._focused = widget._focused;
        this._focusEnabled = widget._focusEnabled;
        this._propagateTouchEvents = widget._propagateTouchEvents;

        for (var key in widget._layoutParameterDictionary) {
            var parameter = widget._layoutParameterDictionary[key];
            if (parameter)
                this.setLayoutParameter(parameter.clone());
        }
    }
    setActionTag(tag) {
        this._actionTag = tag;
    }
    getActionTag() {
        return this._actionTag;
    }

    getLeftInParent() {
        cc.log("getLeftInParent is deprecated. Please use getLeftBoundary instead.");
        return this.getLeftBoundary();
    }

    getBottomInParent() {
        cc.log("getBottomInParent is deprecated. Please use getBottomBoundary instead.");
        return this.getBottomBoundary();
    }

    getRightInParent() {
        cc.log("getRightInParent is deprecated. Please use getRightBoundary instead.");
        return this.getRightBoundary();
    }

    getTopInParent() {
        cc.log("getTopInParent is deprecated. Please use getTopBoundary instead.");
        return this.getTopBoundary();
    }

    getTouchEndPos() {
        cc.log("getTouchEndPos is deprecated. Please use getTouchEndPosition instead.");
        return this.getTouchEndPosition();
    }

    getTouchMovePos() {
        cc.log("getTouchMovePos is deprecated. Please use getTouchMovePosition instead.");
        return this.getTouchMovePosition();
    }

    clippingParentAreaContainPoint(pt) {
        cc.log("clippingParentAreaContainPoint is deprecated. Please use isClippingParentContainsPoint instead.");
        this.isClippingParentContainsPoint(pt);
    }

    getTouchStartPos() {
        cc.log("getTouchStartPos is deprecated. Please use getTouchBeganPosition instead.");
        return this.getTouchBeganPosition();
    }

    setSize(size) {
        this.setContentSize(size);
    }

    getSize() {
        return this.getContentSize();
    }

    addNode(node, zOrder, tag) {
        if (node instanceof Widget) {
            cc.log("Please use addChild to add a Widget.");
            return;
        }
        Node.prototype.addChild.call(this, node, zOrder, tag);
        this._nodes.push(node);
    }

    getNodeByTag(tag) {
        var _nodes = this._nodes;
        for (var i = 0; i < _nodes.length; i++) {
            var node = _nodes[i];
            if (node && node.getTag() === tag) {
                return node;
            }
        }
        return null;
    }

    getNodes() {
        return this._nodes;
    }

    removeNode(node, cleanup) {
        Node.prototype.removeChild.call(this, node, cleanup);
        cc.arrayRemoveObject(this._nodes, node);
    }
    _getNormalGLProgram() {
        return ShaderCache.getInstance().programForKey(cc.SHADER_SPRITE_POSITION_TEXTURECOLOR);
    }
    _getGrayGLProgram() {
        return ShaderCache.getInstance().programForKey(cc.SHADER_SPRITE_POSITION_TEXTURECOLOR_GRAY);
    }

    removeNodeByTag(tag, cleanup) {
        var node = this.getChildByTag(tag);
        if (!node)
            cc.log("cocos2d: removeNodeByTag(tag = %d): child not found!", tag);
        else
            this.removeChild(node, cleanup);
    }

    removeAllNodes() {
        for (var i = 0; i < this._nodes.length; i++) {
            var node = this._nodes[i];
            Node.prototype.removeChild.call(this, node);
        }
        this._nodes.length = 0;
    }
    _findLayout() {
        RendererConfig.getInstance().renderer.childrenOrderDirty = true;
        var layout = this._parent;
        while (layout) {
            if (layout._doLayout) {
                layout._doLayoutDirty = true;
                break;
            } else
                layout = layout._parent;
        }
    }

    isUnifySizeEnabled(){
        return this._unifySize;
    }

    setUnifySizeEnabled(enable){
        this._unifySize = enable;
    }

    addCCSEventListener(callback) {
        this._ccEventCallback = callback;
    }

    setScaleX(scaleX) {
        if (this._flippedX)
            scaleX = scaleX * -1;
        Node.prototype.setScaleX.call(this, scaleX);
    }
    setScaleY(scaleY) {
        if (this._flippedY)
            scaleY = scaleY * -1;
        Node.prototype.setScaleY.call(this, scaleY);
    }
    setScale(scaleX, scaleY) {
        if (scaleY === undefined)
            scaleY = scaleX;
        this.setScaleX(scaleX);
        this.setScaleY(scaleY);
    }
    getScaleX() {
        var originalScale = Node.prototype.getScaleX.call(this);
        if (this._flippedX)
            originalScale = originalScale * -1.0;
        return originalScale;
    }
    getScaleY() {
        var originalScale = Node.prototype.getScaleY.call(this);
        if (this._flippedY)
            originalScale = originalScale * -1.0;
        return originalScale;
    }
    getScale() {
        if (this.getScaleX() !== this.getScaleY())
            cc.log("Widget#scale. ScaleX != ScaleY. Don't know which one to return");
        return this.getScaleX();
    }

    setCallbackName(callbackName) {
        this._callbackName = callbackName;
    }

    getCallbackName() {
        return this._callbackName;
    }

    setCallbackType(callbackType) {
        this._callbackType = callbackType;
    }

    getCallbackType() {
        return this._callbackType;
    }

    setLayoutComponentEnabled(enable){
        this._usingLayoutComponent = enable;
    }

    isLayoutComponentEnabled(){
        return this._usingLayoutComponent;
    }
    _createRenderCmd() {
        if (RendererConfig.getInstance().isWebGL)
            return new WidgetWebGLRenderCmd(this);
        else
            return new WidgetCanvasRenderCmd(this);
    }
}

Widget._focusedWidget = null;
Widget._focusNavigationController = null;

Widget.enableDpadNavigation = function (enable) {
    if (enable) {
        if (null == Widget._focusNavigationController) {
            Widget._focusNavigationController = new FocusNavigationController();
            if (Widget._focusedWidget) {
                Widget._focusNavigationController._setFirstFocsuedWidget(Widget._focusedWidget);
            }
        }
        Widget._focusNavigationController.enableFocusNavigation(true);
    } else {
        if (Widget._focusNavigationController) {
            Widget._focusNavigationController.enableFocusNavigation(false);
            Widget._focusNavigationController = null;
        }
    }
};

Widget.getCurrentFocusedWidget = function () {
    return Widget._focusedWidget;
};

Widget.BRIGHT_STYLE_NONE = -1;
Widget.BRIGHT_STYLE_NORMAL = 0;
Widget.BRIGHT_STYLE_HIGH_LIGHT = 1;

Widget.TYPE_WIDGET = 0;
Widget.TYPE_CONTAINER = 1;

Widget.LEFT = 0;
Widget.RIGHT = 1;
Widget.UP = 2;
Widget.DOWN = 3;

Widget.LOCAL_TEXTURE = 0;
Widget.PLIST_TEXTURE = 1;

Widget.TOUCH_BEGAN = 0;
Widget.TOUCH_MOVED = 1;
Widget.TOUCH_ENDED = 2;
Widget.TOUCH_CANCELED = 3;

Widget.SIZE_ABSOLUTE = 0;
Widget.SIZE_PERCENT = 1;

Widget.POSITION_ABSOLUTE = 0;
Widget.POSITION_PERCENT = 1;
