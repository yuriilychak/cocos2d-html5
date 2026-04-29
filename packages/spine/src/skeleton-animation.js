import { log, Node } from "@aspect/core";
import {
    AnimationState, AnimationStateData, Physics
} from "@esotericsoftware/spine-core";
import { Skeleton } from "./skeleton";

export const ANIMATION_EVENT_TYPE = {
    START: 0,
    INTERRUPT: 1,
    END: 2,
    DISPOSE: 3,
    COMPLETE: 4,
    EVENT: 5
};

export class TrackEntryListeners {
    constructor(startListener, endListener, completeListener, eventListener, interruptListener, disposeListener) {
        this.startListener = startListener || null;
        this.endListener = endListener || null;
        this.completeListener = completeListener || null;
        this.eventListener = eventListener || null;
        this.interruptListener = interruptListener || null;
        this.disposeListener = disposeListener || null;
        this.callback = null;
        this.callbackTarget = null;
        this.skeletonNode = null;
    }

    start(trackEntry) {
        this.startListener?.(trackEntry);
        if (this.callback)
            this.callback.call(this.callbackTarget, this.skeletonNode, trackEntry, ANIMATION_EVENT_TYPE.START, null, 0);
    }

    interrupt(trackEntry) {
        this.interruptListener?.(trackEntry);
        if (this.callback)
            this.callback.call(this.callbackTarget, this.skeletonNode, trackEntry, ANIMATION_EVENT_TYPE.INTERRUPT, null, 0);
    }

    end(trackEntry) {
        this.endListener?.(trackEntry);
        if (this.callback)
            this.callback.call(this.callbackTarget, this.skeletonNode, trackEntry, ANIMATION_EVENT_TYPE.END, null, 0);
    }

    dispose(trackEntry) {
        this.disposeListener?.(trackEntry);
        if (this.callback)
            this.callback.call(this.callbackTarget, this.skeletonNode, trackEntry, ANIMATION_EVENT_TYPE.DISPOSE, null, 0);
    }

    complete(trackEntry) {
        const loopCount = Math.floor(trackEntry.trackTime / trackEntry.animationEnd);
        this.completeListener?.(trackEntry, loopCount);
        if (this.callback)
            this.callback.call(this.callbackTarget, this.skeletonNode, trackEntry, ANIMATION_EVENT_TYPE.COMPLETE, null, loopCount);
    }

    event(trackEntry, event) {
        this.eventListener?.(trackEntry, event);
        if (this.callback)
            this.callback.call(this.callbackTarget, this.skeletonNode, trackEntry, ANIMATION_EVENT_TYPE.EVENT, event, 0);
    }

    static getListeners(entry) {
        if (!entry.listener)
            entry.listener = new TrackEntryListeners();
        return entry.listener;
    }
}

export class SkeletonAnimation extends Skeleton {
    init() {
        super.init();
        this._ownsAnimationStateData = true;
        this.setAnimationStateData(new AnimationStateData(this._skeleton.data));
    }

    setAnimationStateData(stateData) {
        const state = new AnimationState(stateData);
        this._listener = new TrackEntryListeners();
        state.addListener(this._listener);
        this._state = state;
    }

    setMix(fromAnimation, toAnimation, duration) {
        this._state.data.setMixWith(fromAnimation, toAnimation, duration);
    }

    setAnimationListener(target, callback) {
        this._listener.callbackTarget = target;
        this._listener.callback = callback;
        this._listener.skeletonNode = this;
    }

    setAnimation(trackIndex, name, loop) {
        const animation = this._skeleton.data.findAnimation(name);
        if (!animation) {
            log("Spine: Animation not found: " + name);
            return null;
        }
        return this._state.setAnimationWith(trackIndex, animation, loop);
    }

    addAnimation(trackIndex, name, loop, delay) {
        delay = delay == null ? 0 : delay;
        const animation = this._skeleton.data.findAnimation(name);
        if (!animation) {
            log("Spine: Animation not found:" + name);
            return null;
        }
        return this._state.addAnimationWith(trackIndex, animation, loop, delay);
    }

    findAnimation(name) { return this._skeleton.data.findAnimation(name); }
    getCurrent(trackIndex) { return this._state.getCurrent(trackIndex); }
    clearTracks() { this._state.clearTracks(); }
    clearTrack(trackIndex) { this._state.clearTrack(trackIndex); }

    update(dt) {
        super.update(dt);
        dt *= this._timeScale;
        this._renderCmd.setDirtyFlag(Node._dirtyFlags.contentDirty);
        this._state.update(dt);
        this._state.apply(this._skeleton);
        this._skeleton.updateWorldTransform(Physics.update);
        this._renderCmd._updateChild();
    }

    setStartListener(listener) { this._listener.startListener = listener; }
    setInterruptListener(listener) { this._listener.interruptListener = listener; }
    setEndListener(listener) { this._listener.endListener = listener; }
    setDisposeListener(listener) { this._listener.disposeListener = listener; }
    setCompleteListener(listener) { this._listener.completeListener = listener; }
    setEventListener(listener) { this._listener.eventListener = listener; }

    setTrackStartListener(entry, listener) { TrackEntryListeners.getListeners(entry).startListener = listener; }
    setTrackInterruptListener(entry, listener) { TrackEntryListeners.getListeners(entry).interruptListener = listener; }
    setTrackEndListener(entry, listener) { TrackEntryListeners.getListeners(entry).endListener = listener; }
    setTrackDisposeListener(entry, listener) { TrackEntryListeners.getListeners(entry).disposeListener = listener; }
    setTrackCompleteListener(entry, listener) { TrackEntryListeners.getListeners(entry).completeListener = listener; }
    setTrackEventListener(entry, listener) { TrackEntryListeners.getListeners(entry).eventListener = listener; }

    getState() { return this._state; }
}
