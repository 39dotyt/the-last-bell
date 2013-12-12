/**
 * @license GPLv3
 * @author 0@39.yt (Yurij Mikhalevich)
 */

var VERTICAL_PHOTOS = [18, 19, 33, 35, 37, 38, 39, 42, 49, 52, 57, 59, 68, 70,
  71, 75, 82, 84, 86],
    PHOTOS_COUNT = 92,
    VIDEOS_COUNT = 16,
    OBJECTS_COUNT_TO_SHOW_AT_ONE_MOMENT = 25,
    VIDEOS_COUNT_TO_SHOW = OBJECTS_COUNT_TO_SHOW_AT_ONE_MOMENT - PHOTOS_COUNT,
    HANDLED_PREFIXES = ['photo', 'video'],
    VIDEO_DURATION = [0, 2000, 2000, 16000, 14000, 4000, 5000, 8000, 5000,
      19000, 3000, 7000, 2000, 3000, 9000, 8000, 3000],
    BROWSERCODE_TRANSFORM = $.keyframe.browserCode() + 'transform';

$(document).ready(function() {
  var app = impress(),
      audio = {
        doctor: $('#doctor')[0],
        tardis: $('#tardis')[0]
      };
  throwPhotosAndVideos();
  app.init();
  app.goto('intro');
  setTimeout(function() {
    audio.tardis.play();
    app.goto('overview', 11000);
    setTimeout(function() {
      audio.tardis.pause();
      audio.doctor.play();
      showPhotosAndVideos(app, function() {
        app.goto('outro', 400);
      });
    }, 11000);
  }, 6000);
});


/**
 * Starts webcam
 */
function startWebCam() {
  navigator.getUserMedia = navigator.getUserMedia ||
      navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;
  if (!navigator.getUserMedia) {
    console.error('Can\'t start webcam');
  }
  navigator.getUserMedia({video: true, audio: false},
      function(localMediaStream) {
        var video = document.querySelector('video');
        video.src = window.URL.createObjectURL(localMediaStream);
      }, function(err) { console.error(err); });
}


/**
 * Places photos and videos on the presentation screen
 */
function throwPhotosAndVideos() {
  var impressDiv = $('#impress'),
      throwableObject;
  for (var photoNumber = 0; photoNumber < PHOTOS_COUNT; ++photoNumber) {
    impressDiv.append('<div id="photo' + photoNumber + '" class="step">' +
        '<img class="photo ' + getPhotoClass(photoNumber) + '" ' +
        'src="img/photos/' + convertIntToString(photoNumber, 2) + '.jpg"/>' +
        '</div>');
    throwableObject = $('#photo' + photoNumber);
    throwObject(throwableObject);
    if (photoNumber >= OBJECTS_COUNT_TO_SHOW_AT_ONE_MOMENT) {
      throwableObject.hide();
    }
  }
  for (var videoNumber = 0; videoNumber < VIDEOS_COUNT; ++videoNumber) {
    impressDiv.append('<div id="video' + videoNumber + '" class="step">' +
        '<video class="video" src="video/' +
        convertIntToString(videoNumber, 2) + '.mp4"></video>' +
        '</div>');
    throwableObject = $('#video' + videoNumber);
    throwObject(throwableObject);
    if (videoNumber >= VIDEOS_COUNT_TO_SHOW) {
      throwableObject.hide();
    }
  }
}


/**
 * @param {number} minInclusive
 * @param {number} maxInclusive
 * @return {number}
 */
function getRandomInt(minInclusive, maxInclusive) {
  return Math.floor(Math.random() * (maxInclusive - minInclusive + 1)) +
      minInclusive;
}


/**
 * @param {number} int
 * @param {number} minStringLength
 * @return {string}
 */
function convertIntToString(int, minStringLength) {
  var string = int.toString();
  while (string.length < minStringLength) {
    string = '0' + string;
  }
  return string;
}


/**
 * @param {number} photoNumber
 * @return {string}
 */
function getPhotoClass(photoNumber) {
  if (VERTICAL_PHOTOS.indexOf(photoNumber) === -1) {
    return 'photo-horizontal';
  } else {
    return 'photo-vertical';
  }
}


/**
 * @param {number} angle
 * @return {number}
 */
function convertDegreesToRadians(angle) {
  return angle * (Math.PI / 180);
}


/**
 * @return {{x, y, z}}
 */
function generateXYZ() {
  var radius,
      alpha,
      xyz = {};
  radius = getRandomInt(700, 2700);
  alpha = convertDegreesToRadians(getRandomInt(0, 360));
  xyz.x = 3000 + (radius * Math.cos(alpha));
  xyz.y = 3000 + (radius * Math.sin(alpha));
  if (getRandomInt(0, 1)) {
    xyz.z = 3000 + radius * Math.random();
  } else {
    xyz.z = 3000 + radius * (-Math.random());
  }
  return xyz;
}


/**
 * @param {Object} object jQuery DOM element
 */
function throwObject(object) {
  var xyz = generateXYZ();
  object.attr('data-scale', 1);
  object.attr('data-x', xyz.x);
  object.attr('data-y', xyz.y);
  object.attr('data-z', xyz.z);
}


/**
 * @param {Object} app
 * @param {string} slideId
 * @param {number} duration
 */
function goto(app, slideId, duration) {
  var slide = $('#' + slideId),
      slidePrefix = slideId.slice(0, 5),
      slideIndex,
      slideToHidePrefix,
      slideToHideIndex;
  if (HANDLED_PREFIXES.indexOf(slidePrefix) !== -1) {
    slideIndex = +slideId.slice(5);
    if (slidePrefix === 'photo') {
      if (slideIndex >= OBJECTS_COUNT_TO_SHOW_AT_ONE_MOMENT) {
        slide.show();
        $('#photo' + (slideIndex - OBJECTS_COUNT_TO_SHOW_AT_ONE_MOMENT)).hide();
      }
    } else { // if (slidePrefix === 'video') {
      if (slideIndex >= VIDEOS_COUNT_TO_SHOW) {
        slide.show();
        setTimeout(function() { $('#' + slideId + ' .video')[0].play() }, 1200);
        slideToHideIndex = slideIndex - OBJECTS_COUNT_TO_SHOW_AT_ONE_MOMENT;
        if (slideToHideIndex < 0) {
          slideToHideIndex += PHOTOS_COUNT;
          slideToHidePrefix = 'photo';
        } else {
          slideToHidePrefix = 'video';
        }
        $('#' + slideToHidePrefix + slideToHideIndex).hide();
      }
    }
  }
  app.goto(slideId, duration);
}


/**
 * @param {Object} app
 * @param {Function} callback
 */
function showPhotosAndVideos(app, callback) {
  var timeouts;
  for (var photoNumber = 0; photoNumber < PHOTOS_COUNT; ++photoNumber) {
    setTimeout(getGotoFunction(app, 'photo' + photoNumber, 400),
        2350 * photoNumber);
  }
  timeouts = 2350 * photoNumber;
  setTimeout(getGotoFunction(app, 'video0', 400), timeouts);
  for (var videoNumber = 1; videoNumber < VIDEOS_COUNT; ++videoNumber) {
    setTimeout(getGotoFunction(app, 'video' + videoNumber, 400),
        timeouts += VIDEO_DURATION[videoNumber] + 1550);
  }
  setTimeout(callback, timeouts + VIDEO_DURATION[videoNumber] + 1550);
}


/**
 * @param {Object} app
 * @param {string} slideId
 * @param {number} duration
 * @return {function(Object, string, number)}
 */
function getGotoFunction(app, slideId, duration) {
  return function() {
    goto(app, slideId, duration);
  };
}


/**
 * LAGGED!!! Does not restores targetProperties correctly
 * @param {Object} app
 * @param {Function} callback
 */
function flyOutPhotos(app, callback) {
  var object,
      targetProperties,
      initialProperties,
      objectType = 'photo',
      objectId;
  for (var objectNumber = 0; objectNumber < OBJECTS_COUNT_TO_SHOW_AT_ONE_MOMENT;
       ++objectNumber) {
    if (objectNumber >= PHOTOS_COUNT) {
      objectType = 'video';
      objectNumber = objectNumber - PHOTOS_COUNT;
      if (objectNumber >= VIDEOS_COUNT) {
        break;
      }
    }
    objectId = objectType + objectNumber;
    object = $('#' + objectId);
    targetProperties = ':' + object.css(BROWSERCODE_TRANSFORM);
    initialProperties = ': translate3d(3000px, 3000px, 0px) ' +
        'rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)';
    $.keyframe.define({
      name: objectId + '-fly',
      from: BROWSERCODE_TRANSFORM + initialProperties,
      to: BROWSERCODE_TRANSFORM + targetProperties
    });
    object.playKeyframe({
      name: objectId + '-fly',
      duration: 3000,
      timingFunction: 'linear'
    });
  }
  app.goto('overview1', 6000);
  setTimeout(function() {
    app.goto('overview2', 0);
    callback();
  }, 6000);
}
