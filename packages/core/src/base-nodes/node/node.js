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
import { Point, AffineTransform } from "../../geometry";
import { log, assert, _LogInfos } from "../../boot/debugger";
import { arrayRemoveObject } from "../../platform/macro/utils";
import { ComponentContainer } from "../../components";
import Touch from "../../event-manager/touch";
import { CanvasRenderCmd as NodeCanvasRenderCmd } from "./node-canvas-render-cmd";
import { WebGLRenderCmd as NodeWebGLRenderCmd } from "./node-webgl-render-cmd";
import {
  NodeActionManager,
  NodeColor,
  NodeOrder,
  NodeScheduler,
  NodeTransform
} from "./components";
import { NodeStateCallbackType } from "../../enums";
import { ServiceLocator } from "../../service-locator";

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
 * @property {NodeActionManager} actionManager       - Component that manages this node's actions.
 * @property {NodeScheduler}     scheduler           - Component that schedules this node's updates and timers.
 * @property {NodeOrder}         order               - Component that manages this node's draw order.
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
    this.#transform = this.createTransform();
    this.#color = this.createColor();
    this.#order = this.createOrder();
    this.addComponent(this.#scheduler);
    this.addComponent(this.#actionManager);
    this.addComponent(this.#transform);
    this.addComponent(this.#color);
    this.addComponent(this.#order);
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
   * Stops all running actions and schedulers
   * @function
   */
  cleanup() {
    // actions
    this.#actionManager.stopAllActions();
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
    const childCount = this.#children.length;

    for (let i = 0; i < childCount; ++i) {
      if (this.#children[i].name === name) {
        return this.#children[i];
      }
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
    localZOrder =
      localZOrder === undefined ? child.order.localZOrder : localZOrder;
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

    this.addChildHelper(child, localZOrder, tag, name, setTag);
  }

  addChildHelper(child, localZOrder, tag, name, setTag) {
    this.#insertChild(child, localZOrder);
    if (setTag) child.tag = tag;
    else child.name = name;

    child.parent = this;
    child.order.arrivalOrder = s_globalOrderOfArrival;
    setGlobalOrderOfArrival(s_globalOrderOfArrival + 1);

    if (this.#running) {
      child.performRecursive(NodeStateCallbackType.onEnter);
      // prevent onEnterTransitionDidFinish to be called twice when a node is added in onEnter
      if (this.#transitionFinished)
        child.performRecursive(
          NodeStateCallbackType.onEnterTransitionDidFinish
        );
    }
    child.renderCmd.setDirtyFlag(dirtyFlags.transformDirty);
    if (this.#color.cascadeColor) {
      child.renderCmd.setDirtyFlag(dirtyFlags.colorDirty);
    }
    if (this.#color.cascadeOpacity) {
      child.renderCmd.setDirtyFlag(dirtyFlags.opacityDirty);
    }
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
  removeFromParent(cleanup = true) {
    if (this.#parent) {
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
  removeChild(child, cleanup = true) {
    // explicit nil handling
    if (this.#children.length === 0) {
      return;
    }

    if (this.#children.indexOf(child) > -1) {
      this.#detachChild(child, cleanup);
    }

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
  removeChildByTag(tag, cleanup = true) {
    if (tag === NODE_TAG_INVALID) log(_LogInfos.Node_removeChildByTag);

    var child = this.getChildByTag(tag);
    if (!child) log(_LogInfos.Node_removeChildByTag_2, tag);
    else this.removeChild(child, cleanup);
  }

  /**
   * Removes all children from the container and do a cleanup all running actions depending on the cleanup parameter.
   * @param {Boolean} [cleanup=true]
   */
  removeAllChildrenWithCleanup(cleanup = true) {
    this.removeAllChildren(cleanup);
  }

  /**
   * Removes all children from the container and do a cleanup all running actions depending on the cleanup parameter. <br/>
   * If the cleanup parameter is not passed, it will force a cleanup. <br/>
   * @function
   * @param {Boolean} [cleanup=true] true if all running actions on all children nodes should be cleanup, false otherwise.
   */
  removeAllChildren(cleanup = true) {
    // not using detachChild improves speed here
    for (let i = 0; i < this.#children.length; ++i) {
      if (this.#children[i]) {
        this.#detachChild(this.#children[i], cleanup, false);
      }
    }
    this.#children.length = 0;
    ServiceLocator.sys.rendererConfig.renderer.childrenOrderDirty = true;
  }

  #detachChild(child, cleanup, removeFromArray = false) {
    // IMPORTANT:
    //  -1st do onExit
    //  -2nd cleanup
    if (this.#running) {
      child.performRecursive(NodeStateCallbackType.onExitTransitionDidStart);
      child.performRecursive(NodeStateCallbackType.onExit);
    }

    // If you don't do cleanup, the child's actions will not get removed and the
    if (cleanup) {
      child.performRecursive(NodeStateCallbackType.cleanup);
    }

    // set parent nil at the end
    child.parent = null;
    child.renderCmd.detachFromParent();

    if (removeFromArray) {
      arrayRemoveObject(this.#children, child);
    }
  }

  setNodeDirty() {
    this.#renderCmd.setDirtyFlag(dirtyFlags.transformDirty);
  }

  #insertChild(child, z) {
    ServiceLocator.sys.rendererConfig.renderer.childrenOrderDirty =
      this.#order.reorderChildDirty = true;
    this.#children.push(child);
    child.order.localZOrder = z;
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

  performRecursive(callbackType) {
    if (callbackType >= NodeStateCallbackType.max) {
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
        case NodeStateCallbackType.onEnter:
          curr.onEnter();
          break;
        case NodeStateCallbackType.onExit:
          curr.onExit();
          break;
        case NodeStateCallbackType.onEnterTransitionDidFinish:
          curr.onEnterTransitionDidFinish();
          break;
        case NodeStateCallbackType.cleanup:
          curr.cleanup();
          break;
        case NodeStateCallbackType.onExitTransitionDidStart:
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
    this.removeAllComponents([
      this.#scheduler.name,
      this.#actionManager.name,
      this.#transform.name,
      this.#color.name,
      this.#order.name
    ]);
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

  get parentToNodeTransform() {
    return this.#transform.parentToNodeTransform;
  }

  get nodeToWorldTransform() {
    return this.#transform.nodeToWorldTransform;
  }

  get worldToNodeTransform() {
    return this.#transform.worldToNodeTransform;
  }

  convertToNodeSpace(worldPoint) {
    return this.#transform.convertToNodeSpace(worldPoint);
  }

  convertToWorldSpace(nodePoint = new Point()) {
    return this.#transform.convertToWorldSpace(nodePoint);
  }

  convertToNodeSpaceAR(worldPoint) {
    return this.#transform.convertToNodeSpaceAR(worldPoint);
  }

  convertToWorldSpaceAR(nodePoint) {
    return this.#transform.convertToWorldSpaceAR(nodePoint);
  }

  convertTouchToNodeSpaceAR(touch) {
    return this.#transform.convertTouchToNodeSpaceAR(touch);
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
   * @param {Node | null} parent
   */
  visit(parent = null, renderer = ServiceLocator.sys.rendererConfig.renderer) {
    var parentCmd = parent ? parent.renderCmd : null;

    // quick return if not visible
    if (!this.visible) {
      this.#renderCmd._propagateFlagsDown(parentCmd);
      return;
    }

    this.#renderCmd.visit(parentCmd, renderer);

    var i,
      children = this.#children,
      len = children.length,
      child;
    if (len > 0) {
      this.#order.sortAllChildren();
      // draw children zOrder < 0
      for (i = 0; i < len; i++) {
        child = children[i];
        if (child.order.localZOrder < 0) {
          child.visit(this, renderer);
        } else {
          break;
        }
      }

      renderer.pushRenderCommand(this.#renderCmd);
      for (; i < len; i++) {
        children[i].visit(this, renderer);
      }
    } else {
      renderer.pushRenderCommand(this.#renderCmd);
    }
    this.#renderCmd._dirtyFlag = 0;
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
  get nodeToParentTransform() {
    return this.#transform.nodeToParentTransform;
  }

  nodeToAncestorTransform(ancestor) {
    var t = this.#transform.nodeToParentTransform;
    
    if (ancestor) {
      var T = new AffineTransform(t);
      for (var p = this.#parent; p != null && p != ancestor; p = p.parent) {
        AffineTransform.concatIn(T, p.nodeToParentTransform);
      }
      return T;
    } 
     
    return t;
  }

  /**
   * Returns a "world" axis aligned bounding box of the node.
   * @function
   * @return {Rect}
   */
  get boundingBoxToWorld() {
    return this.#transform.boundingBoxToWorld;
  }

  getBoundingBoxToCurrentNode(parentTransform) {
    return this.#transform.getBoundingBoxToCurrentNode(parentTransform);
  }

  /**
   * @protected
   */

  createRenderCmd() {
    return ServiceLocator.sys.rendererConfig.isCanvas
      ? new NodeCanvasRenderCmd(this)
      : new NodeWebGLRenderCmd(this);
  }

  createOrder() {
    return new NodeOrder();
  }

  createTransform() {
    return new NodeTransform();
  }

  createColor() {
    return new NodeColor();
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
  }

  get transform() {
    return this.#transform;
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
    return this.#actionManager;
  }

  get scheduler() {
    return this.#scheduler;
  }

  get order() {
    return this.#order;
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

  get color() {
    return this.#color;
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
}
