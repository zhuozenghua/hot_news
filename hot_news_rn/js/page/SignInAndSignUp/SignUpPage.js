'use strict';

import React, {Component} from 'react';
import {Text, View, StyleSheet, PixelRatio, Platform, TouchableOpacity, Image, TextInput,DeviceInfo} from 'react-native';
import ImageButton from '../../common/ImageButtonWithText';
import Button from '../../common/Button';
import {px2dp} from '../../util/Utils';
import NavigationUtil from "../../navigator/NavigationUtil";
import BackPressComponent from "../../common/BackPressComponent";
import NavigationBar from '../../common/NavigationBar';
import ViewUtil from "../../util/ViewUtil";

const THEME_COLOR='#567';
type Props = {};
export default class SignUpPage extends Component<Props> {
    constructor(props){
        super(props);
        this.params = this.props.navigation.state.params;
         this.backPress = new BackPressComponent({backPress: () => this.onBackPress()});
    }

    componentDidMount() {
         this.backPress.componentDidMount();     
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    onBackPress(){
        NavigationUtil.goBack(this.props.navigation);
        return true;
    }

    signupCallback(){
        NavigationUtil.goBack(this.props.navigation);
        return true;
    }

    render(){
        let navigationBar = <NavigationBar
            leftButton={ViewUtil.getLeftBackButton(() => this.onBackPress())}
            title={'注册'}
            style={{backgroundColor: THEME_COLOR}}
        />;
        return(
            <View style={styles.container}>
                {navigationBar}
                <View style={styles.logo}>
                    <Text style={{fontSize:px2dp(22), color:{THEME_COLOR}}}>
                      {"快来注册你的账户吧"}
                    </Text>
                </View>
                <View style={styles.editGroup}>
                    <View style={styles.editView1}>
                        <TextInput
                            style={styles.edit}
                            underlineColorAndroid="transparent"
                            placeholder="邮箱/手机号"
                            placeholderTextColor="#c4c4c4"/>
                    </View>
                  {/*  <View style={{height: 1/PixelRatio.get(), backgroundColor:'#c4c4c4'}}/>*/}
                    <View style={styles.editView2}>
                        <TextInput
                            style={styles.edit}
                            underlineColorAndroid="transparent"
                            placeholder="密码"
                            placeholderTextColor="#c4c4c4"/>
                    </View>
                    <View style={{marginTop: px2dp(15), height: px2dp(40)}}>
                        <Button text="注册" 
                                btnStyle={{
                                flex: 1,
                                height: px2dp(45), 
                                alignItems:'center', 
                                justifyContent:'center',
                                borderRadius: 3,
                                backgroundColor:THEME_COLOR}}
                                onPress={this.signupCallback.bind(this)}/>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        marginTop: DeviceInfo.isIPhoneX_deprecated ? px2dp(30) : 0
    },
    logo:{
        alignItems: 'center',
        marginTop: px2dp(70),
        marginBottom: px2dp(50),
    },
    editGroup:{
        padding: px2dp(20)
    },
    edit:{
        height: px2dp(40),
        fontSize: px2dp(13),
        backgroundColor: 'white',
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15)
    },
    editView1:{
        height: px2dp(48),
        backgroundColor:'white',
        justifyContent: 'center',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3
    },
    editView2:{
        marginTop:px2dp(5),
        height: px2dp(48),
        backgroundColor:'white',
        justifyContent: 'center',
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3
    },
});