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

import { Node } from "../base-nodes/node";
import { log, assert, _LogInfos } from "../boot/debugger";
import TextureCache from "../textures/texture-cache";
import {
  BLEND_DST,
  BLEND_SRC
} from "../platform/macro/constants";

/**
 * <p>
 *     A SpriteBatchNode can reference one and only one texture (one image file, one texture atlas).<br/>
 *     Only the Sprites that are contained in that texture can be added to the SpriteBatchNode.<br/>
 *     All Sprites added to a SpriteBatchNode are drawn in one WebGL draw call. <br/>
 *     If the Sprites are not added to a SpriteBatchNode then an WebGL draw call will be needed for each one, which is less efficient. <br/>
 *     <br/>
 *     Limitations:<br/>
 *       - The only object that is accepted as child (or grandchild, grand-grandchild, etc...) is Sprite or any subclass of Sprite. <br/>
 *          eg: particles, labels and layer can't be added to a SpriteBatchNode. <br/>
 *       - Either all its children are Aliased or Antialiased. It can't be a mix. <br/>
 *          This is because "alias" is a property of the texture, and all the sprites share the same texture. </br>
 * </p>
 *
 * @param {String|Texture2D} fileImage
 * @example
 *
 * // 1. create a SpriteBatchNode with image path
 * var spriteBatchNode = new SpriteBatchNode("res/animations/grossini.png");
 *
 * // 2. create a SpriteBatchNode with texture
 * var texture = TextureCache.getInstance().addImage("res/animations/grossini.png");
 * var spriteBatchNode = new SpriteBatchNode(texture);
 *
 * @property {TextureAtlas}  textureAtlas    - The texture atlas
 * @property {Array}            descendants     - <@readonly> Descendants of sprite batch node
 */
export class SpriteBatchNode extends Node {
  constructor(fileImage) {
    super();
    this._blendFunc = null;
    // all descendants: chlidren, gran children, etc...
    this._texture = null;
    this._className = "SpriteBatchNode";
    this._blendFunc = new cc.BlendFunc(BLEND_SRC, BLEND_DST);

    var texture2D;
    if (cc.isString(fileImage)) {
      texture2D = TextureCache.getInstance().getTextureForKey(fileImage);
      if (!texture2D) texture2D = TextureCache.getInstance().addImage(fileImage);
    } else if (fileImage instanceof cc.Texture2D) texture2D = fileImage;

    texture2D && this.initWithTexture(texture2D);
  }

  /**
   * <p>
   *    Initializes a SpriteBatchNode with a file image (.png, .jpeg, .pvr, etc) and a capacity of children.<br/>
   *    The capacity will be increased in 33% in runtime if it run out of space.<br/>
   *    The file will be loaded using the TextureMgr.<br/>
   *    Please pass parameters to constructor to initialize the sprite batch node, do not call this function yourself.
   * </p>
   * @param {String} fileImage
   * @param {Number} capacity
   * @return {Boolean}
   */
  initWithFile(fileImage, capacity) {
    var texture2D = TextureCache.getInstance().getTextureForKey(fileImage);
    if (!texture2D) texture2D = TextureCache.getInstance().addImage(fileImage);
    return this.initWithTexture(texture2D, capacity);
  }

  /**
   * <p>
   *    initializes a SpriteBatchNode with a file image (.png, .jpeg, .pvr, etc) and a capacity of children.<br/>
   *    The capacity will be increased in 33% in runtime if it run out of space.<br/>
   *    The file will be loaded using the TextureMgr.<br/>
   *    Please pass parameters to constructor to initialize the sprite batch node, do not call this function yourself.
   * </p>
   * @param {String} fileImage
   * @param {Number} capacity
   * @return {Boolean}
   */
  init(fileImage, capacity) {
    var texture2D = TextureCache.getInstance().getTextureForKey(fileImage);
    if (!texture2D) texture2D = TextureCache.getInstance().addImage(fileImage);
    return this.initWithTexture(texture2D, capacity);
  }

  /**
   * Removes a child given a certain index. It will also cleanup the running actions depending on the cleanup parameter.
   * @warning Removing a child from a SpriteBatchNode is very slow
   * @param {Number} index
   * @param {Boolean} doCleanup
   */
  removeChildAtIndex(index, doCleanup) {
    this.removeChild(this._children[index], doCleanup);
  }

  /**
   * Sets the source and destination blending function for the texture
   * @param {Number | BlendFunc} src
   * @param {Number} dst
   */
  setBlendFunc(src, dst) {
    if (dst === undefined) this._blendFunc = src;
    else this._blendFunc = { src: src, dst: dst };
  }

  /**
   * Returns the blending function used for the texture
   * @return {BlendFunc}
   */
  getBlendFunc() {
    return new cc.BlendFunc(this._blendFunc.src, this._blendFunc.dst);
  }

  /**
   * <p>
   *   Updates a quad at a certain index into the texture atlas. The Sprite won't be added into the children array.                 <br/>
   *   This method should be called only when you are dealing with very big AtlasSrite and when most of the Sprite won't be updated.<br/>
   *   For example: a tile map (TMXMap) or a label with lots of characters (BitmapFontAtlas)<br/>
   * </p>
   * @function
   * @param {Sprite} sprite
   * @param {Number} index
   */
  updateQuadFromSprite(sprite, index) {
    assert(sprite, _LogInfos.CCSpriteBatchNode_updateQuadFromSprite_2);
    if (!(sprite instanceof cc.Sprite)) {
      log(_LogInfos.CCSpriteBatchNode_updateQuadFromSprite);
      return;
    }

    //
    // update the quad directly. Don't add the sprite to the scene graph
    //
    sprite.dirty = true;
    // UpdateTransform updates the textureAtlas quad
    sprite._renderCmd.transform(this._renderCmd, true);
  }

  /**
   * Add child at the end
   * @function
   * @param {Sprite} sprite
   */
  appendChild(sprite) {
    this.sortAllChildren();
    var lastLocalZOrder =
      this._children[this._children.length - 1]._localZOrder;
    this.addChild(sprite.lastLocalZOrder + 1);
  }

  /**
   * Set the texture property
   * @function
   * @param {Texture2D} tex
   * @return {Boolean}
   */
  initWithTexture(tex) {
    this.setTexture(tex);
    return true;
  }

  // TextureProtocol
  /**
   * Returns texture of the sprite batch node
   * @function
   * @return {Texture2D}
   */
  getTexture() {
    return this._texture;
  }

  /**
   * Sets the texture of the sprite batch node.
   * @function
   * @param {Texture2D} texture
   */
  setTexture(texture) {
    this._texture = texture;

    if (texture._textureLoaded) {
      var i,
        children = this._children,
        len = children.length;
      for (i = 0; i < len; ++i) {
        children[i].setTexture(texture);
      }
    } else {
      texture.addEventListener(
        "load",
        function () {
          var i,
            children = this._children,
            len = children.length;
          for (i = 0; i < len; ++i) {
            children[i].setTexture(texture);
          }
        },
        this
      );
    }
  }

  setShaderProgram(newShaderProgram) {
    this._renderCmd.setShaderProgram(newShaderProgram);
    var i,
      children = this._children,
      len = children.length;
    for (i = 0; i < len; ++i) {
      children[i].setShaderProgram(newShaderProgram);
    }
  }

  /**
   * Add child to the sprite batch node (override addChild of Node)
   * @function
   * @override
   * @param {Sprite} child
   * @param {Number} [zOrder]
   * @param {Number} [tag]
   */
  addChild(child, zOrder, tag) {
    assert(child !== undefined, _LogInfos.CCSpriteBatchNode_addChild_3);

    if (!this._isValidChild(child)) return;

    zOrder = zOrder === undefined ? child.zIndex : zOrder;
    tag = tag === undefined ? child.tag : tag;
    super.addChild(child, zOrder, tag);

    // Apply shader
    if (this._renderCmd._shaderProgram) {
      child.shaderProgram = this._renderCmd._shaderProgram;
    }
  }

  _isValidChild(child) {
    if (!(child instanceof cc.Sprite)) {
      log(_LogInfos.Sprite_addChild_4);
      return false;
    }
    if (child.texture !== this._texture) {
      log(_LogInfos.Sprite_addChild_5);
      return false;
    }
    return true;
  }

  get texture() {
    return this.getTexture();
  }

  set texture(value) {
    this.setTexture(value);
  }

  get shaderProgram() {
    return this.getShaderProgram();
  }

  set shaderProgram(value) {
    this.setShaderProgram(value);
  }
}
