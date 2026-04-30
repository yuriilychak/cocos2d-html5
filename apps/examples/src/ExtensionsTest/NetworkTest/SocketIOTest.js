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
window.io;

// SocketIO is now provided by the socketio package
// If it's not available, handle gracefully

if (!window.SocketIO && !cc.SocketIO) {
    console.warn('Socket.IO not available for SocketIOTest');
}

export class SocketIOTestLayer extends cc.Layer {


    constructor() {
        super();



        this._sioClient = null;



        this._sioEndpoint = null;



        this._sioClientStatus = null;
        this.init();
    }

    init() {

        var winSize = director.getWinSize();
        
        var MARGIN = 40;
        var SPACE = 35;
        
        var label = new LabelTTF("SocketIO Test", "Arial", 28);
        label.setPosition(new Point(winSize.width / 2, winSize.height - MARGIN));
        this.addChild(label, 0);
        
        var menuRequest = new Menu();
        menuRequest.setPosition(new Point(0, 0));
        this.addChild(menuRequest);

        // Test to create basic client in the default namespace
        var labelSIOClient = new LabelTTF("Open SocketIO Client", "Arial", 22);
        labelSIOClient.setAnchorPoint(new Point(0,0));
        var itemSIOClient = new MenuItemLabel(labelSIOClient, this.onMenuSIOClientClicked, this);
        itemSIOClient.setPosition(new Point(labelSIOClient.getContentSize().width / 2 + MARGIN, winSize.height - MARGIN - SPACE));
        menuRequest.addChild(itemSIOClient);

        // Test to create a client at the endpoint '/testpoint'
        var labelSIOEndpoint = new LabelTTF("Open SocketIO Endpoint", "Arial", 22);
        labelSIOEndpoint.setAnchorPoint(new Point(0,0));
        var itemSIOEndpoint = new MenuItemLabel(labelSIOEndpoint, this.onMenuSIOEndpointClicked, this);
        itemSIOEndpoint.setPosition(new Point(winSize.width - (labelSIOEndpoint.getContentSize().width / 2 + MARGIN), winSize.height - MARGIN - SPACE));
        menuRequest.addChild(itemSIOEndpoint);

        // Test sending message to default namespace
        var labelTestMessage = new LabelTTF("Send Test Message", "Arial", 22);
        labelTestMessage.setAnchorPoint(new Point(0,0));
        var itemTestMessage = new MenuItemLabel(labelTestMessage, this.onMenuTestMessageClicked, this);
        itemTestMessage.setPosition(new Point(labelTestMessage.getContentSize().width / 2 + MARGIN, winSize.height - MARGIN - 2 * SPACE));
        menuRequest.addChild(itemTestMessage);

        // Test sending message to the endpoint '/testpoint'
        var labelTestMessageEndpoint = new LabelTTF("Test Endpoint Message", "Arial", 22);
        labelTestMessageEndpoint.setAnchorPoint(new Point(0,0));
        var itemTestMessageEndpoint = new MenuItemLabel(labelTestMessageEndpoint, this.onMenuTestMessageEndpointClicked, this);
        itemTestMessageEndpoint.setPosition(new Point(winSize.width - (labelTestMessageEndpoint.getContentSize().width / 2 + MARGIN), winSize.height - MARGIN - 2 * SPACE));
        menuRequest.addChild(itemTestMessageEndpoint);

        // Test sending event 'echotest' to default namespace
        var labelTestEvent = new LabelTTF("Send Test Event", "Arial", 22);
        labelTestEvent.setAnchorPoint(new Point(0,0));
        var itemTestEvent = new MenuItemLabel(labelTestEvent, this.onMenuTestEventClicked, this);
        itemTestEvent.setPosition(new Point(labelTestEvent.getContentSize().width / 2 + MARGIN, winSize.height - MARGIN - 3 * SPACE));
        menuRequest.addChild(itemTestEvent);

        // Test sending event 'echotest' to the endpoint '/testpoint'
        var labelTestEventEndpoint = new LabelTTF("Test Endpoint Event", "Arial", 22);
        labelTestEventEndpoint.setAnchorPoint(new Point(0,0));
        var itemTestEventEndpoint = new MenuItemLabel(labelTestEventEndpoint, this.onMenuTestEventEndpointClicked, this);
        itemTestEventEndpoint.setPosition(new Point(winSize.width - (labelTestEventEndpoint.getContentSize().width / 2 + MARGIN), winSize.height - MARGIN - 3 * SPACE));
        menuRequest.addChild(itemTestEventEndpoint);

        // Test disconnecting basic client
        var labelTestClientDisconnect = new LabelTTF("Disconnect Socket", "Arial", 22);
        labelTestClientDisconnect.setAnchorPoint(new Point(0,0));
        var itemClientDisconnect = new MenuItemLabel(labelTestClientDisconnect, this.onMenuTestClientDisconnectClicked, this);
        itemClientDisconnect.setPosition(new Point(labelTestClientDisconnect.getContentSize().width / 2 + MARGIN, winSize.height - MARGIN - 4 * SPACE));
        menuRequest.addChild(itemClientDisconnect);

        // Test disconnecting the endpoint '/testpoint'
        var labelTestEndpointDisconnect = new LabelTTF("Disconnect Endpoint", "Arial", 22);
        labelTestEndpointDisconnect.setAnchorPoint(new Point(0,0));
        var itemTestEndpointDisconnect = new MenuItemLabel(labelTestEndpointDisconnect, this.onMenuTestEndpointDisconnectClicked, this);
        itemTestEndpointDisconnect.setPosition(new Point(winSize.width - (labelTestEndpointDisconnect.getContentSize().width / 2 + MARGIN), winSize.height - MARGIN - 4 * SPACE));
        menuRequest.addChild(itemTestEndpointDisconnect);

        this._sioClientStatus = new LabelTTF("Not connected...", "Arial", 14);
        this._sioClientStatus.setAnchorPoint(new Point(0, 0));
        this._sioClientStatus.setPosition(new Point(0,winSize.height * .25));
        this.addChild(this._sioClientStatus);

        // Back Menu
        var itemBack = new MenuItemFont("Back", this.toExtensionsMainLayer, this);
        itemBack.setPosition(new Point(winSize.width - 50, 25));
        var menuBack = new Menu(itemBack);
        menuBack.setPosition(new Point(0, 0));
        this.addChild(menuBack);

        return true;
    }

    onExit() {
        if(this._sioEndpoint) {
            this._sioEndpoint.disconnect();
            this._sioEndpoint = null;
        }
        if(this._sioClient) {
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
            log("Socket.IO not available. Please include socket.io-client library.");
            this._sioClientStatus.setString("Socket.IO not available!");
            return;
        }

        //create a client by using this static method, url does not need to contain the protocol
        var sioclient = SocketIO.connect("ws://tools.itharbors.com:4000", {"force new connection" : true});

        //if you need to track multiple sockets it is best to store them with tags in your own array for now
        sioclient.tag = "Test Client";

        //attaching the status label to the socketio client
        //this is only necessary in javascript due to scope within shared event handlers,
        //as 'this' will refer to the socketio client
        sioclient.statusLabel = this._sioClientStatus;

        //register event callbacks
        //this is an example of a handler declared inline
        sioclient.on("connect", function() {
            var msg = sioclient.tag + " Connected!";
            this.statusLabel.setString(msg);
            log(msg);
            sioclient.send(msg);
        });

        //example of a handler that is shared between multiple clients
        sioclient.on("message", this.message);

        sioclient.on("echotest", function(data) {
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
        // Check if SocketIO is available, load if needed
        if (!window.SocketIO) {
            log("Socket.IO not available. Please include socket.io-client library.");
            this._sioClientStatus.setString("Socket.IO not available!");
            return;
        }
        
        // If socket.io isn't loaded yet, load it from CDN first
        if (!window.io) {
            this._sioClientStatus.setString("Loading Socket.IO from CDN...");
            SocketIO.loadAsync().then(() => {
                this._doSocketIOEndpointConnection();
            }).catch((error) => {
                log("Failed to load Socket.IO: " + error.message);
                this._sioClientStatus.setString("Failed to load Socket.IO!");
            });
            return;
        }
        
        this._doSocketIOEndpointConnection();
    }
    
    _doSocketIOEndpointConnection() {

        //repeat the same connection steps for the namespace "testpoint"
        var sioendpoint = SocketIO.connect("ws://tools.itharbors.com:4000/testpoint", {"force new connection" : true});

        //a tag to differentiate in shared callbacks
        sioendpoint.tag = "Test Endpoint";

        sioendpoint.statusLabel = this._sioClientStatus;

        sioendpoint.on("connect", function() {
            var msg = sioendpoint.tag + " Connected!";
            this.statusLabel.setString(msg);
            log(msg);
            sioendpoint.send(msg);
        });

        //register event callbacks
        sioendpoint.on("echotest", function(data) {
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
        if(this._sioClient != null) this._sioClient.send("Hello Socket.IO!");

    }

    onMenuTestMessageEndpointClicked(sender) {

        if(this._sioEndpoint != null) this._sioEndpoint.send("Hello Socket.IO!");

    }

    onMenuTestEventClicked(sender) {

        if(this._sioClient != null) this._sioClient.emit("echotest","[{\"name\":\"myname\",\"type\":\"mytype\"}]");

    }

    onMenuTestEventEndpointClicked(sender) {

        if(this._sioEndpoint != null) this._sioEndpoint.emit("echotest","[{\"name\":\"myname\",\"type\":\"mytype\"}]");

    }

    onMenuTestClientDisconnectClicked(sender) {

        if(this._sioClient != null) {
            this._sioClient.disconnect();
            this._sioClient = null;
        }
    }

    onMenuTestEndpointDisconnectClicked(sender) {

        if(this._sioEndpoint != null) {
            this._sioEndpoint.disconnect();
            this._sioEndpoint = null;
        }
    }

    toExtensionsMainLayer(sender) {
        var scene = new ExtensionsTestScene();
        scene.runThisTest();
    }

};

export function runSocketIOTest() {
    var pScene = new Scene();
    var pLayer = new SocketIOTestLayer();
    pScene.addChild(pLayer);
    director.runScene(pScene);
};