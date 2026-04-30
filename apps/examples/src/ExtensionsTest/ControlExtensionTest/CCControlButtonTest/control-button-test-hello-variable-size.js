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

export class ControlButtonTest_HelloVariableSize extends ControlScene {
    init() {
        if (super.init()) {
            var screenSize = director.getWinSize();

            // Defines an array of title to create buttons dynamically
            var stringArray = ["Hello", "Variable", "Size", "!"];

            var layer = new Node();
            this.addChild(layer, 1);

            var total_width = 0, height = 0;

            // For each title in the array
            for (var i = 0; i < stringArray.length; i++) {
                var button = this.standardButtonWithTitle(stringArray[i]);

                if (i == 0) {
                    button.opacity = 50;
                    //todo setColor not work in canvas
                    //button.color = new Color(0, 255, 0);
                }
                else if (i == 1) {
                    button.opacity = 200;
                    //todo setColor not work in canvas
                    //button.color = new Color(0, 255, 0);
                }
                else if (i == 2) {
                    button.opacity = 100;
                    //todo setColor not work in canvas
                    //button.color = new Color(0, 0, 255);
                }

                button.x = total_width + button.width / 2;
                button.y = button.height / 2;
                layer.addChild(button);

                // Compute the size of the layer
                height = button.height;
                total_width += button.width;
            }

            layer.anchorX = 0.5;
            layer.anchorY = 0.5;
            layer.width = total_width;
            layer.height = height;
            layer.x = screenSize.width / 2.0;
            layer.y = screenSize.height / 2.0;

            // Add the black background
            var background = new Scale9Sprite(s_extensions_buttonBackground);
            background.width = total_width + 14;
            background.height = height + 14;
            background.x = screenSize.width / 2.0;
            background.y = screenSize.height / 2.0;
            this.addChild(background);
            return true;
        }
        return false;
    }
    // Creates and return a button with a default background and title color.
    standardButtonWithTitle(title) {
        // Creates and return a button with a default background and title color.
        var backgroundButton = new Scale9Sprite(s_extensions_button);
        var backgroundHighlightedButton = new Scale9Sprite(s_extensions_buttonHighlighted);

        var titleButton = new LabelTTF(title, "Marker Felt", 30);

        titleButton.color = new Color(159, 168, 176);

        var button = new ControlButton(titleButton, backgroundButton);
        button.setBackgroundSpriteForState(backgroundHighlightedButton, CONTROL_STATE_HIGHLIGHTED);
        button.setTitleColorForState(Color.WHITE, CONTROL_STATE_HIGHLIGHTED);

        return button;
    }

}
