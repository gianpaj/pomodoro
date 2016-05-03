/**
 * Module dependencies.
 */
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');

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
  saveUninitialized: true
}));
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session

// to access the user variable from the account route
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

/**
 * Serve static files like JavaScript or images
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Primary app route
 */
app.get('/', function(req, res) {
  res.render('home', { title: 'Pomodoro app - Codementor', header: 'We are on week two!' });
});

/**
 * GET Login route
 */
app.get('/login', function(req, res) {
  res.render('login', { title: 'Pomodoro app - Codementor', errors: req.flash('errors')});
});

/**
 * POST Login route
 */
app.post('/login', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  console.log('username:', username);
  console.log('password:', password);

  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      console.log('errors', info);
      req.flash('errors', { msg: info.message });
      return res.redirect('/login');
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      console.log('success', { msg: 'Success! You are logged in.' });
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect(req.session.returnTo || '/account');
    });
  })(req, res, next);
});


app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

/**
 * GET Account
 */
app.get('/account', passportConfig.isAuthenticated, function(req, res) {
  res.render('login', { title: 'Account - Pomodoro app - Codementor' });
});
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