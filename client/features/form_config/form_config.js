app.controller('testCtrl', function($scope, apiFactory, $q, index){
	$scope.type_options = [ 'Textzeile'];
	$scope.selected_field = {};
	angular.forEach(index.data, function(elm){
		elm.rank = Number(elm.rank);
	});
	$scope.form_fields = index.data; 
	$scope.selectField = function(field){
		$scope.new_field = undefined;
		$scope.selected_field = angular.copy(field);
	}

	$scope.saveExistingField = function(field){
		apiFactory.save(field).success(function(data){
			console.log(data);
		});
	}
	$scope.deleteFormField = function(field){
		apiFactory.deleteElement(field).success(function(data, status){
			if(status === 200){
				reloadAll();
			}else{
				console.log('error when deleting element');
			}
		})
	};

	$scope.newField = function(){
		$scope.selected_field = {};
		$scope.new_field = {
			rank: $scope.form_fields.length
		};
	}

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

	var reloadAll = function(){
		apiFactory.index().success(function(res, status){
			if(status === 200){
				console.log(res);
				angular.forEach(index.data, function(elm){
					elm.rank = Number(elm.rank);
				});
				$scope.form_fields = res;
			}else{
				console.log('err when reloading', res);
			}

		});
	}


	$scope.moveDown = function(field){
		field.rank++;
		if($scope.selected_field.id === field.id){
					$scope.selected_field.rank++;
		}
		for(var i =0; i<$scope.form_fields.length; i++){
			if(field.rank === $scope.form_fields[i].rank && field.id !== $scope.form_fields[i].id){
				$scope.form_fields[i].rank--;
				if($scope.selected_field.id === $scope.form_fields[i].id){
					$scope.selected_field.rank--;
				}
			}
		}
	};

	$scope.moveUp = function(field){
		field.rank--;
		if($scope.selected_field.id === field.id){
			$scope.selected_field.rank--;
		}
		for(var i =0; i<$scope.form_fields.length; i++){
			if(field.rank === $scope.form_fields[i].rank && field.id !== $scope.form_fields[i].id){
				$scope.form_fields[i].rank++;
				if($scope.selected_field.id === $scope.form_fields[i].id){
					$scope.selected_field.rank++;
				}
			}
		}
	};

});
