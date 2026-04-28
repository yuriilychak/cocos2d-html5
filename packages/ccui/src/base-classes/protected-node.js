import { Node, RendererConfig } from '@aspect/core';

export class ProtectedNode extends Node {
    _insertProtectedChild(child, z) {
      this._reorderProtectedChildDirty = true;
      this._protectedChildren.push(child);
      child._setLocalZOrder(z);
    }

    constructor() {
      super();
      this._protectedChildren = [];
      this._reorderProtectedChildDirty = false;
    }

    visit(parent) {
      var cmd = this._renderCmd,
        parentCmd = parent ? parent._renderCmd : null;

      if (!this._visible) {
        cmd._propagateFlagsDown(parentCmd);
        return;
      }

      var renderer = RendererConfig.getInstance().renderer;
      var i,
        children = this._children,
        len = children.length,
        child;
      var j,
        pChildren = this._protectedChildren,
        pLen = pChildren.length,
        pChild;

      cmd.visit(parentCmd);

      var locGrid = this.grid;
      if (locGrid && locGrid._active) locGrid.beforeDraw();

      if (this._reorderChildDirty) this.sortAllChildren();
      if (this._reorderProtectedChildDirty) this.sortAllProtectedChildren();

      for (i = 0; i < len; i++) {
        child = children[i];
        if (child._localZOrder < 0) {
          child.visit(this);
        } else {
          break;
        }
      }
      for (j = 0; j < pLen; j++) {
        pChild = pChildren[j];
        if (pChild && pChild._localZOrder < 0) {
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
      cc.assert(child != null, "child must be non-nil");
      cc.assert(!child.parent, "child already added. It can't be added again");

      localZOrder = localZOrder || child.getLocalZOrder();
      if (tag) child.setTag(tag);

      this._insertProtectedChild(child, localZOrder);
      child.setParent(this);
      child.setOrderOfArrival(cc.s_globalOrderOfArrival);

      if (this._running) {
        child._performRecursive(Node._stateCallbackType.onEnter);
        if (this._isTransitionFinished)
          child._performRecursive(
            Node._stateCallbackType.onEnterTransitionDidFinish
          );
      }
      if (this._cascadeColorEnabled)
        this._renderCmd.setCascadeColorEnabledDirty();
      if (this._cascadeOpacityEnabled)
        this._renderCmd.setCascadeOpacityEnabledDirty();
    }

    getProtectedChildByTag(tag) {
      cc.assert(tag !== cc.NODE_TAG_INVALID, "Invalid tag");
      var locChildren = this._protectedChildren;
      for (var i = 0, len = locChildren.length; i < len; i++)
        if (locChildren.getTag() === tag) return locChildren[i];
      return null;
    }

    removeProtectedChild(child, cleanup) {
      if (cleanup == null) cleanup = true;
      var locChildren = this._protectedChildren;
      if (locChildren.length === 0) return;
      var idx = locChildren.indexOf(child);
      if (idx > -1) {
        if (this._running) {
          child._performRecursive(
            Node._stateCallbackType.onExitTransitionDidStart
          );
          child._performRecursive(Node._stateCallbackType.onExit);
        }

        if (cleanup)
          child._performRecursive(Node._stateCallbackType.cleanup);

        child.setParent(null);
        locChildren.splice(idx, 1);
      }
    }

    removeProtectedChildByTag(tag, cleanup) {
      cc.assert(tag !== cc.NODE_TAG_INVALID, "Invalid tag");

      if (cleanup == null) cleanup = true;

      var child = this.getProtectedChildByTag(tag);

      if (child == null)
        cc.log("cocos2d: removeChildByTag(tag = %d): child not found!", tag);
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
        if (this._running) {
          child._performRecursive(
            Node._stateCallbackType.onExitTransitionDidStart
          );
          child._performRecursive(Node._stateCallbackType.onExit);
        }

        if (cleanup)
          child._performRecursive(Node._stateCallbackType.cleanup);
        child.setParent(null);
      }
      locChildren.length = 0;
    }

    reorderProtectedChild(child, localZOrder) {
      cc.assert(child != null, "Child must be non-nil");
      this._reorderProtectedChildDirty = true;
      child.setOrderOfArrival(cc.s_globalOrderOfArrival++);
      child._setLocalZOrder(localZOrder);
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
            if (tmp._localZOrder < _children[j]._localZOrder) {
              _children[j + 1] = _children[j];
            } else if (
              tmp._localZOrder === _children[j]._localZOrder &&
              tmp.arrivalOrder < _children[j].arrivalOrder
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

    _createRenderCmd() {
      if (RendererConfig.getInstance().isCanvas)
        return new this.constructor.CanvasRenderCmd(this);
      else return new this.constructor.WebGLRenderCmd(this);
    }
}
