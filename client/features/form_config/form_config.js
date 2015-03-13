app.controller('testCtrl', function($scope, FormField){
	$scope.type_options = [ 'Textzeile'];
	$scope.selected_field = {};

	$scope.form_fields = [
		{
			fId: '1',
			title:'Vorname' ,
			placeholder: 'bitte Vorname eingeben',
			type: 'Textzeile',
			rank: 1
		},
		{
			fId: '2',
			title:'Alter' ,
			placeholder: 'bitte Alter angeben',
			type: 'Radiobutton',
			options : ['asda', 'asdasd'],
			rank: 0
		},
		{
			fId: '3',
			title:'Welche Hochschule' ,
			placeholder: ['WWU', 'FH'],
			type: 'Dropdown',
			options : ['sdfdsf', 'asdsdfasd'],
			rank: 2
		}
	];
	$scope.selectField = function(field){
		console.log(field);
		$scope.selected_field = angular.copy(field);
	}

	$scope.saveField = function(field){
		FormField.save(field).success(function(data){
			console.log(data);
		});
	}


	$scope.deleteFormField = function(form_id){

	};

	$scope.new_field = function(){
		$scope.selected_field = {};
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
