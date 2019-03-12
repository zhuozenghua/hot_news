var express = require('express');
var router = express.Router();
var News=require('../db/news')
var NewsSearch=require('../db/newsSearch')
var jwt = require('jsonwebtoken');
var secret=require('../config/secret');



/**
 * /news?category=
 *  取出新闻数据新闻数据
 */
router.get('/',function(req,res,next){
    var category=req.query.category;

    if(req.get("token")){
        var token=JSON.parse(req.get("token"));
        token=token.token;
        var userId;
        jwt.verify(token, secret.tokenSecret, function (err, decode) {
                if (!err) {  //  时间失效的时候|伪造的token   
                    userId=decode.user.user_id
                 }
           })

    }

    if(category=="news_recommend"){
        News.getNewsByRecommend({category:category,userId:userId},(flag,result)=>{
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
        News.getNewsByCategory({category:category,userId:userId},(flag,result)=>{
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


    }


})

/**
 * /news/search?word= 
 */

router.get('/search/',function(req,res,next){
   var word=req.query.word;
   if(word==""){

   }
   word=word.trim();


     if(req.get("token")){
      var token=JSON.parse(req.get("token"));
      token=token.token;
      var userId;
      jwt.verify(token, secret.tokenSecret, function (err, decode) {
              if (!err) {  //  时间失效的时候|伪造的token   
                  userId=decode.user.user_id
               }
         })

  }

  News.getNewsBySearch({word:"%"+word+"%",userId:userId},(flag,result)=>{
       if(flag){
          res.json({
             status:0,
             data:result
          })
         NewsSearch.add({word:word},(flag,result)=>{
               console.log(result)
         })

       }else{
          res.json({
             status:-1,
             msg:result
          })
       }


  })

})


/**
 * /news/get_hot_keys 
 */
router.get('/get_hot_keys',function(req,res,next){
      NewsSearch.getHotKeys((flag,result)=>{
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

})


/**
 * /news/get_tip_keys?word= 
 */
router.get('/get_tip_keys',function(req,res,next){

       var word=req.query.word;
       if(word==""){

       }
       word=word.trim()+"%";

      NewsSearch.getTipKeys({word:word},(flag,result)=>{
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

})

/**
 * /news/favorite
 *  收藏新闻
 */
router.post('/favorite',function(req,res,next){
  
    var token=req.body.token;
    var newsId=req.body.news_id;
    if(token){
        var userId;
        jwt.verify(token.token, secret.tokenSecret, function (err, decode) {
                if (!err) {  //  时间失效的时候|伪造的token   
                    userId=decode.user.user_id
                    News.userFavorite({userId:userId,newsId:newsId},(flag,msg)=>{

                       if(!flag){
                            res.json({
                               status:-1,
                               msg:msg
                            })   

                       }else{
                           res.json({
                               status:0,
                               msg:"收藏成功"
                            })  

                       }
                    })

                 }else{

                   res.json({
                       status:-1,
                       msg:"登录凭证过期，请重新登录"
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
 * /news/unfavorite
 *  取消收藏新闻
 */
router.post('/unfavorite',function(req,res,next){
  
    var token=req.body.token;
    var newsId=req.body.news_id;
    if(token){
        var userId;
        jwt.verify(token.token, secret.tokenSecret, function (err, decode) {
                if (!err) {  //  时间失效的时候|伪造的token   
                    userId=decode.user.user_id
                    News.userUnFavorite({userId:userId,newsId:newsId},(flag,msg)=>{

                       if(!flag){
                            res.json({
                               status:-1,
                               msg:msg
                            })   

                       }else{
                           res.json({
                               status:0,
                               msg:"取消收藏成功"
                            })  

                       }
                    })
                 }else{
                     res.json({
                       status:-1,
                       msg:"登录凭证过期，请重新登录"
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


module.exports = router;
