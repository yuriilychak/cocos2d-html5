// Base classes
import { ProtectedNode } from './base-classes/protected-node';
import { ProtectedNodeCanvasRenderCmd } from './base-classes/protected-node-canvas-render-cmd';
import { ProtectedNodeWebGLRenderCmd } from './base-classes/protected-node-webgl-render-cmd';
import { Scale9Sprite } from './base-classes/scale9-sprite';
import { Scale9SpriteCanvasRenderCmd } from './base-classes/scale9-sprite-canvas-render-cmd';
import { Scale9SpriteWebGLRenderCmd } from './base-classes/scale9-sprite-webgl-render-cmd';
import { FocusNavigationController, LAYOUT_COMPONENT_NAME, Widget } from './base-classes/widget';
import { WidgetCanvasRenderCmd, WidgetWebGLRenderCmd } from './base-classes/widget-render-cmd';

// System
import { helper } from './system/helper';

// Layouts
import { Margin, MarginZero, LayoutParameter, LinearLayoutParameter, RelativeLayoutParameter } from './layouts/layout-parameter';
import { Layout } from './layouts/layout';
import { LayoutCanvasRenderCmd } from './layouts/layout-canvas-render-cmd';
import { LayoutWebGLRenderCmd } from './layouts/layout-webgl-render-cmd';
import {
    getLayoutManager,
    linearVerticalLayoutManager,
    linearHorizontalLayoutManager,
    relativeLayoutManager
} from './layouts/layout-manager';
import {
    LayoutComponent,
    LayoutComponent_ReferencePoint,
    LayoutComponent_PositionType,
    LayoutComponent_SizeType
} from './layouts/layout-component';
import { HBox } from './layouts/hbox';
import { VBox } from './layouts/vbox';
import { RelativeBox } from './layouts/relative-box';

// Widgets
import { Button } from './uiwidgets/button';
import { CheckBox } from './uiwidgets/check-box';
import { ImageView } from './uiwidgets/image-view';
import { LoadingBar } from './uiwidgets/loading-bar';
import { Slider } from './uiwidgets/slider';
import { Text } from './uiwidgets/text';
import { TextAtlas } from './uiwidgets/text-atlas';
import { TextBMFont } from './uiwidgets/text-bm-font';
import { TextField } from './uiwidgets/text-field';
import { VideoPlayer } from './uiwidgets/video-player';
import { WebView } from './uiwidgets/web-view';
import {
    RichElement,
    RichElementText,
    RichElementImage,
    RichElementCustomNode,
    RichText
} from './uiwidgets/rich-text';

// Scroll widgets
import { ScrollViewBar } from './uiwidgets/scroll-widget/scroll-view-bar';
import { ScrollView } from './uiwidgets/scroll-widget/scroll-view';
import { ScrollViewCanvasRenderCmd } from './uiwidgets/scroll-widget/scroll-view-canvas-render-cmd';
import { ScrollViewWebGLRenderCmd } from './uiwidgets/scroll-widget/scroll-view-webgl-render-cmd';
import { ListView } from './uiwidgets/scroll-widget/list-view';
import { PageViewIndicator } from './uiwidgets/scroll-widget/page-view-indicator';
import { PageView } from './uiwidgets/scroll-widget/page-view';

// Wire render commands to node classes
ProtectedNode.CanvasRenderCmd = ProtectedNodeCanvasRenderCmd;
ProtectedNode.WebGLRenderCmd = ProtectedNodeWebGLRenderCmd;

Scale9Sprite.CanvasRenderCmd = Scale9SpriteCanvasRenderCmd;
Scale9Sprite.WebGLRenderCmd = Scale9SpriteWebGLRenderCmd;

// Break circular dependency: widget.js cannot directly import Layout/ImageView
Widget.LayoutClass = Layout;
Widget.ImageViewClass = ImageView;

// Break circular dependency: layout-component.js cannot directly import Widget/PageView
LayoutComponent.WidgetClass = Widget;
LayoutComponent.PageViewClass = PageView;

// cc globals (backward compatibility)
cc.ProtectedNode = ProtectedNode;
cc.Scale9Sprite = Scale9Sprite;
cc.Layout = Layout;
cc.LayoutParameter = LayoutParameter;
cc.LinearLayoutParameter = LinearLayoutParameter;
cc.RelativeLayoutParameter = RelativeLayoutParameter;
cc.Margin = Margin;

// ccui namespace
if (!cc.ccui) cc.ccui = {};
const ccui = cc.ccui;

ccui.ProtectedNode = ProtectedNode;
ccui.Scale9Sprite = Scale9Sprite;
ccui.Widget = Widget;
ccui.FocusNavigationController = FocusNavigationController;
ccui.LAYOUT_COMPONENT_NAME = LAYOUT_COMPONENT_NAME;

ccui.Margin = Margin;
ccui.MarginZero = MarginZero;
ccui.LayoutParameter = LayoutParameter;
ccui.LinearLayoutParameter = LinearLayoutParameter;
ccui.RelativeLayoutParameter = RelativeLayoutParameter;

ccui.Layout = Layout;
ccui.LayoutComponent = LayoutComponent;
ccui.getLayoutManager = getLayoutManager;
ccui.linearVerticalLayoutManager = linearVerticalLayoutManager;
ccui.linearHorizontalLayoutManager = linearHorizontalLayoutManager;
ccui.relativeLayoutManager = relativeLayoutManager;

ccui.HBox = HBox;
ccui.VBox = VBox;
ccui.RelativeBox = RelativeBox;

ccui.helper = helper;

ccui.Button = Button;
ccui.CheckBox = CheckBox;
ccui.ImageView = ImageView;
ccui.LoadingBar = LoadingBar;
ccui.Slider = Slider;
ccui.Text = Text;
ccui.TextAtlas = TextAtlas;
ccui.TextBMFont = TextBMFont;
ccui.TextField = TextField;
ccui.VideoPlayer = VideoPlayer;
ccui.WebView = WebView;
ccui.RichElement = RichElement;
ccui.RichElementText = RichElementText;
ccui.RichElementImage = RichElementImage;
ccui.RichElementCustomNode = RichElementCustomNode;
ccui.RichText = RichText;

ccui.ScrollViewBar = ScrollViewBar;
ccui.ScrollView = ScrollView;
ccui.ListView = ListView;
ccui.PageView = PageView;
ccui.PageViewIndicator = PageViewIndicator;

// ES module exports
export {
    ProtectedNode,
    ProtectedNodeCanvasRenderCmd,
    ProtectedNodeWebGLRenderCmd,
    Scale9Sprite,
    Scale9SpriteCanvasRenderCmd,
    Scale9SpriteWebGLRenderCmd,
    FocusNavigationController,
    LAYOUT_COMPONENT_NAME,
    Widget,
    WidgetCanvasRenderCmd,
    WidgetWebGLRenderCmd,
    helper,
    Margin,
    MarginZero,
    LayoutParameter,
    LinearLayoutParameter,
    RelativeLayoutParameter,
    Layout,
    LayoutCanvasRenderCmd,
    LayoutWebGLRenderCmd,
    getLayoutManager,
    linearVerticalLayoutManager,
    linearHorizontalLayoutManager,
    relativeLayoutManager,
    LayoutComponent,
    LayoutComponent_ReferencePoint,
    LayoutComponent_PositionType,
    LayoutComponent_SizeType,
    HBox,
    VBox,
    RelativeBox,
    Button,
    CheckBox,
    ImageView,
    LoadingBar,
    Slider,
    Text,
    TextAtlas,
    TextBMFont,
    TextField,
    VideoPlayer,
    WebView,
    RichElement,
    RichElementText,
    RichElementImage,
    RichElementCustomNode,
    RichText,
    ScrollViewBar,
    ScrollView,
    ScrollViewCanvasRenderCmd,
    ScrollViewWebGLRenderCmd,
    ListView,
    PageView,
    PageViewIndicator,
};
