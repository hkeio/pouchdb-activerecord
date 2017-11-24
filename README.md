### Example

```
import {
  ActiveRecord,
  ActiveRecordConfig,
  ModelAttribute,
  ActiveRecordRelation
} from 'pouchdb-activerecord';

class Foo extends ActiveRecord {

  foo: string;
  goo: number;

  protected static _attributes: ModelAttribute[] = [
    new ModelAttribute('foo'),
    new ModelAttribute('goo'),
  ];

  protected static _relations: ActiveRecordRelation[] = [
    ActiveRecordRelation.manyToMany('bars', Bar, Foo_Bar, 'foo_id', 'bar_id'),
    ActiveRecordRelation.hasOne('fooChild', FooChild, 'foo_id')
  ];
}

// instance creation
let model = new Foo({ foo: 'bar', goo: 1 });

// model gets values from constructor
console.log(model.foo); // 'bar'
console.log(model.goo); // 1

// has no id because it is a new (unsaved) record
console.log(model.isNewRecord); // true
console.log(model.id); // undefined

// .save() write record to db
await model.save();

// model got an id
console.log(model.isNewRecord); // false
console.log(model.id); // uuid

// relations
mode.bars // return Promise<Bar[]>
mode.fooChild // return Promise<FooChild>
```

### ActiveRecord

## Methods

```
foo.save();
foo.find(); // returns ActiveQuery
Foo.findOne('uuid');
Foo.findOne({foo: 'baz'});
Foo.findAll();
Foo.findAll({goo: {$gt: 0}});
```

### ActiveQuery

You can do extended queries and filtering with ActiveQuery.

## Methods

```
let query = new ActiveQuery(Foo); // or foo.find() (foo is instanceof ActiveRecord)
query
  .fields(param: string[])
  .sort(param: string[])
  .limit(start = 0, end = null)
  .where(condition: any = {})
  // call either one() or all()
  .one() // sets .limit(0,1) and returns Promise<type ActiveRecord>
  .all() // returns Promise<type ActiveRecord[]>
```
