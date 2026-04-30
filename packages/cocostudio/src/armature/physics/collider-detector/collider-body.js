/****************************************************************************
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * Base class for ColliderBody
 *
 * @property {ContourData}      contourData     - The contour data of collider body
 * @property {Shape}            shape           - The shape of collider body
 * @property {ColliderFilter}   colliderFilter  - The collider filter of collider body
 *
 */
import { NewClass } from "@aspect/core";
import { ColliderFilter } from "./collider-filter.js";

import { ENABLE_PHYSICS_SAVE_CALCULATED_VERTEX } from "../../armature-define.js";
export class ColliderBody extends NewClass {
    constructor(contourData) {
        super();
        this.shape = null;
        this.coutourData = contourData;
        this.colliderFilter = new ColliderFilter();
        if (ENABLE_PHYSICS_SAVE_CALCULATED_VERTEX) {
            this._calculatedVertexList = [];
        }
    }

    /**
     * contourData getter
     * @returns {ContourData}
     */
    getContourData() {
        return this.coutourData;
    }

    /**
     * colliderFilter setter
     * @param {ColliderFilter} colliderFilter
     */
    setColliderFilter(colliderFilter) {
        this.colliderFilter = colliderFilter;
    }

    /**
     * get calculated vertex list
     * @returns {Array}
     */
    getCalculatedVertexList() {
        return this._calculatedVertexList;
    }

    setB2Fixture(fixture){
        this._fixture = fixture;
    }

    getB2Fixture(){
        return this._fixture;
    }

    /**
     * shape getter
     * @param {Shape} shape
     */
    setShape(shape) {
        this.shape = shape;
    }

    /**
     * shape setter
     * @return {Shape}
     */
    getShape() {
        return this.shape;
    }

    /**
     * contourData setter
     * @param {ContourData} contourData
     */
    setContourData(contourData) {
        this.coutourData = contourData;
    }

    /**
     * colliderFilter getter
     * @returns {ColliderFilter}
     */
    getColliderFilter() {
        return this.colliderFilter;
    }

}

