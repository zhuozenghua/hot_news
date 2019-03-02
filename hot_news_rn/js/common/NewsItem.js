import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View,} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import {px2dp} from '../util/Utils';

export default class NewsItem extends Component{


    constructor(props) {
        super(props);
        this.state = {
            isFavorite: this.props.item.isFavorite,
        }
    }


      setFavoriteState(isFavorite){
        this.props.item.isFavorite = isFavorite;
        this.setState({
            isFavorite: isFavorite,
        })
     }

       //设置callback函数
      onItemClick(){
        //执行
         this.props.onSelect(isFavorite => {
            this.setFavoriteState(isFavorite);
        });
      }

  
   render(){
      const {item}=this.props;
      if(!item) return null;


      return( <TouchableOpacity
                onPress={()=>{this.onItemClick()}}
             >
              {/* 新闻item */}
              <View style={styles.newsItem}>
                  <Text style={styles.itemTitle}>{item.news_title}</Text>
                  <Text style={styles.itemAbstract}>{item.news_abstract}</Text>

                  {/* 图片列表 */}
                  <View style={styles.imgBox}>
                      {
                      
                          item.news_image_list?
                              item.news_image_list.map((img, index) => {
                                // console.log(img.url)
                                  return (
                                      <Image
                                          style={
                                              item.news_image_list.length === 1 ? styles.oneImg :
                                                  (item.news_image_list.length - 1) === index ? styles.lastImg : styles.itemImg
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
                      <Text style={styles.tips}>{item.news_source}</Text>
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