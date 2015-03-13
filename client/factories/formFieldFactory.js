app.factory('FormField', function($http){
	return {
		save : function(data){
			return $http({
				method:'POST',
				url: './api/form/save',
				data: data,
				headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
			});
		},
		update : function(data){
			return $http({
				method:'POST',
				url: './api/form/save',
				data: data,
				headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
			});
		}
	}
});