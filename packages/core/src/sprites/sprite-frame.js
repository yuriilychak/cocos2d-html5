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

import { NewClass } from '../platform/class';
import EventHelper from '../event-manager/event-helper';
import { Point } from '../cocoa/geometry/point';
import { Rect } from '../cocoa/geometry/rect';
import { Size } from '../cocoa/geometry/size';

/**
 * <p>
 *    A cc.SpriteFrame has:<br/>
 *      - texture: A cc.Texture2D that will be used by the cc.Sprite<br/>
 *      - rectangle: A rectangle of the texture<br/>
 *    <br/>
 *    You can modify the frame of a cc.Sprite by doing:<br/>
 * </p>
 * @class
 * @extends cc.Class
 *
 * @param {String|cc.Texture2D} filename
 * @param {cc.Rect} rect If parameters' length equal 2, rect in points, else rect in pixels
 * @param {Boolean} [rotated] Whether the frame is rotated in the texture
 * @param {cc.Point} [offset] The offset of the frame in the texture
 * @param {cc.Size} [originalSize] The size of the frame in the texture
 *
 * @example
 * // 1. Create a cc.SpriteFrame with image path
 * var frame1 = new cc.SpriteFrame("res/grossini_dance.png",cc.rect(0,0,90,128));
 * var frame2 = new cc.SpriteFrame("res/grossini_dance.png",cc.rect(0,0,90,128),false,0,cc.size(90,128));
 *
 * // 2. Create a cc.SpriteFrame with a texture, rect, rotated, offset and originalSize in pixels.
 * var texture = cc.textureCache.addImage("res/grossini_dance.png");
 * var frame1 = new cc.SpriteFrame(texture, cc.rect(0,0,90,128));
 * var frame2 = new cc.SpriteFrame(texture, cc.rect(0,0,90,128),false,0,cc.size(90,128));
 */
export class SpriteFrame extends EventHelper(NewClass) {
    constructor(filename, rect, rotated, offset, originalSize) {
        super();
        this._offset = null;
        this._originalSize = null;
        this._rectInPixels = null;
        this._rotated = false;
        this._rect = null;
        this._offsetInPixels = null;
        this._originalSizeInPixels = null;
        this._texture = null;
        this._textureFilename = "";
        this._textureLoaded = false;
        this._offset = new Point(0, 0);
        this._offsetInPixels = new Point(0, 0);
        this._originalSize = new Size(0, 0);
        this._rotated = false;
        this._originalSizeInPixels = new Size(0, 0);
        this._textureFilename = "";
        this._texture = null;
        this._textureLoaded = false;

        if (filename !== undefined && rect !== undefined) {
            if (
                rotated === undefined ||
                offset === undefined ||
                originalSize === undefined
            )
                this.initWithTexture(filename, rect);
            else
                this.initWithTexture(filename, rect, rotated, offset, originalSize);
        }
    }

    /**
     * Returns whether the texture have been loaded
     * @returns {boolean}
     */
    textureLoaded() {
        return this._textureLoaded;
    }

    /**
     * Gets the rect of the frame in the texture
     * @return {cc.Rect}
     */
    getRectInPixels() {
        var locRectInPixels = this._rectInPixels;
        return new Rect(
            locRectInPixels.x,
            locRectInPixels.y,
            locRectInPixels.width,
            locRectInPixels.height
        );
    }

    /**
     * Sets the rect of the frame in the texture
     * @param {cc.Rect} rectInPixels
     */
    setRectInPixels(rectInPixels) {
        if (!this._rectInPixels) {
            this._rectInPixels = new Rect(0, 0, 0, 0);
        }
        this._rectInPixels.x = rectInPixels.x;
        this._rectInPixels.y = rectInPixels.y;
        this._rectInPixels.width = rectInPixels.width;
        this._rectInPixels.height = rectInPixels.height;
        this._rect = cc.rectPixelsToPoints(rectInPixels);
    }

    /**
     * Returns whether the sprite frame is rotated in the texture.
     * @return {Boolean}
     */
    isRotated() {
        return this._rotated;
    }

    /**
     * Set whether the sprite frame is rotated in the texture.
     * @param {Boolean} bRotated
     */
    setRotated(bRotated) {
        this._rotated = bRotated;
    }

    /**
     * Returns the rect of the sprite frame in the texture
     * @return {cc.Rect}
     */
    getRect() {
        var locRect = this._rect;
        return new Rect(locRect.x, locRect.y, locRect.width, locRect.height);
    }

    /**
     * Sets the rect of the sprite frame in the texture
     * @param {cc.Rect} rect
     */
    setRect(rect) {
        if (!this._rect) {
            this._rect = new Rect(0, 0, 0, 0);
        }
        this._rect.x = rect.x;
        this._rect.y = rect.y;
        this._rect.width = rect.width;
        this._rect.height = rect.height;
        this._rectInPixels = cc.rectPointsToPixels(this._rect);
    }

    /**
     * Returns the offset of the sprite frame in the texture in pixel
     * @return {cc.Point}
     */
    getOffsetInPixels() {
        return new Point(this._offsetInPixels);
    }

    /**
     * Sets the offset of the sprite frame in the texture in pixel
     * @param {cc.Point} offsetInPixels
     */
    setOffsetInPixels(offsetInPixels) {
        this._offsetInPixels.x = offsetInPixels.x;
        this._offsetInPixels.y = offsetInPixels.y;
        cc._pointPixelsToPointsOut(this._offsetInPixels, this._offset);
    }

    /**
     * Returns the original size of the trimmed image
     * @return {cc.Size}
     */
    getOriginalSizeInPixels() {
        return new Size(this._originalSizeInPixels);
    }

    /**
     * Sets the original size of the trimmed image
     * @param {cc.Size} sizeInPixels
     */
    setOriginalSizeInPixels(sizeInPixels) {
        this._originalSizeInPixels.width = sizeInPixels.width;
        this._originalSizeInPixels.height = sizeInPixels.height;
    }

    /**
     * Returns the original size of the trimmed image
     * @return {cc.Size}
     */
    getOriginalSize() {
        return new Size(this._originalSize);
    }

    /**
     * Sets the original size of the trimmed image
     * @param {cc.Size} sizeInPixels
     */
    setOriginalSize(sizeInPixels) {
        this._originalSize.width = sizeInPixels.width;
        this._originalSize.height = sizeInPixels.height;
    }

    /**
     * Returns the texture of the frame
     * @return {cc.Texture2D}
     */
    getTexture() {
        if (this._texture) return this._texture;
        if (this._textureFilename !== "") {
            var locTexture = cc.textureCache.addImage(this._textureFilename);
            if (locTexture) this._textureLoaded = locTexture.isLoaded();
            return locTexture;
        }
        return null;
    }

    /**
     * Sets the texture of the frame, the texture is retained automatically
     * @param {cc.Texture2D} texture
     */
    setTexture(texture) {
        if (this._texture !== texture) {
            var locLoaded = texture.isLoaded();
            this._textureLoaded = locLoaded;
            this._texture = texture;
            if (!locLoaded) {
                texture.addEventListener(
                    "load",
                    function (sender) {
                        this._textureLoaded = true;
                        if (
                            this._rotated &&
                            cc._renderType === cc.game.RENDER_TYPE_CANVAS
                        ) {
                            var tempElement = sender.getHtmlElementObj();
                            tempElement = cc.Sprite.CanvasRenderCmd._cutRotateImageToCanvas(
                                tempElement,
                                this.getRect()
                            );
                            var tempTexture = new cc.Texture2D();
                            tempTexture.initWithElement(tempElement);
                            tempTexture.handleLoadedTexture();
                            this.setTexture(tempTexture);

                            var rect = this.getRect();
                            this.setRect(new Rect(0, 0, rect.width, rect.height));
                        }
                        var locRect = this._rect;
                        if (locRect.width === 0 && locRect.height === 0) {
                            var w = sender.width,
                                h = sender.height;
                            this._rect.width = w;
                            this._rect.height = h;
                            this._rectInPixels = cc.rectPointsToPixels(this._rect);
                            this._originalSizeInPixels.width = this._rectInPixels.width;
                            this._originalSizeInPixels.height = this._rectInPixels.height;
                            this._originalSize.width = w;
                            this._originalSize.height = h;
                        }
                        //dispatch 'load' event of cc.SpriteFrame
                        this.dispatchEvent("load");
                    },
                    this
                );
            }
        }
    }

    /**
     * Returns the offset of the frame in the texture
     * @return {cc.Point}
     */
    getOffset() {
        return new Point(this._offset);
    }

    /**
     * Sets the offset of the frame in the texture
     * @param {cc.Point} offsets
     */
    setOffset(offsets) {
        this._offset.x = offsets.x;
        this._offset.y = offsets.y;
    }

    /**
     * Clone the sprite frame
     * @returns {SpriteFrame}
     */
    clone() {
        var frame = new SpriteFrame();
        frame.initWithTexture(
            this._textureFilename,
            this._rectInPixels,
            this._rotated,
            this._offsetInPixels,
            this._originalSizeInPixels
        );
        frame.setTexture(this._texture);
        return frame;
    }

    /**
     * Copy the sprite frame
     * @return {cc.SpriteFrame}
     */
    copyWithZone() {
        var copy = new SpriteFrame();
        copy.initWithTexture(
            this._textureFilename,
            this._rectInPixels,
            this._rotated,
            this._offsetInPixels,
            this._originalSizeInPixels
        );
        copy.setTexture(this._texture);
        return copy;
    }

    /**
     * Copy the sprite frame
     * @returns {cc.SpriteFrame}
     */
    copy() {
        return this.copyWithZone();
    }

    /**
     * Initializes SpriteFrame with Texture, rect, rotated, offset and originalSize in pixels.<br/>
     * Please pass parameters to the constructor to initialize the sprite, do not call this function yourself.
     * @param {String|cc.Texture2D} texture
     * @param {cc.Rect} rect if parameters' length equal 2, rect in points, else rect in pixels
     * @param {Boolean} [rotated=false]
     * @param {cc.Point} [offset=cc.p(0,0)]
     * @param {cc.Size} [originalSize=rect.size]
     * @return {Boolean}
     */
    initWithTexture(texture, rect, rotated, offset, originalSize) {
        if (arguments.length === 2) rect = cc.rectPointsToPixels(rect);

        offset = offset || new Point(0, 0);
        originalSize = originalSize || rect;
        rotated = rotated || false;

        if (typeof texture === "string") {
            this._texture = null;
            this._textureFilename = texture;
        } else if (texture instanceof cc.Texture2D) {
            this.setTexture(texture);
        }

        texture = this.getTexture();

        this._rectInPixels = rect;
        this._rect = cc.rectPixelsToPoints(rect);

        if (texture && texture.url && texture.isLoaded()) {
            var _x, _y;
            if (rotated) {
                _x = rect.x + rect.height;
                _y = rect.y + rect.width;
            } else {
                _x = rect.x + rect.width;
                _y = rect.y + rect.height;
            }
            if (_x > texture.getPixelsWide()) {
                cc.error(cc._LogInfos.RectWidth, texture.url);
            }
            if (_y > texture.getPixelsHigh()) {
                cc.error(cc._LogInfos.RectHeight, texture.url);
            }
        }

        this._offsetInPixels.x = offset.x;
        this._offsetInPixels.y = offset.y;
        cc._pointPixelsToPointsOut(offset, this._offset);
        this._originalSizeInPixels.width = originalSize.width;
        this._originalSizeInPixels.height = originalSize.height;
        cc._sizePixelsToPointsOut(originalSize, this._originalSize);
        this._rotated = rotated;
        return true;
    }
}

SpriteFrame._frameWithTextureForCanvas = function (
    texture,
    rect,
    rotated,
    offset,
    originalSize
) {
    var spriteFrame = new SpriteFrame();
    spriteFrame._texture = texture;
    spriteFrame._rectInPixels = rect;
    spriteFrame._rect = cc.rectPixelsToPoints(rect);
    spriteFrame._offsetInPixels.x = offset.x;
    spriteFrame._offsetInPixels.y = offset.y;
    cc._pointPixelsToPointsOut(spriteFrame._offsetInPixels, spriteFrame._offset);
    spriteFrame._originalSizeInPixels.width = originalSize.width;
    spriteFrame._originalSizeInPixels.height = originalSize.height;
    cc._sizePixelsToPointsOut(
        spriteFrame._originalSizeInPixels,
        spriteFrame._originalSize
    );
    spriteFrame._rotated = rotated;
    return spriteFrame;
};
