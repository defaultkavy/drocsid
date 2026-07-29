import type { APIBaseGuild, APIBaseGuildMember, APIBaseVoiceGuildMember, APIGuild, APIGuildMember, APIGuildMemberAvatar, APIGuildMemberJoined, APIGuildMemberUser, APIGuildPreview, APIPartialGuild, APIUnavailableGuild } from "discord-api-types/payloads";
import type { RESTGetAPIGuildChannelsResult, RESTPatchAPIGuildChannelPositionsJSONBody, RESTPatchAPIGuildChannelPositionsResult, RESTPostAPIGuildChannelJSONBody, RESTPostAPIGuildChannelResult } from "discord-api-types/rest";
import { GuildAPI } from "./api/GuildAPI";
import { GuildBanAPI } from "./api/GuildBanAPI";
import { GuildMemberAPI } from "./api/GuildMemberAPI";
import { GuildRoleAPI } from "./api/GuildRoleAPI";

export namespace Guild {
    export import API = GuildAPI;
    export type Data = APIGuild;

    export namespace Data {
        export type Preview = APIGuildPreview;
        export type Unavaliable = APIUnavailableGuild;
        export type Partial = APIPartialGuild;
        export type Base = APIBaseGuild;
    }

    export namespace Member {
        export import API = GuildMemberAPI;
        export type Data = APIGuildMember;

        export namespace Data {
            export type Base = APIBaseGuildMember;
            export type Voice = APIBaseVoiceGuildMember;
            export type Joined = APIGuildMemberJoined;
            export type Avatar = APIGuildMemberAvatar;
            export type User = APIGuildMemberUser;
        }
    }

    export namespace Ban {
        export import API = GuildBanAPI;
    }

    export namespace Channel {
        export namespace API {
            export namespace List {
                export type Result = RESTGetAPIGuildChannelsResult;
            }

            export namespace Create {
                export type Result = RESTPostAPIGuildChannelResult;
                export type Params = RESTPostAPIGuildChannelJSONBody;
            }

            export namespace ModifyPosition {
                export type Result = RESTPatchAPIGuildChannelPositionsResult;
                export type Params = RESTPatchAPIGuildChannelPositionsJSONBody;
            }
        };
    }

    export namespace Role {
        export import API = GuildRoleAPI;
    }
}