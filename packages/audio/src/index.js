import { Game } from "@aspect/core";
import "./audio-support.js";
import { Audio } from "./audio.js";
import { WebAudio } from "./web-audio.js";
import "./audio-loader.js";
import { AudioEngine } from "./audio-engine.js";

// Wire up static nested class
Audio.WebAudio = WebAudio;

export const audioEngine = new AudioEngine();
Game.getInstance().audioEngine = audioEngine;

export { Audio, WebAudio, AudioEngine };
