import {
    Layer, Node, Color, Rect, EventListener, EventManager, arrayRemoveObject
} from "@aspect/core";
import { Invocation } from "./invocation";
import {
    CONTROL_STATE_NORMAL,
    CONTROL_STATE_DISABLED,
    CONTROL_EVENT_TOUCH_DOWN,
    CONTROL_EVENT_VALUE_CHANGED,
    CONTROL_ZOOM_ACTION_TAG
} from "./constants";

const CONTROL_EVENT_TOTAL_NUMBER = 9;

export class Control extends Layer {
    _isOpacityModifyRGB = false;
    _hasVisibleParents = false;
    _touchListener = null;
    _className = "Control";

    _state = CONTROL_STATE_NORMAL;
    _enabled = false;
    _selected = false;
    _highlighted = false;
    _dispatchTable = null;

    isOpacityModifyRGB() {
        return this._isOpacityModifyRGB;
    }

    setOpacityModifyRGB(opacityModifyRGB) {
        this._isOpacityModifyRGB = opacityModifyRGB;
        var children = this.getChildren();
        for (var i = 0, len = children.length; i < len; i++) {
            var selNode = children[i];
            if (selNode)
                selNode.setOpacityModifyRGB(opacityModifyRGB);
        }
    }

    getState() {
        return this._state;
    }

    setEnabled(enabled) {
        this._enabled = enabled;
        this._state = enabled ? CONTROL_STATE_NORMAL : CONTROL_STATE_DISABLED;
        this.needsLayout();
    }

    isEnabled() {
        return this._enabled;
    }

    setSelected(selected) {
        this._selected = selected;
        this.needsLayout();
    }

    isSelected() {
        return this._selected;
    }

    setHighlighted(highlighted) {
        this._highlighted = highlighted;
        this.needsLayout();
    }

    isHighlighted() {
        return this._highlighted;
    }

    hasVisibleParents() {
        var parent = this.getParent();
        for (var c = parent; c != null; c = c.getParent()) {
            if (!c.isVisible())
                return false;
        }
        return true;
    }

    get state() { return this.getState(); }
    get enabled() { return this.isEnabled(); }
    set enabled(v) { this.setEnabled(v); }
    get selected() { return this.isSelected(); }
    set selected(v) { this.setSelected(v); }
    get highlighted() { return this.isHighlighted(); }
    set highlighted(v) { this.setHighlighted(v); }

    constructor() {
        super();
        this._dispatchTable = {};
        this._color = Color.WHITE;
    }

    init() {
        this._state = CONTROL_STATE_NORMAL;
        this._enabled = true;
        this._selected = false;
        this._highlighted = false;

        var listener = EventListener.create({
            event: EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true
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
        return true;
    }

    onEnter() {
        var locListener = this._touchListener;
        if (!locListener._isRegistered())
            EventManager.getInstance().addListener(locListener, this);
        Node.prototype.onEnter.call(this);
    }

    sendActionsForControlEvents(controlEvents) {
        for (var i = 0, len = CONTROL_EVENT_TOTAL_NUMBER; i < len; i++) {
            if ((controlEvents & (1 << i))) {
                var invocationList = this._dispatchListforControlEvent(1 << i);
                for (var j = 0, inLen = invocationList.length; j < inLen; j++) {
                    invocationList[j].invoke(this);
                }
            }
        }
    }

    addTargetWithActionForControlEvents(target, action, controlEvents) {
        for (var i = 0, len = CONTROL_EVENT_TOTAL_NUMBER; i < len; i++) {
            if ((controlEvents & (1 << i)))
                this._addTargetWithActionForControlEvent(target, action, 1 << i);
        }
    }

    removeTargetWithActionForControlEvents(target, action, controlEvents) {
        for (var i = 0, len = CONTROL_EVENT_TOTAL_NUMBER; i < len; i++) {
            if ((controlEvents & (1 << i)))
                this._removeTargetWithActionForControlEvent(target, action, 1 << i);
        }
    }

    getTouchLocation(touch) {
        var touchLocation = touch.getLocation();
        return this.convertToNodeSpace(touchLocation);
    }

    isTouchInside(touch) {
        var touchLocation = touch.getLocation();
        touchLocation = this.getParent().convertToNodeSpace(touchLocation);
        return Rect.containsPoint(this.getBoundingBox(), touchLocation);
    }

    _invocationWithTargetAndActionForControlEvent(target, action, controlEvent) {
        return null;
    }

    _dispatchListforControlEvent(controlEvent) {
        controlEvent = controlEvent.toString();
        if (!this._dispatchTable[controlEvent])
            this._dispatchTable[controlEvent] = [];
        return this._dispatchTable[controlEvent];
    }

    _addTargetWithActionForControlEvent(target, action, controlEvent) {
        var invocation = new Invocation(target, action, controlEvent);
        var eventInvocationList = this._dispatchListforControlEvent(controlEvent);
        eventInvocationList.push(invocation);
    }

    _removeTargetWithActionForControlEvent(target, action, controlEvent) {
        var eventInvocationList = this._dispatchListforControlEvent(controlEvent);
        if (!target && !action) {
            eventInvocationList.length = 0;
        } else {
            for (var i = 0; i < eventInvocationList.length;) {
                var invocation = eventInvocationList[i];
                var shouldBeRemoved = true;
                if (target)
                    shouldBeRemoved = (target === invocation.getTarget());
                if (action)
                    shouldBeRemoved = (shouldBeRemoved && (action === invocation.getAction()));
                if (shouldBeRemoved)
                    arrayRemoveObject(eventInvocationList, invocation);
                else
                    i++;
            }
        }
    }

    needsLayout() {
    }

    static create() {
        var retControl = new Control();
        if (retControl && retControl.init())
            return retControl;
        return null;
    }
}
