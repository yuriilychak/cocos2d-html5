import { DeviceOrientation } from "../../enums";
import { Point, PointLike, Size, SizeLike } from "../../geometry";

export default class DOMAdapter {
  #canvas: HTMLCanvasElement | null = null;

  #container: HTMLElement | null = null;

  // Parent node that contains container and _canvas
  #frame: HTMLElement | null = null;

  // Size of parent node that contains container and _canvas
  #frameSize: Size = new Size();

  #currentSize: Size = new Size();

  #rotated: boolean = false;

  #orientation: DeviceOrientation = DeviceOrientation.AUTO;

  #isMobile: boolean = false;

  initialize(canvas: HTMLCanvasElement, container: HTMLElement, isMobile: boolean) {
    this.#canvas = canvas;
    this.#container = container;
    this.#frame =
      container.parentNode === document.body
        ? document.documentElement
        : (container.parentNode as HTMLElement);
        this.#isMobile = isMobile;
  }

  initFrameSize(): void {
    this.#updateCurrentSize();

    const isLandscape = this.#currentSize.width >= this.#currentSize.height;
    const rotated =
      this.#isMobile &&
      ((isLandscape && !(this.#orientation & DeviceOrientation.LANDSCAPE)) ||
        (!isLandscape && !(this.#orientation & DeviceOrientation.PORTRAIT)));

    if (rotated) {
      this.#frameSize.set(this.#currentSize.height, this.#currentSize.width);
      this.container.style.setProperty("-webkit-transform", "rotate(90deg)");
      this.container.style.transform = "rotate(90deg)";
      this.container.style.setProperty(
        "-webkit-transform-origin",
        "0px 0px 0px"
      );
      this.container.style.transformOrigin = "0px 0px 0px";
    } else {
      this.#frameSize.set(this.#currentSize);
      this.container.style.setProperty("-webkit-transform", "rotate(0deg)");
      this.container.style.transform = "rotate(0deg)";
    }

    this.#rotated = rotated;
  }

  getChanged(): boolean {
    // Check frame size changed or not
    const prevFrameW = this.#frameSize.width,
      prevFrameH = this.#frameSize.height,
      prevRotated = this.#rotated;
    if (this.#isMobile) {
      const margin = this.container.style.margin;
      this.container.style.margin = "0";
      this.container.style.display = "none";
      this.initFrameSize();
      this.container.style.margin = margin;
      this.container.style.display = "block";
    } else {
      this.initFrameSize();
    }
    return (
      this.#rotated !== prevRotated &&
      this.#frameSize.width !== prevFrameW &&
      this.#frameSize.height !== prevFrameH
    );
  }

  setupContainer(
    size: SizeLike,
    devicePixelRatio: number,
    isAndroid: boolean
  ): void {
    if (isAndroid) {
      document.body.style.width = `${this.#rotated ? size.height : size.width}px`;
      document.body.style.height = `${this.#rotated ? size.width : size.height}px`;
    }

    // Setup style
    this.container.style.width = this.canvas.style.width = `${size.width}px`;
    this.container.style.height = this.canvas.style.height = `${size.height}px`;
    // Setup canvas
    Size.multIn(Size.copy(this.canvas, size), devicePixelRatio);
  }

  convertToGL(
    uiPoint: PointLike,
    devicePixelRatio: number,
    viewportWidth: number
  ): Point {
    const docElem = document.documentElement;
    const box = docElem.getBoundingClientRect();
    const left = box.left + window.pageXOffset - docElem.clientLeft;
    const top = box.top + window.pageYOffset - docElem.clientTop;
    const x = devicePixelRatio * (uiPoint.x - left);
    const y = devicePixelRatio * (top + box.height - uiPoint.y);

    return this.#rotated ? new Point(viewportWidth - y, x) : new Point(x, y);
  }

  orientationChange(isMobile: boolean): void {
    if (isMobile) {
      this.container.style.display = "none";
    }
  }

  setFullPixelWidth(width: number): void {
    document.documentElement.style.width = width + "px";
    document.body.style.width = "100%";
  }
  

  setBodyPixelWidth(width: number): void {
        // Set body width to the exact pixel resolution
    document.documentElement.style.width = width + "px";
    document.body.style.width = width + "px";
    document.body.style.left = "0px";
    document.body.style.top = "0px";

  }

  #updateCurrentSize(): void {
    if (this.#frame === null || this.isFrameDocument) {
      this.#currentSize.set(window.innerWidth, window.innerHeight);
    } else {
      this.#currentSize.set(this.#frame.clientWidth, this.#frame.clientHeight);
    }
  }

  get isFrameDocument(): boolean {
    return this.#frame === document.documentElement;
  }

  get canvas(): HTMLCanvasElement {
    return this.#canvas!;
  }

  get container(): HTMLElement {
    return this.#container!;
  }

  get frame(): HTMLElement {
    return this.#frame!;
  }

  set frame(value: HTMLElement) {
    this.#frame = value;
  }

  get frameSize(): Size {
    return this.#frameSize.clone();
  }

  set frameSize(size: SizeLike) {
    this.#frameSize.set(size);
    this.#frame!.style.width = size.width + "px";
    this.#frame!.style.height = size.height + "px";
  }

  get canvasSize(): Size {
    return new Size(this.canvas);
  }

  get rotated(): boolean {
    return this.#rotated;
  }

  set orientation(orientation: DeviceOrientation) {
    this.#orientation = orientation;
  }

  get orientation(): DeviceOrientation {
    return this.#orientation;
  }

  get canvasReady(): boolean {
    return this.#canvas !== null;
  }
}
