'use strict';

angular.module('voterrificFilters', [])
	.filter('sumObject', function() {
		return function(input, entryKey) {
			if (typeof input !== 'object') throw new Error('Input for sumObject filter must be an object!');

			var sum = 0;
			for (var key in input) {
				sum += parseFloat(entryKey ? input[key][entryKey] : input[key]);
			}

			return sum;
		};
	});