const ROW_FLAG = '一行展示标识';

/**
 * 构建 setting
 * @param {*} jsonObject 
 */
export default function buildSettings(jsonObject: any, itemSettings: any[] = []) {
    if (!jsonObject.children) {
        return;
    }

    jsonObject.children.forEach((item: any) => {
        const temp: any = {
            type: item.type,
            label: item.label,
            showLabel: item.showLabel
        }
        
        if (!item.children || item.rowKey) {
            const rowFlag = item[ROW_FLAG];
            Object.assign(temp, item);
            if (rowFlag) {

                const mergeRow = itemSettings.find(item => item.rowKey === rowFlag);
                if (mergeRow) {
                    mergeRow.children.push(temp)
                } else {
                    itemSettings.push({
                        type: 'row',
                        rowKey: rowFlag,
                        children: [temp]
                    });
                }
            } else {
                itemSettings.push(temp);
            }
            return;
        }
        itemSettings.push(temp);

        temp.children = [];
        buildSettings(item, temp.children)
    })

    return itemSettings
}