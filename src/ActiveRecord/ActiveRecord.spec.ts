import { equal } from 'assert';

import { ActiveRecord } from './index';

describe('ActiveRecord', () => {

  it('should be instance of ActiveRecord', () => {

    let values = { foo: 'bar', goo: 1 };

    // static methods
    equal(typeof ActiveRecord.find, 'function');
    equal(typeof ActiveRecord.findOne, 'function');
    equal(typeof ActiveRecord.findAll, 'function');

    // static getter
    equal(ActiveRecord.className, 'ActiveRecord');
    // check for existance of db
    equal(ActiveRecord.db !== undefined, true);

  });

});
