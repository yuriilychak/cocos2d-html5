/****************************************************************************
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

import DirtyRegion from "./dirty-region";
import { log } from "../../boot/debugger";
import { arrayRemoveObject } from "../../platform/macro/utils";
import { CanvasRenderCmd as NodeCanvasRenderCmd } from "../../base-nodes/node-canvas-render-cmd";
import { ServiceLocator } from "../../service-locator";
import { BYTE } from "../../constants";
import { AffineTransform } from "../../geometry";
import type CanvasContextWrapper from "./canvas-context-wrapper";
import { RendererBase } from "./renderer-base";

type RenderCommand = {
  _canUseDirtyRegion: boolean;
  _regionFlag: number;
  _oldRegion: any;
  _currentRegion: any;
  needDraw(): boolean;
  rendering(ctx: CanvasContextWrapper, scaleX: number, scaleY: number): void;
};

export default class RendererCanvas extends RendererBase<RenderCommand> {
  #cacheToCanvasCmds: Map<number, RenderCommand[]> = new Map();
  #clearFillStyle: string = "rgb(0, 0, 0)";
  #allNeedDraw: boolean = true;
  #isCacheToCanvasOn: boolean = false;
  #cacheInstanceIds: number[] = [];
  #currentID: number = 0;
  #dirtyRegion: DirtyRegion | null = null;
  #enableDirtyRegion: boolean = false;
  #debugDirtyRegion: boolean = false;
  #canUseDirtyRegion: boolean = false;
  #dirtyRegionCountThreshold: number = 10;
  #identityTransform: AffineTransform = AffineTransform.makeIdentity();

  constructor() {
    super(1 / 10000);
  }

  setDirtyRegionCountThreshold(threshold: number): void {
    this.#dirtyRegionCountThreshold = threshold;
  }

  setDepthTest(on: boolean) {
    //Need only for compability
  }

  rendering(ctxWrapper?: CanvasContextWrapper): void {
    const dirtyRegion = (this.#dirtyRegion ??= new DirtyRegion());
    const viewport = ServiceLocator.eglView.canvas;
    const wrapper = (ctxWrapper || ServiceLocator.sys.rendererConfig.renderContext) as CanvasContextWrapper;
    const ctx = wrapper.context;
    const scale = ServiceLocator.eglView.scale;
    const scaleX = scale.x;
    const scaleY = scale.y;

    wrapper.viewScale = scale;
    wrapper.computeRealOffsetY();
    const dirtyList = dirtyRegion.dirtyRegions;
    let allNeedDraw =
      this.#allNeedDraw || !this.#enableDirtyRegion || !this.#canUseDirtyRegion;
    let collectResult = true;
    if (!allNeedDraw) collectResult = this.#collectDirtyRegion();
    allNeedDraw = allNeedDraw || !collectResult;

    if (!allNeedDraw) this.#beginDrawDirtyRegion(wrapper);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, viewport.width, viewport.height);
    if (
      this.clearColor.r !== BYTE ||
      this.clearColor.g !== BYTE ||
      this.clearColor.b !== BYTE
    ) {
      wrapper.fillStyle = this.#clearFillStyle;
      wrapper.globalAlpha = this.clearColor.a;
      ctx.fillRect(0, 0, viewport.width, viewport.height);
    }

    for (const cmd of this.renderCmds) {
      const cmdRegion = cmd._currentRegion;
      let needRendering = !cmdRegion || allNeedDraw;
      
      if (!needRendering) {
        for (const region of dirtyList) {
          if (region.intersects(cmdRegion)) {
            needRendering = true;
            break;
          }
        }
      }

      if (needRendering) {
        cmd.rendering(wrapper, scaleX, scaleY);
      }
    }

    if (!allNeedDraw) {
      this.#debugDrawDirtyRegion(wrapper);
      this.#endDrawDirtyRegion(ctx);
    }

    dirtyRegion.clear();
    this.#allNeedDraw = false;
  }

  renderingToCacheCanvas(
    ctx: CanvasContextWrapper | null = null,
    instanceID: number = this.#currentID,
    scaleX: number = 1,
    scaleY: number = 1
  ): void {
    if (!ctx) {
      log("The context of RenderTexture is invalid.");
      return;
    }

    const locCmds = this.#cacheToCanvasCmds.get(instanceID) ?? [];
    ctx.computeRealOffsetY();
    
    for (const cmd of locCmds) {
      cmd.rendering(ctx, scaleX, scaleY);
    }

    this.removeCache(instanceID);

    if (this.#cacheInstanceIds.length === 0) {
      this.#isCacheToCanvasOn = false;
    }
    else {
      this.#currentID = this.#cacheInstanceIds[this.#cacheInstanceIds.length - 1];
    }
  }

  turnToCacheMode(renderTextureID: number = 0): void {
    this.#isCacheToCanvasOn = true;
    this.#cacheToCanvasCmds.set(renderTextureID, []);

    if (this.#cacheInstanceIds.indexOf(renderTextureID) === -1) {
      this.#cacheInstanceIds.push(renderTextureID);
    }

    this.#currentID = renderTextureID;
  }

  turnToNormalMode(): void {
    this.#isCacheToCanvasOn = false;
  }

  removeCache(instanceID: number = this.#currentID): void {
    const cmds = this.#cacheToCanvasCmds.get(instanceID);
    if (cmds) {
      cmds.length = 0;
      this.#cacheToCanvasCmds.delete(instanceID);
    }

    arrayRemoveObject(this.#cacheInstanceIds, instanceID);
  }

  clear(): void {}

  clearRenderCommands(): void {
    super.clearRenderCommands();
    this.#cacheInstanceIds.length = 0;
    this.#isCacheToCanvasOn = false;
    this.#allNeedDraw = true;
    this.#canUseDirtyRegion = true;
  }

  pushRenderCommand(cmd: RenderCommand): void {
    if (!cmd.needDraw()) {
      return;
    }

    if (!cmd._canUseDirtyRegion) {
      this.#canUseDirtyRegion = false;
    }

    if (this.#isCacheToCanvasOn) {
      const cmdList = this.#cacheToCanvasCmds.get(this.#currentID);
      if (cmdList && cmdList.indexOf(cmd) === -1) {
        cmdList.push(cmd);
      }
    } else if (this.renderCmds.indexOf(cmd) === -1) {
      this.renderCmds.push(cmd);
    }
  }

  #collectDirtyRegion(): boolean {
    const dirtyRegion = this.#dirtyRegion!;
    let dirtyRegionCount = 0;
    let result = true;
    const localStatus = (NodeCanvasRenderCmd as any).RegionStatus;

    for (const cmd of this.renderCmds) {
      if (cmd._regionFlag > localStatus.NotDirty) {
        ++dirtyRegionCount;
        if (dirtyRegionCount > this.#dirtyRegionCountThreshold) {
          result = false;
        }
        if (result) {
          !cmd._currentRegion.empty && dirtyRegion.addRegion(cmd._currentRegion);
          if (cmd._regionFlag > localStatus.Dirty) {
            !cmd._oldRegion.empty && dirtyRegion.addRegion(cmd._oldRegion);
          }
        }
        cmd._regionFlag = localStatus.NotDirty;
      }
    }
    return result;
  }

  #beginDrawDirtyRegion(ctxWrapper: CanvasContextWrapper): void {
    const ctx = ctxWrapper.context;
    const dirtyList = this.#dirtyRegion!.dirtyRegions;
    ctx.save();
    const scaleX = ctxWrapper.scaleX;
    const scaleY = ctxWrapper.scaleY;
    ctxWrapper.setTransform(this.#identityTransform, { x: scaleX, y: scaleY });
    ctx.beginPath();
    for (const region of dirtyList) {
      ctx.rect(region.min.x, -region.max.y, region.size.width, region.size.height);
    }
    ctx.clip();
  }

  #endDrawDirtyRegion(ctx: CanvasRenderingContext2D): void {
    ctx.restore();
  }

  #debugDrawDirtyRegion(ctxWrapper: CanvasContextWrapper): void {
    if (!this.#debugDirtyRegion) {
      return;
    }

    const ctx = ctxWrapper.context;
    const dirtyList = this.#dirtyRegion!.dirtyRegions;
    const scaleX = ctxWrapper.scaleX;
    const scaleY = ctxWrapper.scaleY;
    ctxWrapper.setTransform(this.#identityTransform, { x: scaleX, y: scaleY });
    ctx.beginPath();
    for (const region of dirtyList) {
      ctx.rect(region.min.x, -region.max.y, region.size.width, region.size.height);
    }
    const oldStyle = ctx.fillStyle;
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.fillStyle = oldStyle;
  }

  get cacheToCanvasCmds(): Map<number, RenderCommand[]> {
    return this.#cacheToCanvasCmds;
  }

  get clearFillStyle(): string {
    return this.#clearFillStyle;
  }

  set clearFillStyle(value: string) {
    this.#clearFillStyle = value;
  }

  get allNeedDraw(): boolean {
    return this.#allNeedDraw;
  }

  set allNeedDraw(value: boolean) {
    this.#allNeedDraw = value;
  }

  set enableDirtyRegion(enabled: boolean) {
    this.#enableDirtyRegion = enabled;
  }

  get enableDirtyRegion(): boolean {
    return this.#enableDirtyRegion;
  }
}
