import {
  ActiveRecord,
  ModelAttribute
} from './../index';

export class Bar extends ActiveRecord {

  boo: string;

  protected static _attributes: ModelAttribute[] = [
    new ModelAttribute('goo')
  ];

}
