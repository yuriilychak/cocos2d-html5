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

import { BaseClass } from "../platform/class";
import type { ComponentOwnerLike } from './types';

type ComponentConstructor = typeof Component & {
  componentName?: string;
  NAME?: string;
};

/**
 * The base class of component in CocoStudio
 */
export class Component extends BaseClass {
  public static componentName?: string;
  protected _name?: string;
  #owner: ComponentOwnerLike | null = null;
  #name = "";
  #enabled = true;

  public constructor() {
    super();
    const ctor = this.constructor as ComponentConstructor;
    this.#name = ctor.componentName || ctor.NAME || "";
  }

  public init(): boolean {
    return true;
  }

  public onEnter(): void {}

  public onExit(): void {}

  public update(_delta: number): void {}

  public serialize(_reader: unknown): void {}

  public get enabled(): boolean {
    return this.#enabled;
  }

  public set enabled(enable: boolean) {
    this.#enabled = enable;
  }

  public get name(): string {
    const ctor = this.constructor as ComponentConstructor;
    return this.#name || ctor.componentName || ctor.NAME || this._name || "";
  }

  public set name(name: string) {
    this.#name = name;
  }

  public set owner(owner: ComponentOwnerLike | null) {
    this.#owner = owner;
  }

  public get owner(): ComponentOwnerLike | null {
    return this.#owner;
  }
}
