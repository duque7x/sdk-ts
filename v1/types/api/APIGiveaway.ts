export interface GiveawayMessage {
  id: string;
  content: string;
  type: "embed" | "text";
}

export interface GiveawayWinners {
  count: number;
  selected: string[];
}

export interface APIGiveaway {
  _id: string;
  host_id: string;
  channel_id: string;
  guild_id: string;

  /** Duration of giveaway in sec */
  duration: number;

  prizes: string[];
  participants: string[];
  allowed_roles: string[];
  blacklisted_roles: string[];

  message: GiveawayMessage;
  winners: GiveawayWinners;

  rerolls: string[];

  status: "created" | "off" | "on";
  
  createdAt: Date;
  updatedAt: Date;
}
