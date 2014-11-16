'use strict';

/**
 * @ngdoc overview
 * @name twitteriverApp
 * @description
 * # twitteriverApp
 *
 * Main module of the application.
 */
angular
  .module('twitteriverApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'wall',
    'infinite-scroll'  
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/wall', {
        templateUrl: 'views/wall.html',
        controller: 'WallCtrl'
      })
    .when('/',{
        templateUrl: 'views/home.html'
      })
      .otherwise({
        redirectTo: '/404.html'
      });
  });

