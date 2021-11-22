"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const settingGenerator_1 = require("./settingGenerator");
const fs = require('fs');
const path = require('path'); //系统路径模块
const utils = require('./modelParser/utils/index').default;
const modelParser = require('./modelParser/index').default;
function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.excelToJson', (params) => {
        settingGenerator_1.default.generateSettings(params._fsPath);
    });
    let modelModule = vscode.commands.registerCommand('extension.modelSettingsParser', (url) => {
        const sourceDir = path.join(url._fsPath, 'excel');
        const targetDir = path.join(url._fsPath, 'result');
        // 读取指定目录下所有文件名
        const fileList = utils.getFileList(sourceDir);
        // 过滤筛选 excel 类型文件
        const excelFileList = fileList.filter((fileName) => utils.isExcel(fileName));
        // 读取 excel 文件内容
        const files = utils.readContentFromFileList(excelFileList, sourceDir);
        console.log(files);
        const result = modelParser(files);
        Object.keys(result).forEach(item => {
            fs.writeFile(`${targetDir}/${item}.json`, JSON.stringify(result[item], null, '\t'), (err) => {
                console.log(err);
            });
        });
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(modelModule);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map