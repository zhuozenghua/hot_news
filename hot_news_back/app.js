var express = require('express');
var session = require('express-session')
var path = require('path');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var videoRouter = require('./routes/video');
var newsRouter = require('./routes/news');
var addRouter = require('./routes/add_data');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/u', usersRouter);
app.use('/video', videoRouter);
app.use('/news', newsRouter);
app.use('/add', addRouter);

module.exports = app;
