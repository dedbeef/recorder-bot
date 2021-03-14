import { ICommand } from "../@types/command";
import { Client, Message, VoiceChannel } from "eris";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { IRecorderService } from "../@types/audio-recorder";
import { InvalidRecorderStateError } from "../services/audio-recorder";

@injectable()
export class StartRecording implements ICommand {
  trigger = "record";
  constructor(
    @inject(TYPES.AudioRecorder) private audioRecorder: IRecorderService
  ) {}
  async run(
    m: Message,
    client: Client,
    args: (string | number)[]
  ): Promise<void> {
    const voiceChannelId = m.member.voiceState.channelID;
    if (!voiceChannelId) {
      await m.channel.createMessage(
        `${m.author.mention}, bro, you ain't in a voice channel, I can't record letters bro, I need voice bro, okay?`
      );
      return;
    }
    const channel = client.getChannel(voiceChannelId);
    try {
      const recordId = await this.audioRecorder.startRecording(
        channel as VoiceChannel
      );
      client.editStatus("online", {
        name: `salty bois (Recording)`, //${(channel as VoiceChannel).name}
        type: 2,
      });
      await m.channel.createMessage(
        `${m.author.mention} Starting record with id : ${recordId}`
      );
    } catch (e) {
      if (e instanceof InvalidRecorderStateError) {
        await m.channel.createMessage(
          `${m.author.mention}, I'm already recording.. Should I double-record?`
        );
      }
    }
  }
}
