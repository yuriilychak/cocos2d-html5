import { Layer } from './layer';
import { LayerCanvasRenderer, LayerWebGLRenderer } from './renderer';

Layer.CanvasRenderCmd = LayerCanvasRenderer;
Layer.WebGLRenderCmd = LayerWebGLRenderer;

export { Layer };
export { LayerColor } from './layer-color';
export { LayerGradient } from './layer-gradient';
export { LayerMultiplex } from './layer-multiplex';
export * from './renderer';
