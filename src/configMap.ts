/*
 * @description: 中英文对照
 * @Author: Gouxinyu
 * @Date: 2021-05-07 11:31:48
 */
const series: any[] = [];

export const UIType = {
    '可编辑选项卡': 'editableTabs',
    '可编辑表格': 'editableTable',
    '选项卡': 'tabs',
    '折叠面板': 'group',
    '文本框': 'input',
    '范围输入': 'rangeInput',
    '数字输入框': 'inputNumber',
    '下拉框': 'select',
    '下拉输入框': 'select',
    '单值滑条': 'slider',
    '双值滑条': 'rangeSlider',
    '复选框': 'checkbox',
    '复选组': 'checkGroup',
    '可拖拽复选组': 'draggableCheckbox',
    '组件样式选择': 'radioImage',
    '图标组': 'radioButton',
    '图标组（支持自定义）': 'imgSelect',
    '单选按钮组': 'radioButton',
    '单选': 'radio',
    '颜色块': 'colorPicker',
    '色块组': 'colorGroup',
    '颜色输入框': 'colorInput',
    '上传图片': 'imgUpload',
    '日历选择': 'datePicker',
    '开关': 'switch',
    '加粗按钮': 'bold',
    '倾斜按钮': 'italic',
    '弹窗按钮': 'modal',
    '按钮': 'button',
    '业务组件': 'business',
    '边距设置': 'grid',
    '自定义渲染': 'custom',
    '容器': 'container'
}

export const HEADER = {
    FIRST_LEVEL: '分类',
    SECOND_LEVEL: '一级分类',
    THIRD_LEVEL: '二级分类',
    FOURTH_LEVEL: '配置项名称',
    RANGE: '范围',
    UI_TYPE: '控件类型',
    VALUE: '默认值',
    ADDONAFTER: '后缀',
    ADDONBEFORE: '前缀',
    SP_OPTION: '特殊配置'
}

export const HEADER_CHINESE = {
    '分类': '分类',
    '一级分类': '一级分类',
    '二级分类': '二级分类',
    '配置项名称': '配置项名称',
    '特殊配置': '特殊配置',
    '范围': '范围',
    '控件类型': '控件类型',
    '默认值': '默认值'
}

export const UI_OPTIONS: any = {
    group: {
        type: 'group',
        label: '',
        children: []
    },
    tabs: {
        type: 'tabs',
        children: []
    },
    row: {
        rowId: '',
        type: 'row',
        label: '',
        showLabel: true,
        children: []
    },
    checkbox: {
        type: 'checkbox',
        id: ''
    },
    colorInput: {
        type: 'colorInput',
        id: '',
        rules: [
            {
                type: 'color'
            }
        ]
    },
    slider: {
        type: 'slider',
        id: '',
        showLabel: true,
        min: 0,
        max: 1,
        step: 0.01
    },
    select: {
        type: 'select',
        id: '',
        options: []
    },
    inputNumber: {
        id: '',
        type: 'inputNumber',
        min: 0,
        max: 9999
    },
    bold: {
        id: '',
        type: 'bold',
        checked: 'bold',
        unchecked: 'normal'
    },
    italic: {
        id: '',
        type: 'italic',
        checked: 'italic',
        unchecked: 'normal'
    },
    colorPicker: {
        id: '',
        type: 'colorPicker',
        rules: [{
            type: 'color'
        }],
    },
    radioButton: {
        id: '',
        type: 'radioButton',
        options: [],
    },
    editableTable: {

    },
    editableTabs: {
        type: 'editableTabs',
        id: '',
        children: []
    },
    colorGroup: {
        type: 'colorGroup',
        id: ''
    },
    switch: {
        type: 'switch',
        id: '',
        label: ''
    },
    input: {
        type: 'input',
        id: '',
        label: '',
        showLabel: true,
        tooltip: '',
        rules: [{
            type: 'string',
            max: 256
        }]
    },
    rangeInput: {
        id: '',
        children: []
    }
}