import { BMButton, ImageView, Layout, TextBMFont, Widget } from "@aspect/ccui";
import { Color, Rect, Size } from "@aspect/core";
import { s_simpleFont_fnt } from "./resources";
import { winSize } from "./constants";

/**
 * A reusable vertical group with a title, styled background, and mixed items.
 * Each item can be a clickable button or a plain text label.
 * Self-positions to the bottom-right corner of the screen.
 *
 * @param {Array<{
 *   type?: "button"|"text",
 *   label: string,
 *   tintDefault?: Color,
 *   tintPressed?: Color
 * }>} buttonConfigs
 * @param {number} buttonWidth - width of each item
 * @param {string} [title="Actions"] - title displayed above the items
 * @param {function(index: number): void} onClick - called with the item index on click (buttons only)
 * @param {number} [padding=ButtonLayout.PADDING] - padding around content
 * @param {number} [gap=ButtonLayout.GAP] - gap between elements
 */
export class ButtonLayout extends Layout {
  static BUTTON_HEIGHT = 32;
  static TITLE_HEIGHT = 24;
  static PADDING = 8;
  static GAP = 8;
  static CAP_INSETS = 12;
  static FONT_SIZE = 12;
  static DISABLED_COLOR = new Color(0x55, 0x55, 0x55);

  constructor(
    buttonConfigs,
    buttonWidth,
    title = "Actions",
    onClick,
    padding = ButtonLayout.PADDING,
    gap = ButtonLayout.GAP
  ) {
    super();
    this._items = [];
    this._buildLayout(buttonConfigs, buttonWidth, title, onClick, padding, gap);
  }

  _buildLayout(buttonConfigs, buttonWidth, title, onClick, padding, gap) {
    const {
      BUTTON_HEIGHT,
      TITLE_HEIGHT,
      CAP_INSETS,
      FONT_SIZE,
      DISABLED_COLOR
    } = ButtonLayout;
    const count = buttonConfigs.length;

    const totalWidth = padding * 2 + buttonWidth;
    const totalHeight =
      padding * 2 + TITLE_HEIGHT + BUTTON_HEIGHT * count + gap * count;

    this.setContentSize(new Size(totalWidth, totalHeight));

    const bg = new ImageView();
    bg.setAnchorPoint(0, 0);
    bg.setScale9Enabled(true);
    bg.ignoreContentAdaptWithSize(false);
    bg.loadTexture("default_theme/squere_shadow_0.png", Widget.PLIST_TEXTURE);
    bg.setCapInsets(new Rect(CAP_INSETS, CAP_INSETS, CAP_INSETS, CAP_INSETS));
    bg.color = new Color(255, 255, 255);
    bg.opacity = 64;
    bg.setContentSize(new Size(totalWidth, totalHeight));
    this.addChild(bg, -1);

    const titleLabel = new TextBMFont(title, s_simpleFont_fnt);
    titleLabel.fontSize = 14;
    titleLabel.x = totalWidth / 2;
    titleLabel.y = totalHeight - padding - TITLE_HEIGHT / 2;
    this.addChild(titleLabel);

    const centerX = padding + buttonWidth / 2;

    buttonConfigs.forEach((config, i) => {
      const itemY =
        totalHeight -
        padding -
        TITLE_HEIGHT -
        gap -
        BUTTON_HEIGHT / 2 -
        i * (BUTTON_HEIGHT + gap);

      let item;

      if ((config.type ?? "button") === "text") {
        item = new TextBMFont(config.label, s_simpleFont_fnt);
        item.fontSize = FONT_SIZE;
        item.x = centerX;
        item.y = itemY;
      } else {
        item = new BMButton(
          "default_theme/rounded_shadow_2.png",
          "default_theme/rounded_shadow_2.png",
          "default_theme/rounded_shadow_2.png",
          Widget.PLIST_TEXTURE
        );
        item.setScale9Enabled(true);
        item.setCapInsets(new Rect(CAP_INSETS, CAP_INSETS, CAP_INSETS, CAP_INSETS));
        item.setContentSize(new Size(buttonWidth, BUTTON_HEIGHT));
        item.setTitleFntFile(s_simpleFont_fnt);
        item.setTitleText(config.label);
        item.setTitleFontSize(FONT_SIZE);
        item.setNormalBgColor(config.tintDefault);
        item.setPressedBgColor(config.tintPressed);
        item.setDisabledBgColor(DISABLED_COLOR);
        item.pressedActionEnabled = true;
        item.addClickEventListener(() => onClick(i));
        item.x = centerX;
        item.y = itemY;
      }

      this.addChild(item);
      this._items.push(item);
    });

    this.x = winSize.width - totalWidth;
    this.y = 0;
  }

  /**
   * Returns the item (BMButton or TextBMFont) at the given index, or null.
   * @param {number} index
   * @returns {BMButton|TextBMFont|null}
   */
  getButton(index) {
    return this._items[index] ?? null;
  }

  /**
   * Changes the label text of the item at the given index.
   * Works for both button and text items.
   * @param {number} index
   * @param {string} text
   */
  setLabelText(index, text) {
    const item = this._items[index];
    if (!item) return;
    if (item instanceof BMButton) {
      item.setTitleText(text);
    } else {
      item.string = text;
    }
  }

  /**
   * Sets the visibility of an item by index.
   * @param {number} index
   * @param {boolean} visible
   */
  setButtonVisible(index, visible) {
    const item = this._items[index];
    if (item) item.visible = visible;
  }

  /**
   * Hides the item at the given index.
   * @param {number} index
   */
  hideButton(index) {
    this.setButtonVisible(index, false);
  }

  /**
   * Shows the item at the given index.
   * @param {number} index
   */
  showButton(index) {
    this.setButtonVisible(index, true);
  }
}
