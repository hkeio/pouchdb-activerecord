import { ActiveRecord, PouchDbInstance } from './ActiveRecord';

export class ActiveQuery {

  private _model: typeof ActiveRecord;
  private _pouch: PouchDbInstance;
  private _params = {
    fields: [],
    limit: {
      start: 0,
      end: null
    },
    sort: [],
    where: {},
  };

  constructor(model: typeof ActiveRecord) {
    if (!model) {
      throw new Error('NoModelException');
    }
    model.init();
    this._pouch = model.pouch;
    this._model = model;
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

  public async one() {
    let query = {
      fields: null,
      limit: 1,
      selector: this._params.where,
      sort: null,
      skip: 0
    };
    if (this._params.fields.length) {
      query.fields = this._params.fields;
    }
    if (this._params.sort.length) {
      query.sort = this._params.sort;
    }
    const res = await this._pouch.find(query);
    return res.docs.length ? new this._model(res.docs[0]) : null;
  }

  public async all() {
    const res = await this._pouch.find({
      selector: this._params.where,
      // fields: this._params.fields,
      // sort: this._params.sort,
      // limit: this._params.limit.end,
      // skip: this._params.limit.start
    });
    return res.docs.map((doc) => new this._model(doc));
  }
}
