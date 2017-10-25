import { ActiveQuery } from './ActiveQuery';
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

  protected static _config: ActiveRecordConfig = {};
  private static _pouch: PouchDbInstance;
  private static _initialized: boolean = false;

  constructor(values?) {
    super(values, { _id: { type: 'string' }, _rev: { type: 'string' } });
    if (!this._class._initialized) {
      this._class._init();
    }
  }

  public static get pouch() {
    if (!this._initialized) {
      this._init();
    }
    return this._pouch;
  }

  public static set config(config) {
    this._config = _.merge(this._config, config);
  }

  private static _init() {
    this._pouch = new PouchDb(this.className, this._config);
    this._initialized = true;
  }

  get id(): string {
    return this.getAttribute('_id');
  }

  set id(value: string) {
    this.setAttribute('_id', value);
  }

  get isNewRecord(): boolean {
    return !this.id;
  }

  public save(): Promise<this> {
    return this._class._pouch.post(this.attributes)
      .then((res) => {
        this.setAttribute('_id', res.id);
        this.setAttribute('_rev', res.rev);
        return Promise.resolve(this);
      });
  }

  public static find() {
    return new ActiveQuery(this);
  }

  public static findOne(condition: any = {}): Promise<typeof ActiveRecord | ActiveRecord> {
    if (!this._initialized) {
      this._init();
    }

    // condition is id
    if (typeof condition === 'string') {
      return this._pouch.get(condition)
        .then((res) => Promise.resolve(new this(res)));
    } else {
      return this._pouch.find({ selector: condition })
        .then((res) => Promise.resolve(new this(res.docs[0])));
    }
  }

  public static findAll(condition = {}): Promise<typeof ActiveRecord[]> {
    if (!this._initialized) {
      this._init();
    }
    return this._pouch.find({ selector: condition })
      .then((res) => Promise.resolve(res.docs.map((doc) => new this(doc))));
  }
}
