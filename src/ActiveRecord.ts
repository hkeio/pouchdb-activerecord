import { Model } from './Model';

import * as _ from 'lodash';
import * as PouchDB from 'pouchdb';
import * as PouchDBFind from 'pouchdb-find';
import * as PouchDBMemory from 'pouchdb-adapter-memory';

let PouchDb = PouchDB
  .plugin(PouchDBFind)
  .plugin(PouchDBMemory);

export interface ActiveRecordConfig {
  adapter?: string;
  attributes?: any;
}

export interface PouchDbInstance {
  get: (id: string) => Promise<any>
  find: (condition: any) => Promise<any>
}

export class ActiveRecord extends Model {

  public _id: string;
  public _rev: string;

  private _config: ActiveRecordConfig;
  private static _pouch: PouchDbInstance;

  constructor(values?, config?: ActiveRecordConfig) {
    super(values, { _id: { type: 'string' }, _rev: { type: 'string' } });
    this._config = _.merge({}, config);
    this._class._pouch = new PouchDb(this.className, this._config);
  }

  get id() {
    return this.getAttribute('_id');
  }

  set id(value: string) {
    this.setAttribute('_id', value);
  }

  get isNewRecord() {
    return !this.id;
  }

  public save() {
    return this._class._pouch.post(this.attributes)
      .then((res) => {
        this.setAttribute('_id', res.id);
        this.setAttribute('_rev', res.rev);
        return Promise.resolve(this);
      });
  }

  public static findOne(condition: any = {}) {
    // condition is id
    if (typeof condition === 'string') {
      return this._pouch.get(condition)
        .then((res) => Promise.resolve(new this(res)));
    } else {
      return this._pouch.find({ selector: condition })
        .then((res) => Promise.resolve(new this(res.docs[0])));
    }
  }

  public static findAll(condition = {}) {
    return this._pouch.find({ selector: condition })
      .then((res) => Promise.resolve(res.docs.map((doc) => new this(doc))));
  }
}
