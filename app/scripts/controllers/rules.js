'use strict';

/**
 * @ngdoc function
 * @name rtruleswebApp.controller:RulesCtrl
 * @description
 * # RulesCtrl
 * Controller of the rtruleswebApp
 */
angular.module('rtruleswebApp')
  .controller('RulesCtrl', function ($http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var vm = this;

    //comprobar si el objeto esta vacio
    vm.isEmpty = function (myObject) {
      for(var key in myObject) {
        if (myObject.hasOwnProperty(key)) {
          return false;
        }
      }
      return true;
    };

    ///conectores que existen en la Base de Datos (nodos)
    vm.dbconnectors = [];
    //Topics que existen en la Base de Datos
    vm.dbTopics = [];
    //stages del topic actualmente seleccionado
    vm.topicSelected = vm.dbTopics[0];
    //stage seleccionado
    vm.stageSelected = [];
    //campos del stage
    vm.fieldsOfStage = [];

    vm.dbRules = [];

    //reglas en formato array de las reglas de bd
    vm.dbRulesCondition = [];

    //posibles condiciones a aplicar dependiendo del tipo de campo
    vm.fieldConditions = [];
    vm.fieldConditionsMap = [];

    //cabecera de la regla
    vm.newRule = {
      'name': '',
      'topic' : '',
      'desc' : '',
      'stage' : '',
      'flag' : true,
      'user' : 'default_user',
      'cond' : {},
      'action': '',
      'actionFields':[""]
    };

    //condiciones en formato de array
    vm.newCondArray = [];
    vm.newNodeData = vm.newRule.cond;

    /////para mostrar la regla en formato texto
    vm.result = [];


    //indice de la regla a mostrar el arbol de condiciones en un modal
    vm.indexModalShowTree=0;
    vm.jsonToArrayText = function() {
      vm.result = [];
      vm.recursive(vm.newRule.cond);
    };

    vm.recursive = function(item) {
      if (item.op === 'LEAF') {
        vm.result.push('( ');
        vm.result.push(item.leaf.field + ' ' + item.leaf.operador + ' ' + item.leaf.value);
        vm.result.push(' )');
      } else {

        if (item.conns) {
          if(item.conns.length > 0) {
            vm.result.push('( ');
            item.conns.forEach(function (child) {
              vm.recursive(child);
              vm.result.push(item.op);
            });
            vm.result.pop();
            vm.result.push(' )');
          }else{
            vm.result.push('( ');
            vm.result.push('  ' + item.op + '  ');
            vm.result.push(' )');
          }
        }
      }
    };
    /////Fin regla en formato texto


    vm.clearRuleData = function () {
      vm.clearTree();
      vm.newRule = {
        'name': '',
        'topic' : '',
        'desc' : '',
        'stage' : '',
        'flag' : true,
        'user' : 'default user',
        'cond' : {},
        'action': '',
        'actionFields':[""]
      };

    };

    //limpia el arbol de condiciones
    vm.clearTree = function () {
      vm.newRule.cond = {};
      vm.newNodeData = vm.newRule.cond;
      vm.jsonToArrayText();
      vm.newCondArray = vm.jsonToArray(vm.newRule.cond);
      vm.currentElement = {};
    };

    //elimina los elementos de un nodo
    vm.removeElement = function () {
      vm.newNodeData.conns.splice(0,vm.newNodeData.conns.length);
      vm.newNodeData = {};
      vm.jsonToArrayText();
      vm.newCondArray = vm.jsonToArray(vm.newRule.cond);
    };

    //almacena el nodo actual
    vm.saveDataNode = function (data) {
      vm.newNodeData = data;
    };

    //añade en el nodo actual un nuevo nodo
    vm.addNode = function (tipo) {
      var newNode = {'op':tipo, 'conns':[]};
      if(!vm.isEmpty(vm.newRule.cond)){
        vm.newNodeData.conns.push(newNode);
      }
      else{
        vm.newRule.cond = newNode;
      }
      vm.newNodeData = {};
      vm.jsonToArrayText();
      vm.newCondArray = vm.jsonToArray(vm.newRule.cond);
    };

    //añade una nueva hoja al arbol de condiciones newCond
    vm.addCondition = function(operador, field, value, tipo){
      console.log('-->' + operador + ' ' + field + ' ' + value + ' ' + tipo);

      var newLeaf = {
        'op' : 'LEAF',
        'conns': [],
        'leaf': {
          'operador': operador,
          'field': field,
          'value': value,
          'tipo': tipo
        }
      };

      if(!vm.isEmpty(vm.newRule.cond)){
        vm.newNodeData.conns.push(newLeaf);
      }
      else{
        vm.newRule.cond = newLeaf;
      }
      vm.newNodeData = {};
      vm.jsonToArrayText();
      vm.newCondArray = vm.jsonToArray(vm.newRule.cond);
    };


    vm.leafToString = function (leaf) {
      return leaf.field + ' ' + leaf.operador + ' ' + leaf.value;
    };


    //almacenamos el arbol de condiciones como un array para poder mostrarlo y construirlo desde la web
    vm.jsonToArray = function (condTree) {
      function recursive(node, array, parent, index, level){
        console.log(array);
        if(vm.isEmpty(node))
        {
          array.push({'data':node, 'parent':parent, 'index':index, 'level': level});
        }
        else if(node.op === 'LEAF'){
          array.push({'data':node, 'parent':parent, 'index':index, 'level': level+1});
        }
        else{
          array.push({'data':node, 'parent':parent, 'index':index, 'level': level+1});//nodo vacio sin leaf
          node.conns.forEach(function (cond,index) {
            recursive(cond, array, node, index, level+1);
          });
          array.push({'data':{'op':'END'}});
        }
      }

      var array = [];
      recursive(condTree, array, null, null, 0);
      return array;
    };
    vm.newCondArray = vm.jsonToArray(vm.newRule.cond);
    vm.currentElement = {};

    //comprueba si el item pasado es igual al item a modificar actual
    vm.isCurrentElement = function (item) {
      if(item === vm.currentElement){
        return 'active';
      }
    };

    //almacena el elemento que se esta modificando
    vm.currentArrayElement = function (item) {
      vm.currentElement = item;
    };


    //elimina el elemento actual de la lista de conns del padre
    vm.removeArrayElement = function () {
      if(!vm.isEmpty(vm.currentElement) && vm.currentElement.parent !== null && vm.currentElement.index !== null){
        vm.currentElement.parent.conns.splice(vm.currentElement.index,1);
      }
      vm.newCondArray = vm.jsonToArray(vm.newRule.cond);
      vm.currentElement = {};
    };

    //añade en el nodo actual un nuevo nodo
    vm.addArrayNode = function (tipo) {
      var newNode = {'op':tipo, 'conns':[]};

      //si el arbol esta vacio, será el primer nodo
      if(vm.isEmpty(vm.newRule.cond)){
        vm.newRule.cond = newNode;
      }
      else {
        vm.currentElement.data.conns.push(newNode);
      }
      vm.jsonToArrayText();
      vm.newCondArray = vm.jsonToArray(vm.newRule.cond);
      vm.currentElement = {};
    };

    //formateo de fecha
    vm.validarFecha = function (fecha) {
        var RegExPattern = /^(((0[1-9]|[12]\d|3[01])[\/\.-](0[13578]|1[02])[\/\.-]((19|[2-9]\d)\d{2})\s(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]))|((0[1-9]|[12]\d|30)[\/\.-](0[13456789]|1[012])[\/\.-]((19|[2-9]\d)\d{2})\s(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]))|((0[1-9]|1\d|2[0-8])[\/\.-](02)[\/\.-]((19|[2-9]\d)\d{2})\s(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]))|((29)[\/\.-](02)[\/\.-]((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))\s(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])))$/g;
        //var RegExPattern = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
        if ((fecha.match(RegExPattern)) && (fecha!='')) {
          return true;
        } else {
          return false;
        }
    };

    //añade una nueva hoja al arbol de condiciones newCond
    vm.addArrayCondition = function(operador, field, value, tipo){
      console.log('-->' + operador + ' ' + field + ' ' + value + ' ' + tipo);


      if(vm.isEmpty(operador) || vm.isEmpty(field) || vm.isEmpty(value) || vm.isEmpty(tipo))
      {
        vm.showError("La condicion es incorrecta. Algun campo esta vacio");
        return;
      }
      if(tipo === "Date" && !vm.validarFecha(value))
      {
        vm.showError("El formato de la fecha es incorrecta. Formato: dd/mm/yyyy");
        return;
      }

      var newLeaf = {
        'op' : 'LEAF',
        'conns': [],
        'leaf': {
          'operador': operador,
          'field': field,
          'value': value,
          'tipo': tipo
        }
      };
      //si el arbol esta vacio, será el primer nodo
      if(vm.isEmpty(vm.newRule.cond)){
        vm.newRule.cond = newLeaf;
        vm.currentElement = {};
      }else{
        vm.currentElement.data.conns.push(newLeaf);
      }
      vm.jsonToArrayText();
      vm.newCondArray = vm.jsonToArray(vm.newRule.cond);
      vm.currentElement = {};
    };

    vm.leafToString = function (leaf) {
      return leaf.field + ' ' + leaf.operador + ' ' + leaf.value;
    };


    //guardar regla en BD
    vm.saveRule = function () {

      //todos los campos deben estar informados
      var lastError = '';
      var valid = true;

      //validamos el nombre y descripcion
      if(vm.newRule.name === '' || vm.newRule.topic === '' || vm.newRule.desc === '' || vm.newRule.stage === '' || vm.newRule.user === '' || vm.isEmpty(vm.newRule.cond))
      {
        valid = false;
        lastError = 'ERROR: Todos los campos son obligatorios';
      }
      if(vm.isEmpty(vm.newRule.cond))
      {
        valid = false;
        lastError = 'ERROR: Es necesario introducir un arbol de condiciones';
      }
      //combrobamos que ya no exista
      if(valid){
        vm.dbRules.forEach(function (dbrule) {
          if(valid && dbrule.name === vm.newRule.name){
            valid = false;
            lastError = 'ERROR: Ya existe una regla con este mismo nombre';
          }
        });
      }

      //validamos que la condicion este correctamente construida
      if(valid && !vm.validarCondicion(vm.newRule.cond)){
        valid = false;
        lastError = 'ERROR: Arbol de condiciones incorrecto. Todos los nodos deben tener al menos una condicion';
      }
      //validamos la accion
      if(valid && (vm.newRule.action !== 'FIELDS' && vm.newRule.action !== 'MESSAGE' && vm.newRule.action !== 'LITERALS')){
        valid = false;
        lastError = 'ERROR: La acción de la regla no es correcta';
      }
      //validamos la accion
      if(valid){
        if(vm.newRule.action === 'FIELDS') {
          if (vm.newRule.actionFields.length === 0)
          {
            valid = false;
            lastError = 'ERROR: Es necesario indicar algun campo a guardar en la accion';
          }
          else {
            var ind;
            for (ind in vm.newRule.actionFields) {
              if (vm.newRule.actionFields[ind] === "") {
                valid = false;
                lastError = 'ERROR: Algun campo indicado para guardar esta vacio';
              }
            }
          }
        }
        else if (vm.newRule.action === 'LITERALS')
        {
          if(vm.newRule.actionFields.length === 0 || vm.newRule.actionFields[0] === ""){
            valid = false;
            lastError = 'ERROR: Es necesario indicar el literal a guardar';
          }
        }


      }

      if(!valid){
        vm.showError(lastError);
      }else{
        $http.post("/app/rule",vm.newRule)
          .then(function() {
              vm.showSuccess("Nueva regla dada de alta correctamente");
              vm.refreshRules();
              vm.clearRuleData();
              //vm.newRule = {'name': '', 'topic' : '', 'desc' : '', 'stage' : '', 'flag' : true, 'user' : 'default user', 'cond' : {} };
            },function( data) {
              vm.showError("ERROR: Error al dar de alta el nuevo Topic: " + data.statusText);
            }
          );
      }
    };


    //funcion que valida el arbol de condiciones a almacenar
    vm.validarCondicion = function (tree) {
      console.log(tree);
      if(tree.op === 'LEAF' && vm.isEmpty(tree.leaf)){
        //no tiene condicion(esto no deberia pasar..)
        return false;
      }
      else if(tree.op === 'LEAF' && !vm.isEmpty(tree.leaf)){
        return true;
      }
      else if(tree.op !== 'LEAF' && tree.conns.length === 0){
        return false;
      }
      else if(tree.op !== 'LEAF' && tree.conns.length > 0) {
        var i;
        for (i in tree.conns) {
          console.log(i);
          if(vm.validarCondicion(tree.conns[i]) === false){
            return false;
          }
        }
      }
      return true;
    };

    //inserta un elemento en actionFields de la nueva regla
    vm.addActionField = function(){
      if(vm.newRule.actionFields[vm.newRule.actionFields.length - 1] !== "") {
        vm.newRule.actionFields.push("");
      }
    };

    vm.removeActionField = function(){
      vm.newRule.actionFields.pop();
    };

    vm.clearActionFields = function () {
      vm.newRule.actionFields = [""];
    };

    vm.actionToString = function (index) {
      if(vm.dbRules[index].action === "MESSAGE")
      {
        return "Save complete message";
      }
      else if(vm.dbRules[index].action === "LITERALS")
      {
        return "Save literal: " + vm.dbRules[index].actionFields[0];
      }
      else if(vm.dbRules[index].action === "FIELDS")
      {
        return "Save fields: " + vm.dbRules[index].actionFields;
      }
    };

    vm.quitarActionFieldRepetidos = function() {
      var last = vm.newRule.actionFields[vm.newRule.actionFields.length-1];
      var count = 0;
      var ind;
      for(ind in vm.newRule.actionFields)
      {
        if(last === vm.newRule.actionFields[ind]){
          count = count +1 ;
        }
      }
      if(count > 1){
        vm.newRule.actionFields.pop();
        vm.newRule.actionFields.push("");
      }

    };



    //vuelve a recuperar las reglas almacenadas
    vm.refreshRules = function(){
      $http.get("/app/rules")
        .then(function(response) {
          console.log(response.data);
          vm.dbRules = response.data;
          //guardamos las condiciones en formato array para cada regla
          vm.dbRules.forEach(function (rule, index) {
            vm.dbRulesCondition[index] = vm.jsonToArray(rule.cond);
          });
        });
    };

    //obtencion de las rules de BD
    $http.get("/app/rules")
      .then(function(response) {
      // console.log(response.data);
        vm.dbRules = response.data;

        //guardamos las condiciones en formato array para cada regla
        vm.dbRules.forEach(function (rule, index) {
          vm.dbRulesCondition[index] = vm.jsonToArray(rule.cond);
        });
      });




    $http.get("/app/fieldtypes")
      .then(function(response) {
       // console.log(response.data);
        vm.fieldConditions = response.data;
        vm.fieldConditionsMap = {};
        //actualizamos el map de condiciones
        vm.fieldConditions.forEach(function (field) {
         // console.log(field);
          vm.fieldConditionsMap[field.tipo] = field;
        });
      });



    /////////TOPICS Y STAGES
    //obtencion de los topics de BD
    $http.get("/app/topics")
      .then(function(response) {
        // console.log(response.data);
        vm.dbTopics = response.data;
      });

    //seleccion del topic.
    //    Asigna el nombre del topic a la nueva regla
    //    guarda los stages del topic seleccionado para el combo de stages
    //resetea todos las colecciones rellenas
    vm.topicSelection = function() {
      vm.stagesOfTopic = vm.topicSelected.stages;
      vm.newRule.topic = vm.topicSelected.topic;
      vm.newRule.stage = '';
      vm.fieldsOfStage = [];
    };

    //seleccion del stage.
    //    Asigna el nombre del stage a la nueva regla
    //    guarda los campos del stage seleccionado
    vm.stageSelection = function() {
      if(vm.stageSelected !== null) {
        vm.fieldsOfStage = vm.stageSelected.fields;
        vm.newRule.stage = vm.stageSelected.stage;
      }
    };




    /////////CONECTORS
    //obtencion de los conectores de BD
    $http.get("/app/connectors")
      .then(function(response) {
        //console.log(response.data);
        vm.dbconnectors = response.data;
      });

    vm.refreshConnectors = function(){
      $http.get("/app/connectors")
        .then(function(response) {
          //console.log(response.data);
          vm.dbconnectors = response.data;
        });
    };


    vm.showError = function(message) {
      $('#alert_placeholder').html('<div class="alert alert-danger"><a class="close" data-dismiss="alert">×</a><span>'+message+'</span></div>');
    };
    vm.showSuccess = function(message) {
      $('#alert_placeholder').html('<div class="alert alert-success"><a class="close" data-dismiss="alert">×</a><span>'+message+'</span></div>');
    };

  });
