import React, {Component} from 'react';
import {connect} from 'react-redux'
import {onThemeChange} from '../action/theme'
import {ScrollView, StyleSheet, Text, TouchableOpacity, View,DeviceInfo} from 'react-native';
import NavigationUtil from "../navigator/NavigationUtil";
import NavigationBar from '../common/NavigationBar';
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {MORE_MENU} from "../common/MORE_MENU";
import ViewUtil from "../util/ViewUtil";
import {px2dp} from '../util/Utils';

const THEME_COLOR='#567';
type Props = {};

class MyPage extends Component<Props> {

    getRightButton() {
    }

    onClick(menu) {
        // 跳转到登录页
          NavigationUtil.goPage({
          }, 'SigInPage')

    }

    getItem(menu) {
        return ViewUtil.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR);
    }

    render() {
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle: 'light-content',
        };
        let navigationBar =
            <NavigationBar
                title={'我的'}
                statusBar={statusBar}
                style={{backgroundColor: THEME_COLOR}}
                rightButton={this.getRightButton()}
            />;
        return (
            <View style={styles.container}>
                {navigationBar}
                <ScrollView>
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => this.onClick(MORE_MENU.About)}
                    >
                        <View style={styles.about_left}>
                            <Ionicons
                                name={MORE_MENU.About.icon}
                                size={px2dp(40)}
                                style={{
                                    marginRight: px2dp(10),
                                    color: THEME_COLOR
                                }}
                            />
                            <Text>登录微头条体验更多功能</Text>
                        </View>
                        <Ionicons
                            name={'ios-arrow-forward'}
                            size={px2dp(16)}
                            style={{
                                marginRight: px2dp(10),
                                alignSelf: 'center',
                                color: THEME_COLOR,
                            }}/>
                    </TouchableOpacity>
                    <View style={styles.line}/>
                    {/*新闻标签管理*/}
                    <Text style={styles.groupTitle}>新闻标签管理</Text>
                    {/*自定义标签*/}
                    {this.getItem(MORE_MENU.Custom_Key)}
                    {/*标签排序*/}
                    {this.getItem(MORE_MENU.Sort_Key)}
                    {/*标签移除*/}
                    {this.getItem(MORE_MENU.Remove_Key)}
                    <View style={styles.line}/>
                    {/*设置*/}
                    <Text style={styles.groupTitle}>设置</Text>
                    {/*自定义主题*/}
                    {this.getItem(MORE_MENU.Custom_Theme)}
                    <View style={styles.line}/>
                    {/*关于作者*/}
                    {this.getItem(MORE_MENU.About_Author)}
                    <View style={styles.line}/>
                    {/*反馈*/}
                    {this.getItem(MORE_MENU.Feedback)}
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    onThemeChange: (theme) => dispatch(onThemeChange(theme)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyPage);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: DeviceInfo.isIPhoneX_deprecated ? px2dp(30) : 0
    },
    about_left: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    item: {
        backgroundColor: 'white',
        padding: px2dp(10),
        height: px2dp(90),
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    groupTitle:{
        marginLeft: px2dp(10),
        marginTop: px2dp(10),
        marginBottom: px2dp(5),
        fontSize: px2dp(12),
        color: 'gray'
    },
    line:{
        height:px2dp(0.5),
        opacity: 0.5,
        backgroundColor: 'darkgray',
    }
});