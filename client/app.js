
var app = angular.module('enactusApplication', [
	'ngRoute',
	'toaster'
	]);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/formconfig', {
			templateUrl: './client/features/form_config/form_config.html', 
			controller: 'formConfigCtrl', 
			resolve : {
				index : function(formApiFactory){
					return formApiFactory.index();
				}
			}
		})
		.when('/usermanagement', {
			templateUrl: './client/features/usermanagement/user.html',
			controller: 'userManagementCtrl'
		})
		.when('/currentform', {
			templateUrl: './client/features/curr_form/curr_form.html',
			controller: 'currFormCtrl'
		})
		.otherwise({
			redirectTo: '/formconfig'
		});
}])
.run(function(){
	
});
