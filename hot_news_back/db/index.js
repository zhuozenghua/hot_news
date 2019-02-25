var mysql = require('mysql');

var pool  = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'hot_news',
    charset: "utf8"
});

pool.getConnection(function (err, connection) {
    if(err){
        console.log("Database connect error");
    }

})

module.exports = pool;