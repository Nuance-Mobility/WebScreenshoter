"use strict";

var express = require('express');
var screenshoter = require('./screenshoter');

var PORT = 8080;

var DEFAULT_RENDERING_WAIT_TIME = 2 * 1000;

var DEFAULT_PAGE_WIDTH = 1024;
var DEFAULT_PAGE_HEIGHT = 768;

express().get('/', function (req, res) {
  var dashboards = [].concat(req.query.url);
  var options = {
    renderingWaitTime: req.query.waitTime || DEFAULT_RENDERING_WAIT_TIME,
    pageWidth: req.query.width || DEFAULT_PAGE_WIDTH,
    pageHeight: req.query.height || DEFAULT_PAGE_HEIGHT
  };
  if (dashboards.length > 0) {
    screenshoter.createScreenshots(dashboards, options).then(function (screenshots) {
      res.json(screenshots);
    }).catch(function (err) {
      res.status(500);
      res.send(err);
    });
  } else {
    res.json({});
  }
}).listen(PORT);
console.log('Running on http://localhost:' + PORT);
