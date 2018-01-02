import { ActiveQuery } from './../ActiveQuery';
import { Model, ModelAttribute } from './../Model';
import { ActiveRecordRelation } from './ActiveRecordRelation';
import { Exception } from 'handlebars/handlebars.runtime';

export interface ActiveRecordConfig {
  adapter?: string;
  identifier: 'id';
  tableName: string;
  plugins?: any[];
}

export abstract class DbInstance { }

export abstract class ActiveRecord extends Model {

  public static relations: ActiveRecordRelation[] = [];

  private static _config: ActiveRecordConfig = {
    identifier: 'id',
    tableName: 'ActiveRecord'
  };

  private static _db: { [model: string]: DbInstance; } = {};
  private static _initialized: { [model: string]: boolean; } = {};

  constructor(values?) {
    super(values);
    this._class.init();
    this._initRelations();
  }

  static get db() {
    return this._db;
  }
  protected static _dbInit() {
    throw new Error('<Model>._dbInit() must be set!')
  }

  public static initialized(model: string) {
    this._initialized[model] = true;
  }

  public static get config() {
    return this._config;
  }

  public static set config(config) {
    Object.keys(config).forEach((key) => {
      this._config[key] = config[key];
    });
  }

  public static init() {
    if (this._initialized[this.config.tableName]) {
      return;
    }

    this._dbInit();
    this._initialized[this.config.tableName] = true;
  }

  private _initRelations() {
    this._class._relations.forEach((relation) => relation.init(this));
  }

  /* Easy access getter */

  get id(): string {
    return this.getAttribute(this._class._config.identifier);
  }

  set id(value: string) {
    throw new Error('Property id cannot be set!');
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

  public abstract save(): any;
}
