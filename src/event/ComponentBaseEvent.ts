import { InteractionResponseType, type APIMessageComponentInteraction, type APIModalSubmitInteraction } from "..";
import type { Discord } from "../..";
import { MessageBuilder } from "../builder/MessageBuilder";
import { ReplyBaseEvent } from "./ReplyBaseEvent";

export class ComponentBaseEvent extends ReplyBaseEvent {
    constructor(client: Discord.Client, interaction: APIMessageComponentInteraction | APIModalSubmitInteraction) {
        super(client, interaction);
    }

    editResponse(message: MessageBuilder | ((message: MessageBuilder) => MessageBuilder)) {
        if (message instanceof Function) message = message(new MessageBuilder());
        return message.editResponse(this.client, this.interaction);
    }

    deferMessage() {
        return this.client.interaction(this.interaction.id, this.interaction.token).callback({
            type: InteractionResponseType.DeferredChannelMessageWithSource
        })
    }

    deferUpdate() {
        return this.client.interaction(this.interaction.id, this.interaction.token).callback({
            type: InteractionResponseType.DeferredMessageUpdate
        })
    }

    updateMessage(message: MessageBuilder | ((message: MessageBuilder) => MessageBuilder)) {
        if (message instanceof Function) message = message(new MessageBuilder());
        return this.client.interaction(this.interaction.id, this.interaction.token).callback({
            type: InteractionResponseType.UpdateMessage,
            data: message.config
        })
    }
}