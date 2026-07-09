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

import { BrowserType, OperatingSystem } from "../../enums";

import type Sys from "../../sys/sys";
import type { DensityDPIValue } from "./types";

interface BrowserGetterView {
  readonly frame: HTMLElement | null;
  readonly targetDensityDPI: DensityDPIValue;
  initResizeHandler(): void;
}

type BrowserGetterMeta = {
  width: string;
  "minimal-ui"?: string;
  "target-densitydpi"?: DensityDPIValue;
};

export class BrowserGetter {
  #view: BrowserGetterView;
  #meta: BrowserGetterMeta = { width: "device-width" };
  #adaptationType = BrowserType.UNKNOWN;

  constructor(view: BrowserGetterView) {
    this.#view = view;
  }

  init(sys: Sys): void {
    this.#adaptationType = sys.specification.browserType;

    if (window.navigator.userAgent.indexOf("OS 8_1_") > -1) {
      this.#adaptationType = BrowserType.MIUI;
    }

    if (sys.specification.os === OperatingSystem.IOS) {
      this.#adaptationType = BrowserType.SAFARI;
    }

    switch (this.#adaptationType) {
      case BrowserType.SAFARI:
        this.#meta["minimal-ui"] = "true";
        break;
      case BrowserType.CHROME:
        Object.defineProperty(this.meta, "target-densitydpi", {
          get: () => this.#view.targetDensityDPI,
          enumerable: true,
          configurable: true
        });
        break;
    }

    if (this.#adaptationType === BrowserType.MIUI) {
      this.#view.initResizeHandler();
      return;
    }
  }

  get meta(): BrowserGetterMeta {
    return this.#meta;
  }
}
