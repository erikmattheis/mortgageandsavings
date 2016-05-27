'use strict';

angular.module('myApp.calculator', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/calculator', {
    templateUrl: 'calculator/calculator.html',
    controller: 'CalculatorCtrl'
  });
}])

.controller('CalculatorCtrl', ['$scope', function($scope) {

	$scope.ageStart = 48;
	$scope.ageRetirement = 70;
	$scope.yearlyGrossIncome = 100000;
	$scope.taxRate = 28;
	$scope.savingsBeginningBalance = 80000;
	$scope.monthlyPretaxSavingsContribution = 916;
	$scope.monthlyPosttaxSavingsContribution = 0;
	$scope.afterTaxAndSavingsTowardsMortgage = 35;
	$scope.annualSavingsInterest = 6.5;
	$scope.retirementSpending = 60000;

	$scope.homeownersInsuranceRate = 1.5;
	$scope.propertyTaxRate = 5;
	$scope.mortgageInterest = 4;
	$scope.mortgageTerm = 30;
	$scope.downPayment = 0;
	$scope.monthlyMortgagePayment = 0;

	$scope.$watch("name", function(newValue, oldValue) {
		if ($scope.name.length > 0) {
			$scope.greeting = "Greetings " + $scope.name;
		}
	});


	$scope.estimatePrincipal = function() {
		var yearlyTaxableIncome = $scope.yearlyGrossIncome - ($scope.monthlyPretaxSavingsContribution * 12);
		var yearlyAfterTaxAndSavingsIncome = (yearlyTaxableIncome * (1 - ($scope.taxRate/100))) - ($scope.monthlyPosttaxSavingsContribution * 12);
		$scope.monthlyMortgagePayment = calculateMonthlyMortgagePayment(yearlyAfterTaxAndSavingsIncome);
		$scope.purchasePrice = calculateTotal($scope.monthlyMortgagePayment);
	}
	$scope.calculate = function() {

		$scope.results = [];

		var yearlyTaxableIncome = $scope.yearlyGrossIncome - ($scope.monthlyPretaxSavingsContribution * 12);
		var yearlyAfterTaxAndSavingsIncome = (yearlyTaxableIncome * (1 - ($scope.taxRate/100))) - ($scope.monthlyPosttaxSavingsContribution * 12);
		$scope.yearlyAfterTaxAndSavingsIncome = yearlyAfterTaxAndSavingsIncome;
		var savings = $scope.savingsBeginningBalance ;
		var savingsInterest = 1 + ($scope.annualSavingsInterest/100);

		
		var principal = calculateTotal($scope.monthlyMortgagePayment);
		$scope.principal = principal;
		//var mortgageInsurance = 
		for (var i = $scope.ageStart; i < $scope.ageRetirement || i <  $scope.ageStart + $scope.mortgageTerm || i < 91; i++) {
			var result = {};

			if (i <  $scope.ageStart + $scope.mortgageTerm) {
				result.mortgagePayments = $scope.monthlyMortgagePayment * 12;
				result.pitiPayments = result.mortgagePayments + ($scope.purchasePrice * $scope.propertyTaxRate / 100) + ($scope.purchasePrice * $scope.homeownersInsuranceRate / 100);
			}
			else {
				result.mortgagePayments = 0;
			}

			if (i < $scope.ageRetirement) {
				savings += ($scope.monthlyPretaxSavingsContribution * 12) + ($scope.monthlyPosttaxSavingsContribution * 12);
				result.savingsContribution = ($scope.monthlyPretaxSavingsContribution * 12) + ($scope.monthlyPosttaxSavingsContribution * 12);
			}
			else {
				
				result.savingsContribution = 0;
				savings -= $scope.retirementSpending;

				if (i <  $scope.ageStart + $scope.mortgageTerm) {
					savings -= $scope.monthlyMortgagePayment * 12;
					result.mortgagePaymentsFromSavings = $scope.monthlyMortgagePayment * 12;
				}
			}

			if (savings > 0) {
				savings *= savingsInterest;
			}
			
			result.savings = savings;
			result.principal = principal;
			$scope.results.push(result);

		}

	};

	$scope.calculate();

	function calculateMonthlyMortgagePayment(yearlyAfterTaxAndSavingsIncome) {
		return +(($scope.afterTaxAndSavingsTowardsMortgage/100) * (yearlyAfterTaxAndSavingsIncome / 12)).toFixed(2);
	}

	
  function pv(y,pmt,i) {
	return ( pmt / i * ( 1 - Math.pow( 1 + i, -y)) ) ;
  }

  function calculateTotal(monthlyMortgagePayment) {
	var apr = ($scope.mortgageInterest + $scope.homeownersInsuranceRate + $scope.propertyTaxRate) / 1200;
	var monthly = pv($scope.mortgageTerm * 12, monthlyMortgagePayment, apr);
	return +monthly.toFixed(2);;
  }



}]);

/*
  function FilmstripsController ($scope, $state, $timeout, Authentication, SlidesService, filmstrip) {
    var vm = this;

    vm.authentication = Authentication;
    vm.filmstrip = filmstrip;
    vm.slides = SlidesService.query(function() {
      vm.unusedSlides = getUnusedSlides();
    });
    vm.error = null;
    vm.form = {};
    vm.save = save;

    $scope.myInterval = 300;
*/