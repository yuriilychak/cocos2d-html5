import { EGLView, Game, Sys, screen, visibleRect, Point } from '@aspect/core';
import { EditBoxInputBase } from './edit-box-input-base';

const SCROLLY = 40;
const TIMER_NAME = 400;

/**
 * Android Sougou / 360 browsers report a broken zoom level, which makes
 * the input element's transform matrix incorrect. We detect those browsers
 * at module load time and let the mobile input strategy normalize the
 * matrix scale via _adjustZoom().
 */
export const editBoxPolyfill = { zoomInvalid: false };
if (
    Sys.getInstance().OS_ANDROID === Sys.getInstance().os &&
    (Sys.getInstance().browserType === Sys.getInstance().BROWSER_TYPE_SOUGOU ||
        Sys.getInstance().browserType === Sys.getInstance().BROWSER_TYPE_360)
) {
    editBoxPolyfill.zoomInvalid = true;
}

function adjustEditBoxPosition(editBox) {
    var worldPos = editBox.convertToWorldSpace(new Point(0, 0));
    var windowHeight = visibleRect.height;
    var windowWidth = visibleRect.width;
    var factor = windowWidth > windowHeight ? 0.7 : 0.5;
    setTimeout(function () {
        if (window.scrollY < SCROLLY && worldPos.y < windowHeight * factor) {
            var scrollOffset = windowHeight * factor - worldPos.y - window.scrollY;
            if (scrollOffset < 35) scrollOffset = 35;
            if (scrollOffset > 320) scrollOffset = 320;
            window.scrollTo(scrollOffset, scrollOffset);
        }
    }, TIMER_NAME);
}

/**
 * Mobile input strategy — handles screen orientation, fullscreen,
 * auto-resize and rotated views around the editing lifecycle.
 */
export class MobileEditBoxInput extends EditBoxInputBase {
    constructor(editBox) {
        super(editBox);
        this.__fullscreen = false;
        this.__autoResize = false;
        this.__rotateScreen = false;
        this.__orientationChanged = null;
    }

    _adjustZoom(a, d) {
        return { a, d };
    }

    _onBeginEditing() {
        var editBox = this._editBox;
        this.__orientationChanged = function () {
            adjustEditBoxPosition(editBox);
        };
        window.addEventListener('orientationchange', this.__orientationChanged);

        if (EGLView.getInstance().isAutoFullScreenEnabled()) {
            this.__fullscreen = true;
            EGLView.getInstance().enableAutoFullScreen(false);
            screen.exitFullScreen();
        } else {
            this.__fullscreen = false;
        }
        this.__autoResize = EGLView.getInstance().__resizeWithBrowserSize;
        EGLView.getInstance().resizeWithBrowserSize(false);
    }

    _onEndEditing() {
        var self = this;
        setTimeout(function () {
            if (self.__rotateScreen) {
                var containerStyle = Game.getInstance().container.style;
                containerStyle['-webkit-transform'] = 'rotate(90deg)';
                containerStyle.transform = 'rotate(90deg)';

                var view = EGLView.getInstance();
                var width = view._originalDesignResolutionSize.width;
                var height = view._originalDesignResolutionSize.height;
                if (width > 0) {
                    view.setDesignResolutionSize(width, height, view._resolutionPolicy);
                }
                self.__rotateScreen = false;
            }
            window.removeEventListener('orientationchange', self.__orientationChanged);
            window.scrollTo(0, 0);
            if (self.__fullscreen) {
                EGLView.getInstance().enableAutoFullScreen(true);
            }
            if (self.__autoResize) {
                EGLView.getInstance().resizeWithBrowserSize(true);
            }
        }, TIMER_NAME);
    }

    _onFocus() {
        var editBox = this._editBox;
        if (EGLView.getInstance()._isRotated) {
            var containerStyle = Game.getInstance().container.style;
            containerStyle['-webkit-transform'] = 'rotate(0deg)';
            containerStyle.transform = 'rotate(0deg)';
            containerStyle.margin = '0px';
            window.scrollTo(35, 35);
            this.__rotateScreen = true;
        } else {
            this.__rotateScreen = false;
        }
        adjustEditBoxPosition(editBox);
    }
}
