import {
  ActiveRecord,
  ActiveRecordConfig,
  ModelAttribute,
  ActiveRecordRelation,
  ActiveRecordRelationType
} from './../index';

import * as _ from 'lodash';
import * as PouchDBMemory from 'pouchdb-adapter-memory';

import { Bar } from './Bar';
import { Foo_Bar } from './Foo_Bar';
import { FooChild } from './FooChild';

// console.log(HasOne);

export class Foo extends ActiveRecord {

  foo: string;
  goo: number;

  protected static _attributes: ModelAttribute[] = [
    new ModelAttribute('foo'),
    new ModelAttribute('goo'),
  ];

  protected static _relations: any[] = [
    ActiveRecordRelation.hasMany('bars', Bar, Foo_Bar),
    ActiveRecordRelation.hasOne('fooChild', FooChild, 'foo_id')
  ];

  protected static _config: ActiveRecordConfig = {
    adapter: 'memory',
    plugins: [PouchDBMemory]
  };
}
