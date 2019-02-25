import React, {Component} from 'react';
import {Text,View, StyleSheet, PixelRatio, Platform, TouchableOpacity, Image, TextInput,DeviceInfo} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import BackPressComponent from "../../common/BackPressComponent";
import NavigationUtil from "../../navigator/NavigationUtil";
import Button from '../../common/Button';
import TextButton from '../../common/TextButton';
import ImageButton from '../../common/ImageButtonWithText';
import TextDivider from '../../common/TextDivider';
import {px2dp} from '../../util/Utils';
import NavigationBar from '../../common/NavigationBar';
import ViewUtil from "../../util/ViewUtil";

const THEME_COLOR='#567';
type Props = {};

export default class SignInPage extends Component<Props> {
    constructor(props){
        super(props);
        this.backPress = new BackPressComponent({backPress: () => this.onBackPress()});
    }

    componentDidMount() {
         this.backPress.componentDidMount();     
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    onBackPress() {
        NavigationUtil.goBack(this.props.navigation);
        return true;
     }


    signupCallback(){
         // 跳转到注册页面
        this.props.navigation.push(
           'SignUpPage',
            {
            }
         );
    }
    signinCallback(){
              // 跳转到注册页面
        this.props.navigation.push(
           'SignUpPage',
            {
            }
         );
    }

    forgetPassword(){

    }

    render(){

         let navigationBar = <NavigationBar
              leftButton={ViewUtil.getLeftBackButton(() => this.onBackPress())}
              title={'登录'}
              style={{backgroundColor: THEME_COLOR}}
          />;

        return(
            <View style={styles.container}>
                {navigationBar}
                <View style={styles.logo}>
                    <Text style={{fontSize:px2dp(22), color:{THEME_COLOR}}}>
                      {"登录你的头条，精彩永丢失"}
                    </Text>
                </View>
                <View style={styles.editGroup}>
                    <View style={styles.editView1}>
                        <TextInput
                            style={styles.edit}
                            underlineColorAndroid="transparent"
                            placeholder="手机号/邮箱"
                            placeholderTextColor="#c4c4c4"/>
                    </View>
                   {/* <View style={{height: 1/PixelRatio.get(), backgroundColor:'#c4c4c4'}}/>*/}
                    <View style={styles.editView2}>
                        <TextInput
                            style={styles.edit}
                            underlineColorAndroid="transparent"
                            placeholder="密码"
                            placeholderTextColor="#c4c4c4"/>
                    </View>
                    <View style={{marginTop: px2dp(18), height: px2dp(40)}}>
                        <Button text="登录" 
                                btnStyle={{
                                            flex: 1,
                                            height: px2dp(45), 
                                            alignItems:'center', 
                                            justifyContent:'center',
                                            borderRadius: 3,
                                            backgroundColor:THEME_COLOR}}
                                onPress={this.signinCallback.bind(this)}
                               />
                    </View>
                    <View style={styles.textButtonLine}>
                        <TextButton text="忘记密码?" onPress={this.forgetPassword.bind(this)} color={THEME_COLOR}/>
                        <TextButton text="注册账号" onPress={this.signupCallback.bind(this)} color={THEME_COLOR}/>
                    </View>
                </View>
                <View style={{flex: 1}}>
                    <View style={{flex: 1, justifyContent: 'flex-end', marginLeft: px2dp(20), marginRight: px2dp(20)}}>
                        <TextDivider text="其他账号登录"/>
                    </View>
                    <View style={styles.thirdPartyView}>
                        <ImageButton text="微博"    onPress={()=>{}} icon="weibo"   color={THEME_COLOR}  imgSize={px2dp(25)}/>
                        <ImageButton text="微信"    onPress={()=>{}} icon="wechat"   color={THEME_COLOR}  imgSize={px2dp(25)}/>
                        <ImageButton text="Github"    onPress={()=>{}} icon="github"   color={THEME_COLOR}  imgSize={px2dp(25)}/>
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
    edit:{
        height: px2dp(40),
        fontSize: px2dp(13),
        backgroundColor: '#fff',
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
    editGroup:{
        margin: px2dp(20)
    },
    textButtonLine:{
        marginTop: px2dp(12),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    thirdPartyView:{
        flex: 1,
        marginTop: px2dp(10),
        flexDirection:'row',
        alignItems: 'flex-start',
        justifyContent:'space-around'
    }

});