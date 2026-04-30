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

export class DoubleSprite extends cc.Sprite {

    constructor(fileName) {
	    super(fileName);


        this.HD = false;
        //var resolutionType = texture.getResolutionType();
        //this.HD = ( resolutionType == cc.kCCResolutioniPhoneRetinaDisplay || resolutionType == kCCResolutioniPadRetinaDisplay );
    }

    setContentSize(size) {
        var newSize = new cc.Size(size.width, size.height);
        // If Retina Display and Texture is in HD then scale the vertex rect
        if (cc.contentScaleFactor() == 2 && !this.HD) {
            newSize.width *= 2;
            newSize.height *= 2;
        }
        super.setContentSize(newSize);
    }

    get width() {
        return super._getWidth();
    }

    get height() {
        return super._getHeight();
    }
    
	set width(value) {
		// If Retina Display and Texture is in HD then scale the vertex rect
		if (cc.contentScaleFactor() == 2 && !this.HD) {
			value *= 2;
		}
		super._setWidth(value);
	}
	set height(value) {
		// If Retina Display and Texture is in HD then scale the vertex rect
		if (cc.contentScaleFactor() == 2 && !this.HD) {
			value *= 2;
		}
		super._setHeight(value);
	}

    setVertexRect(rect) {
        // If Retina Display and Texture is in HD then scale the vertex rect
        if (cc.contentScaleFactor() == 2 && !this.HD) {
            rect.width *= 2;
            rect.height *= 2;
        }
        super.setVertexRect(rect);
    }

}
