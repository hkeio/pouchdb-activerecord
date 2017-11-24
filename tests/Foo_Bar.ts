import { ActiveRecord, ActiveRecordConfig, ModelAttribute } from './../index';
import * as PouchDBMemory from 'pouchdb-adapter-memory';
import { ActiveRecordRelationModel } from '../src/ActiveRecordRelationModel';

export class Foo_Bar extends ActiveRecordRelationModel {

  protected static _config: ActiveRecordConfig = {
    adapter: 'memory',
    plugins: [PouchDBMemory]
  };

}
