/**
 * Module dependencies.
 */
var express = require('express');
var path = require('path');

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

/**
 * Serve static files like JavaScript or images
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Primary app route
 */
app.get('/', function(req, res) {
  res.render('home', { title: 'Pomodoro app - Codementor' });
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