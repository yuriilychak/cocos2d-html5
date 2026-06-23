/****************************************************************************
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.
 Copyright (c) 2015-2016 zilongshanren

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

import {
  Rect,
  Size,
  Color,
  Sprite,
  SpriteFrame,
  log,
  ServiceLocator
} from "@aspect/core";
import { LabelBMFont } from "@aspect/labels";
import { ScaleTo, TintTo } from "@aspect/actions";
import { Widget } from "../base-classes/widget";
import { ProtectedNode } from "../base-classes/protected-node";
import { Scale9Sprite } from "../base-classes/scale9-sprite";

/**
 * A button control that uses LabelBMFont for its title renderer.
 *
 * @property {String}   titleText               - The content string of the button title
 * @property {String}   titleFntFile            - The .fnt file used for the title label
 * @property {Number}   titleFontSize           - The font size of the button title (proportional scaling)
 * @property {Color}    titleColor              - The color of the button title
 * @property {Boolean}  pressedActionEnabled    - Indicate whether button has zoom effect when clicked
 */
export class BMButton extends Widget {
  /**
   * Constructor of BMButton.
   * @param {String} normalImage
   * @param {String} [selectedImage=""]
   * @param {String} [disableImage=""]
   * @param {Number} [texType=Widget.LOCAL_TEXTURE]
   */
  constructor(normalImage, selectedImage, disableImage, texType) {
    super();
    this._capInsetsNormal = new Rect();
    this._normalTextureSize = new Size();
    this._buttonNormalSpriteFrame = null;
    this._buttonClickedSpriteFrame = null;
    this._buttonDisableSpriteFrame = null;
    this._titleRenderer = null;
    this._normalFileName = "";
    this._clickedFileName = "";
    this._disabledFileName = "";
    this._prevIgnoreSize = true;
    this._scale9Enabled = false;
    this._normalTexType = Widget.LOCAL_TEXTURE;
    this._pressedTexType = Widget.LOCAL_TEXTURE;
    this._disabledTexType = Widget.LOCAL_TEXTURE;
    this.pressedActionEnabled = false;
    this._titleColor = null;
    this._zoomScale = 0.1;
    this._normalBgColor = null;
    this._pressedBgColor = null;
    this._disabledBgColor = null;
    this._normalTextureLoaded = false;
    this._pressedTextureLoaded = false;
    this._disabledTextureLoaded = false;
    this._className = "BMButton";
    this._normalTextureAdaptDirty = true;
    this._fntFile = "";
    this._fontSize = 0;
    this._type = 0;
    this.touchEnabled = true;

    this._normalLoader = new Sprite.LoadManager();
    this._clickedLoader = new Sprite.LoadManager();
    this._disabledLoader = new Sprite.LoadManager();

    if (normalImage) {
      this.loadTextures(normalImage, selectedImage, disableImage, texType);
    }
  }

  get titleText() {
    return this.getTitleText();
  }
  set titleText(v) {
    this.setTitleText(v);
  }

  get titleFntFile() {
    return this.getTitleFntFile();
  }
  set titleFntFile(v) {
    this.setTitleFntFile(v);
  }

  get titleFontSize() {
    return this.getTitleFontSize();
  }
  set titleFontSize(v) {
    this.setTitleFontSize(v);
  }

  get titleColor() {
    return this.getTitleColor();
  }
  set titleColor(v) {
    this.setTitleColor(v);
  }

  get normalBgColor() {
    return this.getNormalBgColor();
  }
  set normalBgColor(v) {
    this.setNormalBgColor(v);
  }

  get pressedBgColor() {
    return this.getPressedBgColor();
  }
  set pressedBgColor(v) {
    this.setPressedBgColor(v);
  }

  get disabledBgColor() {
    return this.getDisabledBgColor();
  }
  set disabledBgColor(v) {
    this.setDisabledBgColor(v);
  }

  _createTitleRendererIfNeeded() {
    if (!this._titleRenderer) {
      this._titleRenderer = new LabelBMFont();
      this._titleRenderer.setAnchorPoint(0.5, 0.5);
      this._titleColor = Color.WHITE;
      this.addProtectedChild(
        this._titleRenderer,
        BMButton.TITLE_RENDERER_ZORDER,
        -1
      );
    }
  }

  _initRenderer() {
    this._buttonScale9Renderer = new Scale9Sprite();

    this._buttonScale9Renderer.setRenderingType(
      Scale9Sprite.RenderingType.SIMPLE
    );

    this.addProtectedChild(
      this._buttonScale9Renderer,
      BMButton.DISABLED_RENDERER_ZORDER,
      -1
    );
  }

  /**
   * Sets if button is using scale9 renderer.
   * @param {Boolean} able
   */
  setScale9Enabled(able) {
    if (this._scale9Enabled === able) return;

    this._brightStyle = Widget.BRIGHT_STYLE_NONE;
    this._scale9Enabled = able;

    if (this._scale9Enabled) {
      this._buttonScale9Renderer.setRenderingType(
        Scale9Sprite.RenderingType.SLICED
      );
    } else {
      this._buttonScale9Renderer.setRenderingType(
        Scale9Sprite.RenderingType.SIMPLE
      );
    }

    if (this._scale9Enabled) {
      var ignoreBefore = this._ignoreSize;
      this.ignoreContentAdaptWithSize(false);
      this._prevIgnoreSize = ignoreBefore;
    } else {
      this.ignoreContentAdaptWithSize(this._prevIgnoreSize);
    }
    this.setCapInsets(this._capInsetsNormal);

    this.bright = this._bright;

    this._normalTextureAdaptDirty = true;
  }

  /**
   * Returns whether button is using scale9 renderer.
   * @returns {Boolean}
   */
  isScale9Enabled() {
    return this._scale9Enabled;
  }

  /**
   * Sets whether ignore the widget size.
   * @param {Boolean} ignore
   * @override
   */
  ignoreContentAdaptWithSize(ignore) {
    if (this._unifySize) {
      this._updateContentSize();
      return;
    }
    if (!this._scale9Enabled || (this._scale9Enabled && !ignore)) {
      super.ignoreContentAdaptWithSize(ignore);
      this._prevIgnoreSize = ignore;
    }
  }

  /**
   * Returns the renderer size.
   * @returns {Size}
   */
  getVirtualRendererSize() {
    if (this._unifySize) return this._getNormalSize();

    if (!this._normalTextureLoaded) {
      if (this._titleRenderer && this._titleRenderer.string.length > 0) {
        return this._titleRenderer.getContentSize();
      }
    }
    return new Size(this._normalTextureSize);
  }

  /**
   * Load textures for button.
   * @param {String} normal
   * @param {String} selected
   * @param {String} disabled
   * @param {Widget.LOCAL_TEXTURE|Widget.PLIST_TEXTURE} texType
   */
  loadTextures(normal, selected, disabled, texType) {
    this.loadTextureNormal(normal, texType);
    this.loadTexturePressed(selected, texType);
    this.loadTextureDisabled(disabled, texType);
  }

  _createSpriteFrameWithFile(file) {
    var texture = ServiceLocator.textureCache.getTextureForKey(file);
    if (!texture) {
      texture = ServiceLocator.textureCache.addImage(file);
    }
    if (!texture._textureLoaded) {
      return texture;
    }

    var textureSize = texture.getContentSize();
    var rect = new Rect(0, 0, textureSize.width, textureSize.height);
    return new SpriteFrame(texture, rect);
  }

  _createSpriteFrameWithName(name) {
    var frame = ServiceLocator.spriteFrameCache.getSpriteFrame(name);
    if (frame == null) {
      log(
        "Scale9Sprite.initWithSpriteFrameName(): can't find the sprite frame by spriteFrameName"
      );
      return null;
    }

    return frame;
  }

  /**
   * Load normal state texture for button.
   * @param {String} normal
   * @param {Widget.LOCAL_TEXTURE|Widget.PLIST_TEXTURE} texType
   */
  loadTextureNormal(normal, texType) {
    if (!normal) return;

    texType = texType || Widget.LOCAL_TEXTURE;
    this._normalFileName = normal;
    this._normalTexType = texType;

    var normalSpriteFrame;
    switch (this._normalTexType) {
      case Widget.LOCAL_TEXTURE:
        normalSpriteFrame = this._createSpriteFrameWithFile(normal);
        break;
      case Widget.PLIST_TEXTURE:
        if (normal[0] === "#") {
          normal = normal.substr(1, normal.length - 1);
        }
        normalSpriteFrame = this._createSpriteFrameWithName(normal);
        break;
      default:
        break;
    }

    if (!normalSpriteFrame) {
      return;
    }

    if (!normalSpriteFrame._textureLoaded) {
      this._normalLoader.clear();
      this._normalLoader.once(
        normalSpriteFrame,
        function () {
          this.loadTextureNormal(this._normalFileName, this._normalTexType);
        },
        this
      );
      return;
    }

    this._normalTextureLoaded = normalSpriteFrame._textureLoaded;
    this._buttonNormalSpriteFrame = normalSpriteFrame;
    this._buttonScale9Renderer.setSpriteFrame(normalSpriteFrame);
    if (this._scale9Enabled) {
      this._buttonScale9Renderer.setCapInsets(this._capInsetsNormal);
    }

    if (!this._ignoreSize && Size.equalTo(this._customSize, new Size(0, 0))) {
      this._customSize = this._buttonScale9Renderer.getContentSize();
    }

    this._normalTextureSize = this._buttonScale9Renderer.getContentSize();
    this._updateChildrenDisplayedRGBA();
    if (this._unifySize) {
      if (this._scale9Enabled) {
        this._buttonScale9Renderer.setCapInsets(this._capInsetsNormal);
        this._updateContentSizeWithTextureSize(this._getNormalSize());
      }
    } else {
      this._updateContentSizeWithTextureSize(this._normalTextureSize);
    }

    this._normalTextureAdaptDirty = true;
    this._findLayout();
  }

  /**
   * Load selected state texture for button.
   * @param {String} selected
   * @param {Widget.LOCAL_TEXTURE|Widget.PLIST_TEXTURE} texType
   */
  loadTexturePressed(selected, texType) {
    if (!selected) return;
    texType = texType || Widget.LOCAL_TEXTURE;
    this._clickedFileName = selected;
    this._pressedTexType = texType;

    var clickedSpriteFrame;
    switch (this._pressedTexType) {
      case Widget.LOCAL_TEXTURE:
        clickedSpriteFrame = this._createSpriteFrameWithFile(selected);
        break;
      case Widget.PLIST_TEXTURE:
        if (selected[0] === "#") {
          selected = selected.substr(1, selected.length - 1);
        }
        clickedSpriteFrame = this._createSpriteFrameWithName(selected);
        break;
      default:
        break;
    }

    if (!clickedSpriteFrame) return;

    if (!clickedSpriteFrame._textureLoaded) {
      this._clickedLoader.clear();
      this._clickedLoader.once(
        clickedSpriteFrame,
        function () {
          this.loadTexturePressed(this._clickedFileName, this._pressedTexType);
        },
        this
      );
      return;
    }

    this._buttonClickedSpriteFrame = clickedSpriteFrame;
    this._updateChildrenDisplayedRGBA();

    this._pressedTextureLoaded = true;
  }

  /**
   * Load disabled state texture for button.
   * @param {String} disabled
   * @param {Widget.LOCAL_TEXTURE|Widget.PLIST_TEXTURE} texType
   */
  loadTextureDisabled(disabled, texType) {
    if (!disabled) return;

    texType = texType || Widget.LOCAL_TEXTURE;
    this._disabledFileName = disabled;
    this._disabledTexType = texType;

    var disabledSpriteframe;
    switch (this._disabledTexType) {
      case Widget.LOCAL_TEXTURE:
        disabledSpriteframe = this._createSpriteFrameWithFile(disabled);
        break;
      case Widget.PLIST_TEXTURE:
        if (disabled[0] === "#") {
          disabled = disabled.substr(1, disabled.length - 1);
        }
        disabledSpriteframe = this._createSpriteFrameWithName(disabled);
        break;
      default:
        break;
    }

    if (!disabledSpriteframe) return;

    if (!disabledSpriteframe._textureLoaded) {
      this._disabledLoader.clear();
      this._disabledLoader.once(
        disabledSpriteframe,
        function () {
          this.loadTextureDisabled(
            this._disabledFileName,
            this._disabledTexType
          );
        },
        this
      );
      return;
    }

    this._buttonDisableSpriteFrame = disabledSpriteframe;
    this._updateChildrenDisplayedRGBA();

    this._disabledTextureLoaded = true;
    this._findLayout();
  }

  /**
   * Sets capinsets for button, if button is using scale9 renderer.
   * @param {Rect} capInsets
   */
  setCapInsets(capInsets) {
    this.setCapInsetsNormalRenderer(capInsets);
  }

  /**
   * Sets capinsets for normal state renderer.
   * @param {Rect} capInsets
   */
  setCapInsetsNormalRenderer(capInsets) {
    if (!capInsets || !this._scale9Enabled) return;

    var x = capInsets.x,
      y = capInsets.y;
    var width = capInsets.width,
      height = capInsets.height;
    if (this._normalTextureSize.width < width) {
      x = 0;
      width = 0;
    }
    if (this._normalTextureSize.height < height) {
      y = 0;
      height = 0;
    }

    var locInsets = this._capInsetsNormal;
    locInsets.x = x;
    locInsets.y = y;
    locInsets.width = width;
    locInsets.height = height;

    this._capInsetsNormal = locInsets;
    this._buttonScale9Renderer.setCapInsets(locInsets);
  }

  /**
   * Returns normal renderer cap insets.
   * @returns {Rect}
   */
  getCapInsetsNormalRenderer() {
    return new Rect(this._capInsetsNormal);
  }

  /**
   * Sets capinsets for pressed state renderer.
   * @param {Rect} capInsets
   */
  setCapInsetsPressedRenderer(capInsets) {
    this.setCapInsetsNormalRenderer(capInsets);
  }

  /**
   * Returns pressed renderer cap insets.
   * @returns {Rect}
   */
  getCapInsetsPressedRenderer() {
    return new Rect(this._capInsetsNormal);
  }

  /**
   * Sets capinsets for disabled state renderer.
   * @param {Rect} capInsets
   */
  setCapInsetsDisabledRenderer(capInsets) {
    this.setCapInsetsNormalRenderer(capInsets);
  }

  /**
   * Returns disabled renderer cap insets.
   * @returns {Rect}
   */
  getCapInsetsDisabledRenderer() {
    return new Rect(this._capInsetsNormal);
  }

  _onPressStateChangedToNormal() {
    this._buttonScale9Renderer.setSpriteFrame(this._buttonNormalSpriteFrame);
    this._buttonScale9Renderer.setState(Scale9Sprite.state.NORMAL);
    this._buttonScale9Renderer.stopAllActions();

    if (this._pressedTextureLoaded) {
      if (this.pressedActionEnabled) {
        this._buttonScale9Renderer.scale = 1.0;

        if (this._titleRenderer) {
          this._titleRenderer.stopAllActions();

          if (this._unifySize) {
            this._titleRenderer.runAction(
              new ScaleTo(BMButton.ZOOM_ACTION_TIME_STEP, 1, 1)
            );
          } else {
            this._titleRenderer.scaleX = 1;
            this._titleRenderer.scaleY = 1;
          }
        }
      }
    } else {
      this._buttonScale9Renderer.scale = 1.0;

      if (this._titleRenderer) {
        this._titleRenderer.stopAllActions();
        this._titleRenderer.scaleX = 1;
        this._titleRenderer.scaleY = 1;
      }
    }

    if (this._normalBgColor) {
      this._buttonScale9Renderer.runAction(
        new TintTo(
          BMButton.TINT_ACTION_TIME_STEP,
          this._normalBgColor.r,
          this._normalBgColor.g,
          this._normalBgColor.b
        )
      );
    } else if (!this._pressedTextureLoaded && this._scale9Enabled) {
      this._buttonScale9Renderer.color = Color.WHITE;
    }
  }

  _onPressStateChangedToPressed() {
    this._buttonScale9Renderer.setState(Scale9Sprite.state.NORMAL);
    this._buttonScale9Renderer.stopAllActions();

    if (this._pressedTextureLoaded) {
      this._buttonScale9Renderer.setSpriteFrame(this._buttonClickedSpriteFrame);

      if (this.pressedActionEnabled) {
        this._buttonScale9Renderer.runAction(
          new ScaleTo(
            BMButton.ZOOM_ACTION_TIME_STEP,
            1.0 + this._zoomScale,
            1.0 + this._zoomScale
          )
        );

        if (this._titleRenderer) {
          this._titleRenderer.stopAllActions();
          this._titleRenderer.runAction(
            new ScaleTo(
              BMButton.ZOOM_ACTION_TIME_STEP,
              1 + this._zoomScale,
              1 + this._zoomScale
            )
          );
        }
      }
    } else {
      this._buttonScale9Renderer.setSpriteFrame(this._buttonClickedSpriteFrame);
      this._buttonScale9Renderer.setScale(
        1.0 + this._zoomScale,
        1.0 + this._zoomScale
      );

      if (this._titleRenderer) {
        this._titleRenderer.stopAllActions();
        this._titleRenderer.scaleX = 1 + this._zoomScale;
        this._titleRenderer.scaleY = 1 + this._zoomScale;
      }
    }

    if (this._pressedBgColor) {
      this._buttonScale9Renderer.runAction(
        new TintTo(
          BMButton.TINT_ACTION_TIME_STEP,
          this._pressedBgColor.r,
          this._pressedBgColor.g,
          this._pressedBgColor.b
        )
      );
    }
  }

  _onPressStateChangedToDisabled() {
    this._buttonScale9Renderer.stopAllActions();

    if (!this._disabledTextureLoaded) {
      if (this._normalTextureLoaded) {
        this._buttonScale9Renderer.setState(Scale9Sprite.state.GRAY);
      }
    } else {
      this._buttonScale9Renderer.setSpriteFrame(this._buttonDisableSpriteFrame);
    }

    this._buttonScale9Renderer.scale = 1.0;

    if (this._disabledBgColor) {
      this._buttonScale9Renderer.runAction(
        new TintTo(
          BMButton.TINT_ACTION_TIME_STEP,
          this._disabledBgColor.r,
          this._disabledBgColor.g,
          this._disabledBgColor.b
        )
      );
    }
  }

  /**
   * Sets background color for the normal state.
   * @param {Color} color
   */
  setNormalBgColor(color) {
    this._normalBgColor = color;
    if (
      this._brightStyle === Widget.BRIGHT_STYLE_NORMAL &&
      this._buttonScale9Renderer
    ) {
      this._buttonScale9Renderer.color = color;
    }
  }

  /**
   * Returns background color for the normal state.
   * @returns {Color|null}
   */
  getNormalBgColor() {
    return this._normalBgColor;
  }

  /**
   * Sets background color for the pressed state.
   * @param {Color} color
   */
  setPressedBgColor(color) {
    this._pressedBgColor = color;
    if (
      this._brightStyle === Widget.BRIGHT_STYLE_HIGH_LIGHT &&
      this._buttonScale9Renderer
    ) {
      this._buttonScale9Renderer.color = color;
    }
  }

  /**
   * Returns background color for the pressed state.
   * @returns {Color|null}
   */
  getPressedBgColor() {
    return this._pressedBgColor;
  }

  /**
   * Sets background color for the disabled state.
   * @param {Color} color
   */
  setDisabledBgColor(color) {
    this._disabledBgColor = color;
    if (!this._bright && this._buttonScale9Renderer) {
      this._buttonScale9Renderer.color = color;
    }
  }

  /**
   * Returns background color for the disabled state.
   * @returns {Color|null}
   */
  getDisabledBgColor() {
    return this._disabledBgColor;
  }

  /**
   * Convenience method to set background color for a specific state.
   * @param {Number} state  BMButton.State.NORMAL | PRESSED | DISABLED
   * @param {Color} color
   */
  setStateColor(state, color) {
    switch (state) {
      case BMButton.State.NORMAL:
        this.setNormalBgColor(color);
        break;
      case BMButton.State.PRESSED:
        this.setPressedBgColor(color);
        break;
      case BMButton.State.DISABLED:
        this.setDisabledBgColor(color);
        break;
    }
  }

  /**
   * Returns background color for a specific state.
   * @param {Number} state  BMButton.State.NORMAL | PRESSED | DISABLED
   * @returns {Color|null}
   */
  getStateColor(state) {
    switch (state) {
      case BMButton.State.NORMAL:
        return this._normalBgColor;
      case BMButton.State.PRESSED:
        return this._pressedBgColor;
      case BMButton.State.DISABLED:
        return this._disabledBgColor;
      default:
        return null;
    }
  }

  _updateContentSize() {
    if (this._unifySize) {
      if (this._scale9Enabled)
        ProtectedNode.prototype.setContentSize.call(this, this._customSize);
      else {
        var s = this._getNormalSize();
        ProtectedNode.prototype.setContentSize.call(this, s);
      }
      this._onSizeChanged();
      return;
    }

    if (this._ignoreSize) this.setContentSize(this.getVirtualRendererSize());
  }

  _onSizeChanged() {
    super._onSizeChanged();
    if (this._titleRenderer) {
      this._updateTitleLocation();
    }
    this._normalTextureAdaptDirty = true;
  }

  /**
   * Gets the Virtual Renderer of widget.
   * @returns {Node}
   */
  getVirtualRenderer() {
    return this._buttonScale9Renderer;
  }

  _normalTextureScaleChangedWithSize() {
    this._buttonScale9Renderer.setContentSize(this._contentSize);
    this._buttonScale9Renderer.setPosition(
      this._contentSize.width / 2,
      this._contentSize.height / 2
    );
  }

  _adaptRenderers() {
    if (this._normalTextureAdaptDirty) {
      this._normalTextureScaleChangedWithSize();
      this._normalTextureAdaptDirty = false;
    }
  }

  _updateTitleLocation() {
    this._titleRenderer.setPosition(
      this._contentSize.width * 0.5,
      this._contentSize.height * 0.5
    );
  }

  /**
   * Changes if button can be clicked zoom effect.
   * @param {Boolean} enabled
   */
  setPressedActionEnabled(enabled) {
    this.pressedActionEnabled = enabled;
  }

  /**
   * Sets title text to BMButton.
   * @param {String} text
   */
  setTitleText(text) {
    if (text === this.getTitleText()) return;

    this._createTitleRendererIfNeeded();

    this._titleRenderer.string = text;
    if (this._ignoreSize) {
      var s = this.getVirtualRendererSize();
      this.setContentSize(s);
    }
  }

  /**
   * Returns title text of BMButton.
   * @returns {String}
   */
  getTitleText() {
    if (this._titleRenderer) {
      return this._titleRenderer.string;
    }
    return "";
  }

  /**
   * Sets title color to BMButton.
   * @param {Color} color
   */
  setTitleColor(color) {
    this._createTitleRendererIfNeeded();
    this._titleColor = color;
    this._titleRenderer.color = color;
  }

  /**
   * Returns title color of BMButton.
   * @returns {Color}
   */
  getTitleColor() {
    if (this._titleRenderer) {
      return this._titleRenderer.color;
    }
    return Color.WHITE;
  }

  /**
   * Sets title font size to BMButton (proportional scaling relative to the fnt file's native size).
   * @param {Number} size
   */
  setTitleFontSize(size) {
    this._fontSize = size;
    if (this._titleRenderer) {
      this._titleRenderer.fontSize = size;
    }
  }

  /**
   * Returns title font size of BMButton.
   * @returns {Number}
   */
  getTitleFontSize() {
    if (this._titleRenderer) {
      return this._titleRenderer.fontSize;
    }
    return this._fontSize;
  }

  /**
   * Sets the .fnt file for the title label.
   * @param {String} fntFile path to the .fnt file
   */
  setTitleFntFile(fntFile) {
    this._fntFile = fntFile;
    this._createTitleRendererIfNeeded();
    this._titleRenderer.initWithString(this.getTitleText(), fntFile);
    if (this._fontSize > 0) {
      this._titleRenderer.fontSize = this._fontSize;
    }
  }

  /**
   * Returns the .fnt file path used for the title label.
   * @returns {String}
   */
  getTitleFntFile() {
    return this._fntFile;
  }

  /**
   * Get the title renderer.
   * @returns {LabelBMFont}
   */
  getTitleRenderer() {
    return this._titleRenderer;
  }

  /**
   * When user pressed the button, the button will zoom to a scale.
   * @param {Number} scale
   */
  setZoomScale(scale) {
    this._zoomScale = scale;
  }

  /**
   * Returns a zoom scale.
   * @returns {Number}
   */
  getZoomScale() {
    return this._zoomScale;
  }

  /**
   * Returns the normalize of texture size.
   * @returns {Size}
   */
  getNormalTextureSize() {
    return this._normalTextureSize;
  }

  /**
   * Returns the "class name" of widget.
   * @override
   * @returns {string}
   */
  getDescription() {
    return "BMButton";
  }

  _createCloneInstance() {
    return new BMButton();
  }

  _copySpecialProperties(uiButton) {
    this._prevIgnoreSize = uiButton._prevIgnoreSize;
    this._capInsetsNormal = uiButton._capInsetsNormal;
    this.setScale9Enabled(uiButton._scale9Enabled);

    this.loadTextureNormal(uiButton._normalFileName, uiButton._normalTexType);
    this.loadTexturePressed(
      uiButton._clickedFileName,
      uiButton._pressedTexType
    );
    this.loadTextureDisabled(
      uiButton._disabledFileName,
      uiButton._disabledTexType
    );

    if (uiButton._titleRenderer && uiButton._titleRenderer.string) {
      this.setTitleFntFile(uiButton._fntFile);
      this.setTitleText(uiButton.getTitleText());
      this.setTitleFontSize(uiButton.getTitleFontSize());
      this.setTitleColor(uiButton.getTitleColor());
    }
    this.setPressedActionEnabled(uiButton.pressedActionEnabled);
    this.setZoomScale(uiButton._zoomScale);
    this._normalBgColor = uiButton._normalBgColor;
    this._pressedBgColor = uiButton._pressedBgColor;
    this._disabledBgColor = uiButton._disabledBgColor;
  }

  _getNormalSize() {
    var titleSize;
    if (this._titleRenderer !== null)
      titleSize = this._titleRenderer.getContentSize();

    var imageSize = this._buttonScale9Renderer.getContentSize();
    var width =
      titleSize.width > imageSize.width ? titleSize.width : imageSize.width;
    var height =
      titleSize.height > imageSize.height ? titleSize.height : imageSize.height;

    return new Size(width, height);
  }
}

BMButton.NORMAL_RENDERER_ZORDER = -2;
BMButton.PRESSED_RENDERER_ZORDER = -2;
BMButton.DISABLED_RENDERER_ZORDER = -2;
BMButton.TITLE_RENDERER_ZORDER = -1;
BMButton.ZOOM_ACTION_TIME_STEP = 0.05;
BMButton.TINT_ACTION_TIME_STEP = 0.05;

BMButton.State = {
  NORMAL: 0,
  PRESSED: 1,
  DISABLED: 2
};
