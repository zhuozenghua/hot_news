import React, {Component} from 'react';
import {StyleSheet, Button, Text, View,TouchableOpacity,DeviceInfo} from 'react-native';
import {connect} from 'react-redux'
import actions from '../action/index'

import NavigationUtil from '../navigator/NavigationUtil';
import NavigationBar from '../common/NavigationBar';
import Toast from 'react-native-easy-toast';
import NewsItem from '../common/NewsItem';
import {px2dp} from '../util/Utils';

const THEME_COLOR='#567';

type Props = {};
class FavoritePage extends Component<Props> {


  render() {
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

    return <View style={styles.container}>
            {navigationBar}
          </View>
   }

}


const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
    onThemeChange: theme => dispatch(actions.onThemeChange(theme))
});
export default connect(mapStateToProps, mapDispatchToProps)(FavoritePage);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
     marginTop: DeviceInfo.isIPhoneX_deprecated ? px2dp(30) : 0,
  },

});
