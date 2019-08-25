/**
 * Created by Administrator on 17-3-4.
 */
var express=require('express');
var bodyParser=require("body-parser");
var cookieParser=require("cookie-parser");
var session=require('express-session'); //session（会话）模块  必须引入body-parser
var mysql=require("mysql"); //数据库模块
var fs=require('fs'); //文件操作
var swig=require("swig");  //引入模板引擎   不用再字符串拼接

var app=express(); //创建web应用程序

//配置express-session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000*60*60 }    //最大寻在时间是60秒
}));


//配置swig
app.engine("html",swig.renderFile);    //模板引擎名称   用s来强调后缀名   解析模板引擎的方法
app.set("views","./view");     //模板引擎位置    第一个参数固定，指设置模板引擎的页面
app.set("view engine","html");     //注册引擎   可以开始使用了
swig.setDefaults({coach:false});     //关闭缓存

app.use("/assets",express.static(__dirname + "/assets"));
app.use(bodyParser.urlencoded({extended: true}));

var pool=mysql.createPool({     //数据连接池
    host:'127.0.0.1',
    port:3306,
    database:'goods',
    user:'root',
    password:'a'
});



//路由：由于把所有的业务请求写在一个server.js中，比较难找
//所以，把类似功能的放在一个模块里，然后让这个模块搭建到主模块里
app.use("/",require("./routers/main"));     //所有主模块
//app.use("/admin",require("./routers/admin"));    //所有后台模块
//app.use("/api",require("./routers/api"));   //所以前台逻辑模块


//启动服务器
app.listen(80,"127.0.0.1",function(err){
    if(err){
        console.log(err);
    }else{
        console.log("服务器启动成功");
    }
});


//监听请求
app.get("/checkUserName",function (req,res) {
    //得到客户端传来的参数    get请求用query获取
    var uname=req.query.uname;
    if( uname=="" ){
        res.send("0");
    }else{
        pool.getConnection(function (err,conn) {
            conn.query("select * from admininfo where aname=?",[uname],function (err,result) {
                //释放链接
                console.log(result);
                conn.release();
                if(result.length>0){
                    res.send("1");   //该用户名已经存在
                }else{
                    res.send("2");   //该用户名不存在
                }
            });
        });
    }
});

//注册账号
app.post("/userRegister",function (req,res) {
    pool.getConnection(function (err,conn) {
        //插入数据                                          其他请求用body来获取
        conn.query("insert into admininfo values(0,?,?)",[req.body.uname,req.body.pwd],function (err,result) {
            //释放链接
            conn.release();
            if(err){
                console.log(err);
                res.send("0");   //0代表错误
            }else{
                res.send("1");
            }
        })
    })
});

//用户登陆
app.post("/userLogin",function (req,res) {
    pool.getConnection(function (err,conn) {
        conn.query("select * from admininfo where aname=? and pwd=?",[req.body.uname,req.body.pwd],function (err,result) {
            //释放链接
            conn.release();
            if(err||result.length<=0){
                console.log(err);
                res.send("0");   //0代表登陆失败
            }else{
                res.send("1");
            }
        });
    })
});


