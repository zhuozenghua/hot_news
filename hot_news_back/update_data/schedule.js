const schedule = require('node-schedule');
const fetch=require('./fetchNews')

function scheduleJob(){

    const updateDataSche = schedule.scheduleJob('30 * * * * *', function(){
        
        fetch.fetchNews().then(data=>{

        })
        .catch(e=>console.log(e.toString()));
        
    });

    setTimeout(function() {
        console.log('定时器取消')
      // 定时器取消
        updateDataSche.cancel();   
    }, 1000*60*60*24);
    
}


module.exports={
    scheduleJob:scheduleJob
}

