app.controller('currFormCtrl', function($scope, formApiFactory, types, form_fields){

	
	/**************************************************************

							Function Declarations


	***************************************************************/


	/**
	 * scope on click placeholder function for saving form.  
	 * @return {undefined} 
	 */
	$scope.sendForm = function(){
		console.log('send form', form_fields);
	};

	/**************************************************************

							Scope Init


	***************************************************************/


	$scope.form_fields = form_fields.data;
	$scope.type_options = types.getTypes();

});