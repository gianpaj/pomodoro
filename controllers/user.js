var passport = require('passport');
var User = require('../models/User');

/**
 * GET Login route
 */
exports.getLogin = function(req, res) {
  res.render('login', { title: 'Pomodoro app - Codementor' });
};

/**
 * POST Login route
 */
exports.postLogin =  function(req, res, next) {
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
};

/**
 * GET Loguut route
 */
exports.getLogout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * GET /register
 * Signup page.
 */
exports.getRegister = function(req, res) {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('register', {
    title: 'Create Account'
  });
};

/**
 * POST /register
 * Create a new local account.
 */
exports.postRegister = function(req, res, next) {
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
};

/**
 * GET Account
 */
exports.getAccount = function(req, res) {
  res.render('login', { title: 'Account - Pomodoro app - Codementor' });
};

/**
 * POST Account to update user's details
 */
exports.postAccount = function(req, res, next) {
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
};

/**
 * POST new pomodoro
 */
exports.postPomodoro = function(req, res, next) {

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
};