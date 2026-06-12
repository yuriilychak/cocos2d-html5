/****************************************************************************
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

import { UIMainLayer } from "../uimain-layer";
import { Size, log } from "@aspect/core";
import { Button, Layout, ListView, ScrollView } from "@aspect/ccui";

export class UIListViewTest_Vertical extends UIMainLayer {
  constructor() {
    super();
    this._spawnCount = 8;
    this._totalCount = 100;
    this._bufferZone = 50;
    this._updateInterval = 0.01;
    this._updateTimer = 0;
    this._lastContentPosY = 0;
    this._reuseItemOffset = 0;
    this._initializeListSize = false;
  }

  init() {
    if (super.init()) {
      var widgetSize = this._widget.getContentSize();

      this._topDisplayLabel.string = "We only create 8 item templates here.";
      this._topDisplayLabel.x = widgetSize.width / 2.0;
      this._topDisplayLabel.y =
        widgetSize.height / 2.0 + this._topDisplayLabel.height * 1.5;

      this._array = [];
      for (var i = 0; i < this._totalCount; ++i) {
        this._array.push("item_" + i);
      }

      // Create the list view
      this.listView = new ListView();
      // set list view ex direction
      this.listView.setDirection(ScrollView.DIR_VERTICAL);
      this.listView.setTouchEnabled(true);
      this.listView.setBounceEnabled(true);
      this.listView.setBackGroundImage("ccs-res/cocosui/green_edit.png");
      this.listView.setBackGroundImageScale9Enabled(true);
      this.listView.setContentSize(new Size(240, 130));
      this.listView.x =
        (widgetSize.width - this.listView.width) / 2;
      this.listView.y =
        (widgetSize.height - this.listView.height) / 2;
      this.listView.addEventListener(this.selectedItemEvent, this);
      this._mainNode.addChild(this.listView);

      // create model
      var default_button = new Button();
      default_button.setName("TextButton");
      default_button.setTouchEnabled(true);
      default_button.loadTextures(
        "ccs-res/cocosui/backtotoppressed.png",
        "ccs-res/cocosui/backtotopnormal.png",
        ""
      );

      var default_item = new Layout();
      default_item.setTouchEnabled(true);
      default_item.setContentSize(default_button.getContentSize());
      default_item.width = this.listView.width;
      default_button.x = default_item.width / 2;
      default_button.y = default_item.height / 2;
      default_item.addChild(default_button);

      // set model
      this.listView.setItemModel(default_item);
      // set all items layout gravity
      this.listView.setGravity(ListView.GRAVITY_CENTER_VERTICAL);

      for (i = 0; i < this._totalCount; ++i) {
        if (i < this._spawnCount) {
          var item = default_item.clone();
          item.tag = i;
          var btn = item.getChildByName("TextButton");
          btn.setTitleText(this._array[i]);
          this.listView.pushBackCustomItem(item);
        }
      }

      var spacing = 4;
      this.listView.setItemsMargin(spacing);
      this._itemTemplateHeight = default_item.getContentSize().height;
      this._reuseItemOffset =
        (this._itemTemplateHeight + spacing) * this._spawnCount;

      this.scheduleUpdate();
      return true;
    }
    return false;
  }

  onEnter() {
    super.onEnter();
    //we must call foreceDoLayout in onEnter method in h5.
    this.listView.forceDoLayout();
    var totalHeight =
      this._itemTemplateHeight * this._totalCount + (this._totalCount - 1) * 4;
    this.listView
      .getInnerContainer()
      .setContentSize(
        new Size(this.listView.getInnerContainerSize().width, totalHeight)
      );
    this.listView.jumpToTop();
  }

  getItemPositionYInView(item) {
    var worldPos = item.parent.convertToWorldSpaceAR(item.getPosition());
    var viewPos = this.listView.convertToNodeSpaceAR(worldPos);
    return viewPos.y;
  }

  updateItem(itemID, templateID) {
    var itemTemplate = this.listView.getItems()[templateID];
    var btn = itemTemplate.getChildByName("TextButton");
    itemTemplate.tag = itemID;
    btn.setTitleText(this._array[itemID]);
  }

  update(dt) {
    this._updateTimer += dt;
    if (this._updateTimer < this._updateInterval) {
      return;
    }
    this._updateTimer = 0;

    //here 4 is the spacing between items
    var totalHeight =
      this._itemTemplateHeight * this._totalCount + (this._totalCount - 1) * 4;
    var listViewHeight = this.listView.getContentSize().height;
    var items = this.listView.getItems();
    var isDown =
      this.listView.getInnerContainer().getPosition().y < this._lastContentPosY;

    for (var i = 0; i < this._spawnCount && i < this._totalCount; ++i) {
      var item = items[i];
      var itemPos = this.getItemPositionYInView(item);
      if (isDown) {
        if (
          itemPos < -this._bufferZone &&
          item.getPosition().y + this._reuseItemOffset < totalHeight
        ) {
          var itemID = item.tag - items.length;
          item.y = item.y + this._reuseItemOffset;
          this.updateItem(itemID, i);
        }
      } else {
        if (
          itemPos > this._bufferZone + listViewHeight &&
          item.y - this._reuseItemOffset >= 0
        ) {
          item.y = item.y - this._reuseItemOffset;
          itemID = item.tag + items.length;
          this.updateItem(itemID, i);
        }
      }
    }

    this._lastContentPosY = this.listView.getInnerContainer().getPosition().y;
  }

  selectedItemEvent(sender, type) {
    switch (type) {
      case ListView.EVENT_SELECTED_ITEM:
        var listViewEx = sender;
        var item = listViewEx.getItem(listViewEx.getCurSelectedIndex());
        log("select child index = " + item.tag);
        break;

      default:
        break;
    }
  }
}
