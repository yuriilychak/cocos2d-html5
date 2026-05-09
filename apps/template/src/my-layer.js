import { Layer, Sprite, LabelTTF, Director, log } from "@aspect/core";
import { s_HelloWorld } from "./resource";

export class MyLayer extends Layer {
  constructor() {
    super();
    this.helloLabel = null;
    this.sprite = null;
  }

  init() {
    //////////////////////////////
    // 1. super init first
    super.init();

    /////////////////////////////
    // 2. add a menu item with "X" image, which is clicked to quit the program
    //    you may modify it.
    // ask director the window size
    const size = Director.getInstance().getWinSize();

    /////////////////////////////
    // 3. add your codes below...
    // add a label shows "Hello World"
    // create and initialize a label
    this.helloLabel = new LabelTTF("Hello World", "Impact", 38);
    // position the label on the center of the screen
    this.helloLabel.setPosition(size.width / 2, size.height - 40);
    // add the label as a child to this layer
    this.addChild(this.helloLabel, 5);

    // add "Helloworld" splash screen"
    this.sprite = new Sprite(s_HelloWorld);
    this.sprite.setAnchorPoint(0.5, 0.5);
    this.sprite.setPosition(size.width / 2, size.height / 2);
    this.sprite.setScale(size.height / this.sprite.getContentSize().height);
    this.addChild(this.sprite, 0);
  }
}
