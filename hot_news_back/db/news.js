var pool = require('./index');
var ObjectUtil=require('../util/ObjectUtil')
var News = {};

// data: object about one user's info
News.add = (data, callback) => {
    pool.getConnection((err, connection) => {
        if(err){
            console.log("Database connect error");
            callback(false,"数据库出错")
        }
      
        //查重
       var query1='select news_url from news where news_category_id=?'
       connection.query(query1,[data[0][0]], (err, results, fields) => {
              if (err) {
                  callback(false,"数据库出错");
                  console.log("select Error1: " + err);
              } else{

                      //过滤已有的新闻
                       var filterData=[];
                       var flag=false;
                       data.forEach( function(element, index) {
                            flag=false;
                            for(var i=0;i<results.length;i++){
                               if(element[3]==results[i].news_url){
                                   flag=true;
                                   break;
                               }
                            }

                            if(!flag){

                               filterData.push(element)
                            }
                       });

                       if(filterData.length>0){
                           var query =
                           'INSERT INTO news(`news_category_id`, `news_producer_id`,`news_title`,`news_url`,`news_abstract`,`news_content`,`news_source`,`news_image_list`,`news_keys`) VALUES ?';
                            connection.query(query,[filterData], (err, results, fields) => {
                                console.log(filterData.length)
                                if (err) {
                                    callback(false,"数据库出错");
                                    console.log("Insert Error2: " + err);
                                } else {
                                   
                                    if(results.affectedRows == 0){
                                        callback(false,"数据库出错");
                                    }else{
                                        callback(true);
                                    }
                                }
                                
                            })      
                       }else{
                           callback(true);
                       }
                       connection.release();

                   }
           })

    })
};


News.getNewsByCategory=(data,callback)=>{
        pool.getConnection((err, connection) => {
            if(err){
                console.log("Database connect error");
                callback(false,"数据库出错")
            }

          var query=
            'select * from news where news_category_id=? order by last_edit_time desc limit 38';
          connection.query(query,[data.category], (err, results, fields) => {
            if (err) {
                callback(false);
                console.log("select Error: " + err);
            } else {
                if(results.length == 0){
                    callback(false,"没有数据");
                }else{
                     let newsList=[];
                    //用户已经登录
                    if(data.userId){
                        //获取收藏列表
                        var query=
                            'select news_id from news_favorite where user_id=?';
                             connection.query(query,[data.userId],(err, results1, fields) => {
                              //查询news_coments的数量
                              // console.log(results1)
                              var favoriteNewsId=[]
                              results1.forEach((element, index)=>{
                                    favoriteNewsId.push(element.news_id)
                              });
                              newsList=results.map(item=>{
                                   
                                   item.comment_count=Math.floor(Math.random()*100); //0-99
                                   if(item.news_image_list){
                                        item.news_image_list=JSON.parse(item.news_image_list)
                                   }
                                   if(favoriteNewsId.indexOf(item.news_id)!==-1){    //是否收藏
                                        item.isFavorite=true
                                   }else{
                                        item.isFavorite=false
                                   }

                                   return item
                             })
                              callback(true,newsList);

                            })

                    }else{
                         //查询news_coments的数量
                           newsList=results.map(item=>{
                               item.comment_count=Math.floor(Math.random()*100); //0-99
                               if(item.news_image_list){
                                    item.news_image_list=JSON.parse(item.news_image_list)
                               }
                               item.isFavorite=false
                               return item
                         })
                              callback(true,newsList);

                    }
             

                }
            }
            connection.release();
        })

   })
}


News.getNewsByRecommend=(data,callback)=>{
        pool.getConnection((err, connection) => {
            if(err){
                console.log("Database connect error");
                callback(false,"数据库出错")
            }

       
          var query1='SELECT * FROM users_action where user_id=?'
          connection.query(query1,[data.userId], (err, results, fields) => {
            if (err) {
                callback(false);
                console.log("select Error: " + err);
            } else {

                if(results.length == 0){
                    //用户还没有点击tab操作
                      var query2=
                        'SELECT * FROM news  where news_category_id=? or news_category_id=? or news_category_id=? order by last_edit_time desc limit 38'
                      connection.query(query2,['news_society','news_entertainment','news_tech'], (err, results, fields) => {
                        if (err) {
                            callback(false);
                            console.log("select Error: " + err);
                        } else {
                            if(results.length == 0){
                                callback(false,"没有数据");
                            }else{
                                 let newsList=[];
                                //用户已经登录
                                if(data.userId){
                                    //获取收藏列表
                                    var query3=
                                        'select news_id from news_favorite where user_id=?';
                                         connection.query(query3,[data.userId],(err, results1, fields) => {
                                          //查询news_coments的数量
                                          // console.log(results1)
                                          var favoriteNewsId=[]
                                          results1.forEach((element, index)=>{
                                                favoriteNewsId.push(element.news_id)
                                          });
                                          newsList=results.map(item=>{
                                               
                                               item.comment_count=Math.floor(Math.random()*100); //0-99
                                               if(item.news_image_list){
                                                    item.news_image_list=JSON.parse(item.news_image_list)
                                               }
                                               if(favoriteNewsId.indexOf(item.news_id)!==-1){    //是否收藏
                                                    item.isFavorite=true
                                               }else{
                                                    item.isFavorite=false
                                               }

                                               return item
                                         })
                                          callback(true,newsList);

                                        })

                                }else{
                                     //查询news_coments的数量
                                       newsList=results.map(item=>{
                                           item.comment_count=Math.floor(Math.random()*100); //0-99
                                           if(item.news_image_list){
                                                item.news_image_list=JSON.parse(item.news_image_list)
                                           }
                                           item.isFavorite=false
                                           return item
                                     })
                                          callback(true,newsList);

                                }
                         

                            }
                        }
                    })

                }else{
                     
                      //排序
                      const { user_id,
                              visit_news_hot,
                              visit_news_recommend,
                              visit_news_society,
                              visit_news_entertainment,
                              visit_news_tech,
                              visit_news_car,
                              visit_news_sports,
                              visit_news_finance,
                              visit_news_military,
                              visit_news_world
                      }=results[0]
                     
                      const obj={
                              visit_news_society,
                              visit_news_entertainment,
                              visit_news_tech,
                              visit_news_car,
                              visit_news_sports,
                              visit_news_finance,
                              visit_news_military,
                              visit_news_world
                      }

                      var objArr=[];
                      Object.keys(obj).forEach( function(key, index) {
                             objArr.push({key:key.substring(6),num:obj[key]})
                      });


                      objArr=objArr.sort(ObjectUtil.compareObjectArr("num"));

                      // console.log(objArr)
                      var query2=
                             'SELECT * FROM news  where news_category_id=? or news_category_id=? or news_category_id=? order by last_edit_time desc limit 38'
                       connection.query(query2,[objArr[0].key,objArr[1].key,objArr[2].key], (err, results, fields) => {
                        if (err) {
                            callback(false);
                            console.log("select Error: " + err);
                        } else {
                            if(results.length == 0){
                                callback(false,"没有数据");
                            }else{
                                 let newsList=[];
                                //用户已经登录
                                if(data.userId){
                                    //获取收藏列表
                                    var query3=
                                        'select news_id from news_favorite where user_id=?';
                                         connection.query(query3,[data.userId],(err, results1, fields) => {
                                          //查询news_coments的数量
                                          // console.log(results1)
                                          var favoriteNewsId=[]
                                          results1.forEach((element, index)=>{
                                                favoriteNewsId.push(element.news_id)
                                          });
                                          newsList=results.map(item=>{
                                               
                                               item.comment_count=Math.floor(Math.random()*100); //0-99
                                               if(item.news_image_list){
                                                    item.news_image_list=JSON.parse(item.news_image_list)
                                               }
                                               if(favoriteNewsId.indexOf(item.news_id)!==-1){    //是否收藏
                                                    item.isFavorite=true
                                               }else{
                                                    item.isFavorite=false
                                               }

                                               return item
                                         })
                                          callback(true,newsList);

                                        })

                                }else{
                                     //查询news_coments的数量
                                       newsList=results.map(item=>{
                                           item.comment_count=Math.floor(Math.random()*100); //0-99
                                           if(item.news_image_list){
                                                item.news_image_list=JSON.parse(item.news_image_list)
                                           }
                                           item.isFavorite=false
                                           return item
                                     })
                                          callback(true,newsList);

                                }
                         

                            }
                        }
                    })
                   
                }
             
                  
            }
            connection.release();
        })

   })
}





News.getNewsBySearch=(data,callback)=>{
        pool.getConnection((err, connection) => {
            if(err){
                console.log("Database connect error");
                callback(false,"数据库出错")
            }

          var query=
            'select * from news where news_keys like ?';
          connection.query(query,[data.word], (err, results, fields) => {
            if (err) {
                callback(false);
                console.log("Select Error: " + err);
            } else {
                if(results.length == 0){
                    callback(false,"没有数据");
                }else{
                     let newsList=[];
                    //用户已经登录
                    if(data.userId){
                        //获取收藏列表
                        var query=
                            'select news_id from news_favorite where user_id=?';
                             connection.query(query,[data.userId],(err, results1, fields) => {
                              //查询news_coments的数量
                              // console.log(results1)
                              var favoriteNewsId=[]
                              results1.forEach((element, index)=>{
                                    favoriteNewsId.push(element.news_id)
                              });
                              newsList=results.map(item=>{
                                   
                                   item.comment_count=Math.floor(Math.random()*100); //0-99
                                   if(item.news_image_list){
                                        item.news_image_list=JSON.parse(item.news_image_list)
                                   }
                                   if(favoriteNewsId.indexOf(item.news_id)!==-1){    //是否收藏
                                        item.isFavorite=true
                                   }else{
                                        item.isFavorite=false
                                   }

                                   return item
                             })
                              callback(true,newsList);

                            })

                    }else{
                         //查询news_coments的数量
                           newsList=results.map(item=>{
                               item.comment_count=Math.floor(Math.random()*100); //0-99
                               if(item.news_image_list){
                                    item.news_image_list=JSON.parse(item.news_image_list)
                               }
                               item.isFavorite=false
                               return item
                         })
                              callback(true,newsList);

                    }
             

                }
            }
            connection.release();
        })

   })
}



News.userFavorite=(data,callback)=>{

      pool.getConnection((err, connection) => {
        if(err){
            console.log("Database connect error");
            callback(false,"数据库出错")
        }

       var query =
       'insert into news_favorite (user_id,news_id) values (?,?)';
        connection.query(query,[data.userId,data.newsId], (err, results, fields) => {
            if (err) {
                callback(false,"数据库出错");
                console.log("Insert Error: " + err);
            } else {
                if(results.affectedRows == 0){
                    callback(false,"数据库出错");
                }else{
                    callback(true);
                }
            }
            connection.release();
        })

    })

}


News.userUnFavorite=(data,callback)=>{

      pool.getConnection((err, connection) => {
        if(err){
            console.log("Database connect error");
            callback(false,"数据库出错")
        }

       var query =
       'delete from news_favorite where  user_id = ? and news_id=?';
        connection.query(query,[data.userId,data.newsId], (err, results, fields) => {
            if (err) {
                callback(false,"数据库出错");
                console.log("Delete Error: " + err);
            } else {
                if(results.affectedRows == 0){
                    callback(false,"数据库出错");
                }else{
                    callback(true);
                }
            }
            connection.release();
        })

    })

}


module.exports=News;
