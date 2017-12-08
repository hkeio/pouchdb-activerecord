import { ActiveRecord, DbInstance } from './../ActiveRecord';

export interface ActiveQueryParams {
  fields: string[],
  limit: {
    start: number,
    end: number
  },
  sort: string[],
  where: any,
}

export interface ActiveQueryInterface {
  _db: DbInstance;
  one(map?: boolean): Promise<typeof ActiveRecord>;
  all(map?: boolean): Promise<typeof ActiveRecord[]>;
}

export class ActiveQuery implements ActiveQueryInterface {

  _db: DbInstance;

  private _model: typeof ActiveRecord;
  private _params: ActiveQueryParams = {
    fields: [],
    limit: {
      start: 0,
      end: undefined
    },
    sort: [],
    where: {},
  };

  constructor(model: typeof ActiveRecord) {
    model.init();
    this._db = model.db;
    this._model = model;
  }

  public get params() {
    return this._params;
  }

  public get db() {
    return this._db;
  }

  public get model() {
    return this._model;
  }

  public fields(param: string[]) {
    let fields: any = param;
    if (param.constructor.name === 'string') {
      fields = [param];
    }
    this._params.fields = fields;
    return this;
  }

  public sort(param: string[]) {
    let sort: any = param;
    if (param.constructor.name === 'string') {
      sort = [param];
    }
    this._params.sort = sort;
    return this;
  }

  public limit(start = 0, end = null) {
    this._params.limit.start = start;
    this._params.limit.end = end;
    return this;
  }

  public where(condition: any = {}) {
    this._params.where = condition;
    return this;
  }

  public one(map?: boolean): Promise<any> { return Promise.resolve(); }
  public all(map?: boolean): Promise<any[]> { return Promise.resolve([]); }
}
