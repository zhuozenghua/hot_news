import React, {Component} from 'react';
import {Button,StyleSheet, Text, View ,TouchableOpacity,RefreshControl,DeviceInfo,ActivityIndicator} from 'react-native';
import {FlatList,createMaterialTopTabNavigator,createAppContainer} from 'react-navigation'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'

import NavigationBar from '../common/NavigationBar';
import NavigationUtil from '../navigator/NavigationUtil'
import {connect} from 'react-redux'
import actions from '../action/index'
import NewsItem from '../common/NewsItem'
import BackToTop from '../common/BackToTop'; // 顶部返回组件
import Toast from 'react-native-easy-toast'
import EventBus from 'react-native-event-bus'
import {px2dp} from '../util/Utils';
import ViewUtil from "../util/ViewUtil";
import EventTypes from '../util/EventTypes'

// const URL='http://is.snssdk.com/api/news/feed/v51/?category=';
const URL='http://10.0.2.2:3000/news/?category=';
const THEME_COLOR='#567';
type Props = {};

export default class NewsPage extends Component<Props> {

 constructor(props) {
   super(props);
   this.tabNames=[{'id': 'news_hot', 'name': '热点'},
    {'id': 'news_society', 'name': '社会'},
    {'id': 'news_entertainment', 'name': '娱乐'},
    {'id': 'news_tech', 'name': '科技'},
    {'id': 'news_car', 'name': '汽车'},
    {'id': 'news_sports', 'name': '体育'},
    {'id': 'news_finance', 'name': '财经'},
    {'id': 'news_military', 'name': '军事'},
    {'id': 'news_world', 'name': '国际'}]; // 频道信息
 }



 _genTabs(){
    const tabs={};
    this.tabNames.forEach((item, index)=>{
       tabs[`tab${index}`]={
            screen:props=><NewsTabPage {...props} tabLabel={item}/>,
            navigationOptions:{
                 title:item.name,
                // tabBarOnPress:(obj)=> {
                  // EventBus.getInstance().fireEvent('change_tab');
               //},
           }
       }
    });
    return tabs;
 }

  _topTabNavigator(){
     return createMaterialTopTabNavigator(this._genTabs(),{
        lazy:true, 
        tabBarOptions:{
           tabStyle:styles.tabStyle,
           upperCaseLabel:false,
           scrollEnabled:true,
           style:{
              backgroundColor:'white',
              height: px2dp(30)//fix 开启scrollEnabled后再Android上初次加载时闪烁问题
           },
           indicatorStyle:styles.indicatorStyle,
           labelStyle:styles.labelStyle
        },
     })
  }

      // 搜索
    navToSearch() {
          NavigationUtil.goPage({
          }, 'SearchPage')
    }

  

   getRightButton() {
       return ViewUtil.getSearchButton(this.navToSearch.bind(this));
       // return <View style={{flexDirection: 'row'}}>
       //      <TouchableOpacity onPress={ this.navToSearch.bind(this)}>
       //          <View style={{padding:px2dp(5), marginRight: px2dp(8)}}>
       //              <Feather
       //                  name={'search'}
       //                  size={px2dp(24)}
       //                  style={{color: 'white'}}
       //              />
       //          </View>

       //      </TouchableOpacity>
       //  </View>
    }


  render() {
   let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
   };
   let navigationBar =
      <NavigationBar
          title={'热点资讯'}
          statusBar={statusBar}
          style={{backgroundColor: THEME_COLOR}}
          rightButton={this.getRightButton()}
          />;


    const TopTab=createAppContainer(this._topTabNavigator());

    return <View style={styles.container}>
            {navigationBar}
            <TopTab/>
          </View>
  }
}


const pageSize=8

class NewsTab extends Component<Props> {

  constructor(props) {
    super(props);
    const {tabLabel}=this.props;
    this.storeName=tabLabel.id;
    this.isFavoriteChanged = false;
  }

   componentDidMount(){
     this.loadData();
     EventBus.getInstance().addListener(EventTypes.news_favorite_change, this.favoriteChangeListener = () => {       
        this.isFavoriteChanged = true;
    });

     EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = (data) => {
        if (data.to === 0 && this.isFavoriteChanged) {
           this.isFavoriteChanged = false;
           this.loadData(null, true);
       }
     }) 

   }


   componentWillUnmount() {
      EventBus.getInstance().removeListener(this.favoriteChangeListener);
      EventBus.getInstance().removeListener(this.bottomTabSelectListener);
  }


   _store(){
    const {news}=this.props;
    let store=news[this.storeName]; //动态获取store
    if(!store){
       store={
          items:[],
          isLoading:false,
          projectModels:[],//要显示的数据
          hideLoadingMore:true //默认隐藏更多
       }
    }
    return store;
  }


 //刷新和刷新收藏状态都是onRefreshNews
 loadData(loadMore,refreshFavorite){
     const {onRefreshNews,onLoadMoreNews}=this.props;
     const store=this._store();
     const url=this.genFetchUrl(this.storeName);
     if(loadMore){
       onLoadMoreNews(this.storeName,++store.pageIndex,pageSize,store.items,callBack=>{
             this.refs.toast.show('没有更多了')
       })
     }else{
       onRefreshNews(this.storeName,url,pageSize);
     }
  }

   genFetchUrl(key){
     return URL+key;
  }


  genIndicator(){
      return this._store().hideLoadingMore ? null :
      <View style={styles.indicatorContainer}>
          <ActivityIndicator
              style={styles.indicator}
          />
          <Text>正在加载更多</Text>
      </View>
  }



  renderItem(data){
     const item=data.item
     return <NewsItem item={item} 
                      onSelect={(callback) => {
                        NavigationUtil.goPage({
                          item: item,
                          callback
                        }, 'NewsDetailPage')
                      }}

               />
       
  }

    // 返回顶部
    backToTop() {
        this.refs.newsList.scrollToOffset({x: 0, y: 0, animated: true});
    }


  render() {
 
    let store=this._store();

    return (
      <View style={{flex:1}}>
          <FlatList
           ref="newsList"
           data={store.projectModels}
           renderItem={data=>this.renderItem(data)}
           keyExtractor={(item, index) => index.toString()}
           refreshControl={
             <RefreshControl
                title={'Loading'}
                titleColor={THEME_COLOR}
                colors={[THEME_COLOR]}
                refreshing={store.isLoading}
                onRefresh={()=>this.loadData()}
                tintColor={THEME_COLOR}
             />
           }
            ListFooterComponent={() => this.genIndicator()}
            onEndReached={() => {
                      console.log('---onEndReached----');
                       setTimeout(() => {
                          if (this.canLoadMore) {//fix 滚动时两次调用onEndReached https://github.com/facebook/react-native/issues/14015
                               this.loadData(true);
                               this.canLoadMore = false;
                           }
                       }, 100);
                 }}
            onEndReachedThreshold={0.2}
            onMomentumScrollBegin={() => {                
                   this.canLoadMore = true; //fix 初始化时页调用onEndReached的问题
                   console.log('---onMomentumScrollBegin-----')
                }}


        />
        <BackToTop pressHandle={this.backToTop.bind(this)}/>
        <Toast ref={'toast'}
               position={'center'}
               style={{
                  backgroundColor: THEME_COLOR,
                  opacity: 0.9,
                  borderRadius: 5,
                  padding: 10,
               }}
        />
      </View>
    );
  }
}



const mapStateToProps = state => ({
    news: state.news
});
const mapDispatchToProps = dispatch => ({
   onRefreshNews: (storeName, url,pageSize)=> dispatch(actions.onRefreshNews(storeName, url,pageSize)),
   onLoadMoreNews: (storeName, pageIndex, pageSize, items, callBack)=> dispatch(actions.onLoadMoreNews(storeName, pageIndex, pageSize, items, callBack)),

});

//注意：connect只是个function，并不应定非要放在export后面
const NewsTabPage = connect(mapStateToProps, mapDispatchToProps)(NewsTab)



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
  indicatorStyle:{
    height:1,
    backgroundColor:THEME_COLOR,
    width:px2dp(30),
    position:'relative',
    left:px2dp(15),
    top:px2dp(30)
  },
  labelStyle:{
    fontSize:px2dp(13),
    color:THEME_COLOR,
    margin:px2dp(5)
  },
  indicatorContainer:{
    alignItems:'center'
  },
  indicator:{
      color:THEME_COLOR,
      margin:px2dp(10)
  }
});
