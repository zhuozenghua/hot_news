'use strict';

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    Keyboard,
    DeviceInfo,
    PixelRatio
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BackPressComponent from "../common/BackPressComponent";
import NavigationUtil from "../navigator/NavigationUtil";
import WebViewPage from './WebViewPage';
import {getHotKey, getTipsWords} from '../expand/dao/SearchDao.js';
import {px2dp} from '../util/Utils';
import Toast from 'react-native-easy-toast'

export default class SearchPage extends Component<Props> {

    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.state = {
            text: '', // 文字
            hotWords: [], // 热词列表
            tipsWords: [], // 提示词列表
        }
        this.backPress = new BackPressComponent({backPress: () => this.onBackPress()});
    }

    componentDidMount() {
        // 获取热搜列表
        getHotKey()
            .then((data) => {
                this.setState({
                    hotWords: data
                })
            })
            .catch((e) => {
                this.refs.toast.show(e.toString())
                // ToastAndroid.show(e, ToastAndroid.SHORT);
            })
        this.backPress.componentDidMount();     
    }

    componentWillUnmount() {
       this.backPress.componentWillUnmount();
    }

     onBackPress() {
        NavigationUtil.goBack(this.props.navigation);
        return true;
     }

    // 获取提示词列表
    getTipsWords(words) {
        if (words.trim() === '') {
            this.setState({
                tipsWords: [] // 提示词列表
            });
            return;
        }
        // 获取提示词
        getTipsWords(words)
            .then((data) => {
                this.setState({
                    tipsWords: data
                })
            })
            .catch((e) => {
                this.refs.toast.show(e.toString())
                //ToastAndroid.show(e, ToastAndroid.SHORT);
            })
    }

    // 搜索词相关的新闻
    searchWords(words) {
        Keyboard.dismiss();
        if (words.trim() === '') {
            this.refs.toast.show('请输入内容')
            // ToastAndroid.show('请输入内容', ToastAndroid.SHORT);
            return;
        }

        // 跳转到内容页面
         NavigationUtil.goPage({
             word:words,
             theme:this.params.theme
         }, 'SearchNewsPage') 
      
    }

    // 字符输入状态改变的回调
    inputChangeHandle(text) {
        this.setState({
            text: text
        }, () => {
            this.getTipsWords(text);
        })
    }

    render() {
        const {theme}=this.params;
        return (
            <View style={{flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? px2dp(30) : 0,}}>
                  <View style={ {
                    flexDirection: 'row',
                    height: px2dp(40),
                    backgroundColor: theme.themeColor,
                    borderBottomWidth: px2dp(1),
                    borderBottomColor: '#f5f5f3',
                    paddingTop:px2dp(3),
                    paddingBottom:px2dp(3),
                    alignItems: 'center'
                     }}>
                    {/* 返回按钮 */}
                    <View style={styles.backIconBox}>
                        <Icon style={styles.backIcon} name='chevron-left' onPress={() => {
                            NavigationUtil.goBack(this.props.navigation);
                        }}/>
                    </View>
                    {/* 搜索框 */}
                    <View style={styles.searchBox}>
                        <Icon style={styles.searchIcon} name='search'/>
                        <TextInput
                            style={styles.searchInput}
                            onChangeText={this.inputChangeHandle.bind(this)}
                            value={this.state.text}
                            placeholder="搜你想搜的"
                            placeholderTextColor="#f5f5f5"
                            underlineColorAndroid="transparent"
                            selectionColor="#3385ff"
                        />
                    </View>
                    <Text onPress={this.searchWords.bind(this, this.state.text)} style={styles.searchBtn}>搜索</Text>
                </View>
                {
                    this.state.tipsWords.length <= 0 ?
                        <View style={{flex: 1, padding: px2dp(10)}}>
                            <Text style={{fontSize: px2dp(13), color: '#212121'}}>大家都在搜</Text>
                            <View style={styles.hotWordsList}>
                                {
                                    this.state.hotWords.map((item, index) => {
                                        return (
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                style={styles.hotWordBox}
                                                key={index}
                                                onPress={this.searchWords.bind(this, item)}
                                            >
                                                <Text style={styles.hotWord}>{item}</Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        </View>
                        :
                        <View style={{flex: 1, padding: px2dp(10)}}>
                            {
                                this.state.tipsWords.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            style={styles.tipsWordBox}
                                            key={index}
                                            onPress={this.searchWords.bind(this, item)}
                                        >
                                            <Icon style={styles.searchIcon} name='search'/>
                                            <Text style={styles.tipsWord}>{item}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                }
               <Toast ref={'toast'}
                       position={'center'}
                       style={{
                          backgroundColor: theme.themeColor,
                          opacity: 0.9,
                          borderRadius: 5,
                          padding: 10,
                       }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    backIconBox: {
        width: px2dp(40),
        height: px2dp(40),
        justifyContent: 'center',
        alignItems: 'center'
    },
    backIcon: {
        fontSize: px2dp(30),
        color:'white',
    },
    searchBox: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        borderWidth: px2dp(1),
        borderRadius: px2dp(10),
        borderColor: '#f2f2f2',
        height: px2dp(30),
        padding: px2dp(5),
    },
    searchIcon: {
        fontSize: px2dp(20),
         color:'white'
    },
    searchInput: {
        flex: 1,
        color: 'white',
        height: px2dp(30),
        fontSize: px2dp(12),
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: px2dp(5),
        paddingRight: px2dp(5),
    },
    searchBtn: {
        width: px2dp(50),
        fontSize: px2dp(13),
        textAlign: 'center',
        color:'white',
    },
    hotWordsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start'
    },
    hotWordBox: {
        paddingLeft: px2dp(20),
        paddingRight: px2dp(20),
        paddingTop: px2dp(2),
        paddingBottom: px2dp(2),
        borderWidth: 1/PixelRatio.get(),
        borderColor: '#bdbdbd',
        margin: px2dp(5)
    },
    hotWord: {
        fontSize: px2dp(12)
    },
    tipsWordBox: {
        borderWidth: 0,
        flexDirection: 'row',
        marginBottom: px2dp(10),
        height: px2dp(38),
        alignItems: 'center'
    },
    tipsWord: {
        fontSize: px2dp(14),
        marginLeft: px2dp(8)
    }
})