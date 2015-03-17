app.controller('testCtrl', function($scope, apiFactory, $q, index){

	/**************************************************************

							Function Declarations


	***************************************************************/



	/**
	 * workaround for parsing field object's rank from string to number when loading from backend. (needed for ng-repeat orderBy filter)
	 * @param  {array} fieldarray array containing form field objects
	 * @return {array}            array containing form field objects
	 */
	var convertStringToNumber = function(fieldarray){
		angular.forEach(fieldarray, function(elm){
			elm.rank = Number(elm.rank);
		});
		return fieldarray;
	}



	/**
	 * scope function for copying field object into selected_field object for editing
	 * @param  {object} field selected field
	 * @return {undefined}       
	 */
	$scope.selectField = function(field){
		$scope.new_field = undefined;
		$scope.selected_field = angular.copy(field);
	}
	/**
	 * scope function for saving a field object	 		
	 * @param  {object} field field object
	 * @return {undefined}       
	 */
	$scope.saveExistingField = function(field){
		apiFactory.save(field).success(function(data){
			console.log(data);
		});
	}
	/**
	 * scope function for deleting a form field object. Reloads View on success
	 * @param  {object} field form field object
	 * @return {undefined}  
	 */
	$scope.deleteFormField = function(field){
		apiFactory.deleteElement(field).success(function(data, status){
			if(status === 200){
				reloadAll();
			}else{
				console.log('error when deleting element');
			}
		})
	};
	/**
	 * scope function for preparing a new field object 
	 * @return {undefined}
	 */
	$scope.newField = function(){
		$scope.selected_field = {};
		$scope.new_field = {
			rank: $scope.form_fields.length
		};
	}
	/**
	 * scope function for saving a new form field. If the new form field is not added at the end of the form 
	 * but between already existing fields, then the following fields' rank is updated as well.  
	 * @param  {object} field new field object
	 * @return {undefined}
	 */
	$scope.saveNewField = function(field){
		var promises = [];
		field.fId = '0';
		field.rank = Number(field.rank);
		var user_selected_rank = field.rank;
		if(user_selected_rank === $scope.form_fields.length){
			apiFactory.save(field).success(
				function(data, status){
					if(status === 200){
						$scope.form_fields.push(data);
					}else{
						console.log(data);
					}
			});
		}else{
			angular.forEach($scope.form_fields, function(elm){
				if(elm.rank>=user_selected_rank){
					elm.rank++;
					promises.push(apiFactory.save(elm));
				}
			});
			$q.all(promises).then(function(result){
				apiFactory.save(field).success(
				function(data, status){
					if(status===200){ 
					console.log('200', 'reload');
					reloadAll();
					}else{
						console.log('err when save field', data);
					}
				});
			}, function(err){
				console.log('err when saving other fields', err);
			});
 
		}
	};

	/**
	 * reloads all form fields. Loaded fields are stored in scope variable "form_fields"
	 * @return {undefined}
	 */
	var reloadAll = function(){
		apiFactory.index().success(function(res, status){
			if(status === 200){
				$scope.form_fields = convertStringToNumber(res);
			}else{
				console.log('err when reloading', res);
			}

		});
	}

	/**
	 * scope function for increasing the rank of an existing form field. -> field moves down. 
	 * form field is saved after this as well as a possible affected field next to it. 
	 * @param  {object} field form field object
	 * @return {undefined} 
	 */
	$scope.moveDown = function(field){
		field.rank++;
		if($scope.selected_field.fId === field.fId){
					$scope.selected_field.rank++;
		}
		apiFactory.save(field);
		for(var i =0; i<$scope.form_fields.length; i++){
			if(field.rank === $scope.form_fields[i].rank && field.fId !== $scope.form_fields[i].fId){
				$scope.form_fields[i].rank--;
				apiFactory.save($scope.form_fields[i]);
				if($scope.selected_field.fId === $scope.form_fields[i].fId){
					$scope.selected_field.rank--;
				}
			}
		}
	};
	/**
	 * scope function for decreasing the rank of an existing form field object. -> field moves up.
	 * form field is saved after decreasing the rank as well as a possible affected neighbor. 
	 * @param  {object} field field form field object
	 * @return {undefined} 
	 */
	$scope.moveUp = function(field){
		field.rank--;
		apiFactory.save(field);
		if($scope.selected_field.fId === field.fId){
			$scope.selected_field.rank--;
		}
		for(var i =0; i<$scope.form_fields.length; i++){
			if(field.rank === $scope.form_fields[i].rank && field.fId !== $scope.form_fields[i].fId){
				$scope.form_fields[i].rank++;
				apiFactory.save($scope.form_fields[i]);
				if($scope.selected_field.fId === $scope.form_fields[i].fId){
					$scope.selected_field.rank++;
				}
			}
		}
	};




	/**************************************************************

							Scope Init


	***************************************************************/


	$scope.type_options = [ 'Textzeile', 'Textfeld'];
	$scope.selected_field = {};
	$scope.form_fields = convertStringToNumber(index.data); 

});
