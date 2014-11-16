'use strict';

/**
 * Factory that handle notification
 */
angular.module('twitteriverApp').factory('logger', function () {
    toastr.options = {
        closeButton: !0,
        positionClass: 'toast-bottom-right',
        timeOut: '3000'
    };
    var logIt = function (message, type, title) {
        return toastr[type](message, title);
    };
    var logs = {
        log: function (message, title) {
            logIt(message, 'info', title);
        },
        logWarning: function (message, title) {
            logIt(message, 'warning', title);
        },
        logSuccess: function (message, title) {
            logIt(message, 'success', title);
        },
        logError: function (message, title) {
            logIt(message, 'error', title);
        }
    };
    return logs;
});