"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUIOptionsRange = exports.setSelectUI = exports.convertPublicConfig = exports.sheetToJson = exports.parseSheet2Json = exports.readFile = void 0;
const configMap_1 = require("../configMap");
const fs = require('fs');
const path = require('path'); //系统路径模块
const xlsx = require('xlsx');
const { FIRST_LEVEL, SECOND_LEVEL, THIRD_LEVEL, SP_OPTION, FOURTH_LEVEL, RANGE, UI_TYPE, VALUE, ADDONAFTER, ADDONBEFORE } = configMap_1.HEADER;
/**
 * @description: 读取文件夹下的文件
 * @param {string} addPath: 文件夹名称
 */
function readFile(addPath) {
    const filesPath = path.join(__dirname, addPath);
    let list = [];
    // 读取文件夹下的文件
    const FILE_LIST = fs.readdirSync(filesPath);
    for (let i = 0; i < FILE_LIST.length; i++) {
        let pathName = `${__dirname}\\${addPath}\\${FILE_LIST[i]}`;
        list.push(pathName);
    }
    return list;
}
exports.readFile = readFile;
function parseSheet2Json(targetSheet) {
    if (!targetSheet) {
        console.info(`页签不存在`);
        return null;
    }
    return xlsx.utils.sheet_to_json(targetSheet);
}
exports.parseSheet2Json = parseSheet2Json;
/**
 * 补齐合并单元格
 * @param targetSheet
 * @param json
 * @param header
 * @returns
 */
function sheetToJson(targetSheet, json, header) {
    const targetSheetMerges = targetSheet['!merges'];
    targetSheetMerges && targetSheetMerges.forEach((item) => {
        const { s, e } = item;
        // 列索引
        const columnIndex = s.c;
        // 起始行索引
        const startRowIndex = s.r - header;
        // 结束行索引
        const endRowIndex = e.r - header;
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
    return json;
}
exports.sheetToJson = sheetToJson;
/**
     * 转换公共配置项为map映射
     * @param json
     * @returns
     */
function convertPublicConfig(json) {
    const publicObj = {};
    // 公共配置转换
    json.forEach((item) => {
        publicObj[item[FOURTH_LEVEL]] = {
            '特殊配置': item[SP_OPTION],
            '范围': item[RANGE],
            '控件类型': item[UI_TYPE],
            '默认值': item[VALUE],
        };
    });
    return publicObj;
}
exports.convertPublicConfig = convertPublicConfig;
function setSelectUI(range, options) {
    range && range.forEach((value) => {
        options.push({
            label: value,
            value
        });
    });
}
exports.setSelectUI = setSelectUI;
/**
 * 针对控件类型进行属性处理
 * @param type
 */
function setUIOptionsRange(type, option, label) {
    if (configMap_1.UI_OPTIONS[type]) {
        const target = JSON.parse(JSON.stringify(configMap_1.UI_OPTIONS[type]));
        try {
            switch (type) {
                // 下拉框
                case 'select':
                // 单选按钮组
                case 'radioButton':
                    setSelectUI(option[RANGE], target.options);
                    break;
                case 'input':
                    target.rules[0].max = +option[RANGE][0];
                    break;
                // 数字输入框
                case 'inputNumber':
                    target['min'] = +option[RANGE][0];
                    target['max'] = +option[RANGE][1];
                    if (option[ADDONAFTER]) {
                        target['addonAfter'] = option[ADDONAFTER];
                    }
                    if (option[ADDONBEFORE]) {
                        target['addonBefore'] = option[ADDONBEFORE];
                    }
                    break;
                // 滑条
                case 'slider':
                    target['min'] = +option[RANGE][0];
                    target['max'] = +option[RANGE][1];
                    target['step'] = +option[RANGE][2];
                    break;
                default:
                    break;
            }
            return target;
        }
        catch (e) {
            console.log(e);
            return target;
        }
    }
    else {
        return {};
    }
}
exports.setUIOptionsRange = setUIOptionsRange;
//# sourceMappingURL=index.js.map