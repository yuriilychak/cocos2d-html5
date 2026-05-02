import { DirectorRenderer } from './director-renderer';
import { Point } from '../cocoa/geometry/point';
import EventManager from '../event-manager/event-manager';
import { RendererConfig } from '../renderer/renderer-config';
import Game from '../boot/game';

export class DirectorCanvasRenderer extends DirectorRenderer {
    setProjection(projection) {
        this._director._projection = projection;
        EventManager.getInstance().dispatchEvent(this._director._eventProjectionChanged);
    }

    setClearColor(clearColor) {
        const renderer = RendererConfig.getInstance().renderer;
        renderer._clearColor = clearColor;
        renderer._clearFillStyle = 'rgb(' + clearColor.r + ',' + clearColor.g + ',' + clearColor.b + ')';
    }

    setOpenGLView(openGLView) {
        var director = this._director;
        director._winSizeInPoints.width = Game.getInstance().canvas.width;
        director._winSizeInPoints.height = Game.getInstance().canvas.height;
        director._openGLView = openGLView || cc.view;
        if (EventManager.getInstance())
            EventManager.getInstance().setEnabled(true);
    }

    getVisibleSize() {
        return this._director.getWinSize();
    }

    getVisibleOrigin() {
        return new Point(0, 0);
    }
}
