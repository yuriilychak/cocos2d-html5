import { assert, _LogInfos } from "../boot/debugger";
import Loader from "../boot/loader";
import Path from "../boot/path";
import { Texture2D } from "./texture-2d";

export default class TextureCacheCanvasRenderer {
  constructor(textureCache) {
    this._textureCache = textureCache;
  }

  handleLoadedTexture(url, img) {
    var textureCache = this._textureCache;
    var locTexs = textureCache._textures;
    //remove judge
    var tex = locTexs[url];
    if (!tex) {
      tex = locTexs[url] = new Texture2D();
      tex.url = url;
    }
    tex.initWithElement(img);
    tex.handleLoadedTexture();
    return tex;
  }

  /**
   * <p>Returns a Texture2D object given an file image <br />
   * If the file image was not previously loaded, it will create a new Texture2D <br />
   *  object and it will return it. It will use the filename as a key.<br />
   * Otherwise it will return a reference of a previously loaded image. <br />
   * Supported image extensions: .png, .jpg, .gif</p>
   * @param {String} url
   * @param {Function} cb
   * @param {Object} target
   * @return {Texture2D}
   * @example
   * textureCache.addImage("hello.png");
   */
  addImage(url, cb, target) {
    var textureCache = this._textureCache;
    assert(url, _LogInfos.Texture2D_addImage);

    var locTexs = textureCache._textures;
    //remove judge
    var tex = locTexs[url] || locTexs[Loader.getInstance()._getAliase(url)];
    if (tex) {
      if (tex.isLoaded()) {
        cb && cb.call(target, tex);
        return tex;
      } else {
        tex.addEventListener(
          "load",
          function () {
            cb && cb.call(target, tex);
          },
          target
        );
        return tex;
      }
    }

    tex = locTexs[url] = new Texture2D();
    tex.url = url;
    var basePath = Loader.getInstance().getBasePath
      ? Loader.getInstance().getBasePath()
      : Loader.getInstance().resPath;
    var textureCache = this._textureCache;
    Loader.getInstance().loadImg(
      Path.join(basePath || "", url),
      function (err, img) {
        if (err) return cb && cb.call(target, err);

        var texResult = textureCache._renderer.handleLoadedTexture(url, img);
        cb && cb.call(target, texResult);
      }
    );

    return tex;
  }
}
