# <img src="https://raw.githubusercontent.com/Rekord/rekord/master/images/rekord-color.png" width="60"> rekord-jquery

[![Build Status](https://travis-ci.org/Rekord/rekord-jquery.svg?branch=master)](https://travis-ci.org/Rekord/rekord-jquery)
[![devDependency Status](https://david-dm.org/Rekord/rekord-jquery/dev-status.svg)](https://david-dm.org/Rekord/rekord-jquery#info=devDependencies)
[![Dependency Status](https://david-dm.org/Rekord/rekord-jquery.svg)](https://david-dm.org/Rekord/rekord-jquery)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Rekord/rekord/blob/master/LICENSE)
[![Alpha](https://img.shields.io/badge/State-Alpha-orange.svg)]()

A rekord binding to jquery - implementing Rekord.rest.

The easiest way to install is by using bower via `bower install rekord-jquery`.

You can add global options to send to [$.ajax](http://api.jquery.com/jquery.ajax/) by modifying `Rekord.jQuery.options` or by overriding the `Rekord.jQuery.adjustOptions` function which is given `(options, database, method, model, data, url, success, failure)` and should be used to dynamically modify the options.

```javascript
// Add global options
Rekord.jQuery.options.username = 'John';
Rekord.jQuery.options.password = 'password#1';

// Add/override options dynamically
Rekord.jQuery.adjustOptions = function(options, database, method, model, data, url, success, failure) {
  if (database.name === 'todos' && model) {
    options.url = database.api + model.list_id + '/todos/' + model.$$key();
  }
};

// Override how options are processed
Rekord.jQuery.ajax = function(options) {
  $.ajax( options ); // default
};

// The class instantiated with a database instance that implements Rekord.rest
Rekord.jQuery.RestClass;

// The function which returns a Rekord.rest implementation given a database
// Normally Rekord.rest is the same value but multiple back-ends could be used
Rekord.jQuery.rest;
```
