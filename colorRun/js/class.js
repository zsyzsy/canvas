/**
 * Created by Administrator on 15-10-30.
 */
//获取画布
var bgCanvas=document.getElementById("bjCanvas").getContext("2d");
var roleCanvas=document.getElementById("roleCanvas").getContext("2d");
var bulleRole;  //子弹全局变量
var figureRole;//图形全局变量
var shift=5;//图形移动2个像素全局变量
var figureRoleAry=[FigureRole1,FigureRole2,FigureRole3];//定义数组,存放每一个图形
var rnuId; //清除定时器的变量
var cnt=0; //分数变量
var jishu;
var reward;
var html="";
var gameOverImg=new Image();
gameOverImg.src="./images/gameover.png";
var gameStartImg=new Image();
gameStartImg.src="./images/aa.gif";
/*背景角色*/
function BgRole(){
    //背景起始坐标
    this.x=0;
    this.y=0;
    this.width=1000;
    this.height=600;
    this.color=generateColor();
    //绘制的方法
    this.draw=function(){
        bgCanvas.fillStyle=this.color;
        bgCanvas.fillRect(this.x,this.y,this.width,this.height);

    }
}

//子弹角色
function BulletRole(){
    this.x=80;
    this.y=280;
    this.radius=0;//圆子弹的半径
    this.color;
    this.isClean;
    this.BulletDraw=function(){
        bgCanvas.beginPath();
        bgCanvas.fillStyle=this.color;
        bgCanvas.arc(this.x,this.y,this.radius,0,Math.PI*2);
        bgCanvas.closePath();
        bgCanvas.fill();
        this.radius+=1000;//每10毫秒半径加15
        //当子弹超出所设定的边界，就消除子弹
        if(this.radius>1000){  //实现子弹自我消除的功能
            bulleRole=null;
        }
    }
}
var play=new Player();
//玩家角色
function Player(){
    //名字
    this.name="不取名字的二逼";
    this.gold=800;//金币
    this.score=0;//分数
    this.clearColor=0; //消除颜色
    this.highest=0;
    this.reward=0; //奖励
    //是否购买了金钟罩(0表示没有，1表示有)
    this.jzz=1;
    //是否减速(0表示没有，1表示有)
    this.slow=0;
    //设定坐标
    this.x=50;
    this.y=150;
}

//图形对象的父类
function BaseFigureRole(){
    this.x=1000;
    this.y=250;
    //每个图形的状态
    this.state;
    //每个图形的颜色数组
    this.colorAry;
    //产生图形的颜色，并且同时产生子弹标签的颜色
    this.initColorAry=function(num){
        //根据参数产生对应个数的数组
        var ary=generateColorArray(num);
        //子弹和图形的颜色
        initBullet(ary);
        //this.colorAry=ary;
        this.colorAry=[];
        for(var i=0;i<num;i++){
            this.colorAry[i]=getColor(ary);
        }
    }
    
}
//图形1
FigureRole1.prototype=new BaseFigureRole();
FigureRole1.prototype.constructor=FigureRole1;
//图形1的对象
function FigureRole1(){
    roleCanvas.save();
    //1默认为要绘制，0为部进行绘制
    this.state=[1,1];//各个小图形的状态
    this.initColorAry(2);
    //this.colorAry=generateColorArray(2);
    this.draw=function(){
        //绘制的第一个小图形
        this.draw1=function(){
            roleCanvas.beginPath();
            roleCanvas.fillStyle=this.colorAry[0];
            roleCanvas.arc(this.x,this.y,100,0,Math.PI*2);
            roleCanvas.closePath();
            roleCanvas.fill();
        };
        //绘制的第二个小图形
        this.draw2=function(){
            roleCanvas.fillStyle=this.colorAry[1];
            roleCanvas.fillRect(this.x,this.y+100,100,150);
        };

        if(!this.state[0]&&!this.state[1]){ //如果state状态都为0，就把图形设为空(即消失)
            figureRole=null;
        }
        //如果第一个小图形为1，就进行绘制
        if(this.state[0]){
            this.draw1();
        }
        if(this.state[1]){
            this.draw2();
        }
        roleCanvas.restore();

        this.x-=shift;//图形左移动
    }
}
//图形2
FigureRole2.prototype=new BaseFigureRole();
FigureRole2.prototype.constructor=FigureRole2;
//图形2的对象
function FigureRole2(){
    this.state=[1,1];
    this.initColorAry(2);
    this.draw=function(){
        roleCanvas.save();
        roleCanvas.translate(this.x,this.y);
        //绘制的第一个小图形
        this.draw1=function(){
            roleCanvas.beginPath();
            roleCanvas.fillStyle=this.colorAry[0];
            roleCanvas.moveTo(0,0);
            roleCanvas.lineTo(10,5);
            roleCanvas.quadraticCurveTo(60,-30,110,5);
            roleCanvas.lineTo(120,0);
            roleCanvas.lineTo(130,25);
            roleCanvas.lineTo(-10,25);
            //roleCanvas.closePath();
            roleCanvas.fill();
        };
        //绘制的第二个小图形
        this.draw2=function(){
            roleCanvas.fillStyle=this.colorAry[1];
            roleCanvas.fillRect(10,25,100,150);
        };

        if(!this.state[0]&&!this.state[1]){ //如果都为0，就把图形设为空
            figureRole=null;
        }
        //如果第一个图形为1，就进行绘制
        if(this.state[0]){
            this.draw1();
        }
        if(this.state[1]){
            this.draw2();
        }
        roleCanvas.restore();

        this.x-=shift;//图形左移动
    }
}
//图形3
FigureRole3.prototype=new BaseFigureRole();
FigureRole3.prototype.constructor=FigureRole3;
//图形3的对象
function FigureRole3(){
    this.state=[1,1,1];
    this.initColorAry(3);
    this.draw=function(){
        roleCanvas.save();
        roleCanvas.translate(this.x,this.y);
        this.draw1=function(){
            //绘制的第一个小图形
            roleCanvas.beginPath();
            roleCanvas.fillStyle=this.colorAry[0];
            roleCanvas.moveTo(100,10);
            roleCanvas.lineTo(40,60);
            roleCanvas.lineTo(160,60);
            roleCanvas.closePath();
            roleCanvas.fill();
        };
        //绘制的第二个小图形
        this.draw2=function(){
            roleCanvas.fillStyle=this.colorAry[1];
            roleCanvas.beginPath();
            roleCanvas.moveTo(70,60);
            roleCanvas.lineTo(10,110);
            roleCanvas.lineTo(190,110);
            roleCanvas.lineTo(130,60);
            roleCanvas.fill();
        };
        //绘制的第三个小图形
        this.draw3=function(){
            roleCanvas.fillStyle=this.colorAry[2];
            roleCanvas.fillRect(70,110,60,100);
        };

        if(!this.state[0]&&!this.state[1]&&!this.state[2]){ //如果都为0，就把图形设为空
            figureRole=null;
        }
        //如果第一个图形为1，就进行绘制
        if(this.state[0]){
            this.draw1();
        }
        if(this.state[1]){
            this.draw2();
        }
        if(this.state[1]){
            this.draw3();
        }
        roleCanvas.restore();
        this.x-=shift;//图形左移动
    }
}