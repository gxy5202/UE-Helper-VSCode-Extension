

/**
 * 拆分字符串为 [key, value] 数组
 * @param {*} targetStr 
 */
function splitDescribeStringToDescribeArray(targetStr: any) {
    if (!targetStr) {
        return [];
    }
    // 统一描述中的拆分符
    targetStr = targetStr.replace(/：/g, ':');
    return targetStr.split(':');
}

export default {
    splitDescribeStringToDescribeArray
}