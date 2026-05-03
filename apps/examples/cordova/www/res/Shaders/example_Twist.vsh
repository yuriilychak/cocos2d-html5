// http://www.cocos2d-iphone.org

attribute vec4 aVertex;

void main()
{
    gl_Position = CC_PMatrix * aVertex;
}
