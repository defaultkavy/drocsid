import { type APIButtonComponentBase, ButtonStyle, ComponentType } from "..";
import { customIdMaxLengthCheck } from "../lib/utils";

export class ButtonBuilder {

    static primaryButton(custom_id: string, options?: Omit<APIButtonComponentBase<ButtonStyle.Primary>, 'type' | 'style' | 'custom_id'>) {
        customIdMaxLengthCheck(custom_id);
        return {
            type: ComponentType.Button,
            style: ButtonStyle.Primary,
            custom_id,
            ...options
        } as const;
    }

    static secondaryButton(custom_id: string, options?: Omit<APIButtonComponentBase<ButtonStyle.Secondary>, 'type' | 'style' | 'custom_id'>) {
        customIdMaxLengthCheck(custom_id);
        return {
            type: ComponentType.Button,
            style: ButtonStyle.Secondary,
            custom_id,
            ...options
        } as const;
    }

    static successButton(custom_id: string, options?: Omit<APIButtonComponentBase<ButtonStyle.Success>, 'type' | 'style' | 'custom_id'>) {
        customIdMaxLengthCheck(custom_id);
        return {
            type: ComponentType.Button,
            style: ButtonStyle.Success,
            custom_id,
            ...options
        } as const;
    }

    static dangerButton(custom_id: string, options?: Omit<APIButtonComponentBase<ButtonStyle.Danger>, 'type' | 'style' | 'custom_id'>) {
        customIdMaxLengthCheck(custom_id);
        return {
            type: ComponentType.Button,
            style: ButtonStyle.Danger,
            custom_id,
            ...options
        } as const;
    }

    static linkButton(url: string, options?: Omit<APIButtonComponentBase<ButtonStyle.Link>, 'type' | 'style' | 'custom_id'>) {
        return {
            type: ComponentType.Button,
            style: ButtonStyle.Link,
            url,
            ...options
        } as const;
    }
}