import { ActiveRecord, ModelAttribute } from "@hke/activerecord/dist";
import { PouchDBActiveQuery } from "./PouchDbActiveQuery";

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
  static _queryClass = PouchDBActiveQuery;

  public _id: string;
  public _rev: string;

  protected static _db: { [model: string]: PouchDbInstance; } = {};
  static dbConfig: any = {};
  static _attributes = [
    // add internal pouchdb properties
    new ModelAttribute('_id'),
    new ModelAttribute('_rev')
  ]

  protected _initRelations() {
    this._class.relations.forEach((relation) => relation.init(this));
  }

  static _dbInit() {
    if (this.dbConfig.plugins) {
      this.dbConfig.plugins.forEach((plugin) => {
        PouchDb = PouchDb.plugin(plugin);
      });
    }
    delete this.dbConfig.plugins;
    this._db[this.config.tableName] = new PouchDb('.db/' + this.config.tableName, this.dbConfig);
    super.initialized(this.config.tableName);
    return true;
  }

  public async save(): Promise<this> {
    const res = await this.db.post(this.attributes);
    this.setAttribute('_id', res.id);
    this.setAttribute('_rev', res.rev);
    return this;
  }

  public static async save(objects: any[]) {
    for (let i in objects) {
      if (!(objects[i] instanceof this)) {
        objects[i] = new this(objects[i]);
      }
      await objects[i].save();
    }
  }
}
