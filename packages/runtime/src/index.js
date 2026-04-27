import { Dialog } from "./dialog";
import { LoaderLayer } from "./loader-layer";
import { NetworkErrorDialog, runtime, network } from "./network-utils";

// cc globals (backward compatibility)
cc.Dialog = Dialog;
cc.LoaderLayer = LoaderLayer;
cc._NetworkErrorDialog = NetworkErrorDialog.create.bind(NetworkErrorDialog);
cc._NetworkErrorDialog._show = NetworkErrorDialog.show.bind(NetworkErrorDialog);
cc._NetworkErrorDialog._setConfig = NetworkErrorDialog.setConfig.bind(NetworkErrorDialog);
cc.runtime = runtime;
cc.network = network;

export { 
  Dialog, 
  LoaderLayer, 
  NetworkErrorDialog, 
  runtime, 
  network 
};