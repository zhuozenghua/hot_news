import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, WebView ,DeviceInfo} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import NavigationUtil from "../navigator/NavigationUtil";
import NavigationBar from '../common/NavigationBar';
import BackPressComponent from "../common/BackPressComponent";
import ViewUtil from "../util/ViewUtil";
import {px2dp} from '../util/Utils';
const THEME_COLOR='#567';

type Props = {};
export default class NewsDetailPage extends Component<Props> {


    constructor(props) {
        super(props);
        //从导航器取出参数
        this.params = this.props.navigation.state.params;
        const {item} = this.params;
        const title = item.title;
        this.url = item.url;
    

        this.state = {
            title: title,
            url: this.url,
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
     const titleLayoutStyle = this.state.title.length > 20 ? {paddingRight: px2dp(30)} : null;
     
     let navigationBar = <NavigationBar
      leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
      titleLayoutStyle={titleLayoutStyle}
      title={this.state.title}
      style={{backgroundColor: THEME_COLOR}}
      rightButton={this.renderRightButton()}
  />;


    return (
      <View style={styles.container}>
          {navigationBar}
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
