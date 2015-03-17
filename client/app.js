
var app = angular.module('enactusApplication', [
	'ngRoute'
	]);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/formconfig', {
			templateUrl: ('./client/features/form_config/form_config.html'), 
			controller: 'formConfigCtrl', 
			resolve : {
				index : function(apiFactory){
					return apiFactory.index();
				}
			}
		})
		.when('/addUser', {
			templateUrl: '',
			controller: ''
		})
		.otherwise({
			redirectTo: '/formconfig'
		});
}])
.run(function(){
	
});
