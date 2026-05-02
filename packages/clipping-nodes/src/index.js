import { ClippingNode } from "./clipping-node";
import { ClippingNodeCanvasRenderCmd } from "./clipping-node-canvas-render-cmd";
import { ClippingNodeWebGLRenderCmd } from "./clipping-node-webgl-render-cmd";

// Wire render cmds to ClippingNode
ClippingNode.CanvasRenderCmd = ClippingNodeCanvasRenderCmd;
ClippingNode.WebGLRenderCmd = ClippingNodeWebGLRenderCmd;


export {
  ClippingNode,
  ClippingNodeCanvasRenderCmd,
  ClippingNodeWebGLRenderCmd
};
