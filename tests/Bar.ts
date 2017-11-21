import { ActiveRecord, ActiveRecordConfig, ModelAttribute } from './../index';
import * as PouchDBMemory from 'pouchdb-adapter-memory';

export class Bar extends ActiveRecord {

  boo: string;

  protected static _attributes: ModelAttribute[] = [
    {
      name: 'boo',
      type: 'string',
    }
  ];

  protected static _config: ActiveRecordConfig = {
    adapter: 'memory',
    plugins: [PouchDBMemory]
  };
}
