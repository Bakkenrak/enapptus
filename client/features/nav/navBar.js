app.controller('navBarCtrl', function($scope, $rootScope, $location, myUser, userApiFactory){



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
	/** @type {Array} store for available navigation objects */
	$scope.navItems = [
			{
				name: 'Form Konfigurator',
				route: '#/formconfig',
				admin_only: false
			},
			{
				name: 'Aktuelle Form',
				route: '#/currentform',
				admin_only: false
			},
			{
				name: 'Usermanagement',
				route: '#/usermanagement',
				admin_only: true
			}
		];

	$rootScope.$on('$locationChangeSuccess', function(event){
        $scope.currentRoute = '#'+$location.path();
	});


	$scope.$on('user.changed', function(event, args){
		findInactiveUser();
	});
	$scope.$on('user.deleted', function(event, args){
		findInactiveUser();
	});

	$scope.isAdmin = myUser.isAdmin();
	findInactiveUser();

});