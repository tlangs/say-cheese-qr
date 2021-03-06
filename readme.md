Say Cheese! - QR Code Edition
===========
A minimal library for integrating webcam snapshots and QR code decoding into your app. It uses `getUserMedia`, a recent API for
accessing audio and video in the browser. This project is a fork of the wonderful [**Say Cheese!**](https://github.com/leemachin/say-cheese) project for camera access
 and utilizes LazarSoft's [**jsqrcode**](https://github.com/LazarSoft/jsqrcode) library to decode QR codes

[**Demo**](http://tlangs.github.io/say-cheese-qr/)

*If you don't care about snapshots and browser incompatibilities, like `Promises`, and just want an easy way to get at the webcam and mic, check out [Sound and Vision](https://github.com/leemachin/sound-and-vision).*

Setup
-----
Grab the JS, host it, and add it to your page. For example:

```html
<script src='/assets/js/say-cheese-qr.js'></script>
```

Usage
-----

Say Cheese exposes a minimal, event based API:

```javascript
var sayQR = new SayQRCode('#container-element', { snapshots: true });

sayQR.on('start', function() {
 // do something when started
 this.takeSnapshot();
});

sayQR.on('error', function(error) {
 // handle errors, such as when a user denies the request to use the webcam,
 // or when the getUserMedia API isn't supported
});

sayQR.on('snapshot', function(snapshot) {
  // do something with a snapshot canvas element, when taken
});

sayQR.start();

sayQR.start(320);
  // start the video with a height of 320 pixels
```

Reading QR Codes
----------------

After initializing, you can start reading QR Codes by calling
`startQrRead(int)`:

```javascript
sayQr.on('qrReadSuccess', function(data) {
    // Do something with the data.
  });
  
sayQr.start();
sayQr.startQrRead(1000); // try to decode the image every 1 second.
```

To stop reading the QR codes, just call 
`sayQR.stopQrRead()`.

Taking snapshots
----------------

You can take a snapshot at any time after initialisation, by calling
`takeSnapshot()`:

```javascript
sayQR.on('snapshot', function(snapshot) {
  // do something with the snapshot
});

sayQR.takeSnapshot();
```

If you need to change the size of the snapshot created, pass in the new width and height as arguments:

```javascript
var width = 640, height = 480;
sayQR.takeSnapshot(width, height);
```

It defaults to the full size of the video (generally `640x480`) if the arguments are omitted.

I don't want snapshots; just give me the video!
-----------------------------------------------

No problem. Just disable it when you first create the instance:

```javascript
var sayQR = new SayCheese('#container-element', { snapshots: false });
```

Note that when you do this, `takeSnapshot()` will not do anything.

Stopping the show
-----------------

There's also a function to stop the webcam after loading it up:

```javascript
sayQR.on('stop', function() {
  // do something when it's stopped
});
sayQR.stop();
```

Audio support
-------------

Audio's disabled by default, because it doesn't have full browser support. You can still enable it
for browsers that do support it, though. Just set `audio` to true when setting up.

```javascript
var sayQR = new SayQRCode('#container-element', { audio: true });
```

This will request access to the microphone, and will currently pipe the audio through to your
output device.

This is supported on the desktop in:

- Google Chrome
- Firefox 25+
- Latest Opera

Mobile device support is untested, so your mileage may vary.

Resources, things using Say Cheese, etc.
----------------------------------------

[getUserMedia on the server, with Sinatra and Say Cheese](http://blog.new-bamboo.co.uk/2012/11/23/getusermedia-on-the-server-with-sinatra-and-say-cheese)

If you have any useful resources, or things you did with Say Cheese
that you think should be shown off, by all means open a pull request
or an issue or whatever.


Tests
-----

Some basic tests cover the callback functionality. They were written
to be run in a browser that supports the `getUserMedia` API. Due to
the nature of that API, there is no automation for allowing or denying
the request, so it has to be done manually for each one.

Compatibility
-------------

**Tested and verified to work in:**

- Firefox
- Google Chrome
- Opera

License
-------

> Copyright (C) 2014 Trevyn Langsford
>
> Permission is hereby granted, free of charge, to any person obtaining
> a copy of this software and associated documentation files (the
> "Software"), to deal in the Software without restriction, including
> without limitation the rights to use, copy, modify, merge, publish,
> distribute, sublicense, and/or sell copies of the Software, and to
> permit persons to whom the Software is furnished to do so, subject to
> the following conditions:
>
> The above copyright notice and this permission notice shall be
> included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
> EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
> MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
> NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
> LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
> OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
> WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
