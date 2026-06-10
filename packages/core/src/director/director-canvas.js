import { DirectorRenderer } from './director-renderer';
import { Point } from '../cocoa/geometry/point';
import { ServiceLocator } from "../service-locator";

export class DirectorCanvasRenderer extends DirectorRenderer {
    setProjection(projection) {
        this._director._projection = projection;
        ServiceLocator.eventManager.dispatchEvent(this._director._eventProjectionChanged);
    }

    setClearColor(clearColor) {
        const renderer = ServiceLocator.rendererConfig.renderer;
        renderer._clearColor = clearColor;
        renderer._clearFillStyle = 'rgb(' + clearColor.r + ',' + clearColor.g + ',' + clearColor.b + ')';
    }

    setOpenGLView(openGLView) {
        var director = this._director;
        director._winSizeInPoints.width = ServiceLocator.game.canvas.width;
        director._winSizeInPoints.height = ServiceLocator.game.canvas.height;
        director._openGLView = openGLView || ServiceLocator.eglView;
        if (ServiceLocator.eventManager)
            ServiceLocator.eventManager.setEnabled(true);
    }

    getVisibleSize() {
        return this._director.getWinSize();
    }

    getVisibleOrigin() {
        return new Point(0, 0);
    }
}
