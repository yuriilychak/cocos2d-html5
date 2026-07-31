import {
  Node,
  NodeStateCallbackType,
  assert,
  log,
  NODE_TAG_INVALID,
  s_globalOrderOfArrival,
  setGlobalOrderOfArrival,
  ServiceLocator
} from "@aspect/core";

export class ProtectedNode extends Node {
  _insertProtectedChild(child, z) {
    this._reorderProtectedChildDirty = true;
    this._protectedChildren.push(child);
    child.order.localZOrder = z;
  }

  constructor() {
    super();
    this._protectedChildren = [];
    this._reorderProtectedChildDirty = false;
  }

  visit(parent) {
    var cmd = this.renderCmd,
      parentCmd = parent ? parent.renderCmd : null;

    if (!this.visible) {
      cmd._propagateFlagsDown(parentCmd);
      return;
    }

    var renderer = ServiceLocator.sys.rendererConfig.renderer;
    var i,
      children = this.children,
      len = children.length,
      child;
    var j,
      pChildren = this._protectedChildren,
      pLen = pChildren.length,
      pChild;

    cmd.visit(parentCmd);

    var locGrid = this.grid;
    if (locGrid && locGrid._active) locGrid.beforeDraw();

    if (this.order.reorderChildDirty) this.order.sortAllChildren();
    if (this._reorderProtectedChildDirty) this.sortAllProtectedChildren();

    for (i = 0; i < len; i++) {
      child = children[i];
      if (child.order.localZOrder < 0) {
        child.visit(this);
      } else {
        break;
      }
    }
    for (j = 0; j < pLen; j++) {
      pChild = pChildren[j];
      if (pChild && pChild.order.localZOrder < 0) {
        cmd._changeProtectedChild(pChild);
        pChild.visit(this);
      } else break;
    }

    renderer.pushRenderCommand(cmd);

    for (; i < len; i++) {
      children[i].visit(this);
    }
    for (; j < pLen; j++) {
      pChild = pChildren[j];
      if (!pChild) continue;
      cmd._changeProtectedChild(pChild);
      pChild.visit(this);
    }

    if (locGrid && locGrid._active) locGrid.afterDraw(this);

    cmd._dirtyFlag = 0;
  }

  addProtectedChild(child, localZOrder, tag) {
    assert(child != null, "child must be non-nil");
    assert(!child.parent, "child already added. It can't be added again");

    localZOrder = localZOrder || child.order.zIndex;
    if (tag) child.tag = tag;

    this._insertProtectedChild(child, localZOrder);
    child.parent = this;
    child.order.arrivalOrder = s_globalOrderOfArrival;

    if (this.running) {
      child.performRecursive(NodeStateCallbackType.onEnter);
      if (this.transitionFinished)
        child.performRecursive(
          NodeStateCallbackType.onEnterTransitionDidFinish
        );
    }
    if (this.color.cascadeColor)
      this.renderCmd.setCascadeColorEnabledDirty();
    if (this.color.cascadeOpacity)
      this.renderCmd.setCascadeOpacityEnabledDirty();
  }

  getProtectedChildByTag(tag) {
    assert(tag !== NODE_TAG_INVALID, "Invalid tag");
    for (var i = 0, len = locChildren.length; i < len; i++)
      if (locChildren.tag === tag) return locChildren[i];
    return null;
  }

  removeProtectedChild(child, cleanup) {
    if (cleanup == null) cleanup = true;
    var locChildren = this._protectedChildren;
    if (locChildren.length === 0) return;
    var idx = locChildren.indexOf(child);
    if (idx > -1) {
      if (this.running) {
        child.performRecursive(
          NodeStateCallbackType.onExitTransitionDidStart
        );
        child.performRecursive(NodeStateCallbackType.onExit);
      }

      if (cleanup) child.performRecursive(NodeStateCallbackType.cleanup);

      child.parent = null;
      locChildren.splice(idx, 1);
    }
  }

  removeProtectedChildByTag(tag, cleanup) {
    assert(tag !== NODE_TAG_INVALID, "Invalid tag");

    var child = this.getProtectedChildByTag(tag);

    if (child == null)
      log("cocos2d: removeChildByTag(tag = %d): child not found!", tag);
    else this.removeProtectedChild(child, cleanup);
  }

  removeAllProtectedChildren() {
    this.removeAllProtectedChildrenWithCleanup(true);
  }

  removeAllProtectedChildrenWithCleanup(cleanup) {
    if (cleanup == null) cleanup = true;
    var locChildren = this._protectedChildren;
    for (var i = 0, len = locChildren.length; i < len; i++) {
      var child = locChildren[i];
      if (this.running) {
        child.performRecursive(
          NodeStateCallbackType.onExitTransitionDidStart
        );
        child.performRecursive(NodeStateCallbackType.onExit);
      }

      if (cleanup) child.performRecursive(NodeStateCallbackType.cleanup);
      child.parent = null;
    }
    locChildren.length = 0;
  }

  reorderProtectedChild(child, localZOrder) {
    assert(child != null, "Child must be non-nil");
    this._reorderProtectedChildDirty = true;
    child.order.arrivalOrder = s_globalOrderOfArrival;
    setGlobalOrderOfArrival(s_globalOrderOfArrival + 1);
  }

  sortAllProtectedChildren() {
    if (this._reorderProtectedChildDirty) {
      var _children = this._protectedChildren;

      var i,
        j,
        len = _children.length,
        tmp;
      for (i = 1; i < len; i++) {
        tmp = _children[i];
        j = i - 1;

        while (j >= 0) {
          if (tmp.order.localZOrder < _children[j].order.localZOrder) {
            _children[j + 1] = _children[j];
          } else if (
            tmp.order.localZOrder === _children[j].order.localZOrder &&
            tmp.order.arrivalOrder < _children[j].order.arrivalOrder
          ) {
            _children[j + 1] = _children[j];
          } else break;
          j--;
        }
        _children[j + 1] = tmp;
      }

      this._reorderProtectedChildDirty = false;
    }
  }

  _changePosition() {}

  createRenderCmd() {
    if (ServiceLocator.sys.rendererConfig.isCanvas)
      return new this.constructor.CanvasRenderCmd(this);
    else return new this.constructor.WebGLRenderCmd(this);
  }
}
