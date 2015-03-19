
var app = angular.module('enactusApplication', [
	'ngRoute',
	'toaster',
	'btford.modal'
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
			controller: 'userManagementCtrl',
			resolve : {
				users : function(userApiFactory){
					return userApiFactory.index();
				}
			}
		})
		.when('/currentform', {
			templateUrl: './client/features/curr_form/curr_form.html',
			controller: 'currFormCtrl',
			resolve : {
				form_fields : function(formApiFactory){
					return formApiFactory.index();
				}
			}
		})
		.otherwise({
			redirectTo: '/formconfig'
		});
}])
.run(function(myUser){
	myUser.setUser({
		id: 1,
		username: 'lucas',
		email:'test@test',
		is_active: true,
		is_admin: true
	});		
});
