"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xlsx = require('xlsx');
function parseSheet2Json(targetSheet) {
    if (!targetSheet) {
        console.info(`页签不存在`);
        return null;
    }
    return xlsx.utils.sheet_to_json(targetSheet);
}
exports.default = parseSheet2Json;
//# sourceMappingURL=parseSheet2Json.js.map