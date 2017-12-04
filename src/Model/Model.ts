export class ModelAttribute {
  name: string;
  type: string;

  constructor(name, type: string = 'string') {
    this.name = name;
    this.type = type;
  }

  init(model: Model) {
    Object.defineProperty(model, this.name, {
      get: () => model.getAttribute(this.name),
      set: (value: any) => {
        model.setAttribute(this.name, value);
      },
    });
  }
}

export class Model {

  protected static _attributes: ModelAttribute[] = [];
  protected _values: any = {};

  protected _class: any = this.constructor; //@todo: can be removed ?!

  constructor(values?, attributes: ModelAttribute[] = []) {
    this._class.addAttributes(attributes);
    this._initAttributes();
    if (values) {
      this.attributes = values;
    }
  }

  public static addAttributes(attributes: ModelAttribute[]) {
    attributes.forEach((attribute: ModelAttribute) => {
      let found = false,
        index = null;
      this._attributes.forEach((attr: ModelAttribute, i) => {
        if (attribute.name === attr.name) {
          index = i;
          found = true;
        }
      });

      if (found) {
        this._attributes[index] = attribute;
      } else {
        this._attributes.push(attribute);
      }
    });
  }

  public static get className(): string {
    return this.name;
  }

  public get className(): string {
    return this._class.name;
  }

  private _initAttributes(): void {
    this._class._attributes.forEach((attribute: ModelAttribute) => attribute.init(this));
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
