import { ActiveRecord, ActiveRecordConfig, ModelAttribute, ActiveRecordRelationModel } from './../index';
import * as PouchDBMemory from 'pouchdb-adapter-memory';

export class Foo_Bar extends ActiveRecordRelationModel {

  protected static _config: ActiveRecordConfig = {
    adapter: 'memory',
    plugins: [PouchDBMemory]
  };

}
