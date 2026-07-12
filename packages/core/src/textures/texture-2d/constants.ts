/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
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

import { PIXEL_FORMAT } from "../../enums";
import type {
  TextureParameterKey,
  TextureParameterValueKey,
  WebGLPixelFormatMapping,
  WebGLTextureFilterMapping
} from "./types";

export const defaultPixelFormat: PIXEL_FORMAT = PIXEL_FORMAT.DEFAULT;

export const WEBGL_DEFAULT_TEXTURE_PARAMETERS: [
  TextureParameterKey,
  TextureParameterValueKey
][] = [
  ["TEXTURE_MIN_FILTER", "LINEAR"],
  ["TEXTURE_MAG_FILTER", "LINEAR"],
  ["TEXTURE_WRAP_S", "CLAMP_TO_EDGE"],
  ["TEXTURE_WRAP_T", "CLAMP_TO_EDGE"]
];

export const WEBGL_ANTI_ALIAS_TEXTURE_FILTERS: WebGLTextureFilterMapping = {
  filter: "LINEAR",
  mipmapMinFilter: "LINEAR_MIPMAP_NEAREST"
};

export const WEBGL_ALIAS_TEXTURE_FILTERS: WebGLTextureFilterMapping = {
  filter: "NEAREST",
  mipmapMinFilter: "NEAREST_MIPMAP_NEAREST"
};

export const WEBGL_PIXEL_FORMATS: Partial<
  Record<PIXEL_FORMAT, WebGLPixelFormatMapping>
> = {
  [PIXEL_FORMAT.NONE]: {
    format: "RGBA",
    type: "UNSIGNED_BYTE"
  },
  [PIXEL_FORMAT.RGBA8888]: {
    format: "RGBA",
    type: "UNSIGNED_BYTE"
  },
  [PIXEL_FORMAT.RGB888]: {
    format: "RGB",
    type: "UNSIGNED_BYTE"
  },
  [PIXEL_FORMAT.RGBA4444]: {
    format: "RGBA",
    type: "UNSIGNED_SHORT_4_4_4_4"
  },
  [PIXEL_FORMAT.RGB5A1]: {
    format: "RGBA",
    type: "UNSIGNED_SHORT_5_5_5_1"
  },
  [PIXEL_FORMAT.RGB565]: {
    format: "RGBA",
    type: "UNSIGNED_SHORT_5_6_5"
  },
  [PIXEL_FORMAT.AI88]: {
    format: "LUMINANCE_ALPHA",
    type: "UNSIGNED_BYTE"
  },
  [PIXEL_FORMAT.A8]: {
    format: "ALPHA",
    type: "UNSIGNED_BYTE"
  },
  [PIXEL_FORMAT.I8]: {
    format: "LUMINANCE",
    type: "UNSIGNED_BYTE"
  }
};

export const PIXEL_FORMAT_NAMES: Record<PIXEL_FORMAT, string> = {
  [PIXEL_FORMAT.NONE]: "",
  [PIXEL_FORMAT.RGBA8888]: "RGBA8888",
  [PIXEL_FORMAT.RGB888]: "RGB888",
  [PIXEL_FORMAT.RGB565]: "RGB565",
  [PIXEL_FORMAT.A8]: "A8",
  [PIXEL_FORMAT.I8]: "I8",
  [PIXEL_FORMAT.AI88]: "AI88",
  [PIXEL_FORMAT.RGBA4444]: "RGBA4444",
  [PIXEL_FORMAT.RGB5A1]: "RGB5A1",
  [PIXEL_FORMAT.PVRTC4]: "PVRTC4",
  [PIXEL_FORMAT.PVRTC2]: "PVRTC2"
};

export const PIXEL_FORMAT_BITS: Record<PIXEL_FORMAT, number> = {
  [PIXEL_FORMAT.NONE]: 0,
  [PIXEL_FORMAT.RGBA8888]: 32,
  [PIXEL_FORMAT.RGB888]: 24,
  [PIXEL_FORMAT.RGB565]: 16,
  [PIXEL_FORMAT.A8]: 8,
  [PIXEL_FORMAT.I8]: 8,
  [PIXEL_FORMAT.AI88]: 16,
  [PIXEL_FORMAT.RGBA4444]: 16,
  [PIXEL_FORMAT.RGB5A1]: 16,
  [PIXEL_FORMAT.PVRTC4]: 4,
  [PIXEL_FORMAT.PVRTC2]: 3
};
