import React, {Component} from 'react';
import {connect} from 'react-redux'
import {onThemeChange} from '../action/theme'
import {ScrollView, StyleSheet, Text, TouchableOpacity, View,DeviceInfo,Alert,AsyncStorage,Linking,PixelRatio} from 'react-native';
import NavigationUtil from "../navigator/NavigationUtil";
import NavigationBar from '../common/NavigationBar';
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import {MORE_MENU} from "../common/MORE_MENU";
import ViewUtil from "../util/ViewUtil";
import {px2dp} from '../util/Utils';
import {checkLogin,signOut} from '../expand/dao/UserDao.js'
import Button from '../common/Button';
import Toast from 'react-native-easy-toast'
import EventBus from 'react-native-event-bus'
import actions from "../action";

type Props = {};

class MyPage extends Component<Props> {

    constructor(props) {
      super(props);
    
      this.state = {
          isLogin:false,
          user:{}
       };
    }


    componentDidMount(){
        this.checkIsLogin();
         EventBus.getInstance().addListener("signin_success", this.signinSuccessListener = () => {       
              this.setState({
                  isLogin:true
               })
              AsyncStorage.getItem("user", (error, result) => {
                 if (!error&&result) {
                    try {
                       var result=JSON.parse(result);
                       this.setState({
                          user:result.user
                       })
                    } catch (error) {
                        console.log(error.toString);

                    }
                 } else {
                        console.log(error.toString);
                 }
              })
        });
    }

   componentWillUnmount() {
      EventBus.getInstance().removeListener(this.signinSuccessListener);
  }


    checkIsLogin(){
         checkLogin().then(data=>{
           this.setState({
              isLogin:true
           })
          AsyncStorage.getItem("user", (error, result) => {
             if (!error&&result) {
                try {
                   var result=JSON.parse(result);
                   this.setState({
                      user:result.user
                   })
                } catch (error) {
                    console.log(error.toString);

                }
             } else {
                    console.log(error.toString);
             }
          })

        })
        .catch(e=>{
            console.log(e.toString())
        })
    }


    getRightButton() {
    }


    onClickLogin(menu) {
           const {theme}=this.props;
          //再次判断是否已经登录
           this.checkIsLogin();
           //没有登录
          if(!this.state.isLogin){
             //跳转到登录页
              NavigationUtil.goPage({
                theme
              }, 'SigInPage') 
          }


    }


    onMenuClick(menu) {
       switch (menu) {
            case MORE_MENU.Custom_Theme:
                const {onShowCustomThemeView} = this.props;
                onShowCustomThemeView(true);
                break;
            case MORE_MENU.Feedback:
                const url = 'mailto://1002243893@qq.com';
                Linking.canOpenURL(url)
                    .then(support => {
                        if (!support) {
                            console.log('Can\'t handle url: ' + url);
                        } else {
                            Linking.openURL(url);
                        }
                    }).catch(e => {
                    console.error('An error occurred', e);
                });
                break;
        }     

    }

    signoutCallback(){
        Alert.alert(
          '登出',
          '你确认退出吗?',
          [
            {text: '取消', onPress: () =>{}, style: 'cancel'},
            {text: '确认', onPress: () =>{
                if(signOut()){
                    this.setState({
                      isLogin:false,
                      user:{}
                   });
                   this.refs.toast.show("登出成功",350)

                }
            }}
          ],
          { cancelable: false }
        )
    }


    getItem(menu) {
        const {theme} = this.props;
        return ViewUtil.getMenuItem(() => this.onMenuClick(menu), menu, theme.themeColor);
    }

    render() {
       const {theme} = this.props;
        let statusBar = {
            backgroundColor: theme.themeColor,
            barStyle: 'light-content',
        };
        let navigationBar =
            <NavigationBar
                title={'我的'}
                statusBar={statusBar}
                style={theme.styles.navBar}
                rightButton={this.getRightButton()}
            />;
        return (
            <View style={styles.container}>
                {navigationBar}
                <ScrollView>

                   {
                        this.state.isLogin?
                             <TouchableOpacity
                                style={styles.item}
                                onPress={() => this.onClickLogin(MORE_MENU.User_Icon)}
                             >
                                <View style={styles.about_center}>
                                    <FontAwesome
                                        name={MORE_MENU.User_Icon.icon}
                                        size={px2dp(40)}
                                        style={{
                                            marginRight: px2dp(10),
                                            color: theme.themeColor
                                        }}
                                    />
                                </View>
                                 <Text style={{marginLeft:px2dp(-4)}}>
                                 {  
                                     this.state.user.phone?this.state.user.phone:"已登录"
                                 }
                                 </Text>
                               <Button text="登出" 
                                btnStyle={{
                                            position:'absolute',
                                            right:px2dp(12),
                                            bottom:px2dp(4),
                                            height: px2dp(20),
                                            paddingLeft:px2dp(10), 
                                            paddingRight:px2dp(10), 
                                            borderRadius: 3,
                                            opacity:0.9,
                                            backgroundColor:theme.themeColor}}
                                textStyle={{fontSize:px2dp(13),color:'white'}}            
                                onPress={this.signoutCallback.bind(this)}
                               />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                style={styles.item}
                                onPress={() => this.onClickLogin(MORE_MENU.No_Login)}
                             >
                                <View style={styles.about_center}>
                                    <FontAwesome
                                        name={MORE_MENU.No_Login.icon}
                                        size={px2dp(40)}
                                        style={{
                                            marginRight: px2dp(10),
                                            color: theme.themeColor
                                        }}
                                    />
                                </View>
                                 <Text>登录微头条体验更多功能</Text>
                            </TouchableOpacity>

                   }
                   <Toast ref={'toast'}
                       position={'top'}
                       style={{
                          backgroundColor: theme.themeColor,
                          opacity: 0.9,
                          borderRadius: 5,
                          padding: 10,
                       }}
                   />
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


const mapStateToProps = state => ({
    theme: state.theme.theme,
});

const mapDispatchToProps = dispatch => ({
    onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyPage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: DeviceInfo.isIPhoneX_deprecated ? px2dp(30) : 0
    },
     item: {
        backgroundColor: 'white',
        padding: px2dp(20),
        // height: px2dp(90),
        alignItems: 'center',
        justifyContent: 'center',
        //justifyContent: 'space-between',
        // flexDirection: 'row'
    },
    about_center: {
        alignItems: 'center',
        justifyContent:'center',
        // flexDirection: 'row'
        marginBottom:px2dp(10)
    },
    groupTitle:{
        marginLeft: px2dp(10),
        marginTop: px2dp(10),
        marginBottom: px2dp(5),
        fontSize: px2dp(12),
        color: 'gray'
    },
    line:{
        height:1/PixelRatio.get(),
        opacity: 0.5,
        backgroundColor: 'darkgray',
    }
});