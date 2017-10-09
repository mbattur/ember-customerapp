var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var app = express();

/*
var logger = function(req, res, next) {
  console.log('Logging...');
  next();
}

app.use(logger);
*/

//View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static path
app.use(express.static(path.join(__dirname, 'public')));

// Global vars
app.use(function(req, res, next) {
  res.locals.errors = null
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

var users = [
  {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'johndoe@gmail.com'
  },
  {
    id: 2,
    first_name: 'Jack',
    last_name: 'Doo',
    email: 'jack@gmail.com'
  },
  {
    id: 3,
    first_name: 'Jeff',
    last_name: 'Dol',
    email: 'jeff@gmail.com'
  }
]

app.get('/', function(req, res) {
  res.render('index', {
    title: 'Customers',
    users: users
  });
});

app.post('/users/add', function(req, res) {

  req.checkBody('first_name', 'First Name is Required').notEmpty();
  req.checkBody('last_name', 'Last Name is Required').notEmpty();
  req.checkBody('email', 'Email is Required').notEmpty();

  var errors = req.validationErrors();

  if(errors) {
    res.render('index', {
      title: 'Customers',
      users: users,
      errors: errors
    });
  } else {
    var newUser = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email
    }

    console.log('SUCCESS');
  }
})

app.listen(3000, function() {
  console.log('Server Started on Port 3000...');
})
