app.controller('loginCtrl', function($scope, $http, toaster,$location,myUser, $rootScope){
	

	/**************************************************************

							Function Declarations


	***************************************************************/
	
	/**
	 * scope function for logging in
	 * @param  {object} user user object with properties username and password
	 * @return {undefined} 
	 */
	$scope.login = function(user){
		console.log(user);
		$http({
				method:'POST',
				url: './api/login',
				data: user,
				headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
			}).success(function(res, status){
				if(status !== 200){
					console.log(res);
					toaster.pop('error', '', 'Fehler beim Loginvorgang.');
				}else{
					myUser.loginUser(res);
					$location.path('/voting');
				}
			}).error(function(err, status){
				console.log(toaster);
				toaster.pop('error', '', 'Fehler beim Loginvorgang.');
				console.log(err, status);
			});
		$scope.user = {};
	};

	/**
	 * scope function for sending registration form. 
	 * @param  {object} user user form for registration
	 * @return {undefined}      
	 */
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

	/**************************************************************

							Scope Init


	***************************************************************/

	$scope.user = {};
	$scope.register = false;
	$scope.new_user = {};

	$http({
		method:'GET',
		url: './api/member'
	}).success(function(res, status){
		if(status !== 200){
			console.log(res);
			toaster.pop('error', '', 'Fehler beim initialisieren der Mitgliederliste.');
		}else{
			$scope.members = res;
		}
	}).error(function(err, status){
		console.log(toaster);
		toaster.pop('error', '', 'Fehler beim Zugriff auf Server.');
		console.log(err, status);
	});
});