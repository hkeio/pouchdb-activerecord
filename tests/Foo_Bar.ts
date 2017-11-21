import { ActiveRecord, ActiveRecordConfig, ModelAttribute } from './../index';
import * as PouchDBMemory from 'pouchdb-adapter-memory';

export class Foo_Bar extends ActiveRecord {

  foo_id: string;
  bar_id: string;

  protected static _attributes: ModelAttribute[] = [
    {
      name: 'foo_id',
      type: 'string',
    },
    {
      name: 'bar_id',
      type: 'string',
    }
  ];

  protected static _config: ActiveRecordConfig = {
    adapter: 'memory',
    plugins: [PouchDBMemory]
  };
}
