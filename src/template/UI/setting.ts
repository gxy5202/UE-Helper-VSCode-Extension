/**
 * 控件配置文件
 */
import { helper } from 'sfue';

const { i18n } = helper;

export default function buildSettings(component){
    const config = component.getConfig();
    const { series } = config.options;

    return [];
}