export interface APIMinesGame {
  guild_id: string;
  _id: string;
  creatorId: string;
  maxMines: number;
  bombs: number;
  bombsPosition: number[];
  bet: number;
  multiplier: number;

  status: "created" | "won" | "lost" | "expired";

  createdAt: Date;
  updatedAt: Date;
}
