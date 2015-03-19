app.controller('userManagementCtrl', function($scope, myModal, toaster){
	
	/** @type {object} modal service for controlling the user modal */
	var modal = myModal.getNewModal('./client/features/usermanagement/modal.html', 'userModalCtrl');

	/**
	 * dummy list for testing
	 * @type {Array}
	 */
	$scope.users = [
		{
			id: 1,
			username: 'tester',
			email: 'test@test',
			is_admin: false,
			is_active: true
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