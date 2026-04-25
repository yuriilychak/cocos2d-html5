import { IMEDispatcher } from "./ime-dispatcher";
import { TextFieldTTF } from "./text-field-ttf";

export { IMEDispatcher, TextFieldTTF };

cc.IMEDispatcher = IMEDispatcher;
cc.TextFieldTTF = TextFieldTTF;

const imeDispatcher = new IMEDispatcher();

cc.imeDispatcher = imeDispatcher;

document.body
  ? imeDispatcher.init()
  : window.addEventListener("load", ()  => imeDispatcher.init(), false);
