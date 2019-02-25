/**
 * 全局导航控制类
 */
export default class NavigationUtil{
   /**
    * [goPage 调转到指定页面]
    *
    * @param  {[type]} params [description]
    * @param  {[type]} page   [description]
    * @return {[type]}        [description]
    */
   static goPage(params,page){
      const navigation=NavigationUtil.navigation;
      if(!navigation){
         console.log('navigation can not be null');
         return ;
      }

      navigation.navigate(page,{...params})
   }

   /**
    * [goBack 返回上一页]
    *
    * @param  {[type]} navigation [description]
    * @return {[type]}            [description]
    */
   static goBack(navigation){
      navigation.goBack();
   }
   
   /**
    * [resetToHomePage 重置到HomePage]
    *
    * @param  {[type]} params [description]
    * @return {[type]}        [description]
    */
   static resetToHomePage(params){
       const {navigation}=params;
       navigation.navigate('Main');
   }
}