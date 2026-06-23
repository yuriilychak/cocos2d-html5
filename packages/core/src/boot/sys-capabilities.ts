import { isUndefined } from './utils';

import type { BrowserNavigator, BrowserWindow } from './types';

export default class SysCapabilities {
    #canvas: boolean = false;
    #opengl: boolean = false;
    #touches: boolean = false;
    #mouse: boolean = false;
    #keyboard: boolean = false;
    #accelerometer: boolean = false;
    #newBlendModes: boolean = false;
    #offscreenCanvas: boolean = false;

    constructor(win: BrowserWindow, doc: Document, nav: BrowserNavigator, suportWebGl: boolean) {
        const docEle = doc.documentElement;
        this.#canvas = !!doc.createElement("canvas").getContext("2d"),
        this.#opengl = suportWebGl,
        this.#touches = !isUndefined(docEle.ontouchstart) || !isUndefined(doc.ontouchstart) || !!nav.msPointerEnabled;
        this.#mouse = !isUndefined(docEle.onmouseup);
        this.#keyboard =!isUndefined(docEle.onkeyup),
        this.#accelerometer = !!win.DeviceMotionEvent || !!win.DeviceOrientationEvent;
        this.#newBlendModes = SysCapabilities.#detectNewBlendModesSupport(doc);
        this.#offscreenCanvas = !isUndefined(win.OffscreenCanvas);
    }

    public get canvas(): boolean {
        return this.#canvas;
    }

    public get opengl(): boolean {
        return this.#opengl;
    }

    public get touches(): boolean {
        return this.#touches;
    }

    public get mouse(): boolean {
        return this.#mouse;
    }

    public get keyboard(): boolean {
        return this.#keyboard;
    }

    public get accelerometer(): boolean {
        return this.#accelerometer;
    }

    public get offscreenCanvas(): boolean {
        return this.#offscreenCanvas;
    }

    public get newBlendModes(): boolean {
        return this.#newBlendModes;
    }

    public toString(): string {
        return [
            `support Canvas: ${this.#canvas}`,
            `support WebGL: ${this.#opengl}`,
            `support Touches: ${this.#touches}`,
            `support Mouse: ${this.#mouse}`,
            `support Keyboard: ${this.#keyboard}`,
            `support Accelerometer: ${this.#accelerometer}`,
            `support New blenf modes: ${this.#newBlendModes}`,
            `support Offscreen canvas: ${this.#offscreenCanvas}`,
        ].join(', ')
    }

    static #detectNewBlendModesSupport(doc: HTMLDocument): boolean {
        // Test Canvas BlendModes support
        const canvas = doc.createElement("canvas");
        const canvas2 = doc.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const context = canvas.getContext("2d");
        if (!context) {
        return false;
        }
        context.fillStyle = "#000";
        context.fillRect(0, 0, 1, 1);
        context.globalCompositeOperation = "multiply";

        canvas2.width = 1;
        canvas2.height = 1;
        const context2 = canvas2.getContext("2d");
        if (!context2) {
        return false;
        }
        context2.fillStyle = "#fff";
        context2.fillRect(0, 0, 1, 1);
        context.drawImage(canvas2, 0, 0, 1, 1);

        return context.getImageData(0, 0, 1, 1).data[0] === 0;
    }
}