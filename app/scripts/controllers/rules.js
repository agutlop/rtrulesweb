'use strict';

/**
 * @ngdoc function
 * @name rtruleswebApp.controller:RulesCtrl
 * @description
 * # RulesCtrl
 * Controller of the rtruleswebApp
 */
angular.module('rtruleswebApp')
  .controller('RulesCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var vm = this;

    //cabecera de la regla
    vm.newRule = {
      'topic' : '',
      'desc' : '',
      'stage' : '',
      'flag' : true,
      'user' : 'default user'
    };
    //arbol de condiciones de la regla
    vm.newCond = {};

    /////para mostrar la regla en formato texto
    vm.result = [];

    vm.jsonToArray = function() {
      vm.result = [];
      vm.recursive(vm.newCond);
    };

    vm.recursive = function(item) {
      if (item.op === 'LEAF') {
        vm.result.push('(');
        vm.result.push(item.leaf.field + ' ' + item.leaf.op + ' ' + item.leaf.value);
        vm.result.push(')');
      } else {
        if (item.conns) {
          vm.result.push('(');
          vm.recursive(item.conns[0]);
          vm.result.push(item.op);
          vm.recursive(item.conns[1]);
          vm.result.push(')');
        }
      }
    };
    /////Fin regla en formato texto


    //añade una nueva hoja al arbol de condiciones newCond
    vm.addCondition = function(operador, field, value, tipo){
      console.log('-->' + operador + ' ' + field + ' ' + value + ' ' + tipo);

      var newLeaf = {
        'op' : 'LEAF',
        'conns': [],
        'leaf': {
          'op': operador,
          'field': field,
          'value': value,
          'tipo': tipo
        }
      };

      vm.newCond = newLeaf;
      vm.jsonToArray();
    };




    //obtener de base de datos dependiendo del topic y stage seleccionado
    vm.stageFields = [{'name':'campo1','typ':'String'},{'name':'campo2','typ':'Integer'}];

    //obtener de base de datos las posibles condiciones a aplicar dependiendo del tipo de campo
    //Meterlo en un map para recogerlo desde la web
    vm.fieldConditions = [
      {"tipo":"String","oper":[{"cod":"==","desc":"igual a"},{"cod":"!=","desc":"distinto de"}]},
      {"tipo":"Integer","oper":[{"cod":"==","desc":"igual a"},{"cod":"!=","desc":"distinto de"},{"cod":">","desc":"mayor que"},{"cod":"<","desc":"menor que"}]}
    ];
    vm.fieldConditionsMap = [];
    vm.fieldConditionsMap["String"] = vm.fieldConditions[0];
    vm.fieldConditionsMap["Integer"] = vm.fieldConditions[1];


    vm.json = {
      'cond' : {
        'op' : 'AND1',
        'conns' : [
          {
            'op' : 'AND2',
            'conns' : [
              {
                'op' : 'LEAF',
                'leaf' : {
                  'operador' : '==',
                  'field' : 'campo1',
                  'value' : '22',
                  'tipo' : 'Integer'
                }
              },
              {
                'op' : 'LEAF',
                'leaf' : {
                  'operador' : '==',
                  'field' : 'campo2',
                  'value' : 'valor2',
                  'tipo' : 'String'
                }
              }
            ]
          },
          {
            'op' : 'LEAF',
            'leaf' : {
              'operador' : '!=',
              'field' : 'campo3',
              'value' : 'valor3',
              'tipo' : 'String'
            }
          }
        ]
      }
    };


  });
