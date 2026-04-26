import { LabelAtlas } from "@aspect/labels";
import { MenuItemLabel } from "./menu-item-label";

/**
 * Helper class that creates a MenuItemLabel with a LabelAtlas.
 */
export class MenuItemAtlasFont extends MenuItemLabel {
  constructor(
    value,
    charMapFile,
    itemWidth,
    itemHeight,
    startCharMap,
    callback,
    target
  ) {
    var label;
    if (value && value.length > 0) {
      label = new LabelAtlas(
        value,
        charMapFile,
        itemWidth,
        itemHeight,
        startCharMap
      );
    }
    super(label, callback, target);
  }

  initWithString(
    value,
    charMapFile,
    itemWidth,
    itemHeight,
    startCharMap,
    callback,
    target
  ) {
    if (!value || value.length === 0)
      throw new Error(
        "MenuItemAtlasFont.initWithString(): value should be non-null and its length should be greater than 0"
      );

    var label = new LabelAtlas();
    label.initWithString(
      value,
      charMapFile,
      itemWidth,
      itemHeight,
      startCharMap
    );
    this.initWithLabel(label, callback, target);
    return true;
  }
}
