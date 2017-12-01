import {
  ActiveRecord,
  ActiveRecordConfig,
  ModelAttribute,
  ActiveRecordRelation,
  ActiveQuery
} from './../index';

import { Bar } from './Bar';
import { Foo_Bar } from './Foo_Bar';
import { FooChild } from './FooChild';

export interface FooInterface {
  id: string;

  foo?: string;
  goo?: number;

  bars?: Bar[];
  fooChild?: FooChild;

  getBars?: () => Promise<ActiveQuery>
  addBars?: (any) => Promise<void>
}

export class Foo extends ActiveRecord implements FooInterface {

  protected static _attributes: ModelAttribute[] = [
    new ModelAttribute('foo'),
    new ModelAttribute('goo'),
  ];

  protected static _relations: ActiveRecordRelation[] = [
    ActiveRecordRelation.manyToMany('bars', Bar, Foo_Bar, 'foo_id', 'bar_id'),
    ActiveRecordRelation.hasMany('fooChildren', FooChild, 'foo_id')
  ];
}
