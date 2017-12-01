import {
  ActiveRecord,
  ModelAttribute,
  ActiveRecordRelation,
  ActiveQuery
} from './../index';

import { Bar } from './Bar';
import { Boo } from './Boo';
import { Foo_Bar } from './Foo_Bar';
import { FooChild } from './FooChild';

export interface FooInterface {
  id: string;

  foo?: string;
  goo?: number;

  bars?: Bar[];
  getBars?: () => Promise<ActiveQuery>;
  addBar?: (object: any | Bar) => Promise<void>;
  addBars?: (pbjects: any[] | Bar[]) => Promise<void>;

  fooChildrens?: FooChild[];
  getFooChildrens?: () => Promise<ActiveQuery>;
  addFooChildren?: (object: any | FooChild) => Promise<void>;
  addFooChildrens?: (objects: any[] | FooChild[]) => Promise<void>;

  boo?: Boo;
  boo_id?: string;
  setBoo?: (object: any | Boo) => Promise<void>;
}

export class Foo extends ActiveRecord implements FooInterface {

  protected static _attributes: ModelAttribute[] = [
    new ModelAttribute('foo'),
    new ModelAttribute('goo'),
  ];

  protected static _relations: ActiveRecordRelation[] = [
    ActiveRecordRelation.manyToMany('bars', Bar, Foo_Bar, 'foo_id', 'bar_id'),
    ActiveRecordRelation.hasMany('fooChildren', FooChild, 'foo_id'),
    ActiveRecordRelation.hasOne('boo', Boo, 'boo_id')
  ];
}
