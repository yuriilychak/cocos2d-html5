import { ServiceLocator } from "@aspect/core";
import Audio from "./audio";
import WebAudio from "./web-audio";
import AudioEngine from "./audio-engine";
// Wire up static nested class
Audio.WebAudio = WebAudio;

ServiceLocator.game.audioEngine = new AudioEngine();

export { Audio, WebAudio, AudioEngine };
