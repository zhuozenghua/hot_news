var pool = require('./index');

var NewsSearch = {};

// data: object about one user's info
NewsSearch.add = (data, callback) => {
    pool.getConnection((err, connection) => {
        if(err){
            console.log("Database connect error");
            callback(false,"数据库出错")
        }
      
        //查重
       var query1='select * from news_search_keys where search_key=?'
       connection.query(query1,[data.word], (err, results, fields) => {
              if (err) {
                  callback(false,"数据库出错");
                  console.log("select Error1: " + err);
              } else{
                   var query2;
                  if(results.length>0){
                      query2="update news_search_keys set search_num=search_num+1 where search_key=?"
                  }else{
                      query2="insert into news_search_keys (`search_key`, `search_num`) values (? , 1)"
                  }
                  connection.query(query2,[data.word], (err, results, fields) => {
                          if (err) {
                            callback(false,"数据库出错");
                            console.log("add  Error: " + err);
                          } else{
                             callback(true,"add key success")
                          }



                  })
                  
                  connection.release();

               }
       
       })

    })
};



NewsSearch.getHotKeys =( callback) => {
   pool.getConnection((err, connection) => {
       if(err){
          console.log("Database connect error");
          callback(false,"数据库出错")
       }

       var query='select search_key from news_search_keys order by search_num desc limit 10'
       connection.query(query,[], (err, results, fields) => {
              if (err) {
                    callback(false,"数据库出错");
                    console.log("select Error: " + err);
                  } else{
                    callback(true,results);
                  }
       connection.release();

      })
   })    
}


NewsSearch.getTipKeys =(data, callback) => {
   pool.getConnection((err, connection) => {
       if(err){
          console.log("Database connect error");
          callback(false,"数据库出错")
       }


       var query='select search_key from news_search_keys where search_key like ? order by search_num desc limit 5'
       connection.query(query,[data.word], (err, results, fields) => {
              if (err) {
                    callback(false,"数据库出错");
                    console.log("select Error: " + err);
                  } else{
                    callback(true,results);
                  }
       connection.release();

      })
   })    
}



module.exports=NewsSearch;