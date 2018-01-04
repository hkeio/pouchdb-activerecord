import { equal } from 'assert';
import * as _ from 'lodash';
import * as PouchDBMemory from 'pouchdb-adapter-memory';

import {
  PouchDbActiveRecord as ActiveRecord,
  PouchDbActiveQuery as ActiveQuery
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
    let _model1 = _.find(res, { id: model.id });
    let _model2 = _.find(res, { id: model2.id });
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

});
