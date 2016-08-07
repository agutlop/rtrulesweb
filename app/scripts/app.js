'use strict';

/**
 * @ngdoc overview
 * @name rtruleswebApp
 * @description
 * # rtruleswebApp
 *
 * Main module of the application.
 */
angular
  .module('rtruleswebApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/rules', {
        templateUrl: 'views/rules.html',
        controller: 'RulesCtrl',
        controllerAs: 'rules'
      })
      .when('/topics', {
        templateUrl: 'views/topics.html',
        controller: 'TopicsCtrl',
        controllerAs: 'topic'
      })
      .when('/types', {
        templateUrl: 'views/types.html',
        controller: 'TypesCtrl',
        controllerAs: 'types'
      })
      .when('/connectors', {
        templateUrl: 'views/connectors.html',
        controller: 'ConnectorsCtrl',
        controllerAs: 'connectors'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
