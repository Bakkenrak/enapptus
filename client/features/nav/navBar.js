app.controller('navBarCtrl', function($scope, $rootScope, $location, myUser, userApiFactory, $route, $http, $window){
	
	/**
	 * function for finding number of inactive users for displaying in navbar. 
	 * current user must be admin.
	 * @return {undefined} 
	 */
	var findInactiveUser = function(){
		if($scope.isAdmin){
			var count = 0;
			var userlist = userApiFactory.index();
			for (var i = userlist.length - 1; i >= 0; i--) {
				if(!userlist[i].is_active){
					count++;
				}
			};	
			$scope.numberInactive = count;
		};
	};

	$scope.logout = function(){
		$http({
				method:'GET',
				url: './api/logout'
			}).success(function(res, status){
				if(status !== 200){
					toaster.pop('error', '', 'Fehler beim Logoutvorgang.');
				}else{
					myUser.logoutUser();
					$location.path('/login');
				}
			}).error(function(err, status){
				toaster.pop('error', '', 'Fehler beim Logoutvorgang.');
			});
	}



	/** listener for route change. sets scope variable to curren route */
	$rootScope.$on('$locationChangeSuccess', function(event){
        $scope.currentRoute = '#'+$location.path();
	});

	/** listener for user.changed event. refreshes inactive user number */
	$scope.$on('user.changed', function(event, args){
		findInactiveUser();
	});
	/** listener for user.deleted event. refreshes inactive user number */
	$scope.$on('user.deleted', function(event, args){
		findInactiveUser();
	});

	$scope.$on('user.login', function(event, args){
		$scope.isAdmin = myUser.isAdmin();
		$scope.isLoggedIn = true;
	});
	$scope.$on('user.logout', function(event, args){
		$scope.isAdmin = false;
		$scope.isLoggedIn = false;
	});



	/**************************************************************

							Scope Init


	***************************************************************/

	angular.extend($scope, {
		isAdmin : myUser.isAdmin(),
		isLoggedIn: myUser.isLoggedIn(),
		navItems : [
			{
				name: 'Form Konfigurator',
				route: '#/formconfig',
				admin_only: $route.routes['/formconfig'].data.admin_only 
			},
			{
				name: 'Usermanagement',
				route: '#/usermanagement',
				admin_only: $route.routes['/usermanagement'].data.admin_only 
			},
			{
				name: 'Abstimmung',
				route: '#/voting',
				admin_only: $route.routes['/voting'].data.admin_only 
			}
		]
	});
});