import { api } from "actionhero";
import { v4 as uuidv4 } from "uuid";

// TODO Add error handling and allow it to propagate outward
export class LowdbCrud {
  private db: string;
  private table: string;

  constructor({ db, table }) {
    this.db = db;
    this.table = table;
  }

  async list(id?: string) {
    await api.lowdb[this.db].read(); // Sync DB
    return !!id
      ? [api.lowdb[this.db].get(this.table).find({ id }).value()]
      : api.lowdb[this.db].get(this.table).value();
  }

  async find(obj: object) {
    await api.lowdb[this.db].read(); // Sync DB
    let results = api.lowdb[this.db].get(this.table).find(obj).value();
    return !!results ? results : false;
  }

  async create(obj: object) {
    await api.lowdb[this.db].read(); // Sync DB
    if (!obj["id"]) {
      obj["id"] = uuidv4();
    }
    await api.lowdb[this.db].get(this.table).push(obj).write();
    return (await this.list(obj["id"]))[0];
    // TODO: {created: boolean, entry: X}
    //let result = (await this.list(obj['id']))[0]
    //return {created: (obj['id'] === result['id']), element: result}
  }

  async delete(id: string): Promise<boolean> {
    await api.lowdb[this.db].read(); // Sync DB
    let result = await api.lowdb[this.db]
      .get(this.table)
      .remove({ id })
      .write()[0];
    return !!result;
  }

  // TODO: Check all places using update to see if they expect replace vs update, then update these
  async update(id: string, obj: object) {
    // await this.delete(id)
    // return this.create({id, ...obj})
    await api.lowdb[this.db].read(); // Sync DB
    let result = api.lowdb[this.db]
      .get(this.table)
      .find({ id })
      .assign(obj)
      .write();
    if (!!result.id && result.id === id) {
      return {
        updated: true,
        setting: result,
      };
    } else {
      // TODO: Better creation verification that the update has failed
      return { updated: false };
    }
  }

  async replace(id: string, obj: object) {
    await this.delete(id);
    return this.create({ id, ...obj });
    // TODO: {replaced: boolean, entry: X}
  }
}
