import { IMEDispatcher } from "./ime-dispatcher";
import { TextFieldTTF } from "./text-field-ttf";

export { IMEDispatcher, TextFieldTTF };

const imeDispatcher = IMEDispatcher.getInstance();

export { imeDispatcher };

document.body
  ? imeDispatcher.init()
  : window.addEventListener("load", ()  => imeDispatcher.init(), false);
