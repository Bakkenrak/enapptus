app.controller('userManagementCtrl', function($scope, myModal, toaster, myUser, userApiFactory, $rootScope){
	

	$scope.users = userApiFactory.index();

	/** @type {object} modal service for controlling the user modal */
	var modal = myModal.getNewModal('./client/features/usermanagement/modal.html', 'userModalCtrl');


	/** listener for user.deleted event. 
	 * @event angular default event object
	 * @args user who was deleted (should be replaced by promise).
	 */
	$scope.$on('user.deleted', function(event, args){
		removeFromList(args);
		toaster.pop('success', 'Löschen', 'Benutzer'+ args.username +'gelöscht.');
	});
	/**
	 * helper function for finding and deleting user object from user list
	 * @param  {object} user user object 
	 * @return {undefined}      
	 */
	var removeFromList = function(user){
		for (var i = $scope.users.length - 1; i >= 0; i--) {
				if(user.id === $scope.users[i].id){
					$scope.users.splice(i, 1);
				}
			};	
	};


	/**
	 * scope function for saving a user
	 * @param  {object} user user object which should be saved
	 * @return {undefined}	
	 */
	$scope.saveUser = function(user){
		console.log('save', user);
		$rootScope.$broadcast('user.changed', user);
	};

	/**
	 * scope function for activating the dialog modal
	 * @param  {object} user user object which should be deleted
	 * @return {undefined}      
	 */
	$scope.deleteUser = function(user){
			myModal.setContent({'user':user});
			modal.activate();	
		};	
});