/****************************************************************************
 Copyright (c) 2014-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import { ExtensionsTestScene } from "../extensions-test-scene";
import { PluginXTest } from "./PluginXTest";
import { Color, EventListener, LayerColor, log, ServiceLocator } from "@aspect/core";
import { ButtonLayout } from "../../button-layout";
import { winSize } from "../../constants";
import { TextBMFont } from "@aspect/ccui";
import { s_simpleFont_fnt } from "../../resources";

TAG_SETSERVERMODE = 0;
TAG_GETPRODUCTLIST = 1;
TAG_PAYMENT = 2;
TAG_TOAST = 3;

TAG_SETSERVERMODE_RESULT = 4;
TAG_GETPRODUCTLIST_RESULT = 5;
TAG_PAYMENT_RESULT = 6;

export var s_IAPFunctionItem = [
  { name: "setServerMode", tag: TAG_SETSERVERMODE },
  { name: "getProductList", tag: TAG_GETPRODUCTLIST },
  { name: "PayForProduct", tag: TAG_PAYMENT }
];
export var s_IAPResultItem = [
  { name: "false", tag: TAG_SETSERVERMODE_RESULT },
  { name: "[ ]", tag: TAG_GETPRODUCTLIST_RESULT },
  { name: "didn't call payFunction yet", tag: TAG_PAYMENT_RESULT }
];
export class IAPTestLayer extends PluginXTest {
  constructor() {
    super();
    this._serverMode = false;
  }

  onEnter() {
    super.onEnter();
    this.initPlugin();
    this.addMenuItem();
    this.initToast();
  }
  initPlugin() {
    var pluginManager = plugin.PluginManager.getInstance();
    this.PluginIAP = pluginManager.loadPlugin("IOSIAP");
    this.PluginIAP.setListener(this);
  }
  addMenuItem() {
    this.addChild(new ButtonLayout(
      s_IAPFunctionItem.map(item => ({
        label: item.name,
        tintDefault: new Color(0x44, 0x55, 0x77),
        tintPressed: new Color(0x22, 0x33, 0x55)
      })),
      140, "IAP",
      (i) => this.menuCallBack(i)
    ));

    for (var i = 0; i < s_IAPResultItem.length; i++) {
      var resultLabel = new TextBMFont(s_IAPResultItem[i].name, s_simpleFont_fnt);
      resultLabel.color = new Color(125, 125, 125);
      resultLabel.anchorX = 0;
      resultLabel.tag = s_IAPResultItem[i].tag;
      resultLabel.x = 300;
      resultLabel.y = winSize.height - 200 - i * 50;
      this.addChild(resultLabel);
    }
  }
  closeFunction(sender) {
    var scene = new ExtensionsTestScene();
    scene.runThisTest();
    ServiceLocator.director.runScene(scene);
  }
  initToast() {
    this.toastLayer = new LayerColor();
    var label = new TextBMFont("loading", s_simpleFont_fnt);
    this.toastLayer.addChild(label);
    this.toastLayer.setTag(TAG_TOAST);
    label.x = winSize.width / 2;
    label.y = winSize.height / 2;
    this.toastLayer.setColor(new Color(100, 100, 100, 100));
  }
  addTouch(bool) {
    if (bool) {
      var self = this.toastLayer;
      this.listener = EventListener.create({
        event: EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: function (touch, event) {
          return true;
        },
        onTouchMoved: function (touch, event) {},
        onTouchEnded: function (touch, event) {},
        onTouchCancelled: function (touch, event) {}
      });
      ServiceLocator.eventManager.addListener(this.listener, self);
    } else {
      ServiceLocator.eventManager.removeListener(this.listener);
    }
  }
  toggleToast(show) {
    if (show) {
      if (!this.getChildByTag(TAG_TOAST)) {
        this.addChild(this.toastLayer);
        this.addTouch(true);
      }
    } else {
      this.toastLayer.removeFromParent(true);
      this.addTouch(false);
    }
  }
  menuCallBack(index) {
    this.toggleToast(true);
    if (index === TAG_SETSERVERMODE) {
      this.PluginIAP.callFuncWithParam("setServerMode");
      var label = this.getChildByTag(TAG_SETSERVERMODE_RESULT);
      this._serverMode = true;
      if (label) {
        label.setString("true");
        this.toggleToast(false);
      }
    } else if (index == TAG_GETPRODUCTLIST) {
      //replace these ids to your own productIdentifiers
      var pidList = ["001", "002"];
      this.PluginIAP.callFuncWithParam(
        "requestProducts",
        plugin.PluginParam(
          plugin.PluginParam.ParamType.TypeString,
          pidList.toString()
        )
      );
    } else if (index == TAG_PAYMENT) {
      if (!this.product) {
        var label = this.getChildByTag(TAG_PAYMENT_RESULT);
        if (label) {
          label.setString("please call requestProducts first");
          this.toggleToast(false);
          return;
        }
      }
      this.PluginIAP.payForProduct(this.product[0]);
    }
  }

  onPayResult(ret, msg, productInfo) {
    this.toggleToast(false);
    log("onPayResult ret is " + ret);
    var str = "";
    if (ret == plugin.ProtocolIAP.PayResultCode.PaySuccess) {
      str = "payment Success pid is " + productInfo.productId;
      //if you use server mode get the receive message and post to your server
      if (this._serverMode && msg) {
        str = "payment verify from server";
        log(str);
        this.postServerData(msg);
      }
    } else if (ret == plugin.ProtocolIAP.PayResultCode.PayFail) {
      str = "payment fail";
    }
    var label = this.getChildByTag(TAG_PAYMENT_RESULT);
    if (label) {
      label.setString(str);
    }
  }
  onRequestProductResult(ret, productInfo) {
    var msgStr = "";
    if (ret == plugin.ProtocolIAP.RequestProductCode.RequestFail) {
      msgStr = "request error";
      this.toggleToast(false);
    } else if (ret == plugin.ProtocolIAP.RequestProductCode.RequestSuccess) {
      log("request RequestSuccees " + productInfo[0].productName);
      this.product = productInfo;
      msgStr = "list: [";
      for (var i = 0; i < productInfo.length; i++) {
        var product = productInfo[i];
        msgStr += product.productName + " ";
      }
      msgStr += " ]";
      this.toggleToast(false);
    }
    var label = this.getChildByTag(TAG_GETPRODUCTLIST_RESULT);
    if (label) {
      label.setString(msgStr);
    }
  }
  postServerData(data) {
    var that = this;
    var xhr = ServiceLocator.loader.getXMLHttpRequest();

    //replace to your own server address
    xhr.open("POST", "http://localhost/");
    that.toggleToast(true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        that.toggleToast(false);
        var result = JSON.parse(xhr.responseText);
        that.PluginIAP.callFuncWithParam(
          "finishTransaction",
          new plugin.PluginParam(
            plugin.PluginParam.ParamType.TypeString,
            result.receipt.in_app[0].product_id
          )
        );
      }
    };
    // you can add your data and post them to your server;
    var result = { userid: 100, receipt: data };
    xhr.send(JSON.stringify(result));
  }
  onExit() {
    super.onExit();
  }
}
