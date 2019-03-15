const schedule = require('node-schedule');
const {fetchNews}=require('./fetchNews')
const {fetchVideo}=require('./fetchVideo')

/**
 * 从api中更新数据到数据库
 *
 * @return {[type]} [description]
 */
function scheduleJob(){
    //新闻和视频获取开始时间，时间间隔为5min
    let startNewsTime = new Date(Date.now());
    let startVideoTime = new Date(Date.now() + 1000*60);

    // var updateNewsDataSche = schedule.scheduleJob({start:startNewsTime,rule:'*/5  * * * *'}, function(){
        
    //     fetchNews().then(data=>{

    //     })
    //     .catch(e=>console.log(e.toString()));
        
    // });
    


    // var  updateVideoDataSche = schedule.scheduleJob({start:startVideoTime,rule:'*/5  * * * *'}, function(){
        
    //     fetchVideo().then(data=>{

    //     })
    //     .catch(e=>console.log(e.toString()));
        
    // });


    // setTimeout(function() {
    //     console.log('定时器取消')
    //   // 定时器取消
    //     updateNewsDataSche.cancel();   
    //     updateVideoDataSche.cancel();   
    // }, 1000*60*60*24);
    
}


module.exports={
    scheduleJob:scheduleJob
}

