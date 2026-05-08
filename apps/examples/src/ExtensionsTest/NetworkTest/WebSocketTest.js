/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 Copyright (c) 2013 James Chen

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
import { Director, Sys, Size, log } from "@aspect/core";
import { Menu, MenuItemLabel } from "@aspect/menus";
import { BaseTestLayer } from "../../BaseTestLayer/BaseTestLayer";
import { TestScene } from "../../test-scene";
import { s_simpleFont_fnt } from "../../resources";
import { LinearLayoutParameter, TextBMFont, VBox } from "@aspect/ccui";

export var WebSocket = WebSocket || window.WebSocket || window.MozWebSocket;

export class WebSocketTestLayer extends BaseTestLayer {
  constructor() {
    super();
    this._title = "WebSocket Test";
    this._showNavButtons = false;
    this._wsiSendText = null;
    this._wsiSendBinary = null;
    this._wsiError = null;
    this._sendTextStatus = null;
    this._sendBinaryStatus = null;
    this._errorStatus = null;
    this._sendTextTimes = 0;
    this._sendBinaryTimes = 0;
    this.init();
  }

  init() {
    var winSize = Director.getInstance().getWinSize();

    var MARGIN = 40;
    var SPACE = 35;

    var menuRequest = new Menu();
    menuRequest.x = 0;
    menuRequest.y = 0;
    this.addChild(menuRequest);

    // Send Text
    var labelSendText = new TextBMFont("Send Text", s_simpleFont_fnt);
    var itemSendText = new MenuItemLabel(
      labelSendText,
      this.onMenuSendTextClicked,
      this
    );
    itemSendText.x = winSize.width / 2;
    itemSendText.y = winSize.height - MARGIN - SPACE;
    menuRequest.addChild(itemSendText);

    // Send Binary
    var labelSendBinary = new TextBMFont("Send Binary", s_simpleFont_fnt);
    var itemSendBinary = new MenuItemLabel(
      labelSendBinary,
      this.onMenuSendBinaryClicked,
      this
    );
    itemSendBinary.x = winSize.width / 2;
    itemSendBinary.y = winSize.height - MARGIN - 2 * SPACE;
    menuRequest.addChild(itemSendBinary);

    // Status labels inside a vertical layout
    const PADDING = 10;
    const statusBox = new VBox();
    statusBox.setContentSize(new Size(winSize.width - PADDING * 2, 120));
    statusBox.x = PADDING;
    statusBox.y = PADDING;
    this.addChild(statusBox);

    const makeStatusLabel = (text) => {
      const label = new TextBMFont(text, s_simpleFont_fnt);
      label.setAnchorPoint(0, 0.5);
      const param = new LinearLayoutParameter();
      param.setGravity(LinearLayoutParameter.NONE);
      param.setMargin(0, 8, 0, 0);
      label.setLayoutParameter(param);
      return label;
    };

    this._sendTextStatus = makeStatusLabel("Send Text WS is waiting...");
    this._sendBinaryStatus = makeStatusLabel("Send Binary WS is waiting...");
    this._errorStatus = makeStatusLabel("Error WS is waiting...");
    statusBox.addChild(this._sendTextStatus);
    statusBox.addChild(this._sendBinaryStatus);
    statusBox.addChild(this._errorStatus);

    var self = this;

    this._wsiSendText = new WebSocket("wss://echo.websocket.org");
    this._wsiSendText.onopen = function (evt) {
      self._sendTextStatus.setString(
        "Opened, url: " +
          self._wsiSendText.url +
          ", protocol: " +
          self._wsiSendText.protocol
      );
    };

    this._wsiSendText.onmessage = function (evt) {
      self._sendTextTimes++;
      var textStr =
        "response text msg: " + evt.data + ", " + self._sendTextTimes;
      log(textStr);

      self._sendTextStatus.setString(textStr);
    };

    this._wsiSendText.onerror = function (evt) {
      log("_wsiSendText Error was fired");
      if (Sys.getInstance().isObjectValid(self)) {
        self._errorStatus.setString("an error was fired");
      } else {
        log("WebSocket test layer was destroyed!");
      }
    };

    this._wsiSendText.onclose = function (evt) {
      log("_wsiSendText websocket instance closed.");
      self._wsiSendText = null;
    };

    this._wsiSendBinary = new WebSocket("ws://echo.websocket.org");
    this._wsiSendBinary.binaryType = "arraybuffer";
    this._wsiSendBinary.onopen = function (evt) {
      self._sendBinaryStatus.setString(
        "Opened, url: " +
          self._wsiSendBinary.url +
          ", protocol: " +
          self._wsiSendBinary.protocol
      );
    };

    this._wsiSendBinary.onmessage = function (evt) {
      self._sendBinaryTimes++;
      var binary = new Uint16Array(evt.data);
      var binaryStr = "response bin msg: ";

      var str = "";
      for (var i = 0; i < binary.length; i++) {
        if (binary[i] == 0) {
          str += "\'\\0\'";
        } else {
          var hexChar = "0x" + binary[i].toString("16").toUpperCase();
          str += String.fromCharCode(hexChar);
        }
      }

      binaryStr += str + ", " + self._sendBinaryTimes;
      log(binaryStr);
      self._sendBinaryStatus.setString(binaryStr);
    };

    this._wsiSendBinary.onerror = function (evt) {
      log("_wsiSendBinary Error was fired");
      if (Sys.getInstance().isObjectValid(self)) {
        self._errorStatus.setString("an error was fired");
      } else {
        log("WebSocket test layer was destroyed!");
      }
    };

    this._wsiSendBinary.onclose = function (evt) {
      log("_wsiSendBinary websocket instance closed.");
      self._wsiSendBinary = null;
    };

    this._wsiError = new WebSocket("ws://invalidurlxxxyyy.com");
    this._wsiError.onopen = function (evt) {};
    this._wsiError.onmessage = function (evt) {};
    this._wsiError.onerror = function (evt) {
      log("_wsiError Error was fired");
      if (Sys.getInstance().isObjectValid(self)) {
        self._errorStatus.setString("an error was fired");
      } else {
        log("WebSocket test layer was destroyed!");
      }
    };
    this._wsiError.onclose = function (evt) {
      log("_wsiError websocket instance closed.");
      self._wsiError = null;
    };

    return true;
  }

  onExit() {
    if (this._wsiSendText) this._wsiSendText.close();

    if (this._wsiSendBinary) this._wsiSendBinary.close();

    if (this._wsiError) this._wsiError.close();
    super.onExit();
  }

  // Menu Callbacks
  onMenuSendTextClicked(sender) {
    if (this._wsiSendText.readyState == WebSocket.OPEN) {
      this._sendTextStatus.setString("Send Text WS is waiting...");
      this._wsiSendText.send("Hello WebSocket中文, I'm a text message.");
    } else {
      var warningStr = "send text websocket instance wasn't ready...";
      log(warningStr);
      this._sendTextStatus.setString(warningStr);
    }
  }

  _stringConvertToArray(strData) {
    if (!strData) return null;

    var arrData = new Uint16Array(strData.length);
    for (var i = 0; i < strData.length; i++) {
      arrData[i] = strData.charCodeAt(i);
    }
    return arrData;
  }

  onMenuSendBinaryClicked(sender) {
    if (this._wsiSendBinary.readyState == WebSocket.OPEN) {
      this._sendBinaryStatus.setString("Send Binary WS is waiting...");
      var buf = "Hello WebSocket中文,\0 I'm\0 a\0 binary\0 message\0.";
      var binary = this._stringConvertToArray(buf);

      this._wsiSendBinary.send(binary.buffer);
    } else {
      var warningStr = "send binary websocket instance wasn't ready...";
      log(warningStr);
      this._sendBinaryStatus.setString(warningStr);
    }
  }
}

export function runWebSocketTest() {
  const scene = new TestScene("WebSocket Test", "Back");
  scene.onMainMenuCallback = () => new ExtensionsTestScene().runThisTest();
  const layer = new WebSocketTestLayer();
  scene.addChild(layer);
  Director.getInstance().runScene(scene);
}

