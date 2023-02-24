import { CreatePlayerDto } from '../dto/create-player.dto';
import { Player } from './player';

export class PlayerList {
  private _list: Map<Player['username'], Player> = new Map();

  public get count(): number {
    return this._list.size;
  }

  public add(createPlayerData: CreatePlayerDto): this {
    this._list.set(createPlayerData.username, new Player(createPlayerData));
    return this;
  }

  public remove(username: Player['username']): this {
    this._list.delete(username);
    return this;
  }

  public has(username: Player['username']): boolean {
    return this._list.has(username);
  }

  public get(username: Player['username']): null | Player {
    return this._list.get(username) ?? null;
  }

  public get list(): Player[] {
    return [...this._list.values()];
  }

  public get listShort(): Pick<Player, 'username' | 'image'>[] {
    return this.list.map((player) => ({ username: player.username, image: player.image }));
  }
}
