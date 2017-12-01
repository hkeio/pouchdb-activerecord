## Example

```
import {
  ActiveRecord,
  ModelAttribute,
  ActiveRecordRelation,
  ActiveQuery
} from './../index';

import { Bar } from './Bar';
import { Boo } from './Boo';
import { Foo_Bar } from './Foo_Bar';
import { FooChild } from './FooChild';

export interface FooInterface {
  // declare id to prevent transpilation error
  id: string;

  // following properties and methods get defined at runtime
  foo?: string;
  goo?: number;

  // defined by `ActiveRecordRelation.manyToMany`
  bars?: Bar[];
  getBars?: () => Promise<ActiveQuery>;
  addBar?: (object: any | Bar) => Promise<void>;
  addBars?: (pbjects: any[] | Bar[]) => Promise<void>;

  // defined by `ActiveRecordRelation.hasMany`
  fooChildrens?: FooChild[];
  getFooChildrens?: () => Promise<ActiveQuery>;
  addFooChildren?: (object: any | FooChild) => Promise<void>;
  addFooChildrens?: (objects: any[] | FooChild[]) => Promise<void>;

  // defined by `ActiveRecordRelation.hasOne`
  boo?: Boo;
  boo_id?: string;
  setBoo?: (object: any | Boo) => Promise<void>;
}

export class Foo extends ActiveRecord implements FooInterface {

  protected static _attributes: ModelAttribute[] = [
    new ModelAttribute('foo'),
    new ModelAttribute('goo'),
  ];

  protected static _relations: ActiveRecordRelation[] = [
    ActiveRecordRelation.manyToMany('bars', Bar, Foo_Bar, 'foo_id', 'bar_id'),
    ActiveRecordRelation.hasMany('fooChildren', FooChild, 'foo_id'),
    ActiveRecordRelation.hasOne('boo', Boo, 'boo_id')
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
```

## ActiveRecord

### Methods

```
foo.save();
foo.find(); // returns ActiveQuery
Foo.findOne('uuid');
Foo.findOne({foo: 'baz'});
Foo.findAll();
Foo.findAll({goo: {$gt: 0}});
```

See options [here](https://pouchdb.com/guides/mango-queries.html)

## ActiveRecordRelation

The static methods create properties and methods on the given classes.

### Methods

```
ActiveRecordRelation.hasOne(label: string, child: typeof ActiveRecord, property: string);
hasMany(label: string, child: typeof ActiveRecord, property: string);
manyToMany(label: string, child: typeof ActiveRecord, intermediate: typeof ActiveRecord, key: string, foreignKey: string)
```

### ActiveRecordRelation.hasOne('a', Bar, 'a_id')

Defines a 1:1 relation. The method creates `a` and `a_id` on the parent class. `model.a` returns a Promise resolving in the `Bar` object. `model.a_id` contains the foreign pk id of the child object. The foreign object can be set with `model.setA(object)`.

### ActiveRecordRelation.hasMany('a', Bar, 'parent_id')

Defines a 1:n relation. The method creates a `as` property on the parent class. `a` is pluralized so it becomes `as` (if it would be `as` it stays `as`). `model.as` returns a Promise resolving in the related `Bar` objects. `model.addA` and `model.addAs` adds one or multiple foreign object and sets the `parent_id` property containing the parent id on the child object(s). `model.getAs()` returns a ActiveQuery with the foreign object ids preset in a `$in` condition.

### ActiveRecordRelation.manyToMany('a', Bar, Foo_Bar, 'a_id', 'b_id')

Defines a n:m relation. The method creates a `as` property on the parent class. (label is `bar`, becomes `bars`). `a` is pluralized so it becomes `as` (if it would be `as` it stays `as`). `model.as` returns a Promise resolving in the related `Bar` objects. `model.addA` and `model.addAs` adds one or multiple foreign object and creates the relation entries in `Foo_Bar` with `a_id` containing the parent object id and `b_id` containing the child object id. `model.getAs()` returns a ActiveQuery with the foreign object ids preset in a `$in` condition.

## ActiveQuery

You can do extended queries and filtering with ActiveQuery.

### Methods

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

See where options [here](https://pouchdb.com/guides/mango-queries.html)

## To Do

* Add test coverage
* Add attribute validation on save
* Make modular so underlying database system can be other than PouchDB
