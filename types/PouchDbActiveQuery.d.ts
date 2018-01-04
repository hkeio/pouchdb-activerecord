import { ActiveQuery } from "@hke/activerecord";
import { PouchDbInstance } from "./PouchDbActiveRecord";
export declare class PouchDBActiveQuery extends ActiveQuery {
    db: PouchDbInstance;
    one(map?: boolean): Promise<any>;
    all(map?: boolean): Promise<any>;
}
