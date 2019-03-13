var pool = require('./index');

var Video = {};


// data: object about one user's info
Video.add = (data, callback) => {
    pool.getConnection((err, connection) => {
        if(err){
            console.log("Database connect error");
            callback(false,"数据库出错")
        }
      
        //查重
       var query1='select video_id from videos'
       connection.query(query1,[], (err, results, fields) => {
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
                               if(element[0]==results[i].video_id){
                                   flag=true;
                                   break;
                               }
                            }

                            if(!flag){

                               filterData.push(element)
                            }
                       });
                       console.log(filterData)
                       if(filterData.length>0){
                           var query =
                           'INSERT INTO videos(`video_id`, `video_title`,`video_url`,`video_duration`,`video_middle_image`,`video_tag`) VALUES ?';
                            connection.query(query,[filterData], (err, results, fields) => {
                             
                                if (err) {
                                    callback(false,"数据库出错");
                                    console.log("Insert Error2: " + err);
                                } else {
                                   
                                    if(results.affectedRows == 0){
                                        callback(false,"数据库出错");
                                    }else{
                                        console.log(`插入视频：`,filterData.length,"条")
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


Video.getVideoByCategory=(data,callback)=>{
        pool.getConnection((err, connection) => {
            if(err){
                console.log("Database connect error");
                callback(false,"数据库出错")
            }

          var query=
            'select * from videos order by last_edit_time desc limit 38';
          connection.query(query,[], (err, results, fields) => {
            if (err) {
                callback(false);
                console.log("select Error: " + err);
            } else {
                var videoList;
                videoList=results.map(item=>{

                    if(item.video_middle_image){
                        item.video_middle_image=JSON.parse(item.video_middle_image)
                    }

                    return item
                 })
                 callback(true,videoList);
              }
            connection.release();
        })

   })
}


module.exports = Video;