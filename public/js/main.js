/* globals moment, pomodoroDefaultTime, logged */

$(document).ready(function() {
  console.log('jQuery is loaded');

  var counterFn;
  var timer;
  var $progressBar = $('.progress-bar');
  var $timer = $('#timer');

  var pomodoroLength = 5;
  if (typeof pomodoroDefaultTime !== 'undefined') {
    // pomodoroLength = pomodoroDefaultTime;
  }
  var aTimer = moment.duration(pomodoroLength, 'seconds');
  $timer.text(moment(aTimer._data).format('mm:ss'));

  $('#start').click(function() {
    $('.startStop').toggle();

    $progressBar.toggleClass('active');

    // reset progress bar and timer
    if (!timer) {
      $progressBar.css('width', 0+'%').attr('aria-valuenow', 0);
      timer = moment.duration({ minute:0 });
      $timer.text('00:00');
    }

    counterFn = setInterval(function () {
      timer = moment.duration(timer.asSeconds() + 1, 'seconds');
      $timer.text(moment(timer._data).format('mm:ss'));

      var percentage = timer.asSeconds() * 100 / pomodoroLength;
      $progressBar.css('width', percentage+'%').attr('aria-valuenow', percentage);

      // 25 min = 1500 seconds
      if (timer.asSeconds() > pomodoroLength) {
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
          $.post('/account/pomodoro', { length: pomodoroLength})
          .done(function (result) {
            console.log(result);
          });
          $('.modal-footer').hide();
          $('.modal-title').text('Well done! Keep going');
          $('.modal-body p').text('Another pomodoro in bag!');
          $('#modal').modal();
        }
      }
    }, 1000);
  });

  $('#registerBtn').click(function () {
    $('#modal').modal('hide');
    window.location = '/register';
  });

  $('#stop').click(function() {
    $('.startStop').toggle();
    $progressBar.toggleClass('active');
    clearInterval(counterFn);
  });

  $('#reset').click(function() {
    $('#stop').hide();
    $('#start').show();
    $progressBar.css('width', 0+'%').attr('aria-valuenow', 0);
    timer = moment.duration({ minute:0 });
    $timer.text('00:00');
    clearInterval(counterFn);
  });

  $('#pomodoros').val(localStorage.getItem('pomodoros'));
});