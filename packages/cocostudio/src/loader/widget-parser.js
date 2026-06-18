import { Color, log } from "@aspect/core";
import { Layout, Text, Button, CheckBox, ImageView, ScrollView, ListView, PageView, LoadingBar, Slider, TextField, TextAtlas, TextBMFont } from "@aspect/ccui";
import { _ccsLoad } from "./load/utils.js";

var CLASSNAME_MAP = {
    "Panel": function () { return new Layout(); },
    "Label": function () { return new Text(); },
    "Button": function () { return new Button(); },
    "CheckBox": function () { return new CheckBox(); },
    "ImageView": function () { return new ImageView(); },
    "ScrollView": function () { return new ScrollView(); },
    "ListView": function () { return new ListView(); },
    "PageView": function () { return new PageView(); },
    "LoadingBar": function () { return new LoadingBar(); },
    "Slider": function () { return new Slider(); },
    "TextField": function () { return new TextField(); },
    "TextAtlas": function () { return new TextAtlas(); },
    "TextBMFont": function () { return new TextBMFont(); }
};

function applyCommonAttributes(widget, opts) {
    if (opts.name != null) widget.name = opts.name;
    if (opts.tag != null) widget.tag = opts.tag;
    if (opts.width != null && opts.height != null)
        widget.setContentSize(opts.width, opts.height);
    if (opts.x != null && opts.y != null)
        widget.setPosition(opts.x, opts.y);
    if (opts.anchorPointX != null && opts.anchorPointY != null)
        widget.setAnchorPoint(opts.anchorPointX, opts.anchorPointY);
    if (opts.opacity != null) widget.opacity = opts.opacity;
    if (opts.visible != null) widget.visible = opts.visible;
    if (opts.rotation != null) widget.rotation = opts.rotation;
    if (opts.scaleX != null) widget.scaleX = opts.scaleX;
    if (opts.scaleY != null) widget.scaleY = opts.scaleY;
    if (opts.colorR != null && opts.colorG != null && opts.colorB != null)
        widget.color = new Color(opts.colorR, opts.colorG, opts.colorB);
    if (opts.touchAble != null) widget.setTouchEnabled(opts.touchAble);
    if (opts.flipX != null) widget.setFlippedX(opts.flipX);
    if (opts.flipY != null) widget.setFlippedY(opts.flipY);
}

function initPanel(widget, opts, resourcePath) {
    var colorType = opts.colorType || 0;
    widget.setBackGroundColorType(colorType);
    if (opts.clipAble != null) widget.setClippingEnabled(opts.clipAble);
    if (opts.bgColorOpacity != null) widget.setBackGroundColorOpacity(opts.bgColorOpacity);
    if (opts.bgColorR != null)
        widget.setBackGroundColor(
            new Color(opts.bgColorR || 0, opts.bgColorG || 0, opts.bgColorB || 0),
            new Color(opts.bgEndColorR != null ? opts.bgEndColorR : 255,
                      opts.bgEndColorG != null ? opts.bgEndColorG : 255,
                      opts.bgEndColorB != null ? opts.bgEndColorB : 255)
        );
    if (opts.backGroundImageData && opts.backGroundImageData.path) {
        widget.setBackGroundImage(resourcePath + opts.backGroundImageData.path);
        if (opts.backGroundScale9Enable != null)
            widget.setBackGroundImageScale9Enabled(opts.backGroundScale9Enable);
    }
}

function initLabel(widget, opts) {
    if (opts.text != null) widget.string = opts.text;
    if (opts.fontSize != null) widget.setFontSize(opts.fontSize);
    if (opts.fontName != null) widget.setFontName(opts.fontName);
}

function initButton(widget, opts, resourcePath) {
    if (opts.normalData && opts.normalData.path)
        widget.loadTextureNormal(resourcePath + opts.normalData.path);
    if (opts.pressedData && opts.pressedData.path)
        widget.loadTexturePressed(resourcePath + opts.pressedData.path);
    if (opts.disabledData && opts.disabledData.path)
        widget.loadTextureDisabled(resourcePath + opts.disabledData.path);
    if (opts.scale9Enable) {
        widget.setScale9Enabled(true);
        if (opts.scale9Width != null && opts.scale9Height != null)
            widget.setContentSize(opts.scale9Width, opts.scale9Height);
    }
}

function initCheckBox(widget, opts, resourcePath) {
    if (opts.backGroundBoxData && opts.backGroundBoxData.path)
        widget.loadTextureBackGround(resourcePath + opts.backGroundBoxData.path);
    if (opts.backGroundBoxSelectedData && opts.backGroundBoxSelectedData.path)
        widget.loadTextureBackGroundSelected(resourcePath + opts.backGroundBoxSelectedData.path);
    if (opts.frontCrossData && opts.frontCrossData.path)
        widget.loadTextureFrontCross(resourcePath + opts.frontCrossData.path);
    if (opts.isSelected != null) widget.setSelectedState(opts.isSelected);
}

function initImageView(widget, opts, resourcePath) {
    if (opts.fileNameData && opts.fileNameData.path)
        widget.loadTexture(resourcePath + opts.fileNameData.path);
    if (opts.scale9Enable) {
        widget.setScale9Enabled(true);
        widget.setContentSize(opts.width, opts.height);
    }
}

function initSlider(widget, opts, resourcePath) {
    if (opts.barFileNameData && opts.barFileNameData.path)
        widget.loadBarTexture(resourcePath + opts.barFileNameData.path);
    if (opts.ballNormalData && opts.ballNormalData.path)
        widget.loadSlidBallTextureNormal(resourcePath + opts.ballNormalData.path);
    if (opts.percent != null) widget.setPercent(opts.percent);
}

function initLoadingBar(widget, opts, resourcePath) {
    if (opts.textureData && opts.textureData.path)
        widget.loadTexture(resourcePath + opts.textureData.path);
    if (opts.percent != null) widget.setPercent(opts.percent);
    if (opts.direction != null) widget.setDirection(opts.direction);
}

function initTextField(widget, opts) {
    if (opts.placeHolder != null) widget.setPlaceHolder(opts.placeHolder);
    if (opts.text != null) widget.string = opts.text;
    if (opts.fontSize != null) widget.setFontSize(opts.fontSize);
    if (opts.maxLengthEnabled != null && opts.maxLength != null)
        widget.setMaxLength(opts.maxLength);
    if (opts.passwordEnabled != null) widget.setPasswordEnabled(opts.passwordEnabled);
}

function parseNode(nodeJson, resourcePath) {
    var opts = nodeJson.options || {};
    var classname = opts.classname || nodeJson.classname;
    var factory = CLASSNAME_MAP[classname];
    if (!factory) {
        log("Can't find widget factory for classname: %s", classname);
        return null;
    }

    var widget = factory();
    applyCommonAttributes(widget, opts);

    switch (classname) {
        case "Panel": initPanel(widget, opts, resourcePath); break;
        case "Label": initLabel(widget, opts); break;
        case "Button": initButton(widget, opts, resourcePath); break;
        case "CheckBox": initCheckBox(widget, opts, resourcePath); break;
        case "ImageView": initImageView(widget, opts, resourcePath); break;
        case "Slider": initSlider(widget, opts, resourcePath); break;
        case "LoadingBar": initLoadingBar(widget, opts, resourcePath); break;
        case "TextField": initTextField(widget, opts); break;
    }

    var children = nodeJson.children || [];
    for (var i = 0; i < children.length; i++) {
        var child = parseNode(children[i], resourcePath);
        if (child) {
            var zOrder = (children[i].options || {}).ZOrder || 0;
            widget.addChild(child, zOrder);
        }
    }

    return widget;
}

var _dirnameReg = /\S*\//;

function dirname(path) {
    var arr = path.match(_dirnameReg);
    return (arr && arr[0]) ? arr[0] : "";
}

var nodeParser = {
    parse: function (file, json, resourcePath) {
        resourcePath = resourcePath || dirname(file);
        var widgetTree = json["widgetTree"];
        if (!widgetTree) return null;
        return parseNode(widgetTree, resourcePath);
    }
};

_ccsLoad.registerParser("node", "*", nodeParser);
