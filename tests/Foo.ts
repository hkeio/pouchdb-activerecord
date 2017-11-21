import { ActiveRecord, ActiveRecordConfig, ModelAttribute } from './../index';
import * as _ from 'lodash';

import * as PouchDBMemory from 'pouchdb-adapter-memory';

export class Foo extends ActiveRecord {

  foo: string;
  goo: number;

  protected static _attributes: ModelAttribute[] = [
    {
      name: 'foo',
      type: 'string',
    },
    {
      name: 'goo',
      type: 'number',
    }
  ];

  protected static _config: ActiveRecordConfig = {
    adapter: 'memory',
    plugins: [PouchDBMemory]
  };

  // constructor(values?) {
  //   super(values);
  // }
}
