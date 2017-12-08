import { ActiveRecord, DbInstance, ModelAttribute } from "../../index";

import * as PouchDB from 'pouchdb';
import * as PouchDBFind from 'pouchdb-find';

let PouchDb = PouchDB
  .plugin(PouchDBFind);

export interface PouchDbInstance extends DbInstance {
  get: (id: string) => Promise<any>
  find: (condition: any) => Promise<any>
}

export class PouchDbActiveRecord extends ActiveRecord {

  public _id: string;
  public _rev: string;

  static _db: { [model: string]: PouchDbInstance; } = {};
  static _attributes = [
    // add internal pouchdb properties
    new ModelAttribute('_id'),
    new ModelAttribute('_rev')
  ]

  public static get db() {
    this.init();
    return this._db[this.className];
  }

  static _dbInit() {
    this._config.plugins.forEach((plugin) => {
      PouchDb = PouchDb.plugin(plugin);
    });

    this._db[this.className] = new PouchDb('.db_' + this.className, this._config);
  }
}
