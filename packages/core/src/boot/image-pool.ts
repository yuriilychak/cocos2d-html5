export default class ImagePool {
  #pool: (HTMLImageElement | null)[];
  #limit: number;
  #count: number;

  constructor(limit: number = 10) {
    this.#limit = limit;
    this.#pool = Array.from({ length: limit }, () => this.#createImage());
    this.#count = limit;
  }

  public get(): HTMLImageElement {
    if (this.#count > 0) {
      --this.#count;
      const result = this.#pool[this.#count]!;
      this.#pool[this.#count] = null;

      return result;
    }

    return this.#createImage();
  }

  public put(img: HTMLImageElement): void {
    if (img instanceof HTMLImageElement && this.#count < this.limit) {
      img.removeAttribute("src");
      this.#pool[this.#count] = img;
      ++this.#count;
    }
  }

  #createImage(): HTMLImageElement {
    return new Image();
  }

  public get limit(): number {
    return this.#limit;
  }

  public set limit(value: number) {
    this.#limit = value;
    if (this.#pool.length > value) {
      this.#pool = this.#pool.slice(0, value);
      this.#count = Math.min(this.#count, value);
    }
  }
}
