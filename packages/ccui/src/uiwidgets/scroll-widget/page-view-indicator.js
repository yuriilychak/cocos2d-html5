/****************************************************************************
 Copyright (c) 2015 Neo Kim (neo.kim@neofect.com)
 Copyright (c) 2015 Nikita Besshaposhnikov (nikita.besshaposhnikov@gmail.com)

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

import { Point, Color, Sprite } from '@aspect/core';
import { ProtectedNode } from '../../base-classes/protected-node';
import { Widget } from '../../base-classes/widget';
import { helper } from '../../system/helper';
import { ScrollView } from './scroll-view';

/**
 * The PageViewIndicator control of Cocos UI <br/>
 * Indicator being attached to page view.
 * @property {Number}               spaceBetweenIndexNodes             - Space between index nodes in PageViewIndicator
 */
export class PageViewIndicator extends ProtectedNode {
    _direction = null;
    _indexNodes = null;
    _currentIndexNode = null;
    _spaceBetweenIndexNodes = 0;
    _indexNodesScale = 1.0;
    _indexNodesColor = null;
    _useDefaultTexture = true;
    _indexNodesTextureFile = "";
    _indexNodesTexType = Widget.LOCAL_TEXTURE;

    _className = "PageViewIndicator";

    /**
     * Allocates and initializes a PageViewIndicator.
     * Constructor of PageViewIndicator. override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
     */
    constructor() {
        super();

        this._direction = ScrollView.DIR_HORIZONTAL;
        this._indexNodes = [];
        this._spaceBetweenIndexNodes = PageViewIndicator.SPACE_BETWEEN_INDEX_NODES_DEFAULT;
        this._indexNodesColor = Color.WHITE;

        this._currentIndexNode = helper._createSpriteFromBase64(PageViewIndicator.CIRCLE_IMAGE, PageViewIndicator.CIRCLE_IMAGE_KEY);
        this._currentIndexNode.setVisible(false);
        this.addProtectedChild(this._currentIndexNode, 1);

        // this.setCascadeColorEnabled(true);
        // this.setCascadeOpacityEnabled(true);
    }

    get spaceBetweenIndexNodes() { return this.getSpaceBetweenIndexNodes(); }
    set spaceBetweenIndexNodes(v) { this.setSpaceBetweenIndexNodes(v); }


    /**
     * Sets direction of indicator
     * @param {ScrollView.DIR_NONE | ScrollView.DIR_VERTICAL | ScrollView.DIR_HORIZONTAL | ScrollView.DIR_BOTH} direction
     */
    setDirection(direction) {
        this._direction = direction;
        this._rearrange();
    }

    /**
     * resets indicator with new page count.
     * @param {number} numberOfTotalPages
     */
    reset(numberOfTotalPages) {
        while (this._indexNodes.length < numberOfTotalPages) {
            this._increaseNumberOfPages();
        }
        while (this._indexNodes.length > numberOfTotalPages) {
            this._decreaseNumberOfPages();
        }
        this._rearrange();
        this._currentIndexNode.setVisible(this._indexNodes.length > 0);
    }

    /**
     * Indicates node by index
     * @param {number} index
     */
    indicate(index) {
        if (index < 0 || index >= this._indexNodes.length) {
            return;
        }
        this._currentIndexNode.setPosition(this._indexNodes[index].getPosition());
    }

    _rearrange() {
        if (this._indexNodes.length === 0) {
            return;
        }

        var horizontal = (this._direction === ScrollView.DIR_HORIZONTAL);

        // Calculate total size
        var indexNodeSize = this._indexNodes[0].getContentSize();
        var sizeValue = (horizontal ? indexNodeSize.width : indexNodeSize.height);

        var numberOfItems = this._indexNodes.length;
        var totalSizeValue = sizeValue * numberOfItems + this._spaceBetweenIndexNodes * (numberOfItems - 1);

        var posValue = -(totalSizeValue / 2) + (sizeValue / 2);
        for (var i = 0; i < this._indexNodes.length; ++i) {
            var position;
            if (horizontal) {
                position = new Point(posValue, indexNodeSize.height / 2.0);
            }
            else {
                position = new Point(indexNodeSize.width / 2.0, -posValue);
            }
            this._indexNodes[i].setPosition(position);
            posValue += sizeValue + this._spaceBetweenIndexNodes;
        }
    }

    /**
     * Sets space between index nodes.
     * @param {number} spaceBetweenIndexNodes
     */
    setSpaceBetweenIndexNodes(spaceBetweenIndexNodes) {
        if (this._spaceBetweenIndexNodes === spaceBetweenIndexNodes) {
            return;
        }
        this._spaceBetweenIndexNodes = spaceBetweenIndexNodes;
        this._rearrange();
    }

    /**
     * Gets space between index nodes.
     * @returns {number}
     */
    getSpaceBetweenIndexNodes() {
        return this._spaceBetweenIndexNodes;
    }

    /**
     * Sets color of selected index node
     * @param {Color} color
     */
    setSelectedIndexColor(color) {
        this._currentIndexNode.setColor(color);
    }

    /**
     * Gets color of selected index node
     * @returns {Color}
     */
    getSelectedIndexColor() {
        return this._currentIndexNode.getColor();
    }

    /**
     * Sets color of index nodes
     * @param {Color} indexNodesColor
     */
    setIndexNodesColor(indexNodesColor) {
        this._indexNodesColor = indexNodesColor;

        for (var i = 0; i < this._indexNodes.length; ++i) {
            this._indexNodes[i].setColor(indexNodesColor);
        }
    }

    /**
     * Gets color of index nodes
     * @returns {Color}
     */
    getIndexNodesColor() {
        var locRealColor = this._indexNodesColor;
        return new Color(locRealColor.r, locRealColor.g, locRealColor.b, locRealColor.a);
    }

    /**
     * Sets scale of index nodes
     * @param {Number} indexNodesScale
     */
    setIndexNodesScale(indexNodesScale) {
        if (this._indexNodesScale === indexNodesScale) {
            return;
        }
        this._indexNodesScale = indexNodesScale;

        this._currentIndexNode.setScale(indexNodesScale);

        for (var i = 0; i < this._indexNodes.length; ++i) {
            this._indexNodes[i].setScale(this, _indexNodesScale);
        }

        this._rearrange();
    }

    /**
     * Gets scale of index nodes
     * @returns {Number}
     */
    getIndexNodesScale() {
        return this._indexNodesScale;
    }

    /**
     * Sets texture of index nodes
     * @param {String} texName
     * @param {Widget.LOCAL_TEXTURE | Widget.PLIST_TEXTURE} [texType = Widget.LOCAL_TEXTURE]
     */
    setIndexNodesTexture(texName, texType) {
        if (texType === undefined)
            texType = Widget.LOCAL_TEXTURE;

        this._useDefaultTexture = false;
        this._indexNodesTextureFile = texName;
        this._indexNodesTexType = texType;

        switch (texType) {
            case Widget.LOCAL_TEXTURE:
                this._currentIndexNode.setTexture(texName);
                for (var i = 0; i < this._indexNodes.length; ++i) {
                    this._indexNodes[i].setTexture(texName);
                }
                break;
            case Widget.PLIST_TEXTURE:
                this._currentIndexNode.setSpriteFrame(texName);
                for (var i = 0; i < this._indexNodes.length; ++i) {
                    this._indexNodes[i].setSpriteFrame(texName);
                }
                break;
            default:
                break;
        }

        this._rearrange();
    }

    _increaseNumberOfPages() {
        var indexNode;

        if (this._useDefaultTexture) {
            indexNode = helper._createSpriteFromBase64(PageViewIndicator.CIRCLE_IMAGE, PageViewIndicator.CIRCLE_IMAGE_KEY);
        }
        else {
            indexNode = new Sprite();
            switch (this._indexNodesTexType) {
                case Widget.LOCAL_TEXTURE:
                    indexNode.initWithFile(this._indexNodesTextureFile);
                    break;
                case Widget.PLIST_TEXTURE:
                    indexNode.initWithSpriteFrameName(this._indexNodesTextureFile);
                    break;
                default:
                    break;
            }
        }

        indexNode.setColor(this._indexNodesColor);
        indexNode.setScale(this._indexNodesScale);

        this.addProtectedChild(indexNode);
        this._indexNodes.push(indexNode);
    }

    _decreaseNumberOfPages() {
        if (this._indexNodes.length === 0) {
            return;
        }
        this.removeProtectedChild(this._indexNodes[0]);
        this._indexNodes.splice(0, 1);
    }

    /**
     * Removes all index nodes.
     */
    clear() {
        for (var i = 0; i < this._indexNodes.length; ++i) {
            this.removeProtectedChild(this._indexNodes[i]);
        }
        this._indexNodes.length = 0;
        this._currentIndexNode.setVisible(false);
    }
}

/**
 * @ignore
 */
PageViewIndicator.SPACE_BETWEEN_INDEX_NODES_DEFAULT = 23;
PageViewIndicator.CIRCLE_IMAGE_KEY = "/__circle_image";
PageViewIndicator.CIRCLE_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAA8ElEQVRIx62VyRGCQBBF+6gWRCEmYDIQkhiBCgHhSclC8YqWzOV5oVzKAYZp3r1/9fpbxAIBMTsKrjx5cqVgR0wgLhCRUWOjJiPqD56xoaGPhpRZV/iSEy6crHmw5oIrF9b/lVeMofrJgjlnxlIy/wik+JB+mme8BExbBhm+5CJC2LE2LtSEQoyGWDioBA5CoRIohJtK4CYDxzNEM4GAugR1E9VjVC+SZpXvhCJCrjomESLvc17pDGX7bWmlh6UtpjPVCWy9zaJ0TD7qfm3pwERMz2trRVZk3K3BD/L34AY+dEDCniMVBkPFkT2J/b2/AIV+dRpFLOYoAAAAAElFTkSuQmCC";
