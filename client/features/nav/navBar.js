app.controller('navBarCtrl', function($scope, $rootScope, $location, myUser, userApiFactory, $route){
	
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


	/**************************************************************

							Scope Init


	***************************************************************/
	/** @type {Array} store for available navigation objects */
	$scope.navItems = [
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
		];

	$scope.isAdmin = myUser.isAdmin();
	findInactiveUser();

});