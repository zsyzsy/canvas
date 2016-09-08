/**
 * Created by Administrator on 15-10-30.
 */
function start(){
    Player();
    document.getElementById("gold").innerHTML=this.gold;
    showDIV("game-tools")
}
function begin(){
    hideDIV("game-ready");
    hideDIV("game-tools");
    showDIV("game");
    document.getElementById("overGold").innerHTML=this.gold;
    document.getElementById("MyGrade").innerHTML=this.gold;
    initGame();
}
function storage(){
    hideDIV("game-ready");
    hideDIV("game-tools");
    hideDIV("die");
    if(document.getElementById("name").value){
        //alert(1);
        play.name=document.getElementById("name").value;
    }else{
        //alert(2);
        hideDIV("game-ready");
        hideDIV("game-tools");
        hideDIV("game");
        hideDIV("over");
        showDIV("die");
        return storage();
    }
    play.highest=document.getElementById("sum").innerHTML=play.reward+play.score;
    var players = getObject();
    players.push(play);
    console.log(JSON.stringify(players));
    localStorage.players = JSON.stringify(players);
    //显示数据
   players = getObject();
    players.sort(function (a,b) {
        return b.highest - a.highest;
    });
    console.log(players);
     html = "<table border='0'>";
     //+ "<tr><th>编号</th><th>姓名</th><th>分数</th></tr>";
    for (var i = 0; i < players.length; i++) {
        html += "<tr><td style='color: #005ea7;width: 100px;'>" + (i + 1) + "</td><td style='color: yellow;width: 150px;text-align: center;'>" + players[i].name  + "</td><td style='color: greenyellow;width: 100px;text-align: right;'>" + players[i].highest +"</td></tr>"
    }
    html += "</table>";
    document.getElementById("Info").innerHTML=html;
    html="";
    showDIV("over");
}
function getObject(){
    //首先从localStorage中获取数组，如果不存在则创建一个
    var players = localStorage.players;
    if(!players){
        players = [];
    }else{
        //字符串转换为json对象
        players = JSON.parse(players);
    }
    return players;
}
function homepage(){
    showDIV("game-ready");
    hideDIV("game");
    hideDIV("over");
    hideDIV("die");
    showDIV("game-tools")
}
//金钟罩
function protect(){
    //alert(this.gold);
    var gold=this.gold;
    //alert(this.gold);
    if(gold-200<0){
        alert(1);
    }else{
        document.getElementById("gold").innerHTML=gold-200;
        this.gold=document.getElementById("gold").innerHTML;
        document.getElementById("overGold").innerHTML=this.gold;
        document.getElementById("MyGrade").innerHTML=this.gold;
        document.getElementById("pop").className="pop-show";
        begin();
    }
}

//减速
function deceleration(){
    var gold=this.gold;
    if(gold-100==-100){
        alert(1);
    }else{
        document.getElementById("gold").innerHTML=gold-100;
        this.gold=document.getElementById("gold").innerHTML;
        document.getElementById("overGold").innerHTML=this.gold;
        document.getElementById("MyGrade").innerHTML=this.gold;
        shift=1;
        begin();
    }

}


//初始化游戏
function initGame(){
    document.getElementById("Info").innerHTML="";
    roleCanvas.drawImage(gameStartImg,350,250);
    var bgRole=new BgRole(); //获取生成的背景颜色
    //执行绘制方法
    bgRole.draw(); //调用绘制背景的高度
    initBullet(generateColorArray(5));//每次生成5个不同的颜色
    setTimeout(function(){

        cnt=0;

        gameRun();
    },3000);
}
//游戏运行
function gameRun(){
    rnuId=setInterval(function(){
        roleCanvas.clearRect(0,0,1000,600);//消除之前绘制的图形（解决拖影问题）
        cnt++; //分数
        if(cnt%10==0){
            play.score=cnt;
            document.getElementById("grade").innerHTML=play.score;
        }
            jishu=setInterval(function(){
                play.reward+=10;  //奖励
            },1000);
        roleCanvas.fillText(cnt,500,20);
        //document.getElementById("grade").innerHTML=cnt;
        if(bulleRole){//当子弹产生出来时，则每10毫秒绘制一次子弹
            bulleRole.BulletDraw();
        }
        if(!figureRole){
            //figureRole=new FigureRole1();
            //figureRole=new FigureRole2();
            //figureRole=new FigureRole3();
            figureRole=new figureRoleAry[generateCode(figureRoleAry.length)]
        }
        if(cleanFigure()){
            gameOver();
            return;
        }
        if(figureRole.x<100){
            if(play.jzz){
                play.jzz=0;
                document.getElementById("pop").className="pop-hide";
            }else{
                gameOver();
            }figureRole=null;
            //gameOver();
            //figureRole=null;
        }else{
            figureRole.draw();
        }
    },10); //每10毫秒绘制100贞(即100张图片)
}

//游戏结束
function gameOver(){
    clearInterval(rnuId);
    clearInterval(jishu);
    document.getElementById("reward").innerHTML=play.reward;
    play.highest=document.getElementById("sum").innerHTML=play.reward+play.score;
    roleCanvas.drawImage(gameOverImg,350,250);//游戏结束时，弹出图片的位置
    setTimeout(function(){
        hideDIV("game");
        showDIV("die")
    },500);
    figureRole=null;
    bulleRole=null;
}
//检测碰撞,返回true表示已碰撞，false表示没有碰撞
function checkImpact(){
    if(!bulleRole||!figureRole){
        return false;
    }
    //两点之间的距离公式:((x1-x2的平方)+(y1-y2的平方))再开平方
    var distance=Math.sqrt(Math.pow(bulleRole.x-figureRole.x,2)+Math.pow(bulleRole.y-figureRole.y,2));
    if(distance<=bulleRole.radius){
        return true;
    }
    return false;
}
//判断消除方块或者结束游戏(gameOver)
function cleanFigure(){
    var isOver=true; //如果为true就结束
    if(checkImpact()&&!bulleRole.isClean){ //如果子弹和图形碰撞到了
        //判断子弹颜色是否和图形中的某个颜色相等
        for(var i=0; i<figureRole.colorAry.length;i++){
            if(compareColor(bulleRole.color,figureRole.colorAry[i])){
                figureRole.state[i]=0;
                isOver=false;
                bulleRole.isClean=true;
            }
        }
    }else {
        isOver=false;
    }
    return isOver;
}


//发射子弹
function sendBullet(obj){
    if(!bulleRole){
    bulleRole=new BulletRole();
    bulleRole.color=obj.style.backgroundColor;
    }
}
//初始化子弹标签
function initBullet(colorAry){
    var lis="";
    for(var i=0;i<colorAry.length;i++){
        lis+="<li style='background:"+colorAry[i]+"' onclick='sendBullet(this)'></li>"
    }
    document.getElementById("bullet").innerHTML=lis;
}