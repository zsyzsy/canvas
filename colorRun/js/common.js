/**
 * Created by Administrator on 15-10-30.
 */
function showDIV(id){
    document.getElementById(id).className="show";
}
function hideDIV(id){
    document.getElementById(id).className="hide";
}

//随机颜色
//生成随机数
function generateCode(num){
    return parseInt(Math.random()*num);
}
//生成随机颜色
function generateColor(){
    var colorStr = "";
    var colorCnt = 0;
    for(var i = 0;i < 3;i++){
        var rand = parseInt(Math.random()*175) + 10;
        if(i){
            colorStr += ",";
        }
        colorCnt += rand;
        colorStr += rand;
    }
    colorStr = "rgb("+colorStr+")";
    if(colorCnt > 280){
        return colorStr;
    }else{
        //递归调用
        return generateColor();
    }
}

//随机生成指定个数的颜色数组（颜色不能重复）
function generateColorArray(num){
    var ary = new Array();
    for(var i = 0;i < num;i++){
        var isSameColor = false;
        var tempColor = generateColor();
        for(var j = 0;j < i;j++){
            if(compareColor(tempColor,ary[j])){
                isSameColor = true;
                i--;
                break;
            }
        }
        if(!isSameColor){
            ary[i] = tempColor;
        }
    }
    return ary;
}
//从数组中获取一个颜色
function getColor(ary){
    return ary[generateCode(ary.length)];
}
//比较两个颜色是否相等
function compareColor(color1,color2){
    return color1.replace(/\s+/g,"") == color2.replace(/\s+/g,"");
}