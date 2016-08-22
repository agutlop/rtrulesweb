'use strict';

/**
 * @ngdoc function
 * @name rtruleswebApp.controller:ConnectorsCtrl
 * @description
 * # ConnectorsCtrl
 * Controller of the rtruleswebApp
 */
angular.module('rtruleswebApp')
  .controller('ConnectorsCtrl', function ($http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var vm = this;

    vm.newconnector = {'tipo' : '', 'desc' : '', 'conds' : 0, 'leaf' : 0};
    vm.dbconnectors = [];


    //obtencion de los conectores de BD
    $http.get("/app/connectors")
      .then(function(response) {
        console.log(response.data);
        vm.dbconnectors = response.data;
      });

    vm.refreshConnectors = function(){
      $http.get("/app/connectors")
        .then(function(response) {
          console.log(response.data);
          vm.dbconnectors = response.data;
        });
    };


    //no debe haber valores en blanco ni debe estar repetido
    this.saveConnector = function () {

      var lastError = '';
      var valid = true;
      vm.newconnector.tipo = vm.newconnector.tipo.trim();
      vm.newconnector.desc = vm.newconnector.desc.trim();

      //validamos el nombre y descripcion
      if(vm.newconnector.tipo === '' || vm.newconnector.desc === '')
      {
        valid = false;
        lastError = 'ERROR: Los campos son obligatorios';
      }
      //combrobamos que ya no exista
      if(valid){
        vm.dbconnectors.forEach(function (dbconn) {
          if(valid && (dbconn.tipo === vm.newconnector.tipo || dbconn.desc === vm.newconnector.desc)){
            valid = false;
            lastError = 'ERROR: Ya existe un connector con este mismo nombre o tag';
          }
        });
      }

      if(!valid){
        vm.showError(lastError);
      }else{
        $http.post("/app/connector",vm.newconnector)
          .then(function() {
              vm.showSuccess("Nuevo Connector dado de alta correctamente");
              vm.refreshConnectors();
              vm.newconnector = {'tipo' : '', 'desc' : '', 'conds' : 0, 'leaf' : 0};
            },function( data) {
              vm.showError("ERROR: Error al dar de alta el nuevo Connector: " + data.statusText);
            }
          );
      }
    };

    vm.showError = function(message) {
      $('#alert_placeholder').html('<div class="alert alert-danger"><a class="close" data-dismiss="alert">×</a><span>'+message+'</span></div>');
    };
    vm.showSuccess = function(message) {
      $('#alert_placeholder').html('<div class="alert alert-success"><a class="close" data-dismiss="alert">×</a><span>'+message+'</span></div>');
    };


  });
