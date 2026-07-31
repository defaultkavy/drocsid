import { InteractionResponseType, type APIInteraction } from "discord-api-types/payloads";
import { Discord } from "../..";
import { BaseEvent } from "./BaseEvent";
import { MessageBuilder } from "../builder/MessageBuilder";
import type { ModalBuilder } from "../builder/ModalBuilder";
import type { FileResolver } from "../structure/HTTP";

export class ReplyBaseEvent extends BaseEvent {
    constructor(client: Discord.Client, interaction: APIInteraction) {
        super(client, interaction)
    }
    
    sendModal(modal: ModalBuilder) {
        return modal.send(this.client, this.interaction);
    }

    reply(message: MessageBuilder | ((message: MessageBuilder) => MessageBuilder), files?: FileResolver[]) {
        if (message instanceof Function) message = message(new MessageBuilder());
        return message.replyInteraction(this.client, this.interaction, files);
    }

    deferMessage() {
        return this.client.interaction(this.interaction.id, this.interaction.token).callback({
            type: InteractionResponseType.DeferredChannelMessageWithSource
        })
    }
}