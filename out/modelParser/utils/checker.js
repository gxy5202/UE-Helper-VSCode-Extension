"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 判断文件是否是 excel 文件
 * @param {*} fileName
 * @returns
 */
function isExcel(fileName) {
    const fileType = fileName.split('.').pop();
    const excelTypes = ['xlsx', 'xls', 'csv'];
    return excelTypes.includes(fileType);
}
exports.default = {
    isExcel
};
//# sourceMappingURL=checker.js.map