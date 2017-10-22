### Example

```
import { ActiveRecord, ActiveRecordConfig } from 'pouchdb-activerecord';

class Foo extends ActiveRecord {

  foo: string;
  goo: number;

  protected static _attributes = {
    foo: {
      type: 'string',
    },
    goo: {
      type: 'number',
    }
  };

  constructor(values?, config?: ActiveRecordConfig) {
    super(values, config);
  }
}

let model = new Foo({ foo: 'bar', goo: 1 });
console.log(model.foo); // 'baz'
console.log(model.goo); // 1
console.log(model.isNewRecord); // true
console.log(model.id); // undefined
model.save()
  .then(() => {
    console.log(model.isNewRecord); // false
    console.log(model.id); // uuid
  });
```

### Methods

```
foo.save();
Foo.findOne('uuid');
Foo.findOne({foo: 'baz'});
Foo.findAll();
Foo.findAll({goo: {$gt: 0}});
```
