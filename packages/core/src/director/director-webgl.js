import { NewClass } from '../platform/class';
import { DirectorRenderer } from './director-renderer';
import {
    EVENT_PROJECTION_CHANGED,
    PROJECTION_2D,
    PROJECTION_3D,
    PROJECTION_CUSTOM
} from './constants';
import EventManager from '../event-manager/event-manager';
import { log, _LogInfos } from '../boot/debugger';

/**
 * OpenGL projection protocol
 */
export class DirectorDelegate extends NewClass {
    updateProjection() {
    }
}

function recursiveChild(node) {
    if (node && node._renderCmd) {
        node._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
        var children = node._children;
        for (var i = 0; i < children.length; i++) {
            recursiveChild(children[i]);
        }
    }
}

export class DirectorWebGLRenderer extends DirectorRenderer {
    constructor(director) {
        super(director);

        director._fpsImage = new Image();
        director._fpsImage.addEventListener("load", () => {
          director._fpsImageLoaded = true;
        });
        if (cc._fpsImage) {
            director._fpsImage.src = cc._fpsImage;
        }

        EventManager.getInstance().addCustomListener(EVENT_PROJECTION_CHANGED, () => {
            var stack = this._director._scenesStack;
            for (var i = 0; i < stack.length; i++)
                recursiveChild(stack[i]);
        });
    }

    setProjection(projection) {
        var director = this._director;
        var size = director._winSizeInPoints;

        this.setViewport();

        var view = director._openGLView,
            ox = view._viewPortRect.x / view._scaleX,
            oy = view._viewPortRect.y / view._scaleY;

        switch (projection) {
            case PROJECTION_2D:
                cc.kmGLMatrixMode(cc.KM_GL_PROJECTION);
                cc.kmGLLoadIdentity();
                var orthoMatrix = cc.math.Matrix4.createOrthographicProjection(
                    0, size.width, 0, size.height, -1024, 1024);
                cc.kmGLMultMatrix(orthoMatrix);
                cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
                cc.kmGLLoadIdentity();
                break;
            case PROJECTION_3D:
                var zeye = this.getZEye();
                var matrixPerspective = new cc.math.Matrix4(), matrixLookup = new cc.math.Matrix4();
                cc.kmGLMatrixMode(cc.KM_GL_PROJECTION);
                cc.kmGLLoadIdentity();

                matrixPerspective = cc.math.Matrix4.createPerspectiveProjection(60, size.width / size.height, 0.1, zeye * 2);

                cc.kmGLMultMatrix(matrixPerspective);

                var eye = new cc.math.Vec3(-ox + size.width / 2, -oy + size.height / 2, zeye);
                var center = new cc.math.Vec3(-ox + size.width / 2, -oy + size.height / 2, 0.0);
                var up = new cc.math.Vec3(0.0, 1.0, 0.0);
                matrixLookup.lookAt(eye, center, up);
                cc.kmGLMultMatrix(matrixLookup);

                cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
                cc.kmGLLoadIdentity();
                break;
            case PROJECTION_CUSTOM:
                if (director._projectionDelegate)
                    director._projectionDelegate.updateProjection();
                break;
            default:
                log(_LogInfos.Director_setProjection);
                break;
        }
        director._projection = projection;
        EventManager.getInstance().dispatchEvent(director._eventProjectionChanged);
        cc.setProjectionMatrixDirty();
        cc.renderer.childrenOrderDirty = true;
    }

    setDepthTest(on) {
        cc.renderer.setDepthTest(on);
    }

    setClearColor(clearColor) {
        cc.renderer._clearColor = clearColor;
    }

    setOpenGLView(openGLView) {
        var director = this._director;
        director._winSizeInPoints.width = cc._canvas.width;
        director._winSizeInPoints.height = cc._canvas.height;
        director._openGLView = openGLView || cc.view;

        var conf = cc.configuration;
        conf.gatherGPUInfo();
        conf.dumpInfo();

        this.setGLDefaultValues();

        if (EventManager.getInstance())
            EventManager.getInstance().setEnabled(true);
    }

    getVisibleSize() {
        return this._director._openGLView.getVisibleSize();
    }

    getVisibleOrigin() {
        return this._director._openGLView.getVisibleOrigin();
    }

    getZEye() {
        return (this._director._winSizeInPoints.height / 1.15469993750);
    }

    setViewport() {
        var view = this._director._openGLView;
        if (view) {
            var locWinSizeInPoints = this._director._winSizeInPoints;
            view.setViewPortInPoints(-view._viewPortRect.x / view._scaleX, -view._viewPortRect.y / view._scaleY, locWinSizeInPoints.width, locWinSizeInPoints.height);
        }
    }

    setAlphaBlending(on) {
        if (on)
            cc.glBlendFunc(cc.BLEND_SRC, cc.BLEND_DST);
        else
            cc.glBlendFunc(cc._renderContext.ONE, cc._renderContext.ZERO);
    }

    setGLDefaultValues() {
        this.setAlphaBlending(true);
        this.setProjection(this._director._projection);
        cc._renderContext.clearColor(0.0, 0.0, 0.0, 0.0);
    }
}
