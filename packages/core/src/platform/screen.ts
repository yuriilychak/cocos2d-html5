type FullscreenApiMap = {
    requestFullscreen: string;
    exitFullscreen: string;
    fullscreenchange: string;
    fullscreenEnabled: string;
    fullscreenElement: string;
};

type FullscreenDocument = Document & Record<string, unknown>;
type FullscreenElement = Element & Record<string, () => unknown>;
type GameLike = {
    canvas?: EventTarget | null;
};
/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/


/**
 * The fullscreen API provides an easy way for web content to be presented using the user's entire screen.
 * It's invalid on safari, QQbrowser and android browser
 */
export class Screen {
    #game: GameLike;
    #supportsFullScreen: boolean;
    // the pre fullscreenchange function
    #preOnFullScreenChange: EventListener | null = null;
    #touchEvent: string;
    #fn: Partial<FullscreenApiMap>;
    // Function mapping for cross browser support
    static #fnMap = [
        [
            'requestFullscreen',
            'exitFullscreen',
            'fullscreenchange',
            'fullscreenEnabled',
            'fullscreenElement'
        ],
        [
            'requestFullScreen',
            'exitFullScreen',
            'fullScreenchange',
            'fullScreenEnabled',
            'fullScreenElement'
        ],
        [
            'webkitRequestFullScreen',
            'webkitCancelFullScreen',
            'webkitfullscreenchange',
            'webkitIsFullScreen',
            'webkitCurrentFullScreenElement'
        ],
        [
            'mozRequestFullScreen',
            'mozCancelFullScreen',
            'mozfullscreenchange',
            'mozFullScreen',
            'mozFullScreenElement'
        ],
        [
            'msRequestFullscreen',
            'msExitFullscreen',
            'MSFullscreenChange',
            'msFullscreenEnabled',
            'msFullscreenElement'
        ]
    ];

    constructor(game: GameLike) {
        this.#game = game;

        const fn: Partial<FullscreenApiMap> = {};
        const map = Screen.#fnMap;
        for (let i = 0, l = map.length; i < l; i++) {
            const val = map[i];
            if (val && val[1] in document) {
                for (let j = 0, valL = val.length; j < valL; j++) {
                    fn[map[0][j] as keyof FullscreenApiMap] = val[j];
                }
                break;
            }
        }

        this.#fn = fn;
        this.#supportsFullScreen = (typeof this.#fn.requestFullscreen !== 'undefined');
        this.#touchEvent = ('ontouchstart' in window) ? 'touchstart' : 'mousedown';
    }

    /**
     * return true if it's full now.
     */
    public get fullScreen(): boolean {
        const fullscreenElement = this.#fn.fullscreenElement;
        return this.#supportsFullScreen
            && fullscreenElement != null
            && (document as FullscreenDocument)[fullscreenElement] != null;
    }

    /**
     * change the screen to full mode.
     */
    public requestFullScreen(element?: Element, onFullScreenChange?: EventListener): unknown {
        const requestFullscreen = this.#fn.requestFullscreen;
        if (!this.#supportsFullScreen || !requestFullscreen) {
            return;
        }

        element = element || document.documentElement;

        const eventName = this.#fn.fullscreenchange;
        if (onFullScreenChange && eventName) {
            if (this.#preOnFullScreenChange) {
                document.removeEventListener(eventName, this.#preOnFullScreenChange);
            }
            this.#preOnFullScreenChange = onFullScreenChange;
            document.addEventListener(eventName, onFullScreenChange, false);
        }

        return (element as FullscreenElement)[requestFullscreen]();
    }

    /**
     * exit the full mode.
     */
    public exitFullScreen(): boolean | unknown {
        const exitFullscreen = this.#fn.exitFullscreen;
        const exitFullScreen = exitFullscreen
            ? (document as FullscreenDocument)[exitFullscreen] as (() => unknown) | undefined
            : undefined;
        return !this.#supportsFullScreen || !exitFullScreen || exitFullScreen();
    }

    /**
     * Automatically request full screen with a touch/click event
     */
    public autoFullScreen(element?: Element, onFullScreenChange?: EventListener): void {
        const fullScreenElement = element || document.body;
        const touchTarget: EventTarget = this.#game.canvas || fullScreenElement;
        // Function bind will be too complicated here because we need the callback function's reference to remove the listener
        const callback = () => {
            touchTarget.removeEventListener(this.#touchEvent, callback);
            this.requestFullScreen(fullScreenElement, onFullScreenChange);
        };
        this.requestFullScreen(fullScreenElement, onFullScreenChange);
        touchTarget.addEventListener(this.#touchEvent, callback);
    }
}
