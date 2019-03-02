var express = require('express');
var router = express.Router();
var News=require('../db/news')
var jwt = require('jsonwebtoken');
var secret=require('../config/secret');

//搬运数据

/**
 * /add/news_data
 *  往数据库插入新闻数据
 */
router.get('/news_data', function(req, res, next) {
     //var data = require('../mock/news_society.json');//要获取的json文件
     // var data = require('../mock/news_entertainment.json');//要获取的json文件
     // var data = require('../mock/news_tech.json');//要获取的json文件
     // var data = require('../mock/news_car.json');//要获取的json文件
     // var data = require('../mock/news_sports.json');//要获取的json文件
     // var data = require('../mock/news_finance.json');//要获取的json文件
     // var data = require('../mock/news_military.json');//要获取的json文件
     var data = require('../mock/news_world.json');//要获取的json文件
     var newsArr=[];
     data.forEach((item,index)=>{
           var {news_category_id,news_title,news_url,news_abstract,news_content,news_source,news_image_list}=item;
           newsArr[index]=[];
           newsArr[index][0]=news_category_id; 
           // newsArr[index][1]=1;
           // newsArr[index][1]=2;
           // newsArr[index][1]=3;
           // newsArr[index][1]=4;
           // newsArr[index][1]=5;
           // newsArr[index][1]=6;
           // newsArr[index][1]=7;
           newsArr[index][1]=8;
           newsArr[index][2]=news_title||"";
           newsArr[index][3]=news_url||"";
           newsArr[index][4]=news_abstract||"";
           newsArr[index][5]=news_content||"";
           newsArr[index][6]=news_source||"";
           newsArr[index][7]=JSON.stringify(news_image_list)||"";
     })

   // console.log(newsArr[0])
     News.add(newsArr, (flag) => {
         if(flag){
            res.send("insert ok")
         }else{
            res.send("insert bad")
         }
        
      })
 
});



module.exports = router;
