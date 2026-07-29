import { type APIAllowedMentions, type APIEmbed, type APIInteraction, type APIMessageSharedClientTheme, type APIMessageTopLevelComponent, InteractionResponseType, MessageFlags } from "discord-api-types/payloads";
import type { RESTAPIAttachment, RESTAPIMessageReference, RESTAPIPoll, RESTPostAPIChannelMessageJSONBody } from "discord-api-types/rest";
import { ComponentsBuilder, type MessageComponentsBuilder } from "./MessageComponentsBuilder";
import type { Discord } from "../..";

export class MessageBuilder {
    config: RESTPostAPIChannelMessageJSONBody;
    constructor() {
        this.config = {}
    }

    content(content: string) {
        this.config.content = content;
        return this;
    }

    attachments(attachments: RESTAPIAttachment[]) {
        this.config.attachments = attachments;
        return this;
    }

    tts(tts: boolean) {
        this.config.tts = tts;
        return this;
    }

    embeds(embeds: APIEmbed[]) {
        this.config.embeds = embeds;
        return this;
    }

    allowedMentions(mentions: APIAllowedMentions) {
        this.config.allowed_mentions = mentions;
        return this;
    }

    messageReference(reference: RESTAPIMessageReference) {
        this.config.message_reference = reference;
        return this;
    }

    components(handle: ((builder: MessageComponentsBuilder) => MessageComponentsBuilder)): this
    components(builder: MessageComponentsBuilder): this
    components(resolver: APIMessageTopLevelComponent[]): this
    components(resolver: APIMessageTopLevelComponent[] | MessageComponentsBuilder | ((builder: MessageComponentsBuilder) => MessageComponentsBuilder)) {
        this.addFlags('IsComponentsV2');
        if (resolver instanceof Array) this.config.components = resolver;
        else if (resolver instanceof Function) this.config.components = resolver(new ComponentsBuilder() as unknown as MessageComponentsBuilder).components;
        else this.config.components = resolver.components;
        return this;
    }

    ephemeral(enable: boolean) {
        if (enable) this.addFlags('Ephemeral');
        else this.removeFlags('Ephemeral');
        return this;
    }

    stickers(stickerIds: RESTPostAPIChannelMessageJSONBody['sticker_ids']) {
        this.config.sticker_ids = stickerIds;
        return this;
    }

    addFlags(...flags: (keyof typeof MessageFlags)[]) {
        this.config.flags = flags.reduce((prev, v) => prev |+ MessageFlags[v], this.config.flags ?? 0 << 0);
        return this;
    }

    removeFlags(...flags: (keyof typeof MessageFlags)[]) {
        this.config.flags = flags.reduce((prev, v) => prev |- MessageFlags[v], this.config.flags ?? 0 << 0)
    }

    setFlags(...flags: (keyof typeof MessageFlags)[]) {
        this.config.flags = flags.reduce((prev, v) => prev |- MessageFlags[v], 0 << 0)
    }

    nonce(nonce: number | string) {
        this.config.nonce = nonce;
        return this;
    }

    enforce_nonce(enforce: boolean) {
        this.config.enforce_nonce = enforce;
        return this;
    }

    poll(poll: RESTAPIPoll) {
        this.config.poll = poll;
        return this;
    }

    sharedClientTheme(share: APIMessageSharedClientTheme) {
        this.config.shared_client_theme = share;
        return this;
    }

    send(client: Discord.Client, channel_id: string) {
        return client.channel(channel_id).messages.create(this.config)
    }

    replyInteraction(client: Discord.Client, interaction: APIInteraction) {
        return client.interaction(interaction.id, interaction.token).callback({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: this.config
        })
    }

    editResponse(client: Discord.Client, interaction: APIInteraction) {
        return client.interaction(interaction.id, interaction.token).originalResponse.edit(this.config)
    }
}