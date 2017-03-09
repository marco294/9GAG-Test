var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var redis = require('ioredis');
var request = require('request');

var index = require('./controllers/index');
var posts = require('./controllers/posts');
var pullPosts = require('./models/pullIGPosts');

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

// connect to localhost redis db  (need install redis locally)
// var db = new redis();

// connect to online Redis Lab db
var db = new redis({
  port: 14559,
  host: 'redis-14559.c10.us-east-1-2.ec2.cloud.redislabs.com',
  //password: 'auth'
});

// ----------- Uncomment the below part to load the newest 200 9GAG IG posts to redis DB--------------------
/*
// This is asynchronous function that ppdate the DB with the most updated 200 posts
// Calling the function defined in models/pullIGposts.js
// First param represent getting n * 20 posts, set to 10 to get 200 posts
pullPosts(10, '', [], '', function(err,obj){
  if(err)
    return;
  // When no error
  // remove the data in current db
  db.flushall();
  // create an id array for adding a list of all id to DB later
  var id = [];
  // loop through all 200 posts data
  for(var i = 0; i < obj.length; i++) {
    var post = obj[i];
    // Push each post_id to id array
    id.push(post.id);
    // Check if the type is video, add one more field which is the video url
    if(post.type=='video'){
      // Add the data entry as hash in redis DB
      db.hmset(post.id, {
        id:post.id,
        url:post.link,
        type: post.type,
        created_time:post.created_time,
        images:post.images,
        comments:post.comments,
        likes:post.likes,
        caption:post.caption,
        video:post.video
      });
    }
    else{
      // Add the data entry as hash in redis DB
      db.hmset(post.id, {
        id:post.id,
        url:post.link,
        type: post.type,
        created_time:post.created_time,
        images:post.images,
        comments:post.comments,
        likes:post.likes,
        caption:post.caption
      });
    }
  }
  // Add the ids array as list in redis DB
  db.lpush('posts',id);
});
*/

// make the db accessible to all controllers
app.use(function(req,res,next){
	req.db = db;
	next();
});

// use router index to show view in AngularJS
app.use('/', index);
// use router posts to handle HTTP requests
app.use('/posts', posts);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
