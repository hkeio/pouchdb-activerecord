import { ActiveRecord, ActiveRecordConfig } from './../index';
import * as PouchDBMemory from 'pouchdb-adapter-memory';

export class Foo_Bar extends ActiveRecord {

  foo_id: string;
  bar_id: string;

  protected static _attributes = {
    foo_id: {
      type: 'string',
    },
    bar_id: {
      type: 'string',
    }
  };

  protected static _config: ActiveRecordConfig = {
    adapter: 'memory',
    plugins: [PouchDBMemory]
  };
}
