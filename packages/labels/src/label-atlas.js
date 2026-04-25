import { LabelBMFont } from "./label-bmfont";
import { LabelBMFontCanvasRenderCmd } from "./label-bmfont-canvas-render-cmd";
import { LabelBMFontWebGLRenderCmd } from "./label-bmfont-webgl-render-cmd";
import { RendererConfig, Point, Texture2D, color, log, warn, contentScaleFactor, TEXT_ALIGNMENT_LEFT } from "@aspect/core";

export class LabelAtlas extends LabelBMFont {
    _className = "LabelAtlas";

    constructor(strText, charMapFile, itemWidth, itemHeight, startCharMap) {
        super();
        this._imageOffset = new Point(0, 0);
        this._cascadeColorEnabled = true;
        this._cascadeOpacityEnabled = true;

        charMapFile && LabelAtlas.prototype.initWithString.call(this, strText, charMapFile, itemWidth, itemHeight, startCharMap);
    }

    _createRenderCmd() {
        if (RendererConfig.isWebGL)
            return new LabelBMFontWebGLRenderCmd(this);
        else
            return new LabelBMFontCanvasRenderCmd(this);
    }

    _createFntConfig(texture, itemWidth, itemHeight, startCharMap) {
        var fnt = {};
        fnt.commonHeight = itemHeight;

        var fontDefDictionary = fnt.fontDefDictionary = {};

        var textureWidth = texture.pixelsWidth;
        var textureHeight = texture.pixelsHeight;

        var startCharCode = startCharMap.charCodeAt(0);
        var i = 0;
        for (var col = itemHeight; col <= textureHeight; col += itemHeight) {
            for (var row = 0; row < textureWidth; row += itemWidth) {
                fontDefDictionary[startCharCode+i] = {
                    rect: {x: row, y: col - itemHeight, width:itemWidth, height: itemHeight },
                    xOffset: 0,
                    yOffset: 0,
                    xAdvance: itemWidth
                };
                ++i;
            }
        }

        fnt.kerningDict = {};

        return fnt;
    }

    initWithString(strText, charMapFile, itemWidth, itemHeight, startCharMap) {
        var label = strText + "", textureFilename, width, height, startChar;
        var self = this, theString = label || "";
        this._initialString = theString;
        self._string = theString;

        if (itemWidth === undefined) {
            var dict = cc.loader.getRes(charMapFile);
            if (!dict || parseInt(dict["version"], 10) !== 1) {
                log("cc.LabelAtlas.initWithString(): Unsupported version. Upgrade cocos2d version");
                return false;
            }

            textureFilename = cc.path.changeBasename(charMapFile, dict["textureFilename"]);
            var locScaleFactor = contentScaleFactor();
            width = parseInt(dict["itemWidth"], 10) / locScaleFactor;
            height = parseInt(dict["itemHeight"], 10) / locScaleFactor;
            startChar = String.fromCharCode(parseInt(dict["firstChar"], 10));
        } else {
            textureFilename = charMapFile;
            width = itemWidth || 0;
            height = itemHeight || 0;
            startChar = startCharMap || " ";
        }

        var texture;
        if (charMapFile) {
            self._fntFile = "dummy_fnt_file:" + textureFilename;
            var spriteFrameBaseName = textureFilename;
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame(spriteFrameBaseName) || cc.spriteFrameCache.getSpriteFrame(cc.path.basename(spriteFrameBaseName));
            if(spriteFrame) {
                texture = spriteFrame.getTexture();
                this._spriteFrame = spriteFrame;
            } else {
                texture = cc.textureCache.addImage(textureFilename);
            }

            var newConf = this._createFntConfig(texture, width, height, startChar);
            newConf.atlasName = textureFilename;
            self._config = newConf;

            var locIsLoaded = texture.isLoaded();
            self._textureLoaded = locIsLoaded;
            if (!locIsLoaded) {
                texture.addEventListener("load", function (sender) {
                    var self1 = this;
                    self1._textureLoaded = true;
                    //reset the LabelBMFont
                    self1.initWithTexture(sender, self1._initialString.length);
                    self1.setString(self1._initialString, true);
                    self1.dispatchEvent("load");
                }, self);
            }
        } else {
            texture = new Texture2D();
            var image = new Image();
            texture.initWithElement(image);
            self._textureLoaded = false;
        }

        if (self.initWithTexture(texture, theString.length)) {
            self._alignment = TEXT_ALIGNMENT_LEFT;
            self._imageOffset = new Point(0, 0);
            self._width = -1;

            self._realOpacity = 255;
            self._realColor = color(255, 255, 255, 255);

            self._contentSize.width = 0;
            self._contentSize.height = 0;

            self.setString(theString, true);
            return true;
        }
        return false;
    }

    setFntFile() {
        warn("setFntFile doesn't support with LabelAtlas.");
    }
}
