import {
  ActiveRecord,
  ActiveRecordConfig,
  ModelAttribute,
  ActiveRecordRelation
} from './../index';

import * as PouchDBMemory from 'pouchdb-adapter-memory';

import { Bar } from './Bar';
import { Foo_Bar } from './Foo_Bar';
import { FooChild } from './FooChild';

export class Foo extends ActiveRecord {

  foo: string;
  goo: number;

  bars: Bar[];
  fooChild: FooChild;

  protected static _attributes: ModelAttribute[] = [
    new ModelAttribute('foo'),
    new ModelAttribute('goo'),
  ];

  protected static _relations: ActiveRecordRelation[] = [
    ActiveRecordRelation.manyToMany('bars', Bar, Foo_Bar, 'foo_id', 'bar_id'),
    ActiveRecordRelation.hasOne('fooChild', FooChild, 'foo_id')
  ];

  protected static _config: ActiveRecordConfig = {
    adapter: 'memory',
    plugins: [PouchDBMemory]
  };
}
