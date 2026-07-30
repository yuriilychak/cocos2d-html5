/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
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

import { dirtyFlags } from "./node-canvas-render-cmd";
import { Point, Rect, AffineTransform } from "../geometry";
import { log, assert, _LogInfos } from "../boot/debugger";
import { arrayRemoveObject } from "../platform/macro/utils";
import { ComponentContainer } from "../components";
import Touch from "../event-manager/touch";
import { CanvasRenderCmd as NodeCanvasRenderCmd } from "./node-canvas-render-cmd";
import { WebGLRenderCmd as NodeWebGLRenderCmd } from "./node-webgl-render-cmd";
import { NodeTransform } from "./node-transform";
import { NodeColor } from "./node-color";
import { NodeOrder } from "./node-order";
import { NodeScheduler } from "./node-scheduler";
import { NodeActionManager } from "./node-action-manager";
import { ServiceLocator } from "../service-locator";

/**
 * Default Node tag
 * @constant
 * @type Number
 */
export const NODE_TAG_INVALID = -1;

/**
 * XXX: Yes, nodes might have a sort problem once every 15 days if the game runs at 60 FPS and each frame sprites are reordered.
 */
export let s_globalOrderOfArrival = 1;

export function setGlobalOrderOfArrival(val) {
  s_globalOrderOfArrival = val;
}

/**
 * <p>Node is the root class of all node. Anything that gets drawn or contains things that get drawn is a Node.<br/>
 * The most popular Nodes are: Scene, Layer, Sprite, Menu.</p>
 *
 * <p>The main features of a Node are: <br/>
 * - They can contain other Node nodes (addChild, getChildByTag, removeChild, etc) <br/>
 * - They can schedule periodic callback (schedule, unschedule, etc) <br/>
 * - They can execute actions (runAction, stopAction, etc) <br/></p>
 *
 * <p>Some Node nodes provide extra functionality for them or their children.</p>
 *
 * <p>Subclassing a Node usually means (one/all) of: <br/>
 * - overriding constructor function "ctor" to initialize resources and schedule callbacks<br/>
 * - create callbacks to handle the advancement of time<br/></p>
 *
 * <p>Features of Node: <br/>
 * - position  <br/>
 * - scale (x, y) <br/>
 * - rotation (in degrees, clockwise)<br/>
 * - anchor point<br/>
 * - size <br/>
 * - color <br/>
 * - opacity <br/>
 * - visible<br/>
 * - z-order<br/>
 * - WebGL z position<br/></P>
 *
 * <p> Default values: <br/>
 * - rotation: 0 <br/>
 * - position: (x=0,y=0) <br/>
 * - scale: (x=1,y=1) <br/>
 * - contentSize: (x=0,y=0)<br/>
 * - anchorPoint: (x=0,y=0)<br/>
 * - color: (r=BYTE,g=BYTE,b=BYTE)<br/>
 * - opacity: BYTE</p>
 *
 * <p> Limitations:<br/>
 * - A Node is a "void" object. It doesn't have a texture <br/></P>
 *
 * <p>Order in transformations with grid disabled <br/>
 * -# The node will be translated (position)  <br/>
 * -# The node will be rotated (rotation)<br/>
 * -# The node will be scaled (scale)  <br/>
 *
 * <p>Order in transformations with grid enabled<br/>
 * -# The node will be translated (position)<br/>
 * -# The node will be rotated (rotation) <br/>
 * -# The node will be scaled (scale) <br/>
 * -# The grid will capture the screen <br/>
 * -# The grid will render the captured screen <br/></P>
 *
 *
 * @property {Number}               x                   - x axis position of node
 * @property {Number}               y                   - y axis position of node
 * @property {Number}               width               - Width of node
 * @property {Number}               height              - Height of node
 * @property {Number}               anchorX             - Anchor point's position on x axis
 * @property {Number}               anchorY             - Anchor point's position on y axis
 * @property {Boolean}              ignoreAnchor        - Indicate whether ignore the anchor point property for positioning
 * @property {Number}               skewX               - Skew x
 * @property {Number}               skewY               - Skew y
 * @property {Number}               zIndex              - Z order in depth which stands for the drawing order
 * @property {Number}               vertexZ             - WebGL Z vertex of this node, z order works OK if all the nodes uses the same openGL Z vertex
 * @property {Number}               rotation            - Rotation of node
 * @property {Number}               rotationX           - Rotation on x axis
 * @property {Number}               rotationY           - Rotation on y axis
 * @property {Number}               scale               - Scale of node
 * @property {Number}               scaleX              - Scale on x axis
 * @property {Number}               scaleY              - Scale on y axis
 * @property {Boolean}              visible             - Indicate whether node is visible or not
 * @property {Color}             color               - Color of node, default value is white: (BYTE, BYTE, BYTE)
 * @property {Boolean}              cascadeColor        - Indicate whether node's color value affect its child nodes, default value is false
 * @property {Number}               opacity             - Opacity of node, default value is BYTE
 * @property {Boolean}              opacityModifyRGB    - Indicate whether opacity affect the color value, default value is false
 * @property {Boolean}              cascadeOpacity      - Indicate whether node's opacity value affect its child nodes, default value is false
 * @property {Array}                children            - <@readonly> All children nodes
 * @property {Number}               childrenCount       - <@readonly> Number of children
 * @property {Node}              parent              - Parent node
 * @property {Boolean}              running             - <@readonly> Indicate whether node is running or not
 * @property {Number}               tag                 - Tag of node
 * @property {Object}               userData            - Custom user data
 * @property {Number}               arrivalOrder        - The arrival order, indicates which children is added previously
 * @property {ActionManager}     actionManager       - The ActionManager object that is used by all actions.
 * @property {Scheduler}         scheduler           - Scheduler used to schedule all "updates" and timers.
 * @property {GridBase}          grid                - grid object that is used when applying effects
 * @property {GLProgram}         shaderProgram       - The shader program currently used for this node
 * @property {Number}               glServerState       - The state of OpenGL server side
 */
export class Node extends ComponentContainer {
  #tag = NODE_TAG_INVALID;
  #userData = null;

  #visible = true;
  #parent = null;
  #running = false;
  #actionManager = new NodeActionManager();
  #reorderChildDirty = false;

  #scheduler = new NodeScheduler();
  #name = "";

  #transitionFinished = false;
  #renderCmd;
  #transform;
  #color;
  #order;
  #children = [];

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @function
   */
  constructor() {
    super();
    this.addComponent(this.#scheduler);
    this.addComponent(this.#actionManager);
    this.renderCmd = this.createRenderCmd();
  }

  /**
   * Initializes the instance of Node
   * @function
   * @returns {boolean} Whether the initialization was successful.
   */
  init() {
    return true;
  }

  /**
   * <p>Properties configuration function </br>
   * All properties in attrs will be set to the node, </br>
   * when the setter of the node is available, </br>
   * the property will be set via setter function.</br>
   * </p>
   * @function
   * @param {Object} attrs Properties to be set to node
   */
  attr(attrs) {
    for (var key in attrs) {
      this[key] = attrs[key];
    }
  }

  /**
   * Stops all running actions and schedulers
   * @function
   */
  cleanup() {
    // actions
    this.stopAllActions();
    this.#scheduler.unscheduleAllCallbacks();

    // event
    ServiceLocator.eventManager.removeListeners(this);
  }

  // composition: GET
  /**
   * Returns a child from the container given its tag
   * @function
   * @param {Number} aTag An identifier to find the child node.
   * @return {Node} a Node object whose tag equals to the input parameter
   */
  getChildByTag(aTag) {
    if (this.#children !== null) {
      for (var i = 0; i < this.#children.length; ++i) {
        var node = this.#children[i];
        if (node && node.tag === aTag) {
          return node;
        }
      }
    }
    return null;
  }

  /**
   * Returns a child from the container given its name
   * @function
   * @param {String} name A name to find the child node.
   * @return {Node} a Node object whose name equals to the input parameter
   */
  getChildByName(name) {
    if (!name) {
      log("Invalid name");
      return null;
    }

    var locChildren = this.#children;
    for (var i = 0, len = locChildren.length; i < len; i++) {
      if (locChildren[i].name === name) return locChildren[i];
    }
    return null;
  }

  // composition: ADD

  /** <p>"add" logic MUST only be in this method <br/> </p>
   *
   * <p>If the child is added to a 'running' node, then 'onEnter' and 'onEnterTransitionDidFinish' will be called immediately.</p>
   * @function
   * @param {Node} child  A child node
   * @param {Number} [localZOrder=]  Z order for drawing priority. Please refer to setZOrder(int)
   * @param {Number|String} [tag=]  An integer or a name to identify the node easily. Please refer to tag = int and name = string
   */
  addChild(child, localZOrder, tag) {
    localZOrder = localZOrder === undefined ? child.localZOrder : localZOrder;
    var name,
      setTag = false;
    if (tag === undefined) {
      name = child.name;
    } else if (typeof tag === "string") {
      name = tag;
      tag = undefined;
    } else if (typeof tag === "number") {
      setTag = true;
      name = "";
    }

    assert(child, _LogInfos.Node_addChild_3);
    assert(
      child.parent === null,
      "child already added. It can't be added again"
    );

    this._addChildHelper(child, localZOrder, tag, name, setTag);
  }

  _addChildHelper(child, localZOrder, tag, name, setTag) {
    this._insertChild(child, localZOrder);
    if (setTag) child.tag = tag;
    else child.name = name;

    child.parent = this;
    child.arrivalOrder = s_globalOrderOfArrival;
    setGlobalOrderOfArrival(s_globalOrderOfArrival + 1);

    if (this.#running) {
      child._performRecursive(Node._stateCallbackType.onEnter);
      // prevent onEnterTransitionDidFinish to be called twice when a node is added in onEnter
      if (this.#transitionFinished)
        child._performRecursive(
          Node._stateCallbackType.onEnterTransitionDidFinish
        );
    }
    child.renderCmd.setDirtyFlag(dirtyFlags.transformDirty);
    if (this.cascadeColor) child.renderCmd.setDirtyFlag(dirtyFlags.colorDirty);
    if (this.cascadeOpacity)
      child.renderCmd.setDirtyFlag(dirtyFlags.opacityDirty);
  }

  // composition: REMOVE
  /**
   * Remove itself from its parent node. If cleanup is true, then also remove all actions and callbacks. <br/>
   * If the cleanup parameter is not passed, it will force a cleanup. <br/>
   * If the node orphan, then nothing happens.
   * @function
   * @param {Boolean} [cleanup=true] true if all actions and callbacks on this node should be removed, false otherwise.
   * @see Node#removeFromParentAndCleanup
   */
  removeFromParent(cleanup) {
    if (this.#parent) {
      if (cleanup === undefined) cleanup = true;
      this.#parent.removeChild(this, cleanup);
    }
  }

  /** <p>Removes a child from the container. It will also cleanup all running actions depending on the cleanup parameter. </p>
   * If the cleanup parameter is not passed, it will force a cleanup. <br/>
   * <p> "remove" logic MUST only be on this method  <br/>
   * If a class wants to extend the 'removeChild' behavior it only needs <br/>
   * to override this method </p>
   * @function
   * @param {Node} child  The child node which will be removed.
   * @param {Boolean} [cleanup=true]  true if all running actions and callbacks on the child node will be cleanup, false otherwise.
   */
  removeChild(child, cleanup) {
    // explicit nil handling
    if (this.#children.length === 0) return;

    if (cleanup === undefined) cleanup = true;
    if (this.#children.indexOf(child) > -1) this._detachChild(child, cleanup);

    //this.renderCmd.setDirtyFlag(dirtyFlags.visibleDirty);
    ServiceLocator.sys.rendererConfig.renderer.childrenOrderDirty = true;
  }

  /**
   * Removes a child from the container by tag value. It will also cleanup all running actions depending on the cleanup parameter.
   * If the cleanup parameter is not passed, it will force a cleanup. <br/>
   * @function
   * @param {Number} tag An integer number that identifies a child node
   * @param {Boolean} [cleanup=true] true if all running actions and callbacks on the child node will be cleanup, false otherwise.
   * @see Node#removeChildByTag
   */
  removeChildByTag(tag, cleanup) {
    if (tag === NODE_TAG_INVALID) log(_LogInfos.Node_removeChildByTag);

    var child = this.getChildByTag(tag);
    if (!child) log(_LogInfos.Node_removeChildByTag_2, tag);
    else this.removeChild(child, cleanup);
  }

  /**
   * Removes all children from the container and do a cleanup all running actions depending on the cleanup parameter.
   * @param {Boolean} [cleanup=true]
   */
  removeAllChildrenWithCleanup(cleanup) {
    this.removeAllChildren(cleanup);
  }

  /**
   * Removes all children from the container and do a cleanup all running actions depending on the cleanup parameter. <br/>
   * If the cleanup parameter is not passed, it will force a cleanup. <br/>
   * @function
   * @param {Boolean} [cleanup=true] true if all running actions on all children nodes should be cleanup, false otherwise.
   */
  removeAllChildren(cleanup) {
    // not using detachChild improves speed here
    var __children = this.#children;
    if (__children !== null) {
      if (cleanup === undefined) cleanup = true;
      for (var i = 0; i < __children.length; i++) {
        var node = __children[i];
        if (node) {
          if (this.#running) {
            node._performRecursive(
              Node._stateCallbackType.onExitTransitionDidStart
            );
            node._performRecursive(Node._stateCallbackType.onExit);
          }

          // If you don't do cleanup, the node's actions will not get removed and the
          if (cleanup) node._performRecursive(Node._stateCallbackType.cleanup);

          // set parent nil at the end
          node.parent = null;
          node.renderCmd.detachFromParent();
        }
      }
      this.#children.length = 0;
      ServiceLocator.sys.rendererConfig.renderer.childrenOrderDirty = true;
    }
  }

  _detachChild(child, doCleanup) {
    // IMPORTANT:
    //  -1st do onExit
    //  -2nd cleanup
    if (this.#running) {
      child._performRecursive(Node._stateCallbackType.onExitTransitionDidStart);
      child._performRecursive(Node._stateCallbackType.onExit);
    }

    // If you don't do cleanup, the child's actions will not get removed and the
    if (doCleanup) child._performRecursive(Node._stateCallbackType.cleanup);

    // set parent nil at the end
    child.parent = null;
    child.renderCmd.detachFromParent();
    arrayRemoveObject(this.#children, child);
  }

  _insertChild(child, z) {
    ServiceLocator.sys.rendererConfig.renderer.childrenOrderDirty =
      this.#reorderChildDirty = true;
    this.#children.push(child);
    child.localZOrder = z;
  }

  setNodeDirty() {
    this.#renderCmd.setDirtyFlag(dirtyFlags.transformDirty);
  }

  /** Reorders a child according to a new z value. <br/>
   * The child MUST be already added.
   * @function
   * @param {Node} child An already added child node. It MUST be already added.
   * @param {Number} zOrder Z order for drawing priority. Please refer to setZOrder(int)
   */
  reorderChild(child, zOrder) {
    assert(child, _LogInfos.Node_reorderChild);
    if (this.#children.indexOf(child) === -1) {
      log(_LogInfos.Node_reorderChild_2);
      return;
    }
    ServiceLocator.sys.rendererConfig.renderer.childrenOrderDirty =
      this.#reorderChildDirty = true;
    child.arrivalOrder = s_globalOrderOfArrival;
    setGlobalOrderOfArrival(s_globalOrderOfArrival + 1);
    child.localZOrder = zOrder;
    this.#renderCmd.setDirtyFlag(dirtyFlags.orderDirty);
  }

  /**
   * <p>
   *     Sorts the children array once before drawing, instead of every time when a child is added or reordered.    <br/>
   *     This approach can improves the performance massively.
   * </p>
   * @function
   * @note Don't call this manually unless a child added needs to be removed in the same frame
   */
  sortAllChildren() {
    if (this.#reorderChildDirty) {
      var _children = this.#children;

      // insertion sort
      var len = _children.length,
        i,
        j,
        tmp;
      for (i = 1; i < len; i++) {
        tmp = _children[i];
        j = i - 1;

        //continue moving element downwards while zOrder is smaller or when zOrder is the same but mutatedIndex is smaller
        while (j >= 0) {
          if (tmp.localZOrder < _children[j].localZOrder) {
            _children[j + 1] = _children[j];
          } else if (
            tmp.localZOrder === _children[j].localZOrder &&
            tmp.arrivalOrder < _children[j].arrivalOrder
          ) {
            _children[j + 1] = _children[j];
          } else {
            break;
          }
          j--;
        }
        _children[j + 1] = tmp;
      }

      //don't need to check children recursively, that's done in visit of each child
      this.#reorderChildDirty = false;
    }
  }

  /**
   * Render function using the canvas 2d context or WebGL context, internal usage only, please do not call this function
   * @function
   * @param {CanvasRenderingContext2D | WebGLRenderingContext} ctx The render context
   */
  draw(ctx) {
    // override me
    // Only use- this function to draw your staff.
    // DON'T draw your stuff outside this method
  }

  // Internal use only, do not call it by yourself,
  transformAncestors() {
    if (this.#parent !== null) {
      this.#parent.transformAncestors();
      this.#parent.transform();
    }
  }

  //scene management
  /**
   * <p>
   *     Event callback that is invoked every time when Node enters the 'stage'.                                   <br/>
   *     If the Node enters the 'stage' with a transition, this event is called when the transition starts.        <br/>
   *     During onEnter you can't access a "sister/brother" node.                                                    <br/>
   *     If you override onEnter, you must call its parent's onEnter function with this._super().
   * </p>
   * @function
   */
  onEnter() {
    this.#transitionFinished = false;
    this.#running = true; //should be running before resumeSchedule
    this.resume();
  }

  _performRecursive(callbackType) {
    var nodeCallbackType = Node._stateCallbackType;
    if (callbackType >= nodeCallbackType.max) {
      return;
    }

    var index = 0;
    var children, child, curr, i, len;
    var stack = Node._performStacks[Node._performing];
    if (!stack) {
      stack = [];
      Node._performStacks.push(stack);
    }
    stack.length = 0;
    Node._performing++;
    curr = stack[0] = this;
    while (curr) {
      // Walk through children
      children = curr.children;
      if (children && children.length > 0) {
        for (i = 0, len = children.length; i < len; ++i) {
          child = children[i];
          stack.push(child);
        }
      }
      children = curr._protectedChildren;
      if (children && children.length > 0) {
        for (i = 0, len = children.length; i < len; ++i) {
          child = children[i];
          stack.push(child);
        }
      }

      index++;
      curr = stack[index];
    }
    for (i = stack.length - 1; i >= 0; --i) {
      curr = stack[i];
      stack[i] = null;
      if (!curr) continue;

      // Perform actual action
      switch (callbackType) {
        case nodeCallbackType.onEnter:
          curr.onEnter();
          break;
        case nodeCallbackType.onExit:
          curr.onExit();
          break;
        case nodeCallbackType.onEnterTransitionDidFinish:
          curr.onEnterTransitionDidFinish();
          break;
        case nodeCallbackType.cleanup:
          curr.cleanup();
          break;
        case nodeCallbackType.onExitTransitionDidStart:
          curr.onExitTransitionDidStart();
          break;
      }
    }
    Node._performing--;
  }

  /**
   * <p>
   *     Event callback that is invoked when the Node enters in the 'stage'.                                                        <br/>
   *     If the Node enters the 'stage' with a transition, this event is called when the transition finishes.                       <br/>
   *     If you override onEnterTransitionDidFinish, you shall call its parent's onEnterTransitionDidFinish with this._super()
   * </p>
   * @function
   */
  onEnterTransitionDidFinish() {
    this.#transitionFinished = true;
  }

  /**
   * <p>callback that is called every time the Node leaves the 'stage'.  <br/>
   * If the Node leaves the 'stage' with a transition, this callback is called when the transition starts. <br/>
   * If you override onExitTransitionDidStart, you shall call its parent's onExitTransitionDidStart with this._super()</p>
   * @function
   */
  onExitTransitionDidStart() {}

  /**
   * <p>
   * callback that is called every time the Node leaves the 'stage'.                                         <br/>
   * If the Node leaves the 'stage' with a transition, this callback is called when the transition finishes. <br/>
   * During onExit you can't access a sibling node.                                                             <br/>
   * If you override onExit, you shall call its parent's onExit with this._super().
   * </p>
   * @function
   */
  onExit() {
    this.#running = false;
    this.pause();
    this.removeAllComponents([this.#scheduler.name, this.#actionManager.name]);
  }

  // actions
  /**
   * Executes an action, and returns the action that is executed.<br/>
   * The node becomes the action's target. Refer to Action's getTarget()
   * @function
   * @warning Starting from v0.8 actions don't retain their target anymore.
   * @param {Action} action
   * @return {Action} An Action pointer
   */
  runAction(action) {
    return this.#actionManager.runAction(action);
  }

  /**
   * Stops and removes all actions from the running action list .
   * @function
   */
  stopAllActions() {
    this.#actionManager.stopAllActions();
  }

  /**
   * Stops and removes an action from the running action list.
   * @function
   * @param {Action} action An action object to be removed.
   */
  stopAction(action) {
    this.#actionManager.stopAction(action);
  }

  /**
   * Removes an action from the running action list by its tag.
   * @function
   * @param {Number} tag A tag that indicates the action to be removed.
   */
  stopActionByTag(tag) {
    this.#actionManager.stopActionByTag(tag);
  }

  /**
   * Returns an action from the running action list by its tag.
   * @function
   * @see Node#getTag and Node#setTag
   * @param {Number} tag
   * @return {Action} The action object with the given tag.
   */
  getActionByTag(tag) {
    return this.#actionManager.getActionByTag(tag);
  }

  /** <p>Returns the numbers of actions that are running plus the ones that are schedule to run (actions in actionsToAdd and actions arrays).<br/>
   *    Composable actions are counted as 1 action. Example:<br/>
   *    If you are running 1 Sequence of 7 actions, it will return 1. <br/>
   *    If you are running 7 Sequences of 2 actions, it will return 7.</p>
   * @function
   * @return {Number} The number of actions that are running plus the ones that are schedule to run
   */
  getNumberOfRunningActions() {
    return this.#actionManager.numberOfRunningActions;
  }

  /**
   * <p>Resumes all scheduled selectors and actions.<br/>
   * This method is called internally by onEnter</p>
   */
  resume() {
    this.#scheduler.resume();
    this.#actionManager.resume();
    ServiceLocator.eventManager.resumeTarget(this);
  }

  /**
   * <p>Pauses all scheduled selectors and actions.<br/>
   * This method is called internally by onExit</p>
   * @function
   */
  pause() {
    this.#scheduler.pause();
    this.#actionManager.pause();
    ServiceLocator.eventManager.pauseTarget(this);
  }

  /**
   *<p>Sets the additional transform.<br/>
   *  The additional transform will be concatenated at the end of getNodeToParentTransform.<br/>
   *  It could be used to simulate `parent-child` relationship between two nodes (e.g. one is in BatchNode, another isn't).<br/>
   *  </p>
   *  @function
   *  @param {AffineTransform} additionalTransform  The additional transform
   *  @example
   * // create a batchNode
   * var batch = new SpriteBatchNode("Icon-114.png");
   * this.addChild(batch);
   *
   * // create two sprites, spriteA will be added to batchNode, they are using different textures.
   * var spriteA = new Sprite(batch->getTexture());
   * var spriteB = new Sprite("Icon-72.png");
   *
   * batch.addChild(spriteA);
   *
   * // We can't make spriteB as spriteA's child since they use different textures. So just add it to layer.
   * // But we want to simulate `parent-child` relationship for these two node.
   * this.addChild(spriteB);
   *
   * //position
   * spriteA.position = new Point(200, 200);
   *
   * // Gets the spriteA's transform.
   * var t = spriteA.getNodeToParentTransform();
   *
   * // Sets the additional transform to spriteB, spriteB's position will based on its pseudo parent i.e. spriteA.
   * spriteB.additionalTransform = t;
   *
   * //scale
   * spriteA.scale = 2;
   *
   * // Gets the spriteA's transform.
   * t = spriteA.getNodeToParentTransform();
   *
   * // Sets the additional transform to spriteB, spriteB's scale will based on its pseudo parent i.e. spriteA.
   * spriteB.additionalTransform = t;
   *
   * //rotation
   * spriteA.rotation = 20;
   *
   * // Gets the spriteA's transform.
   * t = spriteA.getNodeToParentTransform();
   *
   * // Sets the additional transform to spriteB, spriteB's rotation will based on its pseudo parent i.e. spriteA.
   * spriteB.additionalTransform = t;
   */

  /**
   * Returns the matrix that transform parent's space coordinates to the node's (local) space coordinates.<br/>
   * The matrix is in Pixels.
   * @function
   * @return {AffineTransform}
   */
  getParentToNodeTransform() {
    return this.#renderCmd.getParentToNodeTransform();
  }

  /**
   * Returns the world affine transform matrix. The matrix is in Pixels.
   * @function
   * @return {AffineTransform}
   */
  getNodeToWorldTransform() {
    var t = this.getNodeToParentTransform();
    for (var p = this.#parent; p !== null; p = p.parent)
      t = AffineTransform.concat(t, p.getNodeToParentTransform());
    return t;
  }

  /**
   * Returns the inverse world affine transform matrix. The matrix is in Pixels.
   * @function
   * @return {AffineTransform}
   */
  getWorldToNodeTransform() {
    return AffineTransform.invert(this.getNodeToWorldTransform());
  }

  /**
   * Converts a Point to node (local) space coordinates. The result is in Points.
   * @function
   * @param {Point} worldPoint
   * @return {Point}
   */
  convertToNodeSpace(worldPoint) {
    return AffineTransform.applyToPoint(
      worldPoint,
      this.getWorldToNodeTransform()
    );
  }

  /**
   * Converts a Point to world space coordinates. The result is in Points.
   * @function
   * @param {Point} nodePoint
   * @return {Point}
   */
  convertToWorldSpace(nodePoint = new Point()) {
    return AffineTransform.applyToPoint(
      nodePoint,
      this.getNodeToWorldTransform()
    );
  }

  /**
   * Converts a Point to node (local) space coordinates. The result is in Points.<br/>
   * treating the returned/received node point as anchor relative.
   * @function
   * @param {Point} worldPoint
   * @return {Point}
   */
  convertToNodeSpaceAR(worldPoint) {
    return Point.sub(
      this.convertToNodeSpace(worldPoint),
      this.#renderCmd.anchorPointInPoints
    );
  }

  /**
   * Converts a local Point to world space coordinates.The result is in Points.<br/>
   * treating the returned/received node point as anchor relative.
   * @function
   * @param {Point} nodePoint
   * @return {Point}
   */
  convertToWorldSpaceAR(nodePoint) {
    nodePoint = nodePoint || new Point();
    var pt = Point.add(nodePoint, this.#renderCmd.anchorPointInPoints);
    return this.convertToWorldSpace(pt);
  }

  _convertToWindowSpace(nodePoint) {
    var worldPoint = this.convertToWorldSpace(nodePoint);
    return ServiceLocator.eglView.convertToUI(worldPoint);
  }

  /** convenience methods which take a Touch instead of Point
   * @function
   * @param {Touch} touch The touch object
   * @return {Point}
   */
  convertTouchToNodeSpace(touch) {
    return this.convertToNodeSpace(touch);
  }

  /**
   * converts a Touch (world coordinates) into a local coordinate. This method is AR (Anchor Relative).
   * @function
   * @param {Touch} touch The touch object
   * @return {Point}
   */
  convertTouchToNodeSpaceAR(touch) {
    var point = ServiceLocator.eglView.convertToGL(touch);
    return this.convertToNodeSpaceAR(point);
  }

  /**
   * <p>
   * Calls children's updateTransform() method recursively.                                        <br/>
   *                                                                                               <br/>
   * This method is moved from Sprite, so it's no longer specific to Sprite.                   <br/>
   * As the result, you apply SpriteBatchNode's optimization on your customed Node.            <br/>
   * e.g., batchNode->addChild(myCustomNode), while you can only addChild(sprite) before.
   * </p>
   * @function
   */
  updateTransform() {
    var children = this.#children,
      node;
    for (var i = 0; i < children.length; i++) {
      node = children[i];
      if (node) node.updateTransform();
    }
  }

  /**
   * Recursive method that visit its children and draw them
   * @function
   * @param {Node} parent
   */
  visit(parent = null, renderer = ServiceLocator.sys.rendererConfig.renderer) {
    var cmd = this.#renderCmd,
      parentCmd = parent ? parent.renderCmd : null;

    // quick return if not visible
    if (!this.visible) {
      cmd._propagateFlagsDown(parentCmd);
      return;
    }

    cmd.visit(parentCmd, renderer);

    var i,
      children = this.#children,
      len = children.length,
      child;
    if (len > 0) {
      if (this.#reorderChildDirty) {
        this.sortAllChildren();
      }
      // draw children zOrder < 0
      for (i = 0; i < len; i++) {
        child = children[i];
        if (child.localZOrder < 0) {
          child.visit(this, renderer);
        } else {
          break;
        }
      }

      renderer.pushRenderCommand(cmd);
      for (; i < len; i++) {
        children[i].visit(this, renderer);
      }
    } else {
      renderer.pushRenderCommand(cmd);
    }
    cmd._dirtyFlag = 0;
  }

  /**
   * Performs view-matrix transformation based on position, scale, rotation and other attributes.
   * @function
   * @param {Node.RenderCmd} parentCmd parent's render command
   * @param {boolean} recursive whether call its children's transform
   */
  transform(parentCmd, recursive) {
    this.#renderCmd.transform(parentCmd, recursive);
  }

  /**
   * Returns the matrix that transform the node's (local) space coordinates into the parent's space coordinates.<br/>
   * The matrix is in Pixels.
   * @function
   * @return {AffineTransform} The affine transform object
   */
  getNodeToParentTransform(ancestor) {
    var t = this.#renderCmd.getNodeToParentTransform();
    if (ancestor) {
      var T = { a: t.a, b: t.b, c: t.c, d: t.d, tx: t.tx, ty: t.ty };
      for (var p = this.#parent; p != null && p != ancestor; p = p.parent) {
        AffineTransform.concatIn(T, p.getNodeToParentTransform());
      }
      return T;
    } else {
      return t;
    }
  }

  getNodeToParentAffineTransform(ancestor) {
    return this.getNodeToParentTransform(ancestor);
  }

  /**
   * Returns a "world" axis aligned bounding box of the node.
   * @function
   * @return {Rect}
   */
  getBoundingBoxToWorld() {
    var rect = new Rect(0, 0, this.width, this.height);
    var trans = this.getNodeToWorldTransform();
    rect = AffineTransform.applyToRect(rect, trans);

    //query child's BoundingBox
    var locChildren = this.#children;
    for (var i = 0; i < locChildren.length; i++) {
      var child = locChildren[i];
      if (child && child.visible) {
        var childRect = child._getBoundingBoxToCurrentNode(trans);
        if (childRect) rect = Rect.union(rect, childRect);
      }
    }
    return rect;
  }

  _getBoundingBoxToCurrentNode(parentTransform) {
    var rect = new Rect(0, 0, this.width, this.height);
    var trans =
      parentTransform === undefined
        ? this.getNodeToParentTransform()
        : AffineTransform.concat(
            this.getNodeToParentTransform(),
            parentTransform
          );
    rect = AffineTransform.applyToRect(rect, trans);

    //query child's BoundingBox
    var locChildren = this.#children;
    for (var i = 0; i < locChildren.length; i++) {
      var child = locChildren[i];
      if (child && child.visible) {
        var childRect = child._getBoundingBoxToCurrentNode(trans);
        if (childRect) rect = Rect.union(rect, childRect);
      }
    }
    return rect;
  }

  /**
   * @protected
   */

  createRenderCmd() {
    return ServiceLocator.sys.rendererConfig.isCanvas
      ? new NodeCanvasRenderCmd(this)
      : new NodeWebGLRenderCmd(this);
  }

  /** Search the children of the receiving node to perform processing for nodes which share a name.
   *
   * @param name The name to search for, supports c++11 regular expression.
   * Search syntax options:
   * `//`: Can only be placed at the begin of the search string. This indicates that it will search recursively.
   * `..`: The search should move up to the node's parent. Can only be placed at the end of string.
   * `/` : When placed anywhere but the start of the search string, this indicates that the search should move to the node's children.
   *
   * @code
   * enumerateChildren("//MyName", ...): This searches the children recursively and matches any node with the name `MyName`.
   * enumerateChildren("[[:alnum:]]+", ...): This search string matches every node of its children.
   * enumerateChildren("A[[:digit:]]", ...): This searches the node's children and returns any child named `A0`, `A1`, ..., `A9`.
   * enumerateChildren("Abby/Normal", ...): This searches the node's grandchildren and returns any node whose name is `Normal`
   * and whose parent is named `Abby`.
   * enumerateChildren("//Abby/Normal", ...): This searches recursively and returns any node whose name is `Normal` and whose
   * parent is named `Abby`.
   * @endcode
   *
   * @warning Only support alpha or number for name, and not support unicode.
   *
   * @param callback A callback function to execute on nodes that match the `name` parameter. The function takes the following arguments:
   *  `node`
   *      A node that matches the name
   *  And returns a boolean result. Your callback can return `true` to terminate the enumeration.
   *
   */
  enumerateChildren(name, callback) {
    assert(name && name.length != 0, "Invalid name");
    assert(callback != null, "Invalid callback function");

    var length = name.length;
    var subStrStartPos = 0;
    var subStrlength = length;

    // Starts with '//'?
    var searchRecursively = false;
    if (length > 2 && name[0] === "/" && name[1] === "/") {
      searchRecursively = true;
      subStrStartPos = 2;
      subStrlength -= 2;
    }

    var searchFromParent = false;
    if (
      length > 3 &&
      name[length - 3] === "/" &&
      name[length - 2] === "." &&
      name[length - 1] === "."
    ) {
      searchFromParent = true;
      subStrlength -= 3;
    }

    var newName = name.substr(subStrStartPos, subStrlength);

    if (searchFromParent) newName = "[[:alnum:]]+/" + newName;

    if (searchRecursively) this.doEnumerateRecursive(this, newName, callback);
    else this.doEnumerate(newName, callback);
  }

  doEnumerateRecursive(node, name, callback) {
    var ret = false;
    if (node.doEnumerate(name, callback)) {
      ret = true;
    } else {
      var child,
        children = node.children,
        length = children.length;
      // search its children
      for (var i = 0; i < length; i++) {
        child = children[i];
        if (this.doEnumerateRecursive(child, name, callback)) {
          ret = true;
          break;
        }
      }
    }
    return ret;
  }

  doEnumerate(name, callback) {
    // name may be xxx/yyy, should find its parent
    var pos = name.indexOf("/");
    var searchName = name;
    var needRecursive = false;
    if (pos !== -1) {
      searchName = name.substr(0, pos);
      //name.erase(0, pos+1);
      needRecursive = true;
    }

    var ret = false;
    var child,
      children = this.#children,
      length = children.length;
    for (var i = 0; i < length; i++) {
      child = children[i];
      if (child.name.indexOf(searchName) !== -1) {
        if (!needRecursive) {
          // terminate enumeration if callback return true
          if (callback(child)) {
            ret = true;
            break;
          }
        } else {
          ret = child.doEnumerate(name, callback);
          if (ret) break;
        }
      }
    }

    return ret;
  }

  static _stateCallbackType = {
    onEnter: 1,
    onExit: 2,
    cleanup: 3,
    onEnterTransitionDidFinish: 4,
    onExitTransitionDidStart: 5,
    max: 6
  };
  static _performStacks = [[]];
  static _performing = 0;
  static _dirtyFlags = dirtyFlags;

  static transformChildTree(root) {
    let index = 1;
    let children, child, curr, parentCmd, i, len;
    let stack = Node._performStacks[Node._performing];
    if (!stack) {
      stack = [];
      Node._performStacks.push(stack);
    }
    stack.length = 0;
    Node._performing++;
    stack[0] = root;
    while (index) {
      index--;
      curr = stack[index];
      stack[index] = null;
      if (!curr) continue;
      children = curr.children;
      if (children && children.length > 0) {
        parentCmd = curr.renderCmd;
        for (i = 0, len = children.length; i < len; ++i) {
          child = children[i];
          stack[index] = child;
          index++;
          child.renderCmd.transform(parentCmd);
        }
      }
      const pChildren = curr._protectedChildren;
      if (pChildren && pChildren.length > 0) {
        parentCmd = curr.renderCmd;
        for (i = 0, len = pChildren.length; i < len; ++i) {
          child = pChildren[i];
          stack[index] = child;
          index++;
          child.renderCmd.transform(parentCmd);
        }
      }
    }
    Node._performing--;
  }
  // properties

  get renderCmd() {
    return this.#renderCmd;
  }

  get transitionFinished() {
    return this.#transitionFinished;
  }

  set transitionFinished(value) {
    this.#transitionFinished = value;
  }

  set renderCmd(renderCmd) {
    this.#renderCmd = renderCmd;
    this.#transform = new NodeTransform(renderCmd);
    this.#color = new NodeColor(renderCmd);
    this.#order = new NodeOrder(renderCmd);
  }

  get transform() {
    return this.#transform;
  }

  get reorderChildDirty() {
    return this.#reorderChildDirty;
  }

  get width() {
    return this.#transform.width;
  }

  set width(value) {
    this.#transform.width = value;
  }

  get height() {
    return this.#transform.height;
  }

  set height(value) {
    this.#transform.height = value;
  }

  get anchor() {
    return this.#transform.anchor;
  }

  set anchor(value) {
    this.#transform.anchor = value;
  }

  get anchorX() {
    return this.#transform.anchorX;
  }

  set anchorX(value) {
    this.#transform.anchorX = value;
  }

  get anchorY() {
    return this.#transform.anchorY;
  }

  set anchorY(value) {
    this.#transform.anchorY = value;
  }

  get vertexZ() {
    return this.#order.vertexZ;
  }

  set vertexZ(v) {
    this.#order.vertexZ = v;
  }

  get rotationX() {
    return this.#transform.rotationX;
  }

  set rotationX(value) {
    this.#transform.rotationX = value;
  }

  get rotationY() {
    return this.#transform.rotationY;
  }

  set rotationY(value) {
    this.#transform.rotationY = value;
  }

  get scale() {
    return this.#transform.scale;
  }

  set scale(value) {
    this.#transform.scale = value;
  }

  get children() {
    return this.#children;
  }

  get childrenCount() {
    return this.#children.length;
  }

  get running() {
    return this.#running;
  }

  set running(value) {
    this.#running = value;
  }

  get isSprite() {
    return false;
  }

  get ignoreAnchor() {
    return this.ignoreAnchorPointForPosition;
  }

  set ignoreAnchor(v) {
    this.ignoreAnchorPointForPosition = v;
  }

  get actionManager() {
    return this.#actionManager.actionManager;
  }

  set actionManager(value) {
    this.#actionManager.actionManager = value;
  }

  get scheduler() {
    return this.#scheduler;
  }

  get shaderProgram() {
    return this.#renderCmd.getShaderProgram();
  }

  set shaderProgram(v) {
    this.#renderCmd.setShaderProgram(v);
  }

  get glProgramState() {
    return this.#renderCmd.getGLProgramState();
  }

  set glProgramState(value) {
    this.#renderCmd.setGLProgramState(value);
  }

  get cascadeOpacity() {
    return this.#color.cascadeOpacity;
  }

  set cascadeOpacity(v) {
    this.#color.cascadeOpacity = v;
  }

  get cascadeColor() {
    return this.#color.cascadeColor;
  }

  set cascadeColor(v) {
    this.#color.cascadeColor = v;
  }

  get skew() {
    return this.#transform.skew;
  }

  set skew(value) {
    this.#transform.skew = value;
  }

  get skewX() {
    return this.#transform.skewX;
  }

  set skewX(newSkewX) {
    this.#transform.skewX = newSkewX;
  }

  get skewY() {
    return this.#transform.skewY;
  }

  set skewY(newSkewY) {
    this.#transform.skewY = newSkewY;
  }

  set zIndex(localZOrder) {
    if (localZOrder === this.#order.localZOrder) return;
    if (this.#parent) this.#parent.reorderChild(this, localZOrder);
    else this.localZOrder = localZOrder;
    ServiceLocator.eventManager._setDirtyForNode(this);
  }

  get localZOrder() {
    return this.#order.localZOrder;
  }

  set localZOrder(value) {
    this.#order.localZOrder = value;
  }

  get zIndex() {
    return this.#order.localZOrder;
  }

  set globalZOrder(value) {
    this.#order.globalZOrder = value;
  }

  get globalZOrder() {
    return this.#order.globalZOrder;
  }

  set assignedVertexZ(value) {
    this.#order.assignedVertexZ = value;
  }

  get hasCustomVertexZ() {
    return this.#order.hasCustomVertexZ;
  }

  get rotation() {
    return this.#transform.rotation;
  }

  set rotation(newRotation) {
    this.#transform.rotation = newRotation;
  }

  get scaleX() {
    return this.#transform.scaleX;
  }

  set scaleX(newScaleX) {
    this.#transform.scaleX = newScaleX;
  }

  get scaleY() {
    return this.#transform.scaleY;
  }

  set scaleY(newScaleY) {
    this.#transform.scaleY = newScaleY;
  }

  set normalizedPosition(value) {
    this.#transform.normalizedPosition = value;
  }

  get normalizedPosition() {
    return this.#transform.normalizedPosition;
  }

  get normalizedPositionDirty() {
    return this.#transform.normalizedPositionDirty;
  }

  set normalizedPositionDirty(value) {
    this.#transform.normalizedPositionDirty = value;
  }

  get usingNormalizedPosition() {
    return this.#transform.usingNormalizedPosition;
  }

  get position() {
    return this.#transform.position;
  }

  set position(value) {
    this.#transform.position = value;
  }

  get x() {
    return this.#transform.x;
  }

  set x(x) {
    this.#transform.x = x;
  }

  get y() {
    return this.#transform.y;
  }

  set y(y) {
    this.#transform.y = y;
  }

  get visible() {
    return this.#visible;
  }

  set visible(visible) {
    if (this.#visible !== visible) {
      this.#visible = visible;
      //if(visible)
      this.#renderCmd.setDirtyFlag(dirtyFlags.transformDirty);
      ServiceLocator.sys.rendererConfig.renderer.childrenOrderDirty = true;
    }
  }

  get anchorPointInPoints() {
    return this.#renderCmd.anchorPointInPoints;
  }

  get contentSize() {
    return this.#transform.contentSize;
  }

  set contentSize(value) {
    this.#transform.contentSize = value;
  }

  get parent() {
    return this.#parent;
  }

  set parent(parent) {
    if (this.#parent === parent) return;
    this.#parent = parent;
    this.#renderCmd.setDirtyFlag(dirtyFlags.transformDirty);
  }

  get ignoreAnchorPointForPosition() {
    return this.#transform.ignoreAnchorPointForPosition;
  }

  set ignoreAnchorPointForPosition(newValue) {
    this.#transform.ignoreAnchorPointForPosition = newValue;
  }

  get tag() {
    return this.#tag;
  }

  set tag(value) {
    this.#tag = value;
  }

  set name(name) {
    this.#name = name;
  }

  get name() {
    return this.#name;
  }

  get userData() {
    return this.#userData;
  }

  set userData(Var) {
    this.#userData = Var;
  }

  get arrivalOrder() {
    return this.#order.arrivalOrder;
  }

  set arrivalOrder(value) {
    this.#order.arrivalOrder = value;
  }

  get boundingBox() {
    return this.#transform.boundingBox;
  }

  get additionalTransform() {
    return this.#transform.additionalTransform;
  }

  get additionalTransformDirty() {
    return this.#transform.additionalTransformDirty;
  }

  set additionalTransform(additionalTransform) {
    this.#transform.additionalTransform = additionalTransform;
  }

  get opacity() {
    return this.#color.opacity;
  }

  set opacity(opacity) {
    this.#color.opacity = opacity;
  }

  get displayedOpacity() {
    return this.#color.displayedOpacity;
  }

  set displayedOpacity(parentOpacity) {
    this.#color.displayedOpacity = parentOpacity;
  }

  get color() {
    return this.#color.color;
  }

  get displayedColor() {
    return this.#color.displayedColor;
  }

  set displayedColor(parentColor) {
    this.#color.displayedColor = parentColor;
  }

  set color(color) {
    this.#color.color = color;
  }

  set opacityModifyRGB(opacityValue) {}

  get opacityModifyRGB() {
    return false;
  }
}
