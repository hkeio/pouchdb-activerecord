import { ActiveRecord, ActiveRecordConfig, ModelAttribute } from './../index';
import * as PouchDBMemory from 'pouchdb-adapter-memory';

export class Foo_Bar extends ActiveRecord {

  protected static _attributes: ModelAttribute[] = [
    new ModelAttribute('foo_id'),
    new ModelAttribute('bar_id')
  ];

  protected static _config: ActiveRecordConfig = {
    adapter: 'memory',
    plugins: [PouchDBMemory]
  };

}
