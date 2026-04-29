import {
  Game,
  NodeWebGLRenderCmd,
  Point,
  RendererConfig,
  Matrix4,
  KM_GL_MODELVIEW,
  kmGLMatrixMode,
  kmGLPopMatrix,
  ONE,
  ONE_MINUS_SRC_ALPHA,
  SRC_ALPHA,
  DST_COLOR,
  ONE_MINUS_SRC_COLOR,
  SHADER_SPRITE_POSITION_TEXTURECOLOR,
  ShaderCache,
  BATCH_VERTEX_COUNT
} from "@aspect/core";
import {
  RegionAttachment,
  MeshAttachment,
  BlendMode,
  Utils
} from "@esotericsoftware/spine-core";

export class SkeletonWebGLRenderCmd extends NodeWebGLRenderCmd {
  constructor(renderableObject) {
    super(renderableObject);
    this._needDraw = true;
    this._matrix = new Matrix4();
    this._matrix.identity();
    this._currTexture = null;
    this._currBlendFunc = {};
    this.vertexType = RendererConfig.getInstance().renderer.VertexType.CUSTOM;
    this.setShaderProgram(
      ShaderCache.getInstance().programForKey(
        SHADER_SPRITE_POSITION_TEXTURECOLOR
      )
    );
  }

  uploadData(f32buffer, ui32buffer, vertexDataOffset) {
    const node = this._node;
    const color = this._displayedColor;
    const locSkeleton = node._skeleton;
    const premultiAlpha = node._premultipliedAlpha;

    locSkeleton.r = color.r / 255;
    locSkeleton.g = color.g / 255;
    locSkeleton.b = color.b / 255;
    locSkeleton.a = this._displayedOpacity / 255;
    if (premultiAlpha) {
      locSkeleton.r *= locSkeleton.a;
      locSkeleton.g *= locSkeleton.a;
      locSkeleton.b *= locSkeleton.a;
    }

    let debugSlotsInfo = null;
    if (node._debugSlots) debugSlotsInfo = [];

    const renderer = RendererConfig.getInstance().renderer;
    for (let i = 0, n = locSkeleton.drawOrder.length; i < n; i++) {
      const slot = locSkeleton.drawOrder[i];
      if (!slot.attachment) continue;
      const attachment = slot.attachment;

      let vertCount = 0;
      if (attachment instanceof RegionAttachment) {
        vertCount = 6;
      } else if (attachment instanceof MeshAttachment) {
        vertCount = attachment.regionUVs.length / 2;
      } else {
        continue;
      }

      if (vertCount === 0) continue;

      const regionTextureAtlas = node.getTextureAtlas(attachment);
      this._currTexture = regionTextureAtlas.texture.getRealTexture();
      const batchBroken = renderer._updateBatchedInfo(
        this._currTexture,
        this._getBlendFunc(slot.data.blendMode, premultiAlpha),
        this._glProgramState
      );

      const uploadAll =
        vertexDataOffset / 6 + vertCount > (BATCH_VERTEX_COUNT - 200) * 0.5;
      if (!batchBroken && uploadAll) {
        renderer._batchRendering();
      }
      if (batchBroken || uploadAll) {
        vertexDataOffset = 0;
      }

      let slotDebugPoints = null;
      if (attachment instanceof RegionAttachment) {
        slotDebugPoints = this._uploadRegionAttachmentData(
          attachment,
          slot,
          premultiAlpha,
          f32buffer,
          ui32buffer,
          vertexDataOffset
        );
      } else if (attachment instanceof MeshAttachment) {
        this._uploadMeshAttachmentData(
          attachment,
          slot,
          premultiAlpha,
          f32buffer,
          ui32buffer,
          vertexDataOffset
        );
      } else {
        continue;
      }

      if (node._debugSlots) debugSlotsInfo[i] = slotDebugPoints;

      if (attachment instanceof RegionAttachment) {
        renderer._increaseBatchingSize(vertCount, renderer.VertexType.TRIANGLE);
      } else {
        renderer._increaseBatchingSize(
          vertCount,
          renderer.VertexType.CUSTOM,
          attachment.triangles
        );
      }

      vertexDataOffset += vertCount * 6;
    }

    if (node._debugBones || node._debugSlots) {
      renderer._batchRendering();

      const wt = this._worldTransform,
        mat = this._matrix.mat;
      mat[0] = wt.a;
      mat[4] = wt.c;
      mat[12] = wt.tx;
      mat[1] = wt.b;
      mat[5] = wt.d;
      mat[13] = wt.ty;
      kmGLMatrixMode(KM_GL_MODELVIEW);
      cc.current_stack.stack.push(cc.current_stack.top);
      cc.current_stack.top = this._matrix;
      const drawingUtil = Game.getInstance().drawingUtil;

      if (node._debugSlots && debugSlotsInfo && debugSlotsInfo.length > 0) {
        drawingUtil.setDrawColor(0, 0, 255, 255);
        drawingUtil.setLineWidth(1);
        for (let i = 0, n = locSkeleton.slots.length; i < n; i++) {
          const points = debugSlotsInfo[i];
          if (points) drawingUtil.drawPoly(points, 4, true);
        }
      }

      if (node._debugBones) {
        drawingUtil.setLineWidth(2);
        drawingUtil.setDrawColor(255, 0, 0, 255);
        for (let i = 0, n = locSkeleton.bones.length; i < n; i++) {
          const bone = locSkeleton.bones[i];
          const x = bone.data.length * bone.a + bone.worldX;
          const y = bone.data.length * bone.c + bone.worldY;
          drawingUtil.drawLine(
            new Point(bone.worldX, bone.worldY),
            new Point(x, y)
          );
        }
        drawingUtil.setPointSize(4);
        drawingUtil.setDrawColor(0, 0, 255, 255);
        for (let i = 0, n = locSkeleton.bones.length; i < n; i++) {
          const bone = locSkeleton.bones[i];
          drawingUtil.drawPoint(new Point(bone.worldX, bone.worldY));
          if (i === 0) drawingUtil.setDrawColor(0, 255, 0, 255);
        }
      }
      kmGLPopMatrix();
    }

    return 0;
  }

  _getBlendFunc(blendMode, premultiAlpha) {
    const ret = this._currBlendFunc;
    switch (blendMode) {
      case BlendMode.Normal:
        ret.src = premultiAlpha ? ONE : SRC_ALPHA;
        ret.dst = ONE_MINUS_SRC_ALPHA;
        break;
      case BlendMode.Additive:
        ret.src = premultiAlpha ? ONE : SRC_ALPHA;
        ret.dst = ONE;
        break;
      case BlendMode.Multiply:
        ret.src = DST_COLOR;
        ret.dst = ONE_MINUS_SRC_ALPHA;
        break;
      case BlendMode.Screen:
        ret.src = ONE;
        ret.dst = ONE_MINUS_SRC_COLOR;
        break;
      default:
        return this._node._blendFunc;
    }
    return ret;
  }

  _createChildFormSkeletonData() {}
  _updateChild() {}

  _uploadRegionAttachmentData(
    attachment,
    slot,
    premultipliedAlpha,
    f32buffer,
    ui32buffer,
    vertexDataOffset
  ) {
    const nodeColor = this._displayedColor;
    const nodeR = nodeColor.r,
      nodeG = nodeColor.g,
      nodeB = nodeColor.b,
      nodeA = this._displayedOpacity;

    const vertices = Utils.setArraySize(new Array(), 8, 0);
    attachment.computeWorldVertices(slot, vertices, 0, 2);
    const uvs = attachment.uvs;

    const skeleton = slot.bone.skeleton;
    const skeletonColor = skeleton.color;
    const slotColor = slot.color;
    const regionColor = attachment.color;
    const alpha = skeletonColor.a * slotColor.a * regionColor.a;
    const multiplier = premultipliedAlpha ? alpha : 1;
    const colors = attachment.tempColor;
    colors.set(
      skeletonColor.r * slotColor.r * regionColor.r * multiplier,
      skeletonColor.g * slotColor.g * regionColor.g * multiplier,
      skeletonColor.b * slotColor.b * regionColor.b * multiplier,
      alpha
    );

    const wt = this._worldTransform;
    const wa = wt.a,
      wb = wt.b,
      wc = wt.c,
      wd = wt.d,
      wx = wt.tx,
      wy = wt.ty;
    const z = this._node.vertexZ;

    let offset = vertexDataOffset;
    for (let i = 0; i < 6; i++) {
      const srcIdx = i < 4 ? i % 3 : i - 2;
      const vx = vertices[srcIdx * 2],
        vy = vertices[srcIdx * 2 + 1];
      const x = vx * wa + vy * wc + wx,
        y = vx * wb + vy * wd + wy;
      const r = colors.r * nodeR,
        g = colors.g * nodeG,
        b = colors.b * nodeB,
        a = colors.a * nodeA;
      const colorVal = (a << 24) | (b << 16) | (g << 8) | r;
      f32buffer[offset] = x;
      f32buffer[offset + 1] = y;
      f32buffer[offset + 2] = z;
      ui32buffer[offset + 3] = colorVal;
      f32buffer[offset + 4] = uvs[srcIdx * 2];
      f32buffer[offset + 5] = uvs[srcIdx * 2 + 1];
      offset += 6;
    }

    if (this._node._debugSlots) {
      return [
        new Point(vertices[0], vertices[1]),
        new Point(vertices[2], vertices[3]),
        new Point(vertices[4], vertices[5]),
        new Point(vertices[6], vertices[7])
      ];
    }
  }

  _uploadMeshAttachmentData(
    attachment,
    slot,
    premultipliedAlpha,
    f32buffer,
    ui32buffer,
    vertexDataOffset
  ) {
    const wt = this._worldTransform;
    const wa = wt.a,
      wb = wt.b,
      wc = wt.c,
      wd = wt.d,
      wx = wt.tx,
      wy = wt.ty;
    const z = this._node.vertexZ;

    const verticesLength = attachment.worldVerticesLength;
    const vertices = Utils.setArraySize(new Array(), verticesLength, 0);
    attachment.computeWorldVertices(slot, 0, verticesLength, vertices, 0, 2);
    const uvs = attachment.uvs;

    const skeleton = slot.bone.skeleton;
    const skeletonColor = skeleton.color,
      slotColor = slot.color,
      meshColor = attachment.color;
    const alpha = skeletonColor.a * slotColor.a * meshColor.a;
    const multiplier = premultipliedAlpha ? alpha : 1;
    const colors = attachment.tempColor;
    colors.set(
      skeletonColor.r * slotColor.r * meshColor.r * multiplier,
      skeletonColor.g * slotColor.g * meshColor.g * multiplier,
      skeletonColor.b * slotColor.b * meshColor.b * multiplier,
      alpha
    );

    let offset = vertexDataOffset;
    const nodeColor = this._displayedColor;
    const nodeR = nodeColor.r,
      nodeG = nodeColor.g,
      nodeB = nodeColor.b,
      nodeA = this._displayedOpacity;
    for (let i = 0, n = vertices.length; i < n; i += 2) {
      const vx = vertices[i],
        vy = vertices[i + 1];
      const x = vx * wa + vy * wc + wx,
        y = vx * wb + vy * wd + wy;
      const r = colors.r * nodeR,
        g = colors.g * nodeG,
        b = colors.b * nodeB,
        a = colors.a * nodeA;
      const colorVal = (a << 24) | (b << 16) | (g << 8) | r;
      f32buffer[offset] = x;
      f32buffer[offset + 1] = y;
      f32buffer[offset + 2] = z;
      ui32buffer[offset + 3] = colorVal;
      f32buffer[offset + 4] = uvs[i];
      f32buffer[offset + 5] = uvs[i + 1];
      offset += 6;
    }
  }
}
