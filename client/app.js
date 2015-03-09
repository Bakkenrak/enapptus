var dir = '/enactus/client';
var app = angular.module('enactusApplication', [
	'ngRoute']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/formconfig', {
			templateUrl: (dir+ '/features/form_config/form_config.html'), 
			controller: 'test'
		})
		.otherwise({
			redirectTo: '/formconfig'
		});
}])
.run(function(){
	
});
angular.bootstrap(document, ['enactusApplication']);