'use strict';

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    WebView,
    ActivityIndicator,
    TouchableOpacity,
    DeviceInfo
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BackPressComponent from "../common/BackPressComponent";
import NavigationBar from '../common/NavigationBar';
import NavigationUtil from "../navigator/NavigationUtil";
import ViewUtil from "../util/ViewUtil";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import {px2dp} from '../util/Utils';

const THEME_COLOR='#567';
// webview组件
export default class WebViewPage extends  Component<Props>{
    constructor(props) {
        super(props);
        this.state = {};
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: () => this.onBackPress()});
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


    _renderLoading() {
        return (
            <View style={{justifyContent: 'center', paddingTop: px2dp(70)}}>
                <ActivityIndicator color={THEME_COLOR}  size="large"/>
            </View>
        );
    }

    showTips(state) {

    }

    renderRightButton() {
    return (<View style={{flexDirection: 'row'}}>
            <TouchableOpacity
                onPress={() => this.onFavoriteButtonClick()}>
                <FontAwesome
                    name={this.state.isFavorite ? 'star' : 'star-o'}
                    size={px2dp(20)}
                    style={{color: 'white', marginRight:px2dp(10)}}
                />
            </TouchableOpacity>
            {ViewUtil.getShareButton(() => {

            })}
        </View>
    )
   }

      onBack() {
            NavigationUtil.goBack(this.props.navigation);
      }


    render() {

           const title=this.params.words;
           const titleLayoutStyle = title.length > 20 ? {paddingRight: px2dp(30)} : null;
         
          let navigationBar = <NavigationBar
          leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
          titleLayoutStyle={titleLayoutStyle}
          title={title}
          style={{backgroundColor: THEME_COLOR}}
          rightButton={this.renderRightButton()}
         />;
        return (
            <View style={{flex: 1,marginTop: DeviceInfo.isIPhoneX_deprecated ? px2dp(30) : 0,}}>
                {navigationBar}

                {/* webview */}
                <WebView
                    source={{uri: this.params.uri}}
                    style={styles.webView}
                    //renderLoading={this._renderLoading.bind(this)}
                    startInLoadingState={true}
                    onLoad={this.showTips.bind(this, 'load')}
                    onError={this.showTips.bind(this, 'error')}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    webView: {
        flex: 1,
    },
    headerBar: {
        flexDirection: 'row',
        height: px2dp(40),
        backgroundColor: 'white',
        borderBottomWidth: px2dp(1),
        borderBottomColor: '#f5f5f3',
        alignItems: 'center'
    },
    backIconBox: {
        width: px2dp(40),
        height: px2dp(40),
        justifyContent: 'center',
        alignItems: 'center'
    },
    backIcon: {
        fontSize: px2dp(30)
    },
});
