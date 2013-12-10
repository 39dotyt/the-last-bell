/**
 * @license GPLv3
 * @author 0@39.yt (Yurij Mikhalevich)
 */

$(document).ready(function() {
  var app = impress(),
      browserCode = $.keyframe.browserCode(),
      background = $('#background'),
      flyingTardis = $('#flying-tardis'),
      fiveYearsLater = $('#five-years-later'),
      nobodyWasntImportant = $('#nobody-wasnt-important'),
      audio = {
        doctor: $('#doctor')[0],
        tardis: $('#tardis')[0]
      };
  app.init();
  background.hide(0);
  flyingTardis.hide(0);
  fiveYearsLater.hide(0);
  nobodyWasntImportant.hide(0);
  audio.doctor.play();
  var photo;
  var targetProperties;
  var initialProperties;
  for (var i = 0; i < 5; ++i) {
    photo = $('#photo' + i);
    targetProperties = photo.css(browserCode + 'transform');
    initialProperties = 'translate3d(3000px, 3000px, 0px) ' +
        'rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)';
    $.keyframe.define({
      name: 'photo' + i + '-fly',
      from: browserCode + 'transform:' + initialProperties,
      to: browserCode + 'transform:' + targetProperties
    });
    photo.playKeyframe({
      name: 'photo' + i + '-fly',
      duration: 6000,
      timingFunction: 'linear'
    });
  }
  app.goto('overview1', 12000);
  setTimeout(function() {
    app.goto('overview2', 0);
    for (var i = 0; i < 5; ++i) {
      setTimeout(function(i) {
        return function() { app.goto('photo' + i, 2000); }
      }(i), i * 2000);
    }
    setTimeout(function() {
      audio.doctor.pause();
      audio.tardis.play();
      setTimeout(function() { audio.doctor.play(); }, 10000);
      background.show(2000);
      app.goto('background', 5000);
      setTimeout(function() {
        $('#flying-tardis').show(2000);
        app.goto('flying-tardis', 5000);
        setTimeout(function() {
          fiveYearsLater.show(1500);
          app.goto('five-years-later', 3000);
          setTimeout(function() {
            fiveYearsLater.hide(1500);
            nobodyWasntImportant.show(1500);
            app.goto('nobody-wasnt-important', 3000);
          }, 3000);
        }, 5000);
      }, 5000);
    }, (i + 1) * 2000);
  }, 12000);
});
