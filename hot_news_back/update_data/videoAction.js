const fetch = require('node-fetch');
var {Base64, crc32}= require("../util/Encrypt.js");

//获取视频列表
function getVideoList(url) {
    return new Promise((resolve, reject) => {
        // let api = `http://is.snssdk.com/api/news/feed/v51/?category=video`;
        fetch(url)
            .then((response) => response.json())
            .then((json) => {
                if (json.message === 'success') { // 数据请求成功
                    let videoArr = [];

                    let newsArr = json.data; // 列表数据
                    for (let item of newsArr) {
                        // 获取内容数据
                        let content = item.content;
                        // 获取json内容
                        let json = JSON.parse(content);

                        // 添加到视频列表中
                        if (json.url) {
                            let videoID = json.video_id; // 视频id
                            // 获取视频url
                            getVideoUrl(videoID)
                                .then((data) => {
                                    json.video_url = data;
                                    videoArr.push(json)
                                }).catch((e) => {
                                    console.log(e.toString());
                            });

                        }

                    }
                    // 延迟操作处理
                    setTimeout(() => {
                        resolve(videoArr);
                    }, 1000);
                } else {
                     console.log(json.status);
                }

            })
            .catch((e) => {
                console.log(e.toString());
            })
    })
}


// 获取视频内容数据
function getVideoUrl(videoID) {

    const url=getVideoContentApi(videoID);
    return new Promise((resolve, reject) => {
        fetch(url) // 根据视频ID,获取视频内容
            .then((response) => response.json())
            .then((json) => {
                if (json.message === 'success') { // 数据请求成功
                    let newsArr = json.data; // 数据
                    let main_url = newsArr.video_list.video_1.main_url; // base64位编码的url

                    // let decodedData = window.atob(main_url); // 需要浏览器支持
                    let decodedData = new Base64().decode(main_url);
                    resolve(decodedData);
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}



/**
 * 根据视频ID,获取视频内容的具体信息
 * @param videoID
 * @return http://ib.365yg.com/video/urls/v/1/toutiao/mp4/视频ID?r=16位随机数&s=加密结果
 *
 */
function getVideoContentApi(videoID) {
    // 获取16位的随机数
    let getRandom = function () {
        let result = '';
        for (let i = 0; i < 16; i++) {
            let c = Math.floor(Math.random() * 10);
            result += c;
        }
        return result.toString();
    };

    let VIDEO_HOST = "http://ib.365yg.com"; // host
    let video_url = `/video/urls/v/1/toutiao/mp4/${videoID}?r=${getRandom()}`; // 原始字符串
    let crcString = crc32(video_url); // 对原始字符串进行crc32加密
    // 获取详细的url链接数据
    let url = VIDEO_HOST + video_url + "&s=" + crcString;
    return url;
}




module.exports={
   getVideoList:getVideoList
}