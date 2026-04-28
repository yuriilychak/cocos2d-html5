import {
    Layer, Node, NewClass, Point, Size, Rect,
    EventListener, EventManager, RendererConfig, EGLView
} from "@aspect/core";
import { MoveTo, CallFunc, sequence, ActionTween } from "@aspect/actions";

export const SCROLLVIEW_DIRECTION_NONE = -1;
export const SCROLLVIEW_DIRECTION_HORIZONTAL = 0;
export const SCROLLVIEW_DIRECTION_VERTICAL = 1;
export const SCROLLVIEW_DIRECTION_BOTH = 2;

const SCROLL_DEACCEL_RATE = 0.95;
const SCROLL_DEACCEL_DIST = 1.0;
const BOUNCE_DURATION = 0.15;
const INSET_RATIO = 0.2;
const MOVE_INCH = 7.0 / 160.0;
const BOUNCE_BACK_FACTOR = 0.35;

export function convertDistanceFromPointToInch(pointDis) {
    var eglViewer = EGLView.getInstance();
    var factor = (eglViewer.getScaleX() + eglViewer.getScaleY()) / 2;
    return (pointDis * factor) / 160;
}

export class ScrollViewDelegate extends NewClass {
    scrollViewDidScroll(view) {}
    scrollViewDidZoom(view) {}
}

export class GScrollView extends Layer {
    _zoomScale = 0;
    _minZoomScale = 0;
    _maxZoomScale = 0;
    _delegate = null;
    _direction = SCROLLVIEW_DIRECTION_BOTH;
    _dragging = false;
    _contentOffset = null;
    _container = null;
    _touchMoved = false;
    _maxInset = null;
    _minInset = null;
    _bounceable = false;
    _clippingToBounds = false;
    _scrollDistance = null;
    _touchPoint = null;
    _touchLength = 0;
    _touches = null;
    _viewSize = null;
    _minScale = 0;
    _maxScale = 0;

    _parentScissorRect = null;
    _scissorRestored = false;

    _tmpViewRect = null;
    _touchListener = null;
    _className = "ScrollView";

    get minOffset() { return this.minContainerOffset(); }
    get maxOffset() { return this.maxContainerOffset(); }
    get bounceable() { return this.isBounceable(); }
    set bounceable(v) { this.setBounceable(v); }
    get viewSize() { return this.getViewSize(); }
    set viewSize(v) { this.setViewSize(v); }
    get container() { return this.getContainer(); }
    set container(v) { this.setContainer(v); }
    get direction() { return this.getDirection(); }
    set direction(v) { this.setDirection(v); }
    get delegate() { return this.getDelegate(); }
    set delegate(v) { this.setDelegate(v); }
    get clippingToBounds() { return this.isClippingToBounds(); }
    set clippingToBounds(v) { this.setClippingToBounds(v); }

    constructor(size, container) {
        super();
        this._contentOffset = new Point(0, 0);
        this._maxInset = new Point(0, 0);
        this._minInset = new Point(0, 0);
        this._scrollDistance = new Point(0, 0);
        this._touchPoint = new Point(0, 0);
        this._touches = [];
        this._viewSize = new Size(0, 0);
        this._parentScissorRect = new Rect(0, 0, 0, 0);
        this._tmpViewRect = new Rect(0, 0, 0, 0);

        if (container !== undefined)
            this.initWithViewSize(size, container);
        else
            this.initWithViewSize(new Size(200, 200), null);
    }

    init() {
        return this.initWithViewSize(new Size(200, 200), null);
    }

    initWithViewSize(size, container) {
        var pZero = new Point(0, 0);
        if (super.init()) {
            if (!container && !this._container) {
                container = new Layer();
            }
            if (container) {
                this.setContainer(container);
            }
            this.setViewSize(size);

            this.setTouchEnabled(true);
            this._touches.length = 0;
            this._delegate = null;
            this._bounceable = true;
            this._clippingToBounds = true;

            this._direction = SCROLLVIEW_DIRECTION_BOTH;
            this._container.setPosition(pZero);
            this._touchLength = 0.0;

            this._minScale = this._maxScale = 1.0;
            return true;
        }
        return false;
    }

    visit(parent) {
        var cmd = this._renderCmd, parentCmd = parent ? parent._renderCmd : null;

        if (!this._visible) {
            cmd._propagateFlagsDown(parentCmd);
            return;
        }

        var renderer = RendererConfig.getInstance().renderer;
        cmd.visit(parentCmd);

        if (this._clippingToBounds) {
            renderer.pushRenderCommand(cmd.startCmd);
        }

        var i, children = this._children, len = children.length;
        if (len > 0) {
            if (this._reorderChildDirty) {
                this.sortAllChildren();
            }
            for (i = 0; i < len; i++) {
                children[i].visit(this);
            }
        }

        if (this._clippingToBounds) {
            renderer.pushRenderCommand(cmd.endCmd);
        }
        cmd._dirtyFlag = 0;
    }

    setContentOffset(offset, animated) {
        if (animated) {
            this.setContentOffsetInDuration(offset, BOUNCE_DURATION);
            return;
        }
        if (!this._bounceable) {
            var minOffset = this.minContainerOffset();
            var maxOffset = this.maxContainerOffset();

            offset.x = Math.max(minOffset.x, Math.min(maxOffset.x, offset.x));
            offset.y = Math.max(minOffset.y, Math.min(maxOffset.y, offset.y));
        }

        this._container.setPosition(offset);
        var locDelegate = this._delegate;
        if (locDelegate != null && locDelegate.scrollViewDidScroll) {
            locDelegate.scrollViewDidScroll(this);
        }
    }

    getContentOffset() {
        var locPos = this._container.getPosition();
        return new Point(locPos.x, locPos.y);
    }

    setContentOffsetInDuration(offset, dt) {
        var scroll = new MoveTo(dt, offset);
        var expire = new CallFunc(this._stoppedAnimatedScroll, this);
        this._container.runAction(sequence(scroll, expire));
        this.schedule(this._performedAnimatedScroll);
    }

    setZoomScale(scale, animated) {
        if (animated) {
            this.setZoomScaleInDuration(scale, BOUNCE_DURATION);
            return;
        }

        var locContainer = this._container;
        if (locContainer.getScale() !== scale) {
            var oldCenter, newCenter;
            var center;

            if (this._touchLength === 0.0) {
                var locViewSize = this._viewSize;
                center = new Point(locViewSize.width * 0.5, locViewSize.height * 0.5);
                center = this.convertToWorldSpace(center);
            } else
                center = this._touchPoint;

            oldCenter = locContainer.convertToNodeSpace(center);
            locContainer.setScale(Math.max(this._minScale, Math.min(this._maxScale, scale)));
            newCenter = locContainer.convertToWorldSpace(oldCenter);

            var offset = Point.sub(center, newCenter);
            if (this._delegate && this._delegate.scrollViewDidZoom)
                this._delegate.scrollViewDidZoom(this);
            this.setContentOffset(Point.add(locContainer.getPosition(), offset));
        }
    }

    getZoomScale() {
        return this._container.getScale();
    }

    setZoomScaleInDuration(s, dt) {
        if (dt > 0) {
            var locScale = this._container.getScale();
            if (locScale !== s) {
                var scaleAction = new ActionTween(dt, "zoomScale", locScale, s);
                this.runAction(scaleAction);
            }
        } else {
            this.setZoomScale(s);
        }
    }

    minContainerOffset() {
        var locContainer = this._container;
        var locContentSize = locContainer.getContentSize(), locViewSize = this._viewSize;
        return new Point(locViewSize.width - locContentSize.width * locContainer.getScaleX(),
            locViewSize.height - locContentSize.height * locContainer.getScaleY());
    }

    maxContainerOffset() {
        return new Point(0.0, 0.0);
    }

    isNodeVisible(node) {
        var offset = this.getContentOffset();
        var size = this.getViewSize();
        var scale = this.getZoomScale();

        var viewRect = new Rect(-offset.x / scale, -offset.y / scale, size.width / scale, size.height / scale);

        return Rect.intersects(viewRect, node.getBoundingBox());
    }

    pause(sender) {
        this._container.pause();
        var selChildren = this._container.getChildren();
        for (var i = 0; i < selChildren.length; i++) {
            selChildren[i].pause();
        }
        super.pause();
    }

    resume(sender) {
        var selChildren = this._container.getChildren();
        for (var i = 0, len = selChildren.length; i < len; i++) {
            selChildren[i].resume();
        }
        this._container.resume();
        super.resume();
    }

    isDragging() { return this._dragging; }
    isTouchMoved() { return this._touchMoved; }
    isBounceable() { return this._bounceable; }
    setBounceable(bounceable) { this._bounceable = bounceable; }

    getViewSize() { return this._viewSize; }

    setViewSize(size) {
        this._viewSize = size;
        Node.prototype.setContentSize.call(this, size);
    }

    getContainer() { return this._container; }

    setContainer(container) {
        if (!container)
            return;

        this.removeAllChildren(true);

        this._container = container;
        container.ignoreAnchorPointForPosition(false);
        container.setAnchorPoint(0, 0);

        this.addChild(container);
        this.setViewSize(this._viewSize);
    }

    getDirection() { return this._direction; }
    setDirection(direction) { this._direction = direction; }

    getDelegate() { return this._delegate; }
    setDelegate(delegate) { this._delegate = delegate; }

    onTouchBegan(touch, event) {
        for (var c = this; c != null; c = c.parent) {
            if (!c.isVisible())
                return false;
        }

        var frame = this._getViewRect();

        var locContainer = this._container;
        var locPoint = locContainer.convertToWorldSpace(locContainer.convertTouchToNodeSpace(touch));
        var locTouches = this._touches;
        if (locTouches.length > 2 || this._touchMoved || !Rect.containsPoint(frame, locPoint))
            return false;

        locTouches.push(touch);

        if (locTouches.length === 1) {
            this._touchPoint = this.convertTouchToNodeSpace(touch);
            this._touchMoved = false;
            this._dragging = true;
            this._scrollDistance.x = 0;
            this._scrollDistance.y = 0;
            this._touchLength = 0.0;
        } else if (locTouches.length === 2) {
            this._touchPoint = Point.midpoint(this.convertTouchToNodeSpace(locTouches[0]),
                this.convertTouchToNodeSpace(locTouches[1]));
            this._touchLength = Point.distance(locContainer.convertTouchToNodeSpace(locTouches[0]),
                locContainer.convertTouchToNodeSpace(locTouches[1]));
            this._dragging = false;
        }
        return true;
    }

    onTouchMoved(touch, event) {
        if (!this.isVisible())
            return;

        this.setNodeDirty();

        if (this._touches.length === 1 && this._dragging) {
            this._touchMoved = true;
            var frame = this._getViewRect();

            var newPoint = this.convertTouchToNodeSpace(touch);
            var moveDistance = Point.sub(newPoint, this._touchPoint);

            var dis = 0.0, locDirection = this._direction, pos;
            if (locDirection === SCROLLVIEW_DIRECTION_VERTICAL) {
                dis = moveDistance.y;
                pos = this._container.getPositionY();
                if (!(this.minContainerOffset().y <= pos && pos <= this.maxContainerOffset().y))
                    moveDistance.y *= BOUNCE_BACK_FACTOR;
            } else if (locDirection === SCROLLVIEW_DIRECTION_HORIZONTAL) {
                dis = moveDistance.x;
                pos = this._container.getPositionX();
                if (!(this.minContainerOffset().x <= pos && pos <= this.maxContainerOffset().x))
                    moveDistance.x *= BOUNCE_BACK_FACTOR;
            } else {
                dis = Math.sqrt(moveDistance.x * moveDistance.x + moveDistance.y * moveDistance.y);

                pos = this._container.getPositionY();
                var _minOffset = this.minContainerOffset(), _maxOffset = this.maxContainerOffset();
                if (!(_minOffset.y <= pos && pos <= _maxOffset.y))
                    moveDistance.y *= BOUNCE_BACK_FACTOR;

                pos = this._container.getPositionX();
                if (!(_minOffset.x <= pos && pos <= _maxOffset.x))
                    moveDistance.x *= BOUNCE_BACK_FACTOR;
            }

            if (!this._touchMoved && Math.abs(convertDistanceFromPointToInch(dis)) < MOVE_INCH) {
                return;
            }

            if (!this._touchMoved) {
                moveDistance.x = 0;
                moveDistance.y = 0;
            }

            this._touchPoint = newPoint;
            this._touchMoved = true;

            if (this._dragging) {
                switch (locDirection) {
                    case SCROLLVIEW_DIRECTION_VERTICAL:
                        moveDistance.x = 0.0;
                        break;
                    case SCROLLVIEW_DIRECTION_HORIZONTAL:
                        moveDistance.y = 0.0;
                        break;
                    default:
                        break;
                }

                var locPosition = this._container.getPosition();
                var newX = locPosition.x + moveDistance.x;
                var newY = locPosition.y + moveDistance.y;

                this._scrollDistance = moveDistance;
                this.setContentOffset(new Point(newX, newY));
            }
        } else if (this._touches.length === 2 && !this._dragging) {
            var len = Point.distance(this._container.convertTouchToNodeSpace(this._touches[0]),
                this._container.convertTouchToNodeSpace(this._touches[1]));
            this.setZoomScale(this.getZoomScale() * len / this._touchLength);
        }
    }

    onTouchEnded(touch, event) {
        if (!this.isVisible())
            return;

        if (this._touches.length === 1 && this._touchMoved)
            this.schedule(this._deaccelerateScrolling);

        this._touches.length = 0;
        this._dragging = false;
        this._touchMoved = false;
    }

    onTouchCancelled(touch, event) {
        if (!this.isVisible())
            return;

        this._touches.length = 0;
        this._dragging = false;
        this._touchMoved = false;
    }

    setContentSize(size, height) {
        var container = this.getContainer();
        if (container) {
            if (height === undefined)
                container.setContentSize(size);
            else
                container.setContentSize(size, height);
            this.updateInset();
        }
    }

    _setWidth(value) {
        var container = this.getContainer();
        if (container) {
            container._setWidth(value);
            this.updateInset();
        }
    }

    _setHeight(value) {
        var container = this.getContainer();
        if (container) {
            container._setHeight(value);
            this.updateInset();
        }
    }

    getContentSize() {
        if (this._container)
            return this._container.getContentSize();
        return new Size(0, 0);
    }

    updateInset() {
        if (this.getContainer()) {
            var locViewSize = this._viewSize;
            var tempOffset = this.maxContainerOffset();
            this._maxInset.x = tempOffset.x + locViewSize.width * INSET_RATIO;
            this._maxInset.y = tempOffset.y + locViewSize.height * INSET_RATIO;
            tempOffset = this.minContainerOffset();
            this._minInset.x = tempOffset.x - locViewSize.width * INSET_RATIO;
            this._minInset.y = tempOffset.y - locViewSize.height * INSET_RATIO;
        }
    }

    isClippingToBounds() { return this._clippingToBounds; }
    setClippingToBounds(clippingToBounds) { this._clippingToBounds = clippingToBounds; }

    addChild(child, zOrder, tag) {
        if (!child)
            throw new Error("child must not nil!");

        zOrder = zOrder || child.getLocalZOrder();
        tag = tag || child.getTag();

        if (this._container !== child) {
            this._container.addChild(child, zOrder, tag);
        } else {
            super.addChild(child, zOrder, tag);
        }
    }

    isTouchEnabled() { return this._touchListener !== null; }

    setTouchEnabled(e) {
        if (this._touchListener)
            EventManager.getInstance().removeListener(this._touchListener);
        this._touchListener = null;
        if (!e) {
            this._dragging = false;
            this._touchMoved = false;
            this._touches.length = 0;
        } else {
            var listener = EventListener.create({
                event: EventListener.TOUCH_ONE_BY_ONE
            });
            if (this.onTouchBegan)
                listener.onTouchBegan = this.onTouchBegan.bind(this);
            if (this.onTouchMoved)
                listener.onTouchMoved = this.onTouchMoved.bind(this);
            if (this.onTouchEnded)
                listener.onTouchEnded = this.onTouchEnded.bind(this);
            if (this.onTouchCancelled)
                listener.onTouchCancelled = this.onTouchCancelled.bind(this);
            this._touchListener = listener;
            EventManager.getInstance().addListener(listener, this);
        }
    }

    _initWithViewSize(size) {
        return null;
    }

    _relocateContainer(animated) {
        var min = this.minContainerOffset();
        var max = this.maxContainerOffset();
        var locDirection = this._direction;

        var oldPoint = this._container.getPosition();
        var newX = oldPoint.x;
        var newY = oldPoint.y;
        if (locDirection === SCROLLVIEW_DIRECTION_BOTH || locDirection === SCROLLVIEW_DIRECTION_HORIZONTAL) {
            newX = Math.max(newX, min.x);
            newX = Math.min(newX, max.x);
        }

        if (locDirection === SCROLLVIEW_DIRECTION_BOTH || locDirection === SCROLLVIEW_DIRECTION_VERTICAL) {
            newY = Math.min(newY, max.y);
            newY = Math.max(newY, min.y);
        }

        if (newY !== oldPoint.y || newX !== oldPoint.x) {
            this.setContentOffset(new Point(newX, newY), animated);
        }
    }

    _deaccelerateScrolling(dt) {
        if (this._dragging) {
            this.unschedule(this._deaccelerateScrolling);
            return;
        }

        var maxInset, minInset;
        var oldPosition = this._container.getPosition();
        var locScrollDistance = this._scrollDistance;
        this._container.setPosition(oldPosition.x + locScrollDistance.x, oldPosition.y + locScrollDistance.y);
        if (this._bounceable) {
            maxInset = this._maxInset;
            minInset = this._minInset;
        } else {
            maxInset = this.maxContainerOffset();
            minInset = this.minContainerOffset();
        }

        var newX = this._container.getPositionX();
        var newY = this._container.getPositionY();

        locScrollDistance.x = locScrollDistance.x * SCROLL_DEACCEL_RATE;
        locScrollDistance.y = locScrollDistance.y * SCROLL_DEACCEL_RATE;

        this.setContentOffset(new Point(newX, newY));

        if ((Math.abs(locScrollDistance.x) <= SCROLL_DEACCEL_DIST &&
            Math.abs(locScrollDistance.y) <= SCROLL_DEACCEL_DIST) ||
            newY > maxInset.y || newY < minInset.y ||
            newX > maxInset.x || newX < minInset.x ||
            newX === maxInset.x || newX === minInset.x ||
            newY === maxInset.y || newY === minInset.y) {
            this.unschedule(this._deaccelerateScrolling);
            this._relocateContainer(true);
        }
    }

    _performedAnimatedScroll(dt) {
        if (this._dragging) {
            this.unschedule(this._performedAnimatedScroll);
            return;
        }

        if (this._delegate && this._delegate.scrollViewDidScroll)
            this._delegate.scrollViewDidScroll(this);
    }

    _stoppedAnimatedScroll(node) {
        this.unschedule(this._performedAnimatedScroll);
        if (this._delegate && this._delegate.scrollViewDidScroll) {
            this._delegate.scrollViewDidScroll(this);
        }
    }

    _handleZoom() {}

    _getViewRect() {
        var screenPos = this.convertToWorldSpace(new Point(0, 0));
        var locViewSize = this._viewSize;

        var scaleX = this.getScaleX();
        var scaleY = this.getScaleY();

        for (var p = this._parent; p != null; p = p.getParent()) {
            scaleX *= p.getScaleX();
            scaleY *= p.getScaleY();
        }

        if (scaleX < 0) {
            screenPos.x += locViewSize.width * scaleX;
            scaleX = -scaleX;
        }
        if (scaleY < 0) {
            screenPos.y += locViewSize.height * scaleY;
            scaleY = -scaleY;
        }

        var locViewRect = this._tmpViewRect;
        locViewRect.x = screenPos.x;
        locViewRect.y = screenPos.y;
        locViewRect.width = locViewSize.width * scaleX;
        locViewRect.height = locViewSize.height * scaleY;
        return locViewRect;
    }

    _createRenderCmd() {
        if (RendererConfig.getInstance().isCanvas) {
            return new this.constructor.CanvasRenderCmd(this);
        } else {
            return new this.constructor.WebGLRenderCmd(this);
        }
    }
}
