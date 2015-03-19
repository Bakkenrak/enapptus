app.controller('formConfigCtrl', function($scope, formApiFactory, $q, index, toaster, types){

	/**************************************************************

							Function Declarations


	***************************************************************/

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
	$scope.changeType = function(field){
		field.placeholder = '';
		field.options = [];
	}
	/**
	 * scope function for selecting object for editing.
	 * @param  {object} field selected field
	 * @return {undefined}       
	 */
	$scope.selectField = function(field){
		angular.forEach($scope.form_fields, function(elm){
			elm.isSelected = false;
		});
		field.isSelected = true;
	}

	/**
	 * scope function for saving a field object. new object if fID == 0 else existing object	 		
	 * @param  {object} field field object
	 * @return {undefined}       
	 */
	$scope.saveField = function(field){
		if(field.fId === 0){ // is new field
			formApiFactory.save(field).success(function(new_field, status){
				if(status == 200){
					toast.success();
					replaceFieldByID(new_field,0);
				}else{
					toast.error();
				}
			});
		}else{	// is existing field
			formApiFactory.save(field).success(function(saved_field, status){
				console.log('saved',saved_field);
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
	 * @param {boolean} isNew indicator whether to look for new field (fId = 0)
	 * @return {undefined}
	 */
	var replaceFieldByID = function(field, isNew){

		var id = isNew ? 0 : field.fId;
		for(var i = 0; i<$scope.form_fields.length; i++){
			if($scope.form_fields[i].fId == id){
				$scope.form_fields[i] = field; 
				return undefined;
			}
		}
	};
	
	/**
	 * scope function for adding a new option (e.g. dropdown option) to a form field object's options property
	 */
	$scope.addOption = function(field){
		var opt = new Option(field.new_option, 'option');
		if(typeof field.options === 'object'){
			field.options.push(opt);
		}else{
			field.options = [opt];
		}
		field.new_option = '';
	}
	/**
	 * scope function for deleting a form field object. Following form field objects' ranks are decreased and saved. 
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
	 * scope function for adding a new field object. Deletes every unsaved new field object. 
	 * @return {undefined}
	 */
	$scope.newField = function(){
		var new_field = {
			fId: 0,
			type: 'Textzeile',
			placeholder: 'Platzhalter',
			options: [],
			title: 'neues Feld',
			rank: $scope.form_fields.length+1
		};
		if(typeof $scope.form_fields !== 'undefined'){
			for(var i = 0, length = $scope.form_fields.length; i<length; i++){
				if(Number($scope.form_fields[i].fId)===0){
					$scope.form_fields.splice(i,1);
					break;
				}
			}
			$scope.form_fields.push(new_field);
		}else{
			$scope.form_fields = [new_field];
		}
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
		formApiFactory.save(field);
		for(var i =0; i<$scope.form_fields.length; i++){
			if(field.rank === $scope.form_fields[i].rank && field.fId !== $scope.form_fields[i].fId){
				$scope.form_fields[i].rank--;
				formApiFactory.save($scope.form_fields[i]);
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
		for(var i =0; i<$scope.form_fields.length; i++){
			if(field.rank === $scope.form_fields[i].rank && field.fId !== $scope.form_fields[i].fId){
				$scope.form_fields[i].rank++;
				formApiFactory.save($scope.form_fields[i]);
			}
		}
	};




	/**************************************************************

							Scope Init


	***************************************************************/
	
	var toast = {
		success : function(){
			toaster.pop('success', 'Erfolg', 'Element gespeichert!');
		},
		error: function(){
			toaster.pop('error', 'Fehler', 'Speichern fehlgeschlagen');
		}
	};

	$scope.type_options = types.getTypes();

	$scope.form_fields = convertStringToNumber(index.data); 

});
