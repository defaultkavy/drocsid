import { Discord } from "../structure/Discord";
import { APIApplicationCommandInteraction } from "discord-api-types/payloads";
import { ModalBuilder } from "./ModalBuilder";
import { MessageBuilder } from "./MessageBuilder";

export class CommandEvent {
    client: Discord.Client;
    interaction;
    constructor(client: Discord.Client, interaction: APIApplicationCommandInteraction) {
        this.client = client;
        this.interaction = interaction;
    }
    
    sendModal(modal: ModalBuilder) {
        return modal.send(this.client, this.interaction);
    }

    reply(message: MessageBuilder) {
        return message.replyInteraction(this.client, this.interaction);
    }
}

export abstract class CommandBuilder {
    abstract config: { name: string };
}