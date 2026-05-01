import { Skeleton, _atlasLoader } from "./skeleton";
import { SkeletonAnimation, TrackEntryListeners, ANIMATION_EVENT_TYPE } from "./skeleton-animation";
import { SkeletonTexture } from "./skeleton-texture";
import { SkeletonCanvasRenderCmd } from "./skeleton-canvas-render-cmd";
import { SkeletonWebGLRenderCmd } from "./skeleton-webgl-render-cmd";

// Wire render commands
Skeleton.CanvasRenderCmd = SkeletonCanvasRenderCmd;
Skeleton.WebGLRenderCmd = SkeletonWebGLRenderCmd;

// Backward compatibility
cc.Skeleton = Skeleton;
cc.SkeletonAnimation = SkeletonAnimation;
cc.SkeletonTexture = SkeletonTexture;
cc.TrackEntryListeners = TrackEntryListeners;
cc.ANIMATION_EVENT_TYPE = ANIMATION_EVENT_TYPE;
cc._atlasLoader = _atlasLoader;

export {
    Skeleton,
    SkeletonAnimation,
    SkeletonTexture,
    TrackEntryListeners,
    ANIMATION_EVENT_TYPE,
    _atlasLoader
};
