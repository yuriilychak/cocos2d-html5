// control-extension
import {
    CONTROL_EVENT_TOUCH_DOWN, CONTROL_EVENT_TOUCH_DRAG_INSIDE, CONTROL_EVENT_TOUCH_DRAG_OUTSIDE,
    CONTROL_EVENT_TOUCH_DRAG_ENTER, CONTROL_EVENT_TOUCH_DRAG_EXIT, CONTROL_EVENT_TOUCH_UP_INSIDE,
    CONTROL_EVENT_TOUCH_UP_OUTSIDE, CONTROL_EVENT_TOUCH_CANCEL, CONTROL_EVENT_VALUE_CHANGED,
    CONTROL_STATE_NORMAL, CONTROL_STATE_HIGHLIGHTED, CONTROL_STATE_DISABLED,
    CONTROL_STATE_SELECTED, CONTROL_STATE_INITIAL, CONTROL_ZOOM_ACTION_TAG,
    SLIDER_MARGIN_H, SLIDER_MARGIN_V,
    STEPPER_PARTMINUS, STEPPER_PARTPLUS, STEPPER_PARTNONE
} from "./control-extension/constants";
import { RGBA, HSV, ControlUtils } from "./control-extension/control-utils";
import { Invocation } from "./control-extension/invocation";
import { Control } from "./control-extension/control";
import { ControlButton } from "./control-extension/control-button";
import { ControlSaturationBrightnessPicker } from "./control-extension/control-saturation-brightness-picker";
import { ControlHuePicker } from "./control-extension/control-hue-picker";
import { ControlColourPicker } from "./control-extension/control-colour-picker";
import { ControlSlider } from "./control-extension/control-slider";
import { ControlStepper } from "./control-extension/control-stepper";
import { ControlPotentiometer } from "./control-extension/control-potentiometer";
import { ControlSwitch, ControlSwitchSprite } from "./control-extension/control-switch";
import { Spacer, MenuPassive } from "./control-extension/menu-passive";

// scrollview
import { SortableObject, SortedObject, ArrayForObjectSorting } from "./scrollview/sorting";
import {
    SCROLLVIEW_DIRECTION_NONE, SCROLLVIEW_DIRECTION_HORIZONTAL,
    SCROLLVIEW_DIRECTION_VERTICAL, SCROLLVIEW_DIRECTION_BOTH,
    convertDistanceFromPointToInch, ScrollViewDelegate, GScrollView
} from "./scrollview/scroll-view";
import { GuiScrollViewCanvasRenderCmd } from "./scrollview/scroll-view-canvas-render-cmd";
import { GuiScrollViewWebGLRenderCmd } from "./scrollview/scroll-view-webgl-render-cmd";
import {
    TABLEVIEW_FILL_TOPDOWN, TABLEVIEW_FILL_BOTTOMUP,
    TableViewCell, TableViewDelegate, TableViewDataSource, TableView
} from "./scrollview/table-view";

// Wire render commands
GScrollView.CanvasRenderCmd = GuiScrollViewCanvasRenderCmd;
GScrollView.WebGLRenderCmd = GuiScrollViewWebGLRenderCmd;

// cc globals (backward compat)
cc.CONTROL_EVENT_TOTAL_NUMBER = 9;
cc.Control = Control;
cc.Invocation = Invocation;
cc.RGBA = RGBA;
cc.HSV = HSV;
cc.ControlUtils = ControlUtils;
cc.ControlButton = ControlButton;
cc.ControlSaturationBrightnessPicker = ControlSaturationBrightnessPicker;
cc.ControlHuePicker = ControlHuePicker;
cc.ControlColourPicker = ControlColourPicker;
cc.ControlSlider = ControlSlider;
cc.ControlStepper = ControlStepper;
cc.ControlSwitch = ControlSwitch;
cc.ControlSwitchSprite = ControlSwitchSprite;
cc.ControlPotentiometer = ControlPotentiometer;
cc.Spacer = Spacer;
cc.MenuPassive = MenuPassive;
cc.SortableObject = SortableObject;
cc.SortedObject = SortedObject;
cc.ArrayForObjectSorting = ArrayForObjectSorting;
cc.SCROLLVIEW_DIRECTION_NONE = SCROLLVIEW_DIRECTION_NONE;
cc.SCROLLVIEW_DIRECTION_HORIZONTAL = SCROLLVIEW_DIRECTION_HORIZONTAL;
cc.SCROLLVIEW_DIRECTION_VERTICAL = SCROLLVIEW_DIRECTION_VERTICAL;
cc.SCROLLVIEW_DIRECTION_BOTH = SCROLLVIEW_DIRECTION_BOTH;
cc.convertDistanceFromPointToInch = convertDistanceFromPointToInch;
cc.ScrollViewDelegate = ScrollViewDelegate;
cc.ScrollView = GScrollView;
cc.TABLEVIEW_FILL_TOPDOWN = TABLEVIEW_FILL_TOPDOWN;
cc.TABLEVIEW_FILL_BOTTOMUP = TABLEVIEW_FILL_BOTTOMUP;
cc.TableViewCell = TableViewCell;
cc.TableViewDelegate = TableViewDelegate;
cc.TableViewDataSource = TableViewDataSource;
cc.TableView = TableView;

export {
    // control-extension constants
    CONTROL_EVENT_TOUCH_DOWN, CONTROL_EVENT_TOUCH_DRAG_INSIDE, CONTROL_EVENT_TOUCH_DRAG_OUTSIDE,
    CONTROL_EVENT_TOUCH_DRAG_ENTER, CONTROL_EVENT_TOUCH_DRAG_EXIT, CONTROL_EVENT_TOUCH_UP_INSIDE,
    CONTROL_EVENT_TOUCH_UP_OUTSIDE, CONTROL_EVENT_TOUCH_CANCEL, CONTROL_EVENT_VALUE_CHANGED,
    CONTROL_STATE_NORMAL, CONTROL_STATE_HIGHLIGHTED, CONTROL_STATE_DISABLED,
    CONTROL_STATE_SELECTED, CONTROL_STATE_INITIAL, CONTROL_ZOOM_ACTION_TAG,
    SLIDER_MARGIN_H, SLIDER_MARGIN_V,
    STEPPER_PARTMINUS, STEPPER_PARTPLUS, STEPPER_PARTNONE,
    // control-extension utils
    RGBA, HSV, ControlUtils,
    // control-extension classes
    Invocation, Control, ControlButton,
    ControlSaturationBrightnessPicker, ControlHuePicker, ControlColourPicker,
    ControlSlider, ControlStepper, ControlPotentiometer,
    ControlSwitch, ControlSwitchSprite,
    Spacer, MenuPassive,
    // scrollview
    SortableObject, SortedObject, ArrayForObjectSorting,
    SCROLLVIEW_DIRECTION_NONE, SCROLLVIEW_DIRECTION_HORIZONTAL,
    SCROLLVIEW_DIRECTION_VERTICAL, SCROLLVIEW_DIRECTION_BOTH,
    convertDistanceFromPointToInch, ScrollViewDelegate, GScrollView,
    GuiScrollViewCanvasRenderCmd, GuiScrollViewWebGLRenderCmd,
    TABLEVIEW_FILL_TOPDOWN, TABLEVIEW_FILL_BOTTOMUP,
    TableViewCell, TableViewDelegate, TableViewDataSource, TableView
};
