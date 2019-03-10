var pool = require('./index');

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
                  console.log("Insert Error1: " + err);
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
            'select * from news where news_category_id=?';
          connection.query(query,[data.category], (err, results, fields) => {
            if (err) {
                callback(false);
                console.log("Insert Error: " + err);
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
