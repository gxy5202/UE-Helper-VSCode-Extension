/*
 * @description: 
 * @Author: Gouxinyu
 * @Date: 2021-05-08 22:55:03
 */
import { HEADER, UI_OPTIONS } from '../configMap';
import parse from './parse';
import { convertPublicConfig, setUIOptionsRange } from '../utils';
const fs = require('fs');

const {
    FIRST_LEVEL,
    SECOND_LEVEL,
    THIRD_LEVEL,
    FOURTH_LEVEL,
    RANGE,
    UI_TYPE,
    VALUE
} = HEADER;

const settingGenerator = {
    settingArr: [],
    setChildren: (obj: any, arr: any[]) => {
        Object.keys(obj).forEach((key) => {
            if (key === "level") return;
            let child: any = {};
            const rowKeys: any = [];
            const item = obj[key];

            switch (item["level"]) {
                // 分类，使用tabs
                case FIRST_LEVEL:
                    if (arr.length === 0) {
                        arr.push(JSON.parse(JSON.stringify(UI_OPTIONS['tabs'])));
                    }

                    child = {
                        label: key,
                        children: []
                    };

                    // 系列样式特殊处理
                    if (key === '系列') {
                        child.children.push(UI_OPTIONS['editableTabs']);
                    }
                    arr[0].children.push(child);
                    break;
                // 一级分类使用group
                case SECOND_LEVEL:
                    child = JSON.parse(JSON.stringify(UI_OPTIONS['group']));
                    child['label'] = key;
                    arr.push(child);
                    break;
                // 二级分类使用row
                case THIRD_LEVEL:
                    child = JSON.parse(JSON.stringify(UI_OPTIONS['row']));
                    child['label'] = key;
                    child['showLabel'] = true;

                    // 判断是否同一行
                    Object.keys(item).forEach((v: any) => {
                        if (item[v].row && !rowKeys.includes(item[v].row)) {
                            rowKeys.push(item[v].row);
                        }
                    });

                    // 若存在多个控件处于同一行，则使用row包裹
                    if (rowKeys.length > 0) {
                        rowKeys.forEach((item: any) => {
                            const row = JSON.parse(JSON.stringify(UI_OPTIONS['row']));
                            row.rowId = item;
                            row.showLabel = false;
                            delete row.label;
                            child.children.push(row);
                        })
                    }

                    arr.push(child);
                    break;
                // 配置项使用各自控件
                case FOURTH_LEVEL:
                    child = setUIOptionsRange(item[UI_TYPE], item, key);
                    child['label'] = key;
                    if (arr.length > 0 && arr[0].rowId) {
                        arr.forEach((v, i) => {
                            if (v.rowId === item.row) {
                                v.children.push(child);
                            }
                        });
                    } else {
                        arr.push(child);
                    }

                    break;
                default:
                    break;
            }

            if (typeof item === "object" && item["level"] !== FOURTH_LEVEL) {
                if (key === '系列') {
                    settingGenerator.setChildren(item, child.children[0].children);
                    return;
                }
                settingGenerator.setChildren(item, child.children);
            }
        });
    },
    changeSpecialOptionContent: (item: any) => {
        switch (item.type) {
            case 'editableTabs': {
                const child = item.children
                // item.children = `series.map((item, n) => {
                //     type: 'container',
                //     label: i18n.get('com.series') + n,
                //     children: ${JSON.stringify(child)}
                // })`;
                item.children = `<series${JSON.stringify(child)}series>`;
                break;
            }
            default:
                break;
        }
    },
    handleSpecialOption: (json: any[]) => {
        json.forEach((item: any) => {
            if (item.type) {
                settingGenerator.changeSpecialOptionContent(item);
            }

            if (typeof item.children === 'object' && item.children.length > 0) {
                settingGenerator.handleSpecialOption(item.children);
            }
        })
    },
    generateSettings: (path: string) => {
        const sheetJson = parse.convertToJson(path);
        const publicConfig = parse.convertToJson(path, true);

        const treeObj: any = {};
        parse.convertToTree(sheetJson, convertPublicConfig(publicConfig), treeObj);
        settingGenerator.settingArr = [];
        settingGenerator.setChildren(treeObj, settingGenerator.settingArr);

        console.log(settingGenerator.settingArr);
        // 替换特殊控件配置
        settingGenerator.handleSpecialOption(settingGenerator.settingArr);
        const json = JSON.stringify(settingGenerator.settingArr, null, '\t');
        const stringJson = json.replace(/\"<s.*?s>\"/g, 'h');
        fs.writeFile(`${path}/setting.ts`, stringJson, (err: any) => {
            console.log(err);
        })
    }
};

export default settingGenerator;
