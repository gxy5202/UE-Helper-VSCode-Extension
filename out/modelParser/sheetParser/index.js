"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseSheet2Json = require('./parseSheet2Json').default;
/**
 * 将指定的 sheet 转为 json
 * @param sheetName
 */
function parseSheet2JsonBySheetName(excel, sheetName) {
    const targetSheet = excel.Sheets[sheetName];
    return parseSheet2Json(targetSheet);
}
/**
 * 维度度量 转 json
 * @returns
 */
function parseDimensionMeasureSheet(excel) {
    const SHEET_NAME = '组件支持的维度-度量';
    return parseSheet2JsonBySheetName(excel, SHEET_NAME);
}
/**
 * 条件渲染 转 json
 * @returns
 */
function parseWarningRenderSheet(excel) {
    const SHEET_NAME = '条件渲染-整理后';
    const targetSheet = excel.Sheets[SHEET_NAME];
    const targetSheetMerges = targetSheet['!merges'];
    const json = parseSheet2Json(targetSheet);
    targetSheetMerges && targetSheetMerges.forEach((item) => {
        const { s, e } = item;
        // 列索引
        const columnIndex = s.c;
        // 起始行索引
        const startRowIndex = s.r - 1;
        // 结束行索引
        const endRowIndex = e.r - 1;
        const startRow = json[startRowIndex];
        const targetColumnKey = Object.keys(startRow)[columnIndex];
        const targetColumnValue = startRow[targetColumnKey];
        for (let i = startRowIndex + 1; i <= endRowIndex; i++) {
            const item = json[i];
            const keys = Object.keys(item);
            keys.splice(columnIndex, 0, targetColumnKey);
            const newItem = {};
            keys.forEach((key, index) => {
                if (index === columnIndex) {
                    newItem[key] = targetColumnValue;
                    return;
                }
                newItem[key] = item[key];
            });
            json[i] = newItem;
        }
    });
    console.log('json', json);
    return json;
}
/**
 * 公共属性转 json
 * @param excel
 * @returns
 */
function parseCommonPropsSheet(excel) {
    const SHEET_NAME = '公共属性整理';
    return parseSheet2JsonBySheetName(excel, SHEET_NAME);
}
exports.default = {
    parseDimensionMeasureSheet,
    parseWarningRenderSheet,
    parseCommonPropsSheet
};
//# sourceMappingURL=index.js.map