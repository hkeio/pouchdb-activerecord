import { ActiveRecord, ActiveRecordConfig, ActiveRecordRelation, ModelAttribute, ActiveRecordRelationType } from './../index';
import * as _ from 'lodash';

import * as PouchDBMemory from 'pouchdb-adapter-memory';
import { Bar } from './Bar';
import { Foo_Bar } from './Foo_Bar';
import { FooChild } from './FooChild';

export class Foo extends ActiveRecord {

  foo: string;
  goo: number;

  protected static _attributes: ModelAttribute[] = [
    {
      name: 'foo',
      type: 'string',
    },
    {
      name: 'goo',
      type: 'number',
    }
  ];

  protected static _relations: ActiveRecordRelation[] = [
    {
      child: Bar,
      type: ActiveRecordRelationType.ManyToMany,
      name: 'bars',
      relationModel: Foo_Bar
    },
    {
      child: FooChild,
      type: ActiveRecordRelationType.HasOne,
      name: 'fooChild',
      property: 'foo_id'
    }
  ];

  protected static _config: ActiveRecordConfig = {
    adapter: 'memory',
    plugins: [PouchDBMemory]
  };
}
