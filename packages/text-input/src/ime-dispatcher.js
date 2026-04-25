import { NewClass, Point, Sys, KEY, arrayRemoveObject } from "@aspect/core";

export class IMEDispatcher extends NewClass {
  _domInputControl = null;
  _delegateWithIme = null;
  _delegateList = [];
  _currentInputString = "";
  _lastClickPosition = null;

  constructor() {
    super();
    this._delegateList = [];
    this._lastClickPosition = new Point(0, 0);
  }

  init() {
    if (Sys.getInstance().isMobile) return;
    this._domInputControl = document.getElementById("imeDispatcherInput");
    if (!this._domInputControl) {
      this._domInputControl = document.createElement("input");
      this._domInputControl.setAttribute("type", "text");
      this._domInputControl.setAttribute("id", "imeDispatcherInput");
      this._domInputControl.style.width = "0px";
      this._domInputControl.style.height = "0px";
      this._domInputControl.style.transform = "translate(0, 0)";
      this._domInputControl.style.opacity = "0";
      //this._domInputControl.style.filter = "alpha(opacity = 0)";
      this._domInputControl.style.fontSize = "1px";
      this._domInputControl.setAttribute("tabindex", 2);
      this._domInputControl.style.position = "absolute";
      this._domInputControl.style.top = 0;
      this._domInputControl.style.left = 0;
      document.body.appendChild(this._domInputControl);
    }
    var selfPointer = this;
    //add event listener
    this._domInputControl.addEventListener(
      "input",
      function () {
        selfPointer._processDomInputString(selfPointer._domInputControl.value);
      },
      false
    );
    this._domInputControl.addEventListener(
      "keydown",
      function (e) {
        // ignore tab key
        if (e.keyCode === KEY.tab) {
          e.stopPropagation();
          e.preventDefault();
        } else if (e.keyCode === KEY.enter) {
          selfPointer.dispatchInsertText("\n", 1);
          e.stopPropagation();
          e.preventDefault();
        }
      },
      false
    );

    if (/msie/i.test(navigator.userAgent)) {
      this._domInputControl.addEventListener(
        "keyup",
        function (e) {
          if (e.keyCode === KEY.backspace) {
            selfPointer._processDomInputString(
              selfPointer._domInputControl.value
            );
          }
        },
        false
      );
    }

    window.addEventListener(
      "mousedown",
      function (event) {
        var tx = event.pageX || 0;
        var ty = event.pageY || 0;

        selfPointer._lastClickPosition.x = tx;
        selfPointer._lastClickPosition.y = ty;
      },
      false
    );
  }

  _processDomInputString(text) {
    var i, startPos;
    var len =
      this._currentInputString.length < text.length
        ? this._currentInputString.length
        : text.length;
    for (startPos = 0; startPos < len; startPos++) {
      if (text[startPos] !== this._currentInputString[startPos]) break;
    }
    var delTimes = this._currentInputString.length - startPos;
    var insTimes = text.length - startPos;
    for (i = 0; i < delTimes; i++) this.dispatchDeleteBackward();

    for (i = 0; i < insTimes; i++)
      this.dispatchInsertText(text[startPos + i], 1);

    this._currentInputString = text;
  }

  dispatchInsertText(text, len) {
    if (!text || len <= 0) return;

    if (!this._delegateWithIme) return;

    this._delegateWithIme.insertText(text, len);
  }

  dispatchDeleteBackward() {
    if (!this._delegateWithIme) return;

    this._delegateWithIme.deleteBackward();
  }

  getContentText() {
    if (this._delegateWithIme) {
      var pszContentText = this._delegateWithIme.getContentText();
      return pszContentText ? pszContentText : "";
    }
    return "";
  }

  addDelegate(delegate) {
    if (!delegate) return;

    if (this._delegateList.indexOf(delegate) > -1) return;

    this._delegateList.splice(0, 0, delegate);
  }

  attachDelegateWithIME(delegate) {
    if (!delegate) return false;

    if (this._delegateList.indexOf(delegate) === -1) return false;

    if (this._delegateWithIme) {
      if (
        !this._delegateWithIme.canDetachWithIME() ||
        !delegate.canAttachWithIME()
      )
        return false;

      var pOldDelegate = this._delegateWithIme;
      this._delegateWithIme = null;
      pOldDelegate.didDetachWithIME();

      this._focusDomInput(delegate);
      return true;
    }

    if (!delegate.canAttachWithIME()) return false;

    this._focusDomInput(delegate);
    return true;
  }

  _focusDomInput(delegate) {
    if (Sys.getInstance().isMobile) {
      this._delegateWithIme = delegate;
      delegate.didAttachWithIME();
      this._currentInputString = delegate.string || "";

      var tipMessage = delegate.getTipMessage
        ? delegate.getTipMessage()
        : "please enter your word:";
      var userInput;
      var win = window.Window;
      if (win && win.prototype.prompt && win.prototype.prompt != prompt) {
        userInput = win.prototype.prompt.call(
          window,
          tipMessage,
          this._currentInputString
        );
      } else {
        userInput = prompt(tipMessage, this._currentInputString);
      }
      if (userInput != null) this._processDomInputString(userInput);
      this.dispatchInsertText("\n", 1);
    } else {
      this._delegateWithIme = delegate;
      this._currentInputString = delegate.string || "";
      delegate.didAttachWithIME();
      this._domInputControl.focus();
      this._domInputControl.value = this._currentInputString;
      this._domInputControlTranslate();
    }
  }

  _domInputControlTranslate() {
    if (/msie/i.test(navigator.userAgent)) {
      this._domInputControl.style.left = this._lastClickPosition.x + "px";
      this._domInputControl.style.top = this._lastClickPosition.y + "px";
    } else {
      this._domInputControl.style.transform = `translate(${this._lastClickPosition.x}px, ${this._lastClickPosition.y}px)`;
    }
  }

  detachDelegateWithIME(delegate) {
    if (!delegate) return false;

    if (this._delegateWithIme !== delegate) return false;

    if (!delegate.canDetachWithIME()) return false;

    this._delegateWithIme = null;
    delegate.didDetachWithIME();
    cc._canvas.focus();
    return true;
  }

  removeDelegate(delegate) {
    if (!delegate) return;

    if (this._delegateList.indexOf(delegate) === -1) return;

    if (delegate === this._delegateWithIme) this._delegateWithIme = null;

    arrayRemoveObject(this._delegateList, delegate);
  }

  processKeycode(keyCode) {
    if (keyCode < 32) {
      if (keyCode === KEY.backspace) {
        this.dispatchDeleteBackward();
      } else if (keyCode === KEY.enter) {
        this.dispatchInsertText("\n", 1);
      } else if (keyCode === KEY.tab) {
        //tab input
      } else if (keyCode === KEY.escape) {
        //ESC input
      }
    } else if (keyCode < 255) {
      this.dispatchInsertText(String.fromCharCode(keyCode), 1);
    } else {
      //
    }
  }
}
