import { ActiveRecord } from './ActiveRecord';

export class ActiveQuery {

  private _model: typeof ActiveRecord;
  private _pouch;
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
    this._pouch = model.pouch;
    this._model = model;
  }

  public fields(param: string | string[]) {
    let fields: any = param;
    if (param.constructor.name === 'string') {
      fields = [param];
    }
    this._params.fields = fields;
    return this;
  }

  public sort(param: string | string[]) {
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

  public one() {
    return this._pouch.find({
      selector: this._params.where,
      fields: this._params.sort,
      sort: this._params.sort,
      limit: this._params.limit.end,
      skip: this._params.limit.start
    })
      .then((res) => Promise.resolve(new this._model(res.docs[0])));
  }

  public all() {
    return this._pouch.find({
      selector: this._params.where,
      fields: this._params.sort,
      sort: this._params.sort,
      limit: this._params.limit.end,
      skip: this._params.limit.start
    })
      .then((res) => Promise.resolve(res.docs.map((doc) => new this._model(doc))));
  }
}
