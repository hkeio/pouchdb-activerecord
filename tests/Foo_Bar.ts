import {
  ActiveRecord,
  ActiveRecordConfig,
  ModelAttribute
} from './../index';

export class Foo_Bar extends ActiveRecord {

  protected static _attributes: ModelAttribute[] = [
    new ModelAttribute('foo_id'),
    new ModelAttribute('bar_id')
  ];
}
