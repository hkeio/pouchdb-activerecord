import { equal } from 'assert';

import { ActiveRecord } from './ActiveRecord';
import { ActiveQuery } from '../ActiveQuery/ActiveQuery';
import { ModelAttribute } from '../Model/Model';
import { ActiveRecordRelation } from '../../index';

export class TestRecord extends ActiveRecord {
  protected static _dbInit() {
    this.initialized(this.config.tableName);
    return true;
  }
  save() { }
}

class FooChild extends TestRecord { }
class Foo_Bar extends TestRecord { }
class Boo extends TestRecord { }
class Bar extends TestRecord {
  boo: string;
  protected static _attributes: ModelAttribute[] = [
    new ModelAttribute('goo')
  ];
}
class Foo extends TestRecord {

  foo?: string;
  goo?: number;

  bars?: Bar[];
  getBars?: () => Promise<ActiveQuery>;
  addBar?: (object: any | Bar) => Promise<void>;
  addBars?: (pbjects: any[] | Bar[]) => Promise<void>;

  fooChildrens?: FooChild[];
  getFooChildrens?: () => Promise<ActiveQuery>;
  addFooChildren?: (object: any | FooChild) => Promise<void>;
  addFooChildrens?: (objects: any[] | FooChild[]) => Promise<void>;

  boo?: Boo;
  boo_id?: string;
  setBoo?: (object: any | Boo) => Promise<void>;

  protected static _attributes: ModelAttribute[] = [
    new ModelAttribute('foo'),
    new ModelAttribute('goo'),
  ];

  public static relations: ActiveRecordRelation[] = [
    ActiveRecordRelation.manyToMany('bars', Bar, Foo_Bar, 'foo_id', 'bar_id'),
    ActiveRecordRelation.hasMany('fooChildren', FooChild, 'foo_id'),
    ActiveRecordRelation.hasOne('boo', Boo, 'boo_id')
  ];
}


describe('ActiveRecord', () => {

  it('should be instance of ActiveRecord', () => {

    let values = { foo: 'bar', goo: 1 };

    // static methods
    equal(typeof ActiveRecord.find, 'function');
    equal(typeof ActiveRecord.findOne, 'function');
    equal(typeof ActiveRecord.findAll, 'function');

    // static getter
    equal(ActiveRecord.config.tableName, 'ActiveRecord');
    // check for existance of db
    equal(ActiveRecord.db !== undefined, true);

  });

});
