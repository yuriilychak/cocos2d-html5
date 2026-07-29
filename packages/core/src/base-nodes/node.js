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

import { BaseClass } from "../platform/class";
import { dirtyFlags } from "./node-canvas-render-cmd";
import { Point, Rect, AffineTransform } from "../geometry";
import { Color } from "../platform/types/color";
import { log, assert, _LogInfos } from "../boot/debugger";
import {
  REPEAT_FOREVER,
  ACTION_TAG_INVALID
} from "../platform/macro/constants";

import { arrayRemoveObject } from "../platform/macro/utils";
import { ComponentContainer } from "../components";
import Touch from "../event-manager/touch";
import { CanvasRenderCmd as NodeCanvasRenderCmd } from "./node-canvas-render-cmd";
import { WebGLRenderCmd as NodeWebGLRenderCmd } from "./node-webgl-render-cmd";
import { NodeTransform } from "./node-transform";
import { ServiceLocator } from "../service-locator";
import { BYTE } from "../constants";

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
 * @property {Object}               userObject          - User assigned Object, similar to userData, but instead of holding a void* it holds an id
 * @property {Number}               arrivalOrder        - The arrival order, indicates which children is added previously
 * @property {ActionManager}     actionManager       - The ActionManager object that is used by all actions.
 * @property {Scheduler}         scheduler           - Scheduler used to schedule all "updates" and timers.
 * @property {GridBase}          grid                - grid object that is used when applying effects
 * @property {GLProgram}         shaderProgram       - The shader program currently used for this node
 * @property {Number}               glServerState       - The state of OpenGL server side
 */
export class Node extends BaseClass {
  #tag = NODE_TAG_INVALID;
  #userData = null;

  #transform;

  _localZOrder = 0;
  _globalZOrder = 0;
  _vertexZ = 0.0;
  _customZ = NaN;
  _visible = true;
  _running = false;
  _parent = null;
  userObject = null;
  _reorderChildDirty = false;
  arrivalOrder = 0;
  _actionManager = null;
  _scheduler = null;
  _componentContainer = new ComponentContainer(this);
  _isTransitionFinished = false;
  _className = "Node";
  _showNode = false;
  _name = "";
  _realOpacity = BYTE;
  _realColor = new Color(BYTE, BYTE, BYTE, BYTE);
  _cascadeColorEnabled = false;
  _cascadeOpacityEnabled = false;
  _renderCmd = null;
  _children = [];

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @function
   */
  constructor() {
    super();
    this._renderCmd = this._createRenderCmd();
    this.#transform = new NodeTransform(this._renderCmd);
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

  /**
   *  <p>Returns a copy of the anchor point.<br/>
   *  Anchor point is the point around which all transformations and positioning manipulations take place.<br/>
   *  It's like a pin in the node where it is "attached" to its parent. <br/>
   *  The anchorPoint is normalized, like a percentage. (0,0) means the bottom-left corner and (1,1) means the top-right corner. <br/>
   *  But you can use values higher than (1,1) and lower than (0,0) too.  <br/>
   *  The default anchor point is (0.5,0.5), so it starts at the center of the node. <br/></p>
   * @return {Point}  The anchor point of node.
   */
  get anchor() {
    return this.#transform.anchor;
  }

  /**
   * <p>
   *     Sets the anchor point in percent.                                                                                              <br/>
   *                                                                                                                                    <br/>
   *     anchor point is the point around which all transformations and positioning manipulations take place.                            <br/>
   *     It's like a pin in the node where it is "attached" to its parent.                                                              <br/>
   *     The anchorPoint is normalized, like a percentage. (0,0) means the bottom-left corner and (1,1) means the top-right corner.     <br/>
   *     But you can use values higher than (1,1) and lower than (0,0) too.                                                             <br/>
   *     The default anchor point is (0.5,0.5), so it starts at the center of the node.
   * </p>
   * @function
   * @param {Point} point The anchor point of node or The x axis anchor of node.
   */
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
    return this.getVertexZ();
  }
  set vertexZ(v) {
    this.setVertexZ(v);
  }

  /**
   * Returns the X axis rotation (angle) which represent a horizontal rotational skew of the node in degrees. <br/>
   * 0 is the default rotation angle. Positive values rotate node clockwise<br/>
   * (support only in WebGL rendering mode)
   */

  get rotationX() {
    return this.#transform.rotationX;
  }
  set rotationX(value) {
    this.#transform.rotationX = value;
  }

  /**
   * Returns the Y axis rotation (angle) which represent a vertical rotational skew of the node in degrees. <br/>
   * 0 is the default rotation angle. Positive values rotate node clockwise<br/>
   * (support only in WebGL rendering mode)
   */

  get rotationY() {
    return this.#transform.rotationY;
  }

  set rotationY(value) {
    this.#transform.rotationY = value;
  }

  /**
   * Returns the scale factor of the node.
   * @warning: Assertion will fail when #scale.x != #scale.y.
   * @return {Number} The scale factor
   */
  get scale() {
    return this.#transform.scale;
  }

  /**
   * Sets the scale factor of the node. 1.0 is the default scale factor. This function can modify the X and Y scale at the same time.
   * @param {Number} scale or scaleX value
   */
  set scale(value) {
    this.#transform.scale = value;
  }

  get children() {
    return this.getChildren();
  }

  get childrenCount() {
    return this.getChildrenCount();
  }

  get running() {
    return this.isRunning();
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
    return this.getActionManager();
  }
  set actionManager(v) {
    this.setActionManager(v);
  }

  get scheduler() {
    return this.getScheduler();
  }
  set scheduler(v) {
    this.setScheduler(v);
  }

  get shaderProgram() {
    return this.getShaderProgram();
  }
  set shaderProgram(v) {
    this.setShaderProgram(v);
  }

  get cascadeOpacity() {
    return this.isCascadeOpacityEnabled();
  }
  set cascadeOpacity(v) {
    this.setCascadeOpacityEnabled(v);
  }

  get cascadeColor() {
    return this.isCascadeColorEnabled();
  }
  set cascadeColor(v) {
    this.setCascadeColorEnabled(v);
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

  get skew() {
    return this.#transform.skew;
  }

  set skew(value) {
    this.#transform.skew = value;
  }

  /**
   * <p>Returns the skew degrees in X </br>
   * The X skew angle of the node in degrees.  <br/>
   * This angle describes the shear distortion in the X direction.<br/>
   * Thus, it is the angle between the Y axis and the left edge of the shape </br>
   * The default skewX angle is 0. Positive values distort the node in a CW direction.</br>
   * </p>
   * @function
   * @return {Number} The X skew angle of the node in degrees.
   */
  get skewX() {
    return this.#transform.skewX;
  }

  /**
   * <p>
   * Changes the X skew angle of the node in degrees.                                                    <br/>
   * <br/>
   * This angle describes the shear distortion in the X direction.                                       <br/>
   * Thus, it is the angle between the Y axis and the left edge of the shape                             <br/>
   * The default skewX angle is 0. Positive values distort the node in a CW direction.
   * </p>
   * @function
   * @param {Number} newSkewX The X skew angle of the node in degrees.
   */
  set skewX(newSkewX) {
    this.#transform.skewX = newSkewX;
  }

  /**
   * <p>Returns the skew degrees in Y               <br/>
   * The Y skew angle of the node in degrees.                            <br/>
   * This angle describes the shear distortion in the Y direction.       <br/>
   * Thus, it is the angle between the X axis and the bottom edge of the shape       <br/>
   * The default skewY angle is 0. Positive values distort the node in a W direction.    <br/>
   * </p>
   * @function
   * @return {Number} The Y skew angle of the node in degrees.
   */
  get skewY() {
    return this.#transform.skewY;
  }

  /**
   * <p>
   * Changes the Y skew angle of the node in degrees.                                                        <br/>
   *                                                                                                         <br/>
   * This angle describes the shear distortion in the Y direction.                                           <br/>
   * Thus, it is the angle between the X axis and the bottom edge of the shape                               <br/>
   * The default skewY angle is 0. Positive values distort the node in a W direction.                      <br/>
   * </p>
   * @function
   * @param {Number} newSkewY  The Y skew angle of the node in degrees.
   */
  set skewY(newSkewY) {
    this.#transform.skewY = newSkewY;
  }

  /**
   * <p> LocalZOrder is the 'key' used to sort the node relative to its siblings.                                    <br/>
   *                                                                                                                 <br/>
   * The Node's parent will sort all its children based ont the LocalZOrder value.                                   <br/>
   * If two nodes have the same LocalZOrder, then the node that was added first to the children's array              <br/>
   * will be in front of the other node in the array.                                                                <br/>
   * <br/>
   * Also, the Scene Graph is traversed using the "In-Order" tree traversal algorithm ( http://en.wikipedia.org/wiki/Tree_traversal#In-order )
   * <br/>
   * And Nodes that have LocalZOder values < 0 are the "left" subtree                                                 <br/>
   * While Nodes with LocalZOder >=0 are the "right" subtree.    </p>
   * @function
   * @param {Number} localZOrder
   */
  set zIndex(localZOrder) {
    if (localZOrder === this._localZOrder) return;
    if (this._parent) this._parent.reorderChild(this, localZOrder);
    else this._localZOrder = localZOrder;
    ServiceLocator.eventManager._setDirtyForNode(this);
  }

  //Helper function used by `setLocalZOrder`. Don't use it unless you know what you are doing.
  _setLocalZOrder(localZOrder) {
    this._localZOrder = localZOrder;
  }

  /**
   * Returns the local Z order of this node.
   * @function
   * @returns {Number} The local (relative to its siblings) Z order.
   */
  get zIndex() {
    return this._localZOrder;
  }

  /**
   * <p>Defines the oder in which the nodes are renderer.                                                                               <br/>
   * Nodes that have a Global Z Order lower, are renderer first.                                                                        <br/>
   *                                                                                                                                    <br/>
   * In case two or more nodes have the same Global Z Order, the oder is not guaranteed.                                                <br/>
   * The only exception if the Nodes have a Global Z Order == 0. In that case, the Scene Graph order is used.                           <br/>
   *                                                                                                                                    <br/>
   * By default, all nodes have a Global Z Order = 0. That means that by default, the Scene Graph order is used to render the nodes.    <br/>
   *                                                                                                                                    <br/>
   * Global Z Order is useful when you need to render nodes in an order different than the Scene Graph order.                           <br/>
   *                                                                                                                                    <br/>
   * Limitations: Global Z Order can't be used used by Nodes that have SpriteBatchNode as one of their ancestors.                       <br/>
   * And if ClippingNode is one of the ancestors, then "global Z order" will be relative to the ClippingNode.   </p>
   * @function
   * @param {Number} globalZOrder
   */
  setGlobalZOrder(globalZOrder) {
    if (this._globalZOrder !== globalZOrder) {
      this._globalZOrder = globalZOrder;
      ServiceLocator.eventManager._setDirtyForNode(this);
    }
  }

  /**
   * Return the Node's Global Z Order.
   * @function
   * @returns {number} The node's global Z order
   */
  getGlobalZOrder() {
    return this._globalZOrder;
  }

  /**
   * Returns WebGL Z vertex of this node.
   * @function
   * @return {Number} WebGL Z vertex of this node
   */
  getVertexZ() {
    return this._vertexZ;
  }

  /**
   * <p>
   *     Sets the real WebGL Z vertex.                                                                          <br/>
   *                                                                                                            <br/>
   *      Differences between openGL Z vertex and cocos2d Z order:                                              <br/>
   *      - WebGL Z modifies the Z vertex, and not the Z order in the relation between parent-children         <br/>
   *      - WebGL Z might require to set 2D projection                                                         <br/>
   *      - cocos2d Z order works OK if all the nodes uses the same WebGL Z vertex. eg: vertexZ = 0            <br/>
   *                                                                                                            <br/>
   *      @warning Use it at your own risk since it might break the cocos2d parent-children z order
   * </p>
   * @function
   * @param {Number} Var
   */
  setVertexZ(Var) {
    this._customZ = this._vertexZ = Var;
  }

  /**
   * Returns the rotation (angle) of the node in degrees. 0 is the default rotation angle. Positive values rotate node clockwise.
   * @function
   * @return {Number} The rotation of the node in degrees.
   */
  get rotation() {
    return this.#transform.rotation;
  }

  /**
   * <p>
   *     Sets the rotation (angle) of the node in degrees.                                             <br/>
   *                                                                                                   <br/>
   *      0 is the default rotation angle.                                                             <br/>
   *      Positive values rotate node clockwise, and negative values for anti-clockwise.
   * </p>
   * @function
   * @param {Number} newRotation The rotation of the node in degrees.
   */
  set rotation(newRotation) {
    this.#transform.rotation = newRotation;
  }

  /**
   * Returns the scale factor on X axis of this node
   * @function
   * @return {Number} The scale factor on X axis.
   */
  get scaleX() {
    return this.#transform.scaleX;
  }

  /**
   * <p>
   *     Changes the scale factor on X axis of this node                                   <br/>
   *     The default value is 1.0 if you haven't changed it before
   * </p>
   * @function
   * @param {Number} newScaleX The scale factor on X axis.
   */
  set scaleX(newScaleX) {
    this.#transform.scaleX = newScaleX;
  }

  /**
   * Returns the scale factor on Y axis of this node
   * @function
   * @return {Number} The scale factor on Y axis.
   */
  get scaleY() {
    return this.#transform.scaleY;
  }

  /**
   * <p>
   *     Changes the scale factor on Y axis of this node                                            <br/>
   *     The Default value is 1.0 if you haven't changed it before.
   * </p>
   * @function
   * @param {Number} newScaleY The scale factor on Y axis.
   */
  set scaleY(newScaleY) {
    this.#transform.scaleY = newScaleY;
  }

  /**
   * <p>
   * Sets the position (x,y) using values between 0 and 1.                                                <br/>
   * The positions in pixels is calculated like the following:                                            <br/>
   *   #position = normalizedPosition * parent.contentSize
   * </p>
   * @param {Point} value
   */
  set normalizedPosition(value) {
    this.#transform.normalizedPosition = value;
  }

  /**
   * Returns the normalized position.
   * @returns {Point}
   */
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

  /**
   * <p>Returns the x axis position of the node in cocos2d coordinates.</p>
   * @function
   * @return {Number}
   */
  get x() {
    return this.#transform.x;
  }

  /**
   * <p>Sets the x axis position of the node in cocos2d coordinates.</p>
   * @function
   * @param {Number} x The new position in x axis
   */
  set x(x) {
    this.#transform.x = x;
  }

  /**
   * <p>Returns the y axis position of the node in cocos2d coordinates.</p>
   * @function
   * @return {Number}
   */
  get y() {
    return this.#transform.y;
  }

  /**
   * <p>Sets the y axis position of the node in cocos2d coordinates.</p>
   * @function
   * @param {Number} y The new position in y axis
   */
  set y(y) {
    this.#transform.y = y;
  }

  /**
   * Returns the amount of children.
   * @function
   * @return {Number} The amount of children.
   */
  getChildrenCount() {
    return this._children.length;
  }

  /**
   * Returns an array of all children  <br/>
   * Composing a "tree" structure is a very important feature of Node
   * @function
   * @return {Array} An array of children
   * @example
   *  //This sample code traverses all children nodes, and set their position to (0,0)
   *  var allChildren = parent.getChildren();
   *  for(var i = 0; i< allChildren.length; i++) {
   *      allChildren[i].position = { x: 0, y: 0 };
   *  }
   */
  getChildren() {
    return this._children;
  }

  /**
   * Returns if the node is visible
   * @function
   * @see Node#setVisible
   * @return {Boolean} true if the node is visible, false if the node is hidden.
   */
  get visible() {
    return this._visible;
  }

  /**
   * Sets whether the node is visible <br/>
   * The default value is true
   * @function
   * @param {Boolean} visible Pass true to make the node visible, false to hide the node.
   */
  set visible(visible) {
    if (this._visible !== visible) {
      this._visible = visible;
      //if(visible)
      this._renderCmd.setDirtyFlag(dirtyFlags.transformDirty);
      ServiceLocator.sys.rendererConfig.renderer.childrenOrderDirty = true;
    }
  }

  /**
   * Returns a copy of the anchor point in absolute pixels.  <br/>
   * you can only read it. If you wish to modify it, use anchor
   * @see Node#anchor
   * @function
   * @return {Point} The anchor point in absolute pixels.
   */
  get anchorPointInPoints() {
    return this._renderCmd.anchorPointInPoints;
  }

  /**
   * <p>Returns a copy the untransformed size of the node. <br/>
   * The contentSize remains the same no matter the node is scaled or rotated.<br/>
   * All nodes has a size. Layer and Scene has the same size of the screen by default. <br/></p>
   * @function
   * @return {Size} The untransformed size of the node.
   */
  get contentSize() {
    return this.#transform.contentSize;
  }

  set contentSize(value) {
    this.#transform.contentSize = value;
  }

  /**
   * <p>
   *     Returns whether or not the node accepts event callbacks.                                     <br/>
   *     Running means the node accept event callbacks like onEnter(), onExit(), update()
   * </p>
   * @function
   * @return {Boolean} Whether or not the node is running.
   */
  isRunning() {
    return this._running;
  }

  /**
   * Returns a reference to the parent node
   * @function
   * @return {Node} A reference to the parent node
   */
  get parent() {
    return this._parent;
  }

  /**
   * Sets the parent node
   * @param {Node} parent A reference to the parent node
   */
  set parent(parent) {
    this._parent = parent;
    this._renderCmd.setDirtyFlag(dirtyFlags.transformDirty);
  }

  /**
   * Returns whether the anchor point will be ignored when you position this node.<br/>
   * When anchor point ignored, position will be calculated based on the origin point (0, 0) in parent's coordinates.
   * @return {Boolean} true if the anchor point will be ignored when you position this node.
   */
  get ignoreAnchorPointForPosition() {
    return this.#transform.ignoreAnchorPointForPosition;
  }

  /**
   * <p>
   *     Sets whether the anchor point will be ignored when you position this node.                              <br/>
   *     When anchor point ignored, position will be calculated based on the origin point (0, 0) in parent's coordinates.  <br/>
   *     This is an internal method, only used by Layer and Scene. Don't call it outside framework.        <br/>
   *     The default value is false, while in Layer and Scene are true
   * </p>
   * @param {Boolean} newValue true if anchor point will be ignored when you position this node
   */
  set ignoreAnchorPointForPosition(newValue) {
    this.#transform.ignoreAnchorPointForPosition = newValue;
  }

  /**
   * Returns a tag that is used to identify the node easily.
   * @function
   * @return {Number} An integer that identifies the node.
   * @example
   *  //You can set tags to node then identify them easily.
   * // set tags
   * node1.tag = TAG_PLAYER;
   * node2.tag = TAG_MONSTER;
   * node3.tag = TAG_BOSS;
   * parent.addChild(node1);
   * parent.addChild(node2);
   * parent.addChild(node3);
   * // identify by tags
   * var allChildren = parent.getChildren();
   * for(var i = 0; i < allChildren.length; i++){
   *     switch(node.tag) {
   *         case TAG_PLAYER:
   *             break;
   *         case TAG_MONSTER:
   *             break;
   *         case TAG_BOSS:
   *             break;
   *     }
   * }
   */
  get tag() {
    return this.#tag;
  }

  /**
   * Changes the tag that is used to identify the node easily. <br/>
   * Please refer to getTag for the sample code.
   * @function
   * @see Node#getTag
   * @param {Number} tag A integer that identifies the node.
   */
  set tag(value) {
    this.#tag = value;
  }

  /**
   * Changes the name that is used to identify the node easily.
   * @function
   * @param {String} name
   */
  set name(name) {
    this._name = name;
  }

  /**
   * Returns a string that is used to identify the node.
   * @function
   * @returns {string} A string that identifies the node.
   */
  get name() {
    return this._name;
  }

  /**
   * <p>
   *     Returns a custom user data pointer                                                               <br/>
   *     You can set everything in UserData pointer, a data block, a structure or an object.
   * </p>
   * @function
   * @return {object}  A custom user data pointer
   */
  get userData() {
    return this.#userData;
  }

  /**
   * <p>
   *    Sets a custom user data reference                                                                   <br/>
   *    You can set everything in UserData reference, a data block, a structure or an object, etc.
   * </p>
   * @function
   * @warning Don't forget to release the memory manually in JSB, especially before you change this data pointer, and before this node is autoreleased.
   * @param {object} Var A custom user data
   */
  set userData(Var) {
    this.#userData = Var;
  }

  /**
   * Returns a user assigned cocos2d object.                             <br/>
   * Similar to userData, but instead of holding all kinds of data it can only hold a cocos2d object
   * @function
   * @return {object} A user assigned Object
   */
  getUserObject() {
    return this.userObject;
  }

  /**
   * <p>
   *      Sets a user assigned cocos2d object                                                                                       <br/>
   *      Similar to UserData, but instead of holding all kinds of data it can only hold a cocos2d object                        <br/>
   *      In JSB, the UserObject will be retained once in this method, and the previous UserObject (if existed) will be release. <br/>
   *      The UserObject will be released in Node's destruction.
   * </p>
   * @param {object} newValue A user cocos2d object
   */
  setUserObject(newValue) {
    if (this.userObject !== newValue) this.userObject = newValue;
  }

  /**
   * Returns the arrival order, indicates which children should be added previously.
   * @function
   * @return {Number} The arrival order.
   */
  getOrderOfArrival() {
    return this.arrivalOrder;
  }

  /**
   * <p>
   *     Sets the arrival order when this node has a same ZOrder with other children.                             <br/>
   *                                                                                                              <br/>
   *     A node which called addChild subsequently will take a larger arrival order,                              <br/>
   *     If two children have the same Z order, the child with larger arrival order will be drawn later.
   * </p>
   * @function
   * @warning This method is used internally for zOrder sorting, don't change this manually
   * @param {Number} Var  The arrival order.
   */
  setOrderOfArrival(Var) {
    this.arrivalOrder = Var;
  }

  /**
   * <p>Returns the ActionManager object that is used by all actions.<br/>
   * (IMPORTANT: If you set a new ActionManager, then previously created actions are going to be removed.)</p>
   * @function
   * @see Node#setActionManager
   * @return {ActionManager} A ActionManager object.
   */
  getActionManager() {
    return this._actionManager || ServiceLocator.actionManager;
  }

  /**
   * <p>Sets the ActionManager object that is used by all actions. </p>
   * @function
   * @warning If you set a new ActionManager, then previously created actions will be removed.
   * @param {ActionManager} actionManager A ActionManager object that is used by all actions.
   */
  setActionManager(actionManager) {
    if (this._actionManager !== actionManager) {
      this.stopAllActions();
      this._actionManager = actionManager;
    }
  }

  /**
   * <p>
   *   Returns the Scheduler object used to schedule all "updates" and timers.
   * </p>
   * @function
   * @return {Scheduler} A Scheduler object.
   */
  getScheduler() {
    return this._scheduler || ServiceLocator.scheduler;
  }

  /**
   * <p>
   *   Sets a Scheduler object that is used to schedule all "updates" and timers.           <br/>
   *   IMPORTANT: If you set a new Scheduler, then previously created timers/update are going to be removed.
   * </p>
   * @function
   * @warning If you set a new Scheduler, then previously created timers/update are going to be removed.
   * @param scheduler A Scheduler object that is used to schedule all "update" and timers.
   */
  setScheduler(scheduler) {
    if (this._scheduler !== scheduler) {
      this.unscheduleAllCallbacks();
      this._scheduler = scheduler;
    }
  }

  /**
   * Returns a "local" axis aligned bounding box of the node. <br/>
   * The returned box is relative only to its parent.
   * @function
   * @return {Rect} The calculated bounding box of the node
   */
  get boundingBox() {
    var rect = new Rect(0, 0, this.width, this.height);
    return AffineTransform._applyToRectIn(
      rect,
      this.getNodeToParentTransform()
    );
  }

  /**
   * Stops all running actions and schedulers
   * @function
   */
  cleanup() {
    // actions
    this.stopAllActions();
    this.unscheduleAllCallbacks();

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
    var __children = this._children;
    if (__children !== null) {
      for (var i = 0; i < __children.length; i++) {
        var node = __children[i];
        if (node && node.tag === aTag) return node;
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

    var locChildren = this._children;
    for (var i = 0, len = locChildren.length; i < len; i++) {
      if (locChildren[i]._name === name) return locChildren[i];
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
    localZOrder = localZOrder === undefined ? child._localZOrder : localZOrder;
    var name,
      setTag = false;
    if (tag === undefined) {
      name = child._name;
    } else if (typeof tag === "string") {
      name = tag;
      tag = undefined;
    } else if (typeof tag === "number") {
      setTag = true;
      name = "";
    }

    assert(child, _LogInfos.Node_addChild_3);
    assert(
      child._parent === null,
      "child already added. It can't be added again"
    );

    this._addChildHelper(child, localZOrder, tag, name, setTag);
  }

  _addChildHelper(child, localZOrder, tag, name, setTag) {
    if (!this._children) this._children = [];

    this._insertChild(child, localZOrder);
    if (setTag) child.tag = tag;
    else child.name = name;

    child.parent = this;
    child.setOrderOfArrival(s_globalOrderOfArrival);
    setGlobalOrderOfArrival(s_globalOrderOfArrival + 1);

    if (this._running) {
      child._performRecursive(Node._stateCallbackType.onEnter);
      // prevent onEnterTransitionDidFinish to be called twice when a node is added in onEnter
      if (this._isTransitionFinished)
        child._performRecursive(
          Node._stateCallbackType.onEnterTransitionDidFinish
        );
    }
    child._renderCmd.setDirtyFlag(dirtyFlags.transformDirty);
    if (this._cascadeColorEnabled)
      child._renderCmd.setDirtyFlag(dirtyFlags.colorDirty);
    if (this._cascadeOpacityEnabled)
      child._renderCmd.setDirtyFlag(dirtyFlags.opacityDirty);
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
    if (this._parent) {
      if (cleanup === undefined) cleanup = true;
      this._parent.removeChild(this, cleanup);
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
    if (this._children.length === 0) return;

    if (cleanup === undefined) cleanup = true;
    if (this._children.indexOf(child) > -1) this._detachChild(child, cleanup);

    //this._renderCmd.setDirtyFlag(dirtyFlags.visibleDirty);
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
    var __children = this._children;
    if (__children !== null) {
      if (cleanup === undefined) cleanup = true;
      for (var i = 0; i < __children.length; i++) {
        var node = __children[i];
        if (node) {
          if (this._running) {
            node._performRecursive(
              Node._stateCallbackType.onExitTransitionDidStart
            );
            node._performRecursive(Node._stateCallbackType.onExit);
          }

          // If you don't do cleanup, the node's actions will not get removed and the
          if (cleanup) node._performRecursive(Node._stateCallbackType.cleanup);

          // set parent nil at the end
          node.parent = null;
          node._renderCmd.detachFromParent();
        }
      }
      this._children.length = 0;
      ServiceLocator.sys.rendererConfig.renderer.childrenOrderDirty = true;
    }
  }

  _detachChild(child, doCleanup) {
    // IMPORTANT:
    //  -1st do onExit
    //  -2nd cleanup
    if (this._running) {
      child._performRecursive(Node._stateCallbackType.onExitTransitionDidStart);
      child._performRecursive(Node._stateCallbackType.onExit);
    }

    // If you don't do cleanup, the child's actions will not get removed and the
    if (doCleanup) child._performRecursive(Node._stateCallbackType.cleanup);

    // set parent nil at the end
    child.parent = null;
    child._renderCmd.detachFromParent();
    arrayRemoveObject(this._children, child);
  }

  _insertChild(child, z) {
    ServiceLocator.sys.rendererConfig.renderer.childrenOrderDirty =
      this._reorderChildDirty = true;
    this._children.push(child);
    child._setLocalZOrder(z);
  }

  setNodeDirty() {
    this._renderCmd.setDirtyFlag(dirtyFlags.transformDirty);
  }

  /** Reorders a child according to a new z value. <br/>
   * The child MUST be already added.
   * @function
   * @param {Node} child An already added child node. It MUST be already added.
   * @param {Number} zOrder Z order for drawing priority. Please refer to setZOrder(int)
   */
  reorderChild(child, zOrder) {
    assert(child, _LogInfos.Node_reorderChild);
    if (this._children.indexOf(child) === -1) {
      log(_LogInfos.Node_reorderChild_2);
      return;
    }
    ServiceLocator.sys.rendererConfig.renderer.childrenOrderDirty =
      this._reorderChildDirty = true;
    child.arrivalOrder = s_globalOrderOfArrival;
    setGlobalOrderOfArrival(s_globalOrderOfArrival + 1);
    child._setLocalZOrder(zOrder);
    this._renderCmd.setDirtyFlag(dirtyFlags.orderDirty);
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
    if (this._reorderChildDirty) {
      var _children = this._children;

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
          if (tmp._localZOrder < _children[j]._localZOrder) {
            _children[j + 1] = _children[j];
          } else if (
            tmp._localZOrder === _children[j]._localZOrder &&
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
      this._reorderChildDirty = false;
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
    if (this._parent !== null) {
      this._parent.transformAncestors();
      this._parent.transform();
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
    this._isTransitionFinished = false;
    this._running = true; //should be running before resumeSchedule
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
      children = curr._children;
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
    this._isTransitionFinished = true;
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
    this._running = false;
    this.pause();
    this.removeAllComponents();
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
    assert(action, _LogInfos.Node_runAction);

    this.actionManager.addAction(action, this, !this._running);
    return action;
  }

  /**
   * Stops and removes all actions from the running action list .
   * @function
   */
  stopAllActions() {
    this.actionManager && this.actionManager.removeAllActionsFromTarget(this);
  }

  /**
   * Stops and removes an action from the running action list.
   * @function
   * @param {Action} action An action object to be removed.
   */
  stopAction(action) {
    this.actionManager.removeAction(action);
  }

  /**
   * Removes an action from the running action list by its tag.
   * @function
   * @param {Number} tag A tag that indicates the action to be removed.
   */
  stopActionByTag(tag) {
    if (tag === ACTION_TAG_INVALID) {
      log(_LogInfos.Node_stopActionByTag);
      return;
    }
    this.actionManager.removeActionByTag(tag, this);
  }

  /**
   * Returns an action from the running action list by its tag.
   * @function
   * @see Node#getTag and Node#setTag
   * @param {Number} tag
   * @return {Action} The action object with the given tag.
   */
  getActionByTag(tag) {
    if (tag === ACTION_TAG_INVALID) {
      log(_LogInfos.Node_getActionByTag);
      return null;
    }
    return this.actionManager.getActionByTag(tag, this);
  }

  /** <p>Returns the numbers of actions that are running plus the ones that are schedule to run (actions in actionsToAdd and actions arrays).<br/>
   *    Composable actions are counted as 1 action. Example:<br/>
   *    If you are running 1 Sequence of 7 actions, it will return 1. <br/>
   *    If you are running 7 Sequences of 2 actions, it will return 7.</p>
   * @function
   * @return {Number} The number of actions that are running plus the ones that are schedule to run
   */
  getNumberOfRunningActions() {
    return this.actionManager.numberOfRunningActionsInTarget(this);
  }

  // Node - Callbacks
  // timers
  /**
   * <p>schedules the "update" method.                                                                           <br/>
   * It will use the order number 0. This method will be called every frame.                                  <br/>
   * Scheduled methods with a lower order value will be called before the ones that have a higher order value.<br/>
   * Only one "update" method could be scheduled per node.</p>
   * @function
   */
  scheduleUpdate() {
    this.scheduleUpdateWithPriority(0);
  }

  /**
   * <p>
   * schedules the "update" callback function with a custom priority.
   * This callback function will be called every frame.<br/>
   * Scheduled callback functions with a lower priority will be called before the ones that have a higher value.<br/>
   * Only one "update" callback function could be scheduled per node (You can't have 2 'update' callback functions).<br/>
   * </p>
   * @function
   * @param {Number} priority
   */
  scheduleUpdateWithPriority(priority) {
    this.scheduler.scheduleUpdate(this, priority, !this._running);
  }

  /**
   * Unschedules the "update" method.
   * @function
   * @see Node#scheduleUpdate
   */
  unscheduleUpdate() {
    this.scheduler.unscheduleUpdate(this);
  }

  /**
   * <p>Schedules a custom selector.         <br/>
   * If the selector is already scheduled, then the interval parameter will be updated without scheduling it again.</p>
   * @function
   * @param {function} callback A function wrapped as a selector
   * @param {Number} interval  Tick interval in seconds. 0 means tick every frame. If interval = 0, it's recommended to use scheduleUpdate() instead.
   * @param {Number} repeat    The selector will be executed (repeat + 1) times, you can use kCCRepeatForever for tick infinitely.
   * @param {Number} delay     The amount of time that the first tick will wait before execution.
   * @param {String} key The only string identifying the callback
   */
  schedule(callback, interval, repeat, delay, key) {
    var len = arguments.length;
    if (typeof callback === "function") {
      //callback, interval, repeat, delay, key
      if (len === 1) {
        //callback
        interval = 0;
        repeat = REPEAT_FOREVER;
        delay = 0;
        key = this.__instanceId;
      } else if (len === 2) {
        if (typeof interval === "number") {
          //callback, interval
          repeat = REPEAT_FOREVER;
          delay = 0;
          key = this.__instanceId;
        } else {
          //callback, key
          key = interval;
          interval = 0;
          repeat = REPEAT_FOREVER;
          delay = 0;
        }
      } else if (len === 3) {
        if (typeof repeat === "string") {
          //callback, interval, key
          key = repeat;
          repeat = REPEAT_FOREVER;
        } else {
          //callback, interval, repeat
          key = this.__instanceId;
        }
        delay = 0;
      } else if (len === 4) {
        key = this.__instanceId;
      }
    } else {
      //selector
      //selector, interval
      //selector, interval, repeat, delay
      if (len === 1) {
        interval = 0;
        repeat = REPEAT_FOREVER;
        delay = 0;
      } else if (len === 2) {
        repeat = REPEAT_FOREVER;
        delay = 0;
      }
    }

    assert(callback, _LogInfos.Node_schedule);
    assert(interval >= 0, _LogInfos.Node_schedule_2);

    interval = interval || 0;
    repeat = isNaN(repeat) ? REPEAT_FOREVER : repeat;
    delay = delay || 0;

    this.scheduler.schedule(
      callback,
      this,
      interval,
      repeat,
      delay,
      !this._running,
      key
    );
  }

  /**
   * Schedules a callback function that runs only once, with a delay of 0 or larger
   * @function
   * @see Node#schedule
   * @param {function} callback  A function wrapped as a selector
   * @param {Number} delay  The amount of time that the first tick will wait before execution.
   * @param {String} key The only string identifying the callback
   */
  scheduleOnce(callback, delay, key) {
    //selector, delay
    //callback, delay, key
    if (key === undefined) key = this.__instanceId;
    this.schedule(callback, 0, 0, delay, key);
  }

  /**
   * unschedules a custom callback function.
   * @function
   * @see Node#schedule
   * @param {function} callback_fn  A function wrapped as a selector
   */
  unschedule(callback_fn) {
    //key
    //selector
    if (!callback_fn) return;

    this.scheduler.unschedule(callback_fn, this);
  }

  /**
   * <p>unschedule all scheduled callback functions: custom callback functions, and the 'update' callback function.<br/>
   * Actions are not affected by this method.</p>
   * @function
   */
  unscheduleAllCallbacks() {
    this.scheduler.unscheduleAllForTarget(this);
  }

  /**
   * <p>Resumes all scheduled selectors and actions.<br/>
   * This method is called internally by onEnter</p>
   */
  resume() {
    this.scheduler.resumeTarget(this);
    this.actionManager && this.actionManager.resumeTarget(this);
    ServiceLocator.eventManager.resumeTarget(this);
  }

  /**
   * <p>Pauses all scheduled selectors and actions.<br/>
   * This method is called internally by onExit</p>
   * @function
   */
  pause() {
    this.scheduler.pauseTarget(this);
    this.actionManager && this.actionManager.pauseTarget(this);
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
  get additionalTransform() {
    return this.#transform.additionalTransform;
  }

  get additionalTransformDirty() {
    return this.#transform.additionalTransformDirty;
  }

  set additionalTransform(additionalTransform) {
    this.#transform.additionalTransform = additionalTransform;
  }

  /**
   * Returns the matrix that transform parent's space coordinates to the node's (local) space coordinates.<br/>
   * The matrix is in Pixels.
   * @function
   * @return {AffineTransform}
   */
  getParentToNodeTransform() {
    return this._renderCmd.getParentToNodeTransform();
  }

  /**
   * Returns the world affine transform matrix. The matrix is in Pixels.
   * @function
   * @return {AffineTransform}
   */
  getNodeToWorldTransform() {
    var t = this.getNodeToParentTransform();
    for (var p = this._parent; p !== null; p = p.parent)
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
      this._renderCmd.anchorPointInPoints
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
    var pt = Point.add(nodePoint, this._renderCmd.anchorPointInPoints);
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
   * Update will be called automatically every frame if "scheduleUpdate" is called when the node is "live".<br/>
   * The default behavior is to invoke the visit function of node's componentContainer.<br/>
   * Override me to implement your own update logic.
   * @function
   * @param {Number} dt Delta time since last update
   */
  update(dt) {
    if (this._componentContainer && !this._componentContainer.isEmpty())
      this._componentContainer.visit(dt);
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
    var children = this._children,
      node;
    for (var i = 0; i < children.length; i++) {
      node = children[i];
      if (node) node.updateTransform();
    }
  }

  /**
   * Returns a component identified by the name given.
   * @function
   * @param {String} name The name to search for
   * @return {Component} The component found
   */
  getComponent(name) {
    if (this._componentContainer)
      return this._componentContainer.getComponent(name);
    return null;
  }

  /**
   * Adds a component to the node's component container.
   * @function
   * @param {Component} component
   */
  addComponent(component) {
    if (this._componentContainer) this._componentContainer.add(component);
  }

  /**
   * Removes a component identified by the given name or removes the component object given
   * @function
   * @param {String|Component} component
   */
  removeComponent(component) {
    if (this._componentContainer)
      return this._componentContainer.remove(component);
    return false;
  }

  /**
   * Removes all components of Node, it called when Node is exiting from stage.
   * @function
   */
  removeAllComponents() {
    if (this._componentContainer) this._componentContainer.removeAll();
  }

  /**
   * Recursive method that visit its children and draw them
   * @function
   * @param {Node} parent
   */
  visit(parent = null, renderer = ServiceLocator.sys.rendererConfig.renderer) {
    var cmd = this._renderCmd,
      parentCmd = parent ? parent._renderCmd : null;

    // quick return if not visible
    if (!this._visible) {
      cmd._propagateFlagsDown(parentCmd);
      return;
    }

    cmd.visit(parentCmd, renderer);

    var i,
      children = this._children,
      len = children.length,
      child;
    if (len > 0) {
      if (this._reorderChildDirty) {
        this.sortAllChildren();
      }
      // draw children zOrder < 0
      for (i = 0; i < len; i++) {
        child = children[i];
        if (child._localZOrder < 0) {
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
    this._renderCmd.transform(parentCmd, recursive);
  }

  /**
   * Returns the matrix that transform the node's (local) space coordinates into the parent's space coordinates.<br/>
   * The matrix is in Pixels.
   * @function
   * @return {AffineTransform} The affine transform object
   */
  getNodeToParentTransform(ancestor) {
    var t = this._renderCmd.getNodeToParentTransform();
    if (ancestor) {
      var T = { a: t.a, b: t.b, c: t.c, d: t.d, tx: t.tx, ty: t.ty };
      for (var p = this._parent; p != null && p != ancestor; p = p.parent) {
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
   * Return the shader program currently used for this node
   * @function
   * @return {GLProgram} The shader program currently used for this node
   */
  getShaderProgram() {
    return this._renderCmd.getShaderProgram();
  }

  /**
   * <p>
   *     Sets the shader program for this node
   *
   *     Since v2.0, each rendering node must set its shader program.
   *     It should be set in initialize phase.
   * </p>
   * @function
   * @param {GLProgram} newShaderProgram The shader program which fetches from ShaderCache.
   * @example
   * node.setGLProgram(shaderCache.get(SHADER_POSITION_TEXTURECOLOR));
   */
  setShaderProgram(newShaderProgram) {
    this._renderCmd.setShaderProgram(newShaderProgram);
  }

  setGLProgramState(glProgramState) {
    this._renderCmd.setGLProgramState(glProgramState);
  }

  getGLProgramState() {
    return this._renderCmd.getGLProgramState();
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
    if (!this._children) return rect;

    var locChildren = this._children;
    for (var i = 0; i < locChildren.length; i++) {
      var child = locChildren[i];
      if (child && child._visible) {
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
    if (!this._children) return rect;

    var locChildren = this._children;
    for (var i = 0; i < locChildren.length; i++) {
      var child = locChildren[i];
      if (child && child._visible) {
        var childRect = child._getBoundingBoxToCurrentNode(trans);
        if (childRect) rect = Rect.union(rect, childRect);
      }
    }
    return rect;
  }

  /**
   * Returns the opacity of Node
   * @function
   * @returns {number} opacity
   */
  get opacity() {
    return this._realOpacity;
  }

  /**
   * Returns the displayed opacity of Node,
   * the difference between displayed opacity and opacity is that displayed opacity is calculated based on opacity and parent node's opacity when cascade opacity enabled.
   * @function
   * @returns {number} displayed opacity
   */
  getDisplayedOpacity() {
    return this._renderCmd.getDisplayedOpacity();
  }

  /**
   * Sets the opacity of Node
   * @function
   * @param {Number} opacity
   */
  set opacity(opacity) {
    this._realOpacity = opacity;
    this._renderCmd.setDirtyFlag(dirtyFlags.opacityDirty);
  }

  /**
   * Update displayed opacity
   * @function
   * @param {Number} parentOpacity
   */
  updateDisplayedOpacity(parentOpacity) {
    //TODO  this API shouldn't be public.
    this._renderCmd._updateDisplayOpacity(parentOpacity);
  }

  /**
   * Returns whether node's opacity value affect its child nodes.
   * @function
   * @returns {boolean}
   */
  isCascadeOpacityEnabled() {
    return this._cascadeOpacityEnabled;
  }

  /**
   * Enable or disable cascade opacity, if cascade enabled, child nodes' opacity will be the multiplication of parent opacity and its own opacity.
   * @function
   * @param {boolean} cascadeOpacityEnabled
   */
  setCascadeOpacityEnabled(cascadeOpacityEnabled) {
    if (this._cascadeOpacityEnabled === cascadeOpacityEnabled) return;
    this._cascadeOpacityEnabled = cascadeOpacityEnabled;
    this._renderCmd.setCascadeOpacityEnabledDirty();
  }

  /**
   * Returns the color of Node
   * @function
   * @returns {Color}
   */
  get color() {
    return this._realColor.clone();
  }

  /**
   * Returns the displayed color of Node,
   * the difference between displayed color and color is that displayed color is calculated based on color and parent node's color when cascade color enabled.
   * @function
   * @returns {Color}
   */
  getDisplayedColor() {
    return this._renderCmd.getDisplayedColor();
  }

  /**
   * <p>Sets the color of Node.<br/>
   * When color doesn't include opacity value like color(128,128,128), this function only change the color. <br/>
   * When color include opacity like color(128,128,128,100), then this function will change the color and the opacity.</p>
   * @function
   * @param {Color} color The new color given
   */
  set color(color) {
    var locRealColor = this._realColor;
    locRealColor.r = color.r;
    locRealColor.g = color.g;
    locRealColor.b = color.b;
    this._renderCmd.setDirtyFlag(dirtyFlags.colorDirty);
  }

  /**
   * Update the displayed color of Node
   * @function
   * @param {Color} parentColor
   */
  updateDisplayedColor(parentColor) {
    //TODO  this API shouldn't be public.
    this._renderCmd._updateDisplayColor(parentColor);
  }

  /**
   * Returns whether node's color value affect its child nodes.
   * @function
   * @returns {boolean}
   */
  isCascadeColorEnabled() {
    return this._cascadeColorEnabled;
  }

  /**
   * Enable or disable cascade color, if cascade enabled, child nodes' opacity will be the cascade value of parent color and its own color.
   * @param {boolean} cascadeColorEnabled
   */
  setCascadeColorEnabled(cascadeColorEnabled) {
    if (this._cascadeColorEnabled === cascadeColorEnabled) return;
    this._cascadeColorEnabled = cascadeColorEnabled;
    this._renderCmd.setCascadeColorEnabledDirty();
  }

  /**
   * Set whether color should be changed with the opacity value,
   * useless in Node, but this function is override in some class to have such behavior.
   * @function
   * @param {Boolean} opacityValue
   */
  set isOpacityModifyRGB(opacityValue) {}

  /**
   * Get whether color should be changed with the opacity value
   * @function
   * @return {Boolean}
   */
  get isOpacityModifyRGB() {
    return false;
  }

  _createRenderCmd() {
    if (ServiceLocator.sys.rendererConfig.isCanvas)
      return new NodeCanvasRenderCmd(this);
    else return new NodeWebGLRenderCmd(this);
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
      children = this._children,
      length = children.length;
    for (var i = 0; i < length; i++) {
      child = children[i];
      if (child._name.indexOf(searchName) !== -1) {
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
      children = curr._children;
      if (children && children.length > 0) {
        parentCmd = curr._renderCmd;
        for (i = 0, len = children.length; i < len; ++i) {
          child = children[i];
          stack[index] = child;
          index++;
          child._renderCmd.transform(parentCmd);
        }
      }
      const pChildren = curr._protectedChildren;
      if (pChildren && pChildren.length > 0) {
        parentCmd = curr._renderCmd;
        for (i = 0, len = pChildren.length; i < len; ++i) {
          child = pChildren[i];
          stack[index] = child;
          index++;
          child._renderCmd.transform(parentCmd);
        }
      }
    }
    Node._performing--;
  }
}
