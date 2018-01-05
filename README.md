# pouchdb-activerecord

[![npm version](https://badge.fury.io/js/pouchdb-activerecord.svg)](https://badge.fury.io/js/pouchdb-activerecord)
[![Build Status](https://travis-ci.org/hkeio/pouchdb-activerecord.svg?branch=master)](https://travis-ci.org/hkeio/pouchdb-activerecord)
[![Maintainability](https://api.codeclimate.com/v1/badges/5ef976bb58a39825a1a5/maintainability)](https://codeclimate.com/github/hkeio/pouchdb-activerecord/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5ef976bb58a39825a1a5/test_coverage)](https://codeclimate.com/github/hkeio/pouchdb-activerecord/test_coverage)

## Example

```
import * as PouchDBMemory from 'pouchdb-adapter-memory';
import {
  PouchDbActiveRecord as ActiveRecord,
  PouchDbActiveQuery as ActiveQuery
} from './../src';
import { ModelAttribute } from '@hke/activerecord';

class Foo extends ActiveRecord {

  _id: string;
  foo?: string;
  goo?: number;

  static _identifier = '_id';
  static _tableName = 'Foo';
  static dbConfig = { adapter: 'memory', plugins: [PouchDBMemory] };

  public static _attributes: ModelAttribute[] = [
    new ModelAttribute('foo'),
    new ModelAttribute('goo'),
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
