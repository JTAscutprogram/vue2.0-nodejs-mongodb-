var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require("ejs");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//捕获登录功能，做登录拦截
app.use(function(req,res,next){
  if(req.cookies.userId){    //如果已经登录coockie里有信息
     next();
  }else{
    if(req.originalUrl == '/users/login' || req.originalUrl == '/users/logout' || req.originalUrl.indexOf("/goods/list") > -1){
      next();
    }else{
      res.json({
        status:'10001',
        msg:'',
        result:''
      })
    }
  }
})
//这里定义一级路由
app.use('/', indexRouter);        //访问/访问index路由
app.use('/users', usersRouter);   //访问/user访问/user路由
app.use('/goods',goodsRouter);    //访问goods路由
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
