import { DrawNode } from "./draw-node";
import { DrawNodeElement } from "./draw-node-element";
import { DrawNodeCanvasRenderCmd } from "./canvas-render-cmd";
import { DrawNodeWebGLRenderCmd } from "./webgl-render-cmd";

// Wire up render cmds as static properties
DrawNode.CanvasRenderCmd = DrawNodeCanvasRenderCmd;
DrawNode.WebGLRenderCmd = DrawNodeWebGLRenderCmd;

// cc globals
cc.DrawNode = DrawNode;
cc._DrawNodeElement = DrawNodeElement;

export {
  DrawNode,
  DrawNodeElement,
  DrawNodeCanvasRenderCmd,
  DrawNodeWebGLRenderCmd
};
