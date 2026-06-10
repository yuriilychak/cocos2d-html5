import { Texture } from "@esotericsoftware/spine-core";
import { glBindTexture2D, ServiceLocator } from "@aspect/core";

export class SkeletonTexture extends Texture {
    name = 'SkeletonTexture';
    _texture = null;

    constructor(image) {
        super(image);
    }

    setRealTexture(tex) {
        this._texture = tex;
    }

    getRealTexture() {
        return this._texture;
    }

    setFilters(minFilter, magFilter) {
        if (ServiceLocator.rendererConfig.isWebGL) {
            const gl = ServiceLocator.rendererConfig.renderContext;
            this.bind();
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
        }
    }

    setWraps(uWrap, vWrap) {
        if (ServiceLocator.rendererConfig.isWebGL) {
            const gl = ServiceLocator.rendererConfig.renderContext;
            this.bind();
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, uWrap);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, vWrap);
        }
    }

    dispose() {}

    bind() {
        if (ServiceLocator.rendererConfig.isWebGL) {
            glBindTexture2D(this._texture);
        }
    }
}
