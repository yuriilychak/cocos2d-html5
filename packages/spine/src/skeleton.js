import {
    Node, Rect, RendererConfig, Director,
    isString, log, FLT_MAX,
    NodeCanvasRenderCmd, NodeWebGLRenderCmd,
    Path, Loader, TextureCache,
    OPTIMIZE_BLEND_FUNC_FOR_PREMULTIPLIED_ALPHA
} from "@aspect/core";
import {
    TextureAtlas, AtlasAttachmentLoader, SkeletonJson,
    Skeleton as SpineSkeleton, Utils, RegionAttachment, Physics
} from "@esotericsoftware/spine-core";
import { SkeletonTexture } from "./skeleton-texture";

export class Skeleton extends Node {
    constructor(skeletonDataFile, atlasFile, scale) {
        super();

        this._skeleton = null;
        this._rootBone = null;
        this._timeScale = 1;
        this._debugSlots = false;
        this._debugBones = false;
        this._premultipliedAlpha = false;
        this._ownsSkeletonData = null;
        this._atlas = null;

        if (arguments.length === 0)
            this.init();
        else
            this.initWithArgs(skeletonDataFile, atlasFile, scale);
    }

    get opacityModifyRGB() { return this.isOpacityModifyRGB(); }
    get _blendFunc() { return this.getBlendFunc(); }
    get _texture() { return this._renderCmd._currTexture; }

    _createRenderCmd() {
        if (RendererConfig.getInstance().isCanvas)
            return new this.constructor.CanvasRenderCmd(this);
        else
            return new this.constructor.WebGLRenderCmd(this);
    }

    init() {
        super.init();
        this._premultipliedAlpha = (RendererConfig.getInstance().isWebGL && !!OPTIMIZE_BLEND_FUNC_FOR_PREMULTIPLIED_ALPHA);
    }

    onEnter() {
        super.onEnter();
        this.scheduleUpdate();
    }

    onExit() {
        this.unscheduleUpdate();
        super.onExit();
    }

    setDebugSlots(enable) { this._debugSlots = enable; }
    setDebugBones(enable) { this._debugBones = enable; }

    setDebugSlotsEnabled(enabled) { this._debugSlots = enabled; }
    getDebugSlotsEnabled() { return this._debugSlots; }

    setDebugBonesEnabled(enabled) { this._debugBones = enabled; }
    getDebugBonesEnabled() { return this._debugBones; }

    setTimeScale(scale) { this._timeScale = scale; }
    getTimeScale() { return this._timeScale; }

    initWithArgs(skeletonDataFile, atlasFile, scale) {
        let skeletonData, atlas, ownsSkeletonData;

        if (isString(skeletonDataFile)) {
            if (isString(atlasFile)) {
                const data = Loader.getInstance().getRes(atlasFile);
                atlas = new TextureAtlas(data);
                _atlasLoader.loadAtlas(atlas, atlasFile);
            } else {
                atlas = atlasFile;
            }
            scale = scale || 1 / Director.getInstance().getContentScaleFactor();

            const attachmentLoader = new AtlasAttachmentLoader(atlas);
            const skeletonJsonReader = new SkeletonJson(attachmentLoader);
            skeletonJsonReader.scale = scale;

            const skeletonJson = _normalizeLegacyJson(Loader.getInstance().getRes(skeletonDataFile));
            skeletonData = skeletonJsonReader.readSkeletonData(skeletonJson);
            ownsSkeletonData = true;
        } else {
            skeletonData = skeletonDataFile;
            ownsSkeletonData = atlasFile;
        }
        this.setSkeletonData(skeletonData, ownsSkeletonData);
        this.init();
    }

    getBoundingBox() {
        let minX = FLT_MAX, minY = FLT_MAX, maxX = -FLT_MAX, maxY = -FLT_MAX;
        const scaleX = this.getScaleX(), scaleY = this.getScaleY();
        const slots = this._skeleton.slots;

        for (let i = 0, n = slots.length; i < n; ++i) {
            const slot = slots[i];
            const attachment = slot.attachment;
            if (!attachment || !(attachment instanceof RegionAttachment))
                continue;
            const vertices = Utils.setArraySize(new Array(), 8, 0);
            attachment.computeWorldVertices(slot, vertices, 0, 2);
            minX = Math.min(minX, vertices[0] * scaleX, vertices[6] * scaleX, vertices[4] * scaleX, vertices[2] * scaleX);
            minY = Math.min(minY, vertices[1] * scaleY, vertices[7] * scaleY, vertices[5] * scaleY, vertices[3] * scaleY);
            maxX = Math.max(maxX, vertices[0] * scaleX, vertices[6] * scaleX, vertices[4] * scaleX, vertices[2] * scaleX);
            maxY = Math.max(maxY, vertices[1] * scaleY, vertices[7] * scaleY, vertices[5] * scaleY, vertices[3] * scaleY);
        }
        const position = this.getPosition();
        return new Rect(position.x + minX, position.y + minY, maxX - minX, maxY - minY);
    }

    updateWorldTransform() { this._skeleton.updateWorldTransform(Physics.update); }
    setToSetupPose() { this._skeleton.setToSetupPose(); }
    setBonesToSetupPose() { this._skeleton.setBonesToSetupPose(); }
    setSlotsToSetupPose() { this._skeleton.setSlotsToSetupPose(); }

    findBone(boneName) { return this._skeleton.findBone(boneName); }
    findSlot(slotName) { return this._skeleton.findSlot(slotName); }

    setSkin(skinName) { return this._skeleton.setSkinByName(skinName); }

    getAttachment(slotName, attachmentName) {
        return this._skeleton.getAttachmentByName(slotName, attachmentName);
    }

    setAttachment(slotName, attachmentName) {
        this._skeleton.setAttachment(slotName, attachmentName);
    }

    setPremultipliedAlpha(premultiplied) { this._premultipliedAlpha = premultiplied; }
    isPremultipliedAlpha() { return this._premultipliedAlpha; }

    setSkeletonData(skeletonData, ownsSkeletonData) {
        if (skeletonData.width != null && skeletonData.height != null)
            this.setContentSize(
                skeletonData.width / Director.getInstance().getContentScaleFactor(),
                skeletonData.height / Director.getInstance().getContentScaleFactor()
            );

        this._skeleton = new SpineSkeleton(skeletonData);
        this._skeleton.updateWorldTransform(Physics.update);
        this._rootBone = this._skeleton.getRootBone();
        this._ownsSkeletonData = ownsSkeletonData;

        this._renderCmd._createChildFormSkeletonData();
    }

    getTextureAtlas(regionAttachment) { return regionAttachment.region; }

    getBlendFunc() {
        const slot = this._skeleton.drawOrder[0];
        if (slot) {
            return this._renderCmd._getBlendFunc(slot.data.blendMode, this._premultipliedAlpha);
        }
        return {};
    }

    setBlendFunc(src, dst) {}

    update(dt) { this._skeleton.update(dt); }
}

// Converts Spine 3.x JSON to Spine 4.x format so that spine-core 4.x can parse legacy data files.
// Changes:
//   - Skins: plain object {skinName: {slotName: ...}} → array [{name, attachments: ...}]
//   - Attachments: rename "name" (atlas path) to "path" per 4.x convention
function _normalizeLegacyJson(json) {
    const root = typeof json === "string" ? JSON.parse(json) : json;
    if (!root || !root.skins || Array.isArray(root.skins))
        return root;
    const skins = Object.keys(root.skins).map(skinName => {
        const attachments = {};
        const skinSlots = root.skins[skinName];
        for (const slotName in skinSlots) {
            const slotAttachments = skinSlots[slotName];
            attachments[slotName] = {};
            for (const attKey in slotAttachments) {
                const att = slotAttachments[attKey];
                // In 3.x, "name" is the atlas region path; 4.x uses "path" instead.
                if (att.name != null && att.name !== attKey) {
                    const { name, ...rest } = att;
                    attachments[slotName][attKey] = { path: name, ...rest };
                } else {
                    attachments[slotName][attKey] = att;
                }
            }
        }
        return { name: skinName, attachments };
    });
    return Object.assign({}, root, { skins });
}

export const _atlasLoader = {
    loadAtlas(atlas, atlasFilePath) {
        for (const page of atlas.pages) {
            const texturePath = Path.join(Path.dirname(atlasFilePath), page.name);
            const texture = TextureCache.getInstance().addImage(texturePath);
            const tex = new SkeletonTexture({ width: texture.getPixelsWide(), height: texture.getPixelsHigh() });
            tex.setRealTexture(texture);
            page.setTexture(tex);
        }
    }
};
