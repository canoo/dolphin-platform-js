/*jslint browserify: true */
"use strict";

module.exports.exists = function (object) {
    return typeof object !== 'undefined' && object !== null;
};
