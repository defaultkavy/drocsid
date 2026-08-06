import type { APIMessageComponentDMInteraction, APIMessageComponentGuildInteraction, APIMessageComponentInteraction, APIMessageComponentInteractionData } from "discord-api-types/payloads";
import { Discord } from "../..";
import type { PathResolver } from "../lib/utils";
import { ComponentBaseEvent } from "./ComponentBaseEvent";

export class MessageComponentEvent<
    Data extends APIMessageComponentInteractionData = APIMessageComponentInteractionData, 
    Path extends string = '', 
    I extends APIMessageComponentInteraction = APIMessageComponentInteraction
> extends ComponentBaseEvent<I> {
    data: Data;
    params: PathResolver<Path, string> = {} as any;
    constructor(client: Discord.Client, interaction: I) {
        super(client, interaction)
        this.data = interaction.data as Data;
    }

    override inGuild(): this is MessageComponentEvent<Data, Path, APIMessageComponentGuildInteraction> {
        return !!this.interaction.guild
    }

    override inDM(): this is MessageComponentEvent<Data, Path, APIMessageComponentDMInteraction> {
        return !!this.interaction.user
    }
}

export type APIMessageComponentInteractionDataWrapper<T> = Omit<APIMessageComponentInteraction, 'data'> & { data: T }