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
var Ball = class Ball extends cc.Sprite {
    constructor() {
        super();
        this._velocity = new cc.Point(0,0);
        this._radius = 0;
    }

    radius() {
        return this._radius;
    }
    setRadius(rad) {
        this._radius = rad;
    }
    move(delta) {
	    this.x += this._velocity.x * delta;
	    this.y += this._velocity.y * delta;
        var winSize = cc.director.getWinSize();
        if (this.x > winSize.width - this.radius()) {
            this.x = winSize.width - this.radius();
            this._velocity.x *= -1;
        } else if (this.x < this.radius()) {
            this.x = this.radius();
            this._velocity.x *= -1;
        }
    }
    collideWithPaddle(paddle) {
        var paddleRect = paddle.rect();

        paddleRect.x += paddle.x;
        paddleRect.y += paddle.y;

        var lowY = cc.Rect.getMinY(paddleRect);
        var midY = cc.Rect.getMidY(paddleRect);
        var highY = cc.Rect.getMaxY(paddleRect);

        var leftX = cc.Rect.getMinX(paddleRect);
        var rightX = cc.Rect.getMaxX(paddleRect);

        if ((this.x > leftX) && (this.x < rightX)) {
            var hit = false;
            var angleOffset = 0.0;
            if ((this.y > midY) && (this.y <= (highY + this.radius()))) {
                this.y = highY + this.radius();
                hit = true;
                angleOffset = Math.PI / 2;
            } else if (this.y < midY && this.y >= lowY - this.radius()) {
                this.y = lowY - this.radius();
                hit = true;
                angleOffset = -Math.PI / 2;
            }

            if (hit) {
                var hitAngle = cc.Point.toAngle(new cc.Point(paddle.x - this.x, paddle.y - this.y)) + angleOffset;

                var scalarVelocity = cc.Point.length(this._velocity) * 1.00000005;
                var velocityAngle = -cc.Point.toAngle(this._velocity) + 0.00000005 * hitAngle;
                //this._velocity = -this._velocity.y;
                this._velocity = cc.Point.mult(cc.Point.forAngle(velocityAngle), scalarVelocity);
            }
        }
    }
    setVelocity(velocity) {
        this._velocity = velocity;
    }
    getVelocity() {
        return this._velocity;
    }

};
Ball.ballWithTexture = function (texture) {
    var ball = new Ball();
    ball.initWithTexture(texture);
    if (texture instanceof cc.Texture2D)
        ball.setRadius(texture.width / 2);
    else if ((texture instanceof HTMLImageElement) || (texture instanceof HTMLCanvasElement))
        ball.setRadius(texture.width / 2);
    return ball;
};
