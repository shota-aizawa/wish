var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// all environments
app.set('port', process.env.PORT || 8000);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


// var server = app.listen('port');
// var io = require("socket.io").listen(server);

// var server = http.createServer(app).listen(app.get('port'));
 var io = require("socket.io").listen(http.createServer(app));

// var bodyParser = require('body-parser');
// var express = require("express");
// var app = express();
// var port = 8000;
// var url='localhost'
// var server = app.listen(port);
// var io = require("socket.io").listen(server);

// app.use(express.static(__dirname + '/'));
// console.log('Simple static server listening at '+url+':'+port);



//socket.io stuff
io.sockets.on('connection', function (socket) {
  socket.on('toColor', function (data) {
    console.log(data);
    console.log("You sent R=" + data.r + " G="+ data.g + " B="+ data.g);
    socket.emit('toScreen', { r: data.r, g: data.g, b: data.b });     

  });
});

var twitter = require('twitter');
var Parse = require('node-parse-api').Parse;
var APP_ID = "jr3y6s5boZKmSNc5PTN5xnlBjS8n9LxUAFKoHPxj";
var MASTER_KEY = "rMYR8PJXpWfsmqXeslG3ZZ7QOsx6o7DKtCEwwGtb";
var appParse = new Parse(APP_ID, MASTER_KEY);

var client = new twitter({
  consumer_key:'4iY6utOFjvXVrqGn0WhVJKdy8',
  consumer_secret:'ps5WUJCCG7Qhl34OigWi96vCJlRtpmRpddTsZRgYn8pib4fBPE',
  access_token_key:'3883509681-omCwE1olKxSfsEksD1Tiw2y7JbFPVISq3I3Vs3d',
  access_token_secret:'EnzKhluQDXaq6EhUgNkcZvOY4xNz23gN01sozgcEcnQiR'

});

client.stream('statuses/filter',{track: '@aizas549'},function(stream){

  stream.on('data',function(data){
    var text = data.text;
        appParse.insert('Students', { "age":1 }, function (err, response) {
            console.log("entry made");
  });

    var textCleaned = text.replace(/@aizas549/g,'');
    console.log(textCleaned);
  });
});


client.stream('statuses/filter',{follow: '3883509681'},function(stream){

  
  stream.on('data',function(data){
      console.log(data);
      if (retweeted == true || retweet_count > 0){
        
        appParse.insert('Students', { "age":4 }, function (err, response) {
            console.log("entry made");
          });
  };

    
  });
});


client.stream('user',function(stream){

  stream.on('favorite',function(event){
    console.log(event);
    appParse.insert('Students', { "age":2 }, function (err, response) {
            console.log("entry made");
    });
  });
  stream.on('follow',function(event){
    console.log(event);
    appParse.insert('Students', { "age":3 }, function (err, response) {
            console.log("entry made");
    });

  });
  stream.on('retweet',function(event){
    console.log(event);
    appParse.insert('Students', { "age":4 }, function (err, response) {
            console.log("entry made");
    });

  });
  stream.on('list_member_added',function(event){
    console.log(event);
    appParse.insert('Students', { "age":5 }, function (err, response) {
            console.log("entry made");
    });

  });

  stream.on('message',function(event){
    console.log(event);
    appParse.insert('Students', { "age":6 }, function (err, response) {
            console.log("entry made");
    });

  });


});

io.sockets.on('connection', function (socket) {
  

            // socket.on('sendToParse', function (data) {
            //   console.log(data);
            //   appParse.insert('Students', { firstName: data.firstName,lastName:data.lastName,age:data.age,pet:data.pet,drake:data.drake }, function (err, response) {
            //   // console.log(response);
            //   console.log("entry made");
            // });
            // });


          socket.on('getFromParse', function (data) {
              appParse.find('Students', '', function (err, response) {
            console.log(response);
            socket.emit('toScreen',{ ParseData: response });
          });
             
            });


});


