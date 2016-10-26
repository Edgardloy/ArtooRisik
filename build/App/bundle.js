(function(){
  'use strict';

  var App = angular.module('App',[
  	'ngRoute',

  	'App.user'
  ]);
  
 })();

(function () {
	'use strict';
	
	angular.module('App.user', [])

})();
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
(function () {
	'use strict'
	
	angular.module('App.user')
			.controller('UserController', UserController);

	UserController.$inject = [];

	function UserController() {
		var uc = this;

	}



})();
//# sourceMappingURL=build/App/bundle.js.map
