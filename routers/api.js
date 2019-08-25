/**
 * Created by ASUS on 2018/8/27.
 */
var express=require('express');
var mysql=require("mysql");

var pool=mysql.createPool({     //数据连接池
    host:'127.0.0.1',
    port:3306,
    database:'blog',
    user:'root',
    password:'a'
});

//路由操作
//1.加载路由
var router=express.Router();
//2.处理请求   统一返回格式
var resData;
router.use(function (req,res,next) {
    resData={
        code:-1,
        message:""
    };
    next();
});

//注册
router.post("/user/register",function (req,res,next) {
    var uname=req.body.username;
    var pwd=req.body.password;
    pool.getConnection(function (err,conn) {
        if(err){
            console.log(err);
            resData.code=0;
            resData.message="网络连接失败，请稍后重试";
            res.json(resData);
        }else{
            conn.query("select * from user where uname=?",[uname],function (err,result) {
                if(err){
                    console.log(err);
                    resData.code=0;
                    resData.message="网络连接失败，请稍后重试";
                    res.json(resData);
                }else if(result.length>0){
                    resData.code=1;
                    resData.message="该用户已经注册过了";
                    res.json(resData);
                }else{
                    conn.query("insert into user values(null,?,?,0)",[uname,pwd],function (err,result) {
                        conn.release();
                        if(err){
                            console.log(err);
                            resData.code=0;
                            resData.message="网络连接失败，请稍后重试";
                            res.json(resData);
                        }else{
                            resData.code=2;
                            resData.message="注册成功";
                            res.json(resData);
                        }
                    });
                }
            });
        }
    })
});

//登录
router.post("/user/login",function (req,res,next) {
    var uname=req.body.username;
    var pwd=req.body.password;
    pool.getConnection(function (err,conn) {
        if(err){
            resData.code=0;
            resData.message="网络连接失败，请稍后重试";
            res.json(resData);
        }else{
            conn.query("select * from user where uname=? and pwd=?",[uname,pwd],function (err,result) {
                if(err){
                    resData.code=0;
                    resData.message="网络连接失败，请稍后重试";
                    res.json(resData);
                }else if(result.length<=0){
                    resData.code=1;
                    resData.message="用户名或密码错误，请验证后重试";
                    res.json(resData);
                }else{
                    resData.code=2;
                    resData.message="登录成功";
                    resData.info=result[0];     //传输到前台，好获取用户名

                    //将登录的用户存到session里面  不能写在res.json后面
                    req.session.userInfo=result[0];

                    res.json(resData);
                }
            })
        }
    })
});

//3.将这个支线模板加载到主模板上
module.exports=router;