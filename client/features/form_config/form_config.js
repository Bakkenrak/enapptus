app.controller('formConfigCtrl', function($scope, formApiFactory, $q, index, toaster){

	/**************************************************************

							Function Declarations


	***************************************************************/
	var toast = {
		success : function(){
			toaster.pop('success', 'Erfolg', 'Aktion ausgeführt!');
		},
		error: function(){
			toaster.pop('error', 'Fehler', 'Aktion fehlgeschlagen');
		}
	};

	/**
	 * Option Object Constructor
	 * @param {String} value value of option 		
	 * @param {String} type  type of option
	 * @param {Integer} fId  @optional - default 0 
	 */
	function Option(value, type, fId){
		this.value = typeof value !== undefined ? value : ''; 
		this.type = type ? type : 'option';
		this.fId = fId ? fId : 0;
		return this;
	}

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
	 * scope function for initialising a new options array when changing the option type
	 * @return {undefined} 
	 */
	$scope.changeType = function(){
		$scope.selected_field.placeholder = '';
		$scope.selected_field.option = [];
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
	 * scope function for saving a field object. new object if fID == 0 else existing object	 		
	 * @param  {object} field field object
	 * @return {undefined}       
	 */
	$scope.saveField = function(field){
		if(field.fId === 0){ // is new field
			var promises = [];
			field.rank = Number(field.rank);
			var user_selected_rank = field.rank;
			if(user_selected_rank === $scope.form_fields.length){
				formApiFactory.save(field).success(
					function(data, status){
						if(status === 200){
							$scope.form_fields.push(data);
							toast.success();
						}else{
							toast.error();
						}
				});
			}else{
				angular.forEach($scope.form_fields, function(elm){
					if(elm.rank>=user_selected_rank){
						elm.rank++;
						promises.push(formApiFactory.save(elm));
					}
				});
				$q.all(promises).then(function(result){
					formApiFactory.save(field).success(
					function(data, status){
						if(status===200){ 
							toast.success();
							reloadAll();
						}else{
							toast.error();
						}
					});
				}, function(err){
					toast.error();
				});
			}
		}else{	// is existing field
			formApiFactory.save(field).success(function(saved_field, status){
				if(status == 200){
					replaceFieldByID(saved_field);
					toast.success();
				}else{
					toast.error();
				}
				
			});
		}

	}
	/**
	 * helper function for replacing a form field identified by id
	 * @param  {object} field changed form field
	 * @return {undefined}
	 */
	var replaceFieldByID = function(field){
		var id = field.fId;
		for(var i = 0; i<$scope.form_fields.length; i++){
			if($scope.form_fields[i].fId == id){
				$scope.form_fields[i] = field; 
				return undefined;
			}
		}
	}
	
	/**
	 * scope function for adding a new option (e.g. dropdown option) to a form field object's options property
	 */
	$scope.addOption = function(){
		console.log(typeof $scope.selected_field.option);
		var opt = new Option($scope.selected_field.new_option, 'option');
		if(typeof $scope.selected_field.option === 'object'){
			$scope.selected_field.option.push(opt);
		}else{
			$scope.selected_field.option = [opt];
		}
		$scope.selected_field.new_option = '';
		console.log($scope.selected_field.option);
	}
	/**
	 * scope function for deleting a form field object. Following form field obejcts' ranks are decreased and saved. 
	 * Reloads View on success.
	 * @param  {object} field form field object
	 * @return {undefined}  
	 */
	$scope.deleteFormField = function(field){
		var promises = [];
		var del_rank = field.rank;
		var id = field.fId;
		formApiFactory.deleteElement(field).success(function(data, status){
			if(status === 200){
				angular.forEach($scope.form_fields, function(elm){
					if(elm.rank > del_rank){
						elm.rank--;
						promises.push(formApiFactory.save(elm));
					}
				});
				$q.all(promises).then(function(result){
					reloadAll();
					if(id == $scope.selected_field.fId){
						$scope.selected_field = {};
					}
					toast.success();
				}, function(err){
					toast.error();
				});
			}else{
				toast.error();
			}
		})
	};

	/**
	 * scope function for preparing a new field object 
	 * @return {undefined}
	 */
	$scope.newField = function(){
		$scope.selected_field = {
			fId: 0,
			title: 'neues Feld',
			rank: $scope.form_fields.length+1
		};
	}

	/**
	 * reloads all form fields. Loaded fields are stored in scope variable "form_fields"
	 * @return {undefined}
	 */
	var reloadAll = function(){
		formApiFactory.index().success(function(res, status){
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
		formApiFactory.save(field);
		for(var i =0; i<$scope.form_fields.length; i++){
			if(field.rank === $scope.form_fields[i].rank && field.fId !== $scope.form_fields[i].fId){
				$scope.form_fields[i].rank--;
				formApiFactory.save($scope.form_fields[i]);
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
		formApiFactory.save(field);
		if($scope.selected_field.fId === field.fId){
			$scope.selected_field.rank--;
		}
		for(var i =0; i<$scope.form_fields.length; i++){
			if(field.rank === $scope.form_fields[i].rank && field.fId !== $scope.form_fields[i].fId){
				$scope.form_fields[i].rank++;
				formApiFactory.save($scope.form_fields[i]);
				if($scope.selected_field.fId === $scope.form_fields[i].fId){
					$scope.selected_field.rank++;
				}
			}
		}
	};




	/**************************************************************

							Scope Init


	***************************************************************/


	$scope.type_options = {
		'Radiobutton' : {
			hasOptions : true, 
			hasPlaceholder : false,
			title: 'Radiobutton'
		},
		'Textzeile': {
			hasOptions: false,
			hasPlaceholder: true,
			title: 'Textzeile'
		},
		'Textfeld': {
			hasOptions: false,
			hasPlaceholder : true,
			title: 'Textfeld'
		},
		'Dropdown' : {
			hasOptions: true, 
			hasPlaceholder : false,
			title: 'Dropdown'
		}
	};

	$scope.selected_field = {};
	$scope.form_fields = convertStringToNumber(index.data); 

});
