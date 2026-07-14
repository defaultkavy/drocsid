import * as _Gateway from './Gateway';
import * as _Client from './Client';
import * as _Guild from './Guild';
import { APIUser, ChannelType } from 'discord-api-types/payloads';
import { ChannelAPI } from './api/ChannelAPI';
import { UserAPI } from './api/UserAPI';
import { ApplicationAPI } from './api/ApplicationAPI';
import { InteractionAPI } from './api/InteractionAPI';
import { GatewayDispatchEvents, GatewayIntentBits } from 'discord-api-types/gateway';
import { MessageBuilder } from '../builder/MessageBuilder';
import { CommandsBuilder } from '../builder/CommandsBuilder';
import { ChatCommandBuilder } from '../builder/ChatCommandBuilder';
import { MessageCommandBuilder } from '../builder/MessageCommandBuilder';
import { ModalBuilder } from '../builder/ModalBuilder';
import { UserCommandBuilder } from '../builder/UserCommandBuilder';

export namespace Discord {
    export import Client = _Client.Client;
    export import Gateway = _Gateway.Gateway;
    export import Guild = _Guild.Guild;

    export import GatewayEvent = GatewayDispatchEvents;
    export import GatewayIntent = GatewayIntentBits;
    
    export namespace Application {
        export import API = ApplicationAPI;
    }

    export namespace User {
        export import API = UserAPI;
        export type Data = APIUser;
    }
    
    export namespace Channel {
        export import API = ChannelAPI
        export import Type = ChannelType;
    }

    export namespace Interaction {
        export import API = InteractionAPI;
    }

    export namespace Builder {
        export const Message = MessageBuilder;
        export const Commands = CommandsBuilder;
        export const ChatCommand = ChatCommandBuilder;
        export const MessageCommand = MessageCommandBuilder;
        export const UserCommand = UserCommandBuilder;
        export const Modal = ModalBuilder;
    }
}