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
				url: ' api/application'
			});
		},
		deleteElement : function(member){
			return $http({
				method:'DELETE',
				url: ''+member.mId,
				headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
			});
		}
	}
});