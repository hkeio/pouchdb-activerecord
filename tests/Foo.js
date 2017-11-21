"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./../index");
var PouchDBMemory = require("pouchdb-adapter-memory");
var Foo = /** @class */ (function (_super) {
    __extends(Foo, _super);
    function Foo(values) {
        return _super.call(this, values) || this;
    }
    Foo._attributes = {
        foo: {
            type: 'string',
        },
        goo: {
            type: 'number',
        }
    };
    Foo._config = {
        adapter: 'memory',
        plugins: [PouchDBMemory]
    };
    return Foo;
}(index_1.ActiveRecord));
exports.Foo = Foo;
//# sourceMappingURL=Foo.js.map