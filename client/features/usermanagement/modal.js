app.controller('userModalCtrl', function (myModal, $rootScope) {
	
	this.user = myModal.getContent('user');

	var modal = myModal.getCurrentModal();
	

	/**
	 * on click function for closing the modal 
	 * @type {function}
	 */
	this.close = modal.deactivate;

	/**
	 * on click function for deleting a user. closes the modal. triggers user.deleted event with user object attached. 
	 * @param  {object} user user object which should be deleted
	 * @return {undefined}      
	 */
	this.deleteUser = function(user){
		console.log('delete', user);
		$rootScope.$broadcast('user.deleted', user);
		this.close();
	};
	
});