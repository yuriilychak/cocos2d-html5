import {
  Sprite,
  NORMAL_TAG,
  SELECTED_TAG,
  DISABLE_TAG,
  isFunction
} from "@aspect/core";
import { MenuItem } from "./menu-item";

/**
 * MenuItemSprite accepts Node objects as items with 3 states:
 * unselected, selected, disabled.
 */
export class MenuItemSprite extends MenuItem {
  _normalImage = null;
  _selectedImage = null;
  _disabledImage = null;

  constructor(normalSprite, selectedSprite, three, four, five) {
    super();
    this._normalImage = null;
    this._selectedImage = null;
    this._disabledImage = null;
    this._loader = new Sprite.LoadManager();

    if (normalSprite !== undefined) {
      selectedSprite = selectedSprite || null;
      var disabledImage, target, callback;
      if (five !== undefined) {
        disabledImage = three;
        callback = four;
        target = five;
      } else if (four !== undefined && isFunction(four)) {
        disabledImage = three;
        callback = four;
      } else if (four !== undefined && isFunction(three)) {
        target = four;
        callback = three;
        disabledImage = null;
      } else if (three === undefined) {
        disabledImage = null;
      }

      this._loader.clear();
      if (normalSprite.textureLoaded && !normalSprite.textureLoaded()) {
        this._loader.once(
          normalSprite,
          function () {
            this.initWithNormalSprite(
              normalSprite,
              selectedSprite,
              disabledImage,
              callback,
              target
            );
          },
          this
        );
        return;
      }

      this.initWithNormalSprite(
        normalSprite,
        selectedSprite,
        disabledImage,
        callback,
        target
      );
    }
  }

  get normalImage() {
    return this.getNormalImage();
  }
  set normalImage(v) {
    this.setNormalImage(v);
  }

  get selectedImage() {
    return this.getSelectedImage();
  }
  set selectedImage(v) {
    this.setSelectedImage(v);
  }

  get disabledImage() {
    return this.getDisabledImage();
  }
  set disabledImage(v) {
    this.setDisabledImage(v);
  }

  getNormalImage() {
    return this._normalImage;
  }

  setNormalImage(normalImage) {
    if (this._normalImage === normalImage) return;
    if (normalImage) {
      this.addChild(normalImage, 0, NORMAL_TAG);
      normalImage.anchorX = 0;
      normalImage.anchorY = 0;
    }
    if (this._normalImage) {
      this.removeChild(this._normalImage, true);
    }
    this._normalImage = normalImage;
    if (!this._normalImage) return;

    this.width = this._normalImage.width;
    this.height = this._normalImage.height;
    this._updateImagesVisibility();

    if (normalImage.textureLoaded && !normalImage.textureLoaded()) {
      normalImage.addEventListener(
        "load",
        function (sender) {
          this.width = sender.width;
          this.height = sender.height;
          if (this.parent && this.parent.updateAlign) {
            this.parent.updateAlign();
          }
        },
        this
      );
    }
  }

  getSelectedImage() {
    return this._selectedImage;
  }

  setSelectedImage(selectedImage) {
    if (this._selectedImage === selectedImage) return;
    if (selectedImage) {
      this.addChild(selectedImage, 0, SELECTED_TAG);
      selectedImage.anchorX = 0;
      selectedImage.anchorY = 0;
    }
    if (this._selectedImage) {
      this.removeChild(this._selectedImage, true);
    }
    this._selectedImage = selectedImage;
    this._updateImagesVisibility();
  }

  getDisabledImage() {
    return this._disabledImage;
  }

  setDisabledImage(disabledImage) {
    if (this._disabledImage === disabledImage) return;
    if (disabledImage) {
      this.addChild(disabledImage, 0, DISABLE_TAG);
      disabledImage.anchorX = 0;
      disabledImage.anchorY = 0;
    }
    if (this._disabledImage) this.removeChild(this._disabledImage, true);
    this._disabledImage = disabledImage;
    this._updateImagesVisibility();
  }

  initWithNormalSprite(
    normalSprite,
    selectedSprite,
    disabledSprite,
    callback,
    target
  ) {
    this._loader.clear();
    if (normalSprite.textureLoaded && !normalSprite.textureLoaded()) {
      this._loader.once(
        normalSprite,
        function () {
          this.initWithNormalSprite(
            normalSprite,
            selectedSprite,
            disabledSprite,
            callback,
            target
          );
        },
        this
      );
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

  selected() {
    super.selected();
    if (this._normalImage) {
      if (this._disabledImage) this._disabledImage.visible = false;
      if (this._selectedImage) {
        this._normalImage.visible = false;
        this._selectedImage.visible = true;
      } else {
        this._normalImage.visible = true;
      }
    }
  }

  unselected() {
    super.unselected();
    if (this._normalImage) {
      this._normalImage.visible = true;
      if (this._selectedImage) this._selectedImage.visible = false;
      if (this._disabledImage) this._disabledImage.visible = false;
    }
  }

  setEnabled(bEnabled) {
    if (this._enabled !== bEnabled) {
      super.setEnabled(bEnabled);
      this._updateImagesVisibility();
    }
  }

  _updateImagesVisibility() {
    var locNormalImage = this._normalImage,
      locSelImage = this._selectedImage,
      locDisImage = this._disabledImage;
    if (this._enabled) {
      if (locNormalImage) {
        locNormalImage.visible = true;
        locNormalImage.setOpacity(255);
      }
      if (locSelImage) locSelImage.visible = false;
      if (locDisImage) locDisImage.visible = false;
    } else {
      if (locDisImage) {
        if (locNormalImage) locNormalImage.visible = false;
        if (locSelImage) locSelImage.visible = false;
        locDisImage.visible = true;
      } else {
        if (locNormalImage) {
          locNormalImage.visible = true;
          locNormalImage.setOpacity(128);
        }
        if (locSelImage) locSelImage.visible = false;
      }
    }
  }
}
