var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var pomodoroSchema = new mongoose.Schema({
  dateStarted: Date,
  dateFinished: { type: Date, default: Date.now },
  secondsLength: Number,
  type: { type: String, default: 'pomodoro' } // or shortbreak, longbreak
});

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  registrationDate: { type: Date, default: Date.now },
  pomodoroDefaultTime: { type: Number, default: 1500 },

  tokens: Array,

  profile: {
    name:     { type: String, default: '' },
    location: { type: String, default: '' },
    website:  { type: String, default: '' }
  },

  pomodoros: [pomodoroSchema]
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  if (!this.password) {
    return cb('password not stored. Probably using a Single sign on authentication like Facebook', false);
  }
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    cb(err, isMatch);
  });
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function(size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
  }
  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

var User = mongoose.model('User', userSchema);
User.Pomodoro = mongoose.model('Pomodoro', pomodoroSchema);

module.exports = User;