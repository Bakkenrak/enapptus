app.factory('myUser', function(){
	var this_user = {}
	return {
		setUser: function(user){
			this_user = user;
		},
		getUser: function(){
			return this_user;
		}, 
		isAdmin: function(){
			if(typeof this_user === 'object'){
				return this_user.is_admin;
			}else{
				return false;
			}
		}
	};
})