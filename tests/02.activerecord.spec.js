let ActiveRecord = require('./../').ActiveRecord;
let assert = require('assert');
let PouchDBMemory = require('pouchdb-adapter-memory');

describe('ActiveRecord', () => {

  it('should be instance of ActiveRecord', () => {

    ActiveRecord.config = {
      adapter: 'memory',
      plugins: [PouchDBMemory]
    }

    ActiveRecord.defineAttributes({
      foo: {
        type: 'string',
      },
      goo: {
        type: 'number',
      }
    });

    let values = { foo: 'bar', goo: 1 };
    let model = new ActiveRecord(values);
    assert.equal(model instanceof ActiveRecord, true);

    // static methods
    assert.equal(typeof ActiveRecord.find, 'function');
    assert.equal(typeof ActiveRecord.findOne, 'function');
    assert.equal(typeof ActiveRecord.findAll, 'function');

    // static getter
    assert.equal(ActiveRecord.className, 'ActiveRecord');
    // check for existance of pouch
    assert.equal(ActiveRecord.pouch !== undefined, true);

    // non-static methods
    assert.equal(typeof model.save, 'function');

    // non-static getter
    assert.equal(model.className, 'ActiveRecord');
    assert.equal(model.isNewRecord, true);
    assert.equal(JSON.stringify(model.attributes), JSON.stringify(values));
  });

});
