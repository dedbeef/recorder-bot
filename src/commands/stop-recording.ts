import { ICommand } from "../@types/command";
import { Client, Message, VoiceChannel } from "eris";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { IRecorderService } from "../@types/audio-recorder";
import { InvalidRecorderStateError } from "../services/audio-recorder";

@injectable()
export class StopRecording implements ICommand {
  trigger = "end";
  constructor(
    @inject(TYPES.AudioRecorder) private audioRecorder: IRecorderService
  ) {}
  async run(
    m: Message,
    client: Client,
    args: (string | number)[]
  ): Promise<void> {
    try {
      var errorStopRecording = false;
      try {
        this.audioRecorder.stopRecording();
      } catch(e) {
        errorStopRecording = true;
      }
      var errorStopAnswering = false;
      try {
        this.audioRecorder.stopAnsweringMachine();
      } catch(e) {
        errorStopAnswering = true;
      }
      if(errorStopRecording && errorStopAnswering)
        throw new Error("Not recording or answering");

      client.editStatus("online", null);
    } catch (e) {
      if (e instanceof InvalidRecorderStateError) {
        await m.channel.createMessage(
          `${m.author.mention}, ah, don't think I'm recording or answering?`
        );
      }
    }
  }
}
