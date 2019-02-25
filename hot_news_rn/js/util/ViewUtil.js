import React from 'react';
import {TouchableOpacity ,StyleSheet, View, Text} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import {px2dp} from './Utils';

export default class ViewUtil {
    /**
     * 获取设置页的Item
     * @param callBack 单击item的回调
     * @param text 显示的文本
     * @param color 图标着色
     * @param Icons react-native-vector-icons组件
     * @param icon 左侧图标
     * @param expandableIco 右侧图标
     * @return {XML}
     */
    static getSettingItem(callBack, text, color, Icons, icon, expandableIco) {
        return (
            <TouchableOpacity
                onPress={callBack}
                style={styles.setting_item_container}
            >
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                    {Icons && icon ?
                        <Icons
                            name={icon}
                            size={px2dp(16)}
                            style={{color: color, marginRight: px2dp(10)}}
                        /> :
                        <View style={{opacity: 1, width: px2dp(16), height: px2dp(16), marginRight: px2dp(10),}}/>
                    }
                    <Text>{text}</Text>
                </View>
                <Ionicons
                    name={expandableIco ? expandableIco : 'ios-arrow-forward'}
                    size={px2dp(16)}
                    style={{
                        marginRight: px2dp(0),
                        alignSelf: 'center',
                        color: color || 'black',
                    }}/>
            </TouchableOpacity>
        )
    }

    /**
     * 获取设置页的Item
     * @param callBack 单击item的回调
     * @param menu @MORE_MENU
     * @param color 图标着色
     * @param expandableIco 右侧图标
     * @return {XML}
     */
    static getMenuItem(callBack, menu, color, expandableIco) {
        return ViewUtil.getSettingItem(callBack, menu.name, color, menu.Icons, menu.icon, expandableIco)
    }



    /**
     * 获取左侧返回按钮
     * @param callBack
     * @returns {XML}
     */
    static getLeftBackButton(callBack) {
        return <TouchableOpacity
            style={{padding: px2dp(8), paddingLeft: px2dp(12)}}
            onPress={callBack}>
            <Ionicons
                name={'ios-arrow-back'}
                size={px2dp(24)}
                style={{color: 'white'}}/>
        </TouchableOpacity>
    }

    /**
     * 获取分享按钮
     * @param callBack
     * @returns {XML}
     */
    static getShareButton(callBack) {
        return <TouchableOpacity
            underlayColor={'transparent'}
            onPress={callBack}
        >
            <Ionicons
                name={'md-share'}
                size={px2dp(20)}
                style={{opacity: 0.9, marginRight: px2dp(10), color: 'white'}}/>
        </TouchableOpacity>
    }
   
   /**
     * 获取搜索按钮
     * @param callBack
     * @returns {XML}
    */
    static  getSearchButton(callBack) {
        return <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={callBack}>
                <View style={{padding:px2dp(5), marginRight: px2dp(8)}}>
                    <Feather
                        name={'search'}
                        size={px2dp(24)}
                        style={{color: 'white'}}
                    />
                </View>
            </TouchableOpacity>
        </View>
    }

}

const styles = StyleSheet.create({
    setting_item_container: {
        backgroundColor: 'white',
        padding: px2dp(10), 
        height: px2dp(60),
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
});