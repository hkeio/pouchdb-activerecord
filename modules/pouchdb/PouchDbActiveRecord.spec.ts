import { equal } from 'assert';
// import * as PouchDBMemory from 'pouchdb-adapter-memory';

import { ActiveRecord } from './index';

describe('ActiveRecord', () => {

  it('should be instance of ActiveRecord', () => {

    // ActiveRecord.config = {
    //   adapter: 'memory',
    //   plugins: [PouchDBMemory]
    // }

    let values = { foo: 'bar', goo: 1 };
    // let model = new ActiveRecord(values);
    // equal(model instanceof ActiveRecord, true);

    // static methods
    equal(typeof ActiveRecord.find, 'function');
    equal(typeof ActiveRecord.findOne, 'function');
    equal(typeof ActiveRecord.findAll, 'function');

    // static getter
    equal(ActiveRecord.className, 'ActiveRecord');
    // check for existance of db
    equal(ActiveRecord.db !== undefined, true);

    // non-static methods
    // equal(typeof model.save, 'function');

    // non-static getter
    // equal(model.className, 'ActiveRecord');
    // equal(model.isNewRecord, true);
    // equal(JSON.stringify(model.attributes), JSON.stringify(values));
  });

});
