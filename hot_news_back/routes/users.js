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
      //从body中获取token
      // var token=req.body.token;
      // jwt.verify(token, secret.tokenSecret, function (err, decode) {
      //          if (err) {  //  时间失效的时候|伪造的token   
      //               res.json({
      //                  status:-1,
      //                  msg:"你还未登陆"
      //               })                 
      //           } else {
      //               var userId=decode.user.user_id;
                    
      //               res.json({
      //                  status:0,
      //                  msg:"登录凭证有效"
      //               })    
      //           }
      //  })
      //  
      //  
      Users.getFavoriteNews({userId:2},(flag,result)=>{
           if(flag&&result.length!==0){
                res.json({
                   status:0,
                   data:result
                })
              console.log(result.length)
           }else{
               res.json({
                  status:-1,
                  msg:"你还没有收藏"
               })
           }

      })
   
})


module.exports = router;
