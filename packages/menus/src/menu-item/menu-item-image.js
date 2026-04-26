import { Sprite } from "@aspect/core";
import { MenuItemSprite } from "./menu-item-sprite";

/**
 * MenuItemImage accepts image paths as items.
 */
export class MenuItemImage extends MenuItemSprite {
  constructor(normalImage, selectedImage, three, four, five) {
    var normalSprite = null,
      selectedSprite = null,
      disabledSprite = null,
      callback = null,
      target = null;

    if (normalImage === undefined || normalImage === null) {
      super();
    } else {
      normalSprite = new Sprite(normalImage);
      selectedImage && (selectedSprite = new Sprite(selectedImage));

      if (four === undefined) {
        callback = three;
      } else if (five === undefined) {
        callback = three;
        target = four;
      } else if (five) {
        disabledSprite = new Sprite(three);
        callback = four;
        target = five;
      }
      super(normalSprite, selectedSprite, disabledSprite, callback, target);
    }
  }

  setNormalSpriteFrame(frame) {
    this.setNormalImage(new Sprite(frame));
  }

  setSelectedSpriteFrame(frame) {
    this.setSelectedImage(new Sprite(frame));
  }

  setDisabledSpriteFrame(frame) {
    this.setDisabledImage(new Sprite(frame));
  }

  initWithNormalImage(
    normalImage,
    selectedImage,
    disabledImage,
    callback,
    target
  ) {
    var normalSprite = normalImage ? new Sprite(normalImage) : null;
    var selectedSprite = selectedImage ? new Sprite(selectedImage) : null;
    var disabledSprite = disabledImage ? new Sprite(disabledImage) : null;
    return this.initWithNormalSprite(
      normalSprite,
      selectedSprite,
      disabledSprite,
      callback,
      target
    );
  }
}
