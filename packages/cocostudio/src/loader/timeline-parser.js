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
  BlendFunc,
  Color,
  Node,
  Path,
  Point,
  Rect,
  Size,
  Sprite,
  log,
  ServiceLocator
} from "@aspect/core";
import { ParticleSystem } from "@aspect/particle";
import { TMXTiledMap } from "@aspect/tilemap";
import {
  Layout,
  LayoutComponent,
  Button,
  CheckBox,
  ImageView,
  ListView,
  LoadingBar,
  PageView,
  ScrollView,
  Slider,
  Text,
  TextAtlas,
  TextBMFont,
  TextField,
  Widget
} from "@aspect/ccui";

import { Armature } from "../armature/armature.js";
import { armatureDataManager } from "../armature/utils/armature-data-manager.js";
import { ComAudio } from "../components/com-audio.js";
import { ComExtensionData } from "../timeline/action-timeline/com-extension-data.js";
import { BoneNode } from "../timeline/bone-node.js";
import { SkeletonNode } from "../timeline/skeleton-node.js";
import { _parser } from "./load/parser.js";
import { _ccsLoad, load } from "./load/utils.js";
var DEBUG = false;

var Parser = class Parser extends _parser {
  parse(file, json, path) {
    var resourcePath;
    if (path !== undefined) resourcePath = path;
    else resourcePath = this._dirname(file);
    this.pretreatment(json, resourcePath, file);
    var node = this.parseNode(this.getNodeJson(json), resourcePath);
    this.deferred(json, resourcePath, node, file);
    return node;
  }

  getNodeJson(json) {
    if (!json["Content"]) return null;
    var content = json["Content"];
    if (content["ObjectData"]) return content["ObjectData"];

    return content["Content"] ? content["Content"]["ObjectData"] : null;
  }

  getClass(json) {
    return json["ctype"];
  }
};
var parser = new Parser();

var getParam = function (value, dValue) {
  if (value === undefined) return dValue;
  else return value;
};

//////////
// NODE //
//////////

parser.generalAttributes = function (node, json) {
  if (json["Name"] != null) node.name = json["Name"];

  var position = json["Position"];
  if (position != null && (position["X"] != null || position["Y"] != null))
    node.setPosition(new Point(position["X"] || 0, position["Y"] || 0));

  var scale = json["Scale"];
  if (scale != null) {
    if (scale["ScaleX"] != null) node.scaleX = scale["ScaleX"];
    if (scale["ScaleY"] != null) node.scaleY = scale["ScaleY"];
  }

  var rotationSkewX = json["RotationSkewX"];
  if (rotationSkewX != null) node.setRotationX(rotationSkewX);

  var rotationSkewY = json["RotationSkewY"];
  if (json["RotationSkewY"] != null) node.setRotationY(rotationSkewY);

  var anchor = json["AnchorPoint"];
  if (anchor != null) {
    if (anchor["ScaleX"] == null) anchor["ScaleX"] = 0;
    if (anchor["ScaleY"] == null) anchor["ScaleY"] = 0;
    if (anchor["ScaleX"] != 0.5 || anchor["ScaleY"] != 0.5)
      node.setAnchorPoint(new Point(anchor["ScaleX"], anchor["ScaleY"]));
  }

  if (json["ZOrder"] != null) node.setLocalZOrder(json["ZOrder"]);

  var visible = getParam(json["VisibleForFrame"], true);
  node.setVisible(visible);

  var size = json["Size"];
  if (size) setContentSize(node, size);

  if (json["Alpha"] != null) node.opacity = json["Alpha"];

  node.tag = json["Tag"] || 0;

  var actionTag = json["ActionTag"] || 0;
  var extensionData = new ComExtensionData();
  var customProperty = json["UserData"];
  if (customProperty !== undefined)
    extensionData.setCustomProperty(customProperty);
  extensionData.setActionTag(actionTag);
  if (node.getComponent("ComExtensionData"))
    node.removeComponent("ComExtensionData");
  node.addComponent(extensionData);

  node.setCascadeColorEnabled(true);
  node.setCascadeOpacityEnabled(true);

  setLayoutComponent(node, json);
};

parser.parseChild = function (node, children, resourcePath) {
  if (!node || !children) return;
  for (var i = 0; i < children.length; i++) {
    var child = this.parseNode(children[i], resourcePath);
    if (child) {
      if (node instanceof PageView) {
        if (child instanceof Layout) node.addPage(child);
      } else {
        if (node instanceof ListView) {
          if (child instanceof Widget) node.pushBackCustomItem(child);
        } else {
          if (!(node instanceof Layout) && child instanceof Widget) {
            if (child.getPositionType() === Widget.POSITION_PERCENT) {
              var position = child.getPositionPercent();
              var anchor = node.getAnchorPoint();
              child.setPositionPercent(
                new Point(position.x + anchor.x, position.y + anchor.y)
              );
            }
          }
          node.addChild(child);
        }
      }
    }
  }
};

/**
 * SingleNode
 * @param json
 * @returns {Node}
 */
parser.initSingleNode = function (json) {
  var node = new Node();

  this.generalAttributes(node, json);
  var color = json["CColor"];
  if (color != null) node.color = getColor(color);

  return node;
};

/**
 * Sprite
 * @param json
 * @param resourcePath
 * @returns {Sprite}
 */
parser.initSprite = function (json, resourcePath) {
  var node = new Sprite();

  loadTexture(json["FileData"], resourcePath, function (path, type) {
    if (type === 0) node.setTexture(path);
    else if (type === 1) {
      var spriteFrame = ServiceLocator.spriteFrameCache.getSpriteFrame(path);
      if (spriteFrame) node.setSpriteFrame(spriteFrame);
    }
  });

  var blendData = json["BlendFunc"];
  if (json["BlendFunc"]) {
    var blendFunc = BlendFunc.ALPHA_PREMULTIPLIED;
    if (blendData["Src"] !== undefined) blendFunc.src = blendData["Src"];
    if (blendData["Dst"] !== undefined) blendFunc.dst = blendData["Dst"];
    node.setBlendFunc(blendFunc);
  }

  if (json["FlipX"]) node.setFlippedX(true);
  if (json["FlipY"]) node.setFlippedY(true);

  this.generalAttributes(node, json);
  var color = json["CColor"];
  if (color != null) node.color = getColor(color);

  return node;
};

/**
 * Particle
 * @param json
 * @param resourcePath
 * @returns {*}
 */
parser.initParticle = function (json, resourcePath) {
  var node,
    self = this;
  loadTexture(json["FileData"], resourcePath, function (path, type) {
    if (!ServiceLocator.loader.getRes(path))
      log("%s need to be preloaded", path);
    node = new ParticleSystem(path);
    self.generalAttributes(node, json);
    node.setPositionType(ParticleSystem.TYPE_GROUPED);
    !ServiceLocator.sys.isNative &&
      node.setDrawMode(ParticleSystem.TEXTURE_MODE);

    var blendData = json["BlendFunc"];
    if (json["BlendFunc"]) {
      var blendFunc = BlendFunc.ALPHA_PREMULTIPLIED;
      if (blendData["Src"] !== undefined) blendFunc.src = blendData["Src"];
      if (blendData["Dst"] !== undefined) blendFunc.dst = blendData["Dst"];
      node.setBlendFunc(blendFunc);
    }
  });
  return node;
};

////////////
// WIDGET //
////////////

parser.widgetAttributes = function (widget, json, enableContent) {
  widget.setCascadeColorEnabled(true);
  widget.setCascadeOpacityEnabled(true);

  widget.setUnifySizeEnabled(false);
  //widget.setLayoutComponentEnabled(true);
  widget.ignoreContentAdaptWithSize(false);
  !enableContent && setContentSize(widget, json["Size"]);

  var name = json["Name"];
  if (name) widget.name = name;

  var actionTag = json["ActionTag"] || 0;
  widget.setActionTag(actionTag);
  var extensionData = new ComExtensionData();
  var customProperty = json["UserData"];
  if (customProperty !== undefined)
    extensionData.setCustomProperty(customProperty);
  extensionData.setActionTag(actionTag);
  if (widget.getComponent("ComExtensionData"))
    widget.removeComponent("ComExtensionData");
  widget.addComponent(extensionData);

  var rotationSkewX = json["RotationSkewX"];
  if (rotationSkewX) widget.setRotationX(rotationSkewX);

  var rotationSkewY = json["RotationSkewY"];
  if (rotationSkewY) widget.setRotationY(rotationSkewY);

  //var rotation = json["Rotation"];

  var flipX = json["FlipX"];
  if (flipX) widget.setFlippedX(true);

  var flipY = json["FlipY"];
  if (flipY) widget.setFlippedY(true);

  var zOrder = json["zOrder"];
  if (zOrder != null) widget.setLocalZOrder(zOrder);

  //var visible = json["Visible"];

  var visible = getParam(json["VisibleForFrame"], true);
  widget.setVisible(visible);

  var alpha = json["Alpha"];
  if (alpha != null) widget.opacity = alpha;

  widget.tag = json["Tag"] || 0;

  var touchEnabled = json["TouchEnable"] || false;
  widget.setTouchEnabled(touchEnabled);

  // -- var frameEvent = json["FrameEvent"];

  var callBackType = json["CallBackType"];
  if (callBackType != null) widget.setCallbackType(callBackType);

  var callBackName = json["CallBackName"];
  if (callBackName) widget.setCallbackName(callBackName);

  var position = json["Position"];
  if (position != null)
    widget.setPosition(position["X"] || 0, position["Y"] || 0);

  var scale = json["Scale"];
  if (scale != null) {
    widget.scaleX = getParam(scale["ScaleX"], 1);
    widget.scaleY = getParam(scale["ScaleY"], 1);
  }

  var anchorPoint = json["AnchorPoint"];
  if (anchorPoint != null)
    widget.setAnchorPoint(
      anchorPoint["ScaleX"] || 0,
      anchorPoint["ScaleY"] || 0
    );

  var color = json["CColor"];
  if (color != null) widget.color = getColor(color);

  setLayoutComponent(widget, json);
  bindCallback(widget, json);
};

var bindCallback = function (widget, json) {
  var callBackType = json["CallBackType"];
  var callBackName = json["CallBackName"];
  var callBack = function (e) {
    if (typeof widget[callBackName] === "function") widget[callBackName](e);
  };
  if (callBackType === "Click") {
    widget.addClickEventListener(callBack);
  } else if (callBackType === "Touch") {
    widget.addTouchEventListener(callBack);
  } else if (callBackType === "Event") {
    widget.addCCSEventListener(callBack);
  }
};

var setLayoutComponent = function (widget, json) {
  var layoutComponent = LayoutComponent.bindLayoutComponent(widget);
  if (!layoutComponent) return;

  var positionXPercentEnabled =
    json["PositionPercentXEnable"] || json["PositionPercentXEnabled"] || false;
  var positionYPercentEnabled =
    json["PositionPercentYEnable"] || json["PositionPercentYEnabled"] || false;
  var positionXPercent = 0,
    positionYPercent = 0,
    PrePosition = json["PrePosition"];
  if (PrePosition != null) {
    positionXPercent = PrePosition["X"] || 0;
    positionYPercent = PrePosition["Y"] || 0;
  }
  var sizeXPercentEnable =
    json["PercentWidthEnable"] || json["PercentWidthEnabled"] || false;
  var sizeYPercentEnable =
    json["PercentHeightEnable"] || json["PercentHeightEnabled"] || false;
  var sizeXPercent = 0,
    sizeYPercent = 0,
    PreSize = json["PreSize"];
  if (PrePosition != null) {
    sizeXPercent = PreSize["X"] || 0;
    sizeYPercent = PreSize["Y"] || 0;
  }
  var stretchHorizontalEnabled = json["StretchWidthEnable"] || false;
  var stretchVerticalEnabled = json["StretchHeightEnable"] || false;
  var horizontalEdge = json["HorizontalEdge"]; // = LayoutComponent.horizontalEdge.LEFT;
  var verticalEdge = json["VerticalEdge"]; // = LayoutComponent.verticalEdge.TOP;
  var leftMargin = json["LeftMargin"] || 0;
  var rightMargin = json["RightMargin"] || 0;
  var topMargin = json["TopMargin"] || 0;
  var bottomMargin = json["BottomMargin"] || 0;

  layoutComponent.setPositionPercentXEnabled(positionXPercentEnabled);
  layoutComponent.setPositionPercentYEnabled(positionYPercentEnabled);
  layoutComponent.setPositionPercentX(positionXPercent);
  layoutComponent.setPositionPercentY(positionYPercent);
  layoutComponent.setPercentWidthEnabled(sizeXPercentEnable);
  layoutComponent.setPercentHeightEnabled(sizeYPercentEnable);
  layoutComponent.setPercentWidth(sizeXPercent);
  layoutComponent.setPercentHeight(sizeYPercent);
  layoutComponent.setPercentWidthEnabled(
    sizeXPercentEnable || sizeYPercentEnable
  );
  layoutComponent.setStretchWidthEnabled(stretchHorizontalEnabled);
  layoutComponent.setStretchHeightEnabled(stretchVerticalEnabled);

  var horizontalEdgeType = LayoutComponent.horizontalEdge.NONE;
  if (horizontalEdge === "LeftEdge") {
    horizontalEdgeType = LayoutComponent.horizontalEdge.LEFT;
  } else if (horizontalEdge === "RightEdge") {
    horizontalEdgeType = LayoutComponent.horizontalEdge.RIGHT;
  } else if (horizontalEdge === "BothEdge") {
    horizontalEdgeType = LayoutComponent.horizontalEdge.CENTER;
  }
  layoutComponent.setHorizontalEdge(horizontalEdgeType);

  var verticalEdgeType = LayoutComponent.verticalEdge.NONE;
  if (verticalEdge === "TopEdge") {
    verticalEdgeType = LayoutComponent.verticalEdge.TOP;
  } else if (verticalEdge === "BottomEdge") {
    verticalEdgeType = LayoutComponent.verticalEdge.BOTTOM;
  } else if (verticalEdge === "BothEdge") {
    verticalEdgeType = LayoutComponent.verticalEdge.CENTER;
  }
  layoutComponent.setVerticalEdge(verticalEdgeType);

  layoutComponent.setTopMargin(topMargin);
  layoutComponent.setBottomMargin(bottomMargin);
  layoutComponent.setLeftMargin(leftMargin);
  layoutComponent.setRightMargin(rightMargin);

  layoutComponent.setVerticalEdge(verticalEdgeType);

  layoutComponent.setTopMargin(topMargin);
  layoutComponent.setBottomMargin(bottomMargin);
  layoutComponent.setLeftMargin(leftMargin);
  layoutComponent.setRightMargin(rightMargin);
};

var setLayoutBackground = function (layout, single, first, end) {
  if (layout.getBackGroundColorType() === 2) {
    first = first || {};
    end = end || {};
    layout.setBackGroundColor(getColor(first), getColor(end));
  } else {
    single = single || {};
    layout.setBackGroundColor(getColor(single));
  }
};

var setLayoutBackgroundVector = function (widget, vector) {
  var x = vector["ScaleX"] || 0;
  var y = vector["ScaleY"] || 0;
  widget.setBackGroundColorVector(new Point(x, y));
};

/**
 * Layout
 * @param json
 * @param resourcePath
 * @returns {Layout}
 */
parser.initPanel = function (json, resourcePath) {
  var widget = new Layout();

  this.widgetAttributes(widget, json);

  var clipEnabled = json["ClipAble"] || false;
  if (clipEnabled != null) widget.setClippingEnabled(clipEnabled);

  var colorType = getParam(json["ComboBoxIndex"], 0);
  widget.setBackGroundColorType(colorType);

  var bgColorOpacity = getParam(json["BackColorAlpha"], 255);
  if (bgColorOpacity != null) widget.setBackGroundColorOpacity(bgColorOpacity);

  var backGroundScale9Enabled = json["Scale9Enable"];
  if (backGroundScale9Enabled != null)
    widget.setBackGroundImageScale9Enabled(backGroundScale9Enabled);

  var opacity = getParam(json["Alpha"], 255);
  widget.opacity = opacity;

  loadTexture(json["FileData"], resourcePath, function (path, type) {
    widget.setBackGroundImage(path, type);
  });

  if (backGroundScale9Enabled) {
    var scale9OriginX = json["Scale9OriginX"] || 0;
    var scale9OriginY = json["Scale9OriginY"] || 0;

    var scale9Width = json["Scale9Width"] || 0;
    var scale9Height = json["Scale9Height"] || 0;

    widget.setBackGroundImageCapInsets(
      new Rect(scale9OriginX, scale9OriginY, scale9Width, scale9Height)
    );

    setContentSize(widget, json["Size"]);
  } else {
    if (!widget.isIgnoreContentAdaptWithSize()) {
      setContentSize(widget, json["Size"]);
    }
  }

  setLayoutBackground(
    widget,
    json["SingleColor"],
    json["FirstColor"],
    json["EndColor"]
  );
  setLayoutBackgroundVector(widget, json["ColorVector"]);

  return widget;
};

/**
 * Text
 * @param json
 * @param resourcePath
 */
parser.initText = function (json, resourcePath) {
  var widget = new Text();

  var touchScaleEnabled = json["TouchScaleChangeAble"];
  if (touchScaleEnabled != null)
    widget.setTouchScaleChangeEnabled(touchScaleEnabled);

  var text = json["LabelText"];
  if (text != null) widget.string = text;

  var fontSize = json["FontSize"];
  if (fontSize != null) widget.setFontSize(fontSize);

  var fontName = json["FontName"];
  if (fontName != null) widget.setFontName(fontName);

  var areaWidth = json["AreaWidth"];
  var areaHeight = json["areaHeight"];
  if (areaWidth && areaHeight)
    widget.setTextAreaSize(new Size(areaWidth, areaHeight));

  var h_alignment = json["HorizontalAlignmentType"] || "HT_Left";
  switch (h_alignment) {
    case "HT_Right":
      h_alignment = 2;
      break;
    case "HT_Center":
      h_alignment = 1;
      break;
    case "HT_Left":
    default:
      h_alignment = 0;
  }
  widget.setTextHorizontalAlignment(h_alignment);

  var v_alignment = json["VerticalAlignmentType"] || "VT_Top";
  switch (v_alignment) {
    case "VT_Bottom":
      v_alignment = 2;
      break;
    case "VT_Center":
      v_alignment = 1;
      break;
    case "VT_Top":
    default:
      v_alignment = 0;
  }
  widget.setTextVerticalAlignment(v_alignment);

  var fontResource = json["FontResource"];
  if (fontResource != null) {
    var path = fontResource["Path"];
    //resoutceType = fontResource["Type"];
    if (path != null) {
      if (ServiceLocator.sys.isNative) {
        fontName = Path.join(ServiceLocator.loader.resPath, resourcePath, path);
      } else {
        fontName = path.match(/([^\/]+)\.(\S+)/);
        fontName = fontName ? fontName[1] : "";
      }
      widget.setFontName(fontName);
    }
  }

  if (json["OutlineEnabled"] && json["OutlineColor"] && widget.enableOutline)
    widget.enableOutline(
      getColor(json["OutlineColor"]),
      getParam(json["OutlineSize"], 1)
    );

  if (json["ShadowEnabled"] && json["ShadowColor"] && widget.enableShadow)
    widget.enableShadow(
      getColor(json["ShadowColor"]),
      new Size(
        getParam(json["ShadowOffsetX"], 2),
        getParam(json["ShadowOffsetY"], -2)
      ),
      json["ShadowBlurRadius"] || 0
    );

  var isCustomSize = json["IsCustomSize"];
  if (isCustomSize != null) widget.ignoreContentAdaptWithSize(!isCustomSize);

  widget.setUnifySizeEnabled(false);

  var color = json["CColor"];
  json["CColor"] = null;
  widget.setTextColor(getColor(color));
  this.widgetAttributes(widget, json, widget.isIgnoreContentAdaptWithSize());
  json["CColor"] = color;
  return widget;
};

/**
 * Button
 * @param json
 * @param resourcePath
 */
parser.initButton = function (json, resourcePath) {
  var widget = new Button();

  loadTexture(json["NormalFileData"], resourcePath, function (path, type) {
    widget.loadTextureNormal(path, type);
  });
  loadTexture(json["PressedFileData"], resourcePath, function (path, type) {
    widget.loadTexturePressed(path, type);
  });
  loadTexture(json["DisabledFileData"], resourcePath, function (path, type) {
    widget.loadTextureDisabled(path, type);
  });

  var scale9Enabled = getParam(json["Scale9Enable"], false);
  if (scale9Enabled) {
    widget.setScale9Enabled(scale9Enabled);
  }

  var text = json["ButtonText"];
  if (text != null) widget.setTitleText(text);

  var fontSize = json["FontSize"];
  if (fontSize != null) widget.setTitleFontSize(fontSize);

  var fontName = json["FontName"];
  if (fontName != null) widget.setTitleFontName(fontName);

  var textColor = json["TextColor"];
  if (textColor != null) widget.setTitleColor(getColor(textColor));

  var displaystate = getParam(json["DisplayState"], true);
  widget.setBright(displaystate);
  widget.setEnabled(displaystate);

  var fontResource = json["FontResource"];
  if (fontResource != null) {
    var path = fontResource["Path"];
    //resoutceType = fontResource["Type"];
    if (path != null) {
      if (ServiceLocator.sys.isNative) {
        fontName = Path.join(ServiceLocator.loader.resPath, resourcePath, path);
      } else {
        fontName = path.match(/([^\/]+)\.(\S+)/);
        fontName = fontName ? fontName[1] : "";
      }
      widget.setTitleFontName(fontName);
    }
  }

  var label = widget.getTitleRenderer();
  if (
    label &&
    json["ShadowEnabled"] &&
    json["ShadowColor"] &&
    label.enableShadow
  ) {
    label.enableShadow(
      getColor(json["ShadowColor"]),
      new Size(
        getParam(json["ShadowOffsetX"], 2),
        getParam(json["ShadowOffsetY"], -2)
      ),
      json["ShadowBlurRadius"] || 0
    );
  }
  if (
    label &&
    json["OutlineEnabled"] &&
    json["OutlineColor"] &&
    label.enableStroke
  )
    label.enableStroke(
      getColor(json["OutlineColor"]),
      getParam(json["OutlineSize"], 1)
    );

  this.widgetAttributes(widget, json);

  if (scale9Enabled) {
    widget.setUnifySizeEnabled(false);
    widget.ignoreContentAdaptWithSize(false);
    var capInsets = new Rect(
      json["Scale9OriginX"] || 0,
      json["Scale9OriginY"] || 0,
      json["Scale9Width"] || 0,
      json["Scale9Height"] || 0
    );
    widget.setCapInsets(capInsets);
  }

  setContentSize(widget, json["Size"]);

  return widget;
};

/**
 * CheckBox
 * @param json
 * @param resourcePath
 */
parser.initCheckBox = function (json, resourcePath) {
  var widget = new CheckBox();

  this.widgetAttributes(widget, json);

  var dataList = [
    { name: "NormalBackFileData", handle: widget.loadTextureBackGround },
    {
      name: "PressedBackFileData",
      handle: widget.loadTextureBackGroundSelected
    },
    { name: "NodeNormalFileData", handle: widget.loadTextureFrontCross },
    {
      name: "DisableBackFileData",
      handle: widget.loadTextureBackGroundDisabled
    },
    {
      name: "NodeDisableFileData",
      handle: widget.loadTextureFrontCrossDisabled
    }
  ];

  dataList.forEach(function (item) {
    loadTexture(json[item.name], resourcePath, function (path, type) {
      item.handle.call(widget, path, type);
    });
  });

  var selectedState = getParam(json["CheckedState"], false);
  widget.setSelected(selectedState);

  var displaystate = getParam(json["DisplayState"], true);
  widget.setBright(displaystate);
  widget.setEnabled(displaystate);

  return widget;
};

/**
 * ScrollView
 * @param json
 * @param resourcePath
 */
parser.initScrollView = function (json, resourcePath) {
  var widget = new ScrollView();

  this.widgetAttributes(widget, json);

  loadTexture(json["FileData"], resourcePath, function (path, type) {
    widget.setBackGroundImage(path, type);
  });

  var clipEnabled = json["ClipAble"] || false;
  widget.setClippingEnabled(clipEnabled);

  var colorType = getParam(json["ComboBoxIndex"], 0);
  widget.setBackGroundColorType(colorType);

  var bgColorOpacity = json["BackColorAlpha"];
  if (bgColorOpacity != null) widget.setBackGroundColorOpacity(bgColorOpacity);

  var backGroundScale9Enabled = json["Scale9Enable"];
  if (backGroundScale9Enabled) {
    widget.setBackGroundImageScale9Enabled(true);

    var scale9OriginX = json["Scale9OriginX"] || 0;
    var scale9OriginY = json["Scale9OriginY"] || 0;
    var scale9Width = json["Scale9Width"] || 0;
    var scale9Height = json["Scale9Height"] || 0;
    widget.setBackGroundImageCapInsets(
      new Rect(scale9OriginX, scale9OriginY, scale9Width, scale9Height)
    );
    setContentSize(widget, json["Size"]);
  } else if (!widget.isIgnoreContentAdaptWithSize()) {
    setContentSize(widget, json["Size"]);
  }

  setLayoutBackground(
    widget,
    json["SingleColor"],
    json["FirstColor"],
    json["EndColor"]
  );
  setLayoutBackgroundVector(widget, json["ColorVector"]);

  var innerNodeSize = json["InnerNodeSize"];
  var innerSize = new Size(
    innerNodeSize["Width"] || 0,
    innerNodeSize["Height"] || 0
  );
  widget.setInnerContainerSize(innerSize);

  var direction = 0;
  if (json["ScrollDirectionType"] === "Vertical") direction = 1;
  if (json["ScrollDirectionType"] === "Horizontal") direction = 2;
  if (json["ScrollDirectionType"] === "Vertical_Horizontal") direction = 3;
  widget.setDirection(direction);

  var bounceEnabled = getParam(json["IsBounceEnabled"], false);
  widget.setBounceEnabled(bounceEnabled);

  return widget;
};

/**
 * ImageView
 * @param json
 * @param resourcePath
 */
parser.initImageView = function (json, resourcePath) {
  var widget = new ImageView();

  loadTexture(json["FileData"], resourcePath, function (path, type) {
    widget.loadTexture(path, type);
  });
  loadTexture(json["ImageFileData"], resourcePath, function (path, type) {
    widget.loadTexture(path, type);
  });

  var scale9Enabled = json["Scale9Enable"];
  if (scale9Enabled) {
    widget.setScale9Enabled(true);
    widget.setUnifySizeEnabled(false);
    widget.ignoreContentAdaptWithSize(false);

    var scale9OriginX = json["Scale9OriginX"] || 0;
    var scale9OriginY = json["Scale9OriginY"] || 0;
    var scale9Width = json["Scale9Width"] || 0;
    var scale9Height = json["Scale9Height"] || 0;
    widget.setCapInsets(
      new Rect(scale9OriginX, scale9OriginY, scale9Width, scale9Height)
    );
  } else setContentSize(widget, json["Size"]);

  this.widgetAttributes(widget, json);

  return widget;
};

/**
 * LoadingBar
 * @param json
 * @param resourcePath
 * @returns {LoadingBar}
 */
parser.initLoadingBar = function (json, resourcePath) {
  var widget = new LoadingBar();

  this.widgetAttributes(widget, json);

  loadTexture(json["ImageFileData"], resourcePath, function (path, type) {
    widget.loadTexture(path, type);
  });

  var direction = json["ProgressType"] === "Right_To_Left" ? 1 : 0;
  widget.setDirection(direction);

  var percent = getParam(json["ProgressInfo"], 80);
  if (percent != null) widget.setPercent(percent);

  return widget;
};

/**
 * Slider
 * @param json
 * @param resourcePath
 */
parser.initSlider = function (json, resourcePath) {
  var widget = new Slider();
  var loader = ServiceLocator.loader;

  this.widgetAttributes(widget, json);

  var textureList = [
    { name: "BackGroundData", handle: widget.loadBarTexture },
    { name: "BallNormalData", handle: widget.loadSlidBallTextureNormal },
    { name: "BallPressedData", handle: widget.loadSlidBallTexturePressed },
    { name: "BallDisabledData", handle: widget.loadSlidBallTextureDisabled },
    { name: "ProgressBarData", handle: widget.loadProgressBarTexture }
  ];
  textureList.forEach(function (item) {
    loadTexture(json[item.name], resourcePath, function (path, type) {
      if (type === 0 && !loader.getRes(path))
        log("%s need to be preloaded", path);
      item.handle.call(widget, path, type);
    });
  });

  var percent = json["PercentInfo"] || 0;
  widget.setPercent(percent);

  var displaystate = getParam(json["DisplayState"], true);
  widget.setBright(displaystate);
  widget.setEnabled(displaystate);

  return widget;
};

/**
 * PageView
 * @param json
 * @param resourcePath
 */
parser.initPageView = function (json, resourcePath) {
  var widget = new PageView();

  this.widgetAttributes(widget, json);

  loadTexture(json["FileData"], resourcePath, function (path, type) {
    widget.setBackGroundImage(path, type);
  });

  var clipEnabled = json["ClipAble"] || false;
  widget.setClippingEnabled(clipEnabled);

  var backGroundScale9Enabled = json["Scale9Enable"];
  if (backGroundScale9Enabled) {
    widget.setBackGroundImageScale9Enabled(true);

    var scale9OriginX = json["Scale9OriginX"] || 0;
    var scale9OriginY = json["Scale9OriginY"] || 0;
    var scale9Width = json["Scale9Width"] || 0;
    var scale9Height = json["Scale9Height"] || 0;
    widget.setBackGroundImageCapInsets(
      new Rect(scale9OriginX, scale9OriginY, scale9Width, scale9Height)
    );
  }

  var colorType = getParam(json["ComboBoxIndex"], 0);
  widget.setBackGroundColorType(colorType);

  setLayoutBackground(
    widget,
    json["SingleColor"],
    json["FirstColor"],
    json["EndColor"]
  );
  setLayoutBackgroundVector(widget, json["ColorVector"]);

  var bgColorOpacity = json["BackColorAlpha"];
  if (bgColorOpacity != null) widget.setBackGroundColorOpacity(bgColorOpacity);

  setContentSize(widget, json["Size"]);

  return widget;
};

/**
 * ListView
 * @param json
 * @param resourcePath
 * @returns {ListView}
 */
parser.initListView = function (json, resourcePath) {
  var widget = new ListView();

  this.widgetAttributes(widget, json);

  loadTexture(json["FileData"], resourcePath, function (path, type) {
    widget.setBackGroundImage(path, type);
  });

  var clipEnabled = json["ClipAble"] || false;
  widget.setClippingEnabled(clipEnabled);

  var colorType = getParam(json["ComboBoxIndex"], 0);
  widget.setBackGroundColorType(colorType);

  var bgColorOpacity = getParam(json["BackColorAlpha"], 255);
  var backGroundScale9Enabled = json["Scale9Enable"];
  if (backGroundScale9Enabled) {
    widget.setBackGroundImageScale9Enabled(true);

    var scale9OriginX = json["Scale9OriginX"] || 0;
    var scale9OriginY = json["Scale9OriginY"] || 0;
    var scale9Width = json["Scale9Width"] || 0;
    var scale9Height = json["Scale9Height"] || 0;
    widget.setBackGroundImageCapInsets(
      new Rect(scale9OriginX, scale9OriginY, scale9Width, scale9Height)
    );
  }

  var directionType = getParam(json["DirectionType"], ListView.DIR_HORIZONTAL);
  var verticalType = getParam(json["VerticalType"], "Align_Left");
  var horizontalType = getParam(json["HorizontalType"], "Align_Top");
  if (!directionType) {
    widget.setDirection(ScrollView.DIR_HORIZONTAL);
    if (verticalType === "Align_Bottom")
      widget.setGravity(ListView.GRAVITY_BOTTOM);
    else if (verticalType === "Align_VerticalCenter")
      widget.setGravity(ListView.GRAVITY_CENTER_VERTICAL);
    else widget.setGravity(ListView.GRAVITY_TOP);
  } else if (directionType === "Vertical") {
    widget.setDirection(ScrollView.DIR_VERTICAL);
    if (horizontalType === "") widget.setGravity(ListView.GRAVITY_LEFT);
    else if (horizontalType === "Align_Right")
      widget.setGravity(ListView.GRAVITY_RIGHT);
    else if (horizontalType === "Align_HorizontalCenter")
      widget.setGravity(ListView.GRAVITY_CENTER_HORIZONTAL);
  }

  var bounceEnabled = getParam(json["IsBounceEnabled"], false);
  widget.setBounceEnabled(bounceEnabled);

  var itemMargin = json["ItemMargin"] || 0;
  widget.setItemsMargin(itemMargin);

  var innerSize = json["InnerNodeSize"];
  //Width
  if (innerSize != null)
    widget.setInnerContainerSize(
      new Size(innerSize["Widget"] || 0, innerSize["Height"] || 0)
    );

  setLayoutBackground(
    widget,
    json["SingleColor"],
    json["FirstColor"],
    json["EndColor"]
  );
  setLayoutBackgroundVector(widget, json["ColorVector"]);

  if (bgColorOpacity != null) widget.setBackGroundColorOpacity(bgColorOpacity);

  setContentSize(widget, json["Size"]);

  return widget;
};

/**
 * TextAtlas
 * @param json
 * @param resourcePath
 * @returns {TextAtlas}
 */
parser.initTextAtlas = function (json, resourcePath) {
  var widget = new TextAtlas();

  var stringValue = json["LabelText"];
  var itemWidth = json["CharWidth"];
  var itemHeight = json["CharHeight"];

  var startCharMap = json["StartChar"];

  loadTexture(
    json["LabelAtlasFileImage_CNB"],
    resourcePath,
    function (path, type) {
      if (!ServiceLocator.loader.getRes(path))
        log("%s need to be preloaded", path);
      if (type === 0) {
        widget.setProperty(
          stringValue,
          path,
          itemWidth,
          itemHeight,
          startCharMap
        );
      }
    }
  );
  this.widgetAttributes(widget, json);

  // the TextAtlas must be ignore ContentSize[Size] in the ccs file.
  widget.ignoreContentAdaptWithSize(true);

  return widget;
};

/**
 * TextBMFont
 * @param json
 * @param resourcePath
 * @returns {TextBMFont}
 */
parser.initTextBMFont = function (json, resourcePath) {
  var widget = new TextBMFont();
  this.widgetAttributes(widget, json);

  loadTexture(json["LabelBMFontFile_CNB"], resourcePath, function (path, type) {
    if (!ServiceLocator.loader.getRes(path))
      log("%s need to be pre loaded", path);
    widget.setFntFile(path);
  });

  var text = json["LabelText"];
  widget.string = text;

  widget.ignoreContentAdaptWithSize(true);
  return widget;
};

/**
 * TextField
 * @param json
 * @param resourcePath
 * @returns {TextField}
 */
parser.initTextField = function (json, resourcePath) {
  var widget = new TextField();

  var passwordEnabled = json["PasswordEnable"];
  if (passwordEnabled) {
    widget.setPasswordEnabled(true);
    var passwordStyleText = json["PasswordStyleText"] || "*";
    widget.setPasswordStyleText(passwordStyleText);
  }

  var placeHolder = json["PlaceHolderText"];
  if (placeHolder != null) widget.setPlaceHolder(placeHolder);

  var fontSize = json["FontSize"];
  if (fontSize != null) widget.setFontSize(fontSize);

  var fontName = json["FontName"];
  if (fontName != null) widget.setFontName(fontName);

  var maxLengthEnabled = json["MaxLengthEnable"];
  if (maxLengthEnabled) {
    widget.setMaxLengthEnabled(true);
    var maxLength = json["MaxLengthText"] || 0;
    widget.setMaxLength(maxLength);
  }

  //var isCustomSize = json["IsCustomSize"];
  this.widgetAttributes(widget, json);

  var text = json["LabelText"];
  if (text != null) widget.string = text;

  var fontResource = json["FontResource"];
  if (fontResource != null) {
    var path = fontResource["Path"];
    //resoutceType = fontResource["Type"];
    if (path != null) {
      if (ServiceLocator.sys.isNative) {
        fontName = Path.join(ServiceLocator.loader.resPath, resourcePath, path);
      } else {
        fontName = path.match(/([^\/]+)\.(\S+)/);
        fontName = fontName ? fontName[1] : "";
      }
      widget.setFontName(fontName);
    }
  }

  widget.setUnifySizeEnabled(false);
  widget.ignoreContentAdaptWithSize(false);

  var color = json["CColor"];
  if (color != null) widget.setTextColor(getColor(color));

  if (!widget.isIgnoreContentAdaptWithSize()) {
    setContentSize(widget, json["Size"]);
    if (ServiceLocator.sys.isNative)
      widget.getVirtualRenderer().setLineBreakWithoutSpace(true);
  }

  return widget;
};

/**
 * SimpleAudio
 * @param json
 * @param resourcePath
 */
parser.initSimpleAudio = function (json, resourcePath) {
  var node = new ComAudio();
  var loop = json["Loop"] || false;
  //var volume = json["Volume"] || 0;
  //audioEngine.setMusicVolume(volume);
  node.setLoop(loop);
  loadTexture(json["FileData"], resourcePath, function (path, type) {
    node.setFile(path);
  });
};

/**
 * GameMap
 * @param json
 * @param resourcePath
 * @returns {*}
 */
parser.initGameMap = function (json, resourcePath) {
  var node = null;

  loadTexture(json["FileData"], resourcePath, function (path, type) {
    if (type === 0) node = new TMXTiledMap(path);

    parser.generalAttributes(node, json);
  });

  return node;
};

/**
 * ProjectNode
 * @param json
 * @param resourcePath
 * @returns {*}
 */
parser.initProjectNode = function (json, resourcePath) {
  var projectFile = json["FileData"];
  if (projectFile != null && projectFile["Path"]) {
    var file = resourcePath + projectFile["Path"];
    if (ServiceLocator.loader.getRes(file)) {
      var obj = load(file, resourcePath);
      parser.generalAttributes(obj.node, json);
      if (obj.action && obj.node) {
        obj.action.tag = obj.node.tag;
        var InnerActionSpeed = json["InnerActionSpeed"];
        if (InnerActionSpeed !== undefined)
          obj.action.setTimeSpeed(InnerActionSpeed);
        obj.node.runAction(obj.action);
        obj.action.gotoFrameAndPause(0);
      }
      return obj.node;
    } else log("%s need to be preloaded", file);
  }
};

var getFileName = function (name) {
  if (!name) return "";
  var arr = name.match(/([^\/]+)\.[^\/]+$/);
  if (arr && arr[1]) return arr[1];
  else return "";
};

/**
 * Armature
 * @param json
 * @param resourcePath
 */
parser.initArmature = function (json, resourcePath) {
  var node = new Armature();

  var isLoop = json["IsLoop"];

  var isAutoPlay = json["IsAutoPlay"];

  var currentAnimationName = json["CurrentAnimationName"];

  loadTexture(json["FileData"], resourcePath, function (path, type) {
    var plists, pngs;
    var armJson = ServiceLocator.loader.getRes(path);
    if (!armJson) log("%s need to be preloaded", path);
    else {
      plists = armJson["config_file_path"];
      pngs = armJson["config_png_path"];
      plists.forEach(function (plist, index) {
        if (pngs[index])
          ServiceLocator.spriteFrameCache.addSpriteFrames(plist, pngs[index]);
      });
    }
    armatureDataManager.addArmatureFileInfo(path);
    node.init(getFileName(path));
    if (isAutoPlay) node.getAnimation().play(currentAnimationName, -1, isLoop);
    else {
      node.getAnimation().play(currentAnimationName);
      node.getAnimation().gotoAndPause(0);
    }
  });

  delete json["AnchorPoint"];
  delete json["Size"];
  parser.generalAttributes(node, json);

  node.color = getColor(json["CColor"]);
  return node;
};

parser.initBoneNode = function (json, resourcePath) {
  var node = new BoneNode();

  var length = json["Length"];
  if (length !== undefined) node.setDebugDrawLength(length);

  var blendFunc = json["BlendFunc"];
  if (
    blendFunc &&
    blendFunc["Src"] !== undefined &&
    blendFunc["Dst"] !== undefined
  )
    node.setBlendFunc(new BlendFunc(blendFunc["Src"], blendFunc["Dst"]));

  parser.generalAttributes(node, json);
  var color = json["CColor"];
  if (
    color &&
    (color["R"] !== undefined ||
      color["G"] !== undefined ||
      color["B"] !== undefined)
  )
    node.color = getColor(color);
  return node;
};

parser.initSkeletonNode = function (json) {
  var node = new SkeletonNode();
  parser.generalAttributes(node, json);
  var color = json["CColor"];
  if (
    color &&
    (color["R"] !== undefined ||
      color["G"] !== undefined ||
      color["B"] !== undefined)
  )
    node.color = getColor(color);
  return node;
};

var loadedPlist = {};
var loadTexture = function (json, resourcePath, cb) {
  if (json != null) {
    var path = json["Path"];
    var type;
    if (json["Type"] === "Default" || json["Type"] === "Normal") type = 0;
    else type = 1;
    var plist = json["Plist"];
    if (plist) {
      if (ServiceLocator.loader.getRes(resourcePath + plist)) {
        loadedPlist[resourcePath + plist] = true;
        ServiceLocator.spriteFrameCache.addSpriteFrames(resourcePath + plist);
      } else {
        if (
          !loadedPlist[resourcePath + plist] &&
          !ServiceLocator.spriteFrameCache.getSpriteFrame(path)
        )
          log("%s need to be preloaded", resourcePath + plist);
      }
    }
    if (type !== 0) {
      if (ServiceLocator.spriteFrameCache.getSpriteFrame(path)) cb(path, type);
      else log("failed to get spriteFrame: %s", path);
    } else cb(resourcePath + path, type);
  }
};

var getColor = function (json) {
  if (!json) return;
  var r = json["R"] != null ? json["R"] : 255;
  var g = json["G"] != null ? json["G"] : 255;
  var b = json["B"] != null ? json["B"] : 255;
  var a = json["A"] != null ? json["A"] : 255;
  return new Color(r, g, b, a);
};

var setContentSize = function (node, size) {
  var x = size["X"] || 0;
  var y = size["Y"] || 0;
  if (size) node.setContentSize(new Size(x, y));
};

var register = [
  { name: "SingleNodeObjectData", handle: parser.initSingleNode },
  { name: "NodeObjectData", handle: parser.initSingleNode },
  { name: "LayerObjectData", handle: parser.initSingleNode },
  { name: "GameNodeObjectData", handle: parser.initSingleNode },
  { name: "GameLayerObjectData", handle: parser.initSingleNode },
  { name: "SpriteObjectData", handle: parser.initSprite },
  { name: "ParticleObjectData", handle: parser.initParticle },
  { name: "PanelObjectData", handle: parser.initPanel },
  { name: "TextObjectData", handle: parser.initText },
  { name: "ButtonObjectData", handle: parser.initButton },
  { name: "CheckBoxObjectData", handle: parser.initCheckBox },
  { name: "ScrollViewObjectData", handle: parser.initScrollView },
  { name: "ImageViewObjectData", handle: parser.initImageView },
  { name: "LoadingBarObjectData", handle: parser.initLoadingBar },
  { name: "SliderObjectData", handle: parser.initSlider },
  { name: "PageViewObjectData", handle: parser.initPageView },
  { name: "ListViewObjectData", handle: parser.initListView },
  { name: "TextAtlasObjectData", handle: parser.initTextAtlas },
  { name: "TextBMFontObjectData", handle: parser.initTextBMFont },
  { name: "TextFieldObjectData", handle: parser.initTextField },
  { name: "SimpleAudioObjectData", handle: parser.initSimpleAudio },
  { name: "GameMapObjectData", handle: parser.initGameMap },
  { name: "ProjectNodeObjectData", handle: parser.initProjectNode },
  { name: "ArmatureNodeObjectData", handle: parser.initArmature },
  { name: "BoneNodeObjectData", handle: parser.initBoneNode },
  { name: "SkeletonNodeObjectData", handle: parser.initSkeletonNode }
];

register.forEach(function (item) {
  parser.registerParser(item.name, function (options, resourcePath) {
    var node = item.handle.call(this, options, resourcePath);
    this.parseChild(node, options["Children"], resourcePath);
    DEBUG && node && (node.__parserName = item.name);
    return node;
  });
});

_ccsLoad.registerParser("timeline", "*", parser);
