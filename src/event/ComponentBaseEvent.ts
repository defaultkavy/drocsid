import { InteractionResponseType, type APIMessageComponentInteraction, type APIModalSubmitInteraction } from "..";
import type { Discord } from "../..";
import { MessageBuilder } from "../builder/MessageBuilder";
import { ReplyBaseEvent } from "./ReplyBaseEvent";

export class ComponentBaseEvent<I extends APIMessageComponentInteraction | APIModalSubmitInteraction> extends ReplyBaseEvent<I> {
    constructor(client: Discord.Client, interaction: I) {
        super(client, interaction);
    }

    editResponse(message: MessageBuilder | ((message: MessageBuilder) => MessageBuilder)) {
        if (message instanceof Function) message = message(new MessageBuilder());
        return message.editResponse(this.client, this.interaction);
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