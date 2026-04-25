/****************************************************************************
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

import {
  Node,
  RendererConfig,
  Director,
  Texture2D,
  Size,
  Rect,
  Sprite,
  log,
  NextPOT,
  contentScaleFactor,
  Configuration,
  Matrix4,
  kmGLMatrixMode,
  kmGLPushMatrix,
  kmGLPopMatrix,
  kmGLMultMatrix,
  KM_GL_PROJECTION,
  KM_GL_MODELVIEW
} from "@aspect/core";

const NodeWebGLRenderCmd = Node.WebGLRenderCmd;

export class RenderTextureWebGLRenderCmd extends NodeWebGLRenderCmd {
  constructor(renderableObject) {
    super(renderableObject);
    this._needDraw = true;

    this._fBO = null;
    this._oldFBO = null;
    this._textureCopy = null;
    this._depthRenderBuffer = null;

    this._rtTextureRect = new Rect();
    this._fullRect = new Rect();
    this._fullViewport = new Rect();
  }

  setVirtualViewport(rtBegin, fullRect, fullViewport) {
    this._rtTextureRect.x = rtBegin.x;
    this._rtTextureRect.y = rtBegin.y;

    this._fullRect = fullRect;
    this._fullViewport = fullViewport;
  }

  needDraw() {
    return this._needDraw && this._node.autoDraw;
  }

  rendering(ctx) {
    const gl = ctx || RendererConfig.getInstance().renderContext;
    const node = this._node;
    if (node.autoDraw) {
      node.begin();

      const locClearFlags = node.clearFlags;
      if (locClearFlags) {
        let oldClearColor = [0.0, 0.0, 0.0, 0.0];
        let oldDepthClearValue = 0.0;
        let oldStencilClearValue = 0;

        // backup and set
        if (locClearFlags & gl.COLOR_BUFFER_BIT) {
          oldClearColor = gl.getParameter(gl.COLOR_CLEAR_VALUE);
          gl.clearColor(
            node._clearColor.r / 255,
            node._clearColor.g / 255,
            node._clearColor.b / 255,
            node._clearColor.a / 255
          );
        }

        if (locClearFlags & gl.DEPTH_BUFFER_BIT) {
          oldDepthClearValue = gl.getParameter(gl.DEPTH_CLEAR_VALUE);
          gl.clearDepth(node.clearDepthVal);
        }

        if (locClearFlags & gl.STENCIL_BUFFER_BIT) {
          oldStencilClearValue = gl.getParameter(gl.STENCIL_CLEAR_VALUE);
          gl.clearStencil(node.clearStencilVal);
        }

        // clear
        gl.clear(locClearFlags);

        // restore
        if (locClearFlags & gl.COLOR_BUFFER_BIT)
          gl.clearColor(
            oldClearColor[0],
            oldClearColor[1],
            oldClearColor[2],
            oldClearColor[3]
          );

        if (locClearFlags & gl.DEPTH_BUFFER_BIT)
          gl.clearDepth(oldDepthClearValue);

        if (locClearFlags & gl.STENCIL_BUFFER_BIT)
          gl.clearStencil(oldStencilClearValue);
      }

      //! make sure all children are drawn
      node.sortAllChildren();
      const locChildren = node._children;
      for (let i = 0; i < locChildren.length; i++) {
        const getChild = locChildren[i];
        if (getChild !== node.sprite) {
          getChild.visit(node.sprite); //TODO it's very Strange
        }
      }
      node.end();
    }
  }

  clearStencil(stencilValue) {
    const gl = RendererConfig.getInstance().renderContext;
    // save old stencil value
    const stencilClearValue = gl.getParameter(gl.STENCIL_CLEAR_VALUE);

    gl.clearStencil(stencilValue);
    gl.clear(gl.STENCIL_BUFFER_BIT);

    // restore clear color
    gl.clearStencil(stencilClearValue);
  }

  cleanup() {
    this._textureCopy = null;

    const gl = RendererConfig.getInstance().renderContext;
    gl.deleteFramebuffer(this._fBO);
    if (this._depthRenderBuffer) gl.deleteRenderbuffer(this._depthRenderBuffer);
  }

  updateClearColor(clearColor) {}

  initWithWidthAndHeight(width, height, format, depthStencilFormat) {
    const node = this._node;
    if (format === Texture2D.PIXEL_FORMAT_A8)
      log(
        "cc.RenderTexture._initWithWidthAndHeightForWebGL() : only RGB and RGBA formats are valid for a render texture;"
      );

    const gl = RendererConfig.getInstance().renderContext,
      locScaleFactor = contentScaleFactor();
    this._fullRect = new Rect(0, 0, width, height);
    this._fullViewport = new Rect(0, 0, width, height);

    width = 0 | (width * locScaleFactor);
    height = 0 | (height * locScaleFactor);

    this._oldFBO = gl.getParameter(gl.FRAMEBUFFER_BINDING);

    // textures must be power of two squared
    let powW, powH;

    if (Configuration.getInstance().supportsNPOT()) {
      powW = width;
      powH = height;
    } else {
      powW = NextPOT(width);
      powH = NextPOT(height);
    }

    const dataLen = powW * powH * 4;
    const data = new Uint8Array(dataLen);
    for (let i = 0; i < powW * powH * 4; i++) data[i] = 0;

    this._pixelFormat = format;

    const locTexture = (node._texture = new Texture2D());
    if (!node._texture) return false;

    locTexture.initWithData(
      data,
      node._pixelFormat,
      powW,
      powH,
      new Size(width, height)
    );

    const oldRBO = gl.getParameter(gl.RENDERBUFFER_BINDING);

    if (Configuration.getInstance().checkForGLExtension("GL_QCOM")) {
      this._textureCopy = new Texture2D();
      if (!this._textureCopy) return false;
      this._textureCopy.initWithData(
        data,
        node._pixelFormat,
        powW,
        powH,
        new Size(width, height)
      );
    }

    // generate FBO
    this._fBO = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._fBO);

    // associate texture with FBO
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      locTexture._webTextureObj,
      0
    );

    if (depthStencilFormat !== 0) {
      //create and attach depth buffer
      this._depthRenderBuffer = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, this._depthRenderBuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, depthStencilFormat, powW, powH);
      if (depthStencilFormat === gl.DEPTH_STENCIL)
        gl.framebufferRenderbuffer(
          gl.FRAMEBUFFER,
          gl.DEPTH_STENCIL_ATTACHMENT,
          gl.RENDERBUFFER,
          this._depthRenderBuffer
        );
      else if (
        depthStencilFormat === gl.STENCIL_INDEX ||
        depthStencilFormat === gl.STENCIL_INDEX8
      )
        gl.framebufferRenderbuffer(
          gl.FRAMEBUFFER,
          gl.STENCIL_ATTACHMENT,
          gl.RENDERBUFFER,
          this._depthRenderBuffer
        );
      else if (depthStencilFormat === gl.DEPTH_COMPONENT16)
        gl.framebufferRenderbuffer(
          gl.FRAMEBUFFER,
          gl.DEPTH_ATTACHMENT,
          gl.RENDERBUFFER,
          this._depthRenderBuffer
        );
    }

    // check if it worked (probably worth doing :) )
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
      log("Could not attach texture to the framebuffer");

    locTexture.setAliasTexParameters();

    const locSprite = (node.sprite = new Sprite(locTexture));
    locSprite.scaleY = -1;
    locSprite.setBlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    gl.bindRenderbuffer(gl.RENDERBUFFER, oldRBO);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._oldFBO);

    // Disabled by default.
    node.autoDraw = false;

    // add sprite for backward compatibility
    node.addChild(locSprite);
    return true;
  }

  begin() {
    const node = this._node;
    // Save the current matrix
    kmGLMatrixMode(KM_GL_PROJECTION);
    kmGLPushMatrix();
    kmGLMatrixMode(KM_GL_MODELVIEW);
    kmGLPushMatrix();

    const gl = RendererConfig.getInstance().renderContext;

    const director = Director.getInstance();
    director.setProjection(director.getProjection());

    const texSize = node._texture.getContentSizeInPixels();

    // Calculate the adjustment ratios based on the old and new projections
    const size = Director.getInstance().getWinSizeInPixels();
    const widthRatio = size.width / texSize.width;
    const heightRatio = size.height / texSize.height;

    const orthoMatrix = Matrix4.createOrthographicProjection(
      -1.0 / widthRatio,
      1.0 / widthRatio,
      -1.0 / heightRatio,
      1.0 / heightRatio,
      -1,
      1
    );
    kmGLMultMatrix(orthoMatrix);

    //calculate viewport
    const viewport = new Rect(0, 0, 0, 0);
    viewport.width = this._fullViewport.width;
    viewport.height = this._fullViewport.height;
    const viewPortRectWidthRatio = viewport.width / this._fullRect.width;
    const viewPortRectHeightRatio = viewport.height / this._fullRect.height;
    viewport.x =
      (this._fullRect.x - this._rtTextureRect.x) * viewPortRectWidthRatio;
    viewport.y =
      (this._fullRect.y - this._rtTextureRect.y) * viewPortRectHeightRatio;
    gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);

    this._oldFBO = gl.getParameter(gl.FRAMEBUFFER_BINDING);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._fBO); //Will direct drawing to the frame buffer created above

    /*  Certain Qualcomm Adreno gpu's will retain data in memory after a frame buffer switch which corrupts the render to the texture.
     *   The solution is to clear the frame buffer before rendering to the texture. However, calling glClear has the unintended result of clearing the current texture.
     *   Create a temporary texture to overcome this. At the end of RenderTexture::begin(), switch the attached texture to the second one, call glClear,
     *   and then switch back to the original texture. This solution is unnecessary for other devices as they don't have the same issue with switching frame buffers.
     */
    if (Configuration.getInstance().checkForGLExtension("GL_QCOM")) {
      // -- bind a temporary texture so we can clear the render buffer without losing our texture
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        this._textureCopy._webTextureObj,
        0
      );
      //cc.checkGLErrorDebug();
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        node._texture._webTextureObj,
        0
      );
    }
  }

  _beginWithClear(r, g, b, a, depthValue, stencilValue, flags) {
    r = r / 255;
    g = g / 255;
    b = b / 255;
    a = a / 255;

    const gl = RendererConfig.getInstance().renderContext;

    // save clear color
    let clearColor = [0.0, 0.0, 0.0, 0.0];
    let depthClearValue = 0.0;
    let stencilClearValue = 0;

    if (flags & gl.COLOR_BUFFER_BIT) {
      clearColor = gl.getParameter(gl.COLOR_CLEAR_VALUE);
      gl.clearColor(r, g, b, a);
    }

    if (flags & gl.DEPTH_BUFFER_BIT) {
      depthClearValue = gl.getParameter(gl.DEPTH_CLEAR_VALUE);
      gl.clearDepth(depthValue);
    }

    if (flags & gl.STENCIL_BUFFER_BIT) {
      stencilClearValue = gl.getParameter(gl.STENCIL_CLEAR_VALUE);
      gl.clearStencil(stencilValue);
    }

    gl.clear(flags);

    // restore
    if (flags & gl.COLOR_BUFFER_BIT)
      gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);

    if (flags & gl.DEPTH_BUFFER_BIT) gl.clearDepth(depthClearValue);

    if (flags & gl.STENCIL_BUFFER_BIT) gl.clearStencil(stencilClearValue);
  }

  end() {
    const node = this._node;
    RendererConfig.getInstance().renderer._renderingToBuffer(node.__instanceId);

    const gl = RendererConfig.getInstance().renderContext;
    const director = Director.getInstance();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._oldFBO);

    //restore viewport
    director.setViewport();
    kmGLMatrixMode(KM_GL_PROJECTION);
    kmGLPopMatrix();
    kmGLMatrixMode(KM_GL_MODELVIEW);
    kmGLPopMatrix();
  }

  clearRect(x, y, width, height) {
    //TODO need to implement
  }

  clearDepth(depthValue) {
    const node = this._node;
    node.begin();

    const gl = RendererConfig.getInstance().renderContext;
    //! save old depth value
    const depthClearValue = gl.getParameter(gl.DEPTH_CLEAR_VALUE);

    gl.clearDepth(depthValue);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    // restore clear color
    gl.clearDepth(depthClearValue);
    node.end();
  }
}
