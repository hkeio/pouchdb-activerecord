import { ActiveRecord, ActiveRecordConfig, ModelAttribute } from './../index';
import * as PouchDBMemory from 'pouchdb-adapter-memory';

export class FooChild extends ActiveRecord {

  foo_id: string;

  protected static _attributes: ModelAttribute[] = [
    new ModelAttribute('foo_id')
  ];

  protected static _config: ActiveRecordConfig = {
    adapter: 'memory',
    plugins: [PouchDBMemory]
  };
}
