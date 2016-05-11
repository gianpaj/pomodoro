/**
 * Module dependencies.
 */
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo/es5')(session);

/**
 * Controllers (route handlers).
 */
var userController = require('./controllers/user');

/**
 * API keys and Passport configuration.
 */
var passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
var app = express();

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({   // to support URL-encoded bodies
  extended: true
}));

// required for passport
app.use(session({
  secret: 'nPgedMGXm7DyPvJZFVzQxT5avVaCavxEKfFUTTr5s2NSaMMphTmuYUFdJRsZwcGS7UFpf8hFcrjkeuNQdJzxhdHRgBkMbk222cZa',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    url: 'mongodb://localhost/pomodoro',
    autoReconnect: true
  })
}));
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session

// to access the user variable from the account route
app.use(function(req, res, next) {
  res.locals.user = req.user;
  res.locals.messages = {};
  res.locals.messages.info = req.flash('info');
  res.locals.messages.errors = req.flash('errors');
  res.locals.messages.success = req.flash('success');
  next();
});

/**
 * Connect to MongoDB.
 */
mongoose.connect('mongodb://localhost/pomodoro');
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

/**
 * Serve static files like JavaScript or images
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Primary app route
 */
app.get('/', function(req, res) {
  res.render('home', { title: 'Pomodoro app - Codementor', header: 'We are on week four!' });
});

/**
 * User routes
 */
app.get( '/login',    userController.getLogin);
app.post('/login',    userController.postLogin);
app.get( '/logout',   userController.getLogout);
app.get( '/register', userController.getRegister);
app.post('/register', userController.postRegister);

app.get( '/account', passportConfig.isAuthenticated, userController.getAccount);
app.post('/account', passportConfig.isAuthenticated, userController.postAccount);

app.post('/account/pomodoro', passportConfig.isAuthenticated, userController.postPomodoro);

/**
 * OAuth authentication routes. (Sign in/Register)
 */
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});

/**
 * catch route not found and return 404 status
 */
app.use(function(req, res) {
  res.status(404).send('Sorry can\'t find that!');
});

/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
  console.log('Open your browser at http://localhost:%d', app.get('port'));
});

module.exports = app;