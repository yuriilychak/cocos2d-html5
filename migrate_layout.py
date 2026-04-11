import re

with open('extensions/ccui/layouts/UILayout.js', 'r') as f:
    content = f.read()

# Step 1: Replace class declaration (remove @lends comment)
content = content.replace(
    'ccui.Layout = ccui.Widget.extend(/** @lends ccui.Layout# */{',
    'ccui.Layout = class Layout extends ccui.Widget {'
)

# Step 2: Remove property declarations block (lines 38-71 area)
# These are all the property: value, lines at the top of the class body
# We need to remove them and add them to constructor
# Pattern: each line like "    _propName: value," between class opening and ctor

# Extract the property declarations
prop_block_pattern = r'(ccui\.Layout = class Layout extends ccui\.Widget \{\n)(    _clippingEnabled.*?_isInterceptTouch: false,\n\n)'
prop_match = re.search(prop_block_pattern, content, re.DOTALL)
if prop_match:
    prop_block = prop_match.group(2)
    # Remove the property block
    content = content[:prop_match.start(2)] + content[prop_match.end(2):]

# Step 3: Convert ctor to constructor and reorganize
# Old pattern:
#     ctor: function () {
#         this._layoutType = ...;
#         this._widgetType = ...;
#         this._clippingType = ...;
#         this._colorType = ...;
#
#         ccui.Widget.prototype.ctor.call(this);
#
#         ...rest...
#     },

# The properties from the object literal that need to go into constructor:
prop_inits = """        this._clippingEnabled = false;
        this._backGroundScale9Enabled = null;
        this._backGroundImage = null;
        this._backGroundImageFileName = null;
        this._bgImageTexType = ccui.Widget.LOCAL_TEXTURE;
        this._colorRender = null;
        this._gradientRender = null;
        this._opacity = 255;
        this._doLayoutDirty = true;
        this._clippingRectDirty = true;
        this._clippingStencil = null;
        this._scissorRectDirty = false;
        this._clippingParent = null;
        this._className = "Layout";
        this._finalPositionX = 0;
        this._finalPositionY = 0;
        this._backGroundImageOpacity = 0;
        this._loopFocus = false;
        this.__passFocusToChild = true;
        this._isFocusPassing = false;
        this._isInterceptTouch = false;"""

# Replace ctor with constructor
old_ctor = """    ctor: function () {
        this._layoutType = ccui.Layout.ABSOLUTE;
        this._widgetType = ccui.Widget.TYPE_CONTAINER;
        this._clippingType = ccui.Layout.CLIPPING_SCISSOR;
        this._colorType = ccui.Layout.BG_COLOR_NONE;

        ccui.Widget.prototype.ctor.call(this);

        this.ignoreContentAdaptWithSize(false);
        this.setContentSize(cc.size(0, 0));
        this.setAnchorPoint(0, 0);
        this.onPassFocusToChild = this._findNearestChildWidgetIndex.bind(this);

        this._backGroundImageCapInsets = cc.rect(0, 0, 0, 0);

        this._color = cc.color(255, 255, 255, 255);
        this._startColor = cc.color(255, 255, 255, 255);
        this._endColor = cc.color(255, 255, 255, 255);
        this._alongVector = cc.p(0, -1);
        this._backGroundImageTextureSize = cc.size(0, 0);

        this._clippingRect = cc.rect(0, 0, 0, 0);
        this._backGroundImageColor = cc.color(255, 255, 255, 255);
    },"""

new_ctor = """    constructor() {
        super();

        this._layoutType = ccui.Layout.ABSOLUTE;
        this._widgetType = ccui.Widget.TYPE_CONTAINER;
        this._clippingType = ccui.Layout.CLIPPING_SCISSOR;
        this._colorType = ccui.Layout.BG_COLOR_NONE;

""" + prop_inits + """

        this.ignoreContentAdaptWithSize(false);
        this.setContentSize(cc.size(0, 0));
        this.setAnchorPoint(0, 0);
        this.onPassFocusToChild = this._findNearestChildWidgetIndex.bind(this);

        this._backGroundImageCapInsets = cc.rect(0, 0, 0, 0);

        this._color = cc.color(255, 255, 255, 255);
        this._startColor = cc.color(255, 255, 255, 255);
        this._endColor = cc.color(255, 255, 255, 255);
        this._alongVector = cc.p(0, -1);
        this._backGroundImageTextureSize = cc.size(0, 0);

        this._clippingRect = cc.rect(0, 0, 0, 0);
        this._backGroundImageColor = cc.color(255, 255, 255, 255);
    }"""

content = content.replace(old_ctor, new_ctor)

# Step 4: Convert all method: function(...) {...}, patterns to method(...) {...}
# Pattern: "    methodName: function (args) {"  →  "    methodName(args) {"
content = re.sub(
    r'(\s+)(\w+): function\s*\(',
    r'\1\2(',
    content
)

# Step 5: Remove trailing commas after method closing braces
# Pattern: "    }," at end of method → "    }"
# We need to be careful to only remove commas that are between methods in the class body
# Methods end with "    }," and the next line is either a blank line or a JSDoc comment or another method
content = re.sub(
    r'^(    \}),\s*$',
    r'\1',
    content,
    flags=re.MULTILINE
)

# Step 6: Convert all ccui.Widget.prototype.XXX.call(this, ...) → super.XXX(...)
# For ctor it's already handled
content = re.sub(
    r'ccui\.Widget\.prototype\.(\w+)\.call\(this\)',
    r'super.\1()',
    content
)
content = re.sub(
    r'ccui\.Widget\.prototype\.(\w+)\.call\(this,\s*',
    r'super.\1(',
    content
)

# Step 7: Remove onPassFocusToChild: null, property declaration
# This block:
#     /**
#      * To specify a user-defined functor...
#      */
#     onPassFocusToChild: null,
# Keep the JSDoc but replace the property line
content = content.replace(
    """    /**
     * To specify a user-defined functor to decide which child widget of the layout should get focused
     * @function
     * @param {Number} direction
     * @param {ccui.Widget} current
     */
    onPassFocusToChild = null,""",
    """    /**
     * To specify a user-defined functor to decide which child widget of the layout should get focused
     * @function
     * @param {Number} direction
     * @param {ccui.Widget} current
     */"""
)

# Actually, the method conversion may have changed "onPassFocusToChild: null," to something weird
# Let me check and handle both cases. After step 4, "onPassFocusToChild: function" would have been converted but
# "onPassFocusToChild: null" is NOT a function, so it would not match the regex.
# So it remains "onPassFocusToChild: null,"
# Let me handle it:
content = content.replace('    onPassFocusToChild: null,\n', '')

# Step 8: Replace closing });  with };
content = content.replace('\n});\n\nvar _p = ccui.Layout.prototype;', '\n};\n\nvar _p = ccui.Layout.prototype;')

with open('extensions/ccui/layouts/UILayout.js', 'w') as f:
    f.write(content)

print("Migration complete!")
