import { Node, Color } from '@aspect/core';

export class ProtectedNodeCanvasRenderCmd extends Node.CanvasRenderCmd {
    constructor(renderable) {
        super(renderable);
        this._cachedParent = null;
        this._cacheDirty = false;
    }

    _updateDisplayColor(parentColor) {
        var node = this._node;
        var locDispColor = this._displayedColor, locRealColor = node.color;
        var i, len, selChildren, item;
        if (this._cascadeColorEnabledDirty && !node.cascadeColor) {
            locDispColor.r = locRealColor.r;
            locDispColor.g = locRealColor.g;
            locDispColor.b = locRealColor.b;
            var whiteColor = new Color(255, 255, 255, 255);
            selChildren = node.children;
            for (i = 0, len = selChildren.length; i < len; i++) {
                item = selChildren[i];
                if (item && item.renderCmd)
                    item.renderCmd._updateDisplayColor(whiteColor);
            }
            this._cascadeColorEnabledDirty = false;
        } else {
            if (parentColor === undefined) {
                var locParent = node.parent;
                if (locParent && locParent.cascadeColor)
                    parentColor = locParent.displayedColor;
                else
                    parentColor = Color.WHITE;
            }
            locDispColor.r = 0 | (locRealColor.r * parentColor.r / 255.0);
            locDispColor.g = 0 | (locRealColor.g * parentColor.g / 255.0);
            locDispColor.b = 0 | (locRealColor.b * parentColor.b / 255.0);
            if (node.cascadeColor) {
                selChildren = node.children;
                for (i = 0, len = selChildren.length; i < len; i++) {
                    item = selChildren[i];
                    if (item && item.renderCmd) {
                        item.renderCmd._updateDisplayColor(locDispColor);
                        item.renderCmd._updateColor();
                    }
                }
            }
            selChildren = node._protectedChildren;
            for (i = 0, len = selChildren.length; i < len; i++) {
                item = selChildren[i];
                if (item && item.renderCmd) {
                    item.renderCmd._updateDisplayColor(locDispColor);
                    item.renderCmd._updateColor();
                }
            }
        }
        this._dirtyFlag = this._dirtyFlag & Node._dirtyFlags.colorDirty ^ this._dirtyFlag;
    }

    _updateDisplayOpacity(parentOpacity) {
        var node = this._node;
        var i, len, selChildren, item;
        if (this._cascadeOpacityEnabledDirty && !node.cascadeOpacity) {
            this._displayedOpacity = node.opacity;
            selChildren = node.children;
            for (i = 0, len = selChildren.length; i < len; i++) {
                item = selChildren[i];
                if (item && item.renderCmd)
                    item.renderCmd._updateDisplayOpacity(255);
            }
            this._cascadeOpacityEnabledDirty = false;
        } else {
            if (parentOpacity === undefined) {
                var locParent = node.parent;
                parentOpacity = 255;
                if (locParent && locParent.cascadeOpacity)
                    parentOpacity = locParent.displayedOpacity;
            }
            this._displayedOpacity = node.opacity * parentOpacity / 255.0;
            if (node.cascadeOpacity) {
                selChildren = node.children;
                for (i = 0, len = selChildren.length; i < len; i++) {
                    item = selChildren[i];
                    if (item && item.renderCmd) {
                        item.renderCmd._updateDisplayOpacity(this._displayedOpacity);
                        item.renderCmd._updateColor();
                    }
                }
            }
            selChildren = node._protectedChildren;
            for (i = 0, len = selChildren.length; i < len; i++) {
                item = selChildren[i];
                if (item && item.renderCmd) {
                    item.renderCmd._updateDisplayOpacity(this._displayedOpacity);
                    item.renderCmd._updateColor();
                }
            }
        }
        this._dirtyFlag = this._dirtyFlag & Node._dirtyFlags.opacityDirty ^ this._dirtyFlag;
    }

    _changeProtectedChild(child) {
        var cmd = child.renderCmd,
            dirty = cmd._dirtyFlag,
            flags = Node._dirtyFlags;

        if (this._dirtyFlag & flags.colorDirty)
            dirty |= flags.colorDirty;

        if (this._dirtyFlag & flags.opacityDirty)
            dirty |= flags.opacityDirty;

        var colorDirty = dirty & flags.colorDirty,
            opacityDirty = dirty & flags.opacityDirty;

        if (colorDirty)
            cmd._updateDisplayColor(this._displayedColor);
        if (opacityDirty)
            cmd._updateDisplayOpacity(this._displayedOpacity);
        if (colorDirty || opacityDirty)
            cmd._updateColor();
    }

    transform(parentCmd, recursive) {
        var node = this._node;

        if (node._changePosition)
            node._changePosition();

        this.originTransform(parentCmd, recursive);

        var i, len, locChildren = node._protectedChildren;
        if (recursive && locChildren && locChildren.length !== 0) {
            for (i = 0, len = locChildren.length; i < len; i++) {
                locChildren[i].renderCmd.transform(this, recursive);
            }
        }
    }
}
