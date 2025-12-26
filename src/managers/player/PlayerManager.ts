import { Collection } from "../../structures";
import { APIPlayer } from "../../types";

export type AddPlayer  = APIPlayer[] | APIPlayer;
export class PlayerManager {
  _cache: Collection<string, APIPlayer>;
  constructor(players: APIPlayer | APIPlayer[], base_url: string) {
    this._cache = new Collection<string, APIPlayer>();

    if (Array.isArray(players)) {
      for (let p of players) {
        if (!p.id) continue;
        this._cache.set(p.id, p);
      }
    }
  }

  get(id: string) {
    return this._cache.get(id);
  }


  add(player: AddPlayer) {
    if (Array.isArray(player)) {
      for (let p of player) {
        if (!p.id) continue;
        this._cache.set(p.id, p);
      }
    } else {
      if (!player.id) return;
      this._cache.set(player.id, player);
    }
  }
}
