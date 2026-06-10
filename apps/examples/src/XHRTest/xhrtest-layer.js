/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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

import { winSize } from "../constants";
import { log, ServiceLocator } from "@aspect/core";
import { TextBMFont } from "@aspect/ccui";
import { s_simpleFont_fnt } from "../resources";
import { BaseTestLayer } from "../BaseTestLayer/BaseTestLayer";

export class XHRTestLayer extends BaseTestLayer {
  constructor() {
    super();
  }

  onEnter() {
    //----start----onEnter
    super.onEnter();

    this.sendGetRequest();
    this.sendPostPlainText();
    this.sendPostForms();
  }

  ensureLeftAligned(label) {
    label.anchorX = 0;
    label.anchorY = 1;
  }

  streamXHREventsToLabel(xhr, label, textbox, method, title) {
    // Simple events
    ["loadstart", "abort", "error", "load", "loadend", "timeout"].forEach(
      function (eventname) {
        xhr["on" + eventname] = function () {
          label.string += "\nEvent : " + eventname;
        };
      }
    );

    // Special event
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status <= 207) {
        var httpStatus = xhr.statusText;
        var response = xhr.responseText.substring(0, 100) + "...";
        log("title:" + title + ", response:\n" + xhr.responseText);
        textbox.string = method + " Response (100 chars):\n";
        textbox.string += response;
        label.string += "\nStatus: Got " + method + " response! " + httpStatus;
      }
    };
  }

  sendGetRequest() {
    var statusGetLabel = new TextBMFont("Status:", s_simpleFont_fnt);
    statusGetLabel.fontSize = 12;
    this.addChild(statusGetLabel, 1);

    statusGetLabel.x = 10;
    statusGetLabel.y = winSize.height - 100;
    this.ensureLeftAligned(statusGetLabel);
    statusGetLabel.setString("Status: Send Get Request to httpbin.org");

    var responseLabel = new TextBMFont("", s_simpleFont_fnt);
    responseLabel.fontSize = 16;
    this.addChild(responseLabel, 1);

    this.ensureLeftAligned(responseLabel);
    responseLabel.x = 10;
    responseLabel.y = winSize.height / 2;

    var xhr = ServiceLocator.loader.getXMLHttpRequest();
    this.streamXHREventsToLabel(
      xhr,
      statusGetLabel,
      responseLabel,
      "GET",
      "sendGetRequest"
    );
    // 5 seconds for timeout
    xhr.timeout = 5000;

    //set arguments with <URL>?xxx=xxx&yyy=yyy
    xhr.open("GET", "http://httpbin.org/gzip", true);
    xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");

    xhr.send();
  }

  sendPostPlainText() {
    var statusPostLabel = new TextBMFont("Status:", s_simpleFont_fnt);
    statusPostLabel.fontSize = 12;
    this.addChild(statusPostLabel, 1);

    statusPostLabel.x = (winSize.width / 10) * 3;
    statusPostLabel.y = winSize.height - 100;
    this.ensureLeftAligned(statusPostLabel);
    statusPostLabel.setString(
      "Status: Send Post Request to httpbin.org with plain text"
    );

    var responseLabel = new TextBMFont("", s_simpleFont_fnt);
    responseLabel.fontSize = 16;
    this.addChild(responseLabel, 1);
    this.ensureLeftAligned(responseLabel);
    responseLabel.x = (winSize.width / 10) * 3;
    responseLabel.y = winSize.height / 2;

    var xhr = ServiceLocator.loader.getXMLHttpRequest();
    this.streamXHREventsToLabel(
      xhr,
      statusPostLabel,
      responseLabel,
      "POST",
      "sendPostPlainText"
    );

    xhr.open("POST", "http://httpbin.org/post");

    //set Content-type "text/plain;charset=UTF-8" to post plain text
    xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    xhr.send("plain text message");
  }

  sendPostForms() {
    var statusPostLabel = new TextBMFont("Status:", s_simpleFont_fnt);
    statusPostLabel.fontSize = 12;
    this.addChild(statusPostLabel, 1);

    statusPostLabel.x = (winSize.width / 10) * 7;
    statusPostLabel.y = winSize.height - 100;
    this.ensureLeftAligned(statusPostLabel);
    statusPostLabel.setString(
      "Status: Send Post Request to httpbin.org width form data"
    );

    var responseLabel = new TextBMFont("", s_simpleFont_fnt);
    responseLabel.fontSize = 16;
    this.addChild(responseLabel, 1);

    this.ensureLeftAligned(responseLabel);
    responseLabel.x = (winSize.width / 10) * 7;
    responseLabel.y = winSize.height / 2;

    var xhr = ServiceLocator.loader.getXMLHttpRequest();
    this.streamXHREventsToLabel(
      xhr,
      statusPostLabel,
      responseLabel,
      "POST",
      "sendPostForms"
    );

    xhr.open("POST", "http://httpbin.org/post");
    //set Content-Type "application/x-www-form-urlencoded" to post form data
    //mulipart/form-data for upload
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    /**
        form : {
            "a" : "hello",
            "b" : "world"
        }
        **/
    var args = "a=hello&b=world";
    xhr.send(args);
  }

  scrollViewDidScroll(view) {}
  scrollViewDidZoom(view) {}

  title() {
    return "XMLHttpRequest Test";
  }

  subtitle() {
    return "";
  }

  numberOfPendingTests() {
    return 0;
  }

  getTestNumber() {
    return 0;
  }
}
