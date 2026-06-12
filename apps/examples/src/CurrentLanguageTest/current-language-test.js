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
import { ServiceLocator } from "@aspect/core";
import { BaseTestLayer } from "../BaseTestLayer/BaseTestLayer";
import { TextBMFont } from "@aspect/ccui";
import { s_simpleFont_fnt } from "../resources";

export class CurrentLanguageTest extends BaseTestLayer {
    constructor() {
        super();
        this._showNavButtons = false;

        var s = ServiceLocator.director.getWinSize();

        var labelLanguage = new TextBMFont("", s_simpleFont_fnt);
        labelLanguage.fontSize = 20;
        labelLanguage.x = s.width / 2;
	    labelLanguage.y = s.height / 2;

        var currentLanguageType = ServiceLocator.sys.language;
        switch (currentLanguageType) {
            case ServiceLocator.sys.LANGUAGE_ENGLISH:
                labelLanguage.string = "current language is English";
                break;
            case ServiceLocator.sys.LANGUAGE_CHINESE:
                labelLanguage.string = "current language is Chinese";
                break;
            case ServiceLocator.sys.LANGUAGE_FRENCH:
                labelLanguage.string = "current language is French";
                break;
            case ServiceLocator.sys.LANGUAGE_GERMAN:
                labelLanguage.string = "current language is German";
                break;
            case ServiceLocator.sys.LANGUAGE_ITALIAN:
                labelLanguage.string = "current language is Italian";
                break;
            case ServiceLocator.sys.LANGUAGE_RUSSIAN:
                labelLanguage.string = "current language is Russian";
                break;
            case ServiceLocator.sys.LANGUAGE_SPANISH:
                labelLanguage.string = "current language is Spanish";
                break;
        }

        this.addChild(labelLanguage);
    }

    title() {
        return "Current Language Test";
    }

    subtitle() {
        return "";
    }

    onRestartCallback() {
        ServiceLocator.director.getRunningScene().runThisTest();
    }

    onNextCallback() {
        ServiceLocator.director.getRunningScene().runThisTest();
    }

    onBackCallback() {
        ServiceLocator.director.getRunningScene().runThisTest();
    }

    numberOfPendingTests() {
        return 0;
    }

    getTestNumber() {
        return 0;
    }
}
