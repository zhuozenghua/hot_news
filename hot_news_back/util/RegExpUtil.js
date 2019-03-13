var RegExpUtil={}

/**
 *判断是否是手机号
 *三大运营商号码均可验证(不含卫星通信1349)
  截止2018-3
  中国电信号段
      133,149,153,173,177,180,181,189,199
  中国联通号段
      130,131,132,145,155,156,166,175,176,185,186
  中国移动号段
      134(0-8),135,136,137,138,139,147,150,151,152,157,158,159,178,182,183,184,187,188,198
  其他号段
      14号段以前为上网卡专属号段，如中国联通的是145，中国移动的是147等等。
      虚拟运营商
          电信：1700,1701,1702
          移动：1703,1705,1706
          联通：1704,1707,1708,1709,171
      卫星通信：148(移动) 1349
  */
RegExpUtil.isMobile=function(str){
     var patt=new RegExp("^[1](([3][0-9])|([4][5,7,9])|([5][4,6,9])|([6][6])|([7][3,5,6,7,8])|([8][0-9])|([9][8,9]))[0-9]{8}$");// 验证手机号
     return patt.test(str);
}

/**
 * 检测邮箱
 * @param str
 * @return
 */
RegExpUtil.isEmail=function(str) {
    var patt=new RegExp("^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$"); 
     return patt.test(str);
 }


/**
 *验证密码，6-10位数字字母下划线，且不能以下划线开口或结尾
 * @param str
 * @return
 */
RegExpUtil.isPasswordTrue=function(str) {

   var patt=new RegExp("^(?!_)(?!.*?_$)[a-zA-Z0-9_]{6,10}$");
    return patt.test(str);

}


// console.log(RegExpUtil.isMobile("14718286582"))
// console.log(RegExpUtil.isMobile("10018286582"))
// console.log(RegExpUtil.isMobile("1018286582"))
// console.log(RegExpUtil.isMobile("1018286582111"))
// console.log(RegExpUtil.isMobile("10182865d11"))
// console.log(RegExpUtil.isMobile("niu"))
// console.log('---')
// console.log(RegExpUtil.isPasswordTrue("147s_28"))
// console.log(RegExpUtil.isPasswordTrue("_nius_"))
// console.log(RegExpUtil.isPasswordTrue("10018286582"))
// console.log(RegExpUtil.isPasswordTrue("10016"))
// console.log(RegExpUtil.isPasswordTrue("_018286"))
// console.log(RegExpUtil.isPasswordTrue("dsfdsf_"))

module.exports=RegExpUtil;