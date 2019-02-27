import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {px2dp} from '../util/Utils';
import NavigationUtil from '../navigator/NavigationUtil'
type Props = {};
export default class WelcomePage extends Component<Props> {

  componentDidMount(){
     this.timer=setTimeout(()=>{
        NavigationUtil.resetToHomePage({
           navigation:this.props.navigation
        })
     }, 200)
  }

  componentWillUnmount(){
    this.timer&&clearTimeout(this.timer);
  }

  render() {
    // return (
    //   <View style={styles.container}>
    //     <Text style={styles.welcome}>WelcomePage</Text>
    //   </View>
    // );
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: px2dp(20),
    textAlign: 'center',
    margin:px2dp(10),
  },
});
