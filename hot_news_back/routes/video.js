var express = require('express');
var router = express.Router();

/* GET users listing. */
/**
 *获取全部视频
 */
router.get('/', function(req, res, next) {
  var data = require('../mock/video_data.json');//要获取的json文件
  res.json({
     status:0,
     data:data
  });
});

module.exports = router;