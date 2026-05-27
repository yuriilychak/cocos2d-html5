import { Color, Director } from "@aspect/core";
import { BaseTestLayer } from "../../BaseTestLayer/BaseTestLayer";
import { TestScene } from "../../test-scene";
import {
  ControlButtonEventTest,
  ControlButtonHelloVariableSizeTest,
  ControlButtonStylingTest,
  ControlColourPickerTest,
  ControlPotentiometerTest,
  ControlSliderTest,
  ControlStepperTest,
  ControlSwitchTest
} from "./cases";

// All non-Potentiometer cases come first; ControlPotentiometer is appended
// last so its ProgressTimer (which breaks the WebGL batch) doesn't force
// extra draw-call splits in earlier cases.

export default class ControlExtensionTestLayer extends BaseTestLayer {
  constructor() {
    super(new Color(53, 57, 65, 255), new Color(53, 57, 65, 255));
    this._title = "Control Extension Tests";

    const screenSize = Director.getInstance().getWinSize();

    this.addExample(ControlSliderTest, 96, screenSize.height - 150);
    this.addExample(ControlColourPickerTest, 560, screenSize.height - 180);
    this.addExample(ControlSwitchTest, 900, screenSize.height - 120);
    this.addExample(ControlStepperTest, 1150, screenSize.height - 120);
    this.addExample(
      ControlButtonHelloVariableSizeTest,
      250,
      screenSize.height - 250
    );
    this.addExample(ControlButtonEventTest, 600, screenSize.height - 340);
    this.addExample(ControlButtonStylingTest, 880, screenSize.height - 300);
    this.addExample(ControlPotentiometerTest, 1130, screenSize.height - 300);
  }

  addExample(ExampleClass, x, y) {
    const example = new ExampleClass();
    example.x = x;
    example.y = y;
    this.addChild(example);
  }
}

export function runControlExtensionTest() {
  const scene = new TestScene("GUI Component", "Back");
  scene.addChild(new ControlExtensionTestLayer());
  Director.getInstance().runScene(scene);
}
