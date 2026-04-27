import { 
  Layer, 
  director, 
  Scale9Sprite, 
  Point, 
  Menu, 
  LabelTTF, 
  Size, 
  Color, 
  sequence, 
  EaseIn, 
  EaseOut, 
  ScaleTo, 
  MenuItemSprite, 
  log 
} from "@aspect/core";

const INT_MAX = Number.MAX_VALUE;

function clone(obj) {
  // Cloning is better if the new object is having the same prototype chain
  // as the copied obj (or otherwise, the cloned object is certainly going to
  // have a different hidden class). Play with C1/C2 of the
  // PerformanceVirtualMachineTests suite to see how this makes an impact
  // under extreme conditions.
  //
  // Object.create(Object.getPrototypeOf(obj)) doesn't work well because the
  // prototype lacks a link to the constructor (Carakan, V8) so the new
  // object wouldn't have the hidden class that's associated with the
  // constructor (also, for whatever reasons, utilizing
  // Object.create(Object.getPrototypeOf(obj)) + Object.defineProperty is even
  // slower than the original in V8). Therefore, we call the constructor, but
  // there is a big caveat - it is possible that the this.init() in the
  // constructor would throw with no argument. It is also possible that a
  // derived class forgets to set "constructor" on the prototype. We ignore
  // these possibities for and the ultimate solution is a standardized
  // Object.clone(<object>).
  var newObj = {};

  // Assuming that the constuctor above initialized all properies on obj, the
  // following keyed assignments won't turn newObj into dictionary mode
  // becuase they're not *new* properties, rather, they're the same
  // properties that were just assigned by the constructor. Assuming this is
  // the case, then there won't be a dictionary resize and it won't be much
  // slower than the original literal assignment.
  for (var key in obj) {
    newObj[key] = obj[key];
  }
  return newObj;
}

export class Dialog extends Layer {
  constructor(config) {
    super();
    this._defaultConfig = null;
    this.backgroundSprite = null;
    this.messageLabel = null;
    this.menuItemCancel = null;
    this.menuItemConfirm = null;

    var winSize = director.getWinSize();

    if (!config) {
      return;
    }

    this.backgroundSprite = new Scale9Sprite(config.background.res);

    var backgroundSpriteContentSize = config.background.size
      ? config.background.size
      : this.backgroundSprite.getContentSize();

    var backgroundSpritePosition = config.background.position
      ? config.background.position
      : new Point(winSize.width / 2, winSize.height / 2);

    this.backgroundSprite.setContentSize(backgroundSpriteContentSize);
    this.backgroundSprite.setPosition(backgroundSpritePosition);

    this.addChild(this.backgroundSprite);

    this.menuItemConfirm = this._createMenuItem(config.confirmBtn, function () {
      if (config.confirmBtn.callback) {
        config.confirmBtn.callback();
      }
    });

    this.menuItemConfirm.setPosition(
      config.confirmBtn.position
        ? config.confirmBtn.position
        : new Point(
            backgroundSpriteContentSize.width / 4,
            -backgroundSpriteContentSize.height / 4
          )
    );

    this.menuItemCancel = this._createMenuItem(config.cancelBtn, function () {
      if (config.cancelBtn.callback) {
        config.cancelBtn.callback();
      }
    });

    this.menuItemCancel.setPosition(
      config.cancelBtn.position
        ? config.cancelBtn.position
        : new Point(
            -backgroundSpriteContentSize.width / 4,
            -backgroundSpriteContentSize.height / 4
          )
    );

    var menu = new Menu(this.menuItemConfirm, this.menuItemCancel);
    menu.setPosition(new Point(0, 0));

    this.backgroundSprite.addChild(menu);

    var fontSize = config.messageLabel.fontSize
      ? config.messageLabel.fontSize
      : 40;

    this.messageLabel = new LabelTTF(
      config.messageLabel.text,
      config.messageLabel.fontName
        ? config.messageLabel.fontName
        : "Arial",
      fontSize,
      config.messageLabel.dimensions
        ? config.messageLabel.dimensions
        : new Size(
            backgroundSpriteContentSize.width * 0.85,
            backgroundSpriteContentSize.height * 0.6
          ),
      config.messageLabel.hAlignment,
      config.messageLabel.vAlignment
    );

    this.messageLabel.setColor(
      config.messageLabel.color
        ? config.messageLabel.color
        : new Color(255, 255, 255)
    );

    this.messageLabel.setPosition(
      config.messageLabel.position
        ? config.messageLabel.position
        : new Point(
            backgroundSpriteContentSize.width / 2,
            backgroundSpriteContentSize.height / 2
          )
    );

    if (config.messageLabel.action) {
      var action = sequence(
        new EaseIn(
          new ScaleTo(0.1, this.backgroundSprite.scale + 0.02),
          0.3
        ),
        new EaseOut(new ScaleTo(0.1, this.backgroundSprite.scale), 0.3)
      );
      action.retain();
      this.messageLabel.runAction(action);
    }

    this.backgroundSprite.addChild(this.messageLabel);

    this.setConfig(config);
  }

  _createMenuItem(res, callback) {
    var spriteNormal = new Scale9Sprite(res.normalRes);
    var spritePress = new Scale9Sprite(res.pressRes);

    var fontSize = res.fontSize ? res.fontSize : 30;

    var menuLabel = new LabelTTF(res.text, "Arial", fontSize);
    menuLabel.setColor(res.textColor);

    var menuItem = new MenuItemSprite(
      spriteNormal,
      spritePress,
      null,
      callback
    );

    menuItem.setContentSize(res.size);

    menuLabel.setPosition(new Point(menuItem.width / 2, menuItem.height / 2));

    menuItem.addChild(menuLabel);

    return menuItem;
  }

  setConfig(config) {
    this._defaultConfig = clone(config);
  }

  static _dialog = null;

  static _show(config, confirmCallback, cancelCallback) {
    if (Dialog._dialog) {
      log("other dialog is on the screen,this dialog can't show now");
      return;
    }

    if (!config.messageLabel) {
      log("tips is invalid");
      return;
    }

    Dialog._clearDialog();
    Dialog._dialog = new Dialog(config);

    if (director.getRunningScene()) {
      director.getRunningScene().addChild(Dialog._dialog, INT_MAX);
    } else {
      log("Current scene is null we can't show dialog");
    }

    if (confirmCallback) {
      var oldConfirmCallback = config.confirmBtn.callback;
      config.confirmBtn.callback = function () {
        log("this is confirm callback");
        confirmCallback();
        if (oldConfirmCallback) oldConfirmCallback();
      };
    }

    if (cancelCallback) {
      var oldCancelCallback = config.cancelBtn.callback;
      config.cancelBtn.callback = function () {
        log("this is cancel callback");
        cancelCallback();
        if (oldCancelCallback) oldCancelCallback();
      };
    }
  }

  static _clearDialog() {
    if (Dialog._dialog && Dialog._dialog.getParent()) {
      Dialog._dialog.removeFromParent(true);
      Dialog._dialog = null;
    }
  }

  onEnter() {
    super.onEnter();
    log("dialog call onEnter");
  }

  onExit() {
    super.onExit();
    log("dialog call onExit");
  }

  static setDefaultConfigs(config) {
    if (!config) {
      return;
    }

    if (config.cancelBtn) {
      if (!config.cancelBtn.textColor) {
        config.cancelBtn.textColor = new Color(255, 255, 255);
      }
    }

    if (config.confirmBtn) {
      if (!config.confirmBtn.textColor) {
        config.confirmBtn.textColor = new Color(255, 255, 255);
      }
    }
  }
}