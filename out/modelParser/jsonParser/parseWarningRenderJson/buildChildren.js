"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configMap_1 = require("../../../configMap");
const LEVEL1_STYLE = '一级样式';
const LEVEL2_STYLE = '二级样式（默认不展示，加粗的需展示名称）';
const LEVEL3_STYLE = '三级样式';
const LEVEL4_STYLE = '四级样式';
const ID = 'id';
const COMPONENT_TYPE = '控件类型';
const PROPS_NAME = '属性名称';
const VALUE_RANGE = '取值范围';
const ROW_FLAG = '一行展示标识';
const SHOW_LABEL = '属性标签是否显示';
const DEFAULT_VALUE = '默认值';
/**
 * 输入框类控件 输入范围解析
 * @param str '1-9999 px'
 */
function inputTypeParser(str, isRule = false) {
    const pureRange = str.split(" ")[0];
    const rangeArray = pureRange.split('-');
    if (isRule) {
        return {
            rules: [{
                    type: 'string',
                    min: rangeArray[0],
                    max: rangeArray[1]
                }]
        };
    }
    return {
        min: rangeArray[0],
        max: rangeArray[1]
    };
}
/**
 * 选择类控件 输入范围解析
 * @param str '1-9999 px'
 */
function selectTypeParser(str) {
    const items = str.split("、");
    const options = items.map(item => ({
        label: item,
        value: item
    }));
    return {
        options
    };
}
/**
 * 根据控件类型 解析 取值范围
 * @param type
 * @param valueRangeStr
 */
function parseValueRangeByComponentType(type, valueRangeStr) {
    let result = {};
    switch (type) {
        case 'inputNumber':
            result = inputTypeParser(valueRangeStr);
            break;
        case 'input':
            result = inputTypeParser(valueRangeStr, true);
            break;
        case 'checkbox':
        case 'select':
        case 'radioButton':
            result = selectTypeParser(valueRangeStr);
            break;
        default:
            result = {};
    }
    return result;
}
function getBuildChildrenFn(commonPropsJson) {
    /**
     * 构建树形结构
     * @param {*} target
     * @param {*} data
     * @param {*} props
     * @param {*} level
     * @returns PROPS_NAME
     */
    return function buildChildren(target, data, props = [
        LEVEL1_STYLE,
        LEVEL2_STYLE,
        LEVEL3_STYLE,
        LEVEL4_STYLE,
    ], level = 0) {
        const children = [];
        // 获取下一级属性
        const nextProp = props[level + 1];
        // 是否存在下一级属性
        const hasNextProp = !!nextProp;
        const children_item = {
            type: 'container',
            label: data[props[level]],
            showLabel: hasNextProp
        };
        children.push(children_item);
        target.children = children;
        if (!data[nextProp]) {
            const propsName = children_item.label;
            const targetPropsConfig = commonPropsJson.find((item) => item[PROPS_NAME] === propsName);
            if (targetPropsConfig) {
                const componentType = targetPropsConfig[COMPONENT_TYPE]; // '数字输入框'
                const afterMapComponentTypeKey = configMap_1.names[COMPONENT_TYPE]; // 'type'
                const afterMapComponentTypeValue = configMap_1.UIType[componentType]; // 'inputNumber'
                children_item[ID] = data[ID] || null;
                const afterMapShowLabel = configMap_1.names[SHOW_LABEL];
                children_item[afterMapShowLabel] = targetPropsConfig[SHOW_LABEL] || false;
                children_item[afterMapComponentTypeKey] = afterMapComponentTypeValue || null;
                const valueRange = targetPropsConfig[VALUE_RANGE];
                valueRange &&
                    Object.assign(children_item, parseValueRangeByComponentType(afterMapComponentTypeValue, valueRange));
                children_item[ROW_FLAG] = data[ROW_FLAG] || null;
                // children_item[DEFAULT_VALUE] = targetPropsConfig[DEFAULT_VALUE] || null; 
            }
            else {
                children_item['error'] = `${propsName} 没有在公共属性JSON中获取到`;
            }
            return;
        }
        buildChildren(children_item, data, props, ++level);
    };
}
exports.default = getBuildChildrenFn;
//# sourceMappingURL=buildChildren.js.map