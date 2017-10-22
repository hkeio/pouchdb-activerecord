import { ActiveRecord, ActiveRecordConfig } from './../index';
import * as _ from 'lodash';

export class Foo extends ActiveRecord {

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
    config = _.merge(config, { adapter: 'memory' });
    super(values, config);
  }
}
