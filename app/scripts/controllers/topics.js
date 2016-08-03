'use strict';

/**
 * @ngdoc function
 * @name rtruleswebApp.controller:TopicsCtrl
 * @description
 * # TopicsCtrl
 * Controller of the rtruleswebApp
 */
angular.module('rtruleswebApp')
  .controller('TopicsCtrl', function ($http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var vm = this;

    vm.newTopic = {'topic':'','desc':'','stages':[{'stage':'','desc':'','fields':[{'name':'','typ':''}]}]};
    vm.dbTopics = [];
    vm.fieldTypes = [];

    //añade stage
    vm.addStage = function() {
      vm.newTopic.stages.push({'stage':'',
        'desc':'',
        'fields':[
          {'name':'',
            'typ':''
          }]
      });
    };

    //elimina stage
    vm.removeStage = function(index) {
      vm.newTopic.stages.splice(index,1);
    };


    //añade field al stage actual
    vm.addField = function(index) {
      console.log(index);
      vm.newTopic.stages[index].fields.push({'name':'','typ':''});
    };

    //elimina field al stage actual
    vm.removeField = function(index) {
      console.log(index);
      vm.newTopic.stages[index].fields.pop();
    };

    //llamada a la API
    //Otencion de los tipos de campos
    $http.get("/app/fieldtypes")
      .then(function(response) {
        console.log(response.data);
        vm.fieldTypes = response.data.map( function(reg){
          return reg.tipo;
        });
      });

    //obtencion de los topics de BD
    $http.get("/app/topics")
      .then(function(response) {
        console.log(response.data);
        vm.dbTopics = response.data;
      });

    vm.refreshTopics = function(){
      $http.get("/app/topics")
        .then(function(response) {
          console.log(response.data);
          vm.dbTopics = response.data;
        });
    };

    //no debe haber valores en blanco ni debe estar repetido
    this.saveFieldType = function () {

      var lastError = '';
      var valid = true;
      vm.newTopic.topic = vm.newTopic.topic.trim();
      vm.newTopic.desc = vm.newTopic.desc.trim();

      //validamos el nombre y descripcion
      if(vm.newTopic.topic === '' || vm.newTopic.desc === '')
      {
        valid = false;
        lastError = 'ERROR: El nombre del topic y su descripcion son obligatorios';
      }
      //combrobamos que ya no exista
      if(valid){
        vm.dbTopics.forEach(function (dbtopic) {
          if(valid && dbtopic.topic === vm.newTopic.topic){
            valid = false;
            lastError = 'ERROR: Ya existe un topic con este mismo nombre';
          }
        });
      }
      //longitud de stages
      if(valid && vm.newTopic.stages.length === 0)
      {
        valid = false;
        lastError = 'ERROR: Debe existir al menos un stage';
      }

      //validamos que no haya stages repetidos
      var id = 0;
      var nombres = [];
      vm.newTopic.stages.forEach(function (stage) {
        if(nombres.indexOf(stage.stage.trim()) < 0){
          nombres.push(stage.stage.trim()) ;
        }
        id = id+1;
      });

      if(nombres.length !== id){
        valid = false;
        lastError = 'ERROR: no puede haber dos stages con el mismo nombre';
      }

      //validamos el contenido de cada stage
      if(valid){
        vm.newTopic.stages.forEach( function (stage) {
          if(valid && (stage.stage.trim() === '' || stage.fields.length === 0)){
            valid = false;
            lastError = 'ERROR: Los stages deben tener el nombre informado y, como mínimo, un campo';
          }
          //comprobamos que los campos del stage esten correctos
          if(valid){
            stage.fields.forEach( function (field) {
              if(valid && (field.name === '' || field.typ === '')){
                valid = false;
                lastError = 'ERROR: Los datos de los campos deben estar correctamente informados';
              }
            });
          }
        });
      }

      if(!valid){
        vm.showError(lastError);
      }else{
        $http.post("/app/topic",vm.newTopic)
          .then(function() {
              vm.showSuccess("Nuevo Topic dado de alta correctamente");
              vm.refreshTopics();
              vm.newTopic = {'topic':'','desc':'','stages':[{'stage':'','desc':'','fields':[{'name':'','typ':''}]}]};
            },function( data) {
              vm.showError("ERROR: Error al dar de alta el nuevo Topic: " + data.statusText);
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
