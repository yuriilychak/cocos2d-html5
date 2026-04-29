import {
  Game,
  NodeCanvasRenderCmd,
  Node,
  Sprite,
  Point,
  Color,
  Rect,
  RendererConfig
} from "@aspect/core";
import {
  RegionAttachment,
  MeshAttachment,
  Utils
} from "@esotericsoftware/spine-core";

export class SkeletonCanvasRenderCmd extends NodeCanvasRenderCmd {
  constructor(renderableObject) {
    super(renderableObject);
    this._needDraw = true;
  }

  rendering(wrapper, scaleX, scaleY) {
    const node = this._node;
    wrapper = wrapper || RendererConfig.getInstance().renderContext;

    const locSkeleton = node._skeleton;
    const drawOrder = locSkeleton.drawOrder;
    for (let i = 0, n = drawOrder.length; i < n; i++) {
      const slot = drawOrder[i];
      const slotNode = slot._slotNode;
      if (slotNode._visible && slotNode._renderCmd && slot.currentSprite) {
        slotNode._renderCmd.transform(this, true);
        slot.currentSprite._renderCmd.rendering(wrapper, scaleX, scaleY);
        slotNode._renderCmd._dirtyFlag =
          slot.currentSprite._renderCmd._dirtyFlag = 0;
      }
    }

    if (!node._debugSlots && !node._debugBones) return;

    wrapper.setTransform(this._worldTransform, scaleX, scaleY);
    wrapper.setGlobalAlpha(1);
    const drawingUtil = Game.getInstance().drawingUtil;

    if (node._debugSlots) {
      drawingUtil.setDrawColor(0, 0, 255, 255);
      drawingUtil.setLineWidth(1);

      const points = [];
      for (let i = 0, n = locSkeleton.slots.length; i < n; i++) {
        const slot = locSkeleton.drawOrder[i];
        if (!slot.attachment || !(slot.attachment instanceof RegionAttachment))
          continue;
        this._updateRegionAttachmentSlot(slot.attachment, slot, points);
        drawingUtil.drawPoly(points, 4, true);
      }
    }

    if (node._debugBones) {
      drawingUtil.setLineWidth(2);
      drawingUtil.setDrawColor(255, 0, 0, 255);

      for (let i = 0, n = locSkeleton.bones.length; i < n; i++) {
        const bone = locSkeleton.bones[i];
        const x = bone.data.length * bone.a + bone.worldX;
        const y = bone.data.length * bone.c + bone.worldY;
        drawingUtil.drawLine({ x: bone.worldX, y: bone.worldY }, { x, y });
      }

      const pointSize = 4;
      drawingUtil.setDrawColor(0, 0, 255, 255);
      for (let i = 0, n = locSkeleton.bones.length; i < n; i++) {
        const bone = locSkeleton.bones[i];
        drawingUtil.drawPoint({ x: bone.worldX, y: bone.worldY }, pointSize);
        if (i === 0) drawingUtil.setDrawColor(0, 255, 0, 255);
      }
    }
  }

  updateStatus() {
    this.originUpdateStatus();
    this._updateCurrentRegions();
    this._regionFlag = NodeCanvasRenderCmd.RegionStatus.DirtyDouble;
    this._dirtyFlag &= ~Node._dirtyFlags.contentDirty;
  }

  getLocalBB() {
    return this._node.getBoundingBox();
  }

  _updateRegionAttachmentSlot(attachment, slot, points) {
    if (!points) return;

    const vertices = Utils.setArraySize(new Array(), 8, 0);
    attachment.computeWorldVertices(slot, vertices, 0, 2);
    points.length = 0;
    points.push(new Point(vertices[0], vertices[1]));
    points.push(new Point(vertices[6], vertices[7]));
    points.push(new Point(vertices[4], vertices[5]));
    points.push(new Point(vertices[2], vertices[3]));
  }

  _createChildFormSkeletonData() {
    const node = this._node;
    const locSkeleton = node._skeleton;
    for (let i = 0, n = locSkeleton.slots.length; i < n; i++) {
      const slot = locSkeleton.slots[i];
      const attachment = slot.attachment;
      const slotNode = new Node();
      slot._slotNode = slotNode;

      if (attachment instanceof RegionAttachment) {
        const spriteName = attachment.region.name;
        const sprite = this._createSprite(slot, attachment);
        slot.currentSprite = sprite;
        slot.currentSpriteName = spriteName;
        slotNode.addChild(sprite);
      } else if (attachment instanceof MeshAttachment) {
        // mesh rendering not yet supported in canvas mode
      }
    }
  }

  _createSprite(slot, attachment) {
    const rendererObject = attachment.region;
    const texture = rendererObject.texture.getRealTexture();
    const sprite = new Sprite();
    const rect = new Rect(
      rendererObject.x,
      rendererObject.y,
      rendererObject.width,
      rendererObject.height
    );

    const initSprite = () => {
      sprite.initWithTexture(
        texture,
        rect,
        rendererObject.degrees !== 0,
        false
      );
      sprite._rect.width = attachment.width;
      sprite._rect.height = attachment.height;
      sprite.setContentSize(attachment.width, attachment.height);
      sprite.setRotation(-attachment.rotation);
      sprite.setScale(
        (rendererObject.width / rendererObject.originalWidth) *
          attachment.scaleX,
        (rendererObject.height / rendererObject.originalHeight) *
          attachment.scaleY
      );
    };

    if (texture.isLoaded()) {
      initSprite();
    } else {
      texture.addEventListener("load", initSprite, this);
    }
    slot.sprites = slot.sprites || {};
    slot.sprites[rendererObject.name] = sprite;
    return sprite;
  }

  _updateChild() {
    const locSkeleton = this._node._skeleton;
    const slots = locSkeleton.slots;
    const color = this._displayedColor;
    const opacity = this._displayedOpacity;

    for (let i = 0, n = slots.length; i < n; i++) {
      const slot = slots[i];
      const attachment = slot.attachment;
      const slotNode = slot._slotNode;

      if (!attachment) {
        slotNode.setVisible(false);
        continue;
      }

      if (attachment instanceof RegionAttachment) {
        if (attachment.region) {
          if (
            !slot.currentSpriteName ||
            slot.currentSpriteName !== attachment.name
          ) {
            const spriteName = attachment.region.name;
            if (slot.currentSprite !== undefined)
              slot.currentSprite.setVisible(false);
            slot.sprites = slot.sprites || {};
            if (slot.sprites[spriteName] !== undefined) {
              slot.sprites[spriteName].setVisible(true);
            } else {
              const sprite = this._createSprite(slot, attachment);
              slotNode.addChild(sprite);
            }
            slot.currentSprite = slot.sprites[spriteName];
            slot.currentSpriteName = spriteName;
          }
        }

        const bone = slot.bone;
        let ax, ay;
        if (
          attachment.region.offsetX === 0 &&
          attachment.region.offsetY === 0
        ) {
          ax = attachment.x;
          ay = attachment.y;
        } else {
          ax = (attachment.offset[0] + attachment.offset[4]) * 0.5;
          ay = (attachment.offset[1] + attachment.offset[5]) * 0.5;
        }
        slotNode.setPosition(
          bone.worldX + ax * bone.a + ay * bone.b,
          bone.worldY + ax * bone.c + ay * bone.d
        );
        slotNode.setScale(bone.getWorldScaleX(), bone.getWorldScaleY());

        const selSprite = slot.currentSprite;
        selSprite._flippedX = bone.skeleton.scaleX < 0;
        selSprite._flippedY = bone.skeleton.scaleY < 0;
        if (selSprite._flippedY || selSprite._flippedX) {
          slotNode.setRotation(bone.getWorldRotationX());
          selSprite.setRotation(attachment.rotation);
        } else {
          slotNode.setRotation(-bone.getWorldRotationX());
          selSprite.setRotation(-attachment.rotation);
        }

        selSprite._renderCmd._displayedOpacity = 0 | (opacity * slot.color.a);
        const r = 0 | (color.r * slot.color.r);
        const g = 0 | (color.g * slot.color.g);
        const b = 0 | (color.b * slot.color.b);
        selSprite.setColor(new Color(r, g, b));
        selSprite._renderCmd._updateColor();
      } else if (attachment instanceof MeshAttachment) {
        // mesh not supported in canvas mode
      } else {
        slotNode.setVisible(false);
        continue;
      }
      slotNode.setVisible(true);
    }
  }
}
