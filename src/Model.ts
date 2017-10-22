import * as _ from 'lodash';

export class Model {

  protected static _attributes: any = {};
  protected _values: any = {};

  protected _class: any = this.constructor;

  constructor(values?, attributes = {}) {
    this._class._attributes = _.merge(this._class._attributes, attributes);
    this._initAttributes();
    if (values) {
      this.attributes = values;
    }
  }

  public get className(): string {
    return this._class.name;
  }

  private _initAttributes(): void {
    let keys = Object.keys(this._class._attributes);
    for (var i = 0, l = keys.length; i < l; i++) {
      let key = keys[i];

      Object.defineProperty(this, key, {
        get: () => this._values[key],
        set: (value: any) => {
          this._values[key] = value;
        },
      });
    }
  }

  public setAttributes(values): void {
    let keys = Object.keys(values);
    for (var i = 0, l = keys.length; i < l; i++) {
      this._values[keys[i]] = values[keys[i]];
    }
  }

  public set attributes(values) {
    this.setAttributes(values);
  }

  public get attributes(): any {
    return this._values;
  }

  public setAttribute(attribute: string, value): void {
    this._values[attribute] = value;
  }

  public getAttribute(attribute: string): any {
    return this._values[attribute];
  }
}
