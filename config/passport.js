var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../db');

// http://passportjs.org/docs/configure
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, cb) {
  db.users.findById(user.id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new LocalStrategy(
  function(username, password, done) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password != password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
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