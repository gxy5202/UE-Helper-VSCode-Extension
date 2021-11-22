

/**
 * 判断文件是否是 excel 文件
 * @param {*} fileName 
 * @returns 
 */
function isExcel(fileName: any) {
    const fileType = fileName.split('.').pop();
    const excelTypes = ['xlsx', 'xls', 'csv'];
    return excelTypes.includes(fileType)
}

export default {
    isExcel
}