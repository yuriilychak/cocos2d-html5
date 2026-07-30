import { Layer, Color, log, ServiceLocator } from "@aspect/core";
import MenuPassiveColor from "./menu-passive-color";

const MENU_PASSIVE_DEFAULT_PADDING = 5;

export class Spacer extends Layer {}

Spacer.verticalSpacer = function (space) {
    var pRet = new Spacer();
    pRet.init();
    pRet.width = 0;
    pRet.height = space;
    return pRet;
};

Spacer.horizontalSpacer = function (space) {
    var pRet = new Spacer();
    pRet.init();
    pRet.width = space;
    pRet.height = 0;
    return pRet;
};

export class MenuPassive extends Layer {
    constructor() {
        super();
    }

    createColor() {
        return new MenuPassiveColor();
    }

    initWithItems(item, args) {
        if (this.init()) {
            var winSize = ServiceLocator.eglView.winSizeInPoints;
            this.ignoreAnchorPointForPosition = true;
            this.anchorX = 0.5;
            this.anchorY = 0.5;
            this.contentSize = winSize;
            this.position = { x: winSize.width / 2, y: winSize.height / 2 };
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
        if (this.children.length > 0) {
            for (i = 0; i < this.children.length; i++) {
                if (this.children[i]) {
                    height += this.children[i].height * this.children[i].scaleY + padding;
                }
            }
        }
        var width = 0;
        var y = height / 2.0;
        if (this.children.length > 0) {
            for (i = 0; i < this.children.length; i++) {
                if (this.children[i]) {
                    width = Math.max(width, this.children[i].width);
                    this.children[i].position = { x: 0, y: y - this.children[i].height * this.children[i].scaleY / 2.0 };
                    y -= this.children[i].height * this.children[i].scaleY + padding;
                }
            }
        }
        this.width = width;
        this.height = height;
    }

    alignItemsHorizontally() {
        this.alignItemsHorizontallyWithPadding(MENU_PASSIVE_DEFAULT_PADDING);
    }

    alignItemsHorizontallyWithPadding(padding) {
        var width = -padding;
        var i;
        if (this.children.length > 0) {
            for (i = 0; i < this.children.length; i++) {
                if (this.children[i]) {
                    width += this.children[i].width * this.children[i].scaleX + padding;
                }
            }
        }
        var height = 0;
        var x = -width / 2.0;
        if (this.children.length > 0) {
            for (i = 0; i < this.children.length; i++) {
                if (this.children[i]) {
                    height = Math.max(height, this.children[i].height);
                    this.children[i].position = { x: x + this.children[i].width * this.children[i].scaleX / 2.0, y: 0 };
                    x += this.children[i].width * this.children[i].scaleX + padding;
                }
            }
        }
        this.width = width;
        this.height = height;
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
        if (this.children.length > 0) {
            for (i = 0; i < this.children.length; i++) {
                if (this.children[i]) {
                    if (row >= rows.length) {
                        log("MenuPassive.alignItemsInColumns(): invalid row index");
                        continue;
                    }
                    rowColumns = rows[row];
                    if (!rowColumns) {
                        log("MenuPassive.alignItemsInColumns(): can not have zero columns on a row");
                        continue;
                    }
                    tmp = this.children[i].height;
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
        var winSize = ServiceLocator.eglView.winSizeInPoints;
        row = 0; rowHeight = 0; rowColumns = 0;
        var w = 0.0, x = 0.0, y = (height / 2);
        if (this.children.length > 0) {
            for (i = 0; i < this.children.length; i++) {
                if (this.children[i]) {
                    if (rowColumns === 0) {
                        rowColumns = rows[row];
                        w = winSize.width / (1 + rowColumns);
                        x = w;
                    }
                    tmp = this.children[i].height;
                    rowHeight = 0 | ((rowHeight >= tmp || (tmp == null)) ? rowHeight : tmp);
                    this.children[i].position = { x: x - winSize.width / 2, y: y - this.children[i].height / 2 };
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
        if (this.children.length > 0) {
            for (i = 0; i < this.children.length; i++) {
                if (this.children[i]) {
                    if (column >= columns.length) {
                        log("MenuPassive.alignItemsInRows(): invalid row index");
                        continue;
                    }
                    columnRows = columns[column];
                    if (!columnRows) {
                        log("MenuPassive.alignItemsInColumns(): can't have zero rows on a column");
                        continue;
                    }
                    tmp = this.children[i].width;
                    columnWidth = 0 | ((columnWidth >= tmp || (tmp == null)) ? columnWidth : tmp);
                    columnHeight += 0 | (this.children[i].height + 5);
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
        var winSize = ServiceLocator.eglView.winSizeInPoints;
        column = 0; columnWidth = 0; columnRows = null;
        var x = (-width / 2), y = 0.0;
        if (this.children.length > 0) {
            for (i = 0; i < this.children.length; i++) {
                if (this.children[i]) {
                    if (columnRows == null) {
                        columnRows = columns[column];
                        y = columnHeights[column];
                    }
                    tmp = this.children[i].width;
                    columnWidth = 0 | ((columnWidth >= tmp || (tmp == null)) ? columnWidth : tmp);
                    this.children[i].position = { x: x + columnWidths[column] / 2, y: y - winSize.height / 2 };
                    y -= this.children[i].height + 10;
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
