app.controller('userManagementCtrl', function($scope, myModal, toaster, myUser, userApiFactory, $rootScope, users){
	

	/**************************************************************

							Function Declarations


	***************************************************************/

	/**
	 * workaround for parsing member's admin status from string number to boolean when loading from backend.
	 * @param  {array} membersarray array containing member objects
	 * @return {array}            array containing member objects
	 */
	var convertNumberStringToBoolean = function(membersarray){
		angular.forEach(membersarray, function(elm){
			elm.admin = elm.admin === "1" ? true : false;
		});
		return membersarray;
	}


	/**
	 * helper function for finding and deleting user object from user list
	 * @param  {object} user user object 
	 * @return {undefined}      
	 */
	var removeFromList = function(user){
		for (var i = $scope.users.length - 1; i >= 0; i--) {
				if(user.mId === $scope.users[i].mId){
					userApiFactory.deleteElement(user).success(function(data, status){
						if(status === 200){
							$scope.users.splice(i, 1);
							toaster.pop('success', 'Löschen', 'Mitglied '+ user.name +' gelöscht.');
						}else{
							toast.error();
						}
					})
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
		delete user.backup; //avoid sending unnecessary amount of data
		userApiFactory.save(user).success(function(data, status){
						if(status === 200){
							user.editMode = false;
							user.mId = data.mId;
						}else{
							toast.error();
						}
					})
		$rootScope.$broadcast('user.changed', user);
		user.editMode = false;
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

	$scope.editUser = function(user){
		user.backup = angular.copy(user);
		user.editMode = true;
	};

	$scope.cancelEdit = function(user){
		angular.copy(user.backup, user);
	};


	/**
	 * scope function for adding a new field object. Deletes every unsaved new field object. 
	 * @return {undefined}
	 */
	$scope.newMember = function(){
		var new_member = {
			mId: 0,
			name: '',
			password: '',
			admin: false,
			editMode: true
		};
		if(typeof $scope.users !== 'undefined'){
			for(var i = 0, length = $scope.users.length; i<length; i++){
				if(Number($scope.users[i].mId)===0){
					$scope.users.splice(i,1);
					break;
				}
			}
			$scope.users.push(new_member);
		}else{
			$scope.users = [new_member];
		}
	}	


	/** listener for user.deleted event. 
	 * @event angular default event object
	 * @args user who was deleted (should be replaced by promise).
	 */
	$scope.$on('user.deleted', function(event, args){
		removeFromList(args);
	});


	/**************************************************************

							Scope Init


	***************************************************************/

	$scope.users = convertNumberStringToBoolean(users.data);

	/** @type {object} modal service for controlling the user modal */
	var modal = myModal.getNewModal('./client/features/usermanagement/modal.html', 'userModalCtrl');
});