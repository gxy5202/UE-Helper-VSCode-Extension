"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getBuildChildrenFn = require('./buildChildren').default;
const buildSettings = require('./buildSettings').default;
const COMPONENT = '组件';
const LEVEL1_TYPE = '一级分类';
const LEVEL2_TYPE = '二级分类';
const LEVEL1_STYLE = '一级样式';
/**
 * 将同类型组件的 样式节点 进行合并
 * @param {*} targetTree
 * @param {*} newTree
 */
function compareMergeNode(targetNode, newNode) {
    if (!newNode.children) {
        return;
    }
    const { label } = newNode.children[0];
    const targetLeaf = targetNode.children.find((item) => item.label === label);
    if (!targetLeaf) {
        targetNode.children.push(...newNode.children);
        return;
    }
    compareMergeNode(targetLeaf, newNode.children[0]);
}
/**
 * 将 json 由列表 转为 树
 * @param {*} json
 * @returns
 */
function parseWarningRenderJson2Tree(json, commonPropsJson) {
    const newJson = {};
    const buildChildren = getBuildChildrenFn(commonPropsJson);
    json.forEach((item) => {
        try {
            const componentName = item[COMPONENT];
            if (!item[LEVEL1_STYLE]) {
                return;
            }
            const newJsonItem = newJson[componentName];
            const tempObj = {
                [LEVEL1_TYPE]: item[LEVEL1_TYPE],
                [LEVEL2_TYPE]: item[LEVEL2_TYPE]
            };
            buildChildren(tempObj, item);
            if (!newJsonItem) {
                newJson[componentName] = tempObj;
                return;
            }
            compareMergeNode(newJsonItem, tempObj);
        }
        catch (error) {
            console.log(error);
        }
    });
    return newJson;
}
/**
 * 根据 树结构 json 进行 settings 解析
 * @param {*} json
 */
function parseWarningRenderTree2Settings(jsonObject) {
    const settings = [];
    Object.keys(jsonObject).forEach(componentName => {
        const item = jsonObject[componentName];
        const itemSettings = buildSettings(item);
        itemSettings && settings.push({
            componentName,
            warningRenderSettings: itemSettings
        });
    });
    return settings;
}
exports.default = {
    parseWarningRenderJson2Tree,
    parseWarningRenderTree2Settings
};
//# sourceMappingURL=index.js.map