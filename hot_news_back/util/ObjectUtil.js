var ObjectUtil={}

ObjectUtil.compareObjectArr=function(pro) { 
    return function (obj1, obj2) { 
        var val1 = obj1[pro]; 
        var val2 = obj2[pro]; 
        if (val1 < val2 ) { //正序
            return 1; 
        } else if (val1 > val2 ) { 
            return -1; 
        } else { 
            return 0; 
        } 
    } 
} 


module.exports=ObjectUtil;




