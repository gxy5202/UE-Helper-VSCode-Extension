"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const xlsx = require('xlsx');
/**
 * 获取配置信息
 * @returns
 */
function getConfig() {
    return JSON.parse(fs.readFileSync('./config.json'));
}
/**
 * 获取目标目录下所有文件
 * @param {*} sourceDir
 * @returns
 */
function getFileList(sourceDir) {
    if (!sourceDir) {
        console.log('未获取到源目录');
        return;
    }
    const fileList = fs.readdirSync(sourceDir);
    if (!(fileList === null || fileList === void 0 ? void 0 : fileList.length)) {
        console.log('目标目录下没有文件');
        return;
    }
    return fileList;
}
/**
 * 根据文件列表获取文件内容
 * @param {*} fileList
 * @param {*} sourceDir
 * @returns
 */
function readContentFromFileList(fileList, sourceDir = '') {
    const files = [];
    fileList.forEach((fileName) => files.push({
        fileName,
        content: xlsx.readFile(`${sourceDir}/${fileName}`)
    }));
    return files;
}
exports.default = {
    getConfig,
    getFileList,
    readContentFromFileList
};
//# sourceMappingURL=geter.js.map