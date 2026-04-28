import { Node, NewClass, Size, Point, Rect, arrayRemoveObject, INVALID_INDEX } from "@aspect/core";
import {
    GScrollView, ScrollViewDelegate,
    SCROLLVIEW_DIRECTION_NONE, SCROLLVIEW_DIRECTION_HORIZONTAL,
    SCROLLVIEW_DIRECTION_VERTICAL, SCROLLVIEW_DIRECTION_BOTH
} from "./scroll-view";
import { ArrayForObjectSorting } from "./sorting";

export const TABLEVIEW_FILL_TOPDOWN = 0;
export const TABLEVIEW_FILL_BOTTOMUP = 1;

export class TableViewCell extends Node {
    _idx = 0;
    _className = "TableViewCell";

    getIdx() { return this._idx; }
    setIdx(idx) { this._idx = idx; }

    reset() { this._idx = INVALID_INDEX; }

    get objectId() { return this.getObjectID(); }
    set objectId(v) { this.setObjectID(v); }

    setObjectID(idx) { this._idx = idx; }
    getObjectID() { return this._idx; }
}

export class TableViewDelegate extends ScrollViewDelegate {
    tableCellTouched(table, cell) {}
    tableCellHighlight(table, cell) {}
    tableCellUnhighlight(table, cell) {}
    tableCellWillRecycle(table, cell) {}
}

export class TableViewDataSource extends NewClass {
    tableCellSizeForIndex(table, idx) {
        return this.cellSizeForTable(table);
    }
    cellSizeForTable(table) {
        return new Size(0, 0);
    }
    tableCellAtIndex(table, idx) {
        return null;
    }
    numberOfCellsInTableView(table) {
        return 0;
    }
}

export class TableView extends GScrollView {
    _vOrdering = null;
    _indices = null;
    _cellsFreed = null;
    _dataSource = null;
    _tableViewDelegate = null;
    _oldDirection = null;
    _cellsPositions = null;
    _touchedCell = null;

    get dataSource() { return this.getDataSource(); }
    set dataSource(v) { this.setDataSource(v); }
    get delegate() { return this.getDelegate(); }
    set delegate(v) { this.setDelegate(v); }
    get verticalFillOrder() { return this.getVerticalFillOrder(); }
    set verticalFillOrder(v) { this.setVerticalFillOrder(v); }

    constructor(dataSource, size, container) {
        super();
        this._oldDirection = SCROLLVIEW_DIRECTION_NONE;
        this._cellsPositions = [];

        this.initWithViewSize(size, container);
        this.setDataSource(dataSource);
        this._updateCellPositions();
        this._updateContentSize();
    }

    __indexFromOffset(offset) {
        var low = 0;
        var high = this._dataSource.numberOfCellsInTableView(this) - 1;
        var search;
        switch (this.getDirection()) {
            case SCROLLVIEW_DIRECTION_HORIZONTAL:
                search = offset.x;
                break;
            default:
                search = offset.y;
                break;
        }

        var locCellsPositions = this._cellsPositions;
        while (high >= low) {
            var index = 0 | (low + (high - low) / 2);
            var cellStart = locCellsPositions[index];
            var cellEnd = locCellsPositions[index + 1];

            if (search >= cellStart && search <= cellEnd) {
                return index;
            } else if (search < cellStart) {
                high = index - 1;
            } else {
                low = index + 1;
            }
        }

        if (low <= 0)
            return 0;
        return -1;
    }

    _indexFromOffset(offset) {
        var locOffset = { x: offset.x, y: offset.y };
        var locDataSource = this._dataSource;
        var maxIdx = locDataSource.numberOfCellsInTableView(this) - 1;

        if (this._vOrdering === TABLEVIEW_FILL_TOPDOWN)
            locOffset.y = this.getContainer().getContentSize().height - locOffset.y;

        var index = this.__indexFromOffset(locOffset);
        if (index !== -1) {
            index = Math.max(0, index);
            if (index > maxIdx)
                index = INVALID_INDEX;
        }
        return index;
    }

    __offsetFromIndex(index) {
        var offset;
        switch (this.getDirection()) {
            case SCROLLVIEW_DIRECTION_HORIZONTAL:
                offset = new Point(this._cellsPositions[index], 0);
                break;
            default:
                offset = new Point(0, this._cellsPositions[index]);
                break;
        }
        return offset;
    }

    _offsetFromIndex(index) {
        var offset = this.__offsetFromIndex(index);

        var cellSize = this._dataSource.tableCellSizeForIndex(this, index);
        if (this._vOrdering === TABLEVIEW_FILL_TOPDOWN)
            offset.y = this.getContainer().getContentSize().height - offset.y - cellSize.height;

        return offset;
    }

    _updateCellPositions() {
        var cellsCount = this._dataSource.numberOfCellsInTableView(this);
        var locCellsPositions = this._cellsPositions;

        if (cellsCount > 0) {
            var currentPos = 0;
            var cellSize, locDataSource = this._dataSource;
            for (var i = 0; i < cellsCount; i++) {
                locCellsPositions[i] = currentPos;
                cellSize = locDataSource.tableCellSizeForIndex(this, i);
                switch (this.getDirection()) {
                    case SCROLLVIEW_DIRECTION_HORIZONTAL:
                        currentPos += cellSize.width;
                        break;
                    default:
                        currentPos += cellSize.height;
                        break;
                }
            }
            this._cellsPositions[cellsCount] = currentPos;
        }
    }

    _updateContentSize() {
        var size = new Size(0, 0);
        var cellsCount = this._dataSource.numberOfCellsInTableView(this);

        if (cellsCount > 0) {
            var maxPosition = this._cellsPositions[cellsCount];
            switch (this.getDirection()) {
                case SCROLLVIEW_DIRECTION_HORIZONTAL:
                    size = new Size(maxPosition, this._viewSize.height);
                    break;
                default:
                    size = new Size(this._viewSize.width, maxPosition);
                    break;
            }
        }

        this.setContentSize(size);

        if (this._oldDirection !== this._direction) {
            if (this._direction === SCROLLVIEW_DIRECTION_HORIZONTAL) {
                this.setContentOffset(new Point(0, 0));
            } else {
                this.setContentOffset(new Point(0, this.minContainerOffset().y));
            }
            this._oldDirection = this._direction;
        }
    }

    _moveCellOutOfSight(cell) {
        if (this._tableViewDelegate && this._tableViewDelegate.tableCellWillRecycle)
            this._tableViewDelegate.tableCellWillRecycle(this, cell);

        this._cellsFreed.addObject(cell);
        this._cellsUsed.removeSortedObject(cell);
        arrayRemoveObject(this._indices, cell.getIdx());

        cell.reset();
        if (cell.getParent() === this.getContainer()) {
            this.getContainer().removeChild(cell, true);
        }
    }

    _setIndexForCell(index, cell) {
        cell.setAnchorPoint(0, 0);
        cell.setPosition(this._offsetFromIndex(index));
        cell.setIdx(index);
    }

    _addCellIfNecessary(cell) {
        if (cell.getParent() !== this.getContainer()) {
            this.getContainer().addChild(cell);
        }
        this._cellsUsed.insertSortedObject(cell);
        var locIndices = this._indices, addIdx = cell.getIdx();
        if (locIndices.indexOf(addIdx) === -1) {
            locIndices.push(addIdx);
            locIndices.sort(function (a, b) {
                return a - b;
            });
        }
    }

    getDataSource() { return this._dataSource; }
    setDataSource(source) { this._dataSource = source; }

    getDelegate() { return this._tableViewDelegate; }
    setDelegate(delegate) { this._tableViewDelegate = delegate; }

    setVerticalFillOrder(fillOrder) {
        if (this._vOrdering !== fillOrder) {
            this._vOrdering = fillOrder;
            if (this._cellsUsed.count() > 0) {
                this.reloadData();
            }
        }
    }
    getVerticalFillOrder() { return this._vOrdering; }

    initWithViewSize(size, container) {
        if (super.initWithViewSize(size, container)) {
            this._cellsUsed = new ArrayForObjectSorting();
            this._cellsFreed = new ArrayForObjectSorting();
            this._indices = [];
            this._tableViewDelegate = null;
            this._vOrdering = TABLEVIEW_FILL_BOTTOMUP;
            this.setDirection(SCROLLVIEW_DIRECTION_VERTICAL);

            super.setDelegate(this);
            return true;
        }
        return false;
    }

    updateCellAtIndex(idx) {
        if (idx === INVALID_INDEX || idx > this._dataSource.numberOfCellsInTableView(this) - 1)
            return;

        var cell = this.cellAtIndex(idx);
        if (cell)
            this._moveCellOutOfSight(cell);

        cell = this._dataSource.tableCellAtIndex(this, idx);
        this._setIndexForCell(idx, cell);
        this._addCellIfNecessary(cell);
    }

    insertCellAtIndex(idx) {
        if (idx === INVALID_INDEX || idx > this._dataSource.numberOfCellsInTableView(this) - 1)
            return;

        var newIdx, locCellsUsed = this._cellsUsed;
        var cell = locCellsUsed.objectWithObjectID(idx);
        if (cell) {
            newIdx = locCellsUsed.indexOfSortedObject(cell);
            for (var i = newIdx; i < locCellsUsed.count(); i++) {
                cell = locCellsUsed.objectAtIndex(i);
                this._setIndexForCell(cell.getIdx() + 1, cell);
            }
        }

        cell = this._dataSource.tableCellAtIndex(this, idx);
        this._setIndexForCell(idx, cell);
        this._addCellIfNecessary(cell);

        this._updateCellPositions();
        this._updateContentSize();
    }

    removeCellAtIndex(idx) {
        if (idx === INVALID_INDEX || idx > this._dataSource.numberOfCellsInTableView(this) - 1)
            return;

        var cell = this.cellAtIndex(idx);
        if (!cell)
            return;

        var locCellsUsed = this._cellsUsed;
        var newIdx = locCellsUsed.indexOfSortedObject(cell);

        this._moveCellOutOfSight(cell);
        arrayRemoveObject(this._indices, idx);
        this._updateCellPositions();

        for (var i = locCellsUsed.count() - 1; i > newIdx; i--) {
            cell = locCellsUsed.objectAtIndex(i);
            this._setIndexForCell(cell.getIdx() - 1, cell);
        }
    }

    reloadData() {
        this._oldDirection = SCROLLVIEW_DIRECTION_NONE;
        var locCellsUsed = this._cellsUsed, locCellsFreed = this._cellsFreed, locContainer = this.getContainer();
        for (var i = 0, len = locCellsUsed.count(); i < len; i++) {
            var cell = locCellsUsed.objectAtIndex(i);

            if (this._tableViewDelegate && this._tableViewDelegate.tableCellWillRecycle)
                this._tableViewDelegate.tableCellWillRecycle(this, cell);

            locCellsFreed.addObject(cell);
            cell.reset();
            if (cell.getParent() === locContainer)
                locContainer.removeChild(cell, true);
        }

        this._indices = [];
        this._cellsUsed = new ArrayForObjectSorting();

        this._updateCellPositions();
        this._updateContentSize();
        if (this._dataSource.numberOfCellsInTableView(this) > 0)
            this.scrollViewDidScroll(this);

        this.setNodeDirty();
    }

    dequeueCell() {
        if (this._cellsFreed.count() === 0) {
            return null;
        } else {
            var cell = this._cellsFreed.objectAtIndex(0);
            this._cellsFreed.removeObjectAtIndex(0);
            return cell;
        }
    }

    cellAtIndex(idx) {
        var i = this._indices.indexOf(idx);
        if (i === -1)
            return null;
        return this._cellsUsed.objectWithObjectID(idx);
    }

    scrollViewDidScroll(view) {
        var locDataSource = this._dataSource;
        var countOfItems = locDataSource.numberOfCellsInTableView(this);
        if (0 === countOfItems)
            return;

        if (this._tableViewDelegate !== null && this._tableViewDelegate.scrollViewDidScroll)
            this._tableViewDelegate.scrollViewDidScroll(this);

        var idx = 0, locViewSize = this._viewSize, locContainer = this.getContainer();
        var offset = this.getContentOffset();
        offset.x *= -1;
        offset.y *= -1;

        var maxIdx = Math.max(countOfItems - 1, 0);

        if (this._vOrdering === TABLEVIEW_FILL_TOPDOWN)
            offset.y = offset.y + locViewSize.height / locContainer.getScaleY();
        var startIdx = this._indexFromOffset(offset);
        if (startIdx === INVALID_INDEX)
            startIdx = countOfItems - 1;

        if (this._vOrdering === TABLEVIEW_FILL_TOPDOWN)
            offset.y -= locViewSize.height / locContainer.getScaleY();
        else
            offset.y += locViewSize.height / locContainer.getScaleY();
        offset.x += locViewSize.width / locContainer.getScaleX();

        var endIdx = this._indexFromOffset(offset);
        if (endIdx === INVALID_INDEX)
            endIdx = countOfItems - 1;

        var cell, locCellsUsed = this._cellsUsed;
        if (locCellsUsed.count() > 0) {
            cell = locCellsUsed.objectAtIndex(0);
            idx = cell.getIdx();
            while (idx < startIdx) {
                this._moveCellOutOfSight(cell);
                if (locCellsUsed.count() > 0) {
                    cell = locCellsUsed.objectAtIndex(0);
                    idx = cell.getIdx();
                } else
                    break;
            }
        }

        if (locCellsUsed.count() > 0) {
            cell = locCellsUsed.lastObject();
            idx = cell.getIdx();
            while (idx <= maxIdx && idx > endIdx) {
                this._moveCellOutOfSight(cell);
                if (locCellsUsed.count() > 0) {
                    cell = locCellsUsed.lastObject();
                    idx = cell.getIdx();
                } else
                    break;
            }
        }

        var locIndices = this._indices;
        for (var i = startIdx; i <= endIdx; i++) {
            if (locIndices.indexOf(i) !== -1)
                continue;
            this.updateCellAtIndex(i);
        }
    }

    scrollViewDidZoom(view) {}

    onTouchEnded(touch, event) {
        if (!this.isVisible())
            return;

        if (this._touchedCell) {
            var bb = this.getBoundingBox();
            var tmpOrigin = new Point(bb.x, bb.y);
            tmpOrigin = this._parent.convertToWorldSpace(tmpOrigin);
            bb.x = tmpOrigin.x;
            bb.y = tmpOrigin.y;
            var locTableViewDelegate = this._tableViewDelegate;
            if (Rect.containsPoint(bb, touch.getLocation()) && locTableViewDelegate !== null) {
                if (locTableViewDelegate.tableCellUnhighlight)
                    locTableViewDelegate.tableCellUnhighlight(this, this._touchedCell);
                if (locTableViewDelegate.tableCellTouched)
                    locTableViewDelegate.tableCellTouched(this, this._touchedCell);
            }
            this._touchedCell = null;
        }
        super.onTouchEnded(touch, event);
    }

    onTouchBegan(touch, event) {
        for (var c = this; c != null; c = c.parent) {
            if (!c.isVisible())
                return false;
        }

        var touchResult = super.onTouchBegan(touch, event);

        if (this._touches.length === 1) {
            var index, point;

            point = this.getContainer().convertTouchToNodeSpace(touch);

            index = this._indexFromOffset(point);
            if (index === INVALID_INDEX)
                this._touchedCell = null;
            else
                this._touchedCell = this.cellAtIndex(index);

            if (this._touchedCell && this._tableViewDelegate !== null && this._tableViewDelegate.tableCellHighlight)
                this._tableViewDelegate.tableCellHighlight(this, this._touchedCell);
        } else if (this._touchedCell) {
            if (this._tableViewDelegate !== null && this._tableViewDelegate.tableCellUnhighlight)
                this._tableViewDelegate.tableCellUnhighlight(this, this._touchedCell);
            this._touchedCell = null;
        }

        return touchResult;
    }

    onTouchMoved(touch, event) {
        super.onTouchMoved(touch, event);

        if (this._touchedCell && this.isTouchMoved()) {
            if (this._tableViewDelegate !== null && this._tableViewDelegate.tableCellUnhighlight)
                this._tableViewDelegate.tableCellUnhighlight(this, this._touchedCell);
            this._touchedCell = null;
        }
    }

    onTouchCancelled(touch, event) {
        super.onTouchCancelled(touch, event);

        if (this._touchedCell) {
            if (this._tableViewDelegate !== null && this._tableViewDelegate.tableCellUnhighlight)
                this._tableViewDelegate.tableCellUnhighlight(this, this._touchedCell);
            this._touchedCell = null;
        }
    }
}
