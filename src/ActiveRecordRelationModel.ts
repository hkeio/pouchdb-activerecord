import { ModelAttribute } from './Model';
import { ActiveRecord } from './ActiveRecord';

export class ActiveRecordRelationModel extends ActiveRecord {

  child_id: string;
  parent_id: string;

  protected static _attributes: ModelAttribute[] = [
    {
      name: 'child_id',
      type: 'string',
    },
    {
      name: 'parent_id',
      type: 'string',
    }
  ];

}
