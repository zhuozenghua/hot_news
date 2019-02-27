var pool = require('./index');

var Users = {};

// data: object about one user's info
Users.add = (data, callback) => {
    pool.getConnection((err, connection) => {
        if(err){
            console.log("Database connect error");
            return
        }

        var query = 'INSERT INTO users (phone, password) VALUES (?, ?)';
        connection.query(query, [data.phone, data.password], (err, results, fields) => {
            if (err) {
                callback(false);
                console.log("Insert Error: " + err);
            } else {
                if(results.affectedRows == 0){
                    callback(false);
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
            console.log("Database connect error");
            return
        }

        var query = 'SELECT  user_id,phone,real_name,nick_name,signature,sex,profile_img   FROM users WHERE phone = ? AND password = ?';
        connection.query(query, [data.phone, data.password], (err, results, fields) => {
            if (err) {
                console.log("Select Error: " + err);

            }else{
                callback(results);
            }

            connection.release();
        })

    })
};




module.exports = Users;