app.controller('navBarCtrl', function($scope, $rootScope, $location, myUser,userApiFactory){




	var findInactiveUser = function(userlist){
		var count = 0;
		for (var i = userlist.length - 1; i >= 0; i--) {
				if(!userlist[i].is_active){
					count++;
				}
			};	
		return count;
	};
	$scope.navItems = [
			{
				name: 'Form Konfigurator',
				route: '#/formconfig'
			},
			{
				name: 'Aktuelle Form',
				route: '#/currentform'
			},
			{
				name: 'Usermanagement',
				route: '#/usermanagement'
			}
		];

	$rootScope.$on('$locationChangeSuccess', function(event){
        $scope.currentRoute = '#'+$location.path();
	});

	if(myUser.isAdmin()){
		$scope.numberInactive = findInactiveUser(userApiFactory.index());
		console.log($scope.numberInactive);
	};
});