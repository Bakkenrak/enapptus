app.factory('apiFactory', function($http){
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
		}, 
		index : function(){
			return $http({
				method:'GET',
				url: './api/form',
				headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
			});
		},
		deleteElement : function(field){
			return $http({
				method:'DELETE',
				url: './api/form/'+field.fId,
				headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
			});
		},
	}
});