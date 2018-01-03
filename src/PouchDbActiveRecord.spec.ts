import { equal } from 'assert';
import * as _ from 'lodash';
import * as PouchDBMemory from 'pouchdb-adapter-memory';

import { PouchDbActiveRecord as ActiveRecord, PouchDbActiveRecord } from './PouchDbActiveRecord';
import { PouchDBActiveQuery } from './PouchDbActiveQuery';
import { ModelAttribute, ActiveRecordRelation } from '@hke/activerecord/dist';

describe('PouchDbActiveRecord', () => {

  it('should be instance of PouchDbActiveRecord', () => {

    let values = { foo: 'bar', goo: 1 };
    let model = new ActiveRecord(values);
    equal(model instanceof ActiveRecord, true);

    // static getter
    equal(ActiveRecord.className, 'PouchDbActiveRecord');
    // check for existance of db
    equal(ActiveRecord.db !== undefined, true);
  });

});

describe('Foo', () => {

  class Boo extends PouchDbActiveRecord { }
  class Bar extends PouchDbActiveRecord {
    boo: string;

    public static _attributes: ModelAttribute[] = [
      new ModelAttribute('boo')
    ];
  }
  class Foo_Bar extends PouchDbActiveRecord { }
  class FooChild extends PouchDbActiveRecord { }
  class Foo extends PouchDbActiveRecord {
    foo?: string;
    goo?: number;

    bars?: Bar[];
    getBars?: () => Promise<PouchDBActiveQuery>;
    addBar?: (object: any | Bar) => Promise<void>;
    addBars?: (pbjects: any[] | Bar[]) => Promise<void>;

    fooChildrens?: FooChild[];
    getFooChildrens?: () => Promise<PouchDBActiveQuery>;
    addFooChildren?: (object: any | FooChild) => Promise<void>;
    addFooChildrens?: (objects: any[] | FooChild[]) => Promise<void>;

    boo?: Boo;
    boo_id?: string;
    setBoo?: (object: any | Boo) => Promise<void>;

    public static _attributes: ModelAttribute[] = [
      new ModelAttribute('foo'),
      new ModelAttribute('goo'),
    ];

    protected static _relations: ActiveRecordRelation[] = [
      ActiveRecordRelation.manyToMany('bars', Bar, Foo_Bar, 'foo_id', 'bar_id'),
      ActiveRecordRelation.hasMany('fooChildren', FooChild, 'foo_id'),
      ActiveRecordRelation.hasOne('boo', Boo, 'boo_id')
    ];
  }

  Foo._tableName = 'Foo';
  Foo.dbConfig = { adapter: 'memory', plugins: [PouchDBMemory] };

  Bar._tableName = 'Bar';
  Bar.dbConfig = { adapter: 'memory', plugins: [PouchDBMemory] };

  Foo_Bar._tableName = 'Foo_Bar';
  Foo_Bar.dbConfig = { adapter: 'memory', plugins: [PouchDBMemory] };

  FooChild._tableName = 'FooChild';
  FooChild.dbConfig = { adapter: 'memory', plugins: [PouchDBMemory] };

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
    let _model1 = _.find(res, { _id: model.id });
    let _model2 = _.find(res, { _id: model2.id });
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

  it('find() should return PouchDBActiveQuery', () => {
    let query = Foo.find();
    equal(query instanceof PouchDBActiveQuery, true);
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

  it('model.fooChildrens should be 0', async () => {
    const res: FooChild[] = await model.fooChildrens;
    equal(res.length, 0);
  });

  it('model.fooChildrens should be 1', async () => {
    let child = new FooChild();
    await model.addFooChildren(child);
    const res = await model.fooChildrens;
    equal(res.length, 1);
    equal(JSON.stringify(res[0]), JSON.stringify(child));
  });

  it('model.bars should be 0', async () => {
    const res: Bar[] = await model.bars;
    equal(res.length, 0);
  });

  it('model.bars should be 4', async () => {
    let bar = new Bar({ boo: 'ddd' });
    await bar.save();
    await model.addBar({ boo: 'aaa' });
    await model.addBar(new Bar({ boo: 'bbb' }));
    await model.addBars([{ boo: 'ccc' }, bar]);
    const res = await model.bars;
    equal(res.length, 4);
    equal(res[0] instanceof Bar, true);
  });

  it('model.getBars() should return ActiveQuery with condition set', async () => {
    const query = await model.getBars();
    equal(query.params.where._id.$in.length, 4);
    equal(query instanceof PouchDBActiveQuery, true);
  });

  it('model.boo and model.boo_id should be null', async () => {
    const res = await model.boo;
    equal(res, null);
    equal(model.boo_id, null);
  });

  it('model.boo and model.boo_id should be set', async () => {
    let boo = new Boo();
    await model.setBoo(boo);
    const res = await model.boo;
    equal(res instanceof Boo, true);
    equal(JSON.stringify(res), JSON.stringify(boo));
    equal(model.boo_id, boo.id);
  });

});
