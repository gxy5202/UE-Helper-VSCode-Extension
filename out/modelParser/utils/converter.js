"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 拆分字符串为 [key, value] 数组
 * @param {*} targetStr
 */
function splitDescribeStringToDescribeArray(targetStr) {
    if (!targetStr) {
        return [];
    }
    // 统一描述中的拆分符
    targetStr = targetStr.replace(/：/g, ':');
    return targetStr.split(':');
}
exports.default = {
    splitDescribeStringToDescribeArray
};
//# sourceMappingURL=converter.js.map