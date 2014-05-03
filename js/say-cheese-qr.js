/*
 * Say Cheese!
 * Lee Machin, 2012
 * http://leemach.in, http://new-bamboo.co.uk
 *
 * Minimal javascript library for integrating a webcam and snapshots into your app.
 *
 * Handles starting up the webcam and rendering the element, and also capturing shots
 * in a separate canvas element.
 *
 * Depends on video and canvas, and of course, getUserMedia. It's unlikely to work
 * on anything but the newest browsers.
 */

var SayQRCode = (function() {

  var SayQRCode
  navigator.getUserMedia = (navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia ||
                            false);

  window.AudioContext = (window.AudioContext ||
                         window.webkitAudioContext);

  window.URL = (window.URL ||
                window.webkitURL);

  SayQRCode = function SayQRCode(element, options) {
    this.snapshots = [],
    this.video = null,
    this.events = {},
    this.stream = null,
    this.options = {
      snapshots: true,
      audio: false
    };

    this.setOptions(options);
    this.element = document.querySelector(element);
    return this;
  };

  SayQRCode.prototype.on = function on(evt, handler) {
    if (this.events.hasOwnProperty(evt) === false) {
      this.events[evt] = [];
    }

    this.events[evt].push(handler)
  };

  SayQRCode.prototype.off = function off(evt, handler) {
    this.events[evt] = this.events[evt].filter(function(h) {
      return h !== handler;
    });
  };

  SayQRCode.prototype.trigger = function trigger(evt, data) {
    if (this.events.hasOwnProperty(evt) === false) {
      return false;
    }

    this.events[evt].forEach(function(handler) {
      handler.call(this, data);
    }.bind(this));
  };

  SayQRCode.prototype.setOptions = function setOptions(options) {
    // just use naïve, shallow cloning
    for (var opt in options) {
      this.options[opt] = options[opt];
    }
  }

  SayQRCode.prototype.getStreamUrl = function getStreamUrl() {
    if (window.URL && window.URL.createObjectURL) {
      return window.URL.createObjectURL(this.stream);
    } else {
      return this.stream;
    }
  };

  SayQRCode.prototype.createVideo = function createVideo() {
//    var width     = 320,
//        height    = 0,
       var streaming = false;

    this.video = document.createElement('video');

    this.video.addEventListener('canplay', function() {
      if (!streaming) {
//        height = this.video.videoHeight / (this.video.videoWidth / width);
//        this.video.style.width = 320;
//        this.video.style.height = height;
          this.video.setAttribute("height", this.height);
        streaming = true;
        return this.trigger('start');
      }
    }.bind(this), false);
  };

  SayQRCode.prototype.linkAudio = function linkAudio() {
    this.audioCtx = new window.AudioContext();
    this.audioStream = this.audioCtx.createMediaStreamSource(this.stream);

    var biquadFilter = this.audioCtx.createBiquadFilter();

    this.audioStream.connect(biquadFilter);
    biquadFilter.connect(this.audioCtx.destination);
  };

  SayQRCode.prototype.setQROptions = function(readSuccess, readError) {
      this.qrReadError = readError;
      qrcode.callback = readSuccess;
  };

  SayQRCode.prototype.readSuccess = function(readSuccess) {
    if (readSuccess != "error decoding QR Code") {
      this.trigger('qrReadSuccess', readSuccess);
    }
  };

  SayQRCode.prototype.startQrRead = function(milli) {
      var mills = milli || 1000;
      this.qrSnapIntervalId = setInterval(this.takeQrSnapshot.bind(this), mills);
  };

  SayQRCode.prototype.stopQrRead = function() {
      clearInterval(this.qrSnapIntervalId);
  };

  SayQRCode.prototype.takeQrSnapshot = function() {
    if (!qrcode.callback) {
        qrcode.callback = this.readSuccess.bind(this);

    }
    if (this.video) {
      width = this.video.videoWidth;
      height = this.video.videoHeight;

      var snapshot = document.createElement('canvas'),
      ctx = snapshot.getContext('2d');

      snapshot.width = width;
      snapshot.height = height;

      ctx.drawImage(this.video, 0, 0, width, height);

      try {
        qrcode.decode(snapshot.toDataURL("image/png"));
      }
      catch (e) {
        this.trigger('qrReadError',e);
        console.log('--' + e);
      }

      ctx = null;
    }
  };

  SayQRCode.prototype.takeSnapshot = function takeSnapshot(width, height) {
    if (this.options.snapshots === false) {
      return false;
    }

    width  = width || this.video.videoWidth;
    height = height || this.video.videoHeight;

    var snapshot = document.createElement('canvas'),
        ctx      = snapshot.getContext('2d');

    snapshot.width  = width;
    snapshot.height = height;

    ctx.drawImage(this.video, 0, 0, width, height);

    this.snapshots.push(snapshot);
    this.trigger('snapshot', snapshot);

    ctx = null;
  };

  /* Start up the stream, if possible */
  SayQRCode.prototype.start = function start(height) {

    // fail fast and softly if browser not supported
    if (navigator.getUserMedia === false) {
      this.trigger('error', 'NOT_SUPPORTED');
      return false;
    }
    if(height) {
        this.height = height;

    }

    var success = function success(stream) {
      this.stream = stream;
      this.createVideo();

      if (navigator.mozGetUserMedia) {
        this.video.mozSrcObject = stream;
      } else {
        this.video.src = this.getStreamUrl();
      }

      if (this.options.audio === true) {
        try {
          this.linkAudio();
        } catch(e) {
          this.trigger('error', 'AUDIO_NOT_SUPPORTED');
        }
      }


      this.element.appendChild(this.video);
      this.video.play();
    }.bind(this);

    /* error is also called when someone denies access */
    var error = function error(error) {
      this.trigger('error', error);
    }.bind(this);

    return navigator.getUserMedia({ video: true, audio: this.options.audio }, success, error);
  };

  SayQRCode.prototype.stop = function stop() {
    this.stream.stop();
    this.stopQrRead();

    this.video.remove()

    if (window.URL && window.URL.revokeObjectURL) {
      window.URL.revokeObjectURL(this.video.src);
    }

    return this.trigger('stop');
  };

  return SayQRCode;

})();
