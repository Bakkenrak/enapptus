app.controller('testCtrl', function($scope, $http){
	
	$scope.selected_Field = {};
	$scope.form_fields = [
		{
			id: 'first name',
			title:'Vorname' ,
			placeholder: 'bitte Vorname eingeben',
			type: 'Textzeile',
			rank: 1
		},
		{
			id: 'age',
			title:'Alter' ,
			placeholder: 'bitte Alter angeben',
			type: 'Radiobutton',
			options : ['asda', 'asdasd'],
			rank: 0
		},
		{
			id: 'college',
			title:'Welche Hochschule' ,
			placeholder: ['WWU', 'FH'],
			type: 'Dropdown',
			options : ['sdfdsf', 'asdsdfasd'],
			rank: 2
		}
	];
	$scope.selectField = function(index){
		console.log(typeof index);
		$scope.selected_field = $scope.form_fields[index];
		console.log($scope.selected_field);
	}
	$scope.deleteFormField = function(form_id){

	};

	$scope.moveDown = function(field){
		field.rank++;
		for(var i =0; i<$scope.form_fields.length; i++){
			if(field.rank === $scope.form_fields[i].rank && field.id !== $scope.form_fields[i].id){
				$scope.form_fields[i].rank--;
			}
		}
	};

	$scope.moveUp = function(field){
		field.rank--;
		for(var i =0; i<$scope.form_fields.length; i++){
			if(field.rank === $scope.form_fields[i].rank && field.id !== $scope.form_fields[i].id){
				$scope.form_fields[i].rank++;
			}
		}
	};

});
