'use strict';

/**
 * @ngdoc function
 * @name rtruleswebApp.controller:resultsCtrl
 * @description
 * # resultsCtrl
 * Controller of the rtruleswebApp
 */
angular.module('rtruleswebApp')
  .controller('ResultsCtrl', function ($http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var vm = this;

    vm.dbTopics = [];
    vm.selectedTopic = -1;

    //obtencion de los topics de BD
    $http.get("/app/topics")
      .then(function(response) {
        // console.log(response.data);
        vm.dbTopics = response.data;
      });
  });
