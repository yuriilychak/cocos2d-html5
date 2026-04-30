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

cc.TMXTiledMap = TMXTiledMap;
cc.TMXLayer = TMXLayer;
cc.TMXObjectGroup = TMXObjectGroup;
cc.TMXMapInfo = TMXMapInfo;
cc.TMXLayerInfo = TMXLayerInfo;
cc.TMXTilesetInfo = TMXTilesetInfo;

cc.TMX_ORIENTATION_ORTHO = TMX_ORIENTATION_ORTHO;
cc.TMX_ORIENTATION_HEX = TMX_ORIENTATION_HEX;
cc.TMX_ORIENTATION_ISO = TMX_ORIENTATION_ISO;
cc.TMX_PROPERTY_NONE = TMX_PROPERTY_NONE;
cc.TMX_PROPERTY_MAP = TMX_PROPERTY_MAP;
cc.TMX_PROPERTY_LAYER = TMX_PROPERTY_LAYER;
cc.TMX_PROPERTY_OBJECTGROUP = TMX_PROPERTY_OBJECTGROUP;
cc.TMX_PROPERTY_OBJECT = TMX_PROPERTY_OBJECT;
cc.TMX_PROPERTY_TILE = TMX_PROPERTY_TILE;
cc.TMX_TILE_HORIZONTAL_FLAG = TMX_TILE_HORIZONTAL_FLAG;
cc.TMX_TILE_VERTICAL_FLAG = TMX_TILE_VERTICAL_FLAG;
cc.TMX_TILE_DIAGONAL_FLAG = TMX_TILE_DIAGONAL_FLAG;
cc.TMX_TILE_FLIPPED_ALL = TMX_TILE_FLIPPED_ALL;
cc.TMX_TILE_FLIPPED_MASK = TMX_TILE_FLIPPED_MASK;

cc.TGA_OK = TGA_OK;
cc.TGA_ERROR_FILE_OPEN = TGA_ERROR_FILE_OPEN;
cc.TGA_ERROR_READING_FILE = TGA_ERROR_READING_FILE;
cc.TGA_ERROR_INDEXED_COLOR = TGA_ERROR_INDEXED_COLOR;
cc.TGA_ERROR_MEMORY = TGA_ERROR_MEMORY;
cc.TGA_ERROR_COMPRESSED_FILE = TGA_ERROR_COMPRESSED_FILE;
cc.ImageTGA = ImageTGA;
cc.__getSubArray = __getSubArray;
cc.__setDataToArray = __setDataToArray;
cc.tgaLoadHeader = tgaLoadHeader;
cc.tgaLoadImageData = tgaLoadImageData;
cc.tgaRGBtogreyscale = tgaRGBtogreyscale;
cc.tgaDestroy = tgaDestroy;
cc.tgaLoadRLEImageData = tgaLoadRLEImageData;
cc.tgaFlipImage = tgaFlipImage;
cc.BinaryStreamReader = BinaryStreamReader;

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
