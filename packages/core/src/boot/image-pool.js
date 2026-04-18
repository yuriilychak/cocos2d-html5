export default class ImagePool {
    _pool = new Array(10);
    _MAX = 10;
    _smallImg = "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";
    count = 0;

    get() {
        if (this.count > 0) {
            this.count--;
            var result = this._pool[this.count];
            this._pool[this.count] = null;
            return result;
        }
        else {
            return new Image();
        }
    }

    put(img) {
        var pool = this._pool;
        if (img instanceof HTMLImageElement && this.count < this._MAX) {
            img.src = this._smallImg;
            pool[this.count] = img;
            this.count++;
        }
    }
}
