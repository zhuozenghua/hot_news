import React, {Component} from 'react';
import {Button,StyleSheet, Text, View ,TouchableOpacity,RefreshControl,DeviceInfo,ActivityIndicator,Image} from 'react-native';
import {FlatList,createMaterialTopTabNavigator,createAppContainer} from 'react-navigation'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'

import NavigationBar from '../common/NavigationBar';
import MyVideoPlayer from '../common/MyVideoPlayer';
import {connect} from 'react-redux'
import actions from '../action/index'
import Toast from 'react-native-easy-toast'
import BackToTop from '../common/BackToTop';
import {px2dp} from '../util/Utils';
import ViewUtil from "../util/ViewUtil";
import {URL}  from '../util/NetConfig'
//const URL = 'http://is.snssdk.com/api/news/feed/v51/?category=video';

const url=`${URL}/video`

type Props = {};

class VideoPage extends Component<Props> {

 constructor(props) {
   super(props);
 }



  navToSearch(){

  }

   getRightButton() {
        return ViewUtil.getSearchButton(this.navToSearch.bind(this));
    }


  render() {
    const {theme}=this.props; 
   let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content',
   };
   let navigationBar =
      <NavigationBar
          title={'小视频'}
          statusBar={statusBar}
          style={theme.styles.navBar}
          rightButton={this.getRightButton()}
          //leftButton={this.getLeftButton()}
      />;

    return <View style={styles.container}>
            {navigationBar}
            <VideoListPage theme={theme}/>
          </View>
  }
}


const mapVideoStateToProps = state => ({
     theme: state.theme.theme,
});

export default connect(mapVideoStateToProps)(VideoPage)

const pageSize=10

class VideoList extends Component<Props> {

  constructor(props) {
    super(props);
  }

 componentDidMount(){
    this.loadData();
 }

   _store(){
    const {video}=this.props;
    if(!video){
       video={
          items:[],
          isLoading:false,
          projectModels:[],//要显示的数据
          hideLoadingMore:true //默认隐藏更多
       }
    }
    return video;
  }



 loadData(loadMore){
     const {onRefreshVideo,onLoadMoreVideo}=this.props;
     const store=this._store();
     if(loadMore){
       onLoadMoreVideo(++store.pageIndex,pageSize,store.items,callBack=>{
             this.refs.toast.show('没有更多了')
       })
     }else{
       onRefreshVideo(url,pageSize);
     }

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
     return  <View>
            <View style={styles.videoItem}>
                <MyVideoPlayer
                    source={item.video_url}
                    img={item.video_middle_image.url}
                    title={item.video_title}
                    duration={item.video_duration}
                    height={px2dp(200)}
                />
                <TouchableOpacity activeOpacity={0.8} style={styles.videoTips}>
{/*                    <View style={styles.authorInfo}>
                        <Image
                            style={styles.authorImage}
                            source={{uri: item.wemedia_info.image}}
                            resizeMode='stretch'
                        />
                        <Text style={styles.authorName}>{item.wemedia_info.name}</Text>
                    </View>
                    <View style={styles.videoInfo}>
                        <Icon style={styles.icon} name='comment'/>
                        <Text style={styles.videoNum}>{item.comment_count}</Text>
                        <Icon style={styles.icon} name='thumb-up'/>
                        <Text style={styles.videoNum}>{item.like}</Text>
                    </View>*/}
                </TouchableOpacity>

            </View>
        </View>
       
  }

    backToTop() {
        this.refs.videoList.scrollToOffset({x: 0, y: 0, animated: true});
    }


  render() {
    let store=this._store();
    const {theme}=this.props;
    return (
      <View style={{flex:1}}>
          <FlatList
           ref="videoList"
           data={store.projectModels}
           renderItem={data=>this.renderItem(data)}
           keyExtractor={(item, index) => item.video_url||index.toString()}
           refreshControl={
             <RefreshControl
                title={'Loading'}
                titleColor={theme.themeColor}
                colors={[theme.themeColor]}
                refreshing={store.isLoading}
                onRefresh={()=>this.loadData()}
                tintColor={theme.themeColor}
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
        />
      </View>
    );
  }
}



const mapStateToProps = state => ({
    video: state.video,
});
const mapDispatchToProps = dispatch => ({
   onRefreshVideo: (url,pageSize)=> dispatch(actions.onRefreshVideo(url,pageSize)),
   onLoadMoreVideo: (pageIndex, pageSize, items, callBack)=> dispatch(actions.onLoadMoreVideo(pageIndex, pageSize, items, callBack)),

});

//注意：connect只是个function，并不应定非要放在export后面
const VideoListPage = connect(mapStateToProps, mapDispatchToProps)(VideoList)



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    marginTop: DeviceInfo.isIPhoneX_deprecated ? px2dp(30) : 0,
  },
  videoItem: {
      borderBottomWidth:px2dp(0.5),
      borderBottomColor: 'rgba(0,0,0,0.2)'
  },
  videoTips: {
      flexDirection: 'row',
      height: px2dp(20),
      alignItems: 'center',
      paddingLeft: px2dp(10),
      paddingRight: px2dp(10),
      justifyContent: 'space-between'
  },
  indicatorContainer:{
    alignItems:'center'
  },
  indicator:{
      color:"#567",
      margin:px2dp(10)
  }
 
});
