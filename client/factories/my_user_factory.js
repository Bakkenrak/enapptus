app.factory('myUser', function($rootScope, $cookies){
	/**
	 * angular cookies is used for storing user object 
	 */
	return {
		/**
		 * setter for private current user object. Broadcasts 'user.login'
		 * which can be listened on in all child scopes ($scope.$on('user.login')).
		 * @param {object} user current user
		 */
		loginUser: function(user){
			$cookies.put('this_user', JSON.stringify(user));
			console.log(user);
			$rootScope.$broadcast('user.login');
		},
		/**
		 * getter for private current user object
		 * @return {Object} current user
		 */
		getUser: function(){
			return JSON.parse($cookies.get('this_user'));
		},

		/**
		 * function for getting admin state
		 * @return {Boolean} boolean indicating admin status
		 */
		isAdmin: function(){
			if(typeof $cookies.get('this_user') !== 'undefined'){
				return (!!JSON.parse($cookies.get('this_user')).admin);
			}else{
				return false;
			}
		},
		/**
		 * function for getting login state
		 * @return {Boolean} boolean indicating login status
		 */
		isLoggedIn: function(){
			return (typeof $cookies.get('this_user') !== 'undefined');
		},
		/**
		 * function for resetting user object to logged out. Broadcasts 'user.logout'
		 * which can be listened on in all child scopes ($scope.$on('user.logout')). 
		 * @return {undefined} 
		 */
		logoutUser : function(){
			$cookies.remove('this_user');
			$rootScope.$broadcast('user.logout');
		}
	};
})