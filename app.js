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

// set up a server and socket.io
var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = require("socket.io").listen(server);

// set up a GPIO
var GPIO = require('onoff').Gpio;
var led = new GPIO(17, 'out');

// set up a streaming Twitter API and Parse 
var twitter = require('twitter');
var Parse = require('node-parse-api').Parse;
var APP_ID = "";
var MASTER_KEY = "";
var appParse = new Parse(APP_ID, MASTER_KEY);

var REST_API_KEY = "";
var Kaiseki = require('kaiseki');
var kaiseki = new Kaiseki(APP_ID,REST_API_KEY );

var client = new twitter({
  consumer_key:'',
  consumer_secret:'',
  access_token_key:'',
  access_token_secret:''

});

// action when being mentioned in Twitter
client.stream('statuses/filter',{track: '@aizas549'},function(stream){

    stream.on('data',function(data){
        var text = data.text;
            appParse.insert('Students', { "age":1 }, function (err, response) {
                console.log("entry made");
            });

        var textCleaned = text.replace(/@aizas549/g,'');
        console.log(textCleaned);

        led.writeSync(1);

        var params = {
            count:true
            };
        kaiseki.getObjects('Students', params, function(err, res, body, success) {
        
        console.log('Total number1 = ', body.count+1);
        });

    });
});


// client.stream('statuses/filter',{follow: '3883509681'},function(stream){

//   stream.on('data',function(data){
//       console.log(data);
//       if (retweeted == true || retweet_count > 0){
        
//         appParse.insert('Students', { "age":4 }, function (err, response) {
//             console.log("entry made");
//           });
//   };

    
//   });
// });

// action when being favorited, gaining new followers, being retweeted and added to a list in Twitter
client.stream('user',function(stream){

    stream.on('favorite',function(event){
          console.log(event);
          appParse.insert('Students', { "age":2 }, function (err, response) {
                  console.log("entry made");
          });

          led.writeSync(1);

          var params = {
              count:true
              };
          kaiseki.getObjects('Students', params, function(err, res, body, success) {
          
          console.log('Total number2 = ', body.count+1);
          });

    });


    stream.on('follow',function(event){
          console.log(event);
          appParse.insert('Students', { "age":3 }, function (err, response) {
                  console.log("entry made");
          });

          led.writeSync(1);

          var params = {
              count:true
              };
          kaiseki.getObjects('Students', params, function(err, res, body, success) {
          
          console.log('Total number3 = ', body.count+1);
          });

    });



    stream.on('retweet',function(event){
          console.log(event);
          appParse.insert('Students', { "age":4 }, function (err, response) {
                  console.log("entry made");
          });

          led.writeSync(1);

          var params = {
              count:true
              };
          kaiseki.getObjects('Students', params, function(err, res, body, success) {
          
          console.log('Total number4 = ', body.count+1);
          });

    });


    stream.on('list_member_added',function(event){
          console.log(event);
          appParse.insert('Students', { "age":5 }, function (err, response) {
                  console.log("entry made");
          });

          led.writeSync(1);

          var params = {
              count:true
              };
          kaiseki.getObjects('Students', params, function(err, res, body, success) {
          
          console.log('Total number5 = ', body.count+1);
          });

    });

    stream.on('message',function(event){
          console.log(event);
          appParse.insert('Students', { "age":6 }, function (err, response) {
                  console.log("entry made");
          });

          var params = {
              count:true
              };
          kaiseki.getObjects('Students', params, function(err, res, body, success) {
          
          console.log('Total number6 = ', body.count);
          });

          led.writeSync(1);

    });

    // display initial number of tweeter activities
    var params = {
          count:true
          };
      kaiseki.getObjects('Students', params, function(err, res, body, success) {
      
      console.log('Total number = ', body.count);
      });

});

// work socket.io
io.sockets.on('connection', function (socket) {
  

            socket.on('sendToParse', function (data) {
              console.log(data);
              appParse.insert('Students', { "age":data}, function (err, response) {
              // console.log(response);
              console.log("entry made");
            });
            });


          socket.on('getFromParse', function (data) {
              
                  console.log(data);

                  appParse.find('Students','',function(err,response){
                    console.log(response);

                  

                  var params = {
                                count:true
                      };
                  kaiseki.getObjects('Students', params, function(err, res, body, success) {
                  
                  console.log('Total number of twitter activities = ', body.count);
                  socket.emit('toScreen', {ParseData: response});
                  });

                  });
                      // ageArray = [];
                      // age = 0;

                      // function addAges(ageArray){
                      //   for (var i = 0; i < array.length; i++){
                      //     age + array[i];
                      //   }
                      //   return age;
                      // }

                      // Parse.Object.fetchAll([ageArray], {
                      //     success: function(list) {
                      //       appParse.find('Students', { "age":data} , function (err, response){
                      //           for (entry in list) {
                      //             ageArray.push(entry.age);
                      //             addAges(ageArray);
                      //           };
                      //     socket.emit('toScreen',{ ParseData: response });    

                      //     }); 
                            

                      //     },
                      //     error: function(error) {
                      //       // An error occurred while fetching one of the objects.
                      //       console.log('error to extract data');
                      //     },
                      //   });
                      //        $.when(Parse.Object.fetch()).done(function() {
                      //           return console.log("done");
                      //       });

            });

});



