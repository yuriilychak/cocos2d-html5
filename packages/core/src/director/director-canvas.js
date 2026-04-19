import { DirectorRenderer } from './director-renderer';

export class DirectorCanvasRenderer extends DirectorRenderer {
    setProjection(projection) {
        this._director._projection = projection;
        cc.eventManager.dispatchEvent(this._director._eventProjectionChanged);
    }

    setClearColor(clearColor) {
        cc.renderer._clearColor = clearColor;
        cc.renderer._clearFillStyle = 'rgb(' + clearColor.r + ',' + clearColor.g + ',' + clearColor.b + ')';
    }

    setOpenGLView(openGLView) {
        var director = this._director;
        director._winSizeInPoints.width = cc._canvas.width;
        director._winSizeInPoints.height = cc._canvas.height;
        director._openGLView = openGLView || cc.view;
        if (cc.eventManager)
            cc.eventManager.setEnabled(true);
    }

    getVisibleSize() {
        return this._director.getWinSize();
    }

    getVisibleOrigin() {
        return cc.p(0, 0);
    }
}
