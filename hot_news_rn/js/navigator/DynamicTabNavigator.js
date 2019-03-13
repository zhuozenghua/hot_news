import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {createBottomTabNavigator,createAppContainer} from 'react-navigation'

import NewsPage from '../page/NewsPage'
import VideoPage from '../page/VideoPage'
import FavoritePage from '../page/FavoritePage'
import MyPage from '../page/MyPage'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import NavigationUtil from './NavigationUtil'
import {BottomTabBar} from 'react-navigation-tabs'
import {connect} from 'react-redux'
import EventBus from 'react-native-event-bus'
import EventTypes from '../util/EventTypes'
type Props = {};


const TABS={
       NewsPage:{
          screen:NewsPage,
          navigationOptions:{
             tabBarLabel:"首页",
             tabBarIcon:({tintColor,focused})=>{
              return <MaterialIcons name={'home'} size={26} style={{color:tintColor}}/>             
             }
          }
       },
       VideoPage:{
          screen:VideoPage,
          navigationOptions:{
             tabBarLabel:"视频",
               tabBarIcon:({tintColor,focused})=>(
               <Ionicons name={'md-play'} size={26} style={{color:tintColor}}/>
             )
          }
       },
       FavoritePage:{
          screen:FavoritePage,
          navigationOptions:{
             tabBarLabel:"收藏",
             tabBarIcon:({tintColor,focused})=>(
               <MaterialIcons name={'favorite'} size={26} style={{color:tintColor}}/>
             )
          }
       },
       MyPage:{
          screen:MyPage,
          navigationOptions:{
             tabBarLabel:"我的",
             tabBarIcon:({tintColor,focused})=>(
               <FontAwesome name={'user'} size={26} style={{color:tintColor}}/>
             )
          }
       }
 }

class DynamicTabNavigator extends Component<Props> {

  constructor(props){
     super(props)
     console.disableYellowBox=true;
  }

  _bottomTabNavigator(){
     const {NewsPage,VideoPage,FavoritePage,MyPage}=TABS;
     const tabs={NewsPage,VideoPage,FavoritePage,MyPage};//根据需要定制需要显示的tab
     NewsPage.navigationOptions.tabBarLabel='首页'; //修改配置tab属性
     return  createBottomTabNavigator(tabs,{
        tabBarComponent:props=>{
           return <TabBarComponent theme={this.props.theme} {...props}/>
        }
     });
  }

  render() {
  
    var BottomTab;
    if(!this.Tabs){
     BottomTab=this.Tabs=createAppContainer(this._bottomTabNavigator());
    }else{
      BottomTab=this.Tabs
    }
    // const BottomTab=this._bottomTabNavigator();
    return <BottomTab onNavigationStateChange={(prevState, newState, action) => {
                      EventBus.getInstance().fireEvent(EventTypes.bottom_tab_select, {//发送底部tab切换的事件
                       from: prevState.index,
                       to: newState.index
                      })
                     }}      
           />
  }
}


class TabBarComponent extends  Component<Props> {

  constructor(props){
     super(props);
     this.theme={
        tintColor:props.activeTintColor,
        updateTime:new Date().getTime()
     }
  }

  render(){
    // const {routes,index}=this.props.navigation.state;
    // if(routes[index].params){
    //    const {theme}=routes[index].params;
    //    if(theme&&theme.updateTime>this.theme.updateTime){
    //       this.theme=theme;
    //    }
    // }
     
     return <BottomTabBar
         {...this.props}
         activeTintColor={this.props.theme.themeColor}
         inactiveTintColor='rgba(180,180,180,0.9)'
       />
    }
 
}

const mapStateToProps=state=>({
    theme:state.theme.theme
})



export default connect(mapStateToProps)(DynamicTabNavigator)

