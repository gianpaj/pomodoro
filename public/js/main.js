/* globals moment, pomodoroDefaultTime, logged */

$(document).ready(function() {
  console.log('jQuery is loaded');

  var counterFn;
  var timer;
  var offset;
  var $timer = $('#timer');

  // 25 min = 1500 seconds
  var pomodoroLength = 5;
  if (typeof pomodoroDefaultTime !== 'undefined') {
    pomodoroLength = pomodoroDefaultTime;
  }
  var aTimer = moment.duration(pomodoroLength, 'seconds');
  $timer.text(moment(aTimer._data).format('mm:ss'));

  $('#start').click(function() {
    $('.startStop').toggle();

    // reset progress bar and timer
    if (!timer) {
      timer = moment.duration({ minute:0 });
      $timer.text('00:00');
    }

    counterFn = setInterval(function () {
      if (timer.asSeconds() > pomodoroLength-1) {
        clearInterval(counterFn);
        console.log('a pomodoro has passed');
        // add a completed pomodoro to localStorage
        var pomodoros = localStorage.getItem('pomodoros');
        if (!pomodoros) {
          pomodoros = 0;
        }
        localStorage.setItem('pomodoros', ++pomodoros);
        if (typeof logged == 'undefined') {
          $('.modal-footer').show();
          $('#modal').modal();
        }
        else {
          // jQuery POST request
          $.post('/account/pomodoro', { length: pomodoroLength })
            .done(function (result) {
              console.log(result);
            });
          $('.modal-footer').hide();
          $('.modal-title').text('Well done! Keep going');
          $('.modal-body p').text('Another pomodoro in bag!');
          $('#modal').modal();
        }
        return;
      }

      timer = moment.duration(timer.asSeconds() + 1, 'seconds');
      $timer.text(moment(timer._data).format('mm:ss'));

      offset = -(circumference / pomodoroLength) * currentCount + 'em';
      // console.log(currentCount, offset);

      document.querySelector('.radial-progress-cover').setAttribute('stroke-dashoffset', offset);

      currentCount++;
    }, 1000);
  });

  $('#registerBtn').click(function () {
    $('#modal').modal('hide');
    window.location = '/register';
  });

  $('#stop').click(function() {
    $('.startStop').toggle();
    clearInterval(counterFn);
  });

  $('#reset').click(function() {
    $('#stop').hide();
    $('#start').show();
    offset = 0;
    currentCount= 0;
    document.querySelector('.radial-progress-cover').setAttribute('stroke-dashoffset', offset);
    timer = moment.duration({ minute:0 });
    $timer.text('00:00');
    clearInterval(counterFn);
  });

  $('#pomodoros').val(localStorage.getItem('pomodoros'));

  // http://jsbin.com/wifole/33
  var radius = 3; // set the radius of the circle
  var circumference = 2 * radius * Math.PI;

  var els = document.querySelectorAll('circle');
  Array.prototype.forEach.call(els, function (el) {
    el.setAttribute('stroke-dasharray', circumference+5 + 'em');
    el.setAttribute('r', radius + 'em');
  });

  document.querySelector('.radial-progress-center').setAttribute('r', (radius - 0.01 + 'em'));

  var currentCount = 1;
});