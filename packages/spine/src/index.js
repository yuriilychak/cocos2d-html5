import { Skeleton, _atlasLoader } from "./skeleton";
import { SkeletonAnimation, TrackEntryListeners, ANIMATION_EVENT_TYPE } from "./skeleton-animation";
import { SkeletonTexture } from "./skeleton-texture";
import { SkeletonCanvasRenderCmd } from "./skeleton-canvas-render-cmd";
import { SkeletonWebGLRenderCmd } from "./skeleton-webgl-render-cmd";

// Wire render commands
Skeleton.CanvasRenderCmd = SkeletonCanvasRenderCmd;
Skeleton.WebGLRenderCmd = SkeletonWebGLRenderCmd;

// Expose spine runtime on sp namespace for direct access
import * as spineRuntime from "@esotericsoftware/spine-core";
const sp = globalThis.sp || (globalThis.sp = {});
sp.spine = spineRuntime;

// Backward compatibility
sp.Skeleton = Skeleton;
sp.SkeletonAnimation = SkeletonAnimation;
sp.SkeletonTexture = SkeletonTexture;
sp.TrackEntryListeners = TrackEntryListeners;
sp.ANIMATION_EVENT_TYPE = ANIMATION_EVENT_TYPE;
sp._atlasLoader = _atlasLoader;

export {
    Skeleton,
    SkeletonAnimation,
    SkeletonTexture,
    TrackEntryListeners,
    ANIMATION_EVENT_TYPE,
    _atlasLoader
};
