import { type APIThumbnailComponent, type APIUnfurledMediaItem, ComponentType } from "..";
import { ButtonBuilder } from "./ButtonBuilder";

export class AccessoryBuilder extends ButtonBuilder {
    static thumbnail(url: string, options?: Omit<APIThumbnailComponent, 'type' | 'file' | 'media'> & Omit<APIUnfurledMediaItem, 'url'>) {
        const { id, spoiler, ...file } = options ?? {};
        return {
            type: ComponentType.Thumbnail,
            id, spoiler, 
            media: {
                url,
                ...file
            }
        } satisfies APIThumbnailComponent;
    }
}