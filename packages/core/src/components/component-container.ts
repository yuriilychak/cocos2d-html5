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
import { ComponentOwnerLike } from "./types";

/**
 * Component container class to implemeent composition for Node class.
 */
export class ComponentContainer extends BaseClass {
  #components = new Map<string, Component>();

  /**
   * Returns a component identified by the given name.
   */
  public getComponent(name: string): Component | null {
    return this.#components.get(name.trim()) || null;
  }

  /**
   * Adds a component to the node's component container.
   */
  public addComponent(component: Component): boolean {

    if (component.owner) {
      log("ComponentContainer.addComponent(): Component already added. It can't be added again");
      return false;
    }

    const oldComponent = this.#components.get(component.name);
    if (oldComponent) {
      log("ComponentContainer.addComponent(): Component already added. It can't be added again");
      return false;
    }

    component.owner = this as ComponentOwnerLike;
    this.#components.set(component.name, component);
    component.onEnter();
    return true;
  }

  /**
   * Removes a component identified by the given name or removes the component given object.
   */
  public removeComponent(name: string): boolean
  public removeComponent(component: Component): boolean;
  public removeComponent(nameOrComponent: string | Component): boolean {
    const component: Component | null = nameOrComponent instanceof Component
      ? nameOrComponent
      : this.getComponent(nameOrComponent);

    if (component === null) {
      return false;
    }

    component.onExit();
    component.owner = null;
    this.#components.delete(component.name);

    return true;
  }

  /**
   * Removes all components of Node, it called when Node is exiting from stage.
   */
  public removeAllComponents(excludedNames: readonly string[] = []): void {
    if (!this.hasComponents) {
      return;
    }

    for (const [name, component] of this.#components) {
      if (excludedNames.includes(name)) {
        continue;
      }

      component.onExit();
      component.owner = null;
      this.#components.delete(name);
    }
  }

  /**
   * Update will be called automatically every frame if "scheduleUpdate" is called when the node is "live".<br/>
   * The default behavior is to invoke the visit function of node's componentContainer.<br/>
   */
  public update(delta: number): void {
    if(!this.hasComponents) {
      return;
    }

    for (const component of this.#components.values()) {
      component.update(delta);
    }
  }

  public get hasComponents(): boolean {
    return this.#components.size > 0;
  }
}
