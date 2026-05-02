// Region labels a rect which is world axis aligned.
export class Region {
    constructor() {
        this._minX = 0;
        this._minY = 0;
        this._maxX = 0;
        this._maxY = 0;
        this._width = 0;
        this._height = 0;
        this._area = 0;
    }

    setTo(minX, minY, maxX, maxY) {
        this._minX = minX;
        this._minY = minY;
        this._maxX = maxX;
        this._maxY = maxY;
        this.updateArea();
        return this;
    }

    // convert region to int values which is fast for clipping
    intValues() {
        this._minX = Math.floor(this._minX);
        this._minY = Math.floor(this._minY);
        this._maxX = Math.ceil(this._maxX);
        this._maxY = Math.ceil(this._maxY);
        this.updateArea();
    }

    // update the area of region
    updateArea() {
        this._width = this._maxX - this._minX;
        this._height = this._maxY - this._minY;
        this._area = this._width * this._height;
    }

    // merge two regions into one
    union(target) {
        if (this._width <= 0 || this._height <= 0) {
            this.setTo(target._minX, target._minY, target._maxX, target._maxY);
            return;
        }
        if (this._minX > target._minX) this._minX = target._minX;
        if (this._minY > target._minY) this._minY = target._minY;
        if (this._maxX < target._maxX) this._maxX = target._maxX;
        if (this._maxY < target._maxY) this._maxY = target._maxY;
        this.updateArea();
    }

    // set region to empty
    setEmpty() {
        this._minX = 0;
        this._minY = 0;
        this._maxX = 0;
        this._maxY = 0;
        this._width = 0;
        this._height = 0;
        this._area = 0;
    }

    isEmpty() {
        return this._width <= 0 || this._height <= 0;
    }

    // check whether two regions intersect
    intersects(target) {
        if (this._width <= 0 || this._height <= 0 || target._width <= 0 || target._height <= 0) {
            return false;
        }
        let max = this._minX > target._minX ? this._minX : target._minX;
        let min = this._maxX < target._maxX ? this._maxX : target._maxX;
        if (max > min) return false;

        max = this._minY > target._minY ? this._minY : target._minY;
        min = this._maxY < target._maxY ? this._maxY : target._maxY;
        return max <= min;
    }

    // update region by a rotated bounds
    updateRegion(bounds, matrix) {
        if (bounds.width === 0 || bounds.height === 0) {
            this.setEmpty();
            return;
        }
        const { a, b, c, d, tx, ty } = matrix;
        const x = bounds.x;
        const y = bounds.y;
        const xMax = x + bounds.width;
        const yMax = y + bounds.height;
        let minX, minY, maxX, maxY;
        if (a === 1.0 && b === 0.0 && c === 0.0 && d === 1.0) {
            minX = x + tx - 1;
            minY = y + ty - 1;
            maxX = xMax + tx + 1;
            maxY = yMax + ty + 1;
        } else {
            let x0 = a * x + c * y + tx,   y0 = b * x + d * y + ty;
            let x1 = a * xMax + c * y + tx, y1 = b * xMax + d * y + ty;
            let x2 = a * xMax + c * yMax + tx, y2 = b * xMax + d * yMax + ty;
            let x3 = a * x + c * yMax + tx, y3 = b * x + d * yMax + ty;

            if (x0 > x1) { const t = x0; x0 = x1; x1 = t; }
            if (x2 > x3) { const t = x2; x2 = x3; x3 = t; }
            if (y0 > y1) { const t = y0; y0 = y1; y1 = t; }
            if (y2 > y3) { const t = y2; y2 = y3; y3 = t; }

            minX = (x0 < x2 ? x0 : x2) - 1;
            maxX = (x1 > x3 ? x1 : x3) + 1;
            minY = (y0 < y2 ? y0 : y2) - 1;
            maxY = (y1 > y3 ? y1 : y3) + 1;
        }
        this._minX = minX;
        this._minY = minY;
        this._maxX = maxX;
        this._maxY = maxY;
        this._width = maxX - minX;
        this._height = maxY - minY;
        this._area = this._width * this._height;
    }
}

const _regionPool = [];

function regionCreate() {
    return _regionPool.pop() || new Region();
}

function regionRelease(region) {
    _regionPool.push(region);
}

function unionArea(r1, r2) {
    const minX = r1._minX < r2._minX ? r1._minX : r2._minX;
    const minY = r1._minY < r2._minY ? r1._minY : r2._minY;
    const maxX = r1._maxX > r2._maxX ? r1._maxX : r2._maxX;
    const maxY = r1._maxY > r2._maxY ? r1._maxY : r2._maxY;
    return (maxX - minX) * (maxY - minY);
}

// DirtyRegion collects the dirty area which needs to be re-rendered in canvas.
// Many small regions are merged into larger ones to optimise performance.
export class DirtyRegion {
    constructor() {
        this.dirtyList = [];
        this.hasClipRect = false;
        this.clipWidth = 0;
        this.clipHeight = 0;
        this.clipArea = 0;
        this.clipRectChanged = false;
    }

    // regions outside the clip rect will not be considered
    setClipRect(width, height) {
        this.hasClipRect = true;
        this.clipRectChanged = true;
        this.clipWidth = Math.ceil(width);
        this.clipHeight = Math.ceil(height);
        this.clipArea = this.clipWidth * this.clipHeight;
    }

    // add a new dirty region (needs to be rendered)
    addRegion(target) {
        let minX = target._minX, minY = target._minY, maxX = target._maxX, maxY = target._maxY;

        if (this.hasClipRect) {
            if (minX < 0) minX = 0;
            if (minY < 0) minY = 0;
            if (maxX > this.clipWidth) maxX = this.clipWidth;
            if (maxY > this.clipHeight) maxY = this.clipHeight;
        }
        if (minX >= maxX || minY >= maxY) return false;
        if (this.clipRectChanged) return true;

        const region = regionCreate();
        this.dirtyList.push(region.setTo(minX, minY, maxX, maxY));
        this.mergeDirtyList(this.dirtyList);
        return true;
    }

    // clear all dirty regions
    clear() {
        const { dirtyList } = this;
        for (let i = 0, l = dirtyList.length; i < l; i++) {
            regionRelease(dirtyList[i]);
        }
        dirtyList.length = 0;
    }

    // get the merged dirty regions
    getDirtyRegions() {
        const { dirtyList } = this;
        if (this.clipRectChanged) {
            this.clipRectChanged = false;
            this.clear();
            dirtyList.push(regionCreate().setTo(0, 0, this.clipWidth, this.clipHeight));
        } else {
            while (this.mergeDirtyList(dirtyList)) {}
        }
        for (let i = 0, l = dirtyList.length; i < l; i++) {
            dirtyList[i].intValues();
        }
        return dirtyList;
    }

    // merge small dirty regions into bigger ones to improve performance
    mergeDirtyList(dirtyList) {
        const length = dirtyList.length;
        if (length < 2) return false;

        const { hasClipRect } = this;
        let bestDelta = length > 3 ? Number.POSITIVE_INFINITY : 0;
        let mergeA = 0, mergeB = 0, totalArea = 0;

        for (let i = 0; i < length - 1; i++) {
            const regionA = dirtyList[i];
            if (hasClipRect) totalArea += regionA.area;
            for (let j = i + 1; j < length; j++) {
                const regionB = dirtyList[j];
                const delta = unionArea(regionA, regionB) - regionA.area - regionB.area;
                if (bestDelta > delta) {
                    mergeA = i;
                    mergeB = j;
                    bestDelta = delta;
                }
            }
        }
        // if dirty area exceeds 95% of screen, skip further merging
        if (hasClipRect && (totalArea / this.clipArea) > 0.95) {
            this.clipRectChanged = true;
        }
        if (mergeA !== mergeB) {
            const region = dirtyList[mergeB];
            dirtyList[mergeA].union(region);
            regionRelease(region);
            dirtyList.splice(mergeB, 1);
            return true;
        }
        return false;
    }
}

