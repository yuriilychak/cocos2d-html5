/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 Created by Chris Hannon 2014 http://www.channon.us

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
/** @expose */
import { ExtensionsTestScene } from "../extensions-test-scene";
import { Color, Director, log } from "@aspect/core";
import { ButtonLayout } from "../../button-layout";
import { SocketIO } from "@aspect/socketio";
import { TextBMFont } from "@aspect/ccui";
import { s_simpleFont_fnt } from "../../resources";
import { BaseTestLayer } from "../../BaseTestLayer/BaseTestLayer";
import { TestScene } from "../../test-scene";

export class SocketIOTestLayer extends BaseTestLayer {
  constructor() {
    super();

    this._title = "SocketIO Test";
    this._showNavButtons = false;
    this._sioClient = null;
    this._sioEndpoint = null;
    this._sioClientStatus = null;
    this.init();
  }

  init() {
    this.addChild(new ButtonLayout(
      [
        { label: "Open Client", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) },
        { label: "Open Endpoint", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) },
        { label: "Send Message", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) },
        { label: "Endpoint Message", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) },
        { label: "Send Event", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) },
        { label: "Endpoint Event", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) },
        { label: "Disconnect Socket", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) },
        { label: "Disconnect Endpoint", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) }
      ],
      140, "SocketIO",
      (i) => {
        switch (i) {
          case 0: this.onMenuSIOClientClicked(); break;
          case 1: this.onMenuSIOEndpointClicked(); break;
          case 2: this.onMenuTestMessageClicked(); break;
          case 3: this.onMenuTestMessageEndpointClicked(); break;
          case 4: this.onMenuTestEventClicked(); break;
          case 5: this.onMenuTestEventEndpointClicked(); break;
          case 6: this.onMenuTestClientDisconnectClicked(); break;
          case 7: this.onMenuTestEndpointDisconnectClicked(); break;
        }
      }
    ));

    this._sioClientStatus = new TextBMFont("Not connected...", s_simpleFont_fnt);
    this._sioClientStatus.setAnchorPoint(0, 0);
    this._sioClientStatus.setPosition(10, 10);
    this.addChild(this._sioClientStatus);

    return true;
  }

  onExit() {
    if (this._sioEndpoint) {
      this._sioEndpoint.disconnect();
      this._sioEndpoint = null;
    }
    if (this._sioClient) {
      this._sioClient.disconnect();
      this._sioClient = null;
    }

    super.onExit();
  }

  //socket callback for testing
  testevent(data) {
    var msg = this.tag + " says 'testevent' with data: " + data;
    this.statusLabel.setString(msg);
    log(msg);
  }

  message(data) {
    var msg = this.tag + " received message: " + data;
    this.statusLabel.setString(msg);
    log(msg);
  }

  disconnection() {
    var msg = this.tag + " disconnected!";
    this.statusLabel.setString(msg);
    log(msg);
  }
  // Menu Callbacks
  onMenuSIOClientClicked(sender) {
    // Check if SocketIO is available
    if (!SocketIO) {
      log(
        "Socket.IO not available. Please include socket.io-client library."
      );
      this._sioClientStatus.setString("Socket.IO not available!");
      return;
    }

    //create a client by using this static method, url does not need to contain the protocol
    var sioclient = SocketIO.connect("ws://tools.itharbors.com:4000", {
      "force new connection": true
    });

    //if you need to track multiple sockets it is best to store them with tags in your own array for now
    sioclient.tag = "Test Client";

    //attaching the status label to the socketio client
    //this is only necessary in javascript due to scope within shared event handlers,
    //as 'this' will refer to the socketio client
    sioclient.statusLabel = this._sioClientStatus;

    //register event callbacks
    //this is an example of a handler declared inline
    sioclient.on("connect", function () {
      var msg = sioclient.tag + " Connected!";
      this.statusLabel.setString(msg);
      log(msg);
      sioclient.send(msg);
    });

    //example of a handler that is shared between multiple clients
    sioclient.on("message", this.message);

    sioclient.on("echotest", function (data) {
      log("echotest 'on' callback fired!");
      var msg = this.tag + " says 'echotest' with data: " + data;
      this.statusLabel.setString(msg);
      log(msg);
    });

    sioclient.on("testevent", this.testevent);

    sioclient.on("disconnect", this.disconnection);

    this._sioClient = sioclient;
  }

  onMenuSIOEndpointClicked(sender) {
    // If socket.io isn't loaded yet, load it from CDN first
    if (!window.io) {
      this._sioClientStatus.setString("Loading Socket.IO from CDN...");
      SocketIO.loadAsync()
        .then(() => {
          this._doSocketIOEndpointConnection();
        })
        .catch((error) => {
          log("Failed to load Socket.IO: " + error.message);
          this._sioClientStatus.setString("Failed to load Socket.IO!");
        });
      return;
    }

    this._doSocketIOEndpointConnection();
  }

  _doSocketIOEndpointConnection() {
    //repeat the same connection steps for the namespace "testpoint"
    var sioendpoint = SocketIO.connect(
      "ws://tools.itharbors.com:4000/testpoint",
      { "force new connection": true }
    );

    //a tag to differentiate in shared callbacks
    sioendpoint.tag = "Test Endpoint";

    sioendpoint.statusLabel = this._sioClientStatus;

    sioendpoint.on("connect", function () {
      var msg = sioendpoint.tag + " Connected!";
      this.statusLabel.setString(msg);
      log(msg);
      sioendpoint.send(msg);
    });

    //register event callbacks
    sioendpoint.on("echotest", function (data) {
      log("echotest 'on' callback fired!");
      var msg = this.tag + " says 'echotest' with data: " + data;
      this.statusLabel.setString(msg);
      log(msg);
    });

    sioendpoint.on("message", this.message);

    //demonstrating how callbacks can be shared within a delegate
    sioendpoint.on("testevent", this.testevent);

    sioendpoint.on("disconnect", this.disconnection);

    this._sioEndpoint = sioendpoint;
  }

  onMenuTestMessageClicked(sender) {
    //check that the socket is != NULL before sending or emitting events
    //the client should be NULL either before initialization and connection or after disconnect
    if (this._sioClient != null) this._sioClient.send("Hello Socket.IO!");
  }

  onMenuTestMessageEndpointClicked(sender) {
    if (this._sioEndpoint != null) this._sioEndpoint.send("Hello Socket.IO!");
  }

  onMenuTestEventClicked(sender) {
    if (this._sioClient != null)
      this._sioClient.emit("echotest", '[{"name":"myname","type":"mytype"}]');
  }

  onMenuTestEventEndpointClicked(sender) {
    if (this._sioEndpoint != null)
      this._sioEndpoint.emit("echotest", '[{"name":"myname","type":"mytype"}]');
  }

  onMenuTestClientDisconnectClicked(sender) {
    if (this._sioClient != null) {
      this._sioClient.disconnect();
      this._sioClient = null;
    }
  }

  onMenuTestEndpointDisconnectClicked(sender) {
    if (this._sioEndpoint != null) {
      this._sioEndpoint.disconnect();
      this._sioEndpoint = null;
    }
  }
}

export function runSocketIOTest() {
  const scene = new TestScene("SocketIO Test", "Back");
  scene.onMainMenuCallback = () => new ExtensionsTestScene().runThisTest();
  const layer = new SocketIOTestLayer();
  scene.addChild(layer);
  Director.getInstance().runScene(scene);
}
