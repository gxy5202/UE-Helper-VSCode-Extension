
/**
 * 解析原始 维度度量 json，生成 setting
 * @param {*} json 
 * @returns 
 */
const utils = require('../utils/index').default;

const COMPONENT = '组件';
const DIMENSION = '维度字段名称：支持拖入的字段个数';
const MEASURE = '度量字段名称：支持拖入的字段个数';

const SUGGESTDRAGMSG: any = {
    DIMENSION: '建议拖拽维度至此处',
    MEASURE: '建议拖拽度量至此处'
}

function getAcceptType(type: string, msg = '') {
    if (msg === '(维度或度量字段都可以)') {
        return 'DIMENSION,MEASURE';
    }
    return type
}

/**
 * 解析描述的值字符串
 * @param {*} valueStr 
 */
function parseDescribeValueString(valueStr: string): any {
    const valueArray: any = valueStr.split('个');
    if (valueArray.length < 2) {
        return {};
    }
    let [ range, msg ] = valueArray;

    range = range.split('~')
    msg = msg.replace(/[（|）]/g, ($: any) => $ === '（' ? '(' : ')' );

    const res: any = {
        min: Number(range[0]),
        msg
    }

    // min & max 都为 1 的情况
    if (range.length === 1 && range[0] == 1) {
        res.max = 1;
    }

    // range 为 范围值 的情况
    if (range.length > 1 && range[1] !== 'N') {
        res.max = Number(range[1]);
    }

    return res;
    
}

/**
 * 解析描述，生成字段配置
 * @param {*} targetStr 
 * @returns 
 */
function parseDescribeString(targetStr = '', type: string) {
    if (targetStr === '' || targetStr === '\\') {
        return [];
    }
    const describeArray = utils.splitDescribeStringToDescribeArray(targetStr);
    if (describeArray.length < 2) {
        return [];
    }
    const subBindFields: any[] = [];
    /**
     * keyStr: "节点/父节点/名称"
     * valueStr: "1~N个（维度或度量字段都可以）"
     */
    const [ keyStr, valueStr ] = describeArray;
    const keys = keyStr.split('/');
    const values = parseDescribeValueString(valueStr);

    if (!Object.keys(values).length) {
        return [];
    }

    keys.forEach((key: any) => {
        const { min, max, msg } = values;

        const field: any = {
            bindFieldName: key,
            label: key,
            suggestDragMsg: SUGGESTDRAGMSG[type],
            acceptType: getAcceptType(type, msg),
            dragFlg: true
        }
        min && key !== '图例' && (field.min = min);
        max && (field.max = max);

        subBindFields.push(field);
    })
    return subBindFields;
}

export default function parseDimensionMeasureJson(json: any) {
    return json.map((componentConfig: any) => {
        const componentName = componentConfig[COMPONENT];
        const dimension = componentConfig[DIMENSION];
        const measure = componentConfig[MEASURE];

        const dimensionFields = parseDescribeString(dimension, 'DIMENSION');
        const measureFields = parseDescribeString(measure, 'MEASURE');

        return {
            componentName,
            bindFields: [
                ...dimensionFields,
                ...measureFields
            ]
        }
    })
}
