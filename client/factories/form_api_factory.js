app.factory('formApiFactory', function($http){


	return {

		/**
		 * function for saving a form field
		 * @param  {object} data form field object
		 * @return {object}      $http object with success and error for async calls
		 */
		save : function(data){
			return $http({
				method:'POST',
				url: './api/form/save',
				data: data,
				headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
			});
		},
		
		/**
		 * function for updating a form field
		 * @param  {object} data form field object which should be updated
		 * @return {object}      $http object with success and error for async calls
		 */
		update : function(data){
			return $http({
				method:'POST',
				url: './api/form/save',
				data: data,
				headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
			});
		}, 
		/**
		 * function for querying all form fields
		 * @return {object} $http object with success and error for async calls
		 */
		index : function(){
			return $http({
				method:'GET',
				url: './api/form',
				headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
			});
		},
		/**
		 * function for sending a complete application
		 * @param  {object} form complete application form
		 * @return {object}      $http object with success and error for async calls
		 */
		send: function(form){
			return $http({
				method:'POST',
				url: './api/application/save',
				data: form,
				headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
			});
		},

		/**
		 * function for deleting a form field
		 * @param  {object} field form field which should be deleletd
		 * @return {object}       $http object with success and error for async calls
		 */
		deleteElement : function(field){
			return $http({
				method:'DELETE',
				url: './api/form/'+field.fId,
				headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
			});
		},
	}
});