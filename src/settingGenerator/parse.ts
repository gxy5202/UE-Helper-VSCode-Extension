import { UIType, HEADER, HEADER_CHINESE } from "../configMap";
import { sheetToJson, convertPublicConfig } from "../utils";
const fs = require("fs");
const xlsx = require("xlsx");

const {
    FIRST_LEVEL,
    SECOND_LEVEL,
    THIRD_LEVEL,
    SP_OPTION,
    FOURTH_LEVEL,
    RANGE,
    UI_TYPE,
    VALUE,
} = HEADER;

const parse = {
    /**
     * 匹配文件名称
     * @param fileList
     * @param name 
     * @param isPublic 
     * @returns 
     */
    findName: (fileList: any[], name: string, isPublic?: boolean) => {
        if (isPublic) {
            return fileList.find((item: string) => item.includes(name));
        }
        return fileList.find((item: string) => !item.includes(name));
    },
    /**
     * excel转换成json
     * @param path
     * @param isPublic
     * @returns
     */
    convertToJson: (path: string, isPublic?: boolean) => {
        const fileList = fs.readdirSync(`${path}/excel/UI`);

        // 名称必须统一为‘公共配置’和‘组件名称’
        const fileObject: any = {
            fileName: parse.findName(fileList, "公共配置", isPublic),
            sheetName: parse.findName(fileList, "公共配置", isPublic).split(".")[0],
        };

        const workbook = xlsx.readFile(`${path}/excel/UI/${fileObject.fileName}`);
        const sheet = workbook.Sheets[fileObject.sheetName];
        const num = sheet["!ref"].split(":")[1].replace(/[A-z]/g, "");

        const sheetJson = xlsx.utils.sheet_to_json(sheet, {
            range: `A2:H${num}`,
            header: 2,
            raw: false,
            rawNumbers: false,
        });

        const result = sheetToJson(sheet, sheetJson, 2);
        return result;
    },
    /**
     * 从公共配置中匹配配置项
     * @param item 
     * @param publicObj 
     * @returns 
     */
    generatePublicOptionItem: (item: any, publicObj: any) => {
        let newItem: any = {};
        if (item[FOURTH_LEVEL] in publicObj) {
            const publicItem = publicObj[item[FOURTH_LEVEL]];
            newItem[RANGE] = publicItem[RANGE];
            newItem[VALUE] = publicItem[VALUE];
            newItem[UI_TYPE] = publicItem[UI_TYPE];
        }

        // 前缀，后缀
        let addonAfter = null;
        let addonBefore = null;

        const range = newItem[RANGE] && newItem[RANGE].split(',').map((v: string) => {
            const value = v.split(' ');
            if (value.length > 1) {
                addonAfter = value[1];
                return value[0];
            }
            return v;
        });

        const spcialOpt = item[SP_OPTION]?.split(',');
        let label = null;
        let row = null;

        if (spcialOpt?.length > 1) {
            row = spcialOpt[0];
            label = spcialOpt[1];
        } else if (spcialOpt?.length === 1){
            spcialOpt[0] === 'label' ? label = spcialOpt[0] : row = spcialOpt[0];
        }
        
        return {
            'label': label,
            'row': row,
            '前缀': addonBefore,
            '后缀': addonAfter,
            '范围': range,
            '控件类型': (UIType as any)[newItem[UI_TYPE]],
            '默认值': newItem[VALUE],
            'level': FOURTH_LEVEL
        };
    },
    /**
     * 生成树结构
     * @param item
     * @param target
     * @param publicObj
     * @param preKey
     * @param nextKey
     */
    generateTree: (
        item: any,
        target: any,
        publicObj: any,
        preKey: string,
        nextKey: string
    ) => {
        const keys = Object.keys(HEADER_CHINESE);
        const index = keys.findIndex((key) => key === nextKey);

        const currentKey = item[nextKey];
       
        if (!target[currentKey]) {
            target[currentKey] = {
                level: nextKey,
            };

            // 如果二级分类和配置项名称相同，只生成配置项名称这一层
            if (item[keys[index + 1]] === item[nextKey] && keys[index + 1] === FOURTH_LEVEL) {
                target[currentKey] = parse.generatePublicOptionItem(item, publicObj);
                return;
            }
        }

        // 边界：如果为最后一层配置项名称，则不再递归
        if (nextKey === FOURTH_LEVEL) {
            target[currentKey] = parse.generatePublicOptionItem(item, publicObj);
        } else {
            // 递归继续生成下一层
            preKey = nextKey;
            nextKey = keys[index + 1];
            parse.generateTree(
                item,
                target[currentKey],
                publicObj,
                preKey,
                nextKey
            );
        }
    },
    /**
     * 转换成树结构
     * @param json 
     * @param publicObj 
     * @param treeObj 
     * @returns 
     */
    convertToTree: (json: any[], publicObj: any, treeObj: any) => {
        let nextKey = FIRST_LEVEL;
        let preKey = FIRST_LEVEL;

        console.log(json);
        json.forEach((item) => {
            parse.generateTree(item, treeObj, publicObj, preKey, nextKey);
        });

        console.log(treeObj);
    },
};

export default parse;
