import { PIXEL_FORMAT } from "../../enums";
import type { NumericPixelData, PixelDataFactory, TextureImage } from "./types";

const defaultPixelDataFactory: PixelDataFactory = (uiImage) => uiImage.getData();

const extractBits = (
  value: number,
  outerOffset: number,
  outerShift: number,
  innerOffset: number = 0
) =>
  ((((value >> innerOffset) & 0xff) >> outerOffset) << outerShift);

const createRGB565PixelData: PixelDataFactory = (
  uiImage: TextureImage,
  width,
  height,
  hasAlpha
) => {
  const length = width * height;
  const tempData = new Uint16Array(length);

  if (hasAlpha) {
    const inPixel32 = uiImage.getData();
    for (let i = 0; i < length; ++i) {
      tempData[i] =
        extractBits(inPixel32[i], 3, 11, 0) |
        extractBits(inPixel32[i], 2, 5, 8) |
        extractBits(inPixel32[i], 3, 0, 16);
    }
  } else {
    const inPixel8 = uiImage.getData();
    for (let i = 0; i < length; ++i) {
      const innerOffset = i * 3;
      tempData[i] =
        extractBits(inPixel8[innerOffset], 3, 11) |
        extractBits(inPixel8[innerOffset + 1], 2, 5) |
        extractBits(inPixel8[innerOffset + 2], 3, 0);
    }
  }

  return tempData;
};

const createRGBA4444PixelData: PixelDataFactory = (uiImage, width, height) => {
  const length = width * height;
  const tempData = new Uint16Array(length);
  const inPixel32 = uiImage.getData();

  for (let i = 0; i < length; ++i) {
    tempData[i] =
      extractBits(inPixel32[i], 4, 12, 0) |
      extractBits(inPixel32[i], 4, 8, 8) |
      extractBits(inPixel32[i], 4, 4, 16) |
      extractBits(inPixel32[i], 4, 0, 24);
  }

  return tempData;
};

const createRGB5A1PixelData: PixelDataFactory = (uiImage, width, height) => {
  const length = width * height;
  const tempData = new Uint16Array(length);
  const inPixel32 = uiImage.getData();

  for (let i = 0; i < length; ++i) {
    tempData[i] =
      extractBits(inPixel32[i], 3, 11, 0) |
      extractBits(inPixel32[i], 3, 6, 8) |
      extractBits(inPixel32[i], 3, 1, 16) |
      extractBits(inPixel32[i], 7, 0, 24);
  }

  return tempData;
};

const createA8PixelData: PixelDataFactory = (uiImage, width, height) => {
  const length = width * height;
  const tempData = new Uint8Array(length);
  const inPixel32 = uiImage.getData();

  for (let i = 0; i < length; ++i) {
    tempData[i] = extractBits(inPixel32[i], 0, 0, 24);
  }

  return tempData;
};

const createRGB888PixelData: PixelDataFactory = (
  uiImage,
  width,
  height,
  hasAlpha
) => {
  if (!hasAlpha) {
    return defaultPixelDataFactory(uiImage, width, height, hasAlpha);
  }

  const length = width * height;
  const tempData = new Uint8Array(length * 3);
  const inPixel32 = uiImage.getData();

  for (let i = 0; i < length; ++i) {
    tempData[i * 3] = extractBits(inPixel32[i], 0, 0, 0);
    tempData[i * 3 + 1] = extractBits(inPixel32[i], 0, 0, 8);
    tempData[i * 3 + 2] = extractBits(inPixel32[i], 0, 0, 16);
  }

  return tempData;
};

const PIXEL_DATA_FACTORIES: Partial<
  Record<PIXEL_FORMAT, PixelDataFactory>
> = {
  [PIXEL_FORMAT.NONE]: defaultPixelDataFactory,
  [PIXEL_FORMAT.RGB565]: createRGB565PixelData,
  [PIXEL_FORMAT.RGBA4444]: createRGBA4444PixelData,
  [PIXEL_FORMAT.RGB5A1]: createRGB5A1PixelData,
  [PIXEL_FORMAT.A8]: createA8PixelData,
  [PIXEL_FORMAT.RGB888]: createRGB888PixelData
};

export default function createPixelData(
  pixelFormat: PIXEL_FORMAT,
  uiImage: TextureImage,
  width: number,
  height: number
): NumericPixelData {
  const hasAlpha = uiImage.hasAlpha();
  const pixelDataFactory =
    PIXEL_DATA_FACTORIES[pixelFormat] ||
    PIXEL_DATA_FACTORIES[PIXEL_FORMAT.NONE]!;
  return pixelDataFactory(uiImage, width, height, hasAlpha);
}
