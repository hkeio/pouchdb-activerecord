import { ActiveQuery } from './ActiveQuery';
import { Model, ModelAttribute } from './Model';
import { ActiveRecordRelation } from './ActiveRecordRelation';

import * as _ from 'lodash';
import * as PouchDB from 'pouchdb';
import * as PouchDBFind from 'pouchdb-find';

let PouchDb = PouchDB
  .plugin(PouchDBFind);

export interface ActiveRecordConfig {
  adapter?: string;
  plugins?: any[];
}

export interface PouchDbInstance {
  get: (id: string) => Promise<any>
  find: (condition: any) => Promise<any>
}

export class ActiveRecord extends Model {

  public _id: string;
  public _rev: string;

  protected static _config: ActiveRecordConfig = { plugins: [] };
  protected static _relations: ActiveRecordRelation[] = [];
  private static _pouch: { [model: string]: PouchDbInstance; } = {};
  private static _initialized: { [model: string]: boolean; } = {};

  constructor(values?) {
    super(values, [
      // add internal pouchdb properties
      new ModelAttribute('_id'),
      new ModelAttribute('_rev')
    ]);
    this._class.init();
    this._initRelations();
  }

  /* PouchDB init and config methods */

  public static get pouch() {
    this.init();
    return this._pouch[this.className];
  }

  public static set config(config) {
    this._config = _.merge(this._config, config);
  }

  public static init() {
    if (this._initialized[this.className]) {
      return;
    }

    this._config.plugins.forEach((plugin) => {
      PouchDb = PouchDb.plugin(plugin);
    });

    this._pouch[this.className] = new PouchDb('.db_' + this.className, this._config);
    this._initialized[this.className] = true;
  }

  private _initRelations() {
    this._class._relations.forEach((relation) => relation.init(this));
  }

  /* Easy access getter */

  get id(): string {
    return this.getAttribute('_id');
  }

  set id(value: string) {
    throw new Error('Property id cannot be set!');
    // this.setAttribute('_id', value);
  }

  get isNewRecord(): boolean {
    return !this.id;
  }

  /* Querying methods */

  public static find() {
    return new ActiveQuery(this);
  }

  public static async findOne(condition: any = {}): Promise<typeof ActiveRecord | ActiveRecord> {
    this.init();

    // condition is id
    if (typeof condition === 'string') {
      const res = await this.pouch.get(condition);
      return new this(res);
    }

    const res = await this.pouch.find({ selector: condition });
    return new this(res.docs[0]);
  }

  public static async findAll(condition = {}): Promise<typeof ActiveRecord[]> {
    this.init();
    const res = await this.pouch.find({ selector: condition });
    return res.docs.map((doc) => new this(doc));
  }

  public async save(): Promise<this> {
    const res = await this._class._pouch[this.className].post(this.attributes);
    this.setAttribute('_id', res.id);
    this.setAttribute('_rev', res.rev);
    return this;
  }
}
