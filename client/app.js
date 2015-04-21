
var app = angular.module('enactusPortal', [
	'ngRoute',
	'ngCookies',
	'toaster',
	'btford.modal'
	]);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/formconfig', {
			templateUrl: './client/features/form_config/form_config.html', 
			controller: 'formConfigCtrl', 
			data: {
				admin_only: true
			},
			resolve : {
				index : function(formApiFactory){
					return formApiFactory.index();
				}
			}
		})
		.when('/usermanagement', {
			templateUrl: './client/features/usermanagement/user.html',
			controller: 'userManagementCtrl',
			data: {
				admin_only: true
			},
			resolve : {
				users : function(userApiFactory){
					return userApiFactory.index();
				}
			}
		})
		.when('/login', {
			templateUrl: './client/features/login/login.html',
			controller: 'loginCtrl',
			data: {
				admin_only: false
			}
		})
		.when('/voting', {
			templateUrl: './client/features/voting/voting.html',
			controller: 'votingCtrl',
			data: {
				admin_only: false
			}
		})
		.otherwise({
			redirectTo: '/voting'
		});
}])
.run(function(myUser, $location, $rootScope){
	if(!myUser.isLoggedIn()){
		$location.path('/login');
	}

	/**
	 * listener for interception route changes. checks for permission. if permission is not matched redirect to default route
	 * @param  {object} event         event
	 * @param  {object} route         next route object
	 * @return {undefined}	
	 */
	$rootScope.$on("$routeChangeStart",function(event, route){
		var next = route.$$route;
		if(next){
			if(next.data.admin_only ? myUser.isAdmin() : true){ //checks whether user is admin if admin rights are needed
				//access
			}else{
				//no access
				$location.path('/');
			}
		}	
	});		
});
