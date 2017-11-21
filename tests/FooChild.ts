import { ActiveRecord, ActiveRecordConfig } from './../index';
import * as PouchDBMemory from 'pouchdb-adapter-memory';

export class FooChild extends ActiveRecord {

  foo_id: string;

  protected static _attributes = {
    foo_id: {
      type: 'string',
    }
  };

  protected static _config: ActiveRecordConfig = {
    adapter: 'memory',
    plugins: [PouchDBMemory]
  };
}
