var request = require('supertest');
var app = require('../app.js');

describe('GET /', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  });
});


describe('GET /wr0ngUrl', function() {
  it('should return 404', function(done) {
    request(app)
      .get('/wr0ngUrl')
      .expect(404, done);
  });
});