import { ActiveRecord, ActiveRecordConfig, ModelAttribute } from './../index';
import * as PouchDBMemory from 'pouchdb-adapter-memory';

export class FooChild extends ActiveRecord {

  foo_id: string;

  protected static _attributes: ModelAttribute[] = [
    {
      name: 'foo_id',
      type: 'string',
    }
  ];

  protected static _config: ActiveRecordConfig = {
    adapter: 'memory',
    plugins: [PouchDBMemory]
  };
}
