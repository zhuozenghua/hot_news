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
import RegExpUtil from "../../util/RegExpUtil";
import Toast from 'react-native-easy-toast';
import {signIn} from '../../expand/dao/UserDao.js'
import EventBus from 'react-native-event-bus'

const THEME_COLOR='#567';
type Props = {};

export default class SignInPage extends Component<Props> {

    constructor(props){
        super(props);
        this.backPress = new BackPressComponent({backPress: () => this.onBackPress()});
        this.phone="";
        this.password="";
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



    signinCallback(){
        
      if(!this.phone||!this.password){

       this.refs.toast.show("用户名或密码不能为空")
          return true;
       }
      if(!RegExpUtil.isMobile(this.phone)){
           this.refs.toast.show( "请输入正确的手机号",450)
           this.refs.phone.clear()
           this.refs.phone.focus()    
           return true;
       }
       if(!RegExpUtil.isPasswordTrue(this.password)){
        
          this.refs.toast.show("密码格式错误",450)
          this.refs.password.clear()
          this.refs.password.focus()
          return true;
       }

         signIn({
             phone:this.phone,
             password:this.password
          }).then(data=>{
              this.refs.toast.show( "登录成功",450,()=>{
                   EventBus.getInstance().fireEvent('signin_success', { })
                   this.onBackPress();  
              });
          }).catch(err=>{
              this.refs.toast.show(err)
              this.refs.phone.clear()
              this.refs.password.clear()
              this.refs.phone.focus()

          })

    } 


    signupCallback(){
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
                <Toast ref={'toast'}
                       position={'top'}
                       style={{
                          backgroundColor: THEME_COLOR,
                          opacity: 0.9,
                          borderRadius: 5,
                          padding: 10,
                       }}
                />
                <View style={styles.editGroup}>
                    <View style={styles.editView1}>
                        <Text style={styles.editText}>账号</Text>
                        <TextInput
                            ref={"phone"}
                            style={styles.edit}
                            underlineColorAndroid="transparent"
                            placeholder="手机号"
                            placeholderTextColor="#c4c4c4"
                            autoFocus={true}
                            maxLength={11}
                            textContentType="telephoneNumber"
                            onChangeText={(text) => {
                              this.phone = text;
                            }}
                            />
                    </View>
                   {/* <View style={{height: 1/PixelRatio.get(), backgroundColor:'#c4c4c4'}}/>*/}
                    <View style={styles.editView2}>
                       <Text style={styles.editText}>密码</Text>
                        <TextInput
                            ref={"password"}
                            style={styles.edit}
                            underlineColorAndroid="transparent"
                            placeholder="6-8位数字，字母或下划线组合"
                            placeholderTextColor="#c4c4c4"
                            secureTextEntry={true}
                            maxLength={10}
                            onChangeText={(text) => {
                              this.password = text;
                            }}

                            />
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
        marginTop: px2dp(50),
        marginBottom: px2dp(25),
    },
    editGroup:{
        margin: px2dp(20),
        marginLeft: px2dp(45),
        marginRight: px2dp(45)
    },
    editView1:{
        height: px2dp(48),
        backgroundColor:'white',
        justifyContent: 'center',
        borderWidth:1,
        borderColor:'gray',
        borderRadius: px2dp(15),
        flexDirection:'row'
    },
    editView2:{
        marginTop:px2dp(8),
        height: px2dp(48),
        backgroundColor:'white',
        justifyContent: 'center',
        borderWidth:1,
        borderColor:'gray',
        borderRadius: px2dp(15),
        flexDirection:'row'
    },
    edit:{
        flex:1,
        height: px2dp(30),
        fontSize: px2dp(13),
        borderRadius:px2dp(15),
        backgroundColor: '#fff',
        paddingLeft: px2dp(5),
        paddingRight: px2dp(15),
        paddingTop: px2dp(5),
        paddingBottom: px2dp(5),
        marginTop:px2dp(8),
    },
    editText:{
       height: px2dp(30),
       padding:px2dp(5),
       marginLeft:px2dp(5),
       marginRight:px2dp(5),
       marginTop:px2dp(8),
       fontSize:px2dp(13),
       color:THEME_COLOR
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