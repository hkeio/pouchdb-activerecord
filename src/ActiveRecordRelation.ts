import { ActiveQuery } from './ActiveQuery';
import { Model, ModelAttribute } from './Model';
import { ActiveRecord } from './ActiveRecord';

const ActiveRecordRelationType = {
  HasOne: 1,
  HasMany: 2,
  ManyToMany: 3
};

export class ActiveRecordRelation extends Model {

  private _child: typeof ActiveRecord;
  private _foreignKey: string;
  private _intermediate: typeof ActiveRecord;
  private _key: string;
  private _label: string;
  private _property: string;
  private _type: number;

  protected static _attributes: ModelAttribute[] = [
    new ModelAttribute('_child', typeof ActiveRecord),
    new ModelAttribute('_foreignKey'),
    new ModelAttribute('_intermediate', typeof ActiveRecord),
    new ModelAttribute('_key'),
    new ModelAttribute('_label'),
    new ModelAttribute('_property'),
    new ModelAttribute('_type', 'number'),
  ];

  public static hasOne(label: string, child: typeof ActiveRecord, property: string) {
    return new this({
      _child: child,
      _label: label,
      _property: property,
      _type: ActiveRecordRelationType.HasOne
    });
  }

  public static hasMany(label: string, child: typeof ActiveRecord, property: string) {
    return new this({
      _child: child,
      _label: label,
      _property: property,
      _type: ActiveRecordRelationType.HasMany
    });
  }

  public static manyToMany(label: string, child: typeof ActiveRecord, intermediate: typeof ActiveRecord, key: string, foreignKey: string) {
    return new this({
      _child: child,
      _foreignKey: foreignKey,
      _intermediate: intermediate,
      _key: key,
      _label: label,
      _type: ActiveRecordRelationType.ManyToMany
    });
  }

  public init(model: ActiveRecord) {
    let condition = {};
    if (this._type === ActiveRecordRelationType.HasOne) {

      Object.defineProperty(model, this._label, {
        get: () => {
          condition[this._property] = model.id;
          return new ActiveQuery(this._child).where(condition).one();
        },
      });

    } else if (this._type === ActiveRecordRelationType.HasMany) {

      Object.defineProperty(model, this._label, {
        get: () => {
          condition[this._property] = model.id;
          return new ActiveQuery(this._child).where(condition).all();
        },
      });

    } else if (this._type === ActiveRecordRelationType.ManyToMany) {

      Object.defineProperty(model, this._label, {
        get: async () => {
          condition[this._key] = model.id;
          const res = await this._intermediate.pouch.find({
            selector: condition,
            fields: [this._foreignKey]
          });
          if (!res.docs.length) {
            return [];
          }
          const ids = res.docs.map((doc) => doc[this._foreignKey]);
          return new ActiveQuery(this._child).where({ _id: { $in: ids } }).all();
        },
      });

    }
  }
}