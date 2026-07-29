import { Color } from "../../platform";
import { BYTE } from "../../constants";
import type { DirtyNode, RendererInterface } from "./types";

/** Shared scene-command lifecycle for the Canvas and WebGL renderers. */
export abstract class RendererBase<Command> implements RendererInterface {
  #childrenOrderDirty = true;
  #assignedZ = 0;
  #assignedZStep: number;
  #transformNodePool: DirtyNode[] = [];
  #renderCmds: Command[] = [];
  #clearColor: Color = new Color(0, 0, 0, BYTE);

  protected constructor(assignedZStep: number) {
    this.#assignedZStep = assignedZStep;
  }

  protected get renderCmds(): Command[] {
    return this.#renderCmds;
  }

  abstract clear(): void;

  abstract rendering(...args: any[]): void;

  abstract setDepthTest(on: boolean): void;

  getRenderCmd(renderableObject: { createRenderCmd(): unknown }): unknown {
    return renderableObject.createRenderCmd();
  }

  resetFlag(): void {
    this.#childrenOrderDirty = false;
    this.#transformNodePool.length = 0;
  }

  transform(): void {
    this.#transformNodePool.sort(this.#sortNodeByLevelAsc);
    for (const node of this.#transformNodePool) {
      if (this.shouldUpdateDirtyNode(node)) {
        node.updateStatus();
      }
    }
    this.#transformNodePool.length = 0;
  }

  transformDirty(): boolean {
    return this.#transformNodePool.length > 0;
  }

  pushDirtyNode(node: DirtyNode): void {
    this.#transformNodePool.push(node);
  }

  clearRenderCommands(): void {
    this.#renderCmds.length = 0;
  }

  get childrenOrderDirty(): boolean {
    return this.#childrenOrderDirty;
  }

  set childrenOrderDirty(value: boolean) {
    this.#childrenOrderDirty = value;
  }

  get assignedZ(): number {
    return this.#assignedZ;
  }

  set assignedZ(value: number) {
    this.#assignedZ = value;
  }

  get assignedZStep(): number {
    return this.#assignedZStep;
  }

  set assignedZStep(value: number) {
    this.#assignedZStep = value;
  }

  abstract get allNeedDraw(): boolean;

  abstract set allNeedDraw(value: boolean);

  get clearColor(): Color {
    return this.#clearColor;
  }

  set clearColor(value: Color) {
    this.#clearColor.set(value);
  }

  abstract get clearFillStyle(): string;

  abstract set clearFillStyle(value: string);

  protected shouldUpdateDirtyNode(node: DirtyNode): boolean {
    return node._dirtyFlag !== 0;
  }

  #sortNodeByLevelAsc(n1: DirtyNode, n2: DirtyNode): number {
    return n1._curLevel - n2._curLevel;
  }
}
