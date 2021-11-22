"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 控件配置文件
 */
const sfue_1 = require("sfue");
const { i18n } = sfue_1.helper;
function buildSettings(component) {
    const config = component.getConfig();
    const { series } = config.options;
    return [];
}
exports.default = buildSettings;
//# sourceMappingURL=setting.js.map