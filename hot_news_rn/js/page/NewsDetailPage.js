import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, WebView ,DeviceInfo} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import NavigationUtil from "../navigator/NavigationUtil";
import NavigationBar from '../common/NavigationBar';
import BackPressComponent from "../common/BackPressComponent";
import ViewUtil from "../util/ViewUtil";
import {px2dp} from '../util/Utils';
import {favoriteItem} from '../expand/dao/FavoriteDao'
import Toast from 'react-native-easy-toast';
import EventTypes from '../util/EventTypes'
import EventBus from 'react-native-event-bus'

type Props = {};
export default class NewsDetailPage extends Component<Props> {


    constructor(props) {
        super(props);
        //从导航器取出参数
        this.params = this.props.navigation.state.params;
        const {item} = this.params;
        const title = item.news_title;
        const url = item.news_url;
        const isFavorite = item.isFavorite;

        this.state = {
            title: title,
            url:url,
            isFavorite:isFavorite,
            canGoBack: false,
        };

        this.backPress = new BackPressComponent({backPress: () => this.onBackPress()});
    }


    componentDidMount() {
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
        if (this.state.canGoBack) {
            this.webView.goBack();
        } else {
            NavigationUtil.goBack(this.props.navigation);
        }
    }


     onFavoriteButtonClick(){
        const {item,callback} =this.params;

        //获取新闻id
        let news_id=item.news_id;
          //收藏逻辑
          //成功之后还需要改变通知news page刷新状态 1-回调,效率高  2.event-bus
        favoriteItem(news_id,!item.isFavorite).then(msg=>{
             const isFavorite=item.isFavorite=!item.isFavorite;
              callback(isFavorite)
              this.setState({
                 isFavorite:isFavorite,
              })

              EventBus.getInstance().fireEvent(EventTypes.news_favorite_change);

        }).catch(err=>{
              this.refs.toast.show(err)

        })


    }

   

    renderRightButton() {
        return (
              //收藏按钮
               <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={() => this.onFavoriteButtonClick()}>
                    <FontAwesome
                        name={this.state.isFavorite ? 'star' : 'star-o'}
                        size={px2dp(20)}
                        style={{color: 'white', marginRight: px2dp(10)}}
                    />
                </TouchableOpacity>
                {ViewUtil.getShareButton(() => {

                })}
            </View>
        )
    }

   onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack,
            url: navState.url,
        })
    } 

  render() {
     const {theme} =this.params;

     const titleLayoutStyle = this.state.title.length > 14 ? {paddingRight: px2dp(25)} : null;
     
     let navigationBar = <NavigationBar
      leftButton={ViewUtil.getLeftBackButton(() => this.onBackPress())}
      titleLayoutStyle={titleLayoutStyle}
      title={this.state.title}
      style={theme.styles.navBar}
      rightButton={this.renderRightButton()}
  />;


    return (
      <View style={styles.container}>
          {navigationBar}
           <Toast ref={'toast'}
                 position={'top'}
                 style={{
                    backgroundColor: theme.themeColor,
                    opacity: 0.9,
                    borderRadius: 5,
                    padding: 10,
                 }}
          />
           <WebView
              ref={webView => this.webView = webView}
              startInLoadingState={true}
              //onNavigationStateChange={e => this.onNavigationStateChange(e)}
              source={{uri: this.state.url}}
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
  }

});
