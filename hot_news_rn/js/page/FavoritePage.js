import React, {Component} from 'react';
import {FlatList,Button,StyleSheet, Text, View,RefreshControl,ActivityIndicator,DeviceInfo} from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil'
import {connect} from 'react-redux'
import actions from '../action/index'
import NewsItem from '../common/NewsItem'
import Toast from 'react-native-easy-toast'
import NavigationBar from '../common/NavigationBar';
import {px2dp} from '../util/Utils';
import EventBus from 'react-native-event-bus'
import EventTypes from '../util/EventTypes'

const THEME_COLOR='#678'

type Props = {};

class FavoritePage extends Component<Props> {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
      this.loadData(true);
      EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.listener = data => {
          if (data.to === 2) {
              this.loadData(false);
          }
      })
  }

  componentWillUnmount() {
     EventBus.getInstance().removeListener(this.listener);
  }


  loadData(isShowLoading) {
        const {onLoadFavoriteNews} = this.props;
        onLoadFavoriteNews(isShowLoading)
    }

  _store(){
    const {favorite}=this.props;
    let store=favorite;
    if(!store){
       store={
          isLoading:false,
          items:[],//要显示的数据
          error:"请先登录"
       }
    }
    return store;
  }


  renderItem(data){
      const item=data.item;
      return <NewsItem 
                item={item}
                onSelect={(callback) => {
                  NavigationUtil.goPage({
                    item: item,
                    callback
                  }, 'NewsDetailPage')
                }}
           />
  }

  render() {
   let store=this._store();
   let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
   };
   let navigationBar =
      <NavigationBar
          title={'收藏'}
          statusBar={statusBar}
          style={{backgroundColor: THEME_COLOR}}

          />;


    return (
      <View style={styles.container}>
          {navigationBar}
          {
            store.error?<View style={{flex:1,alignItems:'center',paddingTop:px2dp(10),height:px2dp(20)}}><Text>{store.error}</Text></View> :
            <View style={{flex:1}}>
             <FlatList
               data={store.items}
               renderItem={data=>this.renderItem(data)}
               keyExtractor={(item, index) => index.toString()}
               refreshControl={
                 <RefreshControl
                    title={'Loading'}
                    titleColor={THEME_COLOR}
                    colors={[THEME_COLOR]}
                    refreshing={store.isLoading}
                    onRefresh={()=>this.loadData(true)}
                    tintColor={THEME_COLOR}
                 />
              }
             />
          </View>
       }
    </View>
   );
  }
  
}


const mapStateToProps = state => ({
    favorite: state.favorite,
});

const mapDispatchToProps = dispatch => ({
    onLoadFavoriteNews: (isShowLoading) => dispatch(actions.onLoadFavoriteNews(isShowLoading)),
});

//注意：connect只是个function，并不应定非要放在export后面
export default  connect(mapStateToProps, mapDispatchToProps)(FavoritePage);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    marginTop: DeviceInfo.isIPhoneX_deprecated ? px2dp(30) : 0,
  },
  tabStyle:{
     //minWidth:50 //fix minWidth会导致tabStyle初次加载时闪烁
      padding: 0
  },
  indicatorStyle:{
    height:px2dp(2),
    backgroundColor:'white'
  },
  labelStyle:{
    fontSize:px2dp(13),
    margin:0
  },
  indicatorContainer:{
    alignItems:'center'
  },
  indicator:{
      color:'red',
      margin:px2dp(10)
  }
});




