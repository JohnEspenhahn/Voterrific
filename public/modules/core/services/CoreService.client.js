'use strict';

// Front end link to backed AccordionRowRoutes
angular.module('core').factory('Core', [ '$http', function ($http) {	
	return {
		rows: [ ],
		
		/** Load rows from the database and setup $scope */
		init: function($scope) {
			if (!$scope) throw 'Missing $scope object';
			
			$scope.rows = this.rows;
			
			// Load rows from database
			var _this = this;
			$http.get('/rows')
				.success(function (data) {					
					// Add rows
					for (var i = 0; i < data.length; i++) {
						_this.rows.push(data[i]);
					}
				})
				.error(function (err) {
					$scope.error = err.message;
					console.log('An error has occured! ' + err);
				});
		},
		
		/** Minimize all the rows */
		minimizeAll: function() {
			for (var i = 0; i < this.rows.length; i++) {
				this.rows[i].isOpen = false;
			}
		},
		
		/** Add row to the start */
		addFirstRow: function(row) {
			this.rows.unshift(row);
		},
		
		/** Add row to the end */
		addLastRow: function(row) {
			this.rows.push(row);
		},
		
		/** Add a row after another row */
		addRowAfter: function(rowToAdd, rowAfter) {
			// TODO
		},
		
		/** Remove a given row */
		removeRow: function(row) {
			this.rows.splice(this.indexOfRow(row), 1);
		},
		
		indexOfRow: function(row) {
			for (var i = 0; i < this.rows.length; i++) {
				if (this.rows[i]._id === row._id) {
					return i;
				}
			}
			
			return -1;
		}
	};
}]);
