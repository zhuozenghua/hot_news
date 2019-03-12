var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var secret=require('../config/secret');
var Users = require('../db/users');
/**
 * /u
 * 
 */
router.get('/', function(req, res, next) {
   res.send("/u")
});




/**
 * /u/favorite_list
 * 获取我的收藏列表
 */
router.get('/favorite_list',function(req,res,next){

    if(req.get("token")){
        
        var token=JSON.parse(req.get("token"));
        token=token.token;
        var userId;

        jwt.verify(token, secret.tokenSecret, function (err, decode) {
                if (!err) {  //  时间失效的时候|伪造的token   
                    userId=decode.user.user_id
                    Users.getFavoriteNews({userId:userId},(flag,result)=>{
                         if(flag){
                              res.json({
                                 status:0,
                                 data:result
                              })
                         }else{
                             res.json({
                                status:-1,
                                msg:result
                             })

                         }

                    })
 
                 }else{
                   res.json({
                    status:-1,
                    msg:"请先登录"
                   })  

                 }
           })

    }else{
           res.json({
            status:-1,
            msg:"请先登录"
           })   
    }


   
})


/**
 * /u/count_user_tab
 * 统计用户使用各种标签的次数
 */
router.post('/count_user_tab',function(req,res,next){

      //从body中获取token
      const token=req.body.token;

      if(token){
              jwt.verify(token, secret.tokenSecret, function (err, decode) {
               if (err) {  //  时间失效的时候|伪造的token   
                    res.json({
                       status:-1,
                       msg:"登录凭证过期，请先登录",
                    })  
                        
                } else {
                    console.log(decode.user)
                    Users.addAction({user_id:decode.user.user_id,key:"visit_"+req.body.key},(flag,result)=>{
                       if(flag){
                           res.json({
                             status:0,
                             msg:result
                          }) 

                       }else{
                          res.json({
                             status:-1,
                             msg:result
                          }) 

                       }

                    })
   
                }
       })
      }else{
           res.json({
             status:-1,
             msg:"登录凭证过期，请先登录"
           })  
      }
    // console.log(req.body)               
   
})



module.exports = router;
