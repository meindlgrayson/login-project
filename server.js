const express = require('express');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');

const application = express(); 

const users = [
  {
    name: 'admin',
    pass: '123'
  }
];

application.use(session({
  secret: 'original and not copied',
  resave: false,
  saveUninitialized: true
}))

application.engine('mustache', mustache());

application.set('views', './views');
application.set('view engine', 'mustache');

application.use(bodyParser.urlencoded());
application.use(expressValidator());

application.get('/', (request, response) => {
  if(session.isAuthenticated) {
    let renderModel = {
    status: 'Logged in',
    user: session.user
  }
    response.render('home', renderModel);
  }
  else {
    response.redirect('/login');
  }
  
});

application.get('/login', (request, response) => {
  response.render('login');
});

application.post('/login', (request, response) => {
  let loginName = request.body.name;
  let loginPass = request.body.pass;
  var existingUser = users.find(user => { return (user.name == loginName && user.pass == loginPass)});

  if(existingUser){
    session.isAuthenticated = true;
    session.user = loginName;
  }
  else {
    session.isAuthenticated = false;
  }

  if (!session.isAuthenticated){
   let renderModel = {
     error: 'incorrect username or password'
   }
   response.render('login', renderModel);
  }
  else {
    response.redirect('/');
  }
})

application.listen(3000);