"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sheetParser = require('./sheetParser/index').default;
const parseDimensionMeasureJson = require('./jsonParser/parseDimensionMeasureJson').default;
const { parseWarningRenderJson2Tree, parseWarningRenderTree2Settings } = require('./jsonParser/parseWarningRenderJson').default;
function modelParser(files) {
    let dimensionMeasureSetting = [];
    let warningRenderJson = [];
    let warningRenderSetting = [];
    let commonPropsJson = [];
    try {
        // 解析 维度度量 页签，输出成 json
        const dimensionMeasureJson = sheetParser.parseDimensionMeasureSheet(files[0].content);
        // 解析 维度度量 json，输出为 组件可用的 setting
        dimensionMeasureSetting = parseDimensionMeasureJson(dimensionMeasureJson);
        // 解析 公共配置 文档
        commonPropsJson = sheetParser.parseCommonPropsSheet(files[1].content);
        console.log('公共属性', commonPropsJson);
        // 解析 条件渲染 页签，输出成 json
        warningRenderJson = sheetParser.parseWarningRenderSheet(files[1].content);
        warningRenderJson = parseWarningRenderJson2Tree(warningRenderJson, commonPropsJson);
        warningRenderSetting = parseWarningRenderTree2Settings(warningRenderJson);
        console.log(warningRenderSetting);
    }
    catch (error) {
        console.log(error);
    }
    return {
        '维度度量Settings': dimensionMeasureSetting,
        '条件渲染Json': warningRenderJson,
        '条件渲染Settings': warningRenderSetting,
        '公共属性Json': commonPropsJson
    };
}
exports.default = modelParser;
//# sourceMappingURL=index.js.map