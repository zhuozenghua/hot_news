import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View,} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import {px2dp} from '../util/Utils';

export default class NewsItem extends Component{
  
   render(){
      const {item}=this.props;
      if(!item) return null;

      return( <TouchableOpacity
                onPress={this.props.onSelect}
             >
              {/* 新闻item */}
              <View style={styles.newsItem}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemAbstract}>{item.abstract}</Text>

                  {/* 图片列表 */}
                  <View style={styles.imgBox}>
                      {
                          item.image_list ?
                              item.image_list.map((img, index) => {
                                console.log(img.url)
                                  return (
                                      <Image
                                          style={
                                              item.image_list.length === 1 ? styles.oneImg :
                                                  (item.image_list.length - 1) === index ? styles.lastImg : styles.itemImg
                                          }
                                          source={{uri: img.url}}
                                          resizeMode='stretch'
                                          key={index}
                                      />
                                  )
                              }) : []
                      }
                  </View>

                  {/* 评论信息 */}
                  <View style={styles.tipsBox}>
                      <Text style={styles.stick_label}>{item.stick_label}</Text>
                      <Text style={styles.tips}>{item.source}</Text>
                      <Text style={styles.tips}>{(item.comment_count || 0) + '评论'}</Text>
                  </View>
              </View> 
             </TouchableOpacity>
            )
   }
}


const styles = StyleSheet.create({
        newsItem: {
          backgroundColor: 'white',
          padding: px2dp(10),
          borderBottomWidth:px2dp(0.5),
          borderColor:'#567'
        },
        itemTitle: { // 标题
            fontSize:px2dp(16),
            color: 'black',
        },
        itemAbstract: { // 摘要
            fontSize:px2dp(12),
            color: 'gray',
            paddingTop:px2dp(5),
        },
        stick_label: { // 粘性标签
            fontSize:px2dp(10),
            color: 'red',
        },
        imgBox: {
            flexDirection: 'row',
            marginTop:px2dp(6),
        },
        itemImg: {
            flex: 1,
            marginRight:px2dp(4),
            height: px2dp(70)
        },
        lastImg: {
            flex: 1,
            marginRight: 0,
            height: px2dp(70),
        },
        oneImg: {
            flex: 1,
            height:px2dp(180),
        },
        tipsBox: {
            flexDirection: 'row',
            marginTop: px2dp(6)
        },
        tips: {
            fontSize: px2dp(12),
            marginRight: px2dp(6)
        },

 });