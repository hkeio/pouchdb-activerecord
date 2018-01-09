import { ActiveRecord, ModelAttribute } from "@hke/activerecord";
import { PouchDbActiveQuery } from "./PouchDbActiveQuery";

import * as PouchDB from 'pouchdb';
import * as PouchDBFind from 'pouchdb-find';

let PouchDb = PouchDB
  .plugin(PouchDBFind);

export interface PouchDbInstance {
  get: (id: string) => Promise<any>
  find: (condition: any) => Promise<any>
}

export class PouchDbActiveRecord extends ActiveRecord {

  static _identifier = '_id';
  static _tableName = 'PouchDbActiveRecord';
  static _queryClass = PouchDbActiveQuery;

  public _id: string;
  public _rev: string;

  static dbConfig: any = {};
  protected static _db: { [model: string]: PouchDbInstance; } = {};

  protected static _attributes = [
    // add internal pouchdb properties
    new ModelAttribute('_id'),
    new ModelAttribute('_rev')
  ];

  static _dbInit() {
    if (this.dbConfig.plugins) {
      this.dbConfig.plugins.forEach((plugin) => {
        PouchDb = PouchDb.plugin(plugin);
      });
    }
    delete this.dbConfig.plugins;
    this._db[this.config.tableName] = new PouchDb('.db/' + this.config.tableName, this.dbConfig);
    super.initialized(this.config.tableName);
    return Promise.resolve(true);
  }

  public async save(): Promise<this> {
    const res = await this.class.db.post(this.attributes);
    this.setAttribute('_id', res.id);
    this.setAttribute('_rev', res.rev);
    return this;
  }

  static async save(objects): Promise<any[]> {
    let result = [];
    for (let object of objects) {
      if (!(object instanceof this)) {
        object = new this(object);
      }
      result.push(await object.save());
    }
    return result;
  }
}
