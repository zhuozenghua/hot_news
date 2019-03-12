import React, {Component} from 'react';
import {Button,StyleSheet, Text, View ,TouchableOpacity,RefreshControl,DeviceInfo,ActivityIndicator,PixelRatio} from 'react-native';
import {FlatList,createMaterialTopTabNavigator,createAppContainer} from 'react-navigation'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'

import NavigationBar from '../common/NavigationBar';
import NavigationUtil from '../navigator/NavigationUtil'
import {connect} from 'react-redux'
import NewsItem from '../common/NewsItem'
import {px2dp} from '../util/Utils';
import ViewUtil from "../util/ViewUtil";
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
           ItemSeparatorComponent={()=>ViewUtil.getSeparator()}
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
