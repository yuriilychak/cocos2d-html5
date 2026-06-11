import { Rect, Sprite, ServiceLocator } from "@aspect/core";
import { LayoutParameter } from "../layouts/layout-parameter";
import { LayoutComponent } from "../layouts/layout-component";

export const helper = {
  /**
   * Finds a widget whose tag equals to param tag from root widget.
   * @param {Widget} root
   * @param {number} tag
   * @returns {Widget}
   */
  seekWidgetByTag: function (root, tag) {
    if (!root) return null;
    if (root.tag === tag) return root;

    var arrayRootChildren = root.children;
    var length = arrayRootChildren.length;
    for (var i = 0; i < length; i++) {
      var child = arrayRootChildren[i];
      var res = helper.seekWidgetByTag(child, tag);
      if (res !== null) return res;
    }
    return null;
  },

  /**
   * Finds a widget whose name equals to param name from root widget.
   * @param {Widget} root
   * @param {String} name
   * @returns {Widget}
   */
  seekWidgetByName: function (root, name) {
    if (!root) return null;
    if (root.name === name) return root;
    var arrayRootChildren = root.children;
    var length = arrayRootChildren.length;
    for (var i = 0; i < length; i++) {
      var child = arrayRootChildren[i];
      var res = helper.seekWidgetByName(child, name);
      if (res !== null) return res;
    }
    return null;
  },

  /**
   * Finds a widget whose name equals to param name from root widget.
   * RelativeLayout will call this method to find the widget which is needed.
   * @param {Widget} root
   * @param {String} name
   * @returns {Widget}
   */
  seekWidgetByRelativeName: function (root, name) {
    if (!root) return null;
    var arrayRootChildren = root.children;
    var length = arrayRootChildren.length;
    for (var i = 0; i < length; i++) {
      var child = arrayRootChildren[i];
      var layoutParameter = child.getLayoutParameter(LayoutParameter.RELATIVE);
      if (layoutParameter && layoutParameter.getRelativeName() === name)
        return child;
    }
    return null;
  },

  /**
   * Finds a widget whose action tag equals to param name from root widget.
   * @param {Widget} root
   * @param {Number} tag
   * @returns {Widget}
   */
  seekActionWidgetByActionTag: function (root, tag) {
    if (!root) return null;
    if (root.actionTag === tag) return root;
    var arrayRootChildren = root.children;
    for (var i = 0; i < arrayRootChildren.length; i++) {
      var child = arrayRootChildren[i];
      var res = helper.seekActionWidgetByActionTag(child, tag);
      if (res !== null) return res;
    }
    return null;
  },

  _activeLayout: true,

  /**
   * Refresh object and it's children layout state
   * @param {Node} rootNode
   */
  doLayout: function (rootNode) {
    if (!this._activeLayout) return;
    var children = rootNode.children,
      node;
    for (var i = 0, len = children.length; i < len; i++) {
      node = children[i];
      var com = node.getComponent(LayoutComponent.NAME);
      var parent = node.parent;
      if (null != com && null !== parent && com.refreshLayout)
        com.refreshLayout();
    }
  },

  changeLayoutSystemActiveState: function (active) {
    this._activeLayout = active;
  },

  /**
   * Restrict capInsetSize, when the capInsets' width is larger than the textureSize, it will restrict to 0,
   * the height goes the same way as width.
   * @param {Rect} capInsets
   * @param {Size} textureSize
   */
  restrictCapInsetRect: function (capInsets, textureSize) {
    var x = capInsets.x,
      y = capInsets.y;
    var width = capInsets.width,
      height = capInsets.height;

    if (textureSize.width < width) {
      x = 0.0;
      width = 0.0;
    }
    if (textureSize.height < height) {
      y = 0.0;
      height = 0.0;
    }
    return new Rect(x, y, width, height);
  },

  _createSpriteFromBase64: function (base64String, key) {
    var texture2D = ServiceLocator.textureCache.getTextureForKey(key);

    if (!texture2D) {
      var image = new Image();
      image.src = base64String;
      ServiceLocator.textureCache.cacheImage(key, image);
      texture2D = ServiceLocator.textureCache.getTextureForKey(key);
    }

    var sprite = new Sprite(texture2D);

    return sprite;
  }
};
