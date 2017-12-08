import { ModelAttribute } from './../index';
import { PouchDbActiveRecord } from '../../modules/pouchdb/PouchDbActiveRecord';

export class Bar extends PouchDbActiveRecord {

  boo: string;

  protected static _attributes: ModelAttribute[] = [
    new ModelAttribute('goo')
  ];

}
