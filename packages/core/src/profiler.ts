import {
  DIRECTOR_STATS_POSITION,
  DIRECTOR_FPS_INTERVAL
} from "./platform/config";
import { DirectorEvent } from "./enums";
import { BYTE } from "./constants";
import { ServiceLocator } from "./service-locator";
import type { Sys } from "./sys";
import type {
  EventCustom,
  EventListener,
  EventManager,
  CustomEventCallback
} from "./event-manager";

interface DirectorLike {
  getSecondsPerFrame(): number;
  getDeltaTime(): number;
}

export class Profiler {
  static #LEVEL_DET_FACTOR = 0.6;
  static #LEVELS = [0, 10, 20, 30];

  #sys: Sys;
  #eventManager: EventManager;
  #director: DirectorLike;
  #showFPS = false;
  #inited = false;
  #frames = 0;
  #frameRate = 0;
  #lastSPF = 0;
  #accumDt = 0;
  #afterVisitListener: EventListener<EventCustom<unknown>> | null = null;
  #levelDetCycle = 10;
  #fpsCount: number[] = [0, 0, 0, 0];
  #currLevel = 3;
  #analyseCount = 0;
  #totalFPS = 0;
  #profiling = true;
  #FPSLabel: HTMLDivElement;
  #SPFLabel: HTMLDivElement;
  #drawsLabel: HTMLDivElement;
  #fps: HTMLDivElement;
  #onFrameRateChange: ((frameRate: string) => void) | null = null;

  constructor(
    sys: Sys,
    director: DirectorLike,
    eventManager: EventManager
  ) {
    this.#director = director;
    this.#eventManager = eventManager;
    this.#sys = sys;
    this.#FPSLabel = document.createElement("div");
    this.#SPFLabel = document.createElement("div");
    this.#drawsLabel = document.createElement("div");
    this.#fps = document.createElement("div");

    this.#fps.id = "fps";
    this.#fps.style.position = "absolute";
    this.#fps.style.padding = "3px";
    this.#fps.style.textAlign = "left";
    this.#fps.style.backgroundColor = "rgb(0, 0, 34)";
    this.#fps.style.bottom = DIRECTOR_STATS_POSITION.y + "px";
    this.#fps.style.left = DIRECTOR_STATS_POSITION.x + "px";
    this.#fps.style.width = "45px";
    this.#fps.style.height = "80px";

    const labels = [this.#drawsLabel, this.#SPFLabel, this.#FPSLabel];
    for (let i = 0; i < 3; ++i) {
      const style = labels[i].style;
      style.color = `rgb(0, ${BYTE}, ${BYTE})`;
      style.font = "bold 12px Helvetica, Arial";
      style.lineHeight = "20px";
      style.width = "100%";
      this.#fps.appendChild(labels[i]);
    }
  }

  init() {
    if (!this.#inited) {
      if (this.#profiling) {
        this.#afterVisitListener = this.#eventManager.addCustomListener(
          DirectorEvent.AFTER_VISIT,
          this.#afterVisit
        );
      }
      this.#inited = true;
    }
  }

  updateTimeData(secondsPerFrame: number, deltaTime: number) {

  }

  #analyseFPS = (fps: number): void => {
    const lastId = Profiler.#LEVELS.length - 1;
    let i = lastId;
    let average = 0;
    this.#analyseCount++;
    this.#totalFPS += fps;

    for (; i >= 0; i--) {
      if (fps >= Profiler.#LEVELS[i]) {
        this.#fpsCount[i]++;
        break;
      }
    }

    if (this.#analyseCount >= this.#levelDetCycle) {
      average = this.#totalFPS / this.#levelDetCycle;
      for (i = lastId; i > 0; i--) {
        const ratio = this.#fpsCount[i] / this.#levelDetCycle;
        if (
          ratio >= Profiler.#LEVEL_DET_FACTOR &&
          average >= Profiler.#LEVELS[i]
        ) {
          if (i !== this.#currLevel) {
            this.#currLevel = i;
            this.#onFrameRateChange &&
              this.#onFrameRateChange(average.toFixed(2));
          }
          break;
        }
      }

      this.#analyseCount = 0;
      this.#totalFPS = 0;
      for (i = lastId; i > 0; i--) {
        this.#fpsCount[i] = 0;
      }
    }
  };

  #afterVisit: CustomEventCallback = (): void => {
    this.#lastSPF = this.#director.getSecondsPerFrame();
    this.#frames++;
    this.#accumDt += this.#director.getDeltaTime();

    if (this.#accumDt > DIRECTOR_FPS_INTERVAL) {
      this.#frameRate = this.#frames / this.#accumDt;
      this.#frames = 0;
      this.#accumDt = 0;

      if (this.#onFrameRateChange) {
        this.#analyseFPS(this.#frameRate);
      }

      if (this.#showFPS) {
        const rendererConfig = this.#sys.rendererConfig;
        const mode = rendererConfig.isCanvas ? "\n canvas" : "\n webgl";
        this.#SPFLabel.innerHTML = this.#lastSPF.toFixed(3);
        this.#FPSLabel.innerHTML = this.#frameRate.toFixed(1).toString() + mode;
        this.#drawsLabel.innerHTML = (0 | rendererConfig.drawCount).toString();
      }
    }
  };

  get secondsPerFrame() {
    return this.#lastSPF;
  }

  get frameRate() {
    return this.#frameRate;
  }

  get profileDuration() {
    return this.#levelDetCycle;
  }

  set profileDuration(duration: number) {
    if (!isNaN(duration) && duration > 0) {
      this.#levelDetCycle = duration / DIRECTOR_FPS_INTERVAL;
    }
  }

  get profiling() {
    return this.#profiling;
  }

  set profiling(value: boolean) {
    const profiling = !!value;
    if (this.#profiling === profiling) {
      return;
    }

    this.#profiling = profiling;
    if (profiling) {
      if (!this.#inited) {
        this.init();
      } else {
        this.#eventManager.addListener(this.#afterVisitListener!, 1);
      }
    } else {
      this.#eventManager.removeListener(this.#afterVisitListener);
    }
  }

  get statsShowing() {
    return this.#showFPS;
  }

  set statsShowing(value: boolean) {
    const showing = !!value;
    if (this.#showFPS === showing) {
      return;
    }

    if (showing) {
      if (!this.#inited) {
        this.init();
      }

      if (this.#fps.parentElement === null) {
        ServiceLocator.eglView.container.appendChild(this.#fps);
      }
    } else if (this.#fps.parentElement === ServiceLocator.eglView.container) {
      ServiceLocator.eglView.container.removeChild(this.#fps);
    }
    this.#showFPS = showing;
  }
}
