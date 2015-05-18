# OKHealth Mobile App

This project uses cordova (v4.2) to build native applications in common languages
such as html and javascript. Currently only Android devices running
SDK v19 and above are supported.

All functionality is based off of services provided by the website, aka the API
endpoint. That being said should the API endpoint change, you must update the
'ApiEndpoint' variable found in app-bootstrap.js to reflect the new url.

It is also important to note that this program was build using LESS CSS. Any
changes should be made to the less files and recompiled.

To get started:

    $ cordova platform add android
    $ npm install gulp --save-dev
    $ npm install gulp-less gulp-jshint gulp-sequence gulp-copy gulp-concat culp-minify-css --save-dev
    $ gulp
    
In a new terminal:

    $ ripple emulate


