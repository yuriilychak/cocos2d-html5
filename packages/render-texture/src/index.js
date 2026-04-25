import {
  RenderTexture,
  IMAGE_FORMAT_JPEG,
  IMAGE_FORMAT_PNG,
  IMAGE_FORMAT_RAWDATA
} from "./render-texture.js";
import { RenderTextureCanvasRenderCmd } from "./canvas-render-cmd.js";
import { RenderTextureWebGLRenderCmd } from "./webgl-render-cmd.js";

// Wire up render cmds to resolve the circular dependency
RenderTexture.CanvasRenderCmd = RenderTextureCanvasRenderCmd;
RenderTexture.WebGLRenderCmd = RenderTextureWebGLRenderCmd;

cc.RenderTexture = RenderTexture;
cc.IMAGE_FORMAT_JPEG = IMAGE_FORMAT_JPEG;
cc.IMAGE_FORMAT_PNG = IMAGE_FORMAT_PNG;
cc.IMAGE_FORMAT_RAWDATA = IMAGE_FORMAT_RAWDATA;

export {
  RenderTexture,
  IMAGE_FORMAT_JPEG,
  IMAGE_FORMAT_PNG,
  IMAGE_FORMAT_RAWDATA
};
