import { ICommand } from "../@types/command";
import { Client, Message, VoiceChannel } from "eris";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { IRecorderService } from "../@types/audio-recorder";
import { InvalidRecorderStateError } from "../services/audio-recorder";

@injectable()
export class StartAnsweringMachine implements ICommand {
  trigger = "answer";
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
        `${m.author.mention}, bro, you ain't in a voice channel, you expect me to come in there and answer chat messages?`
      );
      return;
    }
    const channel = client.getChannel(voiceChannelId);
    try {
      const recordId = await this.audioRecorder.startAnsweringMachine(
        channel as VoiceChannel
      );
      client.editStatus("online", {
        name: `angry dogs (Answering)`, //${(channel as VoiceChannel).name}
        type: 2,
      });
      await m.channel.createMessage(
        `${m.author.mention} I'm listening to these salty boys calling. (id : ${recordId})`
      );
    } catch (e) {
      if (e instanceof InvalidRecorderStateError) {
        await m.channel.createMessage(
          `${m.author.mention}, I'm already answering.. I'm not a call center homie.`
        );
      }
    }
  }
}
