let Foo = require('./Foo').Foo;
let assert = require('assert');
let _ = require('lodash');

describe('Foo', () => {

  let model, id1, id2;

  it('init model', () => {
    model = new Foo({ foo: 'bar', goo: 1 });
    assert.equal(JSON.stringify(model.attributes), '{"foo":"bar","goo":1}', '#1.1');
  });

  it('save()', (done) => {
    model.save()
      .then(() => {
        assert.equal(model.isNewRecord, false, '#2.1');
        id1 = model.id;
        done();
      });

  });

  it('save()', (done) => {
    Foo.findOne(model.id)
      .then((res) => {
        assert.equal(res instanceof Foo, true, '#3.1');
        assert.equal(JSON.stringify(model.attributes), JSON.stringify(res.attributes), '#3.2');
        done();
      });
  });

  it('2nd model save()', (done) => {
    new Foo({ foo: 'baz', goo: 2 }).save()
      .then((res) => {
        id2 = res.id;
        done();
      });
  });

  it('findAll()', (done) => {
    Foo.findAll()
      .then((models) => {
        assert.equal(models.length, 2, '#4.1');
        let model1 = _.find(models, { _id: id1 });
        let model2 = _.find(models, { _id: id2 });
        assert.equal(model1 instanceof Foo, true, '#4.2');
        assert.equal(model1.foo, 'bar', '#4.3');
        assert.equal(model2 instanceof Foo, true, '#4.4');
        assert.equal(model2.foo, 'baz', '#4.5');
        done();
      });
  });

  it('findOne()', (done) => {
    Foo.findOne({ foo: 'baz' })
      .then((model3) => {
        assert.equal(model3 instanceof Foo, true, '#5.1');
        assert.equal(model3.foo, 'baz', '#5.2');
        done();
      });
  });

  it('findAll({ goo: { $gt: 1 } })', (done) => {
    Foo.findAll({ goo: { $gt: 1 } })
      .then((models) => {
        assert.equal(models.length, 1, '#6.1');
        assert.equal(models[0].foo, 'baz', '#6.2');
        done();
      });
  });

  it('find() should return ActiveQuery', (done) => {
    // let query = Foo.find();
    // console.log(query);
    // .then((models) => {
    //   assert.equal(models.length, 1, '#6.1');
    //   assert.equal(models[0].foo, 'baz', '#6.2');
    done();
    // });
  });

});
