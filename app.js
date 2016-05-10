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

var User = require('./models/User');

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
 * GET Login route
 */
app.get('/login', function(req, res) {
  res.render('login', { title: 'Pomodoro app - Codementor' });
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
 * GET /register
 * Signup page.
 */
app.get('/register', function(req, res) {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('register', {
    title: 'Create Account'
  });
});

/**
 * POST /register
 * Create a new local account.
 */
app.post('/register', function(req, res, next) {
  // TODO validate email and password

  var userDoc = {
    email:    req.body.email,
    password: req.body.password
  };

  // if user has completed pomodoros before registering
  if (req.body.pomodoros) {
    var pomodoros = [];
    for (var i = 0; i < Number(req.body.pomodoros); i++) {
      pomodoros.push(new User.Pomodoro({
        secondsLength: 1500
      }));
    }
    userDoc.pomodoros = pomodoros;
  }

  var user = new User(userDoc);

  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that email address already exists.' });
      return res.redirect('/register');
    }

    user.save(function(err) {
      if (err) {
        return next(err);
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
  });
});

/**
 * GET Account
 */
app.get('/account', passportConfig.isAuthenticated, function(req, res) {
  res.render('login', { title: 'Account - Pomodoro app - Codementor' });
});

/**
 * POST new pomodoro
 */
app.post('/account/pomodoro', passportConfig.isAuthenticated, function(req, res, next) {

  User.findById(req.user.id, function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(404).json({
        error: 404,
        msg: 'User error'
      });
    }

    user.pomodoros.push(new User.Pomodoro({
      secondsLength: req.body.length
    }));

    user.save(function(err) {
      if (err) {
        return next(err);
      }
      console.log('pomodor added. total:', user.pomodoros.length);
      res.status(201).json({
        error: null,
        pomodoros: user.pomodoros.length
      });
    });
  });
});

/**
 * POST Account
 */
app.post('/account', passportConfig.isAuthenticated, function(req, res, next) {
  // TODO validate email and password

  User.findById(req.user.id, function(err, user) {
    if (err) {
      return next(err);
    }
    user.email = req.body.email || '';
    user.profile.name = req.body.name || '';
    user.profile.location = req.body.location || '';
    user.profile.website = req.body.website || '';
    user.pomodoroDefaultTime = req.body.pomodoroDefaultTime * 60 || 0;
    user.save(function(err) {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
          return res.redirect('/account');
        } else {
          return next(err);
        }
      }
      req.flash('success', { msg: 'Profile information updated.' });
      res.redirect('/account');
    });
  });
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