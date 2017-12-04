import { equal } from 'assert';

import { ActiveQuery } from './ActiveQuery';
import { ActiveRecord } from './../ActiveRecord';

describe('ActiveQuery', () => {

  it('should be instance of ActiveRecord', () => {
    let model = new ActiveQuery(ActiveRecord);
    equal(model instanceof ActiveQuery, true);
    equal(typeof model.fields, 'function');
    equal(typeof model.sort, 'function');
    equal(typeof model.limit, 'function');
    equal(typeof model.where, 'function');
    equal(typeof model.one, 'function');
    equal(typeof model.all, 'function');
  });

});
