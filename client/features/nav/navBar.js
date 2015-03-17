app.controller('navBarCtrl', function($scope, $rootScope, $location){
	$scope.navItems = [
			{
				name: 'Form Konfigurator',
				route: '#/formconfig'
			},
			{
				name: 'Usermanagement',
				route: '#/usermanagement'
			}
		];

	$rootScope.$on('$locationChangeSuccess', function(event){
        $scope.currentRoute = '#'+$location.path();
	});
});