'use strict';

// Front end link to backed AccordionRowRoutes
angular.module('core').factory('Core', [ '$http', '$localStorage', '$timeout', function ($http, $localStorage, $timeout) {	
	return {
		rows: [ ],
		alerts: [ ],

		needsInit: true,
		
		/** Load rows from the database and setup $scope */
		init: function($scope) {
			// Setup scope
			if (!$scope) throw 'Missing $scope object';
			else this.setupScope($scope);

			// After making public to scope, don't need the reset
			if (!this.needsInit) return;
			else this.needsInit = false;

			// Init functions
			this.acceptTerms();
			
			// Load rows from database
			var _this = this;
			$http.get('/rows')
				.success(function (data) {
					for (var i = 0; i < data.length; i++) {
						var row = data[i];
						if (row.isAlert) _this.addAlert(row);
						else _this.addLastRow(row);
					}
				})
				.error(function(err) {
					$scope.error = err.message;
					console.log('An error has occured! ' + err);
				});
		},

		setupScope: function($scope) {
			for (var key in this) {
				if (!key.startsWith('_')) {
					if (!$scope[key]) {
						$scope[key] = this[key];
					} else {
						console.log('Tried to override ' + key + ' in $scope');
					}
				}
			}
		},

		acceptTerms: function() {
			if (!$localStorage.accept_terms) {
				this.addAlert({ _id: 'accept_terms', type: 'info', content: { 
					text: 'By using Voterrific you are agreeing to our <a href="/terms_of_use">Terms of Use</a> and <a href="/privacy_policy">Privacy Policy</a>. We use cookies to improve the user experience, and use social profile logins to save you the trouble of making <i>yet another</i> account.'
				} });
			}
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
			var idx = this.indexOfRow(rowAfter);
			this.rows.splice(idx + 1, 0, rowToAdd);
		},
		
		/** Remove a given row */
		removeRow: function(row) {
			var idx = this.indexOfRow(row);
			if (idx >= 0) this.rows.splice(idx, 1);
		},
		
		/** Return true if the given row is found in the rows array */
		hasRow: function(row) {
			return this.indexOfRow(row) >= 0;
		},
		
		/** Get the index of the given row in the rows array, or -1 if not found */
		indexOfRow: function(row) {
			for (var i = 0; i < this.rows.length; i++) {
				if (this.rows[i]._id === row._id) {
					return i;
				}
			}
			
			return -1;
		},
		
		/** Add an alert to the top of the alert array */
		addAlert: function(alert) {
			this.alerts.push(alert);
		},
		
		/** Run animation to hide alert, then remove from the alerts array */
		removeAlert: function(alert) {
			var idx = this.indexOfAlert(alert),
				_this = this;
				
			alert.collapse = true;
			this.onCloseAlert(alert._id);
			
			var promise = $timeout(function() {
				_this.alerts.splice(idx, 1);				
				$timeout.cancel(promise);
			}, 2000);
		},
		
		/** Return true if the given alert is found in the alerts array */
		hasAlert: function(alert) {
			return this.indexOfAlert(alert) >= 0;
		},

		/** Called when an alert is closed. Passed the alert's id */
		onCloseAlert: function(id) {
			switch (id) {
				case 'accept_terms':
					$localStorage.accept_terms = true;
					break;
			}
		},
		
		/** Get the index of the given alert in the alerts array, or -1 if not found */
		indexOfAlert: function(alert) {
			for (var i = 0; i < this.alerts.length; i++) {
				if (this.alerts[i]._id === alert._id) {
					return i;
				}
			}
			
			return -1;
		}
	};
}]);
