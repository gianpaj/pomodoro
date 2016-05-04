var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User');

// http://passportjs.org/docs/configure
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  User.findById(user._id, function (err, user) {
    if (err) { return done(err); }
    done(null, user);
  });
});

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`email` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  function(email, password, done) {
    User.findOne({ email: email.toLowerCase() }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Email ' + email + ' not found.' });
      }
      // from models/User.js
      user.comparePassword(password, function(err, isMatch) {
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Invalid password.' });
        }
      });
    });
  }));

/**
 * Login Required middleware.
 */
exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};