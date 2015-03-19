app.factory('userApiFactory', function($http){


	/**
	 * dummy list for testing
	 * @type {Array}
	 */
	var users = [
		{
			id: 1,
			username: 'tester',
			email: 'test@test',
			is_admin: false,
			is_active: false
		},
		{
			id: 2,
			username: 'tester2',
			email: 'test@test',
			is_admin: true,
			is_active: true
		},
		{
			id: 3,
			username: 'tester3',
			email: 'test@test',
			is_admin: true,
			is_active: true
		}

	];





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
			return users;
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