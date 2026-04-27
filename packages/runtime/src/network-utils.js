import { director, log } from "@aspect/core";
import { Dialog } from "./dialog";

const INT_MAX = Number.MAX_VALUE;

// Network Error Dialog
export class NetworkErrorDialog {
  static _config = {
    networkError: {},
    spaceError: {},
    verifyError: {}
  };

  static create() {
    Dialog._clearDialog();
    Dialog._dialog = new Dialog(NetworkErrorDialog._config);
    return Dialog._dialog;
  }

  static show(type, tips, confirmCb, cancelCb) {
    var networkDialog = NetworkErrorDialog.create();
    var config;
    switch (type) {
      case "err_network": {
        config = NetworkErrorDialog._config.networkError;
        break;
      }
      case "err_no_space": {
        config = NetworkErrorDialog._config.spaceError;
        break;
      }
      case "err_verify": {
        config = NetworkErrorDialog._config.verifyError;
        break;
      }
      default: {
        log("type is not found");
        return;
      }
    }
    if (!networkDialog.getParent()) {
      config.confirmBtn = config.confirmBtn || {};
      config.confirmBtn.callback = function () {
        if (confirmCb) confirmCb();
      };

      config.cancelBtn = config.cancelBtn || {};
      config.cancelBtn.callback = function () {
        if (cancelCb) cancelCb();
      };

      config.messageLabel = config.messageLabel || {};
      if (typeof config.messageLabel.text == "undefined") {
        config.messageLabel.text = tips;
      }

      networkDialog.setConfig(config);
      if (director.getRunningScene()) {
        director.getRunningScene().addChild(networkDialog, INT_MAX);
      } else {
        log("Current scene is null we can't show dialog");
      }
    }
  }

  static setConfig(key, config) {
    if (key && config) {
      switch (key) {
        case "err_network": {
          NetworkErrorDialog._config.networkError = config;
          break;
        }
        case "err_no_space": {
          NetworkErrorDialog._config.spaceError = config;
          break;
        }
        case "err_verify": {
          NetworkErrorDialog._config.verifyError = config;
          break;
        }
      }
    }
  }
}

// Runtime utilities
export const runtime = {
  setOption: function (promptype, config) {
    if (config) {
      switch (promptype) {
        case "network_error_dialog": {
          NetworkErrorDialog.setConfig("err_network", config);
          break;
        }
        case "no_space_error_dialog": {
          NetworkErrorDialog.setConfig("err_no_space", config);
          break;
        }
        case "verify_error_dialog": {
          NetworkErrorDialog.setConfig("err_verify", config);
          break;
        }
        default: {
          log("promptype not found please check your promptype");
        }
      }
    } else {
      log("config is null please check your config");
    }
  }
};

/**
 * only use in JSB get network type
 */
export const network = {
  type: {
    NO_NETWORK: -1,
    MOBILE: 0,
    WIFI: 1
  },
  preloadstatus: {
    DOWNLOAD: 1,
    UNZIP: 2
  }
};

