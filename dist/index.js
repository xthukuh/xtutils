"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._utilsHello = void 0;
/**
 * Say Hello!
 *
 * @param name
 */
var _utilsHello = function (name) {
    var _timestamp = function () {
        var _pad = function (v) { return "".concat(v).padStart(2, '0'); };
        var d = new Date();
        return "".concat(d.getFullYear(), "-").concat(_pad(d.getMonth() + 1), "-").concat(_pad(d.getDate()), " ").concat(_pad(d.getHours()), ":").concat(_pad(d.getMinutes()), ":").concat(_pad(d.getSeconds()));
    };
    name = (name === null || name === void 0 ? void 0 : name.length) ? name : 'Thuku';
    console.log("[x] ".concat(_timestamp(), " - Hello ").concat(name, "!"));
};
exports._utilsHello = _utilsHello;
