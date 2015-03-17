app.controller('navBarCtrl', function($scope, $rootScope, $location){
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
});