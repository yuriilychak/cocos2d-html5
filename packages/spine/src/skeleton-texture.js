import { Texture } from "@esotericsoftware/spine-core";
import { RendererConfig, glBindTexture2D } from "@aspect/core";

export class SkeletonTexture extends Texture {
    name = 'sp.SkeletonTexture';
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
        if (RendererConfig.getInstance().isWebGL) {
            const gl = RendererConfig.getInstance().renderContext;
            this.bind();
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
        }
    }

    setWraps(uWrap, vWrap) {
        if (RendererConfig.getInstance().isWebGL) {
            const gl = RendererConfig.getInstance().renderContext;
            this.bind();
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, uWrap);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, vWrap);
        }
    }

    dispose() {}

    bind() {
        if (RendererConfig.getInstance().isWebGL) {
            glBindTexture2D(this._texture);
        }
    }
}
