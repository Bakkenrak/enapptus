var app = angular.module('enactusApplication', [
	'ngRoute',
	'toaster',
	'btford.modal'
	]);
app.controller('formCtrl', function($scope,formApiFactory, types, toaster){
	
	
	/**************************************************************

							Function Declarations


	***************************************************************/


	/**
	 * scope on click placeholder function for saving form.  
	 * @return {undefined} 
	 */
	$scope.sendForm = function(form_fields){
		formApiFactory.send({
			aId: aId,
			answers: form_fields
		}).success(function(res, status){
			if(status === 200){
				toaster.pop('success','Erfolg', 'Bewerbung gesendet.');
				console.log(res);
				aId = res;
				$scope.isBlocked=true;
			}else{
				toaster.pop('error','Fehler', 'Bewerbung nicht gesendet.');
			}
		});
		
	};

	/**************************************************************

							Scope Init


	***************************************************************/
	var aId = 0;
	$scope.form_fields = [];
	formApiFactory.index().success(function(result, status){
		if(status===200){
			$scope.form_fields = result;
		}
	});
	$scope.type_options = types.getTypes();
});