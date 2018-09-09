var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


/*
*路由
*/
//朝代
var dynasty1Router = require('./routes/dynasty/1');//帝王纪年
var dynasty2Router = require('./routes/dynasty/2');//公元纪年
var dynasty3Router = require('./routes/dynasty/3');//朝代名称
//诗词
var poem1Router = require('./routes/poem/1');//按作者查询
var poem2Router = require('./routes/poem/2');//按标题查询
var poem3Router = require('./routes/poem/3');//按诗句查询
var poem4Router = require('./routes/poem/4');//对仗查询
//地点
var place1Router = require('./routes/place/1');//地点
//人物
var characters1Router = require('./routes/character/1');//姓名
var characters2Router = require('./routes/character/2');//id
//作品
var works1Router = require('./routes/work/1');//
var works2Router = require('./routes/work/2');//
var works3Router = require('./routes/work/3');//
var works4Router = require('./routes/work/4');//
var works5Router = require('./routes/work/5');//
var works6Router = require('./routes/work/6');//





var app = express();

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/*
*路由
*/
//dynasty
app.use('/dynasty/1', dynasty1Router);//帝王纪年
app.use('/dynasty/2', dynasty2Router);//公元纪年
app.use('/dynasty/3', dynasty3Router);//朝代名称
//poem
app.use('/poem/1', poem1Router);//按作者查询
app.use('/poem/2', poem2Router);//按标题查询
app.use('/poem/3', poem3Router);//按诗句查询
app.use('/poem/4', poem4Router);//对仗查询
//place
app.use('/place/1', place1Router);//地点
//character
app.use('/character/1', characters1Router);//人物姓名查找
app.use('/character/2', characters2Router);//人物ID查找
//work
app.use('/work/1', works1Router);//作品1
app.use('/work/2', works2Router);//作品2
app.use('/work/3', works3Router);//作品3
app.use('/work/4', works4Router);//作品4
app.use('/work/5', works5Router);//作品5
app.use('/work/6', works6Router);//作品6


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
