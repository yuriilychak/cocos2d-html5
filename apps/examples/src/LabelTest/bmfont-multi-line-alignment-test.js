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

import { AtlasDemo } from "./atlas-demo";
import { ArrowsMax, ArrowsMin, CenterAlign, LeftAlign, LineBreaks, LineBreaksExample, LongSentences, LongSentencesExample, Mixed, MixedExample, RightAlign, alignmentItemPadding, chineseExampleText, chineseMixEnglish, chineseMixEnglishText, chineseText, menuItemPaddingCenter, mixAllLanguage, mixAllLanguageText } from "./label-test-helpers";
import { s_resprefix } from "../resources";
import { director, winSize } from "../constants";
import { Color, EventListener, EventManager, Point, Rect, Sprite, Sys } from "@aspect/core";
import { LabelBMFont } from "@aspect/labels";
import { Menu, MenuItemFont } from "@aspect/menus";

export class BMFontMultiLineAlignmentTest extends AtlasDemo {
    constructor() {
        //----start11----ctor
        super();

        this.labelShouldRetain = null;

        this.arrowsBarShouldRetain = null;

        this.arrowsShouldRetain = null;

        this.lastSentenceItem = null;

        this.lastAlignmentItem = null;

        this.lineBreakFlag = false;

        EventManager.getInstance().addListener({
            event: EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan: this.onTouchesBegan.bind(this),
            onTouchesMoved: this.onTouchesMoved.bind(this),
            onTouchesEnded: this.onTouchesEnded.bind(this)
        }, this);
        if ('touches' in Sys.getInstance().capabilities){
            EventManager.getInstance().addListener({
                event: EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesBegan: this.onTouchesBegan.bind(this),
                onTouchesMoved: this.onTouchesMoved.bind(this),
                onTouchesEnded: this.onTouchesEnded.bind(this)
            }, this);
        } else if ('mouse' in Sys.getInstance().capabilities)
            EventManager.getInstance().addListener({
                event: EventListener.MOUSE,
                onMouseDown: this.onMouseDown.bind(this),
                onMouseMove: this.onMouseMove.bind(this),
                onMouseUp: this.onMouseUp.bind(this)
            }, this);

        // ask director the the window size
        var size = director.getWinSize();

        // create and initialize a Label
        this.labelShouldRetain = new LabelBMFont(LongSentencesExample, s_resprefix + "fonts/markerFelt.fnt", size.width / 2, cc.TEXT_ALIGNMENT_CENTER, new Point(0, 0));
        this.arrowsBarShouldRetain = new Sprite(s_resprefix + "Images/arrowsBar.png");
        this.arrowsShouldRetain = new Sprite(s_resprefix + "Images/arrows.png");

        MenuItemFont.setFontSize(20);
        var longSentences = new MenuItemFont("Long Flowing Sentences", this.onStringChanged, this);
        var lineBreaks = new MenuItemFont("Short Sentences With Intentional Line Breaks", this.onStringChanged, this);
        var mixed = new MenuItemFont("Long Sentences Mixed With Intentional Line Breaks", this.onStringChanged.bind(this)); // another way to pass 'this'
        var changeChineseItem = new MenuItemFont("change chinese", this.onStringChanged, this);
        var mixEnglishItem = new MenuItemFont("change chinesemixEnglish", this.onStringChanged, this);
        var mixAllLanItem = new MenuItemFont("change mixAllLan", this.onStringChanged, this);

        var stringMenu = new Menu(longSentences, lineBreaks, mixed, changeChineseItem,mixEnglishItem, mixAllLanItem);
        stringMenu.alignItemsVertically();

        var setLineBreakItem = new MenuItemFont("setLineBreakWithoutSpace", this.onLineBreakChanged, this);
        var setScale = new MenuItemFont("setScale", this.onScaleChange, this);
        var lineBreakMenu = new Menu(setLineBreakItem, setScale);
        lineBreakMenu.x = 100;
        lineBreakMenu.y = winSize.height / 2;
        lineBreakMenu.alignItemsVertically();

        longSentences.color = new Color(255, 0, 0);
        this.lastSentenceItem = longSentences;
        longSentences.tag = LongSentences;
        lineBreaks.tag = LineBreaks;
        mixed.tag = Mixed;
        changeChineseItem.tag = chineseText;
        mixEnglishItem.tag = chineseMixEnglish;
        mixAllLanItem.tag = mixAllLanguage;

        MenuItemFont.setFontSize(30);

        var left = new MenuItemFont("Left", this.onAlignmentChanged, this);
        var center = new MenuItemFont("Center", this.onAlignmentChanged, this);
        var right = new MenuItemFont("Right", this.onAlignmentChanged.bind(this));    // another way to pass 'this'
        var alignmentMenu = new Menu(left, center, right);
        alignmentMenu.alignItemsHorizontallyWithPadding(alignmentItemPadding);

        center.color = new Color(255, 0, 0);
        this.lastAlignmentItem = center;
        left.tag = LeftAlign;
        center.tag = CenterAlign;
        right.tag = RightAlign;

        // position the label on the center of the screen
        this.labelShouldRetain.x = size.width / 2;
        this.labelShouldRetain.y = size.height / 2;

        this.arrowsBarShouldRetain.visible = false;

        var arrowsWidth = (ArrowsMax - ArrowsMin) * size.width;
        this.arrowsBarShouldRetain.scaleX = arrowsWidth / this.arrowsBarShouldRetain.width;
        this.arrowsBarShouldRetain.anchorX = 0;
        this.arrowsBarShouldRetain.anchorY = 0.5;
        this.arrowsBarShouldRetain.x = ArrowsMin * size.width;
        this.arrowsBarShouldRetain.y = this.labelShouldRetain.y;

        this.arrowsShouldRetain.x = this.arrowsBarShouldRetain.x;
	    this.arrowsShouldRetain.y = this.arrowsBarShouldRetain.y;

        stringMenu.x = size.width / 2;
        stringMenu.y = size.height - menuItemPaddingCenter;
        alignmentMenu.x = size.width / 2;
        alignmentMenu.y = menuItemPaddingCenter + 15;

        this.addChild(this.labelShouldRetain);
        this.addChild(this.arrowsBarShouldRetain);
        this.addChild(this.arrowsShouldRetain);
        this.addChild(stringMenu);
        this.addChild(alignmentMenu);
        this.addChild(lineBreakMenu);


        //----end11----
    }
    __title(){
        return 'The scroll bar';
    }
    title() {
        return "";
    }
    subtitle() {
        return "";
    }

    onScaleChange(sener){
        if (this.labelShouldRetain.getScale() > 1)
        {
            this.labelShouldRetain.setScale(1.0);
        }
        else
        {
            this.labelShouldRetain.setScale(2.0);
        }

    }
    onLineBreakChanged(sender){
        this.lineBreakFlag = !this.lineBreakFlag;
        this.labelShouldRetain.setLineBreakWithoutSpace(this.lineBreakFlag);
    }
    onStringChanged(sender) {
        this.lastSentenceItem.color = new Color(255, 255, 255);
        sender.color = new Color(255, 0, 0);
        this.lastSentenceItem = sender;

        switch (sender.tag) {
            case LongSentences:
                this.labelShouldRetain.setString(LongSentencesExample);
                this.labelShouldRetain.setFntFile(s_resprefix + "fonts/markerFelt.fnt");
                break;
            case LineBreaks:
                this.labelShouldRetain.setString(LineBreaksExample);
                this.labelShouldRetain.setFntFile(s_resprefix + "fonts/markerFelt.fnt");
                break;
            case Mixed:
                this.labelShouldRetain.setString(MixedExample);
                this.labelShouldRetain.setFntFile(s_resprefix + "fonts/markerFelt.fnt");
                break;
            case chineseText:
                this.labelShouldRetain.setFntFile(s_resprefix + "fonts/arial-unicode-26.fnt");
                this.labelShouldRetain.setString(chineseExampleText);
                break;
            case chineseMixEnglish:
                this.labelShouldRetain.setFntFile(s_resprefix + "fonts/arial-unicode-26.fnt");
                this.labelShouldRetain.setString(chineseMixEnglishText);
                break;
            case mixAllLanguage:
                this.labelShouldRetain.setFntFile(s_resprefix + "fonts/arial-unicode-26.fnt");
                this.labelShouldRetain.setString(mixAllLanguageText);
                break;
            default:
                break;
        }

        this.snapArrowsToEdge();
    }
    onAlignmentChanged(sender) {
        var item = sender;
        this.lastAlignmentItem.color = new Color(255, 255, 255);
        item.color = new Color(255, 0, 0);
        this.lastAlignmentItem = item;

        switch (item.tag) {
            case LeftAlign:
                this.labelShouldRetain.textAlign = cc.TEXT_ALIGNMENT_LEFT;
                break;
            case CenterAlign:
                this.labelShouldRetain.textAlign = cc.TEXT_ALIGNMENT_CENTER;
                break;
            case RightAlign:
                this.labelShouldRetain.textAlign = cc.TEXT_ALIGNMENT_RIGHT;
                break;
            default:
                break;
        }

        this.snapArrowsToEdge();
    }
    onTouchesBegan(touches) {
        var touch = touches[0];
        var location = touch.getLocation();

        if (Rect.containsPoint(this.arrowsShouldRetain.getBoundingBox(), location)) {
            this.arrowsBarShouldRetain.visible = true;
        }
    }
    onTouchesEnded() {
        this.arrowsBarShouldRetain.visible = false;
    }
    onTouchesMoved(touches) {
        var touch = touches[0];
        var location = touch.getLocation();

        var winSize = director.getWinSize();

        this.arrowsShouldRetain.x = Math.max(Math.min(location.x, ArrowsMax * winSize.width), ArrowsMin * winSize.width);

        this.labelShouldRetain.boundingWidth = Math.abs(this.arrowsShouldRetain.getPosition().x - this.labelShouldRetain.getPosition().x) * 2;
    }

    onMouseDown(event) {
        var location = event.getLocation();

        if (Rect.containsPoint(this.arrowsShouldRetain.getBoundingBox(), location)) {
            this.arrowsBarShouldRetain.visible = true;
        }
    }
    onMouseMove(event) {
        if(!event.getButton || event.getButton() != cc.EventMouse.BUTTON_LEFT)
            return;

        var location = event.getLocation();
        var winSize = director.getWinSize();

        this.arrowsShouldRetain.x = Math.max(Math.min(location.x, ArrowsMax * winSize.width), ArrowsMin * winSize.width);
        this.labelShouldRetain.boundingWidth = Math.abs(this.arrowsShouldRetain.x - this.labelShouldRetain.x) * 2;
    }
    onMouseUp(event) {
        //this.snapArrowsToEdge();
        this.arrowsBarShouldRetain.visible = false;
    }

    snapArrowsToEdge() {
        var winSize = director.getWinSize();
        this.arrowsShouldRetain.x = ArrowsMin * winSize.width;
        this.arrowsShouldRetain.y = this.arrowsBarShouldRetain.y;
    }

}
