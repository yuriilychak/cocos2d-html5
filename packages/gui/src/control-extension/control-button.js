import { Size, Point, Color, Rect } from "@aspect/core";
import { Scale9Sprite } from "@aspect/ccui";
import { LabelBMFont } from "@aspect/labels";
import { ScaleTo } from "@aspect/actions";
import { Control } from "./control";
import {
    CONTROL_STATE_NORMAL,
    CONTROL_STATE_HIGHLIGHTED,
    CONTROL_ZOOM_ACTION_TAG,
    CONTROL_EVENT_TOUCH_DOWN,
    CONTROL_EVENT_TOUCH_DRAG_INSIDE,
    CONTROL_EVENT_TOUCH_DRAG_OUTSIDE,
    CONTROL_EVENT_TOUCH_DRAG_ENTER,
    CONTROL_EVENT_TOUCH_DRAG_EXIT,
    CONTROL_EVENT_TOUCH_UP_INSIDE,
    CONTROL_EVENT_TOUCH_UP_OUTSIDE,
    CONTROL_EVENT_TOUCH_CANCEL
} from "./constants";

export class ControlButton extends Control {
    _doesAdjustBackgroundImage = false;
    zoomOnTouchDown = false;
    _preferredSize = null;
    _labelAnchorPoint = null;
    _currentTitle = null;
    _currentTitleColor = null;
    _titleLabel = null;
    _backgroundSprite = null;
    _opacity = 0;
    _isPushed = false;
    _titleDispatchTable = null;
    _titleColorDispatchTable = null;
    _titleLabelDispatchTable = null;
    _backgroundSpriteDispatchTable = null;
    _parentInited = false;
    _marginV = 0;
    _marginH = 0;
    _className = "ControlButton";

    get adjustBackground() { return this.getAdjustBackgroundImage(); }
    set adjustBackground(v) { this.setAdjustBackgroundImage(v); }
    get preferredSize() { return this.getPreferredSize(); }
    set preferredSize(v) { this.setPreferredSize(v); }
    get labelAnchor() { return this.getLabelAnchorPoint(); }
    set labelAnchor(v) { this.setLabelAnchorPoint(v); }

    constructor(label, backgroundSprite, fontSize) {
        super();
        this._preferredSize = new Size(0, 0);
        this._labelAnchorPoint = new Point(0, 0);
        this._currentTitle = "";
        this._currentTitleColor = Color.WHITE;
        this._titleDispatchTable = {};
        this._titleColorDispatchTable = {};
        this._titleLabelDispatchTable = {};
        this._backgroundSpriteDispatchTable = {};

        if (fontSize != null)
            this.initWithTitleAndFontNameAndFontSize(label, backgroundSprite, fontSize);
        else if (backgroundSprite != null)
            this.initWithLabelAndBackgroundSprite(label, backgroundSprite);
        else if (label != null)
            this.initWithBackgroundSprite(label);
    }

    needsLayout() {
        if (!this._parentInited)
            return;

        if (this._titleLabel)
            this._titleLabel.visible = false;
        if (this._backgroundSprite)
            this._backgroundSprite.visible = false;

        this.setLabelAnchorPoint(this._labelAnchorPoint);

        var locState = this._state;
        this._currentTitle = this.getTitleForState(locState);
        this._currentTitleColor = this.getTitleColorForState(locState);
        this._titleLabel = this.getTitleLabelForState(locState);

        var label = this._titleLabel;
        if (label && Object.getOwnPropertyDescriptor(label, "string"))
            label.string = this._currentTitle;
        if (label)
            label.color = this._currentTitleColor;

        var locContentSize = this.getContentSize();
        if (label)
            label.setPosition(locContentSize.width / 2, locContentSize.height / 2);

        this._backgroundSprite = this.getBackgroundSpriteForState(locState);
        var locBackgroundSprite = this._backgroundSprite;
        if (locBackgroundSprite)
            locBackgroundSprite.setPosition(locContentSize.width / 2, locContentSize.height / 2);

        var titleLabelSize = new Size(0, 0);
        if (label) {
            var boundingBox = label.boundingBox;
            titleLabelSize.width = boundingBox.width;
            titleLabelSize.height = boundingBox.height;
        }

        if (this._doesAdjustBackgroundImage) {
            if (locBackgroundSprite)
                locBackgroundSprite.setContentSize(titleLabelSize.width + this._marginH * 2, titleLabelSize.height + this._marginV * 2);
        } else {
            if (locBackgroundSprite) {
                var preferredSize = locBackgroundSprite.getPreferredSize();
                preferredSize = new Size(preferredSize.width, preferredSize.height);
                if (preferredSize.width <= 0)
                    preferredSize.width = titleLabelSize.width;
                if (preferredSize.height <= 0)
                    preferredSize.height = titleLabelSize.height;
                locBackgroundSprite.setContentSize(preferredSize);
            }
        }

        var rectTitle = label ? label.boundingBox : new Rect();
        var rectBackground = locBackgroundSprite
          ? locBackgroundSprite.boundingBox
          : new Rect();
        var maxRect = Rect.union(rectTitle, rectBackground);
        this.setContentSize(maxRect.width, maxRect.height);
        locContentSize = this.getContentSize();
        if (label) {
            label.setPosition(locContentSize.width / 2, locContentSize.height / 2);
            label.visible = true;
        }
        if (locBackgroundSprite) {
            locBackgroundSprite.setPosition(locContentSize.width / 2, locContentSize.height / 2);
            locBackgroundSprite.visible = true;
        }
    }

    initWithLabelAndBackgroundSprite(label, backgroundSprite) {
        if (!label)
            throw new Error("ControlButton.initWithLabelAndBackgroundSprite(): label should be non-null");
        if (!backgroundSprite)
            throw new Error("ControlButton.initWithLabelAndBackgroundSprite(): backgroundSprite should be non-null");
        if (super.init(true)) {
            this._parentInited = true;
            this._titleDispatchTable = {};
            this._titleColorDispatchTable = {};
            this._titleLabelDispatchTable = {};
            this._backgroundSpriteDispatchTable = {};
            this._isPushed = false;
            this.zoomOnTouchDown = true;
            this._currentTitle = null;
            this.setAdjustBackgroundImage(true);
            this.setPreferredSize(new Size(0, 0));
            this.zoomOnTouchDown = true;
            this.ignoreAnchorPointForPosition(false);
            this.setAnchorPoint(0.5, 0.5);
            this._titleLabel = label;
            this._backgroundSprite = backgroundSprite;
            this.opacity = 255;
            this.isOpacityModifyRGB = true;
            var tempString = label.string;
            this.setTitleForState(tempString, CONTROL_STATE_NORMAL);
            this.setTitleColorForState(label.color, CONTROL_STATE_NORMAL);
            this.setTitleLabelForState(label, CONTROL_STATE_NORMAL);
            this.setBackgroundSpriteForState(backgroundSprite, CONTROL_STATE_NORMAL);
            this._state = CONTROL_STATE_NORMAL;
            this._marginH = 24;
            this._marginV = 12;
            this._labelAnchorPoint = new Point(0.5, 0.5);
            this.setPreferredSize(new Size(0, 0));
            this.needsLayout();
            return true;
        }
        return false;
    }

    doesAdjustBackgroundImage() {
        return this._doesAdjustBackgroundImage;
    }

    setAdjustBackgroundImage(adjustBackgroundImage) {
        this._doesAdjustBackgroundImage = adjustBackgroundImage;
        this.needsLayout();
    }

    getZoomOnTouchDown() {
        return this.zoomOnTouchDown;
    }

    setZoomOnTouchDown(zoomOnTouchDown) {
        return this.zoomOnTouchDown = zoomOnTouchDown;
    }

    getPreferredSize() {
        return this._preferredSize;
    }

    setPreferredSize(size) {
        if (size.width === 0 && size.height === 0) {
            this._doesAdjustBackgroundImage = true;
        } else {
            this._doesAdjustBackgroundImage = false;
            var locTable = this._backgroundSpriteDispatchTable;
            for (var itemKey in locTable)
                locTable[itemKey].setPreferredSize(size);
        }
        this._preferredSize = size;
        this.needsLayout();
    }

    getLabelAnchorPoint() {
        return this._labelAnchorPoint;
    }

    setLabelAnchorPoint(labelAnchorPoint) {
        this._labelAnchorPoint = labelAnchorPoint;
        if (this._titleLabel)
            this._titleLabel.setAnchorPoint(labelAnchorPoint);
    }

    _getCurrentTitle() {
        return this._currentTitle;
    }

    _getCurrentTitleColor() {
        return this._currentTitleColor;
    }

    get opacity() {
        return this._opacity;
    }

    set opacity(opacity) {
        super.opacity = opacity;
        var locTable = this._backgroundSpriteDispatchTable;
        for (var itemKey in locTable)
            locTable[itemKey].opacity = opacity;
    }

    set color(color) {
        super.color = color;
        var locTable = this._backgroundSpriteDispatchTable;
        for (var key in locTable)
            locTable[key].color = color;
    }

    get color() {
        var locRealColor = this._realColor;
        return new Color(locRealColor.r, locRealColor.g, locRealColor.b, locRealColor.a);
    }

    get isPushed() {
        return this._isPushed;
    }

    _getVerticalMargin() {
        return this._marginV;
    }

    _getHorizontalOrigin() {
        return this._marginH;
    }

    setMargins(marginH, marginV) {
        this._marginV = marginV;
        this._marginH = marginH;
        this.needsLayout();
    }

    set enabled(value) {
        super.enabled = value;
        this.needsLayout();
    }

    get enabled() {
        return super.enabled;
    }

    set selected(value) {
        super.setSelected(value);
        this.needsLayout();
    }

    get selected() {
        return super.selected;
    }

    set highlighted(enabled) {
        this.setHighlighted(enabled);
    }

    get highlighted() {
        return super.highlighted;
    }

    setHighlighted(enabled) {
        this._state = enabled ? CONTROL_STATE_HIGHLIGHTED : CONTROL_STATE_NORMAL;
        this._highlighted = enabled;
        this.needsLayout();
        var action = this.getActionByTag(CONTROL_ZOOM_ACTION_TAG);
        if (action)
            this.stopAction(action);
        if (this.zoomOnTouchDown) {
            var scaleValue = (this.isHighlighted() && this.enabled && !this.isSelected()) ? 1.1 : 1.0;
            var zoomAction = new ScaleTo(0.05, scaleValue);
            zoomAction.tag = CONTROL_ZOOM_ACTION_TAG;;
            this.runAction(zoomAction);
        }
    }

    onTouchBegan(touch, event) {
        if (!this.isTouchInside(touch) || !this.enabled || !this.visible || !this.hasVisibleParents())
            return false;
        this._isPushed = true;
        this.setHighlighted(true);
        this.sendActionsForControlEvents(CONTROL_EVENT_TOUCH_DOWN);
        return true;
    }

    onTouchMoved(touch, event) {
        if (!this._enabled || !this._isPushed || this._selected) {
            if (this._highlighted)
                this.setHighlighted(false);
            return;
        }
        var isTouchMoveInside = this.isTouchInside(touch);
        if (isTouchMoveInside && !this._highlighted) {
            this.setHighlighted(true);
            this.sendActionsForControlEvents(CONTROL_EVENT_TOUCH_DRAG_ENTER);
        } else if (isTouchMoveInside && this._highlighted) {
            this.sendActionsForControlEvents(CONTROL_EVENT_TOUCH_DRAG_INSIDE);
        } else if (!isTouchMoveInside && this._highlighted) {
            this.setHighlighted(false);
            this.sendActionsForControlEvents(CONTROL_EVENT_TOUCH_DRAG_EXIT);
        } else if (!isTouchMoveInside && !this._highlighted) {
            this.sendActionsForControlEvents(CONTROL_EVENT_TOUCH_DRAG_OUTSIDE);
        }
    }

    onTouchEnded(touch, event) {
        this._isPushed = false;
        this.setHighlighted(false);
        if (this.isTouchInside(touch)) {
            this.sendActionsForControlEvents(CONTROL_EVENT_TOUCH_UP_INSIDE);
        } else {
            this.sendActionsForControlEvents(CONTROL_EVENT_TOUCH_UP_OUTSIDE);
        }
    }

    onTouchCancelled(touch, event) {
        this._isPushed = false;
        this.setHighlighted(false);
        this.sendActionsForControlEvents(CONTROL_EVENT_TOUCH_CANCEL);
    }

    getTitleForState(state) {
        var locTable = this._titleDispatchTable;
        if (locTable) {
            if (locTable[state])
                return locTable[state];
            return locTable[CONTROL_STATE_NORMAL];
        }
        return "";
    }

    setTitleForState(title, state) {
        this._titleDispatchTable[state] = title || "";
        if (this.state === state)
            this.needsLayout();
    }

    getTitleColorForState(state) {
        var colorObject = this._titleColorDispatchTable[state];
        if (colorObject)
            return colorObject;
        colorObject = this._titleColorDispatchTable[CONTROL_STATE_NORMAL];
        if (colorObject)
            return colorObject;
        return Color.WHITE;
    }

    setTitleColorForState(color, state) {
        this._titleColorDispatchTable[state] = color;
        if (this.state === state)
            this.needsLayout();
    }

    getTitleLabelForState(state) {
        var locTable = this._titleLabelDispatchTable;
        if (locTable[state])
            return locTable[state];
        return locTable[CONTROL_STATE_NORMAL];
    }

    setTitleLabelForState(titleLabel, state) {
        var locTable = this._titleLabelDispatchTable;
        if (locTable[state]) {
            var previousLabel = locTable[state];
            if (previousLabel)
                this.removeChild(previousLabel, true);
        }
        locTable[state] = titleLabel;
        titleLabel.visible = false;
        titleLabel.setAnchorPoint(0.5, 0.5);
        this.addChild(titleLabel, 1);
        if (this.state === state)
            this.needsLayout();
    }

    setTitleBMFontForState(fntFile, state) {
        var title = this.getTitleForState(state);
        if (!title)
            title = "";
        this.setTitleLabelForState(new LabelBMFont(title, fntFile), state);
    }

    getTitleBMFontForState(state) {
        var labelBMFont = this.getTitleLabelForState(state);
        if ((labelBMFont != null) && (labelBMFont instanceof LabelBMFont)) {
            return labelBMFont.getFntFile();
        }
        return "";
    }

    getBackgroundSpriteForState(state) {
        var locTable = this._backgroundSpriteDispatchTable;
        if (locTable[state])
            return locTable[state];
        return locTable[CONTROL_STATE_NORMAL];
    }

    setBackgroundSpriteForState(sprite, state) {
        var locTable = this._backgroundSpriteDispatchTable;
        if (locTable[state]) {
            var previousSprite = locTable[state];
            if (previousSprite)
                this.removeChild(previousSprite, true);
        }
        locTable[state] = sprite;
        sprite.visible = false;
        sprite.setAnchorPoint(0.5, 0.5);
        this.addChild(sprite);
        var locPreferredSize = this._preferredSize;
        if (locPreferredSize.width !== 0 || locPreferredSize.height !== 0) {
            sprite.setPreferredSize(locPreferredSize);
        }
        if (this._state === state)
            this.needsLayout();
    }

    setBackgroundSpriteFrameForState(spriteFrame, state) {
        var sprite = Scale9Sprite.createWithSpriteFrame(spriteFrame);
        this.setBackgroundSpriteForState(sprite, state);
    }
}
