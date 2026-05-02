import {
  DIRECTOR_STATS_POSITION,
  DIRECTOR_FPS_INTERVAL
} from "../platform/config";
import Game from "../boot/game";
import { Director } from "../director/director";
import EventManager from "../event-manager/event-manager";
import { RendererConfig } from "../renderer/renderer-config";

export class Profiler {
  static _instance = null;
  static LEVEL_DET_FACTOR = 0.6;
  static LEVELS = [0, 10, 20, 30];

  static getInstance() {
    if (!Profiler._instance) {
      Profiler._instance = new Profiler();
    }
    return Profiler._instance;
  }

  constructor() {
    this.onFrameRateChange = null;

    this._showFPS = false;
    this._inited = false;
    this._frames = 0;
    this._frameRate = 0;
    this._lastSPF = 0;
    this._accumDt = 0;
    this._afterVisitListener = null;

    this._levelDetCycle = 10;
    this._fpsCount = [0, 0, 0, 0];
    this._currLevel = 3;
    this._analyseCount = 0;
    this._totalFPS = 0;

    this._FPSLabel = document.createElement("div");
    this._SPFLabel = document.createElement("div");
    this._drawsLabel = document.createElement("div");
    this._fps = document.createElement("div");

    this._fps.id = "fps";
    this._fps.style.position = "absolute";
    this._fps.style.padding = "3px";
    this._fps.style.textAlign = "left";
    this._fps.style.backgroundColor = "rgb(0, 0, 34)";
    this._fps.style.bottom = DIRECTOR_STATS_POSITION.y + "px";
    this._fps.style.left = DIRECTOR_STATS_POSITION.x + "px";
    this._fps.style.width = "45px";
    this._fps.style.height = "80px";

    const labels = [this._drawsLabel, this._SPFLabel, this._FPSLabel];
    for (let i = 0; i < 3; ++i) {
      const style = labels[i].style;
      style.color = "rgb(0, 255, 255)";
      style.font = "bold 12px Helvetica, Arial";
      style.lineHeight = "20px";
      style.width = "100%";
      this._fps.appendChild(labels[i]);
    }
  }

  _analyseFPS = (fps) => {
    const lastId = Profiler.LEVELS.length - 1;
    let i = lastId;
    let average = 0;
    this._analyseCount++;
    this._totalFPS += fps;

    for (; i >= 0; i--) {
      if (fps >= Profiler.LEVELS[i]) {
        this._fpsCount[i]++;
        break;
      }
    }

    if (this._analyseCount >= this._levelDetCycle) {
      average = this._totalFPS / this._levelDetCycle;
      for (i = lastId; i > 0; i--) {
        const ratio = this._fpsCount[i] / this._levelDetCycle;
        if (ratio >= Profiler.LEVEL_DET_FACTOR && average >= Profiler.LEVELS[i]) {
          if (i !== this._currLevel) {
            this._currLevel = i;
            this.onFrameRateChange && this.onFrameRateChange(average.toFixed(2));
          }
          break;
        }
      }

      this._analyseCount = 0;
      this._totalFPS = 0;
      for (i = lastId; i > 0; i--) {
        this._fpsCount[i] = 0;
      }
    }
  };

  _afterVisit = () => {
    this._lastSPF = Director.getInstance().getSecondsPerFrame();
    this._frames++;
    this._accumDt += Director.getInstance().getDeltaTime();

    if (this._accumDt > DIRECTOR_FPS_INTERVAL) {
      this._frameRate = this._frames / this._accumDt;
      this._frames = 0;
      this._accumDt = 0;

      if (this.onFrameRateChange) {
        this._analyseFPS(this._frameRate);
      }

      if (this._showFPS) {
        const rendererConfig = RendererConfig.getInstance();
        const mode = rendererConfig.isCanvas ? "\n canvas" : "\n webgl";
        this._SPFLabel.innerHTML = this._lastSPF.toFixed(3);
        this._FPSLabel.innerHTML = this._frameRate.toFixed(1).toString() + mode;
        this._drawsLabel.innerHTML = (0 | rendererConfig.numberOfDraws).toString();
      }
    }
  };

  getSecondsPerFrame() {
    return this._lastSPF;
  }

  getFrameRate() {
    return this._frameRate;
  }

  setProfileDuration(duration) {
    if (!isNaN(duration) && duration > 0) {
      this._levelDetCycle = duration / DIRECTOR_FPS_INTERVAL;
    }
  }

  resumeProfiling() {
    EventManager.getInstance().addListener(this._afterVisitListener, 1);
  }

  stopProfiling() {
    EventManager.getInstance().removeListener(this._afterVisitListener);
  }

  isShowingStats() {
    return this._showFPS;
  }

  showStats() {
    if (!this._inited) {
      this.init();
    }

    if (this._fps.parentElement === null) {
      Game.getInstance().container.appendChild(this._fps);
    }
    this._showFPS = true;
  }

  hideStats() {
    this._showFPS = false;
    if (this._fps.parentElement === Game.getInstance().container) {
      Game.getInstance().container.removeChild(this._fps);
    }
  }

  init() {
    if (!this._inited) {
      this._afterVisitListener = EventManager.getInstance().addCustomListener(
        Director.EVENT_AFTER_VISIT,
        this._afterVisit
      );
      this._inited = true;
    }
  }
}

