'use strict';

/**
 * @ngdoc function
 * @name rtruleswebApp.controller:TypesCtrl
 * @description
 * # TypesCtrl
 * Controller of the rtruleswebApp
 */
angular.module('rtruleswebApp')
  .controller('TypesCtrl', function ($http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var vm = this;

    vm.newfield = {'tipo':'','oper':[{'cod':'','desc':''}]};
    vm.dbfields = [];

    //añade condicion
    vm.addCond = function() {
      vm.newfield.oper.push({'cod':'','desc':''});
    };

    //elimina condicion
    vm.removeCond = function() {
      vm.newfield.oper.pop();
    };

    //llamada a la API
    $http.get("/app/fieldtypes")
      .then(function(response) {
        console.log(response.data);
        vm.dbfields = response.data;
      });

    vm.refreshFieldTypes = function(){
      $http.get("/app/fieldtypes")
        .then(function(response) {
          console.log(response.data);
          vm.dbfields = response.data;
        });
    };

    //no debe haber valores en blanco ni debe estar repetido
    this.saveFieldType = function () {
      var valid = true;
      var lastError = '';
      vm.newfield.tipo = vm.newfield.tipo.trim();
      if(vm.newfield.tipo === '' || vm.newfield.oper.length === 0){
        console.log(vm.newfield);
        valid = false;
        lastError = "ERROR: Todos los campos deben estar informados";
      }
      else{
        vm.dbfields.forEach(
          function (reg) {
            if(reg.tipo === vm.newfield.tipo){
              valid = false;
              lastError = "ERROR: El Field Type " + vm.newfield.tipo + " ya existe";
            }
          }
        );
        if(valid){
          vm.newfield.oper.forEach(
            function(entry) {
              console.log(entry);
              if(entry.cod.trim() === '' || entry.desc.trim() === ''){
                valid = false;
                lastError = "ERROR: Todos los campos deben estar informados";
              }
            }
          );
        }
      }

      if(!valid){
        vm.showError(lastError);
      }else{
        $http.post("/app/fieldtype",vm.newfield)
          .then(function() {
              vm.showSuccess("Nuevo Field Type dado de alta correctamente");
              vm.refreshFieldTypes();
              vm.newfield = {'tipo': '', 'oper': [{'cod': '', 'desc': ''}]};
            },function( data) {
              vm.showError("ERROR: Error al dar de alta el nuevo FieldType: " + data.statusText);
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
