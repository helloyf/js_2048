var express = require('express');  
var bodyParser = require('body-parser');
var app = express();  //创建express的实例


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var mysql = require('mysql'); 

app.use(require('cors')());

var connection = mysql.createConnection({      //创建mysql实例
    host:'127.0.0.1',
    port:'3306',
    user:'root',
    password:'123456',
    database:'myserver'
});
connection.connect();

var sql;
var str = " ";

app.get('/',function (req,res) {
    sql = 'SELECT * FROM game';
    connection.query(sql, function (err,result) {
        if(err){
            console.log('[SELECT ERROR]:',err.message);
        }
        console.log(result);
        str = JSON.stringify(result);
        //数据库查询的数据保存在result中，但浏览器并不能直接读取result中的结果，因此需要用JSON进行解析
           //数据库查询结果返回到result中
        //console.log(str);
    });
    res.send(str);  //服务器响应请求
});

app.get('/hello', function(req, res){
    res.send('Hello,myServer'); //服务器响应请求
});

app.post('/login',function(req,res){

    console.log(req.body.username);
    console.log(req.body.password);
    var username = req.body.username;
    var password = req.body.password;
    sql = "select * from game where username = '"+username+"'";
    connection.query(sql, function (err,result) {
        if(err){
            console.log('[SELECT ERROR]:',err.message);
            res.send('登录失败: '+err);
        }
        else{
            console.log(result);
            
            if(result == ''){
                res.send('null');
            }
           
            else if(password == result[0].password){
                res.send('success');
            }
            else{
                res.send('f');
            }
            
        }
        
    });
});

app.post('/register',function(req,res){
    
    console.log(req.body.nusername);
    console.log(req.body.npassword);
    var nusername = req.body.nusername;
    var npassword = req.body.npassword;
    sql = "insert into game(username,password) values('"+nusername+"','"+npassword+"')";
    connection.query(sql, function (err,result) {
        if(err){
            console.log('[SELECT ERROR]:',err.message);
            res.send('注册失败: '+err);
        }
        else{
            res.send('success');
        }
        
    });
});

app.post('/upload',function(req,res){
    console.log(req.body.username);
    console.log(req.body.grade);
    var username = req.body.username;
	var grade = req.body.grade;
	sql = "update game set username='"+username+"',grade='"+grade+"'";
	connection.query(sql, function (err,result) {
        if(err){
            console.log('[SELECT ERROR]:',err.message);
            res.send('传送失败: '+err);
        }
        else{
            res.send('success');
        }
        
    });
});

app.post('/battle',function(req,res){
	
	sql = "select * from game order by grade";
	 connection.query(sql, function (err,result) {
        if(err){
            console.log('[SELECT ERROR]:',err.message);
        }
       	res.send(result);
    });

})


app.listen(3001,function(){   //监听3001端口
    console.log("Server running at 3001 port");
});