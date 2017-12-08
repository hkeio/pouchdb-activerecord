import { ActiveQuery } from './../ActiveQuery';
import { Model, ModelAttribute } from './../Model';
import { ActiveRecordRelation } from './ActiveRecordRelation';

export interface ActiveRecordConfig {
  adapter?: string;
  plugins?: any[];
}

export abstract class DbInstance { }

// @todo: this does not work correctly
export abstract class ActiveRecordBaseClass {
  // protected _class: any;
  static _db?: { [model: string]: DbInstance; }
  public static save: (objects: any[]) => Promise<ActiveRecord[]>;
}

export abstract class ActiveRecord extends Model implements ActiveRecordBaseClass {

  public _class: any;
  static _db: { [model: string]: DbInstance; } = {};

  public static _config: ActiveRecordConfig = { plugins: [] };
  protected static _relations: ActiveRecordRelation[] = [];
  private static _initialized: { [model: string]: boolean; } = {};

  constructor(values?) {
    super(values);
    this._class.init();
    this._initRelations();
  }

  static get db() {
    return this._db;
  }
  static _dbInit() { }

  public static set config(config) {
    Object.keys(config).forEach((key) => {
      this._config[key] = config[key];
    });
  }

  private static init() {
    if (this._initialized[this.className]) {
      return;
    }

    this._dbInit();
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
    this.init();
    return new ActiveQuery(this);
  }

  public static async findOne(condition: any = {}): Promise<ActiveRecord> {
    this.init();

    // condition is id
    if (typeof condition === 'string') {
      condition['_id'] = condition;
    }

    return await this.find()
      .where(condition)
      .one();
  }

  public static async findAll(condition = {}): Promise<ActiveRecord[]> {
    return await this.find()
      .where(condition)
      .all();
  }

  public async save(): Promise<this> {
    const res = await this._class.pouch.post(this.attributes);
    this.setAttribute('_id', res.id);
    this.setAttribute('_rev', res.rev);
    return this;
  }
}
