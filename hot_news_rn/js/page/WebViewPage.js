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

// webview组件
export default class WebViewPage extends  Component<Props>{
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        const {title, url} = this.params;
        this.state = {
            title: title,
            url: url,
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


    onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack,
            url: navState.url,
        })
    } 


    _renderLoading() {
         const {theme} =this.params;
        return (
            <View style={{justifyContent: 'center', paddingTop: px2dp(70)}}>
                <ActivityIndicator color={theme.themeColor}  size="large"/>
            </View>
        );
    }

    showTips(state) {

    }



    render() {

         const {theme}=this.params;
         const titleLayoutStyle = this.state.title.length > 20 ? {paddingRight: px2dp(30)} : null;
         
          let navigationBar = <NavigationBar
          leftButton={ViewUtil.getLeftBackButton(() => this.onBackPress())}
          titleLayoutStyle={titleLayoutStyle}
          title={this.state.title}
          style={theme.styles.navBar}
         />;
        return (
            <View style={styles.container}>
                {navigationBar}

                {/* webview */}
                <WebView
                    source={{uri: this.state.url}}
                    ref={webView => this.webView = webView}
                    //renderLoading={this._renderLoading.bind(this)}
                    startInLoadingState={true}
                    onNavigationStateChange={e => this.onNavigationStateChange(e)}
                    onLoad={this.showTips.bind(this, 'load')}
                    onError={this.showTips.bind(this, 'error')}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
   container:{
     flex: 1,
     marginTop: DeviceInfo.isIPhoneX_deprecated ? px2dp(30) : 0,
   }
});
