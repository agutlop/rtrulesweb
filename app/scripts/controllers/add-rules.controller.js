'use strict';

/**
 * @ngdoc function
 * @name rtruleswebApp.controller:AddRulesController
 * @description
 * # AddRulesController
 * Controller of the rtruleswebApp
 */
angular.module('rtruleswebApp')
  .controller('AddRulesController', function () {
    
    this.operatorsVisible = false;

    this.operators = [
      {value: 'AND', description: 'AND'},
      {value: 'OR', description: 'OR'}
    ];

    this.selectedOperator = {value: -1, description: 'Operador'};

    this.showTypes = function() {
      this.typesVisible = true;
      this.operatorsVisible = true;
    };

    this.types = [
      {value: '1', description: 'Condición'},
      {value: '2', description: 'Expresión'}
    ];

    this.typesVisible = false;

    this.json = {
    '_id' : '1',
    'topic' : 'topic-prueba',
    'desc' : 'regla de prueba 1',
    'stage' : 'punto de aplicacion en el stream',
    'flag' : true,
    'user' : 'yomismo',
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

    this.result = [];

    this.jsonToArray = function() {
      this.result = [];
      this.recursive(this.json.cond);
    };

    this.recursive = function(item) {
      if (item.op === 'LEAF') {
        this.result.push('(');
        this.result.push(item.leaf.field + ' ' + item.leaf.operador + ' ' + item.leaf.value);
        this.result.push(')');
      } else {
        if (item.conns) {
          this.result.push('(');
          this.recursive(item.conns[0]);
          this.result.push(item.op);
          this.recursive(item.conns[1]);
          this.result.push(')');
        } 
      }
    };

    this.jsonToArray();

  });
