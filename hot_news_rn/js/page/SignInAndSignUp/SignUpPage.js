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
import RegExpUtil from "../../util/RegExpUtil";
import Toast from 'react-native-easy-toast';
import {signUp} from '../../expand/dao/UserDao.js'
import TextButton from '../../common/TextButton';

type Props = {};
export default class SignUpPage extends Component<Props> {
    constructor(props){
        super(props);
        this.params = this.props.navigation.state.params;
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

    onBackPress(){
        NavigationUtil.goBack(this.props.navigation);
        return true;
    }

    signupCallback(){
      if(!this.phone||!this.password){

          this.refs.toast.show("用户名或密码不能为空")
          return true;
       }
      if(!RegExpUtil.isMobile(this.phone)){
           this.refs.toast.show( "请输入正确的手机号")
           this.refs.phone.clear()
           this.refs.phone.focus()    
           return true;
       }
      if(!RegExpUtil.isPasswordTrue(this.password)){
          this.refs.toast.show("密码格式错误")
          this.refs.password.clear()
          this.refs.password.focus()
          return true;
       }

         signUp({
             phone:this.phone,
             password:this.password
          }).then(data=>{
              this.refs.toast.show( "注册成功",450,()=>{
                   this.onBackPress();  
              });
          }).catch(err=>{
              this.refs.toast.show(err.toString())
              this.refs.phone.clear()
              this.refs.password.clear()
              this.refs.phone.focus()
          })
    }

    render(){
        const {theme} =this.params;
        let navigationBar = <NavigationBar
            leftButton={ViewUtil.getLeftBackButton(() => this.onBackPress())}
            title={'注册'}
            style={theme.styles.navBar}
        />;
        return(
            <View style={styles.container}>
                {navigationBar}
                <View style={styles.logo}>
                    <Text style={{fontSize:px2dp(22), color:theme.themeColor}}>
                      {"快来注册你的账户吧"}
                    </Text>
                </View>
                <Toast ref={'toast'}
                       position={'top'}
                       style={{
                          backgroundColor: theme.themeColor,
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
                    <View style={{marginTop: px2dp(15), height: px2dp(40)}}>
                        <Button text="注册" 
                                btnStyle={{
                                flex: 1,
                                height: px2dp(45), 
                                alignItems:'center', 
                                justifyContent:'center',
                                borderRadius: 3,
                                backgroundColor:theme.themeColor}}
                                onPress={this.signupCallback.bind(this)}/>
                    </View>
                    <View style={styles.textButtonLine}>
                        <TextButton text="返回登录" onPress={this.onBackPress.bind(this)} color={theme.themeColor}/>
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
        borderColor:'rgba(235,235,235,0.5)',
        borderRadius: px2dp(15),
        flexDirection:'row'
    },
    editView2:{
        marginTop:px2dp(8),
        height: px2dp(48),
        backgroundColor:'white',
        justifyContent: 'center',
        borderWidth:1,
        borderColor:'rgba(235,235,235,0.5)',
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
       color:'rgba(160,160,160,1)'
    },
    textButtonLine:{
        marginTop: px2dp(12),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
});