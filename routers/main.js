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

//1.加载路由
var router=express.Router();

//2.处理请求
router.get("/",function (req,res) {
    res.render( "./index");
});



//2.处理请求
router.get("/article",function (req,res) {
    res.render( "./article");
});

//2.处理请求
router.get("/fullwidth",function (req,res) {
    res.render( "./fullwidth");
});
router.get("/img",function (req,res) {
    res.render( "./img");
});
router.get("/log",function (req,res) {
    res.render( "./log");
});


module.exports=router;