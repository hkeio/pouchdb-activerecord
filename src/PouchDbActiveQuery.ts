import { ActiveQuery } from "@hke/activerecord/dist";
import { PouchDbInstance } from "./PouchDbActiveRecord";

export class PouchDBActiveQuery extends ActiveQuery {

  db: PouchDbInstance;

  public async one(map: boolean = true) {
    let query = {
      fields: null,
      limit: 1,
      selector: this.params.where,
      sort: null,
      skip: 0
    };
    if (this.params.fields.length) {
      query.fields = this.params.fields;
    }
    if (this.params.sort.length) {
      query.sort = this.params.sort;
    }

    const res = await this.db.find(query);
    if (!res.docs.length) {
      return null;
    }
    return map ? new this.model(res.docs[0]) : res.docs[0];
  }

  public async all(map: boolean = true) {
    let query = {
      fields: null,
      limit: this.params.limit.end,
      selector: this.params.where,
      sort: null,
      skip: this.params.limit.start
    };
    if (this.params.fields.length) {
      query.fields = this.params.fields;
    }
    if (this.params.sort.length) {
      query.sort = this.params.sort;
    }

    const res = await this.db.find(query);
    return map ? res.docs.map((doc) => new this.model(doc)) : res.docs;
  }

}
