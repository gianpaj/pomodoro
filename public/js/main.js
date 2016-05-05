/* globals moment */

$(document).ready(function() {
  console.log('jQuery is loaded');

  var counterFn;
  var timer;
  var $progressBar = $('.progress-bar');
  var $timer = $('#timer');

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

      var percentage = timer.asSeconds() * 100 / 1500;
      $progressBar.css('width', percentage+'%').attr('aria-valuenow', percentage);

      // 25 min = 1500 seconds
      if (timer.asSeconds() == 1500) {
        clearInterval(counterFn);
        console.log('a pomodoro has passed');
        // add a completed pomodoro to localStorage
        var pomodoros = localStorage.getItem('pomodoros');
        if (!pomodoros) {
          pomodoros = 0;
        }
        localStorage.setItem('pomodoros', ++pomodoros);
        $('#registerModal').modal();
      }
    }, 1000);
  });

  $('#registerBtn').click(function () {
    $('#registerModal').modal('hide');
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