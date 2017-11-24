import { ActiveQuery } from './ActiveQuery';
import { Model, ModelAttribute } from './Model';
import { ActiveRecord } from './ActiveRecord';


export const ActiveRecordRelationType = {
  HasOne: 1,
  HasMany: 2,
  ManyToMany: 3
};

export class ActiveRecordRelation extends Model {

  private _child: typeof ActiveRecord;
  private _label: string;
  private _property: string;
  private _intermediate: typeof ActiveRecord;
  private _type: number;

  protected static _attributes: ModelAttribute[] = [
    new ModelAttribute('_child', typeof ActiveRecord),
    new ModelAttribute('_label'),
    new ModelAttribute('_property'),
    new ModelAttribute('_intermediate', typeof ActiveRecord),
    new ModelAttribute('_type', 'number'),
  ];

  public static hasOne(label: string, child: typeof ActiveRecord, property: string) {
    return new this({
      _label: label,
      _child: child,
      _property: property,
      _type: ActiveRecordRelationType.HasOne
    });
  }

  public static hasMany(label: string, child: typeof ActiveRecord, intermediate: typeof ActiveRecord) {
    return new this({
      _label: label,
      _child: child,
      _intermediate: intermediate,
      _type: ActiveRecordRelationType.HasMany
    });
  }

  public init(model: ActiveRecord) {
    if (this._type === ActiveRecordRelationType.HasOne) {
      Object.defineProperty(model, this._label, {
        get: () => {
          let condition = {};
          condition[this._property] = model.id;
          return new ActiveQuery(this._child)
            .where(condition)
            .all();
        },
        // set: (value: any) => {
        //   this._values[attribute.name] = value;
        // },
      });
    } else if (this._type === ActiveRecordRelationType.HasMany) {

    } else if (this._type === ActiveRecordRelationType.ManyToMany) {

    }
  }
}
