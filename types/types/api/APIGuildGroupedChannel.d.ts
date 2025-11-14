import { GuildChannelsType } from "./APIGuild";
export interface APIGuildGroupedChannel {
    /** Channel's type */
    type: string & GuildChannelsType;
    /** Channel's ids */
    ids: string[];
}
