app.factory('userApiFactory', function($http){
	return {
		save : function(data){
			return $http({
				method:'POST',
				url: '',
				data: data,
				headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
			});
		},
		update : function(data){
			return $http({
				method:'POST',
				url: '',
				data: data,
				headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
			});
		}, 
		index : function(){
			return $http({
				method:'GET',
				url: '',
				headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
			});
		},
		deleteElement : function(field){
			return $http({
				method:'DELETE',
				url: '',
				headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
			});
		},
	}
});