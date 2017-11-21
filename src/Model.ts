import * as _ from 'lodash';

export interface ModelAttribute {
  name: string;
  type: string;
}

export class Model {

  protected static _attributes: ModelAttribute[] = [];
  protected _values: any = {};

  protected _class: any = this.constructor; //@todo: can be removed ?!

  constructor(values?, attributes: ModelAttribute[] = []) {
    this._class._attributes = _.unionBy(this._class._attributes, attributes, 'name');
    this._initAttributes();
    if (values) {
      this.attributes = values;
    }
  }

  public static get className(): string {
    return this.name;
  }

  public get className(): string {
    return this._class.name;
  }

  private _initAttributes(): void {
    this._class._attributes.forEach((attribute: ModelAttribute) => {
      Object.defineProperty(this, attribute.name, {
        get: () => this._values[attribute.name],
        set: (value: any) => {
          this._values[attribute.name] = value;
        },
      });
    });
  }

  public static defineAttributes(attributes: ModelAttribute[]) {
    this._attributes = attributes;
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
