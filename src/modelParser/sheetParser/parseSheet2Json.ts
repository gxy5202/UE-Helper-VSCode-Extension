
const xlsx = require('xlsx');

export default function parseSheet2Json(targetSheet: any) {
    if (!targetSheet) {
        console.info(`页签不存在`);
        return null;
    }

    return xlsx.utils.sheet_to_json(targetSheet);
}