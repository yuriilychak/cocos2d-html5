import { NewClass, INVALID_INDEX } from "@aspect/core";

export class SortableObject extends NewClass {
    setObjectID(objectId) {}
    getObjectID() { return 0; }
}

export class SortedObject extends SortableObject {
    _objectID = 0;

    constructor() {
        super();
        this._objectID = 0;
    }

    setObjectID(objectID) { this._objectID = objectID; }
    getObjectID() { return this._objectID; }
}

const _compareObject = function (val1, val2) {
    return (val1.getObjectID() - val2.getObjectID());
};

export class ArrayForObjectSorting extends NewClass {
    _saveObjectArr = null;

    constructor() {
        super();
        this._saveObjectArr = [];
    }

    insertSortedObject(addObject) {
        if (!addObject)
            throw new Error("ArrayForObjectSorting.insertSortedObject(): addObject should be non-null.");
        var idx = this.indexOfSortedObject(addObject);
        this.insertObject(addObject, idx);
    }

    removeSortedObject(delObject) {
        if (this.count() === 0) return;
        var idx = this.indexOfSortedObject(delObject);
        if (idx < this.count() && idx !== INVALID_INDEX) {
            var foundObj = this.objectAtIndex(idx);
            if (foundObj.getObjectID() === delObject.getObjectID()) {
                this.removeObjectAtIndex(idx);
            }
        }
    }

    setObjectID_ofSortedObject(tag, setObject) {
        var idx = this.indexOfSortedObject(setObject);
        if (idx < this.count() && idx !== INVALID_INDEX) {
            var foundObj = this.objectAtIndex(idx);
            if (foundObj.getObjectID() === setObject.getObjectID()) {
                this.removeObjectAtIndex(idx);
                foundObj.setObjectID(tag);
                this.insertSortedObject(foundObj);
            }
        }
    }

    objectWithObjectID(tag) {
        if (this.count() === 0) return null;
        var foundObj = new SortedObject();
        foundObj.setObjectID(tag);
        var idx = this.indexOfSortedObject(foundObj);
        if (idx < this.count() && idx !== INVALID_INDEX) {
            foundObj = this.objectAtIndex(idx);
            if (foundObj.getObjectID() !== tag)
                foundObj = null;
        }
        return foundObj;
    }

    getObjectWithObjectID(tag) {
        return null;
    }

    indexOfSortedObject(idxObj) {
        var idx = 0;
        if (idxObj) {
            var uPrevObjectID = 0;
            var uOfSortObjectID = idxObj.getObjectID();
            var locObjectArr = this._saveObjectArr;
            for (var i = 0; i < locObjectArr.length; i++) {
                var pSortableObj = locObjectArr[i];
                var curObjectID = pSortableObj.getObjectID();
                if ((uOfSortObjectID === curObjectID) ||
                    (uOfSortObjectID >= uPrevObjectID && uOfSortObjectID < curObjectID)) {
                    break;
                }
                uPrevObjectID = curObjectID;
                idx++;
            }
        } else {
            idx = INVALID_INDEX;
        }
        return idx;
    }

    count() { return this._saveObjectArr.length; }

    lastObject() {
        var locObjectArr = this._saveObjectArr;
        if (locObjectArr.length === 0) return null;
        return locObjectArr[locObjectArr.length - 1];
    }

    objectAtIndex(idx) { return this._saveObjectArr[idx]; }

    addObject(addObj) {
        this._saveObjectArr.push(addObj);
        this._saveObjectArr.sort(_compareObject);
    }

    removeObjectAtIndex(idx) {
        this._saveObjectArr.splice(idx, 1);
        this._saveObjectArr.sort(_compareObject);
    }

    insertObject(addObj, idx) {
        this._saveObjectArr.splice(idx, 0, addObj);
        this._saveObjectArr.sort(_compareObject);
    }
}
