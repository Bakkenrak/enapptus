app.factory('applicationApiFactory', function($http){
	return {
		save : function(data){
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
				url: 'api/application'
			});
		},
		delete : function(application){
			return $http({
				method:'DELETE',
				url: 'api/application/'+application.aId,
				headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
			});
		}
	}
});