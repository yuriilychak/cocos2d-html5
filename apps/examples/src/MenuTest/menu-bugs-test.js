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
import { Director, Layer, log } from "@aspect/core";
import { Menu, MenuItemFont } from "@aspect/menus";


export class MenuBugsTest extends Layer {
     constructor(){
         super();

         var issue1410 = new MenuItemFont("Issue 1410", this.onIssue1410MenuCallback, this);
         var issue1410_2 = new MenuItemFont("Issue 1410 #2", this.onIssue1410v2MenuCallback, this);
         var back = new MenuItemFont("Back", this.onBackMenuCallback, this);

         var menu = new Menu(issue1410, issue1410_2, back);
         this.addChild(menu);
         menu.alignItemsVertically();

         var s = Director.getInstance().getWinSize();
         menu.x = s.width/2;
         menu.y = s.height/2;
     }

    onIssue1410MenuCallback(sender){
        var menu = sender.parent;
        menu.setEnabled(false);
        menu.setEnabled(true);

        log("NO CRASHES");
    }

    onIssue1410v2MenuCallback(sender){
        var menu = sender.parent;
        menu.setEnabled(true);
        menu.setEnabled(false);

        log("NO CRASHES. AND MENU SHOULD STOP WORKING");
    }

    onBackMenuCallback(sender){
        this.parent.switchTo(0, false);
    }

}
