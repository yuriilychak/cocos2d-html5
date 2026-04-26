import { MenuItem } from "./menu-item/menu-item";
import { MenuItemLabel } from "./menu-item/menu-item-label";
import { MenuItemAtlasFont } from "./menu-item/menu-item-atlas-font";
import { MenuItemFont } from "./menu-item/menu-item-font";
import { MenuItemSprite } from "./menu-item/menu-item-sprite";
import { MenuItemImage } from "./menu-item/menu-item-image";
import { MenuItemToggle } from "./menu-item/menu-item-toggle";
import { Menu } from "./menu";
import {
  MENU_STATE_WAITING,
  MENU_STATE_TRACKING_TOUCH,
  MENU_HANDLER_PRIORITY,
  DEFAULT_PADDING
} from "./constants";

cc.MenuItem = MenuItem;
cc.MenuItemLabel = MenuItemLabel;
cc.MenuItemAtlasFont = MenuItemAtlasFont;
cc.MenuItemFont = MenuItemFont;
cc.MenuItemSprite = MenuItemSprite;
cc.MenuItemImage = MenuItemImage;
cc.MenuItemToggle = MenuItemToggle;
cc.Menu = Menu;
cc.MENU_STATE_WAITING = MENU_STATE_WAITING;
cc.MENU_STATE_TRACKING_TOUCH = MENU_STATE_TRACKING_TOUCH;
cc.MENU_HANDLER_PRIORITY = MENU_HANDLER_PRIORITY;
cc.DEFAULT_PADDING = DEFAULT_PADDING;

export {
  MenuItem,
  MenuItemLabel,
  MenuItemAtlasFont,
  MenuItemFont,
  MenuItemSprite,
  MenuItemImage,
  MenuItemToggle,
  Menu,
  MENU_STATE_WAITING,
  MENU_STATE_TRACKING_TOUCH,
  MENU_HANDLER_PRIORITY,
  DEFAULT_PADDING
};
