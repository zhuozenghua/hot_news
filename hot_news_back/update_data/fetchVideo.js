const fetch = require('node-fetch');
const Video=require('../db/video')
const {getVideoList}=require('./videoAction')

const URL='http://is.snssdk.com/api/news/feed/v51/?category=video';

/**
 * 从网上获取视频数据
 *
 */
async function fetchVideo(){
      
           //获取网路数据
           var data=await fetchNetVideo(URL)
           //存进数据库
           addVideosToDb(data)
           // console.log(data.length)
           // return data
}    


function fetchNetVideo(url){
    return new Promise((resolve, reject) => {
      getVideoList(url)
            .then((videoList) => {

                  //尝试获取数据
                  var newArr=[];
                   videoList.forEach( function(element, index) {   
                       var {title,
                           video_id,
                           video_url,
                           video_duration,
                           middle_image,
                           tag,
                           }=element;
                       newArr.push(
                          {title:title,
                           video_id:video_id,
                           video_url:video_url,
                           video_duration:video_duration,
                           middle_image:middle_image,
                           tag:tag,
                           })
                   });
         
                 resolve(newArr)
            })
            .catch((error) => {
                 reject(error.toString());
            })

     })       

}

function addVideosToDb(data){
    return new Promise((resolve, reject) => {
     var videoArr=[];
     data.forEach((item,index)=>{
           var {video_id,title,video_url,video_duration,middle_image,tag}=item;
           videoArr[index]=[];
           videoArr[index][0]=video_id; 
           // 从网上获取的数据 producer_id=-1
           videoArr[index][1]=title||"";
           videoArr[index][2]=video_url||"";
           videoArr[index][3]=video_duration||"";
           videoArr[index][4]=JSON.stringify(middle_image)||"";
           videoArr[index][5]=tag
     })
         Video.add(videoArr, (flag) => {
         if(flag){
            resolve("insert ok")
         }else{
            reject("insert bad")
         }    
      })

   })
}


module.exports={
   fetchVideo:fetchVideo
}

   