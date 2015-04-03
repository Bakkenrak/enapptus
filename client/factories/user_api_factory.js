app.factory('userApiFactory', function($http){

	return {
		save : function(data){
			return $http({
				method:'POST',
				url: 'api/member/save',
				data: data,
				headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
			});
		},
		update : function(data){
			return $http({
				method:'POST',
				url: 'api/member/save',
				data: data,
				headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
			});
		}, 
		index : function(){
			return $http({
				method:'GET',
				url: 'api/member'
			});
		},
		deleteElement : function(member){
			return $http({
				method:'DELETE',
				url: 'api/member/'+member.mId,
				headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
			});
		},
	}
});