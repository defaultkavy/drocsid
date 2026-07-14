import { APIAllowedMentions, APIApplicationCommandInteraction, APIEmbed, APIMessageSharedClientTheme, APIMessageTopLevelComponent, InteractionResponseType, MessageFlags } from "discord-api-types/payloads";
import { RESTAPIAttachment, RESTAPIMessageReference, RESTAPIPoll, RESTPostAPIChannelMessageJSONBody } from "discord-api-types/rest";
import { Discord } from "../structure/Discord";

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

    components(components: APIMessageTopLevelComponent[]) {
        this.config.components = components;
        return this;
    }

    stickers(stickerIds: RESTPostAPIChannelMessageJSONBody['sticker_ids']) {
        this.config.sticker_ids = stickerIds;
        return this;
    }

    flags(flags: MessageFlags) {
        this.config.flags = flags;
        return this;
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

    replyInteraction(client: Discord.Client, interaction: APIApplicationCommandInteraction) {
        return client.interaction(interaction.id, interaction.token).callback({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: this.config
        })
    }
}