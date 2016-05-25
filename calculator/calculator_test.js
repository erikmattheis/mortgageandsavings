'use strict';

describe('myApp.calculator module', function() {

  beforeEach(module('myApp.calculator'));

  describe('calculator controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var calculatorCtrl = $controller('CalculatorCtrl');
      expect(calculatorCtrl).toBeDefined();
    }));

  });
});