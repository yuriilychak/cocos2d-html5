import { color, CURRENT_ITEM, UINT_MAX, isFunction } from "@aspect/core";
import { MenuItem } from "./menu-item";

/**
 * A simple container class that "toggles" its inner items.
 * @property {Array}  subItems      - Sub items
 * @property {Number} selectedIndex - Index of selected sub item
 */
export class MenuItemToggle extends MenuItem {
  subItems = null;

  _selectedIndex = 0;
  _opacity = null;
  _color = null;

  constructor(/*Multiple arguments follow*/) {
    super();
    this._selectedIndex = 0;
    this.subItems = [];
    this._opacity = 0;
    this._color = color.WHITE;

    if (arguments.length > 0)
      this.initWithItems(Array.prototype.slice.apply(arguments));
  }

  get selectedIndex() {
    return this.getSelectedIndex();
  }
  set selectedIndex(v) {
    this.setSelectedIndex(v);
  }

  getOpacity() {
    return this._opacity;
  }

  setOpacity(opacity) {
    this._opacity = opacity;
    if (this.subItems && this.subItems.length > 0) {
      for (var it = 0; it < this.subItems.length; it++) {
        this.subItems[it].opacity = opacity;
      }
    }
    this._color.a = opacity;
  }

  getColor() {
    var locColor = this._color;
    return color(locColor.r, locColor.g, locColor.b, locColor.a);
  }

  setColor(c) {
    var locColor = this._color;
    locColor.r = c.r;
    locColor.g = c.g;
    locColor.b = c.b;
    if (this.subItems && this.subItems.length > 0) {
      for (var it = 0; it < this.subItems.length; it++) {
        this.subItems[it].setColor(c);
      }
    }
    if (c.a !== undefined && !c.a_undefined) {
      this.setOpacity(c.a);
    }
  }

  getSelectedIndex() {
    return this._selectedIndex;
  }

  setSelectedIndex(SelectedIndex) {
    if (SelectedIndex !== this._selectedIndex) {
      this._selectedIndex = SelectedIndex;
      var currItem = this.getChildByTag(CURRENT_ITEM);
      if (currItem) currItem.removeFromParent(false);

      var item = this.subItems[this._selectedIndex];
      this.addChild(item, 0, CURRENT_ITEM);
      var w = item.width,
        h = item.height;
      this.width = w;
      this.height = h;
      item.setPosition(w / 2, h / 2);
    }
  }

  getSubItems() {
    return this.subItems;
  }
  setSubItems(subItems) {
    this.subItems = subItems;
  }

  initWithItems(args) {
    var l = args.length;
    if (isFunction(args[args.length - 2])) {
      this.initWithCallback(args[args.length - 2], args[args.length - 1]);
      l = l - 2;
    } else if (isFunction(args[args.length - 1])) {
      this.initWithCallback(args[args.length - 1], null);
      l = l - 1;
    } else {
      this.initWithCallback(null, null);
    }

    var locSubItems = this.subItems;
    locSubItems.length = 0;
    for (var i = 0; i < l; i++) {
      if (args[i]) locSubItems.push(args[i]);
    }
    this._selectedIndex = UINT_MAX;
    this.setSelectedIndex(0);

    this.setCascadeColorEnabled(true);
    this.setCascadeOpacityEnabled(true);

    return true;
  }

  addSubItem(item) {
    this.subItems.push(item);
  }

  activate() {
    if (this._enabled) {
      var newIndex = (this._selectedIndex + 1) % this.subItems.length;
      this.setSelectedIndex(newIndex);
    }
    super.activate();
  }

  selected() {
    super.selected();
    this.subItems[this._selectedIndex].selected();
  }

  unselected() {
    super.unselected();
    this.subItems[this._selectedIndex].unselected();
  }

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

  getSelectedItem() {
    return this.subItems[this._selectedIndex];
  }

  onEnter() {
    super.onEnter();
    this.setSelectedIndex(this._selectedIndex);
  }
}
