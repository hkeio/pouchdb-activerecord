import { equal } from 'assert';
import { find } from 'lodash';
import * as PouchDBMemory from 'pouchdb-adapter-memory';

import {
  PouchDbActiveRecord as ActiveRecord,
  PouchDbActiveQuery as ActiveQuery,
  ActiveRecordRelation
} from './../src';
import { ModelAttribute } from '@hke/activerecord';

describe('PouchDbActiveRecord', () => {

  it('should be instance of ActiveRecord', () => {

    let values = { foo: 'bar', goo: 1 };
    let model = new ActiveRecord(values);
    equal(model instanceof ActiveRecord, true);

    // static getter
    equal(ActiveRecord.className, 'PouchDbActiveRecord');
    // check for existance of db
    equal(ActiveRecord.db !== undefined, true);
  });

});

export class TestRecord extends ActiveRecord {
  static _queryClass = ActiveQuery;
  static dbConfig = { adapter: 'memory', plugins: [PouchDBMemory] };
}

class Boo extends TestRecord { static _tableName = 'Boo'; }
class Bar extends TestRecord { static _tableName = 'Bar'; }
class Foo_Bar extends TestRecord { static _tableName = 'Foo_Bar'; }
class FooChild extends TestRecord { static _tableName = 'FooChild'; }
class Foo extends TestRecord {
  _id: string;
  foo?: string;
  goo?: number;

  addBoo: (any) => Promise<Boo>;

  static _tableName = 'Foo';

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

describe('Foo', () => {

  let model = new Foo({ foo: 'bar', goo: 1 });
  let model2;

  it('init model', () => {
    equal(model instanceof Foo, true);
    equal(JSON.stringify(model.attributes), '{"foo":"bar","goo":1}');
  });

  it('save()', async () => {
    await model.save()
    equal(model.isNewRecord, false);
  });

  it('save()', async () => {
    const res = await Foo.findOne(model.id);
    equal(res instanceof Foo, true);
    equal(JSON.stringify(model.attributes), JSON.stringify(res.attributes));
  });

  it('2nd model save()', async () => {
    model2 = new Foo({ foo: 'baz', goo: 2 });
    await model2.save()
  });

  it('findAll()', async () => {
    const res: Foo[] = await Foo.findAll();
    equal(res.length, 2);
    let _model1 = find(res, { id: model.id });
    let _model2 = find(res, { id: model2.id });
    equal(_model1 instanceof Foo, true);
    equal(_model1.foo, 'bar');
    equal(_model2 instanceof Foo, true);
    equal(_model2.foo, 'baz');
  });

  it('findOne()', async () => {
    const res: Foo = await Foo.findOne({ foo: 'baz' });
    equal(res instanceof Foo, true);
    equal(res.foo, 'baz');
  });

  it('findAll({ goo: { $gt: 1 } })', async () => {
    const res: Foo[] = await Foo.findAll({ goo: { $gt: 1 } });
    equal(res.length, 1);
    equal(res[0].foo, 'baz');
  });

  it('find() should return ActiveQuery', () => {
    let query = Foo.find();
    equal(query instanceof ActiveQuery, true);
  });

  it('find().one(false) without creating instance', async () => {
    const res = await Foo.find().one(false);
    equal(res instanceof Foo, false);
    equal(res.hasOwnProperty('foo'), true);
    equal(res.hasOwnProperty('goo'), true);
    equal(res.hasOwnProperty('_id'), true);
    equal(res.hasOwnProperty('_rev'), true);
  });

  it('find().all(false) without creating instances', async () => {
    const res = await Foo.find().all(false);
    equal(res.length, 2);
    equal(res[0] instanceof Foo, false);
    equal(res[0].hasOwnProperty('foo'), true);
    equal(res[0].hasOwnProperty('goo'), true);
    equal(res[0].hasOwnProperty('_id'), true);
    equal(res[0].hasOwnProperty('_rev'), true);
  });

  it('relations', async () => {

    let bar = new Bar({});
    equal(await bar.save() instanceof Bar, true);
    const bars = await foo.addBars([bar, {}, new Bar({})]);
    await foo.addBars(bars);
    equal(bars.length, 3);
    equal(bars[0] instanceof Bar, true);
    equal(bars[1] instanceof Bar, true);
    equal(bars[2] instanceof Bar, true);
    equal(await foo.addBar(bar) instanceof Bar, true);
    equal(await foo.addBar({}) instanceof Bar, true);
    equal(await foo.addBar(new Bar({})) instanceof Bar, true);
    equal((await foo.bars).length, 5); // only 5 because `bar` can only be added once
    equal((await Foo_Bar.findAll()).length, 5);
    const barsQuery = await foo.getBars();
    equal(barsQuery instanceof TestQuery, true);
    equal(barsQuery.params.where[Bar.config.identifier].$in.length, 5);

    // has many relation
    equal(foo.fooChildrens instanceof Promise, true);
    equal(foo.getFooChildrens() instanceof Promise, true);
    equal(typeof foo.getFooChildrens, 'function');
    equal(typeof foo.addFooChildren, 'function');
    equal(typeof foo.addFooChildrens, 'function');
    // @todo: add more tests for *has many relations*
    console.log('@todo: add more tests for *has many relations*');

    // has one relations
    equal(foo.hasOwnProperty('boo'), true);
    equal(typeof foo.setBoo, 'function');
    // @todo: add more tests for *has one relations*
    console.log('@todo: add more tests for *has one relations*');

  });

});
