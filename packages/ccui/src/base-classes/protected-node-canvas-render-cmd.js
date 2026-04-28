import { NodeCanvasRenderCmd, Node, Color } from '@aspect/core';

export class ProtectedNodeCanvasRenderCmd extends NodeCanvasRenderCmd {
    constructor(renderable) {
        super(renderable);
        this._cachedParent = null;
        this._cacheDirty = false;
    }

    _updateDisplayColor(parentColor) {
        var node = this._node;
        var locDispColor = this._displayedColor, locRealColor = node._realColor;
        var i, len, selChildren, item;
        if (this._cascadeColorEnabledDirty && !node._cascadeColorEnabled) {
            locDispColor.r = locRealColor.r;
            locDispColor.g = locRealColor.g;
            locDispColor.b = locRealColor.b;
            var whiteColor = new Color(255, 255, 255, 255);
            selChildren = node._children;
            for (i = 0, len = selChildren.length; i < len; i++) {
                item = selChildren[i];
                if (item && item._renderCmd)
                    item._renderCmd._updateDisplayColor(whiteColor);
            }
            this._cascadeColorEnabledDirty = false;
        } else {
            if (parentColor === undefined) {
                var locParent = node._parent;
                if (locParent && locParent._cascadeColorEnabled)
                    parentColor = locParent.getDisplayedColor();
                else
                    parentColor = Color.WHITE;
            }
            locDispColor.r = 0 | (locRealColor.r * parentColor.r / 255.0);
            locDispColor.g = 0 | (locRealColor.g * parentColor.g / 255.0);
            locDispColor.b = 0 | (locRealColor.b * parentColor.b / 255.0);
            if (node._cascadeColorEnabled) {
                selChildren = node._children;
                for (i = 0, len = selChildren.length; i < len; i++) {
                    item = selChildren[i];
                    if (item && item._renderCmd) {
                        item._renderCmd._updateDisplayColor(locDispColor);
                        item._renderCmd._updateColor();
                    }
                }
            }
            selChildren = node._protectedChildren;
            for (i = 0, len = selChildren.length; i < len; i++) {
                item = selChildren[i];
                if (item && item._renderCmd) {
                    item._renderCmd._updateDisplayColor(locDispColor);
                    item._renderCmd._updateColor();
                }
            }
        }
        this._dirtyFlag = this._dirtyFlag & Node._dirtyFlags.colorDirty ^ this._dirtyFlag;
    }

    _updateDisplayOpacity(parentOpacity) {
        var node = this._node;
        var i, len, selChildren, item;
        if (this._cascadeOpacityEnabledDirty && !node._cascadeOpacityEnabled) {
            this._displayedOpacity = node._realOpacity;
            selChildren = node._children;
            for (i = 0, len = selChildren.length; i < len; i++) {
                item = selChildren[i];
                if (item && item._renderCmd)
                    item._renderCmd._updateDisplayOpacity(255);
            }
            this._cascadeOpacityEnabledDirty = false;
        } else {
            if (parentOpacity === undefined) {
                var locParent = node._parent;
                parentOpacity = 255;
                if (locParent && locParent._cascadeOpacityEnabled)
                    parentOpacity = locParent.getDisplayedOpacity();
            }
            this._displayedOpacity = node._realOpacity * parentOpacity / 255.0;
            if (node._cascadeOpacityEnabled) {
                selChildren = node._children;
                for (i = 0, len = selChildren.length; i < len; i++) {
                    item = selChildren[i];
                    if (item && item._renderCmd) {
                        item._renderCmd._updateDisplayOpacity(this._displayedOpacity);
                        item._renderCmd._updateColor();
                    }
                }
            }
            selChildren = node._protectedChildren;
            for (i = 0, len = selChildren.length; i < len; i++) {
                item = selChildren[i];
                if (item && item._renderCmd) {
                    item._renderCmd._updateDisplayOpacity(this._displayedOpacity);
                    item._renderCmd._updateColor();
                }
            }
        }
        this._dirtyFlag = this._dirtyFlag & Node._dirtyFlags.opacityDirty ^ this._dirtyFlag;
    }

    _changeProtectedChild(child) {
        var cmd = child._renderCmd,
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
                locChildren[i]._renderCmd.transform(this, recursive);
            }
        }
    }
}
