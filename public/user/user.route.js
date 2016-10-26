(function () {
	'use strict'
	
	angular.module('App.user')
			.config(userConfig);

	function userConfig($routeProvider) {
		$routeProvider
			.when('/user', {
				controller: 'UserController',
				controllerAs: 'uc',
				templateUrl: 'view/user/template/user.template.html'
			});
	}

})();