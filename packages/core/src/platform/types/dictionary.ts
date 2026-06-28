/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
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

import { BaseClass } from '../class';

export class _Dictionary extends BaseClass {
    #map: Map<unknown, unknown>;

    constructor() {
        super();
        this.#map = new Map();
    }

    set(value: unknown, key: unknown): void {
        if (key == null)
            return;

        this.#map.set(key, value);
    }

    get(key: unknown): unknown | null {
        if (key == null)
            return null;

        return this.#map.has(key) ? this.#map.get(key) : null;
    }

    delete(key: unknown | unknown[]): void {
        if (key == null)
            return;

        if (!Array.isArray(key)) {
            this.#map.delete(key);
            return;
        }

        for (let i = 0; i < key.length; i++)
            this.delete(key[i]);
    }

    clean(): void {
        this.#map.clear();
    }

    get keys(): unknown[] {
        return Array.from(this.#map.keys());
    }

    get size(): number {
        return this.#map.size;
    }
}
