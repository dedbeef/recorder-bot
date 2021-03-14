import { VoiceChannel } from "eris";

type AccurateTime = [number, number];

export interface IRecorderService {
  startRecording(voiceChannel: VoiceChannel): Promise<string>;
  startAnsweringMachine(voiceChannel: VoiceChannel): Promise<string>;
  stopAnsweringMachine(): AccurateTime;
  stopRecording(): AccurateTime;
}

export interface Chunk extends Buffer {
  timestamp: number;
  time?: number;
}
