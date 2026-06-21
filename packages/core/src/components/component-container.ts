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

import { log } from "../boot/debugger";
import { BaseClass } from "../platform/class";
import { Component } from "./component";
import type { ComponentOwnerLike } from './types';

type ComponentMap = Record<string, Component>;

/**
 * The component container for Cocostudio, it has some components.
 */
export class ComponentContainer extends BaseClass {
  public _components: ComponentMap | null = null;
  public _owner: ComponentOwnerLike;

  public constructor(node: ComponentOwnerLike) {
    super();
    this._owner = node;
  }

  public getComponent(name: string): Component | undefined {
    if (!name) {
      throw new Error("ComponentContainer.getComponent(): name should be non-null");
    }

    const componentName = name.trim();
    if (!this._components) {
      this._components = {};
    }

    return this._components[componentName];
  }

  public add(component: Component | null): boolean {
    if (!component) {
      throw new Error("ComponentContainer.add(): component should be non-null");
    }

    if (component.owner) {
      log("ComponentContainer.add(): Component already added. It can't be added again");
      return false;
    }

    if (this._components == null) {
      this._components = {};
      this._owner.scheduleUpdate?.();
    }

    const oldComponent = this._components[component.name];
    if (oldComponent) {
      log("ComponentContainer.add(): Component already added. It can't be added again");
      return false;
    }

    component.owner = this._owner;
    this._components[component.name] = component;
    component.onEnter();
    return true;
  }

  public remove(name: string | Component): boolean {
    if (!name) {
      throw new Error("ComponentContainer.remove(): name should be non-null");
    }

    if (!this._components) {
      return false;
    }

    if (name instanceof Component) {
      return this._removeByComponent(name);
    }

    return this._removeByComponent(this._components[name.trim()]);
  }

  public _removeByComponent(component?: Component): boolean {
    if (!component) {
      return false;
    }

    component.onExit();
    component.owner = null;
    delete this._components?.[component.name];
    return true;
  }

  public removeAll(): void {
    if (!this._components) {
      return;
    }

    const components = this._components;
    for (const component of Object.values(components)) {
      component.onExit();
      component.owner = null;
    }

    this._owner.unscheduleUpdate?.();
    this._components = null;
  }

  public _alloc(): void {
    this._components = {};
  }

  public visit(delta: number): void {
    if (!this._components) {
      return;
    }

    for (const component of Object.values(this._components)) {
      component.update(delta);
    }
  }

  public isEmpty(): boolean {
    if (!this._components) {
      return true;
    }

    return Object.keys(this._components).length === 0;
  }
}
