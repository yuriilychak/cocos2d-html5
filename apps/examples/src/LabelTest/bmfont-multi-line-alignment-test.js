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
import { Color, EventListener, EventManager, EventMouse, Point, Rect, Sprite, Sys, TEXT_ALIGNMENT_CENTER, TEXT_ALIGNMENT_LEFT, TEXT_ALIGNMENT_RIGHT } from "@aspect/core";
import { LabelBMFont } from "@aspect/labels";
import { ButtonLayout } from "../button-layout";

export class BMFontMultiLineAlignmentTest extends AtlasDemo {
    constructor() {
        //----start11----ctor
        super();

        this.labelShouldRetain = null;

        this.arrowsBarShouldRetain = null;

        this.arrowsShouldRetain = null;

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
        this.labelShouldRetain = new LabelBMFont(LongSentencesExample, s_resprefix + "fonts/markerFelt.fnt", size.width / 2, TEXT_ALIGNMENT_CENTER, new Point(0, 0));
        this.arrowsBarShouldRetain = new Sprite(s_resprefix + "Images/arrowsBar.png");
        this.arrowsShouldRetain = new Sprite(s_resprefix + "Images/arrows.png");

        const STRING_LABELS = [
            "Long Flowing Sentences",
            "Short w/ Line Breaks",
            "Long+Line Breaks Mixed",
            "Chinese",
            "Chinese Mix English",
            "Mix All Languages"
        ];
        const STRING_TAGS = [LongSentences, LineBreaks, Mixed, chineseText, chineseMixEnglish, mixAllLanguage];
        let lastStringIdx = 0;
        const stringLayout = new ButtonLayout(
            STRING_LABELS.map((label, i) => ({
                label: i === 0 ? `> ${label}` : label,
                tintDefault: new Color(0x44, 0x55, 0x77),
                tintPressed: new Color(0x22, 0x33, 0x55)
            })),
            140, "String",
            (i) => {
                stringLayout.setLabelText(lastStringIdx, STRING_LABELS[lastStringIdx]);
                lastStringIdx = i;
                stringLayout.setLabelText(i, `> ${STRING_LABELS[i]}`);
                this.applyStringChange(STRING_TAGS[i]);
            }
        );
        stringLayout.y = size.height - stringLayout.height;
        this.addChild(stringLayout);

        const ALIGN_LABELS = ["Left", "Center", "Right"];
        const ALIGN_TAGS = [LeftAlign, CenterAlign, RightAlign];
        let lastAlignIdx = 1;
        const alignLayout = new ButtonLayout(
            ALIGN_LABELS.map((label, i) => ({
                label: i === 1 ? `> ${label}` : label,
                tintDefault: new Color(0x44, 0x55, 0x77),
                tintPressed: new Color(0x22, 0x33, 0x55)
            })),
            80, "Alignment",
            (i) => {
                alignLayout.setLabelText(lastAlignIdx, ALIGN_LABELS[lastAlignIdx]);
                lastAlignIdx = i;
                alignLayout.setLabelText(i, `> ${ALIGN_LABELS[i]}`);
                this.applyAlignmentChange(ALIGN_TAGS[i]);
            }
        );
        this.addChild(alignLayout);

        const lineBreakLayout = new ButtonLayout(
            [
                { label: "Set Line Break", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) },
                { label: "Set Scale", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) }
            ],
            120, "Line Break",
            (i) => {
                if (i === 0) this.onLineBreakChanged();
                else this.onScaleChange();
            }
        );
        lineBreakLayout.x = 8;

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
        this.addChild(stringLayout);
        this.addChild(alignLayout);
        this.addChild(lineBreakLayout);


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
    applyStringChange(tag) {
        switch (tag) {
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
    applyAlignmentChange(tag) {
        switch (tag) {
            case LeftAlign:
                this.labelShouldRetain.textAlign = TEXT_ALIGNMENT_LEFT;
                break;
            case CenterAlign:
                this.labelShouldRetain.textAlign = TEXT_ALIGNMENT_CENTER;
                break;
            case RightAlign:
                this.labelShouldRetain.textAlign = TEXT_ALIGNMENT_RIGHT;
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
        if(!event.getButton || event.getButton() != EventMouse.BUTTON_LEFT)
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
