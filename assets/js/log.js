//注册的时候 用户名失去焦点验证
function checkInfo(obj,tabname,colname) {
    //先得到用户名
    var info=obj.value;
    console.log(info);
    //现在应该发送请求给服务器  判断这个用户名是否存在
    $.get("checkUserName",{uname:info},function (data) {
        //现在请求已经发了
        if(data=="0"){
            alert("用户名不能为空");
        }else if(data=="1"){
            alert("用户名已经存在");
        }else if(data=="2"){

        }
    });
}

//用户注册
function userzc() {
    //先得到值
    var uname=$("#zcuname").val();
    var pwd=$("#zcpwd").val();
    var repwd=$("#zcpwdagain").val();
    //首先 判断值是否正确  密码长度不小于6位  并且重复密码要相等
    if(pwd.length<6||pwd!=repwd){
        alert("条件不满足");
    }else{
        //如果条件满足 则发送ajax请求
        //请求地址随便写  参数 上面的西安叔  回调
        //在服务器端监听这个请求 然后插入数据库  相应数据/
        //客户端 拿到服务器的响应的数据  然后来判断结果
        $.post("userRegister",{uname:uname,pwd:pwd},function (data) {
            if(data=="0"){
                alert("注册失败");
            }else if(data=="1"){
                //注册成功
                hidenzcpage();
                showLogin();
            }
        });
    }

}
//用户登录
function userlogin() {
    //首先得到数据
    var uname=$("#uname").val();
    var pwd=$("#pwd").val();
    if(uname=="" || pwd=="" || uname==null||pwd==null){
        alert("用户民个或者密码不能为空");
        return;//如果不写这个就要写else
    }
    //发请求
    $.post("userLogin",{uname:uname,pwd:pwd},function (data) {
        if(data=="0"){
            alert("用户名或者密码错误，请验证后重新登陆");
        }else if(data=="1"){
            //隐藏登陆框
            hidenloginpage();
            var str='尊敬的VIP你好:<a href="">['+uname+']</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
                '<a href="javascript:userOutLogin()">注销</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="./back/goods.html">后台管理</a>';
            $("header").html(str);
        }
    });
}
//注销
function userOutLogin() {

}

//打开登陆窗口
function showLogin() {
    $("#uname").val("");
    $("#pwd").val("");
    $("#loginpages").mywin({left:"center",top:"center"});
    $("#zcpages").hide();
    $(".bg").fadeIn("200","linear");

}

//关闭层
function hidenloginpage() {
    $("#loginpages").hide();

}

//打开注册窗口
function showRegister() {
    $("#login").css({display:"block"});
    $("#zcuname").val("");
    $("#zcpwd").val("");
    $("#zcpwdagain").val("");
    $("#zcpages").mywin({left:"center",top:"center"});
    $("#loginpages").css({display:"none"});
    $("#registertishi").html("");


}

//关闭注册窗口
function hidenzcpage() {
    $("#login").hide();

}