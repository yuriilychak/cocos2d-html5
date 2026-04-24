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

cc._globalFontSize = cc.ITEM_SIZE;
cc._globalFontName = "Arial";
cc._globalFontNameRelease = false;

/**
 * Subclass cc.MenuItem (or any subclass) to create your custom cc.MenuItem objects.
 * @param {function|String} callback
 * @param  {cc.Node} target
 */
cc.MenuItem = class MenuItem extends cc.Node {
    _enabled = false;
    _target = null;
    _callback = null;
    _isSelected = false;
    _className = "MenuItem";

    /**
     * Constructor of cc.MenuItem
     * @param {function|String} callback
     * @param {cc.Node} target
     */
    constructor(callback, target) {
        super();
        this._target = null;
        this._callback = null;
        this._isSelected = false;
        this._enabled = false;

        super.setAnchorPoint(0.5, 0.5);
        this._target = target || null;
        this._callback = callback || null;
        if (this._callback) {
            this._enabled = true;
        }
    }

    get enabled() { return this.isEnabled(); }
    set enabled(v) { this.setEnabled(v); }

    /**
     * return whether MenuItem is selected
     * @return {Boolean}
     */
    isSelected() {
        return this._isSelected;
    }

    /**
     * only use for jsbinding
     * @param value
     */
    setOpacityModifyRGB(value) {
    }

    /**
     * only use for jsbinding
     * @returns {boolean}
     */
    isOpacityModifyRGB() {
        return false;
    }

    /**
     * return whether MenuItem is Enabled
     * @return {Boolean}
     */
    isEnabled() {
        return this._enabled;
    }

    /**
     * set enable value of MenuItem
     * @param {Boolean} enable
     */
    setEnabled(enable) {
        this._enabled = enable;
    }

    /**
     * initializes a cc.MenuItem with callback
     * @param {function|String} callback
     * @param {cc.Node} target
     * @return {Boolean}
     */
    initWithCallback(callback, target) {
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this._target = target;
        this._callback = callback;
        this._enabled = true;
        this._isSelected = false;
        return true;
    }

    /**
     * return rect value of cc.MenuItem
     * @return {cc.Rect}
     */
    rect() {
        var locPosition = this._position, locContentSize = this._contentSize, locAnchorPoint = this._anchorPoint;
        return new cc.Rect(locPosition.x - locContentSize.width * locAnchorPoint.x,
            locPosition.y - locContentSize.height * locAnchorPoint.y,
            locContentSize.width, locContentSize.height);
    }

    /**
     * set the cc.MenuItem selected same as setIsSelected(true)
     */
    selected() {
        this._isSelected = true;
    }

    /**
     * set the cc.MenuItem unselected same as setIsSelected(false)
     */
    unselected() {
        this._isSelected = false;
    }

    /**
     * set the callback to the menu item
     * @param {function|String} callback
     * @param {cc.Node} target
     */
    setCallback(callback, target) {
        this._target = target;
        this._callback = callback;
    }

    /**
     * call the selector with target
     */
    activate() {
        if (this._enabled) {
            var locTarget = this._target, locCallback = this._callback;
            if (!locCallback)
                return;
            if (locTarget && cc.isString(locCallback)) {
                locTarget[locCallback](this);
            } else if (locTarget && cc.isFunction(locCallback)) {
                locCallback.call(locTarget, this);
            } else
                locCallback(this);
        }
    }
};


/**
 *  Any cc.Node that supports the cc.LabelProtocol protocol can be added.<br/>
 * Supported nodes:<br/>
 * - cc.BitmapFontAtlas<br/>
 * - cc.LabelAtlas<br/>
 * - cc.LabelTTF<br/>
 * @param {cc.Node} label
 * @param {function|String} selector
 * @param {cc.Node} target
 * @example
 * var menuitemLabel = new cc.MenuItemLabel(label,selector,target);
 *
 * @property {String}   string          - Content string of label item
 * @property {cc.Node}  label           - Label of label item
 * @property {cc.Color} disabledColor   - Color of label when it's disabled
 */
cc.MenuItemLabel = class MenuItemLabel extends cc.MenuItem {
    _disabledColor = null;
    _label = null;
    _originalScale = 0;
    _colorBackup = null;

    /**
     * Constructor of cc.MenuItemLabel
     * @param {cc.Node} label
     * @param {function|String} selector
     * @param {cc.Node} target
     */
    constructor(label, selector, target) {
        super(selector, target);
        this._disabledColor = null;
        this._label = null;
        this._colorBackup = null;

        if (label) {
            this._originalScale = 1.0;
            this._colorBackup = cc.color.WHITE;
            this._disabledColor = cc.color(126, 126, 126);
            this.setLabel(label);

            if (label.textureLoaded && !label.textureLoaded()) {
                label.addEventListener("load", function (sender) {
                    this.width = sender.width;
                    this.height = sender.height;
                    if (this.parent instanceof cc.Menu) {
                        this.parent.updateAlign();
                    }
                }, this);
            }

            this.setCascadeColorEnabled(true);
            this.setCascadeOpacityEnabled(true);
        }
    }

    get string() { return this.getString(); }
    set string(v) { this.setString(v); }

    get disabledColor() { return this.getDisabledColor(); }
    set disabledColor(v) { this.setDisabledColor(v); }

    get label() { return this.getLabel(); }
    set label(v) { this.setLabel(v); }

    /**
     * return the disable color for this cc.MenuItemLabel
     * @return {cc.Color}
     */
    getDisabledColor() {
        return this._disabledColor;
    }

    /**
     * set the disable color for this cc.MenuItemLabel
     * @param {cc.Color} color
     */
    setDisabledColor(color) {
        this._disabledColor = color;
    }

    /**
     * return label of cc.MenuItemLabel
     * @return {cc.Node}
     */
    getLabel() {
        return this._label;
    }

    /**
     * set a label for cc.MenuItemLabel
     * @param {cc.Node} label
     */
    setLabel(label) {
        if (label) {
            this.addChild(label);
            label.anchorX = 0;
            label.anchorY = 0;
            this.width = label.width;
            this.height = label.height;
            label.setCascadeColorEnabled(true);
        }

        if (this._label) {
            this.removeChild(this._label, true);
        }

        this._label = label;
    }

    /**
     * set enable value to cc.MenuItemLabel
     * @param {Boolean} enabled
     */
    setEnabled(enabled) {
        if (this._enabled !== enabled) {
            if (!enabled) {
                this._colorBackup = this.color;
                this._opacityBackup = this.opacity;
                this.setColor(this._disabledColor);
                this.setOpacity(128);
            } else {
                this.setColor(this._colorBackup);
                this.setOpacity(this._opacityBackup !== undefined ? this._opacityBackup : 255);
            }
        }
        super.setEnabled(enabled);
    }

    /**
     * initializes a cc.MenuItemLabel with a label
     * @param {cc.Node} label
     * @param {function|String} selector
     * @param {cc.Node} target
     * @return {Boolean}
     */
    initWithLabel(label, selector, target) {
        this.initWithCallback(selector, target);
        this._originalScale = 1.0;
        this._colorBackup = cc.color.WHITE;
        this._disabledColor = cc.color(126, 126, 126);
        this.setLabel(label);

        this.setCascadeColorEnabled(true);
        this.setCascadeOpacityEnabled(true);

        return true;
    }

    /**
     * set the string for  cc.MenuItemLabel
     * @param {String} label
     */
    setString(label) {
        this._label.string = label;
        this.width = this._label.width;
        this.height = this._label.height;
    }

    /**
     * return the string of cc.MenuItemLabel
     * @returns {String}
     */
    getString() {
        return this._label.string;
    }

    /**
     * activate the menu item
     */
    activate() {
        if (this._enabled) {
            this.stopAllActions();
            this.scale = this._originalScale;
            super.activate();
        }
    }

    /**
     * menu item is selected (runs callback)
     */
    selected() {
        if (this._enabled) {
            super.selected();

            var action = this.getActionByTag(cc.ZOOM_ACTION_TAG);
            if (action)
                this.stopAction(action);
            else
                this._originalScale = this.scale;

            var zoomAction = cc.scaleTo(0.1, this._originalScale * 1.2);
            zoomAction.setTag(cc.ZOOM_ACTION_TAG);
            this.runAction(zoomAction);
        }
    }

    /**
     * menu item goes back to unselected state
     */
    unselected() {
        if (this._enabled) {
            super.unselected();
            this.stopActionByTag(cc.ZOOM_ACTION_TAG);
            var zoomAction = cc.scaleTo(0.1, this._originalScale);
            zoomAction.setTag(cc.ZOOM_ACTION_TAG);
            this.runAction(zoomAction);
        }
    }
};



/**
 * Helper class that creates a MenuItemLabel class with a LabelAtlas
 * @param {String} value
 * @param {String} charMapFile
 * @param {Number} itemWidth
 * @param {Number} itemHeight
 * @param {String} startCharMap a single character
 * @param {function|String|Null} callback
 * @param {cc.Node|Null} target
 * @example
 * var menuItem = new cc.MenuItemAtlasFont(param1,param2...);
 */
cc.MenuItemAtlasFont = class MenuItemAtlasFont extends cc.MenuItemLabel {

    /**
     * the contructor of cc.MenuItemAtlasFont
     * @param {String} value
     * @param {String} charMapFile
     * @param {Number} itemWidth
     * @param {Number} itemHeight
     * @param {String} startCharMap a single character
     * @param {function|String|Null} callback
     * @param {cc.Node|Null} target
     */
    constructor(value, charMapFile, itemWidth, itemHeight, startCharMap, callback, target) {
        var label;
        if (value && value.length > 0) {
            label = new cc.LabelAtlas(value, charMapFile, itemWidth, itemHeight, startCharMap);
        }

        super(label, callback, target);
    }

    /**
     * initializes a cc.MenuItemAtlasFont with string
     * @param {String} value
     * @param {String} charMapFile
     * @param {Number} itemWidth
     * @param {Number} itemHeight
     * @param {String} startCharMap a single character
     * @param {function|String|Null} callback
     * @param {cc.Node|Null} target
     * @return {Boolean}
     */
    initWithString(value, charMapFile, itemWidth, itemHeight, startCharMap, callback, target) {
        if (!value || value.length === 0)
            throw new Error("cc.MenuItemAtlasFont.initWithString(): value should be non-null and its length should be greater than 0");

        var label = new cc.LabelAtlas();
        label.initWithString(value, charMapFile, itemWidth, itemHeight, startCharMap);
        if (this.initWithLabel(label, callback, target)) {
            // do something ?
        }
        return true;
    }
};


/**
 * Helper class that creates a MenuItemLabel class with a Label
 * @param {String} value text for the menu item
 * @param {function|String} callback
 * @param {cc.Node} target
 * @example
 * var menuItem = new cc.MenuItemFont(value, callback, target);
 *
 * @property {Number}   fontSize    - Font size of font item
 * @property {String}   fontName    - Font name of font item
 */
cc.MenuItemFont = class MenuItemFont extends cc.MenuItemLabel {
    _fontSize = null;
    _fontName = null;

    /**
     * Constructor of cc.MenuItemFont
     * @param {String} value text for the menu item
     * @param {function|String} callback
     * @param {cc.Node} target
     */
    constructor(value, callback, target) {
        var label;
        if (value && value.length > 0) {
            label = new cc.LabelTTF(value, cc._globalFontName, cc._globalFontSize);
        }

        super(label, callback, target);

        if (value && value.length > 0) {
            this._fontName = cc._globalFontName;
            this._fontSize = cc._globalFontSize;
        }
        else {
            this._fontSize = 0;
            this._fontName = "";
        }
    }

    get fontSize() { return this.getFontSize(); }
    set fontSize(v) { this.setFontSize(v); }

    get fontName() { return this.getFontName(); }
    set fontName(v) { this.setFontName(v); }

    /**
     * initializes cc.MenuItemFont with  string
     * @param {String} value text for the menu item
     * @param {function|String} callback
     * @param {cc.Node} target
     * @return {Boolean}
     */
    initWithString(value, callback, target) {
        if (!value || value.length === 0)
            throw new Error("Value should be non-null and its length should be greater than 0");

        this._fontName = cc._globalFontName;
        this._fontSize = cc._globalFontSize;

        var label = new cc.LabelTTF(value, this._fontName, this._fontSize);
        if (this.initWithLabel(label, callback, target)) {
            // do something ?
        }
        return true;
    }

    /**
     * set the font size for cc.MenuItemFont
     * @param {Number} s
     */
    setFontSize(s) {
        this._fontSize = s;
        this._recreateLabel();
    }

    /**
     *return the font size of cc.MenuItemFont
     * @return {Number}
     */
    getFontSize() {
        return this._fontSize;
    }

    /**
     * set the font name for cc.MenuItemFont
     * @param {String} name
     */
    setFontName(name) {
        this._fontName = name;
        this._recreateLabel();
    }

    /**
     * return the font name for cc.MenuItemFont
     * @return {String}
     */
    getFontName() {
        return this._fontName;
    }

    _recreateLabel() {
        var label = new cc.LabelTTF(this._label.string, this._fontName, this._fontSize);
        this.setLabel(label);
    }
};

/**
 * a shared function to set the fontSize for menuitem font
 * @param {Number} fontSize
 */
cc.MenuItemFont.setFontSize = function (fontSize) {
    cc._globalFontSize = fontSize;
};

/**
 * a shared function to get the font size for menuitem font
 * @return {Number}
 */
cc.MenuItemFont.fontSize = function () {
    return cc._globalFontSize;
};

/**
 * a shared function to set the fontsize for menuitem font
 * @param name
 */
cc.MenuItemFont.setFontName = function (name) {
    if (cc._globalFontNameRelease) {
        cc._globalFontName = '';
    }
    cc._globalFontName = name;
    cc._globalFontNameRelease = true;
};


/**
 * a shared function to get the font name for menuitem font
 * @return {String}
 */
cc.MenuItemFont.fontName = function () {
    return cc._globalFontName;
};



/**
 * MenuItemSprite accepts Node<RGBAProtocol> objects as items.<br/>
 * The images has 3 different states:<br/>
 *   - unselected image<br/>
 *   - selected image<br/>
 *   - disabled image<br/>
 * @param {Image|Null} normalSprite normal state image
 * @param {Image|Null} selectedSprite selected state image
 * @param {Image|cc.Node|Null} three disabled state image OR target node
 * @param {String|function|cc.Node|Null} four callback function name in string or actual function, OR target Node
 * @param {String|function|Null} five callback function name in string or actual function
 *
 * @example
 * var item = new cc.MenuItemSprite(normalImage)//create a menu item from a sprite with no functionality
 * var item = new cc.MenuItemSprite(normalImage, selectedImage)//create a menu Item, nothing will happen when clicked
 * var item = new cc.MenuItemSprite(normalImage, SelectedImage, disabledImage)//same above, but with disabled state image
 * var item = new cc.MenuItemSprite(normalImage, SelectedImage, 'callback', targetNode)//create a menu item, when clicked runs targetNode.callback()
 * var item = new cc.MenuItemSprite(normalImage, SelectedImage, disabledImage, targetNode.callback, targetNode)
 * //same as above, but with disabled image, and passing in callback function
 *
 * @property {cc.Sprite}    normalImage     - Sprite in normal state
 * @property {cc.Sprite}    selectedImage     - Sprite in selected state
 * @property {cc.Sprite}    disabledImage     - Sprite in disabled state
 */
cc.MenuItemSprite = class MenuItemSprite extends cc.MenuItem {
    _normalImage = null;
    _selectedImage = null;
    _disabledImage = null;

    /**
     * Constructor of cc.MenuItemSprite
     * @param {Image|Null} normalSprite normal state image
     * @param {Image|Null} selectedSprite selected state image
     * @param {Image|cc.Node|Null} three disabled state image OR target node
     * @param {String|function|cc.Node|Null} four callback function name in string or actual function, OR target Node
     * @param {String|function|Null} five callback function name in string or actual function
     */
    constructor(normalSprite, selectedSprite, three, four, five) {
        super();
        this._normalImage = null;
        this._selectedImage = null;
        this._disabledImage = null;
        this._loader = new cc.Sprite.LoadManager();

        if (normalSprite !== undefined) {
            //normalSprite = normalSprite;
            selectedSprite = selectedSprite || null;
            var disabledImage, target, callback;
            //when you send 4 arguments, five is undefined
            if (five !== undefined) {
                disabledImage = three;
                callback = four;
                target = five;
            } else if (four !== undefined && cc.isFunction(four)) {
                disabledImage = three;
                callback = four;
            } else if (four !== undefined && cc.isFunction(three)) {
                target = four;
                callback = three;
                disabledImage = null;
            } else if (three === undefined) {
                disabledImage = null;
            }

            this._loader.clear();
            if (normalSprite.textureLoaded && !normalSprite.textureLoaded()) {
                this._loader.once(normalSprite, function () {
                    this.initWithNormalSprite(normalSprite, selectedSprite, disabledImage, callback, target);
                }, this);
                return;
            }

            this.initWithNormalSprite(normalSprite, selectedSprite, disabledImage, callback, target);
        }
    }

    get normalImage() { return this.getNormalImage(); }
    set normalImage(v) { this.setNormalImage(v); }

    get selectedImage() { return this.getSelectedImage(); }
    set selectedImage(v) { this.setSelectedImage(v); }

    get disabledImage() { return this.getDisabledImage(); }
    set disabledImage(v) { this.setDisabledImage(v); }

    /**
     * return the normal status image(cc.Sprite)
     * @return {cc.Sprite}
     */
    getNormalImage() {
        return this._normalImage;
    }

    /**
     * set the normal status image(cc.Sprite)
     * @param {cc.Sprite} normalImage
     */
    setNormalImage(normalImage) {
        if (this._normalImage === normalImage) {
            return;
        }
        if (normalImage) {
            this.addChild(normalImage, 0, cc.NORMAL_TAG);
            normalImage.anchorX = 0;
            normalImage.anchorY = 0;
        }
        if (this._normalImage) {
            this.removeChild(this._normalImage, true);
        }

        this._normalImage = normalImage;
        if(!this._normalImage)
            return;

        this.width = this._normalImage.width;
        this.height = this._normalImage.height;
        this._updateImagesVisibility();

        if (normalImage.textureLoaded && !normalImage.textureLoaded()) {
            normalImage.addEventListener("load", function (sender) {
                this.width = sender.width;
                this.height = sender.height;
                if (this.parent instanceof cc.Menu) {
                    this.parent.updateAlign();
                }
            }, this);
        }
    }

    /**
     * return the selected status image(cc.Sprite) of cc.MenuItemSprite
     * @return {cc.Sprite}
     */
    getSelectedImage() {
        return this._selectedImage;
    }

    /**
     * set the selected status image(cc.Sprite)
     * @param {cc.Sprite} selectedImage
     */
    setSelectedImage(selectedImage) {
        if (this._selectedImage === selectedImage)
            return;

        if (selectedImage) {
            this.addChild(selectedImage, 0, cc.SELECTED_TAG);
            selectedImage.anchorX = 0;
            selectedImage.anchorY = 0;
        }

        if (this._selectedImage) {
            this.removeChild(this._selectedImage, true);
        }

        this._selectedImage = selectedImage;
        this._updateImagesVisibility();
    }

    /**
     * return the disabled status of cc.MenuItemSprite
     * @return {cc.Sprite}
     */
    getDisabledImage() {
        return this._disabledImage;
    }

    /**
     * set the disabled status image(cc.Sprite)
     * @param {cc.Sprite} disabledImage
     */
    setDisabledImage(disabledImage) {
        if (this._disabledImage === disabledImage)
            return;

        if (disabledImage) {
            this.addChild(disabledImage, 0, cc.DISABLE_TAG);
            disabledImage.anchorX = 0;
            disabledImage.anchorY = 0;
        }

        if (this._disabledImage)
            this.removeChild(this._disabledImage, true);

        this._disabledImage = disabledImage;
        this._updateImagesVisibility();
    }

    /**
     * initializes cc.MenuItemSprite with a cc.Sprite
     * @param {cc.Node} normalSprite
     * @param {cc.Node} selectedSprite
     * @param {cc.Node} disabledSprite
     * @param {function|String} callback
     * @param {cc.Node} target
     * @return {Boolean}
     */
    initWithNormalSprite(normalSprite, selectedSprite, disabledSprite, callback, target) {
        this._loader.clear();
        if (normalSprite.textureLoaded && !normalSprite.textureLoaded()) {
            this._loader.once(normalSprite, function () {
                this.initWithNormalSprite(normalSprite, selectedSprite, disabledSprite, callback, target);
            }, this);
            return false;
        }
        this.initWithCallback(callback, target);
        this.setNormalImage(normalSprite);
        this.setSelectedImage(selectedSprite);
        this.setDisabledImage(disabledSprite);
        var locNormalImage = this._normalImage;
        if (locNormalImage) {
            this.width = locNormalImage.width;
            this.height = locNormalImage.height;
        }
        this.setCascadeColorEnabled(true);
        this.setCascadeOpacityEnabled(true);
        return true;
    }

    /**
     * menu item is selected (runs callback)
     */
    selected() {
        super.selected();
        if (this._normalImage) {
            if (this._disabledImage)
                this._disabledImage.visible = false;

            if (this._selectedImage) {
                this._normalImage.visible = false;
                this._selectedImage.visible = true;
            } else
                this._normalImage.visible = true;
        }
    }

    /**
     * menu item goes back to unselected state
     */
    unselected() {
        super.unselected();
        if (this._normalImage) {
            this._normalImage.visible = true;

            if (this._selectedImage)
                this._selectedImage.visible = false;

            if (this._disabledImage)
                this._disabledImage.visible = false;
        }
    }

    /**
     * set cc.MenuItemSprite  enable to receive the touch event
     * @param {Boolean} bEnabled
     */
    setEnabled(bEnabled) {
        if (this._enabled !== bEnabled) {
            super.setEnabled(bEnabled);
            this._updateImagesVisibility();
        }
    }

    _updateImagesVisibility() {
        var locNormalImage = this._normalImage, locSelImage = this._selectedImage, locDisImage = this._disabledImage;
        if (this._enabled) {
            if (locNormalImage) {
                locNormalImage.visible = true;
                locNormalImage.setOpacity(255);
            }
            if (locSelImage)
                locSelImage.visible = false;
            if (locDisImage)
                locDisImage.visible = false;
        } else {
            if (locDisImage) {
                if (locNormalImage)
                    locNormalImage.visible = false;
                if (locSelImage)
                    locSelImage.visible = false;
                if (locDisImage)
                    locDisImage.visible = true;
            } else {
                if (locNormalImage) {
                    locNormalImage.visible = true;
                    locNormalImage.setOpacity(128);
                }
                if (locSelImage)
                    locSelImage.visible = false;
            }
        }
    }
};


/**
 * cc.MenuItemImage accepts images as items.<br/>
 * The images has 3 different states:<br/>
 * - unselected image<br/>
 * - selected image<br/>
 * - disabled image<br/>
 * <br/>
 * For best results try that all images are of the same size<br/>
 * @param {string|null} normalImage
 * @param {string|null} selectedImage
 * @param {string|null} disabledImage
 * @param {function|string|null} callback
 * @param {cc.Node|null} target
 * @example
 * var menuItem = new cc.MenuItemImage(normalImage, selectedImage, three, four, five);
 */
cc.MenuItemImage = class MenuItemImage extends cc.MenuItemSprite {

    /**
     * Constructor of cc.MenuItemImage
     * @param {string|null} normalImage
     * @param {string|null} selectedImage
     * @param {string|null} disabledImage
     * @param {function|string|null} callback
     * @param {cc.Node|null} target
     */
    constructor(normalImage, selectedImage, three, four, five) {
        var normalSprite = null,
            selectedSprite = null,
            disabledSprite = null,
            callback = null,
            target = null;

        if (normalImage === undefined || normalImage === null) {
            super();
        }
        else {
            normalSprite = new cc.Sprite(normalImage);
            selectedImage &&
            (selectedSprite = new cc.Sprite(selectedImage));

            if (four === undefined) {
                callback = three;
            }
            else if (five === undefined) {
                callback = three;
                target = four;
            }
            else if (five) {
                disabledSprite = new cc.Sprite(three);
                callback = four;
                target = five;
            }
            super(normalSprite, selectedSprite, disabledSprite, callback, target);
        }
    }

    /**
     * sets the sprite frame for the normal image
     * @param {cc.SpriteFrame} frame
     */
    setNormalSpriteFrame(frame) {
        this.setNormalImage(new cc.Sprite(frame));
    }

    /**
     * sets the sprite frame for the selected image
     * @param {cc.SpriteFrame} frame
     */
    setSelectedSpriteFrame(frame) {
        this.setSelectedImage(new cc.Sprite(frame));
    }

    /**
     * sets the sprite frame for the disabled image
     * @param {cc.SpriteFrame} frame
     */
    setDisabledSpriteFrame(frame) {
        this.setDisabledImage(new cc.Sprite(frame));
    }

    /**
     * initializes a cc.MenuItemImage
     * @param {string|null} normalImage
     * @param {string|null} selectedImage
     * @param {string|null} disabledImage
     * @param {function|string|null} callback
     * @param {cc.Node|null} target
     * @returns {boolean}
     */
    initWithNormalImage(normalImage, selectedImage, disabledImage, callback, target) {
        var normalSprite = null;
        var selectedSprite = null;
        var disabledSprite = null;

        if (normalImage) {
            normalSprite = new cc.Sprite(normalImage);
        }
        if (selectedImage) {
            selectedSprite = new cc.Sprite(selectedImage);
        }
        if (disabledImage) {
            disabledSprite = new cc.Sprite(disabledImage);
        }
        return this.initWithNormalSprite(normalSprite, selectedSprite, disabledSprite, callback, target);
    }
};



/**
 * A simple container class that "toggles" it's inner items<br/>
 * The inner items can be any MenuItem
 *
 * @property {Array}    subItems        - Sub items
 * @property {Number}   selectedIndex   - Index of selected sub item
 *
 *@example
 * // Example
 * //create a toggle item with 2 menu items (which you can then toggle between them later)
 * var toggler = new cc.MenuItemToggle( new cc.MenuItemFont("On"), new cc.MenuItemFont("Off"), this.callback, this)
 * //Note: the first param is the target, the second is the callback function, afterwards, you can pass in any number of menuitems
 *
 * //if you pass only 1 variable, then it must be a cc.MenuItem
 * var notYetToggler = new cc.MenuItemToggle(cc.MenuItemFont("On"));//it is useless right now, until you add more stuff to it
 * notYetToggler.addSubItem(new cc.MenuItemFont("Off"));
 * //this is useful for constructing a toggler without a callback function (you wish to control the behavior from somewhere else)
 */
cc.MenuItemToggle = class MenuItemToggle extends cc.MenuItem {
    subItems = null;

    _selectedIndex = 0;
    _opacity = null;
    _color = null;

    /**
     * Constructor of cc.MenuItemToggle
    */
    constructor(/*Multiple arguments follow*/) {

        super();
        this._selectedIndex = 0;
        this.subItems = [];
        this._opacity = 0;
        this._color = cc.color.WHITE;

        if(arguments.length > 0)
            this.initWithItems(Array.prototype.slice.apply(arguments));

    }

    get selectedIndex() { return this.getSelectedIndex(); }
    set selectedIndex(v) { this.setSelectedIndex(v); }

    /**
     * return the opacity of cc.MenuItemToggle
     * @return {Number}
     */
    getOpacity() {
        return this._opacity;
    }

    /**
     * set the opacity for cc.MenuItemToggle
     * @param {Number} opacity
     */
    setOpacity(opacity) {
        this._opacity = opacity;
        if (this.subItems && this.subItems.length > 0) {
            for (var it = 0; it < this.subItems.length; it++) {
                this.subItems[it].opacity = opacity;
            }
        }
        this._color.a = opacity;
    }

    /**
     * return the color of cc.MenuItemToggle
     * @return {cc.Color}
     */
    getColor() {
        var locColor = this._color;
        return cc.color(locColor.r, locColor.g, locColor.b, locColor.a);
    }

    /**
     * set the color for cc.MenuItemToggle
     * @param {cc.Color} Color
     */
    setColor(color) {
        var locColor = this._color;
        locColor.r = color.r;
        locColor.g = color.g;
        locColor.b = color.b;

        if (this.subItems && this.subItems.length > 0) {
            for (var it = 0; it < this.subItems.length; it++) {
                this.subItems[it].setColor(color);
            }
        }

        if (color.a !== undefined && !color.a_undefined) {
            this.setOpacity(color.a);
        }
    }

    /**
     * return the index of selected
     * @return {Number}
     */
    getSelectedIndex() {
        return this._selectedIndex;
    }

    /**
     * set the seleceted index for cc.MenuItemToggle
     * @param {Number} SelectedIndex
     */
    setSelectedIndex(SelectedIndex) {
        if (SelectedIndex !== this._selectedIndex) {
            this._selectedIndex = SelectedIndex;
            var currItem = this.getChildByTag(cc.CURRENT_ITEM);
            if (currItem)
                currItem.removeFromParent(false);

            var item = this.subItems[this._selectedIndex];
            this.addChild(item, 0, cc.CURRENT_ITEM);
            var w = item.width, h = item.height;
            this.width = w;
            this.height = h;
            item.setPosition(w / 2, h / 2);
        }
    }

    /**
     * similar to get children,return the sumItem array.
     * @return {Array}
     */
    getSubItems() {
        return this.subItems;
    }

    /**
     * set the subitem for cc.MenuItemToggle
     * @param {cc.MenuItem} subItems
     */
    setSubItems(subItems) {
        this.subItems = subItems;
    }

    /**
     * initializes a cc.MenuItemToggle with items
     * @param {...cc.MenuItem} array the rest in the array are cc.MenuItems
     * @param {function|String} secondTolast the second item in the args array is the callback
     * @param {cc.Node} last the first item in the args array is a target
     * @return {Boolean}
     */
    initWithItems(args) {
        var l = args.length;
        // passing callback.
        if (cc.isFunction(args[args.length - 2])) {
            this.initWithCallback(args[args.length - 2], args[args.length - 1]);
            l = l - 2;
        } else if (cc.isFunction(args[args.length - 1])) {
            this.initWithCallback(args[args.length - 1], null);
            l = l - 1;
        } else {
            this.initWithCallback(null, null);
        }

        var locSubItems = this.subItems;
        locSubItems.length = 0;
        for (var i = 0; i < l; i++) {
            if (args[i])
                locSubItems.push(args[i]);
        }
        this._selectedIndex = cc.UINT_MAX;
        this.setSelectedIndex(0);

        this.setCascadeColorEnabled(true);
        this.setCascadeOpacityEnabled(true);

        return true;
    }

    /**
     * add the subitem for cc.MenuItemToggle
     * @param {cc.MenuItem} item
     */
    addSubItem(item) {
        this.subItems.push(item);
    }

    /**
     * activate the menu item
     */
    activate() {
        // update index
        if (this._enabled) {
            var newIndex = (this._selectedIndex + 1) % this.subItems.length;
            this.setSelectedIndex(newIndex);
        }
        super.activate();
    }

    /**
     * menu item is selected (runs callback)
     */
    selected() {
        super.selected();
        this.subItems[this._selectedIndex].selected();
    }

    /**
     * menu item goes back to unselected state
     */
    unselected() {
        super.unselected();
        this.subItems[this._selectedIndex].unselected();
    }

    /**
     * set the enable status for cc.MenuItemToggle
     * @param {Boolean} enabled
     */
    setEnabled(enabled) {
        if (this._enabled !== enabled) {
            super.setEnabled(enabled);
            var locItems = this.subItems;
            if (locItems && locItems.length > 0) {
                for (var it = 0; it < locItems.length; it++)
                    locItems[it].enabled = enabled;
            }
        }
    }

    /**
     * returns the selected item.
     * @return {cc.MenuItem}
     */
    getSelectedItem() {
        return this.subItems[this._selectedIndex];
    }

    /**
     * * <p>
     *     Event callback that is invoked every time when cc.MenuItemToggle enters the 'stage'.                                   <br/>
     *     If the cc.MenuItemToggle enters the 'stage' with a transition, this event is called when the transition starts.        <br/>
     *     During onEnter you can't access a "sister/brother" node.                                                    <br/>
     *     If you override onEnter, you must call its parent's onEnter function with this._super().
     * </p>
     */
    onEnter() {
        cc.Node.prototype.onEnter.call(this);
        this.setSelectedIndex(this._selectedIndex);
    }
};


