var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var redis = require('ioredis');

var index = require('./controllers/index');
var posts = require('./controllers/posts');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html',require('ejs').renderFile);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));

// connect to redis db
var db = new redis({
  port: 14559,
  host: 'redis-14559.c10.us-east-1-2.ec2.cloud.redislabs.com',
  //password: 'auth'
});

// db.flushall();
// var fs = require('fs');
// var obj = JSON.parse(fs.readFileSync('models/data.json', 'utf8'));
// //console.log(obj.posts);
// var id = [];
// for(var i = 0; i < obj.posts.length; i++) {
//   var post = obj.posts[i];
//   id.push(post.id);
//   if(post.type=='video'){
//     db.hmset(post.id, {
//       id:post.id,
//       url:post.link,
//       type: post.type,
//       created_time:post.created_time,
//       images:post.images,
//       comments:post.comments,
//       likes:post.likes,
//       caption:post.caption,
//       video:post.video
//     });
//   }
//   else{
//     db.hmset(post.id, {
//       id:post.id,
//       url:post.link,
//       type: post.type,
//       created_time:post.created_time,
//       images:post.images,
//       comments:post.comments,
//       likes:post.likes,
//       caption:post.caption
//     });
//   }
// }
// db.lpush('posts',id);

// make the db accessible to all controllers
app.use(function(req,res,next){
	req.db = db;
	next();
});

app.use('/', index);
app.use('/posts', posts);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


module.exports = app;
