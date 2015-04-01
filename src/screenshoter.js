"use strict";

var Promise = require("nodegit-promise");
var phantom = require('phantom');

module.exports = {

  createScreenshot: function (ph, dashboard, options) {
    return new Promise(function (resolve, fail) {
      ph.createPage(function (page) {
        page.set('viewportSize', { width: options.pageWidth, height: options.pageHeight });
        page.open(dashboard, function (status) {
          console.log("Opened ", dashboard, status);
          if (status === "success") {
            setTimeout(function () {
              page.renderBase64('PNG', function (base64) {
                resolve({ url: dashboard, capture: base64, date: new Date().toJSON() });
              });
            }, options.renderingWaitTime);
          } else {
            fail("Impossible to open " + dashboard);
          }
        });
      });
    });
  },

  createScreenshots: function (dashboards, options) {
    var that = this;
    return new Promise(function (resolve, fail) {
      phantom.create("--ignore-ssl-errors=yes", "--ssl-protocol=any", function (ph) {
        var promises = dashboards.map(function (dashboard) {
          return that.createScreenshot(ph, dashboard, options);
        });
        Promise.all(promises).then(function (screenshots) {
          resolve(screenshots);
          ph.exit();
        }).catch(function (err) {
          fail(err);
        });
      });
    });
  }

};