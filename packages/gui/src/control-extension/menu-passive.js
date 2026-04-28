import { Layer, Color, Director, log } from "@aspect/core";

const MENU_PASSIVE_DEFAULT_PADDING = 5;

export class Spacer extends Layer {}

Spacer.verticalSpacer = function (space) {
    var pRet = new Spacer();
    pRet.init();
    pRet.setContentSize(0, space);
    return pRet;
};

Spacer.horizontalSpacer = function (space) {
    var pRet = new Spacer();
    pRet.init();
    pRet.setContentSize(space, 0);
    return pRet;
};

export class MenuPassive extends Layer {
    _color = null;
    _opacity = 0;
    _className = "MenuPassive";

    constructor() {
        super();
    }

    getColor() {
        var locColor = this._color;
        return new Color(locColor.r, locColor.g, locColor.b, locColor.a);
    }

    setColor(color) {
        var locColor = this._color;
        locColor.r = color.r;
        locColor.g = color.g;
        locColor.b = color.b;
        if (this._children && this._children.length > 0) {
            for (var i = 0; i < this._children.length; i++) {
                if (this._children[i]) {
                    this._children[i].setColor(color);
                }
            }
        }
        if (color.a !== undefined && !color.a_undefined) {
            this.setOpacity(color.a);
        }
    }

    getOpacity() {
        return this._opacity;
    }

    setOpacity(opacity) {
        this._opacity = opacity;
        if (this._children && this._children.length > 0) {
            for (var i = 0; i < this._children.length; i++) {
                if (this._children[i]) {
                    this._children[i].setOpacity(opacity);
                }
            }
        }
        this._color.a = opacity;
    }

    initWithItems(item, args) {
        if (this.init()) {
            var winSize = Director.getInstance().getWinSize();
            this.ignoreAnchorPointForPosition(true);
            this.setAnchorPoint(0.5, 0.5);
            this.setContentSize(winSize);
            this.setPosition(winSize.width / 2, winSize.height / 2);
            var z = 0;
            if (item) {
                this.addChild(item, z);
                for (var i = 0; i < args.length; i++) {
                    if (args[i]) {
                        z++;
                        this.addChild(args[i], z);
                    }
                }
            }
            return true;
        }
        return false;
    }

    alignItemsVertically() {
        this.alignItemsVerticallyWithPadding(MENU_PASSIVE_DEFAULT_PADDING);
    }

    alignItemsVerticallyWithPadding(padding) {
        var height = -padding;
        var i;
        if (this._children && this._children.length > 0) {
            for (i = 0; i < this._children.length; i++) {
                if (this._children[i]) {
                    height += this._children[i].getContentSize().height * this._children[i].getScaleY() + padding;
                }
            }
        }
        var width = 0;
        var y = height / 2.0;
        if (this._children && this._children.length > 0) {
            for (i = 0; i < this._children.length; i++) {
                if (this._children[i]) {
                    width = Math.max(width, this._children[i].getContentSize().width);
                    this._children[i].setPosition(0, y - this._children[i].getContentSize().height * this._children[i].getScaleY() / 2.0);
                    y -= this._children[i].getContentSize().height * this._children[i].getScaleY() + padding;
                }
            }
        }
        this.setContentSize(width, height);
    }

    alignItemsHorizontally() {
        this.alignItemsHorizontallyWithPadding(MENU_PASSIVE_DEFAULT_PADDING);
    }

    alignItemsHorizontallyWithPadding(padding) {
        var width = -padding;
        var i;
        if (this._children && this._children.length > 0) {
            for (i = 0; i < this._children.length; i++) {
                if (this._children[i]) {
                    width += this._children[i].getContentSize().width * this._children[i].getScaleX() + padding;
                }
            }
        }
        var height = 0;
        var x = -width / 2.0;
        if (this._children && this._children.length > 0) {
            for (i = 0; i < this._children.length; i++) {
                if (this._children[i]) {
                    height = Math.max(height, this._children[i].getContentSize().height);
                    this._children[i].setPosition(x + this._children[i].getContentSize().width * this._children[i].getScaleX() / 2.0, 0);
                    x += this._children[i].getContentSize().width * this._children[i].getScaleX() + padding;
                }
            }
        }
        this.setContentSize(width, height);
    }

    alignItemsInColumns(columns) {
        var rows = [];
        var i;
        for (i = 1; i < arguments.length; i++) {
            rows.push(arguments[i]);
        }
        var height = -5;
        var row = 0;
        var rowHeight = 0;
        var columnsOccupied = 0;
        var rowColumns;
        var tmp;
        if (this._children && this._children.length > 0) {
            for (i = 0; i < this._children.length; i++) {
                if (this._children[i]) {
                    if (row >= rows.length) {
                        log("MenuPassive.alignItemsInColumns(): invalid row index");
                        continue;
                    }
                    rowColumns = rows[row];
                    if (!rowColumns) {
                        log("MenuPassive.alignItemsInColumns(): can not have zero columns on a row");
                        continue;
                    }
                    tmp = this._children[i].getContentSize().height;
                    rowHeight = 0 | ((rowHeight >= tmp || (tmp == null)) ? rowHeight : tmp);
                    ++columnsOccupied;
                    if (columnsOccupied >= rowColumns) {
                        height += rowHeight + 5;
                        columnsOccupied = 0;
                        rowHeight = 0;
                        ++row;
                    }
                }
            }
        }
        var winSize = Director.getInstance().getWinSize();
        row = 0; rowHeight = 0; rowColumns = 0;
        var w = 0.0, x = 0.0, y = (height / 2);
        if (this._children && this._children.length > 0) {
            for (i = 0; i < this._children.length; i++) {
                if (this._children[i]) {
                    if (rowColumns === 0) {
                        rowColumns = rows[row];
                        w = winSize.width / (1 + rowColumns);
                        x = w;
                    }
                    tmp = this._children[i].getContentSize().height;
                    rowHeight = 0 | ((rowHeight >= tmp || (tmp == null)) ? rowHeight : tmp);
                    this._children[i].setPosition(x - winSize.width / 2, y - this._children[i].getContentSize().height / 2);
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
    }

    alignItemsInRows(rows) {
        var columns = [];
        var i;
        for (i = 1; i < arguments.length; i++) {
            columns.push(arguments[i]);
        }
        var columnWidths = [], columnHeights = [];
        var width = -10, columnHeight = -5, column = 0, columnWidth = 0, rowsOccupied = 0, columnRows;
        var tmp;
        if (this._children && this._children.length > 0) {
            for (i = 0; i < this._children.length; i++) {
                if (this._children[i]) {
                    if (column >= columns.length) {
                        log("MenuPassive.alignItemsInRows(): invalid row index");
                        continue;
                    }
                    columnRows = columns[column];
                    if (!columnRows) {
                        log("MenuPassive.alignItemsInColumns(): can't have zero rows on a column");
                        continue;
                    }
                    tmp = this._children[i].getContentSize().width;
                    columnWidth = 0 | ((columnWidth >= tmp || (tmp == null)) ? columnWidth : tmp);
                    columnHeight += 0 | (this._children[i].getContentSize().height + 5);
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
        }
        var winSize = Director.getInstance().getWinSize();
        column = 0; columnWidth = 0; columnRows = null;
        var x = (-width / 2), y = 0.0;
        if (this._children && this._children.length > 0) {
            for (i = 0; i < this._children.length; i++) {
                if (this._children[i]) {
                    if (columnRows == null) {
                        columnRows = columns[column];
                        y = columnHeights[column];
                    }
                    tmp = this._children[i].getContentSize().width;
                    columnWidth = 0 | ((columnWidth >= tmp || (tmp == null)) ? columnWidth : tmp);
                    this._children[i].setPosition(x + columnWidths[column] / 2, y - winSize.height / 2);
                    y -= this._children[i].getContentSize().height + 10;
                    ++rowsOccupied;
                    if (rowsOccupied >= columnRows) {
                        x += columnWidth + 5;
                        rowsOccupied = 0;
                        columnRows = 0;
                        columnWidth = 0;
                        ++column;
                    }
                }
            }
        }
    }

    setOpacityModifyRGB(bValue) {}
    isOpacityModifyRGB() { return false; }

    static create(item) {
        if (!item) item = null;
        var argArr = [];
        for (var i = 1; i < arguments.length; i++) {
            argArr.push(arguments[i]);
        }
        var pRet = new MenuPassive();
        if (pRet && pRet.initWithItems(item, argArr)) {
            return pRet;
        }
        return null;
    }

    static createWithItem(item) {
        return MenuPassive.create(item, null);
    }
}
