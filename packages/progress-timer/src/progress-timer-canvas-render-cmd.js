import {
  NodeCanvasRenderCmd,
  Node,
  RendererConfig,
  Point,
  Rect,
  Size,
  incrementGLDraws
} from "@aspect/core";
import { TYPE_BAR, TYPE_RADIAL } from "./constants";

/**
 * ProgressTimer's rendering objects of Canvas
 */
export class ProgressTimerCanvasRenderCmd extends NodeCanvasRenderCmd {
  constructor(renderableObject) {
    super(renderableObject);
    this._needDraw = true;

    this._PI180 = Math.PI / 180;
    this._barRect = new Rect(0, 0, 0, 0);
    this._origin = new Point(0, 0);
    this._radius = 0;
    this._startAngle = 270;
    this._endAngle = 270;
    this._counterClockWise = false;
    this._canUseDirtyRegion = true;
  }

  rendering(ctx, scaleX, scaleY) {
    const wrapper = ctx || RendererConfig.getInstance().renderContext;
    const context = wrapper.getContext();
    const node = this._node;
    const locSprite = node._sprite;
    const locTextureCoord = locSprite._renderCmd._textureCoord;
    const alpha = locSprite._renderCmd._displayedOpacity / 255;

    if (locTextureCoord.width === 0 || locTextureCoord.height === 0) return;
    if (!locSprite._texture || !locTextureCoord.validRect || alpha === 0)
      return;

    wrapper.setTransform(this._worldTransform, scaleX, scaleY);
    wrapper.setCompositeOperation(locSprite._blendFuncStr);
    wrapper.setGlobalAlpha(alpha);

    const locRect = locSprite._rect,
      locOffsetPosition = locSprite._offsetPosition;
    let locX = locOffsetPosition.x,
      locY = -locOffsetPosition.y - locRect.height;
    const locWidth = locRect.width,
      locHeight = locRect.height;

    wrapper.save();
    if (locSprite._flippedX) {
      locX = -locX - locWidth;
      context.scale(-1, 1);
    }
    if (locSprite._flippedY) {
      locY = locOffsetPosition.y;
      context.scale(1, -1);
    }

    //clip
    if (node._type === TYPE_BAR) {
      const locBarRect = this._barRect;
      context.beginPath();
      context.rect(
        locBarRect.x,
        locBarRect.y,
        locBarRect.width,
        locBarRect.height
      );
      context.clip();
      context.closePath();
    } else if (node._type === TYPE_RADIAL) {
      const locOriginX = this._origin.x;
      const locOriginY = this._origin.y;
      context.beginPath();
      context.arc(
        locOriginX,
        locOriginY,
        this._radius,
        this._PI180 * this._startAngle,
        this._PI180 * this._endAngle,
        this._counterClockWise
      );
      context.lineTo(locOriginX, locOriginY);
      context.clip();
      context.closePath();
    }

    //draw sprite
    const texture = locSprite._renderCmd._textureToRender || locSprite._texture;
    const image = texture.getHtmlElementObj();
    if (locSprite._renderCmd._colorized) {
      context.drawImage(
        image,
        0,
        0,
        locTextureCoord.width,
        locTextureCoord.height,
        locX,
        locY,
        locWidth,
        locHeight
      );
    } else {
      context.drawImage(
        image,
        locTextureCoord.renderX,
        locTextureCoord.renderY,
        locTextureCoord.width,
        locTextureCoord.height,
        locX,
        locY,
        locWidth,
        locHeight
      );
    }
    wrapper.restore();
    incrementGLDraws(1);
  }

  releaseData() {}

  resetVertexData() {}

  _updateProgress() {
    this.setDirtyFlag(Node._dirtyFlags.contentDirty);
    const node = this._node;
    const locSprite = node._sprite;
    const sw = locSprite.width,
      sh = locSprite.height;
    const locMidPoint = node._midPoint;

    if (node._type === TYPE_RADIAL) {
      this._radius = Math.round(Math.sqrt(sw * sw + sh * sh));
      let locStartAngle,
        locEndAngle,
        locCounterClockWise = false;
      const locOrigin = this._origin;
      locOrigin.x = sw * locMidPoint.x;
      locOrigin.y = -sh * locMidPoint.y;

      if (node._reverseDirection) {
        locEndAngle = 270;
        locStartAngle = 270 - 3.6 * node._percentage;
      } else {
        locStartAngle = -90;
        locEndAngle = -90 + 3.6 * node._percentage;
      }

      if (locSprite._flippedX) {
        locOrigin.x -= sw * (node._midPoint.x * 2);
        locStartAngle = -locStartAngle;
        locEndAngle = -locEndAngle;
        locStartAngle -= 180;
        locEndAngle -= 180;
        locCounterClockWise = !locCounterClockWise;
      }
      if (locSprite._flippedY) {
        locOrigin.y += sh * (node._midPoint.y * 2);
        locCounterClockWise = !locCounterClockWise;
        locStartAngle = -locStartAngle;
        locEndAngle = -locEndAngle;
      }

      this._startAngle = locStartAngle;
      this._endAngle = locEndAngle;
      this._counterClockWise = locCounterClockWise;
    } else {
      const locBarChangeRate = node._barChangeRate;
      const percentageF = node._percentage / 100;
      const locBarRect = this._barRect;

      const drewSize = new Size(
        sw * (1 - locBarChangeRate.x),
        sh * (1 - locBarChangeRate.y)
      );
      const drawingSize = new Size(
        (sw - drewSize.width) * percentageF,
        (sh - drewSize.height) * percentageF
      );
      const currentDrawSize = new Size(
        drewSize.width + drawingSize.width,
        drewSize.height + drawingSize.height
      );

      const startPoint = new Point(sw * locMidPoint.x, sh * locMidPoint.y);

      let needToLeft = startPoint.x - currentDrawSize.width / 2;
      if (locMidPoint.x > 0.5 && currentDrawSize.width / 2 >= sw - startPoint.x)
        needToLeft = sw - currentDrawSize.width;

      let needToTop = startPoint.y - currentDrawSize.height / 2;
      if (
        locMidPoint.y > 0.5 &&
        currentDrawSize.height / 2 >= sh - startPoint.y
      )
        needToTop = sh - currentDrawSize.height;

      //left pos
      locBarRect.x = 0;
      let flipXNeed = 1;
      if (locSprite._flippedX) {
        locBarRect.x -= currentDrawSize.width;
        flipXNeed = -1;
      }

      if (needToLeft > 0) locBarRect.x += needToLeft * flipXNeed;

      //right pos
      locBarRect.y = 0;
      let flipYNeed = 1;
      if (locSprite._flippedY) {
        locBarRect.y += currentDrawSize.height;
        flipYNeed = -1;
      }

      if (needToTop > 0) locBarRect.y -= needToTop * flipYNeed;

      //clip width and clip height
      locBarRect.width = currentDrawSize.width;
      locBarRect.height = -currentDrawSize.height;
    }
  }

  _syncStatus(parentCmd) {
    const node = this._node;
    if (!node._sprite) return;
    const flags = Node._dirtyFlags;
    let locFlag = this._dirtyFlag;
    const parentNode = parentCmd ? parentCmd._node : null;

    if (
      parentNode &&
      parentNode._cascadeColorEnabled &&
      parentCmd._dirtyFlag & flags.colorDirty
    )
      locFlag |= flags.colorDirty;

    if (
      parentNode &&
      parentNode._cascadeOpacityEnabled &&
      parentCmd._dirtyFlag & flags.opacityDirty
    )
      locFlag |= flags.opacityDirty;

    if (parentCmd && parentCmd._dirtyFlag & flags.transformDirty)
      locFlag |= flags.transformDirty;

    this._dirtyFlag = locFlag;

    const spriteCmd = node._sprite._renderCmd;
    const spriteFlag = spriteCmd._dirtyFlag;

    const colorDirty = spriteFlag & flags.colorDirty,
      opacityDirty = spriteFlag & flags.opacityDirty;

    if (colorDirty) {
      spriteCmd._syncDisplayColor();
      spriteCmd._dirtyFlag &= ~flags.colorDirty;
      this._dirtyFlag &= ~flags.colorDirty;
    }

    if (opacityDirty) {
      spriteCmd._syncDisplayOpacity();
      spriteCmd._dirtyFlag &= ~flags.opacityDirty;
      this._dirtyFlag &= ~flags.opacityDirty;
    }

    if (colorDirty || opacityDirty) {
      spriteCmd._updateColor();
    }

    if (locFlag & flags.transformDirty) {
      this.transform(parentCmd);
    }

    if (locFlag & flags.orderDirty) {
      this._dirtyFlag &= ~flags.orderDirty;
    }
  }

  updateStatus() {
    const node = this._node;
    if (!node._sprite) return;
    const flags = Node._dirtyFlags,
      locFlag = this._dirtyFlag;
    const spriteCmd = node._sprite._renderCmd;
    const spriteFlag = spriteCmd._dirtyFlag;

    const colorDirty = spriteFlag & flags.colorDirty,
      opacityDirty = spriteFlag & flags.opacityDirty;

    if (colorDirty) {
      spriteCmd._updateDisplayColor();
      spriteCmd._dirtyFlag =
        (spriteCmd._dirtyFlag & flags.colorDirty) ^ spriteCmd._dirtyFlag;
      this._dirtyFlag = (this._dirtyFlag & flags.colorDirty) ^ this._dirtyFlag;
    }

    if (opacityDirty) {
      spriteCmd._updateDisplayOpacity();
      spriteCmd._dirtyFlag =
        (spriteCmd._dirtyFlag & flags.opacityDirty) ^ spriteCmd._dirtyFlag;
      this._dirtyFlag =
        (this._dirtyFlag & flags.opacityDirty) ^ this._dirtyFlag;
    }

    if (colorDirty || opacityDirty) {
      spriteCmd._updateColor();
    }

    if (locFlag & flags.transformDirty) {
      this.transform(this.getParentRenderCmd(), true);
    }
    if (locFlag & flags.contentDirty) {
      this._notifyRegionStatus &&
        this._notifyRegionStatus(NodeCanvasRenderCmd.RegionStatus.Dirty);
    }
    this._dirtyFlag = 0;
  }
}
