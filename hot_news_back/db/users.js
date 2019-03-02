var pool = require('./index');

var Users = {};

// data: object about one user's info
Users.add = (data, callback) => {
    pool.getConnection((err, connection) => {
        if(err){
            callback(false,"数据库出错");
            console.log("Database connect error");
            return ;
        }

        var query = 'INSERT INTO users (phone, password) VALUES (?, ?)';
        connection.query(query, [data.phone, data.password], (err, results, fields) => {
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
};


// data: object about one user's info
Users.getOneByPassword = (data, callback) => {

    pool.getConnection((err, connection) => {
        if(err){
            callback(false,"数据库出错");
            console.log("Database connect error");
            return;
        }

        var query = 'SELECT  user_id,phone,real_name,nick_name,signature,sex,profile_img   FROM users WHERE phone = ? AND password = ?';
        connection.query(query, [data.phone, data.password], (err, results, fields) => {
            if (err) {
                callback(false,"数据库出错");
                console.log("Select Error: " + err);
            }else{
                callback(true,results);
            }

            connection.release();
        })

    })
};


Users.getFavoriteNews=(data,callback)=>{ 
     pool.getConnection((err, connection) => {
        if(err){
            callback(false,"数据库出错");
            console.log("Database connect error");
            return;
        }

      var  query='select * from news,news_favorite where news.news_id=news_favorite.news_id and news_favorite.user_id=?';

        connection.query(query,[data.userId], (err, results, fields) => {
            if (err) {
                callback(false,"数据库出错");
                console.log("Select Error: " + err);
            }else{
                let res=[];
                results.forEach( function(item, index) {
                     item.comment_count=Math.floor(Math.random()*100); //0-99
                      if(item.news_image_list){
                            item.news_image_list=JSON.parse(item.news_image_list)
                       } 
                     item.isFavorite=true;
                     res.push(item)
                });
                callback(true,res);
            }

            connection.release();
        })

    })
    

}


module.exports = Users;