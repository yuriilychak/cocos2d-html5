import { Layer, Node, Color, Rect, EventListener, EventListenerType, arrayRemoveObject, ServiceLocator } from "@aspect/core";
import { Invocation } from "./invocation";
import {
  CONTROL_STATE_NORMAL,
  CONTROL_STATE_DISABLED,
  CONTROL_EVENT_TOTAL_NUMBER
} from "./constants";

export class Control extends Layer {
  #isOpacityModifyRGB = false;
  _hasVisibleParents = false;
  _touchListener = null;
  _className = "Control";

  _state = CONTROL_STATE_NORMAL;
  _enabled = false;
  _selected = false;
  _highlighted = false;
  _dispatchTable = null;

  static addSpriteToTargetWithPosAndAnchor(sprite, target, pos, anchor) {
    sprite.setPosition(pos.x, pos.y);
    sprite.setAnchorPoint(anchor.x, anchor.y);
    target.addChild(sprite);
    return sprite;
  }

  hasVisibleParents() {
    var parent = this.parent;
    for (var c = parent; c != null; c = c.parent) {
      if (!c.visible) return false;
    }
    return true;
  }

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
      event: EventListenerType.TOUCH_ONE_BY_ONE,
      swallowTouches: true
    });
    if (this.onTouchBegan) listener.onTouchBegan = this.onTouchBegan.bind(this);
    if (this.onTouchMoved) listener.onTouchMoved = this.onTouchMoved.bind(this);
    if (this.onTouchEnded) listener.onTouchEnded = this.onTouchEnded.bind(this);
    if (this.onTouchCancelled)
      listener.onTouchCancelled = this.onTouchCancelled.bind(this);
    this._touchListener = listener;
    return true;
  }

  onEnter() {
    var locListener = this._touchListener;
    if (!locListener._isRegistered())
      ServiceLocator.eventManager.addListener(locListener, this);
    Node.prototype.onEnter.call(this);
  }

  sendActionsForControlEvents(controlEvents) {
    for (var i = 0, len = CONTROL_EVENT_TOTAL_NUMBER; i < len; i++) {
      if (controlEvents & (1 << i)) {
        var invocationList = this._dispatchListforControlEvent(1 << i);
        for (var j = 0, inLen = invocationList.length; j < inLen; j++) {
          invocationList[j].invoke(this);
        }
      }
    }
  }

  addTargetWithActionForControlEvents(target, action, controlEvents) {
    for (let i = 0, len = CONTROL_EVENT_TOTAL_NUMBER; i < len; i++) {
      if (controlEvents & (1 << i))
        this._addTargetWithActionForControlEvent(target, action, 1 << i);
    }
  }

  removeTargetWithActionForControlEvents(target, action, controlEvents) {
    for (let i = 0, len = CONTROL_EVENT_TOTAL_NUMBER; i < len; i++) {
      if (controlEvents & (1 << i))
        this._removeTargetWithActionForControlEvent(target, action, 1 << i);
    }
  }

  getTouchLocation(touch) {
    return this.convertToNodeSpace(touch);
  }

  isTouchInside(touch) {
    const touchLocation = this.parent.convertToNodeSpace(touch);
    return Rect.containsPoint(this.boundingBox, touchLocation);
  }

  _invocationWithTargetAndActionForControlEvent(target, action, controlEvent) {
    return null;
  }

  _dispatchListforControlEvent(controlEvent) {
    controlEvent = controlEvent.toString();
    if (!this._dispatchTable[controlEvent]) {
      this._dispatchTable[controlEvent] = [];
    }

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
      for (let i = 0; i < eventInvocationList.length; ) {
        var invocation = eventInvocationList[i];
        var shouldBeRemoved = true;
        if (target) {
            shouldBeRemoved = target === invocation.target;
        }
        if (action) {
          shouldBeRemoved = shouldBeRemoved && action === invocation.action;
        }
        if (shouldBeRemoved) {
            arrayRemoveObject(eventInvocationList, invocation);
        } else {
            i++;
        }
      }
    }
  }

  needsLayout() {}

  get isOpacityModifyRGB() {
    return this.#isOpacityModifyRGB;
  }

  set isOpacityModifyRGB(value) {
    this.#isOpacityModifyRGB = value;
    var children = this.getChildren();
    for (var i = 0, len = children.length; i < len; i++) {
      var selNode = children[i];
      if (selNode && Object.hasOwnProperty(selNode, "isOpacityModifyRGB")) {
        selNode.isOpacityModifyRGB = value;
      }
    }
  }

  getState() {
    return this._state;
  }

  get state() {
    return this._state;
  }

  set enabled(value) {
    this._enabled = value;
    this._state = value ? CONTROL_STATE_NORMAL : CONTROL_STATE_DISABLED;
    this.needsLayout();
  }

  get enabled() {
    return this._enabled;
  }

  setSelected(value) {
    this._selected = value;
    this.needsLayout();
  }

  isSelected() {
    return this._selected;
  }

  set selected(value) {
    this.setSelected(value);
  }

  get selected() {
    return this._selected;
  }

  setHighlighted(value) {
    this._highlighted = value;
    this.needsLayout();
  }

  isHighlighted() {
    return this._highlighted;
  }

  set highlighted(value) {
    this.setHighlighted(value);
  }

  get highlighted() {
    return this._highlighted;
  }
}
