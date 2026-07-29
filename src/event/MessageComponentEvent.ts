import type { APIMessageComponentInteraction, APIMessageComponentInteractionData } from "discord-api-types/payloads";
import { Discord } from "../..";
import type { PathResolver } from "../lib/utils";
import { ComponentBaseEvent } from "./ComponentBaseEvent";

export class MessageComponentEvent<Data extends APIMessageComponentInteractionData = APIMessageComponentInteractionData, Path extends string = ''> extends ComponentBaseEvent {
    declare interaction: Omit<APIMessageComponentInteraction, 'data'> & { data: Data }
    data: Data;
    params: PathResolver<Path, string> = {} as any;
    constructor(client: Discord.Client, interaction: APIMessageComponentInteraction) {
        super(client, interaction)
        this.data = interaction.data as Data;
    }
}