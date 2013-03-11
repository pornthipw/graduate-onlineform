var express = require("express");
var handlebars = require('hbs');
var passport = require('passport');
var mongo_con = require('mongo-connect');

var config = require('./config');

var app = express();

var mongo = mongo_con.Mongo(config.mongo_connect);

app.configure(function() {
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.favicon());
  app.use(express.static(__dirname + '/public'));
  app.set('views', __dirname + '/views');
  app.engine('html', handlebars.__express);
  app.set('view engine', 'html');
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());  	
});

app.get('/', function(req, res) {
  res.render('index', {baseHref:config.site.baseUrl});
});

app.get('/db/:collection/:id?', mongo.query);
app.post('/db/:collection', mongo.insert);
app.put('/db/:collection/:id', mongo.update);
app.del('/db/:collection/:id', mongo.delete);

app.get('/form/download', function(req, res) {
  //console.log(req.param.id);
  //var entry = {student_id:'38014309'};
  var form = JSON.parse(req.query.form);
  res.set('Content-disposition', 'attachment; filename='+form.type+'_'+form.student.id+'.xml');
  
  res.render('forms/grad_11', {'form':form, layout:false});
  
});

app.use(function(err,req,res,next) {  
  console.log('Error 401');
  if(err instanceof Error){    
    if(err.message === '401'){
      res.json({'error':401});
    }
  }
});

app.listen(config.site.port || 3000);

console.log("Mongo Express server listening on port " + (config.site.port || 3000));

//var server = app.listen(3000);
