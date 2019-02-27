var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var secret=require('../config/secret');
// var secret = fs.readFileSync('secret');
var Users = require('../db/users');
var RegExpUtil=require('../util/RegExpUtil')


/**
 * /
 * 首页-没用
 * 
 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/**
 * /checkLogin
 * 检查登录状态（token是否有效 ）
 * 
 */
router.post('/check_login', function(req, res, next) {
      
      //从body中获取token
      var token=req.body.token;
      jwt.verify(token, secret.tokenSecret, function (err, decode) {
               if (err) {  //  时间失效的时候|伪造的token   
                    res.json({
                       status:-1,
                       msg:"登录凭证过期，请重新登录"
                    })                 
                } else {
                    //console.log(decode.user)
                    res.json({
                       status:0,
                       msg:"登录凭证有效"
                    })    
                }
       })
});

/**
 * /sign_in
 * 登录
 */
router.post('/sign_in', (req, res, next) => {

   var param={
    phone:req.body.phone,
    password:req.body.password
   }


  if(!param.phone||!param.password){
          res.json({
            status: -1,
            msg: "用户名或密码不能为空"
          })
          return true;
   }

   if(!RegExpUtil.isMobile(param.phone)){
           res.json({
            status: -1,
            msg: "请输入正确的手机号"
          })
           return true;
   }
   if(!RegExpUtil.isPasswordTrue(param.password)){
          res.json({
            status: -1,
            msg: "密码格式错误"
          })
          return true;
   }

    Users.getOneByPassword(param, (result) => {
        if(result.length == 0){
            res.json({
                status: -1,
                msg: "用户名或密码错误"
            })
        }else{
            //生成token
            //result是一个数组
            var payload = {
                user : result[0]
            }
            var token = jwt.sign(payload, secret.tokenSecret, {expiresIn:'600s'});

             res.json({
                 status:0,
                 msg:'登录成功',
                 data:{
                     token:token,
                     user : result[0]
                 }
             });
        }
    })
});

/**
 * /sign_up
 * 注册
 */
router.post('/sign_up',(req,res,next)=>{

   var param={
    phone:req.body.phone,
    password:req.body.password
   }

  if(!param.phone||!param.password){
          res.json({
            status: -1,
            msg: "用户名或密码不能为空"
          })
          return true;
   }

   if(!RegExpUtil.isMobile(param.phone)){
           res.json({
            status: -1,
            msg: "请输入正确的手机号"
          })
           return true;
   }
   if(!RegExpUtil.isPasswordTrue(param.password)){
          res.json({
            status: -1,
            msg: "密码格式错误"
          })
          return true;
   }

   Users.add(param,(result)=>{
        if(result){
           res.json({
              status:0,
              msg:"注册成功"
           })
        }else{
           res.json({
              status:-1,
              msg:"注册失败"
           })  
        }
   })

})

module.exports = router;
