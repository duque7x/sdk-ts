//import { Channel } from "../structures/channel/Channel";
import { Collection } from "../structures/Collection";
//import { GroupedChannel } from "../structures/groupedchannel/GroupedChannel";
import { Guild } from "../structures/guild/Guild";
import { GuildMatch } from "../structures/match/GuildMatch";
//import { GuildTicket } from "../structures/ticket/GuildTicket";
import { GuildUser } from "../structures/user/GuildUser";

export interface RequestOptions<Payload> {
  /** The request's method */
  method: string;

  /** The request's url */
  url: string;

  /** The request payload */
  payload?: Payload;
}
export interface RestEvents {
  request: [{ url: string; method: string }];
  response: [{ status: number; body: unknown }];
  error: [Error];
  debug: [string];

  //ticketDelete: [GuildTicket];
  //ticketsDelete: [Collection<string, GuildTicket>];

  matchCreate: [GuildMatch];
  matchUpdate: [GuildMatch, GuildMatch];
  matchDelete: [GuildMatch];
  matchesDelete: [Collection<string, GuildMatch>];

  guildUpdate: [Guild];
  guildDelete: [Guild];
  guildsDelete: [Collection<string, Guild>];

  //groupedChannelUpdate: [GroupedChannel, GroupedChannel];

  userDelete: [GuildUser];
  userUpdate: [GuildUser];
  usersDelete: [Collection<string, GuildUser>];

 // channelCreate: [Channel<any>];
 // channelUpdate: [Channel<any>];
 // channelBulkCreate: [Collection<string, Channel<any>>];
 // channelBulkDelete: [Collection<string, Channel<any>>];
}
