import { ActiveQuery } from './ActiveQuery';
import { Model, ModelAttribute } from './Model';

import * as _ from 'lodash';
import * as PouchDB from 'pouchdb';
import * as PouchDBFind from 'pouchdb-find';

let PouchDb = PouchDB
  .plugin(PouchDBFind);

export const ActiveRecordRelationType = {
  HasOne: 1,
  HasMany: 2,
  ManyToMany: 3
};

export interface ActiveRecordRelation {
  child: typeof ActiveRecord;
  // parent: typeof ActiveRecord;
  name: string;
  property?: string;
  relationModel?: typeof ActiveRecord;
  type: number;
}

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
    super(values, [{ name: '_id', type: 'string' }, { name: '_rev', type: 'string' }]);
    this._class.init();
    this._initRelations();
  }

  public static get pouch() {
    this.init();
    return this._pouch[this.className];
  }

  public static set config(config) {
    this._config = _.merge(this._config, config);
  }

  private _initRelations() {
    this._class._relations.forEach((relation: ActiveRecordRelation) => {
      switch (relation.type) {
        case ActiveRecordRelationType.HasOne:
          // console.log(relation);
          Object.defineProperty(this, relation.name, {
            get: () => {
              let condition = {};
              condition[relation.property] = this.id;
              // console.log('jlasjdklajskld', );
              return new ActiveQuery(relation.child)
              // .where(condition);
            },
            // set: (value: any) => {
            //   this._values[attribute.name] = value;
            // },
          });
          break;
      }
    });
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

  public static find() {
    return new ActiveQuery(this);
  }

  public static findOne(condition: any = {}): Promise<typeof ActiveRecord | ActiveRecord> {
    this.init();

    // condition is id
    if (typeof condition === 'string') {
      return this.pouch.get(condition)
        .then((res) => Promise.resolve(new this(res)));
    } else {
      return this.pouch.find({ selector: condition })
        .then((res) => Promise.resolve(new this(res.docs[0])));
    }
  }

  public static findAll(condition = {}): Promise<typeof ActiveRecord[]> {
    this.init();
    return this.pouch.find({ selector: condition })
      .then((res) => Promise.resolve(res.docs.map((doc) => new this(doc))));
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
    return this._class._pouch[this.className].post(this.attributes)
      .then((res) => {
        this.setAttribute('_id', res.id);
        this.setAttribute('_rev', res.rev);
        return Promise.resolve(this);
      });
  }

}
