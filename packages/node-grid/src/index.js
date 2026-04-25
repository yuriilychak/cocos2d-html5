import { NodeGrid } from "./node-grid";
import { NodeGridWebGLRenderCmd } from "./node-grid-webgl-render-cmd";

NodeGrid.WebGLRenderCmd = NodeGridWebGLRenderCmd;

cc.NodeGrid = NodeGrid;

export { NodeGrid, NodeGridWebGLRenderCmd };
