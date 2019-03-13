var express = require('express');
var router = express.Router();
var Video =require('../db/video')

/**
 * /video
 *获取全部视频
 */
router.get('/', function(req, res, next) {
  //var data = require('../mock/video_data.json');//要获取的json文件
 Video.getVideoByCategory({},(flag,result)=>{
     if(flag){
         res.json({
            status:0,
            data:result
         })
     }else{
       res.json({
         status:-1,
         msg:'获取视频数据出错！'
        });
     }
 })

});

module.exports = router;