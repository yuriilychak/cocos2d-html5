import { TMXTiledMap } from "./tmx-tiled-map";
import { TMXLayer } from "./tmx-layer";
import { TMXObjectGroup } from "./tmx-object-group";
import { TMXMapInfo } from "./tmx-map-info";
import { TMXLayerInfo, TMXTilesetInfo } from "./tmx-layer-info";
import { TMXLayerCanvasRenderCmd } from "./tmx-layer-canvas-render-cmd";
import { TMXLayerWebGLRenderCmd } from "./tmx-layer-webgl-render-cmd";
import {
  TMX_ORIENTATION_ORTHO,
  TMX_ORIENTATION_HEX,
  TMX_ORIENTATION_ISO,
  TMX_PROPERTY_NONE,
  TMX_PROPERTY_MAP,
  TMX_PROPERTY_LAYER,
  TMX_PROPERTY_OBJECTGROUP,
  TMX_PROPERTY_OBJECT,
  TMX_PROPERTY_TILE,
  TMX_TILE_HORIZONTAL_FLAG,
  TMX_TILE_VERTICAL_FLAG,
  TMX_TILE_DIAGONAL_FLAG,
  TMX_TILE_FLIPPED_ALL,
  TMX_TILE_FLIPPED_MASK
} from "./constants";
import {
  TGA_OK,
  TGA_ERROR_FILE_OPEN,
  TGA_ERROR_READING_FILE,
  TGA_ERROR_INDEXED_COLOR,
  TGA_ERROR_MEMORY,
  TGA_ERROR_COMPRESSED_FILE,
  ImageTGA,
  __getSubArray,
  __setDataToArray,
  tgaLoadHeader,
  tgaLoadImageData,
  tgaRGBtogreyscale,
  tgaDestroy,
  tgaLoadRLEImageData,
  tgaFlipImage,
  BinaryStreamReader
} from "./tga-lib";

TMXLayer.CanvasRenderCmd = TMXLayerCanvasRenderCmd;
TMXLayer.WebGLRenderCmd = TMXLayerWebGLRenderCmd;


export {
  TMXTiledMap,
  TMXLayer,
  TMXObjectGroup,
  TMXMapInfo,
  TMXLayerInfo,
  TMXTilesetInfo,
  TMXLayerCanvasRenderCmd,
  TMXLayerWebGLRenderCmd,
  TMX_ORIENTATION_ORTHO,
  TMX_ORIENTATION_HEX,
  TMX_ORIENTATION_ISO,
  TMX_PROPERTY_NONE,
  TMX_PROPERTY_MAP,
  TMX_PROPERTY_LAYER,
  TMX_PROPERTY_OBJECTGROUP,
  TMX_PROPERTY_OBJECT,
  TMX_PROPERTY_TILE,
  TMX_TILE_HORIZONTAL_FLAG,
  TMX_TILE_VERTICAL_FLAG,
  TMX_TILE_DIAGONAL_FLAG,
  TMX_TILE_FLIPPED_ALL,
  TMX_TILE_FLIPPED_MASK,
  TGA_OK,
  TGA_ERROR_FILE_OPEN,
  TGA_ERROR_READING_FILE,
  TGA_ERROR_INDEXED_COLOR,
  TGA_ERROR_MEMORY,
  TGA_ERROR_COMPRESSED_FILE,
  ImageTGA,
  __getSubArray,
  __setDataToArray,
  tgaLoadHeader,
  tgaLoadImageData,
  tgaRGBtogreyscale,
  tgaDestroy,
  tgaLoadRLEImageData,
  tgaFlipImage,
  BinaryStreamReader
};
