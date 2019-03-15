const fetch = require('node-fetch');
const News=require('../db/news')
const nodejieba=require('nodejieba')

const URL='http://is.snssdk.com/api/news/feed/v51/?category=';
const tagNames=[
{'id': 'news_society', 'name': '社会'},
{'id': 'news_entertainment', 'name': '娱乐'},
{'id': 'news_tech', 'name': '科技'},
{'id': 'news_car', 'name': '汽车'},
{'id': 'news_sports', 'name': '体育'},
{'id': 'news_finance', 'name': '财经'},
{'id': 'news_military', 'name': '军事'},
{'id': 'news_world', 'name': '国际'}]; // 频道信息

/**
 * 从网上获取新闻数据
 *
 * @return {[type]} [description]
 */
async function fetchNews(){
      
      for(let i=0;i<tagNames.length;i++){
           var url=URL+tagNames[i].id;
           //获取网路数据
           var data=await fetchNetNews(url,i)
           //存进数据库
           if(typeof data=='object')
               await addNewsToDb(data)

      }

}    


function fetchNetNews(url,i){
    return new Promise((resolve, reject) => {
      fetch(url)
            .then((response) => {
                if (response.ok) {  //>=200 <300
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then((responseData) => {
                let newsArr = responseData.data; // 列表数据
                let newsList = [];
                for (let item of newsArr) {
                    // 获取内容数据
                    let content = item.content;
                    // 获取json内容
                    let newContent = JSON.parse(content);
                    newsList.push(newContent); // 添加到列表中
                }


                //尝试获取数据
                var newArr1=[];
                 newsList.forEach( function(element, index) {   
                     var {title,
                          url,
                          abstract,
                          source,
                          image_list
                         }=element;
                     newArr1.push(
                        {
                         news_category_id:tagNames[i].id, 
                         news_title:title,
                         news_url:url,
                         news_abstract:abstract,
                         news_content:abstract,
                         news_source:source,
                         news_image_list:image_list,
                     })
                 });
    
                resolve(newArr1);
                
            })
            .catch((error) => {
                reject(error.toString());
            })

     })       

}

function addNewsToDb(data){
    return new Promise((resolve, reject) => {
     var newsArr=[];
     data.forEach((item,index)=>{
           var {news_category_id,news_title,news_url,news_abstract,news_content,news_source,news_image_list}=item;
           newsArr[index]=[];
           newsArr[index][0]=news_category_id; 
           // 从网上获取的数据 producer_id=-1
           newsArr[index][1]=-1;
           newsArr[index][2]=news_title||"";
           newsArr[index][3]=news_url||"";
           newsArr[index][4]=news_abstract||"";
           newsArr[index][5]=news_content||"";
           newsArr[index][6]=news_source||"";
           newsArr[index][7]=JSON.stringify(news_image_list)||"";
           var res=nodejieba.extract(news_abstract+news_title, 10)
           var keys="";
           for(let i=0;i<res.length;i++){
                  keys+=res[i].word;
           } 
           newsArr[index][8]=keys
     })
     // console.log("newsArr:"+newsArr.length)
     News.add(newsArr, (flag) => {
         if(flag){
            resolve("insert ok")
         }else{
            reject("insert bad")
         }    
      })

   })
}


module.exports={
   fetchNews:fetchNews
}

   