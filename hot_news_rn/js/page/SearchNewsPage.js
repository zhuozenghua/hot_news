import React, {Component} from 'react';
import {Button,StyleSheet, Text, View ,TouchableOpacity,RefreshControl,DeviceInfo,ActivityIndicator} from 'react-native';
import {FlatList,createMaterialTopTabNavigator,createAppContainer} from 'react-navigation'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'

import NavigationBar from '../common/NavigationBar';
import NavigationUtil from '../navigator/NavigationUtil'
import {connect} from 'react-redux'
import NewsItem from '../common/NewsItem'
import BackToTop from '../common/BackToTop'; // 顶部返回组件
import Toast from 'react-native-easy-toast'
import EventBus from 'react-native-event-bus'
import {px2dp} from '../util/Utils';
import ViewUtil from "../util/ViewUtil";
import EventTypes from '../util/EventTypes'
import {getSearch} from '../expand/dao/SearchDao.js';
import BackPressComponent from "../common/BackPressComponent";

type Props = {};

export default class SearchNewsPage extends Component<Props> {

   constructor(props) {
      super(props);
      this.params = this.props.navigation.state.params;
      this.state={
          items:[]
      }
      this.backPress = new BackPressComponent({backPress: () => this.onBackPress()});
        
    }

   componentDidMount(){
      const {word} = this.params;
      this.loadData(word);
      this.backPress.componentDidMount();
   
   }

    componentWillUnmount() {
       this.backPress.componentWillUnmount();
    }


    onBackPress() {
        this.onBack();
        return true;
   }

    onBack() {
          NavigationUtil.goBack(this.props.navigation);
 
    }


   loadData(word){
     getSearch(word).then(data=>{
        this.setState({items:data})
     })
     .catch(e=>console.log(e))
   
    }



  renderItem(data){
     const item=data.item
     const {theme}=this.params;

     return <NewsItem item={item} 
                      theme={theme}
                      onSelect={(callback) => {
                        NavigationUtil.goPage({
                          theme,
                          item: item,
                          callback
                        }, 'NewsDetailPage')
                      }}

               />
       
  }


  render() {
   const {word} = this.params;
   const {theme}=this.params;

   let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content',
   };
   let navigationBar =
      <NavigationBar
          title={word}
          statusBar={statusBar}
          style={theme.styles.navBar}
          leftButton={ViewUtil.getLeftBackButton(() => this.onBackPress())}
      />;

    return (
      <View style={{flex:1}}>
          {navigationBar}
          <FlatList
           ref="searchList"
           data={this.state.items}
           renderItem={data=>this.renderItem(data)}
           keyExtractor={(item, index) => index.toString()}
   
        />
      </View>
    );
  }


    
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    marginTop: DeviceInfo.isIPhoneX_deprecated ? px2dp(30) : 0,
  },
  tabStyle:{
     //minWidth:50 //fix minWidth会导致tabStyle初次加载时闪烁
      width:px2dp(60),
      padding: px2dp(0),
      justifyContent: 'space-between',
  },
  labelStyle:{
    fontSize:px2dp(13),
    color:'#567',
    margin:px2dp(5)
  },
  indicatorContainer:{
    alignItems:'center'
  },
  indicator:{
      color:'#567',
      margin:px2dp(10)
  }
});
