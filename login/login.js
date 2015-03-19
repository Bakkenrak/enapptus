var app = angular.module('loginApp', [
	'toaster'
	])
.controller('loginCtrl', function($scope, $http, toaster){
	
	/**
	 * scope function for logging in
	 * @param  {object} user user object with properties username and password
	 * @return {undefined} 
	 */
	$scope.login = function(user){
		console.log(user);
		$http({
				method:'POST',
				url: 'asdasdasd',
				data: user,
				headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
			}).success(function(res, status){
				if(status !== 200){
					console.log(res);
					toaster.pop('error', '', 'Fehler beim Loginvorgang.');
				}else{
					//store token
				}
			}).error(function(err, status){
				console.log(toaster);
				toaster.pop('error', '', 'Fehler beim Loginvorgang.');
				console.log(err, status);
			});
	};

	$scope.sendRegistration = function(user){
		console.log('send registration', user);
		$scope.registration_success = true;
	};



	/**
	 * scope function for switching between login and register form
	 * @param  {string} last_form_name name of last active form ('register' / 'login')
	 * @return {undefined}               
	 */
	$scope.switchForm = function(last_form_name){
		switch(last_form_name){
			case 'login':
				$scope.user = {};
				$scope.register = true;
				break;
			case 'register': 
				$scope.new_user = {};
				$scope.register = false;
				break;
			default:
				break;
		};
	};


	$scope.user = {};
	$scope.register = false;
	$scope.new_user = {};
});