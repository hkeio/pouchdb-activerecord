import { ActiveRecord, ModelAttribute } from "@hke/activerecord";
import { PouchDBActiveQuery } from "./PouchDbActiveQuery";
export interface PouchDbInstance {
    get: (id: string) => Promise<any>;
    find: (condition: any) => Promise<any>;
}
export declare class PouchDbActiveRecord extends ActiveRecord {
    static _identifier: string;
    static _tableName: string;
    static _queryClass: typeof PouchDBActiveQuery;
    _id: string;
    _rev: string;
    protected static _db: {
        [model: string]: PouchDbInstance;
    };
    static dbConfig: any;
    static _attributes: ModelAttribute[];
    static _dbInit(): Promise<boolean>;
    save(): Promise<this>;
    static save(objects: any[]): Promise<void>;
}