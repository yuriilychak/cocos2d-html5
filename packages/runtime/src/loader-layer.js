import {
  Loader,
  Layer,
  director,
  Point,
  LabelTTF,
  Color,
  Scene,
  Sprite,
  Sys,
  isArray,
  log,
  visibleRect,
  EGLView,
  Scale9Sprite,
  ResolutionPolicy
} from "@aspect/core";
import { MoveBy, ScaleTo, DelayTime, easeIn, easeOut } from "@aspect/actions";
import { runtime } from "./network-utils";

const INT_MAX = Number.MAX_VALUE;
const GROUP_JSON_PATH = "group.json";

export class LoaderLayer extends Layer {
  constructor(config) {
    super();
    this._backgroundSprite = null;
    this._progressBackgroundSprite = null;
    this._progressBarSprite = null;
    this._logoSprite = null;
    this._titleSprite = null;
    this._groupname = null;
    this._callback = null;
    this._selector = null;
    this._preloadCount = 0;
    this._isPreloadFromFailed = false;
    this._progressOriginalWidth = 0;
    this._isLandScape = false;
    this._scaleFactor = null;
    if (config) {
      LoaderLayer.setConfig(config);
    }
  }

  onEnter() {
    super.onEnter();
    this.initView();
    var config = LoaderLayer._finalConfig;
    if (config.onEnter) {
      config.onEnter(this);
    }
  }

  onExit() {
    super.onExit();
    var config = LoaderLayer._finalConfig;
    if (config.logo.action) {
      config.logo.action.release();
    }
    if (config.title.action) {
      config.title.action.release();
    }
    if (config.onExit) {
      config.onExit(this);
    }
  }

  initView() {
    var self = this;
    var config = LoaderLayer._finalConfig;
    this._contentLayer = new Layer();

    // Set background
    if (config.bg.color) {
      this.setColor(config.bg.color);
    }

    if (config.bg.res) {
      this._backgroundSprite = new Sprite(config.bg.res);
      this._backgroundSprite.setPosition(visibleRect.center);
      this._contentLayer.addChild(this._backgroundSprite, 0);
    }

    // Set title
    if (config.title.res) {
      this._titleSprite = new Sprite(config.title.res);
      this._titleSprite.setPosition(
        config.title.position ||
          visibleRect.top ||
          Point.add(
            visibleRect.center,
            new Point(
              0,
              this._scaleFactor < 1 ? 0 : this._isLandScape ? -80 : 30
            )
          )
      );
      this._contentLayer.addChild(this._titleSprite, 1);
    }

    // Set logo
    if (config.logo.res) {
      this._logoSprite = new Sprite(config.logo.res);
      this._logoSprite.setPosition(
        config.logo.position ||
          Point.add(
            visibleRect.center,
            new Point(
              this._scaleFactor < 1 ? 0 : this._isLandScape ? 0 : 0,
              this._scaleFactor < 1 ? 0 : this._isLandScape ? 0 : -100
            )
          )
      );
      this._contentLayer.addChild(this._logoSprite, 1);
    }

    // Set progress bar background
    if (config.progressBarBg.res) {
      this._progressBackgroundSprite = new Scale9Sprite(
        config.progressBarBg.res
      );
      this._progressBackgroundSprite.setPosition(
        config.progressBarBg.position ||
          Point.add(
            visibleRect.center,
            new Point(0, -this._isLandScape ? 120 : 140)
          )
      );
      this._contentLayer.addChild(this._progressBackgroundSprite, 1);
    }

    // Set progress bar
    if (config.progressBar.res) {
      this.progressBarSprite = new Sprite(config.progressBar.res);
      this._progressOriginalWidth = this.progressBarSprite.width;

      if (!config.progressBar.offset) {
        config.progressBar.offset = new Point(
          config.progressBarBg.res ? 0 : 0,
          config.progressBarBg.res ? 0 : 0
        );
      }

      this.progressBarSprite.setPosition(
        config.progressBar.position ||
          Point.add(
            visibleRect.center,
            new Point(
              0,
              this.progressBarSprite.height / 2 + this._isLandScape ? 60 : 80
            )
          )
      );
      this.progressBarSprite.setAnchorPoint(new Point(0, 0.5));
      this._contentLayer.addChild(this.progressBarSprite, 1);
    }

    // Set progress tips label
    if (config.tips) {
      this.tipsLabel = new LabelTTF("100%", "Arial", config.tips.fontSize);
      this.tipsLabel.setColor(
        config.tips.color ? config.tips.color : new Color(255, 255, 255)
      );
      this.tipsLabel.setPosition(
        config.tips.position
          ? config.tips.position
          : Point.add(visibleRect.bottom, new Point(0, 100))
      );
      this._contentLayer.addChild(this.tipsLabel, 1);
    }

    // Auto adjust position
    this._contentLayer.setPosition(
      Point.add(this._contentLayer.getPosition(), new Point(0, -50))
    );
    this.progressBarSprite.setPosition(
      Point.add(
        this.progressBarSprite.getPosition(),
        new Point(
          this.progressBarSprite.width,
          this.progressBarSprite.height / 2
        )
      )
    );
    this.addChild(this._contentLayer);
  }

  _setProgress(value) {
    if (this.progressBarSprite) {
      this.progressBarSprite.setScaleX(value);
    }
    if (this.tipsLabel) {
      this.tipsLabel.setString(Math.round(value * 100) + "%");
    }
  }

  preload(groupname, selector, callback) {
    var self = this;
    log("LoaderLayer is preloading resource group: " + groupname);
    this._groupname = groupname;
    this._selector = selector;
    this._callback = callback;
    this._preloadCount++;

    if (Sys && Sys.isNative) {
      this._preload_native();
    } else {
      this._preload_web();
    }
  }

  _preload_web() {
    var self = this;
    var config = LoaderLayer._finalConfig;
    var groupIndex = [];
    var groups = Loader.getInstance()._config.groups;
    var res = [];

    if (typeof this._groupname == "string") {
      res = groups[this._groupname];
      if (!res || !res.length) {
        log("LoaderLayer: group '" + this._groupname + "' not found");
        return;
      }
    } else if (isArray(this._groupname)) {
      res = [];
      for (var i = 0; i < this._groupname.length; i++) {
        var group = groups[this._groupname[i]];
        var files = group && group.files;
        var preCount = i > 0 ? groupIndex[i - 1] : 0;
        groupIndex.push(preCount + files ? files.length : 0);
        res = res.concat(files);
      }
    }

    var self = this;
    Loader.getInstance().load(
      res,
      function (result, count, loadedCount) {
        var checkGroupName = function (loadedCount) {
          for (var i = 0; i < groupIndex.length; i++) {
            if (groupIndex[i] >= loadedCount) {
              return self._groupname[i];
            }
          }
        };
        var groupName = checkGroupName(loadedCount);
        var status = {
          groupName: groupName,
          isCompleted: false,
          percent: ((loadedCount / count) * 100) | 0,
          stage: 1,
          isFailed: false
        };
        if (status.percent != 0) {
          self._setProgress(status.percent / 100);
        }
        config.tips.tipsProgress(status, self);
      },
      function () {
        self.removeFromParent();
        self._preloadCount--;
        if (self._callback) {
          if (self._selector) {
            self._callback(self._selector, true);
          } else {
            self._callback(true);
          }
        }
      }
    );
  }

  _preload_native(status) {
    log(JSON.stringify(status));
    var config = LoaderLayer._finalConfig;
    if (status.percent) {
      this._setProgress(status.percent / 100);
    }
    if (config.tips.tipsProgress) {
      config.tips.tipsProgress(status, this);
    }
    if (status.isCompleted || status.isFailed) {
      this._preloadCount--;

      if (status.isCompleted) {
        log("preload finish!");
        this._isPreloadFromFailed = false;
      }
      if (status.isFailed) {
        log("preload failed!");
        this._isPreloadFromFailed = true;
      }

      // Remove loading layer from scene after loading was done.
      if (this._preloadCount == 0 && !this._isPreloadFromFailed) {
        this.removeFromParent();
        if (LoaderLayer._useDefaultSource) {
          var _config = runtime.config.design_resolution || {
            width: 480,
            height: 720,
            policy: "SHOW_ALL"
          };
          EGLView.getInstance().setDesignResolutionSize(
            _config.width,
            _config.height,
            ResolutionPolicy[_config.policy]
          );
        }
      }

      // Callback must be invoked after removeFromParent.
      this._callback.call(this._target, status);
    }
  }

  _addToScene() {
    if (this._preloadCount == 0 && !this._isPreloadFromFailed) {
      if (Sys.isNative && LoaderLayer._useDefaultSource) {
        var config = runtime.config.design_resolution;
        var isLandscape = false;
        var isLargeThanResource = false;
        if (config) {
          var orientation = runtime.config.orientation;
          log("_addToScene orientation is " + orientation);
          if (orientation == "landscape") {
            isLandscape = true;
          }
          var designWidth = config.width;
          var designHeight = config.height;
          var policy = config.policy;
          var size = EGLView.getInstance().getFrameSize();
          var isLargeThanResource = false;
          if (size.width > designWidth && size.height > designHeight) {
            isLargeThanResource = true;
            log("isLargeThanResource is " + isLargeThanResource);
          }
          if (!isLargeThanResource) {
            EGLView.getInstance().setDesignResolutionSize(
              designWidth,
              designHeight,
              ResolutionPolicy[policy]
            );
          }
        }
        this._isLandScape = isLandscape;
      }
      director.getRunningScene().addChild(this, INT_MAX - 1);
    }
  }

  // Static properties and methods
  static _config = {};
  static _finalConfig = {};
  static _useDefaultSource = false;

  static setConfig(config) {
    LoaderLayer._config = config || {};
    LoaderLayer._finalConfig = {};
    LoaderLayer._mergeDefaultConfigs();
  }

  static _mergeDefaultConfigs() {
    var config = LoaderLayer._config;
    var finalConfig = LoaderLayer._finalConfig;

    // Default configurations
    finalConfig.onEnter =
      config.onEnter ||
      function (target) {
        log("LoaderLayer onEnter");
      };

    finalConfig.onExit =
      config.onExit ||
      function (target) {
        log("LoaderLayer onExit");
      };

    finalConfig.bg = config.bg || {};
    finalConfig.title = config.title || {};
    finalConfig.logo = config.logo || {};
    finalConfig.progressBarBg = config.progressBarBg || {};
    finalConfig.progressBar = config.progressBar || {};
    finalConfig.tips = config.tips || {};

    // Set defaults
    if (!finalConfig.tips.fontSize) {
      finalConfig.tips.fontSize = 24;
    }
    if (!finalConfig.tips.color) {
      finalConfig.tips.color = new Color(255, 255, 255);
    }
  }

  static preload(groupname, selector, callback) {
    if (typeof groupname == "undefined") {
      log("LoaderLayer.preload(...): groupname is undefined");
      return;
    }

    if (typeof selector == "function") {
      callback = selector;
      selector = null;
    }

    var loaderLayer = new LoaderLayer();
    loaderLayer._groupname = groupname;
    loaderLayer._selector = selector;
    loaderLayer._callback = callback;
    loaderLayer._preloadCount++;

    if (!director.getRunningScene()) {
      director.runScene(new Scene());
    }

    loaderLayer._addToScene();

    if (Sys.isNative) {
      runtime.preload(loaderLayer._groupname, function (status) {
        loaderLayer._preload_native(status);
      });
    } else {
      setTimeout(function () {
        loaderLayer._preload_web();
      }, 16);
    }

    return loaderLayer;
  }

  static _getDefaultConfig() {
    return {
      onEnter: function () {
        log("Preloading engine resources... " + 0 + "%");
      },
      onExit: function () {},
      bg: {
        color: null,
        res: null
      },
      logo: {
        res: null,
        position: null,
        action: new Sequence(
          new Spawn(
            new MoveBy(0.4, new Point(0, 40)).easing(easeIn(0.5)),
            new ScaleTo(0.4, 0.95, 1.05).easing(EaseIn(0.5))
          ),
          DelayTime.create(0.2),
          new Spawn(
            new MoveBy(0.4, new Point(0, -40)).easing(easeOut(0.5)),
            new ScaleTo(0.4, 1.05, 0.95).easing(easeOut(0.5))
          )
        ).repeatForever()
      },
      title: {
        res: null,
        position: null
      },
      progressBarBg: {
        res: null,
        position: null
      },
      progressBar: {
        res: null,
        position: null,
        offset: null
      },
      tips: {
        fontSize: 24,
        color: new Color(255, 255, 255),
        position: null,
        tipsProgress: function (status, loaderLayer) {
          if (loaderLayer.tipsLabel) {
            loaderLayer.tipsLabel.setString(status.percent + "%");
          }
        }
      }
    };
  }
}

// Initialize default config
LoaderLayer.setConfig(LoaderLayer._getDefaultConfig());
