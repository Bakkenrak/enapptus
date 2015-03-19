app.factory('myUser', function(){
	/** @type {Object} storage for current user object */
	var this_user = {};
	
	return {
		/**
		 * setter for private current user object
		 * @param {object} user current user
		 */
		setUser: function(user){
			this_user = user;
		},
		/**
		 * getter for private current user object
		 * @return {Object} current user
		 */
		getUser: function(){
			return this_user;
		},

		/**
		 * function for getting admin state
		 * @return {Boolean} boolean indicating admin status
		 */
		isAdmin: function(){
			if(typeof this_user === 'object'){
				return this_user.is_admin;
			}else{
				return false;
			}
		}
	};
})