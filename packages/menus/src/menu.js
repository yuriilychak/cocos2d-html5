import {
  Layer,
  EventListener,
  Rect,
  color,
  Director,
  EventManager,
  log
} from "@aspect/core";
import { MenuItem } from "./menu-item/menu-item";
import {
  MENU_STATE_WAITING,
  MENU_STATE_TRACKING_TOUCH,
  DEFAULT_PADDING
} from "./constants";

/**
 * <p> Features and Limitation:<br/>
 *  - You can add MenuItem objects in runtime using addChild:<br/>
 *  - But the only accepted children are MenuItem objects</p>
 * @param {...MenuItem|null} menuItems
 */
export class Menu extends Layer {
  enabled = false;

  _selectedItem = null;
  _state = -1;
  _touchListener = null;
  _className = "Menu";

  constructor(menuItems) {
    super();
    this._color = color.WHITE;
    this.enabled = false;
    this._opacity = 255;
    this._selectedItem = null;
    this._state = -1;

    this._touchListener = EventListener.create({
      event: EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: true,
      onTouchBegan: this._onTouchBegan,
      onTouchMoved: this._onTouchMoved,
      onTouchEnded: this._onTouchEnded,
      onTouchCancelled: this._onTouchCancelled
    });

    var argc = arguments.length,
      items;
    if (menuItems instanceof Array) {
      items = menuItems;
    } else if (argc === 0) {
      items = [];
    } else if (argc > 0) {
      items = [];
      for (var i = 0; i < argc; i++) {
        if (arguments[i]) items.push(arguments[i]);
      }
    }
    this.initWithArray(items);
  }

  onEnter() {
    var locListener = this._touchListener;
    if (!locListener._isRegistered())
      EventManager.getInstance().addListener(locListener, this);
    super.onEnter();
  }

  isEnabled() {
    return this.enabled;
  }
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  initWithItems(args) {
    var pArray = [];
    if (args) {
      for (var i = 0; i < args.length; i++) {
        if (args[i]) pArray.push(args[i]);
      }
    }
    return this.initWithArray(pArray);
  }

  initWithArray(arrayOfItems) {
    if (super.init()) {
      this.enabled = true;

      var winSize = Director.getInstance().getWinSize();
      this.setPosition(winSize.width / 2, winSize.height / 2);
      this.setContentSize(winSize);
      this.setAnchorPoint(0.5, 0.5);
      this.ignoreAnchorPointForPosition(true);

      if (arrayOfItems) {
        for (var i = 0; i < arrayOfItems.length; i++)
          this.addChild(arrayOfItems[i], i);
      }

      this._selectedItem = null;
      this._state = MENU_STATE_WAITING;

      this.cascadeColor = true;
      this.cascadeOpacity = true;

      return true;
    }
    return false;
  }

  addChild(child, zOrder, tag) {
    if (!(child instanceof MenuItem))
      throw new Error(
        "Menu.addChild() : Menu only supports MenuItem objects as children"
      );
    super.addChild(child, zOrder, tag);
  }

  updateAlign() {
    switch (this._align) {
      case "vertically":
        this.alignItemsVertically();
        break;
      case "horizontally":
        this.alignItemsHorizontally();
        break;
    }
  }

  alignItemsVertically() {
    this.alignItemsVerticallyWithPadding(DEFAULT_PADDING);
  }

  alignItemsVerticallyWithPadding(padding) {
    this._align = "vertically";
    var height = -padding,
      locChildren = this._children,
      len,
      i,
      locScaleY,
      locHeight,
      locChild;
    if (locChildren && locChildren.length > 0) {
      for (i = 0, len = locChildren.length; i < len; i++)
        height += locChildren[i].height * locChildren[i].scaleY + padding;

      var y = height / 2.0;
      for (i = 0, len = locChildren.length; i < len; i++) {
        locChild = locChildren[i];
        locHeight = locChild.height;
        locScaleY = locChild.scaleY;
        locChild.setPosition(0, y - (locHeight * locScaleY) / 2);
        y -= locHeight * locScaleY + padding;
      }
    }
  }

  alignItemsHorizontally() {
    this.alignItemsHorizontallyWithPadding(DEFAULT_PADDING);
  }

  alignItemsHorizontallyWithPadding(padding) {
    this._align = "horizontally";
    var width = -padding,
      locChildren = this._children,
      i,
      len,
      locScaleX,
      locWidth,
      locChild;
    if (locChildren && locChildren.length > 0) {
      for (i = 0, len = locChildren.length; i < len; i++)
        width += locChildren[i].width * locChildren[i].scaleX + padding;

      var x = -width / 2.0;
      for (i = 0, len = locChildren.length; i < len; i++) {
        locChild = locChildren[i];
        locScaleX = locChild.scaleX;
        locWidth = locChildren[i].width;
        locChild.setPosition(x + (locWidth * locScaleX) / 2, 0);
        x += locWidth * locScaleX + padding;
      }
    }
  }

  alignItemsInColumns(/*Multiple Arguments*/) {
    if (arguments.length > 0 && arguments[arguments.length - 1] == null)
      log("parameters should not be ending with null in Javascript");

    var i,
      rows = [];
    for (i = 0; i < arguments.length; i++) {
      rows.push(arguments[i]);
    }
    var height = -5;
    var row = 0;
    var rowHeight = 0;
    var columnsOccupied = 0;
    var rowColumns, tmp, len;
    var locChildren = this._children;
    if (locChildren && locChildren.length > 0) {
      for (i = 0, len = locChildren.length; i < len; i++) {
        if (row >= rows.length) continue;
        rowColumns = rows[row];
        if (!rowColumns) continue;
        tmp = locChildren[i].height;
        rowHeight = rowHeight >= tmp || isNaN(tmp) ? rowHeight : tmp;
        ++columnsOccupied;
        if (columnsOccupied >= rowColumns) {
          height += rowHeight + 5;
          columnsOccupied = 0;
          rowHeight = 0;
          ++row;
        }
      }
    }
    var winSize = Director.getInstance().getWinSize();

    row = 0;
    rowHeight = 0;
    rowColumns = 0;
    var w = 0.0;
    var x = 0.0;
    var y = height / 2;

    if (locChildren && locChildren.length > 0) {
      for (i = 0, len = locChildren.length; i < len; i++) {
        var child = locChildren[i];
        if (rowColumns === 0) {
          rowColumns = rows[row];
          w = winSize.width / (1 + rowColumns);
          x = w;
        }
        tmp = child._getHeight();
        rowHeight = rowHeight >= tmp || isNaN(tmp) ? rowHeight : tmp;
        child.setPosition(x - winSize.width / 2, y - tmp / 2);
        x += w;
        ++columnsOccupied;
        if (columnsOccupied >= rowColumns) {
          y -= rowHeight + 5;
          columnsOccupied = 0;
          rowColumns = 0;
          rowHeight = 0;
          ++row;
        }
      }
    }
  }

  alignItemsInRows(/*Multiple arguments*/) {
    if (arguments.length > 0 && arguments[arguments.length - 1] == null)
      log("parameters should not be ending with null in Javascript");
    var i,
      columns = [];
    for (i = 0; i < arguments.length; i++) {
      columns.push(arguments[i]);
    }
    var columnWidths = [];
    var columnHeights = [];
    var width = -10;
    var columnHeight = -5;
    var column = 0;
    var columnWidth = 0;
    var rowsOccupied = 0;
    var columnRows, child, len, tmp;

    var locChildren = this._children;
    if (locChildren && locChildren.length > 0) {
      for (i = 0, len = locChildren.length; i < len; i++) {
        child = locChildren[i];
        if (column >= columns.length) continue;
        columnRows = columns[column];
        if (!columnRows) continue;
        tmp = child.width;
        columnWidth = columnWidth >= tmp || isNaN(tmp) ? columnWidth : tmp;
        columnHeight += child.height + 5;
        ++rowsOccupied;
        if (rowsOccupied >= columnRows) {
          columnWidths.push(columnWidth);
          columnHeights.push(columnHeight);
          width += columnWidth + 10;
          rowsOccupied = 0;
          columnWidth = 0;
          columnHeight = -5;
          ++column;
        }
      }
    }
    var winSize = Director.getInstance().getWinSize();

    column = 0;
    columnWidth = 0;
    columnRows = 0;
    var x2 = -width / 2;
    var y2 = 0.0;

    if (locChildren && locChildren.length > 0) {
      for (i = 0, len = locChildren.length; i < len; i++) {
        child = locChildren[i];
        if (columnRows === 0) {
          columnRows = columns[column];
          y2 = columnHeights[column];
        }
        tmp = child._getWidth();
        columnWidth = columnWidth >= tmp || isNaN(tmp) ? columnWidth : tmp;
        child.setPosition(
          x2 + columnWidths[column] / 2,
          y2 - winSize.height / 2
        );
        y2 -= child.height + 10;
        ++rowsOccupied;
        if (rowsOccupied >= columnRows) {
          x2 += columnWidth + 5;
          rowsOccupied = 0;
          columnRows = 0;
          columnWidth = 0;
          ++column;
        }
      }
    }
  }

  removeChild(child, cleanup) {
    if (child == null) return;
    if (!(child instanceof MenuItem)) {
      log(
        "Menu.removeChild():Menu only supports MenuItem objects as children"
      );
      return;
    }
    if (this._selectedItem === child) this._selectedItem = null;
    super.removeChild(child, cleanup);
  }

  _onTouchBegan(touch, event) {
    var target = event.getCurrentTarget();
    if (
      target._state !== MENU_STATE_WAITING ||
      !target._visible ||
      !target.enabled
    )
      return false;

    for (var c = target.parent; c != null; c = c.parent) {
      if (!c.isVisible()) return false;
    }

    target._selectedItem = target._itemForTouch(touch);
    if (target._selectedItem) {
      target._state = MENU_STATE_TRACKING_TOUCH;
      target._selectedItem.selected();
      target._selectedItem.setNodeDirty();
      return true;
    }
    return false;
  }

  _onTouchEnded(touch, event) {
    var target = event.getCurrentTarget();
    if (target._state !== MENU_STATE_TRACKING_TOUCH) {
      log("Menu.onTouchEnded(): invalid state");
      return;
    }
    if (target._selectedItem) {
      target._selectedItem.unselected();
      target._selectedItem.setNodeDirty();
      target._selectedItem.activate();
    }
    target._state = MENU_STATE_WAITING;
  }

  _onTouchCancelled(touch, event) {
    var target = event.getCurrentTarget();
    if (target._state !== MENU_STATE_TRACKING_TOUCH) {
      log("Menu.onTouchCancelled(): invalid state");
      return;
    }
    if (target._selectedItem) {
      target._selectedItem.unselected();
      target._selectedItem.setNodeDirty();
    }
    target._state = MENU_STATE_WAITING;
  }

  _onTouchMoved(touch, event) {
    var target = event.getCurrentTarget();
    if (target._state !== MENU_STATE_TRACKING_TOUCH) {
      log("Menu.onTouchMoved(): invalid state");
      return;
    }
    var currentItem = target._itemForTouch(touch);
    if (currentItem !== target._selectedItem) {
      if (target._selectedItem) {
        target._selectedItem.unselected();
        target._selectedItem.setNodeDirty();
      }
      target._selectedItem = currentItem;
      if (target._selectedItem) {
        target._selectedItem.selected();
        target._selectedItem.setNodeDirty();
      }
    }
  }

  onExit() {
    if (this._state === MENU_STATE_TRACKING_TOUCH) {
      if (this._selectedItem) {
        this._selectedItem.unselected();
        this._selectedItem = null;
      }
      this._state = MENU_STATE_WAITING;
    }
    super.onExit();
  }

  setOpacityModifyRGB(value) {}
  isOpacityModifyRGB() {
    return false;
  }

  _itemForTouch(touch) {
    var touchLocation = touch.getLocation();
    var itemChildren = this._children,
      locItemChild;
    if (itemChildren && itemChildren.length > 0) {
      for (var i = itemChildren.length - 1; i >= 0; i--) {
        locItemChild = itemChildren[i];
        if (locItemChild.isVisible() && locItemChild.isEnabled()) {
          var local = locItemChild.convertToNodeSpace(touchLocation);
          var r = locItemChild.rect();
          r.x = 0;
          r.y = 0;
          if (Rect.containsPoint(r, local)) return locItemChild;
        }
      }
    }
    return null;
  }
}
